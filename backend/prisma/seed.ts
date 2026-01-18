import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
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

  // Create Student Users (including original + new Guyanese students)
  const studentPassword = await bcrypt.hash('student123', 10);

  const students = await Promise.all([
    // Original student
    prisma.user.create({
      data: {
        email: 'student@example.com',
        password: studentPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'STUDENT',
        createdAt: new Date('2025-12-15T10:30:00Z')
      }
    }),

    // Guyanese Students
    prisma.user.create({
      data: {
        email: 'rajesh.singh@gmail.com',
        password: studentPassword,
        firstName: 'Rajesh',
        lastName: 'Singh',
        role: 'STUDENT',
        createdAt: new Date('2025-12-01T08:15:00Z')
      }
    }),
    prisma.user.create({
      data: {
        email: 'priya.persaud@yahoo.com',
        password: studentPassword,
        firstName: 'Priya',
        lastName: 'Persaud',
        role: 'STUDENT',
        createdAt: new Date('2025-12-10T14:22:00Z')
      }
    }),
    prisma.user.create({
      data: {
        email: 'kumar.ramnauth@outlook.com',
        password: studentPassword,
        firstName: 'Kumar',
        lastName: 'Ramnauth',
        role: 'STUDENT',
        createdAt: new Date('2026-01-15T09:45:00Z')
      }
    }),
    prisma.user.create({
      data: {
        email: 'anita.khan@gmail.com',
        password: studentPassword,
        firstName: 'Anita',
        lastName: 'Khan',
        role: 'STUDENT',
        createdAt: new Date('2025-12-05T16:30:00Z')
      }
    }),
    prisma.user.create({
      data: {
        email: 'arjun.jaipaul@yahoo.com',
        password: studentPassword,
        firstName: 'Arjun',
        lastName: 'Jaipaul',
        role: 'STUDENT',
        createdAt: new Date('2025-12-20T11:10:00Z')
      }
    }),
    prisma.user.create({
      data: {
        email: 'kavita.ramkissoon@outlook.com',
        password: studentPassword,
        firstName: 'Kavita',
        lastName: 'Ramkissoon',
        role: 'STUDENT',
        createdAt: new Date('2026-01-08T13:20:00Z')
      }
    }),
    prisma.user.create({
      data: {
        email: 'nadira.mohamed@gmail.com',
        password: studentPassword,
        firstName: 'Nadira',
        lastName: 'Mohamed',
        role: 'STUDENT',
        createdAt: new Date('2025-12-28T10:05:00Z')
      }
    }),
    prisma.user.create({
      data: {
        email: 'rohan.narine@yahoo.com',
        password: studentPassword,
        firstName: 'Rohan',
        lastName: 'Narine',
        role: 'STUDENT',
        createdAt: new Date('2025-11-28T15:40:00Z')
      }
    }),
    prisma.user.create({
      data: {
        email: 'simran.samaroo@outlook.com',
        password: studentPassword,
        firstName: 'Simran',
        lastName: 'Samaroo',
        role: 'STUDENT',
        createdAt: new Date('2025-12-12T09:25:00Z')
      }
    }),
    prisma.user.create({
      data: {
        email: 'deepak.lall@gmail.com',
        password: studentPassword,
        firstName: 'Deepak',
        lastName: 'Lall',
        role: 'STUDENT',
        createdAt: new Date('2026-01-10T12:50:00Z')
      }
    }),
    prisma.user.create({
      data: {
        email: 'maya.ramdass@yahoo.com',
        password: studentPassword,
        firstName: 'Maya',
        lastName: 'Ramdass',
        role: 'STUDENT',
        createdAt: new Date('2025-12-08T14:15:00Z')
      }
    }),
    prisma.user.create({
      data: {
        email: 'vishnu.bisram@outlook.com',
        password: studentPassword,
        firstName: 'Vishnu',
        lastName: 'Bisram',
        role: 'STUDENT',
        createdAt: new Date('2025-11-25T08:00:00Z')
      }
    })
  ]);

  const student = students[0]; // Keep reference to original student for backward compatibility
  console.log(`✅ Created ${students.length} student users (all use password: student123)`);

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

  // Enroll student in first two courses
  await prisma.enrollment.createMany({
    data: [
      { userId: student.id, courseId: courses[0].id },
      { userId: student.id, courseId: courses[1].id }
    ]
  });

  console.log('✅ Enrolled student in 2 courses');

  // Add some progress for the student
  const course1Lessons = await prisma.lesson.findMany({
    where: { courseId: courses[0].id },
    orderBy: { order: 'asc' }
  });

  if (course1Lessons.length > 0) {
    await prisma.progress.create({
      data: {
        userId: student.id,
        lessonId: course1Lessons[0].id,
        completed: true,
        completedAt: new Date()
      }
    });
    console.log('✅ Added progress for student (1 lesson completed)');
  }

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

  console.log('✅ Created 4 quizzes with questions');

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

  // Rajesh Singh - Active learner (enrolled in 4 courses, completed 2, high scores)
  await prisma.enrollment.createMany({
    data: [
      { userId: students[1].id, courseId: courses[0].id, completedAt: new Date('2026-01-10') },
      { userId: students[1].id, courseId: courses[1].id, completedAt: new Date('2026-01-14') },
      { userId: students[1].id, courseId: courses[2].id },
      { userId: students[1].id, courseId: courses[3].id }
    ]
  });
  // Complete all lessons in first two courses
  for (const lesson of lessonsByCourse[courses[0].id]) {
    await prisma.progress.create({
      data: { userId: students[1].id, lessonId: lesson.id, completed: true, completedAt: new Date('2026-01-09') }
    });
  }
  for (const lesson of lessonsByCourse[courses[1].id]) {
    await prisma.progress.create({
      data: { userId: students[1].id, lessonId: lesson.id, completed: true, completedAt: new Date('2026-01-13') }
    });
  }
  // Complete first lesson of course 3
  await prisma.progress.create({
    data: { userId: students[1].id, lessonId: lessonsByCourse[courses[2].id][0].id, completed: true, completedAt: new Date('2026-01-15') }
  });
  // Quiz attempts - passed both
  const rajeshQuiz1 = allQuizzes.find(q => q.lesson.courseId === courses[0].id);
  const rajeshQuiz2 = allQuizzes.find(q => q.lesson.courseId === courses[1].id);
  if (rajeshQuiz1) {
    await prisma.quizAttempt.create({
      data: { userId: students[1].id, quizId: rajeshQuiz1.id, score: 85, passed: true, attemptedAt: new Date('2026-01-10') }
    });
  }
  if (rajeshQuiz2) {
    await prisma.quizAttempt.create({
      data: { userId: students[1].id, quizId: rajeshQuiz2.id, score: 90, passed: true, attemptedAt: new Date('2026-01-14') }
    });
  }

  // Priya Persaud - Struggling student (enrolled in 2, failed quiz once, retook and passed)
  await prisma.enrollment.createMany({
    data: [
      { userId: students[2].id, courseId: courses[0].id },
      { userId: students[2].id, courseId: courses[1].id }
    ]
  });
  // Complete 2 lessons from course 1
  for (let i = 0; i < 2; i++) {
    await prisma.progress.create({
      data: { userId: students[2].id, lessonId: lessonsByCourse[courses[0].id][i].id, completed: true, completedAt: new Date('2026-01-12') }
    });
  }
  // Failed quiz, then retook and passed
  const priyaQuiz = allQuizzes.find(q => q.lesson.courseId === courses[0].id);
  if (priyaQuiz) {
    await prisma.quizAttempt.createMany({
      data: [
        { userId: students[2].id, quizId: priyaQuiz.id, score: 65, passed: false, attemptedAt: new Date('2026-01-13') },
        { userId: students[2].id, quizId: priyaQuiz.id, score: 75, passed: true, attemptedAt: new Date('2026-01-15') }
      ]
    });
  }

  // Kumar Ramnauth - New student (enrolled in 1 course, just started)
  await prisma.enrollment.create({
    data: { userId: students[3].id, courseId: courses[0].id }
  });
  // Complete only first lesson
  await prisma.progress.create({
    data: { userId: students[3].id, lessonId: lessonsByCourse[courses[0].id][0].id, completed: true, completedAt: new Date('2026-01-16') }
  });

  // Anita Khan - Completed student (finished 1 course completely with cert)
  await prisma.enrollment.createMany({
    data: [
      { userId: students[4].id, courseId: courses[0].id, completedAt: new Date('2026-01-11') },
      { userId: students[4].id, courseId: courses[3].id }
    ]
  });
  // Complete all lessons from course 1
  for (const lesson of lessonsByCourse[courses[0].id]) {
    await prisma.progress.create({
      data: { userId: students[4].id, lessonId: lesson.id, completed: true, completedAt: new Date('2026-01-10') }
    });
  }
  // Passed quiz
  const anitaQuiz = allQuizzes.find(q => q.lesson.courseId === courses[0].id);
  if (anitaQuiz) {
    await prisma.quizAttempt.create({
      data: { userId: students[4].id, quizId: anitaQuiz.id, score: 80, passed: true, attemptedAt: new Date('2026-01-11') }
    });
  }

  // Arjun Jaipaul - Average student (enrolled in 3, completed half of each)
  await prisma.enrollment.createMany({
    data: [
      { userId: students[5].id, courseId: courses[0].id },
      { userId: students[5].id, courseId: courses[1].id },
      { userId: students[5].id, courseId: courses[2].id }
    ]
  });
  // Complete first 2 lessons of each course
  for (const course of [courses[0], courses[1], courses[2]]) {
    for (let i = 0; i < 2; i++) {
      await prisma.progress.create({
        data: { userId: students[5].id, lessonId: lessonsByCourse[course.id][i].id, completed: true, completedAt: new Date('2026-01-14') }
      });
    }
  }

  // Kavita Ramkissoon - Focused learner (1 course, almost done)
  await prisma.enrollment.create({
    data: { userId: students[6].id, courseId: courses[1].id }
  });
  // Complete all lessons
  for (const lesson of lessonsByCourse[courses[1].id]) {
    await prisma.progress.create({
      data: { userId: students[6].id, lessonId: lesson.id, completed: true, completedAt: new Date('2026-01-15') }
    });
  }
  // About to take quiz

  // Nadira Mohamed - Inactive student (enrolled but no progress)
  await prisma.enrollment.createMany({
    data: [
      { userId: students[7].id, courseId: courses[0].id },
      { userId: students[7].id, courseId: courses[4].id }
    ]
  });

  // Rohan Narine - Advanced student (taking advanced course)
  await prisma.enrollment.createMany({
    data: [
      { userId: students[8].id, courseId: courses[0].id, completedAt: new Date('2026-01-08') },
      { userId: students[8].id, courseId: courses[5].id }
    ]
  });
  // Completed all lessons in course 1
  for (const lesson of lessonsByCourse[courses[0].id]) {
    await prisma.progress.create({
      data: { userId: students[8].id, lessonId: lesson.id, completed: true, completedAt: new Date('2026-01-07') }
    });
  }
  // Working on advanced course - 2 lessons done
  for (let i = 0; i < 2; i++) {
    await prisma.progress.create({
      data: { userId: students[8].id, lessonId: lessonsByCourse[courses[5].id][i].id, completed: true, completedAt: new Date('2026-01-15') }
    });
  }
  // Passed first quiz with high score
  const rohanQuiz = allQuizzes.find(q => q.lesson.courseId === courses[0].id);
  if (rohanQuiz) {
    await prisma.quizAttempt.create({
      data: { userId: students[8].id, quizId: rohanQuiz.id, score: 95, passed: true, attemptedAt: new Date('2026-01-08') }
    });
  }

  // Simran Samaroo - Moderate progress (2 courses, working through steadily)
  await prisma.enrollment.createMany({
    data: [
      { userId: students[9].id, courseId: courses[1].id },
      { userId: students[9].id, courseId: courses[3].id }
    ]
  });
  // Complete all lessons in course 2
  for (const lesson of lessonsByCourse[courses[1].id]) {
    await prisma.progress.create({
      data: { userId: students[9].id, lessonId: lesson.id, completed: true, completedAt: new Date('2026-01-12') }
    });
  }
  // Complete 1 lesson in course 4
  await prisma.progress.create({
    data: { userId: students[9].id, lessonId: lessonsByCourse[courses[3].id][0].id, completed: true, completedAt: new Date('2026-01-14') }
  });
  // Passed quiz 2
  const simranQuiz = allQuizzes.find(q => q.lesson.courseId === courses[1].id);
  if (simranQuiz) {
    await prisma.quizAttempt.create({
      data: { userId: students[9].id, quizId: simranQuiz.id, score: 78, passed: true, attemptedAt: new Date('2026-01-12') }
    });
  }

  // Deepak Lall - Just browsing (enrolled in many, minimal progress)
  await prisma.enrollment.createMany({
    data: [
      { userId: students[10].id, courseId: courses[0].id },
      { userId: students[10].id, courseId: courses[1].id },
      { userId: students[10].id, courseId: courses[2].id },
      { userId: students[10].id, courseId: courses[3].id },
      { userId: students[10].id, courseId: courses[4].id }
    ]
  });
  // Only completed 1 lesson across all courses
  await prisma.progress.create({
    data: { userId: students[10].id, lessonId: lessonsByCourse[courses[0].id][0].id, completed: true, completedAt: new Date('2026-01-13') }
  });

  // Maya Ramdass - Consistent learner (enrolled in 2, steady progress)
  await prisma.enrollment.createMany({
    data: [
      { userId: students[11].id, courseId: courses[0].id },
      { userId: students[11].id, courseId: courses[2].id }
    ]
  });
  // Complete all lessons in course 1
  for (const lesson of lessonsByCourse[courses[0].id]) {
    await prisma.progress.create({
      data: { userId: students[11].id, lessonId: lesson.id, completed: true, completedAt: new Date('2026-01-11') }
    });
  }
  // Complete 2 lessons in course 3
  for (let i = 0; i < 2; i++) {
    await prisma.progress.create({
      data: { userId: students[11].id, lessonId: lessonsByCourse[courses[2].id][i].id, completed: true, completedAt: new Date('2026-01-15') }
    });
  }
  // Passed quiz 1
  const mayaQuiz = allQuizzes.find(q => q.lesson.courseId === courses[0].id);
  if (mayaQuiz) {
    await prisma.quizAttempt.create({
      data: { userId: students[11].id, quizId: mayaQuiz.id, score: 82, passed: true, attemptedAt: new Date('2026-01-11') }
    });
  }

  // Vishnu Bisram - High achiever (completed 3 courses, high scores)
  await prisma.enrollment.createMany({
    data: [
      { userId: students[12].id, courseId: courses[0].id, completedAt: new Date('2026-01-06') },
      { userId: students[12].id, courseId: courses[1].id, completedAt: new Date('2026-01-09') },
      { userId: students[12].id, courseId: courses[2].id, completedAt: new Date('2026-01-12') },
      { userId: students[12].id, courseId: courses[4].id }
    ]
  });
  // Complete all lessons in first 3 courses
  for (const course of [courses[0], courses[1], courses[2]]) {
    for (const lesson of lessonsByCourse[course.id]) {
      await prisma.progress.create({
        data: { userId: students[12].id, lessonId: lesson.id, completed: true, completedAt: new Date('2026-01-05') }
      });
    }
  }
  // Passed all 3 quizzes with excellent scores
  const vishnuQuiz1 = allQuizzes.find(q => q.lesson.courseId === courses[0].id);
  const vishnuQuiz2 = allQuizzes.find(q => q.lesson.courseId === courses[1].id);
  const vishnuQuiz3 = allQuizzes.find(q => q.lesson.courseId === courses[2].id);
  if (vishnuQuiz1) {
    await prisma.quizAttempt.create({
      data: { userId: students[12].id, quizId: vishnuQuiz1.id, score: 100, passed: true, attemptedAt: new Date('2026-01-06') }
    });
  }
  if (vishnuQuiz2) {
    await prisma.quizAttempt.create({
      data: { userId: students[12].id, quizId: vishnuQuiz2.id, score: 95, passed: true, attemptedAt: new Date('2026-01-09') }
    });
  }
  if (vishnuQuiz3) {
    await prisma.quizAttempt.create({
      data: { userId: students[12].id, quizId: vishnuQuiz3.id, score: 92, passed: true, attemptedAt: new Date('2026-01-12') }
    });
  }

  console.log('✅ Added realistic study data for all students');

  console.log('\n🎉 Seed completed successfully!\n');
  console.log('Test accounts:');
  console.log('  Admin: admin@cyberguard.com / admin123');
  console.log('\nStudents (all passwords: student123):');
  console.log('  John Doe: student@example.com');
  console.log('  Rajesh Singh: rajesh.singh@gmail.com (Active - 4 enrollments, 2 completed)');
  console.log('  Priya Persaud: priya.persaud@yahoo.com (Struggling - failed then passed quiz)');
  console.log('  Kumar Ramnauth: kumar.ramnauth@outlook.com (New - just started)');
  console.log('  Anita Khan: anita.khan@gmail.com (Completed 1 course)');
  console.log('  Arjun Jaipaul: arjun.jaipaul@yahoo.com (Average - 3 courses, halfway)');
  console.log('  Kavita Ramkissoon: kavita.ramkissoon@outlook.com (Focused - 1 course almost done)');
  console.log('  Nadira Mohamed: nadira.mohamed@gmail.com (Inactive - enrolled but no progress)');
  console.log('  Rohan Narine: rohan.narine@yahoo.com (Advanced - taking advanced course)');
  console.log('  Simran Samaroo: simran.samaroo@outlook.com (Moderate - steady progress)');
  console.log('  Deepak Lall: deepak.lall@gmail.com (Browsing - many enrollments, minimal progress)');
  console.log('  Maya Ramdass: maya.ramdass@yahoo.com (Consistent - 2 courses, good progress)');
  console.log('  Vishnu Bisram: vishnu.bisram@outlook.com (High achiever - 3 completed, 100% scores)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
