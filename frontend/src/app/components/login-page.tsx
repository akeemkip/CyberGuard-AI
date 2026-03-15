import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { devLog } from "../utils/logger";
import { Moon, Sun, Loader2, AlertCircle, Eye, EyeOff, Lock, Unlock, ShieldCheck, Fingerprint, KeyRound } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useAuth } from "../context/AuthContext";
import { usePlatformSettings } from "../context/PlatformSettingsContext";
import { PlatformLogo } from "./PlatformLogo";
import { motion } from "motion/react";

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

    const success = await login(trimmedEmail, trimmedPassword);

    if (success) {
      devLog('Login successful');
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

  const securityPanel = (
    <div className="hidden lg:flex w-full max-w-sm flex-col items-center justify-center gap-6">
      {/* Animated padlock */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Outer pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Mid ring */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-primary/30"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        {/* Inner glow circle */}
        <motion.div
          className="absolute inset-8 rounded-full bg-primary/5"
          animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />

        {/* Central padlock icon */}
        <motion.div
          className="relative z-10 w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ rotate: [0, 0, 0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Lock className="w-10 h-10 text-primary" />
          </motion.div>
        </motion.div>

        {/* Orbiting security icons */}
        {[
          { Icon: ShieldCheck, delay: 0, angle: 0 },
          { Icon: Fingerprint, delay: 1, angle: 120 },
          { Icon: KeyRound, delay: 2, angle: 240 },
        ].map(({ Icon, delay, angle }) => (
          <motion.div
            key={angle}
            className="absolute w-9 h-9 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center"
            animate={{
              rotate: [angle, angle + 360],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear", delay }}
            style={{
              transformOrigin: "center",
              offsetPath: "circle(80px at 50% 50%)",
              offsetDistance: `${(angle / 360) * 100}%`,
            }}
            initial={false}
          >
            <motion.div
              animate={{ rotate: [-(angle), -(angle + 360)] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear", delay }}
            >
              <Icon className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Text below */}
      <div className="text-center space-y-2">
        <motion.h3
          className="text-lg font-semibold text-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Secure Access
        </motion.h3>
        <motion.p
          className="text-sm text-muted-foreground max-w-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Your cybersecurity training environment is protected with enterprise-grade security
        </motion.p>
      </div>
    </div>
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
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 w-full max-w-3xl">
          {loginForm}
          {securityPanel}
        </div>
      </div>
    </div>
  );
}
