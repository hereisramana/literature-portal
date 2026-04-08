"use client";
import { motion } from "framer-motion";

export default function AuthorCardBrowse({ author, onOpenStudy, onStartTest, confidence }) {
  return (
    <article className="card flex aspect-[3/2] min-h-0 flex-col overflow-hidden px-6 py-5 shadow-[var(--shadow-soft)] transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="w-fit text-left">
          <h2 className="text-[24px] leading-[1.15] text-[var(--text-heading-color)] md:text-[26px]">
            {author.author}
          </h2>
        </div>
        {confidence && (
          <span className="rounded-full bg-[var(--color-success-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--color-success-text)]">
            {confidence}
          </span>
        )}
      </div>

      <div className="scrollbar-thin mt-4 flex-1 overflow-y-auto pr-1">
        <ul className="space-y-2 list-disc list-inside text-[var(--text-muted-color)] opacity-80">
          {author.works?.map((work, index) => (
            <li key={index} className="text-[14px] leading-tight md:text-[15px] marker:text-[var(--color-accent)]">
              {work.title || work}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ backgroundColor: "rgba(58, 64, 59, 0.05)" }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onOpenStudy?.(author)}
          className="rounded-full bg-[var(--color-bg-inset)] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] transition shadow-sm hover:shadow-md border border-white/20"
        >
          Study
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onStartTest?.(author)}
          className="rounded-full bg-[var(--button-primary-bg)] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--button-primary-text)] shadow-sm transition hover:shadow-lg"
        >
          Test
        </motion.button>
      </div>
    </article>
  );
}
