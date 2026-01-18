import api from './api';

export interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  courseId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  order: number;
  courseId: string;
  moduleId?: string | null;
  quiz?: {
    id: string;
    title: string;
    passingScore: number;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  difficulty: string;
  duration: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  lessons?: Lesson[];
  modules?: Module[];
  _count?: {
    lessons: number;
    enrollments: number;
  };
}

export interface EnrolledCourse {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt: string | null;
  course: Course;
  progress: {
    completedLessons: number;
    totalLessons: number;
    percentage: number;
  };
}

export interface CourseProgress {
  courseId: string;
  lessons: {
    id: string;
    title: string;
    order: number;
    completed: boolean;
  }[];
  summary: {
    completed: number;
    total: number;
    percentage: number;
  };
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  thumbnail?: string;
  difficulty?: string;
  duration?: string;
  isPublished?: boolean;
}

export interface CreateLessonRequest {
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
  lesson: {
    id: string;
    title: string;
    courseId: string;
  };
}

export interface QuizResult {
  questionId: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

export interface QuizSubmissionResponse {
  attempt: {
    id: string;
    score: number;
    passed: boolean;
  };
  results: QuizResult[];
  summary: {
    score: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
    passingScore: number;
  };
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  instructions: string;
  scenario: string | null;
  objectives: string[];
  resources: string | null;
  hints: string | null;
  difficulty: string;
  estimatedTime: number | null;
  courseId: string;
  courseTitle?: string;
  moduleId: string | null;
  moduleTitle?: string | null;
  isPublished?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LabProgress {
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  timeSpent: number;
  notes: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

export interface LabWithProgress extends Omit<Lab, 'instructions' | 'scenario' | 'objectives' | 'resources' | 'hints'> {
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  timeSpent: number;
  completedAt: string | null;
}

export interface LabDetails {
  lab: Lab;
  progress: LabProgress | null;
}

const courseService = {
  // Get all courses
  async getAllCourses(publishedOnly: boolean = false): Promise<Course[]> {
    const response = await api.get<{ courses: Course[] }>('/courses', {
      params: publishedOnly ? { published: 'true' } : undefined
    });
    return response.data.courses;
  },

  // Get course by ID with lessons
  async getCourseById(id: string): Promise<Course> {
    const response = await api.get<{ course: Course }>(`/courses/${id}`);
    return response.data.course;
  },

  // Create course (admin only)
  async createCourse(data: CreateCourseRequest): Promise<Course> {
    const response = await api.post<{ course: Course }>('/courses', data);
    return response.data.course;
  },

  // Update course (admin only)
  async updateCourse(id: string, data: Partial<CreateCourseRequest>): Promise<Course> {
    const response = await api.put<{ course: Course }>(`/courses/${id}`, data);
    return response.data.course;
  },

  // Delete course (admin only)
  async deleteCourse(id: string): Promise<void> {
    await api.delete(`/courses/${id}`);
  },

  // Enroll in course
  async enrollInCourse(courseId: string): Promise<void> {
    await api.post(`/courses/${courseId}/enroll`);
  },

  // Get enrolled courses for current user
  async getEnrolledCourses(): Promise<EnrolledCourse[]> {
    const response = await api.get<{ enrolledCourses: EnrolledCourse[] }>('/courses/enrolled/my-courses');
    return response.data.enrolledCourses;
  },

  // Get progress for a specific course
  async getCourseProgress(courseId: string): Promise<CourseProgress> {
    const response = await api.get<CourseProgress>(`/courses/${courseId}/progress`);
    return response.data;
  },

  // Mark lesson as complete
  async markLessonComplete(lessonId: string): Promise<{ courseComplete: boolean }> {
    const response = await api.post<{ courseComplete: boolean }>(`/courses/lessons/${lessonId}/complete`);
    return response.data;
  },

  // Get quiz with questions
  async getQuiz(quizId: string): Promise<Quiz> {
    const response = await api.get<{ quiz: Quiz }>(`/courses/quiz/${quizId}`);
    return response.data.quiz;
  },

  // Submit quiz attempt
  async submitQuizAttempt(quizId: string, answers: { [questionId: string]: number }): Promise<QuizSubmissionResponse> {
    const response = await api.post<QuizSubmissionResponse>(`/courses/quiz/${quizId}/submit`, { answers });
    return response.data;
  },

  // Get lesson by ID (admin only)
  async getLessonById(lessonId: string): Promise<Lesson> {
    const response = await api.get<{ lesson: Lesson }>(`/courses/lessons/${lessonId}`);
    return response.data.lesson;
  },

  // Create lesson (admin only)
  async createLesson(courseId: string, data: CreateLessonRequest): Promise<Lesson> {
    const response = await api.post<{ lesson: Lesson }>(`/courses/${courseId}/lessons`, data);
    return response.data.lesson;
  },

  // Update lesson (admin only)
  async updateLesson(lessonId: string, data: Partial<CreateLessonRequest>): Promise<Lesson> {
    const response = await api.put<{ lesson: Lesson }>(`/courses/lessons/${lessonId}`, data);
    return response.data.lesson;
  },

  // Delete lesson (admin only)
  async deleteLesson(lessonId: string): Promise<void> {
    await api.delete(`/courses/lessons/${lessonId}`);
  },

  // ==================== LAB METHODS ====================

  // Get published labs for a course with user progress
  async getCourseLabs(courseId: string): Promise<LabWithProgress[]> {
    const response = await api.get<{ labs: LabWithProgress[] }>(`/courses/${courseId}/labs`);
    return response.data.labs;
  },

  // Get lab details for student
  async getLabForStudent(labId: string): Promise<LabDetails> {
    const response = await api.get<LabDetails>(`/labs/${labId}`);
    return response.data;
  },

  // Start lab (mark as in progress)
  async startLab(labId: string): Promise<{ status: string; startedAt: string }> {
    const response = await api.post<{ progress: { status: string; startedAt: string } }>(`/labs/${labId}/start`);
    return response.data.progress;
  },

  // Complete lab
  async completeLab(labId: string, timeSpent: number, notes?: string): Promise<{ status: string; timeSpent: number; completedAt: string }> {
    const response = await api.put<{ progress: { status: string; timeSpent: number; completedAt: string } }>(
      `/labs/${labId}/complete`,
      { timeSpent, notes }
    );
    return response.data.progress;
  },

  // Update lab notes
  async updateLabNotes(labId: string, notes: string, timeSpent?: number): Promise<{ notes: string | null; timeSpent: number }> {
    const response = await api.put<{ progress: { notes: string | null; timeSpent: number } }>(
      `/labs/${labId}/notes`,
      { notes, timeSpent }
    );
    return response.data.progress;
  }
};

export default courseService;
