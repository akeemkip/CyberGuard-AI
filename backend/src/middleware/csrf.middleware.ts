import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';

// Store for CSRF tokens (in production, use Redis or database)
const tokenStore = new Map<string, { token: string; expiresAt: number }>();

// Clean up expired tokens every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of tokenStore.entries()) {
    if (value.expiresAt < now) {
      tokenStore.delete(key);
    }
  }
}, 60 * 60 * 1000);

/**
 * Generate a CSRF token for a user session
 */
export const generateCsrfToken = (userId: string): string => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

  tokenStore.set(userId, { token, expiresAt });

  return token;
};

/**
 * Validate CSRF token from request
 */
const validateCsrfToken = (userId: string, token: string): boolean => {
  const stored = tokenStore.get(userId);

  if (!stored) {
    return false;
  }

  if (stored.expiresAt < Date.now()) {
    tokenStore.delete(userId);
    return false;
  }

  return stored.token === token;
};

/**
 * Middleware to protect against CSRF attacks
 * Uses double-submit cookie pattern with additional header validation
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF check for safe methods (GET, HEAD, OPTIONS)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip CSRF for health check and public endpoints
  const publicPaths = ['/api/health', '/api/auth/login', '/api/auth/register', '/api/settings/public'];
  if (publicPaths.some(path => req.path === path)) {
    return next();
  }

  const userId = (req as any).userId;

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
    return res.status(403).json({
      error: 'CSRF token required',
      message: 'CSRF token missing from request header'
    });
  }

  if (!csrfTokenFromCookie) {
    logger.warn('CSRF token missing from cookie', {
      userId,
      path: req.path,
      method: req.method
    });
    return res.status(403).json({
      error: 'CSRF token required',
      message: 'CSRF token missing from cookie'
    });
  }

  // Validate that header and cookie match (double-submit pattern)
  if (csrfTokenFromHeader !== csrfTokenFromCookie) {
    logger.warn('CSRF token mismatch', {
      userId,
      path: req.path,
      method: req.method
    });
    return res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'CSRF token mismatch'
    });
  }

  // Validate token from server-side store
  if (!validateCsrfToken(userId, csrfTokenFromHeader)) {
    logger.warn('CSRF token validation failed', {
      userId,
      path: req.path,
      method: req.method
    });
    return res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'CSRF token is invalid or expired'
    });
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
      return res.status(403).json({
        error: 'Invalid origin',
        message: 'Request origin not allowed'
      });
    }
  }

  next();
};

/**
 * Endpoint to get CSRF token (requires authentication)
 */
export const getCsrfToken = (req: Request, res: Response) => {
  const userId = (req as any).userId;

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
