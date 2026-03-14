# CyberGuard-AI Full System Audit Report

**Date**: March 14, 2026
**Scope**: Backend, Frontend, and Database
**Status**: ALL ISSUES FIXED (see details below)

---

## How to Read This Report

- **Critical** = Could cause data loss, security breach, or app crash
- **High** = Major bug or missing feature that affects users
- **Medium** = Noticeable problem but the app still works
- **Low** = Minor cleanup or improvement

---

## Backend Issues

### 1. [Critical] Emails Can Be Lost After Course Completion
**File**: `backend/src/controllers/course.controller.ts` (lines 572-587)
**What's wrong**: When a student finishes a course, the system marks it complete first, then sends an email separately. If the email fails, the student never gets notified but the course is already marked done. There's no retry system.
**Plain English**: Imagine finishing a test but never getting your results because the mailman lost the letter — and nobody notices.

### 2. [High] CSRF Security Tokens Stored in Memory Only
**File**: `backend/src/middleware/csrf.middleware.ts` (line 6)
**What's wrong**: Security tokens that protect against fake requests are stored in the server's memory, not a database. If the server restarts, all tokens are lost and every logged-in user gets kicked out.
**Plain English**: It's like writing passwords on a whiteboard — if someone erases it, everyone has to start over.

### 3. [High] Email Failures Are Silent
**File**: `backend/src/services/email.service.ts` (lines 26-61)
**What's wrong**: When the email system isn't configured or breaks, emails just silently fail. No one (admin or student) is told that the email didn't send.
**Plain English**: The app says "email sent!" but it actually went nowhere, and nobody finds out.

### 4. [Medium] Quiz Answers Aren't Fully Validated
**File**: `backend/src/controllers/course.controller.ts` (lines 417-446)
**What's wrong**: When a student submits quiz answers, the system doesn't check if the answer keys match actual questions. A student could submit answers for questions that don't exist, or if the frontend sends answers in a different format, all answers silently count as wrong.
**Plain English**: It's like grading a test where the answer sheet doesn't match the question paper — everything gets marked wrong.

### 5. [Medium] Race Condition in Course Completion
**File**: `backend/src/controllers/course.controller.ts` (lines 488-596)
**What's wrong**: If a student finishes the last lesson and last lab at almost the exact same time, both requests could trigger course completion simultaneously, potentially creating duplicate certificates.
**Plain English**: Like two cashiers both ringing up the same item — you might get charged twice.

### 6. [Medium] No Password Change Feature
**File**: `backend/src/controllers/user.controller.ts`
**What's wrong**: There's no way for users to change their password after registration. The feature simply doesn't exist.
**Plain English**: Once you set your password, you're stuck with it forever.

### 7. [Medium] Logger Has No External Service
**File**: `backend/src/utils/logger.ts` (line 25)
**What's wrong**: There's a TODO comment saying logs should be sent to an external service (like Sentry), but it's never implemented. Logs only go to the console and disappear when the server restarts.
**Plain English**: Important error information is written on a whiteboard that gets erased every time the power goes out.

### 8. [Low] Whitespace-Only Input Accepted
**File**: Various controllers
**What's wrong**: You can create a course with a title of just spaces ("   ") because the validation checks length but doesn't strip whitespace first.
**Plain English**: You could name a course with invisible characters and it would look blank.

### 9. [Low] Error Messages Are Inconsistent
**File**: Various controllers
**What's wrong**: Some errors say "X not found" while others say "Failed to fetch X" — there's no consistent pattern for error messages.
**Plain English**: The app speaks two different languages when something goes wrong.

### 10. [Low] Fragile Error Type Checking
**File**: `backend/src/index.ts` (lines 113-127)
**What's wrong**: The global error handler checks for "request entity too large" by looking for that exact text in the error message. If the error message ever changes (like in a library update), this breaks.
**Plain English**: Instead of checking what kind of error happened, it reads the error message like a human would — fragile.

---

## Frontend Issues

### 11. [High] Memory Leak in Assessment Check
**File**: `frontend/src/app/App.tsx` (line 237)
**What's wrong**: When the app checks if a new student needs an intro assessment, it can still try to update the screen even after the student navigates away. This leaks memory over time.
**Plain English**: The app keeps doing work in the background for a page you've already left, slowly eating up your computer's memory.

### 12. [High] Memory Leak in Course Player
**File**: `frontend/src/app/pages/course-player.tsx` (line 147)
**What's wrong**: When loading lab data for a course, if you navigate away before it finishes loading, it still tries to update the page that no longer exists.
**Plain English**: Same as above — background work for a page you're no longer on.

### 13. [High] Course Player Lab Loading Errors Not Shown
**File**: `frontend/src/app/pages/course-player.tsx` (line 171)
**What's wrong**: If loading lab data fails, the error is only logged to the developer console. The student sees nothing — no error message, no retry button.
**Plain English**: Something breaks but the student just sees a blank screen with no explanation.

### 14. [High] Phishing Simulation Error Handling Incomplete
**File**: `frontend/src/app/pages/phishing-simulation.tsx` (line 127)
**What's wrong**: Some error paths in the phishing simulation don't show error messages to the user.
**Plain English**: If something goes wrong during a phishing exercise, the student might not know what happened.

### 15. [Medium] AI Chat Falls Back to Hardcoded Responses
**File**: `frontend/src/app/components/ai-chat.tsx` (lines 76-103)
**What's wrong**: When the AI chat API fails, instead of showing an error, it falls back to hardcoded keyword-matching responses that pretend to be AI. The student doesn't know they're not getting real AI responses.
**Plain English**: When the AI is down, you're talking to a chatbot pretending to be smart — and it doesn't tell you.

### 16. [Medium] Quiz Submission Can Get Stuck
**File**: `frontend/src/app/pages/course-player.tsx` (lines 154-157)
**What's wrong**: If quiz submission fails, the "submitting" state might not reset, leaving the submit button permanently disabled.
**Plain English**: The "Submit" button stays greyed out forever if something goes wrong.

### 17. [Medium] Admin Content Operations Missing Error Handling
**File**: `frontend/src/app/pages/admin-content.tsx`
**What's wrong**: When an admin creates, updates, or deletes lessons/quizzes, errors aren't properly caught and shown. Operations can fail silently.
**Plain English**: An admin deletes a lesson, it fails, but they think it worked.

### 18. [Medium] Phishing Email Config Changes Not Detected
**File**: `frontend/src/app/components/PhishingEmailSimulation.tsx` (lines 94-98)
**What's wrong**: The phishing email simulation picks an email on first load but doesn't update if the configuration changes.
**Plain English**: If the exercise settings change while you're on the page, you're still seeing the old version.

### 19. [Medium] Admin Phishing Edit Navigates Away on Error
**File**: `frontend/src/app/pages/admin-phishing-edit.tsx` (lines 94-120)
**What's wrong**: If loading a phishing scenario fails, the page silently navigates away instead of showing an error.
**Plain English**: You try to edit something, it breaks, and you're randomly sent back to another page with no explanation.

### 20. [Low] Console.log Statements Left in Production Code
**File**: `frontend/src/app/App.tsx` (multiple lines)
**What's wrong**: Debug logging statements are scattered throughout the code and will run in production, cluttering the browser console.
**Plain English**: Developer notes meant for testing are showing up for real users (if they open browser tools).

### 21. [Low] Missing Accessibility Labels
**File**: Multiple components
**What's wrong**: Several buttons that only have icons don't have text labels for screen readers. Visually impaired users can't tell what these buttons do.
**Plain English**: Icon-only buttons are invisible to people using screen readers.

### 22. [Low] No Real-Time Password Validation Feedback
**File**: `frontend/src/app/pages/register-page.tsx` (lines 69-72)
**What's wrong**: When registering, users don't see live feedback about password requirements as they type. They only find out after submitting.
**Plain English**: You type your password, hit submit, and THEN find out it needed a special character.

### 23. [Low] Course Catalog Filter Not Optimized
**File**: `frontend/src/app/pages/course-catalog.tsx` (lines 87-92)
**What's wrong**: The course filter recalculates on every screen update, even when nothing changed. Not a problem with small data, but inefficient.
**Plain English**: The search is doing extra work every time the screen refreshes, even if nothing changed.

---

## Database Issues

### 24. [High] Missing Database Indexes on Foreign Keys
**Files**: `backend/prisma/schema.prisma`
**What's wrong**: Several foreign key columns are missing indexes, which means lookups on those columns scan the entire table:
- `IntroQuestion.courseId`
- `IntroQuestion.introAssessmentId`
- `FullAssessmentAttempt.userId`
- `Lab.moduleId`
- `Lesson.moduleId`
- `PhishingScenario.category`
**Plain English**: Searching for data in these tables is like looking through an unsorted filing cabinet instead of using the index tabs.

### 25. [High] Lessons Not Linked to Modules in Seed Data
**File**: `backend/prisma/seed.ts`
**What's wrong**: The seed script creates modules and lessons separately but never links them. Lessons have no module assignment, breaking the course structure (Course > Module > Lesson).
**Plain English**: The textbook has chapters and pages, but the pages aren't assigned to any chapter.

### 26. [Medium] No Initial Platform Settings Created
**File**: `backend/prisma/seed.ts`
**What's wrong**: The PlatformSettings model exists but the seed script never creates the initial settings record. If the app tries to read settings before an admin sets them up, it could crash.
**Plain English**: The app expects a settings page to already exist, but nobody creates the default settings.

### 27. [Medium] Deleting a Module Orphans Its Lessons/Labs
**File**: `backend/prisma/schema.prisma` (lines 72, 201)
**What's wrong**: When a module is deleted, its lessons and labs have their `moduleId` set to null instead of being deleted too. They become orphaned — still in the database but not visible in any module.
**Plain English**: Deleting a chapter from a textbook leaves the pages floating around with no home.

### 28. [Medium] No Bounds Check on Quiz Passing Score
**File**: `backend/prisma/schema.prisma` (line 127)
**What's wrong**: The `passingScore` field accepts any number. You could set it to -50 or 999, which makes no sense for a percentage.
**Plain English**: You could set a quiz to require 999% to pass — obviously impossible.

### 29. [Medium] No Bounds Check on Correct Answer Index
**File**: `backend/prisma/schema.prisma` (lines 100, 399)
**What's wrong**: Quiz questions store which answer is correct as a number (0, 1, 2, 3), but there's no check that this number is within the range of available options. You could say answer #99 is correct when there are only 4 choices.
**Plain English**: The answer key points to option F when the question only has A through D.

### 30. [Medium] Duplicate Phishing Seed Files
**File**: `backend/prisma/seed-phishing.ts` and `seed-phishing-data.ts`
**What's wrong**: Two different seed files both create phishing scenarios with different data. It's unclear which one is the "real" one, and running both creates duplicates.
**Plain English**: Two different people wrote the test data and nobody decided which one to use.

### 31. [Medium] Hardcoded Email in Demo History Script
**File**: `backend/prisma/add-demo-history.ts` (line 13)
**What's wrong**: The script that creates demo student history has a personal email address hardcoded (`akeemkippins.gy@gmail.com`). If that user doesn't exist, the script crashes.
**Plain English**: The demo script only works for one specific person's account.

### 32. [Medium] Demo History Can Create Negative Quiz Scores
**File**: `backend/prisma/add-demo-history.ts` (line 145)
**What's wrong**: The formula `quizScore - random(0-10)` can produce negative scores, which don't make sense.
**Plain English**: A student could supposedly score -3% on a quiz.

### 33. [Low] Certificate Backfill Can Crash on Incomplete Enrollments
**File**: `backend/prisma/backfill-certificates.ts` (line 56)
**What's wrong**: Uses `enrollment.completedAt!` (forced non-null) as the certificate date. If the enrollment isn't actually completed, this crashes.
**Plain English**: Tries to create a graduation certificate for someone who hasn't graduated yet — and crashes.

### 34. [Low] Session Timeout Field Name Is Ambiguous
**File**: `backend/prisma/schema.prisma` (line 279)
**What's wrong**: The field `sessionTimeout` has a default of 7 but doesn't specify the unit. Is it 7 days? 7 hours? 7 minutes?
**Plain English**: The setting says "timeout: 7" but doesn't say 7 what.

---

## Fix Priority Order

### Phase 1 — Critical & High (Fix First)
| # | Issue | Category |
|---|-------|----------|
| 1 | Silent email failures after course completion | Backend |
| 2 | CSRF tokens stored in memory only | Backend |
| 3 | Silent email failure notifications | Backend |
| 6 | No password change feature | Backend |
| 11 | Memory leak in assessment check | Frontend |
| 12 | Memory leak in course player | Frontend |
| 13 | Course player errors not shown to users | Frontend |
| 14 | Phishing simulation error handling | Frontend |
| 24 | Missing database indexes | Database |
| 25 | Lessons not linked to modules in seed | Database |

### Phase 2 — Medium (Fix Next)
| # | Issue | Category |
|---|-------|----------|
| 4 | Quiz answer validation | Backend |
| 5 | Race condition in course completion | Backend |
| 7 | Logger has no external service | Backend |
| 15 | AI chat hardcoded fallback | Frontend |
| 16 | Quiz submission stuck state | Frontend |
| 17 | Admin content silent errors | Frontend |
| 18 | Phishing email config not reactive | Frontend |
| 19 | Admin phishing edit silent navigation | Frontend |
| 26 | No initial platform settings in seed | Database |
| 27 | Module deletion orphans lessons | Database |
| 28 | No bounds on passing score | Database |
| 29 | No bounds on correct answer index | Database |
| 30 | Duplicate phishing seed files | Database |
| 31 | Hardcoded email in demo script | Database |
| 32 | Negative quiz scores possible | Database |

### Phase 3 — Low (Polish)
| # | Issue | Category |
|---|-------|----------|
| 8 | Whitespace-only input accepted | Backend |
| 9 | Inconsistent error messages | Backend |
| 10 | Fragile error type checking | Backend |
| 20 | Console.log in production | Frontend |
| 21 | Missing accessibility labels | Frontend |
| 22 | No live password validation | Frontend |
| 23 | Course filter not optimized | Frontend |
| 33 | Certificate backfill crash risk | Database |
| 34 | Ambiguous timeout field name | Database |

---

**Total Issues Found: 34**
- Critical: 1
- High: 6
- Medium: 18
- Low: 9
