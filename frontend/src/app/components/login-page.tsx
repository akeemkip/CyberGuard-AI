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

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-4">
              Demo Accounts - Click to Login:
            </p>
            <div className="space-y-2 text-xs">
              <div
                className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => {
                  setEmail("rajesh.singh@gmail.com");
                  setPassword("student123");
                }}
              >
                <div className="font-medium mb-1">Student Account - Rajesh Singh</div>
                <div className="text-muted-foreground">Active learner with 4 enrollments, 2 completed courses</div>
              </div>
              <div
                className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => {
                  setEmail("priya.persaud@yahoo.com");
                  setPassword("student123");
                }}
              >
                <div className="font-medium mb-1">Student Account - Priya Persaud</div>
                <div className="text-muted-foreground">Improving student, retook quiz and passed</div>
              </div>
              <div
                className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => {
                  setEmail("admin@cyberguard.com");
                  setPassword("admin123");
                }}
              >
                <div className="font-medium mb-1">Admin Account</div>
                <div className="text-muted-foreground">Full administrative access</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
