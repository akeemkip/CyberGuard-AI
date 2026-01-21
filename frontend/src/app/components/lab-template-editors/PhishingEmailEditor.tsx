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
  Mail,
  AlertTriangle,
  ShieldCheck,
  Copy,
  GripVertical,
} from "lucide-react";
import { PhishingEmailConfig } from "../../services/admin.service";

interface PhishingEmailEditorProps {
  config: PhishingEmailConfig | null;
  onChange: (config: PhishingEmailConfig) => void;
}

interface EmailItem {
  id: string;
  from: { name: string; email: string };
  subject: string;
  body: string;
  isPhishing: boolean;
  redFlags: string[];
  attachments?: string[];
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultEmail: EmailItem = {
  id: generateId(),
  from: { name: "", email: "" },
  subject: "",
  body: "",
  isPhishing: false,
  redFlags: [],
  attachments: [],
};

const samplePhishingEmail: EmailItem = {
  id: generateId(),
  from: { name: "IT Security Team", email: "it-security@company-support.net" },
  subject: "URGENT: Your Account Has Been Compromised - Immediate Action Required",
  body: `<p>Dear Valued Employee,</p>

<p>Our security systems have detected <strong>unusual activity</strong> on your corporate account. Your password may have been compromised in a recent data breach.</p>

<p>To protect your account and company data, you must verify your credentials immediately by clicking the link below:</p>

<p><a href="http://company-support.net/verify-account">Verify Your Account Now</a></p>

<p>Failure to verify within 24 hours will result in account suspension.</p>

<p>Best regards,<br/>IT Security Team</p>`,
  isPhishing: true,
  redFlags: [
    "Suspicious sender email domain (company-support.net instead of company.com)",
    "Creates urgency with threats of account suspension",
    "Generic greeting 'Dear Valued Employee' instead of your name",
    "Link URL doesn't match the company's official domain",
    "Asks for credential verification through a link"
  ],
  attachments: [],
};

const sampleLegitEmail: EmailItem = {
  id: generateId(),
  from: { name: "HR Department", email: "hr@company.com" },
  subject: "Reminder: Annual Benefits Enrollment Deadline - Dec 15",
  body: `<p>Hi Team,</p>

<p>This is a friendly reminder that the annual benefits enrollment period ends on December 15th.</p>

<p>Please log into the <strong>Employee Portal</strong> using your regular credentials to review and update your benefits selections.</p>

<p>If you have questions, please contact HR at extension 5000 or visit us in Room 302.</p>

<p>Thank you,<br/>Human Resources</p>`,
  isPhishing: false,
  redFlags: [],
  attachments: [],
};

export function PhishingEmailEditor({ config, onChange }: PhishingEmailEditorProps) {
  const [emails, setEmails] = useState<EmailItem[]>(config?.emails || []);
  const [emailInterface, setEmailInterface] = useState<'gmail' | 'outlook' | 'generic'>(
    config?.emailInterface || 'gmail'
  );
  const [labInstructions, setLabInstructions] = useState(
    config?.instructions || 'Review each email and identify which ones are phishing attempts. Click "Report Phishing" for suspicious emails or "Mark Safe" for legitimate ones.'
  );
  const [feedbackCorrect, setFeedbackCorrect] = useState(
    config?.feedbackCorrect || 'Correct! You identified this email correctly.'
  );
  const [feedbackIncorrect, setFeedbackIncorrect] = useState(
    config?.feedbackIncorrect || 'Incorrect. Review the red flags and try again.'
  );

  const updateConfig = (updatedEmails?: EmailItem[]) => {
    const emailsToUse = updatedEmails || emails;
    onChange({
      emailInterface,
      emails: emailsToUse,
      instructions: labInstructions,
      feedbackCorrect,
      feedbackIncorrect,
    });
  };

  const handleAddEmail = () => {
    const newEmail = { ...defaultEmail, id: generateId() };
    const newEmails = [...emails, newEmail];
    setEmails(newEmails);
    updateConfig(newEmails);
  };

  const handleAddSamplePhishing = () => {
    const newEmail = { ...samplePhishingEmail, id: generateId() };
    const newEmails = [...emails, newEmail];
    setEmails(newEmails);
    updateConfig(newEmails);
  };

  const handleAddSampleLegit = () => {
    const newEmail = { ...sampleLegitEmail, id: generateId() };
    const newEmails = [...emails, newEmail];
    setEmails(newEmails);
    updateConfig(newEmails);
  };

  const handleRemoveEmail = (id: string) => {
    const newEmails = emails.filter(e => e.id !== id);
    setEmails(newEmails);
    updateConfig(newEmails);
  };

  const handleDuplicateEmail = (email: EmailItem) => {
    const newEmail = { ...email, id: generateId() };
    const newEmails = [...emails, newEmail];
    setEmails(newEmails);
    updateConfig(newEmails);
  };

  const handleEmailChange = (id: string, field: string, value: any) => {
    const newEmails = emails.map(e => {
      if (e.id === id) {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return {
            ...e,
            [parent]: {
              ...(e as any)[parent],
              [child]: value
            }
          };
        }
        return { ...e, [field]: value };
      }
      return e;
    });
    setEmails(newEmails);
    updateConfig(newEmails);
  };

  const handleRedFlagChange = (emailId: string, index: number, value: string) => {
    const newEmails = emails.map(e => {
      if (e.id === emailId) {
        const newRedFlags = [...e.redFlags];
        newRedFlags[index] = value;
        return { ...e, redFlags: newRedFlags };
      }
      return e;
    });
    setEmails(newEmails);
    updateConfig(newEmails);
  };

  const handleAddRedFlag = (emailId: string) => {
    const newEmails = emails.map(e => {
      if (e.id === emailId) {
        return { ...e, redFlags: [...e.redFlags, ""] };
      }
      return e;
    });
    setEmails(newEmails);
    updateConfig(newEmails);
  };

  const handleRemoveRedFlag = (emailId: string, index: number) => {
    const newEmails = emails.map(e => {
      if (e.id === emailId) {
        return { ...e, redFlags: e.redFlags.filter((_, i) => i !== index) };
      }
      return e;
    });
    setEmails(newEmails);
    updateConfig(newEmails);
  };

  const phishingCount = emails.filter(e => e.isPhishing).length;
  const legitCount = emails.filter(e => !e.isPhishing).length;

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Simulation Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emailInterface">Email Interface Style</Label>
            <Select
              value={emailInterface}
              onValueChange={(v: 'gmail' | 'outlook' | 'generic') => {
                setEmailInterface(v);
                onChange({
                  emailInterface: v,
                  emails,
                  instructions: labInstructions,
                  feedbackCorrect,
                  feedbackIncorrect,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmail">Gmail Style</SelectItem>
                <SelectItem value="outlook">Outlook Style</SelectItem>
                <SelectItem value="generic">Generic Email Client</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Email Summary</Label>
            <div className="flex gap-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {phishingCount} Phishing
              </Badge>
              <Badge variant="default" className="flex items-center gap-1 bg-green-600">
                <ShieldCheck className="w-3 h-3" />
                {legitCount} Legitimate
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="labInstructions">Instructions for Students</Label>
          <Textarea
            id="labInstructions"
            value={labInstructions}
            onChange={(e) => {
              setLabInstructions(e.target.value);
              onChange({
                emailInterface,
                emails,
                instructions: e.target.value,
                feedbackCorrect,
                feedbackIncorrect,
              });
            }}
            placeholder="Instructions shown to students before they start..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="feedbackCorrect">Correct Answer Feedback</Label>
            <Textarea
              id="feedbackCorrect"
              value={feedbackCorrect}
              onChange={(e) => {
                setFeedbackCorrect(e.target.value);
                onChange({
                  emailInterface,
                  emails,
                  instructions: labInstructions,
                  feedbackCorrect: e.target.value,
                  feedbackIncorrect,
                });
              }}
              placeholder="Message shown when student answers correctly..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedbackIncorrect">Incorrect Answer Feedback</Label>
            <Textarea
              id="feedbackIncorrect"
              value={feedbackIncorrect}
              onChange={(e) => {
                setFeedbackIncorrect(e.target.value);
                onChange({
                  emailInterface,
                  emails,
                  instructions: labInstructions,
                  feedbackCorrect,
                  feedbackIncorrect: e.target.value,
                });
              }}
              placeholder="Message shown when student answers incorrectly..."
              rows={2}
            />
          </div>
        </div>
      </Card>

      {/* Emails List */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Emails ({emails.length})</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddSamplePhishing}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Add Sample Phishing
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddSampleLegit}>
              <ShieldCheck className="w-4 h-4 mr-2" />
              Add Sample Legit
            </Button>
            <Button size="sm" onClick={handleAddEmail}>
              <Plus className="w-4 h-4 mr-2" />
              Add Email
            </Button>
          </div>
        </div>

        {emails.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Emails Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add emails to create the simulation. Include both phishing and legitimate emails.
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={handleAddSamplePhishing}>
                Add Sample Phishing Email
              </Button>
              <Button variant="outline" onClick={handleAddSampleLegit}>
                Add Sample Legitimate Email
              </Button>
            </div>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {emails.map((email, index) => (
              <AccordionItem key={email.id} value={email.id} className="border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-4 w-full">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <Badge
                      variant={email.isPhishing ? "destructive" : "default"}
                      className={!email.isPhishing ? "bg-green-600" : ""}
                    >
                      {email.isPhishing ? "Phishing" : "Legitimate"}
                    </Badge>
                    <span className="font-medium truncate flex-1 text-left">
                      {email.subject || `Email ${index + 1}`}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {email.from.email || "No sender"}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4 pt-4">
                    {/* Email Type Toggle */}
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <Label className="text-base">Is Phishing Email?</Label>
                        <p className="text-sm text-muted-foreground">
                          Mark this email as a phishing attempt
                        </p>
                      </div>
                      <Switch
                        checked={email.isPhishing}
                        onCheckedChange={(checked) => handleEmailChange(email.id, 'isPhishing', checked)}
                      />
                    </div>

                    {/* Sender Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Sender Name</Label>
                        <Input
                          value={email.from.name}
                          onChange={(e) => handleEmailChange(email.id, 'from.name', e.target.value)}
                          placeholder="e.g., IT Support"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Sender Email</Label>
                        <Input
                          value={email.from.email}
                          onChange={(e) => handleEmailChange(email.id, 'from.email', e.target.value)}
                          placeholder="e.g., support@company.com"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label>Subject Line</Label>
                      <Input
                        value={email.subject}
                        onChange={(e) => handleEmailChange(email.id, 'subject', e.target.value)}
                        placeholder="Email subject..."
                      />
                    </div>

                    {/* Body */}
                    <div className="space-y-2">
                      <Label>Email Body (HTML supported)</Label>
                      <Textarea
                        value={email.body}
                        onChange={(e) => handleEmailChange(email.id, 'body', e.target.value)}
                        placeholder="<p>Email content goes here...</p>"
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </div>

                    {/* Red Flags (only for phishing emails) */}
                    {email.isPhishing && (
                      <div className="space-y-2">
                        <Label>Red Flags (shown after student answers)</Label>
                        <p className="text-xs text-muted-foreground">
                          List the suspicious indicators that make this a phishing email
                        </p>
                        {email.redFlags.map((flag, flagIndex) => (
                          <div key={flagIndex} className="flex gap-2">
                            <Input
                              value={flag}
                              onChange={(e) => handleRedFlagChange(email.id, flagIndex, e.target.value)}
                              placeholder={`Red flag ${flagIndex + 1}`}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemoveRedFlag(email.id, flagIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddRedFlag(email.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Red Flag
                        </Button>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicateEmail(email)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveEmail(email.id)}
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

        {emails.length > 0 && emails.length < 2 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Add at least 2 emails for a meaningful simulation (mix of phishing and legitimate).
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
