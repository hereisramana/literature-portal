"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import AuthorFocusShell from "../focus/AuthorFocusShell.jsx";
import ConfidenceStrip from "./ConfidenceStrip.jsx";
import { createTestSession } from "../../utils/testEngine.js";

function ResultNote({ children, success = false, checked = false }) {
  if (!checked) return null;
  return (
    <div
      className={`rounded-2xl px-6 py-4 text-[15px] leading-relaxed shadow-sm border border-white/40 ${
        success
          ? "success-surface"
          : "bg-[var(--color-bg-raised)] text-[var(--text-body-color)]"
      }`}
    >
      {children}
    </div>
  );
}

function McqPanel({
  question,
  revealed,
  selected,
  submitted,
  onReveal,
  onSelect,
  onSubmit,
  onNext,
  timer,
}) {
  if (!question) {
    return <div className="p-8 text-center bg-[var(--color-bg-inset)] rounded-3xl border border-white/20 shadow-inner">
      <p className="text-[15px] font-bold text-[var(--text-muted-color)]">No more questions available for this session.</p>
    </div>;
  }

  const success = submitted && selected === question.answer;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <p className="text-[18px] font-bold leading-snug text-[var(--text-body-color)] flex-1 pr-4">{question.prompt}</p>
           {!submitted && (
             <div className="flex flex-col items-center shrink-0">
               <div className="h-10 w-10 rounded-full border-2 border-[var(--color-accent)] flex items-center justify-center relative overflow-hidden">
                 <span className="text-xs font-bold text-[var(--color-accent)] z-10">{timer}s</span>
                 <motion.div
                   className="absolute bottom-0 left-0 right-0 bg-[var(--color-accent)]/10"
                   initial={{ height: "0%" }}
                   animate={{ height: `${(15 - timer) / 15 * 100}%` }}
                 />
               </div>
             </div>
           )}
        </div>
      </div>

      {!revealed ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReveal}
          className="rounded-full bg-[var(--button-primary-bg)] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[var(--button-primary-text)] shadow-lg"
        >
          Reveal Options
        </motion.button>
      ) : (
        <div className="grid gap-3">
          {question.mcqOptions.map((option) => {
            const active = selected === option;
            const correct = submitted && option === question.answer;

            return (
              <motion.button
                key={option}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelect(option)}
                disabled={submitted}
                className={`rounded-2xl px-6 py-4 text-left text-[15px] transition-all border border-white/40 ${
                  correct
                    ? "success-surface shadow-md"
                    : active
                    ? "bg-[var(--color-bg-accent-soft)] ring-2 ring-[var(--color-accent-strong)]/10 shadow-inner"
                    : "bg-[var(--color-bg-raised)] hover:bg-[var(--color-interaction-hover)] shadow-sm"
                }`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      )}

      <ResultNote checked={submitted} success={success}>
        <p className="font-bold mb-1 uppercase tracking-tight text-xs">
          {success ? "You're correct!" : "You missed it."}
        </p>
        <p className="text-[15px]">
          <strong>Answer:</strong> {question.answer} — {question.explanation}
        </p>
      </ResultNote>

      <div className="flex flex-wrap gap-3 pt-4">
        {!submitted ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSubmit}
            disabled={!revealed || !selected || submitted}
            className="rounded-full bg-[var(--button-primary-bg)] px-8 py-3 text-sm font-bold uppercase tracking-wider text-[var(--button-primary-text)] shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Check Answer
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="rounded-full bg-[var(--button-secondary-bg)] px-8 py-3 text-sm font-bold uppercase tracking-wider text-[var(--button-primary-text)] bg-[var(--color-text-strong)] shadow-md"
          >
            Next Question
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default function TestFocusView({
  author,
  category,
  allAuthors,
  onClose,
  storedConfidence,
  onSaveConfidence,
  cloud,
}) {
  const session = useMemo(
    () => createTestSession(author, category, allAuthors),
    [author, category, allAuthors]
  );

  const [interleaved, setInterleaved] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(`seenTestGuide_${author.author}`) === "true";
  });
  const [showGuide, setShowGuide] = useState(!hasSeenGuide);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [confidenceFlow, setConfidenceFlow] = useState(false);
  const [confidence, setConfidence] = useState(storedConfidence || "");

  const [timer, setTimer] = useState(15);

  const activeQuestions = interleaved ? session.interleaveQuestions : session.verifyQuestions;
  const currentQuestion = activeQuestions[currentIndex] || null;

  useEffect(() => {
    if (showGuide || submitted || !currentQuestion) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRevealed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, showGuide, submitted, currentQuestion]);

  function resetQuestion() {
    setRevealed(false);
    setSelected("");
    setSubmitted(false);
    setTimer(15);
  }

  function handleNext() {
    setCurrentIndex((prev) => Math.min(prev + 1, activeQuestions.length - 1));
    resetQuestion();
  }

  function handleInterleaveToggle() {
    const nextValue = !interleaved;
    setInterleaved(nextValue);
    setCurrentIndex(0);
    resetQuestion();
  }

  function handleCloseAttempt() {
    if (questionsAttempted > 0) {
      setConfidenceFlow(true);
      return;
    }
    onClose();
  }

  async function handleConfidence(value) {
    setConfidence(value);
    await onSaveConfidence({
      author: author.author,
      exercise: "verify",
      confidence: value,
      timestamp: Date.now(),
    });
    onClose();
  }

  return (
    <>
      <AuthorFocusShell
        title={author.author}
        tabs={[{ id: "verify", label: "Verification" }]}
        activeTab="verify"
        onTabChange={() => {}}
        onClose={handleCloseAttempt}
        showGuide={showGuide}
        guideCtaLabel="Got it, start the test"
        showGuideSkip={false}
        onCloseGuide={() => {
          setShowGuide(false);
          setHasSeenGuide(true);
          localStorage.setItem(`seenTestGuide_${author.author}`, "true");
        }}
        guideContent={
          <p>
            Try to recall the answer before the timer ends — options will appear automatically after.
          </p>
        }
        main={
          <div className="pb-10">
            <div className="mb-10 flex items-center justify-between p-6 bg-[var(--color-bg-inset)] rounded-[28px] shadow-inner border border-white/20">
              <div>
                <h4 className="text-sm font-bold text-[var(--text-heading-color)] mt-1">
                  Question {currentIndex + 1} of {activeQuestions.length}
                </h4>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted-color)]">
                    Interleave <span className="opacity-60">(mix other authors)</span>
                  </span>
                  <button
                    onClick={handleInterleaveToggle}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${interleaved ? "bg-[var(--color-accent-strong)]" : "bg-[var(--color-border-strong)]"}`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${interleaved ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <McqPanel
              question={currentQuestion}
              revealed={revealed}
              selected={selected}
              submitted={submitted}
              timer={timer}
              onReveal={() => setRevealed(true)}
              onSelect={setSelected}
              onSubmit={() => {
                setSubmitted(true);
                setQuestionsAttempted((v) => v + 1);
              }}
              onNext={handleNext}
            />
          </div>
        }
      />

      <AnimatePresence>
        {confidenceFlow && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card w-full max-w-lg p-10 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Reflect on Mastery</h3>
                <p className="text-[15px] leading-relaxed text-[var(--text-muted-color)] mb-10">
                  How confident do you feel about <strong>{author.author}</strong> after this session? This updates your dashboard progress.
                </p>

                <div className="mb-10">
                  <ConfidenceStrip
                    visible={true}
                    currentValue={confidence}
                    onSelect={handleConfidence}
                    provider={cloud.provider}
                    onConnect={cloud.connect}
                    onDisconnect={cloud.disconnect}
                    embedded={true}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-full bg-[var(--color-bg-inset)] py-3 text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] shadow-sm hover:shadow-md transition"
                  >
                    Skip for Now
                  </button>
                </div>
              </div>

              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
