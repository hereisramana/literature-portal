"use client";

export default function ModeToggle({ mode, setMode }) {
  return (
    <div
      className="
        grid h-[56px] w-full max-w-full grid-cols-2 overflow-hidden rounded-[28px]
        bg-[var(--color-bg-surface)] p-2
        md:h-[82px] md:w-[736px] md:rounded-[38px] md:p-4
      "
    >
      <button
        onClick={() => setMode("browse")}
        className={`
          flex items-center justify-center rounded-[22px] px-5 text-[20px] font-extrabold tracking-[0.02em]
          md:rounded-[30px] md:text-[34px]
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
          flex items-center justify-center rounded-[22px] px-5 text-[20px] font-extrabold tracking-[0.02em]
          md:rounded-[30px] md:text-[34px]
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
