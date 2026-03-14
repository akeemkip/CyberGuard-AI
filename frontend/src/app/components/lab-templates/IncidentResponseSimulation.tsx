import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trophy,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { IncidentResponseConfig } from "../../services/admin.service";

interface IncidentResponseSimulationProps {
  config: IncidentResponseConfig;
  passingScore: number;
  onComplete: (score: number, passed: boolean, answers: Record<string, boolean>) => void;
}

interface StepAnswer {
  stepId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  feedback: string;
}

export function IncidentResponseSimulation({
  config,
  passingScore,
  onComplete,
}: IncidentResponseSimulationProps) {
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, StepAnswer>>({});
  const [visitedSteps, setVisitedSteps] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentStep = config.steps.find((s) => s.id === currentStepId);
  const totalSteps = config.steps.length;
  const uniqueAnsweredSteps = Object.keys(answers).length;

  // Calculate score based on correct answers
  const correctAnswers = Object.values(answers).filter((a) => a.isCorrect).length;
  const score = uniqueAnsweredSteps > 0 ? Math.round((correctAnswers / uniqueAnsweredSteps) * 100) : 0;
  const passed = score >= passingScore;

  // Initialize with first step
  useEffect(() => {
    if (config.steps.length > 0 && !currentStepId) {
      const firstStep = config.steps[0];
      setCurrentStepId(firstStep.id);
      setVisitedSteps(new Set([firstStep.id]));
    }
  }, [config.steps, currentStepId]);

  const handleAnswer = (optionIndex: number) => {
    if (!currentStep || answers[currentStep.id]) return;

    const selectedOption = currentStep.options[optionIndex];
    const newAnswer: StepAnswer = {
      stepId: currentStep.id,
      selectedOptionIndex: optionIndex,
      isCorrect: selectedOption.isCorrect,
      feedback: selectedOption.feedback,
    };

    setAnswers({ ...answers, [currentStep.id]: newAnswer });
    setShowFeedback(true);

    // Auto-advance after feedback
    setTimeout(() => {
      setShowFeedback(false);

      // Check if there's a nextStep specified
      if (selectedOption.nextStep) {
        const nextStep = config.steps.find(s => s.id === selectedOption.nextStep);
        if (nextStep && !answers[nextStep.id]) {
          setCurrentStepId(nextStep.id);
          setVisitedSteps(prev => new Set([...prev, nextStep.id]));
          return;
        }
      }

      // Otherwise, find next sequential unanswered step
      const currentIndex = config.steps.findIndex(s => s.id === currentStep.id);
      const nextStep = config.steps.slice(currentIndex + 1).find(s => !answers[s.id]);

      if (nextStep) {
        setCurrentStepId(nextStep.id);
        setVisitedSteps(prev => new Set([...prev, nextStep.id]));
      }
    }, 3000);
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
    setVisitedSteps(new Set());
    setShowResults(false);
    setShowFeedback(false);
    setCurrentStepId(config.steps[0]?.id || null);
    if (config.steps[0]) {
      setVisitedSteps(new Set([config.steps[0].id]));
    }
  };

  // Check if we're done (all visited steps have been answered)
  const allVisitedAnswered = Array.from(visitedSteps).every(stepId => answers[stepId]);

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
              ? "You've demonstrated strong incident response skills."
              : "Review the scenario and try again to improve your score."}
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
              <p className="text-4xl font-bold text-green-600">{correctAnswers}/{uniqueAnsweredSteps}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
          </div>

          {/* Results breakdown */}
          <div className="text-left mb-8">
            <h3 className="font-semibold mb-4">Decision Path</h3>
            <div className="space-y-3">
              {Array.from(visitedSteps).map((stepId, index) => {
                const step = config.steps.find(s => s.id === stepId);
                const answer = answers[stepId];
                if (!step) return null;

                return (
                  <div
                    key={stepId}
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
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Step {index + 1}</Badge>
                        </div>
                        <p className="font-medium mb-2">{step.situation}</p>
                        {answer && (
                          <>
                            <p className="text-sm text-muted-foreground mb-2">
                              Your choice: {step.options[answer.selectedOptionIndex].text}
                            </p>
                            <div className="mt-3 p-3 bg-background rounded">
                              <p className="text-sm font-medium mb-1">Feedback:</p>
                              <p className="text-sm text-muted-foreground">{answer.feedback}</p>
                            </div>
                          </>
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

  if (!currentStep) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No steps configured</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Scenario Description */}
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-primary mt-1" />
          <div>
            <h3 className="font-semibold mb-2">Incident Response Scenario</h3>
            <p className="text-muted-foreground">{config.scenario}</p>
          </div>
        </div>
      </Card>

      {/* Progress */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">
            {uniqueAnsweredSteps} decision(s) made
          </span>
        </div>
        <Progress value={(uniqueAnsweredSteps / totalSteps) * 100} className="h-2" />
      </Card>

      {/* Current Step */}
      <Card className="p-6 relative">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="default">
              Step {Array.from(visitedSteps).indexOf(currentStep.id) + 1}
            </Badge>
            {answers[currentStep.id] && (
              <Badge variant={answers[currentStep.id].isCorrect ? "default" : "destructive"} className={answers[currentStep.id].isCorrect ? "bg-green-600" : ""}>
                {answers[currentStep.id].isCorrect ? "Correct" : "Incorrect"}
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-semibold mb-3">{currentStep.situation}</h3>
          {!answers[currentStep.id] && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Choose the most appropriate action to take
            </p>
          )}
        </div>

        {/* Feedback Overlay */}
        {showFeedback && answers[currentStep.id] && (
          <div className="absolute inset-0 bg-background/90 flex items-center justify-center z-10 rounded-lg">
            <div className={`p-8 rounded-lg text-center max-w-md ${
              answers[currentStep.id].isCorrect
                ? 'bg-green-100 dark:bg-green-900'
                : 'bg-red-100 dark:bg-red-900'
            }`}>
              {answers[currentStep.id].isCorrect ? (
                <>
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600 dark:text-green-400" />
                  <h3 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-200">
                    Good Decision!
                  </h3>
                  <p className="text-green-700 dark:text-green-300">{answers[currentStep.id].feedback}</p>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600 dark:text-red-400" />
                  <h3 className="text-xl font-semibold mb-2 text-red-800 dark:text-red-200">
                    Not Ideal
                  </h3>
                  <p className="text-red-700 dark:text-red-300">{answers[currentStep.id].feedback}</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Options */}
        {!answers[currentStep.id] ? (
          <div className="space-y-3">
            {currentStep.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full p-4 text-left rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>
                  </div>
                  <p className="flex-1">{option.text}</p>
                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className={`p-4 rounded-lg ${
            answers[currentStep.id].isCorrect
              ? 'bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800'
              : 'bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-start gap-3 mb-3">
              {answers[currentStep.id].isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div>
                <p className="font-medium mb-1">
                  Your choice: {currentStep.options[answers[currentStep.id].selectedOptionIndex].text}
                </p>
                <p className="text-sm">{answers[currentStep.id].feedback}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Submit Button */}
      {allVisitedAnswered && !showResults && (
        <div className="mt-6 text-center">
          <Button size="lg" onClick={handleSubmit} className="min-w-48">
            View Results
          </Button>
        </div>
      )}
    </div>
  );
}
