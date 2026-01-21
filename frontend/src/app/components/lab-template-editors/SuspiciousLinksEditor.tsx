import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Plus,
  Trash2,
  Link,
  AlertTriangle,
  ShieldCheck,
  Copy,
  GripVertical,
  ExternalLink,
} from "lucide-react";
import { SuspiciousLinksConfig } from "../../services/admin.service";

interface SuspiciousLinksEditorProps {
  config: SuspiciousLinksConfig | null;
  onChange: (config: SuspiciousLinksConfig) => void;
}

interface LinkItem {
  id: string;
  displayText: string;
  actualUrl: string;
  isMalicious: boolean;
  explanation: string;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultLink: LinkItem = {
  id: generateId(),
  displayText: "",
  actualUrl: "",
  isMalicious: false,
  explanation: "",
};

const sampleMaliciousLink: LinkItem = {
  id: generateId(),
  displayText: "Click here to verify your account",
  actualUrl: "http://amaz0n-security.com/verify?user=12345",
  isMalicious: true,
  explanation: "The URL uses 'amaz0n' (with a zero) instead of 'amazon' - a common typosquatting technique. It also uses HTTP instead of HTTPS and has a suspicious domain.",
};

const sampleSafeLink: LinkItem = {
  id: generateId(),
  displayText: "View your order status",
  actualUrl: "https://www.amazon.com/orders/123-456-789",
  isMalicious: false,
  explanation: "This is a legitimate Amazon URL with proper HTTPS and the correct domain.",
};

const samplePhishingLinks: LinkItem[] = [
  {
    id: generateId(),
    displayText: "Reset your password now",
    actualUrl: "http://paypa1.com/reset-password",
    isMalicious: true,
    explanation: "Uses 'paypa1' with the number 1 instead of 'paypal'. This is typosquatting.",
  },
  {
    id: generateId(),
    displayText: "Your package is ready for delivery",
    actualUrl: "https://fedex-delivery-notice.xyz/track",
    isMalicious: true,
    explanation: "Uses a suspicious .xyz domain and 'fedex-delivery-notice' subdomain pattern instead of the official fedex.com domain.",
  },
  {
    id: generateId(),
    displayText: "Download the latest security update",
    actualUrl: "http://microsoft-update.ru/download.exe",
    isMalicious: true,
    explanation: "Uses a Russian domain (.ru) pretending to be Microsoft, and directly links to an executable file.",
  },
];

const sampleSafeLinks: LinkItem[] = [
  {
    id: generateId(),
    displayText: "Check your email",
    actualUrl: "https://mail.google.com/mail/u/0/#inbox",
    isMalicious: false,
    explanation: "Legitimate Google Mail URL with proper subdomain and HTTPS.",
  },
  {
    id: generateId(),
    displayText: "View company policy",
    actualUrl: "https://intranet.company.com/policies/security",
    isMalicious: false,
    explanation: "Internal company URL following standard corporate naming conventions.",
  },
];

export function SuspiciousLinksEditor({ config, onChange }: SuspiciousLinksEditorProps) {
  const [links, setLinks] = useState<LinkItem[]>(
    config?.links?.map((l, i) => ({ ...l, id: generateId() })) || []
  );
  const [scenario, setScenario] = useState(
    config?.scenario || "You received an email with several links. Before clicking any of them, analyze each URL to determine if it's safe or potentially malicious."
  );
  const [instructions, setInstructions] = useState(
    config?.instructions || "Hover over each link to see the actual URL. Analyze the URL carefully and determine whether it's safe or suspicious. Look for typosquatting, unusual domains, HTTP vs HTTPS, and other red flags."
  );

  const updateConfig = (updatedLinks?: LinkItem[]) => {
    const linksToUse = updatedLinks || links;
    onChange({
      links: linksToUse.map(({ id, ...rest }) => rest),
      scenario,
      instructions,
    });
  };

  const handleAddLink = () => {
    const newLink = { ...defaultLink, id: generateId() };
    const newLinks = [...links, newLink];
    setLinks(newLinks);
    updateConfig(newLinks);
  };

  const handleAddSampleMalicious = () => {
    const newLink = { ...sampleMaliciousLink, id: generateId() };
    const newLinks = [...links, newLink];
    setLinks(newLinks);
    updateConfig(newLinks);
  };

  const handleAddSampleSafe = () => {
    const newLink = { ...sampleSafeLink, id: generateId() };
    const newLinks = [...links, newLink];
    setLinks(newLinks);
    updateConfig(newLinks);
  };

  const handleAddMultipleSamples = () => {
    const samples = [
      ...samplePhishingLinks.map(l => ({ ...l, id: generateId() })),
      ...sampleSafeLinks.map(l => ({ ...l, id: generateId() })),
    ];
    const newLinks = [...links, ...samples];
    setLinks(newLinks);
    updateConfig(newLinks);
  };

  const handleRemoveLink = (id: string) => {
    const newLinks = links.filter(l => l.id !== id);
    setLinks(newLinks);
    updateConfig(newLinks);
  };

  const handleDuplicateLink = (link: LinkItem) => {
    const newLink = { ...link, id: generateId() };
    const newLinks = [...links, newLink];
    setLinks(newLinks);
    updateConfig(newLinks);
  };

  const handleLinkChange = (id: string, field: keyof LinkItem, value: string | boolean) => {
    const newLinks = links.map(l => {
      if (l.id === id) {
        return { ...l, [field]: value };
      }
      return l;
    });
    setLinks(newLinks);
    updateConfig(newLinks);
  };

  const maliciousCount = links.filter(l => l.isMalicious).length;
  const safeCount = links.filter(l => !l.isMalicious).length;

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Simulation Settings</h2>

        <div className="space-y-2">
          <Label>Link Summary</Label>
          <div className="flex gap-2">
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {maliciousCount} Malicious
            </Badge>
            <Badge variant="default" className="flex items-center gap-1 bg-green-600">
              <ShieldCheck className="w-3 h-3" />
              {safeCount} Safe
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scenario">Scenario</Label>
          <Textarea
            id="scenario"
            value={scenario}
            onChange={(e) => {
              setScenario(e.target.value);
              onChange({
                links: links.map(({ id, ...rest }) => rest),
                scenario: e.target.value,
                instructions,
              });
            }}
            placeholder="Describe the scenario for this exercise..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Instructions for Students</Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => {
              setInstructions(e.target.value);
              onChange({
                links: links.map(({ id, ...rest }) => rest),
                scenario,
                instructions: e.target.value,
              });
            }}
            placeholder="Instructions shown to students before they start..."
            rows={3}
          />
        </div>
      </Card>

      {/* Links List */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Links ({links.length})</h2>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleAddSampleMalicious}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Add Malicious
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddSampleSafe}>
              <ShieldCheck className="w-4 h-4 mr-2" />
              Add Safe
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddMultipleSamples}>
              <Plus className="w-4 h-4 mr-2" />
              Add Sample Set
            </Button>
            <Button size="sm" onClick={handleAddLink}>
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>
        </div>

        {links.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Link className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Links Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add links to create the simulation. Include both malicious and safe links.
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={handleAddSampleMalicious}>
                Add Sample Malicious Link
              </Button>
              <Button variant="outline" onClick={handleAddSampleSafe}>
                Add Sample Safe Link
              </Button>
            </div>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {links.map((link, index) => (
              <AccordionItem key={link.id} value={link.id} className="border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-4 w-full">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <Badge
                      variant={link.isMalicious ? "destructive" : "default"}
                      className={!link.isMalicious ? "bg-green-600" : ""}
                    >
                      {link.isMalicious ? "Malicious" : "Safe"}
                    </Badge>
                    <span className="font-medium truncate flex-1 text-left">
                      {link.displayText || `Link ${index + 1}`}
                    </span>
                    <span className="text-sm text-muted-foreground truncate max-w-48">
                      {link.actualUrl || "No URL"}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4 pt-4">
                    {/* Link Type Toggle */}
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <Label className="text-base">Is Malicious Link?</Label>
                        <p className="text-sm text-muted-foreground">
                          Mark this link as a malicious/suspicious URL
                        </p>
                      </div>
                      <Switch
                        checked={link.isMalicious}
                        onCheckedChange={(checked) => handleLinkChange(link.id, 'isMalicious', checked)}
                      />
                    </div>

                    {/* Display Text */}
                    <div className="space-y-2">
                      <Label>Display Text (what user sees)</Label>
                      <Input
                        value={link.displayText}
                        onChange={(e) => handleLinkChange(link.id, 'displayText', e.target.value)}
                        placeholder="e.g., Click here to verify your account"
                      />
                      <p className="text-xs text-muted-foreground">
                        This is the clickable text the user will see
                      </p>
                    </div>

                    {/* Actual URL */}
                    <div className="space-y-2">
                      <Label>Actual URL (where it really goes)</Label>
                      <div className="flex gap-2">
                        <Input
                          value={link.actualUrl}
                          onChange={(e) => handleLinkChange(link.id, 'actualUrl', e.target.value)}
                          placeholder="e.g., http://amaz0n-security.com/verify"
                          className="font-mono text-sm"
                        />
                        {link.actualUrl && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => window.open(link.actualUrl, '_blank')}
                            title="Test URL (opens in new tab)"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The actual destination URL that students will analyze
                      </p>
                    </div>

                    {/* Explanation */}
                    <div className="space-y-2">
                      <Label>Explanation (shown after answering)</Label>
                      <Textarea
                        value={link.explanation}
                        onChange={(e) => handleLinkChange(link.id, 'explanation', e.target.value)}
                        placeholder="Explain why this URL is safe or malicious..."
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        This explanation will be shown to help students learn
                      </p>
                    </div>

                    {/* URL Preview */}
                    {link.actualUrl && (
                      <div className="p-3 bg-muted rounded-lg">
                        <Label className="text-sm mb-2 block">URL Preview</Label>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-background px-2 py-1 rounded break-all">
                            {link.actualUrl}
                          </code>
                        </div>
                        {link.isMalicious && (
                          <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Make sure the URL has obvious red flags for students to identify</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicateLink(link)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveLink(link.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {links.length > 0 && links.length < 3 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Add at least 3 links for a meaningful simulation (mix of malicious and safe).
            </p>
          </div>
        )}

        {links.length >= 3 && maliciousCount === 0 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Add some malicious links for students to identify.
            </p>
          </div>
        )}

        {links.length >= 3 && safeCount === 0 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Add some safe links so students learn to differentiate.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
