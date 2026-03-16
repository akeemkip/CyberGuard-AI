import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Shield, CheckCircle2, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function RegisterSuccessPage({
  onNavigate
}: {
  onNavigate: (page: string) => void;
}) {
  const { user } = useAuth();
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const firstName = localStorage.getItem('newUserFirstName') || user?.firstName || 'there';

  // Show countdown after animation plays
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCountdown(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Countdown and redirect
  useEffect(() => {
    if (!showCountdown) return;

    if (countdown <= 0) {
      localStorage.removeItem('newUserFirstName');
      onNavigate("welcome");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showCountdown, countdown, onNavigate]);

  // Clean up stored first name when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem('newUserFirstName');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">CyberGuard AI</span>
          </div>
        </div>
      </header>

      {/* Success Animation */}
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md p-8">
          <div className="text-center py-8 space-y-6">
            {/* Animated Success Icon */}
            <div className="relative inline-block">
              {/* Pulsing background circles */}
              <div className="absolute inset-0 w-24 h-24 mx-auto">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                <div className="absolute inset-0 bg-green-500/10 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              </div>

              {/* Main icon container */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-full flex items-center justify-center mx-auto animate-scale-in shadow-lg shadow-green-500/20">
                <div className="absolute inset-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-white animate-check-bounce" />
                </div>
                {/* Sparkle effects */}
                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-yellow-400 animate-sparkle" />
                <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-yellow-300 animate-sparkle" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>

            {/* Success message */}
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Account Created!
              </h2>
              <p className="text-lg text-muted-foreground">
                Welcome to CyberGuard AI, <span className="font-semibold text-foreground">{firstName}</span>!
              </p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Your cybersecurity learning journey starts now. Let's begin with a quick skills assessment to personalize your experience.
              </p>
            </div>

            {/* Countdown */}
            {showCountdown ? (
              <div className="animate-fade-in-up">
                <p className="text-sm text-muted-foreground">
                  Redirecting in <span className="font-bold text-primary text-lg">{countdown}</span>
                </p>
              </div>
            ) : (
              <div className="h-11 flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
