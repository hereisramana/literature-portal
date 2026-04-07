"use client";

export default function ModeToggle({ mode, setMode }) {
  return (
    <div
      className="
        grid h-[52px] w-full max-w-full grid-cols-2 overflow-hidden rounded-[26px]
        bg-[var(--color-bg-surface)] p-[5px]
        md:h-[38px] md:w-[236px] md:rounded-[18px] md:p-[4px]
      "
    >
      <button
        onClick={() => setMode("browse")}
        className={`
          flex items-center justify-center rounded-[22px] px-5 text-[18px] font-extrabold tracking-[0.02em]
          md:rounded-[14px] md:px-3 md:text-[13px]
          transition-colors
          ${
            mode === "browse"
              ? "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]"
              : "text-[var(--text-muted-color)]"
          }
        `}
      >
        BROWSE
      </button>

      <button
        onClick={() => setMode("test")}
        className={`
          flex items-center justify-center rounded-[22px] px-5 text-[18px] font-extrabold tracking-[0.02em]
          md:rounded-[14px] md:px-3 md:text-[13px]
          transition-colors
          ${
            mode === "test"
              ? "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]"
              : "text-[var(--text-muted-color)]"
          }
        `}
      >
        TEST
      </button>
    </div>
  );
}
