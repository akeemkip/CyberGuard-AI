import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  changeUserRole,
  deleteUser,
  getUserStats
} from '../controllers/user.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/users - Create new user (admin only)
router.post('/', requireAdmin, createUser);

// GET /api/users - Get all users (admin only)
router.get('/', requireAdmin, getAllUsers);

// GET /api/users/stats - Get current user's stats
router.get('/stats', getUserStats);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// PUT /api/users/:id - Update user
router.put('/:id', updateUser);

// PUT /api/users/:id/role - Change user role (admin only)
router.put('/:id/role', requireAdmin, changeUserRole);

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', requireAdmin, deleteUser);

export default router;
