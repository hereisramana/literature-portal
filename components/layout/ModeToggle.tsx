"use client";

export default function ModeToggle({ mode, setMode }) {
  return (
    <div
      className="
        flex rounded-full p-1
        bg-[var(--color-bg-raised)]
        border border-[var(--color-border-subtle)]
      "
    >
      <button
        onClick={() => setMode("browse")}
        className={`
          px-4 py-1 rounded-full text-sm
          ${
            mode === "browse"
              ? "bg-[var(--color-accent)] text-[var(--text-on-accent)]"
              : "text-[var(--color-text-secondary)]"
          }
        `}
      >
        BROWSE
      </button>

      <button
        onClick={() => setMode("test")}
        className={`
          px-4 py-1 rounded-full text-sm
          ${
            mode === "test"
              ? "bg-[var(--color-accent)] text-[var(--text-on-accent)]"
              : "text-[var(--color-text-secondary)]"
          }
        `}
      >
        TEST
      </button>
    </div>
  );
}