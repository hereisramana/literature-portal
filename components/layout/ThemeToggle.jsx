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
      className="relative flex h-9 w-[62px] items-center rounded-full border border-[var(--color-border-ui)] bg-[var(--color-bg-accent-soft)] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2"
    >
      <span
        className="absolute left-2.5 text-[10px] font-bold tracking-wide text-[var(--text-muted-color)]"
        aria-hidden="true"
      >
        D
      </span>
      <span
        className="absolute right-2.5 text-[10px] font-bold tracking-wide text-[var(--text-muted-color)]"
        aria-hidden="true"
      >
        L
      </span>

      <motion.span
        layout
        animate={{ x: isDark ? 2 : 30 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="absolute h-6 w-6 rounded-full bg-[var(--button-primary-bg)] shadow-md"
      />
    </motion.button>
  );
}
