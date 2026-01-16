import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// Get admin dashboard stats
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    // Get total users
    const totalUsers = await prisma.user.count();

    // Get users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    });

    // Get total courses and published courses
    const totalCourses = await prisma.course.count();
    const publishedCourses = await prisma.course.count({
      where: { isPublished: true }
    });

    // Get total enrollments
    const totalEnrollments = await prisma.enrollment.count();

    // Get completed enrollments
    const completedEnrollments = await prisma.enrollment.count({
      where: { completedAt: { not: null } }
    });

    // Get total lessons
    const totalLessons = await prisma.lesson.count();

    // Get completed lesson progress
    const completedLessonProgress = await prisma.progress.count({
      where: { completed: true }
    });

    // Get quiz stats
    const quizAttempts = await prisma.quizAttempt.findMany({
      select: { score: true, passed: true }
    });

    const avgQuizScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length)
      : 0;

    const quizzesPassed = quizAttempts.filter(a => a.passed).length;

    // Calculate average completion rate
    const avgCompletionRate = totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0;

    // Get recent enrollments (last 6 months for chart)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentEnrollments = await prisma.enrollment.findMany({
      where: {
        enrolledAt: { gte: sixMonthsAgo }
      },
      select: { enrolledAt: true }
    });

    // Group by month
    const monthlyEnrollments: { [key: string]: number } = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = months[date.getMonth()];
      monthlyEnrollments[monthKey] = 0;
    }

    recentEnrollments.forEach(e => {
      const monthKey = months[e.enrolledAt.getMonth()];
      if (monthlyEnrollments[monthKey] !== undefined) {
        monthlyEnrollments[monthKey]++;
      }
    });

    const enrollmentTrend = Object.entries(monthlyEnrollments).map(([month, count]) => ({
      month,
      students: count
    }));

    // Get course completion stats
    const inProgressEnrollments = totalEnrollments - completedEnrollments;

    // Get users with no enrollments (not started)
    const usersWithEnrollments = await prisma.enrollment.findMany({
      select: { userId: true },
      distinct: ['userId']
    });
    const usersNotStarted = totalUsers - usersWithEnrollments.length;

    const completionData = [
      { name: 'Completed', value: completedEnrollments, color: '#10b981' },
      { name: 'In Progress', value: inProgressEnrollments, color: '#f59e0b' },
      { name: 'Not Started', value: usersNotStarted > 0 ? usersNotStarted : 0, color: '#6b7280' }
    ];

    // Get recent activity
    const recentActivity = await prisma.progress.findMany({
      where: { completed: true },
      orderBy: { completedAt: 'desc' },
      take: 25, // Increased from 10 to show more activity in scrollable list
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        },
        lesson: {
          select: {
            title: true,
            course: {
              select: { title: true }
            }
          }
        }
      }
    });

    const formattedActivity = recentActivity.map((p, index) => {
      const userName = p.user.firstName && p.user.lastName
        ? `${p.user.firstName} ${p.user.lastName}`
        : p.user.email.split('@')[0];

      const timeAgo = getTimeAgo(p.completedAt!);

      return {
        id: index + 1,
        user: userName,
        action: 'Completed lesson',
        course: p.lesson.course.title,
        lesson: p.lesson.title,
        time: timeAgo
      };
    });

    res.json({
      stats: {
        totalUsers,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        completedEnrollments,
        avgCompletionRate,
        avgQuizScore,
        quizzesTaken: quizAttempts.length,
        quizzesPassed,
        totalLessons,
        completedLessonProgress
      },
      enrollmentTrend,
      completionData,
      recentActivity: formattedActivity
    });
  } catch (error) {
    console.error('GetAdminStats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
};

// Get all enrollments with user and course details (for admin)
export const getAllEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            difficulty: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    res.json({ enrollments });
  } catch (error) {
    console.error('GetAllEnrollments error:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
};

// Get detailed user statistics
export const getUserStatistics = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Get user basic info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get enrollments stats
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: { title: true }
        }
      }
    });

    const totalEnrollments = enrollments.length;
    const completedEnrollments = enrollments.filter(e => e.completedAt !== null).length;
    const inProgressEnrollments = totalEnrollments - completedEnrollments;

    // Get lesson progress stats
    const lessonProgress = await prisma.progress.findMany({
      where: { userId },
      select: {
        completed: true,
        completedAt: true,
        lesson: {
          select: {
            title: true,
            course: {
              select: { title: true }
            }
          }
        }
      }
    });

    const totalLessonsCompleted = lessonProgress.filter(p => p.completed).length;

    // Get quiz stats
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { userId },
      select: {
        score: true,
        passed: true,
        attemptedAt: true,
        quiz: {
          select: {
            title: true,
            lesson: {
              select: {
                title: true,
                course: {
                  select: { title: true }
                }
              }
            }
          }
        }
      },
      orderBy: { attemptedAt: 'desc' }
    });

    const totalQuizzes = quizAttempts.length;
    const passedQuizzes = quizAttempts.filter(a => a.passed).length;
    const averageQuizScore = totalQuizzes > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / totalQuizzes)
      : 0;

    // Get certificate stats
    const certificates = await prisma.certificate.findMany({
      where: { userId },
      select: {
        id: true,
        issuedAt: true,
        course: {
          select: { title: true }
        }
      }
    });

    // Calculate engagement metrics
    const daysSinceJoined = Math.floor(
      (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Get recent activity (last 10 completed lessons)
    const recentActivity = lessonProgress
      .filter(p => p.completed && p.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .slice(0, 10)
      .map(p => ({
        type: 'lesson_completed',
        lesson: p.lesson.title,
        course: p.lesson.course.title,
        completedAt: p.completedAt
      }));

    // Get most recent quiz attempts
    const recentQuizzes = quizAttempts.slice(0, 5).map(q => ({
      type: 'quiz_attempted',
      quiz: q.quiz.title,
      lesson: q.quiz.lesson.title,
      course: q.quiz.lesson.course.title,
      score: q.score,
      passed: q.passed,
      attemptedAt: q.attemptedAt
    }));

    // Combine and sort recent activity
    const allRecentActivity = [...recentActivity, ...recentQuizzes]
      .sort((a: any, b: any) => {
        const dateA = new Date(a.completedAt || a.attemptedAt).getTime();
        const dateB = new Date(b.completedAt || b.attemptedAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 15);

    // Course enrollment details
    const courseDetails = enrollments.map(e => ({
      courseId: e.courseId,
      courseName: e.course.title,
      enrolledAt: e.enrolledAt,
      completedAt: e.completedAt,
      isCompleted: e.completedAt !== null
    }));

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        daysSinceJoined
      },
      academic: {
        enrollments: {
          total: totalEnrollments,
          completed: completedEnrollments,
          inProgress: inProgressEnrollments
        },
        lessons: {
          completed: totalLessonsCompleted
        },
        quizzes: {
          total: totalQuizzes,
          passed: passedQuizzes,
          averageScore: averageQuizScore,
          passRate: totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0
        },
        certificates: {
          total: certificates.length,
          list: certificates.map(c => ({
            id: c.id,
            courseName: c.course.title,
            issuedAt: c.issuedAt
          }))
        }
      },
      courses: courseDetails,
      recentActivity: allRecentActivity
    });
  } catch (error) {
    console.error('GetUserStatistics error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
};

// Helper function to get time ago string
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}
