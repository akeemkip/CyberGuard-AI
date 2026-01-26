import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PublicPlatformSettings {
  platformName: string;
  primaryColor: string;
  logoUrl: string;
  favicon: string;
  customCss: string;
  minPasswordLength: number;
  allowSelfRegistration: boolean;
}

interface PlatformSettingsContextType {
  settings: PublicPlatformSettings;
  isLoading: boolean;
}

const defaultSettings: PublicPlatformSettings = {
  platformName: 'CyberGuard AI',
  primaryColor: '#3b82f6',
  logoUrl: '',
  favicon: '',
  customCss: '',
  minPasswordLength: 6,
  allowSelfRegistration: true,
};

const PlatformSettingsContext = createContext<PlatformSettingsContextType | undefined>(undefined);

// Validate hex color format
function isValidHexColor(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

// Store the original favicon to restore when cleared
let originalFavicon: string | null = null;

export function PlatformSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PublicPlatformSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Capture original favicon on first mount
  useEffect(() => {
    if (originalFavicon === null) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      originalFavicon = link?.href || '';
    }
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/settings/public');
        if (response.ok) {
          const data = await response.json();
          setSettings({ ...defaultSettings, ...data.settings });
        }
      } catch (error) {
        console.error('Failed to fetch platform settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Apply CSS variables when primaryColor changes
  useEffect(() => {
    if (settings.primaryColor && isValidHexColor(settings.primaryColor)) {
      const root = document.documentElement;
      // Set primary color CSS variables using hex values directly
      root.style.setProperty('--primary', settings.primaryColor);
      root.style.setProperty('--ring', settings.primaryColor);
      root.style.setProperty('--sidebar-primary', settings.primaryColor);
      root.style.setProperty('--chart-1', settings.primaryColor);
    }
  }, [settings.primaryColor]);

  // Apply favicon when it changes, restore default when cleared
  useEffect(() => {
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    if (settings.favicon) {
      link.href = settings.favicon;
    } else if (originalFavicon) {
      // Restore original favicon when setting is cleared
      link.href = originalFavicon;
    }
  }, [settings.favicon]);

  // Apply customCss when it changes
  useEffect(() => {
    let styleTag = document.getElementById('platform-custom-css') as HTMLStyleElement;

    if (settings.customCss) {
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'platform-custom-css';
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = settings.customCss;
    } else if (styleTag) {
      styleTag.remove();
    }
  }, [settings.customCss]);

  // Update document title when platformName changes
  useEffect(() => {
    if (settings.platformName) {
      document.title = settings.platformName;
    }
  }, [settings.platformName]);

  return (
    <PlatformSettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </PlatformSettingsContext.Provider>
  );
}

export function usePlatformSettings() {
  const context = useContext(PlatformSettingsContext);
  if (!context) {
    throw new Error('usePlatformSettings must be used within a PlatformSettingsProvider');
  }
  return context;
}
