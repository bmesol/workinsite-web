import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

export type Theme = {
  primaryColor: string;
  secondaryColor: string;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resetTheme: () => void;
};

export const defaultTheme: Theme = {
  primaryColor: '#fad427',
  secondaryColor: '#4f430f',
};

const STORAGE_KEY = 'theme';

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => {},
  resetTheme: () => {},
});


function getLumaFromHex(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty('--primary', theme.primaryColor);
  root.style.setProperty('--secondary', theme.secondaryColor);
  const luma = getLumaFromHex(theme.primaryColor);
  root.style.setProperty('--primary-bg-text', luma > 128 ? '#000000' : '#ffffff');
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Theme;
        setThemeState(parsed);
        applyThemeToDOM(parsed);
      } else {
        applyThemeToDOM(defaultTheme);
      }
    } catch (err) {
      console.error('ThemeContext: failed to load theme, using default', err);
      setThemeState(defaultTheme);
      applyThemeToDOM(defaultTheme);
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTheme));
    } catch (err) {
      console.error('ThemeContext: failed to save theme', err);
    }
  }, []);

  const resetTheme = useCallback(() => {
    setThemeState(defaultTheme);
    applyThemeToDOM(defaultTheme);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('ThemeContext: failed to reset theme', err);
    }
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, resetTheme }),
    [theme, setTheme, resetTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);