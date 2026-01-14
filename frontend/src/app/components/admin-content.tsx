import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
  Shield,
  Moon,
  Sun,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Video,
  Save,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { useTheme } from "./theme-provider";
import courseService, { Course } from "../services/course.service";

interface AdminContentProps {
  userEmail: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminContent({ userEmail, onNavigate, onLogout }: AdminContentProps) {
  const { theme, toggleTheme } = useTheme();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    difficulty: "Beginner",
    duration: "",
    isPublished: false
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const allCourses = await courseService.getAllCourses(false);
      setCourses(allCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description) {
      alert("Please fill in title and description");
      return;
    }

    try {
      setIsSaving(true);
      const created = await courseService.createCourse({
        title: newCourse.title,
        description: newCourse.description,
        difficulty: newCourse.difficulty,
        duration: newCourse.duration || undefined,
        isPublished: newCourse.isPublished
      });
      setCourses([created, ...courses]);
      setShowCreateCourse(false);
      setNewCourse({
        title: "",
        description: "",
        difficulty: "Beginner",
        duration: "",
        isPublished: false
      });
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCourse = async () => {
    if (!editingCourse) return;

    try {
      setIsSaving(true);
      const updated = await courseService.updateCourse(editingCourse.id, {
        title: editingCourse.title,
        description: editingCourse.description,
        difficulty: editingCourse.difficulty,
        duration: editingCourse.duration || undefined,
        isPublished: editingCourse.isPublished
      });
      setCourses(courses.map(c => c.id === updated.id ? updated : c));
      setShowEditCourse(false);
      setEditingCourse(null);
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      setDeletingId(courseId);
      await courseService.deleteCourse(courseId);
      setCourses(courses.filter(c => c.id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      const updated = await courseService.updateCourse(course.id, {
        isPublished: !course.isPublished
      });
      setCourses(courses.map(c => c.id === updated.id ? updated : c));
    } catch (error) {
      console.error("Error toggling publish status:", error);
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
      <aside className="w-64 border-r border-border bg-sidebar flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">CyberGuard AI</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => onNavigate("admin-dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => onNavigate("admin-users")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>User Management</span>
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <BookOpen className="w-5 h-5" />
              <span>Content Management</span>
            </button>
            <button
              onClick={() => onNavigate("admin-analytics")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics & Reports</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-medium">
                {userEmail.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{userEmail}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

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
                    <Button onClick={handleCreateCourse} disabled={isSaving}>
                      {isSaving ? (
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
          <Tabs defaultValue="courses" className="w-full">
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
                    <Card key={course.id} className="p-6">
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
                            title={course.isPublished ? "Unpublish" : "Publish"}
                          >
                            {course.isPublished ? (
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
                          <span className="ml-1 font-medium">{course._count?.lessons || 0}</span>
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
                    <Button onClick={handleEditCourse} disabled={isSaving}>
                      {isSaving ? (
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
                <p className="text-muted-foreground">Lessons are managed within each course</p>
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
                            {course._count?.lessons || 0} lessons
                          </p>
                        </div>
                        <Badge variant={course.isPublished ? "default" : "outline"}>
                          {course.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="p-4">
                        {course.lessons && course.lessons.length > 0 ? (
                          <div className="space-y-3">
                            {course.lessons.map((lesson, index) => (
                              <div key={lesson.id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{lesson.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {lesson.videoUrl ? "Video lesson" : "Text lesson"}
                                    {lesson.quiz && " • Has quiz"}
                                  </p>
                                </div>
                                <Video className="w-4 h-4 text-muted-foreground" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No lessons in this course yet
                          </p>
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
        </main>
      </div>
    </div>
  );
}
