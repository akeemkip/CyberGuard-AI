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
  Shield,
  Moon,
  Sun,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Download,
  FileText,
  TrendingUp,
  Activity,
  Loader2
} from "lucide-react";
import { useTheme } from "./theme-provider";
import adminService, { AdminDashboardData } from "../services/admin.service";
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

// Mock data for charts
const progressionData = [
  { date: "Week 1", users: 45, completion: 20 },
  { date: "Week 2", users: 78, completion: 35 },
  { date: "Week 3", users: 120, completion: 65 },
  { date: "Week 4", users: 165, completion: 98 },
  { date: "Week 5", users: 210, completion: 145 },
  { date: "Week 6", users: 250, completion: 190 },
  { date: "Week 7", users: 285, completion: 225 },
  { date: "Week 8", users: 320, completion: 268 },
];

const skillProficiencyData = [
  { skill: "Phishing Detection", proficiency: 85 },
  { skill: "Password Security", proficiency: 92 },
  { skill: "Social Engineering", proficiency: 78 },
  { skill: "Network Security", proficiency: 70 },
  { skill: "Malware Analysis", proficiency: 65 },
  { skill: "Incident Response", proficiency: 73 },
];

const completionRatesData = [
  { name: "Completed", value: 342, percentage: 62, color: "#10b981" },
  { name: "In Progress", value: 156, percentage: 28, color: "#f59e0b" },
  { name: "Not Started", value: 52, percentage: 10, color: "#6b7280" },
];

const engagementData = [
  { month: "Jan", time: 120, sessions: 450 },
  { month: "Feb", time: 150, sessions: 520 },
  { month: "Mar", time: 180, sessions: 620 },
  { month: "Apr", time: 220, sessions: 750 },
  { month: "May", time: 260, sessions: 880 },
  { month: "Jun", time: 295, sessions: 950 },
];

const retentionData = [
  { week: "Week 1", retention: 100 },
  { week: "Week 2", retention: 95 },
  { week: "Week 3", retention: 89 },
  { week: "Week 4", retention: 85 },
  { week: "Week 5", retention: 82 },
  { week: "Week 6", retention: 80 },
  { week: "Week 7", retention: 78 },
  { week: "Week 8", retention: 76 },
];

export function AdminAnalytics({ userEmail, onNavigate, onLogout }: AdminAnalyticsProps) {
  const { theme, toggleTheme } = useTheme();
  const [dateRange, setDateRange] = useState("30days");
  const [reportType, setReportType] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getDashboardStats();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const stats = dashboardData?.stats;
  const enrollmentTrend = dashboardData?.enrollmentTrend || [];
  const completionData = dashboardData?.completionData || [];

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
              onClick={() => onNavigate("admin-content")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>Content Management</span>
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <Activity className="w-5 h-5" />
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
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg. Completion Rate</span>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats?.avgCompletionRate || 0}%</div>
              <Badge className="bg-primary/20 text-primary">
                {stats?.completedEnrollments || 0} courses completed
              </Badge>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg. Quiz Score</span>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats?.avgQuizScore || 0}%</div>
              <Badge className="bg-success">
                {stats?.quizzesPassed || 0}/{stats?.quizzesTaken || 0} passed
              </Badge>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Users</span>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats?.totalUsers || 0}</div>
              <Badge className="bg-accent/20 text-accent">
                {stats?.totalEnrollments || 0} enrollments
              </Badge>
            </Card>
            <Card className="p-6">
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
            {/* Enrollment Trend */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Enrollment Trend (Last 6 Months)</h3>
                <Badge variant="outline">Area Chart</Badge>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={enrollmentTrend.length > 0 ? enrollmentTrend : progressionData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#0066ff"
                    fill="#0066ff"
                    fillOpacity={0.6}
                    name="New Enrollments"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Skill Proficiency */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Skill Proficiency Across Domains</h3>
                <Badge variant="outline">Bar Chart</Badge>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillProficiencyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="skill" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="proficiency" 
                    fill="#06b6d4" 
                    name="Proficiency %"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={engagementData}>
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
            </Card>

            {/* Knowledge Retention */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Knowledge Retention</h3>
                <Badge variant="outline">Line Chart</Badge>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={retentionData}>
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
            </Card>
          </div>

          {/* Detailed Reports Table */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Top Performing Users</h3>
              <Button variant="outline" size="sm">
                View Full Report
              </Button>
            </div>
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
                  {[
                    { rank: 1, name: "Jane Smith", completed: 8, score: 9.5, time: "42h", active: "Today" },
                    { rank: 2, name: "John Doe", completed: 7, score: 9.2, time: "38h", active: "Yesterday" },
                    { rank: 3, name: "Mike Johnson", completed: 6, score: 9.0, time: "35h", active: "Today" },
                    { rank: 4, name: "Sarah Williams", completed: 6, score: 8.8, time: "32h", active: "2 days ago" },
                    { rank: 5, name: "Tom Brown", completed: 5, score: 8.7, time: "29h", active: "Today" },
                  ].map((user) => (
                    <tr key={user.rank} className="border-b border-border last:border-0">
                      <td className="py-3 px-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">#{user.rank}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{user.name}</td>
                      <td className="py-3 px-4">{user.completed}</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-success">{user.score}/10</Badge>
                      </td>
                      <td className="py-3 px-4">{user.time}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{user.active}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
