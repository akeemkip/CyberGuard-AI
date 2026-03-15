import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';
import { sendChatMessage, getQuizExplanation, getLabHint, getAnalyticsInsights, getLearningPath, getCourseRecommendations } from '../services/ai.service';

/**
 * Handle AI chat message endpoint
 * POST /api/ai/chat
 */
export async function handleChatMessage(req: AuthRequest, res: Response) {
  try {
    const { message, context } = req.body;
    const userId = req.userId!;

    // Validate message exists
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    // Validate userId (should always exist due to authenticateToken middleware)
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Call AI service with user context and optional lesson context
    const aiResponse = await sendChatMessage(message, userId, context);

    // Return response
    return res.status(200).json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('AI Controller Error:', error);
    return res.status(500).json({ error: 'Failed to process chat message' });
  }
}

/**
 * Handle AI quiz explanation endpoint
 * POST /api/ai/quiz-explanation
 */
export async function handleQuizExplanation(req: AuthRequest, res: Response) {
  try {
    const { quizTitle, questions, results, score, passed } = req.body;

    if (!quizTitle || !Array.isArray(questions) || !Array.isArray(results)) {
      return res.status(400).json({ error: 'quizTitle, questions, and results are required' });
    }

    const explanation = await getQuizExplanation(quizTitle, questions, results, score, passed);

    return res.status(200).json({
      explanation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('AI Quiz Explanation Error:', error);
    return res.status(500).json({ error: 'Failed to generate quiz explanation' });
  }
}

/**
 * Handle AI lab hint endpoint
 * POST /api/ai/lab-hint
 */
export async function handleLabHint(req: AuthRequest, res: Response) {
  try {
    const { labTitle, labType, configSummary, hintNumber } = req.body;

    if (!labTitle || !labType || typeof hintNumber !== 'number') {
      return res.status(400).json({ error: 'labTitle, labType, and hintNumber are required' });
    }

    if (hintNumber < 1 || hintNumber > 3) {
      return res.status(400).json({ error: 'hintNumber must be between 1 and 3' });
    }

    const hint = await getLabHint(labTitle, labType, configSummary || '', hintNumber);

    return res.status(200).json({
      hint,
      hintNumber,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('AI Lab Hint Error:', error);
    return res.status(500).json({ error: 'Failed to generate lab hint' });
  }
}

/**
 * Handle AI analytics insights endpoint
 * POST /api/ai/analytics-insights
 */
export async function handleAnalyticsInsights(req: AuthRequest, res: Response) {
  try {
    const { analyticsData } = req.body;

    if (!analyticsData) {
      return res.status(400).json({ error: 'analyticsData is required' });
    }

    const insights = await getAnalyticsInsights(analyticsData);

    return res.status(200).json({
      insights,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('AI Analytics Insights Error:', error);
    return res.status(500).json({ error: 'Failed to generate analytics insights' });
  }
}

/**
 * Handle AI learning path endpoint
 * POST /api/ai/learning-path
 */
export async function handleLearningPath(req: AuthRequest, res: Response) {
  try {
    const { courseScores, overallScore, passed } = req.body;

    if (!Array.isArray(courseScores) || typeof overallScore !== 'number') {
      return res.status(400).json({ error: 'courseScores and overallScore are required' });
    }

    const learningPath = await getLearningPath(courseScores, overallScore, passed);

    return res.status(200).json({
      learningPath,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('AI Learning Path Error:', error);
    return res.status(500).json({ error: 'Failed to generate learning path' });
  }
}

/**
 * Handle AI course recommendations endpoint
 * GET /api/ai/course-recommendations
 */
export async function handleCourseRecommendations(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const recommendations = await getCourseRecommendations(userId);

    return res.status(200).json({
      recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('AI Course Recommendations Error:', error);
    return res.status(500).json({ error: 'Failed to generate recommendations' });
  }
}
