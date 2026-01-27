// Quick diagnostic script to check database schema
// Run with: node check-db.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Checking database schema...\n');

  try {
    // Try to fetch platform settings
    const settings = await prisma.platformSettings.findUnique({
      where: { id: 'singleton' }
    });

    if (!settings) {
      console.log('⚠️  No platform settings found in database');
      console.log('Creating default settings...\n');

      await prisma.platformSettings.create({
        data: { id: 'singleton' }
      });

      console.log('✅ Default settings created\n');
      process.exit(0);
    }

    console.log('✅ Platform settings found');
    console.log('📊 Checking for new appearance fields...\n');

    // Check if new fields exist
    const requiredFields = [
      'secondaryColor',
      'accentColor',
      'fontFamily',
      'fontSize',
      'borderRadius',
      'darkModeDefault'
    ];

    let allFieldsPresent = true;
    requiredFields.forEach(field => {
      if (settings.hasOwnProperty(field)) {
        console.log(`  ✅ ${field}: ${JSON.stringify(settings[field])}`);
      } else {
        console.log(`  ❌ ${field}: MISSING`);
        allFieldsPresent = false;
      }
    });

    console.log('');

    if (allFieldsPresent) {
      console.log('🎉 All appearance fields are present!');
      console.log('Your database is up to date.\n');
    } else {
      console.log('⚠️  Some fields are missing!');
      console.log('Run these commands to fix:\n');
      console.log('  1. npx prisma generate');
      console.log('  2. npx prisma db push\n');
      console.log('If that fails, check MIGRATION_GUIDE.md for manual SQL commands.\n');
    }

  } catch (error) {
    console.error('❌ Database check failed:');
    console.error(error.message);
    console.log('\n💡 Possible solutions:');
    console.log('  1. Make sure PostgreSQL is running');
    console.log('  2. Check DATABASE_URL in .env file');
    console.log('  3. Run: npx prisma generate');
    console.log('  4. Run: npx prisma db push\n');
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
