import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Adds YouTube video URLs to existing lessons without deleting any data.
 * Run with: npx ts-node prisma/add-videos.ts
 */

const videoUrls: { [lessonTitle: string]: string } = {
  // Course 1: Phishing Detection
  'Introduction to Phishing': 'https://www.youtube.com/watch?v=XBkzBrXlle0',
  'Recognizing Phishing Emails': 'https://www.youtube.com/watch?v=Y7zNlEMDmI4',

  // Course 2: Password Security
  'Why Password Security Matters': 'https://www.youtube.com/watch?v=3NjQ9b3pgIg',

  // Course 3: Social Engineering
  'Understanding Social Engineering': 'https://www.youtube.com/watch?v=lc7scxvKQOo',

  // Course 4: Secure Browsing
  'Browser Security Basics': 'https://www.youtube.com/watch?v=_p-LNLv49Ug',

  // Course 5: Data Protection
  'Understanding Data Classification': 'https://www.youtube.com/watch?v=wt1HwxaCx3U',
};

async function addVideos() {
  console.log('🎬 Adding YouTube videos to lessons...\n');

  for (const [title, videoUrl] of Object.entries(videoUrls)) {
    try {
      const lesson = await prisma.lesson.findFirst({
        where: { title }
      });

      if (lesson) {
        await prisma.lesson.update({
          where: { id: lesson.id },
          data: { videoUrl }
        });
        console.log(`✅ ${title}`);
        console.log(`   → ${videoUrl}\n`);
      } else {
        console.log(`⚠️  Lesson not found: ${title}\n`);
      }
    } catch (error) {
      console.error(`❌ Failed to update ${title}:`, error);
    }
  }

  console.log('🎉 Done! Video URLs have been added to lessons.');
  console.log('\nVideo lessons added:');
  console.log('  - Introduction to Phishing');
  console.log('  - Recognizing Phishing Emails');
  console.log('  - Why Password Security Matters');
  console.log('  - Understanding Social Engineering');
  console.log('  - Browser Security Basics');
  console.log('  - Understanding Data Classification');
}

addVideos()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
