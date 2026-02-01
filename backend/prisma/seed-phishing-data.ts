import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎣 Starting phishing data seed...');

  // Get all students
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' }
  });

  console.log(`Found ${students.length} students`);

  // Create phishing scenarios
  const scenarios = await Promise.all([
    prisma.phishingScenario.create({
      data: {
        title: 'Urgent Account Verification Required',
        description: 'Fake PayPal email requesting immediate account verification',
        difficulty: 'Beginner',
        category: 'Finance',
        isActive: true,
        senderName: 'PayPal Security Team',
        senderEmail: 'security@paypa1-secure.com', // Note: paypa1 (number 1) instead of paypal
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
        ],
        legitimateReason: null
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
        ],
        legitimateReason: null
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
        body: `Dear John Doe,

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
        ],
        legitimateReason: null
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
        subject: 'Congratulations! You\'ve Won a $500 Amazon Gift Card',
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
        ],
        legitimateReason: null
      }
    }),

    prisma.phishingScenario.create({
      data: {
        title: 'Microsoft 365 License Renewal',
        description: 'Legitimate Microsoft license renewal notification',
        difficulty: 'Intermediate',
        category: 'Corporate',
        isActive: true,
        senderName: 'Microsoft 365 Admin',
        senderEmail: 'admin@microsoft.com',
        subject: 'Your Microsoft 365 Business License Renewal',
        body: `Hello Administrator,

This is a reminder that your Microsoft 365 Business subscription is due for renewal on January 15, 2026.

Subscription Details:
- Plan: Microsoft 365 Business Standard
- Users: 25
- Renewal Date: January 15, 2026
- Amount: $312.50/month

To manage your subscription or update billing information, please sign in to the Microsoft 365 admin center at https://admin.microsoft.com

If you have questions, contact Microsoft Support at 1-800-642-7676.

Thank you for choosing Microsoft 365.

Microsoft Corporation`,
        attachments: [],
        isPhishing: false,
        redFlags: [],
        legitimateReason: 'Official Microsoft domain, correct admin portal link, provides official support number, professional formatting, no urgency or threats'
      }
    }),

    prisma.phishingScenario.create({
      data: {
        title: 'IRS Tax Refund Processing',
        description: 'Fake IRS email claiming tax refund is ready',
        difficulty: 'Advanced',
        category: 'Government',
        isActive: true,
        senderName: 'Internal Revenue Service',
        senderEmail: 'refunds@irs-treasury.gov',
        subject: 'Tax Refund Notification - $1,847.00 Approved',
        body: `INTERNAL REVENUE SERVICE
United States Department of Treasury

Taxpayer ID: ***-**-4532
Tax Year: 2025

Dear Taxpayer,

After reviewing your tax return for fiscal year 2025, we have determined that you are eligible for a tax refund of $1,847.00.

To process your refund, please verify your bank account information by clicking the secure link below:

https://irs.treasury-refund.com/verify

Please note: Failure to verify your information within 7 days will result in your refund being sent via check, which may take 6-8 weeks to process.

For faster processing, please verify immediately.

Internal Revenue Service
Department of Treasury`,
        attachments: ['TAX_REFUND_FORM.pdf'],
        isPhishing: true,
        redFlags: [
          'Wrong domain (irs-treasury.gov is not official)',
          'IRS never sends unsolicited emails about refunds',
          'Requests sensitive banking information via email',
          'Creates urgency with processing delay threat',
          'Suspicious attachment',
          'IRS uses official IRS.gov domain only'
        ],
        legitimateReason: null
      }
    }),

    prisma.phishingScenario.create({
      data: {
        title: 'Team Meeting Invitation',
        description: 'Legitimate meeting invitation from colleague',
        difficulty: 'Beginner',
        category: 'Corporate',
        isActive: true,
        senderName: 'Jennifer Martinez',
        senderEmail: 'jennifer.martinez@company.com',
        subject: 'Weekly Team Sync - Wednesday 2PM',
        body: `Hi Team,

This is a reminder for our weekly team sync meeting:

Date: Wednesday, January 8, 2026
Time: 2:00 PM - 3:00 PM EST
Location: Conference Room B / Microsoft Teams

Agenda:
1. Project status updates
2. Q1 planning review
3. Upcoming deadlines
4. Open discussion

Teams Link: [Join Microsoft Teams Meeting]
Meeting ID: 123 456 789

See you there!

Jennifer Martinez
Project Manager
Company Name Ltd.
jennifer.martinez@company.com | Ext: 4421`,
        attachments: [],
        isPhishing: false,
        redFlags: [],
        legitimateReason: 'Internal company email, legitimate domain, expected meeting invitation, proper contact information, no suspicious links'
      }
    }),

    prisma.phishingScenario.create({
      data: {
        title: 'Cryptocurrency Investment Opportunity',
        description: 'Fake crypto investment scam email',
        difficulty: 'Advanced',
        category: 'Finance',
        isActive: true,
        senderName: 'Bitcoin Investment Fund',
        senderEmail: 'opportunities@crypto-invest-secure.com',
        subject: 'EXCLUSIVE: Turn $500 into $50,000 in 30 Days',
        body: `Dear Future Millionaire,

You've been selected for an EXCLUSIVE opportunity to join our elite Bitcoin investment program.

Our proprietary AI trading algorithm guarantees:
✓ 10,000% returns in 30 days
✓ Zero risk - money-back guarantee
✓ Only 50 spots available
✓ Limited time offer expires in 24 hours

Minimum investment: $500
Expected return: $50,000

CLICK HERE TO SECURE YOUR SPOT:
https://crypto-millionaire-club.net/invest-now

Don't miss this once-in-a-lifetime opportunity!

Act now before all spots are filled!

Bitcoin Investment Fund
Zurich, Switzerland`,
        attachments: ['Investment_Prospectus.exe'],
        isPhishing: true,
        redFlags: [
          'Unrealistic returns (10,000% is impossible)',
          'Creates extreme urgency (24 hours)',
          'Too good to be true promises',
          'Suspicious executable attachment (.exe)',
          'No legitimate company information',
          'High-pressure sales tactics',
          'Guaranteed returns (major red flag)'
        ],
        legitimateReason: null
      }
    })
  ]);

  console.log(`✅ Created ${scenarios.length} phishing scenarios`);

  // Generate random date between November 2025 and May 2026
  function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  // Generate random response time (500ms to 60 seconds)
  function randomResponseTime(): number {
    return Math.floor(Math.random() * (60000 - 500) + 500);
  }

  const startDate = new Date('2025-11-01T00:00:00Z');
  const endDate = new Date('2026-05-31T23:59:59Z');

  // Define student performance profiles
  const studentProfiles = [
    // Excellent performers (pass all/most)
    { student: students[0], successRate: 0.95, name: 'John Doe' },
    { student: students[1], successRate: 0.90, name: 'Rajesh Singh' },

    // Good performers (pass most)
    { student: students[2], successRate: 0.75, name: 'Priya Persaud' },
    { student: students[3], successRate: 0.70, name: 'Kumar Ramnauth' },

    // Average performers (pass about half)
    { student: students[4], successRate: 0.55, name: 'Anita Khan' },

    // Poor performers (fail most)
    ...(students.length > 5 ? [
      { student: students[5], successRate: 0.35, name: students[5].firstName + ' ' + students[5].lastName },
      { student: students[6], successRate: 0.25, name: students[6].firstName + ' ' + students[6].lastName }
    ] : [])
  ];

  let totalAttempts = 0;

  // Generate attempts for each student
  for (const profile of studentProfiles) {
    if (!profile.student) continue;

    console.log(`\nGenerating attempts for ${profile.name} (${(profile.successRate * 100).toFixed(0)}% success rate)...`);

    // Each student attempts 5-8 different scenarios
    const numScenarios = Math.floor(Math.random() * 4) + 5; // 5-8 scenarios
    const selectedScenarios = scenarios
      .sort(() => Math.random() - 0.5) // Shuffle
      .slice(0, numScenarios);

    for (const scenario of selectedScenarios) {
      // Determine if student will be correct based on their success rate
      const willBeCorrect = Math.random() < profile.successRate;

      let userAction: 'REPORTED' | 'MARKED_SAFE' | 'CLICKED_LINK' | 'DELETED' | 'IGNORED';
      let isCorrect: boolean;

      if (scenario.isPhishing) {
        // For phishing emails
        if (willBeCorrect) {
          // Correct action: REPORTED or DELETED
          userAction = Math.random() < 0.7 ? 'REPORTED' : 'DELETED';
          isCorrect = true;
        } else {
          // Incorrect actions: CLICKED_LINK, MARKED_SAFE, or IGNORED
          const rand = Math.random();
          if (rand < 0.5) {
            userAction = 'CLICKED_LINK';
          } else if (rand < 0.8) {
            userAction = 'MARKED_SAFE';
          } else {
            userAction = 'IGNORED';
          }
          isCorrect = false;
        }
      } else {
        // For legitimate emails
        if (willBeCorrect) {
          // Correct action: MARKED_SAFE or IGNORED
          userAction = Math.random() < 0.6 ? 'MARKED_SAFE' : 'IGNORED';
          isCorrect = true;
        } else {
          // Incorrect actions: REPORTED, DELETED, or CLICKED_LINK
          const rand = Math.random();
          if (rand < 0.6) {
            userAction = 'REPORTED';
          } else if (rand < 0.9) {
            userAction = 'DELETED';
          } else {
            userAction = 'CLICKED_LINK';
          }
          isCorrect = false;
        }
      }

      // Better performers tend to respond faster
      const baseResponseTime = randomResponseTime();
      const responseTime = Math.floor(baseResponseTime * (1 - profile.successRate * 0.3));

      await prisma.phishingAttempt.create({
        data: {
          userId: profile.student.id,
          scenarioId: scenario.id,
          userAction,
          isCorrect,
          responseTimeMs: responseTime,
          attemptedAt: randomDate(startDate, endDate)
        }
      });

      totalAttempts++;
    }

    console.log(`  ✓ Generated ${numScenarios} attempts`);
  }

  console.log(`\n✅ Created ${totalAttempts} total phishing attempts`);
  console.log('\n🎉 Phishing data seed complete!');
  console.log('\nSummary:');
  console.log(`- Scenarios created: ${scenarios.length}`);
  console.log(`- Students with attempts: ${studentProfiles.length}`);
  console.log(`- Total attempts: ${totalAttempts}`);
  console.log(`- Date range: November 2025 - May 2026`);
}

main()
  .catch((e) => {
    console.error('Error seeding phishing data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
