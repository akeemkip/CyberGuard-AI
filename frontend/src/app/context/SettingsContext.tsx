import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

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
  const { user, isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [savedSettings, setSavedSettings] = useState<Settings>(defaultSettings);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load settings from backend when user changes
  useEffect(() => {
    const fetchSettings = async () => {
      // Reset to defaults if not authenticated
      if (!isAuthenticated || !user) {
        setSettings(defaultSettings);
        setSavedSettings(defaultSettings);
        setHasUnsavedChanges(false);
        return;
      }

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
          setHasUnsavedChanges(false);
        } else {
          // Reset to defaults on error
          setSettings(defaultSettings);
          setSavedSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        // Reset to defaults on error
        setSettings(defaultSettings);
        setSavedSettings(defaultSettings);
      }
    };

    fetchSettings();
  }, [user?.id, isAuthenticated]); // Re-fetch when user changes

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

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Save to backend API only - no localStorage to avoid cross-user issues
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

    setSavedSettings(settings);
    setHasUnsavedChanges(false);

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
