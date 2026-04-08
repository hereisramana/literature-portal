"use client";
import { useState } from "react";

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
        placeholder="Ex: metaphysical poets"
        className="
          h-12 w-full rounded-full
          bg-[var(--input-bg)] pl-12 pr-12 text-[15px] font-semibold text-[var(--text-body-color)]
          shadow-[var(--input-shadow)] outline-none transition
          focus:bg-white focus:shadow-[var(--shadow-soft)]
          placeholder:font-medium placeholder:text-[var(--text-muted-color)]
          md:h-14
        "
      />
      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[var(--text-muted-color)]">
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </span>
      {value && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleClear}
          className="absolute inset-y-0 right-4 flex items-center text-[var(--text-muted-color)] hover:text-[var(--text-heading-color)] transition"
          aria-label="Clear search"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </motion.button>
      )}
    </div>
  );
}
