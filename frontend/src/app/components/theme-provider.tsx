import { createContext, useContext, useEffect, useState } from "react";
import { usePlatformSettings } from "../context/PlatformSettingsContext";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = usePlatformSettings();
  const [initialized, setInitialized] = useState(false);

  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      return stored as Theme;
    }
    // Will be updated when settings load
    return "light";
  });

  // Initialize theme based on platform settings if no user preference exists
  useEffect(() => {
    if (!initialized && settings) {
      const stored = localStorage.getItem("theme");
      if (!stored) {
        // No user preference, use platform default
        setTheme(settings.darkModeDefault ? "dark" : "light");
      }
      setInitialized(true);
    }
  }, [settings, initialized]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
