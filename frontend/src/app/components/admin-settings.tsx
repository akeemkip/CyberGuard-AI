import { useState, useEffect, useRef } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
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
  Loader2,
  Upload,
  Download,
  X,
  History,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Send,
  AlertCircle,
  AlertTriangle
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { AdminSidebar } from "./admin-sidebar";
import { toast } from "sonner";
import adminService, { PlatformSettings as APIPlatformSettings, SettingsAuditLogEntry } from "../services/admin.service";

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
  smtpPassword: string;
  hasSmtpPassword?: boolean;

  // Appearance
  primaryColor: string;
  logoUrl: string;
  favicon: string;
  customCss: string;
}

// Types for import/export feature
interface SettingsExport {
  _meta: {
    version: "1.0";
    exportedAt: string;
    exportedBy: string;
    platform: string;
  };
  settings: {
    general: {
      platformName: string;
      platformDescription: string;
      supportEmail: string;
      contactEmail: string;
    };
    security: {
      requireEmailVerification: boolean;
      minPasswordLength: number;
      sessionTimeout: number;
      enableTwoFactor: boolean;
      maxLoginAttempts: number;
    };
    courses: {
      autoEnrollNewUsers: boolean;
      defaultCourseVisibility: "public" | "private";
      defaultQuizPassingScore: number;
      enableCertificates: boolean;
      allowCourseReviews: boolean;
    };
    users: {
      defaultUserRole: "STUDENT" | "ADMIN";
      allowSelfRegistration: boolean;
      requireProfileCompletion: boolean;
      enablePublicProfiles: boolean;
    };
    email: {
      enableEmailNotifications: boolean;
      enableEnrollmentEmails: boolean;
      enableCompletionEmails: boolean;
      enableWeeklyDigest: boolean;
      smtpHost: string;
      smtpPort: string;
      smtpUser: string;
    };
    appearance: {
      primaryColor: string;
      logoUrl: string;
      favicon: string;
      customCss: string;
    };
  };
}

interface SettingChange {
  field: string;
  category: string;
  currentValue: string;
  newValue: string;
}

interface ImportPreview {
  meta: SettingsExport["_meta"];
  changes: SettingChange[];
  warnings: string[];
  validationErrors: string[];
}

const BACKUP_KEY = "platform-settings-backup";

export function AdminSettings({ userEmail, onNavigate, onLogout }: AdminSettingsProps) {
  const { theme, toggleTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("adminSettingsTab") || "general";
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  // Audit log state
  const [auditLog, setAuditLog] = useState<SettingsAuditLogEntry[]>([]);
  const [auditLogTotal, setAuditLogTotal] = useState(0);
  const [auditLogOffset, setAuditLogOffset] = useState(0);
  const [auditLogField, setAuditLogField] = useState<string>("");
  const [auditLogFields, setAuditLogFields] = useState<string[]>([]);
  const [loadingAuditLog, setLoadingAuditLog] = useState(false);
  const AUDIT_LOG_LIMIT = 50;

  // Test email state
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  // Import/Export state
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [lastBackup, setLastBackup] = useState<PlatformSettings | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    smtpPassword: "",

    // Appearance
    primaryColor: "#3b82f6",
    logoUrl: "",
    favicon: "",
    customCss: "",
  });

  // Load settings from API on mount and check for backup recovery
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await adminService.getPlatformSettings();
        setSettings(data);

        // Check for pending backup recovery
        const savedBackup = localStorage.getItem(BACKUP_KEY);
        if (savedBackup) {
          try {
            const backup = JSON.parse(savedBackup) as PlatformSettings;
            setLastBackup(backup);
            toast.info(
              <div>
                <div className="font-semibold">Backup Available</div>
                <div className="text-sm mt-1">
                  A settings backup from a previous import is available.
                </div>
              </div>,
              {
                duration: 8000,
                action: {
                  label: "Restore",
                  onClick: () => restoreBackup(backup),
                },
              }
            );
          } catch {
            localStorage.removeItem(BACKUP_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
      }
    };
    loadSettings();
  }, []);

  // Load audit log when tab is active or filters change
  const loadAuditLog = async () => {
    setLoadingAuditLog(true);
    try {
      const data = await adminService.getSettingsAuditLog(
        AUDIT_LOG_LIMIT,
        auditLogOffset,
        auditLogField || undefined
      );
      setAuditLog(data.entries);
      setAuditLogTotal(data.total);
      setAuditLogFields(data.fields);
    } catch (error) {
      console.error('Error loading audit log:', error);
      toast.error('Failed to load audit log');
    } finally {
      setLoadingAuditLog(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'audit') {
      loadAuditLog();
    }
  }, [activeTab, auditLogOffset, auditLogField]);

  // Restore tab from browser history state on mount
  useEffect(() => {
    const historyState = window.history.state;
    if (historyState?.activeTab) {
      setActiveTab(historyState.activeTab);
    }
  }, []);

  // Save active tab to localStorage and update browser history
  useEffect(() => {
    localStorage.setItem("adminSettingsTab", activeTab);

    // Update the current history state with the active tab
    const currentState = window.history.state || {};
    window.history.replaceState(
      { ...currentState, activeTab },
      "",
      window.location.pathname
    );
  }, [activeTab]);

  // Validation functions
  const validateEmail = (email: string): string | null => {
    if (!email) return null; // Allow empty
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : "Invalid email format";
  };

  const validateUrl = (url: string): string | null => {
    if (!url) return null; // Allow empty
    try {
      new URL(url);
      return null;
    } catch {
      return "Invalid URL format";
    }
  };

  const validateHexColor = (color: string): string | null => {
    if (!color) return null;
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color) ? null : "Invalid hex color (e.g., #3b82f6)";
  };

  const validatePort = (port: string): string | null => {
    if (!port) return null;
    const portNum = parseInt(port);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      return "Port must be between 1 and 65535";
    }
    return null;
  };

  const validateNumberRange = (value: number, min: number, max: number, fieldName: string): string | null => {
    if (value < min || value > max) {
      return `${fieldName} must be between ${min} and ${max}`;
    }
    return null;
  };

  const validateField = (key: keyof PlatformSettings, value: any): string | null => {
    switch (key) {
      case "supportEmail":
      case "contactEmail":
        return validateEmail(value);
      case "logoUrl":
      case "favicon":
        return validateUrl(value);
      case "primaryColor":
        return validateHexColor(value);
      case "smtpPort":
        return validatePort(value);
      case "minPasswordLength":
        return validateNumberRange(value, 6, 20, "Password length");
      case "sessionTimeout":
        return validateNumberRange(value, 1, 30, "Session timeout");
      case "maxLoginAttempts":
        return validateNumberRange(value, 3, 10, "Max login attempts");
      case "defaultQuizPassingScore":
        return validateNumberRange(value, 50, 100, "Passing score");
      default:
        return null;
    }
  };

  const handleChange = (key: keyof PlatformSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
    setHasUnsavedChanges(true);

    // Validate the field
    const error = validateField(key, value);
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[key] = error;
      } else {
        delete newErrors[key];
      }
      return newErrors;
    });
  };

  const handleSave = async () => {
    // Check for validation errors
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix validation errors before saving");
      return;
    }

    try {
      setIsSaving(true);

      // Save to backend API
      const updatedSettings = await adminService.updatePlatformSettings(settings);
      setSettings(updatedSettings);

      setHasUnsavedChanges(false);
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      // Reload from backend API
      const data = await adminService.getPlatformSettings();
      setSettings(data);
      setHasUnsavedChanges(false);
      setValidationErrors({});
      toast.info("Settings reset to last saved state");
    } catch (error) {
      console.error("Error resetting settings:", error);
      toast.error("Failed to reset settings");
    }
  };

  const handleFileUpload = async (
    file: File,
    field: "logoUrl" | "favicon",
    setUploading: (value: boolean) => void
  ) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:3000/api/uploads/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      handleChange(field, data.url);
      toast.success(`${field === "logoUrl" ? "Logo" : "Favicon"} uploaded successfully`);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress) {
      toast.error("Please enter an email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmailAddress)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check if SMTP is configured
    if (!settings.smtpHost || !settings.smtpUser || !settings.hasSmtpPassword) {
      toast.error("Please configure and save SMTP settings first");
      return;
    }

    setSendingTestEmail(true);
    try {
      const result = await adminService.sendTestEmail(testEmailAddress);
      if (result.success) {
        toast.success(
          <div>
            <div className="font-semibold">{result.message}</div>
            {result.details && (
              <div className="text-sm mt-1 opacity-90">{result.details}</div>
            )}
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.error(
          <div>
            <div className="font-semibold">{result.message || "Failed to send test email"}</div>
            {result.details && (
              <div className="text-sm mt-1 opacity-90">{result.details}</div>
            )}
          </div>,
          { duration: 6000 }
        );
      }
    } catch (error: any) {
      const errorData = error.response?.data;
      toast.error(
        <div>
          <div className="font-semibold">{errorData?.error || "Failed to send test email"}</div>
          {errorData?.details && (
            <div className="text-sm mt-1 opacity-90">{errorData.details}</div>
          )}
        </div>,
        { duration: 6000 }
      );
    } finally {
      setSendingTestEmail(false);
    }
  };

  // Export settings functionality
  const handleExportSettings = () => {
    setShowExportDialog(true);
  };

  const confirmExport = () => {
    const exportData: SettingsExport = {
      _meta: {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        exportedBy: userEmail,
        platform: settings.platformName,
      },
      settings: {
        general: {
          platformName: settings.platformName,
          platformDescription: settings.platformDescription,
          supportEmail: settings.supportEmail,
          contactEmail: settings.contactEmail,
        },
        security: {
          requireEmailVerification: settings.requireEmailVerification,
          minPasswordLength: settings.minPasswordLength,
          sessionTimeout: settings.sessionTimeout,
          enableTwoFactor: settings.enableTwoFactor,
          maxLoginAttempts: settings.maxLoginAttempts,
        },
        courses: {
          autoEnrollNewUsers: settings.autoEnrollNewUsers,
          defaultCourseVisibility: settings.defaultCourseVisibility,
          defaultQuizPassingScore: settings.defaultQuizPassingScore,
          enableCertificates: settings.enableCertificates,
          allowCourseReviews: settings.allowCourseReviews,
        },
        users: {
          defaultUserRole: settings.defaultUserRole,
          allowSelfRegistration: settings.allowSelfRegistration,
          requireProfileCompletion: settings.requireProfileCompletion,
          enablePublicProfiles: settings.enablePublicProfiles,
        },
        email: {
          enableEmailNotifications: settings.enableEmailNotifications,
          enableEnrollmentEmails: settings.enableEnrollmentEmails,
          enableCompletionEmails: settings.enableCompletionEmails,
          enableWeeklyDigest: settings.enableWeeklyDigest,
          smtpHost: settings.smtpHost,
          smtpPort: settings.smtpPort,
          smtpUser: settings.smtpUser,
          // NOTE: smtpPassword intentionally excluded for security
        },
        appearance: {
          primaryColor: settings.primaryColor,
          logoUrl: settings.logoUrl,
          favicon: settings.favicon,
          customCss: settings.customCss,
        },
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().split("T")[0];
    const platformSlug = settings.platformName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    a.href = url;
    a.download = `${platformSlug}-settings-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowExportDialog(false);
    toast.success("Settings exported successfully");
  };

  // Import settings functionality
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input so the same file can be selected again
    e.target.value = "";

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      validateAndPreviewImport(data);
    } catch (error) {
      toast.error("Invalid JSON file. Please select a valid settings export file.");
    }
  };

  const validateImportValue = (
    key: string,
    value: unknown,
    expectedType: "string" | "number" | "boolean"
  ): string | null => {
    if (typeof value !== expectedType) {
      return `${key}: Expected ${expectedType}, got ${typeof value}`;
    }

    if (expectedType === "number") {
      const num = value as number;
      switch (key) {
        case "minPasswordLength":
          if (num < 6 || num > 20) return `${key}: Must be between 6 and 20`;
          break;
        case "sessionTimeout":
          if (num < 1 || num > 30) return `${key}: Must be between 1 and 30`;
          break;
        case "maxLoginAttempts":
          if (num < 3 || num > 10) return `${key}: Must be between 3 and 10`;
          break;
        case "defaultQuizPassingScore":
          if (num < 50 || num > 100) return `${key}: Must be between 50 and 100`;
          break;
      }
    }

    if (expectedType === "string" && typeof value === "string") {
      switch (key) {
        case "supportEmail":
        case "contactEmail":
        case "smtpUser":
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return `${key}: Invalid email format`;
          }
          break;
        case "primaryColor":
          if (value && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
            return `${key}: Invalid hex color`;
          }
          break;
        case "smtpPort":
          if (value) {
            const port = parseInt(value);
            if (isNaN(port) || port < 1 || port > 65535) {
              return `${key}: Port must be between 1 and 65535`;
            }
          }
          break;
        case "logoUrl":
        case "favicon":
          if (value) {
            try {
              new URL(value);
            } catch {
              return `${key}: Invalid URL format`;
            }
          }
          break;
        case "defaultCourseVisibility":
          if (!["public", "private"].includes(value)) {
            return `${key}: Must be "public" or "private"`;
          }
          break;
        case "defaultUserRole":
          if (!["STUDENT", "ADMIN"].includes(value)) {
            return `${key}: Must be "STUDENT" or "ADMIN"`;
          }
          break;
      }
    }

    return null;
  };

  const formatValue = (value: unknown): string => {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") return value.toString();
    if (typeof value === "string") {
      if (value.length > 50) return value.substring(0, 47) + "...";
      return value || "(empty)";
    }
    return String(value);
  };

  const validateAndPreviewImport = (data: unknown) => {
    const validationErrors: string[] = [];
    const warnings: string[] = [];
    const changes: SettingChange[] = [];

    // Check basic structure
    if (!data || typeof data !== "object") {
      toast.error("Invalid settings file structure");
      return;
    }

    const exportData = data as Record<string, unknown>;

    // Check meta version
    const meta = exportData._meta as Record<string, unknown> | undefined;
    if (!meta || !meta.version) {
      validationErrors.push("Missing _meta.version field");
    }

    const settingsData = exportData.settings as Record<string, Record<string, unknown>> | undefined;
    if (!settingsData) {
      validationErrors.push("Missing settings object");
      toast.error("Invalid settings file: missing settings object");
      return;
    }

    // Define field mappings with their types
    const fieldMappings: Record<string, Record<string, { type: "string" | "number" | "boolean"; settingsKey: keyof PlatformSettings }>> = {
      general: {
        platformName: { type: "string", settingsKey: "platformName" },
        platformDescription: { type: "string", settingsKey: "platformDescription" },
        supportEmail: { type: "string", settingsKey: "supportEmail" },
        contactEmail: { type: "string", settingsKey: "contactEmail" },
      },
      security: {
        requireEmailVerification: { type: "boolean", settingsKey: "requireEmailVerification" },
        minPasswordLength: { type: "number", settingsKey: "minPasswordLength" },
        sessionTimeout: { type: "number", settingsKey: "sessionTimeout" },
        enableTwoFactor: { type: "boolean", settingsKey: "enableTwoFactor" },
        maxLoginAttempts: { type: "number", settingsKey: "maxLoginAttempts" },
      },
      courses: {
        autoEnrollNewUsers: { type: "boolean", settingsKey: "autoEnrollNewUsers" },
        defaultCourseVisibility: { type: "string", settingsKey: "defaultCourseVisibility" },
        defaultQuizPassingScore: { type: "number", settingsKey: "defaultQuizPassingScore" },
        enableCertificates: { type: "boolean", settingsKey: "enableCertificates" },
        allowCourseReviews: { type: "boolean", settingsKey: "allowCourseReviews" },
      },
      users: {
        defaultUserRole: { type: "string", settingsKey: "defaultUserRole" },
        allowSelfRegistration: { type: "boolean", settingsKey: "allowSelfRegistration" },
        requireProfileCompletion: { type: "boolean", settingsKey: "requireProfileCompletion" },
        enablePublicProfiles: { type: "boolean", settingsKey: "enablePublicProfiles" },
      },
      email: {
        enableEmailNotifications: { type: "boolean", settingsKey: "enableEmailNotifications" },
        enableEnrollmentEmails: { type: "boolean", settingsKey: "enableEnrollmentEmails" },
        enableCompletionEmails: { type: "boolean", settingsKey: "enableCompletionEmails" },
        enableWeeklyDigest: { type: "boolean", settingsKey: "enableWeeklyDigest" },
        smtpHost: { type: "string", settingsKey: "smtpHost" },
        smtpPort: { type: "string", settingsKey: "smtpPort" },
        smtpUser: { type: "string", settingsKey: "smtpUser" },
      },
      appearance: {
        primaryColor: { type: "string", settingsKey: "primaryColor" },
        logoUrl: { type: "string", settingsKey: "logoUrl" },
        favicon: { type: "string", settingsKey: "favicon" },
        customCss: { type: "string", settingsKey: "customCss" },
      },
    };

    // Validate and collect changes
    for (const [category, fields] of Object.entries(fieldMappings)) {
      const categoryData = settingsData[category];
      if (!categoryData) continue;

      for (const [fieldName, fieldConfig] of Object.entries(fields)) {
        const newValue = categoryData[fieldName];
        if (newValue === undefined) continue;

        const error = validateImportValue(fieldName, newValue, fieldConfig.type);
        if (error) {
          validationErrors.push(error);
          continue;
        }

        const currentValue = settings[fieldConfig.settingsKey];
        if (currentValue !== newValue) {
          changes.push({
            field: fieldName,
            category,
            currentValue: formatValue(currentValue),
            newValue: formatValue(newValue),
          });
        }
      }
    }

    // Add warning about SMTP password
    if (settings.hasSmtpPassword) {
      warnings.push("SMTP password is not included in exports. You will need to re-enter it after import.");
    }

    if (validationErrors.length > 0 && changes.length === 0) {
      toast.error(
        <div>
          <div className="font-semibold">Invalid settings file</div>
          <div className="text-sm mt-1">{validationErrors[0]}</div>
        </div>
      );
      return;
    }

    if (changes.length === 0) {
      toast.info("No changes detected. The imported settings match your current configuration.");
      return;
    }

    setImportPreview({
      meta: meta as SettingsExport["_meta"],
      changes,
      warnings,
      validationErrors,
    });
    setShowImportPreview(true);
  };

  const createBackup = () => {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(settings));
    setLastBackup(settings);
  };

  const confirmImport = async () => {
    if (!importPreview) return;

    setIsImporting(true);

    try {
      // Create backup before applying
      createBackup();

      // Build the settings update object from the changes
      const updates: Partial<PlatformSettings> = {};

      // Re-parse the import data to get actual values
      // We need to reconstruct from the preview data
      // For simplicity, we'll reload the file and apply changes directly

      // Actually, let's store the parsed data in the preview
      // For now, we'll apply the changes based on the preview
      for (const change of importPreview.changes) {
        const fieldName = change.field as keyof PlatformSettings;
        // Convert the newValue back to proper type
        let value: string | number | boolean = change.newValue;

        // Handle boolean conversion
        if (change.newValue === "Yes") value = true;
        else if (change.newValue === "No") value = false;
        // Handle number conversion for known numeric fields
        else if (["minPasswordLength", "sessionTimeout", "maxLoginAttempts", "defaultQuizPassingScore"].includes(change.field)) {
          value = parseInt(change.newValue);
        }

        (updates as Record<string, unknown>)[fieldName] = value;
      }

      // Apply changes via API
      const updatedSettings = await adminService.updatePlatformSettings({
        ...settings,
        ...updates,
      });

      setSettings(updatedSettings);
      setShowImportPreview(false);
      setImportPreview(null);
      setHasUnsavedChanges(false);

      toast.success(
        <div>
          <div className="font-semibold">Settings imported successfully</div>
          <div className="text-sm mt-1">{importPreview.changes.length} setting(s) updated</div>
        </div>,
        {
          duration: 8000,
          action: {
            label: "Undo",
            onClick: () => restoreBackup(lastBackup),
          },
        }
      );
    } catch (error) {
      console.error("Error importing settings:", error);
      toast.error("Failed to import settings. Your previous settings have been preserved.");
    } finally {
      setIsImporting(false);
    }
  };

  const restoreBackup = async (backup: PlatformSettings | null) => {
    if (!backup) {
      toast.error("No backup available to restore");
      return;
    }

    try {
      const updatedSettings = await adminService.updatePlatformSettings(backup);
      setSettings(updatedSettings);
      localStorage.removeItem(BACKUP_KEY);
      setLastBackup(null);
      toast.success("Settings restored from backup");
    } catch (error) {
      console.error("Error restoring backup:", error);
      toast.error("Failed to restore settings from backup");
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
              {Object.keys(validationErrors).length > 0 && (
                <span className="text-sm text-destructive mr-2">
                  {Object.keys(validationErrors).length} validation error{Object.keys(validationErrors).length > 1 ? 's' : ''}
                </span>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button variant="outline" onClick={handleImportClick}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" onClick={handleExportSettings}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <div className="w-px h-6 bg-border" />
              <Button variant="outline" onClick={handleReset} disabled={!hasUnsavedChanges}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave} disabled={isSaving || !hasUnsavedChanges || Object.keys(validationErrors).length > 0}>
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-8">
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
              <TabsTrigger value="audit">
                <History className="w-4 h-4 mr-2" />
                Audit Log
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

                    {/* Platform Name Preview */}
                    {settings.platformName && (
                      <div className="mt-4 p-4 bg-muted rounded-lg border">
                        <p className="text-sm font-medium mb-3">Preview:</p>
                        <div className="flex items-center gap-2 p-3 bg-card rounded-md border">
                          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                            <Shield className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <span className="text-lg font-semibold">{settings.platformName}</span>
                        </div>
                      </div>
                    )}
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
                        className={validationErrors.supportEmail ? "border-destructive" : ""}
                      />
                      {validationErrors.supportEmail ? (
                        <p className="text-sm text-destructive mt-1">
                          {validationErrors.supportEmail}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          Email for user support inquiries
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => handleChange("contactEmail", e.target.value)}
                        placeholder="contact@cyberguard.com"
                        className={validationErrors.contactEmail ? "border-destructive" : ""}
                      />
                      {validationErrors.contactEmail ? (
                        <p className="text-sm text-destructive mt-1">
                          {validationErrors.contactEmail}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          General contact email address
                        </p>
                      )}
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
                        className={validationErrors.minPasswordLength ? "border-destructive" : ""}
                      />
                      {validationErrors.minPasswordLength ? (
                        <p className="text-sm text-destructive mt-1">
                          {validationErrors.minPasswordLength}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          Minimum characters required
                        </p>
                      )}
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
                        className={validationErrors.sessionTimeout ? "border-destructive" : ""}
                      />
                      {validationErrors.sessionTimeout ? (
                        <p className="text-sm text-destructive mt-1">
                          {validationErrors.sessionTimeout}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          Days until auto-logout
                        </p>
                      )}
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
                        className={validationErrors.maxLoginAttempts ? "border-destructive" : ""}
                      />
                      {validationErrors.maxLoginAttempts ? (
                        <p className="text-sm text-destructive mt-1">
                          {validationErrors.maxLoginAttempts}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          Before account lockout
                        </p>
                      )}
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
                        className={validationErrors.defaultQuizPassingScore ? "border-destructive" : ""}
                      />
                      {validationErrors.defaultQuizPassingScore ? (
                        <p className="text-sm text-destructive mt-1">
                          {validationErrors.defaultQuizPassingScore}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          Minimum score to pass quizzes
                        </p>
                      )}
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
                            className={validationErrors.smtpPort ? "border-destructive" : ""}
                          />
                          {validationErrors.smtpPort && (
                            <p className="text-sm text-destructive mt-1">
                              {validationErrors.smtpPort}
                            </p>
                          )}
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
                      <div>
                        <Label htmlFor="smtpPassword">SMTP Password</Label>
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <Input
                              id="smtpPassword"
                              type="password"
                              value={settings.smtpPassword}
                              onChange={(e) => handleChange("smtpPassword", e.target.value)}
                              placeholder={settings.hasSmtpPassword ? "Enter new password to change" : "Enter SMTP password"}
                            />
                            {settings.hasSmtpPassword && settings.smtpPassword === "••••••••" && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-medium">Set</span>
                              </div>
                            )}
                          </div>
                          {settings.hasSmtpPassword && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                handleChange("smtpPassword", "");
                                setSettings(prev => ({ ...prev, hasSmtpPassword: false }));
                              }}
                              title="Clear SMTP password"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {settings.hasSmtpPassword
                            ? "Password is encrypted and stored securely. Enter a new password to change it, or click the trash icon to clear."
                            : "Password for SMTP authentication (will be encrypted)"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Test Email Section */}
                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-semibold mb-4">Test Email Configuration</h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        Send a test email to verify your SMTP configuration is working correctly.
                        Make sure to save your settings before testing.
                      </p>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Input
                            type="email"
                            placeholder="Enter email address to send test to"
                            value={testEmailAddress}
                            onChange={(e) => setTestEmailAddress(e.target.value)}
                            disabled={sendingTestEmail}
                          />
                        </div>
                        <Button
                          onClick={handleSendTestEmail}
                          disabled={sendingTestEmail || !settings.smtpHost || !settings.smtpUser || !settings.hasSmtpPassword}
                          className="min-w-[140px]"
                        >
                          {sendingTestEmail ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Send Test Email
                            </>
                          )}
                        </Button>
                      </div>
                      {(!settings.smtpHost || !settings.smtpUser || !settings.hasSmtpPassword) && (
                        <div className="flex items-center gap-2 mt-3 text-amber-600 dark:text-amber-500">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">
                            Please configure and save all SMTP settings before testing.
                          </span>
                        </div>
                      )}
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
                        className={validationErrors.primaryColor ? "flex-1 border-destructive" : "flex-1"}
                      />
                    </div>
                    {validationErrors.primaryColor ? (
                      <p className="text-sm text-destructive mt-1">
                        {validationErrors.primaryColor}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        Primary brand color used throughout the platform
                      </p>
                    )}

                    {/* Color Preview */}
                    {settings.primaryColor && !validationErrors.primaryColor && (
                      <div className="mt-4 p-4 bg-muted rounded-lg border">
                        <p className="text-sm font-medium mb-3">Preview:</p>
                        <div className="flex flex-wrap gap-3">
                          <button
                            className="px-4 py-2 rounded-md text-white font-medium"
                            style={{ backgroundColor: settings.primaryColor }}
                            disabled
                          >
                            Primary Button
                          </button>
                          <button
                            className="px-4 py-2 rounded-md font-medium border-2"
                            style={{
                              borderColor: settings.primaryColor,
                              color: settings.primaryColor
                            }}
                            disabled
                          >
                            Outline Button
                          </button>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: `${settings.primaryColor}20`,
                              color: settings.primaryColor
                            }}
                          >
                            Badge
                          </span>
                          <div
                            className="w-10 h-10 rounded-full"
                            style={{ backgroundColor: settings.primaryColor }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="logoUrl">Logo</Label>
                    <div className="flex gap-2">
                      <Input
                        id="logoUrl"
                        value={settings.logoUrl}
                        onChange={(e) => handleChange("logoUrl", e.target.value)}
                        placeholder="https://example.com/logo.png or upload a file"
                        className={validationErrors.logoUrl ? "flex-1 border-destructive" : "flex-1"}
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file, "logoUrl", setUploadingLogo);
                            }
                            e.target.value = "";
                          }}
                          disabled={uploadingLogo}
                        />
                        <Button type="button" variant="outline" disabled={uploadingLogo}>
                          {uploadingLogo ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {settings.logoUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleChange("logoUrl", "")}
                          title="Clear logo"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {validationErrors.logoUrl ? (
                      <p className="text-sm text-destructive mt-1">
                        {validationErrors.logoUrl}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter a URL or upload a file (recommended size: 200x50px)
                      </p>
                    )}

                    {/* Logo Preview */}
                    {settings.logoUrl && !validationErrors.logoUrl && (
                      <div className="mt-4 p-4 bg-muted rounded-lg border">
                        <p className="text-sm font-medium mb-3">Preview:</p>
                        <div className="flex items-center gap-4">
                          <img
                            src={settings.logoUrl}
                            alt="Logo preview"
                            className="max-h-12 max-w-[200px] object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const errorMsg = e.currentTarget.nextElementSibling;
                              if (errorMsg) errorMsg.classList.remove('hidden');
                            }}
                          />
                          <p className="text-sm text-destructive hidden">Failed to load image</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="favicon">Favicon</Label>
                    <div className="flex gap-2">
                      <Input
                        id="favicon"
                        value={settings.favicon}
                        onChange={(e) => handleChange("favicon", e.target.value)}
                        placeholder="https://example.com/favicon.ico or upload a file"
                        className={validationErrors.favicon ? "flex-1 border-destructive" : "flex-1"}
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*,.ico"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file, "favicon", setUploadingFavicon);
                            }
                            e.target.value = "";
                          }}
                          disabled={uploadingFavicon}
                        />
                        <Button type="button" variant="outline" disabled={uploadingFavicon}>
                          {uploadingFavicon ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {settings.favicon && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleChange("favicon", "")}
                          title="Clear favicon"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {validationErrors.favicon ? (
                      <p className="text-sm text-destructive mt-1">
                        {validationErrors.favicon}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter a URL or upload a file (recommended size: 32x32px, .ico or .png)
                      </p>
                    )}

                    {/* Favicon Preview */}
                    {settings.favicon && !validationErrors.favicon && (
                      <div className="mt-4 p-4 bg-muted rounded-lg border">
                        <p className="text-sm font-medium mb-3">Preview:</p>
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 flex items-center justify-center border rounded">
                            <img
                              src={settings.favicon}
                              alt="Favicon preview"
                              className="w-4 h-4 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const errorMsg = e.currentTarget.parentElement?.nextElementSibling;
                                if (errorMsg) errorMsg.classList.remove('hidden');
                              }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">Favicon (16x16 or 32x32)</p>
                          <p className="text-sm text-destructive hidden">Failed to load icon</p>
                        </div>
                      </div>
                    )}
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

            {/* Audit Log */}
            <TabsContent value="audit">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Settings Audit Log</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track all changes made to platform settings
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Select
                      value={auditLogField || "all"}
                      onValueChange={(value) => {
                        setAuditLogField(value === "all" ? "" : value);
                        setAuditLogOffset(0);
                      }}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All fields</SelectItem>
                        {auditLogFields.map((field) => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadAuditLog}
                      disabled={loadingAuditLog}
                    >
                      {loadingAuditLog ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RotateCcw className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {loadingAuditLog ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : auditLog.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No audit log entries found</p>
                    <p className="text-sm">Changes to settings will appear here</p>
                  </div>
                ) : (
                  <>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium">Timestamp</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Admin</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Field</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Old Value</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">New Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {auditLog.map((entry) => (
                            <tr key={entry.id} className="hover:bg-muted/30">
                              <td className="px-4 py-3 text-sm">
                                {new Date(entry.timestamp).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className="font-medium">{entry.adminEmail}</span>
                                {entry.ipAddress && (
                                  <span className="text-muted-foreground ml-2 text-xs">
                                    ({entry.ipAddress})
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <code className="px-2 py-1 bg-muted rounded text-xs">
                                  {entry.fieldName}
                                </code>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`${
                                  entry.oldValue === '[REDACTED]' || entry.oldValue === '[SET]' || entry.oldValue === '[EMPTY]'
                                    ? 'text-muted-foreground italic'
                                    : ''
                                } max-w-[200px] truncate block`}>
                                  {entry.oldValue || '-'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`${
                                  entry.newValue === '[REDACTED]' || entry.newValue === '[SET]' || entry.newValue === '[EMPTY]'
                                    ? 'text-muted-foreground italic'
                                    : ''
                                } max-w-[200px] truncate block`}>
                                  {entry.newValue || '-'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing {auditLogOffset + 1}-{Math.min(auditLogOffset + AUDIT_LOG_LIMIT, auditLogTotal)} of {auditLogTotal} entries
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAuditLogOffset(Math.max(0, auditLogOffset - AUDIT_LOG_LIMIT))}
                          disabled={auditLogOffset === 0}
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAuditLogOffset(auditLogOffset + AUDIT_LOG_LIMIT)}
                          disabled={auditLogOffset + AUDIT_LOG_LIMIT >= auditLogTotal}
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Export Confirmation Dialog */}
      <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export Settings</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>
                  This will export your platform settings as a JSON file that can be imported later or used to configure another instance.
                </p>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="font-medium text-foreground">Included in export:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>General settings (name, description, emails)</li>
                    <li>Security settings (password rules, session, 2FA)</li>
                    <li>Course settings (visibility, certificates, reviews)</li>
                    <li>User settings (registration, roles, profiles)</li>
                    <li>Email settings (notifications, SMTP host/port/user)</li>
                    <li>Appearance settings (colors, logos, CSS)</li>
                  </ul>
                </div>
                <div className="flex items-start gap-2 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong>Security note:</strong> SMTP password is never exported for security reasons. You will need to re-enter it after importing settings.
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Settings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Preview Dialog */}
      <Dialog open={showImportPreview} onOpenChange={setShowImportPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Import Settings Preview</DialogTitle>
            <DialogDescription>
              Review the changes before applying them to your platform.
            </DialogDescription>
          </DialogHeader>

          {importPreview && (
            <div className="flex-1 overflow-auto space-y-4">
              {/* Metadata */}
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Export Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Platform:</span>{" "}
                    <span className="font-medium">{importPreview.meta?.platform || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Exported by:</span>{" "}
                    <span className="font-medium">{importPreview.meta?.exportedBy || "Unknown"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Exported on:</span>{" "}
                    <span className="font-medium">
                      {importPreview.meta?.exportedAt
                        ? new Date(importPreview.meta.exportedAt).toLocaleString()
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {importPreview.warnings.length > 0 && (
                <div className="flex items-start gap-2 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    {importPreview.warnings.map((warning, i) => (
                      <p key={i}>{warning}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation Errors */}
              {importPreview.validationErrors.length > 0 && (
                <div className="flex items-start gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Validation warnings (these fields will be skipped):</p>
                    <ul className="list-disc list-inside">
                      {importPreview.validationErrors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Changes Table */}
              <div>
                <h4 className="font-medium mb-2">Changes ({importPreview.changes.length})</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium">Setting</th>
                        <th className="text-left px-3 py-2 font-medium">Current</th>
                        <th className="text-left px-3 py-2 font-medium">New</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {importPreview.changes.map((change, i) => (
                        <tr key={i} className="hover:bg-muted/30">
                          <td className="px-3 py-2">
                            <div className="font-medium">{change.field}</div>
                            <div className="text-xs text-muted-foreground capitalize">{change.category}</div>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {change.currentValue}
                          </td>
                          <td className="px-3 py-2 text-primary font-medium">
                            {change.newValue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Backup Notice */}
              <div className="flex items-start gap-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  A backup of your current settings will be created automatically. You can undo this import after applying.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowImportPreview(false)} disabled={isImporting}>
              Cancel
            </Button>
            <Button onClick={confirmImport} disabled={isImporting}>
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Apply {importPreview?.changes.length || 0} Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
