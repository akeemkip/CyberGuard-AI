import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  getActiveSurvey,
  getFeedbackStatus,
  submitFeedback
} from '../controllers/feedback.controller';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/feedback/survey - Get active survey with questions
router.get('/survey', getActiveSurvey);

// GET /api/feedback/status - Check if user has submitted feedback
router.get('/status', getFeedbackStatus);

// POST /api/feedback/submit - Submit feedback
router.post('/submit', submitFeedback);

export default router;
