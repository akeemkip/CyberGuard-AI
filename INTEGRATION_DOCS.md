# AI Cybersecurity Training Platform - Integration Documentation

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | - | Type safety |
| Tailwind CSS | v4.x | Styling |
| Radix UI | - | Accessible components |
| Lucide Icons | - | Icons |
| Vite | 6.3.x | Build tool |

---

## 1. Required Type Definitions

Create `types/index.ts`:

```typescript
// User Roles
export type UserRole = 'learner' | 'admin' | 'trainer';
export type SkillLevel = 'novice' | 'beginner' | 'intermediate' | 'advanced' | 'expert';

// User Profile
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  jobTitle?: string;
  createdAt: Date;
  lastLogin: Date;

  // Learning Profile
  skillLevel: SkillLevel;
  enrolledCourses: string[];
  completedCourses: string[];
  progress: Record<string, number>;
  completedLessons: Record<string, string[]>;
  quizScores: Record<string, number>;

  // Assessment Data
  preTestScore: number | null;
  postTestScore: number | null;
  improvementRate: number;

  // Phishing Simulation Data
  phishingTests: PhishingTestResult[];
  phishingClickRate: number;
  phishingReportRate: number;

  // AI Adaptation Data
  recommendedContent: string[];
  weaknessAreas: string[];
  masteryAreas: string[];
  adaptiveDifficulty: number;

  // Engagement Metrics
  totalTimeSpent: number;
  loginStreak: number;
  lastActiveDate: Date;
  completionRate: number;
};

// Phishing Types
export type PhishingScenario = {
  id: string;
  title: string;
  difficulty: SkillLevel;
  description: string;
  emailSubject: string;
  emailFrom: string;
  emailBody: string;
  hasAttachment: boolean;
  attachmentName?: string;
  hasLink: boolean;
  linkUrl?: string;
  redFlags: string[];
  isPhishing: boolean;
  explanation: string;
  category: 'spear-phishing' | 'whaling' | 'smishing' | 'vishing' | 'general';
};

export type PhishingTestResult = {
  id: string;
  scenarioId: string;
  userId: string;
  action: 'clicked' | 'reported' | 'ignored' | 'deleted';
  isCorrect: boolean;
  timeToDecision: number;
  timestamp: Date;
  difficulty: SkillLevel;
};

// Interaction Logging
export type InteractionLog = {
  id: string;
  userId: string;
  timestamp: Date;
  action: string;
  resourceType: 'course' | 'lesson' | 'quiz' | 'simulation' | 'assessment' | 'ai-tutor';
  resourceId: string;
  metadata: Record<string, any>;
  duration?: number;
};
```

---

## 2. Dashboard Component

### File Location
`src/app/components/Dashboard.tsx`

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Header (sticky, glassmorphism)                              │
│ [Logo] [AI Tutor Button] [Theme Toggle] [Avatar] [Logout]   │
├─────────────────────────────────────────────────────────────┤
│ Stats Grid (4 cards)                                         │
│ ┌─────────┬─────────┬─────────┬─────────┐                   │
│ │Enrolled │Progress │Completed│ Streak  │                   │
│ │ Courses │   %     │ Courses │  Days   │                   │
│ └─────────┴─────────┴─────────┴─────────┘                   │
├─────────────────────────────────────────────────────────────┤
│ Quick Actions (2 cards)                                      │
│ ┌───────────────────────┬───────────────────────┐           │
│ │ Baseline Assessment   │ Phishing Simulation   │           │
│ └───────────────────────┴───────────────────────┘           │
├─────────────────────────────────────────────────────────────┤
│ Tabs: [My Courses] [Explore]                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Course Cards Grid                                        │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Props Interface

```typescript
type DashboardProps = {
  user: UserProfile;
  onNavigateToCourse: (courseId: string) => void;
  onNavigateToAITutor: () => void;
  onNavigateToAssessment: (assessmentId: string) => void;
  onNavigateToPhishingSim: () => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};
```

### Key Features

1. **Stats Cards** - Gradient backgrounds showing:
   - Enrolled courses count (blue gradient)
   - Overall progress percentage (purple gradient)
   - Completed courses (green gradient)
   - Learning streak (orange gradient)

2. **Quick Actions** - Clickable cards for:
   - Baseline Assessment (with completion status badge)
   - Phishing Simulation (with test count badge)

3. **Tabbed Content**:
   - **My Courses**: Shows enrolled courses with progress bars
   - **Explore**: Shows available courses to enroll

### Helper Functions Used

```typescript
// Get user initials for avatar
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Get badge color based on course level
const getLevelColor = (level: string) => {
  switch (level) {
    case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    case 'intermediate': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    case 'advanced': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};
```

### Progress Calculation

```typescript
const totalProgress = enrolledCourses.length > 0
  ? enrolledCourses.reduce((sum, course) => sum + (user.progress[course.id] || 0), 0) / enrolledCourses.length
  : 0;

const completedCourses = enrolledCourses.filter(c => (user.progress[c.id] || 0) >= 100).length;
```

---

## 3. Phishing Simulation Component

### File Location
`src/app/components/PhishingSimulation.tsx`

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Header: [Mail Icon] "Phishing Simulation" [Dashboard Button]│
├─────────────────────────────────────────────────────────────┤
│ Stats Grid (4 cards) - shown when tests > 0                 │
│ ┌───────────┬───────────┬───────────┬────────────┐         │
│ │Total Tests│Click Rate │Report Rate│Avg Decision│         │
│ └───────────┴───────────┴───────────┴────────────┘         │
├──────────────────────────────┬──────────────────────────────┤
│ Email Card (2/3 width)       │ Info Panel (1/3 width)       │
│ ┌──────────────────────────┐ │ ┌──────────────────────────┐ │
│ │ From: [sender]           │ │ │ Scenario Info            │ │
│ │ Subject: [subject]       │ │ │ - Title                  │ │
│ │ [Attachment if any]      │ │ │ - Category               │ │
│ │                          │ │ │ - Description            │ │
│ │ [Email Body]             │ │ └──────────────────────────┘ │
│ │                          │ │ ┌──────────────────────────┐ │
│ │ [Link Preview if hasLink]│ │ │ Red Flags (after answer) │ │
│ │                          │ │ │ ✗ Flag 1                 │ │
│ └──────────────────────────┘ │ │ ✗ Flag 2                 │ │
│ ┌──────────────────────────┐ │ └──────────────────────────┘ │
│ │ Action Buttons           │ │ ┌──────────────────────────┐ │
│ │ [Ignore] [Click Link]    │ │ │ Quick Tips               │ │
│ │ [Delete] [Report Phish]  │ │ │ ✓ Verify sender emails   │ │
│ └──────────────────────────┘ │ │ ✓ Hover over links       │ │
│ OR                           │ │ ✓ Be suspicious of urgent│ │
│ ┌──────────────────────────┐ │ └──────────────────────────┘ │
│ │ Result Alert             │ │                              │
│ │ ✓/✗ Correct/Incorrect    │ │                              │
│ │ Explanation              │ │                              │
│ │ [Next Scenario]          │ │                              │
│ └──────────────────────────┘ │                              │
└──────────────────────────────┴──────────────────────────────┘
```

### Props Interface

```typescript
type PhishingSimulationProps = {
  user: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onNavigateToDashboard: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};
```

### State Management

```typescript
const [scenario, setScenario] = useState<PhishingScenario | null>(null);
const [startTime, setStartTime] = useState<number>(Date.now());
const [hasInteracted, setHasInteracted] = useState(false);
const [result, setResult] = useState<{
  action: 'clicked' | 'reported' | 'ignored' | 'deleted';
  isCorrect: boolean;
  timeToDecision: number;
} | null>(null);
const [stats, setStats] = useState<{
  clickRate: number;
  reportRate: number;
  totalTests: number;
  averageDecisionTime: number;
} | null>(null);
```

### Simulation Flow

```
1. Component mounts → loadNewScenario()
2. User sees email with 4 action buttons
3. Timer starts tracking decision time
4. User clicks action → handleAction()
5. Determine correctness:
   - If phishing: correct = reported OR deleted
   - If legitimate: correct = ignored OR clicked
6. Save result, update user profile
7. Show result alert with explanation
8. User clicks "Next Scenario" → repeat
```

### Correctness Logic

```typescript
let isCorrect = false;
if (scenario.isPhishing) {
  // For phishing: reporting or deleting is correct
  isCorrect = action === 'reported' || action === 'deleted';
} else {
  // For legitimate: ignoring (reading) or clicking is correct
  isCorrect = action === 'ignored' || action === 'clicked';
}
```

### User Profile Update After Action

```typescript
const updatedTests = [...user.phishingTests, testResult];
const clickedTests = updatedTests.filter(t => t.action === 'clicked');
const reportedTests = updatedTests.filter(t => t.action === 'reported');

const updates: Partial<UserProfile> = {
  phishingTests: updatedTests,
  phishingClickRate: (clickedTests.length / updatedTests.length) * 100,
  phishingReportRate: (reportedTests.length / updatedTests.length) * 100,
};

onUpdateProfile(updates);
```

---

## 4. Phishing Scenarios Data

### File Location
`src/app/data/phishing.ts`

### Available Scenarios (8 Total)

| ID | Title | Difficulty | Category | Is Phishing? | Key Red Flag |
|----|-------|-----------|----------|--------------|--------------|
| phish-1 | Urgent Account Verification | beginner | general | Yes | Misspelled domain (paypa1) |
| phish-2 | CEO Urgent Request | intermediate | whaling | Yes | Unusual urgency + money request |
| phish-3 | IT Department Update | beginner | general | Yes | External IT domain, asking for password |
| phish-4 | Package Delivery Notification | intermediate | general | Yes | .pdf.exe file extension |
| phish-5 | Team Meeting Invitation | beginner | general | No | Legitimate internal email |
| phish-6 | Cloud Storage Upgrade | intermediate | general | Yes | External domain, too good to be true |
| phish-7 | Tax Refund Notification | advanced | spear-phishing | Yes | Complex domain, IRS impersonation |
| phish-8 | System Update Required | advanced | spear-phishing | Yes | Exe download, technical language |

### Helper Functions

```typescript
// Get scenario by ID
export const getPhishingScenarioById = (id: string): PhishingScenario | undefined => {
  return phishingScenarios.find(s => s.id === id);
};

// Get scenarios by difficulty
export const getPhishingScenariosByDifficulty = (difficulty: SkillLevel): PhishingScenario[] => {
  return phishingScenarios.filter(s => s.difficulty === difficulty);
};

// Get random scenario (optionally by difficulty)
export const getRandomPhishingScenario = (difficulty?: SkillLevel): PhishingScenario => {
  const scenarios = difficulty
    ? phishingScenarios.filter(s => s.difficulty === difficulty)
    : phishingScenarios;
  return scenarios[Math.floor(Math.random() * scenarios.length)];
};

// Save test result
export const savePhishingResult = (result: PhishingTestResult): void => {
  phishingResults.push(result);
};

// Get user's results
export const getUserPhishingResults = (userId: string): PhishingTestResult[] => {
  return phishingResults.filter(r => r.userId === userId);
};

// Calculate statistics
export const calculatePhishingStats = (userId: string): {
  clickRate: number;
  reportRate: number;
  totalTests: number;
  averageDecisionTime: number;
} => {
  const results = getUserPhishingResults(userId);

  if (results.length === 0) {
    return { clickRate: 0, reportRate: 0, totalTests: 0, averageDecisionTime: 0 };
  }

  const clicked = results.filter(r => r.action === 'clicked').length;
  const reported = results.filter(r => r.action === 'reported').length;
  const totalTime = results.reduce((sum, r) => sum + r.timeToDecision, 0);

  return {
    clickRate: (clicked / results.length) * 100,
    reportRate: (reported / results.length) * 100,
    totalTests: results.length,
    averageDecisionTime: totalTime / results.length,
  };
};
```

---

## 5. App Router (Main State Management)

### File Location
`src/app/App.tsx`

### Page Types

```typescript
export type Page =
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'admin-dashboard'
  | 'course'
  | 'ai-tutor'
  | 'assessment'
  | 'phishing-sim';
```

### App State

```typescript
export type AppState = {
  currentPage: Page;
  currentUser: UserProfile | null;
  currentCourseId: string | null;
  currentAssessmentId: string | null;
  theme: 'light' | 'dark';
};
```

### Key Functions

```typescript
// Navigation
const navigateTo = (page: Page, courseId?: string, assessmentId?: string) => {
  setState(prev => ({
    ...prev,
    currentPage: page,
    currentCourseId: courseId || null,
    currentAssessmentId: assessmentId || null,
  }));
};

// Profile updates (passed to components)
const updateUserProfile = (updates: Partial<UserProfile>) => {
  if (!state.currentUser) return;
  setState(prev => ({
    ...prev,
    currentUser: { ...prev.currentUser!, ...updates },
  }));
};

// Theme toggle
const toggleTheme = () => {
  setState(prev => ({
    ...prev,
    theme: prev.theme === 'light' ? 'dark' : 'light',
  }));
};

// Logout
const logout = () => {
  setState(prev => ({
    ...prev,
    currentUser: null,
    currentPage: 'login',
    currentCourseId: null,
    currentAssessmentId: null,
  }));
};
```

### Persistence (localStorage)

```typescript
// Theme persistence
useEffect(() => {
  if (state.theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('theme', state.theme);
}, [state.theme]);

// User session persistence
useEffect(() => {
  if (state.currentUser) {
    localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
  } else {
    localStorage.removeItem('currentUser');
  }
}, [state.currentUser]);
```

---

## 6. Interaction Logger Service

### File Location
`src/app/services/interaction-logger.ts`

### Singleton Pattern

```typescript
class InteractionLogger {
  private logs: InteractionLog[] = [];
  private sessionStart: Date | null = null;
  private currentResourceStart: Date | null = null;

  // ... methods
}

export const interactionLogger = new InteractionLogger();
```

### Key Methods

```typescript
// Session management
startSession(userId: string): void
endSession(userId: string): void

// Resource tracking
startResourceTracking(userId, resourceType, resourceId): void
endResourceTracking(userId, resourceType, resourceId, completed?): void

// Specific logging
logCourseEnrollment(userId, courseId): void
logLessonStart(userId, lessonId, lessonType): void
logLessonComplete(userId, lessonId): void
logQuizAttempt(userId, quizId, score, timeSpent, passed): void
logAssessmentAttempt(userId, assessmentId, assessmentType, score, timeSpent): void
logPhishingInteraction(userId, scenarioId, action, isCorrect, timeToDecision): void
logAITutorInteraction(userId, query, responseType): void

// Analytics
getUserLogs(userId): InteractionLog[]
getTotalTimeSpent(userId): number
getEngagementMetrics(userId): EngagementMetrics
exportLogs(format: 'json' | 'csv'): string
```

---

## 7. Required UI Components (Radix UI)

You'll need these from `components/ui/`:

- `Button` - Action buttons
- `Card`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle` - Card layouts
- `Badge` - Status badges and labels
- `Progress` - Progress bars
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger` - Tabbed navigation
- `Avatar`, `AvatarFallback` - User avatars
- `Alert`, `AlertDescription` - Result alerts

---

## 8. Required Icons (Lucide)

```typescript
import {
  // Dashboard
  Shield, Moon, Sun, LogOut, BookOpen, Award, TrendingUp,
  Clock, Star, Users, Brain, Play, CheckCircle2, Target,
  Zap, FileText, Mail,

  // Phishing Simulation
  ArrowLeft, User, Paperclip, Link2, AlertTriangle, XCircle,
  Eye, Trash2, Flag, MousePointerClick, TrendingDown
} from 'lucide-react';
```

---

## 9. Integration Steps

### Step 1: Install Dependencies

```bash
npm install react react-dom typescript
npm install tailwindcss @tailwindcss/vite
npm install @radix-ui/react-tabs @radix-ui/react-avatar @radix-ui/react-progress
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
```

### Step 2: Copy Required Files

1. **Types**: Copy `src/app/types/index.ts`
2. **Phishing Data**: Copy `src/app/data/phishing.ts`
3. **Dashboard**: Copy `src/app/components/Dashboard.tsx`
4. **PhishingSimulation**: Copy `src/app/components/PhishingSimulation.tsx`
5. **Interaction Logger**: Copy `src/app/services/interaction-logger.ts`
6. **UI Components**: Copy needed components from `src/app/components/ui/`

### Step 3: Configure Tailwind

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Step 4: Create Mock User for Testing

```typescript
const mockUser: UserProfile = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'learner',
  skillLevel: 'beginner',
  enrolledCourses: [],
  completedCourses: [],
  progress: {},
  completedLessons: {},
  quizScores: {},
  preTestScore: null,
  postTestScore: null,
  improvementRate: 0,
  phishingTests: [],
  phishingClickRate: 0,
  phishingReportRate: 0,
  recommendedContent: [],
  weaknessAreas: [],
  masteryAreas: [],
  adaptiveDifficulty: 1,
  totalTimeSpent: 0,
  loginStreak: 0,
  lastActiveDate: new Date(),
  completionRate: 0,
  createdAt: new Date(),
  lastLogin: new Date(),
};
```

### Step 5: Set Up Your App Router

```typescript
function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'phishing-sim'>('dashboard');
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <div>
      {currentPage === 'dashboard' && (
        <Dashboard
          user={user}
          onNavigateToCourse={(id) => console.log('Navigate to course:', id)}
          onNavigateToAITutor={() => console.log('Navigate to AI Tutor')}
          onNavigateToAssessment={(id) => console.log('Navigate to assessment:', id)}
          onNavigateToPhishingSim={() => setCurrentPage('phishing-sim')}
          onLogout={() => console.log('Logout')}
          theme={theme}
          onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        />
      )}

      {currentPage === 'phishing-sim' && (
        <PhishingSimulation
          user={user}
          onUpdateProfile={updateUserProfile}
          onNavigateToDashboard={() => setCurrentPage('dashboard')}
          theme={theme}
          onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        />
      )}
    </div>
  );
}
```

---

## 10. Metrics Tracked

| Metric | Description | Calculation |
|--------|-------------|-------------|
| Click Rate | % of tests where user clicked link | `(clicked / total) × 100` |
| Report Rate | % of tests where user reported | `(reported / total) × 100` |
| Avg Decision Time | Average seconds to decide | `sum(timeToDecision) / total` |
| Correctness | Whether action was appropriate | Based on `scenario.isPhishing` |

---

## 11. File Structure Reference

```
src/app/
├── App.tsx                          # Main router & state
├── types/
│   └── index.ts                     # TypeScript definitions
├── components/
│   ├── Dashboard.tsx                # Learner dashboard
│   ├── PhishingSimulation.tsx       # Phishing sim engine
│   └── ui/                          # Radix UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── progress.tsx
│       ├── tabs.tsx
│       ├── avatar.tsx
│       └── alert.tsx
├── data/
│   ├── phishing.ts                  # Phishing scenarios
│   └── courses.ts                   # Course catalog
└── services/
    └── interaction-logger.ts        # Analytics service
```

---

## 12. Styling Notes

### Dark Mode
- Uses Tailwind's `dark:` prefix
- Toggle applies/removes `dark` class on `document.documentElement`
- Persisted to localStorage

### Color Scheme
- **Blue gradients**: Primary actions, enrolled courses
- **Purple gradients**: AI features, progress
- **Green**: Success, correct answers, beginner level
- **Orange/Red**: Warnings, phishing alerts, advanced level
- **Gray**: Neutral backgrounds, borders

### Responsive Breakpoints
- Mobile: `< 768px` (single column)
- Tablet: `md:` 768px+ (2 columns)
- Desktop: `lg:` 1024px+ (3-4 columns)
