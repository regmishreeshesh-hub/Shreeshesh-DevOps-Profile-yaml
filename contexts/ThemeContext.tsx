import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'light' | 'dark';

export interface Theme {
  name: string;
  type: ThemeType;
  colors: {
    background: string;
    surface: string;
    card: string;
    border: string;
    text: string;
    textSecondary: string;
    accent: string;
    accentSecondary: string;
    glow: string;
    gradient1: string;
    gradient2: string;
  };
}

const themes: Record<ThemeType, Theme> = {
  light: {
    name: 'Light',
    type: 'light',
    colors: {
      background: '#ffffff',
      surface: '#f8fafc',
      card: '#ffffff',
      border: '#e2e8f0',
      text: '#1e293b',
      textSecondary: '#64748b',
      accent: '#f97316',
      accentSecondary: '#3b82f6',
      glow: 'rgba(249, 115, 22, 0.5)',
      gradient1: 'rgba(251, 146, 60, 0.3)',
      gradient2: 'rgba(59, 130, 246, 0.3)',
    },
  },
  dark: {
    name: 'Dark',
    type: 'dark',
    colors: {
      background: '#060918',
      surface: '#0d1117',
      card: '#161b22',
      border: 'rgba(255, 255, 255, 0.1)',
      text: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
      accent: '#f97316',
      accentSecondary: '#3b82f6',
      glow: 'rgba(249, 115, 22, 0.5)',
      gradient1: 'rgba(249, 115, 22, 0.15)',
      gradient2: 'rgba(59, 130, 246, 0.15)',
    },
  }
};

interface ThemeContextType {
  currentTheme: Theme;
  themeType: ThemeType;
  setTheme: (theme: ThemeType) => void;
  availableThemes: Theme[];
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeType, setThemeType] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('portfolio-theme') as ThemeType;
    return saved || 'dark';
  });

  const currentTheme = themes[themeType];
  const availableThemes = Object.values(themes);

  useEffect(() => {
    localStorage.setItem('portfolio-theme', themeType);
    
    // Apply CSS custom properties
    const root = document.documentElement;
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Maintain Tailwind dark mode class for compatibility
    if (currentTheme.type === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeType, currentTheme]);

  const setTheme = (theme: ThemeType) => {
    setThemeType(theme);
  };

  const toggleTheme = () => {
    // Simple toggle between light and dark for backward compatibility
    setThemeType(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      themeType,
      setTheme,
      availableThemes,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
