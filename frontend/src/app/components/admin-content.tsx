import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { marked } from 'marked';
import { RichTextEditor } from './RichTextEditor';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Moon,
  Sun,
  Plus,
  Edit,
  Trash2,
  Video,
  Save,
  Loader2,
  Eye,
  EyeOff,
  BookOpen,
  Upload,
  Link,
  GripVertical,
  Image,
  Search,
  HelpCircle,
  TrendingUp,
  Target,
  Users,
  Mail,
  AlertTriangle,
  ShieldCheck,
  ShieldX,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { useTheme } from "./theme-provider";
import courseService, { Course, Lesson } from "../services/course.service";
import adminService, { QuizWithStats, Module, LabWithStats } from "../services/admin.service";
import phishingService, { ScenarioWithStats, AdminPhishingStats } from "../services/phishing.service";
import { AdminSidebar } from "./admin-sidebar";

// Sortable Lesson Item Component
interface SortableLessonProps {
  lesson: Lesson;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableLesson({ lesson, onEdit, onDelete }: SortableLessonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-3 border border-border rounded-lg bg-card transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-grab active:cursor-grabbing"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-medium">
        {lesson.order}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{lesson.title}</h4>
        <p className="text-sm text-muted-foreground">
          {lesson.videoUrl ? "Video lesson" : "Text lesson"}
          {lesson.quiz && " • Has quiz"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          title="Edit lesson"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          title="Delete lesson"
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

// Sortable Module Card Component
interface SortableModuleCardProps {
  module: Module;
  onEdit: (module: Module) => void;
  onDelete: (module: Module) => void;
  isDeleting: boolean;
}

function SortableModuleCard({ module, onEdit, onDelete, isDeleting }: SortableModuleCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-start gap-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none mt-1"
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{module.title}</h3>
                {module.description && (
                  <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {module.lessonCount || 0} lesson{(module.lessonCount || 0) !== 1 ? 's' : ''}
                  </span>
                  <span>Order: {module.order + 1}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(module)}
                  disabled={isDeleting}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(module)}
                  disabled={isDeleting}
                  className="text-destructive hover:text-destructive"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Video Preview Component
interface VideoPreviewProps {
  url: string;
}

function VideoPreview({ url }: VideoPreviewProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  // Reset states when URL changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    setKey(prev => prev + 1);

    // Set timeout for loading state (10 seconds)
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setHasError(true);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [url]);

  if (!url) return null;

  // Extract video ID and determine platform
  const getVideoInfo = (videoUrl: string) => {
    // YouTube
    const youtubeMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) {
      return { platform: 'youtube', id: youtubeMatch[1], embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
    }

    // Vimeo
    const vimeoMatch = videoUrl.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
    if (vimeoMatch) {
      return { platform: 'vimeo', id: vimeoMatch[1], embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
    }

    // Already an embed URL or direct video
    if (videoUrl.includes('embed') || videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm')) {
      return { platform: 'direct', id: null, embedUrl: videoUrl };
    }

    return null;
  };

  const videoInfo = getVideoInfo(url);

  if (!videoInfo) {
    return (
      <div className="mt-2 p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          Invalid video URL. Please use YouTube, Vimeo, or direct video links.
        </p>
      </div>
    );
  }

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setKey(prev => prev + 1);
  };

  return (
    <div className="mt-2 border border-border rounded-lg overflow-hidden bg-black">
      {isLoading && !hasError && (
        <div className="flex flex-col items-center justify-center h-48 bg-muted gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading video preview...</p>
        </div>
      )}
      {hasError ? (
        <div className="p-6 text-center bg-destructive/10">
          <p className="text-sm text-destructive mb-2">
            Failed to load video preview. The video may be private, blocked, or taking too long to load.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            URL: {videoInfo.embedUrl}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
          >
            Retry
          </Button>
        </div>
      ) : (
        <iframe
          key={key}
          src={videoInfo.embedUrl}
          className={`w-full h-64 ${isLoading ? 'hidden' : 'block'}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
}

interface AdminContentProps {
  userEmail: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminContent({ userEmail, onNavigate, onLogout }: AdminContentProps) {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("adminContentTab") || "courses";
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    thumbnail: "",
    difficulty: "Beginner",
    duration: "",
    isPublished: false
  });
  const [imageUploadMode, setImageUploadMode] = useState<"url" | "upload">("url");

  // Convert markdown to HTML for rich text editor
  const convertMarkdownToHtml = (markdown: string): string => {
    if (!markdown) return '';

    // Check if content is already HTML (contains HTML tags)
    const hasHtmlTags = /<[^>]+>/.test(markdown);
    if (hasHtmlTags) {
      return markdown; // Already HTML, return as is
    }

    // Convert markdown to HTML
    try {
      return marked.parse(markdown, { breaks: true, gfm: true }) as string;
    } catch (error) {
      console.error('Error converting markdown:', error);
      return markdown; // Return original if conversion fails
    }
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  // Lesson management state
  const [showCreateLesson, setShowCreateLesson] = useState(false);
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState<string>("");
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [isDeletingLesson, setIsDeletingLesson] = useState(false);
  const [showDeleteLessonDialog, setShowDeleteLessonDialog] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    videoUrl: "",
    order: 1
  });

  // Quiz management state
  const [quizzes, setQuizzes] = useState<QuizWithStats[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [quizSearch, setQuizSearch] = useState("");
  const [quizFilterCourse, setQuizFilterCourse] = useState<string>("all");
  const [deletingQuizId, setDeletingQuizId] = useState<string | null>(null);
  const [showDeleteQuizDialog, setShowDeleteQuizDialog] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<QuizWithStats | null>(null);

  // Lab management state
  const [labs, setLabs] = useState<LabWithStats[]>([]);
  const [isLoadingLabs, setIsLoadingLabs] = useState(false);
  const [labSearch, setLabSearch] = useState("");
  const [labFilterCourse, setLabFilterCourse] = useState<string>("all");
  const [labFilterDifficulty, setLabFilterDifficulty] = useState<string>("all");
  const [labFilterType, setLabFilterType] = useState<string>("all");
  const [deletingLabId, setDeletingLabId] = useState<string | null>(null);
  const [showDeleteLabDialog, setShowDeleteLabDialog] = useState(false);
  const [labToDelete, setLabToDelete] = useState<LabWithStats | null>(null);

  // Module management state
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedCourseForModules, setSelectedCourseForModules] = useState<string>("");
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [showEditModule, setShowEditModule] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [isUpdatingModule, setIsUpdatingModule] = useState(false);
  const [deletingModuleId, setDeletingModuleId] = useState<string | null>(null);
  const [showDeleteModuleDialog, setShowDeleteModuleDialog] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
    order: 0
  });

  // Phishing management state
  const [phishingScenarios, setPhishingScenarios] = useState<ScenarioWithStats[]>([]);
  const [phishingStats, setPhishingStats] = useState<AdminPhishingStats | null>(null);
  const [isLoadingPhishing, setIsLoadingPhishing] = useState(false);
  const [phishingSearch, setPhishingSearch] = useState("");
  const [phishingFilterDifficulty, setPhishingFilterDifficulty] = useState<string>("all");
  const [phishingFilterCategory, setPhishingFilterCategory] = useState<string>("all");
  const [phishingFilterActive, setPhishingFilterActive] = useState<string>("all");
  const [deletingPhishingId, setDeletingPhishingId] = useState<string | null>(null);
  const [showDeletePhishingDialog, setShowDeletePhishingDialog] = useState(false);
  const [phishingToDelete, setPhishingToDelete] = useState<ScenarioWithStats | null>(null);
  const [phishingAttempts, setPhishingAttempts] = useState<any[]>([]);
  const [showPhishingAttempts, setShowPhishingAttempts] = useState(false);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(false);

  useEffect(() => {
    // Restore tab from browser history state if available (for back button navigation)
    const historyState = window.history.state;
    if (historyState?.activeTab) {
      setActiveTab(historyState.activeTab);
    }

    fetchCourses();
  }, []);

  // Save active tab to localStorage and update browser history
  useEffect(() => {
    localStorage.setItem("adminContentTab", activeTab);

    // Update the current history state with the active tab
    const currentState = window.history.state || {};
    window.history.replaceState(
      { ...currentState, activeTab },
      "",
      window.location.pathname
    );

    // Fetch quizzes when switching to quizzes tab
    if (activeTab === 'quizzes' && quizzes.length === 0) {
      fetchQuizzes();
    }
  }, [activeTab]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const allCourses = await courseService.getAllCourses(false);

      // Fetch detailed course data with lessons for each course
      const coursesWithLessons = await Promise.all(
        allCourses.map(async (course) => {
          try {
            const detailedCourse = await courseService.getCourseById(course.id);

            // Convert markdown content to HTML for all lessons
            if (detailedCourse.lessons) {
              detailedCourse.lessons = detailedCourse.lessons.map(lesson => ({
                ...lesson,
                content: convertMarkdownToHtml(lesson.content)
              }));
            }

            return detailedCourse;
          } catch (error) {
            console.error(`Error fetching details for course ${course.id}:`, error);
            return course; // Fallback to basic course data
          }
        })
      );

      setCourses(coursesWithLessons);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description) {
      toast.error("Please fill in title and description");
      return;
    }

    try {
      setIsCreatingCourse(true);
      const created = await courseService.createCourse({
        title: newCourse.title,
        description: newCourse.description,
        thumbnail: newCourse.thumbnail || undefined,
        difficulty: newCourse.difficulty,
        duration: newCourse.duration || undefined,
        isPublished: newCourse.isPublished
      });

      // New courses don't have lessons yet, so use the created data directly
      const newCourseWithLessons = {
        ...created,
        lessons: []
      };

      setCourses([newCourseWithLessons, ...courses]);
      toast.success("Course created successfully!");
      setShowCreateCourse(false);
      setNewCourse({
        title: "",
        description: "",
        thumbnail: "",
        difficulty: "Beginner",
        duration: "",
        isPublished: false
      });
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const handleEditCourse = async () => {
    if (!editingCourse) return;

    // Store original course for rollback on error
    const originalCourse = courses.find(c => c.id === editingCourse.id);

    try {
      // Optimistic update: Update UI immediately
      setCourses(courses.map(c => c.id === editingCourse.id ? editingCourse : c));
      setShowEditCourse(false);

      setIsEditingCourse(true);
      await courseService.updateCourse(editingCourse.id, {
        title: editingCourse.title,
        description: editingCourse.description,
        thumbnail: editingCourse.thumbnail || undefined,
        difficulty: editingCourse.difficulty,
        duration: editingCourse.duration || undefined,
        isPublished: editingCourse.isPublished
      });

      toast.success("Course updated successfully!");
      setEditingCourse(null);
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course. Please try again.");

      // Rollback optimistic update on error
      if (originalCourse) {
        setCourses(courses.map(c => c.id === editingCourse.id ? originalCourse : c));
      }
      setShowEditCourse(true);
    } finally {
      setIsEditingCourse(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    // Find course to get details for confirmation
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // Show confirmation with impact information
    const confirmed = window.confirm(
      `⚠️ DELETE COURSE: "${course.title}"\n\n` +
      `This will permanently delete:\n` +
      `• ${course._count?.lessons || 0} lesson(s)\n` +
      `• ${course._count?.enrollments || 0} student enrollment(s)\n` +
      `• All associated quizzes and progress data\n\n` +
      `THIS CANNOT BE UNDONE!\n\n` +
      `Are you absolutely sure you want to delete this course?`
    );

    if (!confirmed) return;

    // Store original courses for rollback on error
    const originalCourses = [...courses];

    try {
      // Optimistic update: Remove from UI immediately
      setCourses(courses.filter(c => c.id !== courseId));

      setDeletingId(courseId);
      await courseService.deleteCourse(courseId);

      toast.success("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course. Please try again.");

      // Rollback optimistic update on error
      setCourses(originalCourses);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (course: Course) => {
    const originalPublishState = course.isPublished;

    try {
      // Optimistic update: Toggle immediately in UI
      setCourses(courses.map(c =>
        c.id === course.id ? { ...c, isPublished: !c.isPublished } : c
      ));

      setPublishingId(course.id);
      await courseService.updateCourse(course.id, {
        isPublished: !originalPublishState
      });

      toast.success(originalPublishState ? "Course unpublished" : "Course published");
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Failed to update publish status. Please try again.");

      // Rollback optimistic update on error
      setCourses(courses.map(c =>
        c.id === course.id ? { ...c, isPublished: originalPublishState } : c
      ));
    } finally {
      setPublishingId(null);
    }
  };

  // Lesson handlers
  const handleCreateLesson = async () => {
    if (!newLesson.title || !newLesson.content) {
      toast.error("Please fill in title and content");
      return;
    }

    try {
      setIsCreatingLesson(true);
      const createdLesson = await courseService.createLesson(selectedCourseForLesson, {
        title: newLesson.title,
        content: newLesson.content,
        videoUrl: newLesson.videoUrl || undefined,
        order: newLesson.order
      });

      // Optimistic update: Add lesson to the specific course immediately
      setCourses(courses.map(course => {
        if (course.id === selectedCourseForLesson) {
          return {
            ...course,
            lessons: [...(course.lessons || []), createdLesson]
          };
        }
        return course;
      }));

      toast.success("Lesson created successfully!");
      setShowCreateLesson(false);
      setNewLesson({
        title: "",
        content: "",
        videoUrl: "",
        order: 1
      });
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast.error("Failed to create lesson. Please try again.");
    } finally {
      setIsCreatingLesson(false);
    }
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessonToDelete(lessonId);
    setShowDeleteLessonDialog(true);
  };

  const confirmDeleteLesson = async () => {
    if (!lessonToDelete) return;

    // Store original courses for rollback on error
    const originalCourses = [...courses];

    try {
      setIsDeletingLesson(true);

      // Optimistic update: Remove lesson from UI immediately
      setCourses(courses.map(course => ({
        ...course,
        lessons: course.lessons?.filter(lesson => lesson.id !== lessonToDelete)
      })));

      await courseService.deleteLesson(lessonToDelete);
      toast.success("Lesson deleted successfully!");
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Failed to delete lesson. Please try again.");

      // Rollback optimistic update on error
      setCourses(originalCourses);
    } finally {
      setIsDeletingLesson(false);
      setShowDeleteLessonDialog(false);
      setLessonToDelete(null);
    }
  };

  const openCreateLessonDialog = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    const nextOrder = (course?.lessons?.length || 0) + 1;
    setSelectedCourseForLesson(courseId);
    setNewLesson({
      title: "",
      content: "",
      videoUrl: "",
      order: nextOrder
    });
    setShowCreateLesson(true);
  };

  // Handle image file upload and convert to base64
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type - only allow common image formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, GIF, or WebP)');
      event.target.value = ''; // Clear the input
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      event.target.value = ''; // Clear the input
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (isEdit && editingCourse) {
        setEditingCourse({ ...editingCourse, thumbnail: base64String });
      } else {
        setNewCourse({ ...newCourse, thumbnail: base64String });
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read image file. Please try again.');
      event.target.value = ''; // Clear the input
    };

    reader.readAsDataURL(file);
  };

  // Handle drag end for lesson reordering
  const handleDragEnd = async (event: DragEndEvent, courseId: string) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const course = courses.find(c => c.id === courseId);
    if (!course?.lessons) return;

    const oldIndex = course.lessons.findIndex(l => l.id === active.id);
    const newIndex = course.lessons.findIndex(l => l.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Store original lessons for rollback on error
    const originalLessons = [...course.lessons];

    // Optimistically update UI
    const reorderedLessons = arrayMove(course.lessons, oldIndex, newIndex);

    // Update order values
    const updatedLessons = reorderedLessons.map((lesson, index) => ({
      ...lesson,
      order: index + 1
    }));

    // Update local state immediately for smooth UI
    setCourses(courses.map(c =>
      c.id === courseId ? { ...c, lessons: updatedLessons } : c
    ));

    try {
      // Update each lesson's order in the backend
      await Promise.all(
        updatedLessons.map(lesson =>
          courseService.updateLesson(lesson.id, { order: lesson.order })
        )
      );
    } catch (error) {
      console.error("Error reordering lessons:", error);
      toast.error("Failed to reorder lessons. Changes have been reverted.");

      // Rollback optimistic update on error
      setCourses(courses.map(c =>
        c.id === courseId ? { ...c, lessons: originalLessons } : c
      ));
    }
  };

  // ============================================
  // QUIZ MANAGEMENT FUNCTIONS
  // ============================================

  const fetchQuizzes = async () => {
    try {
      setIsLoadingQuizzes(true);
      const allQuizzes = await adminService.getAllQuizzes();
      setQuizzes(allQuizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast.error("Failed to load quizzes");
    } finally {
      setIsLoadingQuizzes(false);
    }
  };

  const handleEditQuiz = (quizId: string) => {
    // Navigate to quiz edit page
    onNavigate('admin-quiz-edit', quizId);
  };

  const handleDeleteQuizClick = (quiz: QuizWithStats) => {
    setQuizToDelete(quiz);
    setShowDeleteQuizDialog(true);
  };

  const confirmDeleteQuiz = async () => {
    if (!quizToDelete) return;

    try {
      setDeletingQuizId(quizToDelete.id);
      const result = await adminService.deleteQuiz(quizToDelete.id);

      // Remove from list
      setQuizzes(quizzes.filter(q => q.id !== quizToDelete.id));

      toast.success(`Quiz deleted successfully. ${result.deletedAttempts} student attempts were also removed.`);
      setShowDeleteQuizDialog(false);
      setQuizToDelete(null);
    } catch (error: any) {
      console.error("Error deleting quiz:", error);
      toast.error(error.response?.data?.error || "Failed to delete quiz");
    } finally {
      setDeletingQuizId(null);
    }
  };

  // Filter quizzes based on search and course filter
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(quizSearch.toLowerCase()) ||
      quiz.lessonTitle.toLowerCase().includes(quizSearch.toLowerCase()) ||
      quiz.courseTitle.toLowerCase().includes(quizSearch.toLowerCase());

    const matchesCourse = quizFilterCourse === 'all' || quiz.courseId === quizFilterCourse;

    return matchesSearch && matchesCourse;
  });

  // Get unique courses for filter dropdown
  const uniqueCourses = Array.from(new Set(quizzes.map(q => q.courseId)))
    .map(courseId => {
      const quiz = quizzes.find(q => q.courseId === courseId);
      return quiz ? { id: courseId, title: quiz.courseTitle } : null;
    })
    .filter(Boolean) as { id: string; title: string }[];

  // ============================================
  // LAB MANAGEMENT FUNCTIONS
  // ============================================

  const fetchLabs = async () => {
    try {
      setIsLoadingLabs(true);
      const allLabs = await adminService.getAllLabs();
      setLabs(allLabs);
    } catch (error) {
      console.error("Error fetching labs:", error);
      toast.error("Failed to load labs");
    } finally {
      setIsLoadingLabs(false);
    }
  };

  const handleDeleteLab = async (lab: LabWithStats) => {
    setLabToDelete(lab);
    setShowDeleteLabDialog(true);
  };

  const confirmDeleteLab = async () => {
    if (!labToDelete) return;

    try {
      setDeletingLabId(labToDelete.id);
      await adminService.deleteLab(labToDelete.id);
      toast.success("Lab deleted successfully");
      await fetchLabs();
      setShowDeleteLabDialog(false);
      setLabToDelete(null);
    } catch (error) {
      console.error("Error deleting lab:", error);
      toast.error("Failed to delete lab");
    } finally {
      setDeletingLabId(null);
    }
  };

  const filteredLabs = labs
    .filter(lab => {
      const matchesSearch = lab.title.toLowerCase().includes(labSearch.toLowerCase()) ||
                          lab.description.toLowerCase().includes(labSearch.toLowerCase());
      const matchesCourse = labFilterCourse === "all" || lab.courseId === labFilterCourse;
      const matchesDifficulty = labFilterDifficulty === "all" || lab.difficulty === labFilterDifficulty;
      const matchesType = labFilterType === "all" || lab.labType === labFilterType;
      return matchesSearch && matchesCourse && matchesDifficulty && matchesType;
    });

  // ============================================
  // MODULE MANAGEMENT FUNCTIONS
  // ============================================

  const fetchModulesForCourse = async (courseId: string) => {
    try {
      setIsLoadingModules(true);
      const courseModules = await adminService.getCourseModules(courseId);
      setModules(courseModules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      toast.error("Failed to load modules");
      setModules([]);
    } finally {
      setIsLoadingModules(false);
    }
  };

  const handleCreateModule = async () => {
    if (!selectedCourseForModules) {
      toast.error("Please select a course first");
      return;
    }
    if (!newModule.title.trim()) {
      toast.error("Please enter a module title");
      return;
    }

    try {
      setIsCreatingModule(true);
      const result = await adminService.createModule(selectedCourseForModules, {
        title: newModule.title.trim(),
        description: newModule.description.trim() || undefined,
        order: modules.length // Add to end
      });

      // Add to list
      setModules([...modules, result.module]);
      toast.success("Module created successfully");
      setShowCreateModule(false);
      setNewModule({ title: "", description: "", order: 0 });
    } catch (error: any) {
      console.error("Error creating module:", error);
      toast.error(error.response?.data?.error || "Failed to create module");
    } finally {
      setIsCreatingModule(false);
    }
  };

  const handleEditModuleClick = (module: Module) => {
    setEditingModule(module);
    setNewModule({
      title: module.title,
      description: module.description || "",
      order: module.order
    });
    setShowEditModule(true);
  };

  const handleUpdateModule = async () => {
    if (!editingModule || !selectedCourseForModules) return;
    if (!newModule.title.trim()) {
      toast.error("Please enter a module title");
      return;
    }

    try {
      setIsUpdatingModule(true);
      const result = await adminService.updateModule(selectedCourseForModules, editingModule.id, {
        title: newModule.title.trim(),
        description: newModule.description.trim() || undefined,
        order: newModule.order
      });

      // Update in list
      setModules(modules.map(m => m.id === editingModule.id ? result.module : m));
      toast.success("Module updated successfully");
      setShowEditModule(false);
      setEditingModule(null);
      setNewModule({ title: "", description: "", order: 0 });
    } catch (error: any) {
      console.error("Error updating module:", error);
      toast.error(error.response?.data?.error || "Failed to update module");
    } finally {
      setIsUpdatingModule(false);
    }
  };

  const handleDeleteModuleClick = (module: Module) => {
    setModuleToDelete(module);
    setShowDeleteModuleDialog(true);
  };

  const confirmDeleteModule = async () => {
    if (!moduleToDelete || !selectedCourseForModules) return;

    try {
      setDeletingModuleId(moduleToDelete.id);
      const result = await adminService.deleteModule(selectedCourseForModules, moduleToDelete.id);

      // Remove from list
      setModules(modules.filter(m => m.id !== moduleToDelete.id));

      toast.success(`Module deleted successfully. ${result.affectedLessons} lessons moved to unorganized.`);
      setShowDeleteModuleDialog(false);
      setModuleToDelete(null);

      // Refresh courses to update lesson moduleIds
      await fetchCourses();
    } catch (error: any) {
      console.error("Error deleting module:", error);
      toast.error(error.response?.data?.error || "Failed to delete module");
    } finally {
      setDeletingModuleId(null);
    }
  };

  const handleModuleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !selectedCourseForModules) {
      return;
    }

    const oldIndex = modules.findIndex((m) => m.id === active.id);
    const newIndex = modules.findIndex((m) => m.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistically update UI
    const reorderedModules = arrayMove(modules, oldIndex, newIndex);
    setModules(reorderedModules);

    // Update order values
    const moduleOrders = reorderedModules.map((module, index) => ({
      id: module.id,
      order: index
    }));

    try {
      await adminService.reorderModules(selectedCourseForModules, { moduleOrders });
      toast.success("Modules reordered");
    } catch (error) {
      console.error("Error reordering modules:", error);
      toast.error("Failed to reorder modules");
      // Revert on error
      fetchModulesForCourse(selectedCourseForModules);
    }
  };

  // When course is selected for modules, fetch its modules
  useEffect(() => {
    if (selectedCourseForModules && activeTab === 'modules') {
      fetchModulesForCourse(selectedCourseForModules);
    }
  }, [selectedCourseForModules, activeTab]);

  // When labs tab is active, fetch all labs
  useEffect(() => {
    if (activeTab === 'labs' && labs.length === 0) {
      fetchLabs();
    }
  }, [activeTab]);

  // ============================================
  // PHISHING MANAGEMENT FUNCTIONS
  // ============================================

  const fetchPhishingScenarios = async () => {
    try {
      setIsLoadingPhishing(true);
      const [scenarios, stats] = await Promise.all([
        phishingService.getAllScenarios(),
        phishingService.getPlatformStats()
      ]);
      setPhishingScenarios(scenarios);
      setPhishingStats(stats);
    } catch (error) {
      console.error("Error fetching phishing scenarios:", error);
      toast.error("Failed to load phishing scenarios");
    } finally {
      setIsLoadingPhishing(false);
    }
  };

  const fetchPhishingAttempts = async () => {
    try {
      setIsLoadingAttempts(true);
      const response = await phishingService.getAllAttempts(20, 0);
      setPhishingAttempts(response.attempts);
    } catch (error) {
      console.error("Error fetching phishing attempts:", error);
      toast.error("Failed to load attempts");
    } finally {
      setIsLoadingAttempts(false);
    }
  };

  const togglePhishingAttempts = () => {
    if (!showPhishingAttempts && phishingAttempts.length === 0) {
      fetchPhishingAttempts();
    }
    setShowPhishingAttempts(!showPhishingAttempts);
  };

  const handleDeletePhishing = async (scenario: ScenarioWithStats) => {
    setPhishingToDelete(scenario);
    setShowDeletePhishingDialog(true);
  };

  const confirmDeletePhishing = async () => {
    if (!phishingToDelete) return;

    try {
      setDeletingPhishingId(phishingToDelete.id);
      await phishingService.deleteScenario(phishingToDelete.id);
      toast.success("Phishing scenario deleted successfully");
      await fetchPhishingScenarios();
      setShowDeletePhishingDialog(false);
      setPhishingToDelete(null);
    } catch (error) {
      console.error("Error deleting phishing scenario:", error);
      toast.error("Failed to delete scenario");
    } finally {
      setDeletingPhishingId(null);
    }
  };

  const filteredPhishingScenarios = phishingScenarios
    .filter(scenario => {
      const matchesSearch = scenario.title.toLowerCase().includes(phishingSearch.toLowerCase()) ||
                          scenario.description.toLowerCase().includes(phishingSearch.toLowerCase());
      const matchesDifficulty = phishingFilterDifficulty === "all" || scenario.difficulty === phishingFilterDifficulty;
      const matchesCategory = phishingFilterCategory === "all" || scenario.category === phishingFilterCategory;
      const matchesActive = phishingFilterActive === "all" ||
                          (phishingFilterActive === "active" && scenario.isActive) ||
                          (phishingFilterActive === "inactive" && !scenario.isActive);
      return matchesSearch && matchesDifficulty && matchesCategory && matchesActive;
    });

  // Get unique categories from scenarios
  const uniqueCategories = Array.from(new Set(phishingScenarios.map(s => s.category)));

  // When phishing tab is active, fetch scenarios (always refetch to get latest data)
  useEffect(() => {
    if (activeTab === 'phishing') {
      fetchPhishingScenarios();
    }
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading courses...</p>
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
            <div>
              <h1 className="text-2xl font-bold">Content Management</h1>
              <p className="text-muted-foreground">Create and manage courses, lessons, quizzes, and labs</p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={showCreateCourse} onOpenChange={setShowCreateCourse}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                    <DialogDescription>
                      Add a new course to the training platform
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Course Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Advanced Cybersecurity Fundamentals"
                        value={newCourse.title || ""}
                        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                        className="bg-input-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what students will learn..."
                        rows={4}
                        value={newCourse.description || ""}
                        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                        className="bg-input-background"
                      />
                    </div>
                    <div>
                      <Label>Course Image (optional)</Label>
                      <div className="flex gap-2 mb-2">
                        <Button
                          type="button"
                          variant={imageUploadMode === "url" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setImageUploadMode("url")}
                          className="flex-1"
                        >
                          <Link className="w-4 h-4 mr-2" />
                          URL
                        </Button>
                        <Button
                          type="button"
                          variant={imageUploadMode === "upload" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setImageUploadMode("upload")}
                          className="flex-1"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                      {imageUploadMode === "url" ? (
                        <>
                          <Input
                            key="thumbnail-url"
                            id="thumbnail"
                            placeholder="e.g., https://images.unsplash.com/photo-..."
                            value={newCourse.thumbnail || ""}
                            onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                            className="bg-input-background"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Enter an image URL for the course thumbnail
                          </p>
                        </>
                      ) : (
                        <>
                          <Input
                            key="thumbnail-file"
                            id="thumbnail-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, false)}
                            className="bg-input-background"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload an image (max 2MB, JPG/PNG/GIF)
                          </p>
                        </>
                      )}
                      {newCourse.thumbnail && (
                        <div className="mt-2">
                          <img
                            src={newCourse.thumbnail}
                            alt="Course preview"
                            className="w-full h-32 object-cover rounded-lg border border-border"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select
                          value={newCourse.difficulty}
                          onValueChange={(value) => setNewCourse({ ...newCourse, difficulty: value })}
                        >
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration (optional)</Label>
                        <Input
                          id="duration"
                          placeholder="e.g., 2 hours"
                          value={newCourse.duration || ""}
                          onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                          className="bg-input-background"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPublished"
                        checked={newCourse.isPublished ?? false}
                        onChange={(e) => setNewCourse({ ...newCourse, isPublished: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="isPublished">Publish immediately</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateCourse(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCourse} disabled={isCreatingCourse}>
                      {isCreatingCourse ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Create Course
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="labs">Labs</TabsTrigger>
              <TabsTrigger value="phishing">Phishing</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-6">
              {courses.length === 0 ? (
                <Card className="p-12 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">Get started by creating your first course</p>
                  <Button onClick={() => setShowCreateCourse(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Course
                  </Button>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <Card key={course.id} className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center overflow-hidden">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={course.isPublished ? "default" : "outline"}>
                            {course.isPublished ? "Published" : "Draft"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePublish(course)}
                            disabled={publishingId === course.id}
                            title={course.isPublished ? "Unpublish" : "Publish"}
                          >
                            {publishingId === course.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : course.isPublished ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">Difficulty:</span>
                          <span className="ml-1 font-medium">{course.difficulty}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Lessons:</span>
                          <span className="ml-1 font-medium">{course.lessons?.length || course._count?.lessons || 0}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Enrolled:</span>
                          <span className="ml-1 font-medium">{course._count?.enrollments || 0}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setEditingCourse(course);
                            setShowEditCourse(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-destructive"
                              disabled={deletingId === course.id}
                            >
                              {deletingId === course.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Course</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{course.title}"? This will also delete all lessons and enrollments.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCourse(course.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Edit Course Dialog */}
              <Dialog open={showEditCourse} onOpenChange={setShowEditCourse}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Course</DialogTitle>
                    <DialogDescription>
                      Update course details
                    </DialogDescription>
                  </DialogHeader>
                  {editingCourse && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="edit-title">Course Title</Label>
                        <Input
                          id="edit-title"
                          value={editingCourse.title || ""}
                          onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                          className="bg-input-background"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          rows={4}
                          value={editingCourse.description || ""}
                          onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                          className="bg-input-background"
                        />
                      </div>
                      <div>
                        <Label>Course Image (optional)</Label>
                        <div className="flex gap-2 mb-2">
                          <Button
                            type="button"
                            variant={imageUploadMode === "url" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setImageUploadMode("url")}
                            className="flex-1"
                          >
                            <Link className="w-4 h-4 mr-2" />
                            URL
                          </Button>
                          <Button
                            type="button"
                            variant={imageUploadMode === "upload" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setImageUploadMode("upload")}
                            className="flex-1"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                        {imageUploadMode === "url" ? (
                          <>
                            <Input
                              key="edit-thumbnail-url"
                              id="edit-thumbnail"
                              placeholder="e.g., https://images.unsplash.com/photo-..."
                              value={editingCourse.thumbnail || ""}
                              onChange={(e) => setEditingCourse({ ...editingCourse, thumbnail: e.target.value })}
                              className="bg-input-background"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Enter an image URL for the course thumbnail
                            </p>
                          </>
                        ) : (
                          <>
                            <Input
                              key="edit-thumbnail-file"
                              id="edit-thumbnail-upload"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, true)}
                              className="bg-input-background"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Upload an image (max 2MB, JPG/PNG/GIF)
                            </p>
                          </>
                        )}
                        {editingCourse.thumbnail && (
                          <div className="mt-2">
                            <img
                              src={editingCourse.thumbnail}
                              alt="Course preview"
                              className="w-full h-32 object-cover rounded-lg border border-border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-difficulty">Difficulty</Label>
                          <Select
                            value={editingCourse.difficulty}
                            onValueChange={(value) => setEditingCourse({ ...editingCourse, difficulty: value })}
                          >
                            <SelectTrigger className="bg-input-background">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="edit-duration">Duration</Label>
                          <Input
                            id="edit-duration"
                            placeholder="e.g., 2 hours"
                            value={editingCourse.duration || ""}
                            onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                            className="bg-input-background"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="edit-isPublished"
                          checked={editingCourse.isPublished ?? false}
                          onChange={(e) => setEditingCourse({ ...editingCourse, isPublished: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="edit-isPublished">Published</Label>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowEditCourse(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleEditCourse} disabled={isEditingCourse}>
                      {isEditingCourse ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="modules" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Course Modules</h2>
                <p className="text-muted-foreground">Organize lessons into modules within each course</p>
              </div>

              {/* Course Selector */}
              <Card className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <Label htmlFor="module-course-select">Select Course</Label>
                    <Select
                      value={selectedCourseForModules}
                      onValueChange={setSelectedCourseForModules}
                    >
                      <SelectTrigger id="module-course-select" className="bg-input-background mt-1.5">
                        <SelectValue placeholder="Choose a course..." />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedCourseForModules && (
                    <Button
                      onClick={() => setShowCreateModule(true)}
                      className="mt-7"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Module
                    </Button>
                  )}
                </div>
              </Card>

              {/* Module List */}
              {selectedCourseForModules ? (
                isLoadingModules ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="p-6 animate-pulse">
                        <div className="h-6 bg-muted rounded mb-4"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </Card>
                    ))}
                  </div>
                ) : modules.length === 0 ? (
                  <Card className="p-12 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No modules yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first module to organize lessons
                    </p>
                    <Button onClick={() => setShowCreateModule(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Module
                    </Button>
                  </Card>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleModuleDragEnd}
                  >
                    <SortableContext
                      items={modules.map(m => m.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-4">
                        {modules.map((module) => (
                          <SortableModuleCard
                            key={module.id}
                            module={module}
                            onEdit={handleEditModuleClick}
                            onDelete={handleDeleteModuleClick}
                            isDeleting={deletingModuleId === module.id}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )
              ) : (
                <Card className="p-12 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Select a course</h3>
                  <p className="text-muted-foreground">
                    Choose a course from the dropdown above to manage its modules
                  </p>
                </Card>
              )}

              {/* Create Module Dialog */}
              <Dialog open={showCreateModule} onOpenChange={setShowCreateModule}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Module</DialogTitle>
                    <DialogDescription>
                      Add a new module to organize lessons in this course
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="module-title">Module Title *</Label>
                      <Input
                        id="module-title"
                        placeholder="e.g., Introduction to Security"
                        value={newModule.title}
                        onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                        className="bg-input-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="module-description">Description (optional)</Label>
                      <Textarea
                        id="module-description"
                        placeholder="Brief description of this module..."
                        value={newModule.description}
                        onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                        className="bg-input-background"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateModule(false);
                        setNewModule({ title: "", description: "", order: 0 });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateModule}
                      disabled={isCreatingModule}
                    >
                      {isCreatingModule ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Module"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Edit Module Dialog */}
              <Dialog open={showEditModule} onOpenChange={setShowEditModule}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Module</DialogTitle>
                    <DialogDescription>
                      Update the module details
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-module-title">Module Title *</Label>
                      <Input
                        id="edit-module-title"
                        placeholder="e.g., Introduction to Security"
                        value={newModule.title}
                        onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                        className="bg-input-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-module-description">Description (optional)</Label>
                      <Textarea
                        id="edit-module-description"
                        placeholder="Brief description of this module..."
                        value={newModule.description}
                        onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                        className="bg-input-background"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowEditModule(false);
                        setEditingModule(null);
                        setNewModule({ title: "", description: "", order: 0 });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateModule}
                      disabled={isUpdatingModule}
                    >
                      {isUpdatingModule ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Module"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete Module Confirmation Dialog */}
              <AlertDialog open={showDeleteModuleDialog} onOpenChange={setShowDeleteModuleDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Module?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete the module "{moduleToDelete?.title}".
                      {moduleToDelete && moduleToDelete.lessonCount && moduleToDelete.lessonCount > 0 && (
                        <>
                          <br /><br />
                          <strong>Warning:</strong> This module has {moduleToDelete.lessonCount} lesson(s).
                          They will be moved to "Unorganized Lessons" and will not be deleted.
                        </>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={confirmDeleteModule}
                      disabled={deletingModuleId === moduleToDelete?.id}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deletingModuleId === moduleToDelete?.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete Module"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>

            <TabsContent value="lessons" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">All Lessons</h2>
                <p className="text-muted-foreground">Manage lessons within each course</p>
              </div>

              {courses.length === 0 ? (
                <Card className="p-12 text-center">
                  <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No lessons yet</h3>
                  <p className="text-muted-foreground">Create a course first, then add lessons to it</p>
                </Card>
              ) : (
                <div className="space-y-6">
                  {courses.map((course) => (
                    <Card key={course.id}>
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {course.lessons?.length || course._count?.lessons || 0} lessons
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => openCreateLessonDialog(course.id)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Lesson
                          </Button>
                          <Badge variant={course.isPublished ? "default" : "outline"}>
                            {course.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        {course.lessons && course.lessons.length > 0 ? (
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(event) => handleDragEnd(event, course.id)}
                          >
                            <SortableContext
                              items={course.lessons.map(l => l.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              <div className="space-y-3">
                                {course.lessons.map((lesson) => (
                                  <SortableLesson
                                    key={lesson.id}
                                    lesson={lesson}
                                    onEdit={() => {
                                      onNavigate("admin-lesson-edit", lesson.id);
                                    }}
                                    onDelete={() => handleDeleteLesson(lesson.id)}
                                  />
                                ))}
                              </div>
                            </SortableContext>
                          </DndContext>
                        ) : (
                          <div className="text-center py-8">
                            <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground mb-4">
                              No lessons in this course yet
                            </p>
                            <Button
                              variant="outline"
                              onClick={() => openCreateLessonDialog(course.id)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add First Lesson
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="quizzes" className="space-y-6">
              {/* Quizzes Header with Search and Filter */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Quizzes</h2>
                  <p className="text-muted-foreground">Manage all quizzes across courses</p>
                </div>
                <Button onClick={() => onNavigate('admin-quiz-edit')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Quiz
                </Button>
              </div>

              {/* Search and Filter Bar */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search quizzes by title, lesson, or course..."
                    value={quizSearch}
                    onChange={(e) => setQuizSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={quizFilterCourse} onValueChange={setQuizFilterCourse}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {uniqueCourses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quiz List */}
              {isLoadingQuizzes ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="p-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredQuizzes.length === 0 ? (
                <Card className="p-12 text-center">
                  <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  {quizSearch || quizFilterCourse !== 'all' ? (
                    <>
                      <h3 className="font-semibold mb-2">No quizzes found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search or filter criteria
                      </p>
                      <Button variant="outline" onClick={() => { setQuizSearch(""); setQuizFilterCourse("all"); }}>
                        Clear Filters
                      </Button>
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold mb-2">No quizzes yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first quiz to test student knowledge
                      </p>
                      <Button onClick={() => onNavigate('admin-quiz-edit')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Quiz
                      </Button>
                    </>
                  )}
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQuizzes.map(quiz => (
                    <Card key={quiz.id} className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                      <div className="space-y-4">
                        {/* Quiz Title */}
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{quiz.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {quiz.courseTitle} • {quiz.lessonTitle}
                          </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-blue-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Questions</p>
                              <p className="font-semibold">{quiz.questionCount}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-green-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Pass Score</p>
                              <p className="font-semibold">{quiz.passingScore}%</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Attempts</p>
                              <p className="font-semibold">{quiz.totalAttempts}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-orange-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Pass Rate</p>
                              <p className="font-semibold">{quiz.passRate}%</p>
                            </div>
                          </div>
                        </div>

                        {/* Average Score Bar */}
                        {quiz.totalAttempts > 0 && (
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Avg Score</span>
                              <span className="font-semibold">{quiz.averageScore}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  quiz.averageScore >= quiz.passingScore
                                    ? 'bg-green-500'
                                    : 'bg-orange-500'
                                }`}
                                style={{ width: `${quiz.averageScore}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditQuiz(quiz.id)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteQuizClick(quiz)}
                            disabled={deletingQuizId === quiz.id}
                          >
                            {deletingQuizId === quiz.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Delete Confirmation Dialog */}
              <AlertDialog open={showDeleteQuizDialog} onOpenChange={setShowDeleteQuizDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Quiz?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{quizToDelete?.title}"?
                      {quizToDelete && quizToDelete.totalAttempts > 0 && (
                        <span className="block mt-2 text-orange-600 dark:text-orange-400 font-semibold">
                          ⚠️ This will delete {quizToDelete.totalAttempts} student attempt{quizToDelete.totalAttempts !== 1 ? 's' : ''}.
                        </span>
                      )}
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deletingQuizId !== null}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={confirmDeleteQuiz}
                      disabled={deletingQuizId !== null}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deletingQuizId ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        'Delete Quiz'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>

            <TabsContent value="labs" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Labs Management</h2>
                  <p className="text-muted-foreground">Manage hands-on lab exercises for all courses</p>
                </div>
                <Button onClick={() => onNavigate("admin-lab-edit")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Lab
                </Button>
              </div>

              {/* Filters */}
              <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label>Search Labs</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by title or description..."
                        value={labSearch}
                        onChange={(e) => setLabSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Filter by Course</Label>
                    <Select value={labFilterCourse} onValueChange={setLabFilterCourse}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Courses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Filter by Difficulty</Label>
                    <Select value={labFilterDifficulty} onValueChange={setLabFilterDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Difficulties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Filter by Lab Type</Label>
                    <Select value={labFilterType} onValueChange={setLabFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="CONTENT">Content Lab</SelectItem>
                        <SelectItem value="PHISHING_EMAIL">Phishing Email</SelectItem>
                        <SelectItem value="SUSPICIOUS_LINKS">Suspicious Links</SelectItem>
                        <SelectItem value="PASSWORD_STRENGTH">Password Strength</SelectItem>
                        <SelectItem value="SOCIAL_ENGINEERING">Social Engineering</SelectItem>
                        <SelectItem value="SECURITY_ALERTS">Security Alerts</SelectItem>
                        <SelectItem value="WIFI_SAFETY">WiFi Safety</SelectItem>
                        <SelectItem value="INCIDENT_RESPONSE">Incident Response</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Labs List */}
              {isLoadingLabs ? (
                <Card className="p-8">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>Loading labs...</span>
                  </div>
                </Card>
              ) : filteredLabs.length === 0 ? (
                <Card className="p-8 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Labs Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {labs.length === 0
                      ? "Create your first lab to provide hands-on learning experiences."
                      : "No labs match your current filters."}
                  </p>
                  {labs.length === 0 && (
                    <Button onClick={() => onNavigate("admin-lab-edit")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Lab
                    </Button>
                  )}
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredLabs.map((lab) => (
                    <Card key={lab.id} className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-semibold">{lab.title}</h3>
                            <Badge variant={lab.isPublished ? "default" : "secondary"}>
                              {lab.isPublished ? "Published" : "Draft"}
                            </Badge>
                            <Badge variant="outline">{lab.difficulty}</Badge>
                            <Badge variant={lab.labType === 'CONTENT' ? "secondary" : "default"} className={lab.labType !== 'CONTENT' ? "bg-blue-600" : ""}>
                              {lab.labType === 'CONTENT' ? 'Content' : lab.labType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {lab.description}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Course</p>
                              <p className="font-medium">{lab.courseTitle}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Module</p>
                              <p className="font-medium">{lab.moduleTitle || "No Module"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Est. Time</p>
                              <p className="font-medium">{lab.estimatedTime ? `${lab.estimatedTime} min` : "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Order</p>
                              <p className="font-medium">#{lab.order}</p>
                            </div>
                          </div>

                          {/* Statistics */}
                          <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                Total Attempts
                              </p>
                              <p className="font-semibold">{lab.totalAttempts}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Completion Rate
                              </p>
                              <p className="font-semibold">{lab.completionRate}%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                Avg. Time Spent
                              </p>
                              <p className="font-semibold">{lab.avgTimeSpent} min</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onNavigate("admin-lab-edit", lab.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteLab(lab)}
                                disabled={deletingLabId === lab.id}
                              >
                                {deletingLabId === lab.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                          </AlertDialog>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Delete Lab Confirmation Dialog */}
              <AlertDialog open={showDeleteLabDialog} onOpenChange={setShowDeleteLabDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Lab</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{labToDelete?.title}"?
                      <br /><br />
                      This will:
                      <ul className="list-disc list-inside mt-2">
                        <li>Permanently delete the lab</li>
                        <li>Remove all student progress for this lab</li>
                        <li>Cannot be undone</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={confirmDeleteLab}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={!!deletingLabId}
                    >
                      {deletingLabId ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete Lab"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>

            <TabsContent value="phishing" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Phishing Simulation Management</h2>
                  <p className="text-muted-foreground">Create and manage phishing email scenarios</p>
                </div>
                <Button onClick={() => onNavigate("admin-phishing-edit")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Scenario
                </Button>
              </div>

              {/* Platform Stats */}
              {phishingStats && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Scenarios</p>
                        <p className="text-2xl font-bold">{phishingStats.overview.totalScenarios}</p>
                      </div>
                      <Mail className="w-6 h-6 text-primary opacity-50" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {phishingStats.overview.activeScenarios} active
                    </p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Attempts</p>
                        <p className="text-2xl font-bold">{phishingStats.overview.totalAttempts}</p>
                      </div>
                      <Users className="w-6 h-6 text-blue-500 opacity-50" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {phishingStats.overview.uniqueUsers} users
                    </p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="text-2xl font-bold">{phishingStats.overview.overallAccuracy}%</p>
                      </div>
                      <Target className="w-6 h-6 text-green-500 opacity-50" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {phishingStats.overview.correctAttempts} correct
                    </p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Report Rate</p>
                        <p className="text-2xl font-bold text-green-600">{phishingStats.overview.reportRate}%</p>
                      </div>
                      <ShieldCheck className="w-6 h-6 text-green-500 opacity-50" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Phishing reported
                    </p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Click Rate</p>
                        <p className="text-2xl font-bold text-red-600">{phishingStats.overview.clickRate}%</p>
                      </div>
                      <AlertTriangle className="w-6 h-6 text-red-500 opacity-50" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Dangerous clicks
                    </p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Response</p>
                        <p className="text-2xl font-bold">{(phishingStats.overview.avgResponseTimeMs / 1000).toFixed(1)}s</p>
                      </div>
                      <Clock className="w-6 h-6 text-muted-foreground opacity-50" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Decision time
                    </p>
                  </Card>
                </div>
              )}

              {/* Recent Attempts Section */}
              <Card className="p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={togglePhishingAttempts}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Recent User Attempts</h3>
                    {phishingAttempts.length > 0 && (
                      <Badge variant="secondary">{phishingAttempts.length}</Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    {showPhishingAttempts ? "Hide" : "Show"}
                  </Button>
                </div>

                {showPhishingAttempts && (
                  <div className="mt-4">
                    {isLoadingAttempts ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : phishingAttempts.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No attempts yet</p>
                    ) : (
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {phishingAttempts.map((attempt) => (
                          <div
                            key={attempt.id}
                            className={`p-3 rounded-lg border ${
                              attempt.isCorrect
                                ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                                : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {attempt.user.firstName || attempt.user.email}
                                </span>
                                {attempt.isCorrect ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(attempt.attemptedAt).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{attempt.scenario.title}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs py-0">
                                {attempt.userAction.replace("_", " ")}
                              </Badge>
                              {attempt.scenario.isPhishing ? (
                                <Badge variant="destructive" className="text-xs py-0">Phishing</Badge>
                              ) : (
                                <Badge className="text-xs py-0 bg-green-600">Legitimate</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Filters */}
              <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label>Search Scenarios</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by title or description..."
                        value={phishingSearch}
                        onChange={(e) => setPhishingSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <Select value={phishingFilterDifficulty} onValueChange={setPhishingFilterDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Difficulties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={phishingFilterCategory} onValueChange={setPhishingFilterCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {uniqueCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={phishingFilterActive} onValueChange={setPhishingFilterActive}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Scenarios List */}
              {isLoadingPhishing ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredPhishingScenarios.length === 0 ? (
                <Card className="p-12 text-center">
                  <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No phishing scenarios found</h3>
                  <p className="text-muted-foreground mb-4">
                    {phishingScenarios.length === 0
                      ? "Get started by creating your first phishing scenario"
                      : "No scenarios match your current filters"}
                  </p>
                  {phishingScenarios.length === 0 && (
                    <Button onClick={() => onNavigate("admin-phishing-edit")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Scenario
                    </Button>
                  )}
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredPhishingScenarios.map((scenario) => (
                    <Card key={scenario.id} className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{scenario.title}</h3>
                            <Badge
                              variant={scenario.isPhishing ? "destructive" : "default"}
                              className={!scenario.isPhishing ? "bg-green-600" : ""}
                            >
                              {scenario.isPhishing ? (
                                <><ShieldX className="w-3 h-3 mr-1" />Phishing</>
                              ) : (
                                <><ShieldCheck className="w-3 h-3 mr-1" />Legitimate</>
                              )}
                            </Badge>
                            {scenario.isActive ? (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                <XCircle className="w-3 h-3 mr-1" />Inactive
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>

                          <div className="flex items-center gap-4 text-sm mb-3">
                            <Badge variant="outline">{scenario.difficulty}</Badge>
                            <Badge variant="secondary">{scenario.category}</Badge>
                            {scenario.redFlagsCount > 0 && (
                              <span className="text-muted-foreground">
                                {scenario.redFlagsCount} red flag{scenario.redFlagsCount !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>

                          {/* Email Preview */}
                          <div className="bg-muted/30 rounded-lg p-3 mb-3">
                            <p className="text-sm">
                              <span className="text-muted-foreground">From:</span> {scenario.senderName} &lt;{scenario.senderEmail}&gt;
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Subject:</span> {scenario.subject}
                            </p>
                          </div>

                          {/* Statistics */}
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Attempts</p>
                              <p className="font-semibold">{scenario.stats.totalAttempts}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Correct</p>
                              <p className="font-semibold text-green-600">{scenario.stats.correctAttempts}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Accuracy</p>
                              <p className="font-semibold">{scenario.stats.accuracy}%</p>
                            </div>
                            {scenario.stats.clickRate !== null && (
                              <div>
                                <p className="text-muted-foreground">Click Rate</p>
                                <p className="font-semibold text-red-600">{scenario.stats.clickRate}%</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onNavigate("admin-phishing-edit", scenario.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePhishing(scenario)}
                            disabled={deletingPhishingId === scenario.id}
                          >
                            {deletingPhishingId === scenario.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 text-destructive" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Delete Phishing Confirmation Dialog */}
              <AlertDialog open={showDeletePhishingDialog} onOpenChange={setShowDeletePhishingDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Phishing Scenario</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{phishingToDelete?.title}"?
                      <br /><br />
                      This will:
                      <ul className="list-disc list-inside mt-2">
                        <li>Permanently delete the scenario</li>
                        <li>Remove all student attempt history for this scenario</li>
                        <li>Cannot be undone</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={confirmDeletePhishing}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={!!deletingPhishingId}
                    >
                      {deletingPhishingId ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete Scenario"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>

            <TabsContent value="modules" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Modules</h2>
                <p className="text-muted-foreground">Course module organization</p>
              </div>
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Lessons are organized in order within each course.
                  Module grouping functionality coming soon.
                </p>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Create Lesson Dialog */}
          <Dialog open={showCreateLesson} onOpenChange={setShowCreateLesson}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] w-[95vw] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Lesson</DialogTitle>
                <DialogDescription>
                  Add a new lesson to {courses.find(c => c.id === selectedCourseForLesson)?.title}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="lesson-title">Lesson Title</Label>
                  <Input
                    id="lesson-title"
                    placeholder="e.g., Understanding Phishing Emails"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                    className="bg-input-background"
                  />
                </div>
                <div>
                  <Label htmlFor="lesson-content">Lesson Content</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Use the toolbar to format your content with headings, bold, lists, and more.
                  </p>
                  <RichTextEditor
                    content={newLesson.content}
                    onChange={(content) => setNewLesson({ ...newLesson, content })}
                    placeholder="Write your lesson content here..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="lesson-video">Video URL (optional)</Label>
                    <Input
                      id="lesson-video"
                      placeholder="e.g., https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                      value={newLesson.videoUrl}
                      onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                      className="bg-input-background"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      YouTube, Vimeo, or direct video URL - preview will appear below
                    </p>
                    <VideoPreview url={newLesson.videoUrl} />
                  </div>
                  <div>
                    <Label htmlFor="lesson-order">Lesson Order</Label>
                    <Input
                      id="lesson-order"
                      type="number"
                      value={newLesson.order}
                      onChange={(e) => setNewLesson({ ...newLesson, order: parseInt(e.target.value) || 1 })}
                      className="bg-input-background"
                      min="1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Position in course sequence
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowCreateLesson(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateLesson} disabled={isCreatingLesson}>
                  {isCreatingLesson ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Create Lesson
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Lesson Confirmation Dialog */}
          <AlertDialog open={showDeleteLessonDialog} onOpenChange={setShowDeleteLessonDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this lesson? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isDeletingLesson}
                  onClick={() => {
                    setShowDeleteLessonDialog(false);
                    setLessonToDelete(null);
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isDeletingLesson}
                  onClick={confirmDeleteLesson}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeletingLesson ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  );
}
