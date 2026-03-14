import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📜 Starting certificate backfill...');
  console.log('Creating certificates for all completed courses\n');

  // Get all completed enrollments
  const completedEnrollments = await prisma.enrollment.findMany({
    where: {
      completedAt: { not: null }
    },
    include: {
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true
        }
      },
      course: {
        select: {
          title: true
        }
      }
    }
  });

  console.log(`Found ${completedEnrollments.length} completed enrollments\n`);

  let created = 0;
  let skipped = 0;

  for (const enrollment of completedEnrollments) {
    try {
      // Check if certificate already exists
      const existing = await prisma.certificate.findUnique({
        where: {
          userId_courseId: {
            userId: enrollment.userId,
            courseId: enrollment.courseId
          }
        }
      });

      if (existing) {
        console.log(`⏭️  Skipped: ${enrollment.user.firstName} ${enrollment.user.lastName} - ${enrollment.course.title} (already exists)`);
        skipped++;
      } else if (enrollment.completedAt) {
        // Create certificate
        await prisma.certificate.create({
          data: {
            userId: enrollment.userId,
            courseId: enrollment.courseId,
            issuedAt: enrollment.completedAt
          }
        });

        console.log(`✅ Created: ${enrollment.user.firstName} ${enrollment.user.lastName} - ${enrollment.course.title}`);
        created++;
      }
    } catch (error) {
      console.error(`❌ Error creating certificate for ${enrollment.user.email}:`, error);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('🎉 Certificate backfill complete!\n');
  console.log('Summary:');
  console.log(`   Certificates created: ${created}`);
  console.log(`   Already existed (skipped): ${skipped}`);
  console.log(`   Total completed courses: ${completedEnrollments.length}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error backfilling certificates:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
