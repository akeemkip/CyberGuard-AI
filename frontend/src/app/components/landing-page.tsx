import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Shield, Brain, Target, Users, Lock, TrendingUp, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "./theme-provider";

export function LandingPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">CyberGuard AI</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection("features")} className="text-muted-foreground hover:text-foreground transition-colors">Features</button>
            <button onClick={() => scrollToSection("how-it-works")} className="text-muted-foreground hover:text-foreground transition-colors">How It Works</button>
            <button onClick={() => scrollToSection("pricing")} className="text-muted-foreground hover:text-foreground transition-colors">Pricing</button>
            <Button variant="outline" onClick={() => onNavigate("login")}>Log In</Button>
            <Button onClick={() => onNavigate("register")}>Get Started</Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <button onClick={() => scrollToSection("features")} className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors">Features</button>
              <button onClick={() => scrollToSection("how-it-works")} className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors">How It Works</button>
              <button onClick={() => scrollToSection("pricing")} className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors">Pricing</button>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => onNavigate("login")} className="w-full">Log In</Button>
                <Button onClick={() => onNavigate("register")} className="w-full">Get Started</Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Adaptive Learning</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Master Cybersecurity<br />with Intelligent Training
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your team's security awareness with adaptive AI-driven training, 
              realistic phishing simulations, and comprehensive analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" onClick={() => onNavigate("register")}>
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => scrollToSection("features")}>
                Learn More
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Threat Detection</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Users Trained</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build a security-first culture
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Driven Adaptation</h3>
              <p className="text-muted-foreground">
                Personalized learning paths that adapt to each user's skill level and progress in real-time.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phishing Simulations</h3>
              <p className="text-muted-foreground">
                Realistic phishing scenarios that test and train your team to identify threats.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-chart-3" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Comprehensive dashboards and reports to track progress and measure ROI.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Labs</h3>
              <p className="text-muted-foreground">
                Hands-on exercises in safe environments to practice real-world scenarios.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Management</h3>
              <p className="text-muted-foreground">
                Powerful admin tools to manage users, assign courses, and track team performance.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Compliant</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with compliance tracking for industry standards.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, effective, and powered by AI
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">1</div>
              <h3 className="text-lg font-semibold mb-2">Baseline Assessment</h3>
              <p className="text-muted-foreground">Initial evaluation to understand current knowledge level</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">2</div>
              <h3 className="text-lg font-semibold mb-2">Adaptive Learning</h3>
              <p className="text-muted-foreground">AI creates personalized training paths based on performance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">3</div>
              <h3 className="text-lg font-semibold mb-2">Practice & Apply</h3>
              <p className="text-muted-foreground">Hands-on labs and realistic simulations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">4</div>
              <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">Monitor improvement with detailed analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your organization
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground">/user/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-success rounded-full" />
                  </div>
                  <span>Basic courses</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-success rounded-full" />
                  </div>
                  <span>AI assistant</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-success rounded-full" />
                  </div>
                  <span>Progress tracking</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" onClick={() => onNavigate("register")}>Get Started</Button>
            </Card>
            <Card className="p-8 border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$79</span>
                <span className="text-muted-foreground">/user/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-success rounded-full" />
                  </div>
                  <span>All Starter features</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-success rounded-full" />
                  </div>
                  <span>Phishing simulations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-success rounded-full" />
                  </div>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-success rounded-full" />
                  </div>
                  <span>Team management</span>
                </li>
              </ul>
              <Button className="w-full" onClick={() => onNavigate("register")}>Get Started</Button>
            </Card>
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-success rounded-full" />
                  </div>
                  <span>All Pro features</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-success rounded-full" />
                  </div>
                  <span>Custom content</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-success rounded-full" />
                  </div>
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-success rounded-full" />
                  </div>
                  <span>SSO & compliance</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" onClick={() => window.location.href = "mailto:sales@cyberguard.ai?subject=Enterprise%20Inquiry"}>Contact Sales</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold">CyberGuard AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered cybersecurity training for the modern workforce.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection("features")} className="font-normal text-muted-foreground hover:text-foreground transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection("pricing")} className="font-normal text-muted-foreground hover:text-foreground transition-colors">Pricing</button></li>
                <li><button onClick={() => scrollToSection("how-it-works")} className="font-normal text-muted-foreground hover:text-foreground transition-colors">How It Works</button></li>
                <li><button onClick={() => onNavigate("register")} className="font-normal text-muted-foreground hover:text-foreground transition-colors">Get Started</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => onNavigate("login")} className="font-normal text-muted-foreground hover:text-foreground transition-colors">Login</button></li>
                <li><button onClick={() => onNavigate("register")} className="font-normal text-muted-foreground hover:text-foreground transition-colors">Create Account</button></li>
                <li><a href="mailto:support@cyberguard.ai" className="text-muted-foreground hover:text-foreground transition-colors">Contact Support</a></li>
                <li><a href="mailto:sales@cyberguard.ai" className="text-muted-foreground hover:text-foreground transition-colors">Sales Inquiry</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => onNavigate("privacy-policy")} className="font-normal text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => onNavigate("terms-of-service")} className="font-normal text-muted-foreground hover:text-foreground transition-colors">Terms of Service</button></li>
                <li><button onClick={() => onNavigate("cookie-policy")} className="font-normal text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2026 CyberGuard AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
