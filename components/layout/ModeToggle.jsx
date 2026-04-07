"use client";
import { motion } from "framer-motion";

export default function ModeToggle({ mode, setMode }) {
  return (
    <div
      className="
        subtle-surface relative flex h-[52px] w-full max-w-full overflow-hidden rounded-full
        p-[5px] shadow-[var(--shadow-soft)]
        md:h-[57px] md:w-[360px]
      "
    >
      <button
        onClick={() => setMode("study")}
        className={`
          relative z-10 flex flex-1 items-center justify-center rounded-full px-5 text-[14px] font-bold tracking-[0.05em]
          md:px-3 md:text-[15px]
          transition-colors duration-300
          ${
            mode === "study"
              ? "text-[var(--button-primary-text)]"
              : "text-[var(--text-muted-color)] hover:text-[var(--text-heading-color)]"
          }
        `}
      >
        STUDY
      </button>

      <button
        onClick={() => setMode("test")}
        className={`
          relative z-10 flex flex-1 items-center justify-center rounded-full px-5 text-[14px] font-bold tracking-[0.05em]
          md:px-3 md:text-[15px]
          transition-colors duration-300
          ${
            mode === "test"
              ? "text-[var(--button-primary-text)]"
              : "text-[var(--text-muted-color)] hover:text-[var(--text-heading-color)]"
          }
        `}
      >
        TEST
      </button>

      <motion.div
        className="absolute bottom-[5px] top-[5px] z-0 rounded-full bg-[var(--button-primary-bg)] shadow-[0_4px_12px_rgba(58,64,59,0.15)]"
        initial={false}
        animate={{
          left: mode === "study" ? "5px" : "50%",
          right: mode === "study" ? "50%" : "5px",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 35,
        }}
      />
    </div>
  );
}
