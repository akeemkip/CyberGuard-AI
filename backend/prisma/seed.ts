import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.settingsAuditLog.deleteMany();
  await prisma.phishingAttempt.deleteMany();
  await prisma.phishingScenario.deleteMany();
  await prisma.introAssessmentAttempt.deleteMany();
  await prisma.introQuestion.deleteMany();
  await prisma.introAssessment.deleteMany();
  await prisma.fullAssessmentAttempt.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.labProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.lab.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Ensure PlatformSettings singleton exists
  await prisma.platformSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' }
  });
  console.log('✅ Ensured platform settings exist');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@cyberguard.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    }
  });
  console.log('✅ Created admin user: admin@cyberguard.com / admin123');

  // Seed Settings Audit Log entries — covers all filter categories
  const a = admin.id;
  const ae = 'admin@cyberguard.com';
  await prisma.settingsAuditLog.createMany({
    data: [
      // === General Settings ===
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'platformName', oldValue: 'CyberGuard AI', newValue: 'CyberGuard AI Training', ipAddress: '127.0.0.1', timestamp: new Date('2025-12-02T10:30:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'platformName', oldValue: 'CyberGuard AI Training', newValue: 'CyberGuard AI', ipAddress: '127.0.0.1', timestamp: new Date('2025-12-02T10:35:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'platformDescription', oldValue: '', newValue: 'AI-powered cybersecurity training platform', ipAddress: '127.0.0.1', timestamp: new Date('2025-12-03T09:00:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'supportEmail', oldValue: null, newValue: 'help@cyberguard.com', ipAddress: '127.0.0.1', timestamp: new Date('2025-12-03T09:05:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'contactEmail', oldValue: null, newValue: 'support@cyberguard.com', ipAddress: '127.0.0.1', timestamp: new Date('2025-12-03T09:10:00Z') },

      // === Security Settings ===
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'minPasswordLength', oldValue: '6', newValue: '8', ipAddress: '127.0.0.1', timestamp: new Date('2025-12-05T14:00:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'maxLoginAttempts', oldValue: '10', newValue: '5', ipAddress: '127.0.0.1', timestamp: new Date('2025-12-05T14:05:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'sessionTimeout', oldValue: '30', newValue: '7', ipAddress: '127.0.0.1', timestamp: new Date('2025-12-10T09:15:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'enableTwoFactor', oldValue: 'false', newValue: 'true', ipAddress: '192.168.1.100', timestamp: new Date('2025-12-12T11:00:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'requireEmailVerification', oldValue: 'false', newValue: 'true', ipAddress: '192.168.1.100', timestamp: new Date('2025-12-12T11:05:00Z') },

      // === User Management Settings ===
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'allowSelfRegistration', oldValue: 'true', newValue: 'false', ipAddress: '127.0.0.1', timestamp: new Date('2026-01-20T16:00:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'allowSelfRegistration', oldValue: 'false', newValue: 'true', ipAddress: '127.0.0.1', timestamp: new Date('2026-01-22T08:30:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'autoEnrollNewUsers', oldValue: 'false', newValue: 'true', ipAddress: '127.0.0.1', timestamp: new Date('2026-01-25T10:00:00Z') },
      { adminId: a, adminEmail: ae, action: 'ROLLBACK', fieldName: 'autoEnrollNewUsers', oldValue: 'true', newValue: 'false', ipAddress: '127.0.0.1', timestamp: new Date('2026-01-25T10:30:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'defaultUserRole', oldValue: 'STUDENT', newValue: 'STUDENT', ipAddress: '127.0.0.1', timestamp: new Date('2026-01-25T10:35:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'requireProfileCompletion', oldValue: 'false', newValue: 'true', ipAddress: '192.168.1.100', timestamp: new Date('2026-01-28T14:00:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'enablePublicProfiles', oldValue: 'false', newValue: 'true', ipAddress: '192.168.1.100', timestamp: new Date('2026-01-28T14:05:00Z') },

      // === Course Settings ===
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'defaultCourseVisibility', oldValue: 'draft', newValue: 'published', ipAddress: '127.0.0.1', timestamp: new Date('2026-01-10T09:00:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'defaultQuizPassingScore', oldValue: '60', newValue: '70', ipAddress: '127.0.0.1', timestamp: new Date('2026-01-10T09:05:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'enableCertificates', oldValue: 'false', newValue: 'true', ipAddress: '127.0.0.1', timestamp: new Date('2026-01-10T09:10:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'allowCourseReviews', oldValue: 'false', newValue: 'true', ipAddress: '127.0.0.1', timestamp: new Date('2026-01-10T09:15:00Z') },

      // === Email/Notification Settings ===
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'enableEmailNotifications', oldValue: 'false', newValue: 'true', ipAddress: '127.0.0.1', timestamp: new Date('2026-02-01T08:00:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'enableEnrollmentEmails', oldValue: 'false', newValue: 'true', ipAddress: '127.0.0.1', timestamp: new Date('2026-02-01T08:05:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'enableCompletionEmails', oldValue: 'false', newValue: 'true', ipAddress: '127.0.0.1', timestamp: new Date('2026-02-01T08:10:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'enableWeeklyDigest', oldValue: 'false', newValue: 'true', ipAddress: '127.0.0.1', timestamp: new Date('2026-02-01T08:15:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'smtpHost', oldValue: null, newValue: 'smtp.gmail.com', ipAddress: '192.168.1.100', timestamp: new Date('2026-02-01T08:20:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'smtpPort', oldValue: null, newValue: '587', ipAddress: '192.168.1.100', timestamp: new Date('2026-02-01T08:25:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'smtpUser', oldValue: null, newValue: 'notifications@cyberguard.com', ipAddress: '192.168.1.100', timestamp: new Date('2026-02-01T08:30:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'smtpPassword', oldValue: '[EMPTY]', newValue: '[SET]', ipAddress: '192.168.1.100', timestamp: new Date('2026-02-01T08:35:00Z') },

      // === Appearance/Branding Settings ===
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'primaryColor', oldValue: '#3b82f6', newValue: '#2563eb', ipAddress: '192.168.1.100', timestamp: new Date('2026-02-10T11:30:00Z') },
      { adminId: a, adminEmail: ae, action: 'ROLLBACK', fieldName: 'primaryColor', oldValue: '#2563eb', newValue: '#3b82f6', ipAddress: '192.168.1.100', timestamp: new Date('2026-02-10T11:45:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'secondaryColor', oldValue: '#64748b', newValue: '#475569', ipAddress: '192.168.1.100', timestamp: new Date('2026-02-10T12:00:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'accentColor', oldValue: '#f59e0b', newValue: '#eab308', ipAddress: '192.168.1.100', timestamp: new Date('2026-02-10T12:05:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'fontFamily', oldValue: 'Inter', newValue: 'Poppins', ipAddress: '127.0.0.1', timestamp: new Date('2026-02-12T15:00:00Z') },
      { adminId: a, adminEmail: ae, action: 'ROLLBACK', fieldName: 'fontFamily', oldValue: 'Poppins', newValue: 'Inter', ipAddress: '127.0.0.1', timestamp: new Date('2026-02-12T15:30:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'fontSize', oldValue: '16', newValue: '14', ipAddress: '127.0.0.1', timestamp: new Date('2026-02-12T15:35:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'borderRadius', oldValue: '8', newValue: '12', ipAddress: '127.0.0.1', timestamp: new Date('2026-02-12T15:40:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'darkModeDefault', oldValue: 'false', newValue: 'true', ipAddress: '192.168.1.100', timestamp: new Date('2026-02-15T09:00:00Z') },
      { adminId: a, adminEmail: ae, action: 'ROLLBACK', fieldName: 'darkModeDefault', oldValue: 'true', newValue: 'false', ipAddress: '192.168.1.100', timestamp: new Date('2026-02-15T09:30:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'customCss', oldValue: null, newValue: '/* Custom theme tweaks */', ipAddress: '127.0.0.1', timestamp: new Date('2026-02-20T14:00:00Z') },

      // === Maintenance ===
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'maintenanceMode', oldValue: 'false', newValue: 'true', ipAddress: '192.168.1.100', timestamp: new Date('2026-02-28T22:00:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'maintenanceMode', oldValue: 'true', newValue: 'false', ipAddress: '192.168.1.100', timestamp: new Date('2026-03-01T06:00:00Z') },

      // === Recent activity (March) ===
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'defaultQuizPassingScore', oldValue: '70', newValue: '75', ipAddress: '127.0.0.1', timestamp: new Date('2026-03-05T10:00:00Z') },
      { adminId: a, adminEmail: ae, action: 'ROLLBACK', fieldName: 'defaultQuizPassingScore', oldValue: '75', newValue: '70', ipAddress: '127.0.0.1', timestamp: new Date('2026-03-05T10:15:00Z') },
      { adminId: a, adminEmail: ae, action: 'UPDATE', fieldName: 'enableWeeklyDigest', oldValue: 'true', newValue: 'false', ipAddress: '192.168.1.100', timestamp: new Date('2026-03-10T14:00:00Z') },
    ]
  });
  console.log('✅ Created settings audit log entries');

  // Create Student Users (including original + new Guyanese students)
  const studentPassword = await bcrypt.hash('student123', 10);

  const students = await Promise.all([
    // [0] Rajesh Singh - Active Learner
    prisma.user.create({
      data: {
        email: 'rajesh.singh@gmail.com',
        password: studentPassword,
        firstName: 'Rajesh',
        lastName: 'Singh',
        role: 'STUDENT',
        createdAt: new Date('2025-12-01T08:15:00Z'),
        lastLoginAt: new Date('2026-03-03T14:30:00Z')
      }
    }),
    // [1] Priya Persaud - High Risk
    prisma.user.create({
      data: {
        email: 'priya.persaud@yahoo.com',
        password: studentPassword,
        firstName: 'Priya',
        lastName: 'Persaud',
        role: 'STUDENT',
        createdAt: new Date('2025-12-10T14:22:00Z'),
        lastLoginAt: new Date('2026-03-10T11:00:00Z')
      }
    }),
    // [2] Kumar Ramnauth - Brand New
    prisma.user.create({
      data: {
        email: 'kumar.ramnauth@outlook.com',
        password: studentPassword,
        firstName: 'Kumar',
        lastName: 'Ramnauth',
        role: 'STUDENT',
        createdAt: new Date('2026-01-15T09:45:00Z'),
        lastLoginAt: new Date('2026-01-16T10:15:00Z')
      }
    }),
    // [3] Arjun Jaipaul - Fresh
    prisma.user.create({
      data: {
        email: 'arjun.jaipaul@yahoo.com',
        password: studentPassword,
        firstName: 'Arjun',
        lastName: 'Jaipaul',
        role: 'STUDENT',
        createdAt: new Date('2025-12-20T11:10:00Z'),
        lastLoginAt: new Date('2026-01-14T16:45:00Z')
      }
    }),
    // [4] Vishnu Bisram - Safe Zone
    prisma.user.create({
      data: {
        email: 'vishnu.bisram@outlook.com',
        password: studentPassword,
        firstName: 'Vishnu',
        lastName: 'Bisram',
        role: 'STUDENT',
        createdAt: new Date('2025-11-25T08:00:00Z'),
        lastLoginAt: new Date('2026-03-07T09:20:00Z')
      }
    })
  ]);

  console.log('✅ Created 5 student users (all use password: student123)');

  // Create Courses
  const courses = await Promise.all([
    // Course 1: Phishing Detection
    prisma.course.create({
      data: {
        title: 'Phishing Detection Fundamentals',
        description: 'Learn to identify and protect yourself from phishing attacks. This course covers email phishing, spear phishing, and social engineering tactics used by attackers.',
        thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
        difficulty: 'Beginner',
        duration: '2 hours',
        isPublished: true,
        lessons: {
          create: [
            {
              title: 'Introduction to Phishing',
              videoUrl: 'https://www.youtube.com/watch?v=XBkzBrXlle0',
              content: `# What is Phishing?

Phishing is a type of social engineering attack where attackers attempt to trick you into revealing sensitive information such as passwords, credit card numbers, or personal data.

## How Phishing Works

1. **Bait**: Attackers create convincing fake emails, websites, or messages
2. **Hook**: They use urgency, fear, or curiosity to get you to act
3. **Catch**: You unknowingly provide sensitive information

## Common Types of Phishing

- **Email Phishing**: Mass emails pretending to be from legitimate companies
- **Spear Phishing**: Targeted attacks on specific individuals
- **Whaling**: Attacks targeting executives and high-profile individuals
- **Smishing**: Phishing via SMS text messages
- **Vishing**: Voice phishing via phone calls

## Why It Matters

Phishing is responsible for over 90% of data breaches. Understanding how to identify these attacks is crucial for personal and organizational security.`,
              order: 1
            },
            {
              title: 'Recognizing Phishing Emails',
              videoUrl: 'https://www.youtube.com/watch?v=Y7zNlEMDmI4',
              content: `# How to Spot a Phishing Email

## Red Flags to Watch For

### 1. Suspicious Sender Address
- Check the actual email address, not just the display name
- Look for misspellings: "support@amaz0n.com" vs "support@amazon.com"
- Be wary of public email domains for business communications

### 2. Generic Greetings
- "Dear Customer" instead of your actual name
- "Dear User" or "Dear Account Holder"

### 3. Urgency and Threats
- "Your account will be suspended in 24 hours!"
- "Immediate action required!"
- "You've been compromised!"

### 4. Suspicious Links
- Hover over links before clicking
- Check if the URL matches the supposed sender
- Look for HTTPS and valid certificates

### 5. Poor Grammar and Spelling
- Professional companies proofread their communications
- Multiple errors suggest a scam

### 6. Unexpected Attachments
- Never open attachments you weren't expecting
- Be especially wary of .exe, .zip, or macro-enabled documents

## What To Do

1. Don't click any links or download attachments
2. Report the email to your IT department
3. Delete the email
4. If unsure, contact the company directly through official channels`,
              order: 2
            },
            {
              title: 'Protecting Yourself from Phishing',
              content: `# Best Practices for Phishing Prevention

## Technical Safeguards

### Enable Multi-Factor Authentication (MFA)
- Adds an extra layer of security
- Even if passwords are stolen, attackers can't access accounts
- Use authenticator apps over SMS when possible

### Keep Software Updated
- Install security patches promptly
- Use automatic updates when available
- Keep browsers and email clients current

### Use Email Filtering
- Enable spam filters
- Use email authentication (SPF, DKIM, DMARC)
- Consider advanced threat protection

## Behavioral Safeguards

### Verify Before You Trust
- When in doubt, contact the sender through official channels
- Don't use contact info from suspicious emails
- Look up official phone numbers independently

### Think Before You Click
- Hover over links to preview URLs
- Type URLs directly into your browser
- Be suspicious of shortened URLs

### Protect Your Information
- Never share passwords via email
- Legitimate companies won't ask for sensitive data via email
- Use unique passwords for each account

## If You've Been Phished

1. **Change your passwords immediately**
2. **Enable MFA on all accounts**
3. **Monitor your accounts for suspicious activity**
4. **Report the incident to your IT department**
5. **Consider a credit freeze if financial data was exposed**`,
              order: 3
            }
          ]
        }
      }
    }),

    // Course 2: Password Security
    prisma.course.create({
      data: {
        title: 'Password Security Best Practices',
        description: 'Master the art of creating and managing secure passwords. Learn about password managers, multi-factor authentication, and common password attacks.',
        thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400',
        difficulty: 'Beginner',
        duration: '1.5 hours',
        isPublished: true,
        lessons: {
          create: [
            {
              title: 'Why Password Security Matters',
              videoUrl: 'https://www.youtube.com/watch?v=3NjQ9b3pgIg',
              content: `# The Importance of Strong Passwords

## The Current Threat Landscape

- **81%** of data breaches involve weak or stolen passwords
- The average person has **100+** online accounts
- Password attacks are automated and run 24/7

## Common Password Attacks

### Brute Force Attacks
- Systematically trying every possible combination
- Modern computers can try billions of combinations per second
- Short passwords can be cracked in seconds

### Dictionary Attacks
- Using lists of common words and passwords
- "password123" is tried within milliseconds
- Includes common substitutions (p@ssw0rd)

### Credential Stuffing
- Using stolen username/password pairs from data breaches
- Automated testing across multiple sites
- Why password reuse is dangerous

### Social Engineering
- Tricking users into revealing passwords
- Fake password reset pages
- Shoulder surfing

## The Cost of Weak Passwords

- Financial loss
- Identity theft
- Reputation damage
- Loss of personal data
- Business disruption`,
              order: 1
            },
            {
              title: 'Creating Strong Passwords',
              content: `# How to Create Unbreakable Passwords

## Password Strength Factors

### Length is King
- **Minimum 12 characters**, 16+ is better
- Each additional character exponentially increases security
- "correcthorsebatterystaple" > "Tr0ub4dor&3"

### Complexity Matters (But Less Than You Think)
- Mix uppercase, lowercase, numbers, symbols
- Avoid predictable patterns (Password1!, Qwerty123)
- Don't just add numbers/symbols at the end

## Password Creation Methods

### Passphrase Method
Create a sentence only you would know:
- "MyDogAte3BluePancakesIn2024!"
- "IMetMyWife@CoffeeShop#7"
- Easy to remember, hard to crack

### Random Generator Method
Use a password manager to generate:
- "xK9#mP2$vL5@nQ8"
- Maximum entropy
- Requires a password manager

### Diceware Method
- Roll dice to select random words
- "correct-horse-battery-staple"
- Highly secure and memorable

## What NOT to Do

❌ Personal information (birthdays, names, pets)
❌ Dictionary words alone
❌ Keyboard patterns (qwerty, 12345)
❌ Common substitutions everyone knows (@ for a, 0 for o)
❌ The same password everywhere
❌ Passwords shorter than 12 characters`,
              order: 2
            },
            {
              title: 'Password Managers & MFA',
              content: `# Tools for Password Security

## Password Managers

### What They Do
- Generate strong, unique passwords
- Securely store all your passwords
- Auto-fill login forms
- Sync across devices

### Recommended Password Managers
- **Bitwarden** (Free, open-source)
- **1Password** (Paid, excellent features)
- **Dashlane** (Paid, user-friendly)
- **KeePass** (Free, local storage)

### Best Practices
- Use a very strong master password
- Enable MFA on your password manager
- Regular backups
- Never share your master password

## Multi-Factor Authentication (MFA)

### What is MFA?
Something you:
1. **Know** (password)
2. **Have** (phone, security key)
3. **Are** (fingerprint, face)

### Types of MFA

#### Authenticator Apps (Recommended)
- Google Authenticator
- Microsoft Authenticator
- Authy

#### Hardware Security Keys (Most Secure)
- YubiKey
- Google Titan
- Feitian

#### SMS Codes (Better Than Nothing)
- Vulnerable to SIM swapping
- Use only if no other option

### Enable MFA Everywhere
Priority accounts:
1. Email (gateway to all other accounts)
2. Banking and financial
3. Social media
4. Work accounts
5. Password manager`,
              order: 3
            }
          ]
        }
      }
    }),

    // Course 3: Social Engineering
    prisma.course.create({
      data: {
        title: 'Social Engineering Awareness',
        description: 'Understand how attackers manipulate human psychology to bypass security. Learn to recognize and defend against social engineering tactics.',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
        difficulty: 'Intermediate',
        duration: '2.5 hours',
        isPublished: true,
        lessons: {
          create: [
            {
              title: 'Understanding Social Engineering',
              videoUrl: 'https://www.youtube.com/watch?v=lc7scxvKQOo',
              content: `# The Human Element of Security

## What is Social Engineering?

Social engineering is the art of manipulating people into giving up confidential information or taking actions that compromise security. It exploits human psychology rather than technical vulnerabilities.

## Why It Works

### Psychological Principles Exploited

**Authority**
- People tend to comply with authority figures
- Attackers impersonate IT staff, executives, or officials

**Urgency**
- Creating time pressure prevents careful thinking
- "Act now or face consequences!"

**Fear**
- Threatening job loss, legal action, or account suspension
- Panic leads to poor decisions

**Trust**
- Building rapport before the attack
- Exploiting existing relationships

**Reciprocity**
- Doing a small favor first
- "I helped you, now help me"

**Social Proof**
- "Everyone else has done this"
- Using fake testimonials or references

## The Attack Lifecycle

1. **Research**: Gathering information about the target
2. **Develop Trust**: Building a relationship or credible story
3. **Exploit**: Making the request or launching the attack
4. **Exit**: Covering tracks and avoiding detection`,
              order: 1
            },
            {
              title: 'Common Social Engineering Attacks',
              content: `# Types of Social Engineering Attacks

## Pretexting

Creating a fabricated scenario to extract information.

**Examples:**
- IT support calling to "fix" your computer
- Bank representative verifying your account
- Recruiter requesting personal details

**Defense:** Always verify identity through official channels

## Baiting

Offering something enticing to deliver malware.

**Examples:**
- USB drives left in parking lots
- Free software downloads
- "You've won!" pop-ups

**Defense:** Never plug in unknown devices or download from untrusted sources

## Quid Pro Quo

Offering a service in exchange for information.

**Examples:**
- Free security audit that installs malware
- Technical support in exchange for credentials
- Survey with a prize requiring personal data

**Defense:** Be skeptical of unsolicited offers

## Tailgating/Piggybacking

Physically following authorized personnel into restricted areas.

**Examples:**
- Holding the door for someone with "full hands"
- Wearing a fake badge or uniform
- Claiming to be a vendor or delivery person

**Defense:** Always verify and badge everyone, even if awkward

## Vishing (Voice Phishing)

Phone-based social engineering.

**Examples:**
- IRS scam calls
- Tech support scams
- Bank fraud department impersonation

**Defense:** Hang up and call back on official numbers`,
              order: 2
            },
            {
              title: 'Defending Against Social Engineering',
              content: `# How to Protect Yourself

## Personal Defense Strategies

### Verify, Verify, Verify
- Always confirm identities through official channels
- Don't use contact info provided by the requester
- When in doubt, hang up and call back

### Slow Down
- Urgency is a red flag
- Take time to think before acting
- It's okay to say "let me get back to you"

### Limit Information Sharing
- Be cautious on social media
- Don't overshare at work or in public
- Shred sensitive documents

### Trust Your Instincts
- If something feels wrong, it probably is
- It's better to be rude than compromised
- Report suspicious interactions

## Organizational Defense

### Security Awareness Training
- Regular training for all employees
- Simulated phishing exercises
- Clear reporting procedures

### Policies and Procedures
- Verification protocols for sensitive requests
- Clean desk policy
- Visitor management

### Technical Controls
- Email filtering
- Multi-factor authentication
- Access controls

## When You Suspect an Attack

1. **Stop** - Don't provide any more information
2. **Document** - Note details of the interaction
3. **Report** - Contact security/IT immediately
4. **Learn** - Share the experience to help others

Remember: There's no shame in being targeted. Attackers are professionals. The shame is in not reporting it.`,
              order: 3
            }
          ]
        }
      }
    }),

    // Course 4: Secure Browsing
    prisma.course.create({
      data: {
        title: 'Secure Web Browsing',
        description: 'Learn how to browse the internet safely. Understand browser security, recognize malicious websites, and protect your privacy online.',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
        difficulty: 'Beginner',
        duration: '1.5 hours',
        isPublished: true,
        lessons: {
          create: [
            {
              title: 'Browser Security Basics',
              videoUrl: 'https://www.youtube.com/watch?v=_p-LNLv49Ug',
              content: `# Understanding Browser Security

## Your Browser is a Gateway

Your web browser is your primary interface with the internet. It's also a primary target for attackers.

## Essential Browser Security Settings

### Keep Your Browser Updated
- Updates patch security vulnerabilities
- Enable automatic updates
- Restart your browser regularly to apply updates

### Use HTTPS Everywhere
- Look for the padlock icon
- Avoid sites without HTTPS for sensitive activities
- Consider browser extensions that enforce HTTPS

### Manage Cookies and Tracking
- Clear cookies regularly
- Use private/incognito mode for sensitive browsing
- Consider cookie management extensions

### Control Pop-ups and Redirects
- Enable pop-up blocking
- Be wary of unexpected redirects
- Don't allow notifications from untrusted sites

## Browser Extensions

### Helpful Security Extensions
- **uBlock Origin**: Ad and tracker blocking
- **HTTPS Everywhere**: Force secure connections
- **Privacy Badger**: Block invisible trackers

### Extension Safety
- Only install from official stores
- Check permissions requested
- Fewer extensions = smaller attack surface
- Remove extensions you don't use`,
              order: 1
            },
            {
              title: 'Recognizing Malicious Websites',
              content: `# How to Identify Dangerous Websites

## URL Red Flags

### Check the Domain Carefully
- **Typosquatting**: amaz0n.com, goggle.com
- **Subdomain tricks**: amazon.fakesite.com
- **Similar characters**: arnazon.com (rn looks like m)

### Verify HTTPS
- Padlock icon should be present
- Click the padlock to verify certificate
- "Not Secure" warning = proceed with caution

### Watch for Suspicious TLDs
- Be cautious with unusual extensions
- .xyz, .top, .click are often used by scammers
- Legitimate companies usually use .com, .org, .net

## Website Content Red Flags

### Poor Design Quality
- Broken images or layouts
- Spelling and grammar errors
- Mismatched branding

### Too Good to Be True
- Unrealistic prices or offers
- Countdown timers creating urgency
- Pop-ups that won't close

### Missing Information
- No contact information
- No privacy policy
- No physical address

## Before You Enter Information

1. Verify the URL matches the expected site
2. Check for HTTPS and valid certificate
3. Look for trust signals (reviews, security badges)
4. When in doubt, navigate directly to the site instead of clicking links`,
              order: 2
            },
            {
              title: 'Safe Downloading Practices',
              content: `# Downloading Files Safely

## Before You Download

### Verify the Source
- Download from official websites only
- Check URL carefully for legitimacy
- Avoid "download" sites that aggregate software

### Check File Reputation
- Search for reviews and reports
- Use VirusTotal to scan files
- Be wary of newly created software

## During Download

### Watch for Bundled Software
- Use custom/advanced installation options
- Uncheck pre-selected additional software
- Read each installation screen carefully

### File Type Awareness
- Be cautious with executable files (.exe, .msi, .dmg)
- Documents can contain macros (.docm, .xlsm)
- Archives can hide dangerous files (.zip, .rar)

## After Download

### Scan Before Opening
- Use antivirus to scan downloaded files
- Don't disable security warnings
- Quarantine suspicious files

### Verify Integrity
- Check file hashes when provided
- Compare file size to expected size
- Be suspicious of files that are much smaller/larger

## Safe Download Checklist

✅ Official website or trusted source
✅ HTTPS connection
✅ File type is expected
✅ Scanned by antivirus
✅ No bundled software accepted
✅ Permissions make sense for the software`,
              order: 3
            }
          ]
        }
      }
    }),

    // Course 5: Data Protection
    prisma.course.create({
      data: {
        title: 'Personal Data Protection',
        description: 'Protect your personal and sensitive data from theft and exposure. Learn about data classification, encryption, and secure data handling.',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
        difficulty: 'Intermediate',
        duration: '2 hours',
        isPublished: true,
        lessons: {
          create: [
            {
              title: 'Understanding Data Classification',
              videoUrl: 'https://www.youtube.com/watch?v=wt1HwxaCx3U',
              content: `# What Data Needs Protection?

## Types of Sensitive Data

### Personal Identifiable Information (PII)
- Full name
- Social Security Number
- Date of birth
- Address
- Phone number
- Email address

### Financial Information
- Credit card numbers
- Bank account details
- Tax information
- Investment records

### Health Information
- Medical records
- Insurance information
- Prescription data
- Health conditions

### Authentication Data
- Passwords
- Security questions
- Biometric data
- PINs

## Data Classification Levels

### Public
- Information that can be freely shared
- Marketing materials, public announcements

### Internal
- Not for public distribution
- Internal memos, policies

### Confidential
- Limited access required
- Customer data, financial reports

### Restricted
- Highest protection needed
- Trade secrets, PII, credentials

## Why Classification Matters

- Helps prioritize protection efforts
- Guides appropriate handling procedures
- Ensures compliance with regulations
- Reduces risk of data breaches`,
              order: 1
            },
            {
              title: 'Data Protection Best Practices',
              content: `# Protecting Your Data

## Physical Security

### Secure Your Devices
- Never leave devices unattended
- Use cable locks for laptops
- Enable auto-lock with short timeout
- Encrypt device storage

### Document Handling
- Shred sensitive documents
- Use secure disposal bins
- Don't leave papers on desks
- Lock filing cabinets

## Digital Security

### Encryption
- Encrypt sensitive files before sharing
- Use full-disk encryption
- Encrypt cloud storage
- Use encrypted messaging apps

### Access Control
- Use strong, unique passwords
- Enable multi-factor authentication
- Review app permissions regularly
- Revoke access when no longer needed

### Secure Sharing
- Use secure file sharing services
- Set expiration dates on shared links
- Use password protection for sensitive files
- Verify recipient before sending

## Data Minimization

### Collect Only What You Need
- Question data collection requests
- Provide minimum required information
- Use aliases when possible

### Delete What You Don't Need
- Regularly review stored data
- Securely delete old files
- Clear browser history and cache
- Empty trash/recycle bin securely`,
              order: 2
            },
            {
              title: 'Responding to Data Breaches',
              content: `# What to Do When Data is Compromised

## Recognizing a Breach

### Warning Signs
- Unexpected password reset emails
- Unfamiliar account activity
- Credit card charges you didn't make
- Notifications from breach monitoring services
- Strange emails from your accounts

## Immediate Response

### Step 1: Contain the Damage
- Change passwords immediately
- Enable MFA if not already active
- Log out of all sessions
- Revoke suspicious app access

### Step 2: Assess the Impact
- What data was exposed?
- Which accounts are affected?
- Is financial information at risk?
- Was it personal or work-related?

### Step 3: Notify Relevant Parties
- Report to IT/security team (for work)
- Contact financial institutions
- File reports with authorities if needed
- Notify affected individuals

## Recovery Actions

### Financial Protection
- Place fraud alerts on credit reports
- Consider credit freeze
- Monitor accounts closely
- Report fraudulent charges

### Identity Protection
- Monitor for identity theft signs
- Consider identity monitoring services
- Keep records of all incidents
- File FTC identity theft report if needed

### Future Prevention
- Review how the breach occurred
- Implement stronger security measures
- Update passwords across accounts
- Enable additional security features

## Document Everything
- Keep a timeline of events
- Save all correspondence
- Document financial losses
- Record time spent on recovery`,
              order: 3
            }
          ]
        }
      }
    }),

    // Course 6: Advanced Threat Analysis (ADVANCED)
    prisma.course.create({
      data: {
        title: 'Advanced Threat Analysis & Incident Response',
        description: 'Master advanced cybersecurity techniques including threat hunting, incident response, and forensic analysis. Learn to identify, analyze, and respond to sophisticated cyber attacks.',
        thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400',
        difficulty: 'Advanced',
        duration: '4 hours',
        isPublished: true,
        lessons: {
          create: [
            {
              title: 'Threat Intelligence & Attack Frameworks',
              videoUrl: 'https://www.youtube.com/watch?v=pcclNdwG8Vs',
              content: `# Understanding Advanced Threats

## The Evolving Threat Landscape

Modern cyber threats have evolved far beyond simple malware. Today's attackers use sophisticated techniques that require equally sophisticated defenses.

## Advanced Persistent Threats (APTs)

### Characteristics of APTs
- **Persistence**: Attackers maintain long-term access to networks
- **Stealth**: Use of advanced evasion techniques
- **Targeted**: Focus on specific organizations or sectors
- **Resourced**: Often state-sponsored or well-funded criminal groups

### APT Attack Phases
1. **Reconnaissance**: Gathering information about targets
2. **Initial Compromise**: Gaining first foothold
3. **Establish Foothold**: Installing backdoors
4. **Escalate Privileges**: Gaining admin access
5. **Internal Reconnaissance**: Mapping the network
6. **Lateral Movement**: Moving to other systems
7. **Data Exfiltration**: Stealing valuable data
8. **Maintain Presence**: Ensuring continued access

## MITRE ATT&CK Framework

### What is ATT&CK?
A globally accessible knowledge base of adversary tactics and techniques based on real-world observations.

### Key Components

**Tactics** (The "Why")
- Initial Access
- Execution
- Persistence
- Privilege Escalation
- Defense Evasion
- Credential Access
- Discovery
- Lateral Movement
- Collection
- Exfiltration
- Impact

**Techniques** (The "How")
- Specific methods attackers use
- Sub-techniques for detailed categorization
- Mapped to real threat groups

### Using ATT&CK for Defense
- Map your security controls to the framework
- Identify gaps in coverage
- Prioritize security investments
- Develop detection strategies

## Indicators of Compromise (IOCs)

### Types of IOCs
- **Hash Values**: MD5, SHA1, SHA256 of malicious files
- **IP Addresses**: Known malicious IPs
- **Domain Names**: C2 servers, phishing domains
- **URLs**: Specific malicious URLs
- **Email Addresses**: Attacker email addresses
- **File Paths**: Common malware locations
- **Registry Keys**: Persistence mechanisms

### IOC Lifecycle
1. Discovery through analysis
2. Validation and correlation
3. Sharing with threat intel community
4. Aging and eventual retirement`,
              order: 1
            },
            {
              title: 'Incident Response Methodology',
              content: `# Professional Incident Response

## The Incident Response Lifecycle

### NIST Incident Response Framework

**Phase 1: Preparation**
- Establish incident response team
- Define roles and responsibilities
- Develop playbooks and procedures
- Acquire and maintain tools
- Conduct training and exercises

**Phase 2: Detection & Analysis**
- Monitor security events
- Analyze alerts and anomalies
- Determine incident scope
- Document findings
- Prioritize response efforts

**Phase 3: Containment, Eradication & Recovery**
- Short-term containment (stop bleeding)
- Evidence preservation
- Long-term containment (sustainable fix)
- Eradication of threat
- System recovery and validation
- Return to normal operations

**Phase 4: Post-Incident Activity**
- Lessons learned meeting
- Update procedures and controls
- Report to stakeholders
- Improve detection capabilities

## Incident Severity Classification

### Severity Levels

**Critical (P1)**
- Active data breach in progress
- Ransomware spreading across network
- Complete system compromise
- Regulatory notification required
- Response: Immediate, all-hands

**High (P2)**
- Confirmed malware infection
- Unauthorized access detected
- Sensitive data at risk
- Response: Within 1 hour

**Medium (P3)**
- Suspicious activity detected
- Policy violation
- Potential security incident
- Response: Within 4 hours

**Low (P4)**
- Security alerts requiring investigation
- Minor policy violations
- Response: Within 24 hours

## Evidence Collection & Handling

### Order of Volatility
Collect in this order (most to least volatile):
1. Registers and cache
2. RAM/Memory
3. Network state
4. Running processes
5. Disk/storage
6. Remote logging data
7. Physical configuration
8. Backup media

### Chain of Custody
- Document who collected what
- Record timestamps
- Use write blockers
- Calculate and record hashes
- Secure storage
- Limit access to authorized personnel

## Communication During Incidents

### Internal Communication
- Establish secure communication channels
- Regular status updates
- Clear escalation paths
- Decision documentation

### External Communication
- Legal and PR involvement
- Regulatory notifications
- Customer/stakeholder communication
- Law enforcement coordination`,
              order: 2
            },
            {
              title: 'Forensic Analysis & Threat Hunting',
              content: `# Advanced Analysis Techniques

## Digital Forensics Fundamentals

### Forensic Principles
- **Integrity**: Never modify original evidence
- **Chain of Custody**: Document everything
- **Reproducibility**: Others can verify findings
- **Documentation**: Detailed notes and reports

### Key Forensic Artifacts

**Windows Systems**
- Event Logs (Security, System, Application)
- Registry hives
- Prefetch files
- NTFS artifacts ($MFT, $UsnJrnl)
- Browser artifacts
- Memory dumps

**Linux Systems**
- Auth logs (/var/log/auth.log)
- Syslog (/var/log/syslog)
- Bash history
- Cron jobs
- Process information

**Network Forensics**
- Packet captures (PCAP)
- NetFlow data
- DNS logs
- Proxy logs
- Firewall logs

## Threat Hunting

### What is Threat Hunting?
Proactively searching for threats that have evaded existing security controls.

### Hunting Methodologies

**Hypothesis-Driven Hunting**
1. Develop hypothesis based on threat intel
2. Determine data sources needed
3. Create detection queries
4. Analyze results
5. Refine and iterate

**IOC-Based Hunting**
- Search for known bad indicators
- Hash values
- IP addresses
- Domain names
- File paths

**Anomaly-Based Hunting**
- Establish baselines
- Look for deviations
- Investigate outliers
- Statistical analysis

### Essential Hunting Queries

**Unusual Process Execution**
- Processes running from temp folders
- Unsigned executables
- Processes with network connections

**Persistence Mechanisms**
- New scheduled tasks
- Registry run keys
- New services
- Startup folder additions

**Lateral Movement Indicators**
- Remote execution tools (PsExec, WMI)
- RDP connections
- Admin share access
- Pass-the-hash patterns

## Building a Threat Hunting Program

### Key Elements
1. **People**: Skilled analysts with diverse backgrounds
2. **Process**: Documented methodologies and playbooks
3. **Technology**: SIEM, EDR, network visibility tools
4. **Intelligence**: Threat feeds, industry reports

### Metrics for Success
- Number of hunts conducted
- Threats discovered
- Mean time to detect (MTTD)
- Mean time to respond (MTTR)
- Coverage of ATT&CK techniques

## Advanced Detection Engineering

### Detection-as-Code
- Version control for detection rules
- Testing and validation pipelines
- Automated deployment
- Performance monitoring

### SIGMA Rules
- Vendor-agnostic detection format
- Community-driven rule sharing
- Converts to platform-specific queries

### Reducing False Positives
- Baseline normal behavior
- Contextual enrichment
- Tuning thresholds
- Whitelisting known-good`,
              order: 3
            }
          ]
        }
      }
    })
  ]);

  console.log(`✅ Created ${courses.length} courses with lessons`);


  // ===== Add Modules and Expand Lessons =====
  // Creates 3 modules per course and adds 5 new lessons per course (30 total)
  // Original structure from add-modules-lessons.ts and expand-content-v2.ts

  // Modules for Course 1
  const course1Modules = await Promise.all([
    prisma.module.create({
      data: {
        title: "Understanding Phishing",
        description: "Learn phishing fundamentals",
        order: 1,
        courseId: courses[0].id
      }
    }),
    prisma.module.create({
      data: {
        title: "Recognizing Phishing",
        description: "Identify phishing attempts",
        order: 2,
        courseId: courses[0].id
      }
    }),
    prisma.module.create({
      data: {
        title: "Defense",
        description: "Protect and respond",
        order: 3,
        courseId: courses[0].id
      }
    })
  ]);

  // Assign existing lessons to modules for Course 1
  {
    const existingLessons = await prisma.lesson.findMany({
      where: { courseId: courses[0].id },
      orderBy: { order: 'asc' }
    });
    const existing1 = existingLessons.find(l => l.title === "Introduction to Phishing");
    if (existing1) await prisma.lesson.update({ where: { id: existing1.id }, data: { moduleId: course1Modules[0].id, order: 1 } });
    const existing2 = existingLessons.find(l => l.title === "Recognizing Phishing Emails");
    if (existing2) await prisma.lesson.update({ where: { id: existing2.id }, data: { moduleId: course1Modules[1].id, order: 2 } });
    const existing3 = existingLessons.find(l => l.title === "Protecting Yourself from Phishing");
    if (existing3) await prisma.lesson.update({ where: { id: existing3.id }, data: { moduleId: course1Modules[2].id, order: 3 } });
  }

  // Modules for Course 2
  const course2Modules = await Promise.all([
    prisma.module.create({
      data: {
        title: "Fundamentals",
        description: "Why passwords matter",
        order: 1,
        courseId: courses[1].id
      }
    }),
    prisma.module.create({
      data: {
        title: "Strong Credentials",
        description: "Build secure passwords",
        order: 2,
        courseId: courses[1].id
      }
    }),
    prisma.module.create({
      data: {
        title: "Advanced Protection",
        description: "Tools and techniques",
        order: 3,
        courseId: courses[1].id
      }
    })
  ]);

  // Assign existing lessons to modules for Course 2
  {
    const existingLessons = await prisma.lesson.findMany({
      where: { courseId: courses[1].id },
      orderBy: { order: 'asc' }
    });
    const existing1 = existingLessons.find(l => l.title === "Why Password Security Matters");
    if (existing1) await prisma.lesson.update({ where: { id: existing1.id }, data: { moduleId: course2Modules[0].id, order: 1 } });
    const existing2 = existingLessons.find(l => l.title === "Creating Strong Passwords");
    if (existing2) await prisma.lesson.update({ where: { id: existing2.id }, data: { moduleId: course2Modules[1].id, order: 2 } });
    const existing3 = existingLessons.find(l => l.title === "Password Managers & MFA");
    if (existing3) await prisma.lesson.update({ where: { id: existing3.id }, data: { moduleId: course2Modules[2].id, order: 3 } });
  }

  // Modules for Course 3
  const course3Modules = await Promise.all([
    prisma.module.create({
      data: {
        title: "Foundations",
        description: "What is social engineering",
        order: 1,
        courseId: courses[2].id
      }
    }),
    prisma.module.create({
      data: {
        title: "Attack Methods",
        description: "Common techniques",
        order: 2,
        courseId: courses[2].id
      }
    }),
    prisma.module.create({
      data: {
        title: "Defense",
        description: "Protection strategies",
        order: 3,
        courseId: courses[2].id
      }
    })
  ]);

  // Assign existing lessons to modules for Course 3
  {
    const existingLessons = await prisma.lesson.findMany({
      where: { courseId: courses[2].id },
      orderBy: { order: 'asc' }
    });
    const existing1 = existingLessons.find(l => l.title === "Understanding Social Engineering");
    if (existing1) await prisma.lesson.update({ where: { id: existing1.id }, data: { moduleId: course3Modules[0].id, order: 1 } });
    const existing2 = existingLessons.find(l => l.title === "Common Social Engineering Attacks");
    if (existing2) await prisma.lesson.update({ where: { id: existing2.id }, data: { moduleId: course3Modules[1].id, order: 2 } });
    const existing3 = existingLessons.find(l => l.title === "Defending Against Social Engineering");
    if (existing3) await prisma.lesson.update({ where: { id: existing3.id }, data: { moduleId: course3Modules[2].id, order: 3 } });
  }

  // Modules for Course 4
  const course4Modules = await Promise.all([
    prisma.module.create({
      data: {
        title: "Browser Security",
        description: "Security fundamentals",
        order: 1,
        courseId: courses[3].id
      }
    }),
    prisma.module.create({
      data: {
        title: "Threat Recognition",
        description: "Identify web threats",
        order: 2,
        courseId: courses[3].id
      }
    }),
    prisma.module.create({
      data: {
        title: "Safe Practices",
        description: "Browse safely",
        order: 3,
        courseId: courses[3].id
      }
    })
  ]);

  // Assign existing lessons to modules for Course 4
  {
    const existingLessons = await prisma.lesson.findMany({
      where: { courseId: courses[3].id },
      orderBy: { order: 'asc' }
    });
    const existing1 = existingLessons.find(l => l.title === "Browser Security Basics");
    if (existing1) await prisma.lesson.update({ where: { id: existing1.id }, data: { moduleId: course4Modules[0].id, order: 1 } });
    const existing2 = existingLessons.find(l => l.title === "Recognizing Malicious Websites");
    if (existing2) await prisma.lesson.update({ where: { id: existing2.id }, data: { moduleId: course4Modules[1].id, order: 2 } });
    const existing3 = existingLessons.find(l => l.title === "Safe Downloading Practices");
    if (existing3) await prisma.lesson.update({ where: { id: existing3.id }, data: { moduleId: course4Modules[2].id, order: 3 } });
  }

  // Modules for Course 5
  const course5Modules = await Promise.all([
    prisma.module.create({
      data: {
        title: "Foundations",
        description: "Data types and privacy",
        order: 1,
        courseId: courses[4].id
      }
    }),
    prisma.module.create({
      data: {
        title: "Protection",
        description: "Safeguard your data",
        order: 2,
        courseId: courses[4].id
      }
    }),
    prisma.module.create({
      data: {
        title: "Incident Response",
        description: "Respond to breaches",
        order: 3,
        courseId: courses[4].id
      }
    })
  ]);

  // Assign existing lessons to modules for Course 5
  {
    const existingLessons = await prisma.lesson.findMany({
      where: { courseId: courses[4].id },
      orderBy: { order: 'asc' }
    });
    const existing1 = existingLessons.find(l => l.title === "Understanding Data Classification");
    if (existing1) await prisma.lesson.update({ where: { id: existing1.id }, data: { moduleId: course5Modules[0].id, order: 1 } });
    const existing2 = existingLessons.find(l => l.title === "Data Protection Best Practices");
    if (existing2) await prisma.lesson.update({ where: { id: existing2.id }, data: { moduleId: course5Modules[1].id, order: 2 } });
    const existing3 = existingLessons.find(l => l.title === "Responding to Data Breaches");
    if (existing3) await prisma.lesson.update({ where: { id: existing3.id }, data: { moduleId: course5Modules[2].id, order: 3 } });
  }

  // Modules for Course 6
  const course6Modules = await Promise.all([
    prisma.module.create({
      data: {
        title: "Threat Intelligence",
        description: "Intelligence frameworks",
        order: 1,
        courseId: courses[5].id
      }
    }),
    prisma.module.create({
      data: {
        title: "Detection",
        description: "Find and analyze",
        order: 2,
        courseId: courses[5].id
      }
    }),
    prisma.module.create({
      data: {
        title: "Response",
        description: "Effective response",
        order: 3,
        courseId: courses[5].id
      }
    })
  ]);

  // Assign existing lessons to modules for Course 6
  {
    const existingLessons = await prisma.lesson.findMany({
      where: { courseId: courses[5].id },
      orderBy: { order: 'asc' }
    });
    const existing1 = existingLessons.find(l => l.title === "Threat Intelligence & Attack Frameworks");
    if (existing1) await prisma.lesson.update({ where: { id: existing1.id }, data: { moduleId: course6Modules[0].id, order: 1 } });
    const existing2 = existingLessons.find(l => l.title === "Incident Response Methodology");
    if (existing2) await prisma.lesson.update({ where: { id: existing2.id }, data: { moduleId: course6Modules[1].id, order: 2 } });
    const existing3 = existingLessons.find(l => l.title === "Forensic Analysis & Threat Hunting");
    if (existing3) await prisma.lesson.update({ where: { id: existing3.id }, data: { moduleId: course6Modules[2].id, order: 3 } });
  }

  // Create 30 new lessons with full content
  await prisma.lesson.create({
    data: {
      title: "The Psychology of Phishing",
      videoUrl: "https://www.youtube.com/watch?v=F7pYHN9iC9I",
      content: "# Understanding the Psychology Behind Phishing Attacks\n\n## Why Phishing Works\n\nPhishing attacks succeed not because of technical sophistication, but because they exploit fundamental human psychology. Attackers are experts at manipulating emotions and cognitive biases.\n\n## Key Psychological Triggers\n\n### 1. Urgency and Time Pressure\n- \"Your account will be locked in 2 hours!\"\n- \"Immediate action required to avoid suspension\"\n- Creates panic that bypasses rational thinking\n- Victims act quickly without verifying authenticity\n\n### 2. Authority and Trust\n- Impersonating banks, government agencies, or executives\n- Using official-looking logos and branding\n- Leveraging our tendency to obey authority figures\n- \"This is from your CEO\" or \"IRS notice\"\n\n### 3. Fear and Consequences\n- Threats of account closure or legal action\n- \"Your account has been compromised\"\n- \"Suspicious activity detected\"\n- Triggers survival instincts that override caution\n\n### 4. Curiosity and Greed\n- \"You've won a prize!\"\n- \"Click to see who viewed your profile\"\n- \"Exclusive offer just for you\"\n- Exploits our desire for rewards and information\n\n### 5. Social Proof\n- \"Everyone in your department has already updated their credentials\"\n- Fake testimonials and reviews\n- Leverages our tendency to follow the crowd\n\n## Cognitive Biases Exploited\n\n### Confirmation Bias\n- If you're expecting a package, shipping notifications seem legitimate\n- Attackers time attacks around common events (tax season, holidays)\n\n### Anchoring\n- First piece of information sets expectations\n- Official-looking header makes everything else seem legitimate\n\n### Scarcity\n- \"Limited time offer\"\n- \"Only 3 spots remaining\"\n- Creates sense of urgency and FOMO (fear of missing out)\n\n## How to Resist Psychological Manipulation\n\n### 1. Slow Down\n- Take a breath before responding to urgent requests\n- If it's truly urgent, official channels will reach you multiple ways\n\n### 2. Verify Independently\n- Don't use contact info from suspicious messages\n- Look up official numbers and call directly\n- Check URLs carefully before clicking\n\n### 3. Question Authority\n- Even if it looks official, verify through known channels\n- Real organizations won't ask for sensitive info via email\n\n### 4. Trust Your Instincts\n- If something feels off, it probably is\n- It's better to verify and be wrong than to ignore and be compromised\n\n## Key Takeaways\n\n- Phishing exploits psychology, not just technology\n- Awareness of these tactics makes you more resistant\n- Slow, deliberate thinking defeats rushed emotional responses\n- When in doubt, verify through independent channels",
      order: 4,
      courseId: courses[0].id,
      moduleId: course1Modules[0].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Identifying Phishing URLs",
      videoUrl: "https://www.youtube.com/watch?v=qBN7JfV_FvI",
      content: "# How to Identify Phishing URLs and Websites\n\n## Understanding URLs\n\nA URL (Uniform Resource Locator) is the web address you see in your browser. Understanding URL structure is critical for identifying phishing attempts.\n\n### URL Anatomy\n\nhttps://www.example.com/path/page.html?query=value\n[1]    [2] [3]      [4]  [5]\n\n1. Protocol (https:// or http://)\n2. Subdomain (www)\n3. Domain name (example.com)\n4. Path (/path/page.html)\n5. Query parameters (?query=value)\n\n## Red Flags in URLs\n\n### 1. Misspelled Domains\n- amaz0n.com (zero instead of 'o')\n- paypa1.com (number 1 instead of 'l')\n- microsoftonline.com vs microsoft-online.com\n- Always check the actual domain, not just what looks familiar\n\n### 2. Suspicious Subdomains\n- paypal.secure-login.com (domain is \"secure-login.com\", NOT PayPal)\n- amazon.account-verify.net (domain is \"account-verify.net\")\n- The domain is what comes RIGHT BEFORE the first single slash (/)\n\n### 3. Extra Characters or Domains\n- paypal.com.secure.ru (actual domain is \".ru\")\n- www.paypal-login.tk (domain is \".tk\", a common free domain)\n- Look for the last two parts before the path\n\n### 4. IP Addresses Instead of Domain Names\n- http://192.168.1.1/paypal (legitimate sites don't use raw IPs)\n- http://203.0.113.0/login\n\n### 5. No HTTPS\n- Missing padlock icon in browser\n- http:// instead of https://\n- Never enter sensitive info on non-HTTPS sites\n\n## Advanced Phishing Techniques\n\n### Homograph Attacks (IDN Spoofing)\n- Using similar-looking characters from different alphabets\n- Cyrillic 'а' looks identical to Latin 'a' but is different\n- Modern browsers now flag these\n\n### URL Shorteners\n- bit.ly, tinyurl.com, etc. hide the real destination\n- Hover over shortened links if possible\n- Use URL expander tools before clicking\n- Many phishers use these to hide malicious URLs\n\n### Typosquatting\n- Registering common misspellings\n- gooogle.com, faceboook.com\n- Banking on users making typos\n\n## How to Safely Check URLs\n\n### 1. Hover Before You Click\n- Desktop: Hover mouse over link to preview URL\n- Mobile: Long-press to see destination\n- Check if displayed text matches actual URL\n\n### 2. Check the Certificate\n- Click the padlock icon in browser\n- View certificate details\n- Verify it's issued to the correct organization\n\n### 3. Use Browser Security Features\n- Modern browsers warn about known phishing sites\n- Don't ignore these warnings\n- Keep browser updated for latest protections\n\n### 4. Type URLs Directly\n- For sensitive sites (banking, email), type URL yourself\n- Use bookmarks for frequently visited sites\n- Don't rely on links from emails\n\n## Practice Exercise\n\nWhich of these URLs is legitimate for PayPal?\n1. https://www.paypal.com/signin\n2. https://paypal.com.secure-login.net\n3. https://www.paypa1.com\n4. http://paypal.support.verify.tk\n\nAnswer: Only #1 is legitimate!\n\n## Key Takeaways\n\n- The domain name is the most critical part to verify\n- Always check for HTTPS on sensitive sites\n- When in doubt, type the URL yourself\n- Use bookmarks for important sites\n- Modern browsers help, but stay vigilant",
      order: 5,
      courseId: courses[0].id,
      moduleId: course1Modules[1].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Spear Phishing Attacks",
      content: "# Understanding Spear Phishing and Targeted Attacks\n\n## What is Spear Phishing?\n\nUnlike mass phishing emails sent to thousands, spear phishing is a targeted attack on specific individuals or organizations. These attacks use personalized information to appear highly credible.\n\n## How Spear Phishing Differs from Regular Phishing\n\n### Mass Phishing\n- Generic messages sent to thousands\n- \"Dear Customer\"\n- Low success rate but high volume\n- Easy to spot with generic content\n\n### Spear Phishing\n- Customized for specific targets\n- Uses your name, job title, colleagues' names\n- High success rate due to personalization\n- Much harder to detect\n\n## Common Spear Phishing Tactics\n\n### 1. Research Phase\nAttackers gather information from:\n- LinkedIn profiles (job title, colleagues, projects)\n- Facebook and social media (interests, travel, family)\n- Company websites (org structure, recent news)\n- Data breaches (leaked emails, passwords)\n- Public records\n\n### 2. Personalization Techniques\n- Referencing real colleagues or projects\n- Mentioning recent company news or events\n- Using internal terminology and acronyms\n- Timing attacks around known events (performance reviews, tax season)\n\n### 3. Impersonation Strategies\n- CEO or executive impersonation (whaling)\n- IT department requesting password resets\n- HR about payroll or benefits\n- Vendors with fake invoices\n- Partners requesting urgent wire transfers\n\n## Real-World Examples\n\n### Example 1: The CEO Email Scam\n\nFrom: CEO John Smith <john.smith@company-mail.com>\nTo: Finance Manager\nSubject: Urgent Wire Transfer Needed\n\nHi Sarah,\n\nI'm in a meeting with potential investors and need you to\nprocess an urgent wire transfer. We're acquiring a competitor\nand this needs to stay confidential. Can you send $50,000 to\nthis account immediately? I'll send the paperwork later.\n\nThis is time-sensitive. Please confirm when done.\n\nThanks,\nJohn\n\nRed Flags:\n- Urgency and confidentiality pressure\n- Unusual request outside normal procedures\n- Request to bypass normal processes\n- Slightly off domain name\n\n## How to Defend Against Spear Phishing\n\n### 1. Limit Public Information\n- Review social media privacy settings\n- Be cautious about posting work details\n- Limit information on professional profiles\n- Think before sharing location, travel, or project details\n\n### 2. Verify Unusual Requests\n- Call the person using a known phone number\n- Don't use contact info from the suspicious email\n- Use alternative communication channel\n- Verify through official company directory\n\n### 3. Question Everything\n- Is this request normal for this person?\n- Does the email address match exactly?\n- Is the tone and language typical?\n- Are they asking me to bypass procedures?\n\n### 4. Look for Subtle Signs\n- Slight variations in email addresses\n- Unusual phrasing or grammar\n- Requests outside normal workflow\n- Urgency or pressure tactics\n\n## Key Takeaways\n\n- Spear phishing uses personalized information to appear legitimate\n- Attackers do their homework on targets\n- Verify unusual requests through independent channels\n- Limit the personal and professional information you share publicly\n- When in doubt, verify through a phone call using a known number\n- Organizations need clear procedures for sensitive requests",
      order: 6,
      courseId: courses[0].id,
      moduleId: course1Modules[1].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Reporting Phishing",
      content: "# How to Report and Respond to Phishing Attacks\n\n## Immediate Actions When You Receive a Phishing Email\n\n### DO NOT:\n- Click any links or buttons\n- Download attachments\n- Reply to the sender\n- Forward to personal email\n- Delete immediately (report first)\n\n### DO:\n- Keep the email as evidence\n- Report it to appropriate parties\n- Alert colleagues if it's widespread\n- Document details for reporting\n\n## Reporting Phishing Emails\n\n### 1. Internal Reporting (Within Your Organization)\n\nReport to IT Security/Help Desk:\n- Use your organization's phishing report button\n- Forward the email to security@yourcompany.com\n- Include full headers (View > Show Original in Gmail)\n- Note any actions you took\n\nMost organizations have:\n- Dedicated security email\n- Phishing report button in email client\n- Internal incident reporting system\n- Security hotline\n\n### 2. Email Provider Reporting\n- Gmail: Click three dots > Report phishing\n- Outlook: Select message > Report > Phishing\n- Yahoo: Select message > More > Report phishing\n- Apple Mail: Forward to abuse@icloud.com\n\n### 3. External Reporting\n\nAnti-Phishing Working Group (APWG):\n- Email: reportphishing@apwg.org\n- International coalition fighting phishing\n\nFederal Trade Commission (FTC):\n- Forward to: spam@uce.gov\n- File complaint at: ReportFraud.ftc.gov\n\nInternet Crime Complaint Center (IC3):\n- Website: ic3.gov\n- For phishing resulting in financial loss\n\nCompany Being Impersonated:\n- Most major companies have abuse@company.com\n- Examples: abuse@paypal.com, phish@amazon.com\n\n## If You Clicked a Phishing Link\n\n### Immediate Steps (First 15 Minutes)\n\n1. Disconnect from Network\n   - Unplug ethernet or disable WiFi\n   - Prevents malware from spreading\n   - Stops data exfiltration\n\n2. Document Everything\n   - Screenshot the phishing page\n   - Note time you clicked\n   - Record any information entered\n   - Save the URL\n\n3. Alert IT Security\n   - Call (don't email if compromised)\n   - Provide all details\n   - Follow their instructions\n\n### Short-term Response (First 24 Hours)\n\n4. Change Passwords Immediately\n   - Start with email account\n   - Then financial accounts\n   - Any account using the same password\n   - Use a different device if possible\n\n5. Enable MFA Everywhere\n   - Email, banking, social media\n   - Use authenticator apps, not SMS\n   - This prevents access even with stolen password\n\n6. Run Security Scans\n   - Full antivirus scan\n   - Anti-malware tools\n   - Check for unauthorized software\n\n7. Monitor Accounts\n   - Check for unauthorized access\n   - Review recent login history\n   - Look for unusual activity\n\n## If You Provided Sensitive Information\n\n### Personal Information (SSN, Date of Birth)\n- File identity theft report with FTC\n- Place fraud alert on credit reports\n- Consider credit freeze\n- Monitor credit reports regularly\n\n### Financial Information (Credit Card, Bank Account)\n- Contact financial institution immediately\n- Request new cards/account numbers\n- Review recent transactions\n- Set up fraud alerts and monitoring\n\n### Login Credentials (Username/Password)\n- Change password immediately on all sites using it\n- Enable MFA everywhere\n- Check for unauthorized access\n- Update security questions\n\n### Work Credentials\n- Notify IT security immediately\n- Change password\n- Review access logs\n- Check for data exfiltration\n\n## Key Takeaways\n\n- Report phishing emails before deleting them\n- If you clicked, act immediately—disconnect and alert IT\n- Change passwords and enable MFA as soon as possible\n- Report to multiple parties: IT, email provider, authorities\n- Monitor accounts closely after an incident\n- Quick reporting helps protect others",
      order: 7,
      courseId: courses[0].id,
      moduleId: course1Modules[2].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Building Phishing Resistance",
      videoUrl: "https://www.youtube.com/watch?v=OB5L8pVvCZs",
      content: "# Building Phishing Resistance\n\n## What is Phishing Resistance?\n\n**Definition**: The ability to consistently recognize and avoid phishing attacks through a combination of knowledge, habits, technical controls, and organizational culture.\n\n**Not just one skill**: A layered approach combining:\n- Technical knowledge\n- Critical thinking habits\n- Security tools\n- Organizational support\n- Continuous awareness\n\n**Goal**: Make phishing attacks fail even when sophisticated or targeted\n\n## The Psychology of Phishing Resistance\n\n### Why Humans Fall for Phishing\n\n**Psychological triggers exploited**:\n\n1. **Authority**: We're trained to obey authority figures\n2. **Urgency**: Time pressure bypasses critical thinking\n3. **Fear**: Threat of negative consequences impairs judgment\n4. **Curiosity**: We want to know what the message says\n5. **Greed**: Offers that seem too good to pass up\n6. **Trust**: We trust familiar brands and people\n7. **Helpfulness**: We want to help others\n8. **Social proof**: \"Everyone else is doing this\"\n\n**Reality**: Phishing succeeds by exploiting normal human psychology\n\n### Building Mental Resistance\n\n**Cognitive strategies**:\n\n1. **Default skepticism**\n   - Question unexpected communications\n   - \"Why am I receiving this now?\"\n   - \"Does this make sense?\"\n\n2. **Slow down**\n   - Urgency is manufactured\n   - Legitimate situations allow verification time\n   - Take 30 seconds to think\n\n3. **Recognize emotional manipulation**\n   - Notice when you feel fear, urgency, or excitement\n   - Pause when emotions triggered\n   - Emotion = potential manipulation\n\n4. **Pattern recognition**\n   - Learn common phishing patterns\n   - Notice what doesn't fit\n   - Trust your instincts\n\n## Technical Foundation\n\n### Email Security\n\n**Email filtering**:\n\n1. **Strong spam filter**\n   - Gmail, Outlook have good filtering\n   - Enterprise solutions (Proofpoint, Mimecast)\n   - Regularly update filter rules\n\n2. **Authentication checks**\n   - SPF (Sender Policy Framework)\n   - DKIM (DomainKeys Identified Mail)\n   - DMARC (Domain-based Message Authentication)\n   - These verify sender legitimacy\n\n3. **Banner warnings**\n   - \"External email\" warnings\n   - \"Unusual sender\" alerts\n   - Color-coded indicators\n\n**Email client settings**:\n\n1. **Display full headers**\n   - See actual sender address\n   - Check routing information\n   - Verify source\n\n2. **Disable automatic image loading**\n   - Prevents tracking pixels\n   - Blocks malicious images\n   - Manual load when safe\n\n3. **Plain text option**\n   - View email as plain text\n   - Reveals hidden links\n   - Easier to spot anomalies\n\n### Browser Protection\n\n**Essential tools**:\n\n1. **Modern, updated browser**\n   - Chrome, Firefox, Edge, Safari\n   - Automatic updates enabled\n   - Latest security patches\n\n2. **Phishing protection**\n   - Safe Browsing (Chrome)\n   - SmartScreen (Edge)\n   - Fraudulent site warnings (Firefox, Safari)\n\n3. **Password manager with phishing protection**\n   - Won't autofill on fake sites\n   - Only fills on legitimate domains\n   - Strong indicator of legitimate vs. fake site\n\n**Browser extensions**:\n\n1. **Link checker**\n   - Shows link destinations on hover\n   - Expands shortened URLs\n   - Warns about suspicious destinations\n\n2. **Ad blocker**\n   - Blocks malvertising\n   - Reduces phishing ad exposure\n\n### Multi-Factor Authentication (MFA)\n\n**Critical defense**:\n\n**Why it matters**:\n- Even if phished, attacker can't access account\n- Requires second factor (phone, app, hardware key)\n- Dramatically reduces successful phishing impact\n\n**MFA types** (from most to least secure):\n\n1. **Hardware security keys (BEST)**\n   - YubiKey, Google Titan\n   - Phishing-resistant (won't work on fake sites)\n   - Physical device required\n\n2. **Authenticator apps**\n   - Google Authenticator, Authy, Microsoft Authenticator\n   - Time-based codes\n   - Better than SMS\n\n3. **Push notifications**\n   - Approve on phone\n   - Convenient\n   - Risk: approval fatigue\n\n4. **SMS codes** (WEAKEST)\n   - Better than nothing\n   - Vulnerable to SIM swapping\n   - Use only if nothing else available\n\n**Enable MFA on**:\n- Email accounts (CRITICAL)\n- Financial accounts\n- Work accounts\n- Social media\n- Any account with sensitive data\n\n### Additional Technical Tools\n\n1. **Virtual Private Network (VPN)**\n   - Encrypts traffic\n   - Hides IP address\n   - Protects on public Wi-Fi\n\n2. **DNS filtering**\n   - Blocks known malicious domains\n   - Stops phishing sites at DNS level\n   - OpenDNS, Quad9, Cloudflare\n\n3. **Antivirus with web protection**\n   - Blocks malicious sites\n   - Scans downloads\n   - Real-time protection\n\n## Behavioral Habits\n\n### Email Verification Routine\n\n**Before clicking any link or downloading attachment**:\n\n1. **Check sender address**\n   - Hover over name to see actual address\n   - Look for typosquatting\n   - Verify domain matches claimed organization\n\n2. **Inspect links before clicking**\n   - Hover to see destination\n   - Look for mismatched URLs\n   - Check for suspicious domains\n\n3. **Question unexpected emails**\n   - Did you expect this?\n   - Is the request normal?\n   - Does tone/format match usual communications?\n\n4. **Verify through independent channel**\n   - Call using known phone number\n   - Log into account directly (don't click link)\n   - Contact sender through different method\n\n### Safe Link Practices\n\n**Golden rule**: When in doubt, type it yourself\n\n**Instead of clicking email links**:\n1. Open browser\n2. Type known URL directly (or use bookmark)\n3. Navigate to relevant section\n4. Verify information there\n\n**For unknown links**:\n1. Use link checker (urlscan.io, VirusTotal)\n2. Check where it goes\n3. Look up organization directly\n\n**Never click**:\n- Links in unexpected emails\n- Shortened URLs from unknown sources\n- Links requesting password or payment info\n- Links in emails claiming account problems\n\n### Attachment Safety\n\n**Default stance**: Don't open unexpected attachments\n\n**Before opening any attachment**:\n\n1. **Verify sender legitimacy**\n   - Confirm they actually sent it\n   - Call or message through known channel\n\n2. **Check file type**\n   - Be extra cautious: .exe, .zip, .scr, .js, .vbs\n   - Office files can have malicious macros\n   - PDFs can have malicious scripts\n\n3. **Scan with antivirus**\n   - Save to disk first\n   - Scan before opening\n\n4. **Use sandbox if available**\n   - Open in isolated environment\n   - Virtual machine\n   - Cloud-based sandbox\n\n**Red flag attachments**:\n- Unexpected invoices\n- \"You have to see this!\" attachments\n- Attachments claiming to be from shipping companies\n- Password-protected archives (to evade scanning)\n\n### Password Practices\n\n**Supporting phishing resistance**:\n\n1. **Unique passwords per site**\n   - Password manager essential\n   - Breach doesn't affect other accounts\n\n2. **Long, strong passwords**\n   - 16+ characters\n   - Mix of character types\n   - Use password manager to generate\n\n3. **Never reuse passwords**\n   - Especially email and banking\n   - Reuse = single phishing attack compromises everything\n\n4. **Change compromised passwords immediately**\n   - All accounts with same password\n   - Enable MFA if not already active\n\n### Mobile-Specific Habits\n\n**Unique mobile risks**:\n- Smaller screens (harder to inspect)\n- Touch interface (easier to misclick)\n- More urgent feel\n- Less security visibility\n\n**Mobile best practices**:\n\n1. **Be extra cautious**\n   - Can't hover to see link destinations\n   - Harder to verify sender addresses\n\n2. **Don't click links on mobile**\n   - Open browser separately\n   - Type URL or use app\n\n3. **Use official apps**\n   - Bank app vs. mobile browser\n   - Apps harder to phish\n\n4. **Long-press links**\n   - Shows destination on mobile\n   - Check before opening\n\n## Organizational Phishing Resistance\n\n### Company-Level Defenses\n\n**Technical controls**:\n\n1. **Email authentication**\n   - SPF, DKIM, DMARC implemented\n   - Reject unauthenticated email\n   - Display warnings on external email\n\n2. **Advanced filtering**\n   - AI-based phishing detection\n   - Link sandboxing\n   - Attachment scanning\n   - Impersonation protection\n\n3. **Web filtering**\n   - Block known phishing sites\n   - Category-based filtering\n   - Real-time threat intelligence\n\n4. **Endpoint protection**\n   - Antivirus on all devices\n   - Exploit protection\n   - Application control\n\n**Policy controls**:\n\n1. **Clear security policies**\n   - What to do with suspicious emails\n   - How to report incidents\n   - No blame for reporting\n   - Consequences for ignoring policy\n\n2. **Verification procedures**\n   - Financial transactions require callback\n   - Password resets follow strict process\n   - Vendor changes verified through known contacts\n\n3. **Incident response plan**\n   - Clear steps if phished\n   - Rapid containment procedures\n   - Communication protocols\n\n### Training and Awareness\n\n**Effective training elements**:\n\n1. **Regular, ongoing training**\n   - Not just annual\n   - Monthly or quarterly\n   - Fresh examples and techniques\n\n2. **Realistic simulations**\n   - Simulated phishing tests\n   - No punishment for falling for tests\n   - Immediate learning opportunity\n\n3. **Positive reinforcement**\n   - Recognize employees who report phishing\n   - Celebrate security awareness wins\n   - Make security positive, not punitive\n\n4. **Varied content**\n   - Different phishing types\n   - Various difficulty levels\n   - Department-specific scenarios\n\n5. **Measurement and improvement**\n   - Track click rates over time\n   - Identify high-risk groups\n   - Tailored additional training\n\n**Training mistakes to avoid**:\n- \"Gotcha\" approach (breeds resentment)\n- Only annual training (people forget)\n- Punishment for failures (discourages reporting)\n- Boring, generic content (people tune out)\n\n### Security Culture\n\n**Building resistance organization-wide**:\n\n1. **Make security everyone's job**\n   - Not just IT's responsibility\n   - Each person is part of defense\n   - Collective responsibility\n\n2. **Encourage reporting**\n   - Easy reporting mechanism\n   - Praise those who report\n   - No blame for clicking (if reported)\n\n3. **Share information**\n   - Alert everyone to new campaigns\n   - Discuss real attempts\n   - Learn collectively\n\n4. **Leadership modeling**\n   - Executives follow security practices\n   - No special exemptions\n   - Visible commitment to security\n\n## Continuous Improvement\n\n### Staying Current\n\n**Phishing evolves constantly**:\n\n1. **Follow security news**\n   - Krebs on Security\n   - The Hacker News\n   - Bleeping Computer\n   - Security company blogs\n\n2. **Subscribe to alerts**\n   - US-CERT\n   - Industry-specific ISACs\n   - Security vendor bulletins\n\n3. **Participate in community**\n   - Security forums\n   - Professional groups\n   - Share experiences\n\n4. **Review real attempts**\n   - Analyze phishing you receive\n   - Learn new techniques\n   - Share with colleagues\n\n### Measuring Your Resistance\n\n**Personal assessment**:\n\n**Questions to ask**:\n- Do I verify unexpected requests?\n- Do I use MFA on critical accounts?\n- Do I check sender addresses?\n- Do I hover before clicking?\n- Do I use unique passwords?\n- Do I report suspicious emails?\n- Do I stay informed about threats?\n\n**Track your progress**:\n- How many phishing emails do you catch?\n- How often do you verify?\n- Are you creating better habits?\n\n### Learning from Mistakes\n\n**If you click a phishing link or provide information**:\n\n1. **Don't panic**\n   - Mistakes happen\n   - Rapid response limits damage\n\n2. **Act immediately**\n   - Report to IT security\n   - Change passwords\n   - Monitor accounts\n\n3. **Learn from experience**\n   - What made it convincing?\n   - What signs did you miss?\n   - How can you avoid next time?\n\n4. **Share learnings**\n   - Help others avoid same mistake\n   - Contribute to collective knowledge\n\n## Advanced Phishing Types\n\n### Spear Phishing\n\n**Characteristics**:\n- Targeted at specific individual\n- Uses personal information\n- Highly convincing\n- Often work-related\n\n**Resistance strategies**:\n- Limit public information\n- Be extra cautious with personalized emails\n- Always verify through known channels\n- Question even plausible scenarios\n\n### Whaling\n\n**Definition**: Phishing targeting executives\n\n**Why dangerous**:\n- Executives have high-value access\n- Busy, less likely to scrutinize\n- Authority makes it hard to question\n\n**Resistance**:\n- Executive assistants trained to verify\n- Callback procedures for financial requests\n- Extra layers for sensitive actions\n\n### Business Email Compromise (BEC)\n\n**Scenario**: Email appears from CEO requesting wire transfer\n\n**Resistance**:\n- Always verify financial requests\n- Callback on known number\n- Multi-person approval for transfers\n- Out-of-band verification\n\n### Clone Phishing\n\n**Attack**: Legitimate email resent with malicious link/attachment\n\n**Resistance**:\n- Verify resent messages\n- Check if slight differences from original\n- Question \"resend\" requests\n\n## Emergency Response\n\n### If You've Been Phished\n\n**Immediate actions (first 15 minutes)**:\n\n1. **Disconnect from network** (if malware suspected)\n\n2. **Report to IT security immediately**\n   - Time is critical\n   - IT can contain spread\n   - Alert others\n\n3. **Change passwords** (from clean device)\n   - Compromised account\n   - Email account\n   - Accounts with same password\n\n4. **Document everything**\n   - Screenshots of phishing email\n   - What information was provided\n   - What links were clicked\n   - Timeline of events\n\n**Next steps (first hour)**:\n\n5. **Monitor accounts**\n   - Check for unauthorized access\n   - Review recent activity\n   - Look for changes to settings\n\n6. **Enable/check MFA**\n   - Activate if not enabled\n   - Check for added devices/apps\n   - Remove unauthorized access\n\n7. **Run security scans**\n   - Full antivirus scan\n   - Anti-malware scan\n   - Check for persistence\n\n**Following days/weeks**:\n\n8. **Monitor for fraud**\n   - Bank statements\n   - Credit reports\n   - Account activities\n\n9. **Consider credit freeze** (if sensitive info exposed)\n\n10. **Stay alert for follow-up attacks**\n    - Attackers may try again\n    - May use stolen information for further phishing\n\n## Key Takeaways\n\n- Phishing resistance requires layered approach: knowledge + habits + tools + culture\n- Enable MFA everywhere possible, especially email - stops most phishing even if credentials stolen\n- Use password manager with autofill - won't fill credentials on fake sites (strong phishing indicator)\n- Verify unexpected requests through independent channel - never use contact info from suspicious message\n- Slow down when urgent requests arrive - urgency is manufactured to bypass critical thinking\n- Hover before clicking - inspect link destinations before clicking any link in email\n- Default to skepticism - question unexpected emails even if they look legitimate\n- Train regularly with realistic scenarios - annual training insufficient, need continuous exposure\n- Report suspicious emails immediately - helps protect others and tracks attack patterns\n- No blame culture essential - punishment discourages reporting and learning\n- Stay current on phishing techniques - attackers constantly evolve tactics\n- Learn from mistakes - if phished, report immediately and use experience to improve defenses",
      order: 8,
      courseId: courses[0].id,
      moduleId: course1Modules[2].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "How Passwords Get Compromised",
      content: "# How Passwords Get Compromised\n\n## The Password Problem\n\nDespite being the primary method of authentication for decades, passwords remain one of the weakest links in cybersecurity. Understanding how they get compromised is the first step to better protection.\n\n## Common Methods of Password Compromise\n\n### 1. Data Breaches\n\nWhat Happens:\n- Hackers breach company databases\n- Steal millions of username/password combinations\n- Sell or publish the data on dark web\n\nNotable Breaches:\n- LinkedIn (2012): 165 million passwords\n- Yahoo (2013): 3 billion accounts\n- Adobe (2013): 153 million accounts\n- Equifax (2017): 147 million records\n\nWhy This Matters:\n- Leaked passwords are used to try other accounts\n- People reuse passwords across sites\n- Attackers use credential stuffing attacks\n\nCheck if You've Been Breached:\n- Visit: haveibeenpwned.com\n- Enter your email to see known breaches\n- Update passwords for compromised accounts\n\n### 2. Phishing and Social Engineering\n\nHow It Works:\n- Fake login pages that look legitimate\n- Emails claiming \"verify your account\"\n- You enter credentials on malicious site\n- Attackers now have your password\n\nDefense:\n- Never click links in emails\n- Type URLs directly into browser\n- Check URL carefully before entering credentials\n- Look for HTTPS and valid certificates\n\n### 3. Brute Force Attacks\n\nDictionary Attacks:\n- Try common words from dictionary\n- Common passwords: password123, qwerty, admin\n- Takes seconds for simple passwords\n\nPure Brute Force:\n- Try every possible combination\n- Length and complexity matter enormously\n- 8-character password: minutes to hours\n- 16-character password: millions of years\n\nModern Capabilities:\n- High-end GPU: billions of attempts per second\n- Cloud computing makes this cheaper\n- Distributed botnets multiply power\n\n### 4. Credential Stuffing\n\nThe Process:\n1. Attackers get username/password lists from breaches\n2. Use automated tools to try these credentials\n3. Test across thousands of websites\n4. Exploit password reuse\n\nWhy It Works:\n- 65% of people reuse passwords\n- If Netflix password leaks, attackers try it on banking sites\n- Automated at massive scale\n\nDefense:\n- Unique password for every account\n- Use password manager to track\n- Enable breach notifications\n\n### 5. Keyloggers and Malware\n\nHow Keyloggers Work:\n- Malicious software records every keystroke\n- Captures passwords as you type them\n- Sends data to attackers\n\nDefense:\n- Keep antivirus updated\n- Don't open suspicious attachments\n- Download software from official sources only\n- Use password manager (types passwords for you)\n- Enable MFA (even if password is captured, they can't login)\n\n## Key Takeaways\n\n- Passwords are compromised through breaches, phishing, brute force, and reuse\n- Weak passwords can be cracked in seconds\n- Password reuse is extremely dangerous\n- Use strong, unique passwords for every account\n- Enable MFA everywhere\n- Use a password manager\n- No legitimate service will ever ask for your password\n- Check if your passwords have been breached at haveibeenpwned.com",
      order: 4,
      courseId: courses[1].id,
      moduleId: course2Modules[0].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Passphrases",
      videoUrl: "https://www.youtube.com/watch?v=3NjQ9b3pgIg",
      content: "# Passphrases: The Better Alternative to Passwords\n\n## What is a Passphrase?\n\nA passphrase is a sequence of random words that creates a long, memorable, and highly secure password alternative.\n\nExample:\n- Traditional password: P@ssw0rd123! (12 characters)\n- Passphrase: correct-horse-battery-staple (28 characters)\n\nThe passphrase is longer, easier to remember, and exponentially more secure.\n\n## Why Passphrases are Superior\n\n### The Math of Password Strength\n\nPassword Entropy = Length × Character Set Diversity\n\n8-Character Complex Password:\n- Uppercase, lowercase, numbers, symbols\n- 95 possible characters per position\n- Total combinations: 95^8 = 6.6 quadrillion\n- Crack time with modern GPU: Hours to days\n\n20-Character Passphrase (4 random words):\n- 10,000 common words in English\n- 4-word passphrase: 10,000^4 = 10 quadrillion combinations\n- Crack time: Thousands of years\n\n### Length Beats Complexity\n\nNIST (National Institute of Standards and Technology) Guidelines:\n- Length is the primary factor in password strength\n- Complexity requirements (symbols, numbers) provide minimal benefit\n- Long passphrases > short complex passwords\n\nWhy:\n- Each additional character increases combinations exponentially\n- 20 lowercase letters > 10 mixed case + symbols\n- Easier to remember means less likely to write down or reuse\n\n## How to Create Strong Passphrases\n\n### Method 1: Random Word Generation (Most Secure)\n\nUse a Password Manager or Diceware:\n1. Use random word generator (many password managers offer this)\n2. Or use Diceware: roll dice to select words from Diceware word list\n3. Combine 4-6 random words\n4. Add numbers or symbols if required (but length is more important)\n\nExample Process:\n- Roll dice or use generator\n- Get words: \"bicycle\", \"meadow\", \"thunder\", \"penguin\"\n- Create passphrase: bicycle-meadow-thunder-penguin\n- 33 characters, easy to remember, extremely secure\n\n### Method 2: Mental Image Story\n\nCreate memorable phrases using random words:\n1. Generate 4-6 random, unrelated words\n2. Create a vivid mental image connecting them\n3. The absurdity makes it memorable\n\nExample:\n- Words: \"purple\", \"elephant\", \"coffee\", \"bicycle\"\n- Passphrase: purple-elephant-drinks-coffee-on-bicycle\n- Mental image: A purple elephant riding a bicycle while drinking coffee\n- Easy to remember, hard to crack\n\n## Passphrase Best Practices\n\n### DO:\n- Use 4-6 random words\n- Make them truly random (use tools, don't pick yourself)\n- Use separator characters (-, _, space if allowed)\n- Aim for 20+ characters minimum\n- Different passphrase for each account\n- Store in password manager\n\n### DON'T:\n- Use common phrases or song lyrics\n- Use words related to you (pet names, birthday, hobbies)\n- Pick predictable word combinations\n- Reuse passphrases across accounts\n- Write on sticky notes\n\n## Passphrase vs Password: Real Examples\n\n### Weak Password: Summer2024!\n- Length: 11 characters\n- Crack time: Minutes\n- Contains predictable pattern (season + year)\n- Commonly used format\n\n### Strong Password: xK9#mP2$qL5&nR8\n- Length: 15 characters\n- Crack time: Years\n- Extremely hard to remember\n- Likely to be written down or forgotten\n- High chance of password reset requests\n\n### Strong Passphrase: velvet-lunar-triumph-cascade-whisper\n- Length: 37 characters\n- Crack time: Trillions of years\n- Easy to remember\n- No need to write down\n- Can be typed quickly once memorized\n\n## Tools for Generating Passphrases\n\n### Password Managers with Passphrase Generators\n- 1Password: Built-in passphrase generator\n- Bitwarden: Random word generator\n- KeePass: Passphrase mode\n- LastPass: Passphrase option\n\n### Standalone Tools\n- Diceware: https://diceware.rempe.us/\n- EFF Wordlist: https://www.eff.org/dice\n\n## When to Use Passphrases\n\n### Ideal Use Cases:\n- Master password for password manager (most critical)\n- Primary email account\n- Banking and financial accounts\n- Encryption keys\n- Any account you must remember\n\n## Key Takeaways\n\n- Passphrases use random words for length and memorability\n- Length > complexity for password strength\n- 4-6 random words create extremely strong passwords\n- Easier to remember than complex short passwords\n- Use password managers or Diceware for truly random words\n- Perfect for master passwords and critical accounts\n- Each additional word exponentially increases security",
      order: 5,
      courseId: courses[1].id,
      moduleId: course2Modules[1].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Password Hashing",
      content: "# Understanding Password Hashing and Encryption\n\n## Why Hashing Matters\n\nWhen you create a password on a website, that site should never store your actual password. Instead, they should store a hash - a one-way mathematical transformation of your password.\n\nWhy This Matters:\n- If the database is breached, attackers don't get actual passwords\n- Even system administrators shouldn't see your password\n- Prevents insider threats\n- Required by security regulations and best practices\n\n## What is Hashing?\n\n### The Basics\n\nHashing is a one-way mathematical function that converts any input into a fixed-length string of characters.\n\nKey Properties:\n1. One-way: Can't reverse the hash to get original password\n2. Deterministic: Same password always produces same hash\n3. Fixed length: \"a\" and a 1000-character password produce same-length hash\n4. Avalanche effect: Tiny input change completely changes hash\n\nExample (simplified MD5 hash):\nPassword: \"password123\"\nHash: \"482c811da5d5b4bc6d497ffa98491e38\"\n\nPassword: \"password124\" (changed one character)\nHash: \"7c6a180b36896a0a8c02787eeafb0e4c\" (completely different)\n\n### How Login Works with Hashing\n\nCreating Account:\n1. You enter password: \"MySecurePassword123\"\n2. Website hashes it: \"a4f8b392c...\"\n3. Website stores: username + hash (NOT password)\n\nLogging In:\n1. You enter password: \"MySecurePassword123\"\n2. Website hashes what you entered\n3. Compares hash to stored hash\n4. If they match, you're in\n\nThe website never stores or knows your actual password!\n\n## Common Hashing Algorithms\n\n### Cryptographic Hash Functions\n\nMD5 (Message Digest 5):\n- Status: BROKEN - Do not use\n- 128-bit hash\n- Extremely fast (which is bad for passwords)\n- Vulnerable to collisions\n\nSHA-1 (Secure Hash Algorithm 1):\n- Status: BROKEN - Do not use\n- 160-bit hash\n- Vulnerable to collisions\n\nSHA-256/SHA-512:\n- Status: Not ideal for passwords (too fast)\n- Part of SHA-2 family\n- Good for file integrity, digital signatures\n- Too fast for password hashing (enables faster cracking)\n\n### Password-Specific Hashing (Recommended)\n\nbcrypt:\n- Status: Recommended\n- Deliberately slow (adjustable)\n- Includes automatic salting\n- Widely supported\n- Battle-tested since 1999\n\nArgon2:\n- Status: Best modern choice\n- Winner of Password Hashing Competition (2015)\n- Resistant to GPU and ASIC attacks\n- Configurable memory usage\n\nPBKDF2:\n- Status: Acceptable\n- NIST recommended\n- Widely supported\n- Slower than raw SHA but not as good as bcrypt/Argon2\n\nscrypt:\n- Status: Recommended\n- Memory-intensive\n- Resistant to hardware attacks\n\n## The Problem: Fast Hashing\n\nWhy being \"fast\" is bad for passwords:\n- Hashing should be fast for legitimate use (checking password once)\n- But slow enough to prevent brute force attacks\n- Modern GPUs can compute billions of MD5 hashes per second\n- With fast algorithms, attackers can try passwords very quickly\n\nAttack Speed Comparison:\n- MD5: ~50 billion hashes/second (high-end GPU)\n- bcrypt: ~10,000 hashes/second\n- Difference: bcrypt is ~5 million times slower = 5 million times more secure\n\n## Salting: The Critical Protection\n\n### What is a Salt?\n\nA salt is random data added to your password before hashing.\n\nWithout Salt:\nPassword: \"password123\"\nHash: \"482c811da5d5b4bc6d497ffa98491e38\"\n\nWith Salt:\nPassword: \"password123\"\nSalt: \"xK9mP2qL\" (random, different for each user)\nCombined: \"password123xK9mP2qL\"\nHash: \"7a8f3d9e1c2b4a5f6e8d9c0b1a2d3e4f\"\n\n### Why Salting is Critical\n\n1. Prevents Rainbow Table Attacks\n- Rainbow tables: pre-computed hashes of common passwords\n- With salt, attacker must compute hash for each user individually\n- Makes pre-computation impossible\n\n2. Prevents Duplicate Hash Detection\n- Without salt: same password = same hash\n- Attacker sees many users with same hash\n- Knows they all use same password\n- Crack once, get many accounts\n\n- With salt: same password = different hash\n- Each user has unique salt\n- No way to tell who uses same password\n\n## How Attackers Crack Hashed Passwords\n\n### 1. Dictionary Attacks\n- Try common passwords from lists\n- \"password\", \"123456\", \"qwerty\"\n- Hash each and compare to stolen hashes\n\n### 2. Brute Force\n- Try every possible combination\n- Very slow but guaranteed to work eventually\n- Why length matters\n\n### 3. Rainbow Tables\n- Pre-computed hash tables\n- Instant lookup\n- Defeated by salting\n\n### 4. Hybrid Attacks\n- Dictionary words + common variations\n- \"password\" becomes \"password123\", \"P@ssword\", \"Password2024\"\n\n## Real-World Examples\n\n### LinkedIn Breach (2012)\n- Problem: Used unsalted SHA-1 hashes\n- Result: 6.5 million passwords cracked in days\n- Lesson: Even \"secure\" algorithms fail without salting\n\n### Adobe Breach (2013)\n- Problem: Used encrypted passwords with poor key management\n- Result: 153 million passwords exposed\n- Lesson: Encryption is not equal to hashing\n\n## How to Check if a Site Uses Proper Hashing\n\n### Red Flags (Site is Doing It Wrong):\n- Password reset sends you your actual password\n- Customer service can tell you your password\n- Password displayed in account settings\n- Password visible in URL or email\n\n### Green Flags (Site is Doing It Right):\n- Password reset requires creating new password\n- Support says \"I can reset it but can't tell you what it is\"\n- Password is never displayed anywhere\n- Can only change password by entering old one\n\n## Hashing vs Encryption\n\nMany people confuse these:\n\nHashing:\n- One-way: can't get original back\n- Always same output for same input\n- Used for passwords, file integrity\n\nEncryption:\n- Two-way: can decrypt to get original\n- Different output each time (with proper IV)\n- Used for data at rest, data in transit\n- Requires keys to decrypt\n\nFor passwords, always use hashing, never encryption!\n\n## Key Takeaways\n\n- Hashing converts passwords to irreversible fixed-length strings\n- Good sites never store your actual password\n- Salting prevents rainbow tables and duplicate detection\n- Modern algorithms (bcrypt, Argon2) are deliberately slow\n- Old algorithms (MD5, SHA-1) are broken for passwords\n- If a site can tell you your password, they're doing it wrong\n- Proper hashing protects users even when databases are breached\n- Each password should have unique random salt\n- Length matters more than complexity for resisting brute force",
      order: 6,
      courseId: courses[1].id,
      moduleId: course2Modules[1].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Setting Up MFA",
      videoUrl: "https://www.youtube.com/watch?v=0mvCeNsTa1g",
      content: "# Setting Up Multi-Factor Authentication (MFA)\n\n## What is Multi-Factor Authentication?\n\nMulti-Factor Authentication (MFA), also called Two-Factor Authentication (2FA), requires two or more methods to verify your identity:\n\n1. Something you know: Password, PIN\n2. Something you have: Phone, security key, smart card\n3. Something you are: Fingerprint, face, voice\n\nWhy MFA is Critical:\n- Even if password is stolen, attackers can't access account\n- Prevents 99.9% of account compromise attacks (Microsoft study)\n- Protects against phishing, breaches, and password reuse\n- Required by many compliance standards\n\n## Types of MFA\n\n### 1. SMS Text Messages (Least Secure)\n\nHow It Works:\n- Enter password\n- Receive 6-digit code via text\n- Enter code to complete login\n\nPros:\n- Easy to set up\n- Works on any phone\n- Better than no MFA\n\nCons:\n- Vulnerable to SIM swapping attacks\n- SMS can be intercepted\n- Requires cell signal\n- Not recommended for high-security accounts\n\n### 2. Authenticator Apps (Recommended)\n\nHow It Works:\n- App generates 6-digit codes that change every 30 seconds\n- Based on shared secret and current time (TOTP)\n- Works offline, no internet required\n\nPopular Authenticator Apps:\n- Google Authenticator (iOS, Android)\n- Microsoft Authenticator (iOS, Android)\n- Authy (iOS, Android, Desktop)\n- 1Password (if you use this password manager)\n- Bitwarden Authenticator (if you use this password manager)\n\nPros:\n- More secure than SMS\n- Works offline\n- Free and easy to use\n- Not vulnerable to SIM swapping\n- Supports multiple accounts\n\nWhen to Use: Most accounts - best balance of security and convenience\n\n### 3. Hardware Security Keys (Most Secure)\n\nHow It Works:\n- Physical device (USB, NFC, or Bluetooth)\n- Insert key or tap to authenticate\n- Uses cryptographic proof, not codes\n\nPopular Hardware Keys:\n- YubiKey (USB-A, USB-C, NFC)\n- Titan Security Key (Google)\n- Thetis FIDO2\n\nPros:\n- Highest security - virtually unphishable\n- No codes to type\n- Fast authentication\n- Resists phishing (only works on correct domain)\n- One key can serve multiple accounts\n\nWhen to Use: High-value accounts (email, banking, crypto), corporate environments\n\n## Step-by-Step: Setting Up MFA\n\n### Setting Up Authenticator App\n\nExample: Gmail with Google Authenticator\n\n1. Open Account Security Settings\n   - Go to myaccount.google.com\n   - Click \"Security\"\n   - Find \"2-Step Verification\"\n\n2. Choose Authenticator App\n   - Select \"Authenticator app\"\n   - Choose your phone type (iPhone/Android)\n\n3. Scan QR Code\n   - Open Google Authenticator app\n   - Tap \"+\" to add account\n   - Scan QR code displayed on screen\n\n4. Enter Verification Code\n   - App displays 6-digit code\n   - Enter code to verify setup\n   - Code changes every 30 seconds\n\n5. Save Backup Codes\n   - Download backup codes\n   - Store securely (password manager or safe place)\n   - Use if you lose phone\n\n6. Test It\n   - Log out and log back in\n   - Verify MFA works\n\n## MFA Best Practices\n\n### Setup Strategy\n\nPriority Order:\n1. Email account (most critical - controls password resets)\n2. Password manager\n3. Banking and financial\n4. Work accounts\n5. Social media\n6. Cloud storage\n7. Everything else\n\n### Backup and Recovery\n\nAlways Have Backups:\n- Save backup codes when setting up MFA\n- Register multiple devices/keys\n- Keep backup security key in safe place\n- Print backup codes and store securely\n\n## Key Takeaways\n\n- MFA prevents 99.9% of account compromises\n- Authenticator apps are the best balance of security and convenience\n- Hardware security keys are most secure for high-value accounts\n- SMS is better than nothing but vulnerable to SIM swapping\n- Always save backup codes securely\n- Set up MFA on email first - it controls everything else\n- Register multiple MFA methods for redundancy\n- Test your MFA and backup codes after setup\n- Enable MFA everywhere it's available",
      order: 7,
      courseId: courses[1].id,
      moduleId: course2Modules[2].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Enterprise Password Security",
      videoUrl: "https://www.youtube.com/watch?v=hhUb5iknVJs",
      content: "# Enterprise Password Security\n\n## The Enterprise Password Challenge\n\nOrganizations face unique password security challenges:\n- Hundreds to thousands of employees\n- Complex systems and applications\n- Regulatory compliance requirements\n- Insider threats\n- Privileged access management\n- Remote workers and contractors\n- Legacy systems with weak security\n\nA single compromised password can expose entire organization.\n\n## Enterprise Password Policies\n\n### Password Policy Requirements\n\nNIST Guidelines (Current Best Practices):\n- Minimum 8 characters (12+ recommended)\n- No complexity requirements (they backfire)\n- No periodic password changes (unless compromise suspected)\n- Screen passwords against breach databases\n- Allow all printable characters (including spaces)\n- No password hints or knowledge-based authentication\n\nWhat Changed:\n- Old policy: \"Change password every 90 days, must include uppercase, lowercase, number, symbol\"\n- Problem: Users make predictable changes (Summer2023! becomes Fall2023!)\n- New policy: Long passwords/passphrases, only change when compromised\n\n### Policy Components\n\n1. Password Length\n- Minimum: 12-14 characters\n- Passphrases encouraged\n- No maximum length restriction\n\n2. Password Complexity\n- Encourage length over complexity\n- Don't mandate specific character types\n- Allow (and encourage) passphrases\n\n3. Password Expiration\n- Only require change when:\n  - Breach detected\n  - Employee departure\n  - System compromise\n  - Suspicious activity\n- Avoid arbitrary expiration\n\n4. Password Reuse\n- Prevent reusing last 10-24 passwords\n- Applies to password changes\n- Prevents cycling through same passwords\n\n5. Account Lockout\n- Lock after 5-10 failed attempts\n- Lockout duration: 15-30 minutes or admin unlock\n- Balance security with usability\n\n## Multi-Factor Authentication (MFA) Enterprise Deployment\n\n### MFA Strategy\n\nCritical Systems (Require MFA):\n- Email access\n- VPN/remote access\n- Administrative accounts\n- Financial systems\n- Customer data systems\n- Cloud platforms (AWS, Azure, GCP)\n\nMFA Methods for Enterprise:\n1. Hardware security keys (highest security)\n   - YubiKeys for admins and high-risk users\n   - FIDO2 compliance\n\n2. Authenticator apps (standard users)\n   - Microsoft/Google Authenticator\n   - Duo Mobile\n   - Okta Verify\n\n3. Push notifications (with fraud detection)\n   - Easy for users\n   - Implement number matching to prevent MFA fatigue attacks\n\n4. SMS (only as fallback)\n   - Not recommended as primary\n   - For account recovery only\n\n## Privileged Access Management (PAM)\n\n### What is Privileged Access?\n\nPrivileged accounts:\n- System administrators\n- Database administrators\n- Network administrators\n- Domain admins\n- Service accounts\n- Root/superuser accounts\n\nWhy PAM is Critical:\n- Privileged accounts can access everything\n- Target of sophisticated attacks\n- Insider threat risk\n- Compliance requirements\n\n### PAM Best Practices\n\n1. Principle of Least Privilege\n- Grant minimum necessary permissions\n- Just-in-time access (temporary elevation)\n- Regular access reviews\n- Separate accounts for admin tasks\n\n2. Privileged Password Vaulting\n- Store privileged passwords in secure vault\n- Automatic password rotation\n- Check-out/check-in process\n- Session recording and monitoring\n\n3. Eliminate Shared Accounts\n- Individual accounts for all users\n- Shared account usage tracked and logged\n- Regular rotation of shared credentials\n\n4. Session Monitoring\n- Record privileged sessions\n- Real-time monitoring\n- Automated alerts for suspicious activity\n- Forensic analysis capability\n\n## Password Security Monitoring\n\n### What to Monitor\n\n1. Breach Detection\n- Check passwords against breach databases\n- HaveIBeenPwned Enterprise API\n- Alert users with compromised credentials\n- Force password changes\n\n2. Weak Password Detection\n- Scan for common passwords\n- Check password strength\n- Identify reused passwords\n- Flag policy violations\n\n3. Authentication Anomalies\n- Impossible travel (login from two distant locations)\n- Unusual access times\n- Failed login patterns\n- Privilege escalation\n\n4. Compliance\n- Password age\n- MFA enrollment status\n- Policy compliance\n- Access certifications\n\n## Employee Offboarding\n\nCritical Security Process:\n\nImmediate Actions (Day of Departure):\n1. Disable all accounts\n2. Revoke MFA devices\n3. Terminate VPN/remote access\n4. Collect hardware (laptops, phones, security keys)\n5. Remove from groups and distribution lists\n\nWithin 24 Hours:\n6. Change shared passwords they had access to\n7. Rotate service account credentials\n8. Review data access logs\n9. Transfer data ownership\n10. Update emergency contacts\n\n## Key Takeaways\n\n- Enterprise password security requires comprehensive policies and tools\n- Modern standards emphasize length over complexity\n- MFA is non-negotiable for critical systems\n- Privileged access management prevents catastrophic breaches\n- Password managers improve security and user experience\n- Service accounts and API keys need special handling\n- Monitoring and compliance are ongoing requirements\n- Offboarding is a critical security process\n- Incident response plans must include password compromise scenarios",
      order: 8,
      courseId: courses[1].id,
      moduleId: course2Modules[2].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "The Human Element",
      content: "# The Human Element in Security\n\n## Why Humans Are Often the Weakest Link\n\nTechnology can create strong defenses, but humans remain the most vulnerable point in any security system. Understanding this is the first step to strengthening security.\n\n### The Reality\n- 95% of cybersecurity breaches are caused by human error\n- Social engineering attacks exploit psychology, not technology\n- Even security-conscious people make mistakes under pressure\n- Awareness alone doesn't prevent compromise\n- Humans have cognitive biases that attackers exploit\n\n## Cognitive Biases Attackers Exploit\n\n### 1. Authority Bias\n- We tend to obey authority figures without question\n- Attacker impersonates CEO, IT admin, or government official\n- Creates pressure to comply quickly\n- Example: \"This is your CEO, I need this done immediately\"\n\n### 2. Urgency and Scarcity\n- \"Act now or lose access!\"\n- \"Limited time offer - only 3 spots left\"\n- Creates panic that bypasses rational thinking\n- Victims act first, think later\n\n### 3. Social Proof\n- \"Everyone else has already updated their credentials\"\n- We follow the crowd, assuming others know what's right\n- Fake testimonials and reviews\n- Mass behavior influences individual decisions\n\n### 4. Reciprocity\n- When someone does us a favor, we feel obligated to return it\n- Attacker offers help or free service\n- Victim feels compelled to comply with requests\n- Example: \"I helped you with IT issue, can you help me access this file?\"\n\n### 5. Trust and Familiarity\n- We trust people and things that seem familiar\n- Official-looking emails, logos, and websites\n- Using names of colleagues or familiar services\n- Leveraging existing relationships\n\n### 6. Confirmation Bias\n- We see what we expect to see\n- If expecting a package, delivery notification seems legitimate\n- Attackers time attacks around events (tax season, holidays)\n- We unconsciously ignore warning signs\n\n## Why Smart People Fall for Attacks\n\n### It's Not About Intelligence\n\n**Common Misconceptions:**\n- \"I'm too smart to fall for phishing\"\n- \"Only careless people get hacked\"\n- \"I would never click that\"\n\n**Reality:**\n- Everyone has cognitive biases\n- One distracted moment is all it takes\n- Sophisticated attacks fool experts\n- Fatigue and stress impair judgment\n- Multitasking reduces attention\n\n### Contributing Factors\n\n**Busy Environments:**\n- Processing hundreds of emails daily\n- Constant interruptions and distractions\n- Pressure to respond quickly\n- Working outside normal hours\n\n**Workplace Culture:**\n- Pressure to be helpful and cooperative\n- Fear of questioning authority\n- Emphasis on speed over security\n- Blame culture discourages reporting\n\n**Technology Overload:**\n- Too many systems and passwords\n- Alert fatigue from constant notifications\n- Complex security procedures\n- Conflicting requirements\n\n## Building Human-Centered Security\n\n### 1. Security Awareness Training\n\nEffective Training Characteristics:\n- Short, frequent sessions (not annual marathons)\n- Relevant, real-world examples\n- Interactive and engaging\n- Role-specific content\n- Continuous reinforcement\n\nWhat Doesn't Work:\n- Long, boring presentations\n- Generic content not relevant to role\n- Fear-based messaging\n- One-time training\n- Compliance checkbox mentality\n\n### 2. Positive Security Culture\n\nCreating the Right Environment:\n- Security as shared responsibility\n- No blame for honest mistakes\n- Encourage questioning and verification\n- Celebrate security-conscious behavior\n- Make security heroes, not shame failures\n\nToxic Security Culture:\n- Blame and punishment\n- \"Security vs. productivity\" mentality\n- Complex, unusable security\n- Lack of leadership support\n- Ignoring user feedback\n\n### 3. Usable Security\n\nSecurity Must Be:\n- Easy to do the right thing\n- Hard to do the wrong thing\n- Not significantly slower than insecure alternative\n- Well-integrated into workflows\n- Designed with users in mind\n\nExamples:\n- Password managers > complex password requirements\n- Single sign-on > multiple passwords\n- Hardware keys > typing codes\n- Automatic updates > manual patching\n\n### 4. Just-in-Time Guidance\n\nProvide Help When Needed:\n- Contextual security tips\n- In-app guidance and warnings\n- Clear explanations of why\n- Easy way to report suspicious activity\n- Fast response to questions\n\n### 5. Psychological Safety\n\nEncourage Reporting:\n- No punishment for clicking phishing link\n- Quick, non-judgmental response\n- Focus on learning, not blame\n- Confidential reporting options\n- Thank people for reporting\n\n## Stress and Decision-Making\n\n### How Stress Affects Security\n\nUnder Stress We:\n- Revert to familiar patterns\n- Skip verification steps\n- Trust authority without question\n- Miss warning signs\n- Make impulsive decisions\n\nCommon Stress Triggers:\n- Tight deadlines\n- After-hours requests\n- Financial pressure\n- Fear of consequences\n- Personal problems\n\n### Defending Under Stress\n\nStrategies:\n- Slow down and breathe\n- Follow checklists and procedures\n- Verify through alternate channel\n- Escalate unusual requests\n- It's okay to say \"let me check on that\"\n\n## Social Engineering Red Flags\n\n### Communication Red Flags\n- Unsolicited contact\n- Urgency and pressure\n- Too good to be true\n- Requests for sensitive information\n- Unusual requests from known contacts\n- Confidentiality demands\n- Bypassing normal procedures\n\n### Behavioral Red Flags\n- Reluctance to provide contact details\n- Defensiveness when questioned\n- Name dropping and authority claims\n- Creating emotional responses\n- Offering unsolicited help\n- Flattery and charm\n\n## Building Resilience\n\n### Individual Level\n\nDevelop These Habits:\n- Slow down for sensitive requests\n- Verify through known channels\n- Question unusual requests (even from authority)\n- Use strong authentication (MFA)\n- Keep systems updated\n- Report suspicious activity\n- Learn from incidents (yours and others)\n\n### Organizational Level\n\nEssential Elements:\n- Regular security training\n- Simulated attacks (phishing, vishing)\n- Clear reporting procedures\n- Fast incident response\n- Transparent communication about threats\n- User feedback integration\n- Continuous improvement\n\n## The Psychology of Reporting\n\n### Why People Don't Report\n\nCommon Reasons:\n- Fear of blame or punishment\n- Embarrassment at being fooled\n- Don't want to bother IT\n- Unsure if it's really suspicious\n- Think they handled it themselves\n- Previous negative experiences\n\n### Encouraging Reporting\n\nMake It:\n- Easy (one-click reporting)\n- Safe (no punishment)\n- Fast (quick acknowledgment)\n- Valued (thank reporters)\n- Educational (feedback on what happened)\n\n## Key Takeaways\n\n- Humans are often the weakest link, but this is fixable\n- Everyone has cognitive biases that attackers exploit\n- Intelligence doesn't protect against social engineering\n- Security must be usable and integrated into workflows\n- Positive culture encourages reporting without fear\n- Stress impairs judgment - slow down for important decisions\n- Training works best when frequent, relevant, and practical\n- Organizations must create psychological safety for security\n- Learn from mistakes - they're opportunities, not failures\n- Security is everyone's responsibility, not just IT's job",
      order: 4,
      courseId: courses[2].id,
      moduleId: course3Modules[0].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Pretexting",
      content: "# Pretexting and Impersonation Attacks\n\n## What is Pretexting?\n\nPretexting is creating a fabricated scenario (the \"pretext\") to manipulate a target into divulging information or performing actions they normally wouldn't.\n\nUnlike simple lies, pretexting involves:\n- Creating elaborate backstory\n- Assuming false identity\n- Building trust over time\n- Multiple interactions\n- Exploiting specific context\n\n## How Pretexting Works\n\n### The Pretext Creation\n\nAttacker Develops:\n1. Believable identity (IT support, vendor, executive)\n2. Plausible scenario (system upgrade, audit, emergency)\n3. Legitimate-sounding reasons for requests\n4. Supporting details and evidence\n5. Answers to likely questions\n\n### Common Pretexts\n\nIT Support Impersonation:\n- \"This is the help desk calling about your computer\"\n- \"We're doing a security audit, need to verify your credentials\"\n- \"System upgrade requires your password\"\n- Why it works: People trust IT, want tech problems fixed\n\nVendor/Partner Impersonation:\n- \"This is your payroll provider, need to verify account details\"\n- \"Supplier calling about outstanding invoice\"\n- \"Partner needs access to shared system\"\n- Why it works: Business relationships require cooperation\n\nExecutive Impersonation:\n- \"This is the CEO's office, need urgent report\"\n- \"CFO needs wire transfer processed immediately\"\n- \"Board member requesting sensitive information\"\n- Why it works: Authority and fear of refusing executives\n\nGovernment/Law Enforcement:\n- \"IRS calling about unpaid taxes\"\n- \"FBI investigating your account\"\n- \"Social Security Administration - your number has been suspended\"\n- Why it works: Fear of legal consequences\n\nThird-Party Services:\n- \"Bank fraud department calling about suspicious charges\"\n- \"Email provider doing security verification\"\n- \"Cloud storage provider - account compromised\"\n- Why it works: Sounds like they're helping you\n\n## Real-World Pretexting Examples\n\n### Example 1: The IT Help Desk Call\n\nScenario:\n- Employee receives call: \"This is John from IT. We detected malware on your computer. I need to remote in to clean it.\"\n- Shows caller ID from company's IT department (spoofed)\n- Knows employee's name, department, some system details (from reconnaissance)\n- Sounds professional and helpful\n- Uses technical jargon to sound credible\n\nWhat Happens:\n- Employee allows remote access\n- Attacker installs malware or steals data\n- Employee thinks they were helped\n\nRed Flags:\n- Unsolicited IT call\n- IT doesn't usually call about individual machines\n- Request for remote access\n- Pressure to act immediately\n\nProper Response:\n- Thank them and hang up\n- Call IT help desk using known number\n- Verify if call was legitimate\n\n### Example 2: The New Employee\n\nScenario:\n- Person shows up claiming to be new employee starting today\n- Has some legitimate-looking paperwork\n- Says HR must have forgotten to notify security\n- Asks to be let in, claims to be nervous about first day\n- Very friendly and personable\n\nWhat Happens:\n- Employee feels bad for \"new hire\" and holds door open (tailgating)\n- Attacker gains physical access to building\n- Can plug in USB devices, access files, steal equipment\n\nRed Flags:\n- No badge or temporary badge\n- Not in security system\n- Appealing to emotions\n- Pressure to bypass security procedures\n\nProper Response:\n- Be polite but firm\n- Direct them to reception/HR\n- Don't hold secure doors open\n- Report to security\n\n### Example 3: The Fake Audit\n\nScenario:\n- Phone call or email: \"Annual compliance audit requires verification of all employee accounts\"\n- Sounds official, references real regulations (SOX, HIPAA, etc.)\n- Requests usernames, last password change dates, security questions\n- Creates urgency: \"Audit report due Friday or company faces fines\"\n\nWhat Happens:\n- Employee provides information to \"help compliance\"\n- Attacker uses info for password reset attacks\n- Company data compromised\n\nRed Flags:\n- Audit wasn't announced\n- Real audits don't ask for passwords or security answers\n- Unusual contact method\n- Urgency and threats\n\nProper Response:\n- Verify through official compliance/legal department\n- Don't provide any credentials\n- Report to security team\n\n## Pretexting Tactics and Techniques\n\n### Building Trust\n\nReciprocity:\n- Offer help or information first\n- Create sense of obligation\n- \"I helped you, now you help me\"\n\nTime Investment:\n- Multiple interactions over time\n- Build relationship gradually\n- Harder to doubt someone you've \"known\" for weeks\n\nShared Identity:\n- \"I'm also in IT/sales/finance\"\n- \"I went to same college\"\n- Creates in-group mentality\n\n### Creating Urgency\n\nTime Pressure:\n- \"Need this in 10 minutes\"\n- \"System going down soon\"\n- \"Deadline is today\"\n\nConsequences:\n- \"You'll be in trouble if...\"\n- \"Company will lose money if...\"\n- \"Audit will fail if...\"\n\nEmergency:\n- \"CEO stuck at airport\"\n- \"Critical system failure\"\n- \"Security incident\"\n\n### Bypassing Verification\n\nConfidentiality:\n- \"This is confidential, don't tell anyone\"\n- \"Direct order from CEO\"\n- Prevents victim from verifying\n\nComplexity:\n- Overwhelming with technical details\n- Making victim feel inadequate\n- \"You wouldn't understand the technical side\"\n\nAuthority:\n- Name dropping executives\n- Using confident tone\n- Expecting compliance\n\n## Defending Against Pretexting\n\n### Individual Defense\n\nVerification is Key:\n- Verify identity through independent channel\n- Use known phone numbers (not ones provided)\n- Check employee directory\n- Confirm with supervisor\n- When in doubt, verify again\n\nChallenge Requests:\n- Ask questions to verify legitimacy\n- Request callback number (look it up yourself)\n- Ask for ticket number or reference\n- Verify through official channels\n\nTrust But Verify:\n- Politeness doesn't require compliance\n- It's okay to say \"let me call you back\"\n- Don't feel bad about following procedures\n- Better to double-check than be sorry\n\n### Organizational Defense\n\nClear Procedures:\n- Verification process for sensitive requests\n- Multiple-person approval for critical actions\n- Out-of-band verification requirements\n- Documented escalation paths\n\nTraining:\n- Regular awareness training\n- Simulated pretexting attacks\n- Role-specific scenarios\n- Share real examples\n\nTechnical Controls:\n- Caller ID can't be trusted alone\n- Require multiple forms of verification\n- Audit trails for access requests\n- Alert on unusual requests\n\nCultural Elements:\n- Encourage verification without fear\n- No punishment for following procedures\n- Praise people who catch pretexting\n- \"Security stops here\" mentality\n\n## Special Considerations\n\n### Remote Work\n\nIncreased Risk:\n- Harder to verify identity remotely\n- Video can be deepfaked\n- Less casual verification\n- Isolated workers more vulnerable\n\nAdditional Protections:\n- Video verification for sensitive requests\n- Use corporate communication channels\n- Regular team check-ins\n- Clear remote work security procedures\n\n### Physical Pretexting\n\nTailgating:\n- Following authorized person through secure door\n- \"Forgot my badge\"\n- \"Hands are full\"\n- Very common and effective\n\nUniform/Badge:\n- Fake delivery uniform\n- Printed fake badge\n- \"Here to fix the copier\"\n- People trust uniforms\n\nDumpster Diving:\n- Searching trash for information\n- Finding documents, notes, USB drives\n- Used to build convincing pretext\n- Prevention: shred sensitive documents\n\n## Warning Signs of Pretexting\n\nCombined Red Flags:\n- Story doesn't quite add up\n- Pushy or defensive when questioned\n- Won't provide verifiable details\n- Creates time pressure\n- Appeals to emotion\n- Requests unusual actions\n- Bypassing normal procedures\n- Too much knowledge or too little\n- Story changes when challenged\n\n## Key Takeaways\n\n- Pretexting uses elaborate fabricated scenarios to manipulate targets\n- Attackers research and prepare detailed backstories\n- Common pretexts: IT support, vendors, executives, authorities\n- Building trust and urgency are key tactics\n- Always verify identity through independent channels\n- It's okay (and necessary) to say \"let me verify that\"\n- Organizations need clear verification procedures\n- Train employees to recognize and resist pretexting\n- Trust your instincts - if something feels off, verify\n- No legitimate organization will punish you for following security procedures",
      order: 5,
      courseId: courses[2].id,
      moduleId: course3Modules[1].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Physical Social Engineering",
      content: "# Physical Social Engineering Tactics\n\n## What is Physical Social Engineering?\n\nPhysical social engineering involves in-person manipulation to gain unauthorized access to buildings, computer systems, or sensitive information. It bypasses technical security by exploiting human behavior.\n\n### Why It Matters\n\nEven with strong digital security:\n- Physical access often defeats all technical controls\n- Most attacks combine physical and digital techniques\n- Physical security is often the weakest link\n- One person's mistake can compromise entire organization\n\n## Common Physical Social Engineering Tactics\n\n### 1. Tailgating (Piggybacking)\n\nWhat It Is:\n- Following authorized person through secure door\n- Bypassing badge readers and access controls\n- One of the most common attacks\n\nHow It Works:\n- Wait near secure entrance\n- Follow closely behind authorized employee\n- Take advantage of politeness (people hold doors)\n- May carry boxes or food to appear legitimate\n\nCommon Scenarios:\n- \"My badge isn't working, can you let me in?\"\n- \"I'm late for a meeting\"\n- \"I'm here for delivery\"\n- Simply walking confidently behind someone\n\nPrevention:\n- Never hold secure doors for others\n- Require everyone to badge individually\n- Install mantrap doors (only one person at a time)\n- Challenge unfamiliar faces politely\n- Report tailgating attempts\n\n### 2. Shoulder Surfing\n\nWhat It Is:\n- Observing someone entering sensitive information\n- Watching over shoulder or from distance\n- Capturing passwords, PINs, access codes\n\nHow It Works:\nDirect Observation:\n- Standing nearby while victim types password\n- In cafes, airports, offices, public spaces\n- May use excuse to stand close\n\nTechnical Observation:\n- Hidden cameras\n- Binoculars or telephoto lenses\n- Reflection in windows or glasses\n- Thermal imaging (heat from keypress)\n\nWhat They Capture:\n- Passwords and PINs\n- Badge codes\n- Confidential documents\n- Screen contents\n- Keyboard patterns\n\nPrevention:\n- Be aware of surroundings\n- Shield screen and keyboard\n- Use privacy screens on laptops\n- Avoid sensitive tasks in public\n- Change passwords after public entry\n- Use biometric or hardware keys when possible\n\n### 3. Dumpster Diving\n\nWhat It Is:\n- Searching through trash for valuable information\n- Legal in many jurisdictions\n- Provides information for further attacks\n\nWhat Attackers Find:\n- Documents with passwords written down\n- Internal phone directories\n- Org charts and employee lists\n- Financial records\n- Hardware (USB drives, old hard drives)\n- Sticky notes with credentials\n- Network diagrams\n- Vendor information\n- Project details\n\nHow It's Used:\n- Build convincing pretexts\n- Find initial access credentials\n- Learn about org structure\n- Identify targets for attacks\n- Gather intelligence for social engineering\n\nPrevention:\n- Shred all sensitive documents\n- Secure disposal bins\n- Wipe or destroy storage media\n- Never throw credentials away\n- Clean desk policy\n- Regular security reminders\n- Consider locked trash receptacles\n\n### 4. Impersonation with Props\n\nWhat It Is:\n- Using physical props to appear legitimate\n- Exploiting trust in uniforms and badges\n\nCommon Impersonations:\n\nDelivery Person:\n- Uniform and clipboard\n- Real or fake packages\n- \"Need signature for delivery\"\n- Gains entry to secure areas\n\nMaintenance/Repair:\n- \"Here to fix the copier/AC/internet\"\n- Tool belt and equipment\n- People hesitate to question workers\n- Can access server rooms, offices\n\nInterviewer/Visitor:\n- Professional attire\n- Scheduled \"appointment\"\n- \"I'm here for interview with HR\"\n- Receptionist may grant access\n\nContractor/Consultant:\n- Laptop and professional appearance\n- \"Working on project with [real employee]\"\n- May have fake business cards\n- Blends in with legitimate workers\n\nInspector/Auditor:\n- Official-looking credentials\n- \"Annual safety inspection\"\n- \"Compliance audit\"\n- Authority commands cooperation\n\nPrevention:\n- Verify all visitors against scheduled appointments\n- Issue temporary badges for all visitors\n- Escort visitors at all times\n- Challenge anyone without proper badge\n- Call to verify unexpected service calls\n- Train reception and security staff\n- Regular contractor verification\n\n### 5. Badge Cloning\n\nWhat It Is:\n- Copying RFID access badges\n- Using cloned badge to gain access\n- Often combined with other tactics\n\nHow It Works:\n- Portable RFID readers (pocket-sized)\n- Can read badge from close proximity\n- Clone badge to blank card\n- Use cloned badge for access\n\nAttack Scenarios:\n- Bump into victim to get close\n- Read badge through clothing/bag\n- In elevator or crowded spaces\n- From several feet away with good equipment\n\nPrevention:\n- RFID-blocking badge holders\n- Keep badge not visible when not in use\n- Use badges with encryption\n- Implement additional authentication\n- Alert on badge cloning attempts (if supported)\n- Regular badge audits\n\n### 6. USB Drop Attacks\n\nWhat It Is:\n- Leaving infected USB drives for victims to find\n- Exploits curiosity and helpfulness\n- Very effective attack vector\n\nHow It Works:\nPreparation:\n- Load USB with malware\n- Label attractively (\"Employee Salaries\", \"Confidential\")\n- Drop in parking lot, lobby, break room\n- Sometimes mailed to targets\n\nAttack Execution:\n- Victim finds USB\n- Curiosity or helpfulness prompts them to plug it in\n- \"Let me see what this is\"\n- \"Someone lost this, let me find the owner\"\n- Malware auto-executes or tricks user\n- Network compromised\n\nPrevention:\n- Never plug in found USB drives\n- Report found devices to security\n- Disable USB autorun\n- Use endpoint protection\n- Regular security awareness training\n- Controlled USB port policies\n\n## Advanced Physical Social Engineering\n\n### Baiting\n\nWhat It Is:\n- Leaving something enticing to lure victims\n- Physical or digital bait\n- Exploits greed, curiosity, or helpfulness\n\nExamples:\n- Free USB drive with logo: \"Conference 2024 - Presentations\"\n- CD labeled \"Executive Salary Information - Confidential\"\n- QR codes: \"Scan for free WiFi\" (goes to malicious site)\n- Infected charging cables left in public\n\n### Quid Pro Quo\n\nWhat It Is:\n- Offering service in exchange for information\n- \"I'll help you if you help me\"\n- Creates sense of obligation\n\nExamples:\n- \"I'm from IT doing system upgrades. Can I remote into your computer?\"\n- \"I'll fix your printer if you let me use your login\"\n- \"Free technical support - just need to verify your credentials\"\n\n### Water Cooler / Break Room Reconnaissance\n\nWhat It Is:\n- Casual eavesdropping\n- Gathering information from overheard conversations\n- People talk freely in \"safe\" areas\n\nWhat Attackers Learn:\n- Passwords discussed verbally\n- Project names and details\n- Employee names and roles\n- System names and structure\n- Upcoming events or changes\n- Vacation schedules\n\nPrevention:\n- Assume public spaces aren't private\n- Don't discuss sensitive information casually\n- Meeting rooms for confidential discussions\n- Awareness that anyone could be listening\n\n## Defending Against Physical Social Engineering\n\n### Individual Actions\n\nBe Vigilant:\n- Challenge unfamiliar faces politely\n- Don't hold doors for others\n- Shield sensitive information\n- Secure documents and devices\n- Report suspicious behavior\n\nTrust Your Instincts:\n- If something feels off, it probably is\n- Better to offend than compromise security\n- It's okay to ask questions\n- Security is everyone's responsibility\n\n### Organizational Measures\n\nPhysical Security:\n- Badge access to sensitive areas\n- Reception desk for all visitors\n- Visitor badges and escorts\n- Security cameras\n- Mantrap doors\n- Secure disposal\n- Clean desk policy\n\nPolicies and Procedures:\n- Clear visitor management process\n- Challenge strangers policy\n- Verification procedures\n- Incident reporting\n- Regular security audits\n- Contractor verification\n\nTraining and Awareness:\n- Regular security training\n- Physical security scenarios\n- Simulated attacks\n- Incident examples\n- Clear communication channels\n- Positive reinforcement\n\n### Reception and Security Staff\n\nCritical First Line:\n- Verify all visitors\n- Issue proper badges\n- Log visitor information\n- Require escort for sensitive areas\n- Challenge suspicious behavior\n- Trained to recognize social engineering\n\n## Red Flags for Physical Social Engineering\n\nWarning Signs:\n- No badge or improper badge\n- Unfamiliar face in secure area\n- Carrying unusual items for role\n- Resistant to following procedures\n- Overly friendly or pushy\n- Creating urgency\n- Doesn't know basic information\n- Story doesn't add up\n- Appealing to emotions\n- Name dropping without verification\n\n## Key Takeaways\n\n- Physical access often defeats all technical security\n- Tailgating and shoulder surfing are extremely common\n- Never plug in found USB drives\n- Always challenge unfamiliar people politely\n- Physical security is everyone's responsibility\n- Trust your instincts - if something feels off, verify\n- Proper disposal prevents information leakage\n- Reception and security staff need specialized training\n- Combine physical and technical security measures\n- Regular awareness training prevents physical attacks",
      order: 6,
      courseId: courses[2].id,
      moduleId: course3Modules[1].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Verification Habits",
      videoUrl: "https://www.youtube.com/watch?v=lc7scxvKQOo",
      content: "# Building Verification Habits\n\n## Why Verification Matters\n\nVerification is the single most effective defense against social engineering. Before acting on any sensitive request, verify it's legitimate through an independent channel.\n\n### The Cost of Not Verifying\n\nOne moment of trust without verification can lead to:\n- Financial fraud (wire transfers, payment scams)\n- Data breaches (credentials stolen, malware installed)\n- Insider threats (unauthorized access granted)\n- Reputational damage\n- Regulatory penalties\n- Legal liability\n\n### The Power of Verification\n\nSimple verification prevents:\n- CEO fraud (fake executive requests)\n- Vendor invoice scams\n- Phishing attacks\n- Pretexting\n- Physical access attacks\n- Most social engineering\n\n## What is Out-of-Band Verification?\n\nOut-of-band verification means verifying through a different communication channel than the one used for the request.\n\n### Why It's Critical\n\nIf request comes via email:\n- Don't reply to that email\n- Don't click links in the email\n- Don't call numbers in the email\n\nInstead:\n- Call using known phone number\n- Visit website directly (type URL)\n- Use company directory\n- Walk to person's office\n- Use internal messaging system\n\nThis prevents attacker from continuing deception through same compromised channel.\n\n## Verification Techniques\n\n### 1. Phone Verification\n\nBest Practices:\n- Use phone number from corporate directory\n- Look up number independently (don't use one provided)\n- Call main number and ask to be transferred\n- Save verified numbers in contacts\n- Video call if possible for high-value requests\n\nExample:\n- Receive email from CFO requesting wire transfer\n- Don't reply to email\n- Look up CFO's number in directory\n- Call and verify request verbally\n- If can't reach, escalate to supervisor\n\n### 2. In-Person Verification\n\nMost Secure:\n- Walk to person's office\n- Face-to-face confirmation\n- Verify identity visually\n- Can't be spoofed (yet - beware deepfakes)\n\nWhen to Use:\n- Very high-value requests\n- Unusual or suspicious requests\n- First-time sensitive actions\n- When other channels unavailable\n\n### 3. Multi-Channel Verification\n\nUsing Multiple Channels:\n- Email request → Phone verification\n- Phone call → Email confirmation\n- Chat message → In-person verification\n- Increases confidence in legitimacy\n\nExample:\n- Receive email about urgent wire transfer\n- Call using known number to verify\n- Request email confirmation from verified address\n- Both channels confirm = higher confidence\n\n### 4. Callback Verification\n\nFor Incoming Calls:\n- Don't trust caller ID (can be spoofed)\n- Thank caller and hang up\n- Look up official number independently\n- Call back to verify\n- Ask for reference number or ticket\n\nExample:\n- Receive call from \"bank fraud department\"\n- Thank them for calling\n- Hang up\n- Google bank's official number\n- Call back and ask about the issue\n\n## Building Verification Into Workflows\n\n### For Sensitive Requests\n\nAlways Verify When:\n- Wire transfers or payments\n- Credential changes\n- Access grants\n- Confidential information requests\n- Unusual requests from executives\n- First-time actions\n- Requests that bypass normal procedures\n\nVerification Checklist:\n1. Pause - Don't act immediately\n2. Identify - Who is requesting?\n3. Verify - Use independent channel\n4. Confirm - Get explicit confirmation\n5. Document - Record verification\n6. Proceed - Only after verification\n\n### Financial Transactions\n\nMulti-Step Verification:\n1. Initial request received\n2. Verify requestor via phone\n3. Confirm recipient details\n4. Second person approval\n5. Final executive sign-off\n6. Transaction processing\n\nPrevents:\n- Business Email Compromise (BEC)\n- CEO fraud\n- Vendor invoice scams\n- Payment redirection\n\n### Credential Requests\n\nNever Provide Without Verification:\n- Passwords\n- Security questions\n- Account numbers\n- Personal information\n- Multi-factor codes\n\nLegitimate Organizations:\n- Will never ask for passwords\n- Use official portals for credentials\n- Don't request via email or phone\n- Have documented processes\n\nIf Asked:\n- Verify through official channels\n- Report to security team\n- Don't provide any credentials\n- Change passwords if suspicious\n\n## Overcoming Barriers to Verification\n\n### \"But It's Urgent!\"\n\nResponse:\n- Urgency is a red flag, not a reason to skip verification\n- Real emergencies can wait 2 minutes for verification\n- If it's truly urgent, verification will confirm that\n- Better 2-minute delay than costly mistake\n\nPractice Saying:\n- \"Let me verify this quickly\"\n- \"I need to confirm through official channels\"\n- \"Our policy requires verification\"\n- \"I'll call you back in 2 minutes\"\n\n### \"But It's the CEO!\"\n\nResponse:\n- Executives are targets of impersonation\n- Real executives appreciate security-conscious behavior\n- One phone call confirms legitimacy\n- Better to verify than to enable fraud\n\nPractice Saying:\n- \"I'll call to confirm before processing\"\n- \"Standard procedure is verification\"\n- \"Let me reach out to confirm this is you\"\n\n### \"But It Seems Rude!\"\n\nResponse:\n- Professional verification isn't rude\n- Security is everyone's responsibility\n- Legitimate people understand\n- Better polite verification than apologizing for compromise\n\nPractice Saying:\n- \"Just following our security procedures\"\n- \"I need to verify before processing\"\n- \"Let me confirm this is legitimate\"\n- Frame it as policy, not personal distrust\n\n### \"But I'm Too Busy!\"\n\nResponse:\n- 2 minutes verification vs. hours recovering from breach\n- Verification is part of the job\n- Saves time in long run\n- Prevents being even busier fixing problems\n\nTime Investment:\n- Verification: 2-5 minutes\n- Recovery from successful attack: Days to weeks\n- Cost comparison: Minimal vs. Catastrophic\n\n## Organizational Support for Verification\n\n### Policies That Help\n\nClear Requirements:\n- Mandatory verification for sensitive actions\n- Documented procedures\n- Multiple-person approval\n- Time buffers for verification\n- No \"emergency bypass\" without specific authorization\n\nEmpowerment:\n- Employees can't be punished for verifying\n- Praised for following procedures\n- Time for verification is built into processes\n- Clear escalation paths\n\n### Technical Controls\n\nSupporting Verification:\n- Directory of verified contact information\n- Secure internal communication channels\n- Transaction holds for new recipients\n- Out-of-band authorization systems\n- Audit trails\n\n### Cultural Support\n\nLeadership Must:\n- Model verification behavior\n- Praise employees who verify\n- Never pressure to skip verification\n- Accept delays for security\n- Respond positively to verification requests\n\n## Creating Verification Habits\n\n### Start Small\n\nBegin With:\n- Verify one type of request consistently\n- Financial transactions\n- Password changes\n- Access grants\n- Build habit gradually\n\n### Practice Scenarios\n\nRegular Training:\n- Simulated requests requiring verification\n- Practice verification conversations\n- Role-play challenging situations\n- Learn verification phrases\n\n### Make It Routine\n\nHabit Building:\n- Same verification method each time\n- Checklist approach\n- Visual reminders\n- Team accountability\n- Celebrate successes\n\n## Verification Success Stories\n\nExample 1: Prevented Wire Fraud\n- Finance employee receives urgent email from CEO\n- Requests $50,000 wire transfer\n- Employee follows procedure: calls CEO\n- CEO knows nothing about it\n- Phishing attempt prevented\n- Employee praised for following policy\n- Company saved $50,000\n\nExample 2: Caught Impersonation\n- IT receives urgent request for remote access\n- Caller claims to be executive traveling\n- Help desk follows verification procedure\n- Calls executive's known number\n- Executive not traveling, knows nothing about it\n- Attempted breach prevented\n- Procedure works as designed\n\n## Key Takeaways\n\n- Verification is the single most effective defense against social engineering\n- Always verify through independent channel (out-of-band)\n- Urgency is a red flag, not a reason to skip verification\n- It's professional, not rude, to verify requests\n- Organizations must support verification with policy and culture\n- Practice verification until it becomes automatic habit\n- Never provide credentials without verification\n- When in doubt, verify\n- Two minutes verification prevents days of recovery\n- Real executives and colleagues will appreciate your diligence",
      order: 7,
      courseId: courses[2].id,
      moduleId: course3Modules[2].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Security-Aware Culture",
      videoUrl: "https://www.youtube.com/watch?v=qwFnVqQfkQI",
      content: "# Building a Security-Aware Culture\n\n## What is Security-Aware Culture?\n\nA security-aware culture is an organizational environment where cybersecurity is everyone's responsibility, security best practices are ingrained in daily operations, and employees naturally consider security implications in their decisions.\n\nNot just: Compliance with policies\nInstead: Internalized security mindset\n\n## Why Culture Matters\n\n### Technical Controls Alone Aren't Enough\n\nBest firewall in the world can't stop:\n- Employee clicking phishing link\n- Insider using weak passwords\n- Staff ignoring security warnings\n- Users bypassing security controls\n\n**Human element** is the weakest link.\n\n### Culture Creates Resilience\n\nStrong security culture results in:\n- Fewer successful attacks\n- Faster incident detection\n- Better incident response\n- Reduced business risk\n- Improved compliance\n\n**Study finding:** Organizations with strong security culture experience 50% fewer security incidents.\n\n### Security is Everyone's Job\n\nTraditional view:\n- Security = IT security team's job\n- Others just follow rules\n\nModern reality:\n- Every employee is a potential target\n- Every action has security implications\n- Collective responsibility for protection\n\n## Elements of Security-Aware Culture\n\n### 1. Leadership Commitment\n\n**Tone from the Top:**\nSecurity culture starts with executives:\n- CEO discusses security publicly\n- Board oversight of cybersecurity\n- Security included in strategic planning\n- Budget allocated appropriately\n\n**Executive Actions:**\n- Follow same security policies as employees\n- Participate in security training\n- No exemptions for C-suite\n- Model secure behaviors\n\n**Visible Support:**\n- Security team reports to executive level\n- CISO has board access\n- Security failures addressed seriously\n- Security successes celebrated\n\n### 2. Clear Policies and Expectations\n\n**Well-Defined Policies:**\n- Written, accessible, understandable\n- Regularly updated\n- Explains \"why\" not just \"what\"\n- Available in multiple languages\n\n**Reasonable Requirements:**\n- Balance security with usability\n- Consider employee workflow\n- Provide necessary tools\n- Explain business rationale\n\n**Consistent Enforcement:**\n- Same rules for everyone\n- Violations addressed fairly\n- No special exemptions\n- Regular compliance audits\n\n### 3. Continuous Education\n\n**Beyond Annual Training:**\n- Ongoing awareness campaigns\n- Monthly security tips\n- Real-time alerts about current threats\n- Lunch-and-learn sessions\n\n**Engaging Content:**\n- Interactive, not boring slideshows\n- Real-world examples\n- Relevant to job roles\n- Gamification elements\n\n**Role-Specific Training:**\n- Finance: BEC, invoice fraud\n- HR: PII protection, social engineering\n- Developers: Secure coding\n- Executives: Whaling attacks\n\n### 4. Open Communication\n\n**Report Without Fear:**\n- Blameless incident reporting\n- \"See something, say something\"\n- Mistakes are learning opportunities\n- No punishment for falling for phishing simulation\n\n**Two-Way Dialogue:**\n- Employees can question policies\n- Feedback improves security\n- Security team accessible\n- Regular town halls on security\n\n**Transparency:**\n- Share threat intelligence\n- Explain why policies exist\n- Communicate incidents appropriately\n- Celebrate security wins\n\n### 5. Positive Reinforcement\n\n**Reward Secure Behavior:**\n- Recognize employees who report phishing\n- Certificates for training completion\n- Gamification (security champions)\n- Public acknowledgment\n\n**Make Security Easy:**\n- Provide password managers\n- Single sign-on reduces password fatigue\n- Security tools that don't hinder productivity\n- Clear processes for secure actions\n\n**Celebrate Success:**\n- Share blocked attack stories\n- Highlight employee vigilance\n- Team recognition for improvements\n- Security awareness month events\n\n## Building Security Culture: Step-by-Step\n\n### Phase 1: Assessment (Month 1-2)\n\n**Understand Current State:**\n- Employee surveys on security awareness\n- Phishing simulation baseline\n- Policy compliance audit\n- Incident analysis (root causes)\n\n**Identify Gaps:**\n- Knowledge gaps (what employees don't know)\n- Behavioral gaps (what they know but don't do)\n- Tool gaps (missing security tools)\n- Policy gaps (outdated or missing policies)\n\n**Benchmark:**\n- Industry standards\n- Peer organizations\n- Best practices frameworks\n\n### Phase 2: Foundation (Month 3-6)\n\n**Leadership Buy-In:**\n- Present business case to executives\n- Demonstrate ROI of security culture\n- Get budget commitment\n- Establish governance\n\n**Policy Refresh:**\n- Update outdated policies\n- Simplify language\n- Add \"why\" explanations\n- Ensure accessibility\n\n**Initial Training:**\n- Mandatory security awareness for all\n- Role-specific training\n- Phishing simulations begin\n- Baseline metrics established\n\n### Phase 3: Engagement (Month 7-12)\n\n**Awareness Campaigns:**\n- Monthly security themes\n- Posters, emails, intranet articles\n- Contests and challenges\n- Security champions program\n\n**Regular Communication:**\n- Weekly security tips\n- Threat alerts\n- Success stories\n- Lessons learned from incidents\n\n**Make It Personal:**\n- Home cybersecurity tips\n- Protect families online\n- Personal device security\n- Build security habit at home and work\n\n### Phase 4: Reinforcement (Ongoing)\n\n**Continuous Improvement:**\n- Quarterly assessments\n- Refine based on metrics\n- Update for new threats\n- Evolve policies as needed\n\n**Recognition Programs:**\n- Monthly security champion\n- Team competitions\n- Peer recognition\n- Executive acknowledgment\n\n**Measure Progress:**\n- Phishing click rates declining\n- Increased incident reporting\n- Faster threat detection\n- Reduced policy violations\n\n## Common Challenges and Solutions\n\n### Challenge 1: \"Security is Inconvenient\"\n\n**Problem:** Employees bypass security because it slows them down.\n\n**Solutions:**\n- Make security tools easy to use\n- Single sign-on reduces password burden\n- Password managers provided\n- Streamline approval processes\n- Explain trade-offs honestly\n\n### Challenge 2: \"It Won't Happen to Us\"\n\n**Problem:** Employees don't believe they're at risk.\n\n**Solutions:**\n- Share real attack attempts on your organization\n- Industry-specific examples\n- Local news stories\n- Personalized threat modeling\n- Demonstrate how easy attacks are\n\n### Challenge 3: \"I'm Too Busy\"\n\n**Problem:** Security training seen as waste of time.\n\n**Solutions:**\n- Short, bite-sized training (5-10 minutes)\n- Just-in-time learning\n- Integrate into existing workflows\n- Demonstrate time saved preventing incidents\n- Make training engaging, not tedious\n\n### Challenge 4: \"IT's Job, Not Mine\"\n\n**Problem:** Employees don't feel responsible.\n\n**Solutions:**\n- \"Everyone is a security professional\"\n- Share stories of employee-caught threats\n- Explain individual impact\n- Personal stake (protect own data too)\n- Empower with simple actions\n\n### Challenge 5: \"Policies Are Unclear\"\n\n**Problem:** Employees don't understand requirements.\n\n**Solutions:**\n- Plain language policies\n- Visual guides and infographics\n- FAQs and examples\n- Easily accessible\n- Help desk support\n\n## Measuring Security Culture\n\n### Quantitative Metrics\n\n**Phishing Simulations:**\n- Click rate trending down\n- Reporting rate trending up\n- Time to report decreasing\n\n**Incident Metrics:**\n- User-reported incidents increasing (good)\n- Successful attacks decreasing (good)\n- Time to detect decreasing\n- Dwell time decreasing\n\n**Training Metrics:**\n- Completion rates\n- Assessment scores\n- Time to complete\n- Engagement (clicks, questions)\n\n**Policy Compliance:**\n- MFA adoption rate\n- Password manager usage\n- Timely software updates\n- Policy acknowledgment rates\n\n### Qualitative Metrics\n\n**Surveys:**\n- \"Do you know how to report suspicious emails?\"\n- \"Do you feel security is important to leadership?\"\n- \"Do you have the tools you need to work securely?\"\n\n**Interviews:**\n- Focus groups with employees\n- Exit interviews (security mentioned?)\n- Security champion feedback\n\n**Observations:**\n- Clean desk policy compliance\n- Locked screens when away\n- Secure disposal practices\n- Visitor escort compliance\n\n## Security Champions Program\n\n### What Are Security Champions?\n\nVolunteers from business units who:\n- Advocate for security in their teams\n- Act as liaison to security team\n- Provide feedback on policies\n- Help with awareness campaigns\n\n**Not:** Additional IT security staff\n**Instead:** Culturally embedded advocates\n\n### Benefits\n\n**For Organization:**\n- Security representation in every team\n- Faster policy rollout\n- Better policy design (real-world input)\n- Increased awareness\n\n**For Champions:**\n- Career development\n- Security knowledge\n- Leadership opportunity\n- Resume builder\n\n### Implementing Champions Program\n\n**Selection:**\n- Volunteers from each department\n- Mix of roles and seniority\n- Passionate about security\n- Good communicators\n\n**Training:**\n- Extended security training\n- Regular briefings on threats\n- Policy development input\n- Incident response basics\n\n**Support:**\n- Regular meetings\n- Direct line to security team\n- Resources for awareness\n- Recognition from leadership\n\n**Activities:**\n- Run team training sessions\n- Share security tips\n- Review policies for usability\n- Participate in incident response\n- Plan Security Awareness Month\n\n## Making Security Part of Daily Life\n\n### Integration Points\n\n**New Employee Onboarding:**\n- Day 1: Security training\n- Week 1: MFA setup, password manager\n- Month 1: Role-specific training\n- Ongoing: Security champion introduction\n\n**Regular Touchpoints:**\n- Monday: Security tip in company newsletter\n- Monthly: All-hands security update\n- Quarterly: Executive security briefing\n- Annually: Security Awareness Month\n\n**Process Integration:**\n- Code reviews include security checks\n- Product launches include security review\n- Vendor onboarding includes security assessment\n- Change management includes security impact\n\n### Physical Environment\n\n**Visible Reminders:**\n- Posters in common areas\n- Screensavers with security tips\n- Badge holders with tips\n- Conference room reminders\n- Bathroom stall posters (captive audience!)\n\n**Secure Design:**\n- Visitor badges clearly marked\n- Locked doors where appropriate\n- Clean desk policy visual cues\n- Shred bins conveniently located\n- Password manager shortcuts on desktops\n\n## Key Takeaways\n\n- Security culture means everyone naturally considers security, not just follows rules\n- Culture starts from top - executives must visibly support and follow security policies\n- Technical controls alone fail without strong security culture\n- Organizations with strong security culture have 50% fewer incidents\n- No punishment for mistakes - blameless reporting encourages vigilance\n- Make security easy - provide tools like password managers, SSO\n- Continuous education better than annual training - monthly tips and updates\n- Security champions in each team embed security throughout organization\n- Measure culture with phishing click rates, incident reporting, and surveys\n- Positive reinforcement - recognize and reward secure behavior\n- Balance security with usability - unreasonable policies get bypassed\n- Takes 12-18 months to establish strong security culture\n- Security is everyone's job, not just IT security team",
      order: 8,
      courseId: courses[2].id,
      moduleId: course3Modules[2].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "HTTPS and Certificates",
      videoUrl: "https://www.youtube.com/watch?v=hExRDVZHhig",
      content: "# Understanding HTTPS and Certificates\n\n## What is HTTPS?\n\nHTTPS (Hypertext Transfer Protocol Secure) is the encrypted version of HTTP. It protects the data transmitted between your browser and a website.\n\n### HTTP vs HTTPS\n\nHTTP (Not Secure):\n- Data transmitted in plain text\n- Anyone on the network can intercept and read\n- Passwords, credit cards, personal info exposed\n- No verification of website identity\n- Modern browsers flag as \"Not Secure\"\n\nHTTPS (Secure):\n- Data encrypted using TLS/SSL\n- Intercepted data appears as gibberish\n- Protects against eavesdropping\n- Verifies website identity\n- Shows padlock icon in browser\n\n## Why HTTPS Matters\n\n### Protection Against Threats\n\nMan-in-the-Middle Attacks:\n- Attacker intercepts communication\n- Without HTTPS: Can read and modify data\n- With HTTPS: Only sees encrypted data\n\nSession Hijacking:\n- Attacker steals session cookies\n- Without HTTPS: Cookies transmitted in clear text\n- With HTTPS: Cookies encrypted in transit\n\nData Theft:\n- Credentials and sensitive data exposed\n- Public WiFi especially vulnerable\n- HTTPS encrypts all communication\n\n### Trust and Verification\n\nHTTPS Provides:\n- Encryption: Data privacy during transmission\n- Authentication: Confirms website identity\n- Integrity: Ensures data isn't tampered with\n\n## SSL/TLS Certificates\n\n### What Are Certificates?\n\nDigital certificates issued by trusted Certificate Authorities (CAs) that verify website ownership and enable HTTPS.\n\nCertificate Contains:\n- Domain name\n- Organization details\n- Certificate Authority\n- Expiration date\n- Public key for encryption\n\n### Types of Certificates\n\nDomain Validation (DV):\n- Verifies domain ownership only\n- Quickest and cheapest\n- Shows padlock, no organization name\n- Good for blogs, personal sites\n\nOrganization Validation (OV):\n- Verifies organization identity\n- Shows organization name in certificate\n- More trust than DV\n- Good for business sites\n\nExtended Validation (EV):\n- Strictest verification process\n- Previously showed green bar with company name\n- Now shows company name in certificate details\n- Highest trust level\n- Used by banks, e-commerce\n\nWildcard Certificates:\n- Covers main domain and all subdomains\n- Example: *.example.com covers blog.example.com, shop.example.com\n- Convenient for multiple subdomains\n\n## Checking HTTPS and Certificates\n\n### Browser Indicators\n\nPadlock Icon:\n- Closed padlock: Connection is secure\n- Padlock with warning: Mixed content (some insecure elements)\n- No padlock or \"Not Secure\": No HTTPS\n\nGreen Indicators (older browsers):\n- Green padlock\n- Green address bar (EV certificates)\n- Company name displayed\n\nRed Warnings:\n- Invalid certificate\n- Expired certificate\n- Self-signed certificate\n- Certificate name mismatch\n\n### Viewing Certificate Details\n\nChrome/Edge:\n1. Click padlock icon\n2. Click \"Connection is secure\"\n3. Click \"Certificate is valid\"\n4. View certificate details\n\nFirefox:\n1. Click padlock icon\n2. Click \"Connection secure\"\n3. Click \"More information\"\n4. Click \"View Certificate\"\n\nWhat to Check:\n- Issued to: Matches the domain you're visiting\n- Issued by: Recognized Certificate Authority\n- Valid from/to: Certificate not expired\n- Fingerprint: Unique identifier\n\n## Certificate Warnings\n\n### Common Certificate Errors\n\nCertificate Expired:\n- Certificate validity period ended\n- Needs renewal\n- Could indicate abandoned site\n- Don't proceed unless you trust the site\n\nName Mismatch:\n- Certificate issued for different domain\n- Visiting example.com but cert is for different-site.com\n- Could indicate phishing attempt\n- Do not proceed\n\nSelf-Signed Certificate:\n- Not issued by trusted CA\n- Common for internal corporate sites\n- Can't verify identity\n- Only proceed if you absolutely trust the organization\n\nRevoked Certificate:\n- Certificate was canceled by CA\n- Could indicate compromise\n- Do not proceed\n\n### When to Ignore Warnings\n\nGenerally Never:\n- On public internet sites\n- E-commerce or banking\n- Sites requesting personal information\n- Unknown or suspicious sites\n\nPossibly Acceptable:\n- Corporate intranet with known self-signed certs\n- Local development environment\n- After verifying with IT department\n- When you set it up yourself\n\n## Certificate Authorities\n\n### Trusted CAs\n\nMajor Certificate Authorities:\n- Let's Encrypt (free, automated)\n- DigiCert\n- GlobalSign\n- Sectigo (formerly Comodo)\n- GoDaddy\n\nBrowser Trust:\n- Browsers maintain list of trusted CAs\n- Certificates from trusted CAs automatically accepted\n- Unknown CAs trigger warnings\n\n### Let's Encrypt Revolution\n\nFree Certificates:\n- Automated issuance and renewal\n- Domain validated\n- 90-day validity\n- Renewable indefinitely\n- Made HTTPS accessible to everyone\n\nImpact:\n- Majority of web now uses HTTPS\n- Free removes cost barrier\n- Automated reduces complexity\n\n## HTTPS Best Practices\n\n### For Users\n\nAlways Use HTTPS:\n- Check for padlock before entering sensitive data\n- Never enter passwords on HTTP sites\n- Look for HTTPS on login pages\n- Bookmark HTTPS versions of sites\n\nBe Cautious Of:\n- Certificate warnings\n- Mixed content warnings\n- Sites that don't offer HTTPS\n- HTTP sites requesting sensitive info\n\nUse HTTPS Everywhere:\n- Browser extension\n- Forces HTTPS when available\n- Protects against downgrade attacks\n- Available for Chrome, Firefox, Edge\n\n### Red Flags\n\nWarning Signs:\n- Login page without HTTPS\n- Certificate errors on banking sites\n- HTTP in checkout process\n- Recently created certificates on unfamiliar sites\n- Certificate issued to different domain\n\n## HTTPS Limitations\n\n### What HTTPS Doesn't Do\n\nDoes NOT Protect Against:\n- Malware on the site\n- Phishing (fake sites can have HTTPS)\n- Poor website security practices\n- Server-side breaches\n- Social engineering\n\nDoes NOT Mean:\n- Website is trustworthy\n- Website is safe\n- Website is legitimate\n- Content is accurate\n\nPhishers Use HTTPS Too:\n- Free certificates from Let's Encrypt\n- HTTPS only means encrypted connection\n- Fake PayPal site can have valid HTTPS\n- Must still verify domain name\n\n### Mixed Content\n\nProblem:\n- HTTPS page loading HTTP resources\n- Images, scripts, stylesheets over HTTP\n- Weakens security\n\nBrowser Behavior:\n- May block mixed content\n- Shows warning icon\n- Degrades security indicator\n\n## Certificate Pinning\n\nAdvanced Security:\n- App or browser expects specific certificate\n- Rejects valid but unexpected certificates\n- Prevents some man-in-the-middle attacks\n- Used by banking apps and browsers\n\nHow It Works:\n- App stores expected certificate or public key\n- Verifies match on connection\n- Refuses connection if mismatch\n- Adds extra layer beyond CA validation\n\n## Future of HTTPS\n\n### Industry Trends\n\nHTTPS by Default:\n- Modern browsers require HTTPS for new features\n- HTTP being phased out\n- Search engines rank HTTPS higher\n- \"Not Secure\" warnings for HTTP\n\nTLS 1.3:\n- Latest version\n- Faster handshake\n- More secure\n- Removes outdated algorithms\n\n## Key Takeaways\n\n- HTTPS encrypts data between browser and website\n- Padlock icon indicates HTTPS connection\n- Certificate verifies website identity\n- Always check for HTTPS before entering sensitive data\n- HTTPS doesn't guarantee site is safe or legitimate\n- Verify domain name even with valid HTTPS\n- Never ignore certificate warnings on sensitive sites\n- Phishing sites can have valid HTTPS certificates\n- Use HTTPS Everywhere browser extension\n- Certificate details viewable by clicking padlock",
      order: 4,
      courseId: courses[3].id,
      moduleId: course4Modules[0].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Browser Extensions",
      content: "# Browser Extensions: Risks and Benefits\n\n## What Are Browser Extensions?\n\nBrowser extensions (also called add-ons or plugins) are small software programs that customize and enhance browser functionality.\n\n### Common Types\n\nProductivity Extensions:\n- Ad blockers (uBlock Origin, AdBlock Plus)\n- Password managers (LastPass, 1Password)\n- Tab managers\n- Screenshot tools\n- Note-taking apps\n\nPrivacy Extensions:\n- Privacy Badger\n- HTTPS Everywhere\n- DuckDuckGo Privacy Essentials\n- Cookie managers\n\nSecurity Extensions:\n- Web of Trust (WOT)\n- Malware scanners\n- Phishing protection\n\nShopping Extensions:\n- Price comparison\n- Coupon finders\n- Cashback tools\n\n## Benefits of Extensions\n\n### Legitimate Uses\n\nEnhanced Security:\n- Ad blockers prevent malvertising\n- Password managers improve security\n- HTTPS enforcement\n- Anti-tracking protection\n\nImproved Productivity:\n- Automate repetitive tasks\n- Better tab management\n- Quick access to tools\n- Custom workflows\n\nBetter Privacy:\n- Block trackers\n- Delete cookies\n- Mask browsing activity\n- Control data sharing\n\n## Risks of Browser Extensions\n\n### Security Threats\n\nMalicious Extensions:\n- Steal passwords and personal data\n- Inject malware\n- Redirect to phishing sites\n- Cryptocurrency mining\n- Click fraud\n\nPrivacy Violations:\n- Track browsing history\n- Collect personal information\n- Sell data to third parties\n- Monitor keystrokes\n- Access sensitive site data\n\nAccount Takeover:\n- Read and modify data on websites\n- Submit forms on your behalf\n- Access online banking\n- Make unauthorized purchases\n\n### How Extensions Can Harm You\n\nData Collection:\n- Browsing history\n- Search queries\n- Form inputs\n- Passwords (if granted permission)\n- Credit card numbers\n- Personal messages\n\nPermissions Abuse:\n- Read and change all data on visited websites\n- Access tabs and browsing activity\n- Manage downloads\n- Modify cookies\n- Capture screenshots\n\nExample Attack Scenarios:\n\nFake Ad Blocker:\n- Promises to block ads\n- Actually injects ads\n- Redirects affiliate links\n- Tracks all browsing\n- Sells data to advertisers\n\nCompromised Extension:\n- Legitimate extension sold to malicious actor\n- Update adds malicious code\n- Existing users compromised\n- Trust exploited\n\n## Understanding Extension Permissions\n\n### Critical Permissions\n\nHigh Risk:\n- \"Read and change all your data on the websites you visit\"\n- \"Read and change all your data on all websites\"\n- \"Access your data for all websites\"\n\nWhat This Means:\n- Can see everything you do on web\n- Can modify pages before you see them\n- Can inject scripts\n- Can steal credentials\n- Full access to web activity\n\nMedium Risk:\n- \"Read and change your bookmarks\"\n- \"Access your tabs and browsing activity\"\n- \"Manage your downloads\"\n- \"Access your data for specific sites\"\n\nLower Risk:\n- \"Display notifications\"\n- \"Change your browser settings\"\n- \"Open links in new tabs\"\n\n### Evaluating Permissions\n\nQuestions to Ask:\n- Does extension need this permission for its function?\n- Is ad blocker asking to manage downloads? (Red flag)\n- Why does calculator need access to all websites? (Red flag)\n- Does the permission match the purpose?\n\nRed Flags:\n- Excessive permissions for simple tasks\n- All-site access for single-site tools\n- Broad permissions with vague descriptions\n- Permissions that don't match stated purpose\n\n## Choosing Safe Extensions\n\n### Vetting Process\n\nBefore Installing:\n\nCheck Source:\n- Install from official browser stores only\n- Chrome Web Store for Chrome/Edge\n- Firefox Add-ons for Firefox\n- Never download from random websites\n\nVerify Developer:\n- Known, reputable developer\n- Company website exists\n- Contact information available\n- History of other extensions\n\nRead Reviews:\n- Many reviews (thousands+)\n- Recent reviews\n- Check negative reviews carefully\n- Watch for fake reviews (all 5-star with generic text)\n\nCheck Permissions:\n- Minimal permissions needed\n- Match extension purpose\n- Nothing excessive or unusual\n- Clearly explained\n\nResearch History:\n- Google extension name + \"malware\" or \"privacy\"\n- Check security blogs\n- Look for news articles\n- Search for controversies\n\n### Warning Signs\n\nAvoid If:\n- Few downloads/users (< 1000)\n- No reviews or only generic 5-star reviews\n- Vague description\n- Requests excessive permissions\n- Poor grammar in description\n- No developer information\n- Clones of popular extensions\n- Promises too good to be true\n- Free version of paid extension\n\n## Safe Extension Practices\n\n### Installation\n\nBest Practices:\n- Only install when needed\n- Read all permissions carefully\n- Question each permission\n- Start with well-known extensions\n- Prefer open-source when possible\n- Verify developer identity\n\nDuring Installation:\n- Read permission dialog completely\n- Understand what you're granting\n- Cancel if anything seems off\n- Don't rush through prompts\n\n### Ongoing Management\n\nRegular Maintenance:\n- Review installed extensions monthly\n- Remove unused extensions\n- Update regularly (but read update notes)\n- Check for permission changes\n- Monitor for suspicious behavior\n\nPermission Reviews:\n- Extensions can request new permissions in updates\n- Browser notifies of permission changes\n- Review why new permissions needed\n- Remove extension if suspicious\n\nSigns of Compromise:\n- Unexpected popups or ads\n- New toolbars appeared\n- Browser settings changed\n- Homepage or search engine changed\n- Redirects to unfamiliar sites\n- Slow browser performance\n- Unexpected CPU usage\n\n## Specific Extension Recommendations\n\n### Generally Safe Categories\n\nPassword Managers:\n- 1Password\n- Bitwarden\n- LastPass (official)\n- KeePass extensions\n\nPrivacy/Security:\n- uBlock Origin (not just \"uBlock\")\n- Privacy Badger (EFF)\n- HTTPS Everywhere (EFF)\n- DuckDuckGo Privacy Essentials\n\nProductivity:\n- Grammarly\n- LastPass\n- OneTab\n- Pocket\n\n### Extensions to Avoid\n\nCategories to Question:\n- Free VPNs (often malicious)\n- Coupon finders (data collection)\n- Download managers (unnecessary)\n- Weather extensions (excessive permissions)\n- Games (unnecessary access)\n\nSpecific Warnings:\n- Avoid extensions with names similar to popular ones\n- Beware \"lite\" or \"free\" versions of paid tools\n- Question why simple tool needs broad permissions\n\n## Browser-Specific Considerations\n\n### Chrome/Edge\n\nChrome Web Store:\n- Google reviews extensions\n- Not perfect - malicious ones slip through\n- More extensions = more risk\n- Can sync across devices (including malicious ones)\n\nManifest V3:\n- New extension format\n- More restrictions on extensions\n- Better privacy and security\n- Ad blockers affected but adapting\n\n### Firefox\n\nFirefox Add-ons:\n- More stringent review process\n- Open source friendly\n- Better privacy defaults\n- Recommended Extensions badge (vetted by Mozilla)\n\n### Safari\n\nSafari Extensions:\n- Smaller selection\n- App Store review process\n- More restrictions\n- Generally safer but fewer options\n\n## Mobile Browser Extensions\n\n### Limited but Safer\n\nMobile Limitations:\n- Fewer extensions available\n- More restrictions\n- Less risk but less functionality\n- Different security model\n\nFirefox Mobile:\n- Supports extensions\n- Limited selection\n- Similar risks to desktop\n\nChrome Mobile:\n- No extension support (Android)\n- More secure but less customizable\n\nSafari Mobile:\n- Content blockers only\n- More restricted\n- Safer model\n\n## Removing Malicious Extensions\n\n### If You Suspect Compromise\n\nImmediate Actions:\n\n1. Remove Suspicious Extension:\n   - Chrome: three dots > More tools > Extensions\n   - Firefox: three lines > Add-ons > Extensions\n   - Remove/Uninstall the extension\n\n2. Check for Other Compromises:\n   - Review all installed extensions\n   - Remove anything unfamiliar\n   - Check for permission changes\n\n3. Reset Browser Settings:\n   - Homepage\n   - Search engine\n   - New tab page\n   - Check for unexpected changes\n\n4. Change Passwords:\n   - Change passwords for sensitive accounts\n   - Assume extension saw everything\n   - Enable MFA if not already\n\n5. Run Security Scans:\n   - Full antivirus scan\n   - Malware removal tool\n   - Check for other infections\n\n6. Monitor Accounts:\n   - Watch for suspicious activity\n   - Check login history\n   - Review account changes\n\n## Key Takeaways\n\n- Browser extensions can significantly enhance functionality\n- Extensions have broad permissions and access to data\n- Install only from official browser stores\n- Verify developer identity and reputation\n- Read and understand all permissions\n- Question why extensions need specific permissions\n- Regularly review and remove unused extensions\n- Be especially careful with free VPNs and download managers\n- Update extensions but watch for permission changes\n- Remove immediately if suspicious behavior occurs\n- Minimal extensions = better security",
      order: 5,
      courseId: courses[3].id,
      moduleId: course4Modules[1].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Tracking and Privacy",
      videoUrl: "https://www.youtube.com/watch?v=KMtrY6lbjcY",
      content: "# Website Tracking, Cookies, and Privacy\n\n## How Websites Track You\n\nWebsites use multiple methods to track your online behavior, build profiles, and serve targeted advertising.\n\n### Tracking Methods\n\nCookies:\n- Small text files stored by browser\n- Remember login status, preferences, cart items\n- Track browsing across sites\n- Can persist for years\n\nThird-Party Cookies:\n- Set by domains other than site you're visiting\n- Ad networks and analytics\n- Track across multiple websites\n- Building comprehensive profile\n\nFirst-Party Cookies:\n- Set by website you're visiting\n- Necessary for functionality\n- Less privacy concern\n- Still track behavior on that site\n\nTracking Pixels:\n- Invisible 1x1 images\n- Load from tracking server\n- Record page views\n- Work even with cookies disabled\n\nBrowser Fingerprinting:\n- Unique configuration identification\n- Screen resolution, fonts, plugins\n- No cookies needed\n- Difficult to prevent\n- Nearly unique identifier\n\nSession Replay:\n- Records mouse movements, clicks, scrolling\n- Replays your session\n- Sees everything you see\n- May capture sensitive data\n\n## What Data is Collected\n\n### Basic Tracking\n\nEvery Page Load Records:\n- URL visited\n- Time and date\n- IP address (location)\n- Referrer (previous page)\n- User agent (browser, OS, device)\n- Screen resolution\n- Language settings\n\n### Behavioral Data\n\nActivity Tracking:\n- Pages visited\n- Time on each page\n- Links clicked\n- Videos watched\n- Forms filled (sometimes even unsubmitted)\n- Mouse movements\n- Scroll depth\n- Purchases and cart abandonment\n\n### Personal Data\n\nInformation Gathered:\n- Name, email, phone\n- Physical address\n- Purchase history\n- Search queries\n- Interests and preferences\n- Social connections\n- Financial information\n\n## Who is Tracking You\n\n### Advertising Networks\n\nMajor Players:\n- Google Ads / DoubleClick\n- Facebook Pixel\n- Amazon Advertising\n- Microsoft Advertising\n\nHow They Work:\n- Track across thousands of sites\n- Build detailed profiles\n- Match browsing to identity\n- Target ads based on behavior\n- Share data with partners\n\n### Analytics Services\n\nGoogle Analytics:\n- On 85% of websites\n- Tracks visitor behavior\n- Records page views, time, paths\n- Builds aggregate data\n- Identifies individual users\n\nOther Analytics:\n- Adobe Analytics\n- Matomo\n- Mixpanel\n- Custom analytics\n\n### Social Media Trackers\n\nFacebook Pixel:\n- Embedded on millions of sites\n- Tracks non-Facebook users\n- Records browsing behavior\n- Targets ads on Facebook\n- Builds shadow profiles\n\nSocial Login Buttons:\n- \"Login with Google/Facebook\"\n- Track even if you don't click\n- Know you visited the page\n- Associate with social profile\n\nShare Buttons:\n- \"Share on Twitter/Facebook\"\n- Tracking beacon even unused\n- Reports page visits\n- Links to social identity\n\n### Data Brokers\n\nCommercial Data Collection:\n- Buy data from multiple sources\n- Combine online and offline data\n- Create comprehensive profiles\n- Sell to advertisers and others\n- Little transparency or control\n\nInformation They Have:\n- Shopping history\n- Location history\n- Financial information\n- Health interests\n- Political views\n- Family composition\n- Education and employment\n\n## How Tracking Affects You\n\n### Privacy Invasion\n\nLoss of Anonymity:\n- Browsing history recorded\n- Associated with identity\n- Shared with third parties\n- Permanent records\n- No statute of limitations\n\nProfile Building:\n- Interests and preferences\n- Political views\n- Health concerns\n- Financial status\n- Personal relationships\n- Used for targeting\n\n### Targeted Advertising\n\nHow It Works:\n- Visit product page\n- Ad network records interest\n- Follow you across internet\n- Show ads for that product everywhere\n- Continue for weeks or months\n\nMicro-Targeting:\n- Demographic targeting\n- Behavioral targeting\n- Contextual targeting\n- Retargeting\n- Lookalike audiences\n\n### Price Discrimination\n\nDynamic Pricing:\n- Different prices for different users\n- Based on browsing history\n- Location affects pricing\n- Device affects pricing (Mac vs PC)\n- Time of day variations\n\n### Filter Bubbles\n\nPersonalization Effects:\n- See content matching your views\n- Reinforces existing beliefs\n- Limits exposure to diverse perspectives\n- Creates echo chambers\n- Affects news and information access\n\n### Security Risks\n\nData Breach Exposure:\n- Tracking data in breaches\n- Browsing history revealed\n- Personal profiles exposed\n- Identity theft risk\n- Embarrassing revelations\n\n## Cookies in Detail\n\n### Types of Cookies\n\nSession Cookies:\n- Temporary\n- Deleted when browser closes\n- Essential for functionality\n- Less privacy concern\n\nPersistent Cookies:\n- Remain after closing browser\n- Last days, months, or years\n- Track over long periods\n- Greater privacy impact\n\nEssential Cookies:\n- Required for site function\n- Login status\n- Shopping cart\n- User preferences\n- Can't opt out\n\nNon-Essential Cookies:\n- Analytics\n- Advertising\n- Social media\n- Can opt out (GDPR)\n\n### Cookie Consent\n\nGDPR Requirements (Europe):\n- Must request consent\n- Opt-in for non-essential\n- Easy to refuse\n- Clear information\n- Withdraw consent anytime\n\nReality:\n- \"Cookie walls\" blocking access\n- Dark patterns to encourage acceptance\n- \"Accept all\" more prominent than \"Reject\"\n- Deceptive language\n- Difficult to refuse\n\n### Supercookies\n\nZombie Cookies:\n- Respawn when deleted\n- Stored in multiple locations\n- Flash cookies, ETags\n- Difficult to remove\n\nBrowser Fingerprinting:\n- Doesn't use cookies at all\n- Based on browser configuration\n- Nearly unique identifier\n- Can't be deleted\n- Difficult to prevent\n\n## Privacy Protection Strategies\n\n### Browser Settings\n\nCookie Settings:\n- Block third-party cookies\n- Clear cookies on exit\n- Limit cookie lifespan\n- Whitelist trusted sites\n\nDo Not Track:\n- Browser setting\n- Requests sites don't track\n- Widely ignored\n- Not legally binding\n- Better than nothing\n\n### Private Browsing Mode\n\nIncognito/Private Mode:\n- Doesn't save history\n- Deletes cookies after closing\n- Doesn't save passwords\n- Still trackable by websites\n- IP address still visible\n- Not truly anonymous\n\nWhat It Doesn't Do:\n- Hide browsing from ISP\n- Hide from websites\n- Prevent tracking\n- Make you anonymous\n- Protect on public WiFi\n\n### Browser Extensions\n\nPrivacy Tools:\n- uBlock Origin: Blocks trackers and ads\n- Privacy Badger: Learns and blocks trackers\n- DuckDuckGo Privacy Essentials\n- HTTPS Everywhere\n- Cookie AutoDelete\n\nHow They Help:\n- Block tracking scripts\n- Delete cookies automatically\n- Enforce HTTPS\n- Show who's tracking\n- Easy on/off control\n\n### VPN Services\n\nWhat VPNs Do:\n- Hide IP address from websites\n- Encrypt traffic from ISP\n- Appear to browse from different location\n- Protect on public WiFi\n\nWhat VPNs Don't Do:\n- Stop cookie tracking\n- Prevent fingerprinting\n- Make you anonymous online\n- Hide from websites with account login\n\n### Alternative Browsers\n\nPrivacy-Focused Browsers:\n- Brave: Built-in ad/tracker blocking\n- Firefox: Strong privacy features\n- Tor Browser: Maximum anonymity (but slow)\n- DuckDuckGo Browser (mobile)\n\nPrivacy vs Convenience:\n- More privacy = more effort\n- May break some websites\n- Fewer features\n- Slower performance\n- Worth it for many users\n\n## Best Practices\n\n### Daily Habits\n\nLimit Tracking:\n- Block third-party cookies\n- Use privacy extensions\n- Clear cookies regularly\n- Use private browsing for sensitive topics\n- Log out of accounts when not needed\n\n### Account Management\n\nReduce Data Collection:\n- Review privacy settings\n- Opt out of personalization\n- Limit ad targeting\n- Don't link accounts\n- Use separate email for online accounts\n\n### Search Engines\n\nPrivate Search:\n- DuckDuckGo: No tracking\n- Startpage: Google results, no tracking\n- Brave Search\n- Avoid Google for sensitive searches\n\n### Social Media\n\nLimit Social Tracking:\n- Log out when not using\n- Don't stay logged in constantly\n- Limit app permissions\n- Don't use social login\n- Consider separate browser for social media\n\n## Your Rights\n\n### GDPR (Europe)\n\nRights Include:\n- Right to know what data collected\n- Right to access your data\n- Right to delete data\n- Right to data portability\n- Right to opt out\n\n### CCPA (California)\n\nConsumer Rights:\n- Know what data collected\n- Know if data sold\n- Opt out of sale\n- Request deletion\n- Non-discrimination\n\n### Exercising Rights\n\nHow to Request:\n- Website privacy pages\n- \"Do Not Sell My Information\" links\n- Data access requests\n- Deletion requests\n- May require identity verification\n\n## Key Takeaways\n\n- Websites track your behavior across the internet\n- Cookies, pixels, and fingerprinting enable tracking\n- Data used for advertising, pricing, and profiling\n- Third-party trackers follow you across sites\n- Browser settings and extensions provide protection\n- Private browsing limits but doesn't eliminate tracking\n- VPNs hide IP but don't stop all tracking\n- Regular cookie clearing helps privacy\n- Privacy-focused browsers offer better protection\n- You have rights under GDPR and CCPA to control data",
      order: 6,
      courseId: courses[3].id,
      moduleId: course4Modules[1].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Browser Settings",
      content: "# Configuring Browser Security Settings\n\n## Why Browser Settings Matter\n\nYour browser is the gateway to the internet. Proper security settings protect against malware, tracking, phishing, and data theft.\n\n### Default Settings Problem\n\nOut-of-the-Box Issues:\n- Prioritize convenience over security\n- Allow tracking\n- Save passwords insecurely\n- Permit potentially harmful content\n- Share data with browser vendor\n\n## Essential Security Settings\n\n### Privacy Settings\n\nBlock Third-Party Cookies:\n- Prevents cross-site tracking\n- Breaks some websites (rare)\n- Significantly improves privacy\n\nChrome/Edge:\n- Settings > Privacy and security > Cookies\n- Select \"Block third-party cookies\"\n\nFirefox:\n- Settings > Privacy & Security\n- Enhanced Tracking Protection: Strict\n\nClear Cookies on Exit:\n- Deletes tracking data when browser closes\n- Requires re-login to sites\n- Maximum privacy\n\n### Search Engine\n\nPrivacy-Focused Options:\n- DuckDuckGo (no tracking)\n- Startpage (Google results, no tracking)\n- Brave Search\n\nAvoid:\n- Google Search (extensive tracking)\n- Bing (Microsoft tracking)\n- Unless privacy isn't concern\n\n### HTTPS and Security\n\nHTTPS-Only Mode:\n- Forces encrypted connections\n- Warns on HTTP sites\n- Prevents downgrade attacks\n\nFirefox:\n- Settings > Privacy & Security\n- HTTPS-Only Mode: Enable in all windows\n\nChrome/Edge:\n- Enabled by default for most sites\n- Built into browser\n\nSafe Browsing:\n- Checks sites against malware/phishing database\n- Warns before visiting dangerous sites\n- Small privacy tradeoff worth the security\n\nChrome/Edge:\n- Settings > Privacy and security > Security\n- Enhanced protection (recommended)\n\nFirefox:\n- Settings > Privacy & Security\n- Block dangerous and deceptive content: Check all boxes\n\n### Password Management\n\nBuilt-In Password Managers:\n- Convenient but less secure than dedicated tools\n- Encrypted on device\n- Synced via browser account\n\nBest Practice:\n- Use dedicated password manager (1Password, Bitwarden)\n- Disable browser password saving\n- More secure encryption\n- Better features\n\nDisable Browser Password Saving:\n- Chrome/Edge: Settings > Passwords > Offer to save passwords: OFF\n- Firefox: Settings > Privacy & Security > Logins and Passwords > Ask to save logins: OFF\n\n### Autofill Settings\n\nPayment Methods:\n- Saving credit cards in browser is convenient\n- Encrypted but less secure than dedicated tools\n- Anyone with device access can use\n\nRecommendation:\n- Don't save payment methods in browser\n- Use password manager or enter manually\n- Enable device lock (PIN, fingerprint, face)\n\nAddresses:\n- Generally safe to save\n- Convenience vs privacy tradeoff\n- Consider for non-sensitive uses\n\n### Download Settings\n\nAsk Where to Save Files:\n- Prevents automatic downloads to hidden folders\n- Lets you verify each download\n- Organize files better\n\nScan Downloads:\n- Built-in malware scanning\n- Windows Defender integration (Edge)\n- Safe Browsing checks (Chrome, Firefox)\n\nSettings:\n- Chrome: Settings > Downloads > Ask where to save each file: ON\n- Firefox: Settings > General > Downloads > Always ask where to save files\n\nDangerous File Types:\n- Browsers block some file types (.exe on some)\n- Don't override these blocks without verification\n- Check file before opening\n\n## Advanced Security Settings\n\n### Site Settings\n\nLocation:\n- Don't allow by default\n- Grant per-site as needed\n- Review granted permissions\n\nCamera and Microphone:\n- Block by default\n- Grant only for video calls\n- Revoke after use\n\nNotifications:\n- Block by default\n- Too many sites request notifications\n- Annoying and privacy concern\n\nPopups:\n- Block by default\n- Allow for specific trusted sites\n- Most popups are ads or malicious\n\nJavaScript:\n- Required for most websites\n- Blocking breaks functionality\n- Only block on high-security browser profile\n\n### Sync Settings\n\nBrowser Sync:\n- Syncs bookmarks, passwords, history\n- Encrypted with account password\n- Convenient but risky if account compromised\n\nWhat to Sync:\n- Bookmarks: Safe\n- Extensions: Careful (malicious extensions sync too)\n- Passwords: Use password manager instead\n- History: Privacy concern\n- Open tabs: Convenience vs privacy\n\nRecommendations:\n- Use strong password for browser account\n- Enable MFA on browser account\n- Limit what you sync\n- Consider not syncing on work devices\n\n### DNS Settings\n\nDNS over HTTPS (DoH):\n- Encrypts DNS queries\n- ISP can't see what sites you visit\n- Privacy improvement\n\nEnable DoH:\n- Chrome: Settings > Privacy and security > Security > Use secure DNS\n- Firefox: Settings > General > Network Settings > Enable DNS over HTTPS\n\nProviders:\n- Cloudflare (1.1.1.1): Privacy-focused\n- Google (8.8.8.8): Fast but Google tracks\n- Quad9: Security and privacy\n\n## Browser-Specific Settings\n\n### Chrome/Edge\n\nPrivacy Sandbox:\n- Google's cookie alternative\n- Topics API for ad targeting\n- FLoC replacement\n- Privacy improvement over cookies\n- Still tracks (less granularly)\n\nSettings:\n- Settings > Privacy and security > Privacy Sandbox\n- Consider disabling for maximum privacy\n\nSend \"Do Not Track\":\n- Requests sites don't track\n- Widely ignored\n- Enable anyway (Settings > Privacy and security)\n\n### Firefox\n\nEnhanced Tracking Protection:\n- Standard, Strict, or Custom\n- Strict recommended for security\n- May break some sites\n\nContent Blocking:\n- Trackers\n- Cookies\n- Cryptominers\n- Fingerprinters\n- Social media trackers\n\nSettings > Privacy & Security > Enhanced Tracking Protection: Strict\n\nFirefox Suggest:\n- Search suggestions from Firefox\n- Privacy-respecting\n- Can disable for offline searches only\n\n### Safari\n\nIntelligent Tracking Prevention:\n- Blocks cross-site tracking\n- Deletes cookies from trackers\n- On by default (keep it)\n\nPrivacy Report:\n- Shows blocked trackers\n- Per-site breakdown\n- Privacy insights\n\nSettings: Safari > Privacy > Prevent cross-site tracking: ON\n\n### Brave\n\nBuilt-In Privacy:\n- Blocks ads and trackers by default\n- Fingerprinting protection\n- HTTPS Everywhere built-in\n- No configuration needed\n\nShields:\n- Per-site privacy controls\n- Adjust blocking levels\n- View blocked items\n\nAdditional Settings:\n- Settings > Shields > Aggressive blocking\n- Settings > Privacy > Private windows with Tor\n\n## Extension Security Settings\n\nReview Extensions:\n- Settings > Extensions\n- Remove unused\n- Check permissions\n- Update regularly\n\nExtension Recommendations:\n- Only from official stores\n- Well-known developers\n- Many positive reviews\n- Minimal necessary permissions\n\n## Profile and User Management\n\nMultiple Profiles:\n- Separate work and personal\n- Different security levels\n- Isolated cookies and data\n\nUse Cases:\n- Work profile: More strict security\n- Personal profile: Balance security and convenience\n- Banking profile: Maximum security\n- Guest profile: No saved data\n\nCreating Profiles:\n- Chrome/Edge: Profile icon > Add profile\n- Firefox: about:profiles\n\n## Privacy vs Convenience\n\n### Finding Balance\n\nMaximum Privacy:\n- Strict tracking protection\n- Block all cookies\n- No sync\n- Private browsing only\n- Breaks many websites\n\nMaximum Convenience:\n- Allow all cookies\n- Save all passwords\n- Sync everything\n- No protection\n- Significant privacy loss\n\nRecommended Balance:\n- Block third-party cookies\n- Use password manager\n- Sync bookmarks only\n- Safe Browsing enabled\n- Privacy extensions installed\n- Per-site permissions\n\n### Site Allowlisting\n\nTrusted Sites:\n- Add to allowlist\n- Enable cookies\n- Allow notifications\n- More permissions\n\nUntrusted Sites:\n- Strict blocking\n- No permissions\n- Private browsing\n\n## Regular Maintenance\n\n### Monthly Tasks\n\nClear Data:\n- Browsing history\n- Download history\n- Cached files\n- Cookies (except trusted sites)\n\nReview:\n- Saved passwords\n- Site permissions\n- Installed extensions\n- Sync settings\n\n### Security Checkups\n\nBrowser Updates:\n- Check for updates weekly\n- Auto-update enabled\n- Restart to apply updates\n- Critical for security\n\nPermission Audit:\n- Review site permissions\n- Remove unnecessary grants\n- Check location, camera, notifications\n\nExtension Audit:\n- Remove unused extensions\n- Check for permission changes\n- Verify still from legitimate developer\n\n## Testing Your Settings\n\n### Privacy Tests\n\nBrowser Fingerprinting:\n- Visit: coveryourtracks.eff.org\n- Check how unique you are\n- Test fingerprinting protection\n\nCookie Test:\n- Visit sites with trackers\n- Use Privacy Badger to see what's blocked\n- Verify third-party cookies blocked\n\nDNS Leak Test:\n- Visit: dnsleaktest.com\n- Verify DNS over HTTPS working\n- Check for leaks if using VPN\n\n## Key Takeaways\n\n- Default browser settings prioritize convenience over security\n- Block third-party cookies for significant privacy improvement\n- Enable HTTPS-Only mode to force encrypted connections\n- Use dedicated password manager instead of browser\n- Enable Safe Browsing for malware and phishing protection\n- Configure per-site permissions conservatively\n- Regular review and cleanup of extensions\n- Balance privacy and convenience based on needs\n- Use multiple profiles for different security requirements\n- Keep browser updated for security patches\n- Test your privacy settings with online tools",
      order: 7,
      courseId: courses[3].id,
      moduleId: course4Modules[2].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "VPNs and Private Browsing",
      videoUrl: "https://www.youtube.com/watch?v=WVDQEoe6ZWY",
      content: "# Using VPNs and Private Browsing\n\n## Understanding Private Browsing\n\nPrivate browsing (Incognito, Private Window) is a browser mode that limits local data storage.\n\n### What Private Browsing Does\n\nPrevents Local Storage:\n- No browsing history saved\n- Cookies deleted after session\n- Search history not saved\n- Form data not remembered\n- Temporary downloads not tracked\n\nUse Cases:\n- Searching for sensitive topics\n- Using shared computer\n- Accessing account on someone else's device\n- Testing website without cookies\n- Shopping for surprise gifts\n\n### What Private Browsing Doesn't Do\n\nDoes NOT Hide From:\n- Websites you visit (they still see your IP)\n- Internet Service Provider (ISP)\n- Network administrator (at work/school)\n- Government surveillance\n- Your employer\n\nDoes NOT Prevent:\n- Tracking by websites\n- Targeted advertising\n- IP address logging\n- Fingerprinting\n- Malware or phishing\n\n### Common Misconceptions\n\nMyth: Private browsing makes you anonymous\nReality: Only prevents local data storage\n\nMyth: Websites can't track you\nReality: They still can via IP, fingerprinting, accounts\n\nMyth: Safe from malware\nReality: No additional malware protection\n\nMyth: ISP can't see activity\nReality: ISP sees everything\n\n## Virtual Private Networks (VPNs)\n\n### What is a VPN?\n\nA VPN creates an encrypted tunnel between your device and a VPN server, hiding your activity from your ISP and local network.\n\nHow It Works:\n1. Connect to VPN server\n2. All internet traffic encrypted\n3. Traffic exits VPN server\n4. Websites see VPN server's IP, not yours\n\n### What VPNs DO\n\nHide From ISP:\n- ISP can't see which sites you visit\n- Can only see you're connected to VPN\n- Encrypted traffic unreadable\n- Protects on public WiFi\n\nHide Your IP From Websites:\n- Websites see VPN server IP\n- Can't determine real location\n- Harder to track across sessions\n- Bypass geographic restrictions\n\nProtect on Public WiFi:\n- Encrypt all traffic\n- Prevent man-in-the-middle attacks\n- Safe on coffee shop, airport, hotel WiFi\n- Protection from malicious hotspots\n\n### What VPNs DON'T Do\n\nDoes NOT Provide Anonymity:\n- VPN provider knows your IP and activity\n- If logged in to accounts, you're still identifiable\n- Browser fingerprinting still works\n- Cookies still track you\n\nDoes NOT Protect From:\n- Malware or phishing\n- Scams or fraud\n- Social engineering\n- Account compromises\n- Bad security practices\n\nDoes NOT Guarantee Privacy:\n- VPN provider can see traffic (if not HTTPS)\n- Logs may be kept (despite claims)\n- Could be compelled to hand over data\n- Some VPNs are malicious\n\n## Choosing a VPN\n\n### Trustworthy VPN Services\n\nReputable Providers:\n- Mullvad: Strong privacy, anonymous payment\n- ProtonVPN: Swiss privacy, transparency\n- IVPN: No-logs audited\n- NordVPN: Large network, audited\n- ExpressVPN: Fast, no logs\n\nAvoid:\n- Free VPNs (often malicious or sell data)\n- VPNs from unknown companies\n- VPNs with no privacy policy\n- VPNs requiring excessive permissions\n- Fly-by-night operations\n\n### Evaluating VPN Providers\n\nKey Factors:\n\nNo-Logs Policy:\n- Claims not to log activity\n- Independently audited\n- Proven in court (Mullvad, ExpressVPN)\n- Jurisdiction matters (avoid 5/9/14 Eyes)\n\nJurisdiction:\n- Country determines legal requirements\n- Switzerland, Iceland: Strong privacy\n- US, UK, Australia: Data sharing agreements\n- China, Russia: Government control\n\nPayment Options:\n- Anonymous payment (cash, crypto)\n- No personal info required\n- Prevents linking VPN to identity\n\nEncryption:\n- WireGuard or OpenVPN protocols\n- Strong encryption (AES-256)\n- No leaks (DNS, IPv6, WebRTC)\n\n### Red Flags\n\nAvoid VPNs That:\n- Are completely free (how do they pay for servers?)\n- Have unclear ownership\n- Make exaggerated claims (military-grade, 100% anonymous)\n- Are from unknown countries\n- Have no audits or transparency reports\n- Require excessive device permissions\n- Have poor reviews or controversies\n\n## Using VPNs Effectively\n\n### When to Use VPN\n\nHigh Priority:\n- Public WiFi (coffee shops, airports, hotels)\n- Traveling abroad\n- Accessing geo-restricted content\n- Protecting sensitive research\n- Whistleblowing or journalism\n\nOptional:\n- Home internet (depends on threat model)\n- General browsing for privacy\n- Avoiding ISP tracking\n- Bypassing network restrictions\n\n### VPN Limitations\n\nStill Trackable If:\n- Logged into accounts (Google, Facebook, etc.)\n- Using same browser fingerprint\n- Cookies identify you\n- Website uses other tracking methods\n\nPerformance Impact:\n- Slower speeds (encryption overhead)\n- Increased latency\n- Some services block VPN IPs\n- May not work with streaming services\n\n## Combining VPN and Private Browsing\n\n### Maximum Privacy Setup\n\nLayer 1: VPN\n- Hides traffic from ISP\n- Hides real IP from websites\n- Encrypts connection\n\nLayer 2: Private Browsing\n- No local history\n- No persistent cookies\n- Clean slate each session\n\nLayer 3: Privacy Extensions\n- Block trackers (uBlock Origin)\n- Delete cookies (Cookie AutoDelete)\n- HTTPS enforcement\n\nLayer 4: Privacy Browser\n- Firefox or Brave\n- Strict tracking protection\n- Fingerprinting resistance\n\n### Use Case Examples\n\nSensitive Research:\n- Enable VPN\n- Use private browsing\n- Don't log into accounts\n- Use privacy-focused search (DuckDuckGo)\n\nPublic WiFi:\n- Always use VPN\n- Private browsing optional\n- Avoid sensitive transactions\n- Check for HTTPS\n\n## VPN on Mobile Devices\n\n### Mobile VPN Apps\n\nOfficial Apps:\n- Download from provider website\n- Verify on App Store/Play Store\n- Check developer identity\n- Read permissions carefully\n\nAlways-On VPN:\n- Android: Settings > VPN > Always-on VPN\n- iOS: On-Demand VPN in Settings\n- Reconnects automatically\n- Prevents leaks\n\nBattery Impact:\n- VPNs use more battery\n- Encrypted traffic processing\n- Constant connection\n- Trade-off for security\n\n## Advanced: Tor Browser\n\n### Maximum Anonymity\n\nWhat is Tor:\n- Routes through multiple volunteer nodes\n- Layers of encryption\n- Very difficult to trace\n- Slow but extremely private\n\nWhen to Use:\n- Maximum anonymity needed\n- Whistleblowing\n- Sensitive journalism\n- Avoiding censorship\n- Accessing .onion sites\n\nLimitations:\n- Very slow\n- Some sites block Tor\n- Can draw attention\n- Not needed for most users\n\nTor vs VPN:\n- Tor: Maximum anonymity, very slow\n- VPN: Good privacy, faster\n- Can combine both for maximum protection\n\n## Common Mistakes\n\n### VPN Misuse\n\nFalse Sense of Security:\n- Thinking VPN makes you invincible\n- Ignoring other security practices\n- Logging into accounts defeats anonymity\n- Not using HTTPS still risky\n\nFree VPN Danger:\n- Often malicious\n- Inject ads\n- Sell browsing data\n- Log everything\n- Worse than no VPN\n\n### Private Browsing Misunderstanding\n\nRelying on Private Mode:\n- Thinking it provides full privacy\n- Not realizing ISP can still see\n- Believing websites can't track\n- Assuming it prevents malware\n\n## Best Practices\n\n### Daily Use\n\nGeneral Browsing:\n- Use privacy-focused browser\n- Enable tracking protection\n- Consider VPN at home\n- Private browsing for sensitive searches\n\nPublic WiFi:\n- Always use VPN\n- Avoid sensitive transactions\n- Private browsing recommended\n- Verify HTTPS\n\nSensitive Activities:\n- VPN + Private Browsing\n- Privacy-focused browser\n- No account logins\n- Dedicated device if possible\n\n### VPN Checklist\n\nBefore Connecting:\n- Verify you're connecting to correct VPN\n- Check encryption settings\n- Enable kill switch (blocks internet if VPN drops)\n- Verify no DNS leaks\n\nWhile Connected:\n- Check IP address (whatismyip.com)\n- Verify VPN location\n- Monitor for disconnections\n- Don't login to accounts if anonymity needed\n\n### Testing Your Setup\n\nPrivacy Checks:\n- IP leak test: ipleak.net\n- DNS leak test: dnsleaktest.com\n- WebRTC leak: browserleaks.com\n- Fingerprint test: coveryourtracks.eff.org\n\n## Key Takeaways\n\n- Private browsing only prevents local data storage\n- Private browsing doesn't hide from ISP or websites\n- VPNs hide traffic from ISP and mask IP address\n- VPNs don't provide complete anonymity\n- Avoid free VPNs - they often sell your data\n- Use reputable VPN providers with no-logs policies\n- VPN + private browsing + privacy tools = best protection\n- Always use VPN on public WiFi\n- Test for leaks after connecting to VPN\n- Combine privacy tools for layered protection\n- Understand limitations - no tool provides perfect privacy\n- Most people don't need Tor, but it's available for extreme cases",
      order: 8,
      courseId: courses[3].id,
      moduleId: course4Modules[2].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "PII Explained",
      videoUrl: "https://www.youtube.com/watch?v=Fb_5TubCDPs",
      content: "# What is Personal Identifiable Information (PII)?\n\n## Definition of PII\n\nPersonal Identifiable Information (PII) is any data that can identify, contact, or locate a specific individual, either alone or when combined with other information.\n\n## Types of PII\n\n### Direct Identifiers (Explicit PII)\n\nInformation that directly identifies an individual:\n\n- Full name\n- Social Security Number (SSN)\n- Driver's license number\n- Passport number\n- Biometric data (fingerprints, facial recognition, retina scans)\n- Full address (street address + name)\n- Email address (when combined with name)\n- Phone number (when linked to identity)\n- Bank account numbers\n- Credit/debit card numbers\n- Medical records with identifiers\n- Vehicle identification number (VIN) + owner info\n\n### Indirect Identifiers (Quasi-Identifiers)\n\nData that can identify someone when combined:\n\n- Date of birth\n- Place of birth\n- ZIP code\n- Gender\n- Race/ethnicity\n- Job title and employer\n- Education records\n- IP addresses\n- Device identifiers (MAC address, IMEI)\n- Geolocation data\n- Usernames (if tied to real identity)\n\n### Sensitive PII\n\nEspecially private information that poses higher risk:\n\n- Medical records and health information\n- Financial information\n- Genetic information\n- Biometric data\n- Criminal history\n- Sexual orientation\n- Religious affiliation\n- Union membership\n- Mental health records\n\n## Why PII Protection Matters\n\n### Identity Theft\n\nStolen PII enables criminals to:\n- Open accounts in your name\n- File fraudulent tax returns\n- Access medical care\n- Obtain credit cards/loans\n- Commit crimes under your identity\n\nReal Impact:\n- Average victim spends 200+ hours resolving identity theft\n- Financial losses average $1,100 per victim\n- Credit damage can last years\n- Emotional stress and anxiety\n\n### Financial Fraud\n\nWith PII, attackers can:\n- Access bank accounts\n- Make unauthorized purchases\n- Transfer money\n- Apply for loans\n- Drain retirement accounts\n\n### Privacy Violations\n\nYour PII reveals:\n- Where you live and work\n- Your habits and routines\n- Health conditions\n- Financial status\n- Personal relationships\n- Political views and activities\n\n## PII in the Digital Age\n\n### Data You Share\n\nConsciously Shared:\n- Social media profiles\n- Online shopping accounts\n- Email newsletters\n- Loyalty programs\n- Mobile apps\n- Smart home devices\n\nUnknowingly Shared:\n- Browsing history\n- Location data from phones\n- Metadata in photos\n- Public records (property, voting, court)\n- Data broker compilations\n\n### The Data Economy\n\nCompanies collect and trade PII:\n- Data brokers sell consumer profiles\n- Advertisers track across websites\n- Apps harvest and monetize user data\n- \"Free\" services trade access for data\n\nOne data broker can have:\n- 3,000+ data points per person\n- Your shopping habits\n- Health conditions\n- Financial status\n- Personal interests\n- Political leanings\n\n## Protecting Your PII\n\n### Minimize Sharing\n\nShare Only What's Necessary:\n- Question every form field\n- Use \"prefer not to say\" when available\n- Provide minimal info for loyalty programs\n- Skip optional fields\n\nThink Before Posting:\n- Avoid sharing full birthday (use month/day only)\n- Don't post travel plans publicly\n- Review social media privacy settings\n- Remove location data from photos\n\n### Secure What You Share\n\nOnline Accounts:\n- Strong, unique passwords\n- Enable multi-factor authentication\n- Review app permissions regularly\n- Delete unused accounts\n\nDocuments:\n- Shred financial documents\n- Store sensitive docs securely\n- Use encrypted cloud storage\n- Never carry SSN card\n\n### Monitor Your Information\n\nRegular Checks:\n- Review credit reports (free annually at annualcreditreport.com)\n- Check bank/card statements weekly\n- Monitor medical benefits statements\n- Google yourself periodically\n- Check data broker sites (opt out when possible)\n\n### When You Must Share PII\n\nVerify Legitimacy:\n- Confirm who's asking and why they need it\n- Use official channels only (not email links)\n- Check website security (HTTPS, valid certificate)\n- Be skeptical of unexpected requests\n\nAsk Questions:\n- \"Why do you need this information?\"\n- \"How will it be protected?\"\n- \"Who will have access?\"\n- \"How long will you keep it?\"\n- \"Can I provide less information?\"\n\n## Key Takeaways\n\n- PII is any information that can identify you personally\n- Direct identifiers alone can identify you; indirect identifiers work in combination\n- Sensitive PII requires extra protection due to higher risk\n- Your PII has significant value to criminals and companies\n- Minimize PII sharing, secure what you do share, and monitor regularly\n- Always verify requests for PII before providing information\n- Think of PII protection as a lifelong practice, not a one-time task",
      order: 4,
      courseId: courses[4].id,
      moduleId: course5Modules[0].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Secure File Sharing",
      videoUrl: "https://www.youtube.com/watch?v=0BRx_nL-7co",
      content: "# Secure File Sharing Best Practices\n\n## Why File Sharing Security Matters\n\nOrganizations and individuals share files constantly:\n- Collaborating on projects\n- Sending documents to clients\n- Sharing photos with family\n- Submitting work deliverables\n- Distributing sensitive information\n\nInsecure file sharing leads to:\n- Data breaches and leaks\n- Unauthorized access to confidential information\n- Malware distribution\n- Loss of intellectual property\n- Compliance violations\n- Reputational damage\n\n## Common File Sharing Methods (Ranked by Security)\n\n### Email Attachments (Least Secure)\n\nProblems:\n- Not encrypted end-to-end (usually)\n- Files stored on multiple mail servers\n- Recipients can forward easily\n- No control after sending\n- Size limits (usually 25MB)\n- Attachment gets copied to every server in the chain\n\nWhen to Use:\n- Non-sensitive files only\n- Public information\n- When no alternative exists\n\nBest Practices If You Must:\n- Password-protect sensitive attachments (7-Zip, Office encryption)\n- Send password through different channel (phone, text)\n- Use encrypted email service (ProtonMail, Tutanota)\n- Keep file sizes reasonable\n- Don't email: SSNs, credit cards, passwords, medical records, financial data\n\n### Cloud Storage Links (Moderate Security)\n\nServices: Google Drive, Dropbox, OneDrive, Box\n\nPros:\n- Large file support\n- Can revoke access anytime\n- Version control\n- Expiring links available\n\nCons:\n- Provider has encryption keys (can access your files)\n- Links can be intercepted\n- Accidental public sharing common\n- Provider may scan files\n\nBest Practices:\n- Use expiring links (24 hours, 7 days)\n- Set download limits\n- Require password for sensitive files\n- Use \"view only\" not \"edit\" when possible\n- Review who has access regularly\n- Revoke access when no longer needed\n- Don't make folders publicly accessible\n\n### Secure File Transfer Services (Better Security)\n\nServices:\n- Bitwarden Send (encrypted, temporary)\n- Tresorit Send (end-to-end encrypted)\n- Firefox Send alternatives\n- WeTransfer (with password)\n\nFeatures:\n- End-to-end encryption (some)\n- Automatic expiration\n- Download limits\n- Password protection\n- No account required for recipients\n\nBest Practices:\n- Set shortest reasonable expiration (hours, not days)\n- Limit downloads to 1-2\n- Always use password protection\n- Send password separately\n- Use for sensitive one-time transfers\n\n### Enterprise File Sharing (Highest Security)\n\nServices: Box, SharePoint, Egnyte, Citrix ShareFile\n\nFeatures:\n- Granular access controls\n- Audit logs (who accessed what, when)\n- Data Loss Prevention (DLP)\n- Integration with corporate SSO\n- Compliance certifications (HIPAA, FINRA, etc.)\n- Data residency controls\n- Remote wipe capabilities\n\nWhen to Use:\n- Business-critical files\n- Client deliverables\n- Regulated data (healthcare, finance, legal)\n- Large organizations\n\n## Secure File Sharing Best Practices\n\n### Before Sharing\n\nClassify the Data:\n- Public: Anyone can see (marketing materials, public docs)\n- Internal: Company employees only\n- Confidential: Limited business need-to-know\n- Restricted: Highly sensitive (legal, HR, financial)\n\nAsk Yourself:\n- Who really needs access?\n- What level of access (view, edit, download)?\n- How long should they have access?\n- What happens if this file leaks?\n\n### Setting Permissions\n\nPrinciple of Least Privilege:\n- Grant minimum access required\n- View-only unless editing needed\n- Specific people, not \"anyone with link\"\n- Expiration dates by default\n\nPermission Levels:\n- View Only: Can see but not download or edit\n- Comment: Can view and add comments\n- Edit: Can modify the file\n- Owner: Full control including sharing\n\nRed Flags to Avoid:\n- \"Anyone with the link can edit\"\n- \"Public on the web\"\n- No expiration date\n- Excessive permissions\n\n### Encryption\n\nThree Types:\n\n1. In Transit (HTTPS/TLS):\n   - Protects while file is being sent\n   - Standard for modern services\n   - Still vulnerable at endpoints\n\n2. At Rest:\n   - Protects stored files on servers\n   - Provider has keys (can decrypt)\n   - Better than nothing\n\n3. End-to-End:\n   - Only sender and recipient can decrypt\n   - Provider cannot access\n   - Best security\n   - Use for sensitive data\n\nHow to Ensure End-to-End Encryption:\n- Use zero-knowledge services (Tresorit, Sync.com, ProtonDrive)\n- Or encrypt locally before uploading (7-Zip, VeraCrypt)\n- Send decryption key separately (phone, secure messaging)\n\n### Access Management\n\nRegular Audits:\n- Monthly review of shared files\n- Remove people who no longer need access\n- Check for public links\n- Verify expiration dates are set\n\nRevoking Access:\n- Immediately when person leaves company/project\n- After file purpose is complete\n- If unauthorized sharing suspected\n- Regularly scheduled cleanups\n\nActivity Monitoring:\n- Enable activity tracking when available\n- Review who downloads files\n- Unusual access patterns (off-hours, excessive downloads)\n- Forwarding/re-sharing alerts\n\n### Special Considerations for Sensitive Data\n\nMedical Records (HIPAA):\n- Use HIPAA-compliant file sharing (Box, ShareFile)\n- Business Associate Agreements (BAAs) required\n- Audit logs mandatory\n- Encryption required\n- Patient consent for sharing\n\nFinancial Data (PCI-DSS, SOX):\n- Never share credit card numbers via email\n- Use secure file transfer with encryption\n- Access logs required\n- Time-limited access\n\nLegal Documents (Attorney-Client Privilege):\n- Client portals (NetDocuments, iManage)\n- End-to-end encryption\n- Watermarks to track leaks\n- Non-disclosure agreements\n\nPersonal Data (GDPR):\n- EU resident data has special protections\n- Document why sharing is necessary\n- Delete after purpose fulfilled\n- Data Processing Agreements (DPAs) with recipients\n\n## Mobile File Sharing\n\nExtra Risks:\n- Devices lost/stolen more often\n- Public Wi-Fi usage\n- App permissions overly broad\n- Smaller screens = harder to verify recipients\n\nMobile Best Practices:\n- Enable device encryption (iOS default, Android: Settings → Security)\n- Use biometric/PIN for file apps\n- Don't share over public Wi-Fi (use VPN or cellular)\n- Verify recipients carefully\n- Use mobile app permissions (restrict to specific files)\n- Remote wipe capability enabled\n\n## Avoiding Common Mistakes\n\n### Mistake 1: \"Reply All\" Disasters\n\nProblem: Accidentally sharing confidential info with whole email chain\n\nPrevention:\n- Check recipients before hitting send\n- Use BCC for large groups\n- Remove unnecessary recipients\n- Use \"External\" email warnings\n- Think before forwarding\n\n### Mistake 2: Public Links\n\nProblem: \"Anyone with link\" shared on social media, indexed by Google\n\nPrevention:\n- Default to \"specific people\" not \"anyone with link\"\n- Use \"restricted\" not \"anyone in organization\" for sensitive files\n- Search your company domain on Google: site:drive.google.com \"confidential\"\n- Regular audits of public links\n\n### Mistake 3: Expired Email Addresses\n\nProblem: Sharing files with outdated email addresses or former employees\n\nPrevention:\n- Verify recipient email before sharing\n- Regularly review access list\n- Auto-revoke access for terminated accounts\n- Use group/role-based permissions instead of individual emails\n\n### Mistake 4: No Expiration Dates\n\nProblem: Files accessible forever even after need ends\n\nPrevention:\n- Set expiration for every share\n- Default to shortest reasonable time\n- Calendar reminders to review long-term shares\n- Automatic cleanup policies\n\n### Mistake 5: Trusting the Recipient\n\nProblem: Recipient's account gets compromised or they share further\n\nPrevention:\n- Watermark sensitive documents\n- Disable download/print when possible\n- Use NDAs for highly sensitive information\n- Accept some information will be shared - adjust sensitivity accordingly\n\n## Key Takeaways\n\n- Email attachments are least secure - avoid for sensitive data\n- Use cloud storage links with expiration and passwords\n- End-to-end encryption for highly sensitive files (Tresorit, ProtonDrive)\n- Set shortest reasonable expiration dates\n- Grant minimum permissions needed (view-only when possible)\n- Regularly audit who has access to shared files\n- Revoke access immediately when no longer needed\n- Encrypt locally before uploading to standard cloud services\n- Verify recipients carefully before sharing\n- Use enterprise solutions for business-critical data\n- Mobile sharing requires extra caution (encryption, VPN)\n- Follow compliance requirements (HIPAA, PCI-DSS, GDPR)",
      order: 5,
      courseId: courses[4].id,
      moduleId: course5Modules[1].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Social Media Privacy",
      videoUrl: "https://www.youtube.com/watch?v=tpvkFC2U_EY",
      content: "# Social Media Privacy Settings\n\n## The Social Media Privacy Problem\n\nSocial media platforms collect vast amounts of personal data:\n- Everything you post (text, photos, videos, location)\n- People you interact with and how often\n- Pages you like and follow\n- Messages you send\n- Your browsing history (via tracking pixels)\n- Time spent on each post\n- When you're active\n- Your contacts (if you allow access)\n- Your location history\n\nThis data is used to:\n- Target advertising (primary business model)\n- Build detailed psychological profiles\n- Sell to data brokers\n- Train AI algorithms\n- Share with third parties\n\nWithout proper privacy settings:\n- Posts visible to strangers\n- Location data reveals where you live/work\n- Scammers can impersonate you or loved ones\n- Employers/schools see things you didn't intend\n- Your data is sold and shared widely\n\n## General Privacy Principles\n\n### Think Before You Post\n\nCannot be unsaid:\n- Once posted, can be screenshot/saved\n- \"Delete\" doesn't remove all copies\n- Internet archive and cached versions persist\n- Others may have shared your post\n\nRed Flags to Avoid Posting:\n- Full date of birth (identity theft risk)\n- Home address or exact location\n- Vacation plans (broadcasting empty home)\n- Financial information\n- Children's schools/routines\n- Boarding passes/tickets with barcodes\n- Photos of credit cards, IDs, or keys\n\nSafe Sharing:\n- Share experiences after they happen\n- Be vague about locations (\"the beach\" not \"Malibu Beach\")\n- Avoid tagging exact addresses\n- Review photos before posting (reflections, backgrounds)\n\n### Audience Awareness\n\nWho can see your posts?\n- Public: Anyone on the internet\n- Friends: People you've accepted\n- Friends of friends: Extended network\n- Custom: Specific people/lists\n- Only me: Private (but platform still sees it)\n\nDefault to \"Friends Only\":\n- Prevents strangers from seeing personal info\n- Reduces phishing/scam risks\n- Limits employer/school visibility\n- You can still make specific posts public\n\n### Regular Privacy Checkups\n\nQuarterly Review:\n- Go through privacy settings\n- Review third-party app access\n- Check who can see old posts\n- Update friend lists\n- Remove/untag unwanted photos\n\n## Platform-Specific Privacy Settings\n\n### Facebook Privacy Settings\n\nAccess: Settings & Privacy → Settings → Privacy\n\n**Who can see your posts:**\n- Settings → Privacy → \"Who can see your future posts?\"\n- Set to \"Friends\" (not Public)\n\n**Profile Information:**\n- Settings → Privacy → \"Who can see your friends list?\"\n- Limit to \"Only me\" or \"Friends\"\n- Review \"About\" section visibility\n- Hide email, phone, birthday details\n\n**Past Posts:**\n- Settings → Privacy → \"Limit past posts\"\n- Makes all old public posts \"Friends only\"\n\n**Search and Contact:**\n- \"Who can look you up using email/phone?\" → Friends or \"Only me\"\n- \"Do you want search engines to link to your profile?\" → No\n\n**Timeline and Tagging:**\n- \"Review posts you're tagged in before they appear?\" → Enable\n- \"Who can see posts you're tagged in?\" → Friends\n- \"Who can see what others post on your timeline?\" → Friends\n\n**Face Recognition:**\n- Settings → Face Recognition → \"No\" (disable)\n\n**Location Services:**\n- Settings → Location → Review apps with location access\n- Disable for Facebook app if not needed\n\n**Off-Facebook Activity:**\n- Settings → Your Facebook Information → Off-Facebook Activity\n- Disconnect external websites and apps\n- Turn off future activity\n\n**Third-Party Apps:**\n- Settings → Apps and Websites\n- Remove apps you don't use\n- Check what data apps can access\n\n### Instagram Privacy Settings\n\nAccess: Profile → Menu → Settings → Privacy\n\n**Private Account:**\n- Account Privacy → Private Account (ON)\n- Only approved followers see posts\n- Prevents strangers from following\n\n**Story Sharing:**\n- Story → Hide story from [specific people]\n- Close Friends list for selective sharing\n\n**Activity Status:**\n- Show Activity Status → OFF\n- Hides when you're online\n\n**Tags and Mentions:**\n- Tags → \"Allow tags from\" → \"People you follow\"\n- Mentions → \"Allow mentions from\" → \"People you follow\"\n\n**Comments:**\n- Comments → \"Allow comments from\" → \"People you follow\"\n- Filter offensive comments → ON\n\n**Guides, Posts, and Messaging:**\n- Review who can see your posts\n- Control who can message you\n\n**Location:**\n- Before posting, tap \"Add location\" and remove it\n- Don't create location-based stories\n\n### Twitter/X Privacy Settings\n\nAccess: Settings and Privacy → Privacy and Safety\n\n**Audience and Tagging:**\n- Protect your Tweets (makes account private)\n- Photo tagging → \"Allow anyone to tag you\" → OFF\n- Remove yourself from tagged photos\n\n**Your Activity:**\n- Discoverability → \"Let people find you by email\" → OFF\n- Discoverability → \"Let people find you by phone number\" → OFF\n\n**Direct Messages:**\n- Receive messages from anyone → Consider disabling\n- Show read receipts → OFF\n\n**Spaces:**\n- \"Allow people to find my Spaces\" → Consider disabling\n\n**Off-Twitter Activity:**\n- Settings → Privacy and safety → Off-Twitter activity\n- Disable tracking\n\n**Personalization:**\n- Ads preferences → Less personalized ads\n- Disable data sharing with business partners\n\n### LinkedIn Privacy Settings\n\nAccess: Me icon → Settings & Privacy → Privacy\n\n**How others see your profile:**\n- \"Who can see your email address\" → Connections\n- \"Who can see your connections\" → Only you\n- Profile viewing options → Private mode\n\n**How others see your LinkedIn activity:**\n- Share profile changes → OFF (prevents notifications)\n- Mentions or tags → Control who can tag/mention you\n\n**Blocking and hiding:**\n- Block members as needed\n- Hide connections from specific people\n\n**Job seeking preferences:**\n- Manage \"Let recruiters know you're open\" carefully\n- Can be visible to people at your current company\n\n**Advertising:**\n- Ad preferences → Control data for ad personalization\n- Opt out of ads on partner websites\n\n### TikTok Privacy Settings\n\nAccess: Profile → Menu → Settings and Privacy → Privacy\n\n**Suggest your account to others:**\n- Turn OFF (prevents recommendations)\n\n**Private Account:**\n- Enable to approve followers\n\n**Who can see your content:**\n- Liked videos → \"Only me\"\n- Downloads → Friends or OFF\n\n**Comments:**\n- Who can comment → Friends or Following\n\n**Duet and Stitch:**\n- Allow Duet → Friends or OFF\n- Allow Stitch → Friends or OFF\n\n**Data and Personalization:**\n- Settings → Privacy → Personalization and data\n- Personalized ads → OFF\n- Off-TikTok activity → Disable\n\n### Snapchat Privacy Settings\n\nAccess: Profile icon → Settings icon → Privacy Control\n\n**Contact Me:**\n- Contact me → My Friends (not Everyone)\n\n**View My Story:**\n- Everyone → Change to \"My Friends\"\n- Custom lists for close friends\n\n**See My Location:**\n- Ghost Mode → ON (hides location)\n- Or limit to close friends\n\n**See Me in Quick Add:**\n- OFF (prevents Snap suggesting you to strangers)\n\n### YouTube Privacy Settings\n\nAccess: Profile → Settings → Privacy\n\n**Subscriptions:**\n- Keep subscriptions private → ON\n\n**Saved Playlists:**\n- Make playlists private or unlisted\n\n**Watch History:**\n- Pause watch history if sharing account\n- Clear watch history regularly\n\n**Liked Videos:**\n- Make liked videos playlist private\n\n## Mobile App Privacy\n\nApp Permissions Review:\n\niOS:\n- Settings → Privacy → Review each permission type\n- Check which apps have Camera, Microphone, Location access\n- Revoke unnecessary permissions\n\nAndroid:\n- Settings → Privacy → Permission Manager\n- Review apps by permission type\n- Set location to \"Only while using app\" not \"All the time\"\n\nSocial Media Apps Often Request:\n- Contacts (to \"find friends\")\n- Camera and microphone\n- Location (to tag posts)\n- Photos (to upload)\n- Calendar\n\nBest Practice:\n- Deny by default\n- Grant only when needed\n- Revoke after use if possible\n\n## Additional Privacy Measures\n\n### Two-Factor Authentication\n\nEnable MFA on all accounts:\n- Prevents unauthorized access even if password leaks\n- Use authenticator app (not SMS)\n\n### Email Address Management\n\nUse separate email for social media:\n- Prevents primary email exposure\n- Limits spam if email is leaked\n- Easier to abandon if needed\n\n### Linked Accounts\n\nBe cautious with \"Sign in with Facebook/Google\":\n- Creates data sharing between platforms\n- Review what linked accounts can access\n- Unlink accounts you don't need\n\n### Photo Metadata\n\nPhotos contain metadata (EXIF):\n- GPS coordinates (where photo taken)\n- Date and time\n- Camera/phone model\n\nRemove metadata before posting:\n- iOS: Screenshots automatically remove metadata\n- Android: Use metadata removal apps\n- Desktop: ExifTool or similar software\n\n### Facial Recognition Opt-Out\n\nMany platforms use facial recognition:\n- Disable in settings when available\n- Consider how your face data is stored\n- European GDPR gives you more control\n\n## Teaching Kids Social Media Privacy\n\nAge Limits:\n- Most platforms require age 13+ (COPPA law)\n- Monitor younger kids' device usage\n\nRules for Kids:\n- Never share full name, age, school, address\n- Never meet online friends in person\n- Tell parents if anything makes them uncomfortable\n- Think before posting (will this embarrass me later?)\n- Privacy settings to Friends only\n\nParent Monitoring:\n- Follow/friend your kids on social media\n- Regular check-ins about online activity\n- Open conversation about online risks\n- Lead by example with your own privacy practices\n\n## Key Takeaways\n\n- Default all accounts to \"Friends only\" not Public\n- Review privacy settings quarterly (platforms change them)\n- Enable two-factor authentication on all social media accounts\n- Limit third-party app access and review regularly\n- Turn off location services and remove geotags from posts\n- Make your profile unsearchable by email/phone\n- Use private/incognito mode when researching sensitive topics\n- Think before posting - permanent internet footprint\n- Review and limit app permissions on mobile devices\n- Disable ad personalization and off-platform tracking\n- Never post your full birth date, address, or real-time location\n- Remove metadata from photos before posting\n- Make accounts private and approve followers manually\n- Regularly review tagged photos and remove unwanted tags",
      order: 6,
      courseId: courses[4].id,
      moduleId: course5Modules[1].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Identity Theft",
      videoUrl: "https://www.youtube.com/watch?v=SH5ZCrwq5yw",
      content: "# Identity Theft Prevention and Recovery\n\n## What is Identity Theft?\n\nIdentity theft occurs when someone uses your personal information without permission to:\n- Open accounts in your name\n- Access your bank accounts\n- File fraudulent tax returns\n- Obtain medical care\n- Commit crimes\n- Apply for credit cards/loans\n- Get a job using your identity\n\nThe impact can be devastating:\n- Average victim spends 200+ hours recovering\n- Financial losses average $1,100 (can be much higher)\n- Credit score damage lasting years\n- Emotional stress and anxiety\n- Difficulty getting loans, jobs, or housing\n- Risk of being arrested for crimes you didn't commit\n\n## How Identity Theft Happens\n\n### Data Breaches\n\nMassive corporate breaches expose millions:\n- Equifax breach (2017): 147 million SSNs, DOBs, addresses\n- Yahoo breach: 3 billion accounts\n- Capital One breach: 100 million accounts\n- T-Mobile breach: 54 million customers\n\nYour data is in databases you don't control:\n- Credit bureaus\n- Healthcare providers\n- Retailers\n- Banks\n- Government agencies\n- Employers\n\n### Phishing and Social Engineering\n\nCriminals trick you into revealing information:\n- Fake emails from \"banks\" asking for account verification\n- Phone calls from \"IRS\" demanding immediate payment\n- Text messages about \"suspicious activity\"\n- Fake websites that look legitimate\n\n### Physical Theft\n\nOld-school but still effective:\n- Stolen mail (credit card offers, bank statements)\n- Dumpster diving for discarded documents\n- Stolen wallets/purses\n- Skimming devices on ATMs\n- Shoulder surfing for PINs\n\n### Online Exposure\n\nInformation you share enables theft:\n- Social media profiles with DOB, hometown, mother's maiden name\n- Public records (property ownership, court documents)\n- Data brokers selling your information\n- Unsecured Wi-Fi usage\n- Malware on your devices\n\n## Warning Signs of Identity Theft\n\nEarly Detection is Critical:\n\nFinancial Red Flags:\n- Unexplained withdrawals from bank accounts\n- Credit cards you didn't apply for\n- Bills for services you didn't use\n- Calls from debt collectors about unknown debts\n- Credit report shows accounts you didn't open\n- Medical bills for care you didn't receive\n- IRS notification about duplicate tax return\n\nAccount Access Issues:\n- Can't log into accounts (password changed)\n- Missing mail (especially financial statements)\n- Unexpected password reset emails\n- Two-factor authentication codes you didn't request\n\nGovernment/Legal:\n- Notice about unemployment benefits you didn't file\n- Court summons for cases you're not involved in\n- Arrest warrant for crimes you didn't commit\n- Driver's license suspension for reasons unknown\n\n## Prevention Strategies\n\n### Protect Your Social Security Number\n\nYour SSN is the master key to your identity:\n\nNever Carry SSN Card:\n- Store in safe place at home\n- Only bring when absolutely required (new job, Social Security office)\n\nLimit Sharing:\n- Ask \"Do you really need my SSN?\"\n- Can I use alternate identifier?\n- How will you protect it?\n- Who will have access?\n\nMedicare Cards:\n- New cards no longer show full SSN\n- Old cards should be destroyed\n\n### Monitor Your Credit\n\nFree Credit Reports:\n- AnnualCreditReport.com (official site)\n- One free report per year from each bureau (Equifax, Experian, TransUnion)\n- Stagger requests (one every 4 months for year-round monitoring)\n\nWhat to Check:\n- Accounts you don't recognize\n- Incorrect personal information\n- Inquiries you didn't authorize\n- Addresses you've never lived at\n\nCredit Monitoring Services:\n- Credit Karma (free, real-time alerts)\n- Bank/credit card free monitoring\n- Paid services (IdentityGuard, LifeLock, etc.)\n\n### Freeze Your Credit\n\nCredit Freeze is the strongest protection:\n\nWhat it Does:\n- Prevents new accounts from being opened\n- Creditors can't access your report\n- Identity thieves can't get credit in your name\n- Free by law\n\nHow to Freeze:\n1. Contact all three credit bureaus:\n   - Equifax: equifax.com/personal/credit-report-services\n   - Experian: experian.com/freeze\n   - TransUnion: transunion.com/credit-freeze\n\n2. Provide personal information to verify identity\n\n3. Receive PIN/password to manage freeze\n\n4. Freeze remains until you lift it\n\nWhen to Temporarily Lift:\n- Applying for credit card, loan, mortgage\n- Renting apartment (some landlords check credit)\n- Opening utility account\n\nCredit Freeze vs. Credit Lock:\n- Freeze: Free, legally regulated, more secure\n- Lock: Often paid service, less regulation, convenience features\n\nAlso Freeze:\n- ChexSystems (banking)\n- Innovis (4th credit bureau)\n- National Consumer Telecom & Utilities Exchange (NCTUE)\n\n### Secure Your Mail\n\nPhysical Mail Security:\n- Use locking mailbox\n- Retrieve mail promptly\n- USPS Hold Mail when traveling\n- Shred financial documents, credit card offers\n- Opt out of pre-screened credit offers (optoutprescreen.com)\n\nGo Paperless:\n- Electronic bank statements\n- Online bill payment\n- Reduces mail theft risk\n- Faster fraud detection\n\n### Secure Your Accounts\n\nPassword Strategy:\n- Unique password for every account\n- Use password manager (LastPass, 1Password, Bitwarden)\n- 16+ character passwords\n- Never reuse passwords\n\nMulti-Factor Authentication:\n- Enable on all accounts that support it\n- Use authenticator app (not SMS when possible)\n- Prevents access even if password is stolen\n\n## If You Become a Victim\n\n### Immediate Steps (First 24 Hours)\n\n1. Place Fraud Alert\n   - Call one credit bureau\n   - Automatically applied to all three\n   - Equifax: 1-800-525-6285\n   - Experian: 1-888-397-3742\n   - TransUnion: 1-800-680-7289\n\n2. Order Credit Reports\n   - Review for fraudulent accounts\n   - AnnualCreditReport.com\n\n3. Report to FTC\n   - IdentityTheft.gov\n   - Create recovery plan\n   - Get Identity Theft Report (affidavit)\n\n4. File Police Report\n   - Bring to local police\n   - Request copy of report\n   - Needed for legal proceedings\n\n### Close Compromised Accounts\n\nFor Each Fraudulent Account:\n- Call fraud department\n- Explain you're identity theft victim\n- Send identity theft report\n- Close account in writing\n- Request fraudulent charges removed\n\n### Monitor and Follow Up\n\nFirst Year After Theft:\n- Check credit reports monthly\n- Review bank/card statements weekly\n- File taxes early (before fraudster can)\n- Keep detailed records of everything\n\nLong-Term:\n- Credit freeze on all bureaus\n- Continue monitoring indefinitely\n- Save all documentation\n\n## Recovery Resources\n\nFederal Trade Commission (FTC):\n- IdentityTheft.gov (comprehensive recovery guide)\n- File complaint\n- Create recovery plan\n- Get Identity Theft Report\n\nIRS Identity Theft:\n- Identity Protection PIN (IP PIN)\n- Form 14039 (Identity Theft Affidavit)\n- 1-800-908-4490\n\nSocial Security Administration:\n- Report SSN misuse\n- 1-800-772-1213\n- SSA.gov/myaccount\n\n## Key Takeaways\n\n- Never carry your Social Security card - store it securely\n- Freeze your credit with all three bureaus (free and effective)\n- Check credit reports regularly (annualcreditreport.com every 4 months)\n- Enable two-factor authentication on all important accounts\n- Use unique passwords for every account with a password manager\n- Shred financial documents and opt out of prescreened credit offers\n- Be skeptical of unsolicited requests for personal information\n- Monitor accounts weekly for unauthorized activity\n- If victimized, act immediately: fraud alert, credit freeze, FTC report\n- Recovery takes time but is possible with persistence and documentation\n- Prevention is far easier than recovery - stay vigilant",
      order: 7,
      courseId: courses[4].id,
      moduleId: course5Modules[2].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Data Regulations",
      videoUrl: "https://www.youtube.com/watch?v=HXREU0xHlgI",
      content: "# Data Protection Regulations (GDPR, CCPA)\n\n## Why Data Protection Laws Matter\n\nFor decades, companies collected personal data with few restrictions:\n- Sold data to third parties without consent\n- Suffered breaches with minimal consequences\n- Buried privacy policies in legalese\n- Made opting out nearly impossible\n\nModern data protection laws give power back to individuals:\n- Control over your personal data\n- Right to know what's collected\n- Right to delete your data\n- Right to opt out of selling\n- Heavy penalties for violations\n\n## General Data Protection Regulation (GDPR)\n\n### Overview\n\nImplemented: May 25, 2018\nJurisdiction: European Union + European Economic Area\nApplies to: Any organization processing EU residents' data (even if based outside EU)\n\nStrictest privacy law globally:\n- Gold standard for data protection\n- Inspired similar laws worldwide\n- Penalties up to €20 million or 4% of global revenue (whichever is higher)\n\n### Core Principles\n\n1. Lawfulness, Fairness, Transparency\n   - Must have legal basis for processing data\n   - Clear, understandable privacy notices\n   - No hidden data collection\n\n2. Purpose Limitation\n   - Data collected for specific, explicit purposes\n   - Can't repurpose data without consent\n   - \"We'll use this for X\" means only X\n\n3. Data Minimization\n   - Collect only what's necessary\n   - \"Need to know\" principle\n   - Can't demand excessive information\n\n4. Accuracy\n   - Keep data accurate and up to date\n   - Allow corrections\n   - Delete inaccurate information\n\n5. Storage Limitation\n   - Keep data only as long as needed\n   - Define retention periods\n   - Delete when purpose is fulfilled\n\n6. Integrity and Confidentiality\n   - Protect data with appropriate security\n   - Prevent unauthorized access\n   - Encryption, access controls\n\n7. Accountability\n   - Organizations must demonstrate compliance\n   - Document data practices\n   - Regular audits and assessments\n\n### Your Rights Under GDPR\n\nRight to Be Informed:\n- Clear privacy notices\n- What data is collected\n- Why it's collected\n- How it's used\n- Who it's shared with\n- How long it's kept\n\nRight of Access:\n- Request copy of your data\n- Free of charge\n- Within one month\n- \"Show me everything you have about me\"\n\nRight to Rectification:\n- Correct inaccurate data\n- Complete incomplete data\n- Organization must comply within one month\n\nRight to Erasure (\"Right to Be Forgotten\"):\n- Request deletion of your data\n- Applies when:\n  - Data no longer needed\n  - You withdraw consent\n  - You object to processing\n  - Data was unlawfully processed\n\nRight to Restrict Processing:\n- Limit how data is used\n- \"Keep it but don't use it\"\n- While verifying accuracy or assessing objection\n\nRight to Data Portability:\n- Receive your data in machine-readable format\n- Transfer data between services\n- \"Give me my data so I can move to competitor\"\n\nRight to Object:\n- Object to processing for direct marketing\n- Object to automated decision-making\n- Organization must stop unless compelling reason\n\nRights Related to Automated Decision-Making:\n- Not subject to decisions based solely on automated processing\n- Right to human review\n- Important for: credit decisions, hiring, insurance\n\n### GDPR Consent Requirements\n\nValid Consent Must Be:\n- Freely given (not coerced)\n- Specific (separate for each purpose)\n- Informed (clear what you're consenting to)\n- Unambiguous (clear affirmative action)\n\nProhibited Practices:\n- Pre-checked boxes (must actively opt-in)\n- Bundled consent (\"agree or can't use service\" for non-essential features)\n- Making service conditional on unrelated consent\n\nWithdrawal:\n- Must be as easy to withdraw as to give\n- One-click unsubscribe\n- Organizations must honor immediately\n\n### Enforcement and Penalties\n\nMajor GDPR Fines:\n- Amazon: €746 million (2021) - consent violations\n- Meta/Facebook: €1.2 billion (2023) - data transfers\n- Google: €90 million (2020) - cookie consent violations\n\nData Protection Authorities (DPAs):\n- Each EU country has DPA\n- Investigates complaints\n- Issues fines\n- Provides guidance\n\nHow to File Complaint:\n- Contact your country's DPA\n- File online (most have web forms)\n- No cost to file\n- DPA investigates on your behalf\n\n## California Consumer Privacy Act (CCPA)\n\n### Overview\n\nImplemented: January 1, 2020\nAmended by: California Privacy Rights Act (CPRA, 2023)\nJurisdiction: California residents\nApplies to: Businesses meeting thresholds (revenue $25M+, 50K+ consumers, 50%+ revenue from data sales)\n\nMost comprehensive US privacy law:\n- Modeled after GDPR\n- Gives California residents significant rights\n- Other states following with similar laws\n\n### Your Rights Under CCPA/CPRA\n\nRight to Know:\n- What personal information is collected\n- Sources of information\n- Purpose for collection\n- Third parties data is shared with\n- Specific pieces of data held about you\n\nRight to Delete:\n- Request deletion of personal information\n- Exceptions: complete transaction, comply with legal obligations\n\nRight to Opt Out:\n- Opt out of sale/sharing of personal information\n- \"Do Not Sell or Share My Personal Information\" link required\n- Applies to businesses selling data\n\nRight to Correct:\n- Correct inaccurate personal information\n- Added by CPRA\n\nRight to Limit Use of Sensitive Personal Information:\n- Sensitive data: SSN, financial accounts, precise geolocation, health, race, religion\n- Right to limit use to necessary business purposes only\n- Added by CPRA\n\nRight to Non-Discrimination:\n- Can't be denied service for exercising rights\n- Can't be charged different prices\n- Can't receive different quality of service\n- Exception: Can offer financial incentive for data collection if reasonably related to value\n\n### CCPA vs GDPR Differences\n\nScope:\n- GDPR: All EU residents\n- CCPA: California residents + qualifying businesses\n\nOpt-In vs Opt-Out:\n- GDPR: Opt-in (must get consent before collecting)\n- CCPA: Opt-out (can collect but must allow opt-out of selling)\n\nEnforcement:\n- GDPR: Government agencies\n- CCPA: Attorney General + private right of action for breaches\n\nPenalties:\n- GDPR: Up to 4% global revenue\n- CCPA: $2,500 per violation, $7,500 for intentional\n\n### How to Exercise CCPA Rights\n\nLook for Links on Websites:\n- \"Do Not Sell My Personal Information\"\n- \"Your Privacy Choices\"\n- Usually in footer\n\nSubmission Methods:\n- Web forms\n- Email\n- Toll-free phone number\n- Businesses must provide at least 2 methods\n\nResponse Timeline:\n- 45 days to respond\n- Can extend another 45 days if complex\n\nVerification:\n- Business may verify your identity\n- Must match info they already have\n- Can't require new account creation\n\n## Other US State Privacy Laws\n\nVirginia Consumer Data Protection Act (VCDPA):\n- Effective: January 1, 2023\n- Similar to CCPA\n- Rights: access, correct, delete, opt-out\n\nColorado Privacy Act (CPA):\n- Effective: July 1, 2023\n- Similar to CCPA/VCDPA\n- Universal opt-out mechanism\n\nConnecticut Data Privacy Act:\n- Effective: July 1, 2023\n\nUtah Consumer Privacy Act:\n- Effective: December 31, 2023\n\nTrend: More states passing similar laws\n\n## Other International Laws\n\n### Brazil: Lei Geral de Proteção de Dados (LGPD)\n- Similar to GDPR\n- Effective: 2020\n- Applies to Brazilian residents\n\n### Canada: Personal Information Protection and Electronic Documents Act (PIPEDA)\n- National privacy law\n- Consent-based\n- Right to access and correct\n\n### Australia: Privacy Act 1988\n- Australian Privacy Principles\n- Right to access\n- Complaint mechanism\n\n### Japan: Act on Protection of Personal Information (APPI)\n- Reformed 2017, 2020\n- Aligns with GDPR principles\n\n### China: Personal Information Protection Law (PIPL)\n- Effective: 2021\n- Similar to GDPR\n- Strict cross-border data transfer rules\n\n## How to Exercise Your Rights\n\n### GDPR Rights (EU Residents)\n\n1. Data Access Request:\n   - Contact company's Data Protection Officer (DPO)\n   - Email or web form\n   - Template: \"I request a copy of all personal data you hold about me under Article 15 of the GDPR\"\n\n2. Data Deletion Request:\n   - Contact DPO\n   - Template: \"I request deletion of all my personal data under Article 17 of the GDPR\"\n\n3. If No Response:\n   - Complaint to national Data Protection Authority\n   - EU residents: Find your DPA at edpb.europa.eu\n\n### CCPA Rights (California Residents)\n\n1. Find Privacy Link:\n   - Footer: \"Do Not Sell My Personal Information\"\n   - Privacy Policy page\n\n2. Submit Request:\n   - Fill out web form\n   - Email: privacy@company.com\n   - Call toll-free number\n\n3. Verify Identity:\n   - Provide matching information\n   - May need to confirm email\n\n4. If No Response:\n   - File complaint with California Attorney General\n   - cal.ag/privacy\n\n## Privacy Tools and Resources\n\n### Browser Extensions\n\nPrivacy Badger (EFF):\n- Blocks invisible trackers\n- Learns over time\n\nuBlock Origin:\n- Ad blocker\n- Reduces tracking\n\n### Opt-Out Services\n\nPrivacy Rights Clearinghouse:\n- privacyrights.org\n- Comprehensive guides\n\nData Broker Opt-Outs:\n- Manual process\n- Opt out from major brokers:\n  - Spokeo, Whitepages, Intelius, BeenVerified, MyLife, PeopleFinder\n\nJustDeleteMe:\n- justdelete.me\n- Instructions to delete accounts from hundreds of sites\n\n### Legal Resources\n\nElectronic Frontier Foundation (EFF):\n- eff.org\n- Digital rights advocacy\n- Privacy guides\n\nYour Rights Organizations:\n- Access Now (accessnow.org)\n- Privacy International (privacyinternational.org)\n- Electronic Privacy Information Center (EPIC.org)\n\n## Key Takeaways\n\n- GDPR (EU) and CCPA (California) give you significant control over your data\n- You have the right to know what data companies collect about you\n- You can request deletion of your personal data\n- You can opt out of data selling (CCPA/CPRA)\n- Companies must respond to requests within 30-45 days\n- Consent must be freely given and easy to withdraw (GDPR)\n- Heavy fines encourage company compliance (GDPR up to 4% global revenue)\n- Other states and countries are passing similar laws\n- To exercise rights, look for privacy links on websites or contact privacy/DPO email\n- File complaints with regulators if companies don't respond\n- Use privacy tools (Privacy Badger, uBlock Origin) to reduce tracking\n- Opt out of data brokers (tedious but worthwhile for high-risk individuals)\n- These laws apply even if you're not in EU/California (if company operates there)\n- Read privacy policies to understand your rights under each law\n- More comprehensive federal US privacy law may come in the future",
      order: 8,
      courseId: courses[4].id,
      moduleId: course5Modules[2].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "MITRE ATT&CK",
      videoUrl: "https://www.youtube.com/watch?v=bkfwMADar0M",
      content: "# Understanding the MITRE ATT&CK Framework\n\n## What is MITRE ATT&CK?\n\nMITRE ATT&CK is a globally accessible knowledge base of adversary tactics and techniques based on real-world observations.\n\nCreated by: MITRE Corporation\nPurpose: Standardized framework for understanding cyber adversary behavior\n\nThink of ATT&CK as a dictionary of hacker techniques and a common language for threat intelligence.\n\n## The 14 Enterprise Tactics\n\n1. Reconnaissance - Gathering information\n2. Resource Development - Establishing resources\n3. Initial Access - Getting into network\n4. Execution - Running malicious code\n5. Persistence - Maintaining foothold\n6. Privilege Escalation - Gaining higher permissions\n7. Defense Evasion - Avoiding detection\n8. Credential Access - Stealing credentials\n9. Discovery - Learning about environment\n10. Lateral Movement - Moving through network\n11. Collection - Gathering data\n12. Command and Control - Communicating with systems\n13. Exfiltration - Stealing data out\n14. Impact - Disrupting availability\n\n## Example Techniques\n\nT1566: Phishing (Initial Access)\nT1003: Credential Dumping (Credential Access)\nT1059: Command and Scripting (Execution)\nT1078: Valid Accounts (Multiple tactics)\n\n## How Organizations Use ATT&CK\n\n- Threat intelligence and tracking\n- Detection engineering\n- Red team planning\n- Gap analysis\n- Security product evaluation\n\n## Key Takeaways\n\n- Common language across cybersecurity industry\n- 200+ techniques based on real attacks\n- Used for detection, threat intelligence, testing\n- Free and openly accessible\n- Continuously updated by MITRE",
      order: 4,
      courseId: courses[5].id,
      moduleId: course6Modules[0].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Cyber Kill Chain",
      videoUrl: "https://www.youtube.com/watch?v=bZqaGd-b4lM",
      content: "# Understanding the Cyber Kill Chain\n\n## What is the Cyber Kill Chain?\n\nFramework for understanding the stages of a cyberattack, developed by Lockheed Martin in 2011.\n\nKey Insight: If you break the chain at any point, you stop the attack.\n\n## The 7 Stages\n\n1. Reconnaissance - Research and identify targets\n2. Weaponization - Create malicious payload\n3. Delivery - Transmit weapon to target\n4. Exploitation - Exploit vulnerability to execute\n5. Installation - Install malware on system\n6. Command and Control - Establish communication channel\n7. Actions on Objectives - Achieve attacker's goal\n\n## Defense Strategy\n\n**Left of Boom (Proactive):**\n- Stop early stages (Recon, Delivery, Exploitation)\n- More cost-effective, less damage\n\n**Right of Boom (Reactive):**\n- Later stages (Installation, C2, Actions)\n- Attack succeeded, focus on containment\n\n## Breaking the Kill Chain\n\nEach stage offers opportunities to disrupt:\n- Delivery: Email filtering, web filtering\n- Exploitation: Patch management, EDR\n- C2: Network monitoring, firewall rules\n- Actions: Backups, segmentation\n\n## Key Takeaways\n\n- 7-stage framework for understanding attacks\n- Breaking any stage stops the attack\n- Focus on early stages for prevention\n- Use with MITRE ATT&CK for comprehensive defense\n- Map security controls to each stage",
      order: 5,
      courseId: courses[5].id,
      moduleId: course6Modules[0].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Indicators of Compromise",
      videoUrl: "https://www.youtube.com/watch?v=SjMBxJDVgJ8",
      content: "# Indicators of Compromise (IOCs)\n\n## What are IOCs?\n\nForensic artifacts or observable evidence indicating a potential security breach.\n\nThink of IOCs as digital fingerprints left by attackers.\n\n## Types of IOCs\n\n**Network-Based:**\n- IP addresses (C2 servers)\n- Domain names\n- URLs\n- Email addresses\n- Network traffic patterns\n\n**Host-Based:**\n- File hashes (MD5, SHA-256)\n- File names and paths\n- Registry keys\n- Mutex names\n- Processes\n\n**Behavioral:**\n- User behavior anomalies\n- System behavior changes\n- Application behavior\n\n## IOC Pyramid of Pain\n\n**Easy to Change (Low Value):**\n- Hash values - change one byte\n- IP addresses - cheap to change\n- Domain names - easy to register\n\n**Hard to Change (High Value):**\n- Tools - requires development\n- TTPs (Tactics, Techniques, Procedures) - fundamental methodology\n\nFocus on detecting behaviors (TTPs) over signatures.\n\n## Using IOCs\n\n**Threat Hunting:**\n- Search environment for known IOCs\n- Proactive detection\n- Find compromised systems\n\n**Incident Response:**\n- Extract IOCs from compromised systems\n- Search historical data\n- Identify other affected systems\n\n## Key Takeaways\n\n- IOCs are evidence of security breaches\n- TTPs more valuable than IPs/hashes\n- IOCs have short shelf life - update regularly\n- Use for threat hunting and incident response\n- Share via standardized formats (STIX/TAXII)\n- Automate IOC collection and distribution",
      order: 6,
      courseId: courses[5].id,
      moduleId: course6Modules[1].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Containment",
      videoUrl: "https://www.youtube.com/watch?v=VJ1s3fXVJ3g",
      content: "# Incident Response: Containment\n\n## What is Containment?\n\nContainment is the phase of incident response focused on limiting the scope and impact of a security incident.\n\nGoal: Stop the bleeding before fixing the wound.\n\n## Why Containment Matters\n\nQuick containment prevents:\n- Further data exfiltration\n- Lateral movement to other systems\n- Additional system compromises\n- Escalating damage and costs\n\n**Speed is critical:** Every minute counts during an active incident.\n\n## Types of Containment\n\n### Short-Term Containment\n\nImmediate actions to stop active attack:\n\n**Network Isolation:**\n- Disconnect compromised systems\n- Block attacker C2 communications\n- Segment affected network areas\n\n**Account Lockdown:**\n- Disable compromised accounts\n- Reset passwords\n- Revoke access tokens\n- Force MFA re-enrollment\n\n**Process Termination:**\n- Kill malicious processes\n- Stop malware execution\n- Disable scheduled tasks\n\n### Long-Term Containment\n\nTemporary fixes while planning recovery:\n\n**System Patching:**\n- Apply critical security updates\n- Close exploited vulnerabilities\n- Harden configurations\n\n**Monitoring Enhancement:**\n- Increase logging\n- Deploy additional sensors\n- Watch for attacker return\n\n**Backup Systems:**\n- Deploy temporary replacements\n- Restore critical services\n- Maintain business operations\n\n## Containment Strategies\n\n### Complete Isolation\n\n**When to Use:**\n- Active data exfiltration\n- Ransomware spreading\n- Critical system compromise\n\n**Actions:**\n- Physically disconnect network cable\n- Disable wireless\n- Isolate VLAN\n- Shutdown system (last resort)\n\n**Caution:** May alert attacker, lose volatile evidence\n\n### Network Segmentation\n\n**When to Use:**\n- Limiting lateral movement\n- Protecting critical assets\n- Partial compromise\n\n**Actions:**\n- ACL changes on firewall\n- VLAN reconfiguration\n- Micro-segmentation\n- Block specific traffic flows\n\n### Monitoring Without Disruption\n\n**When to Use:**\n- Gathering intelligence\n- Observing attacker TTPs\n- Building legal case\n\n**Actions:**\n- Enhanced logging\n- Network taps\n- Silent observation\n- Coordinated takedown later\n\n**Risk:** Allows continued damage\n\n## Containment Decision Matrix\n\nConsider these factors:\n\n**Business Impact:**\n- Revenue loss from downtime\n- Customer trust damage\n- Regulatory penalties\n\n**Technical Impact:**\n- Data sensitivity\n- Number of systems affected\n- Attacker capabilities\n\n**Evidence Preservation:**\n- Legal requirements\n- Forensic needs\n- Attribution goals\n\n**Resource Availability:**\n- Incident response team size\n- Time of day/week\n- Vendor support\n\n## Containment Actions by Incident Type\n\n### Ransomware\n\n1. Isolate infected systems immediately\n2. Identify patient zero\n3. Block C2 communication\n4. Disable backups access\n5. Prevent lateral spread\n6. DO NOT pay ransom immediately\n\n### Data Breach\n\n1. Block data exfiltration paths\n2. Identify compromised data\n3. Revoke attacker access\n4. Preserve evidence\n5. Notify stakeholders\n6. Engage legal/PR teams\n\n### Phishing Campaign\n\n1. Block sender domains\n2. Delete malicious emails\n3. Disable compromised accounts\n4. Reset credentials\n5. Scan for malware\n6. User awareness alert\n\n### DDoS Attack\n\n1. Activate DDoS mitigation\n2. Rate limiting\n3. ISP coordination\n4. Cloud scrubbing service\n5. Identify attack vector\n6. Block source IPs (if feasible)\n\n## Common Containment Mistakes\n\n**Mistake 1: Acting Too Slowly**\n- Hesitation allows spread\n- Every minute matters\n- Have playbooks ready\n\n**Mistake 2: Alerting the Attacker**\n- Obvious containment tips off attacker\n- May trigger data destruction\n- Coordinate simultaneous actions\n\n**Mistake 3: Inadequate Containment**\n- Partial containment allows resumption\n- Attacker finds alternate path\n- Must be thorough\n\n**Mistake 4: Destroying Evidence**\n- Hasty shutdown loses volatile data\n- Needed for forensics and legal\n- Image before containment when possible\n\n**Mistake 5: Poor Communication**\n- Team not coordinated\n- Actions conflict\n- Stakeholders uninformed\n\n## Containment Tools\n\n**Network:**\n- Firewall rules\n- IDS/IPS blocking\n- DNS sinkholing\n- Network access control (NAC)\n\n**Endpoint:**\n- EDR isolation features\n- Process termination\n- Account disablement\n- Host firewall\n\n**Cloud:**\n- Security group changes\n- Identity and Access Management\n- API throttling\n- Account suspension\n\n## Documentation During Containment\n\nRecord everything:\n- Actions taken and time\n- Who authorized decisions\n- Systems affected\n- Evidence preserved\n- Containment effectiveness\n\nThis is critical for:\n- Post-incident review\n- Legal proceedings\n- Regulatory compliance\n- Future improvements\n\n## After Containment\n\nNext Steps:\n\n1. **Eradication:** Remove attacker presence completely\n2. **Recovery:** Restore systems to normal\n3. **Lessons Learned:** Document and improve\n\nBut first ensure:\n- Containment is complete\n- No attacker access remains\n- Monitoring in place\n\n## Key Takeaways\n\n- Containment limits damage and prevents spread\n- Speed is critical - every minute counts\n- Short-term: stop active attack (isolation, account lockdown)\n- Long-term: temporary fixes during recovery planning\n- Consider business impact, technical impact, evidence preservation\n- Complete isolation for active threats (ransomware, exfiltration)\n- Network segmentation to limit lateral movement\n- Document all actions taken during containment\n- Don't alert attacker - coordinate simultaneous actions\n- Have pre-approved playbooks for common scenarios\n- Containment must be thorough - partial containment fails",
      order: 7,
      courseId: courses[5].id,
      moduleId: course6Modules[2].id
    }
  });

  await prisma.lesson.create({
    data: {
      title: "Post-Incident Review",
      videoUrl: "https://www.youtube.com/watch?v=cUrjcCxWoIc",
      content: "# Post-Incident Review and Lessons Learned\n\n## What is a Post-Incident Review?\n\nA structured meeting held after resolving a security incident to analyze what happened, what went well, what didn't, and how to improve.\n\nAlso called: Lessons Learned, After Action Review, Retrospective\n\n## Why Post-Incident Reviews Matter\n\nBenefits:\n- Prevent future incidents\n- Improve incident response process\n- Identify security gaps\n- Document institutional knowledge\n- Meet compliance requirements\n- Build team cohesion\n\n**Most important:** Organizations that skip this step repeat the same mistakes.\n\n## When to Conduct Review\n\nTiming:\n- Schedule within 1-2 weeks of incident resolution\n- Soon enough that details are fresh\n- Late enough that emotions have cooled\n- After immediate crisis is over\n\nAll Incidents:\n- Major incidents (definitely)\n- Medium incidents (recommended)\n- Minor incidents (if patterns emerge)\n\n## Who Should Attend\n\nRequired Participants:\n- Incident response team\n- Security operations\n- IT operations\n- System owners\n- Management (appropriate level)\n\nOptional:\n- Legal counsel\n- PR/Communications\n- External consultants\n- Third-party vendors\n\n## Review Agenda\n\n### 1. Incident Summary (5-10 min)\n\nBrief overview:\n- What happened?\n- When was it detected?\n- What systems were affected?\n- What data was impacted?\n\nKeep factual, not judgmental.\n\n### 2. Timeline Review (15-20 min)\n\nWalk through chronologically:\n- Initial compromise\n- Dwell time (time before detection)\n- Detection point\n- Response actions\n- Containment achieved\n- Recovery completed\n\nIdentify key decision points.\n\n### 3. What Went Well (10-15 min)\n\nPositive aspects:\n- What processes worked?\n- Which tools were effective?\n- Who performed excellently?\n- What decisions were correct?\n\nImportant: Recognize successes, not just failures.\n\n### 4. What Went Wrong (15-20 min)\n\nProblems encountered:\n- Detection delays\n- Communication breakdowns\n- Tool failures\n- Knowledge gaps\n- Process issues\n\nBlameless: Focus on systems, not individuals.\n\n### 5. Root Cause Analysis (10-15 min)\n\n**5 Whys Technique:**\n- Why did the incident occur?\n  - Phishing email was successful\n- Why was it successful?\n  - User clicked and entered credentials\n- Why did user fall for it?\n  - Email looked legitimate, no training\n- Why no training?\n  - No security awareness program\n- Why no program?\n  - No budget allocated\n\n**Root cause:** Lack of security awareness investment\n\n### 6. Action Items (15-20 min)\n\nSpecific, actionable improvements:\n- Technical fixes\n- Process changes\n- Training needs\n- Tool purchases\n- Policy updates\n\nEach action item needs:\n- Clear description\n- Owner assigned\n- Due date\n- Success criteria\n\n### 7. Follow-up Plan (5 min)\n\n- Who will track action items?\n- When to review progress?\n- How to measure success?\n\n## Blameless Culture\n\nCritical Principle: Focus on systems, not people.\n\n**Bad Approach:**\n- \"Bob clicked the phishing email\"\n- \"Sarah failed to detect the intrusion\"\n- \"IT didn't patch the server\"\n\n**Good Approach:**\n- \"Our email filtering didn't catch this attack\"\n- \"Detection tools lack visibility into this technique\"\n- \"Patch management process needs improvement\"\n\nWhy Blameless:\n- Encourages honesty\n- Surfaces real problems\n- Retains talented staff\n- Fosters learning culture\n\n## Sample Action Items\n\n**Technical Controls:**\n- Implement EDR on all endpoints (Owner: IT, Due: 60 days)\n- Enable MFA for all accounts (Owner: Security, Due: 30 days)\n- Deploy email sandbox (Owner: Email Admin, Due: 90 days)\n\n**Process Improvements:**\n- Create incident response playbook (Owner: IR Team, Due: 45 days)\n- Establish on-call rotation (Owner: Manager, Due: 30 days)\n- Document escalation procedures (Owner: Security, Due: 30 days)\n\n**Training:**\n- Conduct phishing simulation (Owner: Security Awareness, Due: 60 days)\n- IR team tabletop exercise (Owner: IR Lead, Due: 90 days)\n- Executive cyber crisis simulation (Owner: CISO, Due: 120 days)\n\n## Metrics to Track\n\n**Detection Metrics:**\n- Dwell time (time from compromise to detection)\n- Mean time to detect (MTTD)\n- Detection source (tool, user report, vendor)\n\n**Response Metrics:**\n- Mean time to respond (MTTR)\n- Mean time to contain (MTTC)\n- Mean time to recover (MTTR)\n\n**Impact Metrics:**\n- Systems affected\n- Data compromised\n- Downtime duration\n- Financial cost\n\nTrack over time: Are we improving?\n\n## Documentation\n\nCreate Written Report:\n\n**Executive Summary:**\n- High-level overview\n- Business impact\n- Key findings\n- Critical actions\n\n**Technical Details:**\n- Complete timeline\n- Indicators of compromise\n- Attack methodology\n- Affected systems\n\n**Lessons Learned:**\n- What worked\n- What didn't\n- Root causes\n- Action items with owners and dates\n\n**Appendices:**\n- Logs and evidence\n- IOCs\n- Communications\n- External reports\n\nDistribute to:\n- Incident response team\n- Management\n- Compliance (if required)\n- Board (for major incidents)\n\nProtect as privileged: Legal/attorney-client privilege\n\n## Tracking Action Items\n\n**Dashboard:**\n- List all action items\n- Current status (not started, in progress, complete)\n- Owner, due date, priority\n\n**Regular Review:**\n- Weekly check-ins for critical items\n- Monthly review of all items\n- Escalate overdue items\n\n**Measure Success:**\n- Track completion rate\n- Verify effectiveness (did it solve the problem?)\n- Adjust approach if needed\n\n## Common Pitfalls\n\n**Pitfall 1: Skipping the Review**\n- \"Too busy\"\n- \"Everyone knows what happened\"\n- Result: Repeat incidents\n\n**Pitfall 2: Blame Game**\n- Focuses on person, not system\n- Discourages honesty\n- People hide problems\n\n**Pitfall 3: No Follow-Through**\n- Create action items\n- Never implement them\n- Same problems recur\n\n**Pitfall 4: Too High-Level**\n- \"We need better security\"\n- Not actionable\n- No one takes ownership\n\n**Pitfall 5: Analysis Paralysis**\n- Endless discussion\n- No conclusions\n- No action items\n\n## Key Takeaways\n\n- Conduct post-incident review within 1-2 weeks of resolution\n- Blameless culture - focus on systems, not people\n- Review what went well AND what went wrong\n- Use 5 Whys technique for root cause analysis\n- Create specific, actionable improvements with owners and due dates\n- Track action items to completion\n- Document findings in written report\n- Measure key metrics (MTTD, MTTR, MTTC) to track improvement\n- Include technical, process, and training action items\n- Review is required for major incidents, recommended for all\n- Don't skip this step - organizations that don't learn from incidents repeat them",
      order: 8,
      courseId: courses[5].id,
      moduleId: course6Modules[2].id
    }
  });

  // Update course durations to reflect expanded content
  await prisma.course.update({ where: { id: courses[0].id }, data: { duration: "4 hours" } });
  await prisma.course.update({ where: { id: courses[1].id }, data: { duration: "4 hours" } });
  await prisma.course.update({ where: { id: courses[2].id }, data: { duration: "3.5 hours" } });
  await prisma.course.update({ where: { id: courses[3].id }, data: { duration: "3 hours" } });
  await prisma.course.update({ where: { id: courses[4].id }, data: { duration: "3.5 hours" } });
  await prisma.course.update({ where: { id: courses[5].id }, data: { duration: "5 hours" } });

  console.log('✅ Added 18 modules and 30 new lessons (48 total lessons across 6 courses)');

  // ============================================
  // CREATE QUIZZES FOR COURSES
  // ============================================

  // Get lessons for quiz creation
  const allCourseLessons = await prisma.lesson.findMany({
    orderBy: [{ courseId: 'asc' }, { order: 'asc' }]
  });
  const lessonsByCourse: { [key: string]: typeof allCourseLessons } = {};
  for (const lesson of allCourseLessons) {
    if (!lessonsByCourse[lesson.courseId]) {
      lessonsByCourse[lesson.courseId] = [];
    }
    lessonsByCourse[lesson.courseId].push(lesson);
  }

  // Quiz for Course 1, Lesson 3 (Protecting Yourself from Phishing)
  await prisma.quiz.create({
    data: {
      lessonId: lessonsByCourse[courses[0].id][2].id,
      title: 'Phishing Protection Quiz',
      passingScore: 70,
      questions: {
        create: [
          {
            question: 'What is the MOST important step to take before clicking a link in an email?',
            options: ['Check if it looks professional', 'Hover over it to preview the URL', 'Click it to see where it goes', 'Forward it to a friend'],
            correctAnswer: 1,
            order: 1
          },
          {
            question: 'Which type of authentication provides the BEST protection against phishing?',
            options: ['SMS codes', 'Security questions', 'Hardware security keys', 'Email verification'],
            correctAnswer: 2,
            order: 2
          },
          {
            question: 'If you suspect you\'ve been phished, what should you do FIRST?',
            options: ['Delete the email', 'Change your passwords immediately', 'Wait and see if anything happens', 'Report it to authorities'],
            correctAnswer: 1,
            order: 3
          },
          {
            question: 'What percentage of data breaches involve phishing attacks?',
            options: ['About 30%', 'About 50%', 'About 70%', 'Over 90%'],
            correctAnswer: 3,
            order: 4
          },
          {
            question: 'Which is a sign that an email might be a phishing attempt?',
            options: ['Sent from a known contact', 'Contains company logo', 'Creates urgency to act immediately', 'Has your correct name'],
            correctAnswer: 2,
            order: 5
          }
        ]
      }
    }
  });

  // Quiz for Course 2, Lesson 3 (Password Managers & MFA)
  await prisma.quiz.create({
    data: {
      lessonId: lessonsByCourse[courses[1].id][2].id,
      title: 'Password Security Quiz',
      passingScore: 70,
      questions: {
        create: [
          {
            question: 'What is the minimum recommended password length?',
            options: ['6 characters', '8 characters', '12 characters', '20 characters'],
            correctAnswer: 2,
            order: 1
          },
          {
            question: 'Which password is the STRONGEST?',
            options: ['Password123!', 'MyDogAte3BluePancakesIn2024!', 'qwerty12345', 'admin@123'],
            correctAnswer: 1,
            order: 2
          },
          {
            question: 'What does MFA stand for?',
            options: ['Multiple Factor Access', 'Multi-Factor Authentication', 'Main Firewall Application', 'Master File Authorization'],
            correctAnswer: 1,
            order: 3
          },
          {
            question: 'Which MFA method is considered MOST secure?',
            options: ['SMS codes', 'Email verification', 'Hardware security keys', 'Security questions'],
            correctAnswer: 2,
            order: 4
          },
          {
            question: 'What type of attack uses stolen credentials from one site to try on other sites?',
            options: ['Brute force attack', 'Dictionary attack', 'Credential stuffing', 'Phishing'],
            correctAnswer: 2,
            order: 5
          }
        ]
      }
    }
  });

  // Quiz for Course 3, Lesson 3 (Defending Against Social Engineering)
  await prisma.quiz.create({
    data: {
      lessonId: lessonsByCourse[courses[2].id][2].id,
      title: 'Social Engineering Defense Quiz',
      passingScore: 70,
      questions: {
        create: [
          {
            question: 'What psychological principle do attackers exploit when creating time pressure?',
            options: ['Authority', 'Urgency', 'Reciprocity', 'Trust'],
            correctAnswer: 1,
            order: 1
          },
          {
            question: 'What is "tailgating" in social engineering?',
            options: ['Following someone on social media', 'Physically following someone into a restricted area', 'Sending follow-up phishing emails', 'Tracking someone\'s online activity'],
            correctAnswer: 1,
            order: 2
          },
          {
            question: 'If someone calls claiming to be IT support and asks for your password, you should:',
            options: ['Give it to them if they sound professional', 'Hang up and call IT through official channels', 'Ask them security questions first', 'Email them the password instead'],
            correctAnswer: 1,
            order: 3
          },
          {
            question: 'What is "pretexting"?',
            options: ['Sending text messages', 'Creating a fake scenario to extract information', 'Previewing email content', 'Testing security systems'],
            correctAnswer: 1,
            order: 4
          },
          {
            question: 'What should you do if you suspect you\'ve been targeted by social engineering?',
            options: ['Keep it to yourself', 'Document and report it immediately', 'Delete all evidence', 'Try to track down the attacker'],
            correctAnswer: 1,
            order: 5
          }
        ]
      }
    }
  });

  // Quiz for Course 6, Lesson 3 (Forensic Analysis & Threat Hunting)
  await prisma.quiz.create({
    data: {
      lessonId: lessonsByCourse[courses[5].id][2].id,
      title: 'Advanced Threat Analysis Quiz',
      passingScore: 75,
      questions: {
        create: [
          {
            question: 'What does APT stand for in cybersecurity?',
            options: ['Advanced Phishing Technique', 'Advanced Persistent Threat', 'Automated Penetration Testing', 'Application Protocol Transfer'],
            correctAnswer: 1,
            order: 1
          },
          {
            question: 'In the NIST Incident Response Framework, what is the correct order of phases?',
            options: ['Detection, Preparation, Containment, Recovery', 'Preparation, Detection & Analysis, Containment & Recovery, Post-Incident', 'Analysis, Response, Containment, Documentation', 'Identification, Response, Recovery, Prevention'],
            correctAnswer: 1,
            order: 2
          },
          {
            question: 'What is the primary purpose of the MITRE ATT&CK framework?',
            options: ['To launch cyber attacks legally', 'To catalog adversary tactics and techniques based on real-world observations', 'To encrypt sensitive data', 'To manage firewall rules'],
            correctAnswer: 1,
            order: 3
          },
          {
            question: 'When collecting digital evidence, which should be collected FIRST according to order of volatility?',
            options: ['Hard drive contents', 'Backup media', 'RAM/Memory', 'Physical configuration'],
            correctAnswer: 2,
            order: 4
          },
          {
            question: 'What is "threat hunting"?',
            options: ['Installing antivirus software', 'Proactively searching for threats that have evaded existing security controls', 'Blocking malicious IP addresses', 'Running penetration tests'],
            correctAnswer: 1,
            order: 5
          },
          {
            question: 'Which of the following is NOT a type of Indicator of Compromise (IOC)?',
            options: ['Hash values of malicious files', 'Known malicious IP addresses', 'User satisfaction scores', 'Malicious domain names'],
            correctAnswer: 2,
            order: 6
          },
          {
            question: 'What is the purpose of maintaining chain of custody in forensic investigations?',
            options: ['To speed up the investigation', 'To document evidence handling and prove its integrity', 'To delete unnecessary files', 'To share evidence publicly'],
            correctAnswer: 1,
            order: 7
          }
        ]
      }
    }
  });

  // Quiz for Course 4, Lesson 3 (Safe Downloading Practices)
  await prisma.quiz.create({
    data: {
      lessonId: lessonsByCourse[courses[3].id][2].id,
      title: 'Secure Web Browsing Quiz',
      passingScore: 70,
      questions: {
        create: [
          {
            question: 'What does the padlock icon in your browser\'s address bar indicate?',
            options: ['The website is safe to use', 'The connection is encrypted with TLS/SSL', 'The website has no malware', 'The website is government approved'],
            correctAnswer: 1,
            order: 1
          },
          {
            question: 'Which of the following is the safest way to download software?',
            options: ['From a link in an email', 'From the official vendor website or app store', 'From a file-sharing website', 'From a pop-up advertisement'],
            correctAnswer: 1,
            order: 2
          },
          {
            question: 'What is a browser extension security risk?',
            options: ['Extensions slow down the browser', 'Extensions can request excessive permissions and access your data', 'Extensions use too much memory', 'Extensions change your homepage'],
            correctAnswer: 1,
            order: 3
          },
          {
            question: 'What is "typosquatting"?',
            options: ['A typing speed test', 'Registering domains similar to popular sites to trick users', 'A type of keyboard malware', 'A way to improve typing accuracy'],
            correctAnswer: 1,
            order: 4
          },
          {
            question: 'Which browser setting provides the MOST privacy protection?',
            options: ['Enabling cookies for all sites', 'Blocking third-party cookies and enabling Do Not Track', 'Using the default settings', 'Disabling JavaScript entirely'],
            correctAnswer: 1,
            order: 5
          }
        ]
      }
    }
  });

  // Quiz for Course 5, Lesson 3 (Responding to Data Breaches)
  await prisma.quiz.create({
    data: {
      lessonId: lessonsByCourse[courses[4].id][2].id,
      title: 'Personal Data Protection Quiz',
      passingScore: 70,
      questions: {
        create: [
          {
            question: 'Which of the following is considered PII (Personally Identifiable Information)?',
            options: ['A company\'s stock price', 'Social Security Number', 'Today\'s weather', 'A public news article'],
            correctAnswer: 1,
            order: 1
          },
          {
            question: 'What is the FIRST thing you should do if you discover a data breach?',
            options: ['Delete all your accounts', 'Change passwords for affected accounts and enable MFA', 'Post about it on social media', 'Ignore it and hope for the best'],
            correctAnswer: 1,
            order: 2
          },
          {
            question: 'Under GDPR, what right allows you to request deletion of your personal data?',
            options: ['Right to access', 'Right to be forgotten (erasure)', 'Right to portability', 'Right to object'],
            correctAnswer: 1,
            order: 3
          },
          {
            question: 'What is the safest way to share sensitive files?',
            options: ['Email attachment', 'Encrypted cloud storage with access controls', 'USB drive left on a desk', 'Public file-sharing site'],
            correctAnswer: 1,
            order: 4
          },
          {
            question: 'Which social media setting best protects your privacy?',
            options: ['Public profile with all info visible', 'Private profile with minimal personal information', 'No profile picture', 'Using a nickname only'],
            correctAnswer: 1,
            order: 5
          }
        ]
      }
    }
  });

  console.log('✅ Created 6 quizzes with questions');

  // ============================================
  // CREATE LABS FOR ALL COURSES
  // ============================================

  // Labs for Course 1: Phishing Detection Fundamentals
  await prisma.lab.createMany({
    data: [
      {
        title: 'Phishing Email Analysis Exercise',
        description: 'Practice identifying phishing emails by analyzing real-world examples and documenting red flags.',
        instructions: `# Lab Overview
You will analyze a collection of emails to determine which are legitimate and which are phishing attempts.

## Setup Instructions
1. Download the sample email collection from the resources section
2. Review each email carefully
3. Document your findings in the analysis template

## Tasks
### Task 1: Email Header Analysis
- Examine the sender's email address
- Check for domain spoofing
- Verify reply-to addresses

### Task 2: Content Red Flags
- Identify urgency tactics
- Check for grammar/spelling errors
- Analyze link destinations (hover, don't click!)

### Task 3: Link Analysis
- Use URL analysis tools to check suspicious links
- Document any shortened URLs
- Identify typosquatting domains

### Task 4: Attachment Review
- Note file types of any attachments
- Identify potentially dangerous file extensions
- Check for macro-enabled documents

### Task 5: Documentation
- Complete the analysis worksheet
- Rate each email's threat level (Low/Medium/High/Critical)
- Provide reasoning for your assessments

## Submission
Upload your completed analysis worksheet showing:
- Email classification (Legitimate/Phishing)
- Red flags identified
- Threat assessment
- Recommended actions`,
        scenario: 'You are a security analyst at a mid-sized company. The IT department has forwarded you a collection of suspicious emails reported by employees. Your task is to analyze each email and provide a detailed assessment to help train the staff on phishing recognition.',
        objectives: [
          'Correctly identify at least 8 out of 10 phishing emails',
          'Document at least 3 red flags for each phishing email',
          'Analyze email headers for spoofing indicators',
          'Use URL analysis tools to verify link destinations',
          'Provide actionable recommendations for each email'
        ],
        resources: 'Sample Email Collection: https://example.com/phishing-samples\nURL Analysis Tools: VirusTotal, URLVoid, URLScan\nEmail Header Analyzer: MXToolbox\nPhishing Red Flags Checklist: Included in lab files',
        hints: 'Start with obvious red flags like misspelled domains and urgent language. Use "View Source" to see raw email headers. Remember that even professional-looking emails can be phishing. When in doubt, verify through official channels.',
        difficulty: 'Beginner',
        estimatedTime: 45,
        order: 1,
        courseId: courses[0].id,
        isPublished: true
      }
    ]
  });

  // Labs for Course 2: Password Security Best Practices
  await prisma.lab.createMany({
    data: [
      {
        title: 'Password Strength Testing Lab',
        description: 'Test various password types against simulated attacks to understand what makes passwords strong or weak.',
        instructions: `# Lab Overview
Use password cracking simulations to understand how different password strategies stand up to attacks.

## Setup Instructions
1. Access the password testing VM provided
2. Review the pre-loaded password lists
3. Familiarize yourself with the cracking tools

## Tasks
### Task 1: Baseline Testing
Test these password types and record time to crack:
- Dictionary words: "password", "football", "welcome"
- Dictionary + numbers: "password123", "football2024"
- Common patterns: "qwerty123", "abc123"

### Task 2: Complexity Testing
Test passwords with various complexity levels:
- 8 characters mixed: "P@ssw0rd"
- 12 characters mixed: "MyP@ssw0rd12"
- 16 characters mixed: "MyP@ssw0rd123456"

### Task 3: Passphrase Testing
Test passphrase effectiveness:
- Short phrase: "ilovecats"
- Long phrase: "ILoveMyThreeCatsVeryMuch"
- Random words: "correct-horse-battery-staple"

### Task 4: Real-World Comparison
- Test 5 passwords you currently use (or similar strength)
- Document vulnerabilities discovered
- Calculate estimated crack time for each

### Task 5: Best Practices
- Create 3 strong passwords using different methods
- Test them against cracking tools
- Document which method you prefer and why

## Analysis Questions
1. How does password length affect crack time?
2. Which is more effective: complexity or length?
3. Why are dictionary words dangerous even with substitutions?
4. What makes passphrases effective?
5. How do password managers help security?

## Deliverables
- Completed testing matrix with crack times
- Analysis document answering all questions
- Three strong passwords you created (for testing only)
- Recommendations document`,
        scenario: 'As a security consultant, you need to demonstrate to a client why their current password policy (8 characters minimum with 1 number) is insufficient. Use this lab to gather evidence showing the difference between weak and strong passwords.',
        objectives: [
          'Test at least 15 different passwords across various categories',
          'Document crack time differences between weak and strong passwords',
          'Understand the relationship between password length and security',
          'Create three strong passwords using different methodologies',
          'Provide evidence-based password policy recommendations'
        ],
        resources: 'Password Testing VM: Access via lab portal\nHashcat Tutorial: Included\nPassword Lists: RockYou, Common Passwords\nCrack Time Calculator: https://howsecureismypassword.net\nPassword Policy Templates: NIST Guidelines',
        hints: 'Focus on comparing apples-to-apples - test similar passwords with one variable changed. Note that even "complex" short passwords crack quickly. Passphrases are your friend. Hardware matters - results will vary.',
        difficulty: 'Intermediate',
        estimatedTime: 60,
        order: 1,
        courseId: courses[1].id,
        isPublished: true
      },
      {
        title: 'Password Manager Setup & Migration',
        description: 'Set up and configure a password manager, then migrate existing passwords and generate strong new ones.',
        instructions: `# Lab Overview
Learn to properly configure and use a password manager for maximum security.

## Setup Instructions
1. Choose a password manager (Bitwarden recommended for this lab)
2. Create an account with a STRONG master password
3. Install browser extensions and mobile apps

## Tasks
### Task 1: Master Password Creation
- Create a master password using the passphrase method
- Aim for 20+ characters
- Test strength using multiple tools
- Document your password creation strategy

### Task 2: Two-Factor Authentication
- Enable 2FA on your password manager
- Use an authenticator app (not SMS)
- Save recovery codes securely
- Test 2FA login

### Task 3: Password Audit
- Conduct an audit of your current passwords:
  * Count reused passwords
  * Identify weak passwords
  * List passwords written down or in plaintext
- Document findings

### Task 4: Password Migration
- Add 10 existing accounts to password manager
- For each account:
  * Save current credentials
  * Generate strong new password (16+ chars)
  * Update the account
  * Test login
  * Delete old password record

### Task 5: Secure Notes & Emergency Access
- Set up secure notes for:
  * WiFi password
  * Security questions
  * Software licenses
- Configure emergency access for trusted person
- Document emergency access procedures

### Task 6: Browser Integration
- Install and test autofill
- Practice using password generator
- Set up automatic capture of new logins
- Test across different websites

## Security Checklist
✅ Master password 20+ characters
✅ 2FA enabled with authenticator app
✅ Recovery codes backed up securely
✅ Browser extension installed
✅ At least 10 accounts migrated
✅ All new passwords are unique and strong
✅ Emergency access configured
✅ Autofill tested and working

## Deliverables
- Configuration screenshot showing 2FA enabled
- Password audit report (anonymized)
- Migration log for 10 accounts
- Emergency access procedure document`,
        scenario: 'Your company is implementing a password manager requirement for all employees. You need to not only set up your own account but also create a guide for colleagues. Complete this lab to become proficient and help others migrate safely.',
        objectives: [
          'Create a secure master password of 20+ characters',
          'Enable 2FA using an authenticator app',
          'Successfully migrate at least 10 accounts',
          'Generate and test strong unique passwords for each account',
          'Document the process for training others'
        ],
        resources: 'Bitwarden: https://bitwarden.com\nAuthenticator Apps: Authy, Google Authenticator\nPassword Strength Tester: https://bitwarden.com/password-strength\nMigration Guide: Included in lab files\nBest Practices Checklist: Included',
        hints: 'Take your time with the master password - you can\'t change it easily later. Start with less critical accounts for migration practice. Use the password generator for all new passwords. Keep recovery codes in a physical safe place.',
        difficulty: 'Beginner',
        estimatedTime: 50,
        order: 2,
        courseId: courses[1].id,
        isPublished: true
      }
    ]
  });

  // Labs for Course 3: Social Engineering Awareness
  await prisma.lab.createMany({
    data: [
      {
        title: 'Social Engineering Attack Simulation',
        description: 'Participate in simulated social engineering scenarios to recognize manipulation tactics and practice appropriate responses.',
        instructions: `# Lab Overview
Experience common social engineering attacks in a safe environment and learn to recognize and respond to them.

## Setup Instructions
1. Access the social engineering simulation portal
2. Review the company background document
3. Familiarize yourself with the reporting procedures

## Scenarios
You will face 6 different scenarios. For each:
- Read the scenario carefully
- Identify red flags
- Choose your response
- Document your reasoning

### Scenario 1: The Urgent IT Request
You receive a call from someone claiming to be from IT support saying your account will be locked unless you verify your password immediately.

**Your Tasks:**
- Identify red flags in the approach
- Determine appropriate response
- Document what you would do instead

### Scenario 2: The Helpful Stranger
Someone in the parking lot with arms full of boxes asks you to badge them into the building.

**Your Tasks:**
- Assess the security risk
- Decide how to handle the situation
- Consider alternative ways to help

### Scenario 3: The Executive Email
You receive an email appearing to be from the CEO requesting an urgent wire transfer to a new vendor.

**Your Tasks:**
- Analyze email indicators
- Identify verification steps needed
- Document proper escalation procedure

### Scenario 4: The Survey Scam
A caller says you've been selected for a customer satisfaction survey with a prize, but needs to verify your employee ID.

**Your Tasks:**
- Recognize the scam indicators
- Determine what information is safe to share
- Plan appropriate response

### Scenario 5: The Vendor Visit
Someone arrives claiming to be from a maintenance company to inspect fire safety equipment but has no appointment on record.

**Your Tasks:**
- Assess credibility indicators
- Determine verification requirements
- Follow proper protocol

### Scenario 6: The LinkedIn Connection
You receive a LinkedIn message from a recruiter for an amazing opportunity who wants your personal email and phone number right away.

**Your Tasks:**
- Identify potential risks
- Determine safe information sharing
- Recognize professional vs. suspicious behavior

## For Each Scenario Document:
1. Red flags identified (minimum 3)
2. Psychological tactics being used
3. Your chosen response
4. Correct company policy to follow
5. How to verify legitimacy

## Analysis Questions
1. What psychological principles were attackers using?
2. Which scenario was hardest to identify? Why?
3. What policies would help prevent these attacks?
4. How would you train others on these scenarios?

## Deliverables
- Completed scenario response forms (all 6)
- Red flag identification sheet
- Analysis document
- Training recommendations`,
        scenario: 'Your company is conducting security awareness training. These simulated scenarios test your ability to recognize and respond to social engineering attempts. Your performance will help improve company security policies.',
        objectives: [
          'Successfully identify red flags in all 6 scenarios',
          'Choose appropriate responses that prioritize security',
          'Demonstrate understanding of verification procedures',
          'Document at least 3 red flags per scenario',
          'Provide practical recommendations for policy improvements'
        ],
        resources: 'Social Engineering Simulation Portal: Access via lab link\nCompany Security Policy: Included\nIncident Reporting Procedures: Included\nPsychological Tactics Guide: Course materials\nVerification Checklist: Provided',
        hints: 'Remember: it\'s okay to seem rude if security is at stake. Legitimate requests can wait for verification. Trust your instincts - if something feels off, it probably is. Always use official channels to verify.',
        difficulty: 'Intermediate',
        estimatedTime: 40,
        order: 1,
        courseId: courses[2].id,
        isPublished: true
      }
    ]
  });

  // Labs for Course 4: Secure Web Browsing
  await prisma.lab.createMany({
    data: [
      {
        title: 'Malicious Website Identification Lab',
        description: 'Analyze various websites to identify security risks, spoofed pages, and malicious indicators.',
        instructions: `# Lab Overview
Practice identifying malicious and spoofed websites using safe examples in an isolated environment.

## Setup Instructions
1. Access the isolated browser environment
2. Review the website analysis checklist
3. Familiarize yourself with browser security tools

## Tasks
### Task 1: URL Analysis (10 websites)
For each URL provided, analyze:
- Domain legitimacy
- TLD (top-level domain) red flags
- Typosquatting indicators
- Subdomain tricks
- HTTPS presence and certificate validity

### Task 2: Certificate Inspection
Examine SSL/TLS certificates for:
- Valid certificate authority
- Domain match
- Expiration date
- Certificate warnings
- Self-signed certificates

### Task 3: Content Analysis
Review website content for:
- Poor design quality
- Grammar and spelling errors
- Mismatched branding
- Missing contact information
- Unrealistic offers
- Suspicious payment methods

### Task 4: Technical Indicators
Use browser tools to check:
- Page source for hidden redirects
- JavaScript behavior
- Cookie policies
- External resources loaded
- Pop-up behavior

### Task 5: Comparison Testing
Compare legitimate vs. spoofed sites:
- amazon.com vs. amaz0n.com
- paypal.com vs. paypa1.com
- Your bank vs. a spoofed version
- Document differences found

## Website Categories to Analyze
1. E-commerce sites (3 examples)
2. Banking/Financial (2 examples)
3. Social media login pages (2 examples)
4. Software download sites (2 examples)
5. Tech support pages (1 example)

## Documentation Requirements
For each website:
✅ Screenshot
✅ URL analysis
✅ Certificate status
✅ Red flags identified
✅ Legitimacy rating (1-5 scale)
✅ Risk assessment
✅ Safe browsing recommendation

## Deliverables
- Complete analysis for 10 websites
- Comparison document (legitimate vs. fake)
- Red flag summary sheet
- Best practices guide you would give to family members`,
        scenario: 'You are creating a training module for non-technical users. Use this lab to document real examples of malicious websites and create a simple guide that anyone can understand.',
        objectives: [
          'Successfully analyze at least 10 different websites',
          'Correctly identify all spoofed/malicious sites provided',
          'Document minimum 3 red flags per suspicious site',
          'Demonstrate proper certificate inspection techniques',
          'Create a practical guide for identifying malicious websites'
        ],
        resources: 'Isolated Browser Environment: Provided\nWebsite Analysis Checklist: Included\nSSL Checker: SSL Labs, Why No Padlock\nURL Scanner: VirusTotal, URLScan.io\nPhishing Examples Database: Included\nLegitimate Site References: Provided',
        hints: 'Always check the full URL, not just what you see. Look for HTTPS, but remember HTTPS doesn\'t guarantee legitimacy. Check certificate details, not just the padlock icon. Compare suspicious sites side-by-side with legitimate ones.',
        difficulty: 'Beginner',
        estimatedTime: 55,
        order: 1,
        courseId: courses[3].id,
        isPublished: true
      }
    ]
  });

  // Labs for Course 5: Personal Data Protection
  await prisma.lab.createMany({
    data: [
      {
        title: 'Data Classification & Protection Exercise',
        description: 'Practice classifying different types of data and implementing appropriate protection measures.',
        instructions: `# Lab Overview
Learn to properly classify data and apply appropriate security controls for each classification level.

## Setup Instructions
1. Review the data classification framework
2. Access the sample data repository
3. Review available protection tools

## Tasks
### Task 1: Data Classification
Classify the following data types according to the framework (Public, Internal, Confidential, Restricted):

**Personal Information:**
- Your name
- Social Security Number
- Home address
- Email address
- Date of birth
- Medical records
- Phone number
- Employment history

**Business Information:**
- Company marketing materials
- Internal memos
- Customer database
- Financial reports
- Trade secrets
- Employee handbook
- Salary information
- Strategic plans

Document your classification decisions and reasoning.

### Task 2: Risk Assessment
For each data type classified as Confidential or Restricted:
- Identify potential risks if exposed
- Estimate impact severity (Low/Medium/High/Critical)
- List threat actors who might target it
- Document regulatory implications

### Task 3: Protection Implementation
Implement appropriate controls for sample files:

**File 1: Personal Tax Returns (Restricted)**
- Encrypt the file
- Set up password protection
- Configure secure storage location
- Document access procedures

**File 2: Medical Records (Restricted)**
- Apply encryption
- Set up access logging
- Configure backup procedures
- Document retention policy

**File 3: Financial Statements (Confidential)**
- Apply appropriate encryption
- Set sharing restrictions
- Configure audit trail
- Document handling procedures

**File 4: Internal Project Notes (Internal)**
- Basic access control
- Storage location
- Sharing guidelines

### Task 4: Secure Sharing
Practice secure file sharing:
- Share File 1 securely with authorized party
- Set expiration date
- Require authentication
- Enable download tracking
- Document the process

### Task 5: Data Lifecycle
Create a data lifecycle plan for:
- Creation/Collection controls
- Storage requirements
- Access management
- Retention period
- Secure deletion procedures

## Documentation Checklist
✅ All data types classified with justification
✅ Risk assessments completed
✅ Encryption applied to restricted data
✅ Secure sharing tested and documented
✅ Access logs configured
✅ Backup procedures documented
✅ Retention policies defined
✅ Secure deletion procedures tested

## Analysis Questions
1. What happens if data is misclassified?
2. How does classification affect business operations?
3. What are the costs of over-classifying data?
4. How often should classifications be reviewed?
5. Who should be responsible for classification decisions?

## Deliverables
- Completed data classification matrix
- Risk assessment report
- Protection implementation guide
- Secure sharing procedure document
- Data lifecycle management plan`,
        scenario: 'You are implementing a data protection program at your organization. This lab helps you understand how to classify different types of data and apply appropriate security controls based on sensitivity levels.',
        objectives: [
          'Correctly classify at least 16 different data types',
          'Implement encryption for all Restricted data',
          'Configure secure sharing with expiration and tracking',
          'Document complete data lifecycle procedures',
          'Create practical protection guidelines for each classification level'
        ],
        resources: 'Data Classification Framework: NIST guidelines included\nEncryption Tools: VeraCrypt, 7-Zip, GPG\nSecure Sharing: Dropbox, Google Drive with security settings\nAccess Control Guide: Included\nRetention Policy Templates: Provided\nSecure Deletion Tools: Eraser, BleachBit',
        hints: 'When in doubt, classify higher rather than lower. Consider cumulative risk - multiple low-sensitivity items can become high-sensitivity together. Encryption is cheap, data breaches are expensive. Document everything - you\'ll need to prove compliance.',
        difficulty: 'Intermediate',
        estimatedTime: 65,
        order: 1,
        courseId: courses[4].id,
        isPublished: true
      }
    ]
  });

  // Labs for Course 6: Advanced Threat Analysis & Incident Response
  await prisma.lab.createMany({
    data: [
      {
        title: 'Incident Response Tabletop Exercise',
        description: 'Participate in a simulated ransomware incident response scenario following the NIST framework.',
        instructions: `# Lab Overview
Experience a realistic incident response scenario as part of the incident response team responding to a ransomware attack.

## Setup Instructions
1. Review your role assignment (Security Analyst)
2. Read the company background and infrastructure
3. Familiarize yourself with IR tools and playbooks
4. Review NIST Incident Response framework

## Scenario Timeline
You will work through a ransomware incident from detection to resolution.

### Hour 0 - Detection (08:00 AM)
**Situation:** Multiple users report they cannot access files. Desktop backgrounds changed to ransom notes.

**Your Tasks:**
- Assess initial indicators
- Determine incident severity
- Activate incident response team
- Begin documentation
- Establish communication channels

### Hour 1 - Analysis (09:00 AM)
**New Information:**
- 50+ workstations affected
- Ransomware identified as REvil variant
- Network shares encrypted
- Ransom demand: 50 Bitcoin

**Your Tasks:**
- Map affected systems
- Identify patient zero
- Determine ransomware variant
- Check backup status
- Preserve evidence
- Update stakeholders

### Hour 2 - Containment (10:00 AM)
**Actions Required:**
- Isolate affected systems
- Block C2 communication
- Prevent lateral movement
- Secure backups
- Document all actions

**Your Tasks:**
- Create isolation plan
- Identify IOCs for blocking
- Check for persistence mechanisms
- Verify backup integrity
- Update containment status

### Hour 4 - Eradication (12:00 PM)
**Status:** Threat contained, moving to eradication

**Your Tasks:**
- Remove ransomware from all systems
- Patch vulnerabilities exploited
- Reset compromised credentials
- Rebuild infected systems
- Verify complete removal
- Document all changes

### Hour 8 - Recovery (04:00 PM)
**Status:** Clean systems ready for restoration

**Your Tasks:**
- Restore from backups
- Verify data integrity
- Test critical systems
- Bring systems online progressively
- Monitor for re-infection
- Document recovery steps

### Day 3 - Post-Incident
**Status:** Operations restored, lessons learned phase

**Your Tasks:**
- Complete incident report
- Timeline reconstruction
- Root cause analysis
- Identify security gaps
- Recommend improvements
- Update playbooks

## Documentation Requirements

### Incident Report Sections:
1. **Executive Summary**
   - Incident overview
   - Impact assessment
   - Response summary
   - Recommendations

2. **Timeline**
   - Chronological event log
   - All actions taken
   - Decisions made
   - Key findings

3. **Technical Analysis**
   - Attack vector identification
   - Ransomware variant analysis
   - Affected systems inventory
   - IOCs documented

4. **Response Actions**
   - Containment measures
   - Eradication procedures
   - Recovery steps
   - Verification activities

5. **Lessons Learned**
   - What worked well
   - What needs improvement
   - Security gaps identified
   - Recommended changes

6. **Appendices**
   - IOC list
   - Communications log
   - Evidence inventory
   - Tool outputs

## Decision Points
You will face critical decisions:
- Pay ransom or restore from backups?
- Notify law enforcement?
- Public disclosure timing?
- Business continuity priorities?

Document your decisions and rationale.

## Metrics to Track
- Time to detect
- Time to contain
- Systems affected
- Data lost/recovered
- Downtime duration
- Response costs

## Deliverables
- Complete incident report (all sections)
- Detailed timeline of events
- IOC list with blocking rules
- Lessons learned document
- Updated incident response playbook
- Executive presentation (5 slides)`,
        scenario: 'It\'s Monday morning at FinTech Corp, a financial services company with 500 employees. You are the security analyst on duty when the help desk starts receiving unusual calls about encrypted files. This is your first major incident.',
        objectives: [
          'Follow NIST IR framework through all phases',
          'Complete comprehensive incident documentation',
          'Make and justify critical incident response decisions',
          'Identify and document at least 10 IOCs',
          'Provide actionable recommendations for prevention'
        ],
        resources: 'NIST IR Guide: SP 800-61 Rev 2\nRansomware Playbook: Included\nIR Tools: Volatility, FTK Imager, Wireshark\nIOC Databases: AlienVault OTX, MISP\nForensic Analysis VMs: Provided\nCommunication Templates: Included\nDecision Trees: Included',
        hints: 'Act quickly but document everything. Don\'t make unilateral decisions on critical issues. Communication is as important as technical response. Focus on containment before eradication. Verify backups before you need them. Every incident teaches something.',
        difficulty: 'Advanced',
        estimatedTime: 120,
        order: 1,
        courseId: courses[5].id,
        isPublished: true
      },
      {
        title: 'Threat Hunting with MITRE ATT&CK',
        description: 'Conduct proactive threat hunting using the MITRE ATT&CK framework to discover hidden threats in a simulated environment.',
        instructions: `# Lab Overview
Use threat intelligence and the MITRE ATT&CK framework to hunt for sophisticated threats in a corporate network.

## Setup Instructions
1. Access the threat hunting VM environment
2. Review the ATT&CK Navigator
3. Familiarize yourself with hunting tools (Splunk, Sysmon, Wireshark)
4. Review the network baseline documentation

## Threat Hunting Missions

### Mission 1: Credential Access Hunt
**Hypothesis:** Attackers may be dumping credentials using LSASS memory access.

**ATT&CK Techniques:** T1003.001 (LSASS Memory)

**Hunt Steps:**
1. Review Sysmon logs for process access to LSASS
2. Identify unusual tools (Mimikatz, ProcDump)
3. Check for credential dumping indicators
4. Analyze memory dumps if found
5. Document findings

**Data Sources:**
- Sysmon Event ID 10 (Process Access)
- Security Event ID 4656 (Handle to Object)
- PowerShell logs

**Queries to Run:**

Sysmon: EventID=10 TargetImage="*lsass.exe"
Security: EventID=4656 ObjectName="*lsass.exe"
PowerShell: Look for Invoke-Mimikatz

### Mission 2: Persistence Mechanism Hunt
**Hypothesis:** APT may have established persistence through scheduled tasks or registry run keys.

**ATT&CK Techniques:** T1053.005 (Scheduled Task), T1547.001 (Registry Run Keys)

**Hunt Steps:**
1. Enumerate all scheduled tasks
2. Check registry run key locations
3. Identify suspicious entries
4. Validate task/binary legitimacy
5. Check creation timestamps

**Registry Locations:**
- HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
- HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
- Startup folders

**PowerShell Commands:**

Get-ScheduledTask | Where Author -notlike "*Microsoft*"
Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"

### Mission 3: Lateral Movement Hunt
**Hypothesis:** Attackers using RDP or WMI for lateral movement.

**ATT&CK Techniques:** T1021.001 (RDP), T1047 (WMI)

**Hunt Steps:**
1. Analyze RDP connections
2. Check for unusual WMI activity
3. Look for admin share access
4. Identify service creation events
5. Map movement timeline

**Data Sources:**
- Security Event ID 4624 (Logon) Type 10
- Security Event ID 4672 (Special Logon)
- Security Event ID 4697 (Service Creation)
- WMI Event Logs

### Mission 4: Command & Control Hunt
**Hypothesis:** Malware communicating with C2 servers using encoded or encrypted channels.

**ATT&CK Techniques:** T1071 (Application Layer Protocol), T1573 (Encrypted Channel)

**Hunt Steps:**
1. Analyze network traffic patterns
2. Identify beaconing behavior
3. Check for unusual DNS requests
4. Look for data encoding
5. Investigate suspicious connections

**Analysis:**
- Long connection duration analysis
- Periodic/beaconing traffic patterns
- Unusual ports or protocols
- High-entropy data transfers
- Domain generation algorithms (DGA)

### Mission 5: Data Exfiltration Hunt
**Hypothesis:** Large data transfers to external locations.

**ATT&CK Techniques:** T1041 (Exfiltration Over C2), T1048 (Exfiltration Over Alternative Protocol)

**Hunt Steps:**
1. Analyze outbound data volumes
2. Identify unusual destinations
3. Check for data compression
4. Look for unusual protocols
5. Correlate with user activity

**Metrics:**
- Baseline outbound traffic per user
- Anomalous upload volumes
- Off-hours transfers
- Unusual destinations

## For Each Mission Document:

### Hunt Log:
- Hypothesis tested
- Data sources used
- Queries executed
- Findings discovered
- False positives noted
- True positives confirmed

### Technical Analysis:
- IOCs identified
- Attack timeline
- Affected systems
- Techniques observed
- Recommendations

### ATT&CK Mapping:
- Tactics identified
- Techniques used
- Sub-techniques observed
- Coverage gaps

## Advanced Analysis

### Correlation Analysis:
- Look for relationships between hunts
- Build attack chain timeline
- Identify campaign indicators
- Group IOCs by threat actor

### Detection Engineering:
For each finding:
- Create detection rule
- Test for false positives
- Document trigger criteria
- Implement in SIEM

## Deliverables
- Hunt log for all 5 missions
- IOC list (minimum 15 IOCs)
- ATT&CK Navigator heat map
- Detection rules created (min 5)
- Threat hunting report
- Recommendations for security improvements
- Hunting playbook updates`,
        scenario: 'Your organization suspects an Advanced Persistent Threat (APT) may have gained access to the network. No alerts have fired, but threat intelligence suggests your industry is being targeted. Conduct proactive hunting to find evidence of compromise.',
        objectives: [
          'Complete all 5 threat hunting missions',
          'Identify at least 15 unique IOCs',
          'Map findings to MITRE ATT&CK framework',
          'Create at least 5 detection rules',
          'Document a complete attack chain if found'
        ],
        resources: 'Threat Hunting VM: Windows Server with Sysmon\nSIEM: Splunk with sample logs\nATT&CK Navigator: https://mitre-attack.github.io/attack-navigator\nNetwork Baseline: Provided\nThreat Intel Feeds: Included\nHunting Queries Library: Included\nWireshark: For network analysis',
        hints: 'Start with high-confidence hypotheses based on threat intel. Look for anomalies compared to baseline. Not every hunt finds threats - that\'s okay. Document everything including dead ends. Correlation is key - isolated events may be part of larger campaign.',
        difficulty: 'Advanced',
        estimatedTime: 150,
        order: 2,
        courseId: courses[5].id,
        isPublished: true
      }
    ]
  });

  console.log('✅ Created 11 hands-on labs across all courses');

  // ============================================
  // ADD REALISTIC STUDY DATA FOR ALL STUDENTS
  // ============================================

  // Get all quizzes for quiz attempts
  const allQuizzes = await prisma.quiz.findMany({
    include: { lesson: true }
  });

  // Rajesh Singh [0] - Active learner (enrolled in 4 courses, completed 2, high scores)
  await prisma.enrollment.createMany({
    data: [
      { userId: students[0].id, courseId: courses[0].id, enrolledAt: new Date('2025-12-15'), completedAt: new Date('2026-01-10') },
      { userId: students[0].id, courseId: courses[1].id, enrolledAt: new Date('2026-01-02'), completedAt: new Date('2026-01-14') },
      { userId: students[0].id, courseId: courses[2].id, enrolledAt: new Date('2026-01-10') },
      { userId: students[0].id, courseId: courses[3].id, enrolledAt: new Date('2026-01-10') }
    ]
  });
  // Complete all lessons in first two courses
  for (const lesson of lessonsByCourse[courses[0].id]) {
    await prisma.progress.create({
      data: { userId: students[0].id, lessonId: lesson.id, completed: true, completedAt: new Date('2026-01-09') }
    });
  }
  for (const lesson of lessonsByCourse[courses[1].id]) {
    await prisma.progress.create({
      data: { userId: students[0].id, lessonId: lesson.id, completed: true, completedAt: new Date('2026-01-13') }
    });
  }
  // Complete first lesson of course 3
  await prisma.progress.create({
    data: { userId: students[0].id, lessonId: lessonsByCourse[courses[2].id][0].id, completed: true, completedAt: new Date('2026-01-15') }
  });
  // Quiz attempts - passed both
  const rajeshQuiz1 = allQuizzes.find(q => q.lesson.courseId === courses[0].id);
  const rajeshQuiz2 = allQuizzes.find(q => q.lesson.courseId === courses[1].id);
  if (rajeshQuiz1) {
    await prisma.quizAttempt.create({
      data: { userId: students[0].id, quizId: rajeshQuiz1.id, score: 85, passed: true, attemptedAt: new Date('2026-01-10') }
    });
  }
  if (rajeshQuiz2) {
    await prisma.quizAttempt.create({
      data: { userId: students[0].id, quizId: rajeshQuiz2.id, score: 90, passed: true, attemptedAt: new Date('2026-01-14') }
    });
  }

  // Priya Persaud [1] - High risk / struggling student (enrolled in 2, failed quiz once, retook and passed)
  await prisma.enrollment.createMany({
    data: [
      { userId: students[1].id, courseId: courses[0].id, enrolledAt: new Date('2025-12-20') },
      { userId: students[1].id, courseId: courses[1].id, enrolledAt: new Date('2026-01-05') }
    ]
  });
  // Complete 2 lessons from course 1
  for (let i = 0; i < 2; i++) {
    await prisma.progress.create({
      data: { userId: students[1].id, lessonId: lessonsByCourse[courses[0].id][i].id, completed: true, completedAt: new Date('2026-01-12') }
    });
  }
  // Failed quiz, then retook and passed
  const priyaQuiz = allQuizzes.find(q => q.lesson.courseId === courses[0].id);
  if (priyaQuiz) {
    await prisma.quizAttempt.createMany({
      data: [
        { userId: students[1].id, quizId: priyaQuiz.id, score: 65, passed: false, attemptedAt: new Date('2026-01-13') },
        { userId: students[1].id, quizId: priyaQuiz.id, score: 75, passed: true, attemptedAt: new Date('2026-01-15') }
      ]
    });
  }

  // Kumar Ramnauth [2] - Brand new student (enrolled in 1 course, just started)
  await prisma.enrollment.create({
    data: { userId: students[2].id, courseId: courses[0].id, enrolledAt: new Date('2026-01-15') }
  });
  // Complete only first lesson
  await prisma.progress.create({
    data: { userId: students[2].id, lessonId: lessonsByCourse[courses[0].id][0].id, completed: true, completedAt: new Date('2026-01-16') }
  });

  // Arjun Jaipaul [3] - Fresh student (enrolled in 3, completed half of each)
  await prisma.enrollment.createMany({
    data: [
      { userId: students[3].id, courseId: courses[0].id, enrolledAt: new Date('2025-12-22') },
      { userId: students[3].id, courseId: courses[1].id, enrolledAt: new Date('2025-12-28') },
      { userId: students[3].id, courseId: courses[2].id, enrolledAt: new Date('2026-01-05') }
    ]
  });
  // Complete first 4 lessons of each course (halfway through)
  for (const course of [courses[0], courses[1], courses[2]]) {
    for (let i = 0; i < 4; i++) {
      await prisma.progress.create({
        data: { userId: students[3].id, lessonId: lessonsByCourse[course.id][i].id, completed: true, completedAt: new Date('2026-01-14') }
      });
    }
  }

  // Vishnu Bisram [4] - Safe zone / high achiever (completed 3 courses, high scores)
  await prisma.enrollment.createMany({
    data: [
      { userId: students[4].id, courseId: courses[0].id, enrolledAt: new Date('2025-11-28'), completedAt: new Date('2026-01-06') },
      { userId: students[4].id, courseId: courses[1].id, enrolledAt: new Date('2025-12-05'), completedAt: new Date('2026-01-09') },
      { userId: students[4].id, courseId: courses[2].id, enrolledAt: new Date('2025-12-15'), completedAt: new Date('2026-01-12') },
      { userId: students[4].id, courseId: courses[4].id, enrolledAt: new Date('2026-01-10') }
    ]
  });
  // Complete all lessons in first 3 courses
  for (const course of [courses[0], courses[1], courses[2]]) {
    for (const lesson of lessonsByCourse[course.id]) {
      await prisma.progress.create({
        data: { userId: students[4].id, lessonId: lesson.id, completed: true, completedAt: new Date('2026-01-05') }
      });
    }
  }
  // Passed all 3 quizzes with excellent scores
  const vishnuQuiz1 = allQuizzes.find(q => q.lesson.courseId === courses[0].id);
  const vishnuQuiz2 = allQuizzes.find(q => q.lesson.courseId === courses[1].id);
  const vishnuQuiz3 = allQuizzes.find(q => q.lesson.courseId === courses[2].id);
  if (vishnuQuiz1) {
    await prisma.quizAttempt.create({
      data: { userId: students[4].id, quizId: vishnuQuiz1.id, score: 100, passed: true, attemptedAt: new Date('2026-01-06') }
    });
  }
  if (vishnuQuiz2) {
    await prisma.quizAttempt.create({
      data: { userId: students[4].id, quizId: vishnuQuiz2.id, score: 95, passed: true, attemptedAt: new Date('2026-01-09') }
    });
  }
  if (vishnuQuiz3) {
    await prisma.quizAttempt.create({
      data: { userId: students[4].id, quizId: vishnuQuiz3.id, score: 92, passed: true, attemptedAt: new Date('2026-01-12') }
    });
  }

  // ============================================
  // ADD RECENT QUIZ RETAKES FOR RETENTION DATA
  // ============================================
  // These provide multi-week repeat attempts so the Knowledge Retention chart has data.
  // Dates are spread across the last 6 weeks (within the default 90-day analytics window).

  // Rajesh [0] retakes quiz 1 (phishing) over several weeks — scores improve
  {
    const rajeshQ1 = allQuizzes.find(q => q.lesson.courseId === courses[0].id);
    if (rajeshQ1) {
      await prisma.quizAttempt.create({
        data: { userId: students[0].id, quizId: rajeshQ1.id, score: 75, passed: true, attemptedAt: new Date('2026-02-01') }
      });
      await prisma.quizAttempt.create({
        data: { userId: students[0].id, quizId: rajeshQ1.id, score: 80, passed: true, attemptedAt: new Date('2026-02-08') }
      });
      await prisma.quizAttempt.create({
        data: { userId: students[0].id, quizId: rajeshQ1.id, score: 90, passed: true, attemptedAt: new Date('2026-02-15') }
      });
      await prisma.quizAttempt.create({
        data: { userId: students[0].id, quizId: rajeshQ1.id, score: 95, passed: true, attemptedAt: new Date('2026-02-22') }
      });
      await prisma.quizAttempt.create({
        data: { userId: students[0].id, quizId: rajeshQ1.id, score: 92, passed: true, attemptedAt: new Date('2026-03-01') }
      });
    }

    // Rajesh retakes quiz 2 (password)
    const rajeshQ2 = allQuizzes.find(q => q.lesson.courseId === courses[1].id);
    if (rajeshQ2) {
      await prisma.quizAttempt.create({
        data: { userId: students[0].id, quizId: rajeshQ2.id, score: 80, passed: true, attemptedAt: new Date('2026-02-03') }
      });
      await prisma.quizAttempt.create({
        data: { userId: students[0].id, quizId: rajeshQ2.id, score: 88, passed: true, attemptedAt: new Date('2026-02-17') }
      });
      await prisma.quizAttempt.create({
        data: { userId: students[0].id, quizId: rajeshQ2.id, score: 92, passed: true, attemptedAt: new Date('2026-03-03') }
      });
    }
  }

  // Priya [1] retakes quiz 1 — starts weak, improves significantly
  {
    const priyaQ1 = allQuizzes.find(q => q.lesson.courseId === courses[0].id);
    if (priyaQ1) {
      await prisma.quizAttempt.create({
        data: { userId: students[1].id, quizId: priyaQ1.id, score: 60, passed: false, attemptedAt: new Date('2026-02-03') }
      });
      await prisma.quizAttempt.create({
        data: { userId: students[1].id, quizId: priyaQ1.id, score: 70, passed: true, attemptedAt: new Date('2026-02-10') }
      });
      await prisma.quizAttempt.create({
        data: { userId: students[1].id, quizId: priyaQ1.id, score: 78, passed: true, attemptedAt: new Date('2026-02-24') }
      });
      await prisma.quizAttempt.create({
        data: { userId: students[1].id, quizId: priyaQ1.id, score: 82, passed: true, attemptedAt: new Date('2026-03-10') }
      });
    }
  }

  // Vishnu [4] retakes all 3 quizzes over time — consistently excellent
  {
    const vQ1 = allQuizzes.find(q => q.lesson.courseId === courses[0].id);
    const vQ2 = allQuizzes.find(q => q.lesson.courseId === courses[1].id);
    const vQ3 = allQuizzes.find(q => q.lesson.courseId === courses[2].id);
    if (vQ1) {
      await prisma.quizAttempt.create({
        data: { userId: students[4].id, quizId: vQ1.id, score: 95, passed: true, attemptedAt: new Date('2026-02-05') }
      });
      await prisma.quizAttempt.create({
        data: { userId: students[4].id, quizId: vQ1.id, score: 100, passed: true, attemptedAt: new Date('2026-02-19') }
      });
      await prisma.quizAttempt.create({
        data: { userId: students[4].id, quizId: vQ1.id, score: 100, passed: true, attemptedAt: new Date('2026-03-05') }
      });
    }
    if (vQ2) {
      await prisma.quizAttempt.create({
        data: { userId: students[4].id, quizId: vQ2.id, score: 90, passed: true, attemptedAt: new Date('2026-02-07') }
      });
      await prisma.quizAttempt.create({
        data: { userId: students[4].id, quizId: vQ2.id, score: 95, passed: true, attemptedAt: new Date('2026-02-21') }
      });
      await prisma.quizAttempt.create({
        data: { userId: students[4].id, quizId: vQ2.id, score: 100, passed: true, attemptedAt: new Date('2026-03-07') }
      });
    }
    if (vQ3) {
      await prisma.quizAttempt.create({
        data: { userId: students[4].id, quizId: vQ3.id, score: 88, passed: true, attemptedAt: new Date('2026-02-10') }
      });
      await prisma.quizAttempt.create({
        data: { userId: students[4].id, quizId: vQ3.id, score: 95, passed: true, attemptedAt: new Date('2026-03-03') }
      });
    }
  }

  console.log('✅ Added recent quiz retakes for retention data');

  // ============================================
  // ADD LAB PROGRESS DATA
  // ============================================
  const allLabs = await prisma.lab.findMany({
    orderBy: { order: 'asc' }
  });
  const labsByCourse: { [key: string]: typeof allLabs } = {};
  for (const lab of allLabs) {
    if (!labsByCourse[lab.courseId]) {
      labsByCourse[lab.courseId] = [];
    }
    labsByCourse[lab.courseId].push(lab);
  }

  // Rajesh [0] - completed courses 0 & 1, so completed their labs
  if (labsByCourse[courses[0].id]?.[0]) {
    await prisma.labProgress.create({
      data: { userId: students[0].id, labId: labsByCourse[courses[0].id][0].id, status: 'COMPLETED', timeSpent: 25, score: 90, passed: true, attempts: 1, startedAt: new Date('2026-01-08'), completedAt: new Date('2026-01-08') }
    });
  }
  for (const lab of labsByCourse[courses[1].id] || []) {
    await prisma.labProgress.create({
      data: { userId: students[0].id, labId: lab.id, status: 'COMPLETED', timeSpent: 20, score: 85, passed: true, attempts: 1, startedAt: new Date('2026-01-12'), completedAt: new Date('2026-01-12') }
    });
  }

  // Priya [1] - started lab in course 0 but didn't finish
  if (labsByCourse[courses[0].id]?.[0]) {
    await prisma.labProgress.create({
      data: { userId: students[1].id, labId: labsByCourse[courses[0].id][0].id, status: 'IN_PROGRESS', timeSpent: 10, attempts: 1, startedAt: new Date('2026-01-12') }
    });
  }

  // Vishnu [4] - completed labs for courses 0, 1, 2 (high achiever)
  if (labsByCourse[courses[0].id]?.[0]) {
    await prisma.labProgress.create({
      data: { userId: students[4].id, labId: labsByCourse[courses[0].id][0].id, status: 'COMPLETED', timeSpent: 15, score: 100, passed: true, attempts: 1, startedAt: new Date('2026-01-05'), completedAt: new Date('2026-01-06') }
    });
  }
  for (const lab of labsByCourse[courses[1].id] || []) {
    await prisma.labProgress.create({
      data: { userId: students[4].id, labId: lab.id, status: 'COMPLETED', timeSpent: 18, score: 95, passed: true, attempts: 1, startedAt: new Date('2026-01-07'), completedAt: new Date('2026-01-07') }
    });
  }
  for (const lab of labsByCourse[courses[2].id] || []) {
    await prisma.labProgress.create({
      data: { userId: students[4].id, labId: lab.id, status: 'COMPLETED', timeSpent: 20, score: 98, passed: true, attempts: 1, startedAt: new Date('2026-01-10'), completedAt: new Date('2026-01-10') }
    });
  }

  console.log('✅ Added lab progress for students');

  console.log('✅ Added realistic study data for all students');

  // ============================================
  // CREATE INTRO ASSESSMENT
  // ============================================

  const introAssessment = await prisma.introAssessment.create({
    data: {
      title: 'Cybersecurity Skills Assessment',
      description: 'This assessment will help us understand your current cybersecurity knowledge and recommend the best learning path for you.',
      passingScore: 50,
      isActive: true
    }
  });

  // Create intro assessment questions - one from each course topic
  await prisma.introQuestion.createMany({
    data: [
      // Cybersecurity Fundamentals questions
      {
        introAssessmentId: introAssessment.id,
        question: 'What is the primary purpose of a firewall?',
        options: ['To speed up internet connection', 'To monitor and control network traffic based on security rules', 'To store passwords securely', 'To encrypt all files on a computer'],
        correctAnswer: 1,
        explanation: 'A firewall monitors and controls incoming and outgoing network traffic based on predetermined security rules, acting as a barrier between trusted and untrusted networks.',
        courseId: courses[0].id,
        order: 0
      },
      {
        introAssessmentId: introAssessment.id,
        question: 'Which of the following is an example of two-factor authentication (2FA)?',
        options: ['Using only a password', 'Using a password and a fingerprint', 'Using two different passwords', 'Using the same password on two devices'],
        correctAnswer: 1,
        explanation: 'Two-factor authentication requires two different types of verification - something you know (password) and something you have/are (fingerprint, token, etc.).',
        courseId: courses[0].id,
        order: 1
      },
      // Phishing & Social Engineering questions
      {
        introAssessmentId: introAssessment.id,
        question: 'What is phishing?',
        options: ['A type of fishing sport', 'An attempt to trick people into revealing sensitive information', 'A network security tool', 'A type of computer virus'],
        correctAnswer: 1,
        explanation: 'Phishing is a social engineering attack where attackers impersonate legitimate entities to trick victims into revealing sensitive information like passwords or credit card numbers.',
        courseId: courses[1].id,
        order: 2
      },
      {
        introAssessmentId: introAssessment.id,
        question: 'Which of these is a common sign of a phishing email?',
        options: ['Personalized greeting with your full name', 'Urgent language demanding immediate action', 'Links that match the official company domain', 'Professional grammar and spelling'],
        correctAnswer: 1,
        explanation: 'Phishing emails often create urgency to pressure victims into acting quickly without thinking, using phrases like "Act now!" or "Your account will be suspended!"',
        courseId: courses[1].id,
        order: 3
      },
      // Password Security questions
      {
        introAssessmentId: introAssessment.id,
        question: 'Which password is the most secure?',
        options: ['password123', 'MyDog2020', 'P@$$w0rd!', 'Tr0ub4dor&3Horse!Battery'],
        correctAnswer: 3,
        explanation: 'Longer passphrases with a mix of characters are more secure than short passwords, even with special characters. Length is the most important factor in password strength.',
        courseId: courses[2].id,
        order: 4
      },
      {
        introAssessmentId: introAssessment.id,
        question: 'What is the best practice for managing multiple passwords?',
        options: ['Use the same password everywhere', 'Write them on a sticky note', 'Use a password manager', 'Use simple variations of one password'],
        correctAnswer: 2,
        explanation: 'Password managers securely store and generate unique, complex passwords for each account, eliminating the need to remember multiple passwords.',
        courseId: courses[2].id,
        order: 5
      },
      // Safe Browsing questions
      {
        introAssessmentId: introAssessment.id,
        question: 'What does HTTPS indicate about a website?',
        options: ['The website is fast', 'The connection is encrypted', 'The website is government-approved', 'The website has no viruses'],
        correctAnswer: 1,
        explanation: 'HTTPS (Hypertext Transfer Protocol Secure) indicates that the connection between your browser and the website is encrypted, protecting data in transit.',
        courseId: courses[3].id,
        order: 6
      },
      {
        introAssessmentId: introAssessment.id,
        question: 'What should you do before clicking a link in an email?',
        options: ['Click it immediately to not miss out', 'Hover over it to check the actual URL', 'Forward it to friends first', 'Reply to ask if it\'s safe'],
        correctAnswer: 1,
        explanation: 'Hovering over a link reveals the actual URL it leads to, which may be different from the displayed text. This helps identify malicious links disguised as legitimate ones.',
        courseId: courses[3].id,
        order: 7
      },
      // Network Security questions
      {
        introAssessmentId: introAssessment.id,
        question: 'Why is using public Wi-Fi risky?',
        options: ['It\'s always slow', 'Anyone on the network could potentially intercept your data', 'It uses too much battery', 'It only works for browsing'],
        correctAnswer: 1,
        explanation: 'Public Wi-Fi networks are often unencrypted, allowing attackers on the same network to potentially intercept sensitive data like passwords and personal information.',
        courseId: courses[4].id,
        order: 8
      },
      {
        introAssessmentId: introAssessment.id,
        question: 'What is a VPN used for?',
        options: ['To make internet faster', 'To create an encrypted tunnel for your internet traffic', 'To block all advertisements', 'To store files in the cloud'],
        correctAnswer: 1,
        explanation: 'A VPN (Virtual Private Network) encrypts your internet traffic and routes it through a secure server, protecting your data and privacy, especially on untrusted networks.',
        courseId: courses[4].id,
        order: 9
      }
    ]
  });

  console.log('✅ Created intro assessment with 10 questions');

  // ============================================
  // CREATE INTRO ASSESSMENT ATTEMPTS
  // ============================================

  // Rajesh [0] - score 8/10, 80%, passed
  await prisma.introAssessmentAttempt.create({
    data: {
      userId: students[0].id,
      introAssessmentId: introAssessment.id,
      score: 8,
      totalQuestions: 10,
      percentage: 80,
      passed: true,
      answers: {
        "0": 1, "1": 1, "2": 1, "3": 1, "4": 3, "5": 2, "6": 1, "7": 1, "8": 0, "9": 0
      },
      completedAt: new Date('2025-12-02T09:30:00Z')
    }
  });

  // Priya [1] - score 5/10, 50%, passed (barely)
  await prisma.introAssessmentAttempt.create({
    data: {
      userId: students[1].id,
      introAssessmentId: introAssessment.id,
      score: 5,
      totalQuestions: 10,
      percentage: 50,
      passed: true,
      answers: {
        "0": 1, "1": 0, "2": 1, "3": 0, "4": 0, "5": 2, "6": 1, "7": 0, "8": 0, "9": 1
      },
      completedAt: new Date('2025-12-11T15:00:00Z')
    }
  });

  // Vishnu [4] - score 10/10, 100%, passed (perfect)
  await prisma.introAssessmentAttempt.create({
    data: {
      userId: students[4].id,
      introAssessmentId: introAssessment.id,
      score: 10,
      totalQuestions: 10,
      percentage: 100,
      passed: true,
      answers: {
        "0": 1, "1": 1, "2": 1, "3": 1, "4": 3, "5": 2, "6": 1, "7": 1, "8": 1, "9": 1
      },
      completedAt: new Date('2025-11-26T09:00:00Z')
    }
  });

  console.log('✅ Created intro assessment attempts for 3 students');

  // ============================================
  // CREATE PHISHING SCENARIOS AND ATTEMPTS
  // ============================================

  const phishingScenarios = await Promise.all([
    prisma.phishingScenario.create({
      data: {
        title: 'Urgent Account Verification Required',
        description: 'Fake PayPal email requesting immediate account verification',
        difficulty: 'Beginner',
        category: 'Finance',
        isActive: true,
        senderName: 'PayPal Security Team',
        senderEmail: 'security@paypa1-secure.com',
        subject: 'URGENT: Verify Your Account Within 24 Hours',
        body: `Dear Valued Customer,

We have detected unusual activity on your PayPal account. For your security, we have temporarily limited your account access.

To restore full access, please verify your information immediately by clicking the link below:

https://paypal-secure-verify.com/account/verify

You have 24 hours to complete this verification, or your account will be permanently suspended.

Thank you for your prompt attention to this matter.

PayPal Security Team`,
        attachments: [],
        isPhishing: true,
        redFlags: [
          'Misspelled domain (paypa1 instead of paypal)',
          'Creates false urgency (24 hour deadline)',
          'Threatening account suspension',
          'Suspicious verification link',
          'Generic greeting instead of personalized'
        ]
      }
    }),
    prisma.phishingScenario.create({
      data: {
        title: 'IT Department Password Reset',
        description: 'Fake internal IT email requesting password reset',
        difficulty: 'Beginner',
        category: 'Corporate',
        isActive: true,
        senderName: 'IT Support',
        senderEmail: 'it-support@companyname-helpdesk.com',
        subject: 'Mandatory Password Reset - Action Required',
        body: `Hello,

As part of our security upgrade, all employees must reset their passwords immediately.

Please click here to reset your password: http://company-portal-login.tk/reset

Failure to complete this within 2 hours will result in account lockout.

IT Department
Internal Extension: 5555`,
        attachments: [],
        isPhishing: true,
        redFlags: [
          'External domain (.tk is a free domain)',
          'Unsolicited password reset request',
          'Creates false urgency (2 hour deadline)',
          'Suspicious reset link',
          'Generic signature with fake extension'
        ]
      }
    }),
    prisma.phishingScenario.create({
      data: {
        title: 'Bank Statement Ready',
        description: 'Legitimate bank notification about monthly statement',
        difficulty: 'Beginner',
        category: 'Finance',
        isActive: true,
        senderName: 'Scotia Bank Notifications',
        senderEmail: 'statements@scotiabank.com',
        subject: 'Your December 2025 Statement is Ready',
        body: `Dear Customer,

Your monthly statement for December 2025 is now available.

To view your statement, please log in to online banking through our official website at www.scotiabank.com or mobile app.

Account ending in: **4532
Statement Period: December 1-31, 2025

If you have any questions, please contact us at 1-800-472-6842.

Best regards,
Scotia Bank

This is an automated message. Please do not reply to this email.`,
        attachments: [],
        isPhishing: false,
        redFlags: [],
        legitimateReason: 'Official bank domain, no suspicious links, professional formatting, contains account-specific information'
      }
    }),
    prisma.phishingScenario.create({
      data: {
        title: 'Netflix Subscription Expired',
        description: 'Fake Netflix email claiming payment failure',
        difficulty: 'Intermediate',
        category: 'Entertainment',
        isActive: true,
        senderName: 'Netflix Billing',
        senderEmail: 'billing@netflix-support.net',
        subject: 'Your Netflix subscription has been suspended',
        body: `Hi there,

We're having trouble processing your payment for Netflix.

Your subscription has been suspended. To continue enjoying Netflix, please update your payment information:

UPDATE PAYMENT METHOD: https://netflix-billing.net/update-payment

If we don't receive your payment within 48 hours, your account will be permanently closed and you will lose access to all your saved preferences and watch history.

The Netflix Team`,
        attachments: ['Invoice_Dec2025.pdf'],
        isPhishing: true,
        redFlags: [
          'Wrong domain (.net instead of .com)',
          'Creates urgency with account closure threat',
          'Suspicious payment link',
          'Attachment could contain malware',
          'Lacks Netflix official branding'
        ]
      }
    }),
    prisma.phishingScenario.create({
      data: {
        title: 'Company Holiday Schedule',
        description: 'Legitimate HR email about company holidays',
        difficulty: 'Beginner',
        category: 'Corporate',
        isActive: true,
        senderName: 'Human Resources',
        senderEmail: 'hr@company.com',
        subject: '2026 Holiday Schedule and Office Closure Dates',
        body: `Dear Team,

Please find below the official holiday schedule for 2026:

New Year's Day - January 1
Good Friday - April 10
Easter Monday - April 13
Labour Day - May 1
Independence Day - May 26
CARICOM Day - July 6
Emancipation Day - August 1
Christmas Day - December 25
Boxing Day - December 26

Please plan your work accordingly. For any questions regarding leave requests during these periods, please contact HR at extension 2500.

Best regards,
Sarah Johnson
HR Manager
Company Name Ltd.`,
        attachments: [],
        isPhishing: false,
        redFlags: [],
        legitimateReason: 'Internal company email, legitimate HR domain, contains factual information, professional signature with contact details'
      }
    }),
    prisma.phishingScenario.create({
      data: {
        title: 'Amazon Prize Winner Notification',
        description: 'Fake Amazon email claiming user won a prize',
        difficulty: 'Intermediate',
        category: 'Retail',
        isActive: true,
        senderName: 'Amazon Customer Service',
        senderEmail: 'prizes@amazon-winners.org',
        subject: "Congratulations! You've Won a $500 Amazon Gift Card",
        body: `Dear Lucky Winner,

CONGRATULATIONS! Your email address has been randomly selected in our monthly customer appreciation draw.

You have won a $500 Amazon Gift Card!

To claim your prize, please click the link below and enter your details:

CLAIM YOUR PRIZE NOW: http://amazon-claim-prize.xyz/winner

You must claim within 72 hours or the prize will be forfeited to another customer.

This is a limited time offer!

Amazon Customer Rewards Team`,
        attachments: [],
        isPhishing: true,
        redFlags: [
          'Unexpected prize/lottery notification',
          'Suspicious domain (.org and .xyz)',
          'Creates urgency (72 hour deadline)',
          'No official Amazon branding',
          'Asks to enter personal details on external site',
          'Too good to be true'
        ]
      }
    })
  ]);

  // Rajesh [0] - 6 phishing attempts, 90% success (5 correct, 1 wrong)
  await prisma.phishingAttempt.createMany({
    data: [
      { userId: students[0].id, scenarioId: phishingScenarios[0].id, userAction: 'REPORTED', isCorrect: true, responseTimeMs: 12000, attemptedAt: new Date('2026-01-20T10:15:00Z') },
      { userId: students[0].id, scenarioId: phishingScenarios[1].id, userAction: 'REPORTED', isCorrect: true, responseTimeMs: 18000, attemptedAt: new Date('2026-01-22T14:30:00Z') },
      { userId: students[0].id, scenarioId: phishingScenarios[2].id, userAction: 'MARKED_SAFE', isCorrect: true, responseTimeMs: 25000, attemptedAt: new Date('2026-01-25T09:45:00Z') },
      { userId: students[0].id, scenarioId: phishingScenarios[3].id, userAction: 'CLICKED_LINK', isCorrect: false, responseTimeMs: 8000, attemptedAt: new Date('2026-02-01T11:20:00Z') },
      { userId: students[0].id, scenarioId: phishingScenarios[4].id, userAction: 'MARKED_SAFE', isCorrect: true, responseTimeMs: 15000, attemptedAt: new Date('2026-02-05T16:00:00Z') },
      { userId: students[0].id, scenarioId: phishingScenarios[5].id, userAction: 'REPORTED', isCorrect: true, responseTimeMs: 10000, attemptedAt: new Date('2026-02-10T13:30:00Z') }
    ]
  });

  // Priya [1] - 6 phishing attempts, 50% success (3 correct, 3 wrong) — high risk
  await prisma.phishingAttempt.createMany({
    data: [
      { userId: students[1].id, scenarioId: phishingScenarios[0].id, userAction: 'CLICKED_LINK', isCorrect: false, responseTimeMs: 5000, attemptedAt: new Date('2026-01-21T09:00:00Z') },
      { userId: students[1].id, scenarioId: phishingScenarios[1].id, userAction: 'REPORTED', isCorrect: true, responseTimeMs: 30000, attemptedAt: new Date('2026-01-24T11:15:00Z') },
      { userId: students[1].id, scenarioId: phishingScenarios[2].id, userAction: 'REPORTED', isCorrect: false, responseTimeMs: 20000, attemptedAt: new Date('2026-01-28T14:45:00Z') },
      { userId: students[1].id, scenarioId: phishingScenarios[3].id, userAction: 'CLICKED_LINK', isCorrect: false, responseTimeMs: 6000, attemptedAt: new Date('2026-02-02T10:30:00Z') },
      { userId: students[1].id, scenarioId: phishingScenarios[4].id, userAction: 'MARKED_SAFE', isCorrect: true, responseTimeMs: 22000, attemptedAt: new Date('2026-02-08T15:20:00Z') },
      { userId: students[1].id, scenarioId: phishingScenarios[5].id, userAction: 'REPORTED', isCorrect: true, responseTimeMs: 28000, attemptedAt: new Date('2026-02-12T12:00:00Z') }
    ]
  });

  // Vishnu [4] - 6 phishing attempts, ~100% success (all correct) — safe zone
  await prisma.phishingAttempt.createMany({
    data: [
      { userId: students[4].id, scenarioId: phishingScenarios[0].id, userAction: 'REPORTED', isCorrect: true, responseTimeMs: 8000, attemptedAt: new Date('2026-01-18T10:00:00Z') },
      { userId: students[4].id, scenarioId: phishingScenarios[1].id, userAction: 'REPORTED', isCorrect: true, responseTimeMs: 10000, attemptedAt: new Date('2026-01-20T14:00:00Z') },
      { userId: students[4].id, scenarioId: phishingScenarios[2].id, userAction: 'MARKED_SAFE', isCorrect: true, responseTimeMs: 12000, attemptedAt: new Date('2026-01-23T09:30:00Z') },
      { userId: students[4].id, scenarioId: phishingScenarios[3].id, userAction: 'REPORTED', isCorrect: true, responseTimeMs: 7000, attemptedAt: new Date('2026-01-27T11:45:00Z') },
      { userId: students[4].id, scenarioId: phishingScenarios[4].id, userAction: 'MARKED_SAFE', isCorrect: true, responseTimeMs: 9000, attemptedAt: new Date('2026-02-03T16:15:00Z') },
      { userId: students[4].id, scenarioId: phishingScenarios[5].id, userAction: 'REPORTED', isCorrect: true, responseTimeMs: 6000, attemptedAt: new Date('2026-02-07T13:00:00Z') }
    ]
  });

  console.log('✅ Created 6 phishing scenarios and 18 phishing attempts for 3 students');

  console.log('\n🎉 Seed completed successfully!\n');
  console.log('Test accounts:');
  console.log('  Admin: admin@cyberguard.com / admin123');
  console.log('\n5 student users (all passwords: student123):');
  console.log('  Rajesh Singh: rajesh.singh@gmail.com (Active Learner - 4 enrollments, 2 completed)');
  console.log('  Priya Persaud: priya.persaud@yahoo.com (High Risk - struggling, failed then passed quiz)');
  console.log('  Kumar Ramnauth: kumar.ramnauth@outlook.com (Brand New - just started)');
  console.log('  Arjun Jaipaul: arjun.jaipaul@yahoo.com (Fresh - 3 courses, halfway through)');
  console.log('  Vishnu Bisram: vishnu.bisram@outlook.com (Safe Zone - high achiever, 3 completed, top scores)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
