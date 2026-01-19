import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📋 Checking Data Protection course lessons...\n');

  const course = await prisma.course.findFirst({
    where: {
      title: {
        contains: 'Data Protection'
      }
    },
    include: {
      lessons: {
        orderBy: {
          order: 'asc'
        },
        select: {
          id: true,
          title: true,
          order: true,
          content: true
        }
      }
    }
  });

  if (!course) {
    console.log('❌ Data Protection course not found');
    return;
  }

  console.log(`Found course: ${course.title}`);
  console.log(`Total lessons: ${course.lessons.length}\n`);

  course.lessons.forEach((lesson, i) => {
    const contentLength = lesson.content?.length || 0;
    const status = contentLength < 200 ? '⚠️  SHORT' : '✅ FULL';
    console.log(`${i + 1}. ${lesson.title}`);
    console.log(`   Order: ${lesson.order}`);
    console.log(`   Content length: ${contentLength} chars ${status}`);
    console.log('');
  });
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
