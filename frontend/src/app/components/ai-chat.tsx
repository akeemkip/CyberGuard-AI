import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Moon,
  Sun,
  Send,
  Sparkles,
  ChevronLeft,
  Bot,
  User,
  Lightbulb
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { UserProfileDropdown } from "./user-profile-dropdown";
import api from "../services/api";

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
}

interface AIResponse {
  response: string;
  timestamp: string;
}

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get AI response from backend API (with fallback to keyword matching)
  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Call backend AI API
      const response = await api.post<AIResponse>('/ai/chat', { message: userMessage });
      return response.data.response;
    } catch (error) {
      console.warn('AI API unavailable, using fallback responses:', error);

      // Fallback to keyword matching if API fails
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
    }
  };

  // Send message and get AI response
  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

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

    // Simulate thinking delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Get AI response (from API or fallback)
    const aiResponse = await getAIResponse(messageContent);

    // Add AI response
    const assistantMessage: Message = {
      id: messages.length + 2,
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </Card>
      </div>
    </div>
  );
}
