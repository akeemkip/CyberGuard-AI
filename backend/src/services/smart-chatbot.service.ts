/**
 * Smart Chatbot Service - Medium Intelligence
 * Handles ~30-40 common questions with database integration
 * Falls back to generic responses for unknown questions
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ChatResponse {
  message: string;
  data?: any; // Optional data to render in frontend (courses, progress, etc.)
}

/**
 * Main function - routes question to appropriate handler
 */
export async function getSmartChatResponse(
  userMessage: string,
  userId: string
): Promise<ChatResponse> {
  const msg = userMessage.toLowerCase().trim();

  // Remove question marks and common filler words for better matching
  const cleanMsg = msg.replace(/[?!.]/g, '').replace(/\b(can|could|would|please|help|me)\b/g, '');

  try {
    // ============ COURSE CATALOG QUESTIONS ============
    if (matchesPattern(cleanMsg, ['course', 'offer'])) {
      return await handleCourseList();
    }

    if (matchesPattern(cleanMsg, ['course', 'about']) || matchesPattern(cleanMsg, ['tell me about'])) {
      return await handleCourseSearch(extractCourseName(cleanMsg));
    }

    if (matchesPattern(cleanMsg, ['how many', 'course']) || matchesPattern(cleanMsg, ['total course'])) {
      return await handleCourseCount();
    }

    if (matchesPattern(cleanMsg, ['course', 'beginner']) || matchesPattern(cleanMsg, ['easy', 'course'])) {
      return await handleBeginnerCourses();
    }

    if (matchesPattern(cleanMsg, ['course', 'advanced']) || matchesPattern(cleanMsg, ['hard', 'course'])) {
      return await handleAdvancedCourses();
    }

    // ============ USER PROGRESS QUESTIONS ============
    if (matchesPattern(cleanMsg, ['my progress']) || matchesPattern(cleanMsg, ['how am i doing'])) {
      return await handleUserProgress(userId);
    }

    if (matchesPattern(cleanMsg, ['complete', 'course']) || matchesPattern(cleanMsg, ['finished course'])) {
      return await handleCompletedCourses(userId);
    }

    if (matchesPattern(cleanMsg, ['quiz', 'score']) || matchesPattern(cleanMsg, ['quiz', 'result'])) {
      return await handleQuizScores(userId);
    }

    if (matchesPattern(cleanMsg, ['enroll']) && matchesPattern(cleanMsg, ['course'])) {
      return await handleEnrollments(userId);
    }

    // ============ RECOMMENDATIONS ============
    if (matchesPattern(cleanMsg, ['recommend', 'course']) || matchesPattern(cleanMsg, ['suggest', 'course'])) {
      return await handleRecommendations(userId);
    }

    if (matchesPattern(cleanMsg, ['what should i', 'take']) || matchesPattern(cleanMsg, ['what should i', 'study'])) {
      return await handleRecommendations(userId);
    }

    if (matchesPattern(cleanMsg, ['next', 'course']) || matchesPattern(cleanMsg, ['what', 'next'])) {
      return await handleNextCourse(userId);
    }

    // ============ SPECIFIC TOPICS ============
    if (matchesPattern(cleanMsg, ['phishing'])) {
      return await handleTopicSearch('phishing');
    }

    if (matchesPattern(cleanMsg, ['password'])) {
      return await handleTopicSearch('password');
    }

    if (matchesPattern(cleanMsg, ['social engineering'])) {
      return await handleTopicSearch('social engineering');
    }

    if (matchesPattern(cleanMsg, ['malware']) || matchesPattern(cleanMsg, ['virus'])) {
      return await handleTopicSearch('malware');
    }

    // ============ PLATFORM HELP ============
    if (matchesPattern(cleanMsg, ['how', 'enroll']) || matchesPattern(cleanMsg, ['enroll', 'course'])) {
      return handleEnrollmentHelp();
    }

    if (matchesPattern(cleanMsg, ['certificate'])) {
      return handleCertificateHelp();
    }

    if (matchesPattern(cleanMsg, ['assessment']) || matchesPattern(cleanMsg, ['skill test'])) {
      return handleAssessmentHelp();
    }

    if (matchesPattern(cleanMsg, ['reset', 'password']) || matchesPattern(cleanMsg, ['forgot', 'password'])) {
      return handlePasswordReset();
    }

    // ============ GREETINGS ============
    if (matchesPattern(cleanMsg, ['hello']) || matchesPattern(cleanMsg, ['hi']) || matchesPattern(cleanMsg, ['hey'])) {
      return handleGreeting();
    }

    if (matchesPattern(cleanMsg, ['thank']) || matchesPattern(cleanMsg, ['thanks'])) {
      return handleThanks();
    }

    // ============ DEFAULT FALLBACK ============
    return handleUnknown();

  } catch (error) {
    console.error('Smart chatbot error:', error);
    return {
      message: "I'm having trouble processing your request right now. Please try again in a moment."
    };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if message contains all keywords in a pattern
 */
function matchesPattern(message: string, keywords: string[]): boolean {
  return keywords.every(keyword => message.includes(keyword));
}

/**
 * Extract course name from message (simple approach)
 */
function extractCourseName(message: string): string {
  // Look for common course names
  const courses = ['phishing', 'password', 'social engineering', 'browsing', 'data protection'];
  for (const course of courses) {
    if (message.includes(course)) {
      return course;
    }
  }
  return '';
}

// ============================================
// HANDLER FUNCTIONS (DATABASE QUERIES)
// ============================================

async function handleCourseList(): Promise<ChatResponse> {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      duration: true,
    },
    orderBy: { difficulty: 'asc' },
  });

  const courseList = courses
    .map(c => `**${c.title}** (${c.difficulty}) - ${c.duration}`)
    .join('\n\n');

  return {
    message: `We offer ${courses.length} cybersecurity courses:\n\n${courseList}\n\nYou can enroll in any course from the Course Catalog!`,
    data: courses,
  };
}

async function handleCourseSearch(courseName: string): Promise<ChatResponse> {
  if (!courseName) {
    return handleCourseList();
  }

  const course = await prisma.course.findFirst({
    where: {
      isPublished: true,
      title: { contains: courseName, mode: 'insensitive' },
    },
    include: {
      lessons: {
        select: { id: true, title: true, order: true },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!course) {
    return {
      message: `I couldn't find a course about "${courseName}". Try asking "What courses do you offer?" to see all available courses.`,
    };
  }

  const lessonList = course.lessons.map(l => `${l.order}. ${l.title}`).join('\n');

  return {
    message: `**${course.title}**\n\n${course.description}\n\n**Difficulty:** ${course.difficulty}\n**Duration:** ${course.duration}\n**Lessons:** ${course.lessons.length}\n\n${lessonList}\n\nReady to start learning? Enroll from the Course Catalog!`,
    data: course,
  };
}

async function handleCourseCount(): Promise<ChatResponse> {
  const count = await prisma.course.count({ where: { isPublished: true } });
  return {
    message: `We currently have **${count} published courses** covering various cybersecurity topics. Would you like to see them all?`,
  };
}

async function handleBeginnerCourses(): Promise<ChatResponse> {
  const courses = await prisma.course.findMany({
    where: { isPublished: true, difficulty: 'Beginner' },
    select: { title: true, description: true },
  });

  if (courses.length === 0) {
    return { message: "We don't have beginner courses labeled right now, but all our courses are beginner-friendly!" };
  }

  const list = courses.map(c => `• **${c.title}**`).join('\n');
  return {
    message: `Here are our beginner-friendly courses:\n\n${list}\n\nThese are perfect for getting started with cybersecurity!`,
    data: courses,
  };
}

async function handleAdvancedCourses(): Promise<ChatResponse> {
  const courses = await prisma.course.findMany({
    where: { isPublished: true, difficulty: { in: ['Intermediate', 'Advanced'] } },
    select: { title: true, difficulty: true },
  });

  if (courses.length === 0) {
    return { message: "We're working on adding more advanced courses soon!" };
  }

  const list = courses.map(c => `• **${c.title}** (${c.difficulty})`).join('\n');
  return {
    message: `Here are our intermediate and advanced courses:\n\n${list}\n\nThese will challenge your cybersecurity knowledge!`,
    data: courses,
  };
}

async function handleUserProgress(userId: string): Promise<ChatResponse> {
  const enrollments = await prisma.enrollment.count({ where: { userId } });
  const completedEnrollments = await prisma.enrollment.count({
    where: { userId, completedAt: { not: null } },
  });
  const completedLessons = await prisma.progress.count({
    where: { userId, completed: true },
  });
  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { userId },
    select: { score: true, passed: true },
  });

  const avgScore = quizAttempts.length > 0
    ? (quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length).toFixed(1)
    : 'N/A';

  const passedQuizzes = quizAttempts.filter(a => a.passed).length;

  return {
    message: `**Your Progress Summary:**\n\n📚 Enrolled Courses: ${enrollments}\n✅ Completed Courses: ${completedEnrollments}\n📖 Lessons Completed: ${completedLessons}\n🎯 Average Quiz Score: ${avgScore}%\n✨ Passed Quizzes: ${passedQuizzes}/${quizAttempts.length}\n\nKeep up the great work! 🚀`,
    data: {
      enrollments,
      completedEnrollments,
      completedLessons,
      avgScore,
      passedQuizzes,
      totalQuizzes: quizAttempts.length,
    },
  };
}

async function handleCompletedCourses(userId: string): Promise<ChatResponse> {
  const completed = await prisma.enrollment.findMany({
    where: { userId, completedAt: { not: null } },
    include: { course: { select: { title: true } } },
  });

  if (completed.length === 0) {
    return {
      message: "You haven't completed any courses yet. Keep learning, you're doing great! 💪",
    };
  }

  const list = completed.map(e => `✅ ${e.course.title}`).join('\n');
  return {
    message: `You've completed **${completed.length} course(s)**:\n\n${list}\n\nAmazing work! Want to try another course?`,
    data: completed,
  };
}

async function handleQuizScores(userId: string): Promise<ChatResponse> {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: { quiz: { include: { lesson: { select: { title: true } } } } },
    orderBy: { attemptedAt: 'desc' },
    take: 5,
  });

  if (attempts.length === 0) {
    return { message: "You haven't taken any quizzes yet. Complete a lesson to unlock the quiz!" };
  }

  const list = attempts
    .map(a => `${a.passed ? '✅' : '❌'} ${a.quiz.lesson.title} - ${a.score}%`)
    .join('\n');

  const avgScore = (attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length).toFixed(1);

  return {
    message: `**Your Recent Quiz Results:**\n\n${list}\n\n**Average Score:** ${avgScore}%\n\nKeep practicing to improve your scores! 🎯`,
    data: attempts,
  };
}

async function handleEnrollments(userId: string): Promise<ChatResponse> {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: { course: { select: { title: true, difficulty: true } } },
  });

  if (enrollments.length === 0) {
    return {
      message: "You're not enrolled in any courses yet. Visit the Course Catalog to get started!",
    };
  }

  const list = enrollments.map(e => `📚 ${e.course.title} (${e.course.difficulty})`).join('\n');
  return {
    message: `**Your Enrolled Courses (${enrollments.length}):**\n\n${list}\n\nClick on any course to continue learning!`,
    data: enrollments,
  };
}

async function handleRecommendations(userId: string): Promise<ChatResponse> {
  // Check what user has completed
  const completedEnrollments = await prisma.enrollment.findMany({
    where: { userId, completedAt: { not: null } },
    include: { course: { select: { id: true } } },
  });

  const completedCourseIds = completedEnrollments.map(e => e.courseId);

  // Find courses they haven't taken
  const recommended = await prisma.course.findMany({
    where: {
      isPublished: true,
      id: { notIn: completedCourseIds },
    },
    select: { title: true, description: true, difficulty: true },
    take: 3,
  });

  if (recommended.length === 0) {
    return {
      message: "Wow! You've completed all our courses! 🎉 Check back soon for new content.",
    };
  }

  const list = recommended.map(c => `📘 **${c.title}** (${c.difficulty})\n   ${c.description}`).join('\n\n');

  return {
    message: `Based on your progress, I recommend these courses:\n\n${list}\n\nReady to expand your knowledge? 🚀`,
    data: recommended,
  };
}

async function handleNextCourse(userId: string): Promise<ChatResponse> {
  // Find current enrollments not completed
  const inProgress = await prisma.enrollment.findFirst({
    where: { userId, completedAt: null },
    include: { course: { select: { title: true } } },
  });

  if (inProgress) {
    return {
      message: `You're currently working on **${inProgress.course.title}**. Keep going, you're almost there! 💪`,
    };
  }

  // If nothing in progress, recommend a new course
  return handleRecommendations(userId);
}

async function handleTopicSearch(topic: string): Promise<ChatResponse> {
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: topic, mode: 'insensitive' } },
        { description: { contains: topic, mode: 'insensitive' } },
      ],
    },
    select: { title: true, description: true },
  });

  if (courses.length === 0) {
    return {
      message: `I couldn't find courses specifically about "${topic}", but I can show you all our courses if you'd like!`,
    };
  }

  const list = courses.map(c => `📘 **${c.title}**\n   ${c.description}`).join('\n\n');
  return {
    message: `Here's what we have on **${topic}**:\n\n${list}\n\nInterested? Enroll from the Course Catalog!`,
    data: courses,
  };
}

// ============================================
// STATIC HELP RESPONSES
// ============================================

function handleEnrollmentHelp(): ChatResponse {
  return {
    message: `**How to Enroll in a Course:**\n\n1. Go to the **Course Catalog** from the navigation menu\n2. Browse available courses\n3. Click the **"Enroll Now"** button on any course card\n4. Start learning immediately!\n\nAll courses are free and you can enroll in as many as you like. 📚`,
  };
}

function handleCertificateHelp(): ChatResponse {
  return {
    message: `**About Certificates:**\n\n🏆 You earn a certificate when you **complete all lessons** in a course.\n\nView your earned certificates:\n1. Click **"Certificates"** in your dashboard\n2. Click **"View Certificate"** to see the full certificate\n3. You can print or save it as PDF\n\nKeep learning to earn more certificates! 🎓`,
  };
}

function handleAssessmentHelp(): ChatResponse {
  return {
    message: `**Skill Assessments:**\n\n📝 Test your cybersecurity knowledge with our comprehensive assessment:\n\n• **30 questions** covering all topics\n• **25-minute timer**\n• **70% passing score**\n• Questions are randomized each time\n\nFind assessments in your dashboard under **"Quick Actions"** or the navigation menu.\n\nGood luck! 🎯`,
  };
}

function handlePasswordReset(): ChatResponse {
  return {
    message: `**Password Reset:**\n\nCurrently, password reset requires admin assistance. Please contact support:\n\n📧 Email: support@cyberguard.com\n\nWe're working on self-service password reset. Thanks for your patience!`,
  };
}

function handleGreeting(): ChatResponse {
  const greetings = [
    "Hello! I'm your CyberGuard AI assistant. How can I help you today? 👋",
    "Hi there! Ready to learn some cybersecurity? Ask me anything! 🚀",
    "Hey! I'm here to help with courses, progress, and platform questions. What do you need? 😊",
  ];
  return { message: greetings[Math.floor(Math.random() * greetings.length)] };
}

function handleThanks(): ChatResponse {
  return {
    message: "You're welcome! Happy to help. Keep learning and stay secure! 🔒✨",
  };
}

function handleUnknown(): ChatResponse {
  return {
    message: `I'm not sure how to answer that. Here's what I can help with:\n\n📚 **Courses:** "What courses do you offer?" or "Tell me about password security"\n📊 **Progress:** "Show my progress" or "What's my quiz score?"\n💡 **Recommendations:** "What should I study next?"\n❓ **Help:** "How do I enroll?" or "Where are my certificates?"\n\nTry rephrasing your question, or ask me something else!`,
  };
}
