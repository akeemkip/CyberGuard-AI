import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Adding Advanced Threat Analysis course...\n');

  // Check if course already exists
  const existingCourse = await prisma.course.findFirst({
    where: { title: 'Advanced Threat Analysis & Incident Response' }
  });

  if (existingCourse) {
    console.log('⚠️  Course already exists. Skipping creation.');
    return;
  }

  // Create the Advanced course
  const course = await prisma.course.create({
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
  });

  console.log(`✅ Created course: ${course.title}`);
  console.log(`   ID: ${course.id}`);
  console.log(`   Difficulty: ${course.difficulty}`);
  console.log(`   Duration: ${course.duration}`);

  // Get the last lesson to attach the quiz
  const lastLesson = await prisma.lesson.findFirst({
    where: { courseId: course.id },
    orderBy: { order: 'desc' }
  });

  if (lastLesson) {
    // Create the quiz
    const quiz = await prisma.quiz.create({
      data: {
        lessonId: lastLesson.id,
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

    console.log(`\n✅ Created quiz: ${quiz.title}`);
    console.log(`   Passing Score: ${quiz.passingScore}%`);
    console.log(`   Questions: 7`);
  }

  console.log('\n🎉 Advanced course added successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Failed to add course:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
