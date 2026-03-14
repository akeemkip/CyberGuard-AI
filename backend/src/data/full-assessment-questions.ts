export interface FullAssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

export const FULL_ASSESSMENT_QUESTIONS: FullAssessmentQuestion[] = [
  // Phishing
  {
    id: 1,
    question: "Which of the following is the BEST indicator that an email might be a phishing attempt?",
    options: [
      "The email has images",
      "The sender's address doesn't match the company domain",
      "The email was sent during business hours",
      "The email has a signature"
    ],
    correctAnswer: 1,
    explanation: "Phishing emails often use fake sender addresses that don't match the legitimate company domain. Always verify the sender's email address carefully.",
    topic: "Phishing"
  },
  {
    id: 2,
    question: "You receive an urgent email from your bank asking you to click a link and verify your account. What should you do?",
    options: [
      "Click the link immediately to protect your account",
      "Reply to the email asking for more information",
      "Contact your bank directly using official contact info, not the email link",
      "Forward the email to your friends to warn them"
    ],
    correctAnswer: 2,
    explanation: "Never click links in suspicious emails. Always contact organizations directly using official channels you know are legitimate.",
    topic: "Phishing"
  },
  // Password Security
  {
    id: 3,
    question: "Which password is the MOST secure?",
    options: [
      "Password123!",
      "JohnSmith1990",
      "Tr0ub4dor&3",
      "correct-horse-battery-staple"
    ],
    correctAnswer: 3,
    explanation: "Long passphrases with random words are generally more secure and easier to remember than short complex passwords. Length is more important than complexity.",
    topic: "Password Security"
  },
  {
    id: 4,
    question: "What is the primary purpose of multi-factor authentication (MFA)?",
    options: [
      "To make logging in faster",
      "To add an extra layer of security beyond just a password",
      "To replace passwords entirely",
      "To track user location"
    ],
    correctAnswer: 1,
    explanation: "MFA adds additional verification beyond passwords, significantly reducing the risk of unauthorized access even if a password is compromised.",
    topic: "Password Security"
  },
  // Social Engineering
  {
    id: 5,
    question: "A caller claims to be from IT support and asks for your password to 'fix an issue.' What should you do?",
    options: [
      "Give them the password so they can fix the issue",
      "Ask them to call back later",
      "Refuse and verify their identity through official IT channels",
      "Give them a different password to be safe"
    ],
    correctAnswer: 2,
    explanation: "Legitimate IT support will never ask for your password. Always verify identity through official channels before sharing any information.",
    topic: "Social Engineering"
  },
  {
    id: 6,
    question: "What is 'pretexting' in the context of social engineering?",
    options: [
      "Sending text messages with malware",
      "Creating a fabricated scenario to manipulate someone into giving information",
      "Testing software before release",
      "Encrypting text messages"
    ],
    correctAnswer: 1,
    explanation: "Pretexting involves creating a false scenario or identity to gain trust and extract sensitive information from targets.",
    topic: "Social Engineering"
  },
  // Safe Browsing
  {
    id: 7,
    question: "What does HTTPS indicate about a website?",
    options: [
      "The website is 100% safe and trustworthy",
      "The connection between your browser and the website is encrypted",
      "The website has no viruses",
      "The website is approved by the government"
    ],
    correctAnswer: 1,
    explanation: "HTTPS means the connection is encrypted, but it doesn't guarantee the website itself is safe or legitimate. Malicious sites can also use HTTPS.",
    topic: "Safe Browsing"
  },
  {
    id: 8,
    question: "You see a pop-up saying your computer is infected and to call a number for support. What should you do?",
    options: [
      "Call the number immediately",
      "Download the suggested antivirus software",
      "Close the browser and run your legitimate antivirus software",
      "Enter your credit card to pay for the cleanup"
    ],
    correctAnswer: 2,
    explanation: "These are tech support scams. Close the browser (use Task Manager if needed) and run your legitimate security software. Never call numbers from pop-ups.",
    topic: "Safe Browsing"
  },
  // Data Protection
  {
    id: 9,
    question: "Which of the following is considered Personally Identifiable Information (PII)?",
    options: [
      "Your favorite color",
      "Your Social Security Number",
      "The weather in your city",
      "The name of your pet"
    ],
    correctAnswer: 1,
    explanation: "PII includes any information that can identify a specific individual, such as SSN, full name, address, phone number, and email address.",
    topic: "Data Protection"
  },
  {
    id: 10,
    question: "What is the BEST practice for disposing of old hard drives containing sensitive data?",
    options: [
      "Throw them in the regular trash",
      "Delete all files and recycle them",
      "Physically destroy them or use professional data destruction services",
      "Give them to a friend"
    ],
    correctAnswer: 2,
    explanation: "Simply deleting files doesn't remove data permanently. Physical destruction or professional wiping services ensure data cannot be recovered.",
    topic: "Data Protection"
  },
  // General Security
  {
    id: 11,
    question: "What should you do if you suspect your computer has been compromised?",
    options: [
      "Continue working and hope it goes away",
      "Disconnect from the network and report to IT/security immediately",
      "Try to hack the attacker back",
      "Post about it on social media"
    ],
    correctAnswer: 1,
    explanation: "Immediately disconnect from the network to prevent further damage or data theft, then report to your IT security team for proper incident response.",
    topic: "Incident Response"
  },
  {
    id: 12,
    question: "Which of the following is a sign of a potentially malicious website?",
    options: [
      "The website has a professional design",
      "The URL has misspellings or unusual characters",
      "The website loads quickly",
      "The website has a contact page"
    ],
    correctAnswer: 1,
    explanation: "Malicious sites often use URLs that mimic legitimate sites but with slight misspellings or unusual characters (like g00gle.com instead of google.com).",
    topic: "Safe Browsing"
  },
  {
    id: 13,
    question: "What is ransomware?",
    options: [
      "Software that speeds up your computer",
      "Malware that encrypts your files and demands payment for the decryption key",
      "A type of antivirus software",
      "A secure file storage system"
    ],
    correctAnswer: 1,
    explanation: "Ransomware encrypts victims' files and demands payment (ransom) to restore access. Prevention and backups are the best defense.",
    topic: "Malware"
  },
  {
    id: 14,
    question: "Why is it important to keep software and operating systems updated?",
    options: [
      "Updates make your computer look nicer",
      "Updates fix security vulnerabilities that attackers could exploit",
      "Updates are just marketing tactics",
      "Updates are only needed once a year"
    ],
    correctAnswer: 1,
    explanation: "Software updates often include patches for security vulnerabilities. Keeping systems updated is one of the most effective security practices.",
    topic: "General Security"
  },
  {
    id: 15,
    question: "What is the purpose of a VPN (Virtual Private Network)?",
    options: [
      "To make your internet faster",
      "To encrypt your internet traffic and hide your IP address",
      "To download files faster",
      "To block all advertisements"
    ],
    correctAnswer: 1,
    explanation: "VPNs encrypt your internet traffic and mask your IP address, providing privacy and security, especially on public networks.",
    topic: "Network Security"
  },
  {
    id: 16,
    question: "What is two-factor authentication (2FA)?",
    options: [
      "Using two different passwords",
      "Authentication using two independent methods of verification",
      "Logging in twice",
      "Having two user accounts"
    ],
    correctAnswer: 1,
    explanation: "2FA requires two different forms of verification (e.g., password + SMS code), making accounts much more secure than password-only authentication.",
    topic: "Password Security"
  },
  {
    id: 17,
    question: "What should you do if you receive an email with an unexpected attachment?",
    options: [
      "Open it immediately to see what it is",
      "Download it to scan with antivirus",
      "Contact the sender through a different channel to verify before opening",
      "Forward it to everyone to warn them"
    ],
    correctAnswer: 2,
    explanation: "Never open unexpected attachments. Verify with the sender through a separate communication method (phone call, text) before opening any suspicious attachments.",
    topic: "Phishing"
  },
  {
    id: 18,
    question: "What is a brute force attack?",
    options: [
      "Physically destroying a computer",
      "Trying many passwords systematically until finding the correct one",
      "Using excessive force to open a locked file",
      "Overloading a server with traffic"
    ],
    correctAnswer: 1,
    explanation: "Brute force attacks try numerous password combinations systematically. Strong, long passwords and account lockout policies help defend against these attacks.",
    topic: "Password Security"
  },
  {
    id: 19,
    question: "What is spear phishing?",
    options: [
      "Phishing attacks that target fish populations",
      "Highly targeted phishing attacks aimed at specific individuals or organizations",
      "Phishing using spear-shaped icons",
      "A type of fishing equipment"
    ],
    correctAnswer: 1,
    explanation: "Spear phishing is a targeted attack customized for specific individuals, often using personal information to appear more legitimate than generic phishing.",
    topic: "Phishing"
  },
  {
    id: 20,
    question: "What does 'encryption' mean?",
    options: [
      "Deleting data permanently",
      "Converting data into a coded format to prevent unauthorized access",
      "Copying data to multiple locations",
      "Compressing data to save space"
    ],
    correctAnswer: 1,
    explanation: "Encryption converts readable data into coded format that can only be decoded with the correct key, protecting data confidentiality.",
    topic: "Data Protection"
  },
  {
    id: 21,
    question: "What is a firewall?",
    options: [
      "A physical wall that prevents fire spread",
      "A security system that monitors and controls network traffic",
      "Software that removes viruses",
      "A backup system for important files"
    ],
    correctAnswer: 1,
    explanation: "A firewall monitors incoming and outgoing network traffic and blocks or allows traffic based on security rules, acting as a barrier between trusted and untrusted networks.",
    topic: "Network Security"
  },
  {
    id: 22,
    question: "What should you do before disposing of a smartphone?",
    options: [
      "Just delete all the apps",
      "Perform a factory reset and remove SIM/SD cards",
      "Give it away immediately",
      "Throw it in regular trash"
    ],
    correctAnswer: 1,
    explanation: "Factory reset the device, remove SIM and SD cards, and sign out of all accounts before disposing. Consider using secure data wiping tools for sensitive data.",
    topic: "Data Protection"
  },
  {
    id: 23,
    question: "What is malware?",
    options: [
      "Mail that arrives late",
      "Malicious software designed to harm or exploit devices",
      "Male-specific software",
      "Software for shopping malls"
    ],
    correctAnswer: 1,
    explanation: "Malware is any software intentionally designed to cause damage, steal data, or gain unauthorized access to systems. Types include viruses, trojans, ransomware, and spyware.",
    topic: "Malware"
  },
  {
    id: 24,
    question: "Why should you be cautious when using public Wi-Fi?",
    options: [
      "It's always slower than home Wi-Fi",
      "Attackers can intercept unencrypted data on public networks",
      "Public Wi-Fi is illegal",
      "It costs more money"
    ],
    correctAnswer: 1,
    explanation: "Public Wi-Fi networks are often unencrypted, making it easier for attackers to intercept your data. Use VPNs and avoid sensitive transactions on public networks.",
    topic: "Network Security"
  },
  {
    id: 25,
    question: "What is a SQL injection attack?",
    options: [
      "Injecting medicine with a needle",
      "Inserting malicious SQL code into application inputs to manipulate databases",
      "A medical procedure",
      "A way to speed up databases"
    ],
    correctAnswer: 1,
    explanation: "SQL injection exploits vulnerabilities in web applications by inserting malicious SQL commands, potentially allowing attackers to access, modify, or delete database information.",
    topic: "Web Security"
  },
  {
    id: 26,
    question: "What does it mean to 'patch' software?",
    options: [
      "To sew torn software together",
      "To update software to fix security vulnerabilities or bugs",
      "To delete unnecessary programs",
      "To make software work slower"
    ],
    correctAnswer: 1,
    explanation: "Patching means applying updates that fix security vulnerabilities, bugs, or add improvements. Regular patching is critical for maintaining security.",
    topic: "General Security"
  },
  {
    id: 27,
    question: "What is the principle of 'least privilege'?",
    options: [
      "Giving users only the minimum access rights needed for their role",
      "Having the least expensive security measures",
      "Using the simplest passwords possible",
      "Granting everyone administrator access"
    ],
    correctAnswer: 0,
    explanation: "Least privilege means users should only have the minimum level of access necessary to perform their job functions, reducing potential damage from accidents or attacks.",
    topic: "Access Control"
  },
  {
    id: 28,
    question: "What is a DDoS attack?",
    options: [
      "Distributed Denial of Service - overwhelming a system with traffic from multiple sources",
      "Distributed Data Of Service",
      "Direct Denial Of Security",
      "A new type of operating system"
    ],
    correctAnswer: 0,
    explanation: "DDoS attacks flood a target with traffic from many sources simultaneously, making services unavailable to legitimate users by overwhelming the system's capacity.",
    topic: "Network Security"
  },
  {
    id: 29,
    question: "What is 'shoulder surfing' in cybersecurity?",
    options: [
      "Surfing the internet over someone's shoulder",
      "Observing someone's screen or keyboard to steal sensitive information",
      "A water sport",
      "A type of phishing attack"
    ],
    correctAnswer: 1,
    explanation: "Shoulder surfing is watching someone enter passwords, PINs, or view sensitive information. Use privacy screens and be aware of your surroundings when entering credentials.",
    topic: "Social Engineering"
  },
  {
    id: 30,
    question: "What is the purpose of backing up data?",
    options: [
      "To make computers run faster",
      "To create copies of data that can be restored if original data is lost or corrupted",
      "To share data with others",
      "To delete old files"
    ],
    correctAnswer: 1,
    explanation: "Regular backups ensure you can recover important data after hardware failure, ransomware attacks, accidental deletion, or other data loss events. Follow the 3-2-1 backup rule.",
    topic: "Data Protection"
  }
];

// Passing score percentage
export const FULL_ASSESSMENT_PASSING_SCORE = 70;

// Build a lookup map for quick answer validation
export const QUESTION_ANSWER_MAP = new Map<number, number>(
  FULL_ASSESSMENT_QUESTIONS.map(q => [q.id, q.correctAnswer])
);
