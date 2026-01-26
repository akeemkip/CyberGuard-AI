import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Moon,
  Sun,
  Download,
  FileText,
  TrendingUp,
  Activity,
  Loader2,
  Users,
  Calendar,
  Edit2,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  BarChart3,
  Table2,
  Brain,
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

  // Custom date range state
  const [showCustomDateDialog, setShowCustomDateDialog] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Separate state for applied custom dates (only updated when user clicks Apply)
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");

  // Priority 5: Refresh system state
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);

  // Priority 5: View mode toggles (chart vs table)
  const [viewModes, setViewModes] = useState<Record<string, 'chart' | 'table'>>({
    userProgression: 'chart',
    skillProficiency: 'chart',
    engagement: 'chart',
    retention: 'chart',
  });

  // Priority 5: Comparison mode toggle
  const [showComparison, setShowComparison] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch both dashboard stats and analytics data
        const [dashboard, analytics] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAnalytics(
            dateRange,
            reportType,
            dateRange === "custom" ? appliedStartDate : undefined,
            dateRange === "custom" ? appliedEndDate : undefined
          )
        ]);
        setDashboardData(dashboard);
        setAnalyticsData(analytics);
        setLastUpdated(new Date()); // Priority 5: Update timestamp
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange, reportType, appliedStartDate, appliedEndDate]);

  const handleExportPDF = async () => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        dateRange,
        reportType
      });

      // Add custom dates if applicable
      if (dateRange === 'custom' && appliedStartDate && appliedEndDate) {
        params.append('startDate', appliedStartDate);
        params.append('endDate', appliedEndDate);
      }

      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      // Fetch PDF file
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/analytics/export/pdf?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to export PDF');
      }

      // Get the PDF content
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cyberguard-analytics-report-${dateRange}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleExportCSV = async () => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        dateRange,
        reportType
      });

      // Add custom dates if applicable
      if (dateRange === 'custom' && appliedStartDate && appliedEndDate) {
        params.append('startDate', appliedStartDate);
        params.append('endDate', appliedEndDate);
      }

      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      // Fetch CSV file
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/analytics/export/csv?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to export CSV');
      }

      // Get the CSV content
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cyberguard-analytics-${dateRange}-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('CSV export error:', error);
      alert('Failed to export CSV. Please try again.');
    }
  };

  // Handle date range change
  const handleDateRangeChange = (value: string) => {
    if (value === "custom") {
      // Pre-populate dialog with existing custom dates if they exist
      if (appliedStartDate && appliedEndDate) {
        setCustomStartDate(appliedStartDate);
        setCustomEndDate(appliedEndDate);
      }
      setShowCustomDateDialog(true);
    } else {
      setDateRange(value);
      // Clear custom dates when switching to preset range
      setCustomStartDate("");
      setCustomEndDate("");
      setAppliedStartDate("");
      setAppliedEndDate("");
    }
  };

  // Apply custom date range
  const handleApplyCustomDates = () => {
    if (customStartDate && customEndDate) {
      if (new Date(customStartDate) > new Date(customEndDate)) {
        alert("Start date must be before end date");
        return;
      }
      // Apply the dates (this triggers the useEffect to fetch data)
      setAppliedStartDate(customStartDate);
      setAppliedEndDate(customEndDate);
      setDateRange("custom");
      setShowCustomDateDialog(false);
    } else {
      alert("Please select both start and end dates");
    }
  };

  // Cancel custom date range
  const handleCancelCustomDates = () => {
    setShowCustomDateDialog(false);
    // Reset the temporary selection to applied values or clear them
    if (appliedStartDate && appliedEndDate) {
      setCustomStartDate(appliedStartDate);
      setCustomEndDate(appliedEndDate);
    } else {
      // If no dates were applied, revert to default preset
      if (dateRange === "custom") {
        setDateRange("30days");
      }
      setCustomStartDate("");
      setCustomEndDate("");
    }
  };

  // Open custom date dialog to edit existing dates
  const handleEditCustomDates = () => {
    setCustomStartDate(appliedStartDate);
    setCustomEndDate(appliedEndDate);
    setShowCustomDateDialog(true);
  };

  // Get date range label for display
  const getDateRangeLabel = () => {
    switch (dateRange) {
      case "7days": return "Last 7 Days";
      case "30days": return "Last 30 Days";
      case "90days": return "Last 90 Days";
      case "year": return "This Year";
      case "custom":
        if (appliedStartDate && appliedEndDate) {
          return `${appliedStartDate} to ${appliedEndDate}`;
        }
        return "Custom Range";
      default: return dateRange;
    }
  };

  // Priority 5: Manual refresh handler
  const handleManualRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const [dashboard, analytics] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAnalytics(
          dateRange,
          reportType,
          dateRange === "custom" ? appliedStartDate : undefined,
          dateRange === "custom" ? appliedEndDate : undefined
        )
      ]);
      setDashboardData(dashboard);
      setAnalyticsData(analytics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [dateRange, reportType, appliedStartDate, appliedEndDate]);

  // Priority 5: Auto-refresh effect (5 minutes)
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const interval = setInterval(() => {
      handleManualRefresh();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoRefreshEnabled, handleManualRefresh]);

  // Priority 5: Update "last updated" text every minute
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!lastUpdated) return;

    const interval = setInterval(() => {
      setTick(tick => tick + 1); // Force re-render to update "X minutes ago" text
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Priority 5: Format last updated time
  const getLastUpdatedText = () => {
    if (!lastUpdated) return null;
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Updated just now";
    if (diffMins === 1) return "Updated 1 minute ago";
    if (diffMins < 60) return `Updated ${diffMins} minutes ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "Updated 1 hour ago";
    return `Updated ${diffHours} hours ago`;
  };

  // Priority 5: Toggle view mode for a chart
  const toggleViewMode = (chartKey: string) => {
    setViewModes(prev => ({
      ...prev,
      [chartKey]: prev[chartKey] === 'chart' ? 'table' : 'chart'
    }));
  };

  // Priority 5: Calculate trend indicator
  const calculateTrend = (data: any[], dataKey: string) => {
    if (!data || data.length === 0) return { change: 0, direction: 'neutral' as const };

    const midpoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midpoint);
    const secondHalf = data.slice(midpoint);

    const firstTotal = firstHalf.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
    const secondTotal = secondHalf.reduce((sum, item) => sum + (item[dataKey] || 0), 0);

    if (firstTotal === 0) return { change: 0, direction: 'neutral' as const };

    const percentChange = ((secondTotal - firstTotal) / firstTotal) * 100;
    const direction = percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'neutral';

    return { change: Math.abs(Math.round(percentChange)), direction };
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

  // Fallback data for completion pie chart if no real data
  const fallbackCompletionData = [
    { name: "Completed", value: 0, color: "#10b981" },
    { name: "In Progress", value: 0, color: "#f59e0b" },
    { name: "Not Started", value: 0, color: "#6b7280" },
  ];

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
                <TooltipProvider>
                  <ShadcnTooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleManualRefresh}
                        disabled={isRefreshing}
                      >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh data</p>
                    </TooltipContent>
                  </ShadcnTooltip>
                </TooltipProvider>
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
                <Select value={dateRange} onValueChange={handleDateRangeChange}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="custom">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Custom Range
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Priority 5: Auto-refresh and comparison toggles */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Switch
                  id="auto-refresh"
                  checked={autoRefreshEnabled}
                  onCheckedChange={setAutoRefreshEnabled}
                />
                <Label htmlFor="auto-refresh" className="text-sm cursor-pointer">
                  Auto-refresh (5 min)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="show-comparison"
                  checked={showComparison}
                  onCheckedChange={setShowComparison}
                />
                <Label htmlFor="show-comparison" className="text-sm cursor-pointer">
                  Show trend indicators
                </Label>
              </div>
              {lastUpdated && (
                <Badge variant="outline" className="ml-auto text-xs" aria-live="polite">
                  {getLastUpdatedText()}
                </Badge>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          {/* Date Range Badge */}
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Showing data for: <span className="font-semibold ml-1">{getDateRangeLabel()}</span>
            </Badge>
            {dateRange === "custom" && appliedStartDate && appliedEndDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditCustomDates}
                className="h-7 px-2 text-xs"
              >
                <Edit2 className="w-3 h-3 mr-1" />
                Edit Dates
              </Button>
            )}
          </div>

          {/* Key Metrics - Show in all views */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1" tabIndex={0}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg. Completion Rate</span>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">{stats?.avgCompletionRate || 0}%</div>
                {showComparison && userProgression.length > 0 && (() => {
                  const trend = calculateTrend(userProgression, 'completion');
                  if (trend.change === 0) return null;
                  return (
                    <div className={`flex items-center text-sm ${trend.direction === 'up' ? 'text-success' : trend.direction === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {trend.direction === 'up' && <ArrowUp className="w-3 h-3" />}
                      {trend.direction === 'down' && <ArrowDown className="w-3 h-3" />}
                      <span className="ml-0.5">{trend.change}%</span>
                    </div>
                  );
                })()}
              </div>
              <Badge className="bg-primary/20 text-primary mt-1">
                {stats?.completedEnrollments || 0} courses completed
              </Badge>
            </Card>
            <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1" tabIndex={0}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg. Quiz Score</span>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">{stats?.avgQuizScore || 0}%</div>
                {showComparison && skillProficiency.length > 0 && (() => {
                  const trend = calculateTrend(skillProficiency, 'proficiency');
                  if (trend.change === 0) return null;
                  return (
                    <div className={`flex items-center text-sm ${trend.direction === 'up' ? 'text-success' : trend.direction === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {trend.direction === 'up' && <ArrowUp className="w-3 h-3" />}
                      {trend.direction === 'down' && <ArrowDown className="w-3 h-3" />}
                      <span className="ml-0.5">{trend.change}%</span>
                    </div>
                  );
                })()}
              </div>
              <Badge className="bg-success mt-1">
                {stats?.quizzesPassed || 0}/{stats?.quizzesTaken || 0} passed
              </Badge>
            </Card>
            <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1" tabIndex={0}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Users</span>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
                {showComparison && userProgression.length > 0 && (() => {
                  const trend = calculateTrend(userProgression, 'users');
                  if (trend.change === 0) return null;
                  return (
                    <div className={`flex items-center text-sm ${trend.direction === 'up' ? 'text-success' : trend.direction === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {trend.direction === 'up' && <ArrowUp className="w-3 h-3" />}
                      {trend.direction === 'down' && <ArrowDown className="w-3 h-3" />}
                      <span className="ml-0.5">{trend.change}%</span>
                    </div>
                  );
                })()}
              </div>
              <Badge className="bg-accent/20 text-accent mt-1">
                {stats?.totalEnrollments || 0} enrollments
              </Badge>
            </Card>
            <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1" tabIndex={0}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Lessons Completed</span>
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">{stats?.completedLessonProgress || 0}</div>
                {showComparison && engagement.length > 0 && (() => {
                  const trend = calculateTrend(engagement, 'lessonCompletions');
                  if (trend.change === 0) return null;
                  return (
                    <div className={`flex items-center text-sm ${trend.direction === 'up' ? 'text-success' : trend.direction === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {trend.direction === 'up' && <ArrowUp className="w-3 h-3" />}
                      {trend.direction === 'down' && <ArrowDown className="w-3 h-3" />}
                      <span className="ml-0.5">{trend.change}%</span>
                    </div>
                  );
                })()}
              </div>
              <Badge className="bg-chart-3/20 text-chart-3 mt-1">
                of {stats?.totalLessons || 0} total
              </Badge>
            </Card>
          </div>

          {/* Render different views based on report type */}
          {reportType === "overview" && (
            <>
              {/* OVERVIEW VIEW - All Charts */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Overview Dashboard</h2>
                <p className="text-sm text-muted-foreground">Comprehensive view of all platform metrics</p>
              </div>

              {/* Charts Row 1 */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* User Progression (Enrollment & Completion Trend) */}
            <Card className="p-6" role="region" aria-labelledby="user-progression-title" tabIndex={0}>
              <div className="flex items-center justify-between mb-4">
                <h3 id="user-progression-title" className="font-semibold">User Progression</h3>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleViewMode('userProgression')}
                          className="h-8 w-8 p-0"
                        >
                          {viewModes.userProgression === 'chart' ? (
                            <Table2 className="w-4 h-4" />
                          ) : (
                            <BarChart3 className="w-4 h-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Switch to {viewModes.userProgression === 'chart' ? 'table' : 'chart'} view</p>
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                  <Badge variant="outline">{viewModes.userProgression === 'chart' ? 'Area Chart' : 'Table'}</Badge>
                </div>
              </div>
              {userProgression.length > 0 ? (
                viewModes.userProgression === 'chart' ? (
                  <div role="img" aria-label={`User progression chart showing ${userProgression.length} data points with enrollments and completions over time`}>
                    <ResponsiveContainer width="100%" height={300} >
                      <AreaChart data={userProgression}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="users"
                          stroke="var(--chart-1)"
                          fill="var(--chart-1)"
                          fillOpacity={0.6}
                          name="New Enrollments"
                          animationDuration={800}
                          animationEasing="ease-out"
                        />
                        <Area
                          type="monotone"
                          dataKey="completion"
                          stroke="var(--chart-4)"
                          fill="var(--chart-4)"
                          fillOpacity={0.4}
                          name="Completions"
                          animationDuration={800}
                          animationEasing="ease-out"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    <span className="sr-only">
                      Chart showing user progression with {userProgression.reduce((sum, d) => sum + (d.users || 0), 0)} total enrollments
                      and {userProgression.reduce((sum, d) => sum + (d.completion || 0), 0)} total completions.
                    </span>
                  </div>
                ) : (
                  <div className="h-[300px] overflow-auto sm:h-[220px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Enrollments</TableHead>
                          <TableHead className="text-right">Completions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userProgression.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell className="text-right">{row.users}</TableCell>
                            <TableCell className="text-right">{row.completion}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-center sm:h-[220px]">
                  <TrendingUp className="w-12 h-12 text-muted-foreground/30 mb-3" aria-hidden="true" />
                  <p className="text-muted-foreground font-medium">No enrollment data</p>
                  <p className="text-sm text-muted-foreground/70">Try selecting a different date range</p>
                </div>
              )}
            </Card>

            {/* Skill Proficiency */}
            <Card className="p-6" role="region" aria-labelledby="skill-proficiency-title" tabIndex={0}>
              <div className="flex items-center justify-between mb-4">
                <h3 id="skill-proficiency-title" className="font-semibold">Skill Proficiency by Course</h3>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleViewMode('skillProficiency')}
                          className="h-8 w-8 p-0"
                        >
                          {viewModes.skillProficiency === 'chart' ? (
                            <Table2 className="w-4 h-4" />
                          ) : (
                            <BarChart3 className="w-4 h-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Switch to {viewModes.skillProficiency === 'chart' ? 'table' : 'chart'} view</p>
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                  <Badge variant="outline">{viewModes.skillProficiency === 'chart' ? 'Bar Chart' : 'Table'}</Badge>
                </div>
              </div>
              {skillProficiency.length > 0 ? (
                viewModes.skillProficiency === 'chart' ? (
                  <div role="img" aria-label={`Skill proficiency chart showing quiz scores for ${skillProficiency.length} courses`}>
                    <ResponsiveContainer width="100%" height={300} >
                      <BarChart data={skillProficiency} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="skill" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="proficiency"
                          fill="var(--chart-2)"
                          name="Avg Quiz Score %"
                          radius={[0, 8, 8, 0]}
                          animationDuration={800}
                          animationEasing="ease-out"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    <span className="sr-only">
                      Bar chart showing skill proficiency across {skillProficiency.length} courses.
                      Average score: {Math.round(skillProficiency.reduce((sum, s) => sum + (s.proficiency || 0), 0) / skillProficiency.length)}%.
                    </span>
                  </div>
                ) : (
                  <div className="h-[300px] overflow-auto sm:h-[220px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course/Skill</TableHead>
                          <TableHead className="text-right">Proficiency %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {skillProficiency.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{row.skill}</TableCell>
                            <TableCell className="text-right">{row.proficiency}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-center sm:h-[220px]">
                  <BarChart3 className="w-12 h-12 text-muted-foreground/30 mb-3" aria-hidden="true" />
                  <p className="text-muted-foreground font-medium">No quiz data</p>
                  <p className="text-sm text-muted-foreground/70">Try selecting a different date range</p>
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
                    data={completionData.length > 0 ? completionData : fallbackCompletionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(completionData.length > 0 ? completionData : fallbackCompletionData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {(completionData.length > 0 ? completionData : fallbackCompletionData).map((item) => (
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
            <Card className="p-6" role="region" aria-labelledby="engagement-title" tabIndex={0}>
              <div className="flex items-center justify-between mb-4">
                <h3 id="engagement-title" className="font-semibold">User Engagement</h3>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleViewMode('engagement')}
                          className="h-8 w-8 p-0"
                        >
                          {viewModes.engagement === 'chart' ? (
                            <Table2 className="w-4 h-4" />
                          ) : (
                            <BarChart3 className="w-4 h-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Switch to {viewModes.engagement === 'chart' ? 'table' : 'chart'} view</p>
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                  <Badge variant="outline">{viewModes.engagement === 'chart' ? 'Mixed Chart' : 'Table'}</Badge>
                </div>
              </div>
              {engagement.length > 0 ? (
                viewModes.engagement === 'chart' ? (
                  <div role="img" aria-label={`Engagement metrics chart showing ${engagement.length} time periods with study time and lesson completions`}>
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
                          dataKey="timeEstimated"
                          stroke="var(--chart-3)"
                          strokeWidth={2}
                          name="Time (hours, est.)"
                          animationDuration={800}
                          animationEasing="ease-out"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="lessonCompletions"
                          stroke="var(--chart-5)"
                          strokeWidth={2}
                          name="Lesson Completions"
                          animationDuration={800}
                          animationEasing="ease-out"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <span className="sr-only">
                      Line chart showing engagement with {engagement.reduce((sum, e) => sum + (e.timeEstimated || 0), 0)} total hours
                      and {engagement.reduce((sum, e) => sum + (e.lessonCompletions || 0), 0)} lesson completions.
                    </span>
                  </div>
                ) : (
                  <div className="h-[250px] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead className="text-right">Time (hours)</TableHead>
                          <TableHead className="text-right">Lessons</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {engagement.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{row.month}</TableCell>
                            <TableCell className="text-right">{row.timeEstimated}</TableCell>
                            <TableCell className="text-right">{row.lessonCompletions}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )
              ) : (
                <div className="h-[250px] flex flex-col items-center justify-center text-center">
                  <Activity className="w-12 h-12 text-muted-foreground/30 mb-3" aria-hidden="true" />
                  <p className="text-muted-foreground font-medium">No engagement data</p>
                  <p className="text-sm text-muted-foreground/70">Try selecting a different date range</p>
                </div>
              )}
            </Card>

            {/* Knowledge Retention */}
            <Card className="p-6" role="region" aria-labelledby="retention-title" tabIndex={0}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 id="retention-title" className="font-semibold">Knowledge Retention (Quiz Scores Over Time)</h3>
                  <p className="text-xs text-muted-foreground mt-1">Average score trends - Week 1 is initial attempts</p>
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleViewMode('retention')}
                          className="h-8 w-8 p-0"
                        >
                          {viewModes.retention === 'chart' ? (
                            <Table2 className="w-4 h-4" />
                          ) : (
                            <BarChart3 className="w-4 h-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Switch to {viewModes.retention === 'chart' ? 'table' : 'chart'} view</p>
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                  <Badge variant="outline">{viewModes.retention === 'chart' ? 'Line Chart' : 'Table'}</Badge>
                </div>
              </div>
              {retention.filter(r => r.retention !== null).length > 0 ? (
                viewModes.retention === 'chart' ? (
                  <div role="img" aria-label={`Knowledge retention chart showing quiz score trends over ${retention.filter(r => r.retention !== null).length} weeks`}>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={retention.filter(r => r.retention !== null)}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="week" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border border-border p-3 rounded shadow-lg">
                                  <p className="font-semibold">{data.week}</p>
                                  <p className="text-sm">Avg Score: {data.avgScore}%</p>
                                  <p className="text-sm">Pass Rate: {data.passRate}%</p>
                                  <p className="text-xs text-muted-foreground">Sample: {data.sampleSize} attempts</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="retention"
                          stroke="var(--chart-4)"
                          strokeWidth={3}
                          name="Avg Score %"
                          dot={{ fill: "var(--chart-4)", r: 4 }}
                          animationDuration={800}
                          animationEasing="ease-out"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <span className="sr-only">
                      Knowledge retention chart showing average quiz scores over time.
                    </span>
                  </div>
                ) : (
                  <div className="h-[250px] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Week</TableHead>
                          <TableHead className="text-right">Avg Score %</TableHead>
                          <TableHead className="text-right">Pass Rate %</TableHead>
                          <TableHead className="text-right">Attempts</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {retention.filter(r => r.retention !== null).map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{row.week}</TableCell>
                            <TableCell className="text-right">{row.avgScore}%</TableCell>
                            <TableCell className="text-right">{row.passRate}%</TableCell>
                            <TableCell className="text-right">{row.sampleSize}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )
              ) : (
                <div className="h-[250px] flex flex-col items-center justify-center text-center">
                  <Brain className="w-12 h-12 text-muted-foreground/30 mb-3" aria-hidden="true" />
                  <p className="text-muted-foreground font-medium">No retention data</p>
                  <p className="text-sm text-muted-foreground/70">Requires quiz attempts in selected range</p>
                </div>
              )}
            </Card>
          </div>

              {/* Top Performers Table */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Top Performing Users</h3>
                  <Button variant="outline" size="sm" onClick={() => setReportType('user')}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View User Performance Report
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
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Time Spent <span className="text-xs font-normal">(est.)</span>
                          </th>
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
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Users className="w-12 h-12 text-muted-foreground/30 mb-3" aria-hidden="true" />
                    <p className="text-muted-foreground font-medium">No users with completed courses</p>
                    <p className="text-sm text-muted-foreground/70">Try selecting a different date range</p>
                  </div>
                )}
              </Card>
            </>
          )}

          {/* USER PERFORMANCE VIEW */}
          {reportType === "user" && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">User Performance Report</h2>
                <p className="text-sm text-muted-foreground">Detailed metrics on student engagement and achievement</p>
              </div>

              {/* User Progression Chart */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Reuse the same chart component from overview - just reference userProgression view mode */}
                <Card className="p-6" role="region" aria-labelledby="user-progression-title-2" tabIndex={0}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 id="user-progression-title-2" className="font-semibold">User Progression Over Time</h3>
                    <Badge variant="outline">Area Chart</Badge>
                  </div>
                  {userProgression.length > 0 ? (
                    <div role="img" aria-label={`User progression chart showing ${userProgression.length} data points`}>
                      <ResponsiveContainer width="100%" height={300} >
                        <AreaChart data={userProgression}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="users"
                            stroke="var(--chart-1)"
                            fill="var(--chart-1)"
                            fillOpacity={0.6}
                            name="New Enrollments"
                            animationDuration={800}
                            animationEasing="ease-out"
                          />
                          <Area
                            type="monotone"
                            dataKey="completion"
                            stroke="var(--chart-4)"
                            fill="var(--chart-4)"
                            fillOpacity={0.4}
                            name="Completions"
                            animationDuration={800}
                            animationEasing="ease-out"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                      <span className="sr-only">
                        Chart showing user progression with {userProgression.reduce((sum, d) => sum + (d.users || 0), 0)} total enrollments.
                      </span>
                    </div>
                  ) : (
                    <div className="h-[300px] flex flex-col items-center justify-center text-center sm:h-[220px]">
                      <TrendingUp className="w-12 h-12 text-muted-foreground/30 mb-3" aria-hidden="true" />
                      <p className="text-muted-foreground font-medium">No enrollment data</p>
                      <p className="text-sm text-muted-foreground/70">Try selecting a different date range</p>
                    </div>
                  )}
                </Card>

                {/* Knowledge Retention */}
                <Card className="p-6" role="region" aria-labelledby="retention-title-2" tabIndex={0}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 id="retention-title-2" className="font-semibold">Knowledge Retention (Quiz Score Trends)</h3>
                      <p className="text-xs text-muted-foreground mt-1">Shows how student performance changes over time - Week 1 = initial attempts</p>
                    </div>
                    <Badge variant="outline">Line Chart</Badge>
                  </div>
                  {retention.filter(r => r.retention !== null).length > 0 ? (
                    <div role="img" aria-label={`Knowledge retention chart showing quiz scores over ${retention.filter(r => r.retention !== null).length} weeks`}>
                      <ResponsiveContainer width="100%" height={300} >
                        <LineChart data={retention.filter(r => r.retention !== null)}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="week" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-background border border-border p-3 rounded shadow-lg">
                                    <p className="font-semibold">{data.week}</p>
                                    <p className="text-sm">Avg Score: {data.avgScore}%</p>
                                    <p className="text-sm">Pass Rate: {data.passRate}%</p>
                                    <p className="text-xs text-muted-foreground">Sample: {data.sampleSize} attempts</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="retention"
                            stroke="var(--chart-4)"
                            strokeWidth={3}
                            name="Avg Score %"
                            dot={{ fill: "var(--chart-4)", r: 4 }}
                            animationDuration={800}
                            animationEasing="ease-out"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                      <span className="sr-only">
                        Knowledge retention chart showing average quiz scores over time.
                      </span>
                    </div>
                  ) : (
                    <div className="h-[300px] flex flex-col items-center justify-center text-center sm:h-[220px]">
                      <Brain className="w-12 h-12 text-muted-foreground/30 mb-3" aria-hidden="true" />
                      <p className="text-muted-foreground font-medium">No retention data</p>
                      <p className="text-sm text-muted-foreground/70">Requires quiz attempts in selected range</p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Top Performers - Expanded View */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Top Performing Users</h3>
                    <p className="text-sm text-muted-foreground mt-1">Students ranked by course completions and quiz scores</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onNavigate('admin-users')}>
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
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
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Time Spent <span className="text-xs font-normal">(est.)</span>
                          </th>
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
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Users className="w-12 h-12 text-muted-foreground/30 mb-3" aria-hidden="true" />
                    <p className="text-muted-foreground font-medium">No users with completed courses</p>
                    <p className="text-sm text-muted-foreground/70">Try selecting a different date range</p>
                  </div>
                )}
              </Card>
            </>
          )}

          {/* COURSE ANALYTICS VIEW */}
          {reportType === "course" && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Course Analytics Report</h2>
                <p className="text-sm text-muted-foreground">Performance breakdown by course and topic area</p>
              </div>

              {/* Course Performance Charts */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Skill Proficiency */}
                <Card className="p-6" role="region" aria-labelledby="skill-proficiency-title-2" tabIndex={0}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 id="skill-proficiency-title-2" className="font-semibold">Skill Proficiency by Course</h3>
                    <Badge variant="outline">Bar Chart</Badge>
                  </div>
                  {skillProficiency.length > 0 ? (
                    <div role="img" aria-label={`Skill proficiency chart showing quiz scores for ${skillProficiency.length} courses`}>
                      <ResponsiveContainer width="100%" height={300} >
                        <BarChart data={skillProficiency} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="skill" type="category" width={150} />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="proficiency"
                            fill="var(--chart-2)"
                            name="Avg Quiz Score %"
                            radius={[0, 8, 8, 0]}
                            animationDuration={800}
                            animationEasing="ease-out"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                      <span className="sr-only">
                        Bar chart showing skill proficiency across {skillProficiency.length} courses.
                      </span>
                    </div>
                  ) : (
                    <div className="h-[300px] flex flex-col items-center justify-center text-center sm:h-[220px]">
                      <BarChart3 className="w-12 h-12 text-muted-foreground/30 mb-3" aria-hidden="true" />
                      <p className="text-muted-foreground font-medium">No quiz data</p>
                      <p className="text-sm text-muted-foreground/70">Try selecting a different date range</p>
                    </div>
                  )}
                </Card>

                {/* Completion Rates */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Course Completion Status</h3>
                    <Badge variant="outline">Pie Chart</Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={completionData.length > 0 ? completionData : fallbackCompletionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(completionData.length > 0 ? completionData : fallbackCompletionData).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {(completionData.length > 0 ? completionData : fallbackCompletionData).map((item) => (
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
              </div>

              {/* Course Insights Card */}
              <Card className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold">Course Performance Insights</h3>
                  <p className="text-sm text-muted-foreground mt-1">Key findings from course analytics</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-success" />
                      <h4 className="font-medium">Highest Performing Course</h4>
                    </div>
                    {skillProficiency.length > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{skillProficiency[0].skill}</span> with an average score of <span className="font-semibold text-foreground">{skillProficiency[0].proficiency}%</span>
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">No course data available</p>
                    )}
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-primary" />
                      <h4 className="font-medium">Total Enrollments</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground text-2xl">{stats?.totalEnrollments || 0}</span> students enrolled across all courses
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* ENGAGEMENT METRICS VIEW */}
          {reportType === "engagement" && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Engagement Metrics Report</h2>
                <p className="text-sm text-muted-foreground">User activity, session data, and interaction patterns</p>
              </div>

              {/* Engagement Charts */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* User Engagement Over Time */}
                <Card className="p-6" role="region" aria-labelledby="engagement-title-2" tabIndex={0}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 id="engagement-title-2" className="font-semibold">User Engagement Trends</h3>
                    <Badge variant="outline">Mixed Chart</Badge>
                  </div>
                  {engagement.length > 0 ? (
                    <div role="img" aria-label={`Engagement metrics chart showing ${engagement.length} time periods`}>
                      <ResponsiveContainer width="100%" height={300} >
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
                            dataKey="timeEstimated"
                            stroke="var(--chart-3)"
                            strokeWidth={2}
                            name="Time (hours, est.)"
                            animationDuration={800}
                            animationEasing="ease-out"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="lessonCompletions"
                            stroke="var(--chart-5)"
                            strokeWidth={2}
                            name="Lesson Completions"
                            animationDuration={800}
                            animationEasing="ease-out"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                      <span className="sr-only">
                        Line chart showing engagement metrics over time.
                      </span>
                    </div>
                  ) : (
                    <div className="h-[300px] flex flex-col items-center justify-center text-center sm:h-[220px]">
                      <Activity className="w-12 h-12 text-muted-foreground/30 mb-3" aria-hidden="true" />
                      <p className="text-muted-foreground font-medium">No engagement data</p>
                      <p className="text-sm text-muted-foreground/70">Try selecting a different date range</p>
                    </div>
                  )}
                </Card>

                {/* Activity Breakdown */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Activity Breakdown</h3>
                    <Badge variant="outline">Stats</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total Lessons Completed</span>
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">{stats?.completedLessonProgress || 0}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Out of {stats?.totalLessons || 0} total lessons
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Quizzes Taken</span>
                        <TrendingUp className="w-4 h-4 text-success" />
                      </div>
                      <div className="text-2xl font-bold">{stats?.quizzesTaken || 0}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stats?.quizzesPassed || 0} passed ({stats?.avgQuizScore || 0}% avg score)
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Active Users</span>
                        <Users className="w-4 h-4 text-chart-3" />
                      </div>
                      <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Currently enrolled in courses
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Engagement Insights */}
              <Card className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold">Engagement Insights</h3>
                  <p className="text-sm text-muted-foreground mt-1">Platform usage patterns and trends</p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{stats?.avgCompletionRate || 0}%</div>
                    <p className="text-sm text-muted-foreground">Avg Completion Rate</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className="text-3xl font-bold text-success mb-1">{stats?.completedEnrollments || 0}</div>
                    <p className="text-sm text-muted-foreground">Courses Completed</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className="text-3xl font-bold text-chart-3 mb-1">{stats?.totalEnrollments || 0}</div>
                    <p className="text-sm text-muted-foreground">Total Enrollments</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </main>
      </div>

      {/* Custom Date Range Dialog */}
      <Dialog open={showCustomDateDialog} onOpenChange={setShowCustomDateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Custom Date Range</DialogTitle>
            <DialogDescription>
              Choose a start and end date for your custom analytics report.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                max={customEndDate || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                min={customStartDate}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelCustomDates}>
              Cancel
            </Button>
            <Button onClick={handleApplyCustomDates}>
              Apply Date Range
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
