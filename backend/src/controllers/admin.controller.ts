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
    const userId = req.params.userId as string;

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
      include: {
        lesson: {
          include: {
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
      include: {
        quiz: {
          include: {
            lesson: {
              include: {
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
      include: {
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

// ============================================
// QUIZ MANAGEMENT
// ============================================

// Get all quizzes with statistics
export const getAllQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        lesson: {
          include: {
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        questions: {
          select: {
            id: true
          }
        },
        attempts: {
          select: {
            score: true,
            passed: true
          }
        }
      },
      orderBy: { lesson: { title: 'asc' } }
    });

    // Format with statistics
    const quizzesWithStats = quizzes.map(quiz => {
      const totalAttempts = quiz.attempts.length;
      const passedAttempts = quiz.attempts.filter(a => a.passed).length;
      const passRate = totalAttempts > 0
        ? Math.round((passedAttempts / totalAttempts) * 100)
        : 0;
      const averageScore = totalAttempts > 0
        ? Math.round(quiz.attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
        : 0;

      return {
        id: quiz.id,
        title: quiz.title,
        passingScore: quiz.passingScore,
        lessonId: quiz.lessonId,
        lessonTitle: quiz.lesson.title,
        courseId: quiz.lesson.course.id,
        courseTitle: quiz.lesson.course.title,
        questionCount: quiz.questions.length,
        totalAttempts,
        passRate,
        averageScore
      };
    });

    res.json({ quizzes: quizzesWithStats });
  } catch (error) {
    console.error('GetAllQuizzes error:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
};

// Get quiz by ID with full details
export const getQuizById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        questions: {
          orderBy: { order: 'asc' }
        },
        attempts: {
          select: {
            score: true,
            passed: true
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate statistics
    const totalAttempts = quiz.attempts.length;
    const passedAttempts = quiz.attempts.filter(a => a.passed).length;
    const passRate = totalAttempts > 0
      ? Math.round((passedAttempts / totalAttempts) * 100)
      : 0;
    const averageScore = totalAttempts > 0
      ? Math.round(quiz.attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
      : 0;

    res.json({
      id: quiz.id,
      title: quiz.title,
      passingScore: quiz.passingScore,
      lessonId: quiz.lessonId,
      lesson: {
        title: quiz.lesson.title,
        course: {
          id: quiz.lesson.course.id,
          title: quiz.lesson.course.title
        }
      },
      questions: quiz.questions,
      stats: {
        totalAttempts,
        passRate,
        averageScore
      }
    });
  } catch (error) {
    console.error('GetQuizById error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
};

// Create new quiz
export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { lessonId, title, passingScore, questions } = req.body;

    // Validation
    if (!lessonId || !title || !passingScore || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (questions.length < 2) {
      return res.status(400).json({ error: 'Quiz must have at least 2 questions' });
    }

    if (passingScore < 1 || passingScore > 100) {
      return res.status(400).json({ error: 'Passing score must be between 1 and 100' });
    }

    // Validate each question
    for (const question of questions) {
      if (!question.question || !question.options || question.correctAnswer === undefined) {
        return res.status(400).json({ error: 'Each question must have text, options, and correct answer' });
      }
      if (question.options.length < 2 || question.options.length > 6) {
        return res.status(400).json({ error: 'Each question must have 2-6 options' });
      }
      if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
        return res.status(400).json({ error: 'Invalid correct answer index' });
      }
    }

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      return res.status(400).json({ error: 'Lesson does not exist' });
    }

    // Check if lesson already has a quiz
    const existingQuiz = await prisma.quiz.findUnique({
      where: { lessonId }
    });

    if (existingQuiz) {
      return res.status(409).json({ error: 'This lesson already has a quiz' });
    }

    // Create quiz with questions
    const quiz = await prisma.quiz.create({
      data: {
        lessonId,
        title,
        passingScore,
        questions: {
          create: questions.map((q: any, index: number) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            order: q.order !== undefined ? q.order : index
          }))
        }
      },
      include: {
        questions: true
      }
    });

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error('CreateQuiz error:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
};

// Update quiz
export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { lessonId, title, passingScore, questions } = req.body;

    // Validation
    if (!lessonId || !title || !passingScore || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (questions.length < 2) {
      return res.status(400).json({ error: 'Quiz must have at least 2 questions' });
    }

    if (passingScore < 1 || passingScore > 100) {
      return res.status(400).json({ error: 'Passing score must be between 1 and 100' });
    }

    // Validate each question
    for (const question of questions) {
      if (!question.question || !question.options || question.correctAnswer === undefined) {
        return res.status(400).json({ error: 'Each question must have text, options, and correct answer' });
      }
      if (question.options.length < 2 || question.options.length > 6) {
        return res.status(400).json({ error: 'Each question must have 2-6 options' });
      }
      if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
        return res.status(400).json({ error: 'Invalid correct answer index' });
      }
    }

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id }
    });

    if (!existingQuiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // If changing lesson, check if new lesson already has a quiz
    if (lessonId !== existingQuiz.lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId }
      });

      if (!lesson) {
        return res.status(400).json({ error: 'Lesson does not exist' });
      }

      const quizOnNewLesson = await prisma.quiz.findUnique({
        where: { lessonId }
      });

      if (quizOnNewLesson) {
        return res.status(409).json({ error: 'The selected lesson already has a quiz' });
      }
    }

    // Delete old questions and create new ones (simpler than updating)
    await prisma.question.deleteMany({
      where: { quizId: id }
    });

    // Update quiz and create new questions
    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: {
        lessonId,
        title,
        passingScore,
        questions: {
          create: questions.map((q: any, index: number) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            order: q.order !== undefined ? q.order : index
          }))
        }
      },
      include: {
        questions: true
      }
    });

    res.json({
      message: 'Quiz updated successfully',
      quiz: updatedQuiz
    });
  } catch (error) {
    console.error('UpdateQuiz error:', error);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
};

// Delete quiz
export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    // Check if quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        attempts: true
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Delete quiz (cascade will delete questions and attempts)
    await prisma.quiz.delete({
      where: { id }
    });

    res.json({
      message: 'Quiz deleted successfully',
      deletedAttempts: quiz.attempts.length
    });
  } catch (error) {
    console.error('DeleteQuiz error:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
};

// ============================================================
// MODULE MANAGEMENT ENDPOINTS
// ============================================================

// Get all modules for a course with lesson count
export const getCourseModules = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId as string;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get all modules for the course
    const modules = await prisma.module.findMany({
      where: { courseId },
      include: {
        _count: {
          select: { lessons: true }
        }
      },
      orderBy: { order: 'asc' }
    });

    // Format response
    const modulesWithCount = modules.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description,
      order: module.order,
      courseId: module.courseId,
      lessonCount: module._count.lessons,
      createdAt: module.createdAt,
      updatedAt: module.updatedAt
    }));

    res.json({ modules: modulesWithCount });
  } catch (error) {
    console.error('GetCourseModules error:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
};

// Create new module
export const createModule = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId as string;
    const { title, description, order } = req.body;

    // Validation
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Title must be at least 3 characters' });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({ error: 'Title must not exceed 200 characters' });
    }

    if (description && description.length > 500) {
      return res.status(400).json({ error: 'Description must not exceed 500 characters' });
    }

    if (order === undefined || order < 0) {
      return res.status(400).json({ error: 'Order must be a positive integer' });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Create module
    const module = await prisma.module.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        order,
        courseId
      }
    });

    res.status(201).json({
      message: 'Module created successfully',
      module
    });
  } catch (error) {
    console.error('CreateModule error:', error);
    res.status(500).json({ error: 'Failed to create module' });
  }
};

// Update module
export const updateModule = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId as string;
    const id = req.params.id as string;
    const { title, description, order } = req.body;

    // Validation
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Title must be at least 3 characters' });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({ error: 'Title must not exceed 200 characters' });
    }

    if (description && description.length > 500) {
      return res.status(400).json({ error: 'Description must not exceed 500 characters' });
    }

    if (order === undefined || order < 0) {
      return res.status(400).json({ error: 'Order must be a positive integer' });
    }

    // Check if module exists and belongs to the course
    const existingModule = await prisma.module.findUnique({
      where: { id }
    });

    if (!existingModule) {
      return res.status(404).json({ error: 'Module not found' });
    }

    if (existingModule.courseId !== courseId) {
      return res.status(400).json({ error: 'Module does not belong to this course' });
    }

    // Update module
    const module = await prisma.module.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        order
      }
    });

    res.json({
      message: 'Module updated successfully',
      module
    });
  } catch (error) {
    console.error('UpdateModule error:', error);
    res.status(500).json({ error: 'Failed to update module' });
  }
};

// Delete module
export const deleteModule = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId as string;
    const id = req.params.id as string;

    // Check if module exists and belongs to the course
    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        lessons: true
      }
    });

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    if (module.courseId !== courseId) {
      return res.status(400).json({ error: 'Module does not belong to this course' });
    }

    // Delete module (cascade will set lessons' moduleId to NULL)
    await prisma.module.delete({
      where: { id }
    });

    res.json({
      message: 'Module deleted successfully',
      affectedLessons: module.lessons.length
    });
  } catch (error) {
    console.error('DeleteModule error:', error);
    res.status(500).json({ error: 'Failed to delete module' });
  }
};

// Reorder modules
export const reorderModules = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId as string;
    const { moduleOrders } = req.body;

    // Validation
    if (!Array.isArray(moduleOrders) || moduleOrders.length === 0) {
      return res.status(400).json({ error: 'Module orders must be a non-empty array' });
    }

    // Validate each module order entry
    for (const entry of moduleOrders) {
      if (!entry.id || typeof entry.order !== 'number') {
        return res.status(400).json({ error: 'Each entry must have id and order' });
      }
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Update all module orders in a transaction
    await prisma.$transaction(
      moduleOrders.map(({ id, order }) =>
        prisma.module.updateMany({
          where: { id, courseId }, // Ensure module belongs to this course
          data: { order }
        })
      )
    );

    res.json({ message: 'Modules reordered successfully' });
  } catch (error) {
    console.error('ReorderModules error:', error);
    res.status(500).json({ error: 'Failed to reorder modules' });
  }
};

// Assign lesson to module (or remove from module)
export const assignLessonToModule = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId as string;
    const moduleId = req.params.moduleId as string;
    const lessonId = req.params.lessonId as string;
    const { moduleId: newModuleId, order } = req.body;

    // Validation
    if (newModuleId !== null && typeof newModuleId !== 'string') {
      return res.status(400).json({ error: 'Invalid moduleId' });
    }

    if (order === undefined || order < 0) {
      return res.status(400).json({ error: 'Order must be a positive integer' });
    }

    // Check if lesson exists and belongs to the course
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    if (lesson.courseId !== courseId) {
      return res.status(400).json({ error: 'Lesson does not belong to this course' });
    }

    // If assigning to a module, verify module exists and belongs to course
    if (newModuleId) {
      const module = await prisma.module.findUnique({
        where: { id: newModuleId }
      });

      if (!module) {
        return res.status(404).json({ error: 'Module not found' });
      }

      if (module.courseId !== courseId) {
        return res.status(400).json({ error: 'Module does not belong to this course' });
      }
    }

    // Update lesson
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        moduleId: newModuleId,
        order
      }
    });

    res.json({
      message: newModuleId
        ? 'Lesson assigned to module successfully'
        : 'Lesson removed from module successfully',
      lesson: updatedLesson
    });
  } catch (error) {
    console.error('AssignLessonToModule error:', error);
    res.status(500).json({ error: 'Failed to assign lesson to module' });
  }
};
