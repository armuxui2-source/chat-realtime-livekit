"use client";

import { useState, useEffect } from "react";

export type ThemeMode = "auto" | "light" | "dark";

export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("auto");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Read saved theme from localStorage
    const savedTheme = (localStorage.getItem("ticketapp_theme_mode") as ThemeMode) || "auto";
    setThemeMode(savedTheme);

    const applyTheme = (mode: ThemeMode) => {
      let active: "light" | "dark" = "dark";
      if (mode === "auto") {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        active = systemPrefersDark ? "dark" : "light";
      } else {
        active = mode;
      }

      setResolvedTheme(active);
      document.documentElement.setAttribute("data-theme", active);
      if (active === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    applyTheme(savedTheme);

    // Listen for OS system theme changes if in auto mode
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      const currentMode = (localStorage.getItem("ticketapp_theme_mode") as ThemeMode) || "auto";
      if (currentMode === "auto") {
        applyTheme("auto");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const changeTheme = (newMode: ThemeMode) => {
    setThemeMode(newMode);
    localStorage.setItem("ticketapp_theme_mode", newMode);

    let active: "light" | "dark" = "dark";
    if (newMode === "auto") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      active = systemPrefersDark ? "dark" : "light";
    } else {
      active = newMode;
    }

    setResolvedTheme(active);
    document.documentElement.setAttribute("data-theme", active);
    if (active === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return {
    themeMode,
    resolvedTheme,
    changeTheme,
  };
}
