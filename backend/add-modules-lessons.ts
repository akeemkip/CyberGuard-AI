import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📦 Adding modules and expanding lessons...');

  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'asc' } });
  if (courses.length !== 6) {
    throw new Error('Expected 6 courses');
  }

  // Define module and lesson structure for each course
  const expansions = [
    { // Course 0: Phishing
      modules: [
        { title: 'Understanding Phishing', desc: 'Learn phishing fundamentals', lessons: ['Introduction to Phishing', 'The Psychology of Phishing'] },
        { title: 'Recognizing Phishing', desc: 'Identify phishing attempts', lessons: ['Recognizing Phishing Emails', 'Identifying Phishing URLs', 'Spear Phishing Attacks'] },
        { title: 'Defense', desc: 'Protect and respond', lessons: ['Protecting Yourself from Phishing', 'Reporting Phishing', 'Building Phishing Resistance'] }
      ],
      newLessons: [
        { title: 'The Psychology of Phishing', content: 'Attackers exploit urgency, authority and fear.' },
        { title: 'Identifying Phishing URLs', content: 'Check for HTTPS and verify domains carefully.' },
        { title: 'Spear Phishing Attacks', content: 'Targeted attacks use personalized information.' },
        { title: 'Reporting Phishing', content: 'Report to IT and change passwords if compromised.' },
        { title: 'Building Phishing Resistance', content: 'Organizations need training and simulated tests.' }
      ]
    },
    { // Course 1: Password
      modules: [
        { title: 'Fundamentals', desc: 'Why passwords matter', lessons: ['Why Password Security Matters', 'How Passwords Get Compromised'] },
        { title: 'Strong Credentials', desc: 'Build secure passwords', lessons: ['Creating Strong Passwords', 'Passphrases', 'Password Hashing'] },
        { title: 'Advanced Protection', desc: 'Tools and techniques', lessons: ['Password Managers & MFA', 'Setting Up MFA', 'Enterprise Password Security'] }
      ],
      newLessons: [
        { title: 'How Passwords Get Compromised', content: 'Stolen through breaches, phishing and social engineering.' },
        { title: 'Passphrases', content: 'Combine random words for security through length.' },
        { title: 'Password Hashing', content: 'Hashing and salting protect credentials when databases are breached.' },
        { title: 'Setting Up MFA', content: 'Learn about SMS codes, authenticator apps and hardware keys.' },
        { title: 'Enterprise Password Security', content: 'Organizations need policies and privileged access management.' }
      ]
    },
    { // Course 2: Social Engineering
      modules: [
        { title: 'Foundations', desc: 'What is social engineering', lessons: ['Understanding Social Engineering', 'The Human Element'] },
        { title: 'Attack Methods', desc: 'Common techniques', lessons: ['Common Social Engineering Attacks', 'Pretexting', 'Physical Social Engineering'] },
        { title: 'Defense', desc: 'Protection strategies', lessons: ['Defending Against Social Engineering', 'Verification Habits', 'Security-Aware Culture'] }
      ],
      newLessons: [
        { title: 'The Human Element', content: 'Humans are often the weakest link. Learn about cognitive biases.' },
        { title: 'Pretexting', content: 'Attackers create fake scenarios or impersonate authority figures.' },
        { title: 'Physical Social Engineering', content: 'Tailgating and shoulder surfing bypass technical security.' },
        { title: 'Verification Habits', content: 'Always verify before acting. Use out-of-band communication.' },
        { title: 'Security-Aware Culture', content: 'Organizations need training and clear reporting channels.' }
      ]
    },
    { // Course 3: Web Browsing
      modules: [
        { title: 'Browser Security', desc: 'Security fundamentals', lessons: ['Browser Security Basics', 'HTTPS and Certificates'] },
        { title: 'Threat Recognition', desc: 'Identify web threats', lessons: ['Recognizing Malicious Websites', 'Browser Extensions', 'Tracking and Privacy'] },
        { title: 'Safe Practices', desc: 'Browse safely', lessons: ['Safe Downloading Practices', 'Browser Settings', 'VPNs and Private Browsing'] }
      ],
      newLessons: [
        { title: 'HTTPS and Certificates', content: 'HTTPS encrypts your connection. Learn to check for valid certificates.' },
        { title: 'Browser Extensions', content: 'Extensions can pose risks. Check permissions carefully.' },
        { title: 'Tracking and Privacy', content: 'Websites track behavior through cookies and scripts.' },
        { title: 'Browser Settings', content: 'Configure optimal security and privacy settings.' },
        { title: 'VPNs and Private Browsing', content: 'Learn what VPNs do, their limitations and when to use them.' }
      ]
    },
    { // Course 4: Data Protection
      modules: [
        { title: 'Foundations', desc: 'Data types and privacy', lessons: ['Understanding Data Classification', 'PII Explained'] },
        { title: 'Protection', desc: 'Safeguard your data', lessons: ['Data Protection Best Practices', 'Secure File Sharing', 'Social Media Privacy'] },
        { title: 'Incident Response', desc: 'Respond to breaches', lessons: ['Responding to Data Breaches', 'Identity Theft', 'Data Regulations'] }
      ],
      newLessons: [
        { title: 'PII Explained', content: 'Personal Identifiable Information can identify individuals.' },
        { title: 'Secure File Sharing', content: 'Choose secure cloud storage and set proper permissions.' },
        { title: 'Social Media Privacy', content: 'Configure privacy settings and minimize digital footprint.' },
        { title: 'Identity Theft', content: 'Learn prevention strategies and how to freeze credit.' },
        { title: 'Data Regulations', content: 'GDPR and CCPA protect consumer data. Know your rights.' }
      ]
    },
    { // Course 5: Threat Analysis
      modules: [
        { title: 'Threat Intelligence', desc: 'Intelligence frameworks', lessons: ['Threat Intelligence & Attack Frameworks', 'MITRE ATT&CK', 'Cyber Kill Chain'] },
        { title: 'Detection', desc: 'Find and analyze', lessons: ['Incident Response Methodology', 'Indicators of Compromise'] },
        { title: 'Response', desc: 'Effective response', lessons: ['Forensic Analysis & Threat Hunting', 'Containment', 'Post-Incident Review'] }
      ],
      newLessons: [
        { title: 'MITRE ATT&CK', content: 'Industry standard with 14 tactics for understanding adversary behavior.' },
        { title: 'Cyber Kill Chain', content: 'Seven phases from reconnaissance to actions. Disrupt at each stage.' },
        { title: 'Indicators of Compromise', content: 'IOCs are forensic artifacts. Learn types and threat hunting.' },
        { title: 'Containment', content: 'Stop attack spread while preserving evidence.' },
        { title: 'Post-Incident Review', content: 'Learn from incidents using Five Whys analysis.' }
      ]
    }
  ];

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    const exp = expansions[i];

    // Get existing lessons
    const existingLessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' }
    });

    // Create modules
    const modules = [];
    for (let mi = 0; mi < exp.modules.length; mi++) {
      const mod = await prisma.module.create({
        data: {
          title: exp.modules[mi].title,
          description: exp.modules[mi].desc,
          order: mi + 1,
          courseId: course.id
        }
      });
      modules.push(mod);
    }

    // Assign existing lessons to modules and renumber
    let lessonOrder = 1;
    for (let mi = 0; mi < modules.length; mi++) {
      const expectedLessons = exp.modules[mi].lessons;
      for (const expTitle of expectedLessons) {
        const existing = existingLessons.find(l => l.title.includes(expTitle.split(' ').slice(0, 3).join(' ')));
        if (existing) {
          await prisma.lesson.update({
            where: { id: existing.id },
            data: {
              moduleId: modules[mi].id,
              order: lessonOrder++
            }
          });
        }
      }
    }

    // Add new lessons
    for (const newLesson of exp.newLessons) {
      // Find which module this lesson belongs to
      let moduleIndex = 0;
      for (let mi = 0; mi < exp.modules.length; mi++) {
        if (exp.modules[mi].lessons.some(l => l.includes(newLesson.title.split(' ').slice(0, 2).join(' ')))) {
          moduleIndex = mi;
          break;
        }
      }

      await prisma.lesson.create({
        data: {
          title: newLesson.title,
          content: newLesson.content,
          order: lessonOrder++,
          courseId: course.id,
          moduleId: modules[moduleIndex].id
        }
      });
    }

    console.log(`✅ Expanded course ${i + 1}: ${course.title} to ${lessonOrder - 1} lessons`);
  }

  // Update course durations
  await prisma.course.update({ where: { id: courses[0].id }, data: { duration: '4 hours' } });
  await prisma.course.update({ where: { id: courses[1].id }, data: { duration: '4 hours' } });
  await prisma.course.update({ where: { id: courses[2].id }, data: { duration: '3.5 hours' } });
  await prisma.course.update({ where: { id: courses[3].id }, data: { duration: '3 hours' } });
  await prisma.course.update({ where: { id: courses[4].id }, data: { duration: '3.5 hours' } });
  await prisma.course.update({ where: { id: courses[5].id }, data: { duration: '5 hours' } });

  console.log('✅ Updated course durations');
  console.log('\n🎉 Successfully added modules and expanded lessons!');
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
