import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, Trophy, TrendingUp, Loader2, Sparkles, LogOut, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useTheme } from './theme-provider';
import { usePlatformSettings } from '../context/PlatformSettingsContext';
import { PlatformLogo } from './PlatformLogo';
import api from '../services/api';
import {
  getIntroAssessment,
  submitIntroAssessment,
  IntroAssessment,
  IntroAssessmentAnswer,
  IntroAssessmentResult
} from '../services/assessment.service';

interface IntroAssessmentPageProps {
  onComplete: () => void;
  onLogout: () => void;
}

export const IntroAssessmentPage: React.FC<IntroAssessmentPageProps> = ({ onComplete, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { settings: platformSettings } = usePlatformSettings();
  const [assessment, setAssessment] = useState<IntroAssessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<IntroAssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiLearningPath, setAiLearningPath] = useState<string | null>(null);
  const [isLoadingPath, setIsLoadingPath] = useState(false);
  const [learningPathError, setLearningPathError] = useState(false);

  useEffect(() => {
    loadAssessment();
  }, []);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      const data = await getIntroAssessment();
      setAssessment(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load assessment');
    } finally {
      setLoading(false);
    }
  };

  const fetchLearningPath = async (resultData: IntroAssessmentResult) => {
    if (!assessment) return;
    try {
      setIsLoadingPath(true);
      const questionCourseMap: { [questionId: string]: string } = {};
      for (const q of assessment.questions) {
        questionCourseMap[q.id] = q.courseTitle;
      }

      const courseStats: { [courseTitle: string]: { correct: number; total: number } } = {};
      for (const answer of resultData.answers) {
        const courseTitle = questionCourseMap[answer.questionId];
        if (!courseTitle) continue;
        if (!courseStats[courseTitle]) {
          courseStats[courseTitle] = { correct: 0, total: 0 };
        }
        courseStats[courseTitle].total += 1;
        if (answer.isCorrect) {
          courseStats[courseTitle].correct += 1;
        }
      }

      const courseScores = Object.entries(courseStats).map(([courseTitle, stats]) => ({
        courseTitle,
        correct: stats.correct,
        total: stats.total,
        percentage: Math.round((stats.correct / stats.total) * 100)
      }));

      const response = await api.post('/ai/learning-path', {
        courseScores,
        overallScore: resultData.percentage,
        passed: resultData.passed
      });
      setAiLearningPath(response.data.learningPath || response.data);
    } catch (err) {
      console.error('Failed to generate learning path:', err);
      setAiLearningPath(null);
      setLearningPathError(true);
    } finally {
      setIsLoadingPath(false);
    }
  };

  useEffect(() => {
    if (result && assessment) {
      fetchLearningPath(result);
    }
  }, [result, assessment]);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < (assessment?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!assessment) return;

    const unansweredCount = assessment.questions.filter(
      q => selectedAnswers[q.id] === undefined
    ).length;

    if (unansweredCount > 0) {
      toast.warning(`Please answer all questions. ${unansweredCount} question(s) remaining.`);
      return;
    }

    try {
      setIsSubmitting(true);
      const answers: IntroAssessmentAnswer[] = assessment.questions.map(q => ({
        questionId: q.id,
        selectedAnswer: selectedAnswers[q.id]
      }));

      const resultData = await submitIntroAssessment(assessment.id, answers);
      setResult(resultData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Header component shared across all states
  const Header = () => (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlatformLogo className="w-10 h-10" iconClassName="w-6 h-6" />
          <span className="text-xl font-semibold">{platformSettings.platformName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Card className="p-6 max-w-md border-destructive/50">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="destructive" onClick={loadAssessment}>
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${
                result.passed
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                  : 'bg-gradient-to-br from-primary to-accent'
              }`}>
                <Trophy className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Assessment Complete!
            </h1>
            <p className="text-xl text-muted-foreground">
              You scored {result.score} out of {result.totalQuestions} ({result.percentage}%)
            </p>
          </div>

          {/* Encouraging Message */}
          <Card className="p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">
                  Great Start!
                </h2>
                <p className="text-muted-foreground mb-3">
                  This baseline assessment helps us understand where you are now. As you complete our courses,
                  you'll build strong cybersecurity skills and see significant improvement.
                </p>
                <p className="text-muted-foreground">
                  Remember, everyone starts somewhere. The key is continuous learning and improvement.
                  Your final assessment will show how much you've grown!
                </p>
              </div>
            </div>
          </Card>

          {/* Question Review */}
          <Card className="p-8 mb-6">
            <h2 className="text-xl font-bold mb-6">
              Question Review
            </h2>
            <div className="space-y-4">
              {result.answers.map((answer, index) => (
                <div
                  key={answer.questionId}
                  className={`p-4 rounded-lg border-2 ${
                    answer.isCorrect
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {answer.isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold mb-2">
                        Question {index + 1}
                      </p>
                      {!answer.isCorrect && answer.explanation && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          {answer.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Learning Path */}
          {isLoadingPath && (
            <Card className="p-8 mb-6">
              <div className="flex items-center gap-4">
                <Loader2 className="h-6 w-6 text-accent animate-spin flex-shrink-0" />
                <p className="text-muted-foreground font-medium">
                  Creating your personalized learning path...
                </p>
              </div>
            </Card>
          )}

          {!isLoadingPath && aiLearningPath && (
            <Card className="p-8 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <h2 className="text-xl font-bold">
                  Your Personalized Learning Path
                </h2>
              </div>
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(aiLearningPath) as string) }}
              />
            </Card>
          )}

          {!isLoadingPath && learningPathError && (
            <p className="text-sm text-muted-foreground text-center mb-6">
              Unable to generate a personalized learning path. You can still continue to the dashboard.
            </p>
          )}

          {/* Continue Button */}
          <div className="text-center">
            <Button size="lg" onClick={onComplete} className="text-lg px-8 py-6">
              Continue to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) return null;

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;
  const hasAnsweredCurrent = selectedAnswers[currentQuestion.id] !== undefined;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {assessment.title}
          </h1>
          <p className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {assessment.questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2 text-right">
            {answeredCount} of {assessment.questions.length} answered
          </p>
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-6">
          <div className="mb-6">
            <Badge variant="outline" className="mb-3">
              {currentQuestion.courseTitle}
            </Badge>
            <h2 className="text-2xl font-bold">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion.id] === index
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAnswers[currentQuestion.id] === index
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground'
                    }`}
                  >
                    {selectedAnswers[currentQuestion.id] === index && (
                      <div className="w-2 h-2 bg-current rounded-full"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || answeredCount !== assessment.questions.length}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
            >
              Next
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
