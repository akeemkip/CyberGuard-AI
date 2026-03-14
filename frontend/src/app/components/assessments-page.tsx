import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { submitFullAssessment, getFullAssessmentQuestions } from "../services/assessment.service";
import type { FullAssessmentQuestion } from "../services/assessment.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Shield,
  Moon,
  Sun,
  ClipboardCheck,
  ChevronLeft,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Target,
  Clock,
  AlertCircle,
  Timer,
  X,
  Loader2
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { UserProfileDropdown } from "./user-profile-dropdown";
import { toast } from "sonner";

interface AssessmentsPageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface ShuffledQuestion extends FullAssessmentQuestion {
  shuffledOptions: string[];
  originalIndexMap: number[];
}

interface AssessmentResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  answers: { questionId: number; userAnswer: number; isCorrect: boolean; correctAnswer?: number; explanation?: string }[];
}

// Helper function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper function to shuffle question options (no correct answer on client)
const shuffleQuestionOptions = (question: FullAssessmentQuestion): ShuffledQuestion => {
  const indexMap = question.options.map((_, index) => index);
  const shuffledIndexes = shuffleArray(indexMap);
  const shuffledOptions = shuffledIndexes.map((index) => question.options[index]);

  return {
    ...question,
    shuffledOptions,
    originalIndexMap: shuffledIndexes
  };
};

// Timer duration in seconds (25 minutes)
const ASSESSMENT_DURATION = 25 * 60;

export function AssessmentsPage({ onNavigate, onLogout }: AssessmentsPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(ASSESSMENT_DURATION);
  const [timerExpired, setTimerExpired] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const totalQuestions = shuffledQuestions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Fetch and shuffle questions when assessment starts
  useEffect(() => {
    if (assessmentStarted && shuffledQuestions.length === 0) {
      const loadQuestions = async () => {
        try {
          const data = await getFullAssessmentQuestions();
          const shuffled = shuffleArray(data.questions).map(shuffleQuestionOptions);
          setShuffledQuestions(shuffled);
          setTimeRemaining(ASSESSMENT_DURATION);
          setTimerExpired(false);
        } catch (error) {
          console.error("Error loading assessment questions:", error);
          toast.error("Failed to load assessment questions. Please try again.");
          setAssessmentStarted(false);
        }
      };
      loadQuestions();
    }
  }, [assessmentStarted]);

  // Timer countdown
  useEffect(() => {
    if (!assessmentStarted || result || timeRemaining <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerExpired(true);
          toast.error("Time's up! Assessment auto-submitted.");
          // Auto-submit when time expires
          setTimeout(() => handleSubmit(true), 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assessmentStarted, result, timeRemaining]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if time is running low (less than 5 minutes)
  const isTimeLow = timeRemaining < 5 * 60 && timeRemaining > 0;
  const isTimeCritical = timeRemaining < 2 * 60 && timeRemaining > 0;

  const handleAnswerSelect = (optionIndex: number) => {
    if (!currentQuestion) return;
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async (isTimerExpired = false) => {
    setIsSubmitting(true);

    // Map shuffled option indexes back to original option indexes for the server
    const submissionAnswers = shuffledQuestions.map((q) => {
      const shuffledIndex = answers[q.id] ?? -1;
      const originalIndex = shuffledIndex >= 0 ? q.originalIndexMap[shuffledIndex] : -1;
      return {
        questionId: q.id,
        userAnswer: originalIndex
      };
    });

    const timeSpent = ASSESSMENT_DURATION - timeRemaining;

    try {
      const serverResult = await submitFullAssessment({
        timeSpent,
        timerExpired: isTimerExpired,
        answers: submissionAnswers
      });

      // Map server answers back to shuffled indexes for display
      const displayAnswers = serverResult.answers.map((a) => {
        const question = shuffledQuestions.find(q => q.id === a.questionId);
        const shuffledUserAnswer = answers[a.questionId] ?? -1;
        return {
          questionId: a.questionId,
          userAnswer: shuffledUserAnswer,
          isCorrect: a.isCorrect,
          correctAnswer: question ? question.originalIndexMap.indexOf(a.correctAnswer) : undefined,
          explanation: a.explanation
        };
      });

      setResult({
        score: serverResult.score,
        totalQuestions: serverResult.totalQuestions,
        percentage: serverResult.percentage,
        passed: serverResult.passed,
        answers: displayAnswers
      });

      if (isTimerExpired) {
        toast.error("Assessment failed - Time expired!");
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Failed to submit assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuitAssessment = () => {
    toast.info("Assessment cancelled");
    setAssessmentStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setShuffledQuestions([]);
    setTimeRemaining(ASSESSMENT_DURATION);
    setTimerExpired(false);
    setShowQuitDialog(false);
  };

  const handleRetake = () => {
    setAssessmentStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setShuffledQuestions([]);
    setTimeRemaining(ASSESSMENT_DURATION);
    setTimerExpired(false);
    setShowQuitDialog(false);
  };

  const allQuestionsAnswered = Object.keys(answers).length === totalQuestions;

  // Landing page
  if (!assessmentStarted && !result) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => onNavigate("student-dashboard")} aria-label="Back to dashboard">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold">CyberGuard AI</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              <UserProfileDropdown onLogout={onLogout} onNavigate={onNavigate} />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ClipboardCheck className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Cybersecurity Skills Assessment</h1>
              <p className="text-muted-foreground">
                Test your cybersecurity knowledge across multiple topics
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card className="p-4 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">30</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </Card>
              <Card className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold">25</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </Card>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-3">Topics Covered:</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Phishing Detection</Badge>
                <Badge variant="outline">Password Security</Badge>
                <Badge variant="outline">Social Engineering</Badge>
                <Badge variant="outline">Safe Browsing</Badge>
                <Badge variant="outline">Data Protection</Badge>
                <Badge variant="outline">Malware Awareness</Badge>
                <Badge variant="outline">Network Security</Badge>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Assessment Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You need 70% or higher to pass</li>
                    <li>Questions and answers are randomized each time</li>
                    <li><strong className="text-warning">You have 25 minutes to complete the assessment</strong></li>
                    <li>Assessment auto-submits when time expires (automatic fail)</li>
                    <li>You can retake the assessment anytime</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={() => setAssessmentStarted(true)}>
              <Play className="w-5 h-5 mr-2" />
              Start Assessment
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Results page
  if (result) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => onNavigate("student-dashboard")} aria-label="Back to dashboard">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold">Assessment Results</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              <UserProfileDropdown onLogout={onLogout} onNavigate={onNavigate} />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Card className={`max-w-2xl mx-auto p-8 mb-8 ${
            result.passed
              ? "bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
              : "bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20"
          }`}>
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                result.passed ? "bg-green-500/20" : "bg-red-500/20"
              }`}>
                {result.passed ? (
                  <Trophy className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {result.passed ? "Congratulations!" : "Keep Learning!"}
              </h1>
              <p className={`text-5xl font-bold mb-2 ${
                result.passed ? "text-green-600" : "text-red-600"
              }`}>
                {result.percentage}%
              </p>
              <p className="text-muted-foreground mb-4">
                You answered {result.score} out of {result.totalQuestions} questions correctly
              </p>
              {timerExpired && (
                <p className="text-sm text-destructive font-medium mb-2">
                  Assessment failed: Time expired
                </p>
              )}
              {!result.passed && !timerExpired && (
                <p className="text-sm text-muted-foreground">
                  You need 70% to pass. Review the topics below and try again!
                </p>
              )}
            </div>
          </Card>

          <div className="max-w-2xl mx-auto space-y-4 mb-8">
            <h2 className="font-semibold text-lg">Question Review</h2>
            {shuffledQuestions.map((q, index) => {
              const answerData = result.answers.find((a) => a.questionId === q.id);
              const isCorrect = answerData?.isCorrect;
              const userAnswerIdx = answerData?.userAnswer ?? -1;
              const userAnswerText = userAnswerIdx >= 0
                ? q.shuffledOptions[userAnswerIdx]
                : "Not answered";
              const correctAnswerText = answerData?.correctAnswer !== undefined
                ? q.shuffledOptions[answerData.correctAnswer]
                : undefined;

              return (
                <Card key={q.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{q.topic}</Badge>
                      </div>
                      <p className="font-medium mb-2">
                        {index + 1}. {q.question}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Your answer:{" "}
                        <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                          {userAnswerText}
                        </span>
                      </p>
                      {!isCorrect && correctAnswerText && (
                        <p className="text-sm text-green-600">
                          Correct answer: {correctAnswerText}
                        </p>
                      )}
                      {answerData?.explanation && (
                        <p className="text-sm text-muted-foreground mt-2 bg-muted/50 p-2 rounded">
                          {answerData.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="max-w-2xl mx-auto flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => onNavigate("student-dashboard")}>
              Back to Dashboard
            </Button>
            <Button className="flex-1" onClick={handleRetake}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state while questions are being fetched
  if (assessmentStarted && shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Preparing your assessment...</p>
        </Card>
      </div>
    );
  }

  // Assessment in progress
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuitDialog(true)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="w-4 h-4 mr-2" />
                Quit Assessment
              </Button>
              <div className="border-l border-border h-8" />
              <div>
                <h1 className="font-semibold">Skills Assessment</h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Timer Display */}
              <Card className={`px-4 py-2 ${
                isTimeCritical
                  ? "bg-destructive/10 border-destructive animate-pulse"
                  : isTimeLow
                  ? "bg-warning/10 border-warning"
                  : "bg-muted"
              }`}>
                <div className="flex items-center gap-2">
                  <Timer className={`w-4 h-4 ${
                    isTimeCritical ? "text-destructive" : isTimeLow ? "text-warning" : "text-muted-foreground"
                  }`} />
                  <span className={`font-mono font-semibold ${
                    isTimeCritical ? "text-destructive" : isTimeLow ? "text-warning" : ""
                  }`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </Card>
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              <UserProfileDropdown onLogout={onLogout} onNavigate={onNavigate} />
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-8">
          <Badge variant="outline" className="mb-4">{currentQuestion.topic}</Badge>
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3 mb-6">
            {currentQuestion.shuffledOptions.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground"
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex-1"
            >
              Previous
            </Button>
            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button
                onClick={() => handleSubmit()}
                disabled={!allQuestionsAnswered || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Assessment"
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex-1">
                Next
              </Button>
            )}
          </div>

          {!allQuestionsAnswered && currentQuestionIndex === totalQuestions - 1 && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Please answer all questions before submitting
            </p>
          )}
        </Card>
      </div>

      {/* Quit Assessment Confirmation Dialog */}
      <AlertDialog open={showQuitDialog} onOpenChange={setShowQuitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quit Assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to quit the assessment? Your progress will be lost and you'll need to start over.
              {Object.keys(answers).length > 0 && (
                <span className="block mt-2 font-medium text-foreground">
                  You've answered {Object.keys(answers).length} of {totalQuestions} questions.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Assessment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleQuitAssessment}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Quit Assessment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
