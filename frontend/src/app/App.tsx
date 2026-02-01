import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import { PlatformSettingsProvider } from "./context/PlatformSettingsContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LandingPage } from "./components/landing-page";
import { LoginPage } from "./components/login-page";
import { RegisterPage } from "./components/register-page";
import { RegisterSuccessPage } from "./components/register-success-page";
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
import { AdminLabEdit } from "./components/admin-lab-edit";
import { AdminAnalytics } from "./components/admin-analytics";
import { AdminSettings } from "./components/admin-settings";
import { CertificatesPage } from "./components/certificates-page";
import { AssessmentsPage } from "./components/assessments-page";
import { ProfilePage } from "./components/profile-page";
import { SettingsPage } from "./components/settings-page";
import { LabPlayer } from "./components/lab-player";
import { PhishingSimulation } from "./components/phishing-simulation";
import { AdminPhishingEdit } from "./components/admin-phishing-edit";

type Page = "landing" | "login" | "register" | "register-success" | "reset-password" | "privacy-policy" | "terms-of-service" | "cookie-policy" | "student-dashboard" | "course-catalog" | "course-player" | "lab-player" | "ai-chat" | "certificates" | "assessments" | "profile" | "settings" | "phishing-simulation" | "admin-dashboard" | "admin-users" | "admin-user-profile" | "admin-content" | "admin-lesson-edit" | "admin-quiz-edit" | "admin-lab-edit" | "admin-phishing-edit" | "admin-analytics" | "admin-settings";

// Pages that require authentication
const protectedPages: Page[] = ["student-dashboard", "course-catalog", "course-player", "lab-player", "ai-chat", "certificates", "assessments", "profile", "settings", "phishing-simulation", "admin-dashboard", "admin-users", "admin-user-profile", "admin-content", "admin-lesson-edit", "admin-quiz-edit", "admin-lab-edit", "admin-phishing-edit", "admin-analytics", "admin-settings"];

// Pages that guests should see (not logged in)
const guestPages: Page[] = ["landing", "login", "register", "reset-password", "privacy-policy", "terms-of-service", "cookie-policy"];

// Admin-only pages (require ADMIN role)
const adminOnlyPages: Page[] = ["admin-dashboard", "admin-users", "admin-user-profile", "admin-content", "admin-lesson-edit", "admin-quiz-edit", "admin-lab-edit", "admin-phishing-edit", "admin-analytics", "admin-settings"];

// Student-only pages (require STUDENT role - admins cannot access)
const studentOnlyPages: Page[] = ["student-dashboard", "course-catalog", "course-player", "lab-player", "ai-chat", "certificates", "assessments", "profile", "settings", "phishing-simulation"];

// Guest pages that should persist on refresh (not landing - that's the default)
const persistableGuestPages: Page[] = ["login", "register", "reset-password"];

// "Transient" pages that require an ID parameter - these should NOT persist to localStorage
// because refreshing them without proper context can cause navigation issues
const transientPages: Page[] = ["lab-player", "course-player", "admin-user-profile", "admin-lesson-edit", "admin-quiz-edit", "admin-lab-edit", "admin-phishing-edit"];

// Map of transient pages to their "parent" page (for back button support)
const transientPageParents: Partial<Record<Page, Page>> = {
  "lab-player": "student-dashboard",
  "course-player": "course-catalog",
  "admin-user-profile": "admin-users",
  "admin-lesson-edit": "admin-content",
  "admin-quiz-edit": "admin-content",
  "admin-lab-edit": "admin-content",
  "admin-phishing-edit": "admin-content",
};

function AppContent() {
  const { user, isAuthenticated, isInitializing, logout } = useAuth();

  // Initialize page from history state, localStorage, or default
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    // First check browser history state (preserved on refresh)
    const historyPage = window.history.state?.page as Page | undefined;
    if (historyPage) {
      // For transient pages, check if we have the required ID
      if (transientPages.includes(historyPage)) {
        const hasRequiredId = window.history.state?.idParam;
        if (!hasRequiredId) {
          // No ID, go to parent page instead
          return transientPageParents[historyPage] || "landing";
        }
      }
      return historyPage;
    }
    // Fall back to localStorage - but NOT for transient pages
    const savedPage = localStorage.getItem("currentPage") as Page | null;
    if (savedPage && transientPages.includes(savedPage)) {
      // Transient pages shouldn't restore from localStorage - go to parent
      return transientPageParents[savedPage] || "landing";
    }
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
  const [selectedPhishingScenarioId, setSelectedPhishingScenarioId] = useState<string | null>(() => {
    return localStorage.getItem("selectedPhishingScenarioId");
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Log all page changes
  useEffect(() => {
    console.log('[App] 📄 Current page changed to:', currentPage);
  }, [currentPage]);

  // On initial mount, clean up any stale transient page from localStorage
  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage") as Page | null;
    if (savedPage && transientPages.includes(savedPage)) {
      console.log('[App] Cleaning up stale transient page from localStorage:', savedPage);
      localStorage.removeItem("currentPage");
    }
  }, []);

  // Handle initial page load and auth state changes
  useEffect(() => {
    console.log('[App] Navigation useEffect triggered:', {
      isInitializing,
      isAuthenticated,
      user: user?.email,
      userRole: user?.role,
      currentPage
    });

    if (isInitializing) {
      console.log('[App] Waiting for auth to initialize...');
      return; // Wait for auth to initialize
    }

    const savedPage = localStorage.getItem("currentPage") as Page | null;

    if (isAuthenticated && user) {
      // User is logged in
      console.log('[App] User is authenticated, role:', user.role);
      const isAdmin = user.role === "ADMIN";
      const defaultDashboard = isAdmin ? "admin-dashboard" : "student-dashboard";

      // Check if user is trying to access admin pages without admin role
      if (!isAdmin && adminOnlyPages.includes(currentPage)) {
        console.log('[App] Non-admin user trying to access admin page, redirecting to student dashboard');
        setCurrentPage("student-dashboard");
        localStorage.setItem("currentPage", "student-dashboard");
        window.history.replaceState({ page: "student-dashboard" }, "", window.location.pathname);
        setIsInitialized(true);
        return;
      }

      // Check if admin is trying to access student pages
      if (isAdmin && studentOnlyPages.includes(currentPage)) {
        console.log('[App] Admin user trying to access student page, redirecting to admin dashboard');
        setCurrentPage("admin-dashboard");
        localStorage.setItem("currentPage", "admin-dashboard");
        window.history.replaceState({ page: "admin-dashboard" }, "", window.location.pathname);
        setIsInitialized(true);
        return;
      }

      if (guestPages.includes(currentPage)) {
        // If on a guest page (landing, login, register), redirect to appropriate dashboard
        console.log('[App] On guest page, redirecting to dashboard:', defaultDashboard);

        let targetPage: Page = defaultDashboard;

        // If they had a saved protected page, go there; otherwise go to dashboard
        if (savedPage && protectedPages.includes(savedPage)) {
          // But make sure they can access the saved page based on their role
          if (!isAdmin && adminOnlyPages.includes(savedPage)) {
            console.log('[App] Saved page is admin-only, going to student dashboard instead');
            targetPage = "student-dashboard";
          } else if (isAdmin && studentOnlyPages.includes(savedPage)) {
            console.log('[App] Saved page is student-only, going to admin dashboard instead');
            targetPage = "admin-dashboard";
          } else {
            console.log('[App] Found saved protected page:', savedPage);
            targetPage = savedPage;
          }
        } else {
          console.log('[App] No saved page, going to default dashboard');
          targetPage = defaultDashboard;
        }

        // Update both state and history
        setCurrentPage(targetPage);
        localStorage.setItem("currentPage", targetPage);
        window.history.replaceState({ page: targetPage }, "", window.location.pathname);
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
  }, [isAuthenticated, user, isInitializing]);

  // Save current page to localStorage whenever it changes (protected pages + persistable guest pages)
  // But NOT transient pages (lab-player, course-player, etc.) - those shouldn't persist on refresh
  useEffect(() => {
    if (isInitialized) {
      const shouldPersist = (protectedPages.includes(currentPage) || persistableGuestPages.includes(currentPage))
        && !transientPages.includes(currentPage);
      if (shouldPersist) {
        localStorage.setItem("currentPage", currentPage);
      }
    }
  }, [currentPage, isInitialized]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log('[App] popstate event triggered:', event.state);
      if (event.state?.page) {
        const targetPage = event.state.page as Page;

        // Security check: prevent non-admin users from navigating to admin pages via history
        const isAdmin = user?.role === "ADMIN";
        if (!isAdmin && adminOnlyPages.includes(targetPage)) {
          console.log('[App] ⛔ Non-admin user attempted to navigate to admin page via history:', targetPage);
          // Redirect to student dashboard instead
          window.history.replaceState({ page: "student-dashboard" }, "", window.location.pathname);
          setCurrentPage("student-dashboard");
          return;
        }

        console.log('[App] History state has page, navigating to:', event.state.page);
        setCurrentPage(targetPage);
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
          } else if (page === "lab-player" || page === "admin-lab-edit") {
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

      // For transient pages, first push the parent page so back button works
      if (transientPages.includes(currentPage)) {
        const parentPage = transientPageParents[currentPage];
        if (parentPage) {
          console.log('[App] Transient page detected, adding parent to history:', parentPage);
          window.history.replaceState({ page: parentPage }, "", window.location.pathname);
          window.history.pushState({ page: currentPage, idParam }, "", window.location.pathname);
        } else {
          window.history.replaceState({ page: currentPage, idParam }, "", window.location.pathname);
        }
      } else {
        window.history.replaceState({ page: currentPage, idParam }, "", window.location.pathname);
      }
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
    localStorage.removeItem("selectedPhishingScenarioId");
    localStorage.removeItem("adminContentTab");
    localStorage.removeItem("adminSettingsTab");
    window.history.pushState({ page: "landing" }, "", window.location.pathname);
  };

  const handleNavigate = (page: string, idParam?: string) => {
    console.log('[App] 🔄 handleNavigate called:', { from: currentPage, to: page, idParam });

    const pageAsType = page as Page;
    const isAdmin = user?.role === "ADMIN";

    // Security check: prevent non-admin users from navigating to admin pages
    if (!isAdmin && adminOnlyPages.includes(pageAsType)) {
      console.log('[App] ⛔ Non-admin user attempted to navigate to admin page:', page);
      return; // Block navigation
    }

    // Security check: prevent admin users from navigating to student pages
    if (isAdmin && studentOnlyPages.includes(pageAsType)) {
      console.log('[App] ⛔ Admin user attempted to navigate to student page:', page);
      return; // Block navigation
    }

    // Push to browser history for back button support
    // Store the current page as previousPage so we can reference it if needed
    window.history.pushState({ page, idParam, previousPage: currentPage }, "", window.location.pathname);
    setCurrentPage(pageAsType);

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

    // Handle lab ID for lab player or lab edit
    if ((page === "lab-player" || page === "admin-lab-edit") && idParam) {
      setSelectedLabId(idParam);
      localStorage.setItem("selectedLabId", idParam);
    }

    // Clear lab ID when creating new lab
    if (page === "admin-lab-edit" && !idParam) {
      setSelectedLabId(null);
      localStorage.removeItem("selectedLabId");
    }

    // Handle phishing scenario ID for admin edit
    if (page === "admin-phishing-edit" && idParam) {
      setSelectedPhishingScenarioId(idParam);
      localStorage.setItem("selectedPhishingScenarioId", idParam);
    }

    // Clear phishing scenario ID when creating new scenario
    if (page === "admin-phishing-edit" && !idParam) {
      setSelectedPhishingScenarioId(null);
      localStorage.removeItem("selectedPhishingScenarioId");
    }
  };

  // Show loading state while auth is initializing
  if (isInitializing) {
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
      case "register-success":
        return <RegisterSuccessPage onNavigate={handleNavigate} />;
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
      case "phishing-simulation":
        return (
          <PhishingSimulation
            onNavigate={handleNavigate}
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
      case "admin-lab-edit":
        return (
          <AdminLabEdit
            labId={selectedLabId}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case "admin-phishing-edit":
        return (
          <AdminPhishingEdit
            scenarioId={selectedPhishingScenarioId}
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
    <PlatformSettingsProvider>
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
    </PlatformSettingsProvider>
  );
}
