"use client";

export default function ModeToggle({ mode, setMode }) {
  return (
    <div
      className="
        grid grid-cols-2 rounded-full border border-[var(--color-border-subtle)]
        bg-[var(--color-bg-surface)] p-1
      "
    >
      <button
        onClick={() => setMode("browse")}
        className={`
          min-w-28 rounded-full px-5 py-2 text-sm font-semibold tracking-[0.03em]
          transition
          ${
            mode === "browse"
              ? "bg-[var(--color-accent)] text-[var(--color-bg-primary)] shadow-sm"
              : "text-[var(--color-text-secondary)]"
          }
        `}
      >
        BROWSE
      </button>

      <button
        onClick={() => setMode("test")}
        className={`
          min-w-28 rounded-full px-5 py-2 text-sm font-semibold tracking-[0.03em]
          transition
          ${
            mode === "test"
              ? "bg-[var(--color-accent)] text-[var(--color-bg-primary)] shadow-sm"
              : "text-[var(--color-text-secondary)]"
          }
        `}
      >
        TEST
      </button>
    </div>
  );
}
