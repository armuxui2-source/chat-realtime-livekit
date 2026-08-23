"use client";

import { useState, useEffect, useCallback } from "react";

export type ThemeMode = "auto" | "light" | "dark";

export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("auto");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  const determineTheme = useCallback((mode: ThemeMode): "light" | "dark" => {
    if (mode === "light") return "light";
    if (mode === "dark") return "dark";

    // Auto Mode: Real-world Time Clock (06:00 - 18:00 = กลางวัน/Light Mode ☀️, 18:00 - 06:00 = กลางคืน/Dark Mode 🌙)
    if (typeof window !== "undefined") {
      const currentHour = new Date().getHours();
      return currentHour >= 6 && currentHour < 18 ? "light" : "dark";
    }

    return "light";
  }, []);

  const applyThemeToDOM = useCallback((active: "light" | "dark") => {
    setResolvedTheme(active);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", active);
      if (active === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  useEffect(() => {
    // Read saved theme preference (default is "auto")
    const savedTheme = (localStorage.getItem("ticketapp_theme_mode") as ThemeMode) || "auto";
    setThemeMode(savedTheme);

    const active = determineTheme(savedTheme);
    applyThemeToDOM(active);

    // 1. Listen for OS theme switches in real-time
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      const currentMode = (localStorage.getItem("ticketapp_theme_mode") as ThemeMode) || "auto";
      if (currentMode === "auto") {
        const nextActive = determineTheme("auto");
        applyThemeToDOM(nextActive);
      }
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    // 2. Clock Interval Check (every 60 seconds) for automatic day/night time transitions
    const interval = setInterval(() => {
      const currentMode = (localStorage.getItem("ticketapp_theme_mode") as ThemeMode) || "auto";
      if (currentMode === "auto") {
        const nextActive = determineTheme("auto");
        applyThemeToDOM(nextActive);
      }
    }, 60000);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      clearInterval(interval);
    };
  }, [determineTheme, applyThemeToDOM]);

  const changeTheme = (newMode: ThemeMode) => {
    setThemeMode(newMode);
    localStorage.setItem("ticketapp_theme_mode", newMode);
    const nextActive = determineTheme(newMode);
    applyThemeToDOM(nextActive);
  };

  return {
    themeMode,
    resolvedTheme,
    changeTheme,
  };
}
