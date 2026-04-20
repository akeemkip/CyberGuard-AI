# API & Service Conventions

## Frontend Service Layer
- Centralized Axios instance at `frontend/src/app/services/api.ts`
- Base URL from `VITE_API_BASE_URL` env var (dev: `http://localhost:3000/api`; prod: relative `/api` so the SPA hits whichever origin served it)
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
- `admin.service.ts` — admin CRUD operations, analytics, settings, audit logs
- `phishing.service.ts` — phishing simulation scenarios

## AI Endpoints (`/api/ai/*`)
- `POST /chat` — student chat with AI tutor (auth required)
- `POST /quiz-explanation` — AI review of quiz answers (auth required)
- `POST /lab-hint` — progressive hints during lab simulations (auth required, max 3)
- `POST /analytics-insights` — AI-powered analytics summary (admin only)
- `POST /learning-path` — personalized learning path after intro assessment (auth required)
- `GET /course-recommendations` — AI course suggestions based on progress (auth required)
- All AI endpoints use Gemini 2.5 Flash (free tier: 10 RPM, 250 RPD)
- Dedicated rate limit: 1000 req/15min per IP (Gemini's own quota is the real ceiling)

## Phishing Endpoints (`/api/phishing/*`)
- `GET /scenario` — next scenario for the user (prioritizes unseen, then failed)
- `POST /attempt` — submit the user's action for the current scenario
- `GET /stats` — user's phishing stats
- `GET /history` — attempt history (paginated, `limit` and `offset` query params)
- `POST /reset` — wipe the user's phishing attempts; used by the "Practice Again" button so the next scenario fetch returns real results instead of "all completed"

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
