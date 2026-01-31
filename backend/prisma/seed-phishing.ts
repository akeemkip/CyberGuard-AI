import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const phishingScenarios = [
  // PHISHING SCENARIOS - Beginner
  {
    title: "Fake Bank Security Alert",
    description: "A classic bank phishing email with urgent language and suspicious links",
    difficulty: "Beginner",
    category: "Banking",
    isActive: true,
    senderName: "Security Team",
    senderEmail: "security@bank-secure-alert.com",
    subject: "URGENT: Your Account Has Been Compromised!",
    body: `<p>Dear Valued Customer,</p>
<p>We have detected <strong>suspicious activity</strong> on your account. Your account has been temporarily suspended due to unauthorized access attempts.</p>
<p><strong style="color: red;">ACTION REQUIRED IMMEDIATELY</strong></p>
<p>Click the link below to verify your identity and restore your account access:</p>
<p><a href="#">https://secure-bank-verify.com/restore-account</a></p>
<p>If you do not verify your account within 24 hours, it will be permanently closed.</p>
<p>Best regards,<br>Bank Security Team</p>`,
    attachments: [],
    isPhishing: true,
    redFlags: [
      "Generic greeting ('Valued Customer') instead of your name",
      "Suspicious sender domain (bank-secure-alert.com instead of official bank domain)",
      "Creates urgency with threats and deadlines",
      "Asks you to click a link to 'verify' your account",
      "Poor grammar and excessive capitalization"
    ],
    legitimateReason: null
  },
  {
    title: "Prize Winner Notification",
    description: "Lottery scam promising a large cash prize",
    difficulty: "Beginner",
    category: "Prize/Lottery",
    isActive: true,
    senderName: "International Lottery Commission",
    senderEmail: "winner@intl-lottery-prize.org",
    subject: "Congratulations! You've Won $1,500,000!",
    body: `<p>CONGRATULATIONS!!!</p>
<p>Your email address was randomly selected in our international lottery draw and you have won the grand prize of <strong>$1,500,000 USD</strong>!</p>
<p>To claim your prize, please reply with the following information:</p>
<ul>
<li>Full Name</li>
<li>Date of Birth</li>
<li>Address</li>
<li>Phone Number</li>
<li>Bank Account Details</li>
</ul>
<p>You must respond within 48 hours or your prize will be forfeited!</p>
<p>Congratulations again!</p>
<p>Dr. James Williams<br>Prize Claims Manager</p>`,
    attachments: ["Claim_Form.exe"],
    isPhishing: true,
    redFlags: [
      "You can't win a lottery you never entered",
      "Requests sensitive personal and financial information",
      "Suspicious attachment with .exe extension",
      "Creates urgency with deadline threats",
      "Poor formatting with excessive punctuation"
    ],
    legitimateReason: null
  },
  {
    title: "IT Password Reset",
    description: "Fake IT department asking for password reset",
    difficulty: "Beginner",
    category: "IT Support",
    isActive: true,
    senderName: "IT Help Desk",
    senderEmail: "helpdesk@it-support-dept.net",
    subject: "Password Expiration Notice - Immediate Action Required",
    body: `<p>Hello,</p>
<p>Our records indicate that your company password will expire in <strong>2 hours</strong>.</p>
<p>To avoid being locked out of your account, please click the link below to update your password immediately:</p>
<p><a href="#">http://company-password-reset.com/update</a></p>
<p>You will need to enter your current password and create a new one.</p>
<p>If you have any questions, please do not reply to this email. Contact support at support@it-support-dept.net</p>
<p>Thank you,<br>IT Help Desk</p>`,
    attachments: [],
    isPhishing: true,
    redFlags: [
      "External email domain, not from your company",
      "Creates artificial urgency (2 hours)",
      "Link goes to external website, not company intranet",
      "Legitimate IT departments don't ask for current passwords via email",
      "Generic greeting without your name"
    ],
    legitimateReason: null
  },

  // PHISHING SCENARIOS - Intermediate
  {
    title: "CEO Wire Transfer Request",
    description: "Business email compromise impersonating the CEO",
    difficulty: "Intermediate",
    category: "HR/Payroll",
    isActive: true,
    senderName: "Michael Johnson",
    senderEmail: "m.johnson@company-exec.co",
    subject: "Urgent Wire Transfer - Confidential",
    body: `<p>Hi,</p>
<p>I need you to process an urgent wire transfer for a confidential acquisition we're finalizing today.</p>
<p>Amount: $45,000<br>
Account: 1234567890<br>
Bank: First National Bank<br>
Routing: 021000021</p>
<p>Please handle this immediately and keep it confidential - we'll discuss at the board meeting next week.</p>
<p>I'm in meetings all day so email only please.</p>
<p>Thanks,<br>Michael<br><br>
<em>Sent from my iPhone</em></p>`,
    attachments: [],
    isPhishing: true,
    redFlags: [
      "Similar but not exact email domain (company-exec.co vs official domain)",
      "Urgent request bypassing normal approval processes",
      "Request to keep transaction confidential",
      "Sender claims to be unavailable for verification calls",
      "Unusual request from executive to regular employee"
    ],
    legitimateReason: null
  },
  {
    title: "Shipping Delivery Notification",
    description: "Fake package delivery notification with malicious tracking link",
    difficulty: "Intermediate",
    category: "Shipping",
    isActive: true,
    senderName: "UPS Delivery Team",
    senderEmail: "delivery@ups-tracking-notify.com",
    subject: "Your Package Could Not Be Delivered - Action Required",
    body: `<p>Dear Customer,</p>
<p>We attempted to deliver your package today but were unable to complete delivery.</p>
<p><strong>Tracking Number:</strong> 1Z999AA10123456784</p>
<p>Reason: Incorrect address information</p>
<p>To reschedule delivery, please update your address information by clicking below:</p>
<p><a href="#">Track and Update Delivery</a></p>
<p>If we don't hear from you within 3 business days, your package will be returned to sender.</p>
<p>Thank you for choosing UPS.</p>
<p><img src="#" alt="UPS Logo" /></p>`,
    attachments: ["Shipping_Label.pdf"],
    isPhishing: true,
    redFlags: [
      "Not from official UPS domain (ups.com)",
      "Generic tracking number format",
      "You may not be expecting a package",
      "Suspicious attachment - legitimate shipping companies don't send labels this way",
      "Link text doesn't show actual URL destination"
    ],
    legitimateReason: null
  },
  {
    title: "LinkedIn Connection Request",
    description: "Fake LinkedIn notification with credential harvesting link",
    difficulty: "Intermediate",
    category: "Social Media",
    isActive: true,
    senderName: "LinkedIn",
    senderEmail: "notifications@linkedln-mail.com",
    subject: "Sarah Chen wants to connect with you",
    body: `<p>Hi,</p>
<p><strong>Sarah Chen</strong>, Senior Recruiter at Google, has sent you a connection request.</p>
<p>"Hi! I came across your profile and I'm impressed with your experience. We have several positions that might interest you. Let's connect!"</p>
<p><a href="#">Accept Connection</a> | <a href="#">View Profile</a></p>
<hr>
<p style="font-size: 12px; color: gray;">This email was sent to you by LinkedIn. LinkedIn, 1000 W Maude Ave, Sunnyvale, CA 94085</p>`,
    attachments: [],
    isPhishing: true,
    redFlags: [
      "Misspelled domain: 'linkedln' instead of 'linkedin'",
      "Enticing offer from prestigious company recruiter",
      "Links likely lead to credential harvesting page",
      "Check the actual URL before clicking - hover over links"
    ],
    legitimateReason: null
  },

  // PHISHING SCENARIOS - Advanced
  {
    title: "DocuSign Contract Review",
    description: "Sophisticated DocuSign impersonation with urgent contract",
    difficulty: "Advanced",
    category: "E-commerce",
    isActive: true,
    senderName: "DocuSign",
    senderEmail: "dse@docusign.net",
    subject: "Contract Ready for Your Signature - Expires Today",
    body: `<p style="text-align: center;"><img src="#" alt="DocuSign" width="200" /></p>
<p>Hello,</p>
<p>A document has been sent to you for electronic signature by <strong>Legal Department - Acme Corp</strong>.</p>
<p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
<strong>Document:</strong> Employment Agreement Amendment<br>
<strong>Sender:</strong> hr@acme-corp.com<br>
<strong>Expires:</strong> Today at 5:00 PM
</p>
<p style="text-align: center;"><a href="#" style="background: #ffc107; padding: 10px 30px; color: #000; text-decoration: none; border-radius: 3px;">REVIEW DOCUMENT</a></p>
<p style="font-size: 11px; color: gray;">Do not share this email. The link is unique to you.<br>
Powered by DocuSign. Questions? Visit support.docusign.com</p>`,
    attachments: [],
    isPhishing: true,
    redFlags: [
      "DocuSign uses docusign.com, not docusign.net for official emails",
      "Creating urgency with same-day expiration",
      "Verify with sender through separate communication channel",
      "Hover over buttons to check actual link destination",
      "Legitimate DocuSign emails include more account details"
    ],
    legitimateReason: null
  },
  {
    title: "Zoom Meeting Recording Available",
    description: "Fake Zoom notification exploiting remote work trends",
    difficulty: "Advanced",
    category: "IT Support",
    isActive: true,
    senderName: "Zoom Video",
    senderEmail: "no-reply@zoom-cloud-recordings.com",
    subject: "Cloud Recording: Project Review Meeting is now available",
    body: `<p>Hi,</p>
<p>Your cloud recording is now available.</p>
<p style="background: #f0f0f0; padding: 15px; border-radius: 5px;">
<strong>Meeting:</strong> Project Review Meeting<br>
<strong>Host:</strong> Your Manager<br>
<strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
<strong>Duration:</strong> 45 minutes
</p>
<p><a href="#" style="background: #2D8CFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px;">View Recording</a></p>
<p>This recording will be available for 30 days.</p>
<p style="font-size: 11px; color: gray;">Copyright 2024 Zoom Video Communications, Inc.</p>`,
    attachments: [],
    isPhishing: true,
    redFlags: [
      "Sender domain is not zoom.us",
      "Vague meeting details that could apply to anyone",
      "Link likely leads to credential harvesting page",
      "Verify with your calendar - were you actually in this meeting?",
      "Check with the supposed host before clicking"
    ],
    legitimateReason: null
  },

  // LEGITIMATE SCENARIOS - Beginner
  {
    title: "Company Newsletter",
    description: "Regular company newsletter from verified internal source",
    difficulty: "Beginner",
    category: "General",
    isActive: true,
    senderName: "Company Communications",
    senderEmail: "communications@yourcompany.com",
    subject: "January Newsletter: Company Updates & Events",
    body: `<p>Hello Team,</p>
<p>Here's what's happening at YourCompany this month:</p>
<h3>Company News</h3>
<ul>
<li>Q4 results exceeded expectations - thank you all!</li>
<li>New cafeteria menu starts February 1st</li>
<li>Reminder: Office closed for President's Day</li>
</ul>
<h3>Upcoming Events</h3>
<ul>
<li>Feb 5: Town Hall Meeting (Building A Auditorium)</li>
<li>Feb 14: Valentine's Day Potluck</li>
</ul>
<p>Have news to share? Contact communications@yourcompany.com</p>
<p>Best,<br>The Communications Team</p>`,
    attachments: [],
    isPhishing: false,
    redFlags: [],
    legitimateReason: "This email is from your verified company domain, contains general information without requesting any action or personal data, and matches regular company communication patterns."
  },
  {
    title: "Calendar Meeting Invitation",
    description: "Standard meeting invitation from a known colleague",
    difficulty: "Beginner",
    category: "General",
    isActive: true,
    senderName: "Sarah Martinez",
    senderEmail: "smartinez@yourcompany.com",
    subject: "Meeting: Q1 Planning Session",
    body: `<p>Hi,</p>
<p>I'd like to invite you to our Q1 planning session.</p>
<p><strong>When:</strong> Tuesday, February 6th at 2:00 PM<br>
<strong>Where:</strong> Conference Room B / Zoom link in calendar invite<br>
<strong>Duration:</strong> 1 hour</p>
<p><strong>Agenda:</strong></p>
<ol>
<li>Review Q4 outcomes</li>
<li>Discuss Q1 priorities</li>
<li>Resource allocation</li>
</ol>
<p>Please confirm your attendance by accepting the calendar invite.</p>
<p>Thanks,<br>Sarah</p>`,
    attachments: ["Q1_Planning_Agenda.pdf"],
    isPhishing: false,
    redFlags: [],
    legitimateReason: "Email is from a colleague at your company domain, contains specific meeting details, references your company calendar system, and doesn't request sensitive information."
  },

  // LEGITIMATE SCENARIOS - Intermediate
  {
    title: "Password Expiration Reminder",
    description: "Legitimate IT notification about password policy",
    difficulty: "Intermediate",
    category: "IT Support",
    isActive: true,
    senderName: "IT Security",
    senderEmail: "it-security@yourcompany.com",
    subject: "Reminder: Your password expires in 14 days",
    body: `<p>Hello,</p>
<p>As part of our security policy, your network password will expire in 14 days.</p>
<p><strong>How to change your password:</strong></p>
<ol>
<li>Press Ctrl+Alt+Delete on your computer</li>
<li>Select "Change a password"</li>
<li>Follow the prompts</li>
</ol>
<p>Or visit the IT Self-Service Portal at <strong>https://selfservice.yourcompany.com</strong> (internal network only)</p>
<p><strong>Password Requirements:</strong></p>
<ul>
<li>Minimum 12 characters</li>
<li>At least one uppercase and lowercase letter</li>
<li>At least one number and special character</li>
<li>Cannot reuse last 10 passwords</li>
</ul>
<p>Questions? Contact the IT Help Desk at ext. 4357 or helpdesk@yourcompany.com</p>
<p>IT Security Team</p>`,
    attachments: [],
    isPhishing: false,
    redFlags: [],
    legitimateReason: "This email is from your company's official IT domain, provides instructions to use secure internal methods (Ctrl+Alt+Delete, internal portal), gives reasonable 14-day notice without extreme urgency, and provides legitimate contact information for verification."
  },
  {
    title: "Order Confirmation from Amazon",
    description: "Legitimate Amazon order confirmation",
    difficulty: "Intermediate",
    category: "E-commerce",
    isActive: true,
    senderName: "Amazon.com",
    senderEmail: "auto-confirm@amazon.com",
    subject: "Your Amazon.com order #112-3456789-0123456",
    body: `<p style="text-align: center;"><img src="#" alt="Amazon" /></p>
<p>Hello,</p>
<p>Thank you for your order. We'll send a confirmation when your items ship.</p>
<p style="background: #f3f3f3; padding: 15px;">
<strong>Order #112-3456789-0123456</strong><br>
Arriving: Friday, February 9
</p>
<p><strong>Shipping to:</strong><br>
John Smith<br>
123 Main Street<br>
Anytown, ST 12345</p>
<p><strong>Order Summary:</strong><br>
USB-C Cable (2-pack) - $12.99<br>
Shipping: FREE (Prime)<br>
<strong>Order Total: $12.99</strong></p>
<p>Track your package or manage your order at <strong>amazon.com/your-orders</strong></p>
<p style="font-size: 11px;">This email was sent from a notification-only address. Please do not reply.</p>`,
    attachments: [],
    isPhishing: false,
    redFlags: [],
    legitimateReason: "This email is from amazon.com (official domain), contains specific order details you can verify in your Amazon account, shows your correct shipping address, and directs you to amazon.com to manage orders rather than clicking links."
  },

  // LEGITIMATE SCENARIOS - Advanced
  {
    title: "Two-Factor Authentication Setup",
    description: "Legitimate 2FA setup notification from your bank",
    difficulty: "Advanced",
    category: "Banking",
    isActive: true,
    senderName: "Wells Fargo Security",
    senderEmail: "alerts@notify.wellsfargo.com",
    subject: "Your Two-Step Verification has been updated",
    body: `<p><img src="#" alt="Wells Fargo" /></p>
<p>Hello JOHN,</p>
<p>Your Two-Step Verification settings were recently updated.</p>
<p><strong>Change Details:</strong></p>
<ul>
<li>New phone number added ending in ****7890</li>
<li>Date: ${new Date().toLocaleDateString()}</li>
<li>Location: San Francisco, CA</li>
</ul>
<p>If you made this change, no action is needed.</p>
<p>If you did not make this change, please sign in to your account at <strong>wellsfargo.com</strong> immediately and review your security settings, or call us at 1-800-869-3557.</p>
<p style="font-size: 11px; color: gray;">Wells Fargo Bank, N.A. Member FDIC<br>
This is an automated message - please do not reply directly.</p>`,
    attachments: [],
    isPhishing: false,
    redFlags: [],
    legitimateReason: "This email is from Wells Fargo's verified notification domain, uses your first name, provides specific details you can verify, directs you to type wellsfargo.com directly (not click a link), and provides the official customer service number for verification."
  },
  {
    title: "Software License Renewal",
    description: "Legitimate renewal notice from software vendor",
    difficulty: "Advanced",
    category: "IT Support",
    isActive: true,
    senderName: "Microsoft Volume Licensing",
    senderEmail: "mslicense@microsoft.com",
    subject: "Action Required: Your Microsoft 365 licenses expire in 30 days",
    body: `<p><img src="#" alt="Microsoft" /></p>
<p>Hello,</p>
<p>Your organization's Microsoft 365 Business licenses are set to expire in 30 days.</p>
<p><strong>License Details:</strong></p>
<table style="border-collapse: collapse; width: 100%;">
<tr style="background: #f5f5f5;"><td style="padding: 8px;">Agreement Number</td><td style="padding: 8px;">12345678</td></tr>
<tr><td style="padding: 8px;">Product</td><td style="padding: 8px;">Microsoft 365 Business Premium</td></tr>
<tr style="background: #f5f5f5;"><td style="padding: 8px;">Quantity</td><td style="padding: 8px;">50 licenses</td></tr>
<tr><td style="padding: 8px;">Expiration Date</td><td style="padding: 8px;">March 15, 2024</td></tr>
</table>
<p>To renew your licenses:</p>
<ol>
<li>Contact your Microsoft account representative</li>
<li>Or sign in to the Microsoft 365 Admin Center at <strong>admin.microsoft.com</strong></li>
</ol>
<p>If you have questions, contact your Microsoft Partner or call 1-800-426-9400.</p>
<p style="font-size: 11px;">Microsoft Corporation, One Microsoft Way, Redmond, WA 98052</p>`,
    attachments: [],
    isPhishing: false,
    redFlags: [],
    legitimateReason: "Email is from microsoft.com official domain, contains specific account details that can be verified, provides 30 days notice (not urgent deadline), directs to official Microsoft admin portal by name, and provides official contact methods."
  }
];

async function main() {
  console.log('🌱 Seeding phishing scenarios...');

  // Clear existing phishing data
  await prisma.phishingAttempt.deleteMany();
  await prisma.phishingScenario.deleteMany();

  console.log('✅ Cleared existing phishing data');

  // Create phishing scenarios
  for (const scenario of phishingScenarios) {
    await prisma.phishingScenario.create({
      data: scenario
    });
  }

  console.log(`✅ Created ${phishingScenarios.length} phishing scenarios`);

  // Summary
  const phishing = phishingScenarios.filter(s => s.isPhishing);
  const legitimate = phishingScenarios.filter(s => !s.isPhishing);

  console.log('\n📊 Summary:');
  console.log(`   Phishing scenarios: ${phishing.length}`);
  console.log(`   Legitimate scenarios: ${legitimate.length}`);
  console.log(`   Beginner: ${phishingScenarios.filter(s => s.difficulty === 'Beginner').length}`);
  console.log(`   Intermediate: ${phishingScenarios.filter(s => s.difficulty === 'Intermediate').length}`);
  console.log(`   Advanced: ${phishingScenarios.filter(s => s.difficulty === 'Advanced').length}`);

  console.log('\n✨ Phishing seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
