const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  const email = 'akeemkippins.gy@gmail.com';

  console.log(`\n🔍 Checking for user: ${email}\n`);

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true
    }
  });

  if (user) {
    console.log('✅ USER EXISTS');
    console.log('User Details:');
    console.log('  ID:', user.id);
    console.log('  Name:', user.firstName, user.lastName);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  Created:', user.createdAt);
  } else {
    console.log('❌ USER NOT FOUND');
    console.log('\nThis account does not exist in the database.');
    console.log('You need to:');
    console.log('1. Register a new account with this email');
    console.log('2. Or use one of the demo accounts');
  }

  await prisma.$disconnect();
}

checkUser();
