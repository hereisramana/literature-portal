"use client";
import { motion } from "framer-motion";

export default function AuthorCardBrowse({ author, onOpenStudy, onStartTest, confidence }) {
  return (
    <article className="card flex flex-col px-6 py-6 border border-[var(--color-border-subtle)] transition-shadow duration-300 hover:shadow-md bg-white h-full">
      <div className="flex items-start justify-between">
        <div className="w-fit text-left">
          <h2 className="text-[22px] font-semibold leading-[1.2] text-[var(--text-heading-color)] md:text-[24px]">
            {author.author}
          </h2>
        </div>
        {confidence && (
          <span className="rounded-full bg-[var(--color-success-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-success-text)] ml-4 shrink-0">
            {confidence}
          </span>
        )}
      </div>

      <div className="mt-4 flex-1">
        <ul className="space-y-1.5 text-[var(--text-muted-color)] list-disc list-inside">
          {author.works?.slice(0, 3).map((work, index) => (
            <li key={index} className="text-[14px] leading-relaxed truncate marker:text-[var(--color-accent)]">
              {work.title || work}
            </li>
          ))}
          {author.works?.length > 3 && (
            <li className="text-[12px] font-medium text-[var(--color-border-strong)] list-none pl-1 mt-2">
              + {author.works.length - 3} more works
            </li>
          )}
        </ul>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <motion.button
          whileHover={{ opacity: 0.8 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onOpenStudy?.(author)}
          className="flex-1 rounded-full bg-[var(--color-bg-inset)] px-4 py-2.5 text-[13px] font-medium text-[var(--color-text-strong)] transition-opacity"
        >
          Study
        </motion.button>
        <motion.button
          whileHover={{ opacity: 0.9 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onStartTest?.(author)}
          className="flex-1 rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-[13px] font-medium text-white transition-opacity shadow-sm"
        >
          Test
        </motion.button>
      </div>
    </article>
  );
}
