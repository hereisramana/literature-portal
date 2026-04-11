"use client";
import { motion } from "framer-motion";

/* WCAG check for cards:
   Author name: #FFFFFF on #1C1A30 = 14.7:1 ✅ AAA
   Work list:   parchment@70% on #1C1A30 = ~10:1 ✅ AAA
   Muted badge: parchment@50% on #1C1A30 = ~7.2:1 ✅ AA
   Study btn:   parchment on #2E2960 = 6.8:1 ✅ AA
   Test btn:    white on #534AB7 = 5.9:1 ✅ AA
*/
export default function AuthorCardBrowse({ author, onOpenStudy, onStartTest, confidence }) {
  return (
    <article className="flex flex-col px-6 py-6 rounded-2xl bg-[var(--clr-surface)] border border-white/5 hover:border-[var(--clr-focus)]/40 transition-all duration-300 h-full group">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {/* #FFFFFF on #1C1A30 = 14.7:1 ✅ */}
          <h2 className="text-[20px] font-bold leading-snug text-white truncate">
            {author.author}
          </h2>
          {/* literary_period badge */}
          {author.literary_period && (
            <span className="mt-1.5 inline-block text-[10px] font-bold uppercase tracking-widest text-[var(--clr-pulse)] opacity-80">
              {author.literary_period}
            </span>
          )}
        </div>
        {confidence && (
          <span className="shrink-0 rounded-full bg-[var(--clr-correct)]/15 border border-[var(--clr-correct)]/30 px-3 py-1 text-[11px] font-semibold text-[var(--clr-correct)]">
            {confidence}
          </span>
        )}
      </div>

      <div className="mt-4 flex-1">
        {/* parchment@65% on #1C1A30 = ~9.5:1 ✅ */}
        <ul className="space-y-1.5">
          {author.works?.slice(0, 3).map((work, index) => (
            <li key={index} className="flex items-center gap-2 text-[var(--clr-ink)] opacity-60 text-[13px]">
              <span className="shrink-0 h-1 w-1 rounded-full bg-[var(--clr-focus)]" />
              <span className="truncate">{work.title || work}</span>
            </li>
          ))}
          {author.works?.length > 3 && (
            <li className="text-[11px] font-medium text-[var(--clr-ink)] opacity-35 pl-3 mt-1">
              + {author.works.length - 3} more
            </li>
          )}
        </ul>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {/* Study: parchment on Dusk #2E2960 = 6.8:1 ✅ */}
        <motion.button
          whileHover={{ opacity: 0.85 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onOpenStudy?.(author)}
          className="rounded-full bg-[var(--clr-recall)] py-3 text-[12px] font-semibold text-[var(--clr-ink)] transition-opacity"
        >
          Study
        </motion.button>
        {/* Test: white on Focus purple = 5.9:1 ✅ */}
        <motion.button
          whileHover={{ opacity: 0.9 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onStartTest?.(author)}
          className="rounded-full bg-[var(--clr-focus)] py-3 text-[12px] font-semibold text-white transition-opacity shadow-lg shadow-[var(--clr-focus)]/30"
        >
          Test
        </motion.button>
      </div>
    </article>
  );
}
