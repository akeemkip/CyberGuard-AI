import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Finding lessons with short content...\n');

  const allLessons = await prisma.lesson.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      courseId: true,
      course: {
        select: {
          title: true
        }
      }
    },
    orderBy: {
      title: 'asc'
    }
  });

  const shortLessons = allLessons.filter(l => !l.content || l.content.length < 200);

  console.log(`Found ${shortLessons.length} lessons with short content:\n`);

  shortLessons.forEach((lesson, i) => {
    const contentLen = lesson.content ? lesson.content.length : 0;
    console.log(`${i + 1}. "${lesson.title}"`);
    console.log(`   Course: ${lesson.course.title}`);
    console.log(`   Content length: ${contentLen} chars`);
    console.log('');
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Total lessons needing content: ${shortLessons.length}`);
  console.log(`   Already updated with comprehensive content: ${allLessons.length - shortLessons.length}`);
}

main()
  .then(() => process.exit())
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  });
