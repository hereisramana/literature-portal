"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import posthog from "posthog-js";

export default function FeedbackModal({ isOpen, onClose }) {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      posthog.capture("user_feedback", {
        text: feedback,
        timestamp: new Date().toISOString()
      });
      setSubmitted(true);
      localStorage.setItem("feedback_shown", "true");
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("feedback_shown", "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm overflow-hidden rounded-[32px] bg-[var(--clr-surface)] border border-[var(--color-border-subtle)] shadow-2xl"
      >
        <div className="p-8 text-center">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-[20px] font-bold text-[var(--color-text-strong)] leading-tight mb-2">
                  How was your revision experience?
                </h2>
                <p className="text-[13px] text-[var(--text-muted-color)] leading-relaxed mb-8">
                  Share your thoughts — your feedback helps us improve.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <textarea
                    autoFocus
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Type your thoughts here..."
                    className="w-full h-32 px-5 py-4 rounded-2xl bg-[var(--clr-bg)] border border-[var(--color-border-subtle)] text-[14px] text-[var(--clr-ink)] focus:outline-none focus:border-[var(--clr-focus)] transition-colors resize-none"
                  />
                  
                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={!feedback.trim()}
                      className="w-full rounded-full bg-[var(--button-primary-bg)] py-4 text-[13px] font-bold uppercase tracking-widest text-[var(--button-primary-text)] shadow-lg transition-all active:scale-[0.98] disabled:opacity-40"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="w-full py-2 text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted-color)] hover:text-[var(--text-body-color)] transition-colors"
                    >
                      Skip for now
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="thankyou"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-10"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--clr-correct)]/10 text-[var(--clr-correct)]">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-[18px] font-bold text-[var(--color-text-strong)]">Thank you!</h3>
                <p className="mt-2 text-[13px] text-[var(--text-muted-color)]">Your feedback has been received.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
