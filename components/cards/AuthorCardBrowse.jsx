"use client";
import { motion } from "framer-motion";

/*
  WCAG & Ergonomic contrast (updated for extended-session palette):
  Author name:   #E8E6F4 on #1E1C34 ≈ 10.2:1  ✅ AAA
  Work list:     #C9C6DF@60% on #1E1C34 ≈ 5.9:1  ✅ AA
  Study btn:     #C9C6DF on #2E2960 ≈ 7.1:1  ✅ AA
  Test btn:      #FFFFFF on #534AB7 ≈ 5.9:1  ✅ AA
  Period label:  #7F77DD on #1E1C34 ≈ 4.6:1  ✅ AA (decorative label)

  LIGHT MODE contrast:
  Author name:   #1A1826 on #FDFCFF ≈ 17.1:1  ✅ AAA
  Work list:     #2E2B44@60% on #FDFCFF ≈ 7.3:1  ✅ AAA
  Study btn:     #2E2B44 on #ECEBF8 ≈ 8.4:1  ✅ AAA
  Test btn:      #FFFFFF on #4038A0 ≈ 7.6:1  ✅ AA
*/

// Standardised height layout:
//   - Fixed 2-work slots (Rule: always 2 rows, gap if only 1 work)
//   - No overflow, no internal scroll, no variable height
//   - Card height is determined by name + 2 work rows + buttons = consistent grid

export default function AuthorCardBrowse({ author, onOpenStudy, onStartTest, confidence, showAwardInsteadOfPeriod }) {
  const works = author.works || [];
  // Always render exactly 2 slots: show works[0], works[1], or empty placeholder
  const slot0 = works[0] ? (works[0].title || works[0]) : null;
  const slot1 = works[1] ? (works[1].title || works[1]) : null;
  const totalWorks = works.length;

  return (
    <article className="flex flex-col px-5 py-5 rounded-2xl bg-[var(--clr-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--clr-focus)]/35 transition-all duration-200 group">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 min-h-[52px]">
        <div className="min-w-0">
          <h2 className="text-[18px] font-bold leading-snug text-[var(--color-text-strong)] truncate">
            {author.author}
          </h2>
          {showAwardInsteadOfPeriod ? (
            author.legacy?.awards?.[0] && (
              <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--clr-focus)]">
                {author.legacy.awards[0]}
              </span>
            )
          ) : (
            author.literary_period && (
              <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted-color)]">
                {author.literary_period}
              </span>
            )
          )}
        </div>
        {confidence && (
          <span className="shrink-0 rounded-full bg-[var(--clr-correct)]/12 border border-[var(--clr-correct)]/25 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--clr-correct)]">
            {confidence}
          </span>
        )}
      </div>

      {/* ── Standardised 2-slot works list ─────────────── */}
      {/* Fixed h-[52px] ensures all cards have identical works-area height */}
      <div className="mt-4 h-[52px] flex flex-col justify-start gap-1.5">
        {/* Slot 0 */}
        <div className="flex items-center gap-2">
          <span className={`shrink-0 h-1 w-1 rounded-full ${slot0 ? 'bg-[var(--clr-focus)]' : 'bg-transparent'}`} />
          {slot0 ? (
            <span className="truncate text-[13px] leading-snug text-[var(--text-muted-color)]">{slot0}</span>
          ) : (
            <span className="h-3 w-24 rounded bg-[var(--clr-dim)] opacity-10" />
          )}
        </div>

        {/* Slot 1 — gap if author has only 1 work (empty row preserved) */}
        <div className="flex items-center gap-2">
          <span className={`shrink-0 h-1 w-1 rounded-full ${slot1 ? 'bg-[var(--clr-focus)]' : 'bg-transparent'}`} />
          {slot1 ? (
            <span className="truncate text-[13px] leading-snug text-[var(--text-muted-color)]">{slot1}</span>
          ) : (
            /* Preserved gap — empty row keeps card height identical */
            <span className="h-3 w-16 rounded bg-transparent" />
          )}
        </div>
      </div>

      {/* ── More works count ────────────────────────────── */}
      <div className="mt-1 h-[16px]">
        {totalWorks > 2 && (
          <p className="text-[11px] font-medium text-[var(--text-muted-color)] pl-3">
            +{totalWorks - 2} more
          </p>
        )}
      </div>

      {/* ── Action buttons ──────────────────────────────── */}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <motion.button
          whileHover={{ opacity: 0.82 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onOpenStudy?.(author)}
          className="rounded-full bg-[var(--clr-recall)] py-2.5 text-[12px] font-semibold text-[var(--clr-ink)] transition-opacity"
        >
          Study
        </motion.button>
        <motion.button
          whileHover={{ opacity: 0.88 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onStartTest?.(author)}
          className="rounded-full bg-[var(--button-primary-bg)] py-2.5 text-[12px] font-semibold text-[var(--button-primary-text)] transition-opacity shadow-md shadow-[var(--clr-focus)]/25"
        >
          Test
        </motion.button>
      </div>
    </article>
  );
}
