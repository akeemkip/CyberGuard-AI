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
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
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

  // Create Student User
  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.create({
    data: {
      email: 'student@example.com',
      password: studentPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'STUDENT'
    }
  });
  console.log('✅ Created student user: student@example.com / student123');

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

  console.log('\n🎉 Seed completed successfully!\n');
  console.log('Test accounts:');
  console.log('  Admin: admin@cyberguard.com / admin123');
  console.log('  Student: student@example.com / student123');
  console.log('\nTo add historical data to an existing user, run:');
  console.log('  npm run db:add-history');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
