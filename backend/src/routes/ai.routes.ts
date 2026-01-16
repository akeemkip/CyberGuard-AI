import { Router } from 'express';
import { handleChatMessage } from '../controllers/ai.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// POST /api/ai/chat - Send message to AI assistant (authenticated users only)
router.post('/chat', authenticateToken, handleChatMessage);

export default router;
