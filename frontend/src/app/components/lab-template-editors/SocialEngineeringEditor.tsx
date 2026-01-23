import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Plus,
  Trash2,
  MessageSquare,
  UserX,
  Copy,
  GripVertical,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { SocialEngineeringConfig } from "../../services/admin.service";

interface SocialEngineeringEditorProps {
  config: SocialEngineeringConfig | null;
  onChange: (config: SocialEngineeringConfig) => void;
}

interface MessageItem {
  id: string;
  attackerMessage: string;
  tacticUsed: string;
  tacticExplanation: string;
  responses: Array<{
    text: string;
    isCorrect: boolean;
    feedback: string;
  }>;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const socialEngineeringTactics = [
  { value: "authority", label: "Authority", description: "Claiming to be someone in power" },
  { value: "urgency", label: "Urgency", description: "Creating time pressure" },
  { value: "fear", label: "Fear", description: "Using threats or intimidation" },
  { value: "trust", label: "Trust/Rapport", description: "Building false relationship" },
  { value: "reciprocity", label: "Reciprocity", description: "Offering something to get something" },
  { value: "scarcity", label: "Scarcity", description: "Making something seem limited" },
  { value: "social_proof", label: "Social Proof", description: "Claiming others have complied" },
  { value: "liking", label: "Liking", description: "Being friendly to gain trust" },
];

const sampleScenario: SocialEngineeringConfig = {
  scenario: "Phone Call Social Engineering Attack",
  context: "You receive an unexpected phone call at your work desk. The caller claims to be from the IT department.",
  attackerName: "Mike from IT",
  attackerRole: "IT Support Technician",
  instructions: "Read each message from the caller and choose the most appropriate response. Be cautious of manipulation tactics.",
  messages: [
    {
      id: generateId(),
      attackerMessage: "Hi, this is Mike from IT Support. We've detected some unusual activity on your computer and I need to verify your account right away to prevent a security breach.",
      tacticUsed: "urgency",
      tacticExplanation: "The attacker creates urgency by claiming there's an immediate security threat that needs to be addressed right away.",
      responses: [
        { text: "Sure, what do you need from me?", isCorrect: false, feedback: "This response immediately complies without verification. Always verify the identity of callers before sharing information." },
        { text: "Can you give me your employee ID and callback number so I can verify this call?", isCorrect: true, feedback: "Excellent! Asking for verification is the right approach. Legitimate IT staff will understand and comply." },
        { text: "I'll just hang up.", isCorrect: false, feedback: "While being cautious is good, you should report suspicious calls to your actual IT department." },
      ],
    },
    {
      id: generateId(),
      attackerMessage: "I don't have time for verification - your computer could be compromised right now! I need your password to run a security scan. The Director of IT authorized this emergency procedure.",
      tacticUsed: "authority",
      tacticExplanation: "The attacker invokes authority by mentioning the 'Director of IT' to make their request seem legitimate and approved.",
      responses: [
        { text: "Okay, if the Director approved it, my password is...", isCorrect: false, feedback: "Never share your password! Legitimate IT staff never need your password and have other ways to access systems." },
        { text: "I'm sorry, but I can't share my password with anyone. I'll contact the IT helpdesk directly to verify this.", isCorrect: true, feedback: "Perfect response! Company policy should never require sharing passwords, regardless of who claims to authorize it." },
        { text: "Can you email me the authorization from the Director?", isCorrect: false, feedback: "While asking for documentation is good, attackers can forge emails. Always verify through official channels you initiate." },
      ],
    },
  ],
};

const defaultMessage: MessageItem = {
  id: generateId(),
  attackerMessage: "",
  tacticUsed: "authority",
  tacticExplanation: "",
  responses: [
    { text: "", isCorrect: false, feedback: "" },
    { text: "", isCorrect: true, feedback: "" },
  ],
};

export function SocialEngineeringEditor({ config, onChange }: SocialEngineeringEditorProps) {
  const [scenario, setScenario] = useState(config?.scenario || "");
  const [context, setContext] = useState(config?.context || "");
  const [attackerName, setAttackerName] = useState(config?.attackerName || "");
  const [attackerRole, setAttackerRole] = useState(config?.attackerRole || "");
  const [instructions, setInstructions] = useState(
    config?.instructions || "Read each message carefully and choose the most appropriate response. Watch out for social engineering tactics."
  );
  const [messages, setMessages] = useState<MessageItem[]>(
    config?.messages?.map(m => ({ ...m, id: m.id || generateId() })) || []
  );

  const updateConfig = (updates: Partial<SocialEngineeringConfig> = {}) => {
    onChange({
      scenario: updates.scenario ?? scenario,
      context: updates.context ?? context,
      attackerName: updates.attackerName ?? attackerName,
      attackerRole: updates.attackerRole ?? attackerRole,
      instructions: updates.instructions ?? instructions,
      messages: updates.messages ?? messages,
    });
  };

  const handleAddMessage = () => {
    const newMessage = { ...defaultMessage, id: generateId(), responses: [...defaultMessage.responses] };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    updateConfig({ messages: newMessages });
  };

  const handleLoadSample = () => {
    setScenario(sampleScenario.scenario);
    setContext(sampleScenario.context);
    setAttackerName(sampleScenario.attackerName);
    setAttackerRole(sampleScenario.attackerRole);
    setInstructions(sampleScenario.instructions);
    const newMessages = sampleScenario.messages.map(m => ({ ...m, id: generateId() }));
    setMessages(newMessages);
    onChange(sampleScenario);
  };

  const handleRemoveMessage = (id: string) => {
    const newMessages = messages.filter(m => m.id !== id);
    setMessages(newMessages);
    updateConfig({ messages: newMessages });
  };

  const handleDuplicateMessage = (message: MessageItem) => {
    const newMessage = {
      ...message,
      id: generateId(),
      responses: message.responses.map(r => ({ ...r })),
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    updateConfig({ messages: newMessages });
  };

  const handleMessageChange = (id: string, field: keyof MessageItem, value: any) => {
    const newMessages = messages.map(m => {
      if (m.id === id) {
        return { ...m, [field]: value };
      }
      return m;
    });
    setMessages(newMessages);
    updateConfig({ messages: newMessages });
  };

  const handleResponseChange = (messageId: string, responseIndex: number, field: string, value: any) => {
    const newMessages = messages.map(m => {
      if (m.id === messageId) {
        const newResponses = m.responses.map((r, i) => {
          if (i === responseIndex) {
            return { ...r, [field]: value };
          }
          // If setting isCorrect to true, set others to false
          if (field === 'isCorrect' && value === true) {
            return { ...r, isCorrect: false };
          }
          return r;
        });
        // Apply the correct value to the target response
        if (field === 'isCorrect') {
          newResponses[responseIndex] = { ...newResponses[responseIndex], isCorrect: value };
        }
        return { ...m, responses: newResponses };
      }
      return m;
    });
    setMessages(newMessages);
    updateConfig({ messages: newMessages });
  };

  const handleAddResponse = (messageId: string) => {
    const newMessages = messages.map(m => {
      if (m.id === messageId) {
        return {
          ...m,
          responses: [...m.responses, { text: "", isCorrect: false, feedback: "" }],
        };
      }
      return m;
    });
    setMessages(newMessages);
    updateConfig({ messages: newMessages });
  };

  const handleRemoveResponse = (messageId: string, responseIndex: number) => {
    const newMessages = messages.map(m => {
      if (m.id === messageId) {
        return {
          ...m,
          responses: m.responses.filter((_, i) => i !== responseIndex),
        };
      }
      return m;
    });
    setMessages(newMessages);
    updateConfig({ messages: newMessages });
  };

  return (
    <div className="space-y-6">
      {/* Scenario Setup */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Scenario Setup</h2>
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Load Sample Scenario
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scenario">Scenario Title</Label>
            <Input
              id="scenario"
              value={scenario}
              onChange={(e) => {
                setScenario(e.target.value);
                updateConfig({ scenario: e.target.value });
              }}
              placeholder="e.g., Phone Call Social Engineering Attack"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attackerName">Attacker's Claimed Name</Label>
            <Input
              id="attackerName"
              value={attackerName}
              onChange={(e) => {
                setAttackerName(e.target.value);
                updateConfig({ attackerName: e.target.value });
              }}
              placeholder="e.g., Mike from IT"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attackerRole">Attacker's Claimed Role</Label>
            <Input
              id="attackerRole"
              value={attackerRole}
              onChange={(e) => {
                setAttackerRole(e.target.value);
                updateConfig({ attackerRole: e.target.value });
              }}
              placeholder="e.g., IT Support Technician"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="context">Context / Scene Setting</Label>
          <Textarea
            id="context"
            value={context}
            onChange={(e) => {
              setContext(e.target.value);
              updateConfig({ context: e.target.value });
            }}
            placeholder="Describe the situation... e.g., You receive an unexpected phone call at your work desk."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Instructions for Students</Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => {
              setInstructions(e.target.value);
              updateConfig({ instructions: e.target.value });
            }}
            placeholder="Instructions shown before the simulation starts..."
            rows={2}
          />
        </div>
      </Card>

      {/* Messages */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Conversation Messages</h2>
            <p className="text-sm text-muted-foreground">
              Create the attacker's messages and response options
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{messages.length} messages</Badge>
            <Button size="sm" onClick={handleAddMessage}>
              <Plus className="w-4 h-4 mr-2" />
              Add Message
            </Button>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <UserX className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add attacker messages to create the social engineering scenario.
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={handleLoadSample}>
                Load Sample Scenario
              </Button>
              <Button onClick={handleAddMessage}>
                Add First Message
              </Button>
            </div>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {messages.map((message, index) => (
              <AccordionItem key={message.id} value={message.id} className="border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-4 w-full">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <Badge variant="outline">#{index + 1}</Badge>
                    <Badge variant="secondary">
                      {socialEngineeringTactics.find(t => t.value === message.tacticUsed)?.label || message.tacticUsed}
                    </Badge>
                    <span className="font-medium truncate flex-1 text-left">
                      {message.attackerMessage.substring(0, 50) || "New message..."}
                      {message.attackerMessage.length > 50 ? "..." : ""}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {message.responses.length} responses
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4 pt-4">
                    {/* Attacker Message */}
                    <div className="space-y-2">
                      <Label>Attacker's Message</Label>
                      <Textarea
                        value={message.attackerMessage}
                        onChange={(e) => handleMessageChange(message.id, 'attackerMessage', e.target.value)}
                        placeholder="What does the attacker say..."
                        rows={3}
                      />
                    </div>

                    {/* Tactic */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Social Engineering Tactic Used</Label>
                        <Select
                          value={message.tacticUsed}
                          onValueChange={(v) => handleMessageChange(message.id, 'tacticUsed', v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {socialEngineeringTactics.map((tactic) => (
                              <SelectItem key={tactic.value} value={tactic.value}>
                                <div>
                                  <span className="font-medium">{tactic.label}</span>
                                  <span className="text-muted-foreground ml-2">- {tactic.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Tactic Explanation (shown after)</Label>
                        <Textarea
                          value={message.tacticExplanation}
                          onChange={(e) => handleMessageChange(message.id, 'tacticExplanation', e.target.value)}
                          placeholder="Explain how this tactic is being used..."
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Responses */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Response Options</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddResponse(message.id)}
                          disabled={message.responses.length >= 4}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Response
                        </Button>
                      </div>

                      {message.responses.map((response, rIndex) => (
                        <div
                          key={rIndex}
                          className={`p-4 border rounded-lg space-y-3 ${
                            response.isCorrect
                              ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/50'
                              : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={response.isCorrect ? "default" : "outline"}>
                                Option {rIndex + 1}
                              </Badge>
                              {response.isCorrect && (
                                <Badge className="bg-green-600">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Correct Answer
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-sm">Correct?</Label>
                              <Switch
                                checked={response.isCorrect}
                                onCheckedChange={(checked) =>
                                  handleResponseChange(message.id, rIndex, 'isCorrect', checked)
                                }
                              />
                              {message.responses.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveResponse(message.id, rIndex)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Response Text</Label>
                            <Input
                              value={response.text}
                              onChange={(e) =>
                                handleResponseChange(message.id, rIndex, 'text', e.target.value)
                              }
                              placeholder="What the student could say..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Feedback (shown after selection)</Label>
                            <Textarea
                              value={response.feedback}
                              onChange={(e) =>
                                handleResponseChange(message.id, rIndex, 'feedback', e.target.value)
                              }
                              placeholder="Explain why this is a good/bad response..."
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}

                      {!message.responses.some(r => r.isCorrect) && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <AlertTriangle className="w-4 h-4 inline mr-2" />
                            No correct answer selected. Mark one response as correct.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicateMessage(message)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveMessage(message.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {messages.length > 0 && messages.length < 2 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Add at least 2 messages for a meaningful conversation simulation.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
