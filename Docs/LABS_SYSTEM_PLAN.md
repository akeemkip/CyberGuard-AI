# Labs System - Implementation Plan

## Overview
Add a Labs system to provide hands-on practical exercises for students, allowing them to apply cybersecurity concepts in simulated scenarios.

---

## 1. Current State Analysis

### What Already Exists ✅
- **Courses**: Top-level containers
- **Modules**: Section groupings within courses
- **Lessons**: Content units with text/video
- **Quizzes**: Knowledge assessments
- **Progress Tracking**: Lesson and quiz completion

### What's Missing ❌
- No hands-on practical exercises
- No scenario-based learning
- No step-by-step guided activities
- No environment descriptions for practice
- No way to track lab completion separately

---

## 2. What Are Labs?

**Labs are hands-on practical exercises** where students apply knowledge in simulated scenarios.

### Example: Password Cracking Lab
```
Title: "Brute Force Attack Simulation"
Objective: Understand how weak passwords can be cracked
Scenario: You are a security tester evaluating password strength
Instructions:
  1. Set up a test environment
  2. Use a password cracking tool
  3. Try different password combinations
  4. Analyze results and time taken
  5. Document findings
Resources: Password list, cracking tool guide
Estimated Time: 30 minutes
```

### Lab vs Lesson vs Quiz

| Feature | Lesson | Quiz | Lab |
|---------|--------|------|-----|
| **Purpose** | Learn concepts | Test knowledge | Apply skills |
| **Format** | Text/Video | Multiple choice | Step-by-step activity |
| **Interaction** | Read/Watch | Answer questions | Perform tasks |
| **Completion** | Mark as done | Submit answers | Complete objectives |
| **Time** | 10-15 min | 5-10 min | 20-60 min |

---

## 3. Database Schema Design

### New Model: Lab

```prisma
model Lab {
  id              String         @id @default(uuid())
  title           String
  description     String
  instructions    String         // HTML content with step-by-step guide
  scenario        String?        // Background story/context
  objectives      String[]       // Array of learning objectives
  resources       String?        // Links, files, tools needed
  hints           String?        // Optional hints for students
  difficulty      String         @default("Beginner") // Beginner, Intermediate, Advanced
  estimatedTime   Int?           // Minutes
  order           Int            // For ordering labs
  courseId        String
  moduleId        String?        // NULLABLE - can belong to module or just course
  isPublished     Boolean        @default(false)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  course          Course         @relation(fields: [courseId], references: [id], onDelete: Cascade)
  module          Module?        @relation(fields: [moduleId], references: [id], onDelete: SetNull)
  progress        LabProgress[]

  @@map("labs")
}

model LabProgress {
  id          String    @id @default(uuid())
  userId      String
  labId       String
  status      LabStatus @default(NOT_STARTED) // NOT_STARTED, IN_PROGRESS, COMPLETED
  timeSpent   Int       @default(0)  // Minutes spent on lab
  notes       String?   // Student's personal notes
  startedAt   DateTime?
  completedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  lab         Lab       @relation(fields: [labId], references: [id], onDelete: Cascade)

  @@unique([userId, labId])
  @@map("lab_progress")
}

enum LabStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}
```

### Updated Models

**Course Model:**
```prisma
model Course {
  // ... existing fields
  labs        Lab[]
}
```

**Module Model:**
```prisma
model Module {
  // ... existing fields
  labs        Lab[]
}
```

**User Model:**
```prisma
model User {
  // ... existing fields
  labProgress LabProgress[]
}
```

**Key Decisions:**
- Labs can belong to a course directly OR to a module within a course
- `moduleId` is nullable for flexibility
- `objectives` is an array to store multiple learning goals
- `LabProgress` tracks status, time spent, and personal notes
- `isPublished` allows admins to draft labs before releasing

---

## 4. Backend API Design

### Lab Management Endpoints (Admin)

#### GET /api/admin/labs
**Purpose:** Get all labs with statistics
**Response:**
```typescript
{
  labs: [
    {
      id: string,
      title: string,
      description: string,
      difficulty: string,
      estimatedTime: number,
      order: number,
      courseId: string,
      courseTitle: string,
      moduleId: string | null,
      moduleTitle: string | null,
      isPublished: boolean,
      totalAttempts: number,
      completionRate: number,
      avgTimeSpent: number,
      createdAt: Date,
      updatedAt: Date
    }
  ]
}
```

#### GET /api/admin/labs/:id
**Purpose:** Get lab by ID with full details
**Response:**
```typescript
{
  id: string,
  title: string,
  description: string,
  instructions: string,
  scenario: string,
  objectives: string[],
  resources: string,
  hints: string,
  difficulty: string,
  estimatedTime: number,
  order: number,
  courseId: string,
  moduleId: string | null,
  isPublished: boolean,
  course: {
    id: string,
    title: string
  },
  module: {
    id: string,
    title: string
  } | null,
  stats: {
    totalAttempts: number,
    completionRate: number,
    avgTimeSpent: number
  }
}
```

#### POST /api/admin/labs
**Purpose:** Create new lab
**Request Body:**
```typescript
{
  title: string,
  description: string,
  instructions: string,
  scenario?: string,
  objectives: string[],
  resources?: string,
  hints?: string,
  difficulty: string,
  estimatedTime?: number,
  order: number,
  courseId: string,
  moduleId?: string,
  isPublished: boolean
}
```

#### PUT /api/admin/labs/:id
**Purpose:** Update lab
**Request Body:** Same as POST

#### DELETE /api/admin/labs/:id
**Purpose:** Delete lab and all associated progress
**Response:**
```typescript
{
  message: string,
  deletedProgress: number
}
```

#### PUT /api/admin/labs/reorder
**Purpose:** Reorder labs
**Request Body:**
```typescript
{
  labOrders: [
    { id: string, order: number }
  ]
}
```

### Lab Progress Endpoints (Student)

#### GET /api/labs/course/:courseId
**Purpose:** Get all published labs for a course
**Response:**
```typescript
{
  labs: [
    {
      id: string,
      title: string,
      description: string,
      difficulty: string,
      estimatedTime: number,
      order: number,
      moduleId: string | null,
      moduleTitle: string | null,
      userProgress: {
        status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED",
        timeSpent: number,
        startedAt: Date | null,
        completedAt: Date | null
      } | null
    }
  ]
}
```

#### GET /api/labs/:id
**Purpose:** Get lab details for student
**Response:**
```typescript
{
  id: string,
  title: string,
  description: string,
  instructions: string,
  scenario: string,
  objectives: string[],
  resources: string,
  hints: string,
  difficulty: string,
  estimatedTime: number,
  userProgress: {
    status: string,
    timeSpent: number,
    notes: string,
    startedAt: Date | null,
    completedAt: Date | null
  } | null
}
```

#### POST /api/labs/:id/start
**Purpose:** Mark lab as started
**Response:**
```typescript
{
  message: string,
  progress: LabProgress
}
```

#### PUT /api/labs/:id/complete
**Purpose:** Mark lab as completed
**Request Body:**
```typescript
{
  timeSpent: number,  // Total minutes spent
  notes?: string      // Optional completion notes
}
```

#### PUT /api/labs/:id/notes
**Purpose:** Update lab notes
**Request Body:**
```typescript
{
  notes: string
}
```

---

## 5. Frontend Component Design

### 5.1 Labs Tab (admin-content.tsx)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Labs                                      [Create Lab]   │
├─────────────────────────────────────────────────────────┤
│ Search: [___________]  Course: [All ▼]  Status: [All ▼] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [☰] Password Cracking Lab        [Edit] [Delete]   │ │
│ │ Advanced Threat Analysis • Module 2 • Intermediate  │ │
│ │ 🎯 4 objectives • ⏱ 30 min • 📊 85% completion     │ │
│ │ ✓ Published                                         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [☰] Network Scanning Lab         [Edit] [Delete]   │ │
│ │ Advanced Threat Analysis • No Module • Advanced     │ │
│ │ 🎯 5 objectives • ⏱ 45 min • 📊 72% completion     │ │
│ │ ⚠️ Draft                                            │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Search by title, description
- Filter by course
- Filter by status (Published/Draft/All)
- Drag-and-drop reordering
- Create/Edit/Delete labs
- Shows statistics (completion rate, avg time)
- Published/Draft badge
- Shows course, module, difficulty, estimated time

### 5.2 Lab Editor Page (admin-lab-edit.tsx)

**New dedicated page** (like quiz editor)

**Sections:**

**A. Basic Information**
- Title (required, 3-200 chars)
- Description (required, 10-500 chars)
- Difficulty (Beginner/Intermediate/Advanced)
- Estimated time (minutes)
- Course selector
- Module selector (optional)
- Published checkbox

**B. Content Editor**
- Scenario textarea (rich text)
- Instructions editor (rich text, step-by-step)
- Resources textarea
- Hints textarea (optional)

**C. Objectives Manager**
- Add/remove objectives (bullets)
- Drag to reorder
- Minimum 1 objective required

**D. Statistics Panel** (if editing existing lab)
- Total attempts
- Completion rate
- Average time spent
- Show/hide student progress

**E. Preview Mode**
- Toggle between edit/preview
- Shows student view of lab
- Test instructions formatting

### 5.3 Student Lab View (lab-player.tsx)

**New dedicated page** for lab completion

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ ← Back to Course          Password Cracking Lab         │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐  ┌──────────────────────┐  │
│ │ Main Content            │  │ Lab Info             │  │
│ │                         │  │                      │  │
│ │ Scenario:               │  │ ⏱ Estimated: 30 min │  │
│ │ You are a security...   │  │ 📊 Difficulty: Int   │  │
│ │                         │  │ 🎯 Status: Started   │  │
│ │ Objectives:             │  │ ⏲ Time: 12 min      │  │
│ │ □ Understand brute...   │  │                      │  │
│ │ □ Use cracking tool     │  │ [Mark Complete]      │  │
│ │ □ Analyze results       │  │                      │  │
│ │                         │  │ My Notes:            │  │
│ │ Instructions:           │  │ ┌──────────────────┐ │  │
│ │ Step 1: Set up...       │  │ │                  │ │  │
│ │ Step 2: Download...     │  │ │                  │ │  │
│ │ Step 3: Run tool...     │  │ │                  │ │  │
│ │                         │  │ └──────────────────┘ │  │
│ │ Resources:              │  │ [Save Notes]         │  │
│ │ - Tool link             │  │                      │  │
│ │ - Documentation         │  │ Need help?           │  │
│ │                         │  │ [Show Hints]         │  │
│ └─────────────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Clean reading layout
- Scenario at top
- Objectives checklist (visual only)
- Step-by-step instructions with formatting
- Resources section with links
- Sidebar with lab info and timer
- Notes section (auto-save)
- Show/hide hints button
- Mark complete button
- Time tracking (starts on page load)
- Progress indicator

### 5.4 Course Player Integration

**Add Labs to course sidebar:**
```
Course Content
  ▼ Module 1: Introduction (2/3 completed)
    ✓ Lesson 1: Basics
    ✓ Lesson 2: Advanced
    □ Quiz: Module 1 Assessment

  ▼ Module 2: Practical (0/2 completed)
    □ Lesson 3: Techniques
    🔬 Lab: Password Cracking  [Start Lab]
```

**Features:**
- Labs appear in module sections
- Lab icon (🔬 or beaker icon)
- Status badge (Not Started/In Progress/Completed)
- Click to open lab player
- Shows in separate view (not inline)

---

## 6. Data Migration Strategy

### Challenge
No existing labs - need to create sample data for all courses.

### Strategy: Create Sample Labs

**Create 1-2 labs per course** covering different difficulty levels:

**Course: Phishing Detection**
- Lab 1: "Email Header Analysis" (Beginner, 20 min)
- Lab 2: "Link Investigation" (Intermediate, 30 min)

**Course: Password Security**
- Lab 1: "Password Strength Testing" (Beginner, 15 min)
- Lab 2: "Multi-Factor Setup" (Intermediate, 25 min)

**Course: Advanced Threat Analysis**
- Lab 1: "Malware Sample Analysis" (Intermediate, 45 min)
- Lab 2: "Incident Response Simulation" (Advanced, 60 min)

### Migration Script

```typescript
// Create sample labs for all courses
// Each lab includes:
// - Title, description
// - Realistic scenario
// - Step-by-step instructions
// - 3-5 objectives
// - Resources (links, tools)
// - Hints for students
// - Proper difficulty and time estimates
```

---

## 7. Implementation Order

### Phase 1: Database Schema ✅
1. Add Lab and LabProgress models
2. Update Course, Module, User models
3. Create LabStatus enum
4. Run Prisma migration
5. Verify database changes

### Phase 2: Backend API ✅
6. Create admin lab endpoints (6 endpoints)
7. Create student lab endpoints (5 endpoints)
8. Add validation and error handling
9. Test with curl/Postman

### Phase 3: Frontend Service ✅
10. Add Lab interfaces
11. Add admin lab methods
12. Add student lab methods
13. Add LabProgress interfaces

### Phase 4: Admin Lab Management UI ✅
14. Add Labs tab to admin-content.tsx
15. Search/filter functionality
16. Lab list with drag-and-drop
17. Create/Edit/Delete dialogs OR
18. Create dedicated lab editor page (like quiz editor)

### Phase 5: Student Lab Player ✅
19. Create lab-player.tsx component
20. Lab content display with formatting
21. Timer functionality
22. Notes section with auto-save
23. Mark complete functionality
24. Show/hide hints

### Phase 6: Course Player Integration ✅
25. Show labs in module sections
26. Lab status badges
27. Navigate to lab player
28. Track lab progress

### Phase 7: Sample Data Creation ✅
29. Create sample labs for all courses
30. Realistic scenarios and instructions
31. Proper objectives and resources
32. Variety of difficulty levels

### Phase 8: Testing ✅
33. Test admin CRUD operations
34. Test lab player functionality
35. Test timer and notes
36. Test completion tracking
37. Test course integration
38. Test edge cases

---

## 8. TypeScript Interfaces

### Frontend Types

```typescript
// Admin Interfaces
interface LabWithStats {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: number | null;
  order: number;
  courseId: string;
  courseTitle: string;
  moduleId: string | null;
  moduleTitle: string | null;
  isPublished: boolean;
  totalAttempts: number;
  completionRate: number;
  avgTimeSpent: number;
  createdAt: string;
  updatedAt: string;
}

interface LabFull {
  id: string;
  title: string;
  description: string;
  instructions: string;
  scenario: string | null;
  objectives: string[];
  resources: string | null;
  hints: string | null;
  difficulty: string;
  estimatedTime: number | null;
  order: number;
  courseId: string;
  moduleId: string | null;
  isPublished: boolean;
  course: {
    id: string;
    title: string;
  };
  module: {
    id: string;
    title: string;
  } | null;
  stats: {
    totalAttempts: number;
    completionRate: number;
    avgTimeSpent: number;
  };
}

interface CreateLabRequest {
  title: string;
  description: string;
  instructions: string;
  scenario?: string;
  objectives: string[];
  resources?: string;
  hints?: string;
  difficulty: string;
  estimatedTime?: number;
  order: number;
  courseId: string;
  moduleId?: string;
  isPublished: boolean;
}

interface UpdateLabRequest extends CreateLabRequest {}

interface ReorderLabsRequest {
  labOrders: { id: string; order: number }[];
}

// Student Interfaces
interface LabForStudent {
  id: string;
  title: string;
  description: string;
  instructions: string;
  scenario: string | null;
  objectives: string[];
  resources: string | null;
  hints: string | null;
  difficulty: string;
  estimatedTime: number | null;
  userProgress: {
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
    timeSpent: number;
    notes: string | null;
    startedAt: string | null;
    completedAt: string | null;
  } | null;
}

interface LabProgress {
  id: string;
  userId: string;
  labId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  timeSpent: number;
  notes: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

interface CompleteLabRequest {
  timeSpent: number;
  notes?: string;
}

interface UpdateLabNotesRequest {
  notes: string;
}
```

---

## 9. UI/UX Design Decisions

### Lab Card Design (Admin)
```
┌────────────────────────────────────────────┐
│ [☰] Password Cracking Lab                  │
│ Advanced Threat Analysis • Module 2        │
│ Intermediate • 30 min • 4 objectives       │
│ 📊 85% completion • 12 attempts            │
│ ✓ Published         [Edit] [Delete]       │
└────────────────────────────────────────────┘
```

### Lab Player Design
- **Two-column layout**: Main content | Info sidebar
- **Main content**: Scenario → Objectives → Instructions → Resources
- **Sidebar**: Timer, status, notes, hints
- **Sticky sidebar**: Stays visible during scroll
- **Auto-save notes**: Debounced (save after 2 seconds of no typing)
- **Timer**: Tracks time spent, pausable
- **Hints toggle**: Show/hide to avoid spoilers

### Lab in Course Sidebar
```
🔬 Lab: Password Cracking
   🟡 In Progress • 12 min spent
   [Continue Lab]
```

### Status Colors
- 🔴 Not Started (gray)
- 🟡 In Progress (yellow)
- 🟢 Completed (green)

---

## 10. Validation Rules

### Lab Validation
- Title: Required, 3-200 characters
- Description: Required, 10-500 characters
- Instructions: Required, min 50 characters
- Scenario: Optional, max 1000 characters
- Objectives: Array, min 1 item, each item 5-200 characters
- Resources: Optional, max 1000 characters
- Hints: Optional, max 500 characters
- Difficulty: Enum (Beginner, Intermediate, Advanced)
- Estimated time: Optional, 1-300 minutes
- Course: Must exist
- Module: Must exist if provided, must belong to course

### Progress Validation
- timeSpent: Required for completion, > 0
- notes: Optional, max 2000 characters
- Can only complete if started
- Can't start if already completed

---

## 11. Edge Cases

### Scenario 1: Lab without module
- Shows "No Module" in admin list
- Appears in "Other Labs" section in course player
- Fully functional

### Scenario 2: Unpublished lab
- Only visible to admins
- Not shown to students
- Draft badge in admin view

### Scenario 3: Lab with very long instructions
- Scrollable content area
- Table of contents for steps (future)
- Sticky sidebar stays in view

### Scenario 4: Timer accuracy
- Track time only when page is active
- Pause timer on page blur
- Resume on page focus
- Store accumulated time

### Scenario 5: Auto-save conflicts
- Debounce save requests
- Show saving indicator
- Handle save errors gracefully
- Don't lose user's notes

### Scenario 6: Completing without starting
- Backend validates status progression
- Must be IN_PROGRESS to complete
- Auto-set to IN_PROGRESS if completing from NOT_STARTED

---

## 12. Sample Lab Content

### Example: Password Cracking Lab

**Title:** "Understanding Password Strength Through Brute Force"

**Description:** Learn how weak passwords can be compromised through brute force attacks and understand the importance of password complexity.

**Scenario:**
You are a security analyst at a company that recently experienced a security audit. The audit revealed that many employees use weak passwords. Your task is to demonstrate the vulnerability of weak passwords using controlled password cracking techniques.

**Objectives:**
1. Understand how brute force attacks work
2. Use a password cracking tool safely
3. Analyze the time required to crack different password types
4. Document recommendations for strong password policies

**Instructions:**
Step 1: Set Up Your Environment
- Download the password testing tool (provided link)
- Install in a safe, isolated environment
- Review the tool documentation

Step 2: Create Test Passwords
- Create 5 test password hashes:
  - Simple (e.g., "password")
  - With numbers (e.g., "password123")
  - With special chars (e.g., "P@ssw0rd")
  - Long and complex (e.g., "MySecure!Pass2024")
  - Random 16-character password

Step 3: Run Brute Force Attack
- Configure the tool with a common password list
- Run attacks against each test hash
- Record the time taken for each

Step 4: Analyze Results
- Compare cracking times
- Calculate the strength difference
- Note the exponential increase in complexity

Step 5: Document Findings
- Create a report of your findings
- Include recommendations for password policies
- Share insights on password manager benefits

**Resources:**
- Password Testing Tool: [download link]
- Common Password List: [download link]
- Password Strength Calculator: [web link]
- Reading: NIST Password Guidelines

**Hints:**
- Hint 1: Make sure you're using test passwords only, never real ones
- Hint 2: The simple password should crack in seconds
- Hint 3: A 16-character random password should be virtually uncrackable
- Hint 4: Document the time difference - it's exponential!

**Difficulty:** Intermediate
**Estimated Time:** 30 minutes

---

## 13. Success Criteria

✅ **Complete when:**
1. Admins can create labs with all fields
2. Admins can edit/delete labs
3. Admins can reorder labs (drag-and-drop)
4. Admins can publish/unpublish labs
5. Students can view published labs
6. Students can start labs
7. Students can complete labs
8. Students can save notes
9. Timer tracks time accurately
10. Labs appear in course player
11. Progress tracked separately from lessons
12. All operations have proper validation
13. Navigation works correctly
14. Build succeeds, no errors
15. Sample labs created for all courses

---

## 14. Future Enhancements

1. **Lab Templates** - Reusable lab structures
2. **Lab Submissions** - Students upload work/screenshots
3. **Lab Grading** - Manual or automated grading
4. **Lab Badges** - Achievements for completing labs
5. **Lab Leaderboard** - Fastest completion times
6. **Collaborative Labs** - Team-based exercises
7. **VM Integration** - Launch virtual machines for labs
8. **Step Verification** - Check off each step as complete
9. **Lab Feedback** - Student ratings and comments
10. **Lab Prerequisites** - Require completion of earlier labs

---

## Ready to Implement?

This plan covers:
✅ Complete architecture
✅ Database schema with proper relations
✅ All backend endpoints (11 total)
✅ Complete UI designs with layouts
✅ Validation rules
✅ TypeScript interfaces
✅ Edge case handling
✅ Step-by-step implementation order
✅ Sample lab content structure

**Next Step:** Start with Phase 1 (Database Schema) and proceed sequentially.

**Estimated Time:** 3-4 hours for complete implementation

---

*End of Labs System Implementation Plan*
