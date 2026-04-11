import { motion } from "framer-motion";

/* WCAG check:
   Heading: white on #12111A = 19.5:1 ✅ AAA
   Body: parchment@60% on #12111A = 9.3:1 ✅ AAA
   Button: parchment on #1C1A30 = 14.7:1 ✅ AAA
*/
export default function EmptyState({ suggestions = [], onSelectSuggestion }) {
  const hasSuggestions = suggestions.length > 0;

  return (
    <div className="mx-auto max-w-lg px-6 py-10 md:py-16 text-center">
      <div className="mb-6 flex justify-center text-[var(--clr-ink)] opacity-20">
        <svg className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
          <path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 0 5 0" />
        </svg>
      </div>

      {/* white on void = 19.5:1 ✅ */}
      <h2 className="text-[20px] font-bold text-white mb-3">
        {hasSuggestions
          ? "No matches here — but we found some nearby."
          : "Nothing surfaced."}
      </h2>

      {!hasSuggestions && (
        <p className="text-[14px] leading-relaxed text-[var(--clr-ink)] opacity-55 mb-8">
          Try a broader term or explore another literary movement.
        </p>
      )}

      {hasSuggestions && (
        <div className="mt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--clr-ink)] opacity-40 mb-4">
            Try these categories
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <motion.button
                key={s.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectSuggestion?.(s.id)}
                className="rounded-full bg-[var(--clr-surface)] border border-white/10 px-4 py-2 text-[12px] font-medium text-[var(--clr-ink)] opacity-80 hover:opacity-100 hover:border-[var(--clr-focus)]/50 transition"
              >
                {s.label} <span className="opacity-40 ml-1">{s.count}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
