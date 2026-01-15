import { useState, useEffect } from "react";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  Shield,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Check,
  Play,
  FileText,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useSettings } from "../context/SettingsContext";
import { UserProfileDropdown } from "./user-profile-dropdown";
import courseService, {
  Course,
  Lesson,
  CourseProgress,
  Quiz,
  QuizSubmissionResponse
} from "../services/course.service";

interface CoursePlayerProps {
  userEmail: string;
  onNavigate: (page: string, courseId?: string) => void;
  onLogout: () => void;
  courseId: string | null;
}

export function CoursePlayer({ userEmail, onNavigate, onLogout, courseId }: CoursePlayerProps) {
  const { theme, toggleTheme } = useTheme();
  const { savedSettings } = useSettings();

  // Course data state
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Current lesson state
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [markingComplete, setMarkingComplete] = useState(false);

  // Quiz state
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [questionId: string]: number }>({});
  const [quizResult, setQuizResult] = useState<QuizSubmissionResponse | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Fetch course data
  useEffect(() => {
    if (!courseId) {
      setError("No course selected");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [courseData, progressData] = await Promise.all([
          courseService.getCourseById(courseId),
          courseService.getCourseProgress(courseId)
        ]);

        setCourse(courseData);
        setProgress(progressData);

        // Find first incomplete lesson or start at beginning
        if (progressData.lessons) {
          const firstIncompleteIndex = progressData.lessons.findIndex(l => !l.completed);
          setCurrentLessonIndex(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0);
        }
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError("Failed to load course. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Get current lesson data
  const lessons = course?.lessons || [];
  const currentLesson = lessons[currentLessonIndex];
  const currentLessonProgress = progress?.lessons?.find(l => l.id === currentLesson?.id);
  const isLessonCompleted = currentLessonProgress?.completed || false;
  const overallProgress = progress?.summary?.percentage || 0;

  // Load quiz when lesson changes (if lesson has a quiz)
  useEffect(() => {
    if (currentLesson?.quiz?.id) {
      loadQuiz(currentLesson.quiz.id);
    } else {
      setQuiz(null);
      setQuizAnswers({});
      setQuizResult(null);
    }
  }, [currentLesson?.id]);

  const loadQuiz = async (quizId: string) => {
    try {
      setLoadingQuiz(true);
      const quizData = await courseService.getQuiz(quizId);
      setQuiz(quizData);
      setQuizAnswers({});
      setQuizResult(null);
    } catch (err) {
      console.error("Failed to load quiz:", err);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!currentLesson || isLessonCompleted) return;

    try {
      setMarkingComplete(true);
      const result = await courseService.markLessonComplete(currentLesson.id);

      // Refresh progress
      if (courseId) {
        const newProgress = await courseService.getCourseProgress(courseId);
        setProgress(newProgress);
      }

      toast.success('Lesson marked as complete!');

      if (result.courseComplete) {
        // Course completed!
        toast.success('🎉 Congratulations! You\'ve completed this course!', {
          duration: 5000,
        });
      }
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
      toast.error('Failed to mark lesson as complete. Please try again.');
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (!quiz) return;

    try {
      setSubmittingQuiz(true);
      const result = await courseService.submitQuizAttempt(quiz.id, quizAnswers);
      setQuizResult(result);

      // If passed, mark lesson complete
      if (result.summary.passed && !isLessonCompleted) {
        toast.success(`Quiz passed with ${result.summary.score}%! 🎉`);
        await handleMarkComplete();
      } else if (!result.summary.passed) {
        toast.error(`Quiz failed with ${result.summary.score}%. Try again!`);
      }
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      toast.error('Failed to submit quiz. Please try again.');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  // Render markdown-ish content (simple parser)
  const renderContent = (content: string) => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let listType: 'ul' | 'ol' | null = null;

    const flushList = () => {
      if (currentList.length > 0 && listType) {
        const ListTag = listType === 'ol' ? 'ol' : 'ul';
        elements.push(
          <ListTag key={elements.length} className={`${listType === 'ol' ? 'list-decimal' : 'list-disc'} list-inside space-y-1 mb-4 text-muted-foreground`}>
            {currentList.map((item, i) => <li key={i}>{item}</li>)}
          </ListTag>
        );
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Headers
      if (trimmedLine.startsWith('# ')) {
        flushList();
        elements.push(<h1 key={index} className="text-2xl font-bold mb-4 mt-6">{trimmedLine.slice(2)}</h1>);
      } else if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={index} className="text-xl font-semibold mb-3 mt-5">{trimmedLine.slice(3)}</h2>);
      } else if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(<h3 key={index} className="text-lg font-semibold mb-2 mt-4">{trimmedLine.slice(4)}</h3>);
      } else if (trimmedLine.startsWith('#### ')) {
        flushList();
        elements.push(<h4 key={index} className="text-base font-semibold mb-2 mt-3">{trimmedLine.slice(5)}</h4>);
      }
      // Unordered list items
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(trimmedLine.slice(2));
      }
      // Ordered list items
      else if (/^\d+\.\s/.test(trimmedLine)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        currentList.push(trimmedLine.replace(/^\d+\.\s/, ''));
      }
      // Bold text with **
      else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        flushList();
        elements.push(<p key={index} className="font-semibold mb-2">{trimmedLine.slice(2, -2)}</p>);
      }
      // Empty line
      else if (trimmedLine === '') {
        flushList();
      }
      // Regular paragraph
      else if (trimmedLine) {
        flushList();
        // Handle inline formatting
        const formattedLine = trimmedLine
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');

        // Sanitize HTML to prevent XSS attacks
        const sanitizedHTML = DOMPurify.sanitize(formattedLine, {
          ALLOWED_TAGS: ['strong', 'code'],
          ALLOWED_ATTR: ['class']
        });

        elements.push(
          <p key={index} className="mb-3 text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
        );
      }
    });

    flushList();
    return elements;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Course</h2>
          <p className="text-muted-foreground mb-4">{error || "Course not found"}</p>
          <Button onClick={() => onNavigate("course-catalog")}>
            Back to Courses
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate("student-dashboard")}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-semibold">{course.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    Lesson {currentLessonIndex + 1} of {lessons.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              <UserProfileDropdown onLogout={onLogout} onNavigate={onNavigate} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Course Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Lesson Content */}
          <div className="lg:col-span-3">
            <Card className="p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  {currentLesson?.quiz ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : currentLesson?.videoUrl ? (
                    <Play className="w-5 h-5 text-primary" />
                  ) : (
                    <FileText className="w-5 h-5 text-primary" />
                  )}
                  <h2 className="text-2xl font-bold">{currentLesson?.title}</h2>
                </div>
                {isLessonCompleted && (
                  <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <Check className="w-4 h-4" />
                    Completed
                  </span>
                )}
              </div>

              {/* Video embed if available */}
              {currentLesson?.videoUrl && (
                <div className="aspect-video bg-muted rounded-lg mb-6 overflow-hidden">
                  <iframe
                    src={`${currentLesson.videoUrl.replace('watch?v=', 'embed/')}${savedSettings.autoPlayVideos ? '?autoplay=1' : ''}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={currentLesson.title}
                  />
                </div>
              )}

              {/* Lesson content */}
              {currentLesson?.content && !currentLesson?.quiz && (
                <div className="prose max-w-none dark:prose-invert">
                  {renderContent(currentLesson.content)}
                </div>
              )}

              {/* Quiz section */}
              {currentLesson?.quiz && (
                <div className="space-y-6">
                  {loadingQuiz ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      <p className="text-muted-foreground">Loading quiz...</p>
                    </div>
                  ) : quiz ? (
                    <>
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                        <p className="text-muted-foreground">
                          Answer all questions to complete this lesson. You need {quiz.passingScore}% to pass.
                        </p>
                      </div>

                      {!quizResult ? (
                        <>
                          <div className="space-y-6">
                            {quiz.questions.map((q, index) => (
                              <Card key={q.id} className="p-6">
                                <h4 className="font-semibold mb-4">
                                  Question {index + 1}: {q.question}
                                </h4>
                                <div className="space-y-3">
                                  {q.options.map((option, optionIndex) => (
                                    <label
                                      key={optionIndex}
                                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                        quizAnswers[q.id] === optionIndex
                                          ? "border-primary bg-primary/5"
                                          : "border-border hover:bg-muted/50"
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`question-${q.id}`}
                                        value={optionIndex}
                                        checked={quizAnswers[q.id] === optionIndex}
                                        onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: optionIndex })}
                                        className="w-4 h-4"
                                      />
                                      <span>{option}</span>
                                    </label>
                                  ))}
                                </div>
                              </Card>
                            ))}
                          </div>
                          <Button
                            onClick={handleQuizSubmit}
                            className="w-full"
                            disabled={Object.keys(quizAnswers).length !== quiz.questions.length || submittingQuiz}
                          >
                            {submittingQuiz ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              "Submit Quiz"
                            )}
                          </Button>
                        </>
                      ) : (
                        <div>
                          <Card className={`p-6 mb-6 ${
                            quizResult.summary.passed
                              ? "bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
                              : "bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20"
                          }`}>
                            <div className="text-center">
                              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                                quizResult.summary.passed ? "bg-green-500/20" : "bg-red-500/20"
                              }`}>
                                {quizResult.summary.passed ? (
                                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                                ) : (
                                  <AlertCircle className="w-8 h-8 text-red-600" />
                                )}
                              </div>
                              <h3 className="text-2xl font-bold mb-2">
                                {quizResult.summary.passed ? "Quiz Passed!" : "Quiz Not Passed"}
                              </h3>
                              <p className={`text-3xl font-bold mb-2 ${
                                quizResult.summary.passed ? "text-green-600" : "text-red-600"
                              }`}>
                                {quizResult.summary.score}%
                              </p>
                              <p className="text-muted-foreground">
                                You answered {quizResult.summary.correctCount} out of {quizResult.summary.totalQuestions} questions correctly
                              </p>
                              {!quizResult.summary.passed && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  You need {quiz.passingScore}% to pass
                                </p>
                              )}
                            </div>
                          </Card>

                          {/* Show results */}
                          <div className="space-y-4">
                            {quiz.questions.map((q, index) => {
                              const result = quizResult.results.find(r => r.questionId === q.id);
                              return (
                                <Card key={q.id} className="p-6">
                                  <div className="flex items-start gap-3 mb-3">
                                    {result?.isCorrect ? (
                                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                                    )}
                                    <div className="flex-1">
                                      <h4 className="font-semibold mb-2">
                                        Question {index + 1}: {q.question}
                                      </h4>
                                      <p className="text-sm text-muted-foreground mb-2">
                                        Your answer:{" "}
                                        <span className={result?.isCorrect ? "text-green-600" : "text-red-600"}>
                                          {q.options[result?.userAnswer ?? 0]}
                                        </span>
                                      </p>
                                      {!result?.isCorrect && (
                                        <p className="text-sm text-green-600">
                                          Correct answer: {q.options[result?.correctAnswer ?? 0]}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>

                          {!quizResult.summary.passed && (
                            <Button
                              onClick={() => {
                                setQuizResult(null);
                                setQuizAnswers({});
                              }}
                              className="w-full mt-6"
                            >
                              Try Again
                            </Button>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground">Quiz not available</p>
                  )}
                </div>
              )}

              {/* Mark Complete button (for non-quiz lessons) */}
              {!currentLesson?.quiz && !isLessonCompleted && (
                <div className="mt-8 pt-6 border-t">
                  <Button
                    onClick={handleMarkComplete}
                    disabled={markingComplete}
                    className="w-full"
                  >
                    {markingComplete ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Marking Complete...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Mark Lesson as Complete
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousLesson}
                disabled={currentLessonIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {currentLessonIndex === lessons.length - 1 ? (
                <Button onClick={() => onNavigate("student-dashboard")}>
                  <Check className="w-4 h-4 mr-2" />
                  Done
                </Button>
              ) : (
                <Button onClick={goToNextLesson}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Lesson List Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Course Content</h3>
              <div className="space-y-2">
                {lessons.map((lesson, index) => {
                  const lessonProgress = progress?.lessons?.find(l => l.id === lesson.id);
                  const isComplete = lessonProgress?.completed || false;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLessonIndex(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentLessonIndex === index
                          ? "bg-primary text-primary-foreground"
                          : isComplete
                          ? "bg-muted hover:bg-muted/70"
                          : "bg-card hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {isComplete ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{lesson.title}</div>
                          <div className={`text-xs mt-1 ${
                            currentLessonIndex === index ? "opacity-90" : "text-muted-foreground"
                          }`}>
                            {lesson.quiz ? "Quiz" : lesson.videoUrl ? "Video" : "Reading"}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
