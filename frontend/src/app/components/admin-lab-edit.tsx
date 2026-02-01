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
  FlaskConical,
  Mail,
  Link,
  Key,
  MessageSquare,
  AlertTriangle,
  Wifi,
  GitBranch,
  FileText,
  Eye,
} from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";
import adminService, {
  LabFull,
  LabType,
  CreateLabRequest,
  UpdateLabRequest,
  PhishingEmailConfig,
  SuspiciousLinksConfig,
  PasswordStrengthConfig,
  SocialEngineeringConfig,
} from "../services/admin.service";
import courseService from "../services/course.service";
import { PhishingEmailEditor } from "./lab-template-editors/PhishingEmailEditor";
import { SuspiciousLinksEditor } from "./lab-template-editors/SuspiciousLinksEditor";
import { PasswordStrengthEditor } from "./lab-template-editors/PasswordStrengthEditor";
import { SocialEngineeringEditor } from "./lab-template-editors/SocialEngineeringEditor";

interface AdminLabEditProps {
  labId?: string | null;
  userEmail: string;
  onNavigate: (page: string, id?: string) => void;
  onLogout: () => void;
}

interface Course {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
  courseId: string;
}

const LAB_TYPES: { value: LabType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'CONTENT',
    label: 'Content Lab',
    icon: <FileText className="w-4 h-4" />,
    description: 'Traditional text-based lab with instructions and objectives'
  },
  {
    value: 'PHISHING_EMAIL',
    label: 'Phishing Email Detection',
    icon: <Mail className="w-4 h-4" />,
    description: 'Interactive email simulation where students identify phishing attempts'
  },
  {
    value: 'SUSPICIOUS_LINKS',
    label: 'Suspicious Links',
    icon: <Link className="w-4 h-4" />,
    description: 'URL analysis exercise to identify malicious links'
  },
  {
    value: 'PASSWORD_STRENGTH',
    label: 'Password Strength',
    icon: <Key className="w-4 h-4" />,
    description: 'Password creation exercise with strength requirements'
  },
  {
    value: 'SOCIAL_ENGINEERING',
    label: 'Social Engineering',
    icon: <MessageSquare className="w-4 h-4" />,
    description: 'Chat/message simulation for social engineering awareness'
  },
  {
    value: 'SECURITY_ALERTS',
    label: 'Security Alerts',
    icon: <AlertTriangle className="w-4 h-4" />,
    description: 'Identify fake vs legitimate security popups and alerts'
  },
  {
    value: 'WIFI_SAFETY',
    label: 'WiFi Safety',
    icon: <Wifi className="w-4 h-4" />,
    description: 'Network selection exercise for safe WiFi practices'
  },
  {
    value: 'INCIDENT_RESPONSE',
    label: 'Incident Response',
    icon: <GitBranch className="w-4 h-4" />,
    description: 'Decision tree scenario for incident response training'
  },
];

export function AdminLabEdit({ labId, userEmail, onNavigate, onLogout }: AdminLabEditProps) {
  const isEditMode = !!labId;

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [estimatedTime, setEstimatedTime] = useState<number | undefined>(undefined);
  const [order, setOrder] = useState(0);
  const [courseId, setCourseId] = useState("");
  const [moduleId, setModuleId] = useState<string | undefined>(undefined);
  const [isPublished, setIsPublished] = useState(false);
  const [labType, setLabType] = useState<LabType>("PHISHING_EMAIL");
  const [passingScore, setPassingScore] = useState(70);

  // Legacy fields for CONTENT type
  const [instructions, setInstructions] = useState("");
  const [scenario, setScenario] = useState("");
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [resources, setResources] = useState("");
  const [hints, setHints] = useState("");

  // Simulation config for interactive labs
  const [simulationConfig, setSimulationConfig] = useState<PhishingEmailConfig | SuspiciousLinksConfig | PasswordStrengthConfig | SocialEngineeringConfig | null>(null);

  // UI state
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");

  // Load courses on mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Load lab data if editing
  useEffect(() => {
    if (labId) {
      loadLabData();
    }
  }, [labId]);

  // Load modules when course changes
  useEffect(() => {
    if (courseId) {
      loadModules(courseId);
    } else {
      setModules([]);
      setModuleId(undefined);
    }
  }, [courseId]);

  const loadCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setCourses(data.map(c => ({ id: c.id, title: c.title })));
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Failed to load courses");
    }
  };

  const loadModules = async (cId: string) => {
    try {
      const data = await adminService.getCourseModules(cId);
      setModules(data.map(m => ({ id: m.id, title: m.title, courseId: m.courseId })));
    } catch (error) {
      console.error("Error loading modules:", error);
    }
  };

  const loadLabData = async () => {
    try {
      setIsLoading(true);
      const lab = await adminService.getLabById(labId!);

      setTitle(lab.title);
      setDescription(lab.description);
      setDifficulty(lab.difficulty);
      setEstimatedTime(lab.estimatedTime || undefined);
      setOrder(lab.order);
      setCourseId(lab.courseId);
      setModuleId(lab.moduleId || undefined);
      setIsPublished(lab.isPublished);
      setLabType(lab.labType);
      setPassingScore(lab.passingScore);

      // Legacy fields
      setInstructions(lab.instructions || "");
      setScenario(lab.scenario || "");
      setObjectives(lab.objectives.length > 0 ? lab.objectives : [""]);
      setResources(lab.resources || "");
      setHints(lab.hints || "");

      // Simulation config
      if (lab.simulationConfig) {
        setSimulationConfig(lab.simulationConfig as PhishingEmailConfig);
      }
    } catch (error) {
      console.error("Error loading lab:", error);
      toast.error("Failed to load lab");
      onNavigate("admin-content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddObjective = () => {
    setObjectives([...objectives, ""]);
  };

  const handleRemoveObjective = (index: number) => {
    if (objectives.length > 1) {
      setObjectives(objectives.filter((_, i) => i !== index));
    }
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  const validateForm = (): boolean => {
    if (!title || title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return false;
    }

    if (!description || description.trim().length < 10) {
      toast.error("Description must be at least 10 characters");
      return false;
    }

    if (!courseId) {
      toast.error("Please select a course");
      return false;
    }

    if (labType === 'CONTENT') {
      if (!instructions || instructions.trim().length < 50) {
        toast.error("Instructions must be at least 50 characters for content labs");
        return false;
      }

      const validObjectives = objectives.filter(o => o.trim().length >= 5);
      if (validObjectives.length < 1) {
        toast.error("At least 1 objective with 5+ characters is required");
        return false;
      }
    } else {
      // Validate simulation config
      if (!simulationConfig) {
        toast.error("Please configure the simulation");
        return false;
      }

      // Validate simulation config based on type
      switch (labType) {
        case 'PHISHING_EMAIL': {
          const config = simulationConfig as PhishingEmailConfig;
          if (!config.emails || config.emails.length < 2) {
            toast.error("Please add at least 2 emails to the simulation");
            return false;
          }
          // Validate each email has required fields
          const invalidEmail = config.emails.find(
            e => !e.from?.name || !e.from?.email || !e.subject || !e.body
          );
          if (invalidEmail) {
            toast.error("All emails must have sender name, email, subject, and body");
            return false;
          }
          // Ensure we have a mix of phishing and legitimate emails
          const hasPhishing = config.emails.some(e => e.isPhishing);
          const hasLegitimate = config.emails.some(e => !e.isPhishing);
          if (!hasPhishing || !hasLegitimate) {
            toast.error("Simulation must include both phishing and legitimate emails");
            return false;
          }
          break;
        }

        case 'SUSPICIOUS_LINKS': {
          const config = simulationConfig as SuspiciousLinksConfig;
          if (!config.links || config.links.length < 3) {
            toast.error("Please add at least 3 links to the simulation");
            return false;
          }
          // Validate each link has required fields
          const invalidLink = config.links.find(
            l => !l.displayText || !l.actualUrl || !l.explanation
          );
          if (invalidLink) {
            toast.error("All links must have display text, actual URL, and explanation");
            return false;
          }
          // Ensure we have a mix of safe and malicious links
          const hasMalicious = config.links.some(l => l.isMalicious);
          const hasSafe = config.links.some(l => !l.isMalicious);
          if (!hasMalicious || !hasSafe) {
            toast.error("Simulation must include both safe and malicious links");
            return false;
          }
          if (!config.scenario || !config.instructions) {
            toast.error("Please provide scenario and instructions for the simulation");
            return false;
          }
          break;
        }

        case 'PASSWORD_STRENGTH': {
          const config = simulationConfig as PasswordStrengthConfig;
          if (!config.requirements) {
            toast.error("Please configure password requirements");
            return false;
          }
          if (config.requirements.minLength < 1) {
            toast.error("Minimum password length must be at least 1");
            return false;
          }
          if (!config.scenario) {
            toast.error("Please provide a scenario for the simulation");
            return false;
          }
          if (!Array.isArray(config.bannedPasswords)) {
            toast.error("Banned passwords must be an array");
            return false;
          }
          if (!Array.isArray(config.hints) || config.hints.length === 0) {
            toast.error("Please provide at least one hint for users");
            return false;
          }
          break;
        }

        case 'SOCIAL_ENGINEERING': {
          const config = simulationConfig as SocialEngineeringConfig;
          if (!config.messages || config.messages.length < 2) {
            toast.error("Please add at least 2 conversation messages");
            return false;
          }
          // Validate each message has required fields
          const invalidMessage = config.messages.find(
            m => !m.id || !m.attackerMessage || !m.tacticUsed || !m.tacticExplanation || !Array.isArray(m.responses) || m.responses.length === 0
          );
          if (invalidMessage) {
            toast.error("All messages must have ID, message text, tactic info, and response options");
            return false;
          }
          // Validate responses
          for (const msg of config.messages) {
            const invalidResponse = msg.responses.find(
              r => !r.text || typeof r.isCorrect !== 'boolean' || !r.feedback
            );
            if (invalidResponse) {
              toast.error("All responses must have text, correct flag, and feedback");
              return false;
            }
            // Ensure at least one correct and one incorrect response
            const hasCorrect = msg.responses.some(r => r.isCorrect);
            const hasIncorrect = msg.responses.some(r => !r.isCorrect);
            if (!hasCorrect || !hasIncorrect) {
              toast.error("Each message must have both correct and incorrect response options");
              return false;
            }
          }
          if (!config.scenario || !config.context || !config.attackerName || !config.attackerRole || !config.instructions) {
            toast.error("Please provide all required fields: scenario, context, attacker info, and instructions");
            return false;
          }
          break;
        }
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);

      const labData: CreateLabRequest | UpdateLabRequest = {
        title: title.trim(),
        description: description.trim(),
        difficulty,
        estimatedTime: estimatedTime || undefined,
        order,
        courseId,
        moduleId: moduleId || undefined,
        isPublished,
        labType,
        passingScore,
      };

      if (labType === 'CONTENT') {
        labData.instructions = instructions.trim();
        labData.scenario = scenario.trim() || undefined;
        labData.objectives = objectives.filter(o => o.trim().length >= 5);
        labData.resources = resources.trim() || undefined;
        labData.hints = hints.trim() || undefined;
      } else {
        labData.simulationConfig = simulationConfig || undefined;
      }

      if (isEditMode) {
        await adminService.updateLab(labId!, labData as UpdateLabRequest);
        toast.success("Lab updated successfully");
      } else {
        await adminService.createLab(labData as CreateLabRequest);
        toast.success("Lab created successfully");
      }

      onNavigate("admin-content");
    } catch (error: any) {
      console.error("Error saving lab:", error);
      toast.error(error.response?.data?.error || "Failed to save lab");
    } finally {
      setIsSaving(false);
    }
  };

  const getDefaultConfig = (type: LabType): PhishingEmailConfig | SuspiciousLinksConfig | PasswordStrengthConfig | SocialEngineeringConfig | null => {
    if (type === 'PHISHING_EMAIL') {
      return {
        emailInterface: 'gmail',
        emails: [],
        instructions: 'Review each email and identify which ones are phishing attempts. Click "Report Phishing" for suspicious emails or "Mark Safe" for legitimate ones.',
        feedbackCorrect: 'Correct! You identified this email correctly.',
        feedbackIncorrect: 'Incorrect. Review the red flags and try again.',
      };
    }
    if (type === 'SUSPICIOUS_LINKS') {
      return {
        links: [],
        scenario: 'You received an email with several links. Before clicking any of them, analyze each URL to determine if it\'s safe or potentially malicious.',
        instructions: 'Hover over each link to see the actual URL. Analyze the URL carefully and determine whether it\'s safe or suspicious. Look for typosquatting, unusual domains, HTTP vs HTTPS, and other red flags.',
      };
    }
    if (type === 'PASSWORD_STRENGTH') {
      return {
        scenario: 'You need to create a strong password for your new corporate account. The password must meet security requirements to protect sensitive company data.',
        requirements: {
          minLength: 12,
          requireUppercase: true,
          requireNumbers: true,
          requireSpecial: true,
        },
        bannedPasswords: [],
        hints: [],
      };
    }
    if (type === 'SOCIAL_ENGINEERING') {
      return {
        scenario: '',
        context: '',
        attackerName: '',
        attackerRole: '',
        messages: [],
        instructions: 'Read each message carefully and choose the most appropriate response. Watch out for social engineering tactics.',
      };
    }
    return null;
  };

  const handleLabTypeChange = (type: LabType) => {
    setLabType(type);
    if (type !== 'CONTENT' && !simulationConfig) {
      setSimulationConfig(getDefaultConfig(type));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar
          userEmail={userEmail}
          currentPage="admin-content"
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar
        userEmail={userEmail}
        currentPage="admin-content"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      <main className="flex-1 p-8">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("admin-content")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FlaskConical className="w-6 h-6" />
                {isEditMode ? "Edit Lab" : "Create Lab"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditMode ? "Update lab configuration" : "Create a new interactive lab"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onNavigate("admin-content")}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? "Update Lab" : "Create Lab"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="content">
              {labType === 'CONTENT' ? 'Content' : 'Simulation'}
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <Card className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Basic Information</h2>

                <div className="space-y-2">
                  <Label htmlFor="title">Lab Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter lab title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter lab description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="estimatedTime">Est. Time (min)</Label>
                    <Input
                      id="estimatedTime"
                      type="number"
                      min={1}
                      max={300}
                      value={estimatedTime || ""}
                      onChange={(e) => setEstimatedTime(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="e.g., 30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order">Order</Label>
                    <Input
                      id="order"
                      type="number"
                      min={0}
                      value={order}
                      onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <Input
                      id="passingScore"
                      type="number"
                      min={0}
                      max={100}
                      value={passingScore}
                      onChange={(e) => setPassingScore(parseInt(e.target.value) || 70)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isPublished">Publish Lab</Label>
                  <Switch
                    id="isPublished"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>
              </Card>

              {/* Course & Module */}
              <Card className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Course Assignment</h2>

                <div className="space-y-2">
                  <Label htmlFor="course">Course *</Label>
                  <Select value={courseId} onValueChange={setCourseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="module">Module (optional)</Label>
                  <Select
                    value={moduleId || "none"}
                    onValueChange={(v) => setModuleId(v === "none" ? undefined : v)}
                    disabled={!courseId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Module</SelectItem>
                      {modules.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            </div>

            {/* Lab Type Selection */}
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Lab Type</h2>
              <p className="text-sm text-muted-foreground">
                Choose the type of interactive experience for this lab
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {LAB_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleLabTypeChange(type.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                      labType === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {type.icon}
                      <span className="font-medium">{type.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Content/Simulation Tab */}
          <TabsContent value="content" className="space-y-6">
            {labType === 'CONTENT' ? (
              // Legacy content editor
              <div className="space-y-6">
                <Card className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold">Lab Content</h2>

                  <div className="space-y-2">
                    <Label htmlFor="scenario">Scenario (optional)</Label>
                    <Textarea
                      id="scenario"
                      value={scenario}
                      onChange={(e) => setScenario(e.target.value)}
                      placeholder="Describe the scenario for this lab..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions * (Markdown supported)</Label>
                    <Textarea
                      id="instructions"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Step-by-step instructions for completing the lab..."
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Learning Objectives *</Label>
                    {objectives.map((obj, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={obj}
                          onChange={(e) => handleObjectiveChange(index, e.target.value)}
                          placeholder={`Objective ${index + 1}`}
                        />
                        {objectives.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveObjective(index)}
                          >
                            &times;
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddObjective}
                    >
                      Add Objective
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resources">Resources (optional, Markdown)</Label>
                    <Textarea
                      id="resources"
                      value={resources}
                      onChange={(e) => setResources(e.target.value)}
                      placeholder="Links to helpful resources..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hints">Hints (optional, Markdown)</Label>
                    <Textarea
                      id="hints"
                      value={hints}
                      onChange={(e) => setHints(e.target.value)}
                      placeholder="Hints to help students..."
                      rows={4}
                    />
                  </div>
                </Card>
              </div>
            ) : labType === 'PHISHING_EMAIL' ? (
              // Phishing Email Editor
              <PhishingEmailEditor
                config={simulationConfig as PhishingEmailConfig | null}
                onChange={setSimulationConfig}
              />
            ) : labType === 'SUSPICIOUS_LINKS' ? (
              // Suspicious Links Editor
              <SuspiciousLinksEditor
                config={simulationConfig as SuspiciousLinksConfig | null}
                onChange={setSimulationConfig}
              />
            ) : labType === 'PASSWORD_STRENGTH' ? (
              // Password Strength Editor
              <PasswordStrengthEditor
                config={simulationConfig as PasswordStrengthConfig | null}
                onChange={setSimulationConfig}
              />
            ) : labType === 'SOCIAL_ENGINEERING' ? (
              // Social Engineering Editor
              <SocialEngineeringEditor
                config={simulationConfig as SocialEngineeringConfig | null}
                onChange={setSimulationConfig}
              />
            ) : (
              // Placeholder for other simulation types
              <Card className="p-6">
                <div className="text-center py-12">
                  <Badge variant="secondary" className="mb-4">Coming Soon</Badge>
                  <h3 className="text-lg font-semibold mb-2">
                    {LAB_TYPES.find(t => t.value === labType)?.label} Editor
                  </h3>
                  <p className="text-muted-foreground">
                    The editor for this simulation type is under development.
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <Card className="p-6">
              <div className="text-center py-12">
                <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Preview Mode</h3>
                <p className="text-muted-foreground mb-4">
                  See how the lab will appear to students
                </p>
                <Badge variant="secondary">Preview available after saving</Badge>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </main>
    </div>
  );
}
