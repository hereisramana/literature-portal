"use client";
import { motion } from "framer-motion";

export default function AuthorCardBrowse({ author, onOpenStudy, onStartTest, confidence }) {
  return (
    <article className="card flex aspect-[3/2] min-h-0 flex-col overflow-hidden px-6 py-5 transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-medium)]">
      <div className="flex items-start justify-between">
        <button
          onClick={() => onOpenStudy?.(author)}
          className="w-fit text-left"
        >
          <h2 className="text-[24px] leading-[1.15] transition hover:text-[var(--color-accent-strong)] md:text-[26px]">
            {author.author}
          </h2>
        </button>
        {confidence && (
          <span className="rounded-full bg-[var(--color-success-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--color-success-text)]">
            {confidence}
          </span>
        )}
      </div>

      <ul className="scrollbar-thin mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
        {author.works?.map((work, index) => (
          <li key={index}>
            <button
              onClick={() => onOpenStudy?.(author, work.title || work)}
              className="w-full rounded-2xl bg-[var(--color-bg-raised)] px-4 py-2.5 text-left text-[14px] leading-tight text-[var(--text-body-color)] transition hover:bg-[var(--color-interaction-hover)] md:text-[15px]"
            >
              {work.title || work}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onOpenStudy?.(author)}
          className="rounded-full bg-[var(--color-bg-inset)] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] transition hover:bg-[var(--color-interaction-hover)]"
        >
          Study
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onStartTest?.(author)}
          className="rounded-full bg-[var(--button-primary-bg)] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--button-primary-text)] shadow-sm transition hover:shadow-md"
        >
          Test
        </motion.button>
      </div>
    </article>
  );
}
