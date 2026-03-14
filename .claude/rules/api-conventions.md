# API & Service Conventions

## Frontend Service Layer
- Centralized Axios instance at `frontend/src/app/services/api.ts`
- Base URL from `VITE_API_BASE_URL` env var (defaults to `http://localhost:3000/api`)
- `withCredentials: true` for cookie handling
- Request interceptor injects JWT token and CSRF token automatically
- Response interceptor catches 401 → clears localStorage + redirects (except on auth endpoints)
- CSRF token skipped for GET requests and auth endpoints

## Service File Pattern
- Files named `<domain>.service.ts` in `frontend/src/app/services/`
- Export interfaces for request/response types
- Export either an object with methods (`authService.login()`) or bare async functions (`checkIntroAssessmentRequired()`)
- All methods use the centralized `api` instance — never create separate Axios instances
- Strongly typed with generics: `api.get<{ courses: Course[] }>()`

## Existing Services
- `auth.service.ts` — login, register, getMe, logout
- `course.service.ts` — courses, lessons, labs, quizzes, enrollments, progress
- `assessment.service.ts` — intro assessment, full assessment eligibility
- `admin.service.ts` — admin CRUD operations
- `phishing.service.ts` — phishing simulation scenarios

## Backend Route Pattern
- Public routes: no middleware
- Auth routes: `authenticateToken` middleware
- Admin routes: `authenticateToken` + `requireAdmin` middleware
- Routes defined in `backend/src/routes/*.routes.ts`

## Testing
- Framework: Jest + ts-jest + supertest
- Config: `backend/jest.config.js`
- Setup: `backend/src/__tests__/setup.ts` (sets NODE_ENV=test, provides test JWT_SECRET and ENCRYPTION_KEY)
- Pattern: integration tests with real Prisma client (not mocked)
- Test structure: describe blocks, beforeAll/afterAll for setup/cleanup
- Timestamp-based test emails to avoid duplicates
- Only `auth.test.ts` exists currently — test coverage is minimal
