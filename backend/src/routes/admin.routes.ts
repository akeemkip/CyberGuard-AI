import { Router } from 'express';
import {
  getAdminStats,
  getAllEnrollments
} from '../controllers/admin.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/stats - Get admin dashboard stats
router.get('/stats', getAdminStats);

// GET /api/admin/enrollments - Get all enrollments
router.get('/enrollments', getAllEnrollments);

export default router;
