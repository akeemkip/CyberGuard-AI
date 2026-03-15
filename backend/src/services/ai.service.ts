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
 * Generate AI explanation for quiz results
 */
export async function getQuizExplanation(
  quizTitle: string,
  questions: { question: string; options: string[] }[],
  results: { questionId: string; userAnswer: number; correctAnswer: number; isCorrect: boolean }[],
  score: number,
  passed: boolean
): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return 'AI service is not configured.';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build question review
    const questionReview = results.map((r, i) => {
      const q = questions[i];
      if (!q) return '';
      const userAnswerText = q.options[r.userAnswer] || 'No answer';
      const correctAnswerText = q.options[r.correctAnswer] || 'Unknown';
      return `Q${i + 1}: ${q.question}
  Student answered: "${userAnswerText}" ${r.isCorrect ? '(CORRECT)' : '(WRONG)'}
  Correct answer: "${correctAnswerText}"`;
    }).join('\n\n');

    const prompt = `You are a cybersecurity tutor reviewing a student's quiz results.

Quiz: "${quizTitle}"
Score: ${score}% (${passed ? 'PASSED' : 'FAILED'})

${questionReview}

Provide a brief, encouraging review:
1. For each WRONG answer, explain why the correct answer is right in 1-2 sentences. Focus on teaching the concept.
2. Skip correct answers — just acknowledge them briefly.
3. End with 1-2 sentences of encouragement and a specific study tip.

Keep the total response under 300 words. Use markdown formatting.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error('Error generating quiz explanation:', error.message);
    if (error.message?.includes('429')) {
      return 'AI is temporarily busy. Please try again in a moment.';
    }
    return 'Unable to generate explanation right now. Please try again later.';
  }
}

/**
 * Generate AI hint for a lab simulation
 */
export async function getLabHint(
  labTitle: string,
  labType: string,
  configSummary: string,
  hintNumber: number
): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return 'AI service is not configured.';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a cybersecurity tutor helping a student with an interactive lab simulation.

Lab: "${labTitle}"
Type: ${labType.replace(/_/g, ' ')}
Context: ${configSummary}

This is hint #${hintNumber} of 3 maximum.
${hintNumber === 1 ? 'Give a GENTLE hint — point them in the right direction without revealing answers.' : ''}
${hintNumber === 2 ? 'Give a MORE SPECIFIC hint — narrow down what to look for, but still don\'t give the answer.' : ''}
${hintNumber === 3 ? 'Give a DETAILED hint — explain the key concepts they should apply, with a concrete example of what to look for.' : ''}

Keep the hint to 2-3 sentences. Be encouraging. Use markdown formatting.
Do NOT reveal specific answers from the simulation.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error('Error generating lab hint:', error.message);
    if (error.message?.includes('429')) {
      return 'AI is temporarily busy. Please try again in a moment.';
    }
    return 'Unable to generate hint right now. Please try again later.';
  }
}

/**
 * Generate AI insights from analytics data
 */
export async function getAnalyticsInsights(analyticsData: {
  totalUsers: number;
  avgCompletionRate: number;
  avgQuizScore: number;
  totalLessonsCompleted: number;
  topUsers: { name: string; score: number; coursesCompleted: number }[];
  retention: { week: string; retention: number | null; avgScore: number | null }[];
  skillProficiency: { course: string; avgScore: number; enrolled: number; completed: number }[];
  engagement: { date: string; activeUsers: number }[];
}): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return 'AI service is not configured.';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a cybersecurity training platform analyst. Analyze this training data and provide actionable insights.

PLATFORM METRICS:
- Total Users: ${analyticsData.totalUsers}
- Average Completion Rate: ${analyticsData.avgCompletionRate}%
- Average Quiz Score: ${analyticsData.avgQuizScore}%
- Total Lessons Completed: ${analyticsData.totalLessonsCompleted}

COURSE PERFORMANCE:
${analyticsData.skillProficiency.map(s => `- ${s.course}: Avg Score ${s.avgScore}%, ${s.enrolled} enrolled, ${s.completed} completed`).join('\n')}

KNOWLEDGE RETENTION (weekly quiz retake trends):
${analyticsData.retention.filter(r => r.retention !== null).map(r => `- ${r.week}: Retention ${r.retention}%, Avg Score ${r.avgScore}%`).join('\n') || 'No retention data available'}

TOP PERFORMERS:
${analyticsData.topUsers.slice(0, 5).map(u => `- ${u.name}: Score ${u.score}%, ${u.coursesCompleted} courses completed`).join('\n')}

ENGAGEMENT TREND:
${analyticsData.engagement.slice(-7).map(e => `- ${e.date}: ${e.activeUsers} active users`).join('\n')}

Provide exactly 4 insights in this format:
1. **[Strength/Win]**: Something positive about the data
2. **[Concern]**: A potential issue or risk you see
3. **[Opportunity]**: An actionable recommendation
4. **[Trend]**: A pattern you notice in the data

Keep each insight to 2-3 sentences. Be specific with numbers. Use markdown formatting.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error('Error generating analytics insights:', error.message);
    if (error.message?.includes('429')) {
      return 'AI is temporarily busy. Please try again in a moment.';
    }
    return 'Unable to generate insights right now. Please try again later.';
  }
}

/**
 * Generate AI learning path based on intro assessment results
 */
export async function getLearningPath(
  courseScores: { courseTitle: string; correct: number; total: number; percentage: number }[],
  overallScore: number,
  passed: boolean
): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return 'AI service is not configured.';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const scoreBreakdown = courseScores.map(s =>
      `- ${s.courseTitle}: ${s.correct}/${s.total} (${s.percentage}%)`
    ).join('\n');

    const prompt = `You are a cybersecurity training advisor creating a personalized learning path for a new student.

The student just completed an initial skills assessment.
Overall Score: ${overallScore}% (${passed ? 'PASSED' : 'NEEDS IMPROVEMENT'})

Scores by topic:
${scoreBreakdown}

Based on these results, create a personalized learning path:

1. **Start with**: Recommend which course to take FIRST (their weakest area). Explain why in 1 sentence.
2. **Then**: List the remaining courses in recommended order, with a brief reason for each.
3. **Key focus areas**: In 2-3 sentences, highlight the specific concepts they should pay extra attention to based on their weak spots.
4. **Encouragement**: End with 1 encouraging sentence.

Keep it concise — under 200 words total. Use markdown formatting. Address the student directly as "you".`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error('Error generating learning path:', error.message);
    if (error.message?.includes('429')) {
      return 'AI is temporarily busy. Please try again in a moment.';
    }
    return 'Unable to generate learning path right now. Please try again later.';
  }
}

/**
 * Generate AI course recommendations based on user progress
 */
export async function getCourseRecommendations(userId: string): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return 'AI service is not configured.';
    }

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        enrollments: {
          include: {
            course: { select: { id: true, title: true, difficulty: true } }
          }
        },
        progress: {
          where: { completed: true },
          select: { lessonId: true }
        },
        quizAttempts: {
          include: {
            quiz: { include: { lesson: { select: { title: true, courseId: true } } } }
          },
          orderBy: { attemptedAt: 'desc' },
          take: 10
        }
      }
    });

    if (!user) return 'User not found.';

    // Fetch all published courses
    const allCourses = await prisma.course.findMany({
      where: { isPublished: true },
      select: { id: true, title: true, difficulty: true, description: true, duration: true }
    });

    // Fetch intro assessment attempt
    const assessmentAttempt = await prisma.introAssessmentAttempt.findFirst({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      select: { score: true, totalQuestions: true, percentage: true, answers: true }
    });

    // Build context
    const enrolledIds = new Set(user.enrollments.map(e => e.course.id));
    const completedIds = new Set(user.enrollments.filter(e => e.completedAt).map(e => e.course.id));
    const notEnrolled = allCourses.filter(c => !enrolledIds.has(c.id));
    const inProgress = user.enrollments.filter(e => !e.completedAt);

    const quizScoresByTopic: { [key: string]: number[] } = {};
    for (const attempt of user.quizAttempts) {
      const courseId = attempt.quiz.lesson.courseId;
      const course = allCourses.find(c => c.id === courseId);
      if (course) {
        if (!quizScoresByTopic[course.title]) quizScoresByTopic[course.title] = [];
        quizScoresByTopic[course.title].push(attempt.score);
      }
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a cybersecurity training advisor. Give personalized course recommendations for ${user.firstName || 'this student'}.

STUDENT PROGRESS:
- Enrolled in: ${user.enrollments.length} courses
- Completed: ${completedIds.size} courses
- Lessons completed: ${user.progress.length}
${assessmentAttempt ? `- Initial assessment score: ${assessmentAttempt.percentage}%` : '- No initial assessment taken'}

IN-PROGRESS COURSES:
${inProgress.map(e => `- ${e.course.title} (${e.course.difficulty})`).join('\n') || 'None'}

COMPLETED COURSES:
${user.enrollments.filter(e => e.completedAt).map(e => `- ${e.course.title}`).join('\n') || 'None'}

QUIZ PERFORMANCE:
${Object.entries(quizScoresByTopic).map(([topic, scores]) => `- ${topic}: avg ${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}%`).join('\n') || 'No quizzes taken yet'}

AVAILABLE (NOT ENROLLED):
${notEnrolled.map(c => `- ${c.title} (${c.difficulty}) - ${c.description}`).join('\n') || 'All courses enrolled'}

Give exactly 2-3 specific recommendations. For each:
- Name the course
- Why it's right for them NOW (based on their progress/gaps)
- What they'll gain

If they're enrolled in everything, suggest what to focus on next within their current courses.

Keep it under 150 words. Use markdown. Be specific and encouraging.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error('Error generating course recommendations:', error.message || error);
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('rate')) {
      return 'AI is temporarily busy due to rate limits. Please wait a minute and try again.';
    }
    if (error.message?.includes('SAFETY')) {
      return 'The AI response was blocked by safety filters. Please try again.';
    }
    return 'Unable to generate recommendations right now. Please try again later.';
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
