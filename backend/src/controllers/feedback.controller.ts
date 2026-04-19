import { Request, Response } from 'express';
import prisma from '../config/database';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /api/feedback/survey - Get active survey with questions
export const getActiveSurvey = async (req: Request, res: Response) => {
  try {
    const survey = await prisma.susSurvey.findFirst({
      where: { isActive: true },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!survey) {
      return res.status(404).json({ error: 'No active feedback survey found' });
    }

    res.json({ survey });
  } catch (error) {
    logger.error('Error fetching survey:', error);
    res.status(500).json({ error: 'Failed to fetch survey' });
  }
};

// GET /api/feedback/status - Check if user has already submitted feedback
export const getFeedbackStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const survey = await prisma.susSurvey.findFirst({
      where: { isActive: true }
    });

    if (!survey) {
      return res.json({ hasSubmitted: false, lastSubmittedAt: null });
    }

    const lastResponse = await prisma.susResponse.findFirst({
      where: { userId, surveyId: survey.id },
      orderBy: { completedAt: 'desc' }
    });

    res.json({
      hasSubmitted: !!lastResponse,
      lastSubmittedAt: lastResponse?.completedAt || null
    });
  } catch (error) {
    logger.error('Error checking feedback status:', error);
    res.status(500).json({ error: 'Failed to check feedback status' });
  }
};

// POST /api/feedback/submit - Submit feedback response
const submitSchema = z.object({
  surveyId: z.string().uuid(),
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    rating: z.number().int().min(1).max(5)
  }))
});

export const submitFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const parsed = submitSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.errors });
    }

    const { surveyId, answers } = parsed.data;

    // Verify survey exists and is active
    const survey = await prisma.susSurvey.findFirst({
      where: { id: surveyId, isActive: true },
      include: { questions: { orderBy: { order: 'asc' } } }
    });

    if (!survey) {
      return res.status(404).json({ error: 'Survey not found or inactive' });
    }

    // Verify all questions are answered
    if (answers.length !== survey.questions.length) {
      return res.status(400).json({ error: 'All questions must be answered' });
    }

    // Calculate SUS score (adapted for 5 questions)
    // Positive questions: score = rating - 1
    // Negative questions: score = 5 - rating
    // Sum adjusted scores, multiply by 5 to get 0-100 scale
    let adjustedSum = 0;
    for (const answer of answers) {
      const question = survey.questions.find(q => q.id === answer.questionId);
      if (!question) {
        return res.status(400).json({ error: `Invalid question ID: ${answer.questionId}` });
      }
      if (question.isPositive) {
        adjustedSum += answer.rating - 1;
      } else {
        adjustedSum += 5 - answer.rating;
      }
    }
    // Normalize to 0-100 scale regardless of question count
    // Each question contributes 0-4 adjusted points, so max raw = numQuestions * 4
    const susScore = Math.round(((adjustedSum / (survey.questions.length * 4)) * 100) * 10) / 10;

    const response = await prisma.susResponse.create({
      data: {
        userId,
        surveyId,
        answers,
        susScore
      }
    });

    res.status(201).json({ susScore: response.susScore, id: response.id });
  } catch (error) {
    logger.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

// GET /api/admin/feedback/results - Get aggregated feedback results (admin only)
export const getFeedbackResults = async (req: Request, res: Response) => {
  try {
    const survey = await prisma.susSurvey.findFirst({
      where: { isActive: true },
      include: {
        questions: { orderBy: { order: 'asc' } }
      }
    });

    if (!survey) {
      return res.status(404).json({ error: 'No active survey found' });
    }

    // Count only students (exclude admins) for response rate
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });

    const allResponses = await prisma.susResponse.findMany({
      where: { surveyId: survey.id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } }
      },
      orderBy: { completedAt: 'desc' }
    });

    // Deduplicate: keep only the latest response per student
    const seen = new Set<string>();
    const responses = allResponses.filter(r => {
      if (seen.has(r.userId)) return false;
      seen.add(r.userId);
      return true;
    });

    const totalResponses = responses.length;

    if (totalResponses === 0) {
      return res.json({
        survey: { id: survey.id, title: survey.title },
        totalResponses: 0,
        totalStudents,
        averageSusScore: 0,
        perQuestionAverages: survey.questions.map(q => ({
          questionId: q.id,
          question: q.question,
          isPositive: q.isPositive,
          order: q.order,
          averageRating: 0
        })),
        scoreDistribution: [],
        recentResponses: []
      });
    }

    // Average SUS score
    const averageSusScore = responses.reduce((sum, r) => sum + r.susScore, 0) / totalResponses;

    // Per-question averages
    const questionRatings: Record<string, number[]> = {};
    for (const response of responses) {
      const answers = response.answers as { questionId: string; rating: number }[];
      for (const answer of answers) {
        if (!questionRatings[answer.questionId]) {
          questionRatings[answer.questionId] = [];
        }
        questionRatings[answer.questionId].push(answer.rating);
      }
    }

    const perQuestionAverages = survey.questions.map(q => ({
      questionId: q.id,
      question: q.question,
      isPositive: q.isPositive,
      order: q.order,
      averageRating: questionRatings[q.id]
        ? questionRatings[q.id].reduce((a, b) => a + b, 0) / questionRatings[q.id].length
        : 0
    }));

    // Score distribution buckets
    const buckets = [
      { range: '0-25 (Poor)', min: 0, max: 25, count: 0 },
      { range: '26-50 (Below Avg)', min: 26, max: 50, count: 0 },
      { range: '51-68 (Average)', min: 51, max: 68, count: 0 },
      { range: '69-80 (Good)', min: 69, max: 80, count: 0 },
      { range: '81-100 (Excellent)', min: 81, max: 100, count: 0 }
    ];

    for (const response of responses) {
      for (const bucket of buckets) {
        if (response.susScore >= bucket.min && response.susScore <= bucket.max) {
          bucket.count++;
          break;
        }
      }
    }

    // Recent responses
    const recentResponses = responses.slice(0, 20).map(r => ({
      userId: r.user.id,
      firstName: r.user.firstName,
      lastName: r.user.lastName,
      email: r.user.email,
      susScore: r.susScore,
      completedAt: r.completedAt
    }));

    res.json({
      survey: { id: survey.id, title: survey.title },
      totalResponses,
      totalStudents,
      averageSusScore: Math.round(averageSusScore * 10) / 10,
      perQuestionAverages,
      scoreDistribution: buckets.map(b => ({ range: b.range, count: b.count })),
      recentResponses
    });
  } catch (error) {
    logger.error('Error fetching feedback results:', error);
    res.status(500).json({ error: 'Failed to fetch feedback results' });
  }
};

// ============================================
// Admin Survey Management Endpoints
// ============================================

// GET /api/admin/feedback/surveys - List all surveys with question & response counts
export const getAllSurveys = async (req: Request, res: Response) => {
  try {
    const surveys = await prisma.susSurvey.findMany({
      include: {
        questions: { orderBy: { order: 'asc' } },
        _count: { select: { responses: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ surveys });
  } catch (error) {
    logger.error('Error fetching surveys:', error);
    res.status(500).json({ error: 'Failed to fetch surveys' });
  }
};

// PUT /api/admin/feedback/surveys/:id - Update survey metadata
const updateSurveySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200).optional(),
  description: z.string().max(500).nullable().optional(),
  isActive: z.boolean().optional()
});

export const updateSurvey = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = updateSurveySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.errors });
    }

    const existing = await prisma.susSurvey.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    // If activating this survey, deactivate all others
    if (parsed.data.isActive === true) {
      await prisma.susSurvey.updateMany({
        where: { id: { not: id } },
        data: { isActive: false }
      });
    }

    const survey = await prisma.susSurvey.update({
      where: { id },
      data: parsed.data,
      include: {
        questions: { orderBy: { order: 'asc' } },
        _count: { select: { responses: true } }
      }
    });

    res.json({ message: 'Survey updated', survey });
  } catch (error) {
    logger.error('Error updating survey:', error);
    res.status(500).json({ error: 'Failed to update survey' });
  }
};

// POST /api/admin/feedback/questions - Add a question to a survey
const createQuestionSchema = z.object({
  surveyId: z.string().uuid(),
  question: z.string().min(5, 'Question must be at least 5 characters').max(500),
  isPositive: z.boolean(),
  order: z.number().int().min(0)
});

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const parsed = createQuestionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.errors });
    }

    const survey = await prisma.susSurvey.findUnique({ where: { id: parsed.data.surveyId } });
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    const question = await prisma.susQuestion.create({ data: parsed.data });
    res.status(201).json({ message: 'Question created', question });
  } catch (error) {
    logger.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
};

// PUT /api/admin/feedback/questions/:id - Update a question
const updateQuestionSchema = z.object({
  question: z.string().min(5).max(500).optional(),
  isPositive: z.boolean().optional(),
  order: z.number().int().min(0).optional()
});

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = updateQuestionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.errors });
    }

    const existing = await prisma.susQuestion.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const question = await prisma.susQuestion.update({
      where: { id },
      data: parsed.data
    });

    res.json({ message: 'Question updated', question });
  } catch (error) {
    logger.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
};

// DELETE /api/admin/feedback/questions/:id - Delete a question
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.susQuestion.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Question not found' });
    }

    await prisma.susQuestion.delete({ where: { id } });
    res.json({ message: 'Question deleted' });
  } catch (error) {
    logger.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
};

// PUT /api/admin/feedback/questions/reorder - Reorder questions
const reorderQuestionsSchema = z.object({
  questionOrders: z.array(z.object({
    id: z.string().uuid(),
    order: z.number().int().min(0)
  }))
});

export const reorderQuestions = async (req: Request, res: Response) => {
  try {
    const parsed = reorderQuestionsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.errors });
    }

    await prisma.$transaction(
      parsed.data.questionOrders.map(({ id, order }) =>
        prisma.susQuestion.update({ where: { id }, data: { order } })
      )
    );

    res.json({ message: 'Questions reordered' });
  } catch (error) {
    logger.error('Error reordering questions:', error);
    res.status(500).json({ error: 'Failed to reorder questions' });
  }
};
