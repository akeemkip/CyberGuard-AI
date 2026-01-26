import { Router } from 'express';
import {
  getPlatformSettings,
  updatePlatformSettings,
  getSettingsAuditLogs,
  testEmailSettings
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

// GET /api/admin/settings/audit-log - Get settings change audit log
router.get('/audit-log', getSettingsAuditLogs);

// POST /api/admin/settings/test-email - Send test email to verify SMTP
router.post('/test-email', testEmailSettings);

export default router;
