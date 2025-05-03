"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

declare global {
  interface Window {
    __THEME_PREFERENCE?: string;
  }
}

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
      window.__THEME_PREFERENCE = storedTheme || 'dark';
    } catch (e) {
      window.__THEME_PREFERENCE = 'dark';
    }
  })()
`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    const preference = window.__THEME_PREFERENCE || "dark";
    setIsDarkMode(preference === "dark");
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
