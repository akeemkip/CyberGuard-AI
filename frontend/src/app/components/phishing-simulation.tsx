import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Shield,
  Moon,
  Sun,
  Mail,
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  ShieldX,
  Trash2,
  MousePointer2,
  CheckCircle,
  XCircle,
  ChevronRight,
  Paperclip,
  Loader2,
  Target,
  TrendingUp,
  Clock,
  Trophy,
  Award,
  RotateCcw,
  PartyPopper,
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { usePlatformSettings } from "../context/PlatformSettingsContext";
import { PlatformLogo } from "./PlatformLogo";
import phishingService, {
  PhishingScenario,
  PhishingStats,
  PhishingAction,
  AttemptResult,
  PhishingProgress,
} from "../services/phishing.service";

interface PhishingSimulationProps {
  onNavigate: (page: string) => void;
}

export function PhishingSimulation({ onNavigate }: PhishingSimulationProps) {
  const { theme, toggleTheme } = useTheme();
  const { settings: platformSettings } = usePlatformSettings();

  const [isLoading, setIsLoading] = useState(true);
  const [scenario, setScenario] = useState<PhishingScenario | null>(null);
  const [stats, setStats] = useState<PhishingStats | null>(null);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<PhishingProgress | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer for response time tracking
  const startTimeRef = useRef<number>(0);

  const fetchScenario = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setResult(null);
      startTimeRef.current = Date.now();

      const [scenarioResponse, statsData] = await Promise.all([
        phishingService.getNextScenario(),
        phishingService.getStats(),
      ]);

      setProgress(scenarioResponse.progress);
      setStats(statsData);

      // Check if all scenarios are completed
      if (scenarioResponse.progress.allCompleted && scenarioResponse.progress.allCorrect) {
        setIsCompleted(true);
        setScenario(null);
      } else {
        setScenario(scenarioResponse.scenario);
        setIsCompleted(false);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("No scenarios available. Please check back later.");
      } else {
        setError("Failed to load scenario. Please try again.");
      }
      console.error("Error fetching scenario:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestartSimulation = async () => {
    // Reset completion state and fetch new scenario
    setIsCompleted(false);
    fetchScenario();
  };

  useEffect(() => {
    fetchScenario();
  }, []);

  const handleAction = async (action: PhishingAction) => {
    if (!scenario || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const responseTimeMs = Date.now() - startTimeRef.current;

      const attemptResult = await phishingService.submitAttempt(
        scenario.id,
        action,
        responseTimeMs
      );

      setResult(attemptResult);

      // Refresh stats after submission
      const newStats = await phishingService.getStats();
      setStats(newStats);
    } catch (err) {
      console.error("Error submitting attempt:", err);
      setError("Failed to submit your answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextScenario = () => {
    fetchScenario();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading phishing simulation...</p>
        </div>
      </div>
    );
  }

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
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <PlatformLogo className="w-10 h-10" iconClassName="w-6 h-6" />
              <div>
                <span className="text-xl font-semibold">{platformSettings.platformName}</span>
                <span className="text-muted-foreground ml-2">/ Phishing Simulation</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {progress && (
              <div className="hidden md:flex items-center gap-2 text-sm bg-muted/50 px-3 py-1.5 rounded-full">
                <span className="font-medium">{progress.completed}/{progress.total}</span>
                <span className="text-muted-foreground">Completed</span>
              </div>
            )}
            {stats && (
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="font-medium">{stats.accuracy}%</span>
                  <span className="text-muted-foreground">Accuracy</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{stats.streak}</span>
                  <span className="text-muted-foreground">Streak</span>
                </div>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Completion Screen */}
        {isCompleted && stats ? (
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 text-center overflow-hidden relative">
              {/* Celebration background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-primary/10 to-yellow-500/10" />

              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Award className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl font-bold mb-2">
                  {progress?.allCompleted ? "Simulation Complete!" : "Session Summary"}
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  {progress?.allCompleted
                    ? `You've completed all ${progress?.total} phishing scenarios`
                    : `You've completed ${progress?.completed} of ${progress?.total} scenarios`}
                </p>

                {/* Final Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-background/80 rounded-lg border">
                    <p className="text-3xl font-bold text-primary">{stats.accuracy}%</p>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </div>
                  <div className="p-4 bg-background/80 rounded-lg border">
                    <p className="text-3xl font-bold text-green-600">{stats.correctAttempts}</p>
                    <p className="text-sm text-muted-foreground">Correct</p>
                  </div>
                  <div className="p-4 bg-background/80 rounded-lg border">
                    <p className="text-3xl font-bold text-yellow-600">{stats.streak}</p>
                    <p className="text-sm text-muted-foreground">Best Streak</p>
                  </div>
                  <div className="p-4 bg-background/80 rounded-lg border">
                    <p className="text-3xl font-bold">{(stats.avgResponseTimeMs / 1000).toFixed(1)}s</p>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                  </div>
                </div>

                {/* Performance Summary */}
                <div className="bg-background/80 rounded-lg border p-6 mb-8 text-left">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Performance by Difficulty
                  </h3>
                  <div className="space-y-3">
                    {stats.byDifficulty.map((diff) => (
                      <div key={diff.difficulty}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{diff.difficulty}</span>
                          <span className="text-muted-foreground">
                            {diff.correct}/{diff.total} correct ({diff.accuracy}%)
                          </span>
                        </div>
                        <Progress
                          value={diff.accuracy}
                          className={`h-2 ${
                            diff.difficulty === "Beginner"
                              ? "[&>div]:bg-green-500"
                              : diff.difficulty === "Intermediate"
                              ? "[&>div]:bg-yellow-500"
                              : "[&>div]:bg-red-500"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Click Rate Warning */}
                {stats.clickRate > 0 && (
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800 p-4 mb-8 text-left">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-semibold">Area for Improvement</span>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      You clicked links in {stats.clickRate}% of phishing emails. Remember to always verify links before clicking!
                    </p>
                  </div>
                )}

                {/* Achievement Badge */}
                {stats.accuracy >= 80 && (
                  <div className="bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700 p-4 mb-8">
                    <div className="flex items-center justify-center gap-2 text-yellow-700 dark:text-yellow-400">
                      <Trophy className="w-6 h-6" />
                      <span className="font-semibold text-lg">
                        {stats.accuracy >= 90 ? "Phishing Expert!" : "Great Job!"}
                      </span>
                      <Trophy className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                      {stats.accuracy >= 90
                        ? "Outstanding performance! You're well-equipped to spot phishing attempts."
                        : "You've demonstrated strong phishing awareness skills."}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleRestartSimulation} size="lg" className="gap-2">
                    <RotateCcw className="w-5 h-5" />
                    Practice Again
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => onNavigate("student-dashboard")}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : error && !scenario ? (
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Scenarios Available</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => onNavigate("student-dashboard")}>
              Back to Dashboard
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Email Display */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                {/* Email Header */}
                {scenario && (
                  <>
                    <div className="p-6 border-b bg-muted/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-semibold text-primary text-lg">
                              {scenario.senderName[0]?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold">{scenario.senderName}</p>
                            <p className="text-sm text-muted-foreground">
                              &lt;{scenario.senderEmail}&gt;
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{scenario.difficulty}</Badge>
                          <Badge variant="secondary">{scenario.category}</Badge>
                        </div>
                      </div>
                      <h1 className="text-xl font-semibold">{scenario.subject}</h1>
                      {scenario.attachments && scenario.attachments.length > 0 && (
                        <div className="flex items-center gap-2 mt-3">
                          <Paperclip className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {scenario.attachments.length} attachment(s): {scenario.attachments.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Email Body */}
                    <div className="p-6 min-h-[300px]">
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none [&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer"
                        dangerouslySetInnerHTML={{ __html: scenario.body }}
                        onClick={(e) => {
                          // Intercept link clicks within the email body
                          const target = e.target as HTMLElement;
                          if (target.tagName === 'A' || target.closest('a')) {
                            e.preventDefault();
                            e.stopPropagation();
                            // Trigger the "Click Link" action when user clicks a link in the email
                            if (!result && !isSubmitting) {
                              handleAction("CLICKED_LINK");
                            }
                          }
                        }}
                      />
                    </div>

                    {/* Action Buttons or Result */}
                    {!result ? (
                      <div className="p-6 border-t bg-muted/30">
                        <p className="text-center text-sm text-muted-foreground mb-4">
                          What would you do with this email?
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                          <Button
                            variant="destructive"
                            size="lg"
                            onClick={() => handleAction("REPORTED")}
                            disabled={isSubmitting}
                            className="gap-2 min-w-[140px]"
                          >
                            <ShieldX className="w-5 h-5" />
                            Report Phishing
                          </Button>
                          <Button
                            variant="default"
                            size="lg"
                            onClick={() => handleAction("MARKED_SAFE")}
                            disabled={isSubmitting}
                            className="gap-2 min-w-[140px] bg-green-600 hover:bg-green-700"
                          >
                            <ShieldCheck className="w-5 h-5" />
                            Mark Safe
                          </Button>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleAction("CLICKED_LINK")}
                            disabled={isSubmitting}
                            className="gap-2 min-w-[140px]"
                          >
                            <MousePointer2 className="w-5 h-5" />
                            Click Link
                          </Button>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleAction("DELETED")}
                            disabled={isSubmitting}
                            className="gap-2 min-w-[140px]"
                          >
                            <Trash2 className="w-5 h-5" />
                            Delete
                          </Button>
                        </div>
                        {isSubmitting && (
                          <div className="flex items-center justify-center mt-4 gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting...</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`p-6 border-t ${
                          result.isCorrect
                            ? "bg-green-50 dark:bg-green-950/30"
                            : "bg-red-50 dark:bg-red-950/30"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          {result.isCorrect ? (
                            <CheckCircle className="w-8 h-8 text-green-600" />
                          ) : (
                            <XCircle className="w-8 h-8 text-red-600" />
                          )}
                          <div>
                            <h3
                              className={`text-xl font-semibold ${
                                result.isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                              }`}
                            >
                              {result.isCorrect ? "Correct!" : "Incorrect"}
                            </h3>
                            <p className="text-muted-foreground">
                              {result.explanation}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant={result.wasPhishing ? "destructive" : "default"} className={!result.wasPhishing ? "bg-green-600" : ""}>
                            {result.wasPhishing ? "This was Phishing" : "This was Legitimate"}
                          </Badge>
                          <Badge variant="outline">
                            Your action: {result.userAction.replace("_", " ")}
                          </Badge>
                        </div>

                        {result.wasPhishing && result.redFlags.length > 0 && (
                          <div className="bg-background/50 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-600" />
                              Red Flags to Watch For:
                            </h4>
                            <ul className="space-y-2">
                              {result.redFlags.map((flag, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <span className="text-yellow-600 mt-1">•</span>
                                  {flag}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {!result.wasPhishing && result.legitimateReason && (
                          <div className="bg-background/50 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-green-600" />
                              Why This Email is Legitimate:
                            </h4>
                            <p className="text-sm">{result.legitimateReason}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                          {progress && progress.completed < progress.total ? (
                            <Button onClick={handleNextScenario} className="gap-2">
                              Next Scenario
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button onClick={() => setIsCompleted(true)} className="gap-2 bg-green-600 hover:bg-green-700">
                              <Award className="w-4 h-4" />
                              View Results
                            </Button>
                          )}
                          {progress && progress.completed > 0 && progress.completed < progress.total && (
                            <Button
                              variant="secondary"
                              onClick={() => setIsCompleted(true)}
                              className="gap-2"
                            >
                              <Award className="w-4 h-4" />
                              Finish & View Results
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => onNavigate("student-dashboard")}
                          >
                            Back to Dashboard
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              {/* Progress Card */}
              {progress && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Session Progress
                  </h3>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Scenarios</span>
                      <span className="font-semibold">{progress.completed} / {progress.total}</span>
                    </div>
                    <Progress value={progress.total > 0 ? (progress.completed / progress.total) * 100 : 0} className="h-3" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {progress.total - progress.completed} remaining
                  </p>
                </Card>
              )}

              {/* Your Stats Card */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Your Performance
                </h3>

                {stats && (
                  <div className="space-y-4">
                    {/* Accuracy */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Accuracy</span>
                        <span className="font-semibold">{stats.accuracy}%</span>
                      </div>
                      <Progress value={stats.accuracy} className="h-2" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold">{stats.totalAttempts}</p>
                        <p className="text-xs text-muted-foreground">Total Attempts</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {stats.correctAttempts}
                        </p>
                        <p className="text-xs text-muted-foreground">Correct</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">
                          {stats.streak}
                        </p>
                        <p className="text-xs text-muted-foreground">Current Streak</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold">{stats.reportRate}%</p>
                        <p className="text-xs text-muted-foreground">Report Rate</p>
                      </div>
                    </div>

                    {/* Click Rate Warning */}
                    {stats.clickRate > 0 && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {stats.clickRate}% link click rate
                          </span>
                        </div>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Remember: Never click suspicious links!
                        </p>
                      </div>
                    )}

                    {/* Average Response Time */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Avg Response</span>
                      </div>
                      <span className="font-medium">
                        {(stats.avgResponseTimeMs / 1000).toFixed(1)}s
                      </span>
                    </div>
                  </div>
                )}
              </Card>

              {/* By Difficulty */}
              {stats && stats.byDifficulty.some((d) => d.total > 0) && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">By Difficulty</h3>
                  <div className="space-y-3">
                    {stats.byDifficulty.map((diff) => (
                      <div key={diff.difficulty}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{diff.difficulty}</span>
                          <span className="text-muted-foreground">
                            {diff.correct}/{diff.total} ({diff.accuracy}%)
                          </span>
                        </div>
                        <Progress
                          value={diff.accuracy}
                          className={`h-2 ${
                            diff.difficulty === "Beginner"
                              ? "[&>div]:bg-green-500"
                              : diff.difficulty === "Intermediate"
                              ? "[&>div]:bg-yellow-500"
                              : "[&>div]:bg-red-500"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Tips Card */}
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <Shield className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Phishing Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Check sender email addresses carefully
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Look for urgency or threatening language
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Hover over links before clicking
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Be wary of unexpected attachments
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
