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
import { AdminUserProfile } from "./components/admin-user-profile";
import { AdminContent } from "./components/admin-content";
import { AdminLessonEdit } from "./components/admin-lesson-edit";
import { AdminQuizEdit } from "./components/admin-quiz-edit";
import { AdminAnalytics } from "./components/admin-analytics";
import { AdminSettings } from "./components/admin-settings";
import { CertificatesPage } from "./components/certificates-page";
import { AssessmentsPage } from "./components/assessments-page";
import { ProfilePage } from "./components/profile-page";
import { SettingsPage } from "./components/settings-page";
import { LabPlayer } from "./components/lab-player";

type Page = "landing" | "login" | "register" | "reset-password" | "privacy-policy" | "terms-of-service" | "cookie-policy" | "student-dashboard" | "course-catalog" | "course-player" | "lab-player" | "ai-chat" | "certificates" | "assessments" | "profile" | "settings" | "admin-dashboard" | "admin-users" | "admin-user-profile" | "admin-content" | "admin-lesson-edit" | "admin-quiz-edit" | "admin-analytics" | "admin-settings";

// Pages that require authentication
const protectedPages: Page[] = ["student-dashboard", "course-catalog", "course-player", "lab-player", "ai-chat", "certificates", "assessments", "profile", "settings", "admin-dashboard", "admin-users", "admin-user-profile", "admin-content", "admin-lesson-edit", "admin-quiz-edit", "admin-analytics", "admin-settings"];

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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(() => {
    return localStorage.getItem("selectedUserId");
  });
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(() => {
    return localStorage.getItem("selectedLessonId");
  });
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(() => {
    return localStorage.getItem("selectedQuizId");
  });
  const [selectedLabId, setSelectedLabId] = useState<string | null>(() => {
    return localStorage.getItem("selectedLabId");
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle initial page load and auth state changes
  useEffect(() => {
    console.log('[App] Navigation useEffect triggered:', {
      isLoading,
      isAuthenticated,
      user: user?.email,
      currentPage
    });

    if (isLoading) {
      console.log('[App] Waiting for auth to initialize...');
      return; // Wait for auth to initialize
    }

    const savedPage = localStorage.getItem("currentPage") as Page | null;

    if (isAuthenticated && user) {
      // User is logged in
      console.log('[App] User is authenticated');
      if (guestPages.includes(currentPage)) {
        // If on a guest page (landing, login, register), redirect to appropriate dashboard
        const defaultDashboard = user.role === "ADMIN" ? "admin-dashboard" : "student-dashboard";
        console.log('[App] On guest page, redirecting to dashboard:', defaultDashboard);
        // If they had a saved protected page, go there; otherwise go to dashboard
        if (savedPage && protectedPages.includes(savedPage)) {
          console.log('[App] Found saved protected page:', savedPage);
          setCurrentPage(savedPage);
        } else {
          console.log('[App] No saved page, going to default dashboard');
          setCurrentPage(defaultDashboard);
        }
      } else {
        console.log('[App] Already on protected page, staying here');
      }
      // If already on a protected page, stay there
    } else {
      // User is NOT logged in
      console.log('[App] User is NOT authenticated');
      if (protectedPages.includes(currentPage)) {
        // If on a protected page, redirect to landing
        console.log('[App] On protected page while not authenticated, redirecting to landing');
        setCurrentPage("landing");
        localStorage.removeItem("currentPage");
        localStorage.removeItem("selectedCourseId");
      } else if (guestPages.includes(currentPage)) {
        // On a guest page (login, register, etc.) - stay here
        console.log('[App] On guest page, staying here');
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
      console.log('[App] popstate event triggered:', event.state);
      if (event.state?.page) {
        console.log('[App] History state has page, navigating to:', event.state.page);
        setCurrentPage(event.state.page as Page);
        if (event.state.idParam) {
          const page = event.state.page as Page;
          if (page === "course-player") {
            setSelectedCourseId(event.state.idParam);
          } else if (page === "admin-user-profile") {
            setSelectedUserId(event.state.idParam);
          } else if (page === "admin-lesson-edit") {
            setSelectedLessonId(event.state.idParam);
          } else if (page === "admin-quiz-edit") {
            setSelectedQuizId(event.state.idParam);
          } else if (page === "lab-player") {
            setSelectedLabId(event.state.idParam);
          }
        }
        // Legacy support for old courseId format
        if (event.state.courseId) {
          setSelectedCourseId(event.state.courseId);
        }
      } else {
        // No state - only redirect to landing if not on a guest page
        console.log('[App] ⚠️ No history state found');
        if (!guestPages.includes(currentPage)) {
          console.log('[App] Not on guest page, redirecting to landing');
          setCurrentPage("landing");
        } else {
          console.log('[App] On guest page, staying here (popstate without state)');
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Set initial history state
    if (isInitialized && !window.history.state?.page) {
      const idParam = selectedCourseId || selectedUserId || selectedLessonId || selectedQuizId || selectedLabId;
      console.log('[App] Setting initial history state:', { page: currentPage, idParam });
      window.history.replaceState({ page: currentPage, idParam }, "", window.location.pathname);
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, [isInitialized]);

  const handleLogout = () => {
    logout();
    setCurrentPage("landing");
    localStorage.removeItem("currentPage");
    localStorage.removeItem("selectedCourseId");
    localStorage.removeItem("selectedUserId");
    localStorage.removeItem("selectedLessonId");
    localStorage.removeItem("selectedQuizId");
    localStorage.removeItem("selectedLabId");
    localStorage.removeItem("adminContentTab");
    localStorage.removeItem("adminSettingsTab");
    window.history.pushState({ page: "landing" }, "", window.location.pathname);
  };

  const handleNavigate = (page: string, idParam?: string) => {
    // Push to browser history for back button support
    window.history.pushState({ page, idParam }, "", window.location.pathname);
    setCurrentPage(page as Page);

    // Handle course ID for course player
    if (page === "course-player" && idParam) {
      setSelectedCourseId(idParam);
      localStorage.setItem("selectedCourseId", idParam);
    }

    // Handle user ID for user profile
    if (page === "admin-user-profile" && idParam) {
      setSelectedUserId(idParam);
      localStorage.setItem("selectedUserId", idParam);
    }

    // Handle lesson ID for lesson edit
    if (page === "admin-lesson-edit" && idParam) {
      setSelectedLessonId(idParam);
      localStorage.setItem("selectedLessonId", idParam);
    }

    // Handle quiz ID for quiz edit
    if (page === "admin-quiz-edit" && idParam) {
      setSelectedQuizId(idParam);
      localStorage.setItem("selectedQuizId", idParam);
    }

    // Handle lab ID for lab player
    if (page === "lab-player" && idParam) {
      setSelectedLabId(idParam);
      localStorage.setItem("selectedLabId", idParam);
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
      case "lab-player":
        return <LabPlayer labId={selectedLabId} onNavigate={handleNavigate} />;
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
      case "admin-user-profile":
        return selectedUserId ? (
          <AdminUserProfile
            userId={selectedUserId}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        ) : (
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
      case "admin-lesson-edit":
        return selectedLessonId ? (
          <AdminLessonEdit
            lessonId={selectedLessonId}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        ) : (
          <AdminContent
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case "admin-quiz-edit":
        return (
          <AdminQuizEdit
            quizId={selectedQuizId}
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
          <Toaster richColors position="top-right" duration={2000} />
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
