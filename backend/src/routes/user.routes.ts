import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/user.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/users - Get all users (admin only)
router.get('/', requireAdmin, getAllUsers);

// GET /api/users/stats - Get current user's stats
router.get('/stats', getUserStats);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// PUT /api/users/:id - Update user
router.put('/:id', updateUser);

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', requireAdmin, deleteUser);

export default router;
