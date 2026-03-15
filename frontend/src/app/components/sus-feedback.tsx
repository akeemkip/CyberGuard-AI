import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Shield,
  Moon,
  Sun,
  Book,
  MessageSquare,
  Menu,
  X,
  Loader2,
  ChevronLeft,
  CheckCircle2,
  Star,
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useAuth } from "../context/AuthContext";
import { usePlatformSettings } from "../context/PlatformSettingsContext";
import { PlatformLogo } from "./PlatformLogo";
import { UserProfileDropdown } from "./user-profile-dropdown";
import { toast } from "sonner";
import {
  getActiveSurvey,
  getFeedbackStatus,
  submitFeedback,
  SusSurvey,
  FeedbackAnswer,
} from "../services/feedback.service";

interface SusFeedbackProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const LIKERT_LABELS = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

function getSusInterpretation(score: number): { label: string; color: string; description: string } {
  if (score >= 81) return { label: "Excellent", color: "text-emerald-600", description: "You find the platform highly usable!" };
  if (score >= 69) return { label: "Good", color: "text-green-600", description: "You have a positive experience with the platform." };
  if (score >= 51) return { label: "Average", color: "text-yellow-600", description: "There's room for improvement in your experience." };
  if (score >= 26) return { label: "Below Average", color: "text-orange-600", description: "We'll work on making things better for you." };
  return { label: "Poor", color: "text-red-600", description: "We appreciate your honesty — we'll improve." };
}

export function SusFeedback({ onNavigate, onLogout }: SusFeedbackProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { settings: platformSettings } = usePlatformSettings();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [survey, setSurvey] = useState<SusSurvey | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [susScore, setSusScore] = useState<number | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [surveyData, statusData] = await Promise.all([
          getActiveSurvey(),
          getFeedbackStatus(),
        ]);
        setSurvey(surveyData.survey);
        setAlreadySubmitted(statusData.hasSubmitted);
      } catch (error) {
        console.error("Error fetching survey:", error);
        toast.error("Failed to load feedback survey");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRating = (questionId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [questionId]: rating }));
  };

  const allAnswered = survey ? survey.questions.every((q) => ratings[q.id] !== undefined) : false;

  const handleSubmit = async () => {
    if (!survey || !allAnswered) return;
    try {
      setIsSubmitting(true);
      const answers: FeedbackAnswer[] = survey.questions.map((q) => ({
        questionId: q.id,
        rating: ratings[q.id],
      }));
      const result = await submitFeedback(survey.id, answers);
      setSusScore(result.susScore);
      setSubmitted(true);
      toast.success("Thank you for your feedback!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = user?.firstName || "Student";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("student-dashboard")}>
            <PlatformLogo size="sm" />
            <span className="text-lg font-semibold">{platformSettings?.platformName || "CyberGuard AI"}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => onNavigate("student-dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </button>
            <button onClick={() => onNavigate("course-catalog")} className="text-muted-foreground hover:text-foreground transition-colors">
              Courses
            </button>
            <button onClick={() => onNavigate("ai-chat")} className="text-muted-foreground hover:text-foreground transition-colors">
              AI Assistant
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)} aria-label="Toggle menu">
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <UserProfileDropdown onLogout={onLogout} onNavigate={onNavigate} />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute top-16 left-0 right-0 bg-card border-b shadow-lg p-4" onClick={(e) => e.stopPropagation()}>
            <nav className="flex flex-col gap-2">
              <button onClick={() => { setShowMobileMenu(false); onNavigate("student-dashboard"); }} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                <Shield className="w-5 h-5" /> Dashboard
              </button>
              <button onClick={() => { setShowMobileMenu(false); onNavigate("course-catalog"); }} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                <Book className="w-5 h-5" /> Courses
              </button>
              <button onClick={() => { setShowMobileMenu(false); onNavigate("ai-chat"); }} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                <MessageSquare className="w-5 h-5" /> AI Assistant
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back button */}
        <Button variant="ghost" className="mb-6 -ml-2" onClick={() => onNavigate("student-dashboard")}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Button>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !survey ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No feedback survey is currently available.</p>
          </Card>
        ) : submitted && susScore !== null ? (
          /* Thank you screen */
          <Card className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You, {displayName}!</h2>
            <p className="text-muted-foreground mb-6">Your feedback helps us improve the platform for everyone.</p>

            <div className="bg-muted/50 rounded-xl p-6 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Your Usability Score</p>
              <p className="text-4xl font-bold mb-1">{susScore}<span className="text-lg text-muted-foreground">/100</span></p>
              {(() => {
                const interp = getSusInterpretation(susScore);
                return (
                  <>
                    <p className={`font-semibold ${interp.color}`}>{interp.label}</p>
                    <p className="text-sm text-muted-foreground mt-1">{interp.description}</p>
                  </>
                );
              })()}
            </div>

            <Button onClick={() => onNavigate("student-dashboard")} className="w-full">
              Return to Dashboard
            </Button>
          </Card>
        ) : (
          /* Survey form */
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">{survey.title}</h1>
              {survey.description && (
                <p className="text-muted-foreground">{survey.description}</p>
              )}
              {alreadySubmitted && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    You've already submitted feedback. Submitting again will record an updated response.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {survey.questions.map((question, index) => (
                <Card key={question.id} className="p-6">
                  <p className="font-medium mb-4">
                    <span className="text-primary mr-2">{index + 1}.</span>
                    {question.question}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {LIKERT_LABELS.map((label, i) => {
                      const value = i + 1;
                      const isSelected = ratings[question.id] === value;
                      return (
                        <button
                          key={value}
                          onClick={() => handleRating(question.id, value)}
                          className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-sm"
                              : "border-transparent bg-muted/50 hover:bg-muted hover:border-muted-foreground/20"
                          }`}
                        >
                          <div className="flex gap-0.5">
                            {Array.from({ length: value }, (_, s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  isSelected ? "text-primary fill-primary" : "text-muted-foreground/40"
                                }`}
                              />
                            ))}
                          </div>
                          <span className={`text-xs text-center leading-tight ${
                            isSelected ? "text-primary font-medium" : "text-muted-foreground"
                          }`}>
                            {label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={() => onNavigate("student-dashboard")} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              {Object.keys(ratings).length} of {survey.questions.length} questions answered
            </p>
          </>
        )}
      </div>
    </div>
  );
}
