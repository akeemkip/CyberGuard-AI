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

    let backfilledIntro = 0;
    for (const student of activeStudents) {
      // Skip if already has intro attempt
      if (student.introAssessmentAttempts.length > 0) {
        continue;
      }

      // Calculate simulated score based on quiz performance
      const avgQuizScore = student.quizAttempts.length > 0
        ? student.quizAttempts.reduce((sum, q) => sum + q.score, 0) / student.quizAttempts.length
        : 3;

      // Convert to percentage (assuming quizzes have ~5 questions)
      const baselinePercentage = Math.min(100, Math.max(30, Math.round((avgQuizScore / 5) * 100)));

      // Add some randomness (-10% to +10%)
      const randomAdjustment = Math.floor(Math.random() * 21) - 10;
      const finalPercentage = Math.min(100, Math.max(30, baselinePercentage + randomAdjustment));
      const score = Math.round((finalPercentage / 100) * 6);

      // Create simulated answers
      const answers = Array.from({ length: 6 }, (_, i) => ({
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
          totalQuestions: 6,
          percentage: finalPercentage,
          passed: finalPercentage >= 50,
          answers: answers,
          completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
        }
      });

      backfilledIntro++;
    }

    console.log(`✅ Backfilled ${backfilledIntro} intro assessment attempts`);

    // Backfill full assessment attempts for demo accounts
    const demoAccounts = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: 'demo', mode: 'insensitive' } },
          { email: { contains: 'test', mode: 'insensitive' } },
          { firstName: 'Demo' }
        ],
        role: 'STUDENT'
      },
      include: {
        introAssessmentAttempts: true,
        fullAssessmentAttempts: true
      }
    });

    console.log(`🎭 Found ${demoAccounts.length} demo accounts`);

    let backfilledFull = 0;
    for (const demo of demoAccounts) {
      // Skip if already has full attempt
      if (demo.fullAssessmentAttempts.length > 0) {
        continue;
      }

      // Get intro score if exists
      const introScore = demo.introAssessmentAttempts[0]?.percentage || 50;

      // Full assessment should show improvement (+15% to +35%)
      const improvement = Math.floor(Math.random() * 21) + 15;
      const finalPercentage = Math.min(95, introScore + improvement);
      const score = Math.round((finalPercentage / 100) * 30);

      await prisma.fullAssessmentAttempt.create({
        data: {
          userId: demo.id,
          score,
          totalQuestions: 30,
          percentage: finalPercentage,
          passed: finalPercentage >= 70,
          timeSpent: Math.floor(Math.random() * 600) + 900, // 15-25 minutes
          timerExpired: false,
          answers: { simulated: true },
          completedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date in last 7 days
        }
      });

      backfilledFull++;
    }

    console.log(`✅ Backfilled ${backfilledFull} full assessment attempts`);
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
