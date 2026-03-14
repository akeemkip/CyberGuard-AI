import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';
import { sendChatMessage } from '../services/ai.service';

/**
 * Handle AI chat message endpoint
 * POST /api/ai/chat
 */
export async function handleChatMessage(req: AuthRequest, res: Response) {
  try {
    const { message } = req.body;
    const userId = req.userId!;

    // Validate message exists
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    // Validate userId (should always exist due to authenticateToken middleware)
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Call AI service with user context
    const aiResponse = await sendChatMessage(message, userId);

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
