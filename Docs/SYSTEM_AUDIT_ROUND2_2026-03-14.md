# CyberGuard-AI System Audit — Round 2

**Date:** March 14, 2026
**Scope:** Full backend + frontend codebase review (follow-up to previous audit)
**Focus:** New bugs, incomplete code, and issues not covered in the first audit

---

## How to Read This Report

- **High** = Something is actively broken or a security hole
- **Medium** = Works today but will cause problems under certain conditions
- **Low** = Code quality, UX polish, or minor inconsistencies

---

## High Priority

### ~~1. CSV Export Divides Average Score by 10~~ (Not a Bug)
**Where:** `backend/src/controllers/admin.controller.ts` (~line 1003)
**Verdict:** This is intentional. The analytics views, CSV, and PDF all consistently use a 0-10 scale. The CSV header even says "Average Score (/10)". No fix needed.

### 2. Password Length Default Says 6 But Backend Enforces 8 (Bug)
**Where:** `backend/src/controllers/settings.controller.ts` (line 25) vs `backend/src/controllers/auth.controller.ts` (line 57)
**What's wrong:** The public settings API tells the frontend "minimum password is 6 characters," but registration actually requires 8. Users see a misleading hint, type a 6-character password, and get rejected.
**How to fix:** Change the default in `settings.controller.ts` from `minPasswordLength: 6` to `minPasswordLength: 8`.

### 3. SVG Uploads Skip All Safety Checks (Security)
**Where:** `backend/src/controllers/upload.controller.ts` (lines 89-98)
**What's wrong:** SVG and ICO files completely skip the magic-byte check that verifies a file is actually what it claims to be. SVGs are XML-based and can contain `<script>` tags — a bad actor could upload one that runs code in the browser.
**How to fix:** Either block SVG uploads entirely, or parse the SVG content and strip any `<script>` tags, event handlers, and external references before saving.

### 4. Custom CSS Injected Without Sanitization (Security)
**Where:** `frontend/src/app/context/PlatformSettingsContext.tsx` (line 199)
**What's wrong:** Admins can set custom CSS for the platform, and it's injected directly into the page with no validation. If an admin account gets compromised, an attacker could use CSS tricks to create fake login forms, hide real content, or exfiltrate data via `background-image` URLs on input fields.
**How to fix:** Add a CSS sanitizer that strips `url()`, `@import`, `expression()`, and `behavior` properties before injecting.

---

## Medium Priority

### 5. Negative Page Numbers Accepted in API (Bug)
**Where:** Multiple controllers — `phishing.controller.ts`, `settings.controller.ts`, `admin.controller.ts`
**What's wrong:** Pagination parameters like `page` and `limit` are parsed with `parseInt()` but never checked for negative values. Sending `?limit=-10` passes right through to the database.
**How to fix:** Add `Math.max(1, ...)` for page and `Math.max(1, Math.min(100, ...))` for limit.

### 6. Lab Passing Score Hardcoded to 70% (Bug)
**Where:** `backend/src/controllers/course.controller.ts` (line 1137)
**What's wrong:** The `calculateLabScore()` function always uses 70 as the passing threshold, even though each lab in the database has its own `passingScore` field. If an admin sets a lab's passing score to 50%, it's ignored — students still need 70%.
**How to fix:** Pass the lab's actual `passingScore` from the database into the function instead of hardcoding 70.

### 7. Transient Pages Can Render Without Their Required ID (Bug)
**Where:** `frontend/src/app/App.tsx` (lines 112-129)
**What's wrong:** Pages like course-player and lab-player need an ID (which course? which lab?). If the page loads before the ID is set in state, the component gets a null ID and shows a blank screen or crashes.
**How to fix:** Add a guard in each transient page case in `renderPage()` — if the ID is missing, redirect to the parent page.

### 8. Student Dashboard Breaks If One API Call Fails (Bug)
**Where:** `frontend/src/app/components/student-dashboard.tsx` (lines 70-96)
**What's wrong:** The dashboard fetches courses, certificates, activity, and more using `Promise.all`. If any single request fails, the entire dashboard shows an error — even if 4 out of 5 succeeded.
**How to fix:** Use `Promise.allSettled` instead and render whatever data loaded successfully.

### 9. Encryption Key Not Validated at Server Startup (Incomplete)
**Where:** `backend/src/utils/encryption.ts` (lines 6-12)
**What's wrong:** The encryption key (needed for encrypting SMTP passwords) is only checked when it's first used, not when the server starts. If the key is missing, the app boots fine and then crashes the first time someone tries to save email settings.
**How to fix:** Call `getEncryptionKey()` during server startup in `index.ts` and fail fast if it's missing.

### 10. Quiz Results Can Show "undefined" for Correct Answer (Bug)
**Where:** `frontend/src/app/components/course-player.tsx` (line 670)
**What's wrong:** When displaying quiz results, the code does `options[correctAnswer]` without checking if `correctAnswer` is a valid index. If it's out of bounds, the correct answer shows as "undefined."
**How to fix:** Add a bounds check: `options[correctAnswer] ?? "Unknown"`.

### 11. localStorage Data Never Validated on App Load (Bug)
**Where:** `frontend/src/app/App.tsx` (lines 112-129)
**What's wrong:** On startup, the app reads saved IDs from localStorage (selected course, user, lab, etc.) but never checks if they're valid strings. Corrupted localStorage data could cause hard-to-diagnose errors.
**How to fix:** Wrap localStorage reads in validation — if the value isn't a valid non-empty string, default to null.

---

## Low Priority

### 12. Fire-and-Forget Email Sending (Incomplete)
**Where:** `backend/src/controllers/course.controller.ts` (lines 556-587)
**What's wrong:** Certificate emails are sent with `setImmediate()` — if they fail, the error is silently logged and the student never knows. No retry mechanism exists.
**How to fix:** At minimum, log a warning that can be monitored. Ideally, use a job queue for email delivery.

### 13. AI Chat Silently Falls Back to Keyword Matching (UX)
**Where:** `frontend/src/app/components/ai-chat.tsx` (lines 77-100)
**What's wrong:** When the Gemini API fails, the chat silently switches to basic keyword matching. Students think they're talking to AI but are getting canned responses.
**How to fix:** Show a subtle indicator like "AI temporarily unavailable — using basic responses" so students know.

### 14. Console Logging Left in Production Code (Cleanup)
**Where:** Throughout frontend — `App.tsx` has 20+ console.log statements, plus `AuthContext.tsx` and various components
**What's wrong:** Debug logs are everywhere, showing up in the browser console for anyone to see.
**How to fix:** Remove debug logs or wrap them in a `NODE_ENV === 'development'` check.

### 15. Settings Change Detection Uses JSON.stringify (Bug)
**Where:** `frontend/src/app/context/SettingsContext.tsx` (line 66)
**What's wrong:** Unsaved changes are detected by comparing `JSON.stringify(current) === JSON.stringify(saved)`. JavaScript doesn't guarantee object property order, so two identical objects could produce different strings.
**How to fix:** Compare individual property values instead of stringifying the whole object.

### 16. No External Logging Service (Incomplete)
**Where:** `backend/src/utils/logger.ts` (line 25)
**What's wrong:** There's a TODO comment about sending logs to Sentry/CloudWatch. Currently all logs only go to console/file — no centralized monitoring for production.
**How to fix:** Integrate with an external logging service before going to production.

### 17. Inconsistent Error Messages Across Components (Cleanup)
**Where:** Various frontend components
**What's wrong:** Some say "Failed to load...", others "Error loading...", others "Could not fetch...". No standard pattern.
**How to fix:** Create a shared error message utility or at least pick one pattern and stick with it.

### 18. No API Retry Logic Anywhere (Incomplete)
**Where:** All frontend service files
**What's wrong:** Every API call either works or shows an error. No automatic retry for brief network hiccups — user must manually refresh.
**How to fix:** Add a retry wrapper (1-2 retries with backoff) to the centralized Axios instance for GET requests.

---

## Summary Table

| # | Issue | Priority | Type | Layer |
|---|-------|----------|------|-------|
| 1 | CSV export divides score by 10 | **High** | Bug | Backend |
| 2 | Password length default mismatch | **High** | Bug | Backend |
| 3 | SVG uploads skip safety checks | **High** | Security | Backend |
| 4 | Custom CSS injection unsanitized | **High** | Security | Frontend |
| 5 | Negative pagination values | Medium | Bug | Backend |
| 6 | Lab passing score hardcoded 70% | Medium | Bug | Backend |
| 7 | Transient pages load without ID | Medium | Bug | Frontend |
| 8 | Dashboard breaks on partial failure | Medium | Bug | Frontend |
| 9 | Encryption key not checked at start | Medium | Incomplete | Backend |
| 10 | Quiz results out-of-bounds access | Medium | Bug | Frontend |
| 11 | localStorage not validated on load | Medium | Bug | Frontend |
| 12 | Fire-and-forget emails | Low | Incomplete | Backend |
| 13 | AI chat silent fallback | Low | UX | Frontend |
| 14 | Console logs in production | Low | Cleanup | Frontend |
| 15 | JSON.stringify change detection | Low | Bug | Frontend |
| 16 | No external logging | Low | Incomplete | Backend |
| 17 | Inconsistent error messages | Low | Cleanup | Frontend |
| 18 | No API retry logic | Low | Incomplete | Frontend |
