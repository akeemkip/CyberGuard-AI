import { useState, useEffect } from "react";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { marked } from "marked";
import api from "../services/api";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  Shield,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  Play,
  FileText,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  Target,
  Sparkles,
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useSettings } from "../context/SettingsContext";
import { UserProfileDropdown } from "./user-profile-dropdown";
import { LessonChatPanel } from "./lesson-chat-panel";
import courseService, {
  Course,
  Module,
  Lesson,
  CourseProgress,
  Quiz,
  QuizQuestion,
  QuizSubmissionResponse,
  LabWithProgress
} from "../services/course.service";

// Interface for shuffled quiz questions
interface ShuffledQuizQuestion extends QuizQuestion {
  shuffledOptions: string[];
  originalIndexMap: number[]; // Maps shuffled index to original index
}

interface CoursePlayerProps {
  userEmail: string;
  onNavigate: (page: string, courseId?: string) => void;
  onLogout: () => void;
  courseId: string | null;
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

// Helper function to shuffle quiz question options
const shuffleQuizQuestion = (question: QuizQuestion): ShuffledQuizQuestion => {
  const indexMap = question.options.map((_, index) => index);
  const shuffledIndexes = shuffleArray(indexMap);
  const shuffledOptions = shuffledIndexes.map((index) => question.options[index]);

  return {
    ...question,
    shuffledOptions,
    originalIndexMap: shuffledIndexes
  };
};

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
  const [shuffledQuiz, setShuffledQuiz] = useState<ShuffledQuizQuestion[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [questionId: string]: number }>({});
  const [quizResult, setQuizResult] = useState<QuizSubmissionResponse | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  // Video availability state
  const [videoError, setVideoError] = useState(false);
  const [videoChecked, setVideoChecked] = useState(false);

  // Module collapse state (track which modules are collapsed)
  const [collapsedModules, setCollapsedModules] = useState<Set<string>>(new Set());

  // Labs state
  const [labs, setLabs] = useState<LabWithProgress[]>([]);
  const [loadingLabs, setLoadingLabs] = useState(false);

  // AI Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAiHint, setShowAiHint] = useState(true);
  const [chatMessages, setChatMessages] = useState<{ id: number; role: "user" | "assistant" | "system"; content: string; timestamp: Date }[]>([
    { id: 1, role: "assistant", content: "", timestamp: new Date() }
  ]);

  const toggleModuleCollapse = (moduleId: string) => {
    setCollapsedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  // Fetch course data
  useEffect(() => {
    if (!courseId) {
      setError("No course selected");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [courseData, progressData] = await Promise.all([
          courseService.getCourseById(courseId),
          courseService.getCourseProgress(courseId)
        ]);

        if (cancelled) return;

        setCourse(courseData);
        setProgress(progressData);

        // Find first incomplete lesson or start at beginning
        if (progressData.lessons) {
          const firstIncompleteIndex = progressData.lessons.findIndex(l => !l.completed);
          setCurrentLessonIndex(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0);
        }

        // Load labs for this course
        loadCourseLabs(courseId, () => cancelled);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to fetch course:", err);
        setError("Failed to load course. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [courseId]);

  // Load labs for course
  const loadCourseLabs = async (courseId: string, isCancelled?: () => boolean) => {
    try {
      setLoadingLabs(true);
      const courseLabs = await courseService.getCourseLabs(courseId);
      if (isCancelled?.()) return;
      setLabs(courseLabs);
    } catch (err) {
      if (isCancelled?.()) return;
      console.error("Error loading labs:", err);
      toast.error("Failed to load labs. They may be unavailable for this course.");
    } finally {
      if (!isCancelled?.()) setLoadingLabs(false);
    }
  };

  // Get current lesson data
  const lessons = course?.lessons || [];
  const currentLesson = lessons[currentLessonIndex];
  const currentLessonProgress = progress?.lessons?.find(l => l.id === currentLesson?.id);
  const isLessonCompleted = currentLessonProgress?.completed || false;
  const overallProgress = progress?.summary?.percentage || 0;

  // Load quiz when lesson changes (if lesson has a quiz)
  // Check if video URL is valid when lesson changes
  useEffect(() => {
    setVideoError(false);
    setVideoChecked(false);

    if (!currentLesson?.videoUrl) return;

    // Extract video ID and check via oEmbed
    const match = currentLesson.videoUrl.match(/[?&]v=([^&]+)/);
    if (!match) {
      setVideoChecked(true);
      return;
    }

    let cancelled = false;
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${match[1]}&format=json`)
      .then(res => {
        if (cancelled) return;
        if (!res.ok) setVideoError(true);
        setVideoChecked(true);
      })
      .catch(() => {
        if (cancelled) return;
        // Network error - show iframe anyway, let YouTube handle it
        setVideoChecked(true);
      });

    return () => { cancelled = true; };
  }, [currentLesson?.id]);

  useEffect(() => {
    let cancelled = false;

    if (currentLesson?.quiz?.id) {
      loadQuiz(currentLesson.quiz.id, () => cancelled);
    } else {
      setQuiz(null);
      setQuizAnswers({});
      setQuizResult(null);
    }

    return () => { cancelled = true; };
  }, [currentLesson?.id]);

  const loadQuiz = async (quizId: string, isCancelled?: () => boolean) => {
    try {
      setLoadingQuiz(true);
      const quizData = await courseService.getQuiz(quizId);
      if (isCancelled?.()) return;
      setQuiz(quizData);
      // Shuffle the answer options for each question
      const shuffled = quizData.questions.map(shuffleQuizQuestion);
      setShuffledQuiz(shuffled);
      setQuizAnswers({});
      setQuizResult(null);
    } catch (err) {
      if (isCancelled?.()) return;
      console.error("Failed to load quiz:", err);
      toast.error("Failed to load quiz. Please try changing lessons and coming back.");
    } finally {
      if (!isCancelled?.()) setLoadingQuiz(false);
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
      // Map shuffled answers back to original indexes
      const originalAnswers: { [questionId: string]: number } = {};
      Object.keys(quizAnswers).forEach((questionId) => {
        const shuffledQuestion = shuffledQuiz.find(q => q.id === questionId);
        if (shuffledQuestion) {
          const shuffledAnswerIndex = quizAnswers[questionId];
          // Map back to original index
          originalAnswers[questionId] = shuffledQuestion.originalIndexMap[shuffledAnswerIndex];
        }
      });

      const result = await courseService.submitQuizAttempt(quiz.id, originalAnswers);
      setQuizResult(result);

      // If passed, mark lesson complete (non-critical — quiz is already recorded)
      if (result.summary.passed && !isLessonCompleted) {
        toast.success(`Quiz passed with ${result.summary.score}%! 🎉`);
        try {
          await handleMarkComplete();
        } catch (markErr) {
          console.error("Failed to auto-mark lesson complete after quiz pass:", markErr);
          // Quiz was submitted successfully, just lesson marking failed
        }
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

  const handleGetExplanation = async () => {
    if (!quiz || !quizResult) return;
    setIsLoadingExplanation(true);
    try {
      const response = await api.post('/ai/quiz-explanation', {
        quizTitle: quiz.title,
        questions: quiz.questions.map(q => ({ question: q.question, options: q.options })),
        results: quizResult.results,
        score: quizResult.summary.score,
        passed: quizResult.summary.passed
      });
      setAiExplanation(response.data.explanation);
    } catch (error) {
      console.error('Error getting AI explanation:', error);
      setAiExplanation('Unable to generate explanation. Please try again.');
    } finally {
      setIsLoadingExplanation(false);
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

  // Render HTML content from rich text editor
  const renderContent = (content: string) => {
    if (!content) return null;

    // Check if content has structural HTML (block-level tags, not just inline like <strong>)
    const hasHTML = /<(p|div|h[1-6]|ul|ol|li|table|br|blockquote)[\s>]/i.test(content);

    let processedContent = content;

    // If it's plain text or markdown-like text, convert to HTML
    if (!hasHTML) {
      // First, insert newlines before markdown headers if they're inline
      let textContent = content
        .replace(/\s*(#{1,4})\s+/g, '\n$1 ')  // Add newline before headers
        .replace(/\s*###\s+/g, '\n### ')       // Ensure ### headers have newlines
        .trim();

      // Parse markdown-style formatting
      const lines = textContent.split('\n');
      const htmlLines: string[] = [];
      let inUnorderedList = false;
      let inOrderedList = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) {
          // Close any open lists
          if (inUnorderedList) {
            htmlLines.push('</ul>');
            inUnorderedList = false;
          }
          if (inOrderedList) {
            htmlLines.push('</ol>');
            inOrderedList = false;
          }
          htmlLines.push('<br>');
          continue;
        }

        // Check for headers (must be at start of line)
        if (line.startsWith('#### ')) {
          if (inUnorderedList) { htmlLines.push('</ul>'); inUnorderedList = false; }
          if (inOrderedList) { htmlLines.push('</ol>'); inOrderedList = false; }
          htmlLines.push(`<h4>${line.substring(5).trim()}</h4>`);
        } else if (line.startsWith('### ')) {
          if (inUnorderedList) { htmlLines.push('</ul>'); inUnorderedList = false; }
          if (inOrderedList) { htmlLines.push('</ol>'); inOrderedList = false; }
          htmlLines.push(`<h3>${line.substring(4).trim()}</h3>`);
        } else if (line.startsWith('## ')) {
          if (inUnorderedList) { htmlLines.push('</ul>'); inUnorderedList = false; }
          if (inOrderedList) { htmlLines.push('</ol>'); inOrderedList = false; }
          htmlLines.push(`<h2>${line.substring(3).trim()}</h2>`);
        } else if (line.startsWith('# ')) {
          if (inUnorderedList) { htmlLines.push('</ul>'); inUnorderedList = false; }
          if (inOrderedList) { htmlLines.push('</ol>'); inOrderedList = false; }
          htmlLines.push(`<h1>${line.substring(2).trim()}</h1>`);
        }
        // Check for unordered list items
        else if (line.startsWith('- ') || line.startsWith('* ')) {
          if (inOrderedList) { htmlLines.push('</ol>'); inOrderedList = false; }
          if (!inUnorderedList) {
            htmlLines.push('<ul>');
            inUnorderedList = true;
          }
          htmlLines.push(`<li>${line.substring(2).trim()}</li>`);
        }
        // Check for numbered lists
        else if (/^\d+\.\s/.test(line)) {
          if (inUnorderedList) { htmlLines.push('</ul>'); inUnorderedList = false; }
          if (!inOrderedList) {
            htmlLines.push('<ol>');
            inOrderedList = true;
          }
          htmlLines.push(`<li>${line.replace(/^\d+\.\s/, '').trim()}</li>`);
        }
        // Regular paragraph
        else {
          if (inUnorderedList) { htmlLines.push('</ul>'); inUnorderedList = false; }
          if (inOrderedList) { htmlLines.push('</ol>'); inOrderedList = false; }
          htmlLines.push(`<p>${line}</p>`);
        }
      }

      // Close any remaining open lists
      if (inUnorderedList) htmlLines.push('</ul>');
      if (inOrderedList) htmlLines.push('</ol>');

      processedContent = htmlLines.join('\n');
    }

    // Convert inline markdown: **bold**, *italic*, `code`
    processedContent = processedContent
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

    // Sanitize HTML to prevent XSS attacks
    const sanitizedHTML = DOMPurify.sanitize(processedContent, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'blockquote',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'span', 'div'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'title',
        'class', 'style', 'align'
      ],
      ALLOWED_STYLES: {
        '*': {
          'color': [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/, /^rgba\(/],
          'background-color': [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/, /^rgba\(/],
          'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
          'line-height': [/.*/]
        }
      }
    });

    return (
      <div
        className="lesson-content"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
    );
  };

  // Render quiz question text (supports HTML or plain text)
  const renderQuizText = (text: string) => {
    if (!text) return null;

    // Check if it contains HTML tags
    const hasHTML = /<[a-z][\s\S]*>/i.test(text);

    if (hasHTML) {
      // Sanitize and render as HTML
      const sanitizedHTML = DOMPurify.sanitize(text, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'code'],
        ALLOWED_ATTR: []
      });
      return <span dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
    }

    // Return as plain text
    return <span>{text}</span>;
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
                aria-label="Back to courses"
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
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
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
                <div className="flex items-center gap-3">
                  {isLessonCompleted && (
                    <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <Check className="w-4 h-4" />
                      Completed
                    </span>
                  )}
                  <div className="relative">
                    {showAiHint && !isChatOpen && (
                      <div className="absolute -top-12 right-0 whitespace-nowrap bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-lg shadow-lg animate-bounce z-10">
                        Need help? Ask AI!
                        <div className="absolute -bottom-1 right-4 w-2 h-2 bg-primary rotate-45" />
                      </div>
                    )}
                    <button
                      onClick={() => { setIsChatOpen(true); setShowAiHint(false); }}
                      className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                      aria-label="Ask AI about this lesson"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden sm:inline">AI Assistant</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Video embed if available */}
              {currentLesson?.videoUrl && videoChecked && (
                <div className="aspect-video bg-muted rounded-lg mb-6 overflow-hidden relative">
                  {videoError ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground">
                      <Play className="w-12 h-12 mb-3 opacity-40" />
                      <p className="font-medium mb-1">Video Unavailable</p>
                      <p className="text-sm opacity-70">This video could not be loaded or may have been removed</p>
                      <a
                        href={currentLesson.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 text-sm text-primary hover:underline"
                      >
                        Try opening on YouTube
                      </a>
                    </div>
                  ) : (
                    <iframe
                      src={`${currentLesson.videoUrl.replace('watch?v=', 'embed/')}${savedSettings.autoPlayVideos ? '?autoplay=1' : ''}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={currentLesson.title}
                    />
                  )}
                </div>
              )}

              {/* Lesson content */}
              {currentLesson?.content && !currentLesson?.quiz && (
                <div className="max-w-none">
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
                            {shuffledQuiz.map((q, index) => (
                              <Card key={q.id} className="p-6">
                                <h4 className="font-semibold mb-4">
                                  Question {index + 1}: {renderQuizText(q.question)}
                                </h4>
                                <div className="space-y-3">
                                  {q.shuffledOptions.map((option, optionIndex) => (
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
                            disabled={Object.keys(quizAnswers).length !== shuffledQuiz.length || submittingQuiz}
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
                                        Question {index + 1}: {renderQuizText(q.question)}
                                      </h4>
                                      <p className="text-sm text-muted-foreground mb-2">
                                        Your answer:{" "}
                                        <span className={result?.isCorrect ? "text-green-600" : "text-red-600"}>
                                          {result?.userAnswer === undefined || result?.userAnswer === -1
                                          ? "Not answered"
                                          : (q.options[result.userAnswer] ?? "Unknown")}
                                        </span>
                                      </p>
                                      {!result?.isCorrect && (
                                        <p className="text-sm text-green-600">
                                          Correct answer: {q.options[result?.correctAnswer ?? 0] ?? "Unknown"}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>

                          {/* AI Explanation */}
                          <div className="mt-6">
                            {!aiExplanation ? (
                              <Button
                                onClick={handleGetExplanation}
                                disabled={isLoadingExplanation}
                                variant="outline"
                                className="w-full"
                              >
                                {isLoadingExplanation ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating AI Review...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Get AI Review of Your Answers
                                  </>
                                )}
                              </Button>
                            ) : (
                              <Card className="p-4 bg-primary/5 border-primary/20">
                                <div className="flex items-center gap-2 mb-3">
                                  <Sparkles className="w-4 h-4 text-primary" />
                                  <h4 className="font-semibold text-sm">AI Review</h4>
                                </div>
                                <div className="prose prose-sm dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(aiExplanation) as string) }} />
                              </Card>
                            )}
                          </div>

                          {!quizResult.summary.passed && (
                            <Button
                              onClick={() => {
                                setQuizResult(null);
                                setQuizAnswers({});
                                setAiExplanation(null);
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
              <div className="space-y-3">
                {/* Group lessons by module */}
                {(() => {
                  const modules = course?.modules || [];
                  const lessonsWithModule = lessons.filter(l => l.moduleId);
                  const lessonsWithoutModule = lessons.filter(l => !l.moduleId);
                  const modulesWithLessons = modules
                    .map(module => ({
                      module,
                      lessons: lessonsWithModule
                        .filter(l => l.moduleId === module.id)
                        .sort((a, b) => a.order - b.order)
                    }))
                    .filter(m => m.lessons.length > 0)
                    .sort((a, b) => a.module.order - b.module.order);

                  return (
                    <>
                      {/* Render modules with lessons */}
                      {modulesWithLessons.map(({ module, lessons: moduleLessons }) => {
                        const isCollapsed = collapsedModules.has(module.id);
                        const completedCount = moduleLessons.filter(lesson =>
                          progress?.lessons?.find(l => l.id === lesson.id)?.completed
                        ).length;

                        return (
                          <div key={module.id} className="border border-border rounded-lg overflow-hidden">
                            {/* Module Header */}
                            <button
                              onClick={() => toggleModuleCollapse(module.id)}
                              className="w-full px-4 py-3 bg-muted hover:bg-muted/70 transition-colors flex items-center justify-between"
                              aria-expanded={!isCollapsed}
                              aria-label={`${module.title} - ${completedCount} of ${moduleLessons.length} completed`}
                            >
                              <div className="flex-1 text-left">
                                <div className="font-medium text-sm">{module.title}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {completedCount}/{moduleLessons.length} completed
                                </div>
                              </div>
                              {isCollapsed ? (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronUp className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>

                            {/* Module Lessons and Labs */}
                            {!isCollapsed && (
                              <div className="p-2 space-y-1">
                                {/* Lessons */}
                                {moduleLessons.map((lesson) => {
                                  const index = lessons.findIndex(l => l.id === lesson.id);
                                  const lessonProgress = progress?.lessons?.find(l => l.id === lesson.id);
                                  const isComplete = lessonProgress?.completed || false;

                                  return (
                                    <button
                                      key={lesson.id}
                                      onClick={() => setCurrentLessonIndex(index)}
                                      className={`w-full text-left p-2 rounded transition-colors ${
                                        currentLessonIndex === index
                                          ? "bg-primary text-primary-foreground"
                                          : isComplete
                                          ? "bg-muted/50 hover:bg-muted/70"
                                          : "bg-card hover:bg-muted/50"
                                      }`}
                                    >
                                      <div className="flex items-start gap-2">
                                        <div className="flex-shrink-0 mt-0.5">
                                          {isComplete ? (
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                          ) : (
                                            <Circle className="w-3.5 h-3.5" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm font-medium truncate">{lesson.title}</div>
                                          <div className={`text-xs mt-0.5 ${
                                            currentLessonIndex === index ? "opacity-90" : "text-muted-foreground"
                                          }`}>
                                            {lesson.quiz ? "Quiz" : lesson.videoUrl ? "Video" : "Reading"}
                                          </div>
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}

                                {/* Module Labs */}
                                {labs.filter(lab => lab.moduleId === module.id).map((lab) => (
                                  <button
                                    key={lab.id}
                                    onClick={() => onNavigate("lab-player", lab.id)}
                                    className="w-full text-left p-2 rounded transition-colors bg-card hover:bg-muted/50 border border-border"
                                  >
                                    <div className="flex items-start gap-2">
                                      <div className="flex-shrink-0 mt-0.5">
                                        {lab.status === 'COMPLETED' ? (
                                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                        ) : lab.status === 'IN_PROGRESS' ? (
                                          <Play className="w-3.5 h-3.5 text-blue-500" />
                                        ) : (
                                          <Target className="w-3.5 h-3.5 text-muted-foreground" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">{lab.title}</div>
                                        <div className="flex items-center gap-2 text-xs mt-0.5 text-muted-foreground">
                                          <span>Lab</span>
                                          {lab.estimatedTime && <span>• {lab.estimatedTime} min</span>}
                                          {lab.status === 'COMPLETED' && lab.completedAt && (
                                            <span className="text-green-600">✓ Completed</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Render unorganized lessons */}
                      {(lessonsWithoutModule.length > 0 || labs.filter(lab => !lab.moduleId).length > 0) && (
                        <div className="border border-border rounded-lg overflow-hidden">
                          <div className="px-4 py-3 bg-muted">
                            <div className="font-medium text-sm">Other Content</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {lessonsWithoutModule.filter(lesson =>
                                progress?.lessons?.find(l => l.id === lesson.id)?.completed
                              ).length}/{lessonsWithoutModule.length + labs.filter(lab => !lab.moduleId).length} completed
                            </div>
                          </div>
                          <div className="p-2 space-y-1">
                            {/* Unorganized Lessons */}
                            {lessonsWithoutModule.map((lesson) => {
                              const index = lessons.findIndex(l => l.id === lesson.id);
                              const lessonProgress = progress?.lessons?.find(l => l.id === lesson.id);
                              const isComplete = lessonProgress?.completed || false;

                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => setCurrentLessonIndex(index)}
                                  className={`w-full text-left p-2 rounded transition-colors ${
                                    currentLessonIndex === index
                                      ? "bg-primary text-primary-foreground"
                                      : isComplete
                                      ? "bg-muted/50 hover:bg-muted/70"
                                      : "bg-card hover:bg-muted/50"
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0 mt-0.5">
                                      {isComplete ? (
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                      ) : (
                                        <Circle className="w-3.5 h-3.5" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium truncate">{lesson.title}</div>
                                      <div className={`text-xs mt-0.5 ${
                                        currentLessonIndex === index ? "opacity-90" : "text-muted-foreground"
                                      }`}>
                                        {lesson.quiz ? "Quiz" : lesson.videoUrl ? "Video" : "Reading"}
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}

                            {/* Unorganized Labs */}
                            {labs.filter(lab => !lab.moduleId).map((lab) => (
                              <button
                                key={lab.id}
                                onClick={() => onNavigate("lab-player", lab.id)}
                                className="w-full text-left p-2 rounded transition-colors bg-card hover:bg-muted/50 border border-border"
                              >
                                <div className="flex items-start gap-2">
                                  <div className="flex-shrink-0 mt-0.5">
                                    {lab.status === 'COMPLETED' ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                    ) : lab.status === 'IN_PROGRESS' ? (
                                      <Play className="w-3.5 h-3.5 text-blue-500" />
                                    ) : (
                                      <Target className="w-3.5 h-3.5 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{lab.title}</div>
                                    <div className="flex items-center gap-2 text-xs mt-0.5 text-muted-foreground">
                                      <span>Lab</span>
                                      {lab.estimatedTime && <span>• {lab.estimatedTime} min</span>}
                                      {lab.status === 'COMPLETED' && lab.completedAt && (
                                        <span className="text-green-600">✓ Completed</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Lesson Chat Panel */}
      <LessonChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        lessonTitle={currentLesson?.title || ""}
        lessonContent={currentLesson?.content || ""}
        courseTitle={course.title}
        messages={chatMessages}
        onMessagesChange={setChatMessages}
      />
    </div>
  );
}
