"use client";

export default function ModeToggle({ mode, setMode }) {
  return (
    <div
      className="
        grid grid-cols-2 rounded-full border border-[var(--divider-color)]
        bg-[var(--button-secondary-bg)] p-1
      "
    >
      <button
        onClick={() => setMode("browse")}
        className={`
          min-w-28 rounded-full px-5 py-2 text-sm font-semibold tracking-[0.03em]
          transition
          ${
            mode === "browse"
              ? "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] shadow-[var(--shadow-soft)]"
              : "text-[var(--text-muted-color)]"
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
              ? "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] shadow-[var(--shadow-soft)]"
              : "text-[var(--text-muted-color)]"
          }
        `}
      >
        TEST
      </button>
    </div>
  );
}
