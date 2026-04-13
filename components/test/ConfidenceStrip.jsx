"use client";
import { motion } from "framer-motion";

const RATING_STEPS = [
  { value: "1", label: "Still learning", color: "bg-[var(--clr-wrong)]" },
  { value: "2", label: "Improving", color: "bg-[var(--clr-warn)]" },
  { value: "3", label: "Getting there", color: "bg-[var(--clr-pulse)]" },
  { value: "4", label: "Confident", color: "bg-[var(--clr-focus)]" },
  { value: "5", label: "Mastered", color: "bg-[var(--clr-correct)]" },
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
  if (!visible) return null;

  const content = (
    <div className="mx-auto flex flex-col gap-8 items-center w-full">
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex justify-between w-full max-w-sm px-2">
          {RATING_STEPS.map((step) => {
            const isSelected = currentValue === step.value;
            return (
              <div key={step.value} className="flex flex-col items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onSelect(step.value)}
                  className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-black transition-all border-2 ${
                    isSelected
                    ? `${step.color} border-[var(--color-border-ui)] text-[var(--text-on-accent)] shadow-xl scale-125 z-10`
                    : "bg-[var(--color-disabled-bg)] border-[var(--color-border-subtle)] text-[var(--text-muted-color)] hover:border-[var(--color-border-strong)] hover:text-[var(--text-body-color)]"
                  }`}
                >
                  {step.value}
                </motion.button>
              </div>
            );
          })}
        </div>
        
        {/* Selected Label */}
        <div className="h-6">
          <motion.p 
            key={currentValue}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--clr-pulse)]"
          >
            {RATING_STEPS.find(s => s.value === currentValue)?.label || "Check your understanding"}
          </motion.p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-40">
        {provider ? (
          <div className="flex items-center gap-3">
            <span>{provider} active</span>
            <button onClick={onDisconnect} className="hover:underline">Disconnect</button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={() => onConnect("Google")} className="hover:opacity-100 transition">Sync with Google</button>
            <span className="opacity-30">|</span>
            <button onClick={() => onConnect("OneDrive")} className="hover:opacity-100 transition">Sync with OneDrive</button>
          </div>
        )}
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <div className="safe-bottom-lg fixed inset-x-0 bottom-0 z-[70] bg-[var(--clr-surface)]/95 px-4 py-8 backdrop-blur-xl border-t border-[var(--color-border-subtle)] shadow-2xl">
      <div className="max-w-2xl mx-auto">
        <p className="text-center mb-10 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
          Self-Correction check
        </p>
        {content}
      </div>
    </div>
  );
}
