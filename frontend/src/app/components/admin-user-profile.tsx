import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  User,
  Mail,
  BookOpen,
  CheckCircle2,
  Trophy,
  Target,
  Clock,
  Activity,
  TrendingUp,
  Award,
  Loader2,
  ArrowLeft,
  Moon,
  Sun,
  ShieldAlert,
  MousePointerClick,
  Flag,
  Timer,
  XCircle
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { AdminSidebar } from "./admin-sidebar";
import adminService, { UserStatistics } from "../services/admin.service";
import { toast } from "sonner";

interface AdminUserProfileProps {
  userId: string;
  userEmail: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminUserProfile({ userId, userEmail, onNavigate, onLogout }: AdminUserProfileProps) {
  const { theme, toggleTheme } = useTheme();
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, [userId]);

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getUserStatistics(userId);
      setStats(data);
    } catch (error) {
      console.error("Error loading user statistics:", error);
      toast.error("Failed to load user statistics");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getDisplayName = () => {
    if (!stats) return "";
    if (stats.user.firstName && stats.user.lastName) {
      return `${stats.user.firstName} ${stats.user.lastName}`;
    }
    return stats.user.email;
  };

  const getCompletionPercentage = () => {
    if (!stats || stats.academic.enrollments.total === 0) return 0;
    return Math.round((stats.academic.enrollments.completed / stats.academic.enrollments.total) * 100);
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar
        userEmail={userEmail}
        currentPage="admin-users"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("admin-users")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Users
              </Button>
              <div className="h-8 w-px bg-border" />
              <h1 className="text-xl font-semibold">User Profile & Statistics</h1>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : stats ? (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* User Header */}
              <div className="flex items-center gap-4 p-6 bg-muted/50 rounded-lg">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-3xl">
                    {getDisplayName().charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-2xl">{getDisplayName()}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Mail className="w-4 h-4" />
                    {stats.user.email}
                  </div>
                  <Badge variant={stats.user.role === "ADMIN" ? "default" : "secondary"} className="mt-2">
                    {stats.user.role}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Member for</div>
                  <div className="text-3xl font-bold text-primary">{stats.user.daysSinceJoined}</div>
                  <div className="text-sm text-muted-foreground">days</div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-5 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Courses</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.academic.enrollments.total}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stats.academic.enrollments.completed} completed
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Lessons</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.academic.lessons.completed}</div>
                  <div className="text-xs text-muted-foreground mt-1">completed</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted-foreground">Avg Score</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.academic.quizzes.averageScore}%</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stats.academic.quizzes.passRate}% pass rate
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-warning" />
                    <span className="text-sm text-muted-foreground">Certificates</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.academic.certificates.total}</div>
                  <div className="text-xs text-muted-foreground mt-1">earned</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Phishing</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.academic.phishing?.accuracy || 0}%</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stats.academic.phishing?.totalAttempts || 0} attempts
                  </div>
                </Card>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Account Information */}
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Account Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Joined</div>
                        <div className="text-sm">{formatDate(stats.user.createdAt)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Last Login</div>
                        <div className="text-sm">{formatDate(stats.user.lastLoginAt)}</div>
                      </div>
                    </div>
                  </Card>

                  {/* Course Progress */}
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Course Progress
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Completion</span>
                          <span className="font-semibold">{getCompletionPercentage()}%</span>
                        </div>
                        <Progress value={getCompletionPercentage()} className="h-2" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-success/10 rounded">
                          <div className="text-lg font-bold text-success">
                            {stats.academic.enrollments.completed}
                          </div>
                          <div className="text-xs text-muted-foreground">Completed</div>
                        </div>
                        <div className="p-2 bg-warning/10 rounded">
                          <div className="text-lg font-bold text-warning">
                            {stats.academic.enrollments.inProgress}
                          </div>
                          <div className="text-xs text-muted-foreground">In Progress</div>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <div className="text-lg font-bold">
                            {stats.academic.enrollments.total}
                          </div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Quiz Performance */}
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Quiz Performance
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Attempts</span>
                        <span className="font-semibold">{stats.academic.quizzes.total}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Passed</span>
                        <span className="font-semibold text-success">{stats.academic.quizzes.passed}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Pass Rate</span>
                        <span className="font-semibold">{stats.academic.quizzes.passRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Average Score</span>
                        <span className="font-semibold text-accent">{stats.academic.quizzes.averageScore}%</span>
                      </div>
                    </div>
                  </Card>

                  {/* Phishing Simulation Performance */}
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" />
                      Phishing Simulation
                    </h4>
                    {stats.academic.phishing?.totalAttempts > 0 ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Target className="w-3 h-3" /> Total Attempts
                          </span>
                          <span className="font-semibold">{stats.academic.phishing.totalAttempts}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Correct
                          </span>
                          <span className="font-semibold text-success">{stats.academic.phishing.correctAttempts}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Accuracy
                          </span>
                          <span className={`font-semibold ${stats.academic.phishing.accuracy >= 70 ? 'text-success' : stats.academic.phishing.accuracy >= 50 ? 'text-warning' : 'text-destructive'}`}>
                            {stats.academic.phishing.accuracy}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <MousePointerClick className="w-3 h-3" /> Click Rate
                          </span>
                          <span className={`font-semibold ${stats.academic.phishing.clickRate <= 10 ? 'text-success' : stats.academic.phishing.clickRate <= 30 ? 'text-warning' : 'text-destructive'}`}>
                            {stats.academic.phishing.clickRate}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Flag className="w-3 h-3" /> Report Rate
                          </span>
                          <span className={`font-semibold ${stats.academic.phishing.reportRate >= 70 ? 'text-success' : stats.academic.phishing.reportRate >= 50 ? 'text-warning' : 'text-destructive'}`}>
                            {stats.academic.phishing.reportRate}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Timer className="w-3 h-3" /> Avg Response
                          </span>
                          <span className="font-semibold">
                            {stats.academic.phishing.avgResponseTimeMs > 60000
                              ? `${Math.round(stats.academic.phishing.avgResponseTimeMs / 60000)}m`
                              : `${Math.round(stats.academic.phishing.avgResponseTimeMs / 1000)}s`
                            }
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No phishing simulation attempts</p>
                    )}
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Enrolled Courses */}
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Enrolled Courses ({stats.courses.length})
                    </h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {stats.courses.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No courses enrolled</p>
                      ) : (
                        stats.courses.map((course) => (
                          <div key={course.courseId} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex-1">
                              <div className="text-sm font-medium">{course.courseName}</div>
                              <div className="text-xs text-muted-foreground">
                                Enrolled {new Date(course.enrolledAt).toLocaleDateString()}
                              </div>
                            </div>
                            {course.isCompleted ? (
                              <Badge variant="default" className="bg-success">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            ) : (
                              <Badge variant="secondary">In Progress</Badge>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </Card>

                  {/* Certificates */}
                  {stats.academic.certificates.total > 0 && (
                    <Card className="p-6">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Certificates Earned ({stats.academic.certificates.total})
                      </h4>
                      <div className="space-y-2">
                        {stats.academic.certificates.list.map((cert) => (
                          <div key={cert.id} className="p-2 bg-warning/10 rounded">
                            <div className="text-sm font-medium">{cert.courseName}</div>
                            <div className="text-xs text-muted-foreground">
                              Issued {new Date(cert.issuedAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Recent Activity */}
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Recent Activity
                    </h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {stats.recentActivity.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                      ) : (
                        stats.recentActivity.map((activity, index) => (
                          <div key={index} className={`p-2 border-l-2 pl-3 ${
                            activity.type === "phishing_attempt"
                              ? "border-orange-500"
                              : "border-primary"
                          }`}>
                            {activity.type === "lesson_completed" ? (
                              <>
                                <div className="text-sm font-medium">Completed: {activity.lesson}</div>
                                <div className="text-xs text-muted-foreground">{activity.course}</div>
                                <div className="text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {formatDate(activity.completedAt!)}
                                </div>
                              </>
                            ) : activity.type === "phishing_attempt" ? (
                              <>
                                <div className="text-sm font-medium flex items-center gap-2">
                                  <ShieldAlert className="w-3 h-3 text-orange-500" />
                                  Phishing: {activity.scenario}
                                  {activity.isCorrect ? (
                                    <Badge variant="default" className="bg-success text-xs">
                                      Correct
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive" className="text-xs">
                                      {activity.action === "CLICKED_LINK" ? "Clicked Link" : "Incorrect"}
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground capitalize">
                                  Action: {activity.action?.toLowerCase().replace('_', ' ')}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {formatDate(activity.attemptedAt!)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="text-sm font-medium flex items-center gap-2">
                                  Quiz: {activity.quiz}
                                  {activity.passed ? (
                                    <Badge variant="default" className="bg-success text-xs">
                                      Passed {activity.score}%
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive" className="text-xs">
                                      Failed {activity.score}%
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">{activity.course}</div>
                                <div className="text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {formatDate(activity.attemptedAt!)}
                                </div>
                              </>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No user data available
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
