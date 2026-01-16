import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Shield,
  Moon,
  Sun,
  ClipboardCheck,
  ChevronLeft,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Target,
  Clock,
  AlertCircle,
  Timer,
  X,
  Loader2
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { UserProfileDropdown } from "./user-profile-dropdown";
import { toast } from "sonner";

interface AssessmentsPageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

interface ShuffledQuestion extends Question {
  shuffledOptions: string[];
  shuffledCorrectAnswer: number;
}

interface AssessmentResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  answers: { questionId: number; userAnswer: number; isCorrect: boolean }[];
}

// Comprehensive cybersecurity assessment questions
const assessmentQuestions: Question[] = [
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
  // Additional questions (16-30)
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

// Helper function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper function to shuffle question options
const shuffleQuestionOptions = (question: Question): ShuffledQuestion => {
  const indexMap = question.options.map((_, index) => index);
  const shuffledIndexes = shuffleArray(indexMap);
  const shuffledOptions = shuffledIndexes.map((index) => question.options[index]);
  const shuffledCorrectAnswer = shuffledIndexes.indexOf(question.correctAnswer);

  return {
    ...question,
    shuffledOptions,
    shuffledCorrectAnswer
  };
};

// Timer duration in seconds (25 minutes)
const ASSESSMENT_DURATION = 25 * 60;

export function AssessmentsPage({ onNavigate, onLogout }: AssessmentsPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(ASSESSMENT_DURATION);
  const [timerExpired, setTimerExpired] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const totalQuestions = shuffledQuestions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Initialize shuffled questions when assessment starts
  useEffect(() => {
    if (assessmentStarted && shuffledQuestions.length === 0) {
      const shuffled = shuffleArray(assessmentQuestions).map(shuffleQuestionOptions);
      setShuffledQuestions(shuffled);
      setTimeRemaining(ASSESSMENT_DURATION);
      setTimerExpired(false);
    }
  }, [assessmentStarted]);

  // Timer countdown
  useEffect(() => {
    if (!assessmentStarted || result || timeRemaining <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerExpired(true);
          toast.error("Time's up! Assessment auto-submitted.");
          // Auto-submit when time expires
          setTimeout(() => handleSubmit(true), 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assessmentStarted, result, timeRemaining]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if time is running low (less than 5 minutes)
  const isTimeLow = timeRemaining < 5 * 60 && timeRemaining > 0;
  const isTimeCritical = timeRemaining < 2 * 60 && timeRemaining > 0;

  const handleAnswerSelect = (optionIndex: number) => {
    if (!currentQuestion) return;
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmit = (isTimerExpired = false) => {
    const results = shuffledQuestions.map((q) => ({
      questionId: q.id,
      userAnswer: answers[q.id] ?? -1,
      isCorrect: (answers[q.id] ?? -1) === q.shuffledCorrectAnswer
    }));

    const correctCount = results.filter((r) => r.isCorrect).length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    setResult({
      score: correctCount,
      totalQuestions,
      percentage,
      passed: isTimerExpired ? false : percentage >= 70,
      answers: results
    });

    if (isTimerExpired) {
      toast.error("Assessment failed - Time expired!");
    }
  };

  const handleQuitAssessment = () => {
    toast.info("Assessment cancelled");
    setAssessmentStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setShowExplanation(false);
    setShuffledQuestions([]);
    setTimeRemaining(ASSESSMENT_DURATION);
    setTimerExpired(false);
    setShowQuitDialog(false);
  };

  const handleRetake = () => {
    setAssessmentStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setShowExplanation(false);
    setShuffledQuestions([]);
    setTimeRemaining(ASSESSMENT_DURATION);
    setTimerExpired(false);
    setShowQuitDialog(false);
  };

  const allQuestionsAnswered = Object.keys(answers).length === totalQuestions;

  // Landing page
  if (!assessmentStarted && !result) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => onNavigate("student-dashboard")}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold">CyberGuard AI</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              <UserProfileDropdown onLogout={onLogout} onNavigate={onNavigate} />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ClipboardCheck className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Cybersecurity Skills Assessment</h1>
              <p className="text-muted-foreground">
                Test your cybersecurity knowledge across multiple topics
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card className="p-4 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">30</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </Card>
              <Card className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold">25</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </Card>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-3">Topics Covered:</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Phishing Detection</Badge>
                <Badge variant="outline">Password Security</Badge>
                <Badge variant="outline">Social Engineering</Badge>
                <Badge variant="outline">Safe Browsing</Badge>
                <Badge variant="outline">Data Protection</Badge>
                <Badge variant="outline">Malware Awareness</Badge>
                <Badge variant="outline">Network Security</Badge>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Assessment Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You need 70% or higher to pass</li>
                    <li>Questions and answers are randomized each time</li>
                    <li><strong className="text-warning">You have 25 minutes to complete the assessment</strong></li>
                    <li>Assessment auto-submits when time expires (automatic fail)</li>
                    <li>You can review explanations after answering</li>
                    <li>You can retake the assessment anytime</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={() => setAssessmentStarted(true)}>
              <Play className="w-5 h-5 mr-2" />
              Start Assessment
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Results page
  if (result) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => onNavigate("student-dashboard")}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold">Assessment Results</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              <UserProfileDropdown onLogout={onLogout} onNavigate={onNavigate} />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Card className={`max-w-2xl mx-auto p-8 mb-8 ${
            result.passed
              ? "bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
              : "bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20"
          }`}>
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                result.passed ? "bg-green-500/20" : "bg-red-500/20"
              }`}>
                {result.passed ? (
                  <Trophy className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {result.passed ? "Congratulations!" : "Keep Learning!"}
              </h1>
              <p className={`text-5xl font-bold mb-2 ${
                result.passed ? "text-green-600" : "text-red-600"
              }`}>
                {result.percentage}%
              </p>
              <p className="text-muted-foreground mb-4">
                You answered {result.score} out of {result.totalQuestions} questions correctly
              </p>
              {timerExpired && (
                <p className="text-sm text-destructive font-medium mb-2">
                  ⏱️ Assessment failed: Time expired
                </p>
              )}
              {!result.passed && !timerExpired && (
                <p className="text-sm text-muted-foreground">
                  You need 70% to pass. Review the topics below and try again!
                </p>
              )}
            </div>
          </Card>

          <div className="max-w-2xl mx-auto space-y-4 mb-8">
            <h2 className="font-semibold text-lg">Question Review</h2>
            {shuffledQuestions.map((q, index) => {
              const userAnswer = result.answers.find((a) => a.questionId === q.id);
              const isCorrect = userAnswer?.isCorrect;
              const userAnswerText = userAnswer?.userAnswer !== undefined && userAnswer.userAnswer >= 0
                ? q.shuffledOptions[userAnswer.userAnswer]
                : "Not answered";

              return (
                <Card key={q.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{q.topic}</Badge>
                      </div>
                      <p className="font-medium mb-2">
                        {index + 1}. {q.question}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Your answer:{" "}
                        <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                          {userAnswerText}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600">
                          Correct answer: {q.shuffledOptions[q.shuffledCorrectAnswer]}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-2 bg-muted/50 p-2 rounded">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="max-w-2xl mx-auto flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => onNavigate("student-dashboard")}>
              Back to Dashboard
            </Button>
            <Button className="flex-1" onClick={handleRetake}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state while questions are being shuffled
  if (assessmentStarted && shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Preparing your assessment...</p>
        </Card>
      </div>
    );
  }

  // Assessment in progress
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuitDialog(true)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="w-4 h-4 mr-2" />
                Quit Assessment
              </Button>
              <div className="border-l border-border h-8" />
              <div>
                <h1 className="font-semibold">Skills Assessment</h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Timer Display */}
              <Card className={`px-4 py-2 ${
                isTimeCritical
                  ? "bg-destructive/10 border-destructive animate-pulse"
                  : isTimeLow
                  ? "bg-warning/10 border-warning"
                  : "bg-muted"
              }`}>
                <div className="flex items-center gap-2">
                  <Timer className={`w-4 h-4 ${
                    isTimeCritical ? "text-destructive" : isTimeLow ? "text-warning" : "text-muted-foreground"
                  }`} />
                  <span className={`font-mono font-semibold ${
                    isTimeCritical ? "text-destructive" : isTimeLow ? "text-warning" : ""
                  }`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </Card>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              <UserProfileDropdown onLogout={onLogout} onNavigate={onNavigate} />
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-8">
          <Badge variant="outline" className="mb-4">{currentQuestion.topic}</Badge>
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3 mb-6">
            {currentQuestion.shuffledOptions.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;
              const isCorrect = index === currentQuestion.shuffledCorrectAnswer;
              const showCorrect = showExplanation && isCorrect;
              const showWrong = showExplanation && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => !showExplanation && handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    showCorrect
                      ? "border-green-500 bg-green-500/10"
                      : showWrong
                      ? "border-red-500 bg-red-500/10"
                      : isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      showCorrect
                        ? "border-green-500 bg-green-500 text-white"
                        : showWrong
                        ? "border-red-500 bg-red-500 text-white"
                        : isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground"
                    }`}>
                      {showCorrect && <CheckCircle2 className="w-4 h-4" />}
                      {showWrong && <XCircle className="w-4 h-4" />}
                      {!showExplanation && isSelected && <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium mb-1">Explanation:</p>
              <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
            </div>
          )}

          {answers[currentQuestion.id] !== undefined && !showExplanation && (
            <Button variant="outline" className="w-full mb-4" onClick={() => setShowExplanation(true)}>
              Show Explanation
            </Button>
          )}

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex-1"
            >
              Previous
            </Button>
            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
                className="flex-1"
              >
                Submit Assessment
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex-1">
                Next
              </Button>
            )}
          </div>

          {!allQuestionsAnswered && currentQuestionIndex === totalQuestions - 1 && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Please answer all questions before submitting
            </p>
          )}
        </Card>
      </div>

      {/* Quit Assessment Confirmation Dialog */}
      <AlertDialog open={showQuitDialog} onOpenChange={setShowQuitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quit Assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to quit the assessment? Your progress will be lost and you'll need to start over.
              {Object.keys(answers).length > 0 && (
                <span className="block mt-2 font-medium text-foreground">
                  You've answered {Object.keys(answers).length} of {totalQuestions} questions.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Assessment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleQuitAssessment}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Quit Assessment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
