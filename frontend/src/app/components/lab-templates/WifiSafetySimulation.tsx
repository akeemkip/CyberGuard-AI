import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  Lock,
  Unlock,
  Trophy,
  RefreshCw,
  MapPin,
  Signal,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { WifiSafetyConfig } from "../../services/admin.service";

interface WifiSafetySimulationProps {
  config: WifiSafetyConfig;
  passingScore: number;
  onComplete: (score: number, passed: boolean, answers: Record<string, boolean>) => void;
}

interface NetworkAnswer {
  networkId: string;
  userAnswer: boolean; // true = safe, false = unsafe
  isCorrect: boolean;
}

export function WifiSafetySimulation({
  config,
  passingScore,
  onComplete,
}: WifiSafetySimulationProps) {
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, NetworkAnswer>>({});
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const selectedNetwork = config.networks.find((n) => n.id === selectedNetworkId);
  const answeredCount = Object.keys(answers).length;
  const totalNetworks = config.networks.length;
  const allAnswered = answeredCount === totalNetworks;

  // Calculate score
  const correctAnswers = Object.values(answers).filter((a) => a.isCorrect).length;
  const score = totalNetworks > 0 ? Math.round((correctAnswers / totalNetworks) * 100) : 0;
  const passed = score >= passingScore;

  const handleAnswer = (isSafe: boolean) => {
    if (!selectedNetwork || answers[selectedNetwork.id]) return;

    const isCorrect = selectedNetwork.isSafe === isSafe;
    const newAnswer: NetworkAnswer = {
      networkId: selectedNetwork.id,
      userAnswer: isSafe,
      isCorrect,
    };

    setAnswers({ ...answers, [selectedNetwork.id]: newAnswer });
    setShowFeedback(true);

    // Auto-advance after feedback
    setTimeout(() => {
      setShowFeedback(false);
      // Find next unanswered network
      const nextNetwork = config.networks.find((n) => !answers[n.id] && n.id !== selectedNetwork.id);
      if (nextNetwork) {
        setSelectedNetworkId(nextNetwork.id);
      }
    }, 2500);
  };

  const handleSubmit = () => {
    setShowResults(true);
    const answersMap: Record<string, boolean> = {};
    Object.entries(answers).forEach(([id, answer]) => {
      answersMap[id] = answer.isCorrect;
    });
    onComplete(score, passed, answersMap);
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResults(false);
    setSelectedNetworkId(null);
    setShowFeedback(false);
  };

  // Get signal strength icon
  const getSignalIcon = (strength: string) => {
    const signalClass = strength === "strong" ? "text-green-600" : strength === "medium" ? "text-yellow-600" : "text-red-600";
    return <Signal className={`w-5 h-5 ${signalClass}`} />;
  };

  // Get security icon
  const getSecurityIcon = (securityType: string, requiresPassword: boolean) => {
    if (securityType === "open" || !requiresPassword) {
      return <Unlock className="w-5 h-5 text-red-600" />;
    }
    return <Lock className="w-5 h-5 text-green-600" />;
  };

  // Get security type badge
  const getSecurityBadge = (securityType: string) => {
    const securityColors: Record<string, string> = {
      open: "bg-red-600",
      WEP: "bg-orange-600",
      WPA: "bg-yellow-600",
      WPA2: "bg-green-600",
      WPA3: "bg-blue-600",
    };
    return (
      <Badge className={`${securityColors[securityType] || "bg-gray-600"} text-white`}>
        {securityType}
      </Badge>
    );
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8 text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            passed ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
          }`}>
            {passed ? (
              <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            )}
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {passed ? "Congratulations!" : "Keep Practicing!"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {passed
              ? "You've demonstrated strong WiFi safety skills."
              : "Review the networks and try again to improve your score."}
          </p>

          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{score}%</p>
              <p className="text-sm text-muted-foreground">Your Score</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{passingScore}%</p>
              <p className="text-sm text-muted-foreground">Passing Score</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">{correctAnswers}/{totalNetworks}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
          </div>

          {/* Results breakdown */}
          <div className="text-left mb-8">
            <h3 className="font-semibold mb-4">Results Breakdown</h3>
            <div className="space-y-3">
              {config.networks.map((network) => {
                const answer = answers[network.id];
                return (
                  <div
                    key={network.id}
                    className={`p-4 rounded-lg border ${
                      answer?.isCorrect
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                        : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {answer?.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Wifi className="w-5 h-5" />
                          <p className="font-medium">{network.ssid}</p>
                          {network.isHidden && <Badge variant="outline">Hidden</Badge>}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {getSignalIcon(network.signalStrength)}
                          {getSecurityIcon(network.securityType, network.requiresPassword)}
                          {getSecurityBadge(network.securityType)}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={network.isSafe ? "default" : "destructive"} className={network.isSafe ? "bg-green-600" : ""}>
                            Actually: {network.isSafe ? "Safe" : "Unsafe"}
                          </Badge>
                          <Badge variant="outline">
                            You said: {answer?.userAnswer ? "Safe" : "Unsafe"}
                          </Badge>
                        </div>
                        <div className="mt-3 p-3 bg-background rounded">
                          <p className="text-sm font-medium mb-1">Explanation:</p>
                          <p className="text-sm text-muted-foreground">{network.explanation}</p>
                        </div>
                        {network.redFlags && network.redFlags.length > 0 && (
                          <div className="mt-2 p-3 bg-background rounded">
                            <p className="text-sm font-medium mb-2">Red Flags:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {network.redFlags.map((flag, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <AlertTriangle className="w-3 h-3 mt-1 text-yellow-600" />
                                  {flag}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button onClick={handleRetry} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Instructions */}
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-4">
          <MapPin className="w-6 h-6 text-primary mt-1" />
          <div>
            <h3 className="font-semibold mb-2">{config.scenario}</h3>
            <p className="text-muted-foreground mb-2">Location: {config.location}</p>
            <p className="text-muted-foreground">{config.instructions}</p>
          </div>
        </div>
      </Card>

      {/* Progress */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">
            {answeredCount} of {totalNetworks} networks evaluated
          </span>
        </div>
        <Progress value={(answeredCount / totalNetworks) * 100} className="h-2" />
      </Card>

      {/* Network List */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wifi className="w-5 h-5" />
          <h2 className="font-semibold">Available Networks</h2>
        </div>

        <div className="space-y-3">
          {config.networks.map((network) => {
            const answer = answers[network.id];
            const isSelected = selectedNetworkId === network.id;

            return (
              <button
                key={network.id}
                onClick={() => setSelectedNetworkId(network.id)}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                } ${answer ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {answer ? (
                      answer.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )
                    ) : (
                      <Wifi className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{network.ssid}</p>
                        {network.isHidden && <Badge variant="outline" className="text-xs">Hidden</Badge>}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {getSignalIcon(network.signalStrength)}
                        <span className="capitalize">{network.signalStrength}</span>
                        <span>•</span>
                        {getSecurityBadge(network.securityType)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSecurityIcon(network.securityType, network.requiresPassword)}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Selected Network Details & Actions */}
      {selectedNetwork && (
        <Card className="p-6 mt-6 relative">
          <h3 className="font-semibold mb-4">Evaluate: {selectedNetwork.ssid}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Signal</p>
              <p className="font-medium capitalize">{selectedNetwork.signalStrength}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Security</p>
              <p className="font-medium">{selectedNetwork.securityType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Password</p>
              <p className="font-medium">{selectedNetwork.requiresPassword ? "Required" : "None"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hidden</p>
              <p className="font-medium">{selectedNetwork.isHidden ? "Yes" : "No"}</p>
            </div>
          </div>

          {/* Feedback Overlay */}
          {showFeedback && answers[selectedNetwork.id] && (
            <div className="absolute inset-0 bg-background/90 flex items-center justify-center z-10 rounded-lg">
              <div className={`p-8 rounded-lg text-center max-w-md ${
                answers[selectedNetwork.id].isCorrect
                  ? 'bg-green-100 dark:bg-green-900'
                  : 'bg-red-100 dark:bg-red-900'
              }`}>
                {answers[selectedNetwork.id].isCorrect ? (
                  <>
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600 dark:text-green-400" />
                    <h3 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-200">
                      Correct!
                    </h3>
                    <p className="text-green-700 dark:text-green-300">{selectedNetwork.explanation}</p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600 dark:text-red-400" />
                    <h3 className="text-xl font-semibold mb-2 text-red-800 dark:text-red-200">
                      Incorrect
                    </h3>
                    <p className="text-red-700 dark:text-red-300">{selectedNetwork.explanation}</p>
                  </>
                )}
              </div>
            </div>
          )}

          {!answers[selectedNetwork.id] && (
            <>
              <p className="text-center text-sm text-muted-foreground mb-4">
                Is it safe to connect to this network?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={() => handleAnswer(false)}
                  className="gap-2 min-w-40"
                >
                  <ShieldX className="w-5 h-5" />
                  Unsafe
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => handleAnswer(true)}
                  className="gap-2 min-w-40 bg-green-600 hover:bg-green-700"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Safe
                </Button>
              </div>
            </>
          )}

          {answers[selectedNetwork.id] && !showFeedback && (
            <div className={`p-4 rounded-lg ${
              answers[selectedNetwork.id].isCorrect
                ? 'bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800'
                : 'bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-start gap-3">
                {answers[selectedNetwork.id].isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div>
                  <p className="font-medium mb-1">
                    You said: {answers[selectedNetwork.id].userAnswer ? "Safe" : "Unsafe"}
                  </p>
                  <p className="text-sm">{selectedNetwork.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Submit Button */}
      {allAnswered && !showResults && (
        <div className="mt-6 text-center">
          <Button size="lg" onClick={handleSubmit} className="min-w-48">
            View Results
          </Button>
        </div>
      )}
    </div>
  );
}
