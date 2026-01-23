import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  UserX,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Trophy,
  MessageSquare,
  Shield,
  Info,
} from "lucide-react";
import { SocialEngineeringConfig } from "../../services/admin.service";

interface SocialEngineeringSimulationProps {
  config: SocialEngineeringConfig;
  passingScore: number;
  onComplete: (score: number, passed: boolean, answers: Record<string, boolean>) => void;
}

interface Answer {
  messageId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

const tacticLabels: Record<string, string> = {
  authority: "Authority",
  urgency: "Urgency",
  fear: "Fear",
  trust: "Trust/Rapport",
  reciprocity: "Reciprocity",
  scarcity: "Scarcity",
  social_proof: "Social Proof",
  liking: "Liking",
};

export function SocialEngineeringSimulation({
  config,
  passingScore,
  onComplete,
}: SocialEngineeringSimulationProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentMessage = config.messages[currentMessageIndex];
  const answeredCount = Object.keys(answers).length;
  const totalMessages = config.messages.length;
  const isCurrentAnswered = currentMessage && answers[currentMessage.id];

  // Calculate score
  const correctAnswers = Object.values(answers).filter((a) => a.isCorrect).length;
  const score = totalMessages > 0 ? Math.round((correctAnswers / totalMessages) * 100) : 0;
  const passed = score >= passingScore;

  const handleSelectResponse = (responseIndex: number) => {
    if (isCurrentAnswered || !currentMessage) return;

    const response = currentMessage.responses[responseIndex];
    const newAnswer: Answer = {
      messageId: currentMessage.id,
      selectedIndex: responseIndex,
      isCorrect: response.isCorrect,
    };

    setAnswers({ ...answers, [currentMessage.id]: newAnswer });
    setShowFeedback(true);
  };

  const handleContinue = () => {
    setShowFeedback(false);
    if (currentMessageIndex < totalMessages - 1) {
      setCurrentMessageIndex(currentMessageIndex + 1);
    } else {
      // All messages answered
      handleSubmit();
    }
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
    setCurrentMessageIndex(0);
    setShowFeedback(false);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto p-6">
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
            {passed ? "Great Awareness!" : "Stay Vigilant!"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {passed
              ? "You successfully identified and handled the social engineering attempt."
              : "Review the tactics used and practice responding to these manipulation attempts."}
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
              <p className="text-4xl font-bold text-green-600">{correctAnswers}/{totalMessages}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
          </div>

          {/* Results breakdown */}
          <div className="text-left mb-8">
            <h3 className="font-semibold mb-4">Conversation Review</h3>
            <div className="space-y-4">
              {config.messages.map((message, index) => {
                const answer = answers[message.id];
                const selectedResponse = answer ? message.responses[answer.selectedIndex] : null;
                const correctResponse = message.responses.find(r => r.isCorrect);

                return (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border ${
                      answer?.isCorrect
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                        : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {answer?.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Message {index + 1}</Badge>
                          <Badge variant="secondary">
                            {tacticLabels[message.tacticUsed] || message.tacticUsed}
                          </Badge>
                        </div>

                        {/* Attacker message */}
                        <div className="p-3 bg-background rounded mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <UserX className="w-4 h-4 text-red-500" />
                            <span className="font-medium text-sm">{config.attackerName}</span>
                          </div>
                          <p className="text-sm">{message.attackerMessage}</p>
                        </div>

                        {/* Your response */}
                        <div className="flex gap-2 mb-2">
                          <Badge variant={answer?.isCorrect ? "default" : "destructive"}>
                            Your response: {selectedResponse?.text.substring(0, 40)}...
                          </Badge>
                        </div>

                        {!answer?.isCorrect && correctResponse && (
                          <div className="p-2 bg-green-100 dark:bg-green-900 rounded text-sm mb-2">
                            <span className="font-medium">Better response: </span>
                            {correctResponse.text}
                          </div>
                        )}

                        {/* Tactic explanation */}
                        <div className="p-3 bg-background rounded">
                          <p className="text-sm flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                            <span>
                              <strong>Tactic: {tacticLabels[message.tacticUsed]}</strong> - {message.tacticExplanation}
                            </span>
                          </p>
                        </div>
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
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-1">{config.scenario}</h2>
            <p className="text-muted-foreground">{config.context}</p>
          </div>
        </div>
      </Card>

      {/* Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Conversation Progress</span>
          <span className="text-sm text-muted-foreground">
            Message {currentMessageIndex + 1} of {totalMessages}
          </span>
        </div>
        <Progress value={((currentMessageIndex + (isCurrentAnswered ? 1 : 0)) / totalMessages) * 100} className="h-2" />
      </Card>

      {/* Chat Interface */}
      <Card className="p-6">
        {currentMessage && (
          <div className="space-y-6">
            {/* Attacker Message */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
                <UserX className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{config.attackerName}</span>
                  <Badge variant="secondary" className="text-xs">{config.attackerRole}</Badge>
                </div>
                <div className="p-4 bg-muted rounded-lg rounded-tl-none">
                  <p>{currentMessage.attackerMessage}</p>
                </div>
              </div>
            </div>

            {/* Response Options or Feedback */}
            {showFeedback && isCurrentAnswered ? (
              <div className="space-y-4">
                {/* Selected Response */}
                <div className="flex gap-4 justify-end">
                  <div className="flex-1 max-w-md">
                    <div className="flex items-center gap-2 mb-2 justify-end">
                      <Badge variant="secondary" className="text-xs">Your Response</Badge>
                      <span className="font-semibold">You</span>
                    </div>
                    <div className={`p-4 rounded-lg rounded-tr-none ${
                      isCurrentAnswered.isCorrect
                        ? 'bg-green-100 dark:bg-green-900'
                        : 'bg-red-100 dark:bg-red-900'
                    }`}>
                      <p>{currentMessage.responses[isCurrentAnswered.selectedIndex].text}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                </div>

                {/* Feedback */}
                <div className={`p-4 rounded-lg ${
                  isCurrentAnswered.isCorrect
                    ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-start gap-3">
                    {isCurrentAnswered.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold mb-1">
                        {isCurrentAnswered.isCorrect ? 'Correct Response!' : 'Not the Best Response'}
                      </p>
                      <p className="text-sm mb-3">
                        {currentMessage.responses[isCurrentAnswered.selectedIndex].feedback}
                      </p>

                      <div className="p-3 bg-background rounded">
                        <p className="text-sm">
                          <strong>Tactic Used: </strong>
                          <Badge variant="outline" className="ml-1">
                            {tacticLabels[currentMessage.tacticUsed] || currentMessage.tacticUsed}
                          </Badge>
                        </p>
                        <p className="text-sm mt-2 text-muted-foreground">
                          {currentMessage.tacticExplanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleContinue} className="w-full">
                  {currentMessageIndex < totalMessages - 1 ? 'Continue Conversation' : 'View Results'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    How do you respond?
                  </span>
                </div>

                {currentMessage.responses.map((response, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-4 px-4"
                    onClick={() => handleSelectResponse(index)}
                  >
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="flex-1">{response.text}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Tips */}
      <Card className="p-4 bg-muted/50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Remember</p>
            <p className="text-sm text-muted-foreground">
              {config.instructions}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
