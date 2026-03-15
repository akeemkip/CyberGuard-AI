import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const INTRO_ASSESSMENT_QUESTIONS = [
  {
    course: 'Phishing Detection',
    question: 'Which of the following is a common red flag in a phishing email?',
    options: [
      'Professional company logo',
      'Urgent request to verify account information',
      'Email sent during business hours',
      'Proper grammar and spelling'
    ],
    correctAnswer: 1,
    explanation: 'Phishing emails often create a sense of urgency to pressure victims into acting quickly without thinking. Urgent requests to verify account information are a major red flag.'
  },
  {
    course: 'Password Security',
    question: 'What is the primary purpose of multi-factor authentication (MFA)?',
    options: [
      'To make login faster',
      'To add an extra layer of security beyond passwords',
      'To eliminate the need for passwords',
      'To track user login locations'
    ],
    correctAnswer: 1,
    explanation: 'MFA adds an additional layer of security by requiring two or more verification factors, making it much harder for attackers to gain unauthorized access even if they have your password.'
  },
  {
    course: 'Social Engineering',
    question: 'You receive a phone call from someone claiming to be from IT support asking for your password. What should you do?',
    options: [
      'Provide your password since they are from IT',
      'Give them a fake password to test them',
      'Refuse to provide credentials and verify through official channels',
      'Ask them to call back later'
    ],
    correctAnswer: 2,
    explanation: 'Legitimate IT departments never ask for passwords over the phone. Always verify requests through official channels like calling the IT helpdesk directly using a known phone number.'
  },
  {
    course: 'Secure Web Browsing',
    question: 'What does "HTTPS" in a website URL indicate?',
    options: [
      'The website is government-owned',
      'The connection is encrypted and secure',
      'The website has no advertisements',
      'The website is mobile-friendly'
    ],
    correctAnswer: 1,
    explanation: 'HTTPS indicates that the connection between your browser and the website is encrypted, protecting your data from interception. Always look for HTTPS when entering sensitive information.'
  },
  {
    course: 'Personal Data Protection',
    question: 'Which of the following is considered Personally Identifiable Information (PII)?',
    options: [
      'Your favorite color',
      'Your social security number',
      'The weather in your city',
      'Your favorite sports team'
    ],
    correctAnswer: 1,
    explanation: 'PII includes any information that can be used to identify an individual, such as social security numbers, full names, addresses, or financial account numbers. This information must be protected carefully.'
  },
  {
    course: 'Advanced Threat Analysis',
    question: 'What is ransomware?',
    options: [
      'A type of antivirus software',
      'Malware that encrypts files and demands payment for decryption',
      'A secure backup solution',
      'A password manager'
    ],
    correctAnswer: 1,
    explanation: 'Ransomware is malicious software that encrypts your files and demands a ransom payment (usually in cryptocurrency) to restore access. Prevention through backups and security awareness is crucial.'
  }
];

async function main() {
  console.log('🌱 Starting intro assessment seed...');

  try {
    // Get all courses
    const courses = await prisma.course.findMany({
      select: { id: true, title: true }
    });

    console.log(`📚 Found ${courses.length} courses`);

    // Create or get intro assessment
    let introAssessment = await prisma.introAssessment.findFirst({
      where: { isActive: true }
    });

    if (!introAssessment) {
      introAssessment = await prisma.introAssessment.create({
        data: {
          title: 'Intro Skills Assessment',
          description: 'A quick 6-question assessment to establish your baseline cybersecurity knowledge',
          passingScore: 50,
          isActive: true
        }
      });
      console.log('✅ Created intro assessment');
    } else {
      console.log('✅ Using existing intro assessment');
    }

    // Create questions (clear existing ones first if any)
    const existingQuestions = await prisma.introQuestion.findMany({
      where: { introAssessmentId: introAssessment.id }
    });

    if (existingQuestions.length > 0) {
      await prisma.introQuestion.deleteMany({
        where: { introAssessmentId: introAssessment.id }
      });
      console.log(`🗑️  Deleted ${existingQuestions.length} existing questions`);
    }

    // Create new questions
    let questionCount = 0;
    for (const [index, questionData] of INTRO_ASSESSMENT_QUESTIONS.entries()) {
      // Find the course by partial title match
      const course = courses.find(c =>
        c.title.toLowerCase().includes(questionData.course.toLowerCase())
      );

      if (!course) {
        console.log(`⚠️  Warning: Could not find course matching "${questionData.course}"`);
        continue;
      }

      await prisma.introQuestion.create({
        data: {
          introAssessmentId: introAssessment.id,
          courseId: course.id,
          question: questionData.question,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          explanation: questionData.explanation,
          order: index
        }
      });
      questionCount++;
    }

    console.log(`✅ Created ${questionCount} intro questions`);

    // Backfill intro assessment attempts for active students
    const activeStudents = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        OR: [
          { enrollments: { some: {} } },
          { quizAttempts: { some: {} } },
          { phishingAttempts: { some: {} } }
        ]
      },
      include: {
        quizAttempts: true,
        introAssessmentAttempts: true
      }
    });

    console.log(`👥 Found ${activeStudents.length} active students`);

    // Deterministic intro assessment scores for consistent analytics data
    const introScores: { [email: string]: { score: number; totalQuestions: number; percentage: number } } = {
      'rajesh.singh@gmail.com': { score: 8, totalQuestions: 10, percentage: 80 },
      'priya.persaud@yahoo.com': { score: 5, totalQuestions: 10, percentage: 50 },
      'kumar.ramnauth@outlook.com': { score: 4, totalQuestions: 10, percentage: 40 },
      'arjun.jaipaul@yahoo.com': { score: 6, totalQuestions: 10, percentage: 60 },
      'vishnu.bisram@outlook.com': { score: 10, totalQuestions: 10, percentage: 100 },
    };

    let backfilledIntro = 0;
    for (const student of activeStudents) {
      // Skip if already has intro attempt
      if (student.introAssessmentAttempts.length > 0) {
        continue;
      }

      const scoreData = introScores[student.email];
      // Fallback for unknown students: derive from quiz performance
      const score = scoreData?.score ?? Math.round(
        (student.quizAttempts.length > 0
          ? student.quizAttempts.reduce((sum, q) => sum + q.score, 0) / student.quizAttempts.length
          : 3) / 5 * 10
      );
      const totalQuestions = scoreData?.totalQuestions ?? 10;
      const percentage = scoreData?.percentage ?? Math.round((score / totalQuestions) * 100);

      // Create simulated answers
      const answers = Array.from({ length: totalQuestions }, (_, i) => ({
        questionId: `question-${i}`,
        selectedAnswer: i < score ? 1 : 0,
        correctAnswer: 1,
        isCorrect: i < score
      }));

      await prisma.introAssessmentAttempt.create({
        data: {
          userId: student.id,
          introAssessmentId: introAssessment.id,
          score,
          totalQuestions,
          percentage,
          passed: percentage >= 50,
          answers: answers,
          completedAt: new Date('2026-01-05T00:00:00.000Z')
        }
      });

      backfilledIntro++;
    }

    console.log(`✅ Backfilled ${backfilledIntro} intro assessment attempts`);

    // Backfill full assessment attempts for students with completed courses
    // This simulates students who have taken training and are now taking the final assessment
    const studentsWithCompletedCourses = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        enrollments: {
          some: {
            completedAt: { not: null }
          }
        },
        introAssessmentAttempts: {
          some: {}
        }
      },
      include: {
        introAssessmentAttempts: {
          orderBy: { completedAt: 'desc' },
          take: 1
        },
        fullAssessmentAttempts: true,
        enrollments: {
          where: { completedAt: { not: null } },
          select: { completedAt: true }
        }
      }
    });

    console.log(`👥 Found ${studentsWithCompletedCourses.length} students with completed courses`);

    // Deterministic full assessment scores for specific students
    // First attempt and second attempt data for Assessment Comparison analytics
    // Improvement, Knowledge Retention, and Status compare 1st vs 2nd attempt
    const fullAssessmentData: { [email: string]: {
      first: { percentage: number; score: number; date: string };
      second: { percentage: number; score: number; date: string };
    } } = {
      'rajesh.singh@gmail.com': {
        first: { percentage: 72, score: 22, date: '2026-01-20' },   // 1st attempt: 72%
        second: { percentage: 90, score: 27, date: '2026-02-05' },  // 2nd attempt: 90% (+18%, Good retention)
      },
      'vishnu.bisram@outlook.com': {
        first: { percentage: 88, score: 26, date: '2026-01-15' },   // 1st attempt: 88%
        second: { percentage: 95, score: 29, date: '2026-02-01' },  // 2nd attempt: 95% (+7%, Moderate retention)
      },
      'priya.persaud@yahoo.com': {
        first: { percentage: 50, score: 15, date: '2026-02-01' },   // 1st attempt: 50% (failed)
        second: { percentage: 72, score: 22, date: '2026-02-15' },  // 2nd attempt: 72% (+22%, Excellent retention)
      },
    };

    const allStudentsForFull = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        email: { in: Object.keys(fullAssessmentData) },
        introAssessmentAttempts: { some: {} }
      },
      include: {
        fullAssessmentAttempts: true
      }
    });

    let backfilledFull = 0;
    for (const student of allStudentsForFull) {
      // Skip if already has full attempts
      if (student.fullAssessmentAttempts.length > 0) {
        continue;
      }

      const data = fullAssessmentData[student.email];
      if (!data) continue;

      // Create first attempt
      await prisma.fullAssessmentAttempt.create({
        data: {
          userId: student.id,
          score: data.first.score,
          totalQuestions: 30,
          percentage: data.first.percentage,
          passed: data.first.percentage >= 70,
          timeSpent: 1200,
          timerExpired: false,
          answers: { simulated: true, attempt: 1 },
          completedAt: new Date(data.first.date)
        }
      });

      // Create second attempt
      await prisma.fullAssessmentAttempt.create({
        data: {
          userId: student.id,
          score: data.second.score,
          totalQuestions: 30,
          percentage: data.second.percentage,
          passed: data.second.percentage >= 70,
          timeSpent: 1100,
          timerExpired: false,
          answers: { simulated: true, attempt: 2 },
          completedAt: new Date(data.second.date)
        }
      });

      backfilledFull++;
    }

    console.log(`✅ Backfilled ${backfilledFull} students with 1st + 2nd full assessment attempts`);
    console.log('🎉 Seed completed successfully!');

  } catch (error) {
    console.error('❌ Error during seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
