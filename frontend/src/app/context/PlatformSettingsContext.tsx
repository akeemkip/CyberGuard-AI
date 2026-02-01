import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PublicPlatformSettings {
  platformName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
  darkModeDefault: boolean;
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
  secondaryColor: '#10b981',
  accentColor: '#f59e0b',
  fontFamily: 'Inter',
  fontSize: 'normal',
  borderRadius: 'medium',
  darkModeDefault: false,
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
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
        const response = await fetch(`${apiBaseUrl}/settings/public`);
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

  // Apply secondary color
  useEffect(() => {
    if (settings.secondaryColor && isValidHexColor(settings.secondaryColor)) {
      const root = document.documentElement;
      root.style.setProperty('--secondary', settings.secondaryColor);
      root.style.setProperty('--success', settings.secondaryColor);
      root.style.setProperty('--chart-4', settings.secondaryColor);
    }
  }, [settings.secondaryColor]);

  // Apply accent color
  useEffect(() => {
    if (settings.accentColor && isValidHexColor(settings.accentColor)) {
      const root = document.documentElement;
      root.style.setProperty('--accent', settings.accentColor);
      root.style.setProperty('--warning', settings.accentColor);
      root.style.setProperty('--chart-5', settings.accentColor);
    }
  }, [settings.accentColor]);

  // Apply font family
  useEffect(() => {
    if (settings.fontFamily) {
      const root = document.documentElement;
      const body = document.body;

      // Load Google Fonts for non-system fonts
      const googleFonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat'];
      if (googleFonts.includes(settings.fontFamily)) {
        // Check if font link already exists
        let fontLink = document.getElementById('google-font') as HTMLLinkElement;
        if (!fontLink) {
          fontLink = document.createElement('link');
          fontLink.id = 'google-font';
          fontLink.rel = 'stylesheet';
          document.head.appendChild(fontLink);
        }
        // Update font URL
        const fontName = settings.fontFamily.replace(' ', '+');
        fontLink.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700&display=swap`;
      }

      // Apply font family to body
      body.style.fontFamily = settings.fontFamily === 'system-ui'
        ? 'system-ui, -apple-system, sans-serif'
        : settings.fontFamily === 'monospace'
        ? 'ui-monospace, monospace'
        : `'${settings.fontFamily}', sans-serif`;
    }
  }, [settings.fontFamily]);

  // Apply font size
  useEffect(() => {
    if (settings.fontSize) {
      const root = document.documentElement;
      const fontSizeMap: Record<string, string> = {
        compact: '14px',
        normal: '16px',
        large: '18px',
      };
      root.style.setProperty('--font-size', fontSizeMap[settings.fontSize] || '16px');
    }
  }, [settings.fontSize]);

  // Apply border radius
  useEffect(() => {
    if (settings.borderRadius) {
      const root = document.documentElement;
      const radiusMap: Record<string, string> = {
        none: '0px',
        small: '0.25rem',
        medium: '0.625rem',
        large: '1rem',
        full: '9999px',
      };
      root.style.setProperty('--radius', radiusMap[settings.borderRadius] || '0.625rem');
    }
  }, [settings.borderRadius]);

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
      {!isLoading && children}
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
