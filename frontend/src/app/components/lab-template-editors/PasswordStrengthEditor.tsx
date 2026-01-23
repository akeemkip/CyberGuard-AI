import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import {
  Plus,
  Trash2,
  Key,
  ShieldCheck,
  AlertTriangle,
  Info,
} from "lucide-react";
import { PasswordStrengthConfig } from "../../services/admin.service";

interface PasswordStrengthEditorProps {
  config: PasswordStrengthConfig | null;
  onChange: (config: PasswordStrengthConfig) => void;
}

const commonBannedPasswords = [
  "password",
  "123456",
  "password123",
  "qwerty",
  "letmein",
  "welcome",
  "admin",
  "login",
  "abc123",
  "iloveyou",
  "monkey",
  "master",
  "dragon",
  "baseball",
  "football",
  "shadow",
  "sunshine",
  "princess",
  "trustno1",
  "passw0rd",
];

const defaultHints = [
  "Use a mix of uppercase and lowercase letters",
  "Include numbers but avoid obvious sequences like 123",
  "Add special characters like !@#$%",
  "Make it at least 12 characters long",
  "Consider using a passphrase - multiple random words strung together",
  "Avoid personal information like birthdays or names",
  "Don't use dictionary words that can be easily guessed",
];

export function PasswordStrengthEditor({ config, onChange }: PasswordStrengthEditorProps) {
  const [scenario, setScenario] = useState(
    config?.scenario || "You need to create a strong password for your new corporate account. The password must meet security requirements to protect sensitive company data."
  );
  const [minLength, setMinLength] = useState(config?.requirements?.minLength || 12);
  const [requireUppercase, setRequireUppercase] = useState(config?.requirements?.requireUppercase ?? true);
  const [requireNumbers, setRequireNumbers] = useState(config?.requirements?.requireNumbers ?? true);
  const [requireSpecial, setRequireSpecial] = useState(config?.requirements?.requireSpecial ?? true);
  const [bannedPasswords, setBannedPasswords] = useState<string[]>(config?.bannedPasswords || []);
  const [hints, setHints] = useState<string[]>(config?.hints || []);
  const [newBannedPassword, setNewBannedPassword] = useState("");
  const [newHint, setNewHint] = useState("");

  const updateConfig = (updates: Partial<{
    scenario: string;
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecial: boolean;
    bannedPasswords: string[];
    hints: string[];
  }>) => {
    onChange({
      scenario: updates.scenario ?? scenario,
      requirements: {
        minLength: updates.minLength ?? minLength,
        requireUppercase: updates.requireUppercase ?? requireUppercase,
        requireNumbers: updates.requireNumbers ?? requireNumbers,
        requireSpecial: updates.requireSpecial ?? requireSpecial,
      },
      bannedPasswords: updates.bannedPasswords ?? bannedPasswords,
      hints: updates.hints ?? hints,
    });
  };

  const handleAddBannedPassword = () => {
    if (newBannedPassword.trim() && !bannedPasswords.includes(newBannedPassword.toLowerCase())) {
      const newList = [...bannedPasswords, newBannedPassword.toLowerCase()];
      setBannedPasswords(newList);
      setNewBannedPassword("");
      updateConfig({ bannedPasswords: newList });
    }
  };

  const handleRemoveBannedPassword = (password: string) => {
    const newList = bannedPasswords.filter(p => p !== password);
    setBannedPasswords(newList);
    updateConfig({ bannedPasswords: newList });
  };

  const handleAddCommonBannedPasswords = () => {
    const newList = [...new Set([...bannedPasswords, ...commonBannedPasswords])];
    setBannedPasswords(newList);
    updateConfig({ bannedPasswords: newList });
  };

  const handleAddHint = () => {
    if (newHint.trim() && !hints.includes(newHint)) {
      const newList = [...hints, newHint];
      setHints(newList);
      setNewHint("");
      updateConfig({ hints: newList });
    }
  };

  const handleRemoveHint = (hint: string) => {
    const newList = hints.filter(h => h !== hint);
    setHints(newList);
    updateConfig({ hints: newList });
  };

  const handleAddDefaultHints = () => {
    const newList = [...new Set([...hints, ...defaultHints])];
    setHints(newList);
    updateConfig({ hints: newList });
  };

  const requirementCount = [requireUppercase, requireNumbers, requireSpecial].filter(Boolean).length + 1; // +1 for minLength

  return (
    <div className="space-y-6">
      {/* Scenario */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Scenario</h2>
        <div className="space-y-2">
          <Label htmlFor="scenario">Scenario Description</Label>
          <Textarea
            id="scenario"
            value={scenario}
            onChange={(e) => {
              setScenario(e.target.value);
              updateConfig({ scenario: e.target.value });
            }}
            placeholder="Describe the context for creating the password..."
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            This sets the context for why the student needs to create a strong password.
          </p>
        </div>
      </Card>

      {/* Password Requirements */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Password Requirements</h2>
          <Badge variant="secondary">{requirementCount} requirements</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Minimum Length */}
          <div className="space-y-2">
            <Label htmlFor="minLength">Minimum Length</Label>
            <div className="flex items-center gap-4">
              <Input
                id="minLength"
                type="number"
                min={6}
                max={32}
                value={minLength}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 8;
                  setMinLength(value);
                  updateConfig({ minLength: value });
                }}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">characters</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Recommended: 12+ characters for strong security
            </p>
          </div>

          {/* Character Requirements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <Label>Require Uppercase Letters</Label>
                <p className="text-xs text-muted-foreground">At least one A-Z</p>
              </div>
              <Switch
                checked={requireUppercase}
                onCheckedChange={(checked) => {
                  setRequireUppercase(checked);
                  updateConfig({ requireUppercase: checked });
                }}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <Label>Require Numbers</Label>
                <p className="text-xs text-muted-foreground">At least one 0-9</p>
              </div>
              <Switch
                checked={requireNumbers}
                onCheckedChange={(checked) => {
                  setRequireNumbers(checked);
                  updateConfig({ requireNumbers: checked });
                }}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <Label>Require Special Characters</Label>
                <p className="text-xs text-muted-foreground">At least one !@#$%^&*</p>
              </div>
              <Switch
                checked={requireSpecial}
                onCheckedChange={(checked) => {
                  setRequireSpecial(checked);
                  updateConfig({ requireSpecial: checked });
                }}
              />
            </div>
          </div>
        </div>

        {/* Preview of requirements */}
        <div className="p-4 bg-primary/5 rounded-lg">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Requirements Preview
          </h3>
          <ul className="text-sm space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              At least {minLength} characters
            </li>
            {requireUppercase && (
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                At least one uppercase letter (A-Z)
              </li>
            )}
            {requireNumbers && (
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                At least one number (0-9)
              </li>
            )}
            {requireSpecial && (
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                At least one special character (!@#$%^&*)
              </li>
            )}
          </ul>
        </div>
      </Card>

      {/* Banned Passwords */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Banned Passwords</h2>
            <p className="text-sm text-muted-foreground">
              Common passwords that students should not use
            </p>
          </div>
          <Badge variant="secondary">{bannedPasswords.length} banned</Badge>
        </div>

        <div className="flex gap-2">
          <Input
            value={newBannedPassword}
            onChange={(e) => setNewBannedPassword(e.target.value)}
            placeholder="Add a banned password..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddBannedPassword();
              }
            }}
          />
          <Button onClick={handleAddBannedPassword} disabled={!newBannedPassword.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button variant="outline" onClick={handleAddCommonBannedPasswords}>
            Add Common List
          </Button>
        </div>

        {bannedPasswords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {bannedPasswords.map((password) => (
              <Badge
                key={password}
                variant="secondary"
                className="px-3 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={() => handleRemoveBannedPassword(password)}
              >
                {password}
                <Trash2 className="w-3 h-3 ml-2" />
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No banned passwords. Click "Add Common List" to add commonly used weak passwords.
            </p>
          </div>
        )}
      </Card>

      {/* Hints */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Hints for Students</h2>
            <p className="text-sm text-muted-foreground">
              Tips shown to help students create strong passwords
            </p>
          </div>
          <Badge variant="secondary">{hints.length} hints</Badge>
        </div>

        <div className="flex gap-2">
          <Input
            value={newHint}
            onChange={(e) => setNewHint(e.target.value)}
            placeholder="Add a hint..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddHint();
              }
            }}
          />
          <Button onClick={handleAddHint} disabled={!newHint.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button variant="outline" onClick={handleAddDefaultHints}>
            Add Default Hints
          </Button>
        </div>

        {hints.length > 0 ? (
          <div className="space-y-2">
            {hints.map((hint, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-muted rounded-lg group"
              >
                <Info className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <span className="flex-1 text-sm">{hint}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveHint(hint)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <Key className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No hints added. Click "Add Default Hints" to add helpful tips for students.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
