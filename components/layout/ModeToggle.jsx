"use client";

export default function ModeToggle({ mode, setMode }) {
  return (
    <div
      className="
        subtle-surface grid h-[52px] w-full max-w-full grid-cols-2 overflow-hidden rounded-full
        p-[5px] shadow-[var(--shadow-soft)]
        md:h-[46px] md:w-[244px]
      "
    >
      <button
        onClick={() => setMode("browse")}
        className={`
          flex items-center justify-center rounded-full px-5 text-[16px] font-extrabold tracking-[0.01em]
          md:px-3 md:text-[14px]
          transition-all duration-200
          ${
            mode === "browse"
              ? "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] shadow-[0_8px_20px_rgba(255,154,87,0.28)]"
              : "text-[var(--text-muted-color)] hover:text-[var(--text-heading-color)]"
          }
        `}
      >
        BROWSE
      </button>

      <button
        onClick={() => setMode("test")}
        className={`
          flex items-center justify-center rounded-full px-5 text-[16px] font-extrabold tracking-[0.01em]
          md:px-3 md:text-[14px]
          transition-all duration-200
          ${
            mode === "test"
              ? "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] shadow-[0_8px_20px_rgba(255,154,87,0.28)]"
              : "text-[var(--text-muted-color)] hover:text-[var(--text-heading-color)]"
          }
        `}
      >
        TEST
      </button>
    </div>
  );
}
