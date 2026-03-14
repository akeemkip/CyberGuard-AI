# CyberGuard-AI Full System Audit Report

**Date:** March 14, 2026
**Scope:** Frontend, Backend, Database
**Auditor:** Claude (AI-assisted review)

---

## Executive Summary

The CyberGuard-AI platform is a functional cybersecurity training app, but this audit found **~80+ issues** across all layers. The most pressing problems are: unauthenticated file upload endpoints, assessment scores trusted from the client without server validation, missing lab scoring logic for 3 lab types, CSRF protection gaps on several frontend services, and a navigation bug in the default route handler.

Think of this system like a house: the structure is solid, but some doors don't have locks, a few rooms are half-finished, and some of the wiring is inconsistent.

---

## How to Read This Report

- **Critical** = Something is broken or a real security hole exists right now
- **High** = Important gap that could cause bugs or security issues under normal use
- **Medium** = Works today but will cause problems as the app grows or under edge cases
- **Low** = Code quality, consistency, or minor UX issues

---

## CRITICAL ISSUES (Fix Immediately)

### 1. File Uploads Have No Authentication
**Where:** Backend - `/api/uploads/image` and `/api/uploads/:filename` endpoints
**Plain English:** Anyone on the internet can upload files to your server or delete existing files without being logged in. It's like leaving the back door of your house wide open.
**Fix:** Add the `authenticateToken` middleware to both upload routes.

### 2. Assessment Scores Are Trusted From the Client
**Where:** Backend - `assessment.controller.ts` (submitFullAssessment)
**Plain English:** When a student takes an assessment, the frontend sends the score to the backend and the backend just saves it without checking. A student could use browser dev tools to send a fake perfect score. Labs correctly recalculate scores server-side, but assessments don't.
**Fix:** Recalculate the score on the server by comparing submitted answers against correct answers.

### 3. Three Lab Types Have No Scoring Logic
**Where:** Backend - `course.controller.ts` (calculateLabScore function)
**Plain English:** The system defines 8 types of labs, but only 5 have scoring logic. The SECURITY_ALERTS, WIFI_SAFETY, and INCIDENT_RESPONSE labs have no score calculation, so completing them returns no score. It's like having an exam with no answer key for 3 sections.
**Fix:** Implement `calculateLabScore` cases for the 3 missing lab types.

### 4. Navigation Bug in Default Route
**Where:** Frontend - `App.tsx` line 679
**Plain English:** If the app hits an unknown page, it falls back to the landing page but passes the wrong navigation function (`setCurrentPage` instead of `handleNavigate`). This means clicking links on that fallback page won't work correctly - browser URL won't update and page transitions won't animate.
**Fix:** Change `setCurrentPage` to `handleNavigate` in the default case of `renderPage()`.

---

## HIGH SEVERITY ISSUES

### 5. CSRF Protection Gaps on Frontend Services
**Where:** Frontend - `assessment.service.ts`, `SettingsContext.tsx`
**Plain English:** CSRF protection stops attackers from tricking your browser into making requests you didn't intend. The main API client (`api.ts`) has this protection, but the assessment service and settings context use their own HTTP clients that skip it. It's like having a security system on the front door but not the side entrance.
**Fix:** Refactor `assessment.service.ts` and `SettingsContext.tsx` to use the centralized `api.ts` Axios instance.

### 6. Assessments Page Uses Hardcoded Questions
**Where:** Frontend - `assessments-page.tsx`
**Plain English:** The assessments page has questions written directly in the code instead of fetching them from the backend API. The backend has a real assessment system with proper questions in the database, but the frontend page ignores it and uses its own static list.
**Fix:** Replace hardcoded `assessmentQuestions` array with API calls to the assessment service.

### 7. Missing Cascade Delete on Module Relations
**Where:** Database - `schema.prisma` (Lesson and Lab models)
**Plain English:** When you delete a Module (a section of a course), the Lessons and Labs inside it should be automatically deleted too. Right now they become "orphans" - they still exist in the database pointing to a Module that no longer exists. It's like demolishing a building but leaving the furniture floating in mid-air.
**Fix:** Add `onDelete: Cascade` to the Lesson-Module and Lab-Module relations.

### 8. Missing Database Indexes on Frequently Queried Fields
**Where:** Database - `schema.prisma`
**Plain English:** Indexes help the database find records faster, like a book's index helps you find a topic. Several fields that are searched frequently (user role, course published status, scenario active status, enrollment dates) don't have indexes. With a small number of users this doesn't matter, but as the platform grows, queries will get noticeably slower.
**Fields needing indexes:** `User.role`, `Course.isPublished`, `PhishingScenario.isActive`, `IntroAssessment.isActive`, `Enrollment.enrolledAt`, `Progress.completedAt`, `QuizAttempt.attemptedAt`

### 9. Course Player Errors Are Silent
**Where:** Frontend - `course-player.tsx`
**Plain English:** When a course fails to load, the error is saved in a variable but never shown to the student. They just see a blank or stuck loading screen with no explanation. It's like a vending machine eating your money without telling you it's out of stock.
**Fix:** Display the error state to the user with a retry option.

### 10. Settings Audit Log Has No User Relation
**Where:** Database - `schema.prisma` (SettingsAuditLog model)
**Plain English:** The audit log stores admin IDs and emails as plain text with no link to the actual User table. If an admin's email changes or they're deleted, the audit log has stale data and there's no way to enforce that the admin ID is a real user.
**Fix:** Add a proper foreign key relation from `SettingsAuditLog.adminId` to `User.id`.

---

## MEDIUM SEVERITY ISSUES

### 11. Unsafe Type Assertions Throughout Backend
**Where:** Backend - `assessment.controller.ts`, `ai.controller.ts`, `csrf.middleware.ts`, `course.controller.ts`, `settings.controller.ts`
**Plain English:** TypeScript is supposed to catch bugs before they happen, but many places in the code use `(req as any).userId` which tells TypeScript "trust me, I know what I'm doing." If the auth middleware ever fails silently, these will crash at runtime instead of being caught at compile time.
**Fix:** Use the proper `AuthRequest` interface consistently.

### 12. Race Condition in Course Completion
**Where:** Backend - `course.controller.ts` (checkAndCompleteCourse)
**Plain English:** If a student finishes a quiz and a lab at nearly the same time, both requests check if the course is complete simultaneously. This could result in duplicate completion records or a certificate being generated twice. It's like two cashiers trying to process the same return at the same time.
**Fix:** Wrap the completion check in a database transaction.

### 13. CSRF Tokens Stored In-Memory
**Where:** Backend - `csrf.middleware.ts`
**Plain English:** CSRF tokens (anti-forgery tokens) are stored in a JavaScript Map that lives in server memory. If the server restarts, all tokens are lost and everyone gets logged out. If you ever run multiple server instances behind a load balancer, tokens created on one server won't be recognized by another.
**Fix:** Store CSRF tokens in Redis or the database.

### 14. No Pagination on Large Admin Queries
**Where:** Backend - `admin.controller.ts`
**Plain English:** The admin analytics dashboard fetches ALL students, ALL enrollments, ALL quiz attempts at once. With 50 users this is fine. With 10,000 users, the page will freeze or crash. It's like trying to read an entire library catalog printed on one page.
**Fix:** Add pagination parameters (limit/offset) to admin data endpoints.

### 15. Inconsistent Error Logging
**Where:** Backend - all controller files
**Plain English:** Some errors are logged with `console.error()` (which just prints to the terminal) and some use the proper logger. This means you can't easily send all errors to a monitoring service like Sentry. It's like some employees writing incident reports in a shared system and others just scribbling notes on napkins.
**Fix:** Replace all `console.error` calls with the centralized `logger`.

### 16. Email Notifications Not Implemented
**Where:** Backend - `email.service.ts`, `settings.controller.ts`
**Plain English:** The platform settings page lets admins turn on email notifications for enrollments and course completions, but no code actually sends these emails. The email service exists and can send test emails, but nothing triggers it when a student enrolls or completes a course. The switches are there, but they're not connected to anything.
**Fix:** Wire up email.service calls in the enrollment and completion handlers.

### 17. File Upload Content Validation
**Where:** Backend - `upload.controller.ts`
**Plain English:** File uploads check the file extension and MIME type, but don't verify the actual file contents (magic bytes). Someone could rename a malicious file to `.jpg` and upload it. It's like checking someone's ID badge but not verifying the photo matches their face.
**Fix:** Add magic byte validation for uploaded files.

### 18. Smart Chatbot Service Is Dead Code
**Where:** Backend - `smart-chatbot.service.ts`
**Plain English:** There's an entire chatbot service file that nobody calls. No routes point to it. It's like having a fully furnished room that no hallway connects to.
**Fix:** Either integrate it or remove it.

### 19. Phishing Query Accepts Unlimited Results
**Where:** Backend - `phishing.controller.ts`
**Plain English:** The phishing history endpoint accepts any `limit` value without a maximum. A malicious user could request `limit=999999` and make the server fetch and return an enormous dataset, potentially slowing it down.
**Fix:** Cap the maximum limit (e.g., 100 per request).

---

## LOW SEVERITY ISSUES

### 20. Intro Assessment Uses alert() Instead of Toast
**Where:** Frontend - `intro-assessment-page.tsx` line 68
**Plain English:** Every other notification in the app uses the nice toast popups (Sonner), but the intro assessment validation uses the old-school browser `alert()` box. It works, but it looks inconsistent.

### 21. Admin Service Returns `any` Types
**Where:** Frontend - `admin.service.ts` (lines 652-670)
**Plain English:** Some functions return `any` type instead of proper Course types, which defeats the purpose of TypeScript and removes autocomplete in the IDE.

### 22. Inconsistent API Response Formats
**Where:** Backend - various controllers
**Plain English:** Some endpoints return `{ message, data }`, some return `{ message }`, and some return just the data. It works, but it makes frontend code harder to write because you never know exactly what shape the response will be.

### 23. Lesson Content Field Missing @db.Text
**Where:** Database - `schema.prisma` (Lesson model)
**Plain English:** Lesson content stores long HTML strings but doesn't use the explicit `@db.Text` annotation. PostgreSQL handles this fine, but being explicit is better practice and avoids potential migration surprises.

### 24. Password Mask Could Be Exploited
**Where:** Backend - `settings.controller.ts`
**Plain English:** The password field is masked with `••••••••` when returned to the UI. If someone submitted that exact string as a new password, it might overwrite the real password. Should use a unique token instead.

---

## Summary Table

| # | Issue | Severity | Layer | Status |
|---|-------|----------|-------|--------|
| 1 | Unauthenticated file uploads | **CRITICAL** | Backend | Open |
| 2 | Client-trusted assessment scores | **CRITICAL** | Backend | Open |
| 3 | 3 lab types missing scoring logic | **CRITICAL** | Backend | Open |
| 4 | Navigation bug in default route | **CRITICAL** | Frontend | Open |
| 5 | CSRF gaps on frontend services | HIGH | Frontend | Open |
| 6 | Assessments page uses hardcoded data | HIGH | Frontend | Open |
| 7 | Missing cascade delete on Module relations | HIGH | Database | Open |
| 8 | Missing database indexes | HIGH | Database | Open |
| 9 | Course player errors are silent | HIGH | Frontend | Open |
| 10 | Audit log has no user FK relation | HIGH | Database | Open |
| 11 | Unsafe type assertions in backend | MEDIUM | Backend | Open |
| 12 | Race condition in course completion | MEDIUM | Backend | Open |
| 13 | CSRF tokens in-memory only | MEDIUM | Backend | Open |
| 14 | No pagination on admin queries | MEDIUM | Backend | Open |
| 15 | Inconsistent error logging | MEDIUM | Backend | Open |
| 16 | Email notifications not wired up | MEDIUM | Backend | Open |
| 17 | File upload content not validated | MEDIUM | Backend | Open |
| 18 | Dead smart-chatbot service | MEDIUM | Backend | Open |
| 19 | Phishing query unlimited results | MEDIUM | Backend | Open |
| 20 | alert() instead of toast | LOW | Frontend | Open |
| 21 | Admin service returns `any` types | LOW | Frontend | Open |
| 22 | Inconsistent API response formats | LOW | Backend | Open |
| 23 | Lesson content missing @db.Text | LOW | Database | Open |
| 24 | Password mask could be exploited | LOW | Backend | Open |

---

## Recommended Fix Order

**Phase 1 - Security (Do This Week)**
1. Add auth to upload endpoints (#1)
2. Server-side assessment score validation (#2)
3. Fix CSRF gaps on frontend services (#5)
4. Fix navigation bug (#4)

**Phase 2 - Completeness (Next Sprint)**
5. Implement 3 missing lab scoring types (#3)
6. Wire assessments page to real API (#6)
7. Add cascade deletes (#7)
8. Add database indexes (#8)
9. Show course player errors (#9)

**Phase 3 - Robustness (Upcoming)**
10. Add pagination to admin queries (#14)
11. Wire up email notifications (#16)
12. Replace in-memory CSRF store (#13)
13. Fix type assertions (#11)
14. Transaction-wrap course completion (#12)

**Phase 4 - Polish (When Time Permits)**
15. Remaining medium and low issues (#15-24)
