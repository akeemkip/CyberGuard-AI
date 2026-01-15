import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      password: true
    }
  });

  console.log('Current users in database:');
  users.forEach(user => {
    console.log(`\n${user.email}:`);
    console.log(`  Name: ${user.firstName} ${user.lastName}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Password Hash: ${user.password.substring(0, 20)}...`);
  });

  const alexander = users.find(u => u.email === 'alexandercharles005@gmail.com');
  if (alexander) {
    console.log('\n\nAlexander Charles account found!');
    console.log('Full password hash:', alexander.password);
  } else {
    console.log('\n\nAlexander Charles account NOT FOUND in database');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
