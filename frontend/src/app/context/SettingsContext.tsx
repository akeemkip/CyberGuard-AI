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

  // Load settings from backend on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:3000/api/users/settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const merged = { ...defaultSettings, ...data.settings };
          setSettings(merged);
          setSavedSettings(merged);
        } else {
          // Fallback to localStorage if backend fails
          const localSettings = localStorage.getItem('cyberguard-settings');
          if (localSettings) {
            const parsed = JSON.parse(localSettings);
            const merged = { ...defaultSettings, ...parsed };
            setSettings(merged);
            setSavedSettings(merged);
          }
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        // Fallback to localStorage if backend fails
        const localSettings = localStorage.getItem('cyberguard-settings');
        if (localSettings) {
          const parsed = JSON.parse(localSettings);
          const merged = { ...defaultSettings, ...parsed };
          setSettings(merged);
          setSavedSettings(merged);
        }
      }
    };

    fetchSettings();
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

    (Object.keys(settings) as Array<keyof Settings>).forEach(key => {
      if (settings[key] !== savedSettings[key]) {
        changes[key] = settings[key];
      }
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Save to backend API
      const response = await fetch('http://localhost:3000/api/users/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      const data = await response.json();

      // Save to localStorage as backup
      localStorage.setItem('cyberguard-settings', JSON.stringify(settings));
      setSavedSettings(settings);
      setHasUnsavedChanges(false);

      return changes as Settings;
    } catch (error) {
      console.error('Failed to save settings:', error);

      // Fallback to localStorage only
      localStorage.setItem('cyberguard-settings', JSON.stringify(settings));
      setSavedSettings(settings);
      setHasUnsavedChanges(false);

      return changes as Settings;
    }
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
