import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  AlertTriangle,
  ShieldCheck,
  ShieldX,
  Link,
  CheckCircle,
  XCircle,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  Trophy,
  Info,
} from "lucide-react";
import { SuspiciousLinksConfig } from "../../services/admin.service";

interface SuspiciousLinksSimulationProps {
  config: SuspiciousLinksConfig;
  passingScore: number;
  onComplete: (score: number, passed: boolean, answers: Record<string, boolean>) => void;
}

interface LinkAnswer {
  linkIndex: number;
  userAnswer: boolean; // true = marked as malicious, false = marked safe
  isCorrect: boolean;
}

export function SuspiciousLinksSimulation({
  config,
  passingScore,
  onComplete,
}: SuspiciousLinksSimulationProps) {
  const [answers, setAnswers] = useState<Record<number, LinkAnswer>>({});
  const [showResults, setShowResults] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [revealedUrls, setRevealedUrls] = useState<Set<number>>(new Set());
  const [showFeedback, setShowFeedback] = useState<number | null>(null);

  const answeredCount = Object.keys(answers).length;
  const totalLinks = config.links.length;
  const allAnswered = answeredCount === totalLinks;

  // Calculate score
  const correctAnswers = Object.values(answers).filter((a) => a.isCorrect).length;
  const score = totalLinks > 0 ? Math.round((correctAnswers / totalLinks) * 100) : 0;
  const passed = score >= passingScore;

  const toggleRevealUrl = (index: number) => {
    const newRevealed = new Set(revealedUrls);
    if (newRevealed.has(index)) {
      newRevealed.delete(index);
    } else {
      newRevealed.add(index);
    }
    setRevealedUrls(newRevealed);
  };

  const handleAnswer = (linkIndex: number, isMalicious: boolean) => {
    if (answers[linkIndex]) return;

    const link = config.links[linkIndex];
    const isCorrect = link.isMalicious === isMalicious;

    const newAnswer: LinkAnswer = {
      linkIndex,
      userAnswer: isMalicious,
      isCorrect,
    };

    setAnswers({ ...answers, [linkIndex]: newAnswer });
    setShowFeedback(linkIndex);

    // Hide feedback after delay
    setTimeout(() => {
      setShowFeedback(null);
    }, 2000);
  };

  const handleSubmit = () => {
    setShowResults(true);
    const answersMap: Record<string, boolean> = {};
    Object.entries(answers).forEach(([index, answer]) => {
      answersMap[index] = answer.isCorrect;
    });
    onComplete(score, passed, answersMap);
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResults(false);
    setRevealedUrls(new Set());
    setShowFeedback(null);
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
            {passed ? "Excellent Work!" : "Keep Practicing!"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {passed
              ? "You've demonstrated strong URL analysis skills."
              : "Review the explanations and try again to improve your score."}
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
              <p className="text-4xl font-bold text-green-600">{correctAnswers}/{totalLinks}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
          </div>

          {/* Results breakdown */}
          <div className="text-left mb-8">
            <h3 className="font-semibold mb-4">Results Breakdown</h3>
            <div className="space-y-3">
              {config.links.map((link, index) => {
                const answer = answers[index];
                return (
                  <div
                    key={index}
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
                        <p className="font-medium">{link.displayText}</p>
                        <code className="text-sm bg-background px-2 py-1 rounded mt-1 block break-all">
                          {link.actualUrl}
                        </code>
                        <div className="flex gap-2 mt-2">
                          <Badge
                            variant={link.isMalicious ? "destructive" : "default"}
                            className={!link.isMalicious ? "bg-green-600" : ""}
                          >
                            Actually: {link.isMalicious ? "Malicious" : "Safe"}
                          </Badge>
                          <Badge variant="outline">
                            You said: {answer?.userAnswer ? "Malicious" : "Safe"}
                          </Badge>
                        </div>
                        {link.explanation && (
                          <div className="mt-3 p-3 bg-background rounded">
                            <p className="text-sm flex items-start gap-2">
                              <Info className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                              {link.explanation}
                            </p>
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Instructions */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Link className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Analyze These Links</h2>
            <p className="text-muted-foreground mb-4">{config.scenario}</p>
            <p className="text-sm">{config.instructions}</p>
          </div>
        </div>
      </Card>

      {/* Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">{answeredCount} of {totalLinks} analyzed</span>
        </div>
        <Progress value={(answeredCount / totalLinks) * 100} className="h-2" />
      </Card>

      {/* Links */}
      <div className="space-y-4">
        {config.links.map((link, index) => {
          const answer = answers[index];
          const isRevealed = revealedUrls.has(index);
          const isHovered = hoveredLink === index;
          const showingFeedback = showFeedback === index;

          return (
            <Card
              key={index}
              className={`p-6 transition-all ${
                answer
                  ? answer.isCorrect
                    ? 'border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50'
                    : 'border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="space-y-4">
                {/* Link Display */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">Link {index + 1}</span>
                      {answer && (
                        <Badge
                          variant={answer.isCorrect ? "default" : "destructive"}
                          className={answer.isCorrect ? "bg-green-600" : ""}
                        >
                          {answer.isCorrect ? "Correct" : "Incorrect"}
                        </Badge>
                      )}
                    </div>

                    {/* Simulated Link */}
                    <div
                      className="inline-flex items-center gap-2 cursor-pointer group"
                      onMouseEnter={() => setHoveredLink(index)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-600 dark:text-blue-400 underline font-medium">
                        {link.displayText}
                      </span>
                    </div>

                    {/* URL Reveal */}
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRevealUrl(index)}
                        className="gap-2"
                        disabled={!!answer}
                      >
                        {isRevealed ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Hide URL
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            Reveal URL
                          </>
                        )}
                      </Button>

                      {(isRevealed || isHovered || answer) && (
                        <div className="mt-2 p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Actual URL:</p>
                          <code className="text-sm break-all">{link.actualUrl}</code>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Answer Buttons or Result */}
                {!answer ? (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="destructive"
                      className="flex-1 gap-2"
                      onClick={() => handleAnswer(index, true)}
                    >
                      <ShieldX className="w-4 h-4" />
                      Mark as Suspicious
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => handleAnswer(index, false)}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Mark as Safe
                    </Button>
                  </div>
                ) : (
                  <div className={`p-4 rounded-lg ${
                    answer.isCorrect
                      ? 'bg-green-100 dark:bg-green-900'
                      : 'bg-red-100 dark:bg-red-900'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {answer.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium">
                        {answer.isCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                      <Badge
                        variant={link.isMalicious ? "destructive" : "default"}
                        className={!link.isMalicious ? "bg-green-600" : ""}
                      >
                        This link is {link.isMalicious ? 'Malicious' : 'Safe'}
                      </Badge>
                    </div>
                    {link.explanation && (
                      <p className="text-sm mt-2 flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {link.explanation}
                      </p>
                    )}
                  </div>
                )}

                {/* Feedback Animation */}
                {showingFeedback && (
                  <div className={`fixed inset-0 bg-background/80 flex items-center justify-center z-50 animate-in fade-in duration-200`}>
                    <div className={`p-8 rounded-lg text-center ${
                      answer?.isCorrect
                        ? 'bg-green-100 dark:bg-green-900'
                        : 'bg-red-100 dark:bg-red-900'
                    }`}>
                      {answer?.isCorrect ? (
                        <>
                          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600 dark:text-green-400" />
                          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
                            Correct!
                          </h3>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600 dark:text-red-400" />
                          <h3 className="text-xl font-semibold text-red-800 dark:text-red-200">
                            Incorrect
                          </h3>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Submit Button */}
      <Card className="p-4">
        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={!allAnswered}
        >
          {allAnswered ? 'View Results' : `${totalLinks - answeredCount} links remaining`}
        </Button>
      </Card>
    </div>
  );
}
