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
        placeholder="Search authors or works"
        className="
          h-14 w-full rounded-full border border-[var(--input-border)]
          bg-[var(--color-bg-primary)] pl-6 pr-14 text-[15px] font-semibold text-[var(--text-body-color)]
          shadow-[var(--input-shadow),var(--highlight-soft)]
          outline-none transition focus:border-[var(--color-focus-ring)] placeholder:font-medium placeholder:text-[var(--text-muted-color)]
        "
      />
      <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-[var(--color-accent)]">
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
