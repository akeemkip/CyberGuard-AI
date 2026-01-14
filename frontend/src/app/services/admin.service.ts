import api from './api';

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  completedEnrollments: number;
  avgCompletionRate: number;
  avgQuizScore: number;
  quizzesTaken: number;
  quizzesPassed: number;
  totalLessons: number;
  completedLessonProgress: number;
}

export interface EnrollmentTrend {
  month: string;
  students: number;
}

export interface CompletionData {
  name: string;
  value: number;
  color: string;
}

export interface RecentActivity {
  id: number;
  user: string;
  action: string;
  course: string;
  lesson: string;
  time: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  enrollmentTrend: EnrollmentTrend[];
  completionData: CompletionData[];
  recentActivity: RecentActivity[];
}

export interface Enrollment {
  id: string;
  enrolledAt: string;
  completedAt: string | null;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  course: {
    id: string;
    title: string;
    difficulty: string;
  };
}

const adminService = {
  // Get admin dashboard stats
  async getDashboardStats(): Promise<AdminDashboardData> {
    const response = await api.get<AdminDashboardData>('/admin/stats');
    return response.data;
  },

  // Get all enrollments
  async getAllEnrollments(): Promise<Enrollment[]> {
    const response = await api.get<{ enrollments: Enrollment[] }>('/admin/enrollments');
    return response.data.enrollments;
  }
};

export default adminService;
