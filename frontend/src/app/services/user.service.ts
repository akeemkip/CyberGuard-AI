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

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'STUDENT' | 'ADMIN';
}

const userService = {
  // Create new user (admin only)
  async createUser(data: CreateUserData): Promise<User> {
    const response = await api.post<{ user: User }>('/users', data);
    return response.data.user;
  },

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

  // Change user role (admin only)
  async changeUserRole(id: string, role: 'STUDENT' | 'ADMIN'): Promise<User> {
    const response = await api.put<{ user: User }>(`/users/${id}/role`, { role });
    return response.data.user;
  },

  // Delete user (admin only)
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  // Unlock user account (admin only)
  async unlockUserAccount(id: string): Promise<{ message: string; user: { id: string; email: string } }> {
    const response = await api.put<{ message: string; user: { id: string; email: string } }>(`/users/${id}/unlock`);
    return response.data;
  }
};

export default userService;
