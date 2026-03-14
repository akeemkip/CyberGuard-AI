import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Plus,
  Trash2,
  Wifi,
  Copy,
  AlertTriangle,
  Lock,
  Unlock,
} from "lucide-react";
import { WifiSafetyConfig } from "../../services/admin.service";

interface WifiSafetyEditorProps {
  config: WifiSafetyConfig | null;
  onChange: (config: WifiSafetyConfig) => void;
}

interface NetworkItem {
  id: string;
  ssid: string;
  signalStrength: 'weak' | 'medium' | 'strong';
  securityType: 'open' | 'WEP' | 'WPA' | 'WPA2' | 'WPA3';
  isHidden: boolean;
  requiresPassword: boolean;
  isSafe: boolean;
  explanation: string;
  redFlags?: string[];
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const signalStrengths = [
  { value: "weak", label: "Weak" },
  { value: "medium", label: "Medium" },
  { value: "strong", label: "Strong" },
];

const securityTypes = [
  { value: "open", label: "Open (No Security)" },
  { value: "WEP", label: "WEP (Weak)" },
  { value: "WPA", label: "WPA" },
  { value: "WPA2", label: "WPA2 (Secure)" },
  { value: "WPA3", label: "WPA3 (Most Secure)" },
];

const sampleScenario: WifiSafetyConfig = {
  scenario: "WiFi Network Safety Assessment",
  instructions: "You're in a public location and need to connect to WiFi. Evaluate each network and determine if it's safe to connect.",
  location: "Coffee Shop",
  networks: [
    {
      id: generateId(),
      ssid: "Free_Public_WiFi",
      signalStrength: "strong",
      securityType: "open",
      isHidden: false,
      requiresPassword: false,
      isSafe: false,
      explanation: "This is an unsafe network. Open WiFi networks with generic names like 'Free Public WiFi' are often used by attackers to intercept your data. Without encryption, anyone can see your traffic.",
      redFlags: [
        "No password required (open network)",
        "Generic name that could be a fake hotspot",
        "No way to verify legitimacy",
        "All data transmitted is unencrypted",
      ],
    },
    {
      id: generateId(),
      ssid: "CoffeeShop_Guest",
      signalStrength: "strong",
      securityType: "WPA2",
      isHidden: false,
      requiresPassword: true,
      isSafe: true,
      explanation: "This is a relatively safe network. It's the official coffee shop WiFi with WPA2 encryption and requires a password. Always verify with staff that this is the legitimate network name and get the password from them directly.",
      redFlags: [],
    },
    {
      id: generateId(),
      ssid: "xfinitywifi",
      signalStrength: "medium",
      securityType: "open",
      isHidden: false,
      requiresPassword: false,
      isSafe: false,
      explanation: "This network appears to be an open hotspot. While the name looks legitimate, open networks are inherently risky. Attackers often create fake networks with common names like this. If you must use it, avoid accessing sensitive information and use a VPN.",
      redFlags: [
        "Open network with no encryption",
        "Could be a fake network mimicking a legitimate provider",
        "Cannot verify authenticity",
      ],
    },
  ],
};

const defaultNetwork: NetworkItem = {
  id: generateId(),
  ssid: "",
  signalStrength: "medium",
  securityType: "WPA2",
  isHidden: false,
  requiresPassword: true,
  isSafe: true,
  explanation: "",
  redFlags: [],
};

export function WifiSafetyEditor({ config, onChange }: WifiSafetyEditorProps) {
  const [scenario, setScenario] = useState(config?.scenario || "");
  const [instructions, setInstructions] = useState(
    config?.instructions || "Evaluate each WiFi network and determine if it's safe to connect."
  );
  const [location, setLocation] = useState(config?.location || "");
  const [networks, setNetworks] = useState<NetworkItem[]>(
    config?.networks?.map(n => ({
      ...n,
      id: n.id || generateId(),
      redFlags: n.redFlags || []
    })) || []
  );

  const updateConfig = (updates: Partial<WifiSafetyConfig> = {}) => {
    onChange({
      scenario: updates.scenario ?? scenario,
      instructions: updates.instructions ?? instructions,
      location: updates.location ?? location,
      networks: updates.networks ?? networks,
    });
  };

  const handleAddNetwork = () => {
    const newNetwork = { ...defaultNetwork, id: generateId(), redFlags: [] };
    const newNetworks = [...networks, newNetwork];
    setNetworks(newNetworks);
    updateConfig({ networks: newNetworks });
  };

  const handleLoadSample = () => {
    setScenario(sampleScenario.scenario);
    setInstructions(sampleScenario.instructions);
    setLocation(sampleScenario.location);
    const newNetworks = sampleScenario.networks.map(n => ({ ...n, id: generateId() }));
    setNetworks(newNetworks);
    onChange(sampleScenario);
  };

  const handleRemoveNetwork = (id: string) => {
    const newNetworks = networks.filter(n => n.id !== id);
    setNetworks(newNetworks);
    updateConfig({ networks: newNetworks });
  };

  const handleDuplicateNetwork = (network: NetworkItem) => {
    const newNetwork = {
      ...network,
      id: generateId(),
      redFlags: [...(network.redFlags || [])],
    };
    const newNetworks = [...networks, newNetwork];
    setNetworks(newNetworks);
    updateConfig({ networks: newNetworks });
  };

  const handleNetworkChange = (id: string, field: keyof NetworkItem, value: any) => {
    const newNetworks = networks.map(n => {
      if (n.id === id) {
        // Auto-update requiresPassword based on security type
        if (field === 'securityType') {
          return {
            ...n,
            [field]: value,
            requiresPassword: value !== 'open',
          };
        }
        return { ...n, [field]: value };
      }
      return n;
    });
    setNetworks(newNetworks);
    updateConfig({ networks: newNetworks });
  };

  const handleAddRedFlag = (networkId: string) => {
    const newNetworks = networks.map(n => {
      if (n.id === networkId) {
        return {
          ...n,
          redFlags: [...(n.redFlags || []), ""],
        };
      }
      return n;
    });
    setNetworks(newNetworks);
    updateConfig({ networks: newNetworks });
  };

  const handleRemoveRedFlag = (networkId: string, index: number) => {
    const newNetworks = networks.map(n => {
      if (n.id === networkId) {
        return {
          ...n,
          redFlags: (n.redFlags || []).filter((_, i) => i !== index),
        };
      }
      return n;
    });
    setNetworks(newNetworks);
    updateConfig({ networks: newNetworks });
  };

  const handleRedFlagChange = (networkId: string, index: number, value: string) => {
    const newNetworks = networks.map(n => {
      if (n.id === networkId) {
        const newRedFlags = [...(n.redFlags || [])];
        newRedFlags[index] = value;
        return {
          ...n,
          redFlags: newRedFlags,
        };
      }
      return n;
    });
    setNetworks(newNetworks);
    updateConfig({ networks: newNetworks });
  };

  return (
    <div className="space-y-6">
      {/* Scenario Setup */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Scenario Setup</h2>
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            <Wifi className="w-4 h-4 mr-2" />
            Load Sample Scenario
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scenario">Scenario Title</Label>
            <Input
              id="scenario"
              value={scenario}
              onChange={(e) => {
                setScenario(e.target.value);
                updateConfig({ scenario: e.target.value });
              }}
              placeholder="e.g., WiFi Network Safety Assessment"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                updateConfig({ location: e.target.value });
              }}
              placeholder="e.g., Coffee Shop, Airport, Hotel"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Instructions for Students</Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => {
              setInstructions(e.target.value);
              updateConfig({ instructions: e.target.value });
            }}
            placeholder="Provide instructions on what students should do..."
            rows={3}
          />
        </div>
      </Card>

      {/* Networks List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">WiFi Networks</h2>
            <p className="text-sm text-muted-foreground">
              {networks.length} network(s) configured. Include both safe and unsafe networks.
            </p>
          </div>
          <Button onClick={handleAddNetwork}>
            <Plus className="w-4 h-4 mr-2" />
            Add Network
          </Button>
        </div>

        {networks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No networks configured. Click "Add Network" to create your first WiFi network.
          </div>
        )}

        <Accordion type="multiple" className="space-y-4">
          {networks.map((network, index) => (
            <AccordionItem key={network.id} value={network.id} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-muted-foreground">#{index + 1}</span>
                    <Badge variant={network.isSafe ? "default" : "destructive"} className={network.isSafe ? "bg-green-600" : ""}>
                      {network.isSafe ? "Safe" : "Unsafe"}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4" />
                      <p className="font-medium truncate">
                        {network.ssid || "Untitled Network"}
                      </p>
                      {network.securityType === "open" ? (
                        <Unlock className="w-4 h-4 text-red-600" />
                      ) : (
                        <Lock className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {network.securityType} • {network.signalStrength}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {/* Network Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Network Name (SSID)</Label>
                    <Input
                      value={network.ssid}
                      onChange={(e) => handleNetworkChange(network.id, "ssid", e.target.value)}
                      placeholder="e.g., CoffeeShop_Guest"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Signal Strength</Label>
                    <Select
                      value={network.signalStrength}
                      onValueChange={(value: any) => handleNetworkChange(network.id, "signalStrength", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {signalStrengths.map((strength) => (
                          <SelectItem key={strength.value} value={strength.value}>
                            {strength.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Security Type</Label>
                    <Select
                      value={network.securityType}
                      onValueChange={(value: any) => handleNetworkChange(network.id, "securityType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {securityTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Password Required</Label>
                    <div className="flex items-center gap-3 h-10">
                      <Switch
                        checked={network.requiresPassword}
                        onCheckedChange={(checked) => handleNetworkChange(network.id, "requiresPassword", checked)}
                        disabled={network.securityType === "open"}
                      />
                      <span className="text-sm">
                        {network.requiresPassword ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Network Properties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hidden Network</Label>
                    <div className="flex items-center gap-3 h-10">
                      <Switch
                        checked={network.isHidden}
                        onCheckedChange={(checked) => handleNetworkChange(network.id, "isHidden", checked)}
                      />
                      <span className="text-sm">
                        {network.isHidden ? "Yes (SSID not broadcast)" : "No (Visible)"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Is This Network Safe?</Label>
                    <div className="flex items-center gap-3 h-10">
                      <Switch
                        checked={network.isSafe}
                        onCheckedChange={(checked) => handleNetworkChange(network.id, "isSafe", checked)}
                      />
                      <span className="text-sm">
                        {network.isSafe ? "Safe to connect" : "Unsafe"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-2">
                  <Label>Explanation (Shown After Answer)</Label>
                  <Textarea
                    value={network.explanation}
                    onChange={(e) => handleNetworkChange(network.id, "explanation", e.target.value)}
                    placeholder="Explain why this network is safe or unsafe..."
                    rows={2}
                  />
                </div>

                {/* Red Flags */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Red Flags (Optional)</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddRedFlag(network.id)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Red Flag
                    </Button>
                  </div>
                  {network.redFlags && network.redFlags.length > 0 ? (
                    <div className="space-y-2">
                      {network.redFlags.map((flag, flagIndex) => (
                        <div key={flagIndex} className="flex gap-2">
                          <Input
                            value={flag}
                            onChange={(e) => handleRedFlagChange(network.id, flagIndex, e.target.value)}
                            placeholder="Describe a red flag..."
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveRedFlag(network.id, flagIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No red flags added</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicateNetwork(network)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveNetwork(network.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Network
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}
