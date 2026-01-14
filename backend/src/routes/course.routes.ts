import { Router } from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getEnrolledCourses,
  getCourseProgress,
  markLessonComplete,
  getQuiz,
  submitQuizAttempt
} from '../controllers/course.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes (require authentication)
router.use(authenticateToken);

// Student routes
router.post('/:id/enroll', enrollInCourse);
router.get('/enrolled/my-courses', getEnrolledCourses);
router.get('/:id/progress', getCourseProgress);
router.post('/lessons/:lessonId/complete', markLessonComplete);

// Quiz routes
router.get('/quiz/:quizId', getQuiz);
router.post('/quiz/:quizId/submit', submitQuizAttempt);

// Admin routes
router.post('/', requireAdmin, createCourse);
router.put('/:id', requireAdmin, updateCourse);
router.delete('/:id', requireAdmin, deleteCourse);

export default router;
