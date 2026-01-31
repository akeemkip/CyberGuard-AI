import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ArrowLeft,
  Save,
  Loader2,
  Mail,
  Eye,
  Plus,
  X,
  AlertTriangle,
  ShieldCheck,
  ShieldX,
  Paperclip,
} from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";
import { RichTextEditor } from "./RichTextEditor";
import phishingService, {
  PhishingScenarioFull,
  CreateScenarioRequest,
  UpdateScenarioRequest,
} from "../services/phishing.service";

interface AdminPhishingEditProps {
  scenarioId?: string | null;
  userEmail: string;
  onNavigate: (page: string, id?: string) => void;
  onLogout: () => void;
}

const CATEGORIES = [
  "General",
  "Banking",
  "E-commerce",
  "Social Media",
  "IT Support",
  "HR/Payroll",
  "Government",
  "Shipping",
  "Subscription",
  "Prize/Lottery",
];

export function AdminPhishingEdit({
  scenarioId,
  userEmail,
  onNavigate,
  onLogout,
}: AdminPhishingEditProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [category, setCategory] = useState("General");
  const [isActive, setIsActive] = useState(true);
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [newAttachment, setNewAttachment] = useState("");
  const [isPhishing, setIsPhishing] = useState(true);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [newRedFlag, setNewRedFlag] = useState("");
  const [legitimateReason, setLegitimateReason] = useState("");

  const isEditing = !!scenarioId;

  useEffect(() => {
    if (scenarioId) {
      fetchScenario();
    }
  }, [scenarioId]);

  const fetchScenario = async () => {
    if (!scenarioId) return;

    try {
      setIsLoading(true);
      const data = await phishingService.getScenarioById(scenarioId);
      setTitle(data.title);
      setDescription(data.description);
      setDifficulty(data.difficulty);
      setCategory(data.category);
      setIsActive(data.isActive);
      setSenderName(data.senderName);
      setSenderEmail(data.senderEmail);
      setSubject(data.subject);
      setBody(data.body);
      setAttachments(data.attachments || []);
      setIsPhishing(data.isPhishing);
      setRedFlags(data.redFlags || []);
      setLegitimateReason(data.legitimateReason || "");
    } catch (error) {
      console.error("Error fetching scenario:", error);
      toast.error("Failed to load scenario");
      onNavigate("admin-content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (description.trim().length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }
    if (!senderName.trim() || !senderEmail.trim() || !subject.trim() || !body.trim()) {
      toast.error("Sender name, email, subject, and body are required");
      return;
    }
    if (isPhishing && redFlags.length === 0) {
      toast.error("Phishing scenarios must have at least one red flag");
      return;
    }
    if (!isPhishing && !legitimateReason.trim()) {
      toast.error("Legitimate scenarios must have a reason explaining why they are safe");
      return;
    }

    const scenarioData: CreateScenarioRequest | UpdateScenarioRequest = {
      title: title.trim(),
      description: description.trim(),
      difficulty,
      category,
      isActive,
      senderName: senderName.trim(),
      senderEmail: senderEmail.trim(),
      subject: subject.trim(),
      body: body.trim(),
      attachments,
      isPhishing,
      redFlags: isPhishing ? redFlags : [],
      legitimateReason: !isPhishing ? legitimateReason.trim() : undefined,
    };

    try {
      setIsSaving(true);

      if (isEditing && scenarioId) {
        await phishingService.updateScenario(scenarioId, scenarioData);
        toast.success("Scenario updated successfully");
      } else {
        await phishingService.createScenario(scenarioData);
        toast.success("Scenario created successfully");
      }

      onNavigate("admin-content");
    } catch (error: any) {
      console.error("Error saving scenario:", error);
      toast.error(error.response?.data?.error || "Failed to save scenario");
    } finally {
      setIsSaving(false);
    }
  };

  const addAttachment = () => {
    if (newAttachment.trim() && !attachments.includes(newAttachment.trim())) {
      setAttachments([...attachments, newAttachment.trim()]);
      setNewAttachment("");
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const addRedFlag = () => {
    if (newRedFlag.trim() && !redFlags.includes(newRedFlag.trim())) {
      setRedFlags([...redFlags, newRedFlag.trim()]);
      setNewRedFlag("");
    }
  };

  const removeRedFlag = (index: number) => {
    setRedFlags(redFlags.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading scenario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AdminSidebar
        userEmail={userEmail}
        currentPage="admin-content"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => onNavigate("admin-content")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditing ? "Edit Phishing Scenario" : "Create Phishing Scenario"}
                </h1>
                <p className="text-muted-foreground">
                  {isEditing ? "Modify the scenario details" : "Create a new phishing simulation scenario"}
                </p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Scenario
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="details">Scenario Details</TabsTrigger>
                <TabsTrigger value="email">Email Content</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <div className="grid gap-6">
                  {/* Basic Info */}
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Fake Bank Security Alert"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Brief description of what this scenario teaches..."
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Difficulty</Label>
                          <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Active</Label>
                          <p className="text-sm text-muted-foreground">
                            Make this scenario available to students
                          </p>
                        </div>
                        <Switch checked={isActive} onCheckedChange={setIsActive} />
                      </div>
                    </div>
                  </Card>

                  {/* Phishing Classification */}
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Classification</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {isPhishing ? (
                              <ShieldX className="w-5 h-5 text-red-500" />
                            ) : (
                              <ShieldCheck className="w-5 h-5 text-green-500" />
                            )}
                            <Label className="text-base">
                              {isPhishing ? "This is a Phishing Email" : "This is a Legitimate Email"}
                            </Label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {isPhishing
                              ? "Students should report or delete this email"
                              : "Students should mark this email as safe"}
                          </p>
                        </div>
                        <Switch checked={isPhishing} onCheckedChange={setIsPhishing} />
                      </div>

                      {isPhishing ? (
                        <div>
                          <Label>Red Flags</Label>
                          <p className="text-sm text-muted-foreground mb-2">
                            List the warning signs students should look for
                          </p>
                          <div className="flex gap-2 mb-2">
                            <Input
                              placeholder="e.g., Misspelled sender domain"
                              value={newRedFlag}
                              onChange={(e) => setNewRedFlag(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRedFlag())}
                            />
                            <Button type="button" onClick={addRedFlag}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {redFlags.map((flag, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/30 rounded"
                              >
                                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <span className="flex-1 text-sm">{flag}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeRedFlag(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          {redFlags.length === 0 && (
                            <p className="text-sm text-muted-foreground mt-2 italic">
                              Add at least one red flag for phishing scenarios
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <Label htmlFor="legitimateReason">Why is this email legitimate?</Label>
                          <p className="text-sm text-muted-foreground mb-2">
                            Explain to students why this email is safe
                          </p>
                          <Textarea
                            id="legitimateReason"
                            placeholder="e.g., This email is from a verified company domain and contains no suspicious links or requests..."
                            rows={3}
                            value={legitimateReason}
                            onChange={(e) => setLegitimateReason(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="email">
                <div className="grid gap-6">
                  {/* Sender Info */}
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Sender Information</h2>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="senderName">Sender Name</Label>
                          <Input
                            id="senderName"
                            placeholder="e.g., Security Team"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="senderEmail">Sender Email</Label>
                          <Input
                            id="senderEmail"
                            placeholder="e.g., security@bank-secure.com"
                            value={senderEmail}
                            onChange={(e) => setSenderEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject Line</Label>
                        <Input
                          id="subject"
                          placeholder="e.g., Urgent: Your account has been compromised"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Email Body */}
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Email Body</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use the rich text editor to format the email content. You can add links, bold text, etc.
                    </p>
                    <RichTextEditor
                      content={body}
                      onChange={setBody}
                      placeholder="Write the email body content here..."
                    />
                  </Card>

                  {/* Attachments */}
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Attachments (Optional)</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add fake attachment names to make the scenario more realistic
                    </p>
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="e.g., Invoice_2024.pdf"
                        value={newAttachment}
                        onChange={(e) => setNewAttachment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAttachment())}
                      />
                      <Button type="button" onClick={addAttachment}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((attachment, index) => (
                        <Badge key={index} variant="secondary" className="gap-1 pl-2">
                          <Paperclip className="w-3 h-3" />
                          {attachment}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 px-1 hover:bg-transparent"
                            onClick={() => removeAttachment(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <Card className="overflow-hidden">
                  {/* Preview Header */}
                  <div className="p-4 border-b bg-muted/30 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-muted-foreground" />
                    <h2 className="font-semibold">Email Preview</h2>
                    <Badge
                      variant={isPhishing ? "destructive" : "default"}
                      className={`ml-auto ${!isPhishing ? "bg-green-600" : ""}`}
                    >
                      {isPhishing ? "Phishing" : "Legitimate"}
                    </Badge>
                  </div>

                  {/* Email Preview */}
                  <div className="p-6 border-b bg-muted/10">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary text-lg">
                          {senderName[0]?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{senderName || "Sender Name"}</p>
                        <p className="text-sm text-muted-foreground">
                          &lt;{senderEmail || "sender@example.com"}&gt;
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{difficulty}</Badge>
                        <Badge variant="secondary">{category}</Badge>
                      </div>
                    </div>
                    <h1 className="text-xl font-semibold mb-2">
                      {subject || "Email Subject"}
                    </h1>
                    {attachments.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {attachments.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Email Body Preview */}
                  <div className="p-6 min-h-[200px]">
                    {body ? (
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: body }}
                      />
                    ) : (
                      <p className="text-muted-foreground italic">
                        Email body content will appear here...
                      </p>
                    )}
                  </div>

                  {/* Red Flags / Legitimate Reason Preview */}
                  {isPhishing && redFlags.length > 0 && (
                    <div className="p-6 border-t bg-red-50 dark:bg-red-950/30">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        Red Flags (shown after answer):
                      </h3>
                      <ul className="space-y-1">
                        {redFlags.map((flag, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-red-500 mt-1">•</span>
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!isPhishing && legitimateReason && (
                    <div className="p-6 border-t bg-green-50 dark:bg-green-950/30">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        Legitimate Reason (shown after answer):
                      </h3>
                      <p className="text-sm">{legitimateReason}</p>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
