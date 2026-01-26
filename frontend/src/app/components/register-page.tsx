import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Moon, Sun, Loader2, AlertCircle, Eye, EyeOff, Check, X } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useAuth } from "../context/AuthContext";
import { usePlatformSettings } from "../context/PlatformSettingsContext";
import { PlatformLogo } from "./PlatformLogo";

// Password strength calculator
const getPasswordStrength = (password: string, minLength: number): { score: number; label: string; color: string } => {
  let score = 0;

  if (password.length >= minLength) score++;
  if (password.length >= minLength + 2) score++;
  if (password.length >= minLength + 6) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 2) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (score <= 4) return { score: 2, label: "Medium", color: "bg-yellow-500" };
  return { score: 3, label: "Strong", color: "bg-green-500" };
};

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function RegisterPage({
  onNavigate
}: {
  onNavigate: (page: string) => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const { register, isLoading, error, clearError } = useAuth();
  const { settings: platformSettings } = usePlatformSettings();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Computed values
  const minPasswordLength = platformSettings.minPasswordLength || 6;
  const passwordStrength = useMemo(() => getPasswordStrength(formData.password, minPasswordLength), [formData.password, minPasswordLength]);
  const emailValid = useMemo(() => isValidEmail(formData.email), [formData.email]);
  const emailTouched = formData.email.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    clearError();

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (formData.password.length < minPasswordLength) {
      setValidationError(`Password must be at least ${minPasswordLength} characters`);
      return;
    }

    // register() returns true on success, false on failure
    // Error message is stored in context's error state
    const success = await register(formData.email, formData.password, formData.firstName, formData.lastName);

    if (success) {
      // Navigate to success page to show animation
      // Store first name for the success message
      localStorage.setItem('newUserFirstName', formData.firstName);
      onNavigate("register-success");
    }
    // If failed, error is already set in context and will display
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Show validation errors first, then API errors
  const displayError = validationError || error;

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

      {/* Register Form */}
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                <p className="text-muted-foreground">Start your cybersecurity journey today</p>
              </div>

              {displayError && (
                <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{displayError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      autoComplete="given-name"
                      className="bg-input-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      autoComplete="family-name"
                      className="bg-input-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      autoComplete="email"
                      className={`bg-input-background pr-10 ${emailTouched && !emailValid ? "border-red-500 focus-visible:ring-red-500" : ""} ${emailTouched && emailValid ? "border-green-500 focus-visible:ring-green-500" : ""}`}
                    />
                    {emailTouched && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {emailValid ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {emailTouched && !emailValid && (
                    <p className="text-xs text-red-500">Please enter a valid email address</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      autoComplete="new-password"
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
                  {/* Password Strength Indicator */}
                  {formData.password.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        <div className={`h-1 flex-1 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : "bg-muted"}`} />
                        <div className={`h-1 flex-1 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : "bg-muted"}`} />
                        <div className={`h-1 flex-1 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : "bg-muted"}`} />
                      </div>
                      <p className={`text-xs ${passwordStrength.score === 1 ? "text-red-500" : passwordStrength.score === 2 ? "text-yellow-500" : "text-green-500"}`}>
                        {passwordStrength.label} password
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">Use {minPasswordLength}+ characters with uppercase, numbers & symbols for a stronger password</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      autoComplete="new-password"
                      className={`bg-input-background pr-10 ${formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword ? "border-red-500" : ""} ${formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword ? "border-green-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                  {formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword && (
                    <p className="text-xs text-green-500">Passwords match</p>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    disabled={isLoading}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm font-normal">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => onNavigate("terms-of-service")}
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => onNavigate("privacy-policy")}
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </button>
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={() => onNavigate("login")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
        </Card>
      </div>
    </div>
  );
}
