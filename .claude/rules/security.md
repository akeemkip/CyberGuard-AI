# Backend Security Patterns

## CSRF Protection
- **Pattern**: Double-submit cookie + server-side token store
- **Location**: `backend/src/middleware/csrf.middleware.ts`
- **Token**: 32-byte random, 24-hour expiry, stored in-memory Map
- **Validation**: header `x-csrf-token` must match cookie `csrf-token` AND server store
- **Safe methods**: GET, HEAD, OPTIONS bypass CSRF
- **Exempted paths**: `/api/health`, `/api/auth/login`, `/api/auth/register`, `/api/settings/public`
- Cookie: `httpOnly: false` (JS needs access for double-submit), `sameSite: strict`, `secure: true` in prod

## Rate Limiting
- General: 100 req / 15 min on all `/api/` routes
- Auth: 10 req / 15 min on `/api/auth/*` routes
- Library: `express-rate-limit`

## Input Sanitization
- **Location**: `backend/src/utils/sanitization.ts`
- `sanitizeBody()` middleware applied globally to `/api/` routes
- Default: strips ALL HTML from string fields
- **Rich text fields exempted**: `description`, `content`, `instructions` — these allow safe tags (b, i, em, strong, p, br, ul, ol, li, a)
- **Skipped fields**: `password`, `token`, `secret` (never sanitized)

## Auth
- JWT via `Authorization: Bearer <token>` header
- Token contains `userId` and `role` claims
- Session timeout from `PlatformSettings.sessionTimeout` (default 7d)
- `authenticateToken` middleware sets `req.userId`, `req.userRole`, `req.userEmail`
- `requireAdmin` middleware checks `req.userRole === 'ADMIN'`

## Account Security
- Lockout after `maxLoginAttempts` (default 5) failed attempts
- 15-minute lockout duration
- bcryptjs 10 rounds for password hashing
- Password: min 8 chars, requires uppercase + lowercase + number + special char
- Complexity configurable via `PlatformSettings.minPasswordLength`

## Middleware Order (index.ts)
1. CORS → 2. JSON parsing (10MB) → 3. Cookie parsing → 4. Sanitization → 5. Rate limiting → 6. CSRF → 7. Routes
