# Quiz Management System - Implementation Plan

## Overview
Build a comprehensive quiz management interface for admins to create, edit, delete, and view statistics for all quizzes across courses.

---

## 1. Current State Analysis

### What Already Exists ✅
- **Database Models**: Quiz, Question, QuizAttempt (schema.prisma)
- **Student-Facing**: Quiz taking in course player
- **Backend Endpoints**:
  - GET /api/courses/quiz/:quizId - Get quiz with questions
  - POST /api/courses/quiz/:quizId/submit - Submit quiz
- **Frontend Services**: Quiz interfaces in course.service.ts

### What's Missing ❌
- Central quiz management interface
- Admin-only quiz CRUD endpoints
- Quiz list view with statistics
- Quiz creation/edit UI
- Question builder interface
- Quiz assignment to lessons
- Bulk operations

---

## 2. Architecture Decisions

### UI Pattern: Dedicated Page (Not Modal)
**Reasoning:**
- Quizzes have complex nested data (questions with multiple options)
- Need drag-and-drop for reordering questions
- Rich text editor support for questions
- Similar complexity to lesson editing (which uses dedicated page)
- Better UX for managing 5-10 questions per quiz

**Pattern to Follow:** admin-lesson-edit.tsx

### Navigation Flow
```
Admin Content → Quizzes Tab
  ↓
Quiz List (cards with stats)
  ↓ [Create Quiz] or [Edit Quiz]
  ↓
Admin Quiz Edit Page (dedicated route)
  ↓ [Save] or [Cancel]
  ↓
Back to Quiz List
```

### State Management
- **Quiz List**: Stored in admin-content.tsx state
- **Active Quiz**: Passed via localStorage (quizId) + history.state
- **Tab Persistence**: Already implemented (localStorage: adminContentTab)
- **Form State**: Local state in admin-quiz-edit.tsx

---

## 3. Database Schema (No Changes Needed)

```prisma
model Quiz {
  id           String        @id @default(uuid())
  lessonId     String        @unique          // One quiz per lesson
  title        String
  passingScore Int           @default(70)
  questions    Question[]
  attempts     QuizAttempt[]
  lesson       Lesson        @relation(fields: [lessonId], references: [id], onDelete: Cascade)
}

model Question {
  id            String   @id @default(uuid())
  quizId        String
  question      String    // HTML content (rich text)
  options       String[]  // Array of answer options
  correctAnswer Int       // Index of correct option
  order         Int       // For drag-and-drop reordering
  quiz          Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
}

model QuizAttempt {
  id          String   @id @default(uuid())
  userId      String
  quizId      String
  score       Int
  passed      Boolean
  attemptedAt DateTime @default(now())
  quiz        Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Key Insights:**
- Quiz has **one-to-one** relationship with Lesson (unique lessonId)
- Questions have `order` field for sorting
- Questions support HTML in `question` field
- QuizAttempts track all student submissions

---

## 4. Backend API Design

### New Endpoints Needed

#### GET /api/admin/quizzes
**Purpose:** Get all quizzes with statistics
**Response:**
```typescript
{
  quizzes: [
    {
      id: string,
      title: string,
      passingScore: number,
      lessonId: string,
      lessonTitle: string,
      courseId: string,
      courseTitle: string,
      questionCount: number,
      totalAttempts: number,
      passRate: number, // percentage
      averageScore: number,
      createdAt: Date,
      updatedAt: Date
    }
  ]
}
```

#### POST /api/admin/quizzes
**Purpose:** Create new quiz
**Request Body:**
```typescript
{
  lessonId: string,
  title: string,
  passingScore: number,
  questions: [
    {
      question: string,      // HTML
      options: string[],     // Array of 2-6 options
      correctAnswer: number, // Index (0-based)
      order: number
    }
  ]
}
```
**Response:** Created quiz object

#### PUT /api/admin/quizzes/:id
**Purpose:** Update quiz and questions
**Request Body:** Same as POST
**Response:** Updated quiz object

#### DELETE /api/admin/quizzes/:id
**Purpose:** Delete quiz and all questions/attempts
**Response:** Success message

#### GET /api/admin/quizzes/:id/full
**Purpose:** Get quiz with all questions (including correct answers)
**Response:**
```typescript
{
  id: string,
  title: string,
  passingScore: number,
  lessonId: string,
  lesson: { title: string, course: { title: string } },
  questions: [
    {
      id: string,
      question: string,
      options: string[],
      correctAnswer: number,
      order: number
    }
  ],
  stats: {
    totalAttempts: number,
    passRate: number,
    averageScore: number
  }
}
```

### Files to Create/Modify

**Backend:**
- `backend/src/controllers/admin.controller.ts` - Add quiz CRUD methods
- `backend/src/routes/admin.routes.ts` - Add quiz routes

**Frontend:**
- `frontend/src/app/components/admin-quiz-edit.tsx` - NEW (dedicated edit page)
- `frontend/src/app/components/admin-content.tsx` - Add Quizzes tab content
- `frontend/src/app/services/admin.service.ts` - Add quiz service methods
- `frontend/src/app/App.tsx` - Add admin-quiz-edit route

---

## 5. Frontend Component Design

### 5.1 Quizzes Tab (admin-content.tsx)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Quizzes                                    [Create Quiz]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────┐  ┌─────────────────┐              │
│ │ Quiz Card 1     │  │ Quiz Card 2     │              │
│ │ Title           │  │ Title           │              │
│ │ Course: X       │  │ Course: Y       │              │
│ │ Lesson: Y       │  │ Lesson: Z       │              │
│ │ 5 Questions     │  │ 3 Questions     │              │
│ │ Pass Rate: 73%  │  │ Pass Rate: 85%  │              │
│ │ [Edit] [Delete] │  │ [Edit] [Delete] │              │
│ └─────────────────┘  └─────────────────┘              │
│                                                         │
│ ┌─────────────────┐                                    │
│ │ Empty State     │  (if no quizzes)                   │
│ │ "No quizzes"    │                                    │
│ │ [Create Quiz]   │                                    │
│ └─────────────────┘                                    │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Grid layout (2-3 columns)
- Quiz cards with stats
- Search/filter by course
- Sort by: title, pass rate, attempts
- Delete confirmation dialog
- Toast notifications for all operations

### 5.2 Quiz Edit Page (admin-quiz-edit.tsx)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [← Back] Edit Quiz                      [Save] [Cancel]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Quiz Details                                            │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Title: [_______________________________]            ││
│ │ Assign to Lesson: [Dropdown ▼]                      ││
│ │ Passing Score: [70] % (slider or input)             ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ Questions                          [Add Question]       │
│ ┌─────────────────────────────────────────────────────┐│
│ │ [☰] Question 1                    [Edit] [Delete]   ││
│ │ What is phishing?                                   ││
│ │ ○ A type of malware                                 ││
│ │ ● A social engineering attack (correct)             ││
│ │ ○ A firewall bypass                                 ││
│ │ ○ An encryption method                              ││
│ └─────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────┐│
│ │ [☰] Question 2                    [Edit] [Delete]   ││
│ │ ...                                                 ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ Statistics (if editing existing quiz)                   │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Total Attempts: 47  Pass Rate: 73%  Avg Score: 78% ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Features:**
- AdminSidebar + header (consistent with other pages)
- Quiz metadata form (title, lesson, passing score)
- Lesson dropdown (grouped by course)
- Question list with drag-and-drop reordering (@dnd-kit)
- Add/Edit/Delete questions
- Question editor dialog with:
  - Rich text for question text
  - Dynamic option fields (2-6 options, +/- buttons)
  - Radio buttons to select correct answer
  - Live preview
- Save button validates:
  - Title not empty
  - Lesson selected
  - At least 2 questions
  - Each question has 2-6 options
  - Each question has correct answer selected
- Unsaved changes warning
- Statistics panel (read-only)

### 5.3 Question Editor Dialog

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ Add Question                           [X Close]│
├─────────────────────────────────────────────────┤
│                                                 │
│ Question Text                                   │
│ ┌─────────────────────────────────────────────┐│
│ │ [Rich Text Editor with formatting toolbar]  ││
│ │ Bold | Italic | Underline | Code            ││
│ │ ┌─────────────────────────────────────────┐ ││
│ │ │ What is the primary goal of...         │ ││
│ │ └─────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ Answer Options                                  │
│ ┌─────────────────────────────────────────────┐│
│ │ ○ Option 1: [__________________] [Remove]   ││
│ │ ● Option 2: [__________________] [Remove]   ││
│ │ ○ Option 3: [__________________] [Remove]   ││
│ │ ○ Option 4: [__________________] [Remove]   ││
│ │                                [+ Add Option]││
│ └─────────────────────────────────────────────┘│
│ ⚠️ Select the correct answer with radio button  │
│                                                 │
│                        [Cancel] [Save Question] │
└─────────────────────────────────────────────────┘
```

**Validation:**
- Question text required (min 10 characters)
- At least 2 options required
- Max 6 options allowed
- All options must have text
- One option must be selected as correct
- No duplicate option text

---

## 6. Data Flow & State Management

### Creating a Quiz

```
User clicks [Create Quiz]
  ↓
Navigate to /admin-quiz-edit (no quizId)
  ↓
Form shows:
  - Empty title input
  - Lesson dropdown (fetch from API)
  - Default passing score: 70%
  - Empty questions list
  ↓
User fills details + adds questions
  ↓
Click [Save]
  ↓
Validate:
  ✓ Title not empty
  ✓ Lesson selected
  ✓ At least 2 questions
  ✓ All questions valid
  ↓
POST /api/admin/quizzes
  ↓
Success toast
  ↓
Navigate back to Quizzes tab
  ↓
Refresh quiz list
```

### Editing a Quiz

```
User clicks [Edit] on quiz card
  ↓
Navigate to /admin-quiz-edit?id=xyz
  ↓
Fetch quiz: GET /api/admin/quizzes/:id/full
  ↓
Populate form with existing data
  ↓
User modifies questions/details
  ↓
Click [Save]
  ↓
Validate (same as create)
  ↓
PUT /api/admin/quizzes/:id
  ↓
Success toast
  ↓
Navigate back to Quizzes tab
```

### Deleting a Quiz

```
User clicks [Delete] on quiz card
  ↓
Show confirmation dialog:
  "Delete quiz 'XYZ'?"
  "This will delete all questions and attempts"
  [Cancel] [Delete]
  ↓
DELETE /api/admin/quizzes/:id
  ↓
Success toast
  ↓
Remove from list (optimistic update)
```

---

## 7. Error Handling Strategy

### Backend Errors to Handle

| Error | HTTP Code | Message | Handling |
|-------|-----------|---------|----------|
| Quiz not found | 404 | "Quiz not found" | Show error toast, redirect to list |
| Lesson already has quiz | 409 | "Lesson already has a quiz" | Show error toast, highlight lesson dropdown |
| Invalid lesson | 400 | "Lesson does not exist" | Show error toast |
| Validation failed | 400 | Specific validation message | Show error toast with details |
| Unauthorized | 403 | "Admin access required" | Redirect to login |
| Server error | 500 | "Failed to save quiz" | Show error toast, keep form data |

### Frontend Validation

**Quiz Form:**
- Title: Required, min 3 characters, max 200 characters
- Lesson: Required, must be valid lesson ID
- Passing Score: Number between 1-100
- Questions: Min 2, max 50

**Question Form:**
- Question text: Required, min 10 characters
- Options: Min 2, max 6
- Each option: Required, min 1 character, max 200 characters
- Correct answer: Required, must be valid index

### Loading States

- Quiz list loading: Skeleton cards
- Quiz details loading: Loading spinner
- Save in progress: Disable save button, show spinner
- Delete in progress: Disable delete button, show spinner

### Toast Notifications

```typescript
// Success
toast.success("Quiz created successfully!")
toast.success("Quiz updated successfully!")
toast.success("Quiz deleted successfully!")

// Errors
toast.error("Failed to create quiz. Please try again.")
toast.error("This lesson already has a quiz.")
toast.error("Please add at least 2 questions.")

// Warnings
toast.warning("You have unsaved changes. Are you sure?")
```

---

## 8. Reusable Components & Patterns

### From Existing Codebase

**1. AdminSidebar** ✅
- Already used in all admin pages
- Handles navigation, theme toggle
- Consistent layout

**2. RichTextEditor** ✅
- Already built for lesson content
- Perfect for question text
- Supports HTML, formatting, images

**3. Drag-and-Drop** ✅
- Already used in admin-content.tsx for lesson reordering
- @dnd-kit library configured
- Can reuse for question ordering

**4. Form Patterns** ✅
- Input, Textarea, Select from shadcn/ui
- Label + Input combinations
- Validation patterns from register-page.tsx

**5. Dialog Patterns** ✅
- AlertDialog for confirmations
- Dialog for question editor
- Consistent close/cancel behavior

**6. Card Layout** ✅
- Used in admin-dashboard, admin-content
- Stats display patterns
- Grid layouts with responsive columns

### New Components to Build

**1. QuizCard** (Reusable)
```typescript
interface QuizCardProps {
  quiz: QuizWithStats;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
```

**2. QuestionItem** (Sortable)
```typescript
interface QuestionItemProps {
  question: Question;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}
```

**3. QuestionEditorDialog** (Complex)
```typescript
interface QuestionEditorDialogProps {
  question?: Question; // undefined for new
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: Question) => void;
}
```

---

## 9. TypeScript Interfaces

### Frontend Types (admin.service.ts)

```typescript
interface QuizWithStats {
  id: string;
  title: string;
  passingScore: number;
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  courseTitle: string;
  questionCount: number;
  totalAttempts: number;
  passRate: number;
  averageScore: number;
  createdAt: Date;
  updatedAt: Date;
}

interface QuizFull {
  id: string;
  title: string;
  passingScore: number;
  lessonId: string;
  lesson: {
    title: string;
    course: {
      title: string;
      id: string;
    };
  };
  questions: QuizQuestion[];
  stats: {
    totalAttempts: number;
    passRate: number;
    averageScore: number;
  };
}

interface QuizQuestion {
  id?: string; // undefined for new questions
  question: string; // HTML
  options: string[];
  correctAnswer: number;
  order: number;
}

interface CreateQuizRequest {
  lessonId: string;
  title: string;
  passingScore: number;
  questions: Omit<QuizQuestion, 'id'>[];
}

interface UpdateQuizRequest extends CreateQuizRequest {
  id: string;
}
```

### Backend Types

```typescript
// Zod validation schemas
const QuestionSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters"),
  options: z.array(z.string().min(1)).min(2).max(6),
  correctAnswer: z.number().min(0),
  order: z.number().min(0)
});

const CreateQuizSchema = z.object({
  lessonId: z.string().uuid(),
  title: z.string().min(3).max(200),
  passingScore: z.number().min(1).max(100),
  questions: z.array(QuestionSchema).min(2).max(50)
});
```

---

## 10. Implementation Order

### Phase 1: Backend Foundation
1. ✅ Create admin.controller.ts quiz methods
2. ✅ Add routes to admin.routes.ts
3. ✅ Test with curl/Postman
4. ✅ Verify database operations

### Phase 2: Frontend Service Layer
5. ✅ Add types to admin.service.ts
6. ✅ Add quiz CRUD methods
7. ✅ Test API calls in browser console

### Phase 3: Quiz List View
8. ✅ Update admin-content.tsx Quizzes tab
9. ✅ Fetch and display quiz cards
10. ✅ Add delete functionality
11. ✅ Add navigation to edit page

### Phase 4: Quiz Edit Page
12. ✅ Create admin-quiz-edit.tsx component
13. ✅ Add route to App.tsx
14. ✅ Build quiz details form
15. ✅ Add question list display

### Phase 5: Question Management
16. ✅ Create QuestionEditorDialog component
17. ✅ Add question CRUD in edit page
18. ✅ Implement drag-and-drop ordering
19. ✅ Add rich text support

### Phase 6: Testing & Polish
20. ✅ Test create quiz flow
21. ✅ Test edit quiz flow
22. ✅ Test delete quiz flow
23. ✅ Test all validations
24. ✅ Test error scenarios
25. ✅ Test navigation (back button)
26. ✅ Verify tab persistence

---

## 11. Testing Checklist

### Functional Tests

**Create Quiz:**
- [ ] Can create quiz with 2 questions
- [ ] Can create quiz with 10 questions
- [ ] Cannot create quiz without title
- [ ] Cannot create quiz without selecting lesson
- [ ] Cannot create quiz with < 2 questions
- [ ] Cannot create quiz with invalid passing score
- [ ] Cannot assign quiz to lesson that already has quiz
- [ ] Toast shows on success
- [ ] Redirects to quiz list after save

**Edit Quiz:**
- [ ] Loads existing quiz data correctly
- [ ] Can edit title
- [ ] Can change lesson (if allowed)
- [ ] Can change passing score
- [ ] Can add questions
- [ ] Can edit questions
- [ ] Can delete questions
- [ ] Can reorder questions (drag-and-drop)
- [ ] Shows unsaved changes warning
- [ ] Stats display correctly (read-only)

**Delete Quiz:**
- [ ] Shows confirmation dialog
- [ ] Can cancel deletion
- [ ] Deletes quiz and questions
- [ ] Shows success toast
- [ ] Updates list immediately

**Question Editor:**
- [ ] Can add question with rich text
- [ ] Can add 2-6 options
- [ ] Can select correct answer
- [ ] Cannot save without question text
- [ ] Cannot save without selecting correct answer
- [ ] Cannot save with < 2 options
- [ ] Cannot save with > 6 options
- [ ] Validation messages show correctly

### Navigation Tests

- [ ] Back button from edit page returns to quiz list
- [ ] Back button preserves quiz list tab
- [ ] Page refresh on edit page loads quiz correctly
- [ ] Logout clears quiz edit state
- [ ] Can navigate away with unsaved changes warning

### Error Handling Tests

- [ ] Network error shows error toast
- [ ] 404 error redirects to quiz list
- [ ] Validation errors show specific messages
- [ ] Loading states display correctly
- [ ] Disabled states prevent double-submission

### UI/UX Tests

- [ ] Quiz cards display all stats
- [ ] Search/filter works correctly
- [ ] Responsive on mobile/tablet
- [ ] Theme toggle works
- [ ] Drag-and-drop smooth
- [ ] Rich text editor functions
- [ ] All buttons have correct icons
- [ ] Loading spinners show during operations

---

## 12. Success Criteria

✅ **Complete when:**
1. Admin can view all quizzes in one place
2. Admin can create new quiz with questions
3. Admin can edit existing quiz and questions
4. Admin can delete quiz with confirmation
5. Admin can see quiz statistics (attempts, pass rate, avg score)
6. Questions support rich text formatting
7. Questions can be reordered via drag-and-drop
8. All operations show proper loading/error states
9. Navigation works correctly (back button, tab persistence)
10. No TypeScript errors, production build succeeds
11. All tests pass (functional, navigation, error handling)

---

## 13. Potential Issues & Mitigations

### Issue 1: Lesson Already Has Quiz
**Problem:** One-to-one relationship, can't assign quiz if lesson has one
**Solution:**
- In lesson dropdown, disable lessons that have quizzes
- Show indicator "(Has Quiz)" next to disabled lessons
- When editing, allow keeping same lesson or changing to available lesson

### Issue 2: Deleting Quiz with Attempts
**Problem:** Students have taken this quiz, attempts exist
**Solution:**
- Show attempt count in confirmation dialog
- Warn: "This will delete X student attempts"
- Allow deletion anyway (admin decision)
- Database cascade deletes attempts automatically

### Issue 3: Question Reordering
**Problem:** Need to maintain order when saving
**Solution:**
- Store questions in array with `order` field
- Update order on drag-and-drop
- Send ordered array to backend
- Backend saves order as-is

### Issue 4: Rich Text in Questions
**Problem:** Security (XSS), rendering consistency
**Solution:**
- Sanitize HTML with DOMPurify (already used)
- Use same rendering as lesson content
- Store as HTML in database
- Display with `dangerouslySetInnerHTML` (safe after sanitization)

---

## 14. File Structure Summary

```
backend/
├── src/
│   ├── controllers/
│   │   └── admin.controller.ts        [MODIFY] Add quiz CRUD
│   └── routes/
│       └── admin.routes.ts            [MODIFY] Add quiz routes

frontend/
├── src/app/
│   ├── components/
│   │   ├── admin-content.tsx          [MODIFY] Add Quizzes tab UI
│   │   └── admin-quiz-edit.tsx        [CREATE] Dedicated edit page
│   ├── services/
│   │   └── admin.service.ts           [MODIFY] Add quiz methods
│   └── App.tsx                        [MODIFY] Add quiz edit route
```

---

## 15. Timeline Estimate

| Phase | Task | Time Est. |
|-------|------|-----------|
| 1 | Backend endpoints | 15-20 min |
| 2 | Frontend services | 5-10 min |
| 3 | Quiz list view | 15-20 min |
| 4 | Quiz edit page (base) | 20-25 min |
| 5 | Question management | 25-30 min |
| 6 | Testing & fixes | 10-15 min |
| **Total** | | **90-120 min** |

---

## Ready to Implement?

This plan covers:
✅ Complete architecture
✅ Database analysis (no changes needed)
✅ All backend endpoints with request/response types
✅ Complete UI designs with layouts
✅ Error handling for all scenarios
✅ Validation rules
✅ TypeScript interfaces
✅ Reusable component patterns
✅ Step-by-step implementation order
✅ Comprehensive testing checklist
✅ Edge case handling

**Next Step:** Start with Phase 1 (Backend endpoints) and proceed sequentially.
