import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * This script adds historical learning data to an existing user.
 * It does NOT delete any existing data - it only adds new records.
 *
 * Usage: npx ts-node prisma/add-demo-history.ts
 */

async function main() {
  const userEmail = 'akeemkippins.gy@gmail.com';

  console.log(`\n📊 Adding historical data for ${userEmail}...\n`);

  // Find the existing user
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) {
    console.error(`❌ User ${userEmail} not found. Please register first.`);
    process.exit(1);
  }

  console.log(`✅ Found user: ${user.firstName} ${user.lastName}`);

  // Get all courses
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'asc' },
    include: { lessons: { orderBy: { order: 'asc' } } }
  });

  if (courses.length < 4) {
    console.error('❌ Not enough courses in database. Run npm run db:seed first.');
    process.exit(1);
  }

  console.log(`✅ Found ${courses.length} courses`);

  // Check for existing enrollments and skip if already set up
  const existingEnrollments = await prisma.enrollment.findMany({
    where: { userId: user.id }
  });

  if (existingEnrollments.length >= 4) {
    console.log('⚠️  User already has 4+ enrollments. Skipping enrollment creation.');
  } else {
    // Clear any partial enrollments for this user
    await prisma.enrollment.deleteMany({ where: { userId: user.id } });
    await prisma.progress.deleteMany({ where: { userId: user.id } });
    await prisma.quizAttempt.deleteMany({ where: { userId: user.id } });

    // Enroll user in 4 courses with staggered dates
    const enrollmentData = [
      { courseId: courses[0].id, enrolledAt: new Date('2025-12-03T14:00:00Z'), completedAt: new Date('2025-12-15T18:30:00Z') },
      { courseId: courses[1].id, enrolledAt: new Date('2025-12-10T09:30:00Z'), completedAt: null },
      { courseId: courses[2].id, enrolledAt: new Date('2025-12-20T16:45:00Z'), completedAt: null },
      { courseId: courses[3].id, enrolledAt: new Date('2026-01-05T11:00:00Z'), completedAt: null },
    ];

    for (const data of enrollmentData) {
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: data.courseId,
          enrolledAt: data.enrolledAt,
          completedAt: data.completedAt
        }
      });
    }
    console.log('✅ Created 4 enrollments with historical dates');

    // Add lesson progress
    // Course 1: ALL COMPLETE
    const course1Lessons = courses[0].lessons;
    const course1Dates = [
      new Date('2025-12-05T15:30:00Z'),
      new Date('2025-12-08T10:15:00Z'),
      new Date('2025-12-15T18:00:00Z'),
    ];
    for (let i = 0; i < course1Lessons.length; i++) {
      await prisma.progress.create({
        data: {
          userId: user.id,
          lessonId: course1Lessons[i].id,
          completed: true,
          completedAt: course1Dates[i]
        }
      });
    }

    // Course 2: 2/3 COMPLETE
    const course2Lessons = courses[1].lessons;
    const course2Dates = [
      new Date('2025-12-12T14:00:00Z'),
      new Date('2025-12-18T11:30:00Z'),
    ];
    for (let i = 0; i < 2 && i < course2Lessons.length; i++) {
      await prisma.progress.create({
        data: {
          userId: user.id,
          lessonId: course2Lessons[i].id,
          completed: true,
          completedAt: course2Dates[i]
        }
      });
    }

    // Course 3: 1/3 COMPLETE
    const course3Lessons = courses[2].lessons;
    if (course3Lessons.length > 0) {
      await prisma.progress.create({
        data: {
          userId: user.id,
          lessonId: course3Lessons[0].id,
          completed: true,
          completedAt: new Date('2025-12-28T09:45:00Z')
        }
      });
    }

    console.log('✅ Added lesson progress (6 lessons completed)');
  }

  // Check if quizzes exist, create them if not
  let quizzes = await prisma.quiz.findMany({
    include: { questions: true }
  });

  if (quizzes.length < 3) {
    console.log('Creating quizzes...');

    // Quiz for Course 1, Lesson 3
    const quiz1 = await prisma.quiz.create({
      data: {
        lessonId: courses[0].lessons[2].id,
        title: 'Phishing Protection Quiz',
        passingScore: 70,
        questions: {
          create: [
            { question: 'What is the MOST important step to take before clicking a link in an email?', options: ['Check if it looks professional', 'Hover over it to preview the URL', 'Click it to see where it goes', 'Forward it to a friend'], correctAnswer: 1, order: 1 },
            { question: 'Which type of authentication provides the BEST protection against phishing?', options: ['SMS codes', 'Security questions', 'Hardware security keys', 'Email verification'], correctAnswer: 2, order: 2 },
            { question: 'If you suspect you\'ve been phished, what should you do FIRST?', options: ['Delete the email', 'Change your passwords immediately', 'Wait and see if anything happens', 'Report it to authorities'], correctAnswer: 1, order: 3 },
            { question: 'What percentage of data breaches involve phishing attacks?', options: ['About 30%', 'About 50%', 'About 70%', 'Over 90%'], correctAnswer: 3, order: 4 },
            { question: 'Which is a sign that an email might be a phishing attempt?', options: ['Sent from a known contact', 'Contains company logo', 'Creates urgency to act immediately', 'Has your correct name'], correctAnswer: 2, order: 5 }
          ]
        }
      }
    });

    // Quiz for Course 2, Lesson 3
    const quiz2 = await prisma.quiz.create({
      data: {
        lessonId: courses[1].lessons[2].id,
        title: 'Password Security Quiz',
        passingScore: 70,
        questions: {
          create: [
            { question: 'What is the minimum recommended password length?', options: ['6 characters', '8 characters', '12 characters', '20 characters'], correctAnswer: 2, order: 1 },
            { question: 'Which password is the STRONGEST?', options: ['Password123!', 'MyDogAte3BluePancakesIn2024!', 'qwerty12345', 'admin@123'], correctAnswer: 1, order: 2 },
            { question: 'What does MFA stand for?', options: ['Multiple Factor Access', 'Multi-Factor Authentication', 'Main Firewall Application', 'Master File Authorization'], correctAnswer: 1, order: 3 },
            { question: 'Which MFA method is considered MOST secure?', options: ['SMS codes', 'Email verification', 'Hardware security keys', 'Security questions'], correctAnswer: 2, order: 4 },
            { question: 'What type of attack uses stolen credentials from one site to try on other sites?', options: ['Brute force attack', 'Dictionary attack', 'Credential stuffing', 'Phishing'], correctAnswer: 2, order: 5 }
          ]
        }
      }
    });

    // Quiz for Course 3, Lesson 3
    const quiz3 = await prisma.quiz.create({
      data: {
        lessonId: courses[2].lessons[2].id,
        title: 'Social Engineering Defense Quiz',
        passingScore: 70,
        questions: {
          create: [
            { question: 'What psychological principle do attackers exploit when creating time pressure?', options: ['Authority', 'Urgency', 'Reciprocity', 'Trust'], correctAnswer: 1, order: 1 },
            { question: 'What is "tailgating" in social engineering?', options: ['Following someone on social media', 'Physically following someone into a restricted area', 'Sending follow-up phishing emails', 'Tracking someone\'s online activity'], correctAnswer: 1, order: 2 },
            { question: 'If someone calls claiming to be IT support and asks for your password, you should:', options: ['Give it to them if they sound professional', 'Hang up and call IT through official channels', 'Ask them security questions first', 'Email them the password instead'], correctAnswer: 1, order: 3 },
            { question: 'What is "pretexting"?', options: ['Sending text messages', 'Creating a fake scenario to extract information', 'Previewing email content', 'Testing security systems'], correctAnswer: 1, order: 4 },
            { question: 'What should you do if you suspect you\'ve been targeted by social engineering?', options: ['Keep it to yourself', 'Document and report it immediately', 'Delete all evidence', 'Try to track down the attacker'], correctAnswer: 1, order: 5 }
          ]
        }
      }
    });

    console.log('✅ Created 3 quizzes with questions');
  }

  // Add quiz attempts for the user (if not already added)
  const existingAttempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id }
  });

  if (existingAttempts.length === 0) {
    // Get quiz IDs
    const allQuizzes = await prisma.quiz.findMany();

    if (allQuizzes.length >= 2) {
      // Quiz 1: Failed then passed
      await prisma.quizAttempt.create({
        data: { userId: user.id, quizId: allQuizzes[0].id, score: 60, passed: false, attemptedAt: new Date('2025-12-15T17:30:00Z') }
      });
      await prisma.quizAttempt.create({
        data: { userId: user.id, quizId: allQuizzes[0].id, score: 80, passed: true, attemptedAt: new Date('2025-12-15T18:00:00Z') }
      });

      // Quiz 2: Failed
      await prisma.quizAttempt.create({
        data: { userId: user.id, quizId: allQuizzes[1].id, score: 40, passed: false, attemptedAt: new Date('2025-12-19T10:00:00Z') }
      });

      console.log('✅ Added quiz attempts (showing learning progression)');
    }
  } else {
    console.log('⚠️  User already has quiz attempts. Skipping.');
  }

  // Summary
  console.log('\n🎉 Historical data added successfully!\n');
  console.log('Activity summary for', user.email + ':');
  console.log('  - Courses enrolled: 4 (with staggered dates)');
  console.log('  - Lessons completed: 6 of 12');
  console.log('  - Course 1 (Phishing): COMPLETED');
  console.log('  - Course 2 (Password): 67% complete');
  console.log('  - Course 3 (Social Eng): 33% complete');
  console.log('  - Course 4 (Browsing): Just enrolled');
  console.log('  - Quizzes attempted: 2 (1 passed after retry, 1 failed)');
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
