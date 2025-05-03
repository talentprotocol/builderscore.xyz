"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  isThemeLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeScript = `
  (function() {
    try {
      const storedTheme = localStorage.getItem('theme');
      const isDark = storedTheme === 'light' ? false : true;
      document.documentElement.classList.toggle('dark', isDark);
    } catch (e) {}
  })()
`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
    } else {
      setIsDarkMode(true);
    }
    setIsThemeLoaded(true);
  }, []);

  useEffect(() => {
    if (isThemeLoaded) {
      document.documentElement.classList.toggle("dark", isDarkMode);
      try {
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      } catch {}
    }
  }, [isDarkMode, isThemeLoaded]);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <ThemeContext.Provider
        value={{
          isDarkMode,
          setIsDarkMode,
          isThemeLoaded,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
