import { Router } from 'express';
import { handleChatMessage, handleQuizExplanation, handleLabHint, handleAnalyticsInsights } from '../controllers/ai.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// POST /api/ai/chat - Send message to AI assistant (authenticated users only)
router.post('/chat', authenticateToken, handleChatMessage);

// POST /api/ai/quiz-explanation - Get AI explanation for quiz results
router.post('/quiz-explanation', authenticateToken, handleQuizExplanation);

// POST /api/ai/lab-hint - Get AI hint during lab simulation
router.post('/lab-hint', authenticateToken, handleLabHint);

// POST /api/ai/analytics-insights - Get AI insights for analytics (admin only)
router.post('/analytics-insights', authenticateToken, requireAdmin, handleAnalyticsInsights);

export default router;
