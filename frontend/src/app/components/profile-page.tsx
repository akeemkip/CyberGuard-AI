import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Shield,
  Moon,
  Sun,
  ChevronLeft,
  User,
  Mail,
  Calendar,
  BookOpen,
  Award,
  Trophy,
  Save,
  Loader2
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useAuth } from "../context/AuthContext";
import { UserProfileDropdown } from "./user-profile-dropdown";
import courseService, { EnrolledCourse } from "../services/course.service";

interface ProfilePageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function ProfilePage({ onNavigate, onLogout }: ProfilePageProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  // Form state
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const courses = await courseService.getEnrolledCourses();
        setEnrolledCourses(courses);
        setCompletedCount(courses.filter(c => c.completedAt !== null).length);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    setMessage(null);

    try {
      const updatedUser = await userService.updateUser(user.id, {
        firstName,
        lastName
      });

      // Update AuthContext with new user data
      updateUser(updatedUser);

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setSaving(false);
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalLessonsCompleted = enrolledCourses.reduce(
    (acc, course) => acc + course.progress.completedLessons,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
                <h1 className="font-semibold">My Profile</h1>
                <p className="text-sm text-muted-foreground">Manage your account</p>
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
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="md:col-span-1">
                <Card className="p-6 text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold text-primary">
                      {user?.firstName?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-1">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">{user?.email}</p>
                  <Badge variant="secondary" className="mb-4">
                    {user?.role === "ADMIN" ? "Administrator" : "Student"}
                  </Badge>

                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {user?.createdAt ? formatDate(user.createdAt) : "Recently"}</span>
                    </div>
                  </div>
                </Card>

                {/* Stats Card */}
                <Card className="p-6 mt-6">
                  <h3 className="font-semibold mb-4">Learning Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        <span>Enrolled Courses</span>
                      </div>
                      <span className="font-semibold">{enrolledCourses.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="w-4 h-4" />
                        <span>Completed</span>
                      </div>
                      <span className="font-semibold">{completedCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Trophy className="w-4 h-4" />
                        <span>Lessons Done</span>
                      </div>
                      <span className="font-semibold">{totalLessonsCompleted}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Edit Profile Form */}
              <div className="md:col-span-2">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-6">Edit Profile</h3>

                  {message && (
                    <div className={`p-3 rounded-lg mb-6 ${
                      message.type === "success"
                        ? "bg-green-500/10 text-green-600 border border-green-500/20"
                        : "bg-red-500/10 text-red-600 border border-red-500/20"
                    }`}>
                      {message.text}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="pl-10"
                            placeholder="Enter first name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="pl-10"
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          value={user?.email || ""}
                          disabled
                          className="pl-10 bg-muted"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Email address cannot be changed
                      </p>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border">
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Enrolled Courses */}
                <Card className="p-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">My Courses</h3>
                    <Button variant="outline" size="sm" onClick={() => onNavigate("course-catalog")}>
                      Browse More
                    </Button>
                  </div>

                  {enrolledCourses.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      You haven't enrolled in any courses yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {enrolledCourses.slice(0, 5).map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                          onClick={() => onNavigate("course-player", enrollment.courseId)}
                        >
                          <div className="flex-1">
                            <p className="font-medium">{enrollment.course.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {enrollment.progress.completedLessons}/{enrollment.progress.totalLessons} lessons
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            {enrollment.completedAt ? (
                              <Badge variant="default" className="bg-green-600">Completed</Badge>
                            ) : (
                              <Badge variant="secondary">{enrollment.progress.percentage}%</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
