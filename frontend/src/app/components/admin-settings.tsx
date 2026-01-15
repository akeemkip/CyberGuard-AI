import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Moon,
  Sun,
  Save,
  RotateCcw,
  Settings,
  Shield,
  GraduationCap,
  Users as UsersIcon,
  Mail,
  Palette,
  Bell,
  Loader2
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { AdminSidebar } from "./admin-sidebar";
import { toast } from "sonner";

interface AdminSettingsProps {
  userEmail: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface PlatformSettings {
  // General
  platformName: string;
  platformDescription: string;
  supportEmail: string;
  contactEmail: string;

  // Security
  requireEmailVerification: boolean;
  minPasswordLength: number;
  sessionTimeout: number;
  enableTwoFactor: boolean;
  maxLoginAttempts: number;

  // Course Settings
  autoEnrollNewUsers: boolean;
  defaultCourseVisibility: "public" | "private";
  defaultQuizPassingScore: number;
  enableCertificates: boolean;
  allowCourseReviews: boolean;

  // User Settings
  defaultUserRole: "STUDENT" | "ADMIN";
  allowSelfRegistration: boolean;
  requireProfileCompletion: boolean;
  enablePublicProfiles: boolean;

  // Email/Notifications
  enableEmailNotifications: boolean;
  enableEnrollmentEmails: boolean;
  enableCompletionEmails: boolean;
  enableWeeklyDigest: boolean;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;

  // Appearance
  primaryColor: string;
  logoUrl: string;
  favicon: string;
  customCss: string;
}

export function AdminSettings({ userEmail, onNavigate, onLogout }: AdminSettingsProps) {
  const { theme, toggleTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize with default settings
  const [settings, setSettings] = useState<PlatformSettings>({
    // General
    platformName: "CyberGuard AI",
    platformDescription: "Advanced cybersecurity training platform for professionals and enthusiasts",
    supportEmail: "support@cyberguard.com",
    contactEmail: "contact@cyberguard.com",

    // Security
    requireEmailVerification: false,
    minPasswordLength: 6,
    sessionTimeout: 7,
    enableTwoFactor: false,
    maxLoginAttempts: 5,

    // Course Settings
    autoEnrollNewUsers: false,
    defaultCourseVisibility: "public",
    defaultQuizPassingScore: 70,
    enableCertificates: true,
    allowCourseReviews: true,

    // User Settings
    defaultUserRole: "STUDENT",
    allowSelfRegistration: true,
    requireProfileCompletion: false,
    enablePublicProfiles: false,

    // Email/Notifications
    enableEmailNotifications: false,
    enableEnrollmentEmails: true,
    enableCompletionEmails: true,
    enableWeeklyDigest: false,
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",

    // Appearance
    primaryColor: "#3b82f6",
    logoUrl: "",
    favicon: "",
    customCss: "",
  });

  const handleChange = (key: keyof PlatformSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Simulate API call - in real app, this would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store in localStorage for demo purposes
      localStorage.setItem('adminSettings', JSON.stringify(settings));

      setHasUnsavedChanges(false);
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('adminSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
      setHasUnsavedChanges(false);
      toast.info("Settings reset to last saved state");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AdminSidebar
        userEmail={userEmail}
        currentPage="admin-settings"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Platform Settings</h1>
              <p className="text-muted-foreground">Configure platform-wide settings and preferences</p>
            </div>
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <span className="text-sm text-warning mr-2">Unsaved changes</span>
              )}
              <Button variant="outline" onClick={handleReset} disabled={!hasUnsavedChanges}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave} disabled={isSaving || !hasUnsavedChanges}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="general">
                <Settings className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="courses">
                <GraduationCap className="w-4 h-4 mr-2" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="users">
                <UsersIcon className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Palette className="w-4 h-4 mr-2" />
                Appearance
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                      id="platformName"
                      value={settings.platformName}
                      onChange={(e) => handleChange("platformName", e.target.value)}
                      placeholder="CyberGuard AI"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      The name of your platform displayed throughout the application
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="platformDescription">Platform Description</Label>
                    <Textarea
                      id="platformDescription"
                      value={settings.platformDescription}
                      onChange={(e) => handleChange("platformDescription", e.target.value)}
                      placeholder="Enter platform description..."
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Brief description shown on landing page and meta tags
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => handleChange("supportEmail", e.target.value)}
                        placeholder="support@cyberguard.com"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Email for user support inquiries
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => handleChange("contactEmail", e.target.value)}
                        placeholder="contact@cyberguard.com"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        General contact email address
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Users must verify their email before accessing the platform
                      </p>
                    </div>
                    <Switch
                      id="requireEmailVerification"
                      checked={settings.requireEmailVerification}
                      onCheckedChange={(checked) => handleChange("requireEmailVerification", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Allow users to enable 2FA for their accounts
                      </p>
                    </div>
                    <Switch
                      id="enableTwoFactor"
                      checked={settings.enableTwoFactor}
                      onCheckedChange={(checked) => handleChange("enableTwoFactor", checked)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="minPasswordLength">Minimum Password Length</Label>
                      <Input
                        id="minPasswordLength"
                        type="number"
                        min="6"
                        max="20"
                        value={settings.minPasswordLength}
                        onChange={(e) => handleChange("minPasswordLength", parseInt(e.target.value))}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Minimum characters required
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (days)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        min="1"
                        max="30"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleChange("sessionTimeout", parseInt(e.target.value))}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Days until auto-logout
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        min="3"
                        max="10"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => handleChange("maxLoginAttempts", parseInt(e.target.value))}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Before account lockout
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Course Settings */}
            <TabsContent value="courses">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Course Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="autoEnrollNewUsers">Auto-Enroll New Users</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Automatically enroll new users in beginner courses
                      </p>
                    </div>
                    <Switch
                      id="autoEnrollNewUsers"
                      checked={settings.autoEnrollNewUsers}
                      onCheckedChange={(checked) => handleChange("autoEnrollNewUsers", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="enableCertificates">Enable Certificates</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Generate certificates upon course completion
                      </p>
                    </div>
                    <Switch
                      id="enableCertificates"
                      checked={settings.enableCertificates}
                      onCheckedChange={(checked) => handleChange("enableCertificates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="allowCourseReviews">Allow Course Reviews</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Let students leave reviews and ratings on courses
                      </p>
                    </div>
                    <Switch
                      id="allowCourseReviews"
                      checked={settings.allowCourseReviews}
                      onCheckedChange={(checked) => handleChange("allowCourseReviews", checked)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="defaultCourseVisibility">Default Course Visibility</Label>
                      <Select
                        value={settings.defaultCourseVisibility}
                        onValueChange={(value: "public" | "private") => handleChange("defaultCourseVisibility", value)}
                      >
                        <SelectTrigger id="defaultCourseVisibility">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        Default visibility for new courses
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="defaultQuizPassingScore">Default Quiz Passing Score (%)</Label>
                      <Input
                        id="defaultQuizPassingScore"
                        type="number"
                        min="50"
                        max="100"
                        value={settings.defaultQuizPassingScore}
                        onChange={(e) => handleChange("defaultQuizPassingScore", parseInt(e.target.value))}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Minimum score to pass quizzes
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* User Settings */}
            <TabsContent value="users">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">User Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="allowSelfRegistration">Allow Self-Registration</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Allow users to create accounts without invitation
                      </p>
                    </div>
                    <Switch
                      id="allowSelfRegistration"
                      checked={settings.allowSelfRegistration}
                      onCheckedChange={(checked) => handleChange("allowSelfRegistration", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="requireProfileCompletion">Require Profile Completion</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Users must complete their profile before accessing courses
                      </p>
                    </div>
                    <Switch
                      id="requireProfileCompletion"
                      checked={settings.requireProfileCompletion}
                      onCheckedChange={(checked) => handleChange("requireProfileCompletion", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="enablePublicProfiles">Enable Public Profiles</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Allow user profiles to be publicly viewable
                      </p>
                    </div>
                    <Switch
                      id="enablePublicProfiles"
                      checked={settings.enablePublicProfiles}
                      onCheckedChange={(checked) => handleChange("enablePublicProfiles", checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="defaultUserRole">Default User Role</Label>
                    <Select
                      value={settings.defaultUserRole}
                      onValueChange={(value: "STUDENT" | "ADMIN") => handleChange("defaultUserRole", value)}
                    >
                      <SelectTrigger id="defaultUserRole" className="max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      Default role assigned to new users
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Email/Notification Settings */}
            <TabsContent value="email">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Email & Notification Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Master switch for all email notifications
                      </p>
                    </div>
                    <Switch
                      id="enableEmailNotifications"
                      checked={settings.enableEmailNotifications}
                      onCheckedChange={(checked) => handleChange("enableEmailNotifications", checked)}
                    />
                  </div>

                  <div className="pl-6 space-y-4 border-l-2 border-muted">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="enableEnrollmentEmails">Enrollment Emails</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Send email when user enrolls in a course
                        </p>
                      </div>
                      <Switch
                        id="enableEnrollmentEmails"
                        checked={settings.enableEnrollmentEmails}
                        onCheckedChange={(checked) => handleChange("enableEnrollmentEmails", checked)}
                        disabled={!settings.enableEmailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="enableCompletionEmails">Completion Emails</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Send email when user completes a course
                        </p>
                      </div>
                      <Switch
                        id="enableCompletionEmails"
                        checked={settings.enableCompletionEmails}
                        onCheckedChange={(checked) => handleChange("enableCompletionEmails", checked)}
                        disabled={!settings.enableEmailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="enableWeeklyDigest">Weekly Digest</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Send weekly progress summary to users
                        </p>
                      </div>
                      <Switch
                        id="enableWeeklyDigest"
                        checked={settings.enableWeeklyDigest}
                        onCheckedChange={(checked) => handleChange("enableWeeklyDigest", checked)}
                        disabled={!settings.enableEmailNotifications}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="font-semibold mb-4">SMTP Configuration</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="smtpHost">SMTP Host</Label>
                          <Input
                            id="smtpHost"
                            value={settings.smtpHost}
                            onChange={(e) => handleChange("smtpHost", e.target.value)}
                            placeholder="smtp.gmail.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="smtpPort">SMTP Port</Label>
                          <Input
                            id="smtpPort"
                            value={settings.smtpPort}
                            onChange={(e) => handleChange("smtpPort", e.target.value)}
                            placeholder="587"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="smtpUser">SMTP Username</Label>
                        <Input
                          id="smtpUser"
                          value={settings.smtpUser}
                          onChange={(e) => handleChange("smtpUser", e.target.value)}
                          placeholder="your-email@gmail.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-4 items-center">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => handleChange("primaryColor", e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) => handleChange("primaryColor", e.target.value)}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Primary brand color used throughout the platform
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={settings.logoUrl}
                      onChange={(e) => handleChange("logoUrl", e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      URL to your platform logo (recommended size: 200x50px)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="favicon">Favicon URL</Label>
                    <Input
                      id="favicon"
                      value={settings.favicon}
                      onChange={(e) => handleChange("favicon", e.target.value)}
                      placeholder="https://example.com/favicon.ico"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      URL to your favicon (recommended size: 32x32px)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="customCss">Custom CSS</Label>
                    <Textarea
                      id="customCss"
                      value={settings.customCss}
                      onChange={(e) => handleChange("customCss", e.target.value)}
                      placeholder="/* Add custom CSS here */"
                      rows={6}
                      className="font-mono text-sm"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Add custom CSS to override default styles (advanced users only)
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
