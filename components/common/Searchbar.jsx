"use client";
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  return (
    <label className="relative block w-full">
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onSearch?.(e.target.value);
        }}
        placeholder="Value"
        className="
          h-12 w-full rounded-full border border-[var(--color-border-strong)]
          bg-[var(--color-bg-surface)] pl-5 pr-12 text-sm text-[var(--color-text-primary)]
          outline-none transition focus:border-[var(--color-accent)] focus:ring-2
          focus:ring-[color:rgba(140,119,80,0.15)]
        "
      />
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[var(--color-accent)]">
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </span>
    </label>
  );
}
