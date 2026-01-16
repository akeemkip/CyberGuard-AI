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

export interface UserStatistics {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    createdAt: string;
    lastLoginAt: string | null;
    daysSinceJoined: number;
  };
  academic: {
    enrollments: {
      total: number;
      completed: number;
      inProgress: number;
    };
    lessons: {
      completed: number;
    };
    quizzes: {
      total: number;
      passed: number;
      averageScore: number;
      passRate: number;
    };
    certificates: {
      total: number;
      list: Array<{
        id: string;
        courseName: string;
        issuedAt: string;
      }>;
    };
  };
  courses: Array<{
    courseId: string;
    courseName: string;
    enrolledAt: string;
    completedAt: string | null;
    isCompleted: boolean;
  }>;
  recentActivity: Array<{
    type: string;
    lesson?: string;
    quiz?: string;
    course: string;
    score?: number;
    passed?: boolean;
    completedAt?: string;
    attemptedAt?: string;
  }>;
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
  },

  // Get detailed user statistics
  async getUserStatistics(userId: string): Promise<UserStatistics> {
    const response = await api.get<UserStatistics>(`/admin/users/${userId}/statistics`);
    return response.data;
  }
};

export default adminService;
