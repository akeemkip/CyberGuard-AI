import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LandingPage } from "./components/landing-page";
import { LoginPage } from "./components/login-page";
import { RegisterPage } from "./components/register-page";
import { ResetPasswordPage } from "./components/reset-password-page";
import { PrivacyPolicyPage } from "./components/privacy-policy-page";
import { TermsOfServicePage } from "./components/terms-of-service-page";
import { CookiePolicyPage } from "./components/cookie-policy-page";
import { StudentDashboard } from "./components/student-dashboard";
import { CourseCatalog } from "./components/course-catalog";
import { CoursePlayer } from "./components/course-player";
import { AIChat } from "./components/ai-chat";
import { AdminDashboard } from "./components/admin-dashboard";
import { AdminUsers } from "./components/admin-users";
import { AdminContent } from "./components/admin-content";
import { AdminAnalytics } from "./components/admin-analytics";
import { AdminSettings } from "./components/admin-settings";
import { CertificatesPage } from "./components/certificates-page";
import { AssessmentsPage } from "./components/assessments-page";
import { ProfilePage } from "./components/profile-page";
import { SettingsPage } from "./components/settings-page";

type Page = "landing" | "login" | "register" | "reset-password" | "privacy-policy" | "terms-of-service" | "cookie-policy" | "student-dashboard" | "course-catalog" | "course-player" | "ai-chat" | "certificates" | "assessments" | "profile" | "settings" | "admin-dashboard" | "admin-users" | "admin-content" | "admin-analytics" | "admin-settings";

// Pages that require authentication
const protectedPages: Page[] = ["student-dashboard", "course-catalog", "course-player", "ai-chat", "certificates", "assessments", "profile", "settings", "admin-dashboard", "admin-users", "admin-content", "admin-analytics", "admin-settings"];

// Pages that guests should see (not logged in)
const guestPages: Page[] = ["landing", "login", "register", "reset-password", "privacy-policy", "terms-of-service", "cookie-policy"];

function AppContent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Initialize page from localStorage or default based on auth state
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const savedPage = localStorage.getItem("currentPage") as Page | null;
    return savedPage || "landing";
  });
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(() => {
    return localStorage.getItem("selectedCourseId");
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle initial page load and auth state changes
  useEffect(() => {
    if (isLoading) return; // Wait for auth to initialize

    const savedPage = localStorage.getItem("currentPage") as Page | null;

    if (isAuthenticated && user) {
      // User is logged in
      if (guestPages.includes(currentPage)) {
        // If on a guest page (landing, login, register), redirect to appropriate dashboard
        const defaultDashboard = user.role === "ADMIN" ? "admin-dashboard" : "student-dashboard";
        // If they had a saved protected page, go there; otherwise go to dashboard
        if (savedPage && protectedPages.includes(savedPage)) {
          setCurrentPage(savedPage);
        } else {
          setCurrentPage(defaultDashboard);
        }
      }
      // If already on a protected page, stay there
    } else {
      // User is NOT logged in
      if (protectedPages.includes(currentPage)) {
        // If on a protected page, redirect to landing
        setCurrentPage("landing");
        localStorage.removeItem("currentPage");
        localStorage.removeItem("selectedCourseId");
      }
    }

    setIsInitialized(true);
  }, [isAuthenticated, user, isLoading]);

  // Save current page to localStorage whenever it changes (only for protected pages)
  useEffect(() => {
    if (isInitialized && protectedPages.includes(currentPage)) {
      localStorage.setItem("currentPage", currentPage);
    }
  }, [currentPage, isInitialized]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.page) {
        setCurrentPage(event.state.page as Page);
        if (event.state.courseId) {
          setSelectedCourseId(event.state.courseId);
        }
      } else {
        // No state, go to landing
        setCurrentPage("landing");
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Set initial history state
    if (isInitialized && !window.history.state?.page) {
      window.history.replaceState({ page: currentPage, courseId: selectedCourseId }, "", window.location.pathname);
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, [isInitialized]);

  const handleLogout = () => {
    logout();
    setCurrentPage("landing");
    localStorage.removeItem("currentPage");
    localStorage.removeItem("selectedCourseId");
    window.history.pushState({ page: "landing" }, "", window.location.pathname);
  };

  const handleNavigate = (page: string, courseId?: string) => {
    // Push to browser history for back button support
    window.history.pushState({ page, courseId }, "", window.location.pathname);
    setCurrentPage(page as Page);
    if (courseId) {
      setSelectedCourseId(courseId);
      localStorage.setItem("selectedCourseId", courseId);
    }
  };

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const userEmail = user?.email || "";
  const userRole = user?.role?.toLowerCase() as "student" | "admin" | undefined;

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={handleNavigate} />;
      case "login":
        return <LoginPage onNavigate={handleNavigate} />;
      case "register":
        return <RegisterPage onNavigate={handleNavigate} />;
      case "reset-password":
        return <ResetPasswordPage onNavigate={handleNavigate} />;
      case "privacy-policy":
        return <PrivacyPolicyPage onNavigate={handleNavigate} />;
      case "terms-of-service":
        return <TermsOfServicePage onNavigate={handleNavigate} />;
      case "cookie-policy":
        return <CookiePolicyPage onNavigate={handleNavigate} />;
      case "student-dashboard":
        return (
          <StudentDashboard
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case "course-catalog":
        return (
          <CourseCatalog
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case "course-player":
        return (
          <CoursePlayer
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            courseId={selectedCourseId}
          />
        );
      case "ai-chat":
        return (
          <AIChat
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case "certificates":
        return (
          <CertificatesPage
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case "assessments":
        return (
          <AssessmentsPage
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case "profile":
        return (
          <ProfilePage
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case "settings":
        return (
          <SettingsPage
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case "admin-dashboard":
        return (
          <AdminDashboard
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case "admin-users":
        return (
          <AdminUsers
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case "admin-content":
        return (
          <AdminContent
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case "admin-analytics":
        return (
          <AdminAnalytics
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case "admin-settings":
        return (
          <AdminSettings
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return renderPage();
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
          <Toaster richColors position="top-right" />
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
