"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function useTheme() {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read from localStorage on mount to restore preference
    const saved = localStorage.getItem("enlit-theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
    setMounted(true);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("enlit-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return { theme, toggle, mounted };
}

// ─────────────────────────────────────────────────────────────────────────────
// Toggle Switch UI Component
// ─────────────────────────────────────────────────────────────────────────────
export default function ThemeToggle({ theme, toggle, mounted }) {
  // Avoid rendering on server to prevent hydration mismatch
  if (!mounted) {
    return <div className="h-9 w-9 rounded-full" />;
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.92 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="relative flex h-9 w-[62px] items-center rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clr-focus)] focus-visible:ring-offset-2"
      style={{
        background: isDark
          ? "rgba(83, 74, 183, 0.25)"
          : "rgba(74, 66, 168, 0.12)",
        borderColor: isDark
          ? "rgba(127, 119, 221, 0.35)"
          : "rgba(74, 66, 168, 0.25)",
      }}
    >
      {/* Track icons */}
      <span className="absolute left-2 text-[11px]" aria-hidden="true">🌙</span>
      <span className="absolute right-2 text-[11px]" aria-hidden="true">☀️</span>

      {/* Thumb */}
      <motion.span
        layout
        animate={{ x: isDark ? 2 : 30 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="absolute h-6 w-6 rounded-full shadow-md"
        style={{
          background: isDark ? "#7F77DD" : "#4A42A8",
        }}
      />
    </motion.button>
  );
}
