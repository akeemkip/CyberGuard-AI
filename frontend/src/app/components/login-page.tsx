import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Moon, Sun, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useAuth } from "../context/AuthContext";
import { usePlatformSettings } from "../context/PlatformSettingsContext";
import { PlatformLogo } from "./PlatformLogo";

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
      console.log('✅ Login successful');
    }
    // If failed, error is already set in context and will display
  };

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
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
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

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="••••••••"
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

          {/* Demo accounts - only shown in development */}
          {import.meta.env.DEV && (
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">
              <strong>Demo Accounts</strong> - Click to auto-fill credentials
            </p>
            <div className="space-y-2 text-xs">
              {/* Excellent Phishing Performers */}
              <div
                className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors"
                onClick={() => {
                  setEmail("student@example.com");
                  setPassword("student123");
                }}
              >
                <div className="font-medium mb-1 text-green-900 dark:text-green-100">🌟 John Doe - Perfect Score</div>
                <div className="text-green-700 dark:text-green-300">Phishing: 8/8 attempts (100%) • Avg response: 22s • Course completed</div>
              </div>

              <div
                className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors"
                onClick={() => {
                  setEmail("rajesh.singh@gmail.com");
                  setPassword("student123");
                }}
              >
                <div className="font-medium mb-1 text-emerald-900 dark:text-emerald-100">🏆 Rajesh Singh - Top Performer</div>
                <div className="text-emerald-700 dark:text-emerald-300">Phishing: 7/7 attempts (100%) • Avg response: 10s • Course completed</div>
              </div>

              {/* Good Performers */}
              <div
                className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
                onClick={() => {
                  setEmail("priya.persaud@yahoo.com");
                  setPassword("student123");
                }}
              >
                <div className="font-medium mb-1 text-blue-900 dark:text-blue-100">⭐ Priya Persaud - Good Student</div>
                <div className="text-blue-700 dark:text-blue-300">Phishing: 5/6 attempts (83.3%) • Course completed • Above average</div>
              </div>

              <div
                className="p-3 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg cursor-pointer hover:bg-cyan-100 dark:hover:bg-cyan-950/50 transition-colors"
                onClick={() => {
                  setEmail("kumar.ramnauth@outlook.com");
                  setPassword("student123");
                }}
              >
                <div className="font-medium mb-1 text-cyan-900 dark:text-cyan-100">📘 Kumar Ramnauth - Solid Performance</div>
                <div className="text-cyan-700 dark:text-cyan-300">Phishing: 6/7 attempts (85.7%) • Course completed • Reliable</div>
              </div>

              {/* Poor Performers */}
              <div
                className="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors"
                onClick={() => {
                  setEmail("anita.khan@gmail.com");
                  setPassword("student123");
                }}
              >
                <div className="font-medium mb-1 text-orange-900 dark:text-orange-100">⚠️ Anita Khan - Needs Improvement</div>
                <div className="text-orange-700 dark:text-orange-300">Phishing: 3/7 attempts (42.9%) • High click rate • Needs training</div>
              </div>

              <div
                className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                onClick={() => {
                  setEmail("simran.samaroo@outlook.com");
                  setPassword("student123");
                }}
              >
                <div className="font-medium mb-1 text-red-900 dark:text-red-100">🚨 Simran Samaroo - High Risk</div>
                <div className="text-red-700 dark:text-red-300">Phishing: 3/8 attempts (37.5%) • Clicked malicious links • At-risk</div>
              </div>

              {/* Fresh Account */}
              <div
                className="p-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-950/50 transition-colors"
                onClick={() => {
                  setEmail("arjun.jaipaul@yahoo.com");
                  setPassword("student123");
                }}
              >
                <div className="font-medium mb-1 text-slate-900 dark:text-slate-100">🆕 Arjun Jaipaul - Fresh Account</div>
                <div className="text-slate-700 dark:text-slate-300">No phishing attempts • No course completion • Clean slate</div>
              </div>

              {/* Admin Account */}
              <div
                className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors"
                onClick={() => {
                  setEmail("admin@cyberguard.com");
                  setPassword("admin123");
                }}
              >
                <div className="font-medium mb-1 text-purple-900 dark:text-purple-100">👨‍💼 Admin Account (Password: admin123)</div>
                <div className="text-purple-700 dark:text-purple-300">Full platform access • Manage users, courses, phishing data, analytics</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              All student passwords: <strong>student123</strong>
            </p>
          </div>
          )}
        </Card>
      </div>
    </div>
  );
}
