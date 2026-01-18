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
  Image
} from "lucide-react";
import { useTheme } from "./theme-provider";
import courseService, { Course, Lesson } from "../services/course.service";
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
                        value={newCourse.title}
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
                        value={newCourse.description}
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
                            id="thumbnail"
                            placeholder="e.g., https://images.unsplash.com/photo-..."
                            value={newCourse.thumbnail}
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
                          value={newCourse.duration}
                          onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                          className="bg-input-background"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPublished"
                        checked={newCourse.isPublished}
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
                          value={editingCourse.title}
                          onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                          className="bg-input-background"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          rows={4}
                          value={editingCourse.description}
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
                          checked={editingCourse.isPublished}
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
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Quizzes</h2>
                <p className="text-muted-foreground">Quizzes are attached to lessons within courses</p>
              </div>
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Quiz management is available when editing lessons within a course.
                  Each lesson can have an attached quiz with multiple questions.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="labs" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Labs</h2>
                <p className="text-muted-foreground">Interactive lab exercises</p>
              </div>
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Lab functionality coming soon. Labs will allow students to practice
                  cybersecurity skills in a safe, simulated environment.
                </p>
              </Card>
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
