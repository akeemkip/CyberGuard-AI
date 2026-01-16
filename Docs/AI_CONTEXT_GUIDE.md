# Making AI Aware of Your Platform

## Current State: General Cybersecurity Tutor ✅

**What it can answer:**
- ✅ "What is phishing?"
- ✅ "How do I create strong passwords?"
- ✅ "Explain social engineering"
- ✅ General cybersecurity concepts

**What it CANNOT answer:**
- ❌ "What courses do you offer?"
- ❌ "How do I enroll?"
- ❌ "Show me my progress"
- ❌ "Which course should I take based on my quiz scores?"
- ❌ Platform-specific questions

---

## How AI Works (No Memory!)

**Important:** The AI has ZERO memory. Every message is brand new.

```
Message 1: "What is phishing?"
AI Context: System prompt + "What is phishing?"
↓
Response: Explains phishing

Message 2: "What courses do you offer?"
AI Context: System prompt + "What courses do you offer?"
↓
Response: "I don't have that information" (because we didn't tell it!)
```

**To make it aware, you send context WITH EVERY MESSAGE:**

```
Message: "What courses do you offer?"
AI Context: System prompt + Course list + User info + "What courses do you offer?"
↓
Response: "We offer 5 courses: Phishing Detection, Password Security..." (knows the courses!)
```

---

## What to Send as Context

### Platform Information (Same for All Users)

```typescript
const platformContext = `
PLATFORM: CyberGuard AI - Cybersecurity Training Platform

AVAILABLE COURSES:
1. Phishing Detection Fundamentals (Beginner, 2 hours, 3 lessons)
   - Learn to identify and avoid phishing attacks

2. Password Security Best Practices (Beginner, 2 hours, 3 lessons)
   - Create and manage strong passwords

3. Social Engineering Awareness (Intermediate, 2 hours, 3 lessons)
   - Understand manipulation tactics and defenses

4. Secure Web Browsing (Beginner, 2 hours, 3 lessons)
   - Browse safely and avoid threats

5. Personal Data Protection (Beginner, 2 hours, 3 lessons)
   - Protect your personal information online

PLATFORM FEATURES:
- Free course enrollment
- Certificates upon completion
- Skill assessments (30 questions, 25-minute timer, 70% to pass)
- Progress tracking and quiz system
- AI assistant (that's you!)

HOW TO ENROLL:
1. Go to Course Catalog from navigation
2. Click "Enroll Now" on any course
3. Start learning immediately

HOW TO GET CERTIFICATES:
1. Complete all lessons in a course
2. Navigate to "Certificates" page
3. View and print your certificate
`;
```

### User-Specific Information (Different for Each User)

```typescript
// Fetch from database
const user = await getUserData(userId);

const userContext = `
CURRENT USER:
- Name: ${user.firstName} ${user.lastName}
- Email: ${user.email}
- Role: ${user.role}

PROGRESS:
- Enrolled Courses: ${user.enrolledCourses}
- Completed Courses: ${user.completedCourses}
- Lessons Completed: ${user.completedLessons}
- Average Quiz Score: ${user.averageQuizScore}%

CURRENT ENROLLMENT:
${user.currentCourses.map(c => `- ${c.title} (${c.progress}% complete)`).join('\n')}

RECENT QUIZ RESULTS:
${user.recentQuizzes.map(q => `- ${q.lessonTitle}: ${q.score}% (${q.passed ? 'Passed' : 'Failed'})`).join('\n')}
`;
```

### Combined Context

```typescript
const fullContext = `${platformContext}\n\n${userContext}\n\nStudent question: ${userMessage}`;
```

---

## Code Changes Needed

### 1. Update Backend Service (ai.service.ts)

**Current:**
```typescript
export async function sendChatMessage(userMessage: string): Promise<string>
```

**New:**
```typescript
export async function sendChatMessage(
  userMessage: string,
  userId: string  // ← Add this to fetch user data
): Promise<string> {
  // Fetch courses from database
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    select: { title, difficulty, duration, description, lessons: true }
  });

  // Fetch user data from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: { include: { course: true } },
      progress: true,
      quizAttempts: { include: { quiz: { include: { lesson: true } } } }
    }
  });

  // Build platform context
  const platformContext = buildPlatformContext(courses);

  // Build user context
  const userContext = buildUserContext(user);

  // Combine everything
  const fullPrompt = `${SYSTEM_PROMPT}\n\n${platformContext}\n\n${userContext}\n\nStudent question: ${userMessage}`;

  // Send to AI
  const result = await model.generateContent(fullPrompt);
  return result.response.text();
}
```

### 2. Update Controller (ai.controller.ts)

**Current:**
```typescript
const aiResponse = await sendChatMessage(message);
```

**New:**
```typescript
const userId = (req as any).userId; // From auth middleware
const aiResponse = await sendChatMessage(message, userId);
```

### 3. Update Frontend (ai-chat.tsx)

**No changes needed!** Frontend just calls `/api/ai/chat` with the message. Backend handles the context.

---

## What Becomes Possible

### Before (Without Context):

**User:** "What courses do you offer?"
**AI:** "I don't have specific information about the courses. Please check the course catalog."

**User:** "How do I enroll?"
**AI:** "I don't have details about the enrollment process. Please contact support."

**User:** "What should I study next?"
**AI:** "I can't access your progress. I recommend starting with phishing basics."

---

### After (With Context):

**User:** "What courses do you offer?"
**AI:** "We have 5 cybersecurity courses:

1. **Phishing Detection Fundamentals** (Beginner, 2 hours) - Learn to identify and avoid phishing attacks in your daily online activities.

2. **Password Security Best Practices** (Beginner, 2 hours) - Create and manage strong passwords to protect your accounts.

3. **Social Engineering Awareness** (Intermediate, 2 hours) - Understand manipulation tactics used by attackers and how to defend against them.

4. **Secure Web Browsing** (Beginner, 2 hours) - Learn how to browse the internet safely.

5. **Personal Data Protection** (Beginner, 2 hours) - Protect your personal information online.

All courses are free! Want to know more about any of these?"

---

**User:** "How do I enroll?"
**AI:** "Enrolling is super easy! Here's how:

1. Click on **Course Catalog** in your dashboard navigation
2. Browse the available courses
3. Click the **"Enroll Now"** button on any course that interests you
4. You'll be enrolled immediately and can start learning right away!

All courses are free and you can enroll in as many as you'd like. Which course are you interested in?"

---

**User:** "What should I study next?"
**AI:** "Looking at your progress, I see you've completed **Phishing Detection Fundamentals** - great job!

You're currently working on **Password Security Best Practices** (67% complete) and **Social Engineering Awareness** (33% complete).

**My recommendation:** Focus on finishing **Password Security** first since you're already 2/3 done. You just need to complete the Password Managers lesson and retake the quiz (you scored 60%, so close to the 70% passing mark!).

After that, I'd suggest completing **Social Engineering** since it builds nicely on what you've learned about phishing.

Want some tips for the Password Security quiz?"

---

**User:** "Why did I fail my quiz?"
**AI:** "I can see you took the Password Security quiz and scored 60% (you need 70% to pass).

While I can't see your specific wrong answers, based on common mistakes students make in this quiz, here are the key topics to review:

1. **Password Complexity** - Review why 12+ characters is recommended
2. **Password Reuse** - Make sure you understand why each account needs a unique password
3. **Two-Factor Authentication** - When and why to use it

I recommend going back to Lesson 2: "Creating Strong Passwords" and Lesson 3: "Password Managers" before retaking the quiz.

Want me to explain any of these concepts in more detail?"

---

## Implementation Complexity

**Effort:** 2-3 hours
**API Cost:** Same (still free with Gemini)
**Token Usage:** ~2x per message (sending more context)
- Before: ~100 tokens per message
- After: ~200-300 tokens per message
- Still WAY under the 1M token/day limit

**Database Queries per Chat:**
- 1 query for courses (can be cached)
- 1 query for user data
- Not a performance issue at all

---

## Should You Implement This?

### Pros:
✅ AI becomes **platform-aware**
✅ Can answer questions about courses, enrollment, progress
✅ Provides **personalized recommendations**
✅ Much more useful for students
✅ Still free (under quota limits)

### Cons:
❌ More complex code
❌ Slightly slower responses (database queries)
❌ Uses more tokens per message (still free, but closer to limits)

---

## My Recommendation

**For now:** Keep it simple. What you have works great for:
- General cybersecurity education
- Concept explanations
- Security advice

**Later (if needed):** Add context when:
- Students start asking platform-specific questions
- You want personalized recommendations
- You need the AI to guide users through the platform

You can add this anytime - it's a 2-3 hour upgrade when you're ready.

---

## Quick Start Implementation

If you want this NOW, here's the fastest path:

1. I'll update `ai.service.ts` to accept `userId`
2. I'll add database queries to fetch courses and user data
3. I'll build context strings and include them in prompts
4. Update controller to pass userId
5. Test with 2-3 questions

**Total API calls for testing: 2-3 (still under 0.2% of quota)**

Want me to implement this now, or keep the simple version for now?
