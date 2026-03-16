# CyberGuard-AI

AI-powered cybersecurity training platform with adaptive learning, phishing simulations, interactive labs, and comprehensive analytics.

## Architecture

Monolithic 2-tier app: React SPA frontend + Express.js REST API backend + PostgreSQL database.

```
CyberGuard-AI/
├── frontend/          # React 18 + Vite 6 + TypeScript SPA
├── backend/           # Express.js + TypeScript REST API
├── Docs/              # Project docs, audit reports
```

No shared types between frontend/backend — they are independent Node.js projects with separate `package.json` files.

## Tech Stack

### Frontend (`frontend/`)
- **Framework**: React 18.3 with TypeScript
- **Bundler**: Vite 6.4
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin), CSS variables for theming
- **UI Components**: Radix UI primitives + shadcn/ui-style components (`components/ui/`)
- **State Management**: React Context API (AuthContext, SettingsContext, PlatformSettingsContext)
- **Routing**: Custom state-based routing in `App.tsx` — NOT React Router. Uses `currentPage` state + `history.pushState()` for browser nav
- **HTTP Client**: Axios with auth token injection, CSRF headers, 401 interception
- **Animation**: motion (Framer Motion) v12
- **Charts**: Recharts
- **Rich Text**: Tiptap
- **Icons**: Lucide React
- **Toasts**: Sonner

### Backend (`backend/`)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 4.21
- **ORM**: Prisma 5.22 (PostgreSQL)
- **Auth**: JWT (jsonwebtoken) with bcryptjs password hashing
- **AI**: Google Gemini (`@google/generative-ai`)
- **Email**: Resend (transactional emails like password reset) + Nodemailer (SMTP-based emails)
- **Validation**: Zod
- **Security**: Helmet.js (security headers), CSRF (double-submit cookie), rate limiting (express-rate-limit), sanitize-html, DOMPurify

### Database
- **Engine**: PostgreSQL
- **ORM**: Prisma — schema at `backend/prisma/schema.prisma`
- **Migrations**: Uses `prisma db push` workflow (no migration files)
- **Key models**: User, Course, Module, Lesson, Quiz, Lab, Enrollment, Certificate, PhishingScenario, IntroAssessment, PlatformSettings, SettingsAuditLog, LabProgress, PasswordResetToken
- **Enums**: Role (STUDENT/ADMIN), LabType (8 types), LabStatus, PhishingAction
- **Seed data**: 5 students, 6 courses, 18 modules, 48 lessons, 6 quizzes, 11 labs, phishing scenarios/attempts (Rajesh + Vishnu only — requires completing phishing course), audit log entries, intro assessment attempts for all 5 students

## Commands

### Frontend
```bash
cd frontend
npm run dev          # Start Vite dev server (port 5173)
npm run build        # Production build to dist/
```

### Backend
```bash
cd backend
npm run dev          # Start with ts-node-dev hot reload (port 3000)
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled JS
npm test             # Run Jest tests
npm run test:watch   # Watch mode
npm run test:coverage
```

### Database
```bash
cd backend
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to DB (no migration)
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Run main seed (courses, users, labs, quizzes)
```

## Environment Variables

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=<64-char hex>
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=...
RESEND_API_KEY=...          # For password reset emails (optional locally, required on Render)
```

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Key Patterns

### Navigation (Frontend)
- All routing lives in `App.tsx` via a `currentPage` state and `renderPage()` switch
- Pages receive `onNavigate(page: string, idParam?: string)` callback
- Protected/guest/admin/student page arrays control access
- Transient pages (course-player, lab-player, admin-*-edit) don't persist to localStorage
- Direction-aware page transitions via motion AnimatePresence

### API Layer (Frontend)
- Centralized Axios instance in `services/api.ts` with auth token and CSRF headers
- Service files (`auth.service.ts`, `course.service.ts`, etc.) export async functions
- 401 responses trigger automatic auth clearing

### Auth Flow
1. Login via `AuthContext.login()` → JWT + user stored in localStorage
2. CSRF token fetched post-login
3. `App.tsx` redirects based on auth state and role
4. New students get redirected through register-success (5s countdown) → welcome → intro assessment flow
5. Token expiry caught by Axios 401 interceptor
6. Password reset: forgot-password → Resend email with token → new-password page → reset-password endpoint

### Security (Backend)
- CSRF: double-submit cookie + `x-csrf-token` header on mutations
- Rate limiting: 100 req/15min general, 10 req/15min auth, 20 req/15min AI
- XSS: sanitize-html on request bodies (rich text fields exempted), DOMPurify on all `dangerouslySetInnerHTML`
- Password: bcryptjs, min 8 chars with complexity requirements
- Account lockout after failed login attempts
- Registration always forces STUDENT role (admins created via seed/DB only)
- Startup validation: fails fast if `ENCRYPTION_KEY` or `JWT_SECRET` missing

## Test Accounts (from seed)
- **Admin**: `admin@cyberguard.com` / `CyberAdmin@2026!Sec`
- **Students** (all use password `Learner#2026$Safe`):
  - Rajesh Singh: `rajesh.singh@gmail.com` (Active Learner — 4 enrollments, 2 completed, quizzes 85/90%)
  - Priya Persaud: `priya.persaud@yahoo.com` (Improving — 2 enrollments, failed quiz then retook and passed)
  - Kumar Ramnauth: `kumar.ramnauth@outlook.com` (High Risk — minimal engagement, 1 lesson done, assessment 40%)
  - Arjun Jaipaul: `arjun.jaipaul@yahoo.com` (In Progress — 3 courses halfway, mixed quiz results, assessment 60%)
  - Vishnu Bisram: `vishnu.bisram@outlook.com` (Safe Zone — 3 completed, top scores 100/95/92%)

## File Naming Conventions
- **Components**: kebab-case files (`student-dashboard.tsx`), PascalCase exports (`StudentDashboard`)
- **Services**: kebab-case with `.service.ts` suffix
- **UI primitives**: `components/ui/` directory (shadcn/ui pattern)

## Do NOT
- Use React Router — routing is custom state-based in `App.tsx` (see `.claude/rules/navigation.md`)
- Use `prisma migrate` — this project uses `prisma db push` (no migration files)
- Create shared type packages between frontend/backend — they are fully independent
- Create separate Axios instances — always use the centralized one from `services/api.ts`
- Skip CSRF protection on mutation endpoints unless explicitly exempted
- Use `dangerouslySetInnerHTML` without `DOMPurify.sanitize()` — always wrap: `DOMPurify.sanitize(marked(content) as string)`
- Mock the database in tests — use real Prisma client with test database

## Testing
- **Framework**: Jest + ts-jest + supertest
- **Config**: `backend/jest.config.js`, setup in `backend/src/__tests__/setup.ts`
- **Pattern**: Integration tests with real Prisma client (not mocked)
- **Test data**: Use timestamp-based emails (`test-${Date.now()}@example.com`) to avoid collisions
- **Cleanup**: `afterAll()` with `deleteMany` on test records
- **Coverage is minimal** — only `auth.test.ts` exists currently

## Deployment
- **Live URL**: `https://cyberguard-ai-rt1n.onrender.com`
- **Host**: Render free tier (single web service serving both frontend + backend)
- **Build**: `render-build.sh` or inline build command builds frontend → backend → prisma generate → db push → seed
- **Start**: `cd backend && npm start`
- **Production mode**: Backend serves frontend `dist/` via `express.static` + SPA catch-all, so CSRF cookies stay same-origin
- **Known limitation**: YouTube embeds don't work on Render free tier (blocked outbound ad domains)
