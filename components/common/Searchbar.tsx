"use client";
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  return (
    <input
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onSearch?.(e.target.value);
      }}
      placeholder="Search author or work"
      className="
        w-full md:w-80
        px-4 py-2 rounded-full
        bg-[var(--color-bg-inset)]
        border border-[var(--color-border-subtle)]
        shadow-[var(--shadow-inset)]
        outline-none
      "
    />
  );
}