import { Router } from 'express';
import {
  getAdminStats,
  getAllEnrollments,
  getUserStatistics,
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getCourseModules,
  createModule,
  updateModule,
  deleteModule,
  reorderModules,
  assignLessonToModule
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

// GET /api/admin/users/:userId/statistics - Get detailed user statistics
router.get('/users/:userId/statistics', getUserStatistics);

// Quiz Management Routes
// GET /api/admin/quizzes - Get all quizzes with statistics
router.get('/quizzes', getAllQuizzes);

// GET /api/admin/quizzes/:id - Get quiz by ID with full details
router.get('/quizzes/:id', getQuizById);

// POST /api/admin/quizzes - Create new quiz
router.post('/quizzes', createQuiz);

// PUT /api/admin/quizzes/:id - Update quiz
router.put('/quizzes/:id', updateQuiz);

// DELETE /api/admin/quizzes/:id - Delete quiz
router.delete('/quizzes/:id', deleteQuiz);

// Module Management Routes
// GET /api/admin/courses/:courseId/modules - Get all modules for a course
router.get('/courses/:courseId/modules', getCourseModules);

// POST /api/admin/courses/:courseId/modules - Create new module
router.post('/courses/:courseId/modules', createModule);

// PUT /api/admin/courses/:courseId/modules/reorder - Reorder modules (must come before /:id)
router.put('/courses/:courseId/modules/reorder', reorderModules);

// PUT /api/admin/courses/:courseId/modules/:id - Update module
router.put('/courses/:courseId/modules/:id', updateModule);

// DELETE /api/admin/courses/:courseId/modules/:id - Delete module
router.delete('/courses/:courseId/modules/:id', deleteModule);

// PUT /api/admin/courses/:courseId/modules/:moduleId/lessons/:lessonId - Assign lesson to module
router.put('/courses/:courseId/modules/:moduleId/lessons/:lessonId', assignLessonToModule);

export default router;
