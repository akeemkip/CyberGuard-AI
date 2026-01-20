import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📝 Updating quiz assignments to lesson 8...');

  const courses = await prisma.course.findMany({
    include: { modules: { include: { lessons: { orderBy: { order: 'asc' } } } } },
    orderBy: { createdAt: 'asc' }
  });

  // Get all quizzes
  const quizzes = await prisma.quiz.findMany({ include: { lesson: true } });

  // Update each quiz to point to lesson 8 of its course
  for (const quiz of quizzes) {
    const course = courses.find(c => c.id === quiz.lesson.courseId);
    if (course) {
      const allLessons = course.modules.flatMap(m => m.lessons).sort((a, b) => a.order - b.order);
      if (allLessons.length >= 8) {
        const lesson8 = allLessons[7]; // index 7 is the 8th lesson
        await prisma.quiz.update({
          where: { id: quiz.id },
          data: { lessonId: lesson8.id }
        });
        console.log(`✅ Updated quiz for ${course.title} to lesson: ${lesson8.title}`);
      }
    }
  }

  console.log('\n🎉 All quizzes now attached to lesson 8!');
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
