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

    // Group by month (using UTC for consistency across timezones)
    const monthlyEnrollments: { [key: string]: number } = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize last 6 months in UTC
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setUTCMonth(date.getUTCMonth() - i);
      const monthKey = months[date.getUTCMonth()];
      monthlyEnrollments[monthKey] = 0;
    }

    // Group enrollments by UTC month
    recentEnrollments.forEach(e => {
      const monthKey = months[e.enrolledAt.getUTCMonth()];
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

    // Calculate performance extremes (High Risk & Safe Zone students)
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        enrollments: {
          include: {
            course: true
          }
        },
        quizAttempts: {
          orderBy: {
            attemptedAt: 'desc'
          }
        },
        phishingAttempts: {
          select: {
            isCorrect: true
          }
        }
      }
    });

    const performanceScores = students.map(student => {
      // Get only latest attempt for each quiz
      const quizAttemptsByQuiz = student.quizAttempts.reduce((acc, qa) => {
        if (!acc[qa.quizId] || acc[qa.quizId].attemptedAt < qa.attemptedAt) {
          acc[qa.quizId] = qa;
        }
        return acc;
      }, {} as Record<string, typeof student.quizAttempts[0]>);

      const latestAttempts = Object.values(quizAttemptsByQuiz);
      const passed = latestAttempts.filter(qa => qa.passed).length;
      const totalQuizzes = latestAttempts.length;
      const avgScore = totalQuizzes > 0
        ? Math.round(latestAttempts.reduce((sum, qa) => sum + qa.score, 0) / totalQuizzes)
        : 0;
      const passRate = totalQuizzes > 0 ? Math.round((passed / totalQuizzes) * 100) : 0;

      const coursesCompleted = student.enrollments.filter(e => e.completedAt).length;
      const totalCourses = student.enrollments.length;

      // Calculate phishing simulation accuracy
      const phishingAttempts = student.phishingAttempts;
      const phishingCorrect = phishingAttempts.filter(pa => pa.isCorrect).length;
      const totalPhishing = phishingAttempts.length;
      const phishingAccuracy = totalPhishing > 0
        ? Math.round((phishingCorrect / totalPhishing) * 100)
        : 50; // Neutral score if no attempts yet

      // Updated performance score formula (includes phishing accuracy)
      // 30% Quiz pass rate + 25% Quiz avg score + 15% Course completion + 30% Phishing accuracy
      const performanceScore =
        (passRate * 0.30) +
        (avgScore * 0.25) +
        ((coursesCompleted / (totalCourses || 1)) * 15) +
        (phishingAccuracy * 0.30);

      return {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        coursesCompleted,
        totalCourses,
        avgScore,
        passRate,
        performanceScore
      };
    });

    // Sort by performance
    performanceScores.sort((a, b) => b.performanceScore - a.performanceScore);

    const safeZoneStudent = performanceScores[0] || null;
    const highRiskStudent = performanceScores[performanceScores.length - 1] || null;

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
      recentActivity: formattedActivity,
      performanceExtremes: {
        safeZone: safeZoneStudent,
        highRisk: highRiskStudent
      }
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

    // Get only latest attempt for each quiz (don't count retries in averages)
    const quizAttemptsByQuiz = quizAttempts.reduce((acc, qa) => {
      if (!acc[qa.quizId] || acc[qa.quizId].attemptedAt < qa.attemptedAt) {
        acc[qa.quizId] = qa;
      }
      return acc;
    }, {} as Record<string, typeof quizAttempts[0]>);

    const latestAttempts = Object.values(quizAttemptsByQuiz);
    const totalQuizzes = latestAttempts.length;
    const passedQuizzes = latestAttempts.filter(a => a.passed).length;
    const averageQuizScore = totalQuizzes > 0
      ? Math.round(latestAttempts.reduce((sum, a) => sum + a.score, 0) / totalQuizzes)
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

    // Get phishing simulation stats
    const phishingAttempts = await prisma.phishingAttempt.findMany({
      where: { userId },
      include: {
        scenario: {
          select: { title: true, isPhishing: true }
        }
      },
      orderBy: { attemptedAt: 'desc' }
    });

    const totalPhishingAttempts = phishingAttempts.length;
    const correctPhishingAttempts = phishingAttempts.filter(a => a.isCorrect).length;
    const phishingAccuracy = totalPhishingAttempts > 0
      ? Math.round((correctPhishingAttempts / totalPhishingAttempts) * 100)
      : 0;

    // Calculate click rate (how often they clicked on phishing links)
    const clickedLinks = phishingAttempts.filter(a => a.userAction === 'CLICKED_LINK').length;
    const phishingClickRate = totalPhishingAttempts > 0
      ? Math.round((clickedLinks / totalPhishingAttempts) * 100)
      : 0;

    // Calculate report rate (how often they correctly reported phishing)
    const reportedPhishing = phishingAttempts.filter(a => a.userAction === 'REPORTED' && a.scenario.isPhishing).length;
    const totalPhishingScenarios = phishingAttempts.filter(a => a.scenario.isPhishing).length;
    const phishingReportRate = totalPhishingScenarios > 0
      ? Math.round((reportedPhishing / totalPhishingScenarios) * 100)
      : 0;

    // Average response time
    const avgResponseTime = totalPhishingAttempts > 0
      ? Math.round(phishingAttempts.reduce((sum, a) => sum + a.responseTimeMs, 0) / totalPhishingAttempts)
      : 0;

    // Recent phishing attempts for activity
    const recentPhishingAttempts = phishingAttempts.slice(0, 5).map(a => ({
      type: 'phishing_attempt',
      scenario: a.scenario.title,
      action: a.userAction,
      isCorrect: a.isCorrect,
      attemptedAt: a.attemptedAt
    }));

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
    const allRecentActivity = [...recentActivity, ...recentQuizzes, ...recentPhishingAttempts]
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
        },
        phishing: {
          totalAttempts: totalPhishingAttempts,
          correctAttempts: correctPhishingAttempts,
          accuracy: phishingAccuracy,
          clickRate: phishingClickRate,
          reportRate: phishingReportRate,
          avgResponseTimeMs: avgResponseTime
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
// ANALYTICS & REPORTS
// ============================================

// Get comprehensive analytics data for Analytics & Reports page
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const {
      dateRange = '30days',
      reportType = 'overview',
      startDate: customStartDate,
      endDate: customEndDate
    } = req.query as {
      dateRange?: string;
      reportType?: string;
      startDate?: string;
      endDate?: string;
    };

    // Calculate date filter based on range
    const now = new Date();
    let startDate = new Date();
    let endDate = now;

    if (dateRange === 'custom' && customStartDate && customEndDate) {
      // Use custom date range
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);

      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      if (startDate > endDate) {
        return res.status(400).json({ error: 'Start date must be before end date' });
      }
    } else {
      // Use preset date range
      switch (dateRange) {
        case '7days':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(now.getDate() - 90);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }
    }

    // ============================================
    // 1. USER PROGRESSION DATA (Weekly enrollment and completion trends)
    // ============================================
    const enrollments = await prisma.enrollment.findMany({
      where: {
        enrolledAt: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        enrolledAt: true,
        completedAt: true
      }
    });

    // Group by week - track enrollments and completions separately
    const weeklyData: { [key: string]: { users: number; completion: number } } = {};
    const weeksToShow = dateRange === '7days' ? 1 : dateRange === '30days' ? 4 : 8;

    for (let i = weeksToShow - 1; i >= 0; i--) {
      const weekDate = new Date();
      weekDate.setDate(weekDate.getDate() - (i * 7));
      const weekKey = `Week ${weeksToShow - i}`;
      weeklyData[weekKey] = { users: 0, completion: 0 };
    }

    // Track enrollments by enrollment date
    enrollments.forEach(enrollment => {
      const enrollDate = new Date(enrollment.enrolledAt);
      const weeksDiff = Math.floor((now.getTime() - enrollDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
      if (weeksDiff < weeksToShow) {
        const weekKey = `Week ${weeksToShow - weeksDiff}`;
        if (weeklyData[weekKey]) {
          weeklyData[weekKey].users++;
        }
      }

      // Track completions by ACTUAL completion date (not enrollment date)
      if (enrollment.completedAt) {
        const completeDate = new Date(enrollment.completedAt);
        const completeWeeksDiff = Math.floor((now.getTime() - completeDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
        if (completeWeeksDiff < weeksToShow) {
          const completeWeekKey = `Week ${weeksToShow - completeWeeksDiff}`;
          if (weeklyData[completeWeekKey]) {
            weeklyData[completeWeekKey].completion++;
          }
        }
      }
    });

    const userProgression = Object.entries(weeklyData).map(([date, data]) => ({
      date,
      users: data.users,
      completion: data.completion
    }));

    // ============================================
    // 2. SKILL PROFICIENCY DATA (Average quiz scores by course/topic)
    // ============================================
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: {
        attemptedAt: {
          gte: startDate,
          lte: endDate
        }
      },
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
      }
    });

    // Group by course and calculate average with additional metrics
    const courseScores: { [key: string]: { scores: number[]; passed: number } } = {};
    quizAttempts.forEach(attempt => {
      const courseName = attempt.quiz.lesson.course.title;
      if (!courseScores[courseName]) {
        courseScores[courseName] = { scores: [], passed: 0 };
      }
      courseScores[courseName].scores.push(attempt.score);
      if (attempt.passed) {
        courseScores[courseName].passed++;
      }
    });

    const skillProficiency = Object.entries(courseScores).map(([skill, data]) => ({
      skill: skill.replace(/^\d+\.\s*/, ''), // Remove course number prefix
      proficiency: Math.round(data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length),
      passRate: Math.round((data.passed / data.scores.length) * 100),
      sampleSize: data.scores.length
    }));

    // ============================================
    // 3. ENGAGEMENT METRICS (Lesson completions and estimated time)
    // ============================================
    // Note: Time is estimated at 30 minutes per lesson completion
    // Future: Implement actual time tracking in Progress model
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsToShow = dateRange === '7days' ? 1 : dateRange === '30days' ? 1 : 6;

    const engagement = [];
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = months[date.getMonth()];

      // Count lesson completions for this month
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const lessonCompletions = await prisma.progress.count({
        where: {
          completed: true,
          completedAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      });

      engagement.push({
        month: monthName,
        timeEstimated: Math.round(lessonCompletions * 0.5), // Estimate: 30 mins per lesson
        lessonCompletions: lessonCompletions,
        isEstimated: true // Flag to indicate time is estimated
      });
    }

    // ============================================
    // 4. KNOWLEDGE RETENTION (Score trends over time)
    // ============================================
    // Measures how student performance changes over time
    // Shows average quiz scores grouped by time period
    const userQuizAttempts = await prisma.quizAttempt.findMany({
      where: {
        attemptedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        attemptedAt: 'asc'
      },
      select: {
        userId: true,
        quizId: true,
        score: true,
        passed: true,
        attemptedAt: true
      }
    });

    // Calculate retention by tracking score trends over time
    const retentionByWeek: { [key: string]: { totalScore: number; count: number; passed: number } } = {};
    for (let i = 0; i < 8; i++) {
      retentionByWeek[`Week ${i + 1}`] = { totalScore: 0, count: 0, passed: 0 };
    }

    // Track first attempt baseline and subsequent performance
    const userQuizBaseline = new Map<string, { score: number; date: Date }>();

    userQuizAttempts.forEach(attempt => {
      const key = `${attempt.userId}-${attempt.quizId}`;
      const baseline = userQuizBaseline.get(key);

      if (!baseline) {
        // First attempt - establish baseline
        userQuizBaseline.set(key, { score: attempt.score, date: attempt.attemptedAt });
        // Add to Week 1 (initial learning)
        retentionByWeek['Week 1'].totalScore += attempt.score;
        retentionByWeek['Week 1'].count++;
        if (attempt.passed) {
          retentionByWeek['Week 1'].passed++;
        }
      } else {
        // Subsequent attempts - measure retention
        const weeksSinceFirst = Math.floor(
          (attempt.attemptedAt.getTime() - baseline.date.getTime()) / (1000 * 60 * 60 * 24 * 7)
        );
        if (weeksSinceFirst > 0 && weeksSinceFirst < 8) {
          const weekKey = `Week ${weeksSinceFirst + 1}`;
          retentionByWeek[weekKey].totalScore += attempt.score;
          retentionByWeek[weekKey].count++;
          if (attempt.passed) {
            retentionByWeek[weekKey].passed++;
          }
        }
      }
    });

    const retention = Object.entries(retentionByWeek).map(([week, data]) => {
      if (data.count === 0) {
        return {
          week,
          retention: null, // No data instead of false 100%
          avgScore: null,
          passRate: null,
          sampleSize: 0
        };
      }

      const avgScore = Math.round(data.totalScore / data.count);
      const passRate = Math.round((data.passed / data.count) * 100);

      return {
        week,
        retention: avgScore, // Retention measured by average score
        avgScore,
        passRate,
        sampleSize: data.count
      };
    });

    // ============================================
    // 5. TOP PERFORMING USERS
    // ============================================
    const users = await prisma.user.findMany({
      where: {
        role: 'STUDENT'
      },
      include: {
        enrollments: {
          where: {
            completedAt: { not: null }
          }
        },
        quizAttempts: {
          where: {
            attemptedAt: {
              gte: startDate,
              lte: endDate
            }
          }
        },
        progress: {
          where: {
            completed: true,
            completedAt: { not: null }
          },
          orderBy: {
            completedAt: 'desc'
          },
          take: 1
        }
      }
    });

    const topUsers = users
      .map(user => {
        const avgScore = user.quizAttempts.length > 0
          ? Math.round(user.quizAttempts.reduce((sum, a) => sum + a.score, 0) / user.quizAttempts.length)
          : 0;

        const lastActive = user.progress[0]?.completedAt || user.createdAt;
        const timeAgo = getTimeAgo(lastActive);

        return {
          id: user.id,
          name: user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.email.split('@')[0],
          coursesCompleted: user.enrollments.length,
          avgScore: (avgScore / 10).toFixed(1), // Convert to 0-10 scale
          timeSpent: `${user.enrollments.length * 3}h`, // Estimate: 3h per course
          timeSpentEstimated: true, // Flag indicating time is estimated
          lastActive: timeAgo
        };
      })
      .sort((a, b) => b.coursesCompleted - a.coursesCompleted || parseFloat(b.avgScore) - parseFloat(a.avgScore))
      .slice(0, 10);

    // ============================================
    // 6. LAB ANALYTICS
    // ============================================
    const labProgress = await prisma.labProgress.findMany({
      where: {
        completedAt: { not: null },
        updatedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        lab: {
          select: {
            labType: true
          }
        }
      }
    });

    // Group by lab type
    const labTypeStats: { [key: string]: { attempts: number; totalScore: number; completed: number } } = {};

    labProgress.forEach(progress => {
      const labType = progress.lab.labType || 'CONTENT';
      if (!labTypeStats[labType]) {
        labTypeStats[labType] = { attempts: 0, totalScore: 0, completed: 0 };
      }
      labTypeStats[labType].attempts += progress.attempts || 1;
      labTypeStats[labType].totalScore += progress.score || 0;
      if (progress.status === 'COMPLETED') {
        labTypeStats[labType].completed++;
      }
    });

    const labAnalytics = Object.entries(labTypeStats).map(([labType, stats]) => ({
      labType: labType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      attempts: stats.attempts,
      avgScore: stats.totalScore > 0 ? Math.round(stats.totalScore / stats.attempts) : 0,
      completionRate: stats.attempts > 0 ? Math.round((stats.completed / stats.attempts) * 100) : 0
    }));

    // ============================================
    // RESPONSE
    // ============================================
    res.json({
      dateRange,
      reportType,
      userProgression,
      skillProficiency,
      engagement,
      retention,
      topUsers,
      labAnalytics
    });

  } catch (error) {
    console.error('GetAnalytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
};

// ============================================
// EXPORT ANALYTICS AS CSV
// ============================================
export const exportAnalyticsCSV = async (req: Request, res: Response) => {
  try {
    const {
      dateRange = '30days',
      reportType = 'overview',
      startDate: customStartDate,
      endDate: customEndDate
    } = req.query as {
      dateRange?: string;
      reportType?: string;
      startDate?: string;
      endDate?: string;
    };

    // Get the same analytics data
    const analyticsReq = { ...req, query: { dateRange, reportType, startDate: customStartDate, endDate: customEndDate } };
    const analyticsRes = {
      json: (data: any) => data,
      status: () => ({ json: (data: any) => data })
    };

    // Reuse getAnalytics logic to get data
    // For simplicity, we'll fetch fresh data
    const now = new Date();
    let startDate = new Date();
    let endDate = now;

    if (dateRange === 'custom' && customStartDate && customEndDate) {
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
    } else {
      switch (dateRange) {
        case '7days': startDate.setDate(now.getDate() - 7); break;
        case '30days': startDate.setDate(now.getDate() - 30); break;
        case '90days': startDate.setDate(now.getDate() - 90); break;
        case 'year': startDate.setFullYear(now.getFullYear() - 1); break;
        default: startDate.setDate(now.getDate() - 30);
      }
    }

    // Fetch top users for CSV
    const users = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        enrollments: { where: { completedAt: { not: null } } },
        quizAttempts: {
          where: {
            attemptedAt: { gte: startDate, lte: endDate }
          }
        }
      }
    });

    const topUsers = users
      .map(user => {
        const avgScore = user.quizAttempts.length > 0
          ? Math.round(user.quizAttempts.reduce((sum, a) => sum + a.score, 0) / user.quizAttempts.length)
          : 0;

        return {
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email.split('@')[0],
          coursesCompleted: user.enrollments.length,
          avgScore: (avgScore / 10).toFixed(1),
          quizAttempts: user.quizAttempts.length
        };
      })
      .sort((a, b) => b.coursesCompleted - a.coursesCompleted || parseFloat(b.avgScore) - parseFloat(a.avgScore));

    // Generate CSV content
    const csvRows = [];

    // Header
    csvRows.push('CyberGuard AI - Analytics Export');
    csvRows.push(`Report Type: ${reportType}`);
    csvRows.push(`Date Range: ${dateRange === 'custom' ? `${customStartDate} to ${customEndDate}` : dateRange}`);
    csvRows.push(`Generated: ${new Date().toISOString()}`);
    csvRows.push('');

    // Top Users Section
    csvRows.push('TOP PERFORMING USERS');
    csvRows.push('Rank,Name,Courses Completed,Average Score (/10),Quiz Attempts');
    topUsers.forEach((user, index) => {
      csvRows.push(`${index + 1},"${user.name}",${user.coursesCompleted},${user.avgScore},${user.quizAttempts}`);
    });

    const csv = csvRows.join('\n');

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="analytics-${dateRange}-${Date.now()}.csv"`);
    res.send(csv);

  } catch (error) {
    console.error('ExportAnalyticsCSV error:', error);
    res.status(500).json({ error: 'Failed to export analytics as CSV' });
  }
};

// ============================================
// EXPORT ANALYTICS AS PDF
// ============================================
export const exportAnalyticsPDF = async (req: Request, res: Response) => {
  try {
    const PDFDocument = require('pdfkit');

    const {
      dateRange = '30days',
      reportType = 'overview',
      startDate: customStartDate,
      endDate: customEndDate
    } = req.query as {
      dateRange?: string;
      reportType?: string;
      startDate?: string;
      endDate?: string;
    };

    // Calculate dates
    const now = new Date();
    let startDate = new Date();
    let endDate = now;

    if (dateRange === 'custom' && customStartDate && customEndDate) {
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
    } else {
      switch (dateRange) {
        case '7days': startDate.setDate(now.getDate() - 7); break;
        case '30days': startDate.setDate(now.getDate() - 30); break;
        case '90days': startDate.setDate(now.getDate() - 90); break;
        case 'year': startDate.setFullYear(now.getFullYear() - 1); break;
        default: startDate.setDate(now.getDate() - 30);
      }
    }

    // Fetch analytics data
    const [users, enrollments, quizAttempts] = await Promise.all([
      prisma.user.findMany({
        where: { role: 'STUDENT' },
        include: {
          enrollments: { where: { completedAt: { not: null } } },
          quizAttempts: {
            where: { attemptedAt: { gte: startDate, lte: endDate } }
          }
        }
      }),
      prisma.enrollment.count({
        where: {
          enrolledAt: { gte: startDate, lte: endDate }
        }
      }),
      prisma.quizAttempt.count({
        where: {
          attemptedAt: { gte: startDate, lte: endDate }
        }
      })
    ]);

    const topUsers = users
      .map(user => {
        const avgScore = user.quizAttempts.length > 0
          ? Math.round(user.quizAttempts.reduce((sum, a) => sum + a.score, 0) / user.quizAttempts.length)
          : 0;

        return {
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email.split('@')[0],
          coursesCompleted: user.enrollments.length,
          avgScore: (avgScore / 10).toFixed(1),
          quizAttempts: user.quizAttempts.length
        };
      })
      .sort((a, b) => b.coursesCompleted - a.coursesCompleted || parseFloat(b.avgScore) - parseFloat(a.avgScore))
      .slice(0, 10);

    // Create PDF document
    const doc = new PDFDocument({ margin: 50, size: 'LETTER' });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="analytics-report-${dateRange}-${Date.now()}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Title
    doc.fontSize(24).font('Helvetica-Bold').text('CyberGuard AI', { align: 'center' });
    doc.fontSize(18).text('Analytics Report', { align: 'center' });
    doc.moveDown(0.5);

    // Metadata
    doc.fontSize(10).font('Helvetica');
    const dateRangeLabel = dateRange === 'custom'
      ? `${customStartDate} to ${customEndDate}`
      : dateRange;
    doc.text(`Report Type: ${reportType}`, { align: 'center' });
    doc.text(`Date Range: ${dateRangeLabel}`, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(2);

    // Summary Statistics
    doc.fontSize(14).font('Helvetica-Bold').text('Summary Statistics');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');

    const summaryY = doc.y;
    doc.text(`Total Students: ${users.length}`, 50, summaryY);
    doc.text(`Total Enrollments: ${enrollments}`, 250, summaryY);
    doc.text(`Quiz Attempts: ${quizAttempts}`, 450, summaryY);
    doc.moveDown(2);

    // Top Performers Table
    doc.fontSize(14).font('Helvetica-Bold').text('Top Performing Students');
    doc.moveDown(0.5);

    // Table headers
    const tableTop = doc.y;
    const rowHeight = 25;

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Rank', 50, tableTop, { width: 50 });
    doc.text('Name', 100, tableTop, { width: 150 });
    doc.text('Courses', 250, tableTop, { width: 80 });
    doc.text('Avg Score', 330, tableTop, { width: 80 });
    doc.text('Attempts', 410, tableTop, { width: 80 });

    // Draw header line
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table rows
    doc.font('Helvetica');
    topUsers.forEach((user, index) => {
      const y = tableTop + rowHeight + (index * rowHeight);

      // Alternate row background
      if (index % 2 === 0) {
        doc.rect(50, y - 5, 500, rowHeight).fillAndStroke('#f3f4f6', '#e5e7eb');
      }

      doc.fillColor('#000000');
      doc.text(`${index + 1}`, 50, y, { width: 50 });
      doc.text(user.name, 100, y, { width: 150 });
      doc.text(user.coursesCompleted.toString(), 250, y, { width: 80 });
      doc.text(user.avgScore, 330, y, { width: 80 });
      doc.text(user.quizAttempts.toString(), 410, y, { width: 80 });
    });

    // Footer
    const pageHeight = doc.page.height;
    doc.fontSize(8).font('Helvetica').fillColor('#666666');
    doc.text(
      'Generated by CyberGuard AI - Cybersecurity Training Platform',
      50,
      pageHeight - 50,
      { align: 'center', width: 500 }
    );

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('ExportAnalyticsPDF error:', error);
    res.status(500).json({ error: 'Failed to export analytics as PDF' });
  }
};

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
            id: true,
            score: true,
            passed: true,
            attemptedAt: true,
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { attemptedAt: 'desc' }
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
      },
      attempts: quiz.attempts.map(attempt => ({
        id: attempt.id,
        score: attempt.score,
        passed: attempt.passed,
        attemptedAt: attempt.attemptedAt,
        student: {
          id: attempt.user.id,
          email: attempt.user.email,
          firstName: attempt.user.firstName,
          lastName: attempt.user.lastName
        }
      }))
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

// ============================================================
// LAB MANAGEMENT ENDPOINTS (ADMIN)
// ============================================================

// Get all labs with statistics
export const getAllLabs = async (req: Request, res: Response) => {
  try {
    const labs = await prisma.lab.findMany({
      include: {
        course: {
          select: { id: true, title: true }
        },
        module: {
          select: { id: true, title: true }
        },
        progress: {
          select: { status: true, timeSpent: true, score: true, passed: true }
        }
      },
      orderBy: [
        { courseId: 'asc' },
        { order: 'asc' }
      ]
    });

    // Format with statistics
    const labsWithStats = labs.map(lab => {
      const totalAttempts = lab.progress.length;
      const completedAttempts = lab.progress.filter(p => p.status === 'COMPLETED').length;
      const completionRate = totalAttempts > 0
        ? Math.round((completedAttempts / totalAttempts) * 100)
        : 0;
      const avgTimeSpent = totalAttempts > 0
        ? Math.round(lab.progress.reduce((sum, p) => sum + p.timeSpent, 0) / totalAttempts)
        : 0;

      // Calculate pass rate for interactive labs
      const scoredAttempts = lab.progress.filter(p => p.score !== null);
      const passedAttempts = lab.progress.filter(p => p.passed === true).length;
      const passRate = scoredAttempts.length > 0
        ? Math.round((passedAttempts / scoredAttempts.length) * 100)
        : null;
      const avgScore = scoredAttempts.length > 0
        ? Math.round(scoredAttempts.reduce((sum, p) => sum + (p.score || 0), 0) / scoredAttempts.length)
        : null;

      return {
        id: lab.id,
        title: lab.title,
        description: lab.description,
        difficulty: lab.difficulty,
        estimatedTime: lab.estimatedTime,
        order: lab.order,
        courseId: lab.courseId,
        courseTitle: lab.course.title,
        moduleId: lab.moduleId,
        moduleTitle: lab.module?.title || null,
        isPublished: lab.isPublished,
        labType: lab.labType,
        passingScore: lab.passingScore,
        totalAttempts,
        completionRate,
        avgTimeSpent,
        passRate,
        avgScore,
        createdAt: lab.createdAt,
        updatedAt: lab.updatedAt
      };
    });

    res.json({ labs: labsWithStats });
  } catch (error) {
    console.error('GetAllLabs error:', error);
    res.status(500).json({ error: 'Failed to fetch labs' });
  }
};

// Get lab by ID with full details
export const getLabById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const lab = await prisma.lab.findUnique({
      where: { id },
      include: {
        course: {
          select: { id: true, title: true }
        },
        module: {
          select: { id: true, title: true }
        },
        progress: {
          select: { status: true, timeSpent: true, score: true, passed: true }
        }
      }
    });

    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }

    // Calculate statistics
    const totalAttempts = lab.progress.length;
    const completedAttempts = lab.progress.filter(p => p.status === 'COMPLETED').length;
    const completionRate = totalAttempts > 0
      ? Math.round((completedAttempts / totalAttempts) * 100)
      : 0;
    const avgTimeSpent = totalAttempts > 0
      ? Math.round(lab.progress.reduce((sum, p) => sum + p.timeSpent, 0) / totalAttempts)
      : 0;

    // Calculate pass rate for interactive labs
    const scoredAttempts = lab.progress.filter(p => p.score !== null);
    const passedAttempts = lab.progress.filter(p => p.passed === true).length;
    const passRate = scoredAttempts.length > 0
      ? Math.round((passedAttempts / scoredAttempts.length) * 100)
      : null;
    const avgScore = scoredAttempts.length > 0
      ? Math.round(scoredAttempts.reduce((sum, p) => sum + (p.score || 0), 0) / scoredAttempts.length)
      : null;

    res.json({
      id: lab.id,
      title: lab.title,
      description: lab.description,
      instructions: lab.instructions,
      scenario: lab.scenario,
      objectives: lab.objectives,
      resources: lab.resources,
      hints: lab.hints,
      difficulty: lab.difficulty,
      estimatedTime: lab.estimatedTime,
      order: lab.order,
      courseId: lab.courseId,
      moduleId: lab.moduleId,
      isPublished: lab.isPublished,
      labType: lab.labType,
      simulationConfig: lab.simulationConfig,
      passingScore: lab.passingScore,
      course: {
        id: lab.course.id,
        title: lab.course.title
      },
      module: lab.module ? {
        id: lab.module.id,
        title: lab.module.title
      } : null,
      stats: {
        totalAttempts,
        completionRate,
        avgTimeSpent,
        passRate,
        avgScore
      }
    });
  } catch (error) {
    console.error('GetLabById error:', error);
    res.status(500).json({ error: 'Failed to fetch lab' });
  }
};

// Valid lab types
const VALID_LAB_TYPES = ['CONTENT', 'PHISHING_EMAIL', 'SUSPICIOUS_LINKS', 'PASSWORD_STRENGTH', 'SOCIAL_ENGINEERING', 'SECURITY_ALERTS', 'WIFI_SAFETY', 'INCIDENT_RESPONSE'];

// Create new lab
export const createLab = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      instructions,
      scenario,
      objectives,
      resources,
      hints,
      difficulty,
      estimatedTime,
      order,
      courseId,
      moduleId,
      isPublished,
      labType,
      simulationConfig,
      passingScore
    } = req.body;

    // Validation
    if (!title || title.trim().length < 3 || title.trim().length > 200) {
      return res.status(400).json({ error: 'Title must be 3-200 characters' });
    }

    if (!description || description.trim().length < 10 || description.trim().length > 500) {
      return res.status(400).json({ error: 'Description must be 10-500 characters' });
    }

    // Validate lab type
    const effectiveLabType = labType || 'CONTENT';
    if (!VALID_LAB_TYPES.includes(effectiveLabType)) {
      return res.status(400).json({ error: 'Invalid lab type' });
    }

    // For CONTENT labs, require instructions and objectives
    if (effectiveLabType === 'CONTENT') {
      if (!instructions || instructions.trim().length < 50) {
        return res.status(400).json({ error: 'Instructions must be at least 50 characters for content labs' });
      }

      if (!objectives || !Array.isArray(objectives) || objectives.length < 1) {
        return res.status(400).json({ error: 'At least 1 objective is required for content labs' });
      }

      for (const obj of objectives) {
        if (!obj || obj.length < 5 || obj.length > 200) {
          return res.status(400).json({ error: 'Each objective must be 5-200 characters' });
        }
      }
    }

    // For simulation labs, require simulationConfig
    if (effectiveLabType !== 'CONTENT') {
      if (!simulationConfig) {
        return res.status(400).json({ error: 'Simulation configuration is required for interactive labs' });
      }
    }

    if (scenario && scenario.length > 1000) {
      return res.status(400).json({ error: 'Scenario must not exceed 1000 characters' });
    }

    if (resources && resources.length > 1000) {
      return res.status(400).json({ error: 'Resources must not exceed 1000 characters' });
    }

    if (hints && hints.length > 500) {
      return res.status(400).json({ error: 'Hints must not exceed 500 characters' });
    }

    if (!['Beginner', 'Intermediate', 'Advanced'].includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    if (estimatedTime !== null && estimatedTime !== undefined) {
      if (estimatedTime < 1 || estimatedTime > 300) {
        return res.status(400).json({ error: 'Estimated time must be 1-300 minutes' });
      }
    }

    if (order === undefined || order < 0) {
      return res.status(400).json({ error: 'Order must be a positive integer' });
    }

    // Validate passing score
    const effectivePassingScore = passingScore !== undefined ? passingScore : 70;
    if (effectivePassingScore < 0 || effectivePassingScore > 100) {
      return res.status(400).json({ error: 'Passing score must be between 0 and 100' });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // If moduleId provided, verify it exists and belongs to course
    if (moduleId) {
      const module = await prisma.module.findUnique({
        where: { id: moduleId }
      });

      if (!module) {
        return res.status(404).json({ error: 'Module not found' });
      }

      if (module.courseId !== courseId) {
        return res.status(400).json({ error: 'Module does not belong to this course' });
      }
    }

    // Create lab
    const lab = await prisma.lab.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        instructions: instructions?.trim() || null,
        scenario: scenario?.trim() || null,
        objectives: objectives || [],
        resources: resources?.trim() || null,
        hints: hints?.trim() || null,
        difficulty,
        estimatedTime: estimatedTime || null,
        order,
        courseId,
        moduleId: moduleId || null,
        isPublished: isPublished || false,
        labType: effectiveLabType,
        simulationConfig: simulationConfig || null,
        passingScore: effectivePassingScore
      }
    });

    res.status(201).json({
      message: 'Lab created successfully',
      lab
    });
  } catch (error) {
    console.error('CreateLab error:', error);
    res.status(500).json({ error: 'Failed to create lab' });
  }
};

// Update lab
export const updateLab = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const {
      title,
      description,
      instructions,
      scenario,
      objectives,
      resources,
      hints,
      difficulty,
      estimatedTime,
      order,
      courseId,
      moduleId,
      isPublished,
      labType,
      simulationConfig,
      passingScore
    } = req.body;

    // Check if lab exists
    const existingLab = await prisma.lab.findUnique({
      where: { id }
    });

    if (!existingLab) {
      return res.status(404).json({ error: 'Lab not found' });
    }

    // Same validation as create
    if (!title || title.trim().length < 3 || title.trim().length > 200) {
      return res.status(400).json({ error: 'Title must be 3-200 characters' });
    }

    if (!description || description.trim().length < 10 || description.trim().length > 500) {
      return res.status(400).json({ error: 'Description must be 10-500 characters' });
    }

    // Validate lab type
    const effectiveLabType = labType || existingLab.labType || 'CONTENT';
    if (!VALID_LAB_TYPES.includes(effectiveLabType)) {
      return res.status(400).json({ error: 'Invalid lab type' });
    }

    // For CONTENT labs, require instructions and objectives
    if (effectiveLabType === 'CONTENT') {
      if (!instructions || instructions.trim().length < 50) {
        return res.status(400).json({ error: 'Instructions must be at least 50 characters for content labs' });
      }

      if (!objectives || !Array.isArray(objectives) || objectives.length < 1) {
        return res.status(400).json({ error: 'At least 1 objective is required for content labs' });
      }

      for (const obj of objectives) {
        if (!obj || obj.length < 5 || obj.length > 200) {
          return res.status(400).json({ error: 'Each objective must be 5-200 characters' });
        }
      }
    }

    // For simulation labs, require simulationConfig
    if (effectiveLabType !== 'CONTENT') {
      if (!simulationConfig) {
        return res.status(400).json({ error: 'Simulation configuration is required for interactive labs' });
      }
    }

    if (scenario && scenario.length > 1000) {
      return res.status(400).json({ error: 'Scenario must not exceed 1000 characters' });
    }

    if (resources && resources.length > 1000) {
      return res.status(400).json({ error: 'Resources must not exceed 1000 characters' });
    }

    if (hints && hints.length > 500) {
      return res.status(400).json({ error: 'Hints must not exceed 500 characters' });
    }

    if (!['Beginner', 'Intermediate', 'Advanced'].includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    if (estimatedTime !== null && estimatedTime !== undefined) {
      if (estimatedTime < 1 || estimatedTime > 300) {
        return res.status(400).json({ error: 'Estimated time must be 1-300 minutes' });
      }
    }

    if (order === undefined || order < 0) {
      return res.status(400).json({ error: 'Order must be a positive integer' });
    }

    // Validate passing score
    const effectivePassingScore = passingScore !== undefined ? passingScore : existingLab.passingScore;
    if (effectivePassingScore < 0 || effectivePassingScore > 100) {
      return res.status(400).json({ error: 'Passing score must be between 0 and 100' });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // If moduleId provided, verify it exists and belongs to course
    if (moduleId) {
      const module = await prisma.module.findUnique({
        where: { id: moduleId }
      });

      if (!module) {
        return res.status(404).json({ error: 'Module not found' });
      }

      if (module.courseId !== courseId) {
        return res.status(400).json({ error: 'Module does not belong to this course' });
      }
    }

    // Update lab
    const lab = await prisma.lab.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description.trim(),
        instructions: instructions?.trim() || null,
        scenario: scenario?.trim() || null,
        objectives: objectives || [],
        resources: resources?.trim() || null,
        hints: hints?.trim() || null,
        difficulty,
        estimatedTime: estimatedTime || null,
        order,
        courseId,
        moduleId: moduleId || null,
        isPublished: isPublished !== undefined ? isPublished : existingLab.isPublished,
        labType: effectiveLabType,
        simulationConfig: simulationConfig || null,
        passingScore: effectivePassingScore
      }
    });

    res.json({
      message: 'Lab updated successfully',
      lab
    });
  } catch (error) {
    console.error('UpdateLab error:', error);
    res.status(500).json({ error: 'Failed to update lab' });
  }
};

// Delete lab
export const deleteLab = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    // Check if lab exists
    const lab = await prisma.lab.findUnique({
      where: { id },
      include: {
        progress: true
      }
    });

    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }

    // Delete lab (cascade will delete progress)
    await prisma.lab.delete({
      where: { id }
    });

    res.json({
      message: 'Lab deleted successfully',
      deletedProgress: lab.progress.length
    });
  } catch (error) {
    console.error('DeleteLab error:', error);
    res.status(500).json({ error: 'Failed to delete lab' });
  }
};

// Reorder labs
export const reorderLabs = async (req: Request, res: Response) => {
  try {
    const { labOrders } = req.body;

    // Validation
    if (!Array.isArray(labOrders) || labOrders.length === 0) {
      return res.status(400).json({ error: 'Lab orders must be a non-empty array' });
    }

    // Validate each lab order entry
    for (const entry of labOrders) {
      if (!entry.id || typeof entry.order !== 'number') {
        return res.status(400).json({ error: 'Each entry must have id and order' });
      }
    }

    // Update all lab orders in a transaction
    await prisma.$transaction(
      labOrders.map(({ id, order }) =>
        prisma.lab.update({
          where: { id },
          data: { order }
        })
      )
    );

    res.json({ message: 'Labs reordered successfully' });
  } catch (error) {
    console.error('ReorderLabs error:', error);
    res.status(500).json({ error: 'Failed to reorder labs' });
  }
};

// ============================================================
// PHISHING MANAGEMENT ENDPOINTS (ADMIN)
// ============================================================

// Get all phishing scenarios with statistics
export const getAllPhishingScenarios = async (req: Request, res: Response) => {
  try {
    const scenarios = await prisma.phishingScenario.findMany({
      include: {
        attempts: {
          select: { isCorrect: true, userAction: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const scenariosWithStats = scenarios.map(scenario => {
      const totalAttempts = scenario.attempts.length;
      const correctAttempts = scenario.attempts.filter(a => a.isCorrect).length;
      const accuracy = totalAttempts > 0
        ? Math.round((correctAttempts / totalAttempts) * 100)
        : 0;

      // For phishing scenarios, track click rate
      const clickRate = scenario.isPhishing && totalAttempts > 0
        ? Math.round((scenario.attempts.filter(a => a.userAction === 'CLICKED_LINK').length / totalAttempts) * 100)
        : null;

      return {
        id: scenario.id,
        title: scenario.title,
        description: scenario.description,
        difficulty: scenario.difficulty,
        category: scenario.category,
        isActive: scenario.isActive,
        senderName: scenario.senderName,
        senderEmail: scenario.senderEmail,
        subject: scenario.subject,
        isPhishing: scenario.isPhishing,
        redFlagsCount: scenario.redFlags.length,
        createdAt: scenario.createdAt,
        updatedAt: scenario.updatedAt,
        stats: {
          totalAttempts,
          correctAttempts,
          accuracy,
          clickRate
        }
      };
    });

    res.json({ scenarios: scenariosWithStats });
  } catch (error) {
    console.error('GetAllPhishingScenarios error:', error);
    res.status(500).json({ error: 'Failed to fetch phishing scenarios' });
  }
};

// Get single phishing scenario by ID
export const getPhishingScenarioById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const scenario = await prisma.phishingScenario.findUnique({
      where: { id },
      include: {
        attempts: {
          select: { isCorrect: true, userAction: true }
        }
      }
    });

    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    const totalAttempts = scenario.attempts.length;
    const correctAttempts = scenario.attempts.filter(a => a.isCorrect).length;
    const accuracy = totalAttempts > 0
      ? Math.round((correctAttempts / totalAttempts) * 100)
      : 0;

    res.json({
      id: scenario.id,
      title: scenario.title,
      description: scenario.description,
      difficulty: scenario.difficulty,
      category: scenario.category,
      isActive: scenario.isActive,
      senderName: scenario.senderName,
      senderEmail: scenario.senderEmail,
      subject: scenario.subject,
      body: scenario.body,
      attachments: scenario.attachments,
      isPhishing: scenario.isPhishing,
      redFlags: scenario.redFlags,
      legitimateReason: scenario.legitimateReason,
      createdAt: scenario.createdAt,
      updatedAt: scenario.updatedAt,
      stats: {
        totalAttempts,
        correctAttempts,
        accuracy
      }
    });
  } catch (error) {
    console.error('GetPhishingScenarioById error:', error);
    res.status(500).json({ error: 'Failed to fetch scenario' });
  }
};

// Create new phishing scenario
export const createPhishingScenario = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      difficulty,
      category,
      isActive,
      senderName,
      senderEmail,
      subject,
      body,
      attachments,
      isPhishing,
      redFlags,
      legitimateReason
    } = req.body;

    // Validation
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Title must be at least 3 characters' });
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({ error: 'Description must be at least 10 characters' });
    }

    if (!senderName || !senderEmail || !subject || !body) {
      return res.status(400).json({ error: 'Sender name, email, subject, and body are required' });
    }

    if (typeof isPhishing !== 'boolean') {
      return res.status(400).json({ error: 'isPhishing must be a boolean' });
    }

    if (isPhishing && (!redFlags || !Array.isArray(redFlags) || redFlags.length === 0)) {
      return res.status(400).json({ error: 'Phishing scenarios must have at least one red flag' });
    }

    if (!isPhishing && !legitimateReason) {
      return res.status(400).json({ error: 'Legitimate scenarios must have a reason explaining why they are safe' });
    }

    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
    if (difficulty && !validDifficulties.includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    const scenario = await prisma.phishingScenario.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        difficulty: difficulty || 'Beginner',
        category: category || 'General',
        isActive: isActive !== undefined ? isActive : true,
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim(),
        subject: subject.trim(),
        body: body.trim(),
        attachments: attachments || [],
        isPhishing,
        redFlags: redFlags || [],
        legitimateReason: legitimateReason?.trim() || null
      }
    });

    res.status(201).json({
      message: 'Scenario created successfully',
      scenario
    });
  } catch (error) {
    console.error('CreatePhishingScenario error:', error);
    res.status(500).json({ error: 'Failed to create scenario' });
  }
};

// Update phishing scenario
export const updatePhishingScenario = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const {
      title,
      description,
      difficulty,
      category,
      isActive,
      senderName,
      senderEmail,
      subject,
      body,
      attachments,
      isPhishing,
      redFlags,
      legitimateReason
    } = req.body;

    // Check if scenario exists
    const existingScenario = await prisma.phishingScenario.findUnique({
      where: { id }
    });

    if (!existingScenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    // Validation
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Title must be at least 3 characters' });
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({ error: 'Description must be at least 10 characters' });
    }

    if (!senderName || !senderEmail || !subject || !body) {
      return res.status(400).json({ error: 'Sender name, email, subject, and body are required' });
    }

    if (typeof isPhishing !== 'boolean') {
      return res.status(400).json({ error: 'isPhishing must be a boolean' });
    }

    if (isPhishing && (!redFlags || !Array.isArray(redFlags) || redFlags.length === 0)) {
      return res.status(400).json({ error: 'Phishing scenarios must have at least one red flag' });
    }

    if (!isPhishing && !legitimateReason) {
      return res.status(400).json({ error: 'Legitimate scenarios must have a reason explaining why they are safe' });
    }

    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
    if (difficulty && !validDifficulties.includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    const scenario = await prisma.phishingScenario.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description.trim(),
        difficulty: difficulty || 'Beginner',
        category: category || 'General',
        isActive: isActive !== undefined ? isActive : existingScenario.isActive,
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim(),
        subject: subject.trim(),
        body: body.trim(),
        attachments: attachments || [],
        isPhishing,
        redFlags: redFlags || [],
        legitimateReason: legitimateReason?.trim() || null
      }
    });

    res.json({
      message: 'Scenario updated successfully',
      scenario
    });
  } catch (error) {
    console.error('UpdatePhishingScenario error:', error);
    res.status(500).json({ error: 'Failed to update scenario' });
  }
};

// Delete phishing scenario
export const deletePhishingScenario = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    // Check if scenario exists
    const scenario = await prisma.phishingScenario.findUnique({
      where: { id },
      include: {
        attempts: true
      }
    });

    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    // Delete scenario (cascade will delete attempts)
    await prisma.phishingScenario.delete({
      where: { id }
    });

    res.json({
      message: 'Scenario deleted successfully',
      deletedAttempts: scenario.attempts.length
    });
  } catch (error) {
    console.error('DeletePhishingScenario error:', error);
    res.status(500).json({ error: 'Failed to delete scenario' });
  }
};

// Get platform-wide phishing stats
export const getPhishingPlatformStats = async (req: Request, res: Response) => {
  try {
    // Get all attempts
    const attempts = await prisma.phishingAttempt.findMany({
      include: {
        scenario: {
          select: { difficulty: true, isPhishing: true, category: true }
        }
      }
    });

    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter(a => a.isCorrect).length;
    const overallAccuracy = totalAttempts > 0
      ? Math.round((correctAttempts / totalAttempts) * 100)
      : 0;

    // Phishing-specific stats
    const phishingAttempts = attempts.filter(a => a.scenario.isPhishing);
    const clickedLinks = phishingAttempts.filter(a => a.userAction === 'CLICKED_LINK').length;
    const clickRate = phishingAttempts.length > 0
      ? Math.round((clickedLinks / phishingAttempts.length) * 100)
      : 0;

    const reportedPhishing = phishingAttempts.filter(a => a.userAction === 'REPORTED').length;
    const reportRate = phishingAttempts.length > 0
      ? Math.round((reportedPhishing / phishingAttempts.length) * 100)
      : 0;

    // Stats by difficulty
    const byDifficulty: { [key: string]: { total: number; correct: number } } = {
      Beginner: { total: 0, correct: 0 },
      Intermediate: { total: 0, correct: 0 },
      Advanced: { total: 0, correct: 0 }
    };

    attempts.forEach(a => {
      const diff = a.scenario.difficulty;
      if (byDifficulty[diff]) {
        byDifficulty[diff].total++;
        if (a.isCorrect) byDifficulty[diff].correct++;
      }
    });

    // Stats by category
    const byCategory: { [key: string]: { total: number; correct: number } } = {};
    attempts.forEach(a => {
      const cat = a.scenario.category;
      if (!byCategory[cat]) {
        byCategory[cat] = { total: 0, correct: 0 };
      }
      byCategory[cat].total++;
      if (a.isCorrect) byCategory[cat].correct++;
    });

    // Count unique users
    const uniqueUsers = new Set(attempts.map(a => a.userId)).size;

    // Total scenarios
    const totalScenarios = await prisma.phishingScenario.count();
    const activeScenarios = await prisma.phishingScenario.count({ where: { isActive: true } });

    // Average response time
    const avgResponseTime = totalAttempts > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.responseTimeMs, 0) / totalAttempts)
      : 0;

    res.json({
      overview: {
        totalAttempts,
        correctAttempts,
        overallAccuracy,
        clickRate,
        reportRate,
        uniqueUsers,
        totalScenarios,
        activeScenarios,
        avgResponseTimeMs: avgResponseTime
      },
      byDifficulty: Object.entries(byDifficulty).map(([difficulty, data]) => ({
        difficulty,
        total: data.total,
        correct: data.correct,
        accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
      })),
      byCategory: Object.entries(byCategory).map(([category, data]) => ({
        category,
        total: data.total,
        correct: data.correct,
        accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
      }))
    });
  } catch (error) {
    console.error('GetPhishingPlatformStats error:', error);
    res.status(500).json({ error: 'Failed to fetch platform stats' });
  }
};

// Get all phishing attempts (filterable)
export const getAllPhishingAttempts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const userId = req.query.userId as string | undefined;
    const scenarioId = req.query.scenarioId as string | undefined;
    const isCorrect = req.query.isCorrect as string | undefined;

    // Build where clause
    const where: any = {};
    if (userId) where.userId = userId;
    if (scenarioId) where.scenarioId = scenarioId;
    if (isCorrect !== undefined) where.isCorrect = isCorrect === 'true';

    const [attempts, total] = await Promise.all([
      prisma.phishingAttempt.findMany({
        where,
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true }
          },
          scenario: {
            select: {
              id: true,
              title: true,
              difficulty: true,
              category: true,
              isPhishing: true
            }
          }
        },
        orderBy: { attemptedAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.phishingAttempt.count({ where })
    ]);

    res.json({
      attempts: attempts.map(a => ({
        id: a.id,
        user: {
          id: a.user.id,
          email: a.user.email,
          firstName: a.user.firstName,
          lastName: a.user.lastName
        },
        scenario: {
          id: a.scenario.id,
          title: a.scenario.title,
          difficulty: a.scenario.difficulty,
          category: a.scenario.category,
          isPhishing: a.scenario.isPhishing
        },
        userAction: a.userAction,
        isCorrect: a.isCorrect,
        responseTimeMs: a.responseTimeMs,
        attemptedAt: a.attemptedAt
      })),
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('GetAllPhishingAttempts error:', error);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
};
