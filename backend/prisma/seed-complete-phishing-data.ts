import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎓 Starting complete phishing data seed...');
  console.log('This will create: enrollments, lesson progress, quiz attempts, and phishing attempts\n');

  // Find the Phishing Detection Fundamentals course
  const phishingCourse = await prisma.course.findFirst({
    where: {
      title: { contains: 'Phishing', mode: 'insensitive' }
    },
    include: {
      lessons: {
        include: { quiz: true },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!phishingCourse) {
    console.error('❌ Phishing Detection Fundamentals course not found!');
    process.exit(1);
  }

  console.log(`✅ Found course: "${phishingCourse.title}" with ${phishingCourse.lessons.length} lessons\n`);

  // Get all students
  const allStudents = await prisma.user.findMany({
    where: { role: 'STUDENT' }
  });

  console.log(`✅ Found ${allStudents.length} students\n`);

  // Define student performance profiles (same as before)
  const studentProfiles = [
    // Excellent performers (95% success rate in phishing)
    { email: 'student@example.com', name: 'John Doe', phishingSuccess: 0.95, quizScore: 95 },
    { email: 'rajesh.singh@gmail.com', name: 'Rajesh Singh', phishingSuccess: 0.90, quizScore: 92 },

    // Good performers (70-75% success rate)
    { email: 'priya.persaud@yahoo.com', name: 'Priya Persaud', phishingSuccess: 0.75, quizScore: 85 },
    { email: 'kumar.ramnauth@outlook.com', name: 'Kumar Ramnauth', phishingSuccess: 0.70, quizScore: 80 },

    // Average performers (55% success rate)
    { email: 'anita.khan@gmail.com', name: 'Anita Khan', phishingSuccess: 0.55, quizScore: 75 },

    // Below average performers (35-45% success rate)
    { email: 'rohan.narine@yahoo.com', name: 'Rohan Narine', phishingSuccess: 0.45, quizScore: 72 },
    { email: 'simran.samaroo@outlook.com', name: 'Simran Samaroo', phishingSuccess: 0.35, quizScore: 70 },

    // Poor performers (25% success rate)
    { email: 'nadira.mohamed@gmail.com', name: 'Nadira Mohamed', phishingSuccess: 0.25, quizScore: 68 },
  ];

  // Map emails to actual student objects
  const students = studentProfiles
    .map(profile => ({
      ...profile,
      student: allStudents.find(s => s.email === profile.email)
    }))
    .filter(p => p.student !== undefined);

  console.log(`📊 Processing ${students.length} students with complete learning journey...\n`);

  // Helper function to generate random date in range
  function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  // Helper function to add days to a date
  function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // Get all active phishing scenarios
  const phishingScenarios = await prisma.phishingScenario.findMany({
    where: { isActive: true }
  });

  console.log(`✅ Found ${phishingScenarios.length} active phishing scenarios\n`);

  let totalEnrollments = 0;
  let totalLessonProgress = 0;
  let totalQuizAttempts = 0;
  let totalPhishingAttempts = 0;

  for (const profile of students) {
    if (!profile.student) continue;

    console.log(`\n${'='.repeat(70)}`);
    console.log(`Processing: ${profile.name} (${profile.email})`);
    console.log(`Phishing Success Rate: ${(profile.phishingSuccess * 100).toFixed(0)}%`);
    console.log(`${'='.repeat(70)}\n`);

    // Step 1: Create enrollment (November - December 2025)
    const enrollmentDate = randomDate(
      new Date('2025-11-01T08:00:00Z'),
      new Date('2025-12-15T17:00:00Z')
    );

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: profile.student.id,
        courseId: phishingCourse.id,
        enrolledAt: enrollmentDate,
        completedAt: null // Will set later
      }
    });
    totalEnrollments++;
    console.log(`✓ Enrolled in course on ${enrollmentDate.toISOString().split('T')[0]}`);

    // Step 2: Complete lessons progressively (over 1-2 weeks)
    let currentDate = addDays(enrollmentDate, 1);

    for (let i = 0; i < phishingCourse.lessons.length; i++) {
      const lesson = phishingCourse.lessons[i];

      // Add 1-3 days between lessons
      currentDate = addDays(currentDate, Math.floor(Math.random() * 3) + 1);

      await prisma.progress.create({
        data: {
          userId: profile.student.id,
          lessonId: lesson.id,
          completed: true,
          completedAt: currentDate
        }
      });
      totalLessonProgress++;
    }
    console.log(`✓ Completed ${phishingCourse.lessons.length} lessons over ${Math.floor((currentDate.getTime() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24))} days`);

    // Step 3: Attempt and pass quiz (1-2 days after last lesson)
    currentDate = addDays(currentDate, Math.floor(Math.random() * 2) + 1);

    // Find the quiz for the course (usually last lesson)
    const lessonWithQuiz = phishingCourse.lessons.find(l => l.quiz);

    if (lessonWithQuiz && lessonWithQuiz.quiz) {
      // First attempt - might fail for lower performers
      const firstAttemptScore = profile.quizScore - Math.floor(Math.random() * 10);
      const firstAttemptPassed = firstAttemptScore >= 70;

      await prisma.quizAttempt.create({
        data: {
          userId: profile.student.id,
          quizId: lessonWithQuiz.quiz.id,
          score: firstAttemptScore,
          passed: firstAttemptPassed,
          attemptedAt: currentDate
        }
      });
      totalQuizAttempts++;

      console.log(`✓ Quiz attempt 1: ${firstAttemptScore}% (${firstAttemptPassed ? 'PASSED ✓' : 'FAILED ✗'})`);

      // If failed, retry 1-2 days later
      if (!firstAttemptPassed) {
        currentDate = addDays(currentDate, Math.floor(Math.random() * 2) + 1);

        await prisma.quizAttempt.create({
          data: {
            userId: profile.student.id,
            quizId: lessonWithQuiz.quiz.id,
            score: profile.quizScore,
            passed: true,
            attemptedAt: currentDate
          }
        });
        totalQuizAttempts++;
        console.log(`✓ Quiz attempt 2: ${profile.quizScore}% (PASSED ✓)`);
      }
    }

    // Step 4: Mark course as completed
    const courseCompletedDate = addDays(currentDate, 1);
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { completedAt: courseCompletedDate }
    });
    console.log(`✓ Course completed on ${courseCompletedDate.toISOString().split('T')[0]}`);

    // Step 5: Create phishing simulation attempts (1-4 months after course completion)
    const phishingStartDate = addDays(courseCompletedDate, Math.floor(Math.random() * 30) + 7); // 1-5 weeks later
    const phishingEndDate = new Date('2026-05-31T23:59:59Z');

    // Each student attempts 5-8 scenarios
    const numScenarios = Math.floor(Math.random() * 4) + 5;
    const selectedScenarios = phishingScenarios
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(numScenarios, phishingScenarios.length));

    console.log(`\n  Phishing Simulation Attempts:`);
    let correctCount = 0;

    for (let i = 0; i < selectedScenarios.length; i++) {
      const scenario = selectedScenarios[i];

      // Space out attempts over time
      const attemptDate = randomDate(phishingStartDate, phishingEndDate);

      // Determine if correct based on success rate
      const willBeCorrect = Math.random() < profile.phishingSuccess;

      let userAction: 'REPORTED' | 'MARKED_SAFE' | 'CLICKED_LINK' | 'DELETED' | 'IGNORED';
      let isCorrect: boolean;

      if (scenario.isPhishing) {
        if (willBeCorrect) {
          userAction = Math.random() < 0.7 ? 'REPORTED' : 'DELETED';
          isCorrect = true;
        } else {
          const rand = Math.random();
          if (rand < 0.5) userAction = 'CLICKED_LINK';
          else if (rand < 0.8) userAction = 'MARKED_SAFE';
          else userAction = 'IGNORED';
          isCorrect = false;
        }
      } else {
        if (willBeCorrect) {
          userAction = Math.random() < 0.6 ? 'MARKED_SAFE' : 'IGNORED';
          isCorrect = true;
        } else {
          const rand = Math.random();
          if (rand < 0.6) userAction = 'REPORTED';
          else if (rand < 0.9) userAction = 'DELETED';
          else userAction = 'CLICKED_LINK';
          isCorrect = false;
        }
      }

      // Better performers respond faster
      const baseResponseTime = Math.floor(Math.random() * (60000 - 3000) + 3000);
      const responseTime = Math.floor(baseResponseTime * (1 - profile.phishingSuccess * 0.3));

      await prisma.phishingAttempt.create({
        data: {
          userId: profile.student.id,
          scenarioId: scenario.id,
          userAction,
          isCorrect,
          responseTimeMs: responseTime,
          attemptedAt: attemptDate
        }
      });

      if (isCorrect) correctCount++;
      totalPhishingAttempts++;

      const icon = isCorrect ? '✓' : '✗';
      const truncatedTitle = scenario.title.substring(0, 40);
      console.log(`  ${icon} ${truncatedTitle} - ${userAction} (${(responseTime/1000).toFixed(1)}s)`);
    }

    const accuracy = ((correctCount / selectedScenarios.length) * 100).toFixed(1);
    console.log(`\n  Summary: ${correctCount}/${selectedScenarios.length} correct (${accuracy}%)`);
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('🎉 Complete phishing data seed finished!\n');
  console.log('📊 Summary:');
  console.log(`   Students processed: ${students.length}`);
  console.log(`   Course enrollments: ${totalEnrollments}`);
  console.log(`   Lesson completions: ${totalLessonProgress}`);
  console.log(`   Quiz attempts: ${totalQuizAttempts}`);
  console.log(`   Phishing attempts: ${totalPhishingAttempts}`);
  console.log(`\n✅ All data is chronologically consistent!`);
  console.log(`📅 Date range: November 2025 - May 2026\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding complete phishing data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
