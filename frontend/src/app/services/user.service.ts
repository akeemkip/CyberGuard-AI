import api from './api';
import { User } from './auth.service';

export interface UserStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  totalLessons: number;
  completionRate: number;
  averageQuizScore: number;
  quizzesTaken: number;
  quizzesPassed: number;
}

export interface UserWithEnrollments extends User {
  enrollments: {
    id: string;
    enrolledAt: string;
    completedAt: string | null;
    course: {
      id: string;
      title: string;
      thumbnail: string | null;
    };
  }[];
}

const userService = {
  // Get all users (admin only)
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<{ users: User[] }>('/users');
    return response.data.users;
  },

  // Get user by ID
  async getUserById(id: string): Promise<UserWithEnrollments> {
    const response = await api.get<{ user: UserWithEnrollments }>(`/users/${id}`);
    return response.data.user;
  },

  // Get current user's stats
  async getMyStats(): Promise<UserStats> {
    const response = await api.get<{ stats: UserStats }>('/users/stats');
    return response.data.stats;
  },

  // Update user
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await api.put<{ user: User }>(`/users/${id}`, data);
    return response.data.user;
  },

  // Delete user (admin only)
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};

export default userService;
