import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
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
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  HelpCircle,
  Target,
  Users,
  TrendingUp,
  Moon,
  Sun,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useTheme } from "./theme-provider";
import { AdminSidebar } from "./admin-sidebar";
import { RichTextEditor } from "./RichTextEditor";
import adminService, { QuizQuestion, QuizFull, QuizAttempt } from "../services/admin.service";
import courseService, { Course } from "../services/course.service";

interface AdminQuizEditProps {
  quizId: string | null;
  userEmail: string;
  onNavigate: (page: string, idParam?: string) => void;
  onLogout: () => void;
}

// Sortable Question Item Component
interface SortableQuestionProps {
  question: QuizQuestion;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableQuestion({ question, index, onEdit, onDelete }: SortableQuestionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.order.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Strip HTML tags for preview
  const stripHtml = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="p-4 mb-3">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <button
            className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5" />
          </button>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-sm">Question {index + 1}</h4>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onDelete}>
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {stripHtml(question.question)}
            </p>
            <div className="space-y-1">
              {question.options.map((option, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    idx === question.correctAnswer
                      ? 'bg-green-500 text-white'
                      : 'bg-muted'
                  }`}>
                    {idx === question.correctAnswer && '✓'}
                  </div>
                  <span className={idx === question.correctAnswer ? 'font-semibold' : 'text-muted-foreground'}>
                    {option}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function AdminQuizEdit({ quizId, userEmail, onNavigate, onLogout }: AdminQuizEditProps) {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Quiz data
  const [title, setTitle] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [stats, setStats] = useState<{ totalAttempts: number; passRate: number; averageScore: number } | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [attemptsOpen, setAttemptsOpen] = useState(false);

  // Lessons data for dropdown
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessonsWithQuizzes, setLessonsWithQuizzes] = useState<Set<string>>(new Set());

  // Question editor state
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [editorQuestion, setEditorQuestion] = useState("");
  const [editorOptions, setEditorOptions] = useState<string[]>(["", ""]);
  const [editorCorrectAnswer, setEditorCorrectAnswer] = useState(0);

  // Unsaved changes dialog
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(false);

  // Drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchData();
  }, [quizId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch all courses with lessons
      const allCourses = await courseService.getAllCourses(false);
      const coursesWithLessons = await Promise.all(
        allCourses.map(async (course) => {
          const detailedCourse = await courseService.getCourseById(course.id);
          return detailedCourse;
        })
      );
      setCourses(coursesWithLessons);

      // Fetch all quizzes to know which lessons already have quizzes
      const allQuizzes = await adminService.getAllQuizzes();
      const quizLessonIds = new Set(allQuizzes.map(q => q.lessonId));
      setLessonsWithQuizzes(quizLessonIds);

      // If editing existing quiz, fetch it
      if (quizId) {
        const quiz = await adminService.getQuizById(quizId);
        setTitle(quiz.title);
        setLessonId(quiz.lessonId);
        setPassingScore(quiz.passingScore);
        setQuestions(quiz.questions);
        setStats(quiz.stats);
        setAttempts(quiz.attempts || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load quiz data");
      onNavigate('admin-content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestionIndex(null);
    setEditorQuestion("");
    setEditorOptions(["", ""]);
    setEditorCorrectAnswer(0);
    setShowQuestionEditor(true);
  };

  const handleEditQuestion = (index: number) => {
    const question = questions[index];
    setEditingQuestionIndex(index);
    setEditorQuestion(question.question);
    setEditorOptions([...question.options]);
    setEditorCorrectAnswer(question.correctAnswer);
    setShowQuestionEditor(true);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    // Update order values
    const reorderedQuestions = updatedQuestions.map((q, i) => ({ ...q, order: i }));
    setQuestions(reorderedQuestions);
    setHasUnsavedChanges(true);
  };

  const handleSaveQuestion = () => {
    // Validation
    const questionText = editorQuestion.trim();
    if (!questionText || questionText.length < 10) {
      toast.error("Question must be at least 10 characters");
      return;
    }

    const validOptions = editorOptions.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast.error("Please provide at least 2 answer options");
      return;
    }

    if (validOptions.length > 6) {
      toast.error("Maximum 6 answer options allowed");
      return;
    }

    if (editorCorrectAnswer >= validOptions.length) {
      toast.error("Please select a valid correct answer");
      return;
    }

    const newQuestion: QuizQuestion = {
      question: questionText,
      options: validOptions,
      correctAnswer: editorCorrectAnswer,
      order: editingQuestionIndex !== null ? questions[editingQuestionIndex].order : questions.length
    };

    if (editingQuestionIndex !== null) {
      // Update existing question
      const updated = [...questions];
      updated[editingQuestionIndex] = newQuestion;
      setQuestions(updated);
    } else {
      // Add new question
      setQuestions([...questions, newQuestion]);
    }

    setHasUnsavedChanges(true);
    setShowQuestionEditor(false);
    toast.success(editingQuestionIndex !== null ? "Question updated" : "Question added");
  };

  const handleAddOption = () => {
    if (editorOptions.length >= 6) {
      toast.error("Maximum 6 options allowed");
      return;
    }
    setEditorOptions([...editorOptions, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (editorOptions.length <= 2) {
      toast.error("Minimum 2 options required");
      return;
    }
    const updated = editorOptions.filter((_, i) => i !== index);
    setEditorOptions(updated);
    // Adjust correct answer if needed
    if (editorCorrectAnswer >= updated.length) {
      setEditorCorrectAnswer(updated.length - 1);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex(q => q.order.toString() === active.id);
    const newIndex = questions.findIndex(q => q.order.toString() === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(questions, oldIndex, newIndex);
    const updated = reordered.map((q, i) => ({ ...q, order: i }));
    setQuestions(updated);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }

    if (!lessonId) {
      toast.error("Please select a lesson");
      return;
    }

    if (passingScore < 1 || passingScore > 100) {
      toast.error("Passing score must be between 1 and 100");
      return;
    }

    if (questions.length < 2) {
      toast.error("Quiz must have at least 2 questions");
      return;
    }

    // Validate all questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || q.question.trim().length < 10) {
        toast.error(`Question ${i + 1} is too short`);
        return;
      }
      if (q.options.length < 2 || q.options.length > 6) {
        toast.error(`Question ${i + 1} must have 2-6 options`);
        return;
      }
      if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
        toast.error(`Question ${i + 1} has invalid correct answer`);
        return;
      }
    }

    try {
      setIsSaving(true);

      const data = {
        title: title.trim(),
        lessonId,
        passingScore,
        questions: questions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          order: q.order
        }))
      };

      if (quizId) {
        await adminService.updateQuiz(quizId, data);
        toast.success("Quiz updated successfully!");
      } else {
        await adminService.createQuiz(data);
        toast.success("Quiz created successfully!");
      }

      setHasUnsavedChanges(false);
      onNavigate('admin-content');
    } catch (error: any) {
      console.error("Error saving quiz:", error);
      toast.error(error.response?.data?.error || "Failed to save quiz");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setPendingNavigation(true);
      setShowUnsavedDialog(true);
    } else {
      onNavigate('admin-content');
    }
  };

  const confirmLeave = () => {
    setShowUnsavedDialog(false);
    setHasUnsavedChanges(false);
    onNavigate('admin-content');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AdminSidebar
        userEmail={userEmail}
        currentPage="admin-content"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{quizId ? 'Edit Quiz' : 'Create Quiz'}</h1>
                <p className="text-muted-foreground">
                  {quizId ? 'Update quiz details and questions' : 'Create a new quiz for a lesson'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Quiz
                  </>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Quiz Details */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quiz Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Module 1 Assessment"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="lesson">Assign to Lesson</Label>
                  <Select value={lessonId} onValueChange={(value) => {
                    setLessonId(value);
                    setHasUnsavedChanges(true);
                  }}>
                    <SelectTrigger id="lesson">
                      <SelectValue placeholder="Select a lesson" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        course.lessons && course.lessons.length > 0 && (
                          <div key={course.id}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                              {course.title}
                            </div>
                            {course.lessons.map(lesson => {
                              const hasQuiz = lessonsWithQuizzes.has(lesson.id);
                              const isCurrentLesson = lesson.id === lessonId;
                              const isDisabled = hasQuiz && !isCurrentLesson;

                              return (
                                <SelectItem
                                  key={lesson.id}
                                  value={lesson.id}
                                  disabled={isDisabled}
                                >
                                  {lesson.title}
                                  {isDisabled && <span className="text-muted-foreground ml-2">(Has Quiz)</span>}
                                </SelectItem>
                              );
                            })}
                          </div>
                        )
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lessons that already have quizzes are disabled
                  </p>
                </div>

                <div>
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    min="1"
                    max="100"
                    value={passingScore}
                    onChange={(e) => {
                      setPassingScore(Number(e.target.value));
                      setHasUnsavedChanges(true);
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum score required to pass (1-100%)
                  </p>
                </div>
              </div>
            </Card>

            {/* Statistics (if editing) */}
            {stats && stats.totalAttempts > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Quiz Statistics</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Attempts</p>
                      <p className="text-2xl font-bold">{stats.totalAttempts}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pass Rate</p>
                      <p className="text-2xl font-bold">{stats.passRate}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Average Score</p>
                      <p className="text-2xl font-bold">{stats.averageScore}%</p>
                    </div>
                  </div>
                </div>

                {/* Student Attempts Collapsible */}
                {attempts.length > 0 && (
                  <Collapsible open={attemptsOpen} onOpenChange={setAttemptsOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Student Attempts ({attempts.length})
                        </span>
                        {attemptsOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left p-3 text-sm font-medium">Student</th>
                              <th className="text-left p-3 text-sm font-medium">Score</th>
                              <th className="text-left p-3 text-sm font-medium">Status</th>
                              <th className="text-left p-3 text-sm font-medium">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attempts.map((attempt) => (
                              <tr key={attempt.id} className="border-t border-border">
                                <td className="p-3">
                                  <div>
                                    <p className="font-medium">
                                      {attempt.student.firstName && attempt.student.lastName
                                        ? `${attempt.student.firstName} ${attempt.student.lastName}`
                                        : attempt.student.email}
                                    </p>
                                    {attempt.student.firstName && (
                                      <p className="text-xs text-muted-foreground">{attempt.student.email}</p>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <span className="font-semibold">{attempt.score}%</span>
                                </td>
                                <td className="p-3">
                                  {attempt.passed ? (
                                    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                                      <CheckCircle className="w-4 h-4" />
                                      Passed
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                                      <XCircle className="w-4 h-4" />
                                      Failed
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-sm text-muted-foreground">
                                  {new Date(attempt.attemptedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </Card>
            )}

            {/* Questions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  Questions ({questions.length})
                </h2>
                <Button onClick={handleAddQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No questions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add at least 2 questions to create a quiz
                  </p>
                  <Button onClick={handleAddQuestion}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={questions.map(q => q.order.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    {questions.map((question, index) => (
                      <SortableQuestion
                        key={question.order}
                        question={question}
                        index={index}
                        onEdit={() => handleEditQuestion(index)}
                        onDelete={() => handleDeleteQuestion(index)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </Card>
          </div>
        </main>
      </div>

      {/* Question Editor Dialog */}
      <Dialog open={showQuestionEditor} onOpenChange={setShowQuestionEditor}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestionIndex !== null ? 'Edit Question' : 'Add Question'}
            </DialogTitle>
            <DialogDescription>
              Create a multiple-choice question with 2-6 answer options
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Question Text */}
            <div>
              <Label>Question Text</Label>
              <RichTextEditor
                content={editorQuestion}
                onChange={setEditorQuestion}
                placeholder="Enter your question here..."
              />
            </div>

            {/* Answer Options */}
            <div>
              <Label>Answer Options</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Select the correct answer by clicking the radio button
              </p>
              <div className="space-y-2">
                {editorOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={editorCorrectAnswer === index}
                      onChange={() => setEditorCorrectAnswer(index)}
                      className="w-4 h-4"
                    />
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const updated = [...editorOptions];
                        updated[index] = e.target.value;
                        setEditorOptions(updated);
                      }}
                      className="flex-1"
                    />
                    {editorOptions.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {editorOptions.length < 6 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  className="mt-2"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Option
                </Button>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuestionEditor(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveQuestion}>
              <Save className="w-4 h-4 mr-2" />
              Save Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? All changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLeave} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Leave Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
