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
    const id = req.params.id as string;

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
    console.error('UpdateCourse error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

// Delete course (admin only)
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

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
    console.error('GetCourseProgress error:', error);
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
    console.error('GetQuiz error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
};

// Submit quiz attempt
export const submitQuizAttempt = async (req: AuthRequest, res: Response) => {
  try {
    const quizId = req.params.quizId as string;
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

// Get lesson by ID (admin only)
export const getLessonById = async (req: Request, res: Response) => {
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
    console.error('GetLessonById error:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
};

// Create lesson (admin only)
export const createLesson = async (req: Request, res: Response) => {
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
    console.error('CreateLesson error:', error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
};

// Update lesson (admin only)
export const updateLesson = async (req: Request, res: Response) => {
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
    console.error('UpdateLesson error:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
};

// Delete lesson (admin only)
export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await prisma.lesson.delete({
      where: { id }
    });

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('DeleteLesson error:', error);
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
    console.error('GetCourseLabs error:', error);
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
        instructions: lab.instructions,
        scenario: lab.scenario,
        objectives: lab.objectives,
        resources: lab.resources,
        hints: lab.hints,
        difficulty: lab.difficulty,
        estimatedTime: lab.estimatedTime,
        courseId: lab.courseId,
        courseTitle: lab.course.title,
        moduleId: lab.moduleId,
        moduleTitle: lab.module?.title || null
      },
      progress: userProgress ? {
        status: userProgress.status,
        timeSpent: userProgress.timeSpent,
        notes: userProgress.notes,
        startedAt: userProgress.startedAt,
        completedAt: userProgress.completedAt
      } : null
    });
  } catch (error) {
    console.error('GetLabForStudent error:', error);
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
    console.error('StartLab error:', error);
    res.status(500).json({ error: 'Failed to start lab' });
  }
};

// Complete lab
export const completeLab = async (req: AuthRequest, res: Response) => {
  try {
    const labId = req.params.id as string;
    const userId = req.userId!;
    const { timeSpent, notes } = req.body;

    // Validate inputs
    if (typeof timeSpent !== 'number' || timeSpent < 0) {
      return res.status(400).json({ error: 'Valid time spent is required' });
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

    // Update progress
    const progress = await prisma.labProgress.upsert({
      where: {
        userId_labId: { userId, labId }
      },
      update: {
        status: 'COMPLETED',
        timeSpent,
        notes: notes || null,
        completedAt: new Date()
      },
      create: {
        userId,
        labId,
        status: 'COMPLETED',
        timeSpent,
        notes: notes || null,
        startedAt: new Date(),
        completedAt: new Date()
      }
    });

    res.json({
      message: 'Lab marked as complete',
      progress: {
        status: progress.status,
        timeSpent: progress.timeSpent,
        completedAt: progress.completedAt
      }
    });
  } catch (error) {
    console.error('CompleteLab error:', error);
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
    console.error('UpdateLabNotes error:', error);
    res.status(500).json({ error: 'Failed to update lab notes' });
  }
};
