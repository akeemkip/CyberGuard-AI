import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
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
  Download,
  FileText,
  TrendingUp,
  Activity,
  Loader2,
  Users
} from "lucide-react";
import { useTheme } from "./theme-provider";
import adminService, {
  AdminDashboardData,
  AnalyticsResponse
} from "../services/admin.service";
import { AdminSidebar } from "./admin-sidebar";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface AdminAnalyticsProps {
  userEmail: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminAnalytics({ userEmail, onNavigate, onLogout }: AdminAnalyticsProps) {
  const { theme, toggleTheme } = useTheme();
  const [dateRange, setDateRange] = useState("30days");
  const [reportType, setReportType] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch both dashboard stats and analytics data
        const [dashboard, analytics] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAnalytics(dateRange, reportType)
        ]);
        setDashboardData(dashboard);
        setAnalyticsData(analytics);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange, reportType]);

  const handleExportPDF = () => {
    alert("Exporting report as PDF...");
  };

  const handleExportCSV = () => {
    alert("Exporting data as CSV...");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Dashboard stats for top cards
  const stats = dashboardData?.stats;
  const completionData = dashboardData?.completionData || [];

  // Analytics data for charts
  const userProgression = analyticsData?.userProgression || [];
  const skillProficiency = analyticsData?.skillProficiency || [];
  const engagement = analyticsData?.engagement || [];
  const retention = analyticsData?.retention || [];
  const topUsers = analyticsData?.topUsers || [];
  const labAnalytics = analyticsData?.labAnalytics || [];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AdminSidebar
        userEmail={userEmail}
        currentPage="admin-analytics"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Analytics & Reports</h1>
                <p className="text-muted-foreground">Comprehensive performance insights and data visualization</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={handleExportPDF}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="user">User Performance</SelectItem>
                    <SelectItem value="course">Course Analytics</SelectItem>
                    <SelectItem value="engagement">Engagement Metrics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg. Completion Rate</span>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats?.avgCompletionRate || 0}%</div>
              <Badge className="bg-primary/20 text-primary">
                {stats?.completedEnrollments || 0} courses completed
              </Badge>
            </Card>
            <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg. Quiz Score</span>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats?.avgQuizScore || 0}%</div>
              <Badge className="bg-success">
                {stats?.quizzesPassed || 0}/{stats?.quizzesTaken || 0} passed
              </Badge>
            </Card>
            <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Users</span>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats?.totalUsers || 0}</div>
              <Badge className="bg-accent/20 text-accent">
                {stats?.totalEnrollments || 0} enrollments
              </Badge>
            </Card>
            <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Lessons Completed</span>
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats?.completedLessonProgress || 0}</div>
              <Badge className="bg-chart-3/20 text-chart-3">
                of {stats?.totalLessons || 0} total
              </Badge>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* User Progression (Enrollment & Completion Trend) */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">User Progression</h3>
                <Badge variant="outline">Area Chart</Badge>
              </div>
              {userProgression.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userProgression}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#0066ff"
                      fill="#0066ff"
                      fillOpacity={0.6}
                      name="New Enrollments"
                    />
                    <Area
                      type="monotone"
                      dataKey="completion"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.4}
                      name="Completions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No enrollment data available for selected date range
                </div>
              )}
            </Card>

            {/* Skill Proficiency */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Skill Proficiency by Course</h3>
                <Badge variant="outline">Bar Chart</Badge>
              </div>
              {skillProficiency.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillProficiency} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="skill" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="proficiency"
                      fill="#06b6d4"
                      name="Avg Quiz Score %"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No quiz data available for selected date range
                </div>
              )}
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Completion Rates Pie Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Course Completion Status</h3>
                <Badge variant="outline">Pie Chart</Badge>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={completionData.length > 0 ? completionData : completionRatesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(completionData.length > 0 ? completionData : completionRatesData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {(completionData.length > 0 ? completionData : completionRatesData).map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Engagement Metrics */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">User Engagement</h3>
                <Badge variant="outline">Mixed Chart</Badge>
              </div>
              {engagement.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={engagement}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="time"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Time (hours)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="sessions"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Sessions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                  No engagement data
                </div>
              )}
            </Card>

            {/* Knowledge Retention */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Knowledge Retention</h3>
                <Badge variant="outline">Line Chart</Badge>
              </div>
              {retention.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={retention}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="retention"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Retention %"
                      dot={{ fill: "#10b981", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                  No retention data (requires quiz retakes)
                </div>
              )}
            </Card>
          </div>

          {/* Detailed Reports Table */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Top Performing Users</h3>
              <Button variant="outline" size="sm" onClick={() => onNavigate('admin-users')}>
                View All Users
              </Button>
            </div>
            {topUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rank</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Courses Completed</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Avg Score</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time Spent</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topUsers.map((user, index) => (
                      <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">#{index + 1}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{user.name}</td>
                        <td className="py-3 px-4">{user.coursesCompleted}</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-success">{user.avgScore}/10</Badge>
                        </td>
                        <td className="py-3 px-4">{user.timeSpent}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{user.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No users with completed courses in selected date range
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
}
