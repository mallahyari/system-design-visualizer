import { useEffect, useState } from "react";
import { applyTheme, getTheme, themes } from "../themes";
import { ThemeContext } from "./ThemeContextDef";

const THEME_STORAGE_KEY = "sdv-theme";

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && themes[stored]) {
      return stored;
    }
    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  });

  const theme = getTheme(themeName);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  }, [themeName, theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      // Only auto-switch if user hasn't explicitly set a preference
      if (!stored) {
        setThemeName(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setThemeName((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (name) => {
    if (themes[name]) {
      setThemeName(name);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, themeName, toggleTheme, setTheme, themes }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
