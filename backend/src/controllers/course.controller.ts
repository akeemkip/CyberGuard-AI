import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// Validation schemas
const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  thumbnail: z.string().optional(),
  difficulty: z.string().optional(),
  duration: z.string().optional(),
  isPublished: z.boolean().optional()
});

const updateCourseSchema = createCourseSchema.partial();

const createLessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  videoUrl: z.string().optional(),
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
    console.error('GetAllCourses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Get course by ID
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
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
    console.error('GetCourseById error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

// Create course (admin only)
export const createCourse = async (req: Request, res: Response) => {
  try {
    const validatedData = createCourseSchema.parse(req.body);

    const course = await prisma.course.create({
      data: validatedData
    });

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('CreateCourse error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// Update course (admin only)
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
    console.error('UpdateCourse error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

// Delete course (admin only)
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.course.delete({
      where: { id }
    });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('DeleteCourse error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};

// Enroll in course
export const enrollInCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id: courseId } = req.params;
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

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    console.error('EnrollInCourse error:', error);
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
            }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    // Get progress for each course
    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const lessonIds = enrollment.course.lessons.map(l => l.id);

        const completedLessons = await prisma.progress.count({
          where: {
            userId,
            lessonId: { in: lessonIds },
            completed: true
          }
        });

        const totalLessons = lessonIds.length;
        const progressPercent = totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

        return {
          ...enrollment,
          progress: {
            completedLessons,
            totalLessons,
            percentage: progressPercent
          }
        };
      })
    );

    res.json({ enrolledCourses: coursesWithProgress });
  } catch (error) {
    console.error('GetEnrolledCourses error:', error);
    res.status(500).json({ error: 'Failed to fetch enrolled courses' });
  }
};

// Get course progress for specific course
export const getCourseProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { id: courseId } = req.params;
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
    console.error('GetCourseProgress error:', error);
    res.status(500).json({ error: 'Failed to fetch course progress' });
  }
};

// Get quiz with questions
export const getQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;

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
    console.error('GetQuiz error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
};

// Submit quiz attempt
export const submitQuizAttempt = async (req: AuthRequest, res: Response) => {
  try {
    const { quizId } = req.params;
    const userId = req.userId!;
    const { answers } = req.body; // { questionId: selectedOptionIndex }

    // Get quiz with questions and correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
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
    console.error('SubmitQuizAttempt error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
};

// Mark lesson as complete
export const markLessonComplete = async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
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

    // Check if all lessons in course are complete
    const courseLessons = await prisma.lesson.findMany({
      where: { courseId: lesson.courseId },
      select: { id: true }
    });

    const completedLessons = await prisma.progress.count({
      where: {
        userId,
        lessonId: { in: courseLessons.map(l => l.id) },
        completed: true
      }
    });

    // If all lessons complete, mark course as complete
    if (completedLessons === courseLessons.length) {
      await prisma.enrollment.update({
        where: {
          userId_courseId: { userId, courseId: lesson.courseId }
        },
        data: {
          completedAt: new Date()
        }
      });
    }

    res.json({
      message: 'Lesson marked as complete',
      progress,
      courseComplete: completedLessons === courseLessons.length
    });
  } catch (error) {
    console.error('MarkLessonComplete error:', error);
    res.status(500).json({ error: 'Failed to mark lesson as complete' });
  }
};

// Create lesson (admin only)
export const createLesson = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
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
    console.error('CreateLesson error:', error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
};

// Update lesson (admin only)
export const updateLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
    console.error('UpdateLesson error:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
};

// Delete lesson (admin only)
export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.lesson.delete({
      where: { id }
    });

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('DeleteLesson error:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
};
