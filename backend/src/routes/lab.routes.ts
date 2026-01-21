import { Router } from 'express';
import {
  getLabForStudent,
  startLab,
  completeLab,
  updateLabNotes,
  submitLabSimulation
} from '../controllers/course.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All lab routes require authentication
router.use(authenticateToken);

// GET /api/labs/:id - Get lab details for student
router.get('/:id', getLabForStudent);

// POST /api/labs/:id/start - Mark lab as started
router.post('/:id/start', startLab);

// POST /api/labs/:id/submit - Submit simulation results (for interactive labs)
router.post('/:id/submit', submitLabSimulation);

// PUT /api/labs/:id/complete - Mark lab as completed (for content labs)
router.put('/:id/complete', completeLab);

// PUT /api/labs/:id/notes - Update lab notes
router.put('/:id/notes', updateLabNotes);

export default router;
