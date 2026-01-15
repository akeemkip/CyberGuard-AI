import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  Shield,
  Moon,
  Sun,
  ChevronLeft,
  Bell,
  Lock,
  Eye,
  Palette,
  Loader2,
  Save,
  Monitor,
  Smartphone
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { UserProfileDropdown } from "./user-profile-dropdown";

interface SettingsPageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function SettingsPage({ onNavigate, onLogout }: SettingsPageProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { settings, updateSetting, saveSettings, hasUnsavedChanges } = useSettings();
  const [saving, setSaving] = useState(false);

  const settingNames: Record<keyof typeof settings, string> = {
    emailNotifications: 'Email Notifications',
    courseReminders: 'Course Reminders',
    marketingEmails: 'Marketing Emails',
    showProgress: 'Show Progress on Dashboard',
    autoPlayVideos: 'Auto-play Videos'
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const changes = await saveSettings();

      // Build change summary
      const changedSettings = Object.entries(changes)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => {
          const name = settingNames[key as keyof typeof settings];
          return `${name}: ${value ? 'enabled' : 'disabled'}`;
        });

      if (changedSettings.length > 0) {
        toast.success(
          <div>
            <div className="font-semibold">Settings saved successfully!</div>
            <div className="text-sm mt-1">
              {changedSettings.map((change, i) => (
                <div key={i}>• {change}</div>
              ))}
            </div>
          </div>,
          { duration: 4000 }
        );
      } else {
        toast.success('Settings saved successfully!');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("student-dashboard")}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold">Settings</h1>
                <p className="text-sm text-muted-foreground">Customize your experience</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <UserProfileDropdown onLogout={onLogout} onNavigate={onNavigate} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Appearance */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Appearance</h2>
                <p className="text-sm text-muted-foreground">Customize how CyberGuard looks</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose between light and dark mode
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => theme === "dark" && toggleTheme()}
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => theme === "light" && toggleTheme()}
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your account
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(value) => updateSetting('emailNotifications', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Course Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded to continue your courses
                  </p>
                </div>
                <Switch
                  checked={settings.courseReminders}
                  onCheckedChange={(value) => updateSetting('courseReminders', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive news about new courses and features
                  </p>
                </div>
                <Switch
                  checked={settings.marketingEmails}
                  onCheckedChange={(value) => updateSetting('marketingEmails', value)}
                />
              </div>
            </div>
          </Card>

          {/* Learning Preferences */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Learning Preferences</h2>
                <p className="text-sm text-muted-foreground">Customize your learning experience</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Progress on Dashboard</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your learning progress on the dashboard
                  </p>
                </div>
                <Switch
                  checked={settings.showProgress}
                  onCheckedChange={(value) => updateSetting('showProgress', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-play Videos</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically play videos when opening lessons
                  </p>
                </div>
                <Switch
                  checked={settings.autoPlayVideos}
                  onCheckedChange={(value) => updateSetting('autoPlayVideos', value)}
                />
              </div>
            </div>
          </Card>

          {/* Privacy */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Privacy</h2>
                <p className="text-sm text-muted-foreground">Manage your privacy settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate("privacy-policy")}>
                <Lock className="w-4 h-4 mr-2" />
                View Privacy Policy
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate("terms-of-service")}>
                <Shield className="w-4 h-4 mr-2" />
                View Terms of Service
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate("cookie-policy")}>
                <Smartphone className="w-4 h-4 mr-2" />
                View Cookie Policy
              </Button>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            {hasUnsavedChanges && (
              <span className="text-sm text-warning self-center">
                Unsaved changes
              </span>
            )}
            <Button onClick={handleSave} disabled={saving || !hasUnsavedChanges}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
