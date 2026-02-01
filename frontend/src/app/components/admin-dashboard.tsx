import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Moon,
  Sun,
  Users,
  BookOpen,
  Activity,
  Target,
  Award,
  Loader2,
  Plus,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  UserPlus,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Shield
} from "lucide-react";
import adminService, { AdminDashboardData } from "../services/admin.service";
import { useTheme } from "./theme-provider";
import { AdminSidebar } from "./admin-sidebar";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

interface AdminDashboardProps {
  userEmail: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminDashboard({ userEmail, onNavigate, onLogout }: AdminDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);

  const fetchDashboardData = async (showToast = false) => {
    try {
      if (showToast) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      const data = await adminService.getDashboardStats();
      setDashboardData(data);
      if (showToast) {
        toast.success("Dashboard refreshed successfully!");
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      if (showToast) {
        toast.error("Failed to refresh dashboard");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats;
  const enrollmentData = dashboardData?.enrollmentTrend || [];
  const completionData = dashboardData?.completionData || [];
  const recentActivity = dashboardData?.recentActivity || [];
  const performanceExtremes = dashboardData?.performanceExtremes;

  // Calculate mock comparison data (in real app, this would come from backend)
  // NOTE: These comparison metrics are SIMULATED for demonstration purposes
  // In a production environment, this should compare actual data from previous period
  const getComparison = (current: number, field: string) => {
    // Mock data - simulate 5-20% growth or decline
    const changePercent = Math.floor(Math.random() * 15) + 5;
    const isPositive = Math.random() > 0.3; // 70% chance of positive growth

    return {
      percent: isPositive ? changePercent : -changePercent,
      isPositive,
      text: `${isPositive ? '+' : ''}${changePercent}% from last month`
    };
  };

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    badge,
    bgColor,
    iconColor,
    showComparison = true
  }: any) => {
    const comparison = showComparison ? getComparison(value, title) : null;

    return (
      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          {badge && (
            <Badge className={badge.className}>
              {badge.text}
            </Badge>
          )}
        </div>
        <h3 className="text-2xl font-bold mb-1">{value}</h3>
        <p className="text-sm text-muted-foreground mb-2">{title}</p>
        {comparison && (
          <div className="flex items-center gap-1 text-xs">
            {comparison.isPositive ? (
              <TrendingUp className="w-3 h-3 text-success" />
            ) : comparison.percent === 0 ? (
              <Minus className="w-3 h-3 text-muted-foreground" />
            ) : (
              <TrendingDown className="w-3 h-3 text-destructive" />
            )}
            <span className={comparison.isPositive ? "text-success" : comparison.percent === 0 ? "text-muted-foreground" : "text-destructive"}>
              {comparison.text}
            </span>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AdminSidebar
        userEmail={userEmail}
        currentPage="admin-dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard Overview</h1>
              <p className="text-muted-foreground">Welcome back, Administrator</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-8">
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => onNavigate("admin-users")}
              >
                <UserPlus className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-medium">Create User</p>
                  <p className="text-xs text-muted-foreground">Add new user account</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => onNavigate("admin-content")}
              >
                <Plus className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-medium">Add Course</p>
                  <p className="text-xs text-muted-foreground">Create new course</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => onNavigate("admin-analytics")}
              >
                <BarChart3 className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-medium">View Analytics</p>
                  <p className="text-xs text-muted-foreground">Detailed reports</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => onNavigate("admin-users")}
              >
                <FileText className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-medium">User Reports</p>
                  <p className="text-xs text-muted-foreground">Export user data</p>
                </div>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={Users}
              bgColor="bg-primary/10"
              iconColor="text-primary"
              badge={{
                text: `${stats?.totalEnrollments || 0} enrolled`,
                className: "bg-primary/20 text-primary"
              }}
            />
            <MetricCard
              title="Active Courses"
              value={stats?.publishedCourses || 0}
              icon={BookOpen}
              bgColor="bg-accent/10"
              iconColor="text-accent"
              badge={{
                text: `${stats?.totalLessons || 0} lessons`,
                className: "bg-accent/20 text-accent"
              }}
            />
            <MetricCard
              title="Avg Completion"
              value={`${stats?.avgCompletionRate || 0}%`}
              icon={Target}
              bgColor="bg-warning/10"
              iconColor="text-warning"
              badge={{
                text: `${stats?.completedEnrollments || 0} completed`,
                className: "bg-success"
              }}
            />
            <MetricCard
              title="Avg Quiz Score"
              value={`${stats?.avgQuizScore || 0}%`}
              icon={Award}
              bgColor="bg-chart-3/10"
              iconColor="text-chart-3"
              badge={{
                text: `${stats?.quizzesPassed || 0}/${stats?.quizzesTaken || 0} passed`,
                className: "bg-chart-3/20 text-chart-3"
              }}
            />
          </div>

          {/* Performance Alert Tiles */}
          {performanceExtremes && (performanceExtremes.highRisk || performanceExtremes.safeZone) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* High Risk Student */}
              {performanceExtremes.highRisk && (
                <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 p-6 border border-red-200 dark:border-red-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-red-900 dark:text-red-100 mb-1">High Risk</h3>
                      <p className="text-sm text-red-700 dark:text-red-300">{performanceExtremes.highRisk.name}</p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {performanceExtremes.highRisk.coursesCompleted} of {performanceExtremes.highRisk.totalCourses} courses • {performanceExtremes.highRisk.avgScore}% avg
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 dark:text-red-400 hover:bg-red-500/10"
                      onClick={() => onNavigate("admin-user-profile", performanceExtremes.highRisk!.id)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              )}

              {/* Safe Zone Student */}
              {performanceExtremes.safeZone && (
                <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 p-6 border border-green-200 dark:border-green-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-green-900 dark:text-green-100 mb-1">Safe Zone</h3>
                      <p className="text-sm text-green-700 dark:text-green-300">{performanceExtremes.safeZone.name}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        {performanceExtremes.safeZone.coursesCompleted} courses completed • {performanceExtremes.safeZone.avgScore}% avg score
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-600 dark:text-green-400 hover:bg-green-500/10"
                      onClick={() => onNavigate("admin-user-profile", performanceExtremes.safeZone!.id)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Enrollment Trend */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Student Enrollment Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={enrollmentData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    stroke="#888"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    stroke="#888"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1f1f1f' : '#ffffff',
                      border: '1px solid #333',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#0066ff"
                    strokeWidth={3}
                    name="Enrolled Students"
                    dot={{ fill: '#0066ff', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, fill: '#0066ff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Engagement Metrics */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Engagement Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Total Enrollments</p>
                      <p className="text-sm text-muted-foreground">Active course enrollments</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{stats?.totalEnrollments || 0}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Total Courses</p>
                      <p className="text-sm text-muted-foreground">{stats?.publishedCourses || 0} published, {(stats?.totalCourses || 0) - (stats?.publishedCourses || 0)} draft</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{stats?.totalCourses || 0}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">Lesson Completion</p>
                      <p className="text-sm text-muted-foreground">Out of {stats?.totalLessons || 0} total lessons</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{stats?.completedLessonProgress || 0}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Completion Rates */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Course Completion Status</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={95}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1f1f1f' : '#ffffff',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: theme === 'dark' ? '#ffffff' : '#000000',
                    }}
                    itemStyle={{
                      color: theme === 'dark' ? '#ffffff' : '#000000',
                    }}
                    formatter={(value: number, name: string) => [value, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {completionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value} ({((item.value / completionData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(0)}%)</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 lg:col-span-2 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Activity</h3>
                {recentActivity.length > 0 && (
                  <span className="text-xs text-muted-foreground">{recentActivity.length} activities</span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 space-y-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                ) : (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">{activity.course} - {activity.lesson}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>

    </div>
  );
}
