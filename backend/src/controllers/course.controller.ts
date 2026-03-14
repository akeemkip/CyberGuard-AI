import { Request, Response } from 'express';
import { z } from 'zod';
import prisma, { PLATFORM_SETTINGS_ID } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendEnrollmentEmail, sendCompletionEmail } from '../services/email.service';
import { logger } from '../utils/logger';

// Validation schemas
const createCourseSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Description is required'),
  thumbnail: z.string().trim().optional(),
  difficulty: z.string().trim().optional(),
  duration: z.string().trim().optional(),
  isPublished: z.boolean().optional()
});

const updateCourseSchema = createCourseSchema.partial();

const createLessonSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  content: z.string().trim().min(1, 'Content is required'),
  videoUrl: z.string().trim().optional(),
  order: z.number().int().positive()
});

const updateLessonSchema = createLessonSchema.partial();

// Get all courses (public)
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const { published } = req.query;

    const courses = await prisma.course.findMany({
      where: published === 'true' ? { isPublished: true } : undefined,
      include: {
        _count: {
          select: {
            lessons: true,
            enrollments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ courses });
  } catch (error) {
    logger.error('GetAllCourses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Get course by ID
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                quiz: {
                  select: {
                    id: true,
                    title: true,
                    passingScore: true
                  }
                }
              }
            }
          }
        },
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            quiz: {
              select: {
                id: true,
                title: true,
                passingScore: true
              }
            }
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    logger.error('GetCourseById error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

// Create course (admin only)
export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = createCourseSchema.parse(req.body);

    const course = await prisma.course.create({
      data: validatedData
    });

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    logger.error('CreateCourse error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// Update course (admin only)
export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const validatedData = updateCourseSchema.parse(req.body);

    const course = await prisma.course.update({
      where: { id },
      data: validatedData
    });

    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    logger.error('UpdateCourse error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

// Delete course (admin only)
export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await prisma.course.delete({
      where: { id }
    });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    logger.error('DeleteCourse error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};

// Enroll in course
export const enrollInCourse = async (req: AuthRequest, res: Response) => {
  try {
    const courseId = req.params.id as string;
    const userId = req.userId!;

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId
      },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    // Send enrollment email (non-blocking — doesn't delay the response)
    const emailSettings = await prisma.platformSettings.findUnique({
      where: { id: PLATFORM_SETTINGS_ID },
      select: { enableEmailNotifications: true, enableEnrollmentEmails: true }
    });
    if (emailSettings?.enableEmailNotifications && emailSettings?.enableEnrollmentEmails) {
      const student = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, firstName: true }
      });
      if (student) {
        try {
          const result = await sendEnrollmentEmail(student.email, student.firstName || 'Student', course.title);
          if (result.success) {
            logger.info(`Enrollment email sent to ${student.email} for course "${course.title}"`);
          } else {
            logger.error(`Enrollment email failed for ${student.email}, course "${course.title}": ${result.error}`);
          }
        } catch (err) {
          logger.error(`Enrollment email error for ${student.email}, course "${course.title}":`, err);
        }
      }
    }

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    logger.error('EnrollInCourse error:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
};

// Get enrolled courses for current user
export const getEnrolledCourses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            lessons: {
              select: { id: true }
            },
            labs: {
              select: { id: true }
            }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    // Batch progress queries instead of N+1 per enrollment
    const allLessonIds = enrollments.flatMap(e => e.course.lessons.map(l => l.id));
    const allLabIds = enrollments.flatMap(e => e.course.labs.map(l => l.id));

    const [completedLessonRows, completedLabRows] = await Promise.all([
      prisma.progress.findMany({
        where: { userId, lessonId: { in: allLessonIds }, completed: true },
        select: { lessonId: true }
      }),
      prisma.labProgress.findMany({
        where: { userId, labId: { in: allLabIds }, status: 'COMPLETED' },
        select: { labId: true }
      })
    ]);

    const completedLessonSet = new Set(completedLessonRows.map(r => r.lessonId));
    const completedLabSet = new Set(completedLabRows.map(r => r.labId));

    const coursesWithProgress = enrollments.map((enrollment) => {
      const lessonIds = enrollment.course.lessons.map(l => l.id);
      const labIds = enrollment.course.labs.map(l => l.id);

      const completedLessons = lessonIds.filter(id => completedLessonSet.has(id)).length;
      const completedLabs = labIds.filter(id => completedLabSet.has(id)).length;

      const totalLessons = lessonIds.length;
      const totalLabs = labIds.length;
      const totalItems = totalLessons + totalLabs;
      const completedItems = completedLessons + completedLabs;

      const progressPercent = totalItems > 0
        ? Math.round((completedItems / totalItems) * 100)
        : 0;

      return {
        ...enrollment,
        progress: {
          completedLessons,
          totalLessons,
          completedLabs,
          totalLabs,
          percentage: progressPercent
        }
      };
    });

    res.json({ enrolledCourses: coursesWithProgress });
  } catch (error) {
    logger.error('GetEnrolledCourses error:', error);
    res.status(500).json({ error: 'Failed to fetch enrolled courses' });
  }
};

// Get course progress for specific course
export const getCourseProgress = async (req: AuthRequest, res: Response) => {
  try {
    const courseId = req.params.id as string;
    const userId = req.userId!;

    // Get all lessons for the course
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      select: { id: true, title: true, order: true }
    });

    // Get progress for each lesson
    const progress = await prisma.progress.findMany({
      where: {
        userId,
        lessonId: { in: lessons.map(l => l.id) }
      }
    });

    const lessonsWithProgress = lessons.map(lesson => ({
      ...lesson,
      completed: progress.find(p => p.lessonId === lesson.id)?.completed || false
    }));

    const completedCount = lessonsWithProgress.filter(l => l.completed).length;

    res.json({
      courseId,
      lessons: lessonsWithProgress,
      summary: {
        completed: completedCount,
        total: lessons.length,
        percentage: lessons.length > 0
          ? Math.round((completedCount / lessons.length) * 100)
          : 0
      }
    });
  } catch (error) {
    logger.error('GetCourseProgress error:', error);
    res.status(500).json({ error: 'Failed to fetch course progress' });
  }
};

// Get quiz with questions
export const getQuiz = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.quizId as string;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            question: true,
            options: true,
            order: true
            // Note: NOT including correctAnswer - that's for server-side validation only
          }
        },
        lesson: {
          select: {
            id: true,
            title: true,
            courseId: true
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ quiz });
  } catch (error) {
    logger.error('GetQuiz error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
};

// Submit quiz attempt
export const submitQuizAttempt = async (req: AuthRequest, res: Response) => {
  try {
    const quizId = req.params.quizId as string;
    const userId = req.userId!;
    const { answers } = req.body; // { questionId: selectedOptionIndex }

    // Get quiz with questions, correct answers, and lesson (for enrollment check)
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        lesson: {
          select: { courseId: true }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Validate quiz has questions (prevents division by zero)
    if (quiz.questions.length === 0) {
      return res.status(400).json({ error: 'Quiz has no questions' });
    }

    // Verify user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: quiz.lesson.courseId }
      }
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Validate answers is a non-null object
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers must be an object mapping question IDs to selected option indexes' });
    }

    // Validate all questions were answered with valid keys
    const questionIds = new Set(quiz.questions.map(q => q.id));
    const answerKeys = Object.keys(answers);

    if (answerKeys.length !== quiz.questions.length) {
      return res.status(400).json({
        error: 'All questions must be answered',
        expected: quiz.questions.length,
        received: answerKeys.length
      });
    }

    const invalidKeys = answerKeys.filter(key => !questionIds.has(key));
    if (invalidKeys.length > 0) {
      return res.status(400).json({
        error: 'Answers contain invalid question IDs',
        invalidIds: invalidKeys
      });
    }

    // Validate answer values are integers within option bounds
    for (const q of quiz.questions) {
      const answer = answers[q.id];
      if (typeof answer !== 'number' || !Number.isInteger(answer) || answer < 0) {
        return res.status(400).json({
          error: `Invalid answer for question ${q.id}: must be a non-negative integer`
        });
      }
      const optionCount = Array.isArray(q.options) ? (q.options as unknown[]).length : 0;
      if (optionCount > 0 && answer >= optionCount) {
        return res.status(400).json({
          error: `Invalid answer for question ${q.id}: index ${answer} is out of range (${optionCount} options available)`
        });
      }
    }

    // Calculate score
    let correctCount = 0;
    const results = quiz.questions.map(q => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect
      };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        passed
      }
    });

    res.json({
      attempt,
      results,
      summary: {
        score,
        passed,
        correctCount,
        totalQuestions: quiz.questions.length,
        passingScore: quiz.passingScore
      }
    });
  } catch (error) {
    logger.error('SubmitQuizAttempt error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
};

// Helper function to check and mark course completion (considers both lessons AND labs)
// Wrapped in a transaction to prevent race conditions from concurrent lesson/lab completions
// Returns completion status. Email is sent separately after the transaction succeeds.
const checkAndCompleteCourse = async (userId: string, courseId: string): Promise<boolean> => {
  const completed = await prisma.$transaction(async (tx) => {
    // Get all lessons in the course
    const courseLessons = await tx.lesson.findMany({
      where: { courseId },
      select: { id: true }
    });

    // Get all labs in the course
    const courseLabs = await tx.lab.findMany({
      where: { courseId },
      select: { id: true }
    });

    // Count completed lessons
    const completedLessons = await tx.progress.count({
      where: {
        userId,
        lessonId: { in: courseLessons.map(l => l.id) },
        completed: true
      }
    });

    // Count completed labs
    const completedLabs = await tx.labProgress.count({
      where: {
        userId,
        labId: { in: courseLabs.map(l => l.id) },
        status: 'COMPLETED'
      }
    });

    // Course is complete if:
    // - Has lessons: all lessons done
    // - Has labs: all labs done
    // - Has both: both requirements met
    // - Has neither: not complete (empty course)
    const lessonsComplete = courseLessons.length === 0 || completedLessons === courseLessons.length;
    const labsComplete = courseLabs.length === 0 || completedLabs === courseLabs.length;
    const hasContent = courseLessons.length > 0 || courseLabs.length > 0;

    if (hasContent && lessonsComplete && labsComplete) {
      // Check if already completed (guards against concurrent requests)
      const enrollment = await tx.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
        select: { completedAt: true }
      });

      if (enrollment?.completedAt) {
        // Another concurrent request already completed this course
        return false;
      }

      // Mark enrollment as complete
      await tx.enrollment.update({
        where: {
          userId_courseId: { userId, courseId }
        },
        data: {
          completedAt: new Date()
        }
      });

      // Create or update certificate
      await tx.certificate.upsert({
        where: {
          userId_courseId: { userId, courseId }
        },
        create: {
          userId,
          courseId,
          issuedAt: new Date()
        },
        update: {
          issuedAt: new Date()
        }
      });

      return true;
    }

    return false;
  });

  // Send completion email AFTER transaction succeeds (not inside it)
  if (completed) {
    await sendCourseCompletionNotification(userId, courseId);
  }

  return completed;
};

// Send course completion email with retry logic
// Separated from the transaction to avoid blocking DB and ensure email failures
// don't roll back the completion. Logs failures with full context for debugging.
const sendCourseCompletionNotification = async (userId: string, courseId: string): Promise<void> => {
  try {
    const emailSettings = await prisma.platformSettings.findUnique({
      where: { id: PLATFORM_SETTINGS_ID },
      select: { enableEmailNotifications: true, enableCompletionEmails: true }
    });

    if (!emailSettings?.enableEmailNotifications || !emailSettings?.enableCompletionEmails) {
      return;
    }

    const [student, course] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, firstName: true }
      }),
      prisma.course.findUnique({
        where: { id: courseId },
        select: { title: true }
      })
    ]);

    if (!student || !course) {
      logger.warn(`Completion email skipped: missing data for userId=${userId}, courseId=${courseId}`);
      return;
    }

    const maxRetries = 2;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const result = await sendCompletionEmail(student.email, student.firstName || 'Student', course.title);
      if (result.success) {
        logger.info(`Completion email sent to ${student.email} for course "${course.title}"`);
        return;
      }
      if (attempt < maxRetries) {
        logger.warn(`Completion email attempt ${attempt + 1} failed for ${student.email}: ${result.error}. Retrying...`);
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      } else {
        logger.error(`Completion email failed after ${maxRetries + 1} attempts for ${student.email}, course "${course.title}": ${result.error}`);
      }
    }
  } catch (err) {
    logger.error(`Completion email error for userId=${userId}, courseId=${courseId}:`, err);
  }
};

// Mark lesson as complete
export const markLessonComplete = async (req: AuthRequest, res: Response) => {
  try {
    const lessonId = req.params.lessonId as string;
    const userId = req.userId!;

    // Verify lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Upsert progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: { userId, lessonId }
      },
      update: {
        completed: true,
        completedAt: new Date()
      },
      create: {
        userId,
        lessonId,
        completed: true,
        completedAt: new Date()
      }
    });

    // Check if course should be marked complete (checks both lessons AND labs)
    const courseComplete = await checkAndCompleteCourse(userId, lesson.courseId);

    res.json({
      message: 'Lesson marked as complete',
      progress,
      courseComplete
    });
  } catch (error) {
    logger.error('MarkLessonComplete error:', error);
    res.status(500).json({ error: 'Failed to mark lesson as complete' });
  }
};

// Get lesson by ID (admin only)
export const getLessonById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            passingScore: true
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json({ lesson });
  } catch (error) {
    logger.error('GetLessonById error:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
};

// Create lesson (admin only)
export const createLesson = async (req: AuthRequest, res: Response) => {
  try {
    const courseId = req.params.courseId as string;
    const validatedData = createLessonSchema.parse(req.body);

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const lesson = await prisma.lesson.create({
      data: {
        ...validatedData,
        courseId
      }
    });

    res.status(201).json({ message: 'Lesson created successfully', lesson });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    logger.error('CreateLesson error:', error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
};

// Update lesson (admin only)
export const updateLesson = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const validatedData = updateLessonSchema.parse(req.body);

    const lesson = await prisma.lesson.update({
      where: { id },
      data: validatedData
    });

    res.json({ message: 'Lesson updated successfully', lesson });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    logger.error('UpdateLesson error:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
};

// Delete lesson (admin only)
export const deleteLesson = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const lesson = await prisma.lesson.findUnique({ where: { id } });
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    await prisma.lesson.delete({
      where: { id }
    });

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    logger.error('DeleteLesson error:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
};

// ==================== LAB ENDPOINTS ====================

// Get published labs for a course with user progress
export const getCourseLabs = async (req: AuthRequest, res: Response) => {
  try {
    const courseId = req.params.courseId as string;
    const userId = req.userId!;

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get all published labs for the course
    const labs = await prisma.lab.findMany({
      where: {
        courseId,
        isPublished: true
      },
      include: {
        module: {
          select: {
            id: true,
            title: true
          }
        },
        progress: {
          where: { userId },
          select: {
            status: true,
            timeSpent: true,
            completedAt: true
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    // Transform to include user progress
    const labsWithProgress = labs.map(lab => ({
      id: lab.id,
      title: lab.title,
      description: lab.description,
      difficulty: lab.difficulty,
      estimatedTime: lab.estimatedTime,
      order: lab.order,
      moduleId: lab.moduleId,
      moduleTitle: lab.module?.title || null,
      status: lab.progress[0]?.status || 'NOT_STARTED',
      timeSpent: lab.progress[0]?.timeSpent || 0,
      completedAt: lab.progress[0]?.completedAt || null
    }));

    res.json({ labs: labsWithProgress });
  } catch (error) {
    logger.error('GetCourseLabs error:', error);
    res.status(500).json({ error: 'Failed to fetch course labs' });
  }
};

// Get lab details for student
export const getLabForStudent = async (req: AuthRequest, res: Response) => {
  try {
    const labId = req.params.id as string;
    const userId = req.userId!;

    const lab = await prisma.lab.findUnique({
      where: { id: labId },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        },
        module: {
          select: {
            id: true,
            title: true
          }
        },
        progress: {
          where: { userId }
        }
      }
    });

    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: lab.courseId }
      }
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    const userProgress = lab.progress[0] || null;

    res.json({
      lab: {
        id: lab.id,
        title: lab.title,
        description: lab.description,
        difficulty: lab.difficulty,
        estimatedTime: lab.estimatedTime,
        courseId: lab.courseId,
        courseTitle: lab.course.title,
        moduleId: lab.moduleId,
        moduleTitle: lab.module?.title || null,
        // Template-based fields
        labType: lab.labType,
        simulationConfig: lab.simulationConfig,
        passingScore: lab.passingScore,
        // Legacy fields
        instructions: lab.instructions,
        scenario: lab.scenario,
        objectives: lab.objectives,
        resources: lab.resources,
        hints: lab.hints
      },
      progress: userProgress ? {
        status: userProgress.status,
        timeSpent: userProgress.timeSpent,
        notes: userProgress.notes,
        startedAt: userProgress.startedAt,
        completedAt: userProgress.completedAt,
        // Scoring fields
        score: userProgress.score,
        passed: userProgress.passed,
        attempts: userProgress.attempts,
        answers: userProgress.answers
      } : null
    });
  } catch (error) {
    logger.error('GetLabForStudent error:', error);
    res.status(500).json({ error: 'Failed to fetch lab' });
  }
};

// Start lab (mark as in progress)
export const startLab = async (req: AuthRequest, res: Response) => {
  try {
    const labId = req.params.id as string;
    const userId = req.userId!;

    // Verify lab exists
    const lab = await prisma.lab.findUnique({
      where: { id: labId }
    });

    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: lab.courseId }
      }
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Create or update progress
    const progress = await prisma.labProgress.upsert({
      where: {
        userId_labId: { userId, labId }
      },
      update: {
        status: 'IN_PROGRESS',
        startedAt: new Date()
      },
      create: {
        userId,
        labId,
        status: 'IN_PROGRESS',
        startedAt: new Date()
      }
    });

    res.json({
      message: 'Lab started successfully',
      progress: {
        status: progress.status,
        startedAt: progress.startedAt
      }
    });
  } catch (error) {
    logger.error('StartLab error:', error);
    res.status(500).json({ error: 'Failed to start lab' });
  }
};

// Complete lab
export const completeLab = async (req: AuthRequest, res: Response) => {
  try {
    const labId = req.params.id as string;
    const userId = req.userId!;
    const { timeSpent, notes, isRetry = false } = req.body;

    // Validate inputs
    if (typeof timeSpent !== 'number' || timeSpent < 0) {
      return res.status(400).json({ error: 'Valid time spent is required' });
    }

    // Get existing progress
    const existingProgress = await prisma.labProgress.findUnique({
      where: {
        userId_labId: { userId, labId }
      }
    });

    // If already completed and not a retry, return existing data
    if (existingProgress?.status === 'COMPLETED' && !isRetry) {
      return res.json({
        message: 'Lab already completed',
        progress: {
          status: existingProgress.status,
          timeSpent: existingProgress.timeSpent,
          completedAt: existingProgress.completedAt,
          score: existingProgress.score,
          passed: existingProgress.passed
        },
        alreadyCompleted: true
      });
    }

    // Verify lab exists
    const lab = await prisma.lab.findUnique({
      where: { id: labId }
    });

    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: lab.courseId }
      }
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Calculate accumulated time (add to existing if retry)
    const totalTimeSpent = existingProgress
      ? existingProgress.timeSpent + timeSpent
      : timeSpent;

    // Update or create progress with idempotency
    const progress = await prisma.labProgress.upsert({
      where: {
        userId_labId: { userId, labId }
      },
      update: {
        status: 'COMPLETED',
        timeSpent: totalTimeSpent,
        notes: notes || existingProgress?.notes,
        attempts: existingProgress ? existingProgress.attempts + 1 : 1,
        completedAt: new Date()
      },
      create: {
        userId,
        labId,
        status: 'COMPLETED',
        timeSpent,
        notes: notes || null,
        attempts: 1,
        startedAt: new Date(),
        completedAt: new Date()
      }
    });

    // Check if course should be marked complete (checks both lessons AND labs)
    const courseComplete = await checkAndCompleteCourse(userId, lab.courseId);

    res.json({
      message: isRetry ? 'Lab retried and completed' : 'Lab marked as complete',
      progress: {
        status: progress.status,
        timeSpent: progress.timeSpent,
        completedAt: progress.completedAt,
        attempts: progress.attempts
      },
      isRetry,
      courseComplete
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('CompleteLab error:', errorMessage);
    res.status(500).json({ error: 'Failed to complete lab' });
  }
};

// Update lab notes
export const updateLabNotes = async (req: AuthRequest, res: Response) => {
  try {
    const labId = req.params.id as string;
    const userId = req.userId!;
    const { notes, timeSpent } = req.body;

    // Validate notes
    if (notes && typeof notes !== 'string') {
      return res.status(400).json({ error: 'Notes must be a string' });
    }

    if (notes && notes.length > 5000) {
      return res.status(400).json({ error: 'Notes must be less than 5000 characters' });
    }

    // Validate timeSpent if provided
    if (timeSpent !== undefined && (typeof timeSpent !== 'number' || timeSpent < 0)) {
      return res.status(400).json({ error: 'Time spent must be a positive number' });
    }

    // Verify lab exists
    const lab = await prisma.lab.findUnique({
      where: { id: labId }
    });

    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: lab.courseId }
      }
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Check if progress exists
    const existingProgress = await prisma.labProgress.findUnique({
      where: {
        userId_labId: { userId, labId }
      }
    });

    if (!existingProgress) {
      return res.status(404).json({ error: 'Lab not started yet' });
    }

    // Update notes and optionally timeSpent
    const updateData: any = { notes: notes || null };
    if (timeSpent !== undefined) {
      updateData.timeSpent = timeSpent;
    }

    const progress = await prisma.labProgress.update({
      where: {
        userId_labId: { userId, labId }
      },
      data: updateData
    });

    res.json({
      message: 'Lab notes updated successfully',
      progress: {
        notes: progress.notes,
        timeSpent: progress.timeSpent
      }
    });
  } catch (error) {
    logger.error('UpdateLabNotes error:', error);
    res.status(500).json({ error: 'Failed to update lab notes' });
  }
};

// Helper function to calculate score server-side based on simulation type and answers
const calculateLabScore = (labType: string, simulationConfig: any, answers: any, labPassingScore: number = 70): { score: number; passed: boolean; passingScore: number } => {
  let score = 0;
  const passingScore = labPassingScore;

  switch (labType) {
    case 'PHISHING_EMAIL': {
      const config = simulationConfig as any;
      if (!config.emails || !Array.isArray(config.emails)) {
        throw new Error('Invalid phishing email configuration');
      }

      const totalEmails = config.emails.length;
      let correctAnswers = 0;

      config.emails.forEach((email: any) => {
        const userAction = answers[email.id];
        if (!userAction) return;

        let isCorrect = false;
        if (email.isPhishing) {
          isCorrect = userAction === 'REPORTED' || userAction === 'DELETED';
        } else {
          isCorrect = userAction === 'MARKED_SAFE' || userAction === 'IGNORED';
        }

        if (isCorrect) correctAnswers++;
      });

      score = totalEmails > 0 ? Math.round((correctAnswers / totalEmails) * 100) : 0;
      break;
    }

    case 'SUSPICIOUS_LINKS': {
      const config = simulationConfig as any;
      if (!config.links || !Array.isArray(config.links)) {
        throw new Error('Invalid suspicious links configuration');
      }

      const totalLinks = config.links.length;
      let correctAnswers = 0;

      config.links.forEach((link: any, index: number) => {
        const userAnswer = answers[`link-${index}`];
        if (userAnswer === undefined) return;

        const isCorrect = (link.isMalicious && userAnswer === true) || (!link.isMalicious && userAnswer === false);
        if (isCorrect) correctAnswers++;
      });

      score = totalLinks > 0 ? Math.round((correctAnswers / totalLinks) * 100) : 0;
      break;
    }

    case 'PASSWORD_STRENGTH': {
      const config = simulationConfig as any;
      if (!config.requirements) {
        throw new Error('Invalid password strength configuration');
      }

      const password = answers.password || '';
      const requirements = config.requirements;
      const bannedPasswords = config.bannedPasswords || [];

      // Check requirements
      let metRequirements = 0;
      let totalRequirements = 4; // minLength, uppercase, numbers, special

      // Min length
      if (password.length >= requirements.minLength) metRequirements++;

      // Uppercase
      if (!requirements.requireUppercase || /[A-Z]/.test(password)) metRequirements++;

      // Numbers
      if (!requirements.requireNumbers || /\d/.test(password)) metRequirements++;

      // Special characters
      if (!requirements.requireSpecial || /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) metRequirements++;

      // Base score
      score = Math.round((metRequirements / totalRequirements) * 100);

      // Bonus for extra length
      if (password.length >= requirements.minLength + 4) {
        score = Math.min(100, score + 10);
      }

      // Penalty for banned passwords
      if (bannedPasswords.includes(password.toLowerCase())) {
        score = Math.max(0, score - 50);
      }

      break;
    }

    case 'SOCIAL_ENGINEERING': {
      const config = simulationConfig as any;
      if (!config.messages || !Array.isArray(config.messages)) {
        throw new Error('Invalid social engineering configuration');
      }

      const totalMessages = config.messages.length;
      let correctAnswers = 0;

      config.messages.forEach((message: any) => {
        const userResponse = answers[message.id];
        if (!userResponse) return;

        const correctResponse = message.responses?.find((r: any) => r.isCorrect);
        if (correctResponse && userResponse === correctResponse.text) {
          correctAnswers++;
        }
      });

      score = totalMessages > 0 ? Math.round((correctAnswers / totalMessages) * 100) : 0;
      break;
    }

    case 'SECURITY_ALERTS': {
      const config = simulationConfig as any;
      if (!config.alerts || !Array.isArray(config.alerts)) {
        throw new Error('Invalid security alerts configuration');
      }

      const totalAlerts = config.alerts.length;
      let correctAnswers = 0;

      config.alerts.forEach((alert: any) => {
        const userAnswer = answers[alert.id]; // boolean: true = user thinks legitimate, false = fake
        if (userAnswer === undefined) return;

        const isCorrect = alert.isLegitimate === userAnswer;
        if (isCorrect) correctAnswers++;
      });

      score = totalAlerts > 0 ? Math.round((correctAnswers / totalAlerts) * 100) : 0;
      break;
    }

    case 'WIFI_SAFETY': {
      const config = simulationConfig as any;
      if (!config.networks || !Array.isArray(config.networks)) {
        throw new Error('Invalid wifi safety configuration');
      }

      const totalNetworks = config.networks.length;
      let correctAnswers = 0;

      config.networks.forEach((network: any) => {
        const userAnswer = answers[network.id]; // boolean: true = user thinks safe, false = unsafe
        if (userAnswer === undefined) return;

        const isCorrect = network.isSafe === userAnswer;
        if (isCorrect) correctAnswers++;
      });

      score = totalNetworks > 0 ? Math.round((correctAnswers / totalNetworks) * 100) : 0;
      break;
    }

    case 'INCIDENT_RESPONSE': {
      const config = simulationConfig as any;
      if (!config.steps || !Array.isArray(config.steps)) {
        throw new Error('Invalid incident response configuration');
      }

      let correctAnswers = 0;
      let answeredSteps = 0;

      config.steps.forEach((step: any) => {
        const userOptionIndex = answers[step.id]; // number: index of selected option
        if (userOptionIndex === undefined) return;

        answeredSteps++;
        const selectedOption = step.options?.[userOptionIndex];
        if (selectedOption?.isCorrect) correctAnswers++;
      });

      score = answeredSteps > 0 ? Math.round((correctAnswers / answeredSteps) * 100) : 0;
      break;
    }

    default:
      throw new Error(`Unsupported lab type for score calculation: ${labType}`);
  }

  return {
    score,
    passed: score >= passingScore,
    passingScore
  };
};

// Submit lab simulation results (for interactive labs)
export const submitLabSimulation = async (req: AuthRequest, res: Response) => {
  try {
    const labId = req.params.id as string;
    const userId = req.userId!;
    const { answers, timeSpent } = req.body;

    // Validate inputs
    if (typeof timeSpent !== 'number' || timeSpent < 0) {
      return res.status(400).json({ error: 'Time spent must be a positive number' });
    }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Answers must be provided as an object' });
    }

    // Verify lab exists and is an interactive type
    const lab = await prisma.lab.findUnique({
      where: { id: labId }
    });

    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }

    if (lab.labType === 'CONTENT') {
      return res.status(400).json({ error: 'This lab does not support simulation submission' });
    }

    if (!lab.simulationConfig) {
      return res.status(400).json({ error: 'Lab has no simulation configuration' });
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: lab.courseId }
      }
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Calculate score server-side (SECURITY FIX: Don't trust client-submitted scores)
    let calculatedScore: number;
    let passed: boolean;

    try {
      const result = calculateLabScore(lab.labType, lab.simulationConfig, answers, lab.passingScore);
      calculatedScore = result.score;
      passed = result.passed;
    } catch (error) {
      logger.error('Score calculation error:', error);
      return res.status(400).json({ error: 'Failed to calculate score. Invalid answers or configuration.' });
    }

    // Get existing progress to track attempts
    const existingProgress = await prisma.labProgress.findUnique({
      where: {
        userId_labId: { userId, labId }
      }
    });

    const currentAttempts = existingProgress?.attempts || 0;

    // Update or create progress with simulation results
    const progress = await prisma.labProgress.upsert({
      where: {
        userId_labId: { userId, labId }
      },
      update: {
        status: passed ? 'COMPLETED' : 'IN_PROGRESS',
        score: calculatedScore,
        passed,
        answers: answers || {},
        attempts: currentAttempts + 1,
        timeSpent,
        completedAt: passed ? new Date() : null
      },
      create: {
        userId,
        labId,
        status: passed ? 'COMPLETED' : 'IN_PROGRESS',
        score: calculatedScore,
        passed,
        answers: answers || {},
        attempts: 1,
        timeSpent,
        startedAt: new Date(),
        completedAt: passed ? new Date() : null
      }
    });

    // Check if course should be marked complete (only if lab was passed)
    let courseComplete = false;
    if (passed) {
      courseComplete = await checkAndCompleteCourse(userId, lab.courseId);
    }

    res.json({
      message: passed ? 'Lab completed successfully!' : 'Lab submitted. Keep practicing to improve your score.',
      progress: {
        status: progress.status,
        score: progress.score,
        passed: progress.passed,
        attempts: progress.attempts,
        completedAt: progress.completedAt
      },
      courseComplete
    });
  } catch (error) {
    logger.error('SubmitLabSimulation error:', error);
    res.status(500).json({ error: 'Failed to submit lab simulation' });
  }
};
