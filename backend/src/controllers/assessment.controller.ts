import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Check if user needs to take intro assessment
export const checkIntroAssessmentRequired = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Check if user has already completed intro assessment
    const existingAttempt = await prisma.introAssessmentAttempt.findFirst({
      where: { userId },
      orderBy: { completedAt: 'desc' }
    });

    if (existingAttempt) {
      return res.json({ required: false, completed: true });
    }

    // New users need to take intro assessment
    return res.json({ required: true, completed: false });
  } catch (error) {
    console.error('Error checking intro assessment requirement:', error);
    res.status(500).json({ error: 'Failed to check assessment requirement' });
  }
};

// Get intro assessment with shuffled questions
export const getIntroAssessment = async (req: Request, res: Response) => {
  try {
    // Get the active intro assessment
    const assessment = await prisma.introAssessment.findFirst({
      where: { isActive: true },
      include: {
        questions: {
          include: {
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    if (!assessment) {
      return res.status(404).json({ error: 'No active intro assessment found' });
    }

    // Shuffle questions
    const shuffledQuestions = assessment.questions
      .sort(() => Math.random() - 0.5)
      .map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        courseTitle: q.course.title,
        order: q.order
      }));

    res.json({
      id: assessment.id,
      title: assessment.title,
      description: assessment.description,
      passingScore: assessment.passingScore,
      questions: shuffledQuestions
    });
  } catch (error) {
    console.error('Error fetching intro assessment:', error);
    res.status(500).json({ error: 'Failed to fetch intro assessment' });
  }
};

// Submit intro assessment
export const submitIntroAssessment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { assessmentId, answers } = req.body;

    // Get assessment with questions
    const assessment = await prisma.introAssessment.findUnique({
      where: { id: assessmentId },
      include: { questions: true }
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // Calculate score
    let correctAnswers = 0;
    const detailedAnswers = answers.map((answer: any) => {
      const question = assessment.questions.find(q => q.id === answer.questionId);
      const isCorrect = question && question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) correctAnswers++;

      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question?.correctAnswer,
        isCorrect,
        explanation: question?.explanation
      };
    });

    const totalQuestions = assessment.questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = percentage >= assessment.passingScore;

    // Save attempt
    const attempt = await prisma.introAssessmentAttempt.create({
      data: {
        userId,
        introAssessmentId: assessmentId,
        score: correctAnswers,
        totalQuestions,
        percentage,
        passed,
        answers: detailedAnswers
      }
    });

    res.json({
      attemptId: attempt.id,
      score: correctAnswers,
      totalQuestions,
      percentage,
      passed,
      answers: detailedAnswers
    });
  } catch (error) {
    console.error('Error submitting intro assessment:', error);
    res.status(500).json({ error: 'Failed to submit assessment' });
  }
};

// Check eligibility for full assessment
export const checkFullAssessmentEligibility = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Get phishing detection course
    const phishingCourse = await prisma.course.findFirst({
      where: {
        title: {
          contains: 'Phishing Detection',
          mode: 'insensitive'
        }
      }
    });

    if (!phishingCourse) {
      return res.json({ eligible: false, reason: 'Phishing Detection course not found' });
    }

    // Check if user has completed the phishing course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: phishingCourse.id
        }
      }
    });

    const isCompleted = !!enrollment?.completedAt;

    if (!isCompleted) {
      return res.json({
        eligible: false,
        reason: 'You must complete the Phishing Detection course before taking the full assessment'
      });
    }

    res.json({ eligible: true });
  } catch (error) {
    console.error('Error checking assessment eligibility:', error);
    res.status(500).json({ error: 'Failed to check eligibility' });
  }
};

// Submit full assessment
export const submitFullAssessment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { score, totalQuestions, percentage, passed, timeSpent, timerExpired, answers } = req.body;

    // Save attempt
    const attempt = await prisma.fullAssessmentAttempt.create({
      data: {
        userId,
        score,
        totalQuestions,
        percentage,
        passed,
        timeSpent: timeSpent || null,
        timerExpired: timerExpired || false,
        answers
      }
    });

    res.json({
      attemptId: attempt.id,
      score,
      totalQuestions,
      percentage,
      passed,
      completedAt: attempt.completedAt
    });
  } catch (error) {
    console.error('Error submitting full assessment:', error);
    res.status(500).json({ error: 'Failed to submit assessment' });
  }
};

// Get assessment history for a user
export const getAssessmentHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Get intro assessment attempts
    const introAttempts = await prisma.introAssessmentAttempt.findMany({
      where: { userId },
      include: {
        introAssessment: {
          select: {
            title: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    });

    // Get full assessment attempts
    const fullAttempts = await prisma.fullAssessmentAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' }
    });

    res.json({
      introAttempts: introAttempts.map(a => ({
        id: a.id,
        title: a.introAssessment.title,
        score: a.score,
        totalQuestions: a.totalQuestions,
        percentage: a.percentage,
        passed: a.passed,
        completedAt: a.completedAt,
        type: 'intro'
      })),
      fullAttempts: fullAttempts.map(a => ({
        id: a.id,
        title: 'Full Skills Assessment',
        score: a.score,
        totalQuestions: a.totalQuestions,
        percentage: a.percentage,
        passed: a.passed,
        timeSpent: a.timeSpent,
        timerExpired: a.timerExpired,
        completedAt: a.completedAt,
        type: 'full'
      }))
    });
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    res.status(500).json({ error: 'Failed to fetch assessment history' });
  }
};
