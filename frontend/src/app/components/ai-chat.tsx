import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Shield, 
  Moon, 
  Sun,
  Send,
  Sparkles,
  ChevronLeft,
  Bot,
  User,
  Lightbulb,
  Menu,
  AlertCircle,
  Loader
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { UserProfileDropdown } from "./user-profile-dropdown";
import { sendMessageToCopilot, getCybersecurityContext, type ChatMessage } from "../services/copilot.service";

interface AIChatProps {
  userEmail: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

type ConversationMessage = ChatMessage;

const suggestedPrompts = [
  "What is phishing and how can I identify it?",
  "Explain password security best practices",
  "How do I recognize social engineering attacks?",
  "What should I do if I click on a suspicious link?",
];

// Fallback responses for when API is unavailable
const aiResponses: { [key: string]: string } = {
  "default": "I'm here to help you with cybersecurity questions! I can assist with topics like phishing detection, password security, social engineering, threat identification, and more. What would you like to learn about?",
  "phishing": "Phishing is a type of cyber attack where attackers impersonate legitimate organizations to steal sensitive information. Here are key ways to identify phishing:\n\n1. Check the sender's email address carefully\n2. Look for urgent or threatening language\n3. Verify links before clicking (hover to see actual URL)\n4. Be suspicious of requests for personal information\n5. Check for spelling and grammar errors\n\nWould you like me to explain any of these in more detail?",
  "password": "Here are essential password security best practices:\n\n1. Use unique passwords for each account\n2. Make passwords at least 12 characters long\n3. Include a mix of uppercase, lowercase, numbers, and symbols\n4. Use a password manager to store them securely\n5. Enable multi-factor authentication (MFA) whenever possible\n6. Never share passwords via email or text\n7. Change passwords if you suspect a breach\n\nWould you like tips on creating strong, memorable passwords?",
  "social": "Social engineering is the psychological manipulation of people to divulge confidential information or perform actions. Common tactics include:\n\n1. Pretexting - Creating a false scenario to gain trust\n2. Baiting - Offering something enticing to trick victims\n3. Quid pro quo - Promising a benefit in exchange for information\n4. Tailgating - Following authorized personnel into restricted areas\n\nDefense strategies:\n- Be skeptical of unsolicited contact\n- Verify identities independently\n- Don't share sensitive information easily\n- Follow security protocols strictly\n\nWhat aspect would you like to explore further?",
  "link": "If you've clicked on a suspicious link, take these immediate steps:\n\n1. Disconnect from the internet (disable Wi-Fi/Ethernet)\n2. Don't enter any personal information\n3. Run a security scan with updated antivirus software\n4. Clear your browser cache and cookies\n5. Change passwords for important accounts (from a different device)\n6. Report the incident to your IT security team\n7. Monitor your accounts for unusual activity\n8. Consider enabling credit monitoring if financial info may be compromised\n\nRemember: Acting quickly can minimize potential damage. Do you need help with any specific step?",
};

export function AIChat({ userEmail, onNavigate, onLogout }: AIChatProps) {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your AI cybersecurity assistant. I'm here to help you learn about security best practices, answer questions, and guide you through your training. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get fallback response (for when API is unavailable)
  const getFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("phish")) {
      return aiResponses.phishing;
    } else if (lowerMessage.includes("password") || lowerMessage.includes("credential")) {
      return aiResponses.password;
    } else if (lowerMessage.includes("social engineering") || lowerMessage.includes("manipulation")) {
      return aiResponses.social;
    } else if (lowerMessage.includes("click") && lowerMessage.includes("link")) {
      return aiResponses.link;
    } else {
      return aiResponses.default;
    }
  };

  // Send message to Copilot API with streaming
  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    setError(null);
    abortControllerRef.current = new AbortController();

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Add to conversation history for context
    const updatedHistory: ConversationMessage[] = [
      ...conversationHistory,
      { role: "user", content: messageContent },
    ];
    setConversationHistory(updatedHistory);

    try {
      // Create placeholder message for streaming response
      const assistantMessageId = messages.length + 2;
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        streaming: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Prepare messages for API (include system context)
      const systemContext = getCybersecurityContext(messageContent);
      const apiMessages: ConversationMessage[] = [
        ...systemContext,
        ...updatedHistory,
      ];

      let fullResponse = "";

      // Call Copilot API with streaming
      try {
        fullResponse = await sendMessageToCopilot(
          apiMessages,
          (chunk: string) => {
            fullResponse += chunk;
            // Update the streaming message in real-time
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: fullResponse }
                  : msg
              )
            );
          },
          true // Enable streaming
        );

        // Update conversation history with the complete response
        setConversationHistory([
          ...updatedHistory,
          { role: "assistant", content: fullResponse },
        ]);

        // Mark message as no longer streaming
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, streaming: false }
              : msg
          )
        );
      } catch (apiError) {
        // Fallback to hardcoded response if API fails
        console.warn("Copilot API error, using fallback response:", apiError);
        const fallbackResponse = getFallbackResponse(messageContent);
        
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { 
                  ...msg, 
                  content: fallbackResponse,
                  streaming: false,
                }
              : msg
          )
        );

        setConversationHistory([
          ...updatedHistory,
          { role: "assistant", content: fallbackResponse },
        ]);

        // Show warning to user
        if (apiError instanceof Error) {
          setError(`API Unavailable - Using fallback response. Error: ${apiError.message}`);
        } else {
          setError("API Unavailable - Using fallback response.");
        }

        // Clear error after 5 seconds
        setTimeout(() => setError(null), 5000);
      }

      setIsTyping(false);
    } catch (err) {
      console.error("Error handling message:", err);
      setIsTyping(false);
      setError("Failed to process your message. Please try again.");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
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
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold">AI Assistant</h1>
                <p className="text-sm text-muted-foreground">Always here to help</p>
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

      {/* Chat Container */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === "assistant" 
                  ? "bg-gradient-to-br from-primary to-accent" 
                  : "bg-primary/10"
              }`}>
                {message.role === "assistant" ? (
                  <Bot className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className={`flex-1 ${message.role === "user" ? "flex justify-end" : ""}`}>
                <Card className={`p-4 max-w-[80%] ${
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card"
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.streaming && (
                    <div className="inline-block ml-2 w-2 h-2 bg-current rounded-full animate-pulse" />
                  )}
                  <p className={`text-xs mt-2 ${
                    message.role === "user" 
                      ? "text-primary-foreground/70" 
                      : "text-muted-foreground"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </Card>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <Card className="p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Suggested questions:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <Card className="p-4">
          <div className="flex gap-3">
            <Input
              placeholder="Ask me anything about cybersecurity..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-input-background"
              disabled={isTyping}
            />
            {isTyping ? (
              <Button 
                onClick={handleStopStreaming}
                variant="destructive"
              >
                <Loader className="w-4 h-4 animate-spin" />
              </Button>
            ) : (
              <Button 
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </Card>
      </div>
    </div>
  );
}
