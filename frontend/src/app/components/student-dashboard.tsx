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
  ClipboardCheck,
  Mail,
  AlertCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
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
  const [showNoCertificatesModal, setShowNoCertificatesModal] = useState(false);
  const [showSimulationLockedModal, setShowSimulationLockedModal] = useState(false);
  const [hasCompletedPhishing, setHasCompletedPhishing] = useState(false);
  const [hasCertificates, setHasCertificates] = useState(false);

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

        // Check if user has completed phishing course
        const phishingEnrollment = enrolledData.find(e =>
          e.course.title.toLowerCase().includes('phishing')
        );
        setHasCompletedPhishing(!!phishingEnrollment?.completedAt);

        // Check if user has any certificates (completed courses)
        const hasAnyCertificates = enrolledData.some(e => e.completedAt);
        setHasCertificates(hasAnyCertificates);

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

  const handleCertificatesClick = () => {
    if (hasCertificates) {
      onNavigate("certificates");
    } else {
      setShowNoCertificatesModal(true);
    }
  };

  const handleSimulationClick = () => {
    if (hasCompletedPhishing) {
      onNavigate("phishing-simulation");
    } else {
      setShowSimulationLockedModal(true);
    }
  };

  const handleStartPhishingCourse = () => {
    setShowNoCertificatesModal(false);
    setShowSimulationLockedModal(false);
    // Find the phishing course and navigate to it
    const phishingCourse = enrolledCourses.find(e =>
      e.course.title.toLowerCase().includes('phishing')
    );
    if (phishingCourse) {
      onNavigate("course-player", phishingCourse.courseId);
    } else {
      // If not enrolled, go to catalog
      onNavigate("course-catalog");
    }
  };

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

        {/* Quick Actions Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => onNavigate("assessments")}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ClipboardCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">Take Assessment</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Test your knowledge</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleSimulationClick}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg text-purple-900 dark:text-purple-100">Phishing Simulation</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  {hasCompletedPhishing ? "Practice detection" : "Complete phishing course first"}
                </p>
              </div>
            </div>
            {!hasCompletedPhishing && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                  <span className="text-white text-xs">🔒</span>
                </div>
              </div>
            )}
          </button>

          <button
            onClick={handleCertificatesClick}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-amber-200 dark:border-amber-800"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg text-amber-900 dark:text-amber-100">View Certificates</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {hasCertificates ? `${stats?.coursesCompleted || 0} earned` : "Start earning today"}
                </p>
              </div>
            </div>
          </button>
        </div>

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
          </div>
        </div>
      </div>

      {/* No Certificates Modal */}
      <Dialog open={showNoCertificatesModal} onOpenChange={setShowNoCertificatesModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              No Certificates Yet
            </DialogTitle>
            <DialogDescription className="pt-4">
              You haven't earned any certificates yet. Complete courses to earn certificates that you can share with employers and on social media.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Recommended Starter Course</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Start with our <span className="font-semibold">Phishing Detection Fundamentals</span> course to learn how to identify and protect against phishing attacks.
            </p>
            <Button
              onClick={handleStartPhishingCourse}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Book className="w-4 h-4 mr-2" />
              Start Phishing Course
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoCertificatesModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Simulation Locked Modal */}
      <Dialog open={showSimulationLockedModal} onOpenChange={setShowSimulationLockedModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-500" />
              Complete Phishing Course First
            </DialogTitle>
            <DialogDescription className="pt-4">
              To access the phishing simulation, you need to complete the <span className="font-semibold">Phishing Detection Fundamentals</span> course first. This ensures you have the foundational knowledge to succeed in the simulation.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 my-4">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Why This Matters</h4>
            <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Learn to identify common phishing indicators</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Understand attacker tactics and techniques</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Practice in a safe, guided environment</span>
              </li>
            </ul>
          </div>
          <DialogFooter>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                onClick={handleStartPhishingCourse}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <Book className="w-4 h-4 mr-2" />
                Start Phishing Course
              </Button>
              <Button variant="outline" onClick={() => setShowSimulationLockedModal(false)} className="flex-1">
                Maybe Later
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
