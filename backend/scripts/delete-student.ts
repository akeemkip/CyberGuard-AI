import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Deleting student@example.com account...');

  const studentUser = await prisma.user.findUnique({
    where: { email: 'student@example.com' }
  });

  if (!studentUser) {
    console.log('❌ student@example.com not found in database');
    return;
  }

  // Delete related data first (due to foreign key constraints)
  await prisma.quizAttempt.deleteMany({ where: { userId: studentUser.id } });
  await prisma.progress.deleteMany({ where: { userId: studentUser.id } });
  await prisma.enrollment.deleteMany({ where: { userId: studentUser.id } });

  // Delete the user
  await prisma.user.delete({
    where: { email: 'student@example.com' }
  });

  console.log('✅ Successfully deleted student@example.com account and all related data');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
