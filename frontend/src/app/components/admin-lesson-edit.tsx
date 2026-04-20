import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { RichTextEditor } from "./RichTextEditor";
import { AdminSidebar } from "./admin-sidebar";
import { useTheme } from "./theme-provider";
import courseService, { Lesson } from "../services/course.service";
import { ArrowLeft, Save, Loader2, Moon, Sun } from "lucide-react";
import { marked } from "marked";

// Helper function to convert markdown-style text to HTML
// Convert markdown (and mixed markdown+HTML) to HTML for the rich text editor.
// Marked passes inline HTML through untouched, so content like
// "- <strong>Persistence</strong>: ..." converts correctly.
const convertMarkdownToHtml = (content: string): string => {
  if (!content) return '';
  try {
    return marked.parse(content, { breaks: true, gfm: true }) as string;
  } catch (error) {
    console.error('Error converting markdown:', error);
    return content;
  }
};

// Video Preview Component (copied from admin-content for now, could be extracted to shared component)
interface VideoPreviewProps {
  url: string;
}

function VideoPreview({ url }: VideoPreviewProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);
  const isLoadingRef = useRef(true);

  // Reset states when URL changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    isLoadingRef.current = true;
    setKey(prev => prev + 1);

    // Set timeout for loading state (10 seconds)
    const timeout = setTimeout(() => {
      if (isLoadingRef.current) {
        isLoadingRef.current = false;
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
      return { platform: 'youtube', id: youtubeMatch[1], embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1` };
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
          onLoad={() => { isLoadingRef.current = false; setIsLoading(false); }}
          onError={() => {
            isLoadingRef.current = false;
            setHasError(true);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
}

interface AdminLessonEditProps {
  lessonId: string;
  userEmail: string;
  onNavigate: (page: string, idParam?: string) => void;
  onLogout: () => void;
}

export function AdminLessonEdit({ lessonId, userEmail, onNavigate, onLogout }: AdminLessonEditProps) {
  const { theme, toggleTheme } = useTheme();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setIsLoading(true);
      const lessonData = await courseService.getLessonById(lessonId);

      // Convert markdown content to HTML if needed
      const convertedContent = convertMarkdownToHtml(lessonData.content);
      setLesson({ ...lessonData, content: convertedContent });

      // Fetch course name
      if (lessonData.courseId) {
        const course = await courseService.getCourseById(lessonData.courseId);
        setCourseName(course.title);
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
      toast.error("Failed to load lesson. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lesson) return;

    if (!lesson.title || !lesson.content) {
      toast.error("Please fill in title and content");
      return;
    }

    try {
      setIsSaving(true);
      await courseService.updateLesson(lesson.id, {
        title: lesson.title,
        content: lesson.content,
        videoUrl: lesson.videoUrl || undefined,
        order: lesson.order
      });

      toast.success("Lesson updated successfully!");
      // Navigate back to content management
      onNavigate("admin-content");
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error("Failed to update lesson. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onNavigate("admin-content");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Lesson not found</p>
          <Button onClick={handleCancel}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar
        userEmail={userEmail}
        currentPage="admin-content"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Content
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Edit Lesson</h1>
                {courseName && (
                  <p className="text-sm text-muted-foreground">Course: {courseName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          <Card className="max-w-5xl mx-auto p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="lesson-title">Lesson Title</Label>
                <Input
                  id="lesson-title"
                  value={lesson.title}
                  onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                  className="bg-input-background mt-2"
                  placeholder="Enter lesson title"
                />
              </div>

              <div>
                <Label htmlFor="lesson-content">Lesson Content</Label>
                <p className="text-xs text-muted-foreground mb-2 mt-1">
                  Use the toolbar to format your content with headings, bold, lists, and more.
                </p>
                <RichTextEditor
                  content={lesson.content}
                  onChange={(content) => setLesson({ ...lesson, content })}
                  placeholder="Write your lesson content here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <Label htmlFor="lesson-video">Video URL (optional)</Label>
                  <Input
                    id="lesson-video"
                    placeholder="e.g., https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                    value={lesson.videoUrl || ""}
                    onChange={(e) => setLesson({ ...lesson, videoUrl: e.target.value })}
                    className="bg-input-background mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    YouTube, Vimeo, or direct video URL - preview will appear below
                  </p>
                  <VideoPreview url={lesson.videoUrl || ""} />
                </div>

                <div>
                  <Label htmlFor="lesson-order">Lesson Order</Label>
                  <Input
                    id="lesson-order"
                    type="number"
                    value={lesson.order}
                    onChange={(e) => setLesson({ ...lesson, order: parseInt(e.target.value) || 1 })}
                    className="bg-input-background mt-2"
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Position in course sequence
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
