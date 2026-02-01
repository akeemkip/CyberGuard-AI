import api from './api';

export interface PlatformSettings {
  id: string;
  // General
  platformName: string;
  platformDescription: string;
  supportEmail: string;
  contactEmail: string;
  // Security
  requireEmailVerification: boolean;
  minPasswordLength: number;
  sessionTimeout: number;
  enableTwoFactor: boolean;
  maxLoginAttempts: number;
  // Course Settings
  autoEnrollNewUsers: boolean;
  defaultCourseVisibility: "public" | "private";
  defaultQuizPassingScore: number;
  enableCertificates: boolean;
  allowCourseReviews: boolean;
  // User Settings
  defaultUserRole: "STUDENT" | "ADMIN";
  allowSelfRegistration: boolean;
  requireProfileCompletion: boolean;
  enablePublicProfiles: boolean;
  // Email/Notifications
  enableEmailNotifications: boolean;
  enableEnrollmentEmails: boolean;
  enableCompletionEmails: boolean;
  enableWeeklyDigest: boolean;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  hasSmtpPassword?: boolean;
  // Appearance
  primaryColor: string;
  logoUrl: string;
  favicon: string;
  customCss: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsAuditLogEntry {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
  ipAddress: string | null;
  timestamp: string;
}

export interface SettingsAuditLogResponse {
  entries: SettingsAuditLogEntry[];
  total: number;
  limit: number;
  offset: number;
  fields: string[];
}

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

export interface PerformanceStudent {
  id: string;
  name: string;
  email: string;
  coursesCompleted: number;
  totalCourses: number;
  avgScore: number;
  passRate: number;
  performanceScore: number;
}

export interface PerformanceExtremes {
  safeZone: PerformanceStudent | null;
  highRisk: PerformanceStudent | null;
}

export interface AdminDashboardData {
  stats: AdminStats;
  enrollmentTrend: EnrollmentTrend[];
  completionData: CompletionData[];
  recentActivity: RecentActivity[];
  performanceExtremes: PerformanceExtremes;
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
    phishing: {
      totalAttempts: number;
      correctAttempts: number;
      accuracy: number;
      clickRate: number;
      reportRate: number;
      avgResponseTimeMs: number;
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
    scenario?: string;
    action?: string;
    isCorrect?: boolean;
    course?: string;
    score?: number;
    passed?: boolean;
    completedAt?: string;
    attemptedAt?: string;
  }>;
}

// ============================================
// QUIZ MANAGEMENT TYPES
// ============================================

export interface QuizWithStats {
  id: string;
  title: string;
  passingScore: number;
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  courseTitle: string;
  questionCount: number;
  totalAttempts: number;
  passRate: number;
  averageScore: number;
}

export interface QuizQuestion {
  id?: string; // undefined for new questions
  question: string; // HTML content
  options: string[];
  correctAnswer: number; // Index of correct option
  order: number;
}

export interface QuizAttempt {
  id: string;
  score: number;
  passed: boolean;
  attemptedAt: string;
  student: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface QuizFull {
  id: string;
  title: string;
  passingScore: number;
  lessonId: string;
  lesson: {
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
  questions: QuizQuestion[];
  stats: {
    totalAttempts: number;
    passRate: number;
    averageScore: number;
  };
  attempts: QuizAttempt[];
}

export interface CreateQuizRequest {
  lessonId: string;
  title: string;
  passingScore: number;
  questions: Omit<QuizQuestion, 'id'>[];
}

export interface UpdateQuizRequest {
  lessonId: string;
  title: string;
  passingScore: number;
  questions: Omit<QuizQuestion, 'id'>[];
}

// ============================================
// MODULE MANAGEMENT TYPES
// ============================================

export interface Module {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  courseId: string;
  lessonCount?: number;
  lessons?: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string | null;
  order: number;
  courseId: string;
  moduleId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateModuleRequest {
  title: string;
  description?: string;
  order: number;
}

export interface UpdateModuleRequest {
  title: string;
  description?: string;
  order: number;
}

export interface ReorderModulesRequest {
  moduleOrders: { id: string; order: number }[];
}

export interface AssignLessonToModuleRequest {
  moduleId: string | null;
  order: number;
}

// ============================================
// LAB MANAGEMENT TYPES
// ============================================

export type LabType =
  | 'CONTENT'
  | 'PHISHING_EMAIL'
  | 'SUSPICIOUS_LINKS'
  | 'PASSWORD_STRENGTH'
  | 'SOCIAL_ENGINEERING'
  | 'SECURITY_ALERTS'
  | 'WIFI_SAFETY'
  | 'INCIDENT_RESPONSE';

// Phishing Email Simulation Config
export interface PhishingEmailConfig {
  emailInterface: 'gmail' | 'outlook' | 'generic';
  emails: Array<{
    id: string;
    from: { name: string; email: string };
    subject: string;
    body: string;
    isPhishing: boolean;
    redFlags: string[];
    attachments?: string[];
  }>;
  instructions: string;
  feedbackCorrect: string;
  feedbackIncorrect: string;
}

// Suspicious Links Simulation Config
export interface SuspiciousLinksConfig {
  links: Array<{
    displayText: string;
    actualUrl: string;
    isMalicious: boolean;
    explanation: string;
  }>;
  scenario: string;
  instructions: string;
}

// Password Strength Simulation Config
export interface PasswordStrengthConfig {
  scenario: string;
  requirements: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecial: boolean;
  };
  bannedPasswords: string[];
  hints: string[];
}

// Social Engineering Simulation Config
export interface SocialEngineeringConfig {
  scenario: string;
  context: string; // e.g., "You receive a phone call from someone claiming to be IT support"
  attackerName: string;
  attackerRole: string; // e.g., "IT Support", "Bank Representative", "CEO"
  messages: Array<{
    id: string;
    attackerMessage: string;
    tacticUsed: string; // e.g., "Authority", "Urgency", "Fear", "Trust"
    tacticExplanation: string;
    responses: Array<{
      text: string;
      isCorrect: boolean;
      feedback: string;
    }>;
  }>;
  instructions: string;
}

// Incident Response Simulation Config
export interface IncidentResponseConfig {
  scenario: string;
  steps: Array<{
    id: string;
    situation: string;
    options: Array<{
      text: string;
      isCorrect: boolean;
      feedback: string;
      nextStep?: string;
    }>;
  }>;
}

// Union type for all simulation configs
export type SimulationConfig =
  | PhishingEmailConfig
  | SuspiciousLinksConfig
  | PasswordStrengthConfig
  | SocialEngineeringConfig
  | IncidentResponseConfig
  | Record<string, unknown>;

export interface LabWithStats {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: number | null;
  order: number;
  courseId: string;
  courseTitle: string;
  moduleId: string | null;
  moduleTitle: string | null;
  isPublished: boolean;
  labType: LabType;
  passingScore: number;
  totalAttempts: number;
  completionRate: number;
  avgTimeSpent: number;
  passRate: number | null;
  avgScore: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface LabFull {
  id: string;
  title: string;
  description: string;
  instructions: string | null;
  scenario: string | null;
  objectives: string[];
  resources: string | null;
  hints: string | null;
  difficulty: string;
  estimatedTime: number | null;
  order: number;
  courseId: string;
  moduleId: string | null;
  isPublished: boolean;
  labType: LabType;
  simulationConfig: SimulationConfig | null;
  passingScore: number;
  course: {
    id: string;
    title: string;
  };
  module: {
    id: string;
    title: string;
  } | null;
  stats: {
    totalAttempts: number;
    completionRate: number;
    avgTimeSpent: number;
    passRate: number | null;
    avgScore: number | null;
  };
}

export interface CreateLabRequest {
  title: string;
  description: string;
  difficulty: string;
  estimatedTime?: number;
  order: number;
  courseId: string;
  moduleId?: string;
  isPublished?: boolean;
  labType: LabType;
  simulationConfig?: SimulationConfig;
  passingScore?: number;
  // Legacy fields for CONTENT type
  instructions?: string;
  scenario?: string;
  objectives?: string[];
  resources?: string;
  hints?: string;
}

export interface UpdateLabRequest {
  title: string;
  description: string;
  difficulty: string;
  estimatedTime?: number;
  order: number;
  courseId: string;
  moduleId?: string;
  isPublished?: boolean;
  labType: LabType;
  simulationConfig?: SimulationConfig;
  passingScore?: number;
  // Legacy fields for CONTENT type
  instructions?: string;
  scenario?: string;
  objectives?: string[];
  resources?: string;
  hints?: string;
}

export interface ReorderLabsRequest {
  labOrders: { id: string; order: number }[];
}

// ============================================
// ANALYTICS INTERFACES
// ============================================

export interface UserProgressionPoint {
  date: string;
  users: number;
  completion: number;
}

export interface SkillProficiencyData {
  skill: string;
  proficiency: number;
  passRate: number;
  sampleSize: number;
}

export interface EngagementData {
  month: string;
  timeEstimated: number;
  lessonCompletions: number;
  isEstimated: boolean;
}

export interface RetentionData {
  week: string;
  retention: number | null;
  avgScore: number | null;
  passRate: number | null;
  sampleSize: number;
}

export interface TopUser {
  id: string;
  name: string;
  coursesCompleted: number;
  avgScore: string;
  timeSpent: string;
  timeSpentEstimated: boolean;
  lastActive: string;
}

export interface LabAnalyticsData {
  labType: string;
  attempts: number;
  avgScore: number;
  completionRate: number;
}

export interface AnalyticsResponse {
  dateRange: string;
  reportType: string;
  userProgression: UserProgressionPoint[];
  skillProficiency: SkillProficiencyData[];
  engagement: EngagementData[];
  retention: RetentionData[];
  topUsers: TopUser[];
  labAnalytics: LabAnalyticsData[];
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
  },

  // ============================================
  // COURSE MANAGEMENT METHODS
  // ============================================

  // Get all courses (including unpublished)
  async getAllCourses(): Promise<any[]> {
    const response = await api.get<{ courses: any[] }>('/admin/courses');
    return response.data.courses;
  },

  // Get course by ID
  async getCourseById(courseId: string): Promise<any> {
    const response = await api.get(`/admin/courses/${courseId}`);
    return response.data;
  },

  // Create new course
  async createCourse(data: any): Promise<{ message: string; course: any }> {
    const response = await api.post<{ message: string; course: any }>('/admin/courses', data);
    return response.data;
  },

  // Update course
  async updateCourse(courseId: string, data: any): Promise<{ message: string; course: any }> {
    const response = await api.put<{ message: string; course: any }>(`/admin/courses/${courseId}`, data);
    return response.data;
  },

  // Delete course
  async deleteCourse(courseId: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/admin/courses/${courseId}`);
    return response.data;
  },

  // ============================================
  // QUIZ MANAGEMENT METHODS
  // ============================================

  // Get all quizzes with statistics
  async getAllQuizzes(): Promise<QuizWithStats[]> {
    const response = await api.get<{ quizzes: QuizWithStats[] }>('/admin/quizzes');
    return response.data.quizzes;
  },

  // Get quiz by ID with full details
  async getQuizById(quizId: string): Promise<QuizFull> {
    const response = await api.get<QuizFull>(`/admin/quizzes/${quizId}`);
    return response.data;
  },

  // Create new quiz
  async createQuiz(data: CreateQuizRequest): Promise<{ message: string; quiz: any }> {
    const response = await api.post<{ message: string; quiz: any }>('/admin/quizzes', data);
    return response.data;
  },

  // Update quiz
  async updateQuiz(quizId: string, data: UpdateQuizRequest): Promise<{ message: string; quiz: any }> {
    const response = await api.put<{ message: string; quiz: any }>(`/admin/quizzes/${quizId}`, data);
    return response.data;
  },

  // Delete quiz
  async deleteQuiz(quizId: string): Promise<{ message: string; deletedAttempts: number }> {
    const response = await api.delete<{ message: string; deletedAttempts: number }>(`/admin/quizzes/${quizId}`);
    return response.data;
  },

  // ============================================
  // MODULE MANAGEMENT METHODS
  // ============================================

  // Get all modules for a course with lesson count
  async getCourseModules(courseId: string): Promise<Module[]> {
    const response = await api.get<{ modules: Module[] }>(`/admin/courses/${courseId}/modules`);
    return response.data.modules;
  },

  // Create new module
  async createModule(courseId: string, data: CreateModuleRequest): Promise<{ message: string; module: Module }> {
    const response = await api.post<{ message: string; module: Module }>(`/admin/courses/${courseId}/modules`, data);
    return response.data;
  },

  // Update module
  async updateModule(courseId: string, moduleId: string, data: UpdateModuleRequest): Promise<{ message: string; module: Module }> {
    const response = await api.put<{ message: string; module: Module }>(`/admin/courses/${courseId}/modules/${moduleId}`, data);
    return response.data;
  },

  // Delete module
  async deleteModule(courseId: string, moduleId: string): Promise<{ message: string; affectedLessons: number }> {
    const response = await api.delete<{ message: string; affectedLessons: number }>(`/admin/courses/${courseId}/modules/${moduleId}`);
    return response.data;
  },

  // Reorder modules
  async reorderModules(courseId: string, data: ReorderModulesRequest): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/admin/courses/${courseId}/modules/reorder`, data);
    return response.data;
  },

  // Assign lesson to module (or remove from module)
  async assignLessonToModule(courseId: string, moduleId: string, lessonId: string, data: AssignLessonToModuleRequest): Promise<{ message: string; lesson: Lesson }> {
    const response = await api.put<{ message: string; lesson: Lesson }>(`/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, data);
    return response.data;
  },

  // ============================================
  // LAB MANAGEMENT METHODS
  // ============================================

  // Get all labs with statistics
  async getAllLabs(): Promise<LabWithStats[]> {
    const response = await api.get<{ labs: LabWithStats[] }>('/admin/labs');
    return response.data.labs;
  },

  // Get lab by ID with full details
  async getLabById(labId: string): Promise<LabFull> {
    const response = await api.get<LabFull>(`/admin/labs/${labId}`);
    return response.data;
  },

  // Create new lab
  async createLab(data: CreateLabRequest): Promise<{ message: string; lab: any }> {
    const response = await api.post<{ message: string; lab: any }>('/admin/labs', data);
    return response.data;
  },

  // Update lab
  async updateLab(labId: string, data: UpdateLabRequest): Promise<{ message: string; lab: any }> {
    const response = await api.put<{ message: string; lab: any }>(`/admin/labs/${labId}`, data);
    return response.data;
  },

  // Delete lab
  async deleteLab(labId: string): Promise<{ message: string; deletedProgress: number }> {
    const response = await api.delete<{ message: string; deletedProgress: number }>(`/admin/labs/${labId}`);
    return response.data;
  },

  // Reorder labs
  async reorderLabs(data: ReorderLabsRequest): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>('/admin/labs/reorder', data);
    return response.data;
  },

  // ============================================
  // ANALYTICS METHODS
  // ============================================

  // Get comprehensive analytics data
  async getAnalytics(
    dateRange: string = '30days',
    reportType: string = 'overview',
    customStartDate?: string,
    customEndDate?: string
  ): Promise<AnalyticsResponse> {
    const params: any = { dateRange, reportType };

    // Add custom date parameters if provided
    if (dateRange === 'custom' && customStartDate && customEndDate) {
      params.startDate = customStartDate;
      params.endDate = customEndDate;
    }

    const response = await api.get<AnalyticsResponse>('/admin/analytics', { params });
    return response.data;
  },

  // Platform Settings
  async getPlatformSettings(): Promise<PlatformSettings> {
    const response = await api.get<{ settings: PlatformSettings }>('/admin/settings');
    return response.data.settings;
  },

  async updatePlatformSettings(settings: Partial<PlatformSettings>): Promise<PlatformSettings> {
    const response = await api.put<{ settings: PlatformSettings }>('/admin/settings', settings);
    return response.data.settings;
  },

  // Settings Audit Log
  async getSettingsAuditLog(
    limit: number = 50,
    offset: number = 0,
    field?: string
  ): Promise<SettingsAuditLogResponse> {
    const params: Record<string, string | number> = { limit, offset };
    if (field) params.field = field;
    const response = await api.get<SettingsAuditLogResponse>('/admin/settings/audit-log', { params });
    return response.data;
  },

  // Test Email
  async sendTestEmail(email: string): Promise<{ success: boolean; message: string; details?: string }> {
    const response = await api.post<{ success: boolean; message: string; details?: string }>(
      '/admin/settings/test-email',
      { email }
    );
    return response.data;
  },

  // Rollback Settings Change
  async rollbackSettingsChange(auditLogId: string): Promise<{ message: string; fieldName: string; rolledBackTo: string }> {
    const response = await api.post<{ message: string; fieldName: string; rolledBackTo: string }>(
      `/admin/settings/rollback/${auditLogId}`
    );
    return response.data;
  },

  // Export Audit Log to CSV
  async exportAuditLogCSV(field?: string, startDate?: string, endDate?: string): Promise<Blob> {
    const params: Record<string, string> = {};
    if (field) params.field = field;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get('/admin/settings/audit-log/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  // Get assessment comparison report
  async getAssessmentComparison(): Promise<any> {
    const response = await api.get('/admin/analytics/assessment-comparison');
    return response.data;
  }
};

export default adminService;
