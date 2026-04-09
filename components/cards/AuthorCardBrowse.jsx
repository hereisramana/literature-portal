"use client";
import { motion } from "framer-motion";

export default function AuthorCardBrowse({ author, onOpenStudy, onStartTest, confidence }) {
  return (
    <article className="card flex aspect-[3/2] min-h-0 flex-col overflow-hidden px-6 py-5 border border-[var(--color-border-subtle)] shadow-sm hover:shadow-md transition-shadow duration-300">
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
        <ul className="space-y-1 text-[var(--text-muted-color)] opacity-70 list-disc list-inside">
          {author.works?.slice(0, 3).map((work, index) => (
            <li key={index} className="text-[13px] leading-tight md:text-[14px] truncate marker:text-[var(--color-accent)]">
              {work.title || work}
            </li>
          ))}
          {author.works?.length > 3 && (
            <li className="text-[11px] font-bold uppercase tracking-wider opacity-50">
              + {author.works.length - 3} more
            </li>
          )}
        </ul>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onOpenStudy?.(author)}
          className="rounded-full bg-[var(--color-bg-inset)] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] transition-all shadow-sm active:shadow-inner border border-black/5"
        >
          Study
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onStartTest?.(author)}
          className="rounded-full bg-[var(--color-text-strong)] px-4 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-white shadow-sm transition-all active:shadow-inner"
        >
          Test
        </motion.button>
      </div>
    </article>
  );
}
