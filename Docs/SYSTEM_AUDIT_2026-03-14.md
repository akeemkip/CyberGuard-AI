# CyberGuard-AI System Audit — March 14, 2026 (Round 2)

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Fixed

---

## Critical Issues

### 1. No existence check before deletes
- **Status**: [x]
- **Files**: `backend/src/controllers/user.controller.ts:246`, `backend/src/controllers/course.controller.ts:150,707`, `backend/src/controllers/admin.controller.ts:1554,1748,2363,2705`
- **Description**: Delete operations for users, courses, lessons, quizzes, modules, labs, and phishing scenarios return 200 even for non-existent IDs. No explicit existence check or proper Prisma error handling.

### 2. Admin can delete themselves
- **Status**: [x]
- **File**: `backend/src/controllers/user.controller.ts:246-260`
- **Description**: No self-deletion guard. An admin could accidentally delete their own account.

### 3. N+1 query patterns
- **Status**: [x]
- **Files**: `backend/src/controllers/course.controller.ts:254-295`
- **Description**: `getEnrolledCourses` ran 2N extra DB queries per enrollment. Fixed by batching into 2 total queries using Sets for O(1) lookup. Admin stats was a false positive — it uses `include` to eager-load in one query.

### 4. Missing database indexes
- **Status**: [x]
- **File**: `backend/prisma/schema.prisma`
- **Description**: Missing indexes on frequently queried foreign keys:
  - `Question.quizId`
  - `Module.courseId`
  - `Lesson.courseId`
  - `Lab.courseId`
  - `Progress.userId`
  - `QuizAttempt.userId`
  - `LabProgress.userId`, `LabProgress.labId`
  - `PhishingAttempt.userId`, `PhishingAttempt.scenarioId`
  - `IntroAssessmentAttempt.userId`

---

## High Priority

### 5. Fire-and-forget emails
- **Status**: [x]
- **File**: `backend/src/controllers/course.controller.ts:564-568`
- **Description**: Course completion emails sent via `setImmediate()` with no retry or error handling.

### 6. Unvalidated API response structures on frontend
- **Status**: [x]
- **Files**: `frontend/src/app/components/ai-chat.tsx:77-99`, `frontend/src/app/services/course.service.ts:300-311`
- **Description**: Frontend accesses nested response properties without null/undefined checks. Could crash on unexpected responses.

### 7. Silent failures on frontend
- **Status**: [x]
- **Files**: `frontend/src/app/components/admin-analytics.tsx:123-159`, `frontend/src/app/components/course-catalog.tsx:50-68`, `frontend/src/app/services/api.ts:33-36`
- **Description**: Analytics fetch and course catalog load swallowed errors without user notification. Fixed with toast.error(). CSRF token fetch in api.ts left as-is — if it fails, the subsequent mutation returns 403 which surfaces to the caller naturally.

### 8. Async state updates after unmount
- **Status**: [x]
- **Files**: `frontend/src/app/App.tsx:197-239`, `frontend/src/app/components/course-player.tsx:128-153`
- **Description**: No cleanup flag or AbortController for async operations in useEffect.

### 9. Admin analytics fetches ALL records
- **Status**: [x]
- **File**: `backend/src/controllers/admin.controller.ts`
- **Description**: The `getAnalytics` endpoint already had date filtering (false positive). The real issue was in `getAdminStats` — quiz stats fetched ALL attempt rows just to compute averages. Fixed by replacing `findMany` with `aggregate` + `count` queries. Student performance extremes query left as-is — it uses `include` (single query) and the scoring formula requires data from 3 tables, making DB-level optimization impractical.

### 10. Inconsistent Request vs AuthRequest types
- **Status**: [x]
- **Files**: `backend/src/controllers/user.controller.ts`, `backend/src/controllers/course.controller.ts`
- **Description**: Admin-protected routes were using `Request` instead of `AuthRequest`. Fixed all authenticated endpoints in both controllers (11 functions total).

---

## Medium Priority

### 11. PlatformSettings.minPasswordLength default mismatch
- **Status**: [x]
- **Files**: `backend/prisma/schema.prisma:264` vs `backend/src/controllers/user.controller.ts:12`
- **Description**: Schema defaults to `6` but code enforces `8`. Should align.

### 12. Difficulty stored as String instead of enum
- **Status**: [x]
- **File**: `backend/prisma/schema.prisma:15,183,331`
- **Description**: Course.difficulty, Lab.difficulty, and PhishingScenario.difficulty are plain Strings with no type safety.

### 13. Inconsistent error response formats
- **Status**: [x] Reviewed — no action needed
- **Files**: Multiple backend controllers
- **Description**: Error responses are already consistent (`{ error: 'message' }`). Success responses vary (`{ message, entity }` vs plain data), but standardizing would be a breaking change across all frontend services with low value. Deferred.

### 14. CSRF token fetch error swallowed
- **Status**: [x]
- **Files**: `frontend/src/app/services/api.ts:33-36`, `frontend/src/app/context/AuthContext.tsx:46-47`
- **Description**: If CSRF token fetch fails silently, subsequent mutations fail with no clear cause.

### 15. Phishing simulation error handling
- **Status**: [x]
- **File**: `frontend/src/app/components/phishing-simulation.tsx:61-94`
- **Description**: Doesn't distinguish between 404 (no scenarios), 401 (auth error), and 500 (server error).

### 16. Accessibility gaps
- **Status**: [x]
- **Files**: Multiple frontend components
- **Description**: Interactive buttons, radio groups, and lab simulations lack aria-labels.

---

## Low Priority

### 17. Hardcoded 'singleton' string for PlatformSettings ID
- **Status**: [x]
- **Files**: Multiple backend files
- **Description**: Magic string `'singleton'` used across files. Should be a shared constant.

### 18. Date mutation bug risk in admin analytics
- **Status**: [x]
- **File**: `backend/src/controllers/admin.controller.ts:73-75, 704-706`
- **Description**: `setUTCMonth()`/`setMonth()` on dates with day 31 can overflow into the next month (e.g., March 31 - 1 month = March 3 instead of Feb 28). Fixed by setting day to 1 before month arithmetic in both dashboard and analytics endpoints.

### 19. No intro assessment in main seed
- **Status**: [x] False positive — already exists
- **File**: `backend/prisma/seed.ts:2719-2833`
- **Description**: The intro assessment IS already seeded with 10 questions across all course topics. No action needed.

### 20. TODO in logger — external logging not integrated
- **Status**: [x] Acknowledged — deferred to production readiness
- **File**: `backend/src/utils/logger.ts:25`
- **Description**: Contains TODO for external logging service integration (Sentry, CloudWatch, etc.). The logger works correctly as-is for development. Implementing an external service requires choosing a provider, adding dependencies, and production infrastructure — not a bug fix. Deferred until production deployment planning.
