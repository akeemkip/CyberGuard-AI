# Module System - Implementation Plan

## Overview
Add a Module system to organize lessons within courses into logical sections, improving course structure and student learning paths.

---

## 1. Current State Analysis

### What Already Exists ✅
- **Courses**: Top-level containers
- **Lessons**: Content units within courses
- **Lesson ordering**: Lessons have an `order` field
- **Drag-and-drop**: Already implemented for lesson reordering

### Current Hierarchy
```
Course
  └─ Lessons (flat list, ordered by `order` field)
```

### What's Missing ❌
- No way to group related lessons
- No visual sections in course structure
- All lessons appear in one long list
- Hard to navigate courses with many lessons

---

## 2. Desired Hierarchy

### New Structure
```
Course
  └─ Module 1: Introduction
      ├─ Lesson 1.1: Overview
      ├─ Lesson 1.2: Key Concepts
      └─ Lesson 1.3: Getting Started
  └─ Module 2: Advanced Topics
      ├─ Lesson 2.1: Deep Dive
      └─ Lesson 2.2: Best Practices
  └─ Module 3: Practical Application
      ├─ Lesson 3.1: Hands-on Exercise
      └─ Lesson 3.2: Case Study
```

### Example: Real Course
**Course:** "Advanced Threat Analysis & Incident Response"

**Without Modules (Current):**
- Lesson 1: Advanced Malware Analysis
- Lesson 2: Threat Intelligence & Attack Frameworks
- Lesson 3: Hmmm test
- Lesson 4: Incident Response Methodology

**With Modules (Proposed):**
- **Module 1: Threat Analysis**
  - Lesson 1.1: Advanced Malware Analysis
  - Lesson 1.2: Threat Intelligence & Attack Frameworks
- **Module 2: Incident Response**
  - Lesson 2.1: Incident Response Methodology
  - Lesson 2.2: Recovery & Post-Incident Analysis

---

## 3. Database Schema Design

### New Model: Module

```prisma
model Module {
  id          String    @id @default(uuid())
  title       String
  description String?
  order       Int       // For ordering modules within course
  courseId    String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  course      Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons     Lesson[]

  @@map("modules")
}
```

### Updated Lesson Model

```prisma
model Lesson {
  id        String    @id @default(uuid())
  title     String
  content   String
  videoUrl  String?
  order     Int       // Now relative to module, not course
  courseId  String
  moduleId  String?   // NULLABLE for backward compatibility
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  course    Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  module    Module?   @relation(fields: [moduleId], references: [id], onDelete: SetNull)
  progress  Progress[]
  quiz      Quiz?

  @@map("lessons")
}
```

**Key Decisions:**
- `moduleId` is **NULLABLE** - allows lessons without modules (backward compatibility)
- Lessons without modules appear in "Unorganized Lessons" section
- `order` is now relative to module (Lesson 1 in Module 1, Lesson 1 in Module 2, etc.)
- Cascade delete: Deleting module sets lessons' moduleId to NULL (not delete lessons)

---

## 4. Backend API Design

### Module Endpoints

#### GET /api/courses/:courseId/modules
**Purpose:** Get all modules for a course with lesson count
**Response:**
```typescript
{
  modules: [
    {
      id: string,
      title: string,
      description: string,
      order: number,
      courseId: string,
      lessonCount: number,
      createdAt: Date,
      updatedAt: Date
    }
  ]
}
```

#### POST /api/courses/:courseId/modules
**Purpose:** Create new module
**Request Body:**
```typescript
{
  title: string,
  description?: string,
  order: number
}
```
**Response:** Created module object

#### PUT /api/courses/:courseId/modules/:id
**Purpose:** Update module
**Request Body:** Same as POST
**Response:** Updated module object

#### DELETE /api/courses/:courseId/modules/:id
**Purpose:** Delete module
**Behavior:** Sets all lessons in module to moduleId = NULL
**Response:** Success message with affected lesson count

#### PUT /api/courses/:courseId/modules/reorder
**Purpose:** Reorder modules
**Request Body:**
```typescript
{
  moduleOrders: [
    { id: string, order: number }
  ]
}
```
**Response:** Success message

#### PUT /api/courses/:courseId/modules/:moduleId/lessons/:lessonId
**Purpose:** Assign lesson to module (or remove from module)
**Request Body:**
```typescript
{
  moduleId: string | null,  // null removes from module
  order: number              // order within module
}
```
**Response:** Updated lesson object

### Updated Lesson Endpoints

**Modify existing:** PUT /api/courses/lessons/:id
- Add optional `moduleId` parameter
- Update `order` to be relative to module

---

## 5. Frontend Component Design

### 5.1 Module Tab (admin-content.tsx)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Modules                                    [Create Module]│
├─────────────────────────────────────────────────────────┤
│ Select Course: [Dropdown ▼]                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [☰] Module 1: Introduction          [Edit] [Delete] │ │
│ │ 3 lessons                                            │ │
│ │ ┌───────────────────────────────────────────────────┐│ │
│ │ │ [☰] Lesson 1.1: Overview        [Move] [Edit]    ││ │
│ │ │ [☰] Lesson 1.2: Key Concepts    [Move] [Edit]    ││ │
│ │ │ [☰] Lesson 1.3: Getting Started [Move] [Edit]    ││ │
│ │ └───────────────────────────────────────────────────┘│ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [☰] Module 2: Advanced Topics       [Edit] [Delete] │ │
│ │ 2 lessons                                            │ │
│ │ └───────────────────────────────────────────────────┘│ │
│                                                          │
│ Unorganized Lessons (No Module)                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [☰] Standalone Lesson        [Assign to Module]     │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Course selector dropdown
- Drag-and-drop module reordering
- Drag-and-drop lesson reordering within module
- Drag lesson to different module
- Create/Edit/Delete modules
- Assign unorganized lessons to modules
- Collapse/Expand modules

### 5.2 Course Player Updates

**Current Structure:**
```
┌─────────────────┐
│ Course Title    │
├─────────────────┤
│ □ Lesson 1      │
│ ✓ Lesson 2      │
│ □ Lesson 3      │
└─────────────────┘
```

**New Structure with Modules:**
```
┌─────────────────────────┐
│ Course Title            │
├─────────────────────────┤
│ ▼ Module 1: Intro       │
│   □ Lesson 1.1          │
│   ✓ Lesson 1.2          │
│   □ Lesson 1.3          │
│                         │
│ ▼ Module 2: Advanced    │
│   □ Lesson 2.1          │
│   □ Lesson 2.2          │
│                         │
│ Other Lessons           │
│   □ Standalone Lesson   │
└─────────────────────────┘
```

**Features:**
- Collapsible module sections
- Module titles visible
- Progress per module (e.g., "2/3 completed")
- Unorganized lessons in separate section

---

## 6. Data Migration Strategy

### Challenge
Existing courses have lessons with no `moduleId`. How to handle?

### Option 1: Leave as-is (Recommended)
- Don't create default modules
- Lessons without `moduleId` appear in "Unorganized Lessons"
- Admin can manually organize into modules
- **Pros:** No automatic changes, admin has control
- **Cons:** Requires manual work

### Option 2: Auto-create "Module 1"
- Create "Module 1: Main Content" for each course
- Assign all existing lessons to it
- **Pros:** All lessons organized immediately
- **Cons:** Generic module names, may not make sense

### Option 3: Smart grouping (Complex)
- Analyze lesson titles/content
- Auto-create modules based on patterns
- **Pros:** Intelligent organization
- **Cons:** Complex, may be wrong

**Decision: Use Option 1** - Keep lessons unorganized, let admin organize manually.

### Migration Script

```typescript
// Prisma migration will:
1. Add Module model
2. Add moduleId to Lesson (nullable)
3. Keep all existing lessons with moduleId = null
4. Admin can then create modules and assign lessons
```

No data changes needed! Just schema addition.

---

## 7. Implementation Order

### Phase 1: Database Schema ✅
1. Add Module model to schema.prisma
2. Update Lesson model (add moduleId nullable)
3. Run prisma migrate
4. Verify database changes

### Phase 2: Backend API ✅
5. Create module.controller.ts with CRUD
6. Add module routes
7. Update lesson controller (add moduleId handling)
8. Test with curl/Postman

### Phase 3: Frontend Service ✅
9. Add Module interfaces to services
10. Add module CRUD methods
11. Update lesson methods

### Phase 4: Module Management UI ✅
12. Add Modules tab to admin-content.tsx
13. Course selector dropdown
14. Module list with drag-and-drop
15. Nested lesson list per module
16. Create/Edit/Delete dialogs
17. Assign lessons to modules

### Phase 5: Course Player Updates ✅
18. Update course player to group by modules
19. Collapsible module sections
20. Show module progress
21. Handle unorganized lessons

### Phase 6: Testing ✅
22. Test module CRUD
23. Test lesson assignment
24. Test drag-and-drop
25. Test course player display
26. Test edge cases

---

## 8. TypeScript Interfaces

### Frontend Types

```typescript
interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  courseId: string;
  lessonCount?: number;
  lessons?: Lesson[];
  createdAt: Date;
  updatedAt: Date;
}

interface CreateModuleRequest {
  title: string;
  description?: string;
  order: number;
}

interface UpdateModuleRequest {
  title: string;
  description?: string;
  order: number;
}

interface ReorderModulesRequest {
  moduleOrders: { id: string; order: number }[];
}

// Update existing Lesson interface
interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
  courseId: string;
  moduleId?: string | null;  // NEW
  module?: Module;            // NEW
  quiz?: Quiz;
  // ... other fields
}
```

---

## 9. UI/UX Design Decisions

### Module Card Design
```
┌────────────────────────────────────────────┐
│ [☰] Module 1: Introduction to Security     │
│ Description: Learn the basics...           │
│ 4 lessons • 45 min total                   │
│                           [Edit] [Delete]  │
└────────────────────────────────────────────┘
```

### Lesson within Module
```
  ┌──────────────────────────────────────┐
  │ [☰] 1.1 Security Fundamentals        │
  │ □ Not started • Quiz • 12 min        │
  │                    [Move] [Edit]     │
  └──────────────────────────────────────┘
```

### Drag-and-Drop Behavior
- Drag module → Reorder modules
- Drag lesson → Reorder within module
- Drag lesson to different module → Move to that module
- Visual drop zones
- Optimistic updates

### Collapsible Sections
- Modules collapsed by default (show lesson count)
- Click to expand/collapse
- Remember expand state in localStorage
- Smooth animations

---

## 10. Validation Rules

### Module Validation
- Title: Required, 3-200 characters
- Description: Optional, max 500 characters
- Order: Required, positive integer
- Course: Must exist

### Lesson Assignment
- Lesson must belong to same course as module
- Order must be unique within module
- Can have lessons without module (unorganized)

### Module Deletion
- Warn if module has lessons
- Show lesson count
- Set lessons' moduleId to NULL (don't delete lessons)

---

## 11. Edge Cases

### Scenario 1: Course with no modules
- Show "No modules yet" message
- Lessons appear in "Unorganized Lessons"
- Prompt to create first module

### Scenario 2: Module with no lessons
- Show "No lessons in this module"
- Allow drag-and-drop to add lessons
- Or delete empty module

### Scenario 3: Deleting module with many lessons
- Confirmation: "This module has 8 lessons. They will become unorganized."
- Lessons move to "Unorganized" section
- Can reassign later

### Scenario 4: Moving lesson between modules
- Updates moduleId
- Reorders within new module
- Updates order in old module

### Scenario 5: Course player with mixed content
- Shows modules first (ordered)
- Then unorganized lessons
- Clear visual separation

---

## 12. Success Criteria

✅ **Complete when:**
1. Admin can create modules for courses
2. Admin can edit/delete modules
3. Admin can assign lessons to modules
4. Admin can reorder modules (drag-and-drop)
5. Admin can reorder lessons within modules
6. Admin can move lessons between modules
7. Course player displays modules with collapse/expand
8. Course player shows module progress
9. Lessons without modules handled gracefully
10. All operations have proper validation
11. Navigation works correctly
12. Build succeeds, no errors

---

## 13. Timeline Estimate

| Phase | Tasks | Time Est. |
|-------|-------|-----------|
| 1 | Schema changes | 15 min |
| 2 | Backend API | 30 min |
| 3 | Frontend service | 15 min |
| 4 | Module management UI | 45 min |
| 5 | Course player updates | 30 min |
| 6 | Testing & fixes | 30 min |
| **Total** | | **~2.5-3 hours** |

---

## 14. Future Enhancements

Potential improvements for later:

1. **Module Completion Certificate** - Certificate per module
2. **Module Prerequisites** - Lock modules until previous complete
3. **Module-level Quizzes** - Quiz for entire module
4. **Module Templates** - Reusable module structures
5. **Bulk Lesson Import** - Import multiple lessons to module
6. **Module Analytics** - Track completion rates per module
7. **Module Descriptions with Rich Text** - Formatted descriptions
8. **Module Thumbnails** - Visual representation
9. **Estimated Time per Module** - Auto-calculate from lessons
10. **Module Tags** - Categorize modules

---

## Ready to Implement?

This plan covers:
✅ Complete architecture
✅ Database schema with migration strategy
✅ All backend endpoints with types
✅ Complete UI designs with layouts
✅ Validation rules
✅ TypeScript interfaces
✅ Edge case handling
✅ Step-by-step implementation order
✅ Timeline estimate

**Next Step:** Start with Phase 1 (Database Schema) and proceed sequentially.

---

*End of Module System Implementation Plan*
