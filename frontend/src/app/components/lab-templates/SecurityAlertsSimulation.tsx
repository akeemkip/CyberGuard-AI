import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  ShieldAlert,
  ShieldCheck,
  Trophy,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { SecurityAlertsConfig } from "../../services/admin.service";

interface SecurityAlertsSimulationProps {
  config: SecurityAlertsConfig;
  passingScore: number;
  onComplete: (score: number, passed: boolean, answers: Record<string, boolean>) => void;
}

interface AlertAnswer {
  alertId: string;
  userAnswer: boolean; // true = legitimate, false = fake
  isCorrect: boolean;
}

export function SecurityAlertsSimulation({
  config,
  passingScore,
  onComplete,
}: SecurityAlertsSimulationProps) {
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AlertAnswer>>({});
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentAlert = config.alerts[currentAlertIndex];
  const answeredCount = Object.keys(answers).length;
  const totalAlerts = config.alerts.length;
  const allAnswered = answeredCount === totalAlerts;

  // Calculate score
  const correctAnswers = Object.values(answers).filter((a) => a.isCorrect).length;
  const score = totalAlerts > 0 ? Math.round((correctAnswers / totalAlerts) * 100) : 0;
  const passed = score >= passingScore;

  const handleAnswer = (isLegitimate: boolean) => {
    if (!currentAlert || answers[currentAlert.id]) return;

    const isCorrect = currentAlert.isLegitimate === isLegitimate;
    const newAnswer: AlertAnswer = {
      alertId: currentAlert.id,
      userAnswer: isLegitimate,
      isCorrect,
    };

    setAnswers({ ...answers, [currentAlert.id]: newAnswer });
    setShowFeedback(true);

    // Auto-advance after feedback
    setTimeout(() => {
      setShowFeedback(false);
      if (currentAlertIndex < totalAlerts - 1) {
        setCurrentAlertIndex(currentAlertIndex + 1);
      }
    }, 2500);
  };

  const handleSubmit = () => {
    setShowResults(true);
    const answersMap: Record<string, boolean> = {};
    Object.entries(answers).forEach(([id, answer]) => {
      answersMap[id] = answer.userAnswer; // Send raw user choice, not pre-calculated correctness
    });
    onComplete(score, passed, answersMap);
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResults(false);
    setCurrentAlertIndex(0);
    setShowFeedback(false);
  };

  // Alert type display names
  const getAlertTypeDisplay = (alertType: string): string => {
    const typeMap: Record<string, string> = {
      virus_warning: "Virus Warning",
      system_update: "System Update",
      browser_notification: "Browser Notification",
      tech_support: "Tech Support",
      prize_winner: "Prize Winner",
      login_warning: "Login Warning",
      subscription_expired: "Subscription Expired",
    };
    return typeMap[alertType] || alertType;
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6">
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
            {passed ? "Congratulations!" : "Keep Practicing!"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {passed
              ? "You've demonstrated strong security alert detection skills."
              : "Review the alerts and try again to improve your score."}
          </p>

          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{score}%</p>
              <p className="text-sm text-muted-foreground">Your Score</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{passingScore}%</p>
              <p className="text-sm text-muted-foreground">Passing Score</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">{correctAnswers}/{totalAlerts}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
          </div>

          {/* Results breakdown */}
          <div className="text-left mb-8">
            <h3 className="font-semibold mb-4">Results Breakdown</h3>
            <div className="space-y-3">
              {config.alerts.map((alert) => {
                const answer = answers[alert.id];
                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      answer?.isCorrect
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                        : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {answer?.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{alert.title}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          Type: {getAlertTypeDisplay(alert.alertType)} | Source: {alert.source}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={alert.isLegitimate ? "default" : "destructive"} className={alert.isLegitimate ? "bg-green-600" : ""}>
                            Actually: {alert.isLegitimate ? "Legitimate" : "Fake"}
                          </Badge>
                          <Badge variant="outline">
                            You said: {answer?.userAnswer ? "Legitimate" : "Fake"}
                          </Badge>
                        </div>
                        <div className="mt-3 p-3 bg-background rounded">
                          <p className="text-sm font-medium mb-1">Explanation:</p>
                          <p className="text-sm text-muted-foreground">{alert.explanation}</p>
                        </div>
                        {alert.redFlags && alert.redFlags.length > 0 && (
                          <div className="mt-2 p-3 bg-background rounded">
                            <p className="text-sm font-medium mb-2">Red Flags:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {alert.redFlags.map((flag, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <AlertTriangle className="w-3 h-3 mt-1 text-yellow-600" />
                                  {flag}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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

  if (!currentAlert) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No alerts configured</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Instructions */}
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-primary mt-1" />
          <div>
            <h3 className="font-semibold mb-2">{config.scenario}</h3>
            <p className="text-muted-foreground">{config.instructions}</p>
          </div>
        </div>
      </Card>

      {/* Progress */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">
            Alert {answeredCount + 1} of {totalAlerts}
          </span>
        </div>
        <Progress value={((answeredCount + 1) / totalAlerts) * 100} className="h-2" />
      </Card>

      {/* Alert Display */}
      <Card className="p-8 relative overflow-hidden">
        {/* Alert window styling */}
        <div className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950 rounded-lg p-6 shadow-lg">
          <div className="flex items-start gap-4 mb-4">
            <ShieldAlert className="w-12 h-12 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-yellow-900 dark:text-yellow-100">
                {currentAlert.title}
              </h2>
              <Badge variant="outline" className="mb-4">
                {getAlertTypeDisplay(currentAlert.alertType)}
              </Badge>
              <p className="text-yellow-900 dark:text-yellow-100 mb-4 whitespace-pre-wrap">
                {currentAlert.message}
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Source: {currentAlert.source}
              </p>
              {currentAlert.buttonText && (
                <div className="mt-4">
                  <Button variant="default" size="lg" disabled className="bg-yellow-600 hover:bg-yellow-700">
                    {currentAlert.buttonText}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Overlay */}
        {showFeedback && answers[currentAlert.id] && (
          <div className="absolute inset-0 bg-background/90 flex items-center justify-center z-10">
            <div className={`p-8 rounded-lg text-center max-w-md ${
              answers[currentAlert.id].isCorrect
                ? 'bg-green-100 dark:bg-green-900'
                : 'bg-red-100 dark:bg-red-900'
            }`}>
              {answers[currentAlert.id].isCorrect ? (
                <>
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600 dark:text-green-400" />
                  <h3 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-200">
                    Correct!
                  </h3>
                  <p className="text-green-700 dark:text-green-300">{currentAlert.explanation}</p>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600 dark:text-red-400" />
                  <h3 className="text-xl font-semibold mb-2 text-red-800 dark:text-red-200">
                    Incorrect
                  </h3>
                  <p className="text-red-700 dark:text-red-300">{currentAlert.explanation}</p>
                </>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      {!answers[currentAlert.id] && (
        <div className="mt-6">
          <p className="text-center text-sm text-muted-foreground mb-4">
            Is this security alert legitimate or fake?
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="destructive"
              size="lg"
              onClick={() => handleAnswer(false)}
              className="gap-2 min-w-40"
            >
              <XCircle className="w-5 h-5" />
              Fake Alert
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={() => handleAnswer(true)}
              className="gap-2 min-w-40 bg-green-600 hover:bg-green-700"
            >
              <ShieldCheck className="w-5 h-5" />
              Legitimate
            </Button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {allAnswered && !showResults && (
        <div className="mt-6 text-center">
          <Button size="lg" onClick={handleSubmit} className="min-w-48">
            View Results
          </Button>
        </div>
      )}
    </div>
  );
}
