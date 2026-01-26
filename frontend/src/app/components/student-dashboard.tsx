import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  Shield,
  Moon,
  Sun,
  Book,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  ChevronRight,
  MessageSquare,
  Menu,
  Loader2,
  X,
  Award,
  ClipboardCheck
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { usePlatformSettings } from "../context/PlatformSettingsContext";
import { PlatformLogo } from "./PlatformLogo";
import { UserProfileDropdown } from "./user-profile-dropdown";
import userService, { UserStats } from "../services/user.service";
import courseService, { Course, EnrolledCourse } from "../services/course.service";

interface StudentDashboardProps {
  userEmail: string;
  onNavigate: (page: string, courseId?: string) => void;
  onLogout: () => void;
}

export function StudentDashboard({ userEmail, onNavigate, onLogout }: StudentDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { savedSettings } = useSettings();
  const { settings: platformSettings } = usePlatformSettings();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch all data in parallel
        const [statsData, enrolledData, allCoursesData] = await Promise.all([
          userService.getMyStats(),
          courseService.getEnrolledCourses(),
          courseService.getAllCourses(true) // Only published courses
        ]);

        setStats(statsData);
        setEnrolledCourses(enrolledData);

        // Get recommended courses (courses user isn't enrolled in)
        const enrolledIds = new Set(enrolledData.map(e => e.courseId));
        const recommended = allCoursesData.filter(c => !enrolledIds.has(c.id));
        setRecommendedCourses(recommended.slice(0, 2)); // Show max 2 recommendations
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const displayName = user?.firstName || userEmail.split("@")[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <PlatformLogo className="w-10 h-10" iconClassName="w-6 h-6" />
              <span className="text-xl font-semibold">{platformSettings.platformName}</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button className="text-foreground font-medium">Dashboard</button>
            <button
              onClick={() => onNavigate("course-catalog")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Courses
            </button>
            <button
              onClick={() => onNavigate("ai-chat")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              AI Assistant
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <UserProfileDropdown onLogout={onLogout} onNavigate={onNavigate} />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <PlatformLogo className="w-8 h-8" iconClassName="w-5 h-5" />
                <span className="font-semibold">{platformSettings.platformName}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="p-4 space-y-2">
              <button
                onClick={() => { setShowMobileMenu(false); }}
                className="flex items-center gap-3 w-full p-3 rounded-lg bg-primary/10 text-primary font-medium"
              >
                <Shield className="w-5 h-5" />
                Dashboard
              </button>
              <button
                onClick={() => { setShowMobileMenu(false); onNavigate("course-catalog"); }}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <Book className="w-5 h-5" />
                Courses
              </button>
              <button
                onClick={() => { setShowMobileMenu(false); onNavigate("ai-chat"); }}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <MessageSquare className="w-5 h-5" />
                AI Assistant
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName}!</h1>
          <p className="text-muted-foreground">Continue your cybersecurity training journey</p>
        </div>

        {/* Stats Cards */}
        {savedSettings.showProgress && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Courses Enrolled</span>
                <Book className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold">{stats?.coursesEnrolled || 0}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {stats?.coursesCompleted || 0} completed
              </div>
            </Card>
            <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Completion Rate</span>
                <Trophy className="w-5 h-5 text-warning" />
              </div>
              <div className="text-3xl font-bold">{stats?.completionRate || 0}%</div>
              <div className="text-sm text-muted-foreground mt-1">
                {stats?.lessonsCompleted || 0} of {stats?.totalLessons || 0} lessons
              </div>
            </Card>
            <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Quiz Score</span>
                <Target className="w-5 h-5 text-accent" />
              </div>
              <div className="text-3xl font-bold">{stats?.averageQuizScore || 0}%</div>
              <div className="text-sm text-muted-foreground mt-1">
                {stats?.quizzesPassed || 0} of {stats?.quizzesTaken || 0} passed
              </div>
            </Card>
            <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Lessons Done</span>
                <Clock className="w-5 h-5 text-chart-3" />
              </div>
              <div className="text-3xl font-bold">{stats?.lessonsCompleted || 0}</div>
              <div className="text-sm text-muted-foreground mt-1">Total completed</div>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Continue Learning</h2>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate("course-catalog")}
                >
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              {enrolledCourses.length === 0 ? (
                <Card className="p-8 text-center">
                  <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your learning journey by enrolling in a course
                  </p>
                  <Button onClick={() => onNavigate("course-catalog")}>
                    Browse Courses
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map((enrollment) => (
                    <Card key={enrollment.id} className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {enrollment.course.thumbnail ? (
                            <img
                              src={enrollment.course.thumbnail}
                              alt={enrollment.course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Shield className="w-10 h-10 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold mb-1">{enrollment.course.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{enrollment.course.difficulty}</Badge>
                                <Badge
                                  className={enrollment.completedAt ? "bg-success" : "bg-warning"}
                                >
                                  {enrollment.completedAt ? "Completed" : "In Progress"}
                                </Badge>
                              </div>
                            </div>
                            <Button onClick={() => onNavigate("course-player", enrollment.courseId)}>
                              {enrollment.completedAt ? "Review" : "Continue"}
                            </Button>
                          </div>
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                              <span>
                                {enrollment.progress.completedLessons} of {enrollment.progress.totalLessons} lessons
                              </span>
                              <span>{enrollment.progress.percentage}%</span>
                            </div>
                            <Progress value={enrollment.progress.percentage} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* AI Recommendations */}
            {recommendedCourses.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold">Recommended for You</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendedCourses.map((course) => (
                    <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-chart-3/20 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Book className="w-6 h-6 text-accent" />
                        )}
                      </div>
                      <h3 className="font-semibold mb-2">{course.title}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline">{course.difficulty}</Badge>
                        {course.duration && (
                          <span className="text-sm text-muted-foreground">{course.duration}</span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onNavigate("course-catalog")}
                      >
                        View Course
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Insights */}
            {savedSettings.showProgress && (
              <Card id="progress-section" className="p-6">
                <h3 className="font-semibold mb-4">Learning Insights</h3>
                <div className="space-y-4">
                  {/* Active Courses */}
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Book className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Active Courses</span>
                    </div>
                    <span className="text-lg font-bold">
                      {(stats?.coursesEnrolled || 0) - (stats?.coursesCompleted || 0)}
                    </span>
                  </div>

                  {/* Best Quiz Score */}
                  {stats?.quizzesTaken > 0 && (
                    <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-sm text-muted-foreground">Best Score</span>
                      </div>
                      <span className="text-lg font-bold">{stats?.averageQuizScore || 0}%</span>
                    </div>
                  )}

                  {/* Next Milestone */}
                  {enrolledCourses.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-start gap-2 mb-2">
                        <Target className="w-4 h-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Next Milestone</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {stats?.coursesCompleted === 0
                              ? "Complete your first course"
                              : stats?.coursesCompleted === 1
                              ? "Complete 3 courses to earn badge"
                              : stats?.coursesCompleted < 5
                              ? `${5 - (stats?.coursesCompleted || 0)} more courses to Expert level`
                              : "You're a cybersecurity expert! 🎉"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Encouragement Message */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mb-2">
                        <TrendingUp className="w-6 h-6 text-success" />
                      </div>
                      <p className="text-sm font-medium">
                        {stats?.completionRate === 0
                          ? "Start Your Journey!"
                          : stats?.completionRate < 25
                          ? "Keep Going!"
                          : stats?.completionRate < 50
                          ? "Great Progress!"
                          : stats?.completionRate < 75
                          ? "Almost There!"
                          : stats?.completionRate < 100
                          ? "You're Crushing It!"
                          : "Perfect Score! 🏆"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stats?.lessonsCompleted || 0} lessons completed
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* AI Assistant CTA */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <MessageSquare className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with our AI assistant for personalized guidance
              </p>
              <Button
                className="w-full"
                onClick={() => onNavigate("ai-chat")}
              >
                Start Chat
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onNavigate("course-catalog")}
                >
                  <Book className="w-4 h-4 mr-2" />
                  Browse Courses
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onNavigate("certificates")}
                >
                  <Award className="w-4 h-4 mr-2" />
                  View Certificates
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onNavigate("assessments")}
                >
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Take Assessment
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
