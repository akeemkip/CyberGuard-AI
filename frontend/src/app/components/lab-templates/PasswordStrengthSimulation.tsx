import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Info,
  RefreshCw,
  Trophy,
  Lightbulb,
} from "lucide-react";
import { PasswordStrengthConfig } from "../../services/admin.service";

interface PasswordStrengthSimulationProps {
  config: PasswordStrengthConfig;
  passingScore: number;
  onComplete: (score: number, passed: boolean, answers: Record<string, boolean>) => void;
}

interface PasswordAnalysis {
  meetsLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecial: boolean;
  isBanned: boolean;
  strength: 'weak' | 'fair' | 'good' | 'strong';
  strengthPercent: number;
  score: number;
}

export function PasswordStrengthSimulation({
  config,
  passingScore,
  onComplete,
}: PasswordStrengthSimulationProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const analysis = useMemo((): PasswordAnalysis => {
    const { requirements, bannedPasswords } = config;

    const meetsLength = password.length >= requirements.minLength;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const isBanned = bannedPasswords.some(bp =>
      password.toLowerCase() === bp.toLowerCase() ||
      password.toLowerCase().includes(bp.toLowerCase())
    );

    // Calculate requirements met
    let requirementsMet = 0;
    let totalRequirements = 1; // minLength is always required

    if (meetsLength) requirementsMet++;
    if (requirements.requireUppercase) {
      totalRequirements++;
      if (hasUppercase) requirementsMet++;
    }
    if (requirements.requireNumbers) {
      totalRequirements++;
      if (hasNumbers) requirementsMet++;
    }
    if (requirements.requireSpecial) {
      totalRequirements++;
      if (hasSpecial) requirementsMet++;
    }

    // Bonus points for extras
    let bonusPoints = 0;
    if (!requirements.requireUppercase && hasUppercase) bonusPoints += 5;
    if (!requirements.requireNumbers && hasNumbers) bonusPoints += 5;
    if (!requirements.requireSpecial && hasSpecial) bonusPoints += 5;
    if (hasLowercase && hasUppercase) bonusPoints += 5;
    if (password.length > requirements.minLength + 4) bonusPoints += 10;

    // Calculate base score
    let score = Math.round((requirementsMet / totalRequirements) * 100);

    // Apply bonus (max 100)
    score = Math.min(100, score + bonusPoints);

    // Penalty for banned password
    if (isBanned) {
      score = Math.max(0, score - 50);
    }

    // Determine strength
    let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
    let strengthPercent = 25;

    if (password.length === 0) {
      strengthPercent = 0;
    } else if (isBanned || score < 40) {
      strength = 'weak';
      strengthPercent = 25;
    } else if (score < 70) {
      strength = 'fair';
      strengthPercent = 50;
    } else if (score < 90) {
      strength = 'good';
      strengthPercent = 75;
    } else {
      strength = 'strong';
      strengthPercent = 100;
    }

    return {
      meetsLength,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSpecial,
      isBanned,
      strength,
      strengthPercent,
      score,
    };
  }, [password, config]);

  const passed = analysis.score >= passingScore && !analysis.isBanned;

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowResults(true);
    onComplete(analysis.score, passed, {
      meetsLength: analysis.meetsLength.toString(),
      hasUppercase: analysis.hasUppercase.toString(),
      hasNumbers: analysis.hasNumbers.toString(),
      hasSpecial: analysis.hasSpecial.toString(),
      isBanned: (!analysis.isBanned).toString(),
    } as unknown as Record<string, boolean>);
  };

  const handleRetry = () => {
    setPassword("");
    setIsSubmitted(false);
    setShowResults(false);
    setShowHints(false);
  };

  const getStrengthColor = () => {
    switch (analysis.strength) {
      case 'weak': return 'bg-red-500';
      case 'fair': return 'bg-yellow-500';
      case 'good': return 'bg-blue-500';
      case 'strong': return 'bg-green-500';
    }
  };

  const getStrengthTextColor = () => {
    switch (analysis.strength) {
      case 'weak': return 'text-red-600';
      case 'fair': return 'text-yellow-600';
      case 'good': return 'text-blue-600';
      case 'strong': return 'text-green-600';
    }
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-8 text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            passed ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
          }`}>
            {passed ? (
              <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            )}
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {passed ? "Strong Password Created!" : "Password Needs Improvement"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {passed
              ? "You've created a password that meets security requirements."
              : "Review the requirements and try again to create a stronger password."}
          </p>

          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{analysis.score}%</p>
              <p className="text-sm text-muted-foreground">Your Score</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{passingScore}%</p>
              <p className="text-sm text-muted-foreground">Passing Score</p>
            </div>
            <div className="text-center">
              <p className={`text-4xl font-bold capitalize ${getStrengthTextColor()}`}>
                {analysis.strength}
              </p>
              <p className="text-sm text-muted-foreground">Strength</p>
            </div>
          </div>

          {/* Requirements Breakdown */}
          <div className="text-left mb-8">
            <h3 className="font-semibold mb-4">Requirements Check</h3>
            <div className="space-y-2">
              <RequirementItem
                met={analysis.meetsLength}
                label={`At least ${config.requirements.minLength} characters`}
                detail={`Your password: ${password.length} characters`}
              />
              {config.requirements.requireUppercase && (
                <RequirementItem
                  met={analysis.hasUppercase}
                  label="Contains uppercase letter (A-Z)"
                />
              )}
              {config.requirements.requireNumbers && (
                <RequirementItem
                  met={analysis.hasNumbers}
                  label="Contains number (0-9)"
                />
              )}
              {config.requirements.requireSpecial && (
                <RequirementItem
                  met={analysis.hasSpecial}
                  label="Contains special character (!@#$%^&*)"
                />
              )}
              <RequirementItem
                met={!analysis.isBanned}
                label="Not a commonly used password"
                isWarning={analysis.isBanned}
              />
            </div>
          </div>

          {/* Bonus Points */}
          <div className="text-left mb-8">
            <h3 className="font-semibold mb-4">Bonus Strengths</h3>
            <div className="space-y-2">
              {analysis.hasLowercase && analysis.hasUppercase && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Mixed case letters (+5 points)
                </div>
              )}
              {password.length > config.requirements.minLength + 4 && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Extra length (+10 points)
                </div>
              )}
              {!config.requirements.requireUppercase && analysis.hasUppercase && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Optional uppercase (+5 points)
                </div>
              )}
              {!config.requirements.requireNumbers && analysis.hasNumbers && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Optional numbers (+5 points)
                </div>
              )}
              {!config.requirements.requireSpecial && analysis.hasSpecial && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Optional special characters (+5 points)
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleRetry} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Scenario */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Create a Strong Password</h2>
            <p className="text-muted-foreground">{config.scenario}</p>
          </div>
        </div>
      </Card>

      {/* Password Requirements */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          Password Requirements
        </h3>
        <div className="space-y-2">
          <RequirementItem
            met={analysis.meetsLength}
            label={`At least ${config.requirements.minLength} characters`}
            showStatus={password.length > 0}
          />
          {config.requirements.requireUppercase && (
            <RequirementItem
              met={analysis.hasUppercase}
              label="At least one uppercase letter (A-Z)"
              showStatus={password.length > 0}
            />
          )}
          {config.requirements.requireNumbers && (
            <RequirementItem
              met={analysis.hasNumbers}
              label="At least one number (0-9)"
              showStatus={password.length > 0}
            />
          )}
          {config.requirements.requireSpecial && (
            <RequirementItem
              met={analysis.hasSpecial}
              label="At least one special character (!@#$%^&*)"
              showStatus={password.length > 0}
            />
          )}
        </div>
      </Card>

      {/* Password Input */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Enter Your Password</h3>
        <div className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password..."
              className="pr-12 text-lg font-mono"
              disabled={isSubmitted}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Strength Meter */}
          {password.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Password Strength</span>
                <Badge
                  variant="outline"
                  className={`capitalize ${getStrengthTextColor()}`}
                >
                  {analysis.strength}
                </Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                  style={{ width: `${analysis.strengthPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Banned Password Warning */}
          {analysis.isBanned && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">Common Password Detected</p>
                <p className="text-sm text-red-600 dark:text-red-300">
                  This password is too common and easily guessable. Please choose a more unique password.
                </p>
              </div>
            </div>
          )}

          {/* Character Count */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{password.length} characters</span>
            <span>
              {password.length >= config.requirements.minLength
                ? "Length OK"
                : `Need ${config.requirements.minLength - password.length} more`}
            </span>
          </div>
        </div>
      </Card>

      {/* Hints */}
      {config.hints && config.hints.length > 0 && (
        <Card className="p-6">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => setShowHints(!showHints)}
          >
            <span className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Need Help? View Hints
            </span>
            <Badge variant="secondary">{config.hints.length} tips</Badge>
          </Button>

          {showHints && (
            <div className="mt-4 space-y-2">
              {config.hints.map((hint, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                >
                  <Info className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm">{hint}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Submit */}
      <Card className="p-4">
        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={password.length === 0}
        >
          Submit Password
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Score at least {passingScore}% to pass this exercise
        </p>
      </Card>
    </div>
  );
}

interface RequirementItemProps {
  met: boolean;
  label: string;
  detail?: string;
  showStatus?: boolean;
  isWarning?: boolean;
}

function RequirementItem({ met, label, detail, showStatus = true, isWarning = false }: RequirementItemProps) {
  return (
    <div className={`flex items-start gap-3 p-2 rounded ${
      showStatus
        ? met
          ? 'bg-green-50 dark:bg-green-950/50'
          : isWarning
            ? 'bg-red-50 dark:bg-red-950/50'
            : 'bg-muted/50'
        : ''
    }`}>
      {showStatus ? (
        met ? (
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        ) : isWarning ? (
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        )
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground flex-shrink-0" />
      )}
      <div>
        <span className={`text-sm ${showStatus && met ? 'text-green-700 dark:text-green-300' : ''}`}>
          {label}
        </span>
        {detail && (
          <p className="text-xs text-muted-foreground">{detail}</p>
        )}
      </div>
    </div>
  );
}
