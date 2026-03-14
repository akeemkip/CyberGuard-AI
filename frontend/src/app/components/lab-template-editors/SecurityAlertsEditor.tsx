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
  ShieldAlert,
  Copy,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { SecurityAlertsConfig } from "../../services/admin.service";

interface SecurityAlertsEditorProps {
  config: SecurityAlertsConfig | null;
  onChange: (config: SecurityAlertsConfig) => void;
}

interface AlertItem {
  id: string;
  alertType: 'virus_warning' | 'system_update' | 'browser_notification' | 'tech_support' | 'prize_winner' | 'login_warning' | 'subscription_expired';
  title: string;
  message: string;
  source: string;
  buttonText?: string;
  isLegitimate: boolean;
  explanation: string;
  redFlags?: string[];
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const alertTypes = [
  { value: "virus_warning", label: "Virus Warning" },
  { value: "system_update", label: "System Update" },
  { value: "browser_notification", label: "Browser Notification" },
  { value: "tech_support", label: "Tech Support" },
  { value: "prize_winner", label: "Prize Winner" },
  { value: "login_warning", label: "Login Warning" },
  { value: "subscription_expired", label: "Subscription Expired" },
];

const sampleScenario: SecurityAlertsConfig = {
  scenario: "Security Alert Identification",
  instructions: "Review each security alert carefully and determine if it's legitimate or fake. Look for red flags like poor grammar, suspicious sources, or unusual requests.",
  alerts: [
    {
      id: generateId(),
      alertType: "virus_warning",
      title: "CRITICAL VIRUS ALERT!",
      message: "Your computer has been infected with 5 viruses! Click here immediately to download our FREE antivirus software to remove these threats before they steal your personal data!",
      source: "securityalert-2024.com",
      buttonText: "Download Now!",
      isLegitimate: false,
      explanation: "This is a fake alert. Legitimate antivirus warnings come from your installed security software, not random websites. The excessive exclamation marks, urgency tactics, and suspicious domain are clear red flags.",
      redFlags: [
        "Excessive punctuation and ALL CAPS",
        "Suspicious domain name not from a known security vendor",
        "Creates urgency to download software immediately",
        "Appears as a web popup, not from installed software",
      ],
    },
    {
      id: generateId(),
      alertType: "system_update",
      title: "Windows Security Update Available",
      message: "A security update is available for your system. This update includes important security improvements and bug fixes. You can install it now or schedule it for later.",
      source: "Windows Update (microsoft.com)",
      buttonText: "Install Update",
      isLegitimate: true,
      explanation: "This is a legitimate Windows update notification. It comes from the official Windows Update service, uses professional language without urgency tactics, and gives you options rather than forcing immediate action.",
      redFlags: [],
    },
    {
      id: generateId(),
      alertType: "tech_support",
      title: "Tech Support Notice",
      message: "We have detected suspicious activity on your Microsoft account. Please call our toll-free number 1-800-FAKE-NUM immediately to speak with a technician. DO NOT turn off your computer!",
      source: "System Security Alert",
      buttonText: "Call Now",
      isLegitimate: false,
      explanation: "This is a fake tech support scam. Microsoft and other legitimate companies never ask you to call a phone number from a popup. The urgent language and threats about not turning off your computer are classic scam tactics.",
      redFlags: [
        "Requests a phone call from a popup message",
        "Creates panic with urgent warnings",
        "Threatens consequences if you don't comply immediately",
        "Vague source that doesn't specify legitimate company contact",
      ],
    },
  ],
};

const defaultAlert: AlertItem = {
  id: generateId(),
  alertType: "virus_warning",
  title: "",
  message: "",
  source: "",
  buttonText: "",
  isLegitimate: false,
  explanation: "",
  redFlags: [],
};

export function SecurityAlertsEditor({ config, onChange }: SecurityAlertsEditorProps) {
  const [scenario, setScenario] = useState(config?.scenario || "");
  const [instructions, setInstructions] = useState(
    config?.instructions || "Review each security alert and determine if it's legitimate or fake."
  );
  const [alerts, setAlerts] = useState<AlertItem[]>(
    config?.alerts?.map(a => ({
      ...a,
      id: a.id || generateId(),
      redFlags: a.redFlags || []
    })) || []
  );

  const updateConfig = (updates: Partial<SecurityAlertsConfig> = {}) => {
    onChange({
      scenario: updates.scenario ?? scenario,
      instructions: updates.instructions ?? instructions,
      alerts: updates.alerts ?? alerts,
    });
  };

  const handleAddAlert = () => {
    const newAlert = { ...defaultAlert, id: generateId(), redFlags: [] };
    const newAlerts = [...alerts, newAlert];
    setAlerts(newAlerts);
    updateConfig({ alerts: newAlerts });
  };

  const handleLoadSample = () => {
    setScenario(sampleScenario.scenario);
    setInstructions(sampleScenario.instructions);
    const newAlerts = sampleScenario.alerts.map(a => ({ ...a, id: generateId() }));
    setAlerts(newAlerts);
    onChange(sampleScenario);
  };

  const handleRemoveAlert = (id: string) => {
    const newAlerts = alerts.filter(a => a.id !== id);
    setAlerts(newAlerts);
    updateConfig({ alerts: newAlerts });
  };

  const handleDuplicateAlert = (alert: AlertItem) => {
    const newAlert = {
      ...alert,
      id: generateId(),
      redFlags: [...(alert.redFlags || [])],
    };
    const newAlerts = [...alerts, newAlert];
    setAlerts(newAlerts);
    updateConfig({ alerts: newAlerts });
  };

  const handleAlertChange = (id: string, field: keyof AlertItem, value: any) => {
    const newAlerts = alerts.map(a => {
      if (a.id === id) {
        return { ...a, [field]: value };
      }
      return a;
    });
    setAlerts(newAlerts);
    updateConfig({ alerts: newAlerts });
  };

  const handleAddRedFlag = (alertId: string) => {
    const newAlerts = alerts.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          redFlags: [...(a.redFlags || []), ""],
        };
      }
      return a;
    });
    setAlerts(newAlerts);
    updateConfig({ alerts: newAlerts });
  };

  const handleRemoveRedFlag = (alertId: string, index: number) => {
    const newAlerts = alerts.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          redFlags: (a.redFlags || []).filter((_, i) => i !== index),
        };
      }
      return a;
    });
    setAlerts(newAlerts);
    updateConfig({ alerts: newAlerts });
  };

  const handleRedFlagChange = (alertId: string, index: number, value: string) => {
    const newAlerts = alerts.map(a => {
      if (a.id === alertId) {
        const newRedFlags = [...(a.redFlags || [])];
        newRedFlags[index] = value;
        return {
          ...a,
          redFlags: newRedFlags,
        };
      }
      return a;
    });
    setAlerts(newAlerts);
    updateConfig({ alerts: newAlerts });
  };

  return (
    <div className="space-y-6">
      {/* Scenario Setup */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Scenario Setup</h2>
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            <ShieldAlert className="w-4 h-4 mr-2" />
            Load Sample Scenario
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scenario">Scenario Title</Label>
          <Input
            id="scenario"
            value={scenario}
            onChange={(e) => {
              setScenario(e.target.value);
              updateConfig({ scenario: e.target.value });
            }}
            placeholder="e.g., Security Alert Identification"
          />
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

      {/* Alerts List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Security Alerts</h2>
            <p className="text-sm text-muted-foreground">
              {alerts.length} alert(s) configured. Include both legitimate and fake alerts.
            </p>
          </div>
          <Button onClick={handleAddAlert}>
            <Plus className="w-4 h-4 mr-2" />
            Add Alert
          </Button>
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No alerts configured. Click "Add Alert" to create your first security alert.
          </div>
        )}

        <Accordion type="multiple" className="space-y-4">
          {alerts.map((alert, index) => (
            <AccordionItem key={alert.id} value={alert.id} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-muted-foreground">#{index + 1}</span>
                    <Badge variant={alert.isLegitimate ? "default" : "destructive"} className={alert.isLegitimate ? "bg-green-600" : ""}>
                      {alert.isLegitimate ? "Legitimate" : "Fake"}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {alert.title || "Untitled Alert"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {alert.alertType ? alertTypes.find(t => t.value === alert.alertType)?.label : "No type"}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {/* Alert Type and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Alert Type</Label>
                    <Select
                      value={alert.alertType}
                      onValueChange={(value: any) => handleAlertChange(alert.id, "alertType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {alertTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Is This Alert Legitimate?</Label>
                    <div className="flex items-center gap-3 h-10">
                      <Switch
                        checked={alert.isLegitimate}
                        onCheckedChange={(checked) => handleAlertChange(alert.id, "isLegitimate", checked)}
                      />
                      <span className="text-sm">
                        {alert.isLegitimate ? "Legitimate" : "Fake"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Alert Content */}
                <div className="space-y-2">
                  <Label>Alert Title</Label>
                  <Input
                    value={alert.title}
                    onChange={(e) => handleAlertChange(alert.id, "title", e.target.value)}
                    placeholder="e.g., CRITICAL VIRUS ALERT!"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Alert Message</Label>
                  <Textarea
                    value={alert.message}
                    onChange={(e) => handleAlertChange(alert.id, "message", e.target.value)}
                    placeholder="The message displayed in the security alert..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Source</Label>
                    <Input
                      value={alert.source}
                      onChange={(e) => handleAlertChange(alert.id, "source", e.target.value)}
                      placeholder="e.g., securityalert-2024.com or Windows Update"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Button Text (Optional)</Label>
                    <Input
                      value={alert.buttonText || ""}
                      onChange={(e) => handleAlertChange(alert.id, "buttonText", e.target.value)}
                      placeholder="e.g., Download Now! or Install Update"
                    />
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-2">
                  <Label>Explanation (Shown After Answer)</Label>
                  <Textarea
                    value={alert.explanation}
                    onChange={(e) => handleAlertChange(alert.id, "explanation", e.target.value)}
                    placeholder="Explain why this alert is legitimate or fake..."
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
                      onClick={() => handleAddRedFlag(alert.id)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Red Flag
                    </Button>
                  </div>
                  {alert.redFlags && alert.redFlags.length > 0 ? (
                    <div className="space-y-2">
                      {alert.redFlags.map((flag, flagIndex) => (
                        <div key={flagIndex} className="flex gap-2">
                          <Input
                            value={flag}
                            onChange={(e) => handleRedFlagChange(alert.id, flagIndex, e.target.value)}
                            placeholder="Describe a red flag..."
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveRedFlag(alert.id, flagIndex)}
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
                    onClick={() => handleDuplicateAlert(alert)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveAlert(alert.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Alert
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
