import React from 'react';
import { Shield, BookOpen, Target, Award, ArrowRight, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useTheme } from './theme-provider';
import { usePlatformSettings } from '../context/PlatformSettingsContext';
import { PlatformLogo } from './PlatformLogo';

interface WelcomePageProps {
  onStartAssessment: () => void;
  onLogout: () => void;
  userName: string;
}

const WelcomeCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description
}) => (
  <Card className="p-6">
    <div className="flex items-start gap-4">
      <div className="p-3 bg-primary/10 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  </Card>
);

export const WelcomePage: React.FC<WelcomePageProps> = ({ onStartAssessment, onLogout, userName }) => {
  const { theme, toggleTheme } = useTheme();
  const { settings: platformSettings } = usePlatformSettings();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlatformLogo className="w-10 h-10" iconClassName="w-6 h-6" />
            <span className="text-xl font-semibold">{platformSettings.platformName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-full">
              <Shield className="h-16 w-16 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Welcome to {platformSettings.platformName}, {userName}!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your journey to becoming a cybersecurity expert starts here. Let's begin by assessing your current knowledge.
          </p>
        </div>

        {/* What to Expect */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Target className="h-6 w-6 mr-2 text-primary" />
            What to Expect
          </h2>
          <div className="space-y-6">
            <WelcomeCard
              icon={<BookOpen className="h-6 w-6 text-primary" />}
              title="Quick Skills Assessment"
              description="We'll ask you 6 questions covering key cybersecurity topics. This helps us understand your starting point and track your progress."
            />
            <WelcomeCard
              icon={<Shield className="h-6 w-6 text-success" />}
              title="Personalized Learning Path"
              description="Based on your responses, we'll guide you through courses tailored to strengthen your cybersecurity knowledge."
            />
            <WelcomeCard
              icon={<Award className="h-6 w-6 text-accent" />}
              title="Track Your Growth"
              description="After completing the training, you'll take a comprehensive assessment to measure your improvement and earn certificates."
            />
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" onClick={onStartAssessment} className="text-lg px-8 py-6">
            Take Intro Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Takes approximately 5 minutes - 6 questions
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-primary/5 border border-primary/20 rounded-lg px-6 py-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> This assessment is not graded. It's designed to help us understand your current knowledge level so we can provide the best learning experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
