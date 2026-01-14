import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Shield,
  Moon,
  Sun,
  Search,
  Filter,
  Clock,
  Users,
  ChevronDown,
  Menu,
  Loader2,
  BookOpen,
  CheckCircle,
  X,
  TrendingUp,
  MessageSquare,
  Book
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useAuth } from "../context/AuthContext";
import { UserProfileDropdown } from "./user-profile-dropdown";
import courseService, { Course, EnrolledCourse } from "../services/course.service";

interface CourseCatalogProps {
  userEmail: string;
  onNavigate: (page: string, courseId?: string) => void;
  onLogout: () => void;
}

const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

export function CourseCatalog({ userEmail, onNavigate, onLogout }: CourseCatalogProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [allCourses, enrolledCourses] = await Promise.all([
          courseService.getAllCourses(true),
          courseService.getEnrolledCourses()
        ]);
        setCourses(allCourses);
        setEnrolledCourseIds(new Set(enrolledCourses.map(e => e.courseId)));
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrollingId(courseId);
      await courseService.enrollInCourse(courseId);
      setEnrolledCourseIds(prev => new Set([...prev, courseId]));
    } catch (error) {
      console.error("Error enrolling in course:", error);
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "All" || course.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const displayName = user?.firstName || userEmail.split("@")[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">CyberGuard AI</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate("student-dashboard")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </button>
            <button className="text-foreground font-medium">Courses</button>
            <button
              onClick={() => onNavigate("ai-chat")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              AI Assistant
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <UserProfileDropdown onLogout={onLogout} onNavigate={onNavigate} />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold">CyberGuard AI</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="p-4 space-y-2">
              <button
                onClick={() => { setShowMobileMenu(false); onNavigate("student-dashboard"); }}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <Shield className="w-5 h-5" />
                Dashboard
              </button>
              <button
                onClick={() => { setShowMobileMenu(false); }}
                className="flex items-center gap-3 w-full p-3 rounded-lg bg-primary/10 text-primary font-medium"
              >
                <Book className="w-5 h-5" />
                Courses
              </button>
              <button
                onClick={() => { setShowMobileMenu(false); onNavigate("ai-chat"); }}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <MessageSquare className="w-5 h-5" />
                AI Assistant
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Course Catalog</h1>
          <p className="text-muted-foreground">Explore our comprehensive cybersecurity training library</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input-background"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {showFilters && (
            <Card className="p-6">
              <div>
                <h3 className="font-semibold mb-3">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => (
                    <Badge
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedDifficulty(difficulty)}
                    >
                      {difficulty}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.has(course.id);
            const isEnrolling = enrollingId === course.id;

            return (
              <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow flex flex-col">
                <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Shield className="w-16 h-16 text-primary" />
                  )}
                </div>

                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">{course.difficulty}</Badge>
                  {isEnrolled && (
                    <Badge className="bg-success flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Enrolled
                    </Badge>
                  )}
                </div>

                <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                  {course.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration || "Self-paced"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course._count?.lessons || 0} lessons</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{course._count?.enrollments || 0} enrolled</span>
                  </div>
                </div>

                {isEnrolled ? (
                  <Button
                    className="w-full"
                    onClick={() => onNavigate("course-player", course.id)}
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleEnroll(course.id)}
                    disabled={isEnrolling}
                  >
                    {isEnrolling ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enrolling...
                      </>
                    ) : (
                      "Enroll Now"
                    )}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedDifficulty("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
