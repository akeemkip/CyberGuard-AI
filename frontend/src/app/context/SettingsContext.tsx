import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  emailNotifications: boolean;
  courseReminders: boolean;
  marketingEmails: boolean;
  showProgress: boolean;
  autoPlayVideos: boolean;
}

interface SettingsContextType {
  settings: Settings;
  savedSettings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  saveSettings: () => Promise<Settings>;
  hasUnsavedChanges: boolean;
}

const defaultSettings: Settings = {
  emailNotifications: true,
  courseReminders: true,
  marketingEmails: false,
  showProgress: true,
  autoPlayVideos: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [savedSettings, setSavedSettings] = useState<Settings>(defaultSettings);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('cyberguard-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        const merged = { ...defaultSettings, ...parsed };
        setSettings(merged);
        setSavedSettings(merged);
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
  }, []);

  // Check for unsaved changes whenever settings change
  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);
    setHasUnsavedChanges(hasChanges);
  }, [settings, savedSettings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    // Find what changed
    const changes: Partial<Settings> = {};
    let changeCount = 0;

    (Object.keys(settings) as Array<keyof Settings>).forEach(key => {
      if (settings[key] !== savedSettings[key]) {
        changes[key] = settings[key];
        changeCount++;
      }
    });

    // Save to localStorage
    localStorage.setItem('cyberguard-settings', JSON.stringify(settings));
    setSavedSettings(settings);
    setHasUnsavedChanges(false);

    // In a real app, you would also save to the backend API here
    // Simulate API call
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 500);
    });

    return changes as Settings;
  };

  return (
    <SettingsContext.Provider value={{ settings, savedSettings, updateSetting, saveSettings, hasUnsavedChanges }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
