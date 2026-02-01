import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import courseRoutes from './routes/course.routes';
import adminRoutes from './routes/admin.routes';
import aiRoutes from './routes/ai.routes';
import labRoutes from './routes/lab.routes';
import settingsRoutes from './routes/settings.routes';
import phishingRoutes from './routes/phishing.routes';
import assessmentRoutes from './routes/assessment.routes';
import { getPublicSettings } from './controllers/settings.controller';
import { upload, uploadImage, deleteImage } from './controllers/upload.controller';
import { sanitizeBody } from './utils/sanitization';
import { logger } from './utils/logger';
import { csrfProtection, getCsrfToken } from './middleware/csrf.middleware';
import { authenticateToken } from './middleware/auth.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
// CORS configuration - supports comma-separated origins in FRONTEND_URL
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Sanitize request body to prevent XSS attacks
// Fields that allow rich text (HTML): description, content
app.use(sanitizeBody(['description', 'content', 'instructions']));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CyberGuard API is running' });
});

// Public settings endpoint (no auth required)
app.get('/api/settings/public', getPublicSettings);

// CSRF token endpoint (requires authentication)
app.get('/api/csrf-token', authenticateToken, getCsrfToken);

// File upload endpoint (for logo/favicon)
app.post('/api/uploads/image', upload.single('image'), uploadImage);
app.delete('/api/uploads/:filename', deleteImage);

// Apply CSRF protection to all routes (after this point)
// This protects all POST, PUT, DELETE, PATCH requests
app.use(csrfProtection);

// Routes
// Apply stricter rate limiting to auth routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/phishing', phishingRoutes);
app.use('/api/assessment', assessmentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });

  // Don't expose error details in production
  const errorMessage = process.env.NODE_ENV === 'production'
    ? 'Something went wrong!'
    : err.message;

  res.status(500).json({ error: errorMessage });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/api/health`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
