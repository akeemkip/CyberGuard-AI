import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Shield, ChevronLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

interface TermsOfServicePageProps {
  onNavigate: (page: string) => void;
}

export function TermsOfServicePage({ onNavigate }: TermsOfServicePageProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">CyberGuard AI</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using CyberGuard AI, you agree to be bound by these Terms of Service and all
                applicable laws and regulations. If you do not agree with any of these terms, you are prohibited
                from using or accessing this platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Use License</h2>
              <p className="text-muted-foreground mb-3">
                Permission is granted to temporarily access and use CyberGuard AI for personal, non-commercial
                educational purposes. This license does not include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Modifying or copying platform materials</li>
                <li>Using materials for commercial purposes</li>
                <li>Attempting to reverse engineer any software</li>
                <li>Removing any copyright or proprietary notations</li>
                <li>Transferring materials to another person or organization</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">User Accounts</h2>
              <p className="text-muted-foreground">
                When you create an account with us, you must provide accurate and complete information. You are
                responsible for safeguarding your password and for all activities that occur under your account.
                You agree to notify us immediately of any unauthorized access or use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Acceptable Use</h2>
              <p className="text-muted-foreground mb-3">
                You agree not to use CyberGuard AI to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Attempt to gain unauthorized access to the platform</li>
                <li>Interfere with or disrupt the platform's security features</li>
                <li>Upload malicious code or harmful content</li>
                <li>Harass, abuse, or harm other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Educational Content</h2>
              <p className="text-muted-foreground">
                All cybersecurity training content, courses, quizzes, and simulations are provided for educational
                purposes. While we strive for accuracy, the content should not be considered professional security
                certification. Users should apply learned concepts responsibly and ethically.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Intellectual Property</h2>
              <p className="text-muted-foreground">
                The platform, including its original content, features, and functionality, is owned by CyberGuard AI
                and is protected by international copyright, trademark, and other intellectual property laws. Our
                trademarks may not be used without prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                CyberGuard AI shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages resulting from your use of or inability to use the platform. This includes damages for loss
                of profits, data, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we
                will provide at least 30 days' notice prior to any new terms taking effect. Continued use of the
                platform after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at:{" "}
                <a href="mailto:legal@cyberguard.ai" className="text-primary hover:underline">
                  legal@cyberguard.ai
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <Button variant="outline" onClick={() => onNavigate("landing")}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
