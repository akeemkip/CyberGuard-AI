# Existing Bugs - Audit Findings

Discovered during full project audit on 2026-03-04. Tracked here for systematic resolution.

---

## Critical

### BUG-1: Assessment service double `/api` path (Frontend)
- **File:** `frontend/src/app/services/assessment.service.ts:3`
- **Issue:** Uses `VITE_API_BASE_URL || 'http://localhost:3000'` then manually appends `/api/` to every endpoint. When `.env.local` sets `VITE_API_BASE_URL=http://localhost:3001/api` (which already includes `/api`), all requests go to `/api/api/assessment/...` resulting in 404 errors.
- **Impact:** All intro/full assessment API calls fail when using the configured env variable.
- **Status:** [x] Fixed (2026-03-04) — Refactored to use shared `api` instance with relative paths

### BUG-2: Full assessment accepts client-side scores (Backend - Security)
- **File:** `backend/src/controllers/assessment.controller.ts:183-215`
- **Issue:** `submitFullAssessment` trusts `score`, `totalQuestions`, `percentage`, and `passed` directly from the request body with zero server-side validation or recalculation. Unlike `submitIntroAssessment` which grades server-side, a user can POST arbitrary scores and fake a passing result.
- **Impact:** Users can fraudulently pass the full assessment without answering correctly.
- **Status:** [x] Fixed (2026-03-04) — Added server-side grading with answer key, ignores client-sent scores

### BUG-3: Stale closure in popstate history handler (Frontend)
- **File:** `frontend/src/app/App.tsx:281-352`
- **Issue:** The `useEffect` for browser back/forward navigation uses `user?.role` and `currentPage` inside the handler, but the dependency array only contains `[isInitialized]`. The handler captures stale references and won't reflect login/logout or role changes.
- **Impact:** Security — role-based page guards use outdated user data during history navigation. Users could access admin pages after logout via back button.
- **Status:** [x] Fixed (2026-03-04) — Added user, currentPage, and selected*Id vars to dependency array

---

## High

### BUG-4: PlatformSettingsContext blocks all child rendering (Frontend)
- **File:** `frontend/src/app/context/PlatformSettingsContext.tsx:212-215`
- **Issue:** Children only render when `{!isLoading && children}`. The entire app tree is blank until `/api/settings/public` resolves. If the endpoint is slow or fails, the UI never appears — no fallback, no error state shown.
- **Impact:** Blank screen on slow networks or backend downtime. No graceful degradation.
- **Status:** [x] Fixed (2026-03-05) — Always render children; defaults are already applied during loading via useState initializer

### BUG-5: Broken env config from port debugging session (Config)
- **Files:** `backend/.env`, `frontend/.env.local`
- **Issue:** During a debugging session, ports were changed. Backend `.env` now has `PORT=3001` and `FRONTEND_URL="http://localhost:5175,http://localhost:5176"`. Frontend `.env.local` has `VITE_API_BASE_URL=http://localhost:3001/api`. These should be reset to standard dev defaults (3000/5173).
- **Impact:** Servers won't connect properly on fresh start. CORS will reject requests from the actual frontend origin.
- **Status:** [x] Fixed (2026-03-05) — Reset PORT to 3000, FRONTEND_URL to localhost:5173, VITE_API_BASE_URL to localhost:3000/api

---

## Medium

### BUG-6: Lab simulation overwrites timeSpent instead of accumulating (Backend)
- **File:** `backend/src/controllers/course.controller.ts:1268-1293`
- **Issue:** `submitLabSimulation` sets `timeSpent` directly in the upsert, while `completeLab` correctly accumulates with `existingProgress.timeSpent + timeSpent`. On lab retries via simulation submission, previous time tracking is lost.
- **Impact:** Inaccurate time tracking for lab simulations on retry attempts.
- **Status:** [x] Fixed (2026-03-05) — Accumulate timeSpent from existingProgress on retries, matching completeLab behavior

### BUG-7: N+1 query pattern in enrolled courses (Backend - Performance)
- **File:** `backend/src/controllers/course.controller.ts:218-289`
- **Issue:** `getEnrolledCourses` runs 2 separate count queries (lesson progress + lab progress) per enrolled course inside a `Promise.all(enrollments.map(...))`. For a user with N courses, this produces 1 + 2N database queries.
- **Impact:** Performance degrades linearly with enrolled courses. 10 courses = 21 queries.
- **Status:** [x] Fixed (2026-03-05) — Batch into 2 bulk queries with Set-based lookup, reducing 1+2N queries to 3

### BUG-8: CSRF token failure is silent (Frontend - Security)
- **File:** `frontend/src/app/utils/csrf.ts:48-52`
- **Issue:** If `fetchCsrfToken()` fails (network error, expired auth), `getCsrfToken()` returns null. The API interceptor in `api.ts` checks `if (csrfToken)` and silently skips adding the `X-CSRF-Token` header. State-changing requests proceed without CSRF protection.
- **Impact:** CSRF protection silently degrades to nothing on token fetch failure.
- **Status:** [x] Fixed (2026-03-05) — Retry fetch once on failure, reject request if still null instead of sending without CSRF

### BUG-9: Settings rollback parseInt produces NaN (Backend)
- **File:** `backend/src/controllers/settings.controller.ts:428-434`
- **Issue:** Rollback logic does `parseInt(oldValue)` for numeric fields without checking if the result is `NaN`. Also doesn't handle negative offsets in audit log query params. Corrupted or unexpected `oldValue` strings produce NaN written to the database.
- **Impact:** Database corruption on rollback of numeric settings with bad audit log data.
- **Status:** [x] Fixed (2026-03-05) — Added NaN check after parseInt, returns 400 error instead of writing bad data

### BUG-10: 401 response causes hard page redirect (Frontend - UX)
- **File:** `frontend/src/app/services/api.ts:53-64`
- **Issue:** The axios response interceptor handles 401 errors by directly doing `window.location.href = '/'`, which is a full page reload. This bypasses React state, loses all in-progress work, and provides no user notification about why they were logged out.
- **Impact:** Poor UX — users lose form data and context with no explanation on session expiry.
- **Status:** [x] Fixed (2026-03-05) — Replaced hard redirect with custom event; App.tsx listens and triggers React logout with toast notification
