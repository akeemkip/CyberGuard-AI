import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Shield, ChevronLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

interface CookiePolicyPageProps {
  onNavigate: (page: string) => void;
}

export function CookiePolicyPage({ onNavigate }: CookiePolicyPageProps) {
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
          <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">What Are Cookies</h2>
              <p className="text-muted-foreground">
                Cookies are small text files that are placed on your computer or mobile device when you visit a
                website. They are widely used to make websites work more efficiently and provide information to
                the owners of the site. This policy explains how CyberGuard AI uses cookies and similar technologies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">How We Use Cookies</h2>
              <p className="text-muted-foreground mb-3">
                CyberGuard AI uses cookies and local storage for the following purposes:
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Essential Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Required for the platform to function properly. These include authentication tokens that keep
                    you logged in and session data that maintains your current state within the application.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Preference Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Remember your settings and preferences, such as your chosen theme (light or dark mode) and
                    language preferences, to provide a personalized experience.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Analytics Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how users interact with our platform, which pages are most popular, and
                    how we can improve the user experience. This data is aggregated and anonymized.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Types of Storage</h2>
              <p className="text-muted-foreground mb-3">
                In addition to cookies, we use browser storage technologies:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Local Storage:</strong> Stores your authentication token, user preferences, and navigation state persistently until you log out or clear your browser data.</li>
                <li><strong>Session Storage:</strong> Stores temporary data that is automatically cleared when you close your browser tab.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Third-Party Cookies</h2>
              <p className="text-muted-foreground">
                We do not use third-party advertising cookies. Any third-party services we integrate with
                (such as analytics providers) are carefully selected and bound by strict data protection agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Managing Cookies</h2>
              <p className="text-muted-foreground mb-3">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Browser settings allow you to view, manage, and delete cookies</li>
                <li>You can set your browser to block cookies, though this may affect functionality</li>
                <li>Logging out of CyberGuard AI will clear your authentication data</li>
                <li>Clearing site data in your browser settings will remove all stored information</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Please note that disabling essential cookies may prevent you from using certain features of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Updates to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements.
                We encourage you to periodically review this page for the latest information on our cookie practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our use of cookies, please contact us at:{" "}
                <a href="mailto:privacy@cyberguard.ai" className="text-primary hover:underline">
                  privacy@cyberguard.ai
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
