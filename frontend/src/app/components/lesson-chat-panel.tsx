import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Send, Bot, User, Lightbulb, Sparkles } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import api from "../services/api";

interface Message {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface AIResponse {
  response: string;
  timestamp: string;
}

interface LessonChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  lessonContent: string;
  courseTitle: string;
  messages: Message[];
  onMessagesChange: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
}

export function LessonChatPanel({
  isOpen,
  onClose,
  lessonTitle,
  lessonContent,
  courseTitle,
  messages,
  onMessagesChange,
}: LessonChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevLessonRef = useRef(lessonTitle);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Add context divider when lesson changes (only if chat has history)
  useEffect(() => {
    if (prevLessonRef.current !== lessonTitle && lessonTitle && messages.length > 1) {
      onMessagesChange((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "system" as const,
          content: `Now viewing: ${lessonTitle}`,
          timestamp: new Date(),
        },
      ]);
    }
    prevLessonRef.current = lessonTitle;
  }, [lessonTitle]);

  const suggestedPrompts = [
    `Explain the key concepts in this lesson`,
    "Can you give me a real-world example?",
    "What should I focus on for the quiz?",
    "Simplify this for me",
  ];

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await api.post<AIResponse>("/ai/chat", {
        message: userMessage,
        context: {
          courseTitle,
          lessonTitle,
          lessonContent: lessonContent.substring(0, 3000),
        },
      });
      if (!response.data?.response) {
        throw new Error("Invalid AI response format");
      }
      return response.data.response;
    } catch {
      return "Sorry, I couldn't process your question right now. Please try again in a moment.";
    }
  };

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: messageContent,
      timestamp: new Date(),
    };

    onMessagesChange((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const aiResponse = await getAIResponse(messageContent);

    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    onMessagesChange((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const hasConversation = messages.length > 1;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
      >
        <SheetHeader className="p-4 pb-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0 pr-6">
              <SheetTitle className="text-base">Lesson AI Assistant</SheetTitle>
              <SheetDescription className="truncate">
                {lessonTitle}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {/* Welcome message */}
          <div className="flex gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <Card className="p-3 max-w-[85%]">
              <p className="text-sm">
                Hi! I'm here to help you with{" "}
                <strong>{lessonTitle}</strong>. Ask me anything about this
                lesson!
              </p>
            </Card>
          </div>

          {messages.slice(1).map((message) =>
            message.role === "system" ? (
              <div
                key={message.id}
                className="flex items-center gap-2 py-1"
              >
                <div className="flex-1 h-px bg-border" />
                <Badge variant="outline" className="text-xs font-normal">
                  {message.content}
                </Badge>
                <div className="flex-1 h-px bg-border" />
              </div>
            ) : (
              <div
                key={message.id}
                className={`flex gap-2.5 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "assistant"
                      ? "bg-gradient-to-br from-primary to-accent"
                      : "bg-primary/10"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <User className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div
                  className={`flex-1 ${
                    message.role === "user" ? "flex justify-end" : ""
                  }`}
                >
                  <Card
                    className={`p-3 max-w-[85%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 text-sm"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            marked(message.content) as string
                          ),
                        }}
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    )}
                  </Card>
                </div>
              </div>
            )
          )}

          {isTyping && (
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <Card className="p-3">
                <div className="flex gap-1.5">
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {!hasConversation && (
          <div className="px-4 pb-2">
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium">Try asking:</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-left p-2 rounded-md border border-border hover:bg-muted/50 transition-colors text-xs leading-snug"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-border flex-shrink-0">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about this lesson..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 text-sm bg-input-background"
              disabled={isTyping}
            />
            <Button
              size="icon"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
