# CyberGuard-AI

AI-powered cybersecurity training platform with adaptive learning, phishing simulations, interactive labs, and comprehensive analytics.

## Architecture

Monolithic 2-tier app: React SPA frontend + Express.js REST API backend + PostgreSQL database.

```
CyberGuard-AI/
├── frontend/          # React 18 + Vite 6 + TypeScript SPA
├── backend/           # Express.js + TypeScript REST API
├── Docs/              # Project docs, SQL backups, TODOs
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
- **Email**: Nodemailer with AES-256-GCM encrypted SMTP credentials
- **Validation**: Zod
- **Security**: CSRF (double-submit cookie), rate limiting (express-rate-limit), sanitize-html

### Database
- **Engine**: PostgreSQL
- **ORM**: Prisma — schema at `backend/prisma/schema.prisma`
- **Migrations**: Uses `prisma db push` workflow (no migration files)
- **Key models**: User, Course, Module, Lesson, Quiz, Lab, Enrollment, Certificate, PhishingScenario, IntroAssessment, PlatformSettings
- **Enums**: Role (STUDENT/ADMIN), LabType (8 types), LabStatus, PhishingAction

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
4. New students get redirected through welcome → intro assessment flow
5. Token expiry caught by Axios 401 interceptor

### Security (Backend)
- CSRF: double-submit cookie + `x-csrf-token` header on mutations
- Rate limiting: 100 req/15min general, 10 req/15min on auth endpoints
- XSS: sanitize-html on request bodies (rich text fields exempted)
- Password: bcryptjs, min 8 chars with complexity requirements
- Account lockout after failed login attempts

## Test Accounts (from seed)
- **Admin**: `admin@cyberguard.com` / `admin123`
- **Students**: Various `@cyberguard.com` accounts / `student123`

## File Naming Conventions
- **Components**: kebab-case files (`student-dashboard.tsx`), PascalCase exports (`StudentDashboard`)
- **Services**: kebab-case with `.service.ts` suffix
- **UI primitives**: `components/ui/` directory (shadcn/ui pattern)
