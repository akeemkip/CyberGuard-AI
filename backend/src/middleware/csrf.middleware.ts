import { Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AuthRequest } from './auth.middleware';
import { logger } from '../utils/logger';

const CSRF_SECRET = process.env.JWT_SECRET || 'csrf-fallback-secret';
const TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate an HMAC-signed CSRF token for a user.
 * Token format: base64(timestamp.hmac)
 * No server-side storage needed — the token is self-verifying.
 */
export const generateCsrfToken = (userId: string): string => {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(`${userId}.${timestamp}`)
    .digest('hex');
  // Encode as base64 so the token is a single opaque string
  return Buffer.from(`${timestamp}.${signature}`).toString('base64');
};

/**
 * Validate an HMAC-signed CSRF token.
 * Recomputes the signature and checks expiry — no storage lookup needed.
 */
const validateCsrfToken = (userId: string, token: string): boolean => {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const dotIndex = decoded.indexOf('.');
    if (dotIndex === -1) return false;

    const timestamp = decoded.substring(0, dotIndex);
    const signature = decoded.substring(dotIndex + 1);

    // Check expiry
    const tokenAge = Date.now() - parseInt(timestamp, 10);
    if (isNaN(tokenAge) || tokenAge > TOKEN_MAX_AGE_MS || tokenAge < 0) {
      return false;
    }

    // Recompute and compare signature
    const expectedSignature = crypto
      .createHmac('sha256', CSRF_SECRET)
      .update(`${userId}.${timestamp}`)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false;
  }
};

/**
 * Middleware to protect against CSRF attacks
 * Uses double-submit cookie pattern with additional header validation
 */
export const csrfProtection = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Skip CSRF check for safe methods (GET, HEAD, OPTIONS)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip CSRF for health check and public endpoints
  const publicPaths = ['/api/health', '/api/auth/login', '/api/auth/register', '/api/settings/public'];
  if (publicPaths.some(path => req.path === path)) {
    return next();
  }

  const userId = req.userId;

  // If no user ID, skip CSRF (authentication will handle it)
  if (!userId) {
    return next();
  }

  // Get CSRF token from header
  const csrfTokenFromHeader = req.headers['x-csrf-token'] as string;

  // Get CSRF token from cookie (double-submit pattern)
  const csrfTokenFromCookie = req.cookies?.['csrf-token'];

  if (!csrfTokenFromHeader) {
    logger.warn('CSRF token missing from header', {
      userId,
      path: req.path,
      method: req.method
    });
    return res.status(403).json({ error: 'CSRF token missing from request header' });
  }

  if (!csrfTokenFromCookie) {
    logger.warn('CSRF token missing from cookie', {
      userId,
      path: req.path,
      method: req.method
    });
    return res.status(403).json({ error: 'CSRF token missing from cookie' });
  }

  // Validate that header and cookie match (double-submit pattern)
  if (csrfTokenFromHeader !== csrfTokenFromCookie) {
    logger.warn('CSRF token mismatch', {
      userId,
      path: req.path,
      method: req.method
    });
    return res.status(403).json({ error: 'CSRF token mismatch' });
  }

  // Validate token signature and expiry
  if (!validateCsrfToken(userId, csrfTokenFromHeader)) {
    logger.warn('CSRF token validation failed', {
      userId,
      path: req.path,
      method: req.method
    });
    return res.status(403).json({ error: 'CSRF token is invalid or expired' });
  }

  // Additional security: Verify Origin/Referer header
  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigins = process.env.FRONTEND_URL?.split(',').map(url => url.trim()) || ['http://localhost:5173'];

  if (origin) {
    const originUrl = new URL(origin);
    const isAllowed = allowedOrigins.some(allowed => {
      try {
        const allowedUrl = new URL(allowed);
        return originUrl.origin === allowedUrl.origin;
      } catch {
        return false;
      }
    });

    if (!isAllowed) {
      logger.warn('CSRF: Invalid origin', {
        userId,
        origin,
        path: req.path
      });
      return res.status(403).json({ error: 'Request origin not allowed' });
    }
  }

  next();
};

/**
 * Endpoint to get CSRF token (requires authentication)
 */
export const getCsrfToken = (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = generateCsrfToken(userId);

  // Set token in cookie (httpOnly for security)
  res.cookie('csrf-token', token, {
    httpOnly: false, // Must be accessible by JavaScript for double-submit pattern
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.json({ csrfToken: token });
};
