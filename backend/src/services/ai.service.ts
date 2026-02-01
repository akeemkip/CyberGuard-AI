import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../config/database';

// Initialize Gemini AI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System prompt - defines AI personality and behavior
const SYSTEM_PROMPT = `You are CyberGuard AI Assistant, a friendly and knowledgeable cybersecurity tutor for the CyberGuard AI platform.

Your role:
- Help students understand cybersecurity concepts in simple, clear language
- Answer questions about phishing, password security, social engineering, safe browsing, and data protection
- Provide information about platform courses, enrollment, and features
- Give personalized recommendations based on user progress
- Provide practical examples and real-world scenarios
- Be supportive and patient with beginners
- Guide students to understand concepts, don't just give direct answers to quiz questions

Guidelines:
- Keep responses concise (2-4 paragraphs max for simple questions, longer for complex topics)
- Use analogies and examples to explain complex topics
- When discussing courses, be specific about what's available on the platform
- When giving recommendations, consider the user's current progress and quiz scores
- Always prioritize security best practices
- If asked about non-security topics, politely redirect to cybersecurity

Tone: Friendly, encouraging, professional, and educational.`;

/**
 * Send a chat message to Gemini AI with platform and user context
 * @param userMessage - The user's question or message
 * @param userId - The ID of the user asking the question
 * @returns AI-generated response as a string
 */
export async function sendChatMessage(userMessage: string, userId: string): Promise<string> {
  try {
    // Validate API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return 'AI service is not configured. Please contact support.';
    }

    // Fetch platform data (courses)
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      select: {
        title: true,
        description: true,
        difficulty: true,
        duration: true,
        lessons: {
          select: { title: true, order: true },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { difficulty: 'asc' }
    });

    // Fetch user data with progress
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        enrollments: {
          include: {
            course: {
              select: { title: true, difficulty: true }
            }
          }
        },
        progress: {
          where: { completed: true },
          select: { lessonId: true }
        },
        quizAttempts: {
          include: {
            quiz: {
              include: {
                lesson: { select: { title: true } }
              }
            }
          },
          orderBy: { attemptedAt: 'desc' },
          take: 5
        }
      }
    });

    // Build platform context
    const platformContext = buildPlatformContext(courses);

    // Build user context
    const userContext = user ? buildUserContext(user) : '';

    // Get Gemini model (using stable 2.5-flash - current model as of 2026)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Prepare the full prompt with system instructions, platform context, user context
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${platformContext}\n\n${userContext}\n\nStudent question: ${userMessage}`;

    // Generate AI response
    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    return response;
  } catch (error: any) {
    console.error('Error calling Gemini AI:', error.message || error);

    // Handle specific errors with user-friendly messages
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return 'AI service is temporarily unavailable due to high demand. Please try again in a few moments.';
    }

    if (error.message?.includes('404')) {
      return 'AI model configuration error. Please contact support.';
    }

    if (error.message?.includes('401') || error.message?.includes('403')) {
      return 'AI service authentication error. Please contact support.';
    }

    // Generic error for all other cases
    return 'Sorry, I encountered an error. Please try again in a moment.';
  }
}

/**
 * Build platform context string with course information
 */
function buildPlatformContext(courses: any[]): string {
  const courseList = courses.map((course, index) => {
    const lessonCount = course.lessons?.length || 0;
    const lessonList = course.lessons?.map((l: any) => `   ${l.order}. ${l.title}`).join('\n') || '';

    return `${index + 1}. **${course.title}** (${course.difficulty}, ${course.duration})
   ${course.description}
   Lessons (${lessonCount}):
${lessonList}`;
  }).join('\n\n');

  return `PLATFORM: CyberGuard AI - Cybersecurity Training Platform

AVAILABLE COURSES (${courses.length}):
${courseList}

PLATFORM FEATURES:
- Free course enrollment (all courses are free)
- Certificates upon course completion
- Skill assessments (30 questions, 25-minute timer, 70% passing score)
- Progress tracking for all lessons
- Quiz system at the end of each course (70% to pass)
- AI assistant for learning support (that's you!)

HOW TO ENROLL IN A COURSE:
1. Navigate to "Course Catalog" from the dashboard
2. Browse available courses
3. Click "Enroll Now" button on any course
4. Start learning immediately - all courses are free!

HOW TO GET CERTIFICATES:
1. Complete all lessons in a course
2. Pass the course quiz (70% or higher)
3. Navigate to "Certificates" page from your dashboard
4. View and download/print your certificate

HOW QUIZZES WORK:
- Each course has a final quiz
- You need 70% to pass
- You can retake quizzes if you don't pass
- Review the lessons before retaking

HOW ASSESSMENTS WORK:
- Access from dashboard "Quick Actions" or navigation menu
- 30 questions covering all cybersecurity topics
- 25-minute timer (auto-submits when time expires)
- 70% passing score
- Questions randomized each attempt`;
}

/**
 * Build user context string with progress and stats
 */
function buildUserContext(user: any): string {
  const enrolledCourses = user.enrollments?.length || 0;
  const completedCourses = user.enrollments?.filter((e: any) => e.completedAt !== null).length || 0;
  const completedLessons = user.progress?.length || 0;

  // Calculate average quiz score
  const quizzes = user.quizAttempts || [];
  const avgScore = quizzes.length > 0
    ? (quizzes.reduce((sum: number, q: any) => sum + q.score, 0) / quizzes.length).toFixed(1)
    : 'N/A';

  // Build enrolled courses list
  const enrollmentList = user.enrollments?.map((e: any) => {
    const status = e.completedAt ? '✅ Completed' : '🔄 In Progress';
    return `- ${e.course.title} (${e.course.difficulty}) - ${status}`;
  }).join('\n') || 'None yet';

  // Build recent quiz attempts list
  const quizList = quizzes.slice(0, 5).map((q: any) => {
    const status = q.passed ? '✅ Passed' : '❌ Failed';
    return `- ${q.quiz.lesson.title}: ${q.score}% ${status}`;
  }).join('\n') || 'No quizzes taken yet';

  return `CURRENT USER:
- Name: ${user.firstName} ${user.lastName}
- Email: ${user.email}
- Role: ${user.role}

USER PROGRESS:
- Enrolled Courses: ${enrolledCourses}
- Completed Courses: ${completedCourses}
- Lessons Completed: ${completedLessons}
- Average Quiz Score: ${avgScore}%

ENROLLED COURSES:
${enrollmentList}

RECENT QUIZ ATTEMPTS (Last 5):
${quizList}`;
}
