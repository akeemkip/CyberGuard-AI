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
  submitQuizAttempt,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  getCourseLabs
} from '../controllers/course.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getAllCourses);
// /:id route with reserved path handling
router.get('/:id', (req, res, next) => {
  // Skip to protected routes if this is a reserved path
  const reservedPaths = ['enrolled', 'quiz', 'lessons'];
  if (reservedPaths.includes(req.params.id)) {
    return next('route'); // Skip this route handler
  }
  return getCourseById(req, res);
});

// Protected routes (require authentication)
router.use(authenticateToken);

// Student routes
// IMPORTANT: Specific routes must come before parameterized routes
router.get('/enrolled/my-courses', getEnrolledCourses);
router.post('/:id/enroll', enrollInCourse);
router.get('/:id/progress', getCourseProgress);
router.post('/lessons/:lessonId/complete', markLessonComplete);

// Quiz routes
router.get('/quiz/:quizId', getQuiz);
router.post('/quiz/:quizId/submit', submitQuizAttempt);

// Lab routes
router.get('/:courseId/labs', getCourseLabs);

// Admin routes
router.post('/', requireAdmin, createCourse);
router.put('/:id', requireAdmin, updateCourse);
router.delete('/:id', requireAdmin, deleteCourse);

// Lesson management (admin only)
router.get('/lessons/:id', requireAdmin, getLessonById);
router.post('/:courseId/lessons', requireAdmin, createLesson);
router.put('/lessons/:id', requireAdmin, updateLesson);
router.delete('/lessons/:id', requireAdmin, deleteLesson);

export default router;
