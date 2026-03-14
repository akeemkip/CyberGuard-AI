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
  ShieldAlert,
  Copy,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { IncidentResponseConfig } from "../../services/admin.service";

interface IncidentResponseEditorProps {
  config: IncidentResponseConfig | null;
  onChange: (config: IncidentResponseConfig) => void;
}

interface StepItem {
  id: string;
  situation: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
    feedback: string;
    nextStep?: string;
  }>;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const sampleScenario: IncidentResponseConfig = {
  scenario: "You receive an email notification that your password was changed, but you didn't change it.",
  steps: [
    {
      id: "step1",
      situation: "You receive an email saying your password was changed 5 minutes ago, but you didn't change it. What should you do first?",
      options: [
        {
          text: "Ignore it - it's probably a mistake",
          isCorrect: false,
          feedback: "Never ignore security alerts. This could indicate your account has been compromised and needs immediate attention.",
        },
        {
          text: "Immediately try to log in to your account",
          isCorrect: true,
          feedback: "Correct! The first step is to verify if you can still access your account. If you can log in, change your password immediately. If not, proceed to account recovery.",
          nextStep: "step2",
        },
        {
          text: "Click the link in the email to verify the change",
          isCorrect: false,
          feedback: "Never click links in unexpected emails. This could be a phishing attempt. Always navigate directly to the service's official website.",
        },
        {
          text: "Reply to the email asking for more information",
          isCorrect: false,
          feedback: "Don't reply to automated security emails. If you need help, contact support through official channels, not by replying to emails.",
        },
      ],
    },
    {
      id: "step2",
      situation: "You successfully logged in and changed your password. What should you do next?",
      options: [
        {
          text: "Nothing - the problem is solved",
          isCorrect: false,
          feedback: "Changing the password is important, but not sufficient. You should take additional security measures to secure your account.",
        },
        {
          text: "Enable two-factor authentication (2FA) if not already enabled",
          isCorrect: true,
          feedback: "Excellent! Enabling 2FA adds an extra layer of security. Even if someone has your password, they can't access your account without the second factor.",
          nextStep: "step3",
        },
        {
          text: "Delete your account to be safe",
          isCorrect: false,
          feedback: "Deleting your account is an extreme measure. With proper security steps, you can secure your account without losing your data.",
        },
      ],
    },
    {
      id: "step3",
      situation: "After securing your account, what else should you check?",
      options: [
        {
          text: "Review recent account activity and connected devices",
          isCorrect: true,
          feedback: "Perfect! Check for any suspicious login locations, times, or devices you don't recognize. Remove any unauthorized devices and revoke suspicious sessions.",
        },
        {
          text: "Nothing else needs to be done",
          isCorrect: false,
          feedback: "It's important to review account activity to understand the extent of the breach and remove any unauthorized access.",
        },
        {
          text: "Contact the FBI immediately",
          isCorrect: false,
          feedback: "While serious, a personal account compromise doesn't typically require FBI involvement. Focus on securing your account first.",
        },
      ],
    },
  ],
};

const defaultStep: StepItem = {
  id: generateId(),
  situation: "",
  options: [
    { text: "", isCorrect: false, feedback: "" },
    { text: "", isCorrect: true, feedback: "" },
  ],
};

export function IncidentResponseEditor({ config, onChange }: IncidentResponseEditorProps) {
  const [scenario, setScenario] = useState(config?.scenario || "");
  const [steps, setSteps] = useState<StepItem[]>(
    config?.steps?.map(s => ({ ...s, id: s.id || generateId() })) || []
  );

  const updateConfig = (updates: Partial<IncidentResponseConfig> = {}) => {
    onChange({
      scenario: updates.scenario ?? scenario,
      steps: updates.steps ?? steps,
    });
  };

  const handleAddStep = () => {
    const newStep = { ...defaultStep, id: generateId(), options: [...defaultStep.options.map(o => ({ ...o }))] };
    const newSteps = [...steps, newStep];
    setSteps(newSteps);
    updateConfig({ steps: newSteps });
  };

  const handleLoadSample = () => {
    setScenario(sampleScenario.scenario);
    const newSteps = sampleScenario.steps.map(s => ({ ...s, id: s.id || generateId() }));
    setSteps(newSteps);
    onChange(sampleScenario);
  };

  const handleRemoveStep = (id: string) => {
    const newSteps = steps.filter(s => s.id !== id);
    setSteps(newSteps);
    updateConfig({ steps: newSteps });
  };

  const handleDuplicateStep = (step: StepItem) => {
    const newStep = {
      ...step,
      id: generateId(),
      options: step.options.map(o => ({ ...o })),
    };
    const newSteps = [...steps, newStep];
    setSteps(newSteps);
    updateConfig({ steps: newSteps });
  };

  const handleStepChange = (id: string, field: keyof StepItem, value: any) => {
    const newSteps = steps.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    });
    setSteps(newSteps);
    updateConfig({ steps: newSteps });
  };

  const handleOptionChange = (stepId: string, optionIndex: number, field: string, value: any) => {
    const newSteps = steps.map(s => {
      if (s.id === stepId) {
        const newOptions = s.options.map((o, i) => {
          if (i === optionIndex) {
            return { ...o, [field]: value };
          }
          return o;
        });
        return { ...s, options: newOptions };
      }
      return s;
    });
    setSteps(newSteps);
    updateConfig({ steps: newSteps });
  };

  const handleAddOption = (stepId: string) => {
    const newSteps = steps.map(s => {
      if (s.id === stepId) {
        return {
          ...s,
          options: [...s.options, { text: "", isCorrect: false, feedback: "" }],
        };
      }
      return s;
    });
    setSteps(newSteps);
    updateConfig({ steps: newSteps });
  };

  const handleRemoveOption = (stepId: string, optionIndex: number) => {
    const newSteps = steps.map(s => {
      if (s.id === stepId) {
        return {
          ...s,
          options: s.options.filter((_, i) => i !== optionIndex),
        };
      }
      return s;
    });
    setSteps(newSteps);
    updateConfig({ steps: newSteps });
  };

  return (
    <div className="space-y-6">
      {/* Scenario Setup */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Scenario Setup</h2>
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            <ShieldAlert className="w-4 h-4 mr-2" />
            Load Sample Scenario
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scenario">Initial Scenario Description</Label>
          <Textarea
            id="scenario"
            value={scenario}
            onChange={(e) => {
              setScenario(e.target.value);
              updateConfig({ scenario: e.target.value });
            }}
            placeholder="Describe the initial incident situation..."
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            This sets the scene for the incident response scenario
          </p>
        </div>
      </Card>

      {/* Steps List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Response Steps</h2>
            <p className="text-sm text-muted-foreground">
              {steps.length} step(s) configured. Create a decision tree with branching paths.
            </p>
          </div>
          <Button onClick={handleAddStep}>
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </Button>
        </div>

        {steps.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No steps configured. Click "Add Step" to create your first incident response step.
          </div>
        )}

        <Accordion type="multiple" className="space-y-4">
          {steps.map((step, index) => {
            const correctCount = step.options.filter(o => o.isCorrect).length;
            return (
              <AccordionItem key={step.id} value={step.id} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Step {index + 1}</Badge>
                      <Badge variant={correctCount > 0 ? "default" : "secondary"} className={correctCount > 0 ? "bg-green-600" : ""}>
                        {step.options.length} options
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {step.situation || "Untitled Step"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {step.id}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  {/* Step Situation */}
                  <div className="space-y-2">
                    <Label>Situation Description</Label>
                    <Textarea
                      value={step.situation}
                      onChange={(e) => handleStepChange(step.id, "situation", e.target.value)}
                      placeholder="Describe the situation at this step..."
                      rows={2}
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Response Options</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddOption(step.id)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Option
                      </Button>
                    </div>

                    {step.options.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No options added</p>
                    ) : (
                      <div className="space-y-4">
                        {step.options.map((option, optionIndex) => (
                          <Card key={optionIndex} className="p-4 bg-muted/50">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">
                                    Option {String.fromCharCode(65 + optionIndex)}
                                  </Badge>
                                  {option.isCorrect && (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveOption(step.id, optionIndex)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs">Option Text</Label>
                                <Textarea
                                  value={option.text}
                                  onChange={(e) => handleOptionChange(step.id, optionIndex, "text", e.target.value)}
                                  placeholder="What action can the user take?"
                                  rows={2}
                                />
                              </div>

                              <div className="flex items-center gap-3">
                                <Switch
                                  checked={option.isCorrect}
                                  onCheckedChange={(checked) => handleOptionChange(step.id, optionIndex, "isCorrect", checked)}
                                />
                                <Label className="text-xs cursor-pointer">
                                  {option.isCorrect ? "Correct Response" : "Incorrect Response"}
                                </Label>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs">Feedback</Label>
                                <Textarea
                                  value={option.feedback}
                                  onChange={(e) => handleOptionChange(step.id, optionIndex, "feedback", e.target.value)}
                                  placeholder="Explain why this is correct or incorrect..."
                                  rows={2}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs">Next Step (Optional - for branching)</Label>
                                <Select
                                  value={option.nextStep || "none"}
                                  onValueChange={(value) => handleOptionChange(step.id, optionIndex, "nextStep", value === "none" ? undefined : value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sequential (no branching)" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">Sequential (no branching)</SelectItem>
                                    {steps.map((s, i) => (
                                      <SelectItem key={s.id} value={s.id}>
                                        Jump to Step {i + 1} ({s.id})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                  Leave as "Sequential" for normal flow, or select a specific step to branch to
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Validation Warning */}
                  {step.options.length > 0 && correctCount === 0 && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        At least one option should be marked as correct
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateStep(step)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveStep(step.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Step
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Card>
    </div>
  );
}
