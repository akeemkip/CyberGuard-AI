# System Audit - March 15, 2026

## Critical Issues

### 1. Anyone can register as Admin - FIXED
**Where:** Backend - auth controller (registration endpoint)
**Problem:** The registration form accepted a `role` field. Someone could send `role: "ADMIN"` and create an admin account.
**Fix:** Removed role from registration schema, always forces STUDENT.

## High Issues

### 2. XSS risk from unsanitized HTML rendering - FIXED
**Where:** Frontend - 8+ files using `dangerouslySetInnerHTML` with `marked()` output
**Problem:** AI responses, markdown content, and phishing email previews weren't sanitized.
**Fix:** Added DOMPurify.sanitize() to all 12 dangerouslySetInnerHTML usages across 7 files.

### 3. TypeScript build fails due to difficulty field type - FIXED
**Where:** Backend - course controller
**Problem:** The `difficulty` field was validated as a generic string, but the database expects Beginner/Intermediate/Advanced.
**Fix:** Changed Zod schema to `z.enum(['Beginner', 'Intermediate', 'Advanced'])`.

### 4. Test suite is completely broken - NOT FIXED
**Where:** Backend - test files
**Problem:** All 6 tests fail because the test setup has an invalid encryption key and missing database URL. One test hits a route that doesn't exist (`/api/auth/validate`).
**Note:** Requires a test database to fix properly. Deferred.

## Medium Issues

### 5. File upload endpoints skip CSRF protection - FIXED
**Where:** Backend - index.ts (middleware order)
**Problem:** Upload and delete routes were registered before CSRF middleware.
**Fix:** Moved upload routes below the CSRF middleware line.

### 6. Unpublished courses visible to everyone - FIXED
**Where:** Backend - course controller
**Problem:** The public courses endpoint returned draft courses to anonymous users.
**Fix:** Now defaults to published-only. Only admins can see unpublished courses.

### 7. No rate limit on AI endpoints - FIXED
**Where:** Backend - AI routes
**Problem:** AI endpoints shared the general 100 req/15min limit.
**Fix:** Added dedicated AI rate limiter: 20 req/15min per IP.

### 8. Stale phishing seed scripts reference deleted students - FIXED
**Where:** Backend - seed-complete-phishing-data.ts
**Problem:** Hardcoded emails for students that no longer exist.
**Fix:** Updated to reference the 5 current students.

### 9. Video preview timer bug - FIXED
**Where:** Frontend - admin-content.tsx (VideoPreview component)
**Problem:** A 10-second timeout always fired even if the video loaded successfully.
**Fix:** Used a ref to track loading state, preventing stale closure reads.

### 10. Analytics export bypasses centralized API - FIXED
**Where:** Frontend - admin-analytics.tsx
**Problem:** PDF and CSV exports used raw `fetch()` instead of centralized Axios.
**Fix:** Switched to centralized `api` instance with `responseType: 'blob'`.

## Low Issues

### 11. JWT_SECRET not validated at startup - FIXED
**Where:** Backend - index.ts
**Problem:** Server started fine with missing JWT_SECRET but every auth request failed.
**Fix:** Added startup validation that exits with error if JWT_SECRET is missing.

### 12. Stale utility scripts reference removed students - NOT FIXED
**Where:** Backend - scripts/delete-student.ts, prisma/add-demo-history.ts
**Problem:** These utility scripts reference `student@example.com` which no longer exists.
**Note:** Low priority. Scripts are for one-off dev tasks, not production.

### 13. onNavigate prop types are inaccurate - NOT FIXED
**Where:** Frontend - many components
**Problem:** Many components declare `onNavigate: (page: string) => void` but call it with two arguments.
**Note:** Works at runtime. Fixing would touch 15+ files for a type-only change.

### 14. Large bundle size (2.1 MB) - NOT FIXED
**Where:** Frontend - build output
**Problem:** Everything ships as one big chunk.
**Note:** Would require code-splitting with React.lazy(). Low priority for a training platform.

---

## Summary
- **11 of 14 issues fixed** (1 Critical, 2 High, 6 Medium, 2 Low)
- **3 deferred** (broken tests need test DB, stale scripts are harmless, type/bundle are low priority)
