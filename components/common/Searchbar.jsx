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
        placeholder="Ex: metaphysical poets"
        className="
          h-12 w-full rounded-full
          bg-[var(--input-bg)] pl-5 pr-12 text-[15px] font-semibold text-[var(--text-body-color)]
          shadow-[var(--input-shadow)] outline-none transition
          focus:bg-white
          placeholder:font-medium placeholder:text-[var(--text-muted-color)]
          md:h-14
        "
      />
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[var(--text-muted-color)]">
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
