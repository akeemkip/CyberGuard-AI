import { Router } from 'express';
import {
  getPlatformSettings,
  updatePlatformSettings
} from '../controllers/settings.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/settings - Get platform settings
router.get('/', getPlatformSettings);

// PUT /api/admin/settings - Update platform settings
router.put('/', updatePlatformSettings);

export default router;
