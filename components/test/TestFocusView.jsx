"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthorFocusShell from "../focus/AuthorFocusShell.jsx";
import ConfidenceStrip from "./ConfidenceStrip.jsx";
import { createTestSession, generateMixSession } from "../../utils/testEngine.js";

// ─── Spring toggle (reused pattern from ThemeToggle) ─────────────────────────
function ToggleSwitch({ enabled, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.92 }}
      aria-pressed={enabled}
      className="relative flex h-7 w-[52px] shrink-0 items-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clr-focus)] focus-visible:ring-offset-2"
      style={{
        background: enabled ? "rgba(83,74,183,0.35)" : "rgba(255,255,255,0.07)",
        borderColor: enabled ? "rgba(127,119,221,0.45)" : "rgba(255,255,255,0.12)",
      }}
    >
      <motion.span
        animate={{ x: enabled ? 28 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="absolute h-5 w-5 rounded-full shadow-md"
        style={{ background: enabled ? "#7F77DD" : "rgba(255,255,255,0.22)" }}
      />
    </motion.button>
  );
}

// ─── MCQ Panel ───────────────────────────────────────────────────────────────
function McqPanel({ question, revealed, selected, submitted, onReveal, onSelect, onSubmit, onNext, timer }) {
  if (!question) return null;

  const success = submitted && selected === question.answer;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            {/* Author attribution — only shown in mix mode */}
            {question.authorName && (
              <span className="inline-block mb-1.5 rounded-full bg-[var(--clr-warn)]/15 border border-[var(--clr-warn)]/30 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--clr-warn)]">
                {question.authorName}
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[var(--clr-pulse)] opacity-75">
                {question.slot}
              </span>
            </div>
            <p className="mt-1.5 text-[18px] font-semibold leading-relaxed text-[var(--clr-ink)]">
              {question.prompt}
            </p>
          </div>

          {/* Timer ring */}
          {!submitted && (
            <div className="shrink-0">
              <div className="h-12 w-12 rounded-full border-2 border-[var(--clr-dim)] flex items-center justify-center relative overflow-hidden bg-transparent">
                <span className="text-[12px] font-black text-[var(--clr-ink)] z-10">{timer}</span>
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 ${timer < 5 ? "bg-[var(--clr-warn)]" : "bg-[var(--clr-focus)]"} opacity-20`}
                  initial={{ height: "0%" }}
                  animate={{ height: `${((15 - timer) / 15) * 100}%` }}
                />
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="24" cy="24" r="22"
                    fill="none"
                    stroke={timer < 5 ? "var(--clr-warn)" : "var(--clr-focus)"}
                    strokeWidth="2"
                    strokeDasharray="138"
                    strokeDashoffset={138 - (timer / 15) * 138}
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Waiting state — no button, just message */}
      {!revealed ? (
        <div className="flex flex-col items-center py-10 bg-[var(--clr-recall)] rounded-2xl border border-white/5">
          <p className="text-[13px] text-[var(--clr-ink)] opacity-55 italic">
            Hold the answer in mind — options appear in {timer}s
          </p>
        </div>
      ) : (
        <div className="grid gap-3 mt-2">
          {question.mcqOptions.map((option) => {
            const isCorrect = option === question.answer;
            const isSelected = selected === option;
            const showCorrect = submitted && isCorrect;
            const showWrong = submitted && isSelected && !isCorrect;
            const dim = submitted && !isCorrect && !isSelected;

            let bg = "bg-[var(--clr-surface)]";
            let border = "border-white/10";
            let text = "text-[var(--clr-ink)]";

            if (showCorrect) { bg = "bg-[var(--clr-correct)]"; border = "border-[var(--clr-correct)]"; text = "text-white"; }
            else if (showWrong) { bg = "bg-[var(--clr-wrong)]"; border = "border-[var(--clr-wrong)]"; text = "text-white"; }
            else if (dim) { bg = "bg-transparent"; border = "border-[var(--clr-dim)]"; text = "text-[var(--clr-dim)]"; }
            else if (isSelected && !submitted) { border = "border-[var(--clr-pulse)]"; bg = "bg-[var(--clr-recall)]"; }

            return (
              <motion.button
                key={option}
                whileHover={!submitted ? { scale: 1.01 } : {}}
                whileTap={{ scale: 0.995 }}
                onClick={() => onSelect(option)}
                disabled={submitted}
                className={`rounded-xl px-6 py-4 text-left text-[15px] transition-all border-2 ${bg} ${border} ${text}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Feedback card after submission */}
      {submitted && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
          <div className={`p-5 rounded-xl border ${
            success
              ? "bg-[var(--clr-correct)]/10 border-[var(--clr-correct)] text-[var(--clr-correct)]"
              : "bg-[var(--clr-wrong)]/10 border-[var(--clr-wrong)] text-[var(--clr-wrong)]"
          }`}>
            <p className="font-bold text-xs uppercase tracking-widest mb-2">
              {success ? "Correct" : "Incorrect"}
            </p>
            <p className="text-[14px] leading-relaxed text-[var(--clr-ink)]">
              {question.explanation}
            </p>
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end pt-4">
        {!submitted ? (
          <motion.button
            whileHover={revealed && selected ? { scale: 1.02, backgroundColor: "var(--clr-pulse)" } : {}}
            whileTap={{ scale: 0.98 }}
            onClick={onSubmit}
            disabled={!revealed || !selected}
            className="rounded-full bg-[var(--clr-focus)] px-12 py-4 text-[13px] font-bold uppercase tracking-widest text-white shadow-xl disabled:opacity-20 transition-all"
          >
            Confirm
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="rounded-full bg-[var(--clr-surface)] border-2 border-[var(--clr-dim)] px-12 py-4 text-[13px] font-bold uppercase tracking-widest text-[var(--clr-ink)] transition-all"
          >
            Next Question
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ─── Summary Screen ───────────────────────────────────────────────────────────
function SummaryScreen({ resultsLog, onNextAuthor }) {
  const correct = resultsLog.filter(r => r.isCorrect).length;
  const total = resultsLog.length;

  const label =
    correct === total ? "Perfect Recall" :
    correct >= Math.ceil(total * 0.75) ? "Strong Command" :
    correct >= Math.ceil(total * 0.5) ? "Good Grasp" :
    "Keep Reading";

  return (
    <div className="p-8 bg-[var(--clr-surface)] rounded-[28px] border border-white/5 space-y-8 shadow-2xl">
      {/* Score header */}
      <div className="text-center space-y-2 pt-2">
        <h2 className="text-5xl font-black text-white">
          {correct}
          <span className="text-2xl opacity-25 ml-2">/ {total}</span>
        </h2>
        <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-[var(--clr-pulse)]">
          {label}
        </p>
      </div>

      {/* Per-question result list */}
      <div className="space-y-2 max-w-md mx-auto">
        {resultsLog.map((log, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 bg-[var(--clr-bg)] px-4 py-3 rounded-xl border border-white/5 text-[13px]"
          >
            <span className="font-medium text-[var(--clr-ink)] opacity-65 truncate">
              {log.authorName && (
                <span className="text-[var(--clr-warn)] opacity-80 mr-1.5 text-[10px] font-bold uppercase tracking-wide">
                  [{log.authorName}]
                </span>
              )}
              {i + 1}. {log.dimension}
            </span>
            <span
              className={`shrink-0 text-[16px] font-bold ${log.isCorrect ? "text-[var(--clr-correct)]" : "text-[var(--clr-wrong)]"}`}
            >
              {log.isCorrect ? "✓" : "✗"}
            </span>
          </div>
        ))}
      </div>

      {/* Single CTA */}
      <div className="max-w-md mx-auto pt-2">
        <motion.button
          whileHover={{ opacity: 0.9 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNextAuthor}
          className="w-full rounded-full bg-[var(--clr-focus)] py-4 text-[13px] font-bold uppercase tracking-widest text-white shadow-lg transition-opacity"
        >
          Test me on next author
        </motion.button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TestFocusView({
  author,
  category,
  allAuthors,
  onClose,
  storedConfidence,
  onSaveConfidence,
  cloud,
  onNextAuthor,
}) {
  // mixMode is toggled inside the guide; committedMixMode is frozen at guide close
  const [mixMode, setMixMode] = useState(false);
  const [committedMixMode, setCommittedMixMode] = useState(false);

  const [showGuide, setShowGuide] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [resultsLog, setResultsLog] = useState([]);

  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [confidenceFlow, setConfidenceFlow] = useState(false);
  const [confidence, setConfidence] = useState(storedConfidence || "");
  const [timer, setTimer] = useState(15);

  // Questions are generated once when the guide closes (committedMixMode frozen)
  const activeQuestions = useMemo(() => {
    if (committedMixMode) {
      return generateMixSession(author, allAuthors);
    }
    return createTestSession(author, category, allAuthors).verifyQuestions;
  }, [author, category, allAuthors, committedMixMode]);

  const currentQuestion = activeQuestions[currentIndex] || null;

  // Auto-reveal timer
  useEffect(() => {
    if (showGuide || submitted || revealed || !currentQuestion || sessionComplete) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); setRevealed(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, showGuide, submitted, revealed, currentQuestion, sessionComplete]);

  function resetQuestion() {
    setRevealed(false);
    setSelected("");
    setSubmitted(false);
    setTimer(15);
  }

  function handleNext() {
    if (currentIndex >= activeQuestions.length - 1) {
      setSessionComplete(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      resetQuestion();
    }
  }

  function handleSubmitAnswer() {
    setSubmitted(true);
    setQuestionsAttempted((v) => v + 1);
    const isCorrect = selected === currentQuestion.answer;
    setResultsLog(prev => [...prev, {
      dimension: currentQuestion.slot || "Question",
      authorName: currentQuestion.authorName || null,
      isCorrect,
    }]);
  }

  function handleCloseAttempt() {
    if (questionsAttempted > 0) { setConfidenceFlow(true); return; }
    onClose();
  }

  async function handleConfidence(value) {
    setConfidence(value);
    await onSaveConfidence?.({
      author: author.author,
      exercise: "verify",
      confidence: value,
      timestamp: Date.now(),
    });
    onClose();
  }

  function handleNextAuthor() {
    // Reset all local state, then ask parent to advance
    setSessionComplete(false);
    setResultsLog([]);
    setCurrentIndex(0);
    setQuestionsAttempted(0);
    setMixMode(false);
    setCommittedMixMode(false);
    setShowGuide(true);
    resetQuestion();
    onNextAuthor?.();
  }

  // Guide overlay content — mixMode toggle lives here
  const guideContent = (
    <div className="space-y-5 text-left">
      <p className="text-[15px] leading-relaxed text-[var(--clr-ink)] opacity-80">
        Try to guess the answer before the automatic reveal of the options.
      </p>
      <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--clr-ink)] opacity-30">
        12 questions · 5 academic dimensions
      </p>

      {/* Mix-test toggle */}
      <div className="rounded-xl border border-[var(--clr-focus)]/25 bg-[var(--clr-recall)]/40 p-4 mt-2">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-bold text-[15px] text-white">Mix-test Mode</p>
            <p className="text-[12px] leading-relaxed mt-1.5 text-[var(--clr-ink)] opacity-50">
              Mixes 2 questions each from 6 randomly chosen authors.{" "}
              Based on the{" "}
              <span className="text-[var(--clr-pulse)] font-semibold">interleaving principle</span>{" "}
              — switching topics forces deeper retrieval and builds stronger long-term memory than studying one author at a time. Every mix is unique.
            </p>
          </div>
          <ToggleSwitch enabled={mixMode} onToggle={() => setMixMode(v => !v)} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AuthorFocusShell
        title={author.author}
        tabs={[]}
        hideTabsInHeader={true}
        activeTab="verify"
        onTabChange={() => {}}
        onClose={handleCloseAttempt}
        showGuide={showGuide}
        guideCtaLabel="Start Test"
        showGuideSkip={false}
        onCloseGuide={() => {
          setCommittedMixMode(mixMode); // freeze choice
          setShowGuide(false);
        }}
        guideContent={guideContent}
        main={
          <div className="pb-10">
            {/* Progress strip */}
            {!sessionComplete && (
              <div className="mb-8 flex items-center justify-between px-5 py-4 bg-[var(--clr-surface)] rounded-2xl border border-white/5 shadow-lg">
                <div className="flex gap-1.5">
                  {[...Array(activeQuestions.length || 12)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-5 rounded-full transition-colors ${
                        i === currentIndex
                          ? "bg-[var(--clr-focus)]"
                          : i < currentIndex
                          ? "bg-[var(--clr-correct)]"
                          : "bg-[var(--clr-dim)] opacity-40"
                      }`}
                    />
                  ))}
                </div>
                {committedMixMode && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-warn)] opacity-60">
                    Mix-test
                  </span>
                )}
              </div>
            )}

            {/* Session view */}
            {sessionComplete ? (
              <SummaryScreen
                resultsLog={resultsLog}
                onNextAuthor={handleNextAuthor}
              />
            ) : (
              <McqPanel
                question={currentQuestion}
                revealed={revealed}
                selected={selected}
                submitted={submitted}
                timer={timer}
                onReveal={() => setRevealed(true)}
                onSelect={setSelected}
                onSubmit={handleSubmitAnswer}
                onNext={handleNext}
              />
            )}
          </div>
        }
      />

      {/* Confidence flow overlay */}
      <AnimatePresence>
        {confidenceFlow && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--clr-surface)] w-full max-w-lg p-10 text-center shadow-2xl rounded-3xl border border-white/5"
            >
              <h3 className="text-2xl font-bold mb-2">Academic Mastery</h3>
              <p className="text-[15px] leading-relaxed text-[var(--clr-ink)] opacity-60 mb-10">
                Rate your confidence in <strong>{author.author}</strong> to update your research trajectory.
              </p>
              <div className="mb-10">
                <ConfidenceStrip
                  visible={true}
                  currentValue={confidence}
                  onSelect={handleConfidence}
                  provider={cloud?.provider}
                  onConnect={cloud?.connect}
                  onDisconnect={cloud?.disconnect}
                  embedded={true}
                />
              </div>
              <button
                onClick={onClose}
                className="w-full rounded-full bg-white/5 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-white/10 transition"
              >
                Skip for Now
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
