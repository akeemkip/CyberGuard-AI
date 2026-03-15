import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { devLog } from "../utils/logger";
import { Moon, Sun, Loader2, AlertCircle, Eye, EyeOff, Shield, User, CheckCircle, Clock } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useAuth } from "../context/AuthContext";
import { usePlatformSettings } from "../context/PlatformSettingsContext";
import { PlatformLogo } from "./PlatformLogo";

interface DemoAccount {
  name: string;
  email: string;
  password: string;
  color: string;
  label: string;
  description: string;
  assessmentStatus: "completed" | "needs-assessment";
  role: "student" | "admin";
}

const demoAccounts: DemoAccount[] = [
  {
    name: "Vishnu Bisram",
    email: "vishnu.bisram@outlook.com",
    password: "student123",
    color: "green",
    label: "Safe Zone",
    description: "3 courses completed, top quiz scores, all labs done",
    assessmentStatus: "completed",
    role: "student",
  },
  {
    name: "Rajesh Singh",
    email: "rajesh.singh@gmail.com",
    password: "student123",
    color: "emerald",
    label: "Active Learner",
    description: "4 enrollments, 2 completed, strong scores",
    assessmentStatus: "completed",
    role: "student",
  },
  {
    name: "Priya Persaud",
    email: "priya.persaud@yahoo.com",
    password: "student123",
    color: "red",
    label: "High Risk",
    description: "Struggling student, failed then improved",
    assessmentStatus: "completed",
    role: "student",
  },
  {
    name: "Kumar Ramnauth",
    email: "kumar.ramnauth@outlook.com",
    password: "student123",
    color: "cyan",
    label: "Brand New",
    description: "Just started, no assessment taken yet",
    assessmentStatus: "needs-assessment",
    role: "student",
  },
  {
    name: "Arjun Jaipaul",
    email: "arjun.jaipaul@yahoo.com",
    password: "student123",
    color: "slate",
    label: "Fresh Account",
    description: "Halfway through courses, no assessment yet",
    assessmentStatus: "needs-assessment",
    role: "student",
  },
  {
    name: "Admin",
    email: "admin@cyberguard.com",
    password: "admin123",
    color: "purple",
    label: "Administrator",
    description: "Full platform access",
    assessmentStatus: "completed",
    role: "admin",
  },
];

function getColorClasses(color: string) {
  const map: Record<string, { bg: string; border: string; hover: string; name: string; desc: string; badge: string }> = {
    green: {
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
      hover: "hover:bg-green-100 dark:hover:bg-green-950/50",
      name: "text-green-900 dark:text-green-100",
      desc: "text-green-700 dark:text-green-300",
      badge: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-800",
      hover: "hover:bg-emerald-100 dark:hover:bg-emerald-950/50",
      name: "text-emerald-900 dark:text-emerald-100",
      desc: "text-emerald-700 dark:text-emerald-300",
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-800",
      hover: "hover:bg-red-100 dark:hover:bg-red-950/50",
      name: "text-red-900 dark:text-red-100",
      desc: "text-red-700 dark:text-red-300",
      badge: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
    },
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-950/30",
      border: "border-cyan-200 dark:border-cyan-800",
      hover: "hover:bg-cyan-100 dark:hover:bg-cyan-950/50",
      name: "text-cyan-900 dark:text-cyan-100",
      desc: "text-cyan-700 dark:text-cyan-300",
      badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200",
    },
    slate: {
      bg: "bg-slate-50 dark:bg-slate-950/30",
      border: "border-slate-200 dark:border-slate-800",
      hover: "hover:bg-slate-100 dark:hover:bg-slate-950/50",
      name: "text-slate-900 dark:text-slate-100",
      desc: "text-slate-700 dark:text-slate-300",
      badge: "bg-slate-100 text-slate-800 dark:bg-slate-900/50 dark:text-slate-200",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-200 dark:border-purple-800",
      hover: "hover:bg-purple-100 dark:hover:bg-purple-950/50",
      name: "text-purple-900 dark:text-purple-100",
      desc: "text-purple-700 dark:text-purple-300",
      badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
    },
  };
  return map[color] ?? map.slate;
}

export function LoginPage({
  onNavigate
}: {
  onNavigate: (page: string) => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const { login, isLoading, error, clearError } = useAuth();
  const { settings: platformSettings } = usePlatformSettings();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return;
    }

    // login() returns true on success, false on failure
    // Error message is stored in context's error state
    const success = await login(trimmedEmail, trimmedPassword);

    if (success) {
      // Navigation is handled by App.tsx useEffect when user state changes
      devLog('Login successful');
    }
    // If failed, error is already set in context and will display
  };

  const handleDemoLogin = async (account: DemoAccount) => {
    clearError();
    setEmail(account.email);
    setPassword(account.password);

    const success = await login(account.email, account.password);
    if (success) {
      devLog('Demo login successful');
    }
  };

  const loginForm = (
    <Card className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-muted-foreground">Sign in to continue your training</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            autoComplete="email"
            className="bg-input-background"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              onClick={() => onNavigate("reset-password")}
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="--------"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
              className="bg-input-background pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            onClick={() => onNavigate("register")}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </Card>
  );

  const demoPanel = (
    <Card className="w-full max-w-sm p-6">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold">Demo Accounts</h2>
        <p className="text-xs text-muted-foreground mt-1">Click any account to sign in instantly</p>
      </div>

      <div className="space-y-2">
        {demoAccounts.map((account) => {
          const colors = getColorClasses(account.color);
          return (
            <button
              key={account.email}
              type="button"
              disabled={isLoading}
              onClick={() => handleDemoLogin(account)}
              className={`w-full text-left p-3 rounded-lg border cursor-pointer transition-colors ${colors.bg} ${colors.border} ${colors.hover} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-2 mb-1">
                {account.role === "admin" ? (
                  <Shield className={`w-3.5 h-3.5 ${colors.name}`} />
                ) : (
                  <User className={`w-3.5 h-3.5 ${colors.name}`} />
                )}
                <span className={`text-sm font-medium ${colors.name}`}>{account.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${colors.badge}`}>
                  {account.label}
                </span>
              </div>
              <p className={`text-xs ${colors.desc} mb-1.5`}>{account.description}</p>
              <div className="flex items-center gap-1">
                {account.assessmentStatus === "completed" ? (
                  <>
                    <CheckCircle className={`w-3 h-3 ${colors.desc}`} />
                    <span className={`text-[10px] ${colors.desc}`}>Assessment completed</span>
                  </>
                ) : (
                  <>
                    <Clock className={`w-3 h-3 ${colors.desc}`} />
                    <span className={`text-[10px] ${colors.desc}`}>New - needs assessment</span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate("landing")}
          >
            <PlatformLogo className="w-10 h-10" iconClassName="w-6 h-6" />
            <span className="text-xl font-semibold">{platformSettings.platformName}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Login Content */}
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
        {import.meta.env.DEV ? (
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 w-full max-w-3xl">
            {loginForm}
            {demoPanel}
          </div>
        ) : (
          loginForm
        )}
      </div>
    </div>
  );
}
