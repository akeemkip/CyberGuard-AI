import api from './api';

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  order: number;
  courseId: string;
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
  }
};

export default courseService;
