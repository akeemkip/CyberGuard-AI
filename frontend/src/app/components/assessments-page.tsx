import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
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
  AlertCircle
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { UserProfileDropdown } from "./user-profile-dropdown";

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
  }
];

export function AssessmentsPage({ onNavigate, onLogout }: AssessmentsPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const totalQuestions = assessmentQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (optionIndex: number) => {
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

  const handleSubmit = () => {
    const results = assessmentQuestions.map((q) => ({
      questionId: q.id,
      userAnswer: answers[q.id] ?? -1,
      isCorrect: answers[q.id] === q.correctAnswer
    }));

    const correctCount = results.filter((r) => r.isCorrect).length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    setResult({
      score: correctCount,
      totalQuestions,
      percentage,
      passed: percentage >= 70,
      answers: results
    });
  };

  const handleRetake = () => {
    setAssessmentStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setShowExplanation(false);
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
                <div className="text-2xl font-bold">{totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </Card>
              <Card className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold">~15</div>
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
                    <li>You can review explanations after answering</li>
                    <li>Take your time - there's no time limit</li>
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
              {!result.passed && (
                <p className="text-sm text-muted-foreground">
                  You need 70% to pass. Review the topics below and try again!
                </p>
              )}
            </div>
          </Card>

          <div className="max-w-2xl mx-auto space-y-4 mb-8">
            <h2 className="font-semibold text-lg">Question Review</h2>
            {assessmentQuestions.map((q, index) => {
              const userAnswer = result.answers.find((a) => a.questionId === q.id);
              const isCorrect = userAnswer?.isCorrect;

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
                          {q.options[userAnswer?.userAnswer ?? 0] || "Not answered"}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600">
                          Correct answer: {q.options[q.correctAnswer]}
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

  // Assessment in progress
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setAssessmentStarted(false)}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-semibold">Skills Assessment</h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;
              const isCorrect = index === currentQuestion.correctAnswer;
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
    </div>
  );
}
