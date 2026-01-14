import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// Validation schema for updating user
const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional()
});

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ users });
  } catch (error) {
    console.error('GetAllUsers error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Users can only view their own profile unless they're admin
    if (req.userRole !== 'ADMIN' && req.userId !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                thumbnail: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('GetUserById error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Users can only update their own profile unless they're admin
    if (req.userRole !== 'ADMIN' && req.userId !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const validatedData = updateUserSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('UpdateUser error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user (admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('DeleteUser error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get user stats (for dashboard)
export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Get enrollment count
    const enrollmentCount = await prisma.enrollment.count({
      where: { userId }
    });

    // Get completed courses
    const completedCourses = await prisma.enrollment.count({
      where: {
        userId,
        completedAt: { not: null }
      }
    });

    // Get completed lessons
    const completedLessons = await prisma.progress.count({
      where: {
        userId,
        completed: true
      }
    });

    // Get total lessons from enrolled courses
    const enrolledCourseIds = await prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true }
    });

    const totalLessons = await prisma.lesson.count({
      where: {
        courseId: { in: enrolledCourseIds.map(e => e.courseId) }
      }
    });

    // Get quiz stats
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { userId },
      select: { score: true, passed: true }
    });

    const avgScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length)
      : 0;

    const completionRate = totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

    res.json({
      stats: {
        coursesEnrolled: enrollmentCount,
        coursesCompleted: completedCourses,
        lessonsCompleted: completedLessons,
        totalLessons,
        completionRate,
        averageQuizScore: avgScore,
        quizzesTaken: quizAttempts.length,
        quizzesPassed: quizAttempts.filter(a => a.passed).length
      }
    });
  } catch (error) {
    console.error('GetUserStats error:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
};
