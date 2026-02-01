import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  checkIntroAssessmentRequired,
  getIntroAssessment,
  submitIntroAssessment,
  checkFullAssessmentEligibility,
  submitFullAssessment,
  getAssessmentHistory
} from '../controllers/assessment.controller';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Intro assessment routes
router.get('/intro/check', checkIntroAssessmentRequired);
router.get('/intro', getIntroAssessment);
router.post('/intro/submit', submitIntroAssessment);

// Full assessment routes
router.get('/full/check-eligibility', checkFullAssessmentEligibility);
router.post('/full/submit', submitFullAssessment);

// Assessment history
router.get('/history', getAssessmentHistory);

export default router;
