"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function useTheme() {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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

    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = next === "dark" ? "/assets/logo-light.png" : "/assets/logo-dark.png";
    }
  }

  return { theme, toggle, mounted };
}

export default function ThemeToggle({ theme, toggle, mounted }) {
  if (!mounted) {
    return <div className="h-9 w-[62px] rounded-full" />;
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.94 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="relative flex h-9 w-[62px] items-center rounded-full bg-[var(--color-bg-accent-soft)] shadow-[0_6px_16px_rgba(28,38,33,0.24)] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2"
    >
      <span className="absolute left-2.5 text-[var(--text-muted-color)]" aria-hidden="true">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3c0 0 0 0 0 0A7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
      <span className="absolute right-2.5 text-[var(--text-muted-color)]" aria-hidden="true">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      </span>

      <motion.span
        layout
        animate={{ x: isDark ? 2 : 30 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="absolute h-6 w-6 rounded-full bg-[var(--button-primary-bg)] shadow-[0_4px_10px_rgba(28,38,33,0.35)]"
      />
    </motion.button>
  );
}
