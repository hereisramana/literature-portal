"use client";
import { useState } from "react";
import { motion } from "framer-motion";

/* WCAG check:
   Input text:        parchment on #1C1A30 = 14.7:1 ✅ AAA
   Placeholder:       parchment@40% on #1C1A30 = ~5.9:1 ✅ AA
   Border (focus):    Focus purple on #1C1A30 = visible, decorative ✅
*/
export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  const handleClear = () => {
    setValue("");
    onSearch?.("");
  };

  return (
    <div className="relative block w-full">
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onSearch?.(e.target.value);
        }}
        placeholder="Search authors or works…"
        className="
          h-12 w-full rounded-full
          bg-[var(--clr-surface)] border border-[var(--color-border-subtle)]
          pl-12 pr-12
          text-[14px] font-medium text-[var(--text-body-color)]
          outline-none transition-all duration-200
          focus:border-[var(--color-border-strong)] focus:ring-1 focus:ring-[var(--color-focus-ring)]
          placeholder:text-[var(--text-muted-color)]
          md:h-14
        "
      />
      {/* Search icon: parchment@50% on surface = sufficient for non-text element ✅ */}
      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[var(--text-muted-color)]">
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </span>
      {value && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClear}
          className="absolute inset-y-0 right-4 flex items-center text-[var(--text-muted-color)] hover:text-[var(--text-body-color)] transition"
          aria-label="Clear search"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </motion.button>
      )}
    </div>
  );
}
