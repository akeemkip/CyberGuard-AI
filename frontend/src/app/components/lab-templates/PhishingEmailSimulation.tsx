import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  AlertTriangle,
  ShieldCheck,
  ShieldX,
  Mail,
  Inbox,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Paperclip,
  RefreshCw,
  Trophy,
} from "lucide-react";
import { PhishingEmailConfig } from "../../services/admin.service";

interface PhishingEmailSimulationProps {
  config: PhishingEmailConfig;
  passingScore: number;
  onComplete: (score: number, passed: boolean, answers: Record<string, boolean>) => void;
}

interface EmailAnswer {
  emailId: string;
  userAnswer: boolean; // true = reported as phishing, false = marked safe
  isCorrect: boolean;
}

export function PhishingEmailSimulation({
  config,
  passingScore,
  onComplete,
}: PhishingEmailSimulationProps) {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, EmailAnswer>>({});
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  const selectedEmail = config.emails.find((e) => e.id === selectedEmailId);
  const answeredCount = Object.keys(answers).length;
  const totalEmails = config.emails.length;
  const allAnswered = answeredCount === totalEmails;

  // Calculate score
  const correctAnswers = Object.values(answers).filter((a) => a.isCorrect).length;
  const score = totalEmails > 0 ? Math.round((correctAnswers / totalEmails) * 100) : 0;
  const passed = score >= passingScore;

  const handleAnswer = (isPhishing: boolean) => {
    if (!selectedEmail || answers[selectedEmail.id]) return;

    const isCorrect = selectedEmail.isPhishing === isPhishing;
    const newAnswer: EmailAnswer = {
      emailId: selectedEmail.id,
      userAnswer: isPhishing,
      isCorrect,
    };

    setAnswers({ ...answers, [selectedEmail.id]: newAnswer });
    setShowFeedback(selectedEmail.id);

    // Auto-advance after feedback
    setTimeout(() => {
      setShowFeedback(null);
      // Find next unanswered email
      const nextEmail = config.emails.find((e) => !answers[e.id] && e.id !== selectedEmail.id);
      if (nextEmail) {
        setSelectedEmailId(nextEmail.id);
      }
    }, 2500);
  };

  const handleSubmit = () => {
    setShowResults(true);
    const answersMap: Record<string, boolean> = {};
    Object.entries(answers).forEach(([id, answer]) => {
      answersMap[id] = answer.isCorrect;
    });
    onComplete(score, passed, answersMap);
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResults(false);
    setSelectedEmailId(config.emails[0]?.id || null);
    setShowFeedback(null);
  };

  // Select first email on mount
  useEffect(() => {
    if (config.emails.length > 0 && !selectedEmailId) {
      setSelectedEmailId(config.emails[0].id);
    }
  }, [config.emails]);

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
              ? "You've demonstrated strong phishing detection skills."
              : "Review the emails and try again to improve your score."}
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
              <p className="text-4xl font-bold text-green-600">{correctAnswers}/{totalEmails}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
          </div>

          {/* Results breakdown */}
          <div className="text-left mb-8">
            <h3 className="font-semibold mb-4">Results Breakdown</h3>
            <div className="space-y-3">
              {config.emails.map((email) => {
                const answer = answers[email.id];
                return (
                  <div
                    key={email.id}
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
                        <p className="font-medium">{email.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          From: {email.from.name} &lt;{email.from.email}&gt;
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={email.isPhishing ? "destructive" : "default"} className={!email.isPhishing ? "bg-green-600" : ""}>
                            Actually: {email.isPhishing ? "Phishing" : "Legitimate"}
                          </Badge>
                          <Badge variant="outline">
                            You said: {answer?.userAnswer ? "Phishing" : "Safe"}
                          </Badge>
                        </div>
                        {email.isPhishing && email.redFlags.length > 0 && (
                          <div className="mt-3 p-3 bg-background rounded">
                            <p className="text-sm font-medium mb-2">Red Flags:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {email.redFlags.map((flag, i) => (
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

  return (
    <div className="h-[calc(100vh-200px)] flex">
      {/* Email List - Left Panel */}
      <div className="w-80 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Inbox className="w-5 h-5" />
            <h2 className="font-semibold">Inbox</h2>
            <Badge variant="secondary">{totalEmails}</Badge>
          </div>
          <Progress value={(answeredCount / totalEmails) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {answeredCount} of {totalEmails} reviewed
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {config.emails.map((email) => {
            const answer = answers[email.id];
            const isSelected = selectedEmailId === email.id;

            return (
              <button
                key={email.id}
                onClick={() => setSelectedEmailId(email.id)}
                className={`w-full p-4 text-left border-b transition-colors ${
                  isSelected
                    ? 'bg-primary/10 border-l-2 border-l-primary'
                    : 'hover:bg-muted/50'
                } ${answer ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                    answer
                      ? answer.isCorrect
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : 'bg-gray-400'
                  }`}>
                    {answer ? (
                      answer.isCorrect ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )
                    ) : (
                      email.from.name[0]?.toUpperCase() || 'E'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${!answer ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {email.from.name}
                    </p>
                    <p className="text-sm truncate">{email.subject}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {email.from.email}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="p-4 border-t">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            {allAnswered ? 'View Results' : `${totalEmails - answeredCount} emails remaining`}
          </Button>
        </div>
      </div>

      {/* Email View - Right Panel */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedEmail ? (
          <>
            {/* Email Header */}
            <div className="p-6 border-b">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-xl font-semibold mb-2">{selectedEmail.subject}</h1>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {selectedEmail.from.name[0]?.toUpperCase() || 'E'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{selectedEmail.from.name}</p>
                      <p className="text-muted-foreground">&lt;{selectedEmail.from.email}&gt;</p>
                    </div>
                  </div>
                </div>
                {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <Paperclip className="w-3 h-3" />
                    {selectedEmail.attachments.length} attachment(s)
                  </Badge>
                )}
              </div>
            </div>

            {/* Email Body */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
              />
            </div>

            {/* Feedback Overlay */}
            {showFeedback === selectedEmail.id && answers[selectedEmail.id] && (
              <div className="absolute inset-0 bg-background/90 flex items-center justify-center z-10">
                <div className={`p-8 rounded-lg text-center max-w-md ${
                  answers[selectedEmail.id].isCorrect
                    ? 'bg-green-100 dark:bg-green-900'
                    : 'bg-red-100 dark:bg-red-900'
                }`}>
                  {answers[selectedEmail.id].isCorrect ? (
                    <>
                      <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600 dark:text-green-400" />
                      <h3 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-200">
                        Correct!
                      </h3>
                      <p className="text-green-700 dark:text-green-300">{config.feedbackCorrect}</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600 dark:text-red-400" />
                      <h3 className="text-xl font-semibold mb-2 text-red-800 dark:text-red-200">
                        Incorrect
                      </h3>
                      <p className="text-red-700 dark:text-red-300">{config.feedbackIncorrect}</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!answers[selectedEmail.id] && (
              <div className="p-4 border-t bg-muted/50">
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Is this email a phishing attempt?
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={() => handleAnswer(true)}
                    className="gap-2 min-w-40"
                  >
                    <ShieldX className="w-5 h-5" />
                    Report Phishing
                  </Button>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => handleAnswer(false)}
                    className="gap-2 min-w-40 bg-green-600 hover:bg-green-700"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    Mark Safe
                  </Button>
                </div>
              </div>
            )}

            {answers[selectedEmail.id] && !showFeedback && (
              <div className="p-4 border-t bg-muted/50">
                <div className={`p-4 rounded-lg ${
                  answers[selectedEmail.id].isCorrect
                    ? 'bg-green-100 dark:bg-green-900'
                    : 'bg-red-100 dark:bg-red-900'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {answers[selectedEmail.id].isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">
                      {answers[selectedEmail.id].isCorrect ? 'Correct!' : 'Incorrect'}
                    </span>
                    <Badge variant={selectedEmail.isPhishing ? "destructive" : "default"} className={!selectedEmail.isPhishing ? "bg-green-600" : ""}>
                      This is {selectedEmail.isPhishing ? 'Phishing' : 'Legitimate'}
                    </Badge>
                  </div>
                  {selectedEmail.isPhishing && selectedEmail.redFlags.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Red Flags:</p>
                      <ul className="text-sm space-y-1">
                        {selectedEmail.redFlags.map((flag, i) => (
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
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Mail className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Select an Email</h3>
              <p className="text-muted-foreground">
                Click on an email from the list to review it
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
