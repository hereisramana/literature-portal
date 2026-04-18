"use client";
import { motion } from "framer-motion";

const LEVELS = [
  { id: "weak", label: "Weak" },
  { id: "moderate", label: "Moderate" },
  { id: "good", label: "Good" },
  { id: "excellent", label: "Excellent" },
];

export default function ConfidenceStrip({
  visible,
  currentValue,
  onSelect,
  provider,
  onConnect,
  onDisconnect,
  embedded = false,
}) {
  if (!visible) {
    return null;
  }

  const content = (
    <div className="mx-auto flex flex-col gap-6 items-center">
      <div className="flex flex-wrap justify-center gap-3">
        {LEVELS.map((level) => (
          <motion.button
            key={level.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(level.id)}
            className={`rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all border border-white/20 shadow-sm ${
              currentValue === level.id
                ? "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] shadow-md scale-105"
                : "bg-[var(--color-bg-raised)] text-[var(--color-text-primary)] hover:bg-[var(--color-interaction-hover)] hover:shadow-md"
            }`}
          >
            {level.label}
          </motion.button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-widest opacity-60">
        {provider ? (
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--color-bg-raised)] px-4 py-2 border border-white/40">
              {provider} active
            </span>
            <button
              onClick={onDisconnect}
              className="text-[var(--color-text-primary)] hover:underline"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onConnect("Google")}
              className="rounded-full bg-white/40 px-4 py-2 hover:bg-white/60 transition border border-white/60"
            >
              Sync with Google
            </button>
            <button
              onClick={() => onConnect("OneDrive")}
              className="rounded-full bg-white/40 px-4 py-2 hover:bg-white/60 transition border border-white/60"
            >
              Sync with OneDrive
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="safe-bottom-lg fixed inset-x-0 bottom-0 z-[70] bg-[rgba(255,255,255,0.88)] px-4 py-6 backdrop-blur-md border-t border-white/20 shadow-2xl">
      <div className="max-w-4xl mx-auto">
        <p className="text-center mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted-color)] opacity-60">
          Confidence check
        </p>
        {content}
      </div>
    </div>
  );
}
