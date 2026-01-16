import { Request, Response } from 'express';
import { sendChatMessage } from '../services/ai.service';

/**
 * Handle AI chat message endpoint
 * POST /api/ai/chat
 */
export async function handleChatMessage(req: Request, res: Response) {
  try {
    const { message } = req.body;

    // Validate message exists
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    // Call AI service
    const aiResponse = await sendChatMessage(message);

    // Return response
    return res.status(200).json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Controller Error:', error);
    return res.status(500).json({ error: 'Failed to process chat message' });
  }
}
