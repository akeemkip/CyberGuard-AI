import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { marked } from 'marked';
import {
  ArrowLeft,
  Clock,
  Target,
  BookOpen,
  HelpCircle,
  Save,
  CheckCircle,
  Loader2,
  PlayCircle,
  FileText,
  Lightbulb,
  Mail,
  Trophy,
  AlertTriangle
} from "lucide-react";
import courseService, { LabDetails, LabType } from "../services/course.service";
import { PhishingEmailConfig, SuspiciousLinksConfig, PasswordStrengthConfig, SocialEngineeringConfig } from "../services/admin.service";
import { PhishingEmailSimulation } from "./lab-templates/PhishingEmailSimulation";
import { SuspiciousLinksSimulation } from "./lab-templates/SuspiciousLinksSimulation";
import { PasswordStrengthSimulation } from "./lab-templates/PasswordStrengthSimulation";
import { SocialEngineeringSimulation } from "./lab-templates/SocialEngineeringSimulation";

interface LabPlayerProps {
  labId?: string | null;
  onNavigate?: (page: string, idParam?: string) => void;
}

export function LabPlayer({ labId, onNavigate }: LabPlayerProps) {

  const [labData, setLabData] = useState<LabDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Load lab data
  useEffect(() => {
    if (labId) {
      loadLabData();
    }
  }, [labId]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Auto-save notes every 30 seconds when timer is running (for CONTENT labs)
  useEffect(() => {
    let saveInterval: NodeJS.Timeout;
    const currentLabType = labData?.lab?.labType || 'CONTENT';
    if (isTimerRunning && currentLabType === 'CONTENT' && labData?.progress && notes !== (labData.progress.notes || "")) {
      saveInterval = setInterval(() => {
        handleSaveNotes(false); // Silent save
      }, 30000);
    }
    return () => {
      if (saveInterval) clearInterval(saveInterval);
    };
  }, [isTimerRunning, notes, labData]);

  const loadLabData = async () => {
    try {
      setIsLoading(true);
      const data = await courseService.getLabForStudent(labId!);
      setLabData(data);

      // Set notes from existing progress
      if (data.progress?.notes) {
        setNotes(data.progress.notes);
      }

      // Set elapsed time from progress
      if (data.progress?.timeSpent) {
        setElapsedTime(data.progress.timeSpent * 60); // Convert minutes to seconds
      }

      // Auto-start timer if lab is in progress
      if (data.progress?.status === 'IN_PROGRESS') {
        setIsTimerRunning(true);
      }
    } catch (error) {
      console.error("Error loading lab:", error);
      toast.error("Failed to load lab");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLab = async () => {
    try {
      setIsStarting(true);
      await courseService.startLab(labId!);
      toast.success("Lab started!");
      setIsTimerRunning(true);
      await loadLabData(); // Reload to get updated progress
    } catch (error) {
      console.error("Error starting lab:", error);
      toast.error("Failed to start lab");
    } finally {
      setIsStarting(false);
    }
  };

  const handleSaveNotes = async (showToast = true) => {
    if (!labData?.progress) return;

    try {
      setIsSavingNotes(true);
      const timeSpentMinutes = Math.floor(elapsedTime / 60);
      await courseService.updateLabNotes(labId!, notes, timeSpentMinutes);
      if (showToast) {
        toast.success("Notes saved successfully");
      }
    } catch (error) {
      console.error("Error saving notes:", error);
      if (showToast) {
        toast.error("Failed to save notes");
      }
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleCompleteLab = async () => {
    try {
      setIsCompleting(true);
      const timeSpentMinutes = Math.floor(elapsedTime / 60);
      await courseService.completeLab(labId!, timeSpentMinutes, notes);
      toast.success("Congratulations! Lab completed!");
      setIsTimerRunning(false);
      await loadLabData(); // Reload to get updated progress
    } catch (error) {
      console.error("Error completing lab:", error);
      toast.error("Failed to mark lab as complete");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSimulationComplete = async (score: number, passed: boolean, answers: Record<string, boolean>) => {
    try {
      const timeSpentMinutes = Math.floor(elapsedTime / 60);
      await courseService.submitLabSimulation(labId!, score, passed, answers, timeSpentMinutes);
      if (passed) {
        toast.success(`Lab completed with ${score}% score!`);
      } else {
        toast.info(`Score: ${score}%. Keep practicing to reach the ${labData?.lab.passingScore}% passing score.`);
      }
      await loadLabData(); // Reload to get updated progress
    } catch (error) {
      console.error("Error submitting simulation:", error);
      toast.error("Failed to submit simulation results");
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading lab...</p>
        </div>
      </div>
    );
  }

  if (!labData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Lab not found</p>
          <Button onClick={() => window.history.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const { lab, progress } = labData;
  const isCompleted = progress?.status === 'COMPLETED';
  const isInProgress = progress?.status === 'IN_PROGRESS';
  const isNotStarted = !progress || progress.status === 'NOT_STARTED';
  // Default to CONTENT for legacy labs that don't have labType set
  const labType = lab.labType || 'CONTENT';
  const isInteractiveLab = labType !== 'CONTENT';

  // For interactive labs, render the appropriate simulation
  if (isInteractiveLab && !isNotStarted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">{lab.title}</h1>
                  <p className="text-sm text-muted-foreground">{lab.courseTitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Timer */}
                <Card className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time Spent</p>
                      <p className="text-lg font-semibold font-mono">{formatTime(elapsedTime)}</p>
                    </div>
                  </div>
                </Card>

                {/* Score Badge */}
                {progress?.score !== null && progress?.score !== undefined && (
                  <Badge
                    variant={progress.passed ? "default" : "secondary"}
                    className={progress.passed ? "bg-green-600" : ""}
                  >
                    {progress.passed ? (
                      <Trophy className="w-3 h-3 mr-1" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 mr-1" />
                    )}
                    {progress.score}% ({progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''})
                  </Badge>
                )}

                {/* Status Badge */}
                <Badge variant={isCompleted ? "default" : "secondary"}>
                  {isCompleted ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Passed
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-3 h-3 mr-1" />
                      In Progress
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Content */}
        <div className="relative">
          {labType === 'PHISHING_EMAIL' && lab.simulationConfig && (
            <PhishingEmailSimulation
              config={lab.simulationConfig as PhishingEmailConfig}
              passingScore={lab.passingScore}
              onComplete={handleSimulationComplete}
            />
          )}

          {labType === 'SUSPICIOUS_LINKS' && lab.simulationConfig && (
            <SuspiciousLinksSimulation
              config={lab.simulationConfig as SuspiciousLinksConfig}
              passingScore={lab.passingScore}
              onComplete={handleSimulationComplete}
            />
          )}

          {labType === 'PASSWORD_STRENGTH' && lab.simulationConfig && (
            <PasswordStrengthSimulation
              config={lab.simulationConfig as PasswordStrengthConfig}
              passingScore={lab.passingScore}
              onComplete={handleSimulationComplete}
            />
          )}

          {labType === 'SOCIAL_ENGINEERING' && lab.simulationConfig && (
            <SocialEngineeringSimulation
              config={lab.simulationConfig as SocialEngineeringConfig}
              passingScore={lab.passingScore}
              onComplete={handleSimulationComplete}
            />
          )}

          {labType !== 'PHISHING_EMAIL' && labType !== 'SUSPICIOUS_LINKS' && labType !== 'PASSWORD_STRENGTH' && labType !== 'SOCIAL_ENGINEERING' && (
            <div className="container mx-auto px-4 py-8">
              <Card className="p-8 text-center">
                <Mail className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">Simulation Coming Soon</h2>
                <p className="text-muted-foreground">
                  The {labType.toLowerCase().replace('_', ' ')} simulation is under development.
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default Content Lab view (or start screen for interactive labs)
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{lab.title}</h1>
                <p className="text-sm text-muted-foreground">{lab.courseTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <Card className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Time Spent</p>
                    <p className="text-lg font-semibold font-mono">{formatTime(elapsedTime)}</p>
                  </div>
                </div>
              </Card>

              {/* Status Badge */}
              <Badge variant={isCompleted ? "default" : isInProgress ? "secondary" : "outline"}>
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </>
                ) : isInProgress ? (
                  <>
                    <PlayCircle className="w-3 h-3 mr-1" />
                    In Progress
                  </>
                ) : (
                  "Not Started"
                )}
              </Badge>

              {/* Action Buttons */}
              {isNotStarted && (
                <Button onClick={handleStartLab} disabled={isStarting}>
                  {isStarting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Lab
                    </>
                  )}
                </Button>
              )}

              {isInProgress && !isCompleted && !isInteractiveLab && (
                <Button onClick={handleCompleteLab} disabled={isCompleting}>
                  {isCompleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Lab Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lab Info Card */}
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Badge variant="outline">{lab.difficulty}</Badge>
                {lab.estimatedTime && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {lab.estimatedTime} minutes
                  </div>
                )}
                {isInteractiveLab && (
                  <Badge variant="secondary">
                    <Mail className="w-3 h-3 mr-1" />
                    Interactive Simulation
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground mb-6">{lab.description}</p>

              {/* Scenario */}
              {lab.scenario && (
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Scenario
                  </h3>
                  <p className="text-sm">{lab.scenario}</p>
                </div>
              )}

              {/* Objectives (for CONTENT labs) */}
              {lab.objectives && lab.objectives.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Learning Objectives
                  </h3>
                  <ul className="space-y-2">
                    {lab.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-primary">{index + 1}</span>
                        </div>
                        <span className="text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Passing Score (for interactive labs) */}
              {isInteractiveLab && (
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Passing Requirement
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Score at least <strong>{lab.passingScore}%</strong> to complete this lab.
                  </p>
                </div>
              )}
            </Card>

            {/* Instructions Tabs (for CONTENT labs) */}
            {!isInteractiveLab && lab.instructions && (
              <Card className="p-6">
                <Tabs defaultValue="instructions">
                  <TabsList className="mb-4">
                    <TabsTrigger value="instructions">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Instructions
                    </TabsTrigger>
                    {lab.resources && (
                      <TabsTrigger value="resources">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Resources
                      </TabsTrigger>
                    )}
                    {lab.hints && (
                      <TabsTrigger value="hints">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Hints
                      </TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="instructions" className="prose prose-sm dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: marked(lab.instructions) }} />
                  </TabsContent>

                  {lab.resources && (
                    <TabsContent value="resources" className="prose prose-sm dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: marked(lab.resources) }} />
                    </TabsContent>
                  )}

                  {lab.hints && (
                    <TabsContent value="hints">
                      {!showHints ? (
                        <div className="text-center py-8">
                          <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground mb-4">
                            Hints are available if you need help
                          </p>
                          <Button onClick={() => setShowHints(true)} variant="outline">
                            Show Hints
                          </Button>
                        </div>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: marked(lab.hints) }} />
                        </div>
                      )}
                    </TabsContent>
                  )}
                </Tabs>
              </Card>
            )}
          </div>

          {/* Right Column - Notes (for CONTENT labs) or Info (for interactive labs) */}
          <div className="lg:col-span-1">
            {!isInteractiveLab ? (
              <Card className="p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Lab Notes
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSaveNotes(true)}
                    disabled={isSavingNotes || !progress}
                  >
                    {isSavingNotes ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-3 h-3 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                </div>

                <Textarea
                  placeholder={
                    progress
                      ? "Take notes as you work through the lab...\n\n• Document your findings\n• Record commands used\n• Note any challenges\n• Write down solutions"
                      : "Start the lab to take notes"
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={!progress}
                  className="min-h-[400px] font-mono text-sm"
                />

                <p className="text-xs text-muted-foreground mt-2">
                  {isTimerRunning && "Notes auto-save every 30 seconds"}
                </p>

                {/* Progress Info */}
                {progress && (
                  <div className="mt-6 pt-6 border-t space-y-2 text-sm">
                    {progress.startedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Started:</span>
                        <span>{new Date(progress.startedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {progress.completedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed:</span>
                        <span>{new Date(progress.completedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time Spent:</span>
                      <span>{formatTime(elapsedTime)}</span>
                    </div>
                    {lab.estimatedTime && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated:</span>
                        <span>{lab.estimatedTime} min</span>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-6 sticky top-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Simulation Info
                </h3>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Type</p>
                    <Badge variant="secondary">
                      {labType.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1">Passing Score</p>
                    <p className="font-semibold">{lab.passingScore}%</p>
                  </div>

                  {progress && (
                    <>
                      <div>
                        <p className="text-muted-foreground mb-1">Your Best Score</p>
                        <p className="font-semibold">
                          {progress.score !== null ? `${progress.score}%` : 'Not attempted'}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground mb-1">Attempts</p>
                        <p className="font-semibold">{progress.attempts}</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground mb-1">Status</p>
                        <Badge variant={progress.passed ? "default" : "secondary"} className={progress.passed ? "bg-green-600" : ""}>
                          {progress.passed ? "Passed" : "In Progress"}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>

                {isNotStarted && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground mb-4">
                      Click "Start Lab" to begin the interactive simulation.
                    </p>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
