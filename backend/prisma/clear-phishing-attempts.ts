import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing phishing attempts...');

  // Count current attempts
  const count = await prisma.phishingAttempt.count();
  console.log(`Found ${count} phishing attempts to delete`);

  // Delete all attempts (keeps scenarios)
  const deleted = await prisma.phishingAttempt.deleteMany();
  console.log(`✅ Deleted ${deleted.count} phishing attempts`);

  console.log('\n📊 Current state:');
  const scenarios = await prisma.phishingScenario.count();
  const attempts = await prisma.phishingAttempt.count();
  console.log(`- Scenarios: ${scenarios} (kept)`);
  console.log(`- Attempts: ${attempts} (cleared)`);

  console.log('\n✨ Students can now attempt all scenarios fresh!');
}

main()
  .catch((e) => {
    console.error('Error clearing phishing attempts:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
