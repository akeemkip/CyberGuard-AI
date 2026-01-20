# CyberGuard AI - Project Context

> **Last Updated:** January 20, 2026
> **Status:** Production-Ready Core Features

---

## Project Overview

**CyberGuard AI** is a cybersecurity training platform that provides interactive courses, quizzes, hands-on labs, and AI-powered tutoring. Built as a full-stack monorepo with React frontend and Node.js/Express backend.

**Purpose:** Teach cybersecurity fundamentals to beginners through structured courses with progress tracking, assessments, and certificates.

---

## Tech Stack

### Frontend
- **Framework:** React 18.3.1 with TypeScript
- **Build:** Vite 6.3.5
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui + Radix UI
- **HTTP:** Axios
- **Rich Text:** TipTap editor
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** Sonner (toast)

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 4.21.1 with TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma 5.22.0
- **Auth:** JWT (jsonwebtoken 9.0.2)
- **Password:** bcryptjs 2.4.3
- **Validation:** Zod 3.23.8
- **AI:** Google Gemini 2.5 Flash

### Development
```bash
# Backend (Terminal 1)
cd backend
npm run dev              # http://localhost:3000

# Frontend (Terminal 2)
cd frontend
npm run dev              # http://localhost:5173 (or 5174/5175)
```

---

## Project Structure

```
CyberGuard-AI/
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   └── app/
│   │       ├── App.tsx                      # Main router with history support
│   │       ├── components/                  # All page components
│   │       │   ├── ui/                      # shadcn components
│   │       │   ├── landing-page.tsx
│   │       │   ├── login-page.tsx
│   │       │   ├── register-page.tsx
│   │       │   ├── student-dashboard.tsx
│   │       │   ├── course-catalog.tsx
│   │       │   ├── course-player.tsx
│   │       │   ├── certificates-page.tsx
│   │       │   ├── assessments-page.tsx
│   │       │   ├── profile-page.tsx
│   │       │   ├── settings-page.tsx
│   │       │   ├── ai-chat.tsx
│   │       │   ├── admin-dashboard.tsx
│   │       │   ├── admin-users.tsx
│   │       │   ├── admin-user-profile.tsx
│   │       │   ├── admin-content.tsx        # Course/Lesson/Quiz/Module management
│   │       │   ├── admin-lesson-edit.tsx    # Dedicated lesson editor page
│   │       │   ├── admin-quiz-edit.tsx      # Dedicated quiz editor page
│   │       │   ├── admin-settings.tsx
│   │       │   ├── admin-analytics.tsx
│   │       │   ├── RichTextEditor.tsx       # TipTap rich text editor
│   │       │   ├── ErrorBoundary.tsx        # Global error handler
│   │       │   └── user-profile-dropdown.tsx
│   │       ├── context/
│   │       │   ├── AuthContext.tsx
│   │       │   └── SettingsContext.tsx
│   │       └── services/                    # API layer
│   │           ├── api.ts
│   │           ├── auth.service.ts
│   │           ├── user.service.ts
│   │           ├── course.service.ts
│   │           ├── admin.service.ts
│   │           └── ai.service.ts
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── index.ts                         # Express server (CORS: 5173-5175)
│   │   ├── config/
│   │   │   └── database.ts                  # Prisma client
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── course.controller.ts
│   │   │   ├── admin.controller.ts
│   │   │   └── ai.controller.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── course.routes.ts
│   │   │   ├── admin.routes.ts
│   │   │   └── ai.routes.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   └── services/
│   │       └── ai.service.ts
│   ├── prisma/
│   │   ├── schema.prisma                    # Database schema
│   │   └── seed.ts
│   └── package.json
│
└── Docs/
    └── CONTEXT.md                           # This file
```

---

## Database Schema

### Core Models

**User**
- id, email, password (hashed), firstName, lastName, role (STUDENT/ADMIN)
- Relations: enrollments, progress, quizAttempts

**Course**
- id, title, description, difficulty, duration, isPublished, thumbnail
- Relations: modules, lessons, enrollments, labs

**Module** (Organizes lessons into sections)
- id, title, description, order, courseId
- Relations: course, lessons, labs

**Lesson**
- id, title, content (HTML), videoUrl, order, courseId, moduleId (nullable)
- Relations: course, module, quiz, progress

**Quiz**
- id, lessonId (unique, one-per-lesson), title, passingScore
- Relations: lesson, questions, attempts

**Question**
- id, quizId, question (HTML), options (String[]), correctAnswer (index), order
- Relations: quiz

**QuizAttempt**
- id, userId, quizId, score, passed, attemptedAt
- Relations: user, quiz

**Enrollment**
- id, userId, courseId, enrolledAt, completedAt
- Relations: user, course

**Progress**
- id, userId, lessonId, completed, completedAt
- Relations: user, lesson

**Lab** (Hands-on exercises - planned feature)
- id, title, description, instructions, courseId, moduleId
- Relations: course, module, labProgress

**LabProgress**
- id, userId, labId, status (NOT_STARTED/IN_PROGRESS/COMPLETED), timeSpent
- Relations: user, lab

### Key Relationships
- Course → Modules (1:many)
- Course → Lessons (1:many)
- Module → Lessons (1:many, optional)
- Lesson → Quiz (1:1, optional)
- Quiz → Questions (1:many)
- User → Enrollments → Courses (many:many)
- User → Progress → Lessons (many:many)

---

## Current Features

### Student Features ✅
- **Authentication:** Register, login, JWT tokens, password reset UI
- **Dashboard:** Stats, enrolled courses, learning insights, recent activity
- **Course Catalog:** Browse, filter, enroll in courses
- **Course Player:**
  - Lessons with rich content (text, video, images)
  - YouTube video integration with autoplay setting
  - Module-based navigation (collapsible sections)
  - Progress tracking (mark complete)
  - Quizzes with randomized questions/answers
  - Pass/fail results with explanations
- **Certificates:** Generated for completed courses, printable
- **Assessments:** 30-question skill test with 25-minute timer
- **AI Tutor:**
  - Platform-aware (knows courses, features)
  - User-specific context (enrollments, progress)
  - Personalized recommendations
  - Google Gemini 2.5 Flash integration
- **Profile:** Edit name, view enrolled courses
- **Settings:** Appearance, notifications, learning preferences

### Admin Features ✅
- **Dashboard:** Platform stats, enrollment trends, completion charts, activity feed
- **User Management:** CRUD operations, role changes, user statistics, export CSV
- **Content Management:**
  - **Courses:** Create, edit, delete, publish/unpublish
  - **Modules:** Create sections within courses, drag-and-drop reordering
  - **Lessons:** Rich text editor on dedicated page, video URLs, order management
  - **Quizzes:** Full quiz builder with drag-and-drop questions, rich text support
- **Analytics:** Real-time metrics, charts, completion breakdowns
- **Settings:** Platform configuration (6 tabs: General, Security, Courses, Users, Email, Appearance)

### UI/UX Features ✅
- **Navigation:** Browser back/forward support, page persistence on refresh
- **State Management:** Tab states saved to localStorage and browser history
- **Responsive:** Mobile menus, adaptive layouts
- **Dark Mode:** Theme toggle throughout app
- **Notifications:** Toast notifications for all actions
- **Loading States:** Skeletons, spinners, disabled states
- **Error Handling:** ErrorBoundary component, graceful degradation
- **Security:** XSS prevention (DOMPurify), CSRF protection, input validation

---

## Architectural Patterns

### 1. Modal vs Dedicated Page

**Rule:** Use modals for simple forms, dedicated pages for complex editors.

**Modals (Simple/Quick):**
- Create Course (3-5 fields, < 1 min)
- Delete Confirmation (yes/no decision)
- User Settings (simple toggles)

**Dedicated Pages (Complex/Extended):**
- Lesson Editor (rich text, video, long content)
- Quiz Builder (multiple questions, drag-and-drop)
- Any feature requiring > 3 workarounds

**Why:** Modals and rich text editors have competing focus management systems. Complex editors need full-page space to avoid:
- Focus trap conflicts
- Text selection issues
- Event bubbling problems
- Z-index headaches

**Red Flags for Wrong Pattern:**
- Multiple `preventDefault()` calls
- Custom focus management
- Modal > 80% viewport size
- Forced re-renders to fix state
- Nested scrolling containers

### 2. Navigation Pattern

**App.tsx manages routing:**
- Page state: `currentPage` (saved to localStorage)
- Entity IDs: `selectedCourseId`, `selectedLessonId`, etc.
- Browser history integration: `window.history.pushState/replaceState`

**Navigation function:**
```typescript
const handleNavigate = (page: Page, id?: string) => {
  setCurrentPage(page);
  if (id) setSelectedEntityId(id);
  localStorage.setItem('currentPage', page);
  window.history.pushState({ page, id }, '', window.location.pathname);
};
```

**Props passed to components:**
```typescript
<Component onNavigate={handleNavigate} onLogout={handleLogout} />
```

### 3. Tab State Persistence

**Pattern for admin pages with tabs:**
```typescript
const [activeTab, setActiveTab] = useState(() => {
  return localStorage.getItem('adminContentTab') || 'courses';
});

// Restore from browser history (back button)
useEffect(() => {
  const historyState = window.history.state;
  if (historyState?.activeTab) {
    setActiveTab(historyState.activeTab);
  }
}, []);

// Save to localStorage and history
useEffect(() => {
  localStorage.setItem('adminContentTab', activeTab);
  const currentState = window.history.state || {};
  window.history.replaceState(
    { ...currentState, activeTab },
    '',
    window.location.pathname
  );
}, [activeTab]);
```

**Clear on logout:**
```typescript
const handleLogout = () => {
  logout();
  localStorage.removeItem('currentPage');
  localStorage.removeItem('adminContentTab');
  localStorage.removeItem('adminSettingsTab');
  // ... clear all state
};
```

### 4. API Service Layer

**Structure:**
- `api.ts` - Axios instance with interceptors
- `*.service.ts` - Domain-specific API calls

**Pattern:**
```typescript
// api.ts
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// course.service.ts
export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    const response = await api.get<{ courses: Course[] }>('/courses');
    return response.data.courses;
  },
  // ... more methods
};
```

### 5. Form Validation

**Backend (Zod):**
```typescript
const createCourseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
});
```

**Frontend (React state + validation):**
```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

const validate = () => {
  const newErrors: Record<string, string> = {};
  if (title.length < 3) newErrors.title = 'Min 3 characters';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### 6. Error Handling

**ErrorBoundary wraps app:**
```typescript
// App.tsx
<ErrorBoundary>
  <AppContent />
</ErrorBoundary>
```

**Toast notifications for operations:**
```typescript
try {
  await courseService.createCourse(data);
  toast.success('Course created successfully');
} catch (error) {
  toast.error('Failed to create course');
  console.error(error);
}
```

### 7. Rich Text Editor (TipTap)

**Used in:** Lesson editor, quiz question editor

**Configuration:**
```typescript
const editor = useEditor({
  extensions: [
    StarterKit,
    Underline,
    TextAlign,
    Color,
    Image,
    Link,
    // ... more extensions
  ],
  content: initialContent,
  onUpdate: ({ editor }) => {
    onChange(editor.getHTML());
  }
});
```

**Security:** All HTML sanitized with DOMPurify before rendering.

### 8. Drag and Drop (@dnd-kit)

**Used in:** Module reordering, question reordering

**Pattern:**
```typescript
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (active.id !== over?.id) {
    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered.map((item, idx) => ({ ...item, order: idx })));
  }
};
```

---

## API Endpoints

### Auth
- POST `/api/auth/register` - Create account
- POST `/api/auth/login` - Get JWT token
- GET `/api/auth/me` - Get current user (requires auth)

### Users
- GET `/api/users` - List all users (admin only)
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user (admin only)
- GET `/api/users/:id/stats` - User statistics (admin only)

### Courses
- GET `/api/courses` - List all published courses
- GET `/api/courses/:id` - Get course with lessons
- GET `/api/courses/:id/progress` - Get user's progress (requires auth)
- POST `/api/courses/:id/enroll` - Enroll in course (requires auth)
- POST `/api/courses/lessons/:lessonId/complete` - Mark lesson complete (requires auth)

### Quizzes
- GET `/api/courses/quiz/:quizId` - Get quiz with questions (hides correct answers)
- POST `/api/courses/quiz/:quizId/submit` - Submit quiz answers, get results

### Admin - Stats
- GET `/api/admin/stats` - Dashboard statistics
- GET `/api/admin/enrollments` - All enrollments

### Admin - Courses
- GET `/api/admin/courses` - All courses (including unpublished)
- POST `/api/admin/courses` - Create course
- PUT `/api/admin/courses/:id` - Update course
- DELETE `/api/admin/courses/:id` - Delete course
- PATCH `/api/admin/courses/:id/publish` - Toggle publish status

### Admin - Lessons
- GET `/api/admin/courses/:courseId/lessons` - Course lessons
- GET `/api/courses/lessons/:lessonId` - Lesson by ID
- POST `/api/admin/courses/:courseId/lessons` - Create lesson
- PUT `/api/admin/courses/:courseId/lessons/:id` - Update lesson
- DELETE `/api/admin/courses/:courseId/lessons/:id` - Delete lesson
- PUT `/api/admin/courses/:courseId/lessons/reorder` - Reorder lessons

### Admin - Modules
- GET `/api/admin/courses/:courseId/modules` - Course modules
- POST `/api/admin/courses/:courseId/modules` - Create module
- PUT `/api/admin/courses/:courseId/modules/:id` - Update module
- DELETE `/api/admin/courses/:courseId/modules/:id` - Delete module
- PUT `/api/admin/courses/:courseId/modules/reorder` - Reorder modules
- PUT `/api/admin/courses/:courseId/modules/:moduleId/lessons/:lessonId` - Assign lesson to module

### Admin - Quizzes
- GET `/api/admin/quizzes` - All quizzes with stats
- GET `/api/admin/quizzes/:id` - Quiz by ID
- POST `/api/admin/quizzes` - Create quiz
- PUT `/api/admin/quizzes/:id` - Update quiz
- DELETE `/api/admin/quizzes/:id` - Delete quiz

### AI
- POST `/api/ai/chat` - Send message to AI tutor (requires auth)

---

## Test Accounts

**Student Account:**
- Email: `akeemkippins.gy@gmail.com`
- Password: `C0c@1n380Z`
- Has historical data: enrollments, progress, quiz attempts

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

---

## Known Limitations

### Backend
- No email service (password reset is UI-only)
- No file upload (course thumbnails are URLs)
- No real-time features (WebSocket)
- AI responses not streamed (full response at once)

### Frontend
- No conversation history for AI (each message independent)
- Settings saved locally (not synced to backend)
- No bulk operations in admin (must act on items individually)
- No undo/redo for rich text editor

### Security
- JWT stored in localStorage (vulnerable to XSS - should use httpOnly cookies)
- No rate limiting on API endpoints
- No CAPTCHA on registration/login
- Admin dashboard accessible without 2FA

---

## Environment Variables

**Backend (.env):**
```
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/cyberguard"
JWT_SECRET="your-secret-key"
PORT=3000
GEMINI_API_KEY="your-google-api-key"
```

---

## Common Conventions

### Naming
- Components: PascalCase (`StudentDashboard.tsx`)
- Services: camelCase with namespace (`courseService.getAllCourses()`)
- Types/Interfaces: PascalCase (`interface User { }`)
- Database: snake_case tables, camelCase in Prisma models

### File Organization
- Components: One per file, co-located with styles
- Services: Grouped by domain (auth, course, admin, AI)
- Types: Defined in service files, imported where needed

### State Management
- Local state: `useState` for component-specific
- Global state: React Context for auth and settings
- Server state: Fetch on mount, store in component state
- Cache: No caching layer (could add React Query)

### Styling
- Tailwind utility classes
- shadcn components for consistency
- Custom CSS only for complex layouts (rare)
- Dark mode: `dark:` prefix on classes

### Error Messages
- User-facing: Generic ("Failed to load courses")
- Console: Detailed (full error object logged)
- Toast: 4 seconds for info, 3 for success, 5 for errors

---

## Next Steps / Planned Features

### High Priority
- [ ] Labs System (hands-on exercises)
- [ ] Streaming AI responses
- [ ] Conversation history for AI
- [ ] Backend settings sync

### Medium Priority
- [ ] Email notifications
- [ ] File upload for thumbnails
- [ ] Bulk admin operations
- [ ] Advanced analytics (per-question difficulty)

### Low Priority
- [ ] Mobile app
- [ ] Social features (leaderboards, badges)
- [ ] Course marketplace
- [ ] Multi-language support

---

## Quick Reference

**Start Development:**
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

**Reset Database:**
```bash
cd backend
npx prisma db push --force-reset
npm run db:seed
```

**Build for Production:**
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build
```

**Useful Commands:**
```bash
# Prisma
npx prisma generate        # Regenerate client
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Create migration

# Check running processes
netstat -ano | findstr :3000   # Windows
lsof -ti:3000 | xargs kill     # Mac/Linux
```

---

**End of Context Document**
