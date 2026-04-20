import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

import { validateEncryptionKey } from './utils/encryption';

// Validate critical env vars early — fail fast if missing
validateEncryptionKey();

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
import feedbackRoutes from './routes/feedback.routes';
import { getPublicSettings } from './controllers/settings.controller';
import { upload, uploadImage, deleteImage } from './controllers/upload.controller';
import { sanitizeBody } from './utils/sanitization';
import { logger } from './utils/logger';
import { csrfProtection, getCsrfToken } from './middleware/csrf.middleware';
import { authenticateToken, requireAdmin } from './middleware/auth.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Trust first proxy (Render, etc.) so rate limiting and req.ip work correctly
app.set('trust proxy', 1);

// Rate limiting configuration
// Sized high for a LAN/classroom deployment where many users share one NAT'd IP.
// These act as a safety net against runaway loops rather than DoS protection.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many AI requests. Please wait a few minutes before trying again.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
// Security headers (X-Frame-Options, CSP, X-Content-Type-Options, etc.)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin for uploaded files
  crossOriginEmbedderPolicy: false, // Allow YouTube iframe embeds
  crossOriginOpenerPolicy: false, // Allow YouTube embed auth/popup flows
  contentSecurityPolicy: false, // Disabled — frontend is a separate SPA, not served from this origin
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }, // Let YouTube see our origin so embeds don't fail with "Error 153"
}));

// CORS configuration - supports comma-separated origins in FRONTEND_URL
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));  // Increased limit for base64 image uploads
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

// Apply CSRF protection to all routes (after this point)
// This protects all POST, PUT, DELETE, PATCH requests
app.use(csrfProtection);

// File upload endpoint (for logo/favicon) - admin only (now CSRF-protected)
app.post('/api/uploads/image', authenticateToken, requireAdmin, upload.single('image'), uploadImage);
app.delete('/api/uploads/:filename', authenticateToken, requireAdmin, deleteImage);

// Routes
// Apply stricter rate limiting to auth routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/phishing', phishingRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/feedback', feedbackRoutes);

// In production, serve the frontend SPA from the backend
// This avoids CSRF cookie cross-domain issues by keeping everything on one origin
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));

  // SPA catch-all: any non-API route returns index.html so client-side routing works
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  // In development, just return 404 for unknown routes (frontend runs on its own dev server)
  app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });
}

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });

  // Check for body-parser errors (payload too large)
  if ((err as any).status === 413 || (err as any).type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request payload too large. Maximum size is 10MB.' });
  }

  // Don't expose error details in production
  const errorMessage = process.env.NODE_ENV === 'production'
    ? 'Something went wrong!'
    : err.message;

  res.status(500).json({ error: errorMessage });
});

// Validate required environment variables at startup
if (!process.env.JWT_SECRET) {
  logger.error('CRITICAL: JWT_SECRET environment variable is not set. Server cannot start.');
  process.exit(1);
}

// Start server — use HTTPS if SSL cert/key are configured, otherwise plain HTTP
const sslCert = process.env.SSL_CERT_PATH;
const sslKey = process.env.SSL_KEY_PATH;

if (sslCert && sslKey) {
  const certPath = path.resolve(__dirname, '..', sslCert);
  const keyPath = path.resolve(__dirname, '..', sslKey);

  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    const httpsOptions = {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath),
    };
    https.createServer(httpsOptions, app).listen(PORT, () => {
      logger.info(`HTTPS server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // HTTP → HTTPS redirect listener on port 80
    http.createServer((req, res) => {
      const host = (req.headers.host || '').replace(/:\d+$/, '');
      res.writeHead(301, { Location: `https://${host}${req.url}` });
      res.end();
    }).listen(80, () => {
      logger.info('HTTP→HTTPS redirect listening on port 80');
    }).on('error', (err) => {
      logger.error(`HTTP redirect listener failed: ${err.message}`);
    });
  } else {
    logger.error(`SSL cert/key not found at ${certPath} / ${keyPath}. Falling back to HTTP.`);
    app.listen(PORT, () => {
      logger.info(`HTTP server running on port ${PORT} (SSL files missing)`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }
} else {
  app.listen(PORT, () => {
    logger.info(`HTTP server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}
