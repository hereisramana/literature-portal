import { motion } from "framer-motion";

export default function EmptyState({ suggestions = [], onSelectSuggestion }) {
  const hasSuggestions = suggestions.length > 0;

  return (
    <div className="mx-auto max-w-lg px-6 py-10 md:py-16 text-center">
      <div className="mb-6 flex justify-center text-[var(--text-muted-color)] opacity-30">
        <svg
          className="h-12 w-12 md:h-16 md:w-16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
          <path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 0 5 0" />
        </svg>
      </div>

      <h2 className="text-xl md:text-2xl leading-tight font-bold text-[var(--text-heading-color)] mb-4">
        {hasSuggestions
          ? "No matches here — but we found some in other categories."
          : "Nothing surfaced."
        }
      </h2>

      {!hasSuggestions && (
        <p className="text-[14px] leading-relaxed text-[var(--text-muted-color)] mb-8">
          Try a broader search term or reset the category to see more literary works.
        </p>
      )}

      {hasSuggestions && (
        <div className="mt-8">
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <motion.button
                key={s.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectSuggestion?.(s.id)}
                className="rounded-full bg-[var(--color-bg-inset)] px-4 py-2 text-xs font-bold text-[var(--color-text-primary)] shadow-sm transition border border-white/40 hover:shadow-md"
              >
                {s.label} ({s.count})
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
