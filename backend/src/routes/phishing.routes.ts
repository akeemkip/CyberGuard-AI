import { Router } from 'express';
import {
  getNextScenario,
  submitAttempt,
  getStats,
  getHistory
} from '../controllers/phishing.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All phishing routes require authentication
router.use(authenticateToken);

// GET /api/phishing/scenario - Get next scenario (prioritizes unseen, then failed)
router.get('/scenario', getNextScenario);

// POST /api/phishing/attempt - Submit attempt
router.post('/attempt', submitAttempt);

// GET /api/phishing/stats - Get user's phishing stats
router.get('/stats', getStats);

// GET /api/phishing/history - Get attempt history
router.get('/history', getHistory);

export default router;
