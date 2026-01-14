import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Shield,
  Moon,
  Sun,
  Award,
  ChevronLeft,
  Download,
  Calendar,
  BookOpen,
  Loader2,
  X
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useAuth } from "../context/AuthContext";
import { UserProfileDropdown } from "./user-profile-dropdown";
import courseService, { EnrolledCourse } from "../services/course.service";

interface CertificatesPageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function CertificatesPage({ onNavigate, onLogout }: CertificatesPageProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [completedCourses, setCompletedCourses] = useState<EnrolledCourse[]>([]);
  const [viewingCertificate, setViewingCertificate] = useState<EnrolledCourse | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const enrolledCourses = await courseService.getEnrolledCourses();
        // Filter for completed courses only
        const completed = enrolledCourses.filter(e => e.completedAt !== null);
        setCompletedCourses(completed);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const userName = user ? `${user.firstName} ${user.lastName}` : 'Student';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 print:hidden">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("student-dashboard")}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold">My Certificates</h1>
                <p className="text-sm text-muted-foreground">
                  {completedCourses.length} certificate{completedCourses.length !== 1 ? 's' : ''} earned
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <UserProfileDropdown onLogout={onLogout} onNavigate={onNavigate} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 print:hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : completedCourses.length === 0 ? (
          <Card className="max-w-lg mx-auto p-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Certificates Yet</h2>
            <p className="text-muted-foreground mb-6">
              Complete courses to earn certificates. Each completed course earns you a certificate of completion.
            </p>
            <Button onClick={() => onNavigate("course-catalog")}>
              Browse Courses
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((enrollment) => (
              <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Certificate Preview */}
                <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-6 border-b border-border">
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Certificate Info */}
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{enrollment.course.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Completed {formatDate(enrollment.completedAt!)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{enrollment.progress.totalLessons} lessons completed</span>
                    </div>
                  </div>
                  <Badge className="mb-4">{enrollment.course.difficulty}</Badge>
                  <Button
                    className="w-full"
                    onClick={() => setViewingCertificate(enrollment)}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    View Certificate
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0">
          <div
            className="fixed inset-0 bg-black/50 print:hidden"
            onClick={() => setViewingCertificate(null)}
          />
          <div className="relative bg-card rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto print:max-w-none print:max-h-none print:shadow-none print:rounded-none print:bg-white">
            {/* Modal Header - Hidden when printing */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card print:hidden">
              <h2 className="font-semibold text-foreground">Certificate of Completion</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Download className="w-4 h-4 mr-2" />
                  Print / Save PDF
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setViewingCertificate(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Certificate Content - Always white background for printing */}
            <div ref={certificateRef} className="p-8 print:p-12 bg-white">
              <div className="border-8 border-double border-yellow-500 p-8 print:p-12 bg-gradient-to-br from-yellow-50 to-white">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">CyberGuard AI</span>
                  </div>
                  <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2">
                    Certificate of Completion
                  </h1>
                  <div className="w-32 h-1 bg-yellow-500 mx-auto" />
                </div>

                {/* Body */}
                <div className="text-center mb-8">
                  <p className="text-gray-600 mb-4">This is to certify that</p>
                  <p className="text-3xl font-serif font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2 inline-block px-8">
                    {userName}
                  </p>
                  <p className="text-gray-600 mb-4">has successfully completed the course</p>
                  <p className="text-2xl font-semibold text-primary mb-4">
                    {viewingCertificate.course.title}
                  </p>
                  <p className="text-gray-600">
                    demonstrating knowledge and skills in cybersecurity best practices
                  </p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end mt-12">
                  <div className="text-center">
                    <div className="w-40 border-t-2 border-gray-400 pt-2">
                      <p className="text-sm text-gray-600">Date of Completion</p>
                      <p className="font-semibold text-gray-800">
                        {formatDate(viewingCertificate.completedAt!)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg mb-2">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-xs text-gray-500">Verified Certificate</p>
                  </div>
                  <div className="text-center">
                    <div className="w-40 border-t-2 border-gray-400 pt-2">
                      <p className="text-sm text-gray-600">Certificate ID</p>
                      <p className="font-mono text-xs text-gray-800">
                        {viewingCertificate.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          [class*="fixed"] > div:last-child,
          [class*="fixed"] > div:last-child * {
            visibility: visible;
          }
          [class*="fixed"] > div:last-child {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
