"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import posthog from "posthog-js";
import AuthorFocusShell from "../focus/AuthorFocusShell.jsx";
import ConfidenceStrip from "./ConfidenceStrip.jsx";
import { createTestSession, generateMixSession } from "../../utils/testEngine.js";

// ─── Adaptive Helpers ────────────────────────────────────────────────────────
function getAdaptiveTimer(confidence) {
  const map = {
    "1": 15, "2": 14, "3": 12, "4": 11, "5": 9,
    "weak": 15, "moderate": 13, "good": 11, "excellent": 9
  };
  return map[confidence] || 12;
}

// ─── Phase Microcopy Sequence ───────────────────────────────────────────────
function getRecallMessage(timer, base, isExpert) {
  const elapsed = base - timer;
  
  // Advanced Routing: Expert pressure vs Standard guidance
  if (isExpert && elapsed < 4) return "You’ve seen this before—recall it.";
  
  if (elapsed < 3) return "Think back…";
  if (elapsed < 7) return "What do you remember?";
  if (elapsed < 10) return "Take a moment—anything comes to mind?";
  return "Choices coming up…";
}

// ─── Spring toggle ───────────────────────────────────────────────────────────
function ToggleSwitch({ enabled, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.92 }}
      className="relative flex h-7 w-[52px] shrink-0 items-center rounded-full shadow-[0_6px_14px_rgba(28,38,33,0.28)] transition-colors duration-200"
      style={{
        background: enabled ? "rgba(83,74,183,0.45)" : "rgba(127,127,127,0.2)",
      }}
    >
      <motion.span
        animate={{ x: enabled ? 28 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="absolute h-5 w-5 rounded-full shadow-md"
        style={{ background: enabled ? "#7F77DD" : "rgba(235,235,235,0.9)" }}
      />
    </motion.button>
  );
}

// ─── MCQ Panel ───────────────────────────────────────────────────────────────
function McqPanel({ 
  question, revealed, selected, submitted, 
  onSelect, onSubmit, onNext, onReveal, timer, baseTimer, isExpert 
}) {
  if (!question) return null;
  const success = submitted && selected === question.answer;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          {/* Author Badge */}
          {question.authorName && (
            <span className="inline-block w-fit rounded-full bg-[var(--clr-warn)]/15 border border-[var(--clr-warn)]/30 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--clr-warn)]">
              {question.authorName}
            </span>
          )}
          
          <div className="space-y-2">
             <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-pulse)] opacity-50">
               {question.slot}
             </p>
             <h3 className="text-[20px] font-semibold leading-relaxed text-[var(--clr-ink)]">
               {question.prompt}
             </h3>
          </div>

          {/* Suble Thinking Bar (Phase 2 Guided) */}
          {!revealed && (
          <div className="h-1 w-full bg-[var(--color-disabled-bg)] rounded-full overflow-hidden mt-2 relative">
              <motion.div
                className="absolute inset-0 bg-[var(--clr-focus)] opacity-30"
                initial={{ width: "0%" }}
                animate={{ width: `${((baseTimer - timer) / baseTimer) * 100}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
          )}
        </div>
      </div>

      {!revealed ? (
        <div 
          onClick={() => {
            posthog.capture('test_reveal_click', { author_name: question.authorName, prompt: question.prompt });
            onReveal?.();
          }}
          className="cursor-pointer group flex flex-col items-center py-12 bg-[var(--clr-recall)]/30 rounded-2xl border border-[var(--color-border-subtle)] hover:border-[var(--clr-focus)]/30 transition-all h-[240px] justify-center text-center px-8"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={getRecallMessage(timer, baseTimer, isExpert)}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="text-[15px] text-[var(--clr-ink)] font-medium leading-relaxed italic opacity-60"
            >
              {getRecallMessage(timer, baseTimer, isExpert)}
            </motion.p>
          </AnimatePresence>
        </div>
      ) : (
        <div className="grid gap-3 mt-2 min-h-[240px]">
          {question.mcqOptions.map((option) => {
            const isSelected = selected === option;
            const isCorrect = option === question.answer;
            const showCorrect = submitted && isCorrect;
            const showWrong = submitted && isSelected && !isCorrect;
            const dim = submitted && !isCorrect && !isSelected;

            let border = "border-[var(--color-border-subtle)]";
            let bg = "bg-[var(--clr-surface)]";
            let text = "text-[var(--clr-ink)]";

            if (showCorrect) {
              bg = "bg-[var(--clr-correct-bg)]";
              border = "border-[var(--clr-correct-bg)]";
              text = "text-[var(--clr-correct-text)]";
            }
            else if (showWrong) {
              bg = "bg-[var(--clr-wrong-bg)]";
              border = "border-[var(--clr-wrong-bg)]";
              text = "text-[var(--clr-wrong-text)]";
            }
            else if (dim) {
              bg = "bg-[var(--clr-dim-bg)]";
              border = "border-[var(--clr-dim-bg)]";
              text = "text-[var(--clr-dim-text)]";
            }
            else if (isSelected && !submitted) {
              border = "border-[var(--clr-pulse)]";
              bg = "bg-[var(--clr-recall)]";
            }

            return (
              <motion.button
                key={option}
                whileTap={{ scale: 0.995 }}
                onClick={() => onSelect(option)}
                disabled={submitted}
                className={`rounded-xl px-6 py-5 text-left text-[14px] font-medium transition-all border-2 ${bg} ${border} ${text}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      )}

      {submitted && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
          <div className={`p-5 rounded-xl border ${
            success
              ? "bg-[var(--clr-correct-bg)]/30 border-[var(--clr-correct-bg)] text-[var(--clr-correct-text)]"
              : "bg-[var(--clr-wrong-bg)]/30 border-[var(--clr-wrong-bg)] text-[var(--clr-wrong-text)]"
          }`}>
            <p className="font-bold text-[11px] uppercase tracking-[0.2em] mb-2 scale-95 origin-left">
              {success ? "That’s right" : "Almost—mixed up with another idea"}
            </p>
            <p className="text-[14px] leading-relaxed text-[var(--clr-ink)]">
              {question.explanation}
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex justify-between items-center pt-4">
        {/* Helper copy after submission */}
        {submitted && (
          <p className="text-[11px] font-bold uppercase tracking-widest opacity-20 ml-2">
            Click next to continue
          </p>
        )}
        <div className="ml-auto">
          {!submitted ? (
            <motion.button
              whileHover={revealed && selected ? { scale: 1.02 } : {}}
              whileTap={{ scale: 0.98 }}
              onClick={onSubmit}
              disabled={!revealed || !selected}
              className="rounded-full bg-[var(--button-primary-bg)] px-12 py-4 text-[13px] font-bold uppercase tracking-widest text-[var(--button-primary-text)] shadow-xl disabled:opacity-30 transition-all"
            >
              Confirm
            </motion.button>
          ) : (
            <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.98 }}
               onClick={onNext}
               className="rounded-full bg-[var(--clr-surface)] border-2 border-[var(--color-border-subtle)] px-12 py-4 text-[13px] font-bold uppercase tracking-widest text-[var(--text-body-color)] transition-all"
            >
              Next Question
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Summary Screen ───────────────────────────────────────────────────────────
function SummaryScreen({ resultsLog, onNextAuthor, onToggleMix, showMixCTA }) {
  const correct = resultsLog.filter(r => r.isCorrect).length;
  const total = resultsLog.length;

  return (
    <div className="p-8 bg-[var(--clr-surface)] rounded-[32px] border border-[var(--color-border-subtle)] space-y-10 shadow-2xl">
      <div className="text-center space-y-2 pt-2">
        <h2 className="text-5xl font-black text-[var(--color-text-strong)]">
          {correct}
          <span className="text-2xl opacity-25 ml-2">/ {total}</span>
        </h2>
        <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-[var(--clr-pulse)]">
          Your results
        </p>
      </div>

      <div className="space-y-2.5 max-w-md mx-auto">
        {resultsLog.map((log, i) => (
          <div key={i} className="flex items-center justify-between gap-4 bg-[var(--clr-bg)] px-5 py-3.5 rounded-xl border border-[var(--color-border-subtle)] text-[13px]">
            <span className="font-medium text-[var(--clr-ink)] opacity-65 truncate">
              {log.authorName && <span className="text-[var(--clr-warn)] text-[10px] font-bold mr-2">[{log.authorName}]</span>}
              {i + 1}. {log.dimension}
            </span>
            <span className={`font-bold ${log.isCorrect ? "text-[var(--clr-correct)]" : "text-[var(--clr-wrong)]"}`}>
              {log.isCorrect ? "✓" : "✗"}
            </span>
          </div>
        ))}
      </div>

      <div className="max-w-md mx-auto space-y-4 pt-2">
        {showMixCTA && (
          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: "rgba(127,119,221,0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggleMix}
            className="w-full rounded-xl border-2 border-[var(--clr-pulse)]/20 py-4 text-[12px] font-bold uppercase tracking-widest text-[var(--clr-pulse)] transition-all"
          >
            ⚡ Try Mixed Practice
          </motion.button>
        )}
        <motion.button
          whileHover={{ opacity: 0.9, scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNextAuthor}
          className="w-full rounded-xl bg-[var(--button-primary-bg)] py-4 text-[12px] font-bold uppercase tracking-widest text-[var(--button-primary-text)] shadow-lg"
        >
          Test next author
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

  onNextAuthor,
}) {
  const hasPriorAttempt = !!storedConfidence;
  const isExpert = storedConfidence === "4" || storedConfidence === "5" || storedConfidence === "excellent";
  
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

  const baseTimer = useMemo(() => getAdaptiveTimer(storedConfidence), [storedConfidence]);
  const [timer, setTimer] = useState(baseTimer);

  const activeQuestions = useMemo(() => {
    if (committedMixMode) return generateMixSession(author, allAuthors);
    return createTestSession(author, category, allAuthors).verifyQuestions;
  }, [author, category, allAuthors, committedMixMode]);

  const currentQuestion = activeQuestions[currentIndex] || null;

  useEffect(() => {
    posthog.capture('test_overlay_open', { author_name: author.author });
  }, [author.author]);

  useEffect(() => {
    if (showGuide || submitted || revealed || !currentQuestion || sessionComplete) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0.1) { clearInterval(interval); setRevealed(true); return 0; }
        return Math.max(0, prev - 0.1);
      });
    }, 100); // 100ms granularity for smooth bar
    return () => clearInterval(interval);
  }, [currentIndex, showGuide, submitted, revealed, currentQuestion, sessionComplete]);

  function resetQuestion() {
    setRevealed(false);
    setSelected("");
    setSubmitted(false);
    setTimer(baseTimer);
  }

  function handleNext() {
    if (currentIndex >= activeQuestions.length - 1) setSessionComplete(true);
    else { setCurrentIndex(v => v + 1); resetQuestion(); }
  }

  function handleSubmitAnswer() {
    setSubmitted(true);
    setQuestionsAttempted(v => v + 1);
    setResultsLog(prev => [...prev, {
      dimension: currentQuestion.slot || "Q",
      authorName: currentQuestion.authorName || null,
      isCorrect: selected === currentQuestion.answer,
    }]);
  }

  function handleCloseAttempt() {
    if (questionsAttempted > 0) { setConfidenceFlow(true); return; }
    onClose();
  }

  const guideContent = (
    <div className="space-y-6 text-center">
      {!hasPriorAttempt ? (
        <p className="text-[17px] leading-relaxed opacity-70">
          Try to recall the answer from memory. Don’t worry if you’re unsure—just give it a try.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          <p className="text-[16px] font-bold">Ready to practice?</p>
          <div className="rounded-xl bg-[var(--clr-recall)]/40 p-5 text-left">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="font-bold text-[15px] text-[var(--color-text-strong)]">Mixed Practice</p>
                <p className="text-[12px] opacity-50 mt-1 leading-relaxed">
                  Switching authors mid-session builds significantly stronger memory than practicing one at a time.
                </p>
              </div>
              <ToggleSwitch enabled={mixMode} onToggle={() => setMixMode(v => !v)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <AuthorFocusShell
        title={author.author}
        tabs={[]} hideTabsInHeader={true} activeTab="verify"
        onClose={handleCloseAttempt}
        showGuide={showGuide}
        guideCtaLabel={hasPriorAttempt ? "Practice again" : "Start Check"}
        onCloseGuide={() => { setCommittedMixMode(mixMode); setShowGuide(false); }}
        guideContent={guideContent}
        main={
          <div className="pb-10 max-w-2xl mx-auto">
            {!sessionComplete && (
              <div className="mb-10 px-2">
                <div className="flex w-full items-center justify-between gap-2 sm:gap-3">
                  {[...Array(activeQuestions.length)].map((_, i) => (
                    <div key={i} className="flex-1 flex justify-center">
                      <div
                        className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                          i === currentIndex
                            ? "bg-[var(--clr-focus)] scale-125 shadow-[0_0_10px_var(--clr-focus)]"
                            : i < currentIndex
                              ? "bg-[var(--clr-correct)]"
                              : "bg-[var(--color-disabled-bg)]"
                        }`}
                      />
                    </div>
                  ))}
                </div>
                {committedMixMode && (
                  <span className="mt-4 block text-center text-[10px] font-bold uppercase tracking-widest text-[var(--clr-warn)]">
                    Mixed Authors
                  </span>
                )}
              </div>
            )}

            {sessionComplete ? (
              <SummaryScreen 
                resultsLog={resultsLog} 
                onNextAuthor={onNextAuthor}
                showMixCTA={!mixMode && !hasPriorAttempt}
                onToggleMix={() => {
                   setMixMode(true); setCommittedMixMode(true); setSessionComplete(false);
                   setResultsLog([]); setCurrentIndex(0); resetQuestion();
                }}
              />
            ) : (
              <McqPanel
                question={currentQuestion}
                revealed={revealed}
                selected={selected}
                submitted={submitted}
                timer={timer}
                baseTimer={baseTimer}
                isExpert={isExpert}
                onSelect={setSelected}
                onSubmit={handleSubmitAnswer}
                onNext={handleNext}
                onReveal={() => setRevealed(true)}
              />
            )}
          </div>
        }
      />

      <AnimatePresence>
        {confidenceFlow && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[var(--clr-surface)] w-full max-w-lg p-12 text-center shadow-2xl rounded-[40px] border border-[var(--color-border-subtle)]">
              <h2 className="text-2xl font-black mb-4">Adjusting to your level</h2>
              <p className="text-[15px] leading-relaxed text-[var(--clr-ink)] opacity-50 mb-12 px-6">
                Your rating sets the <strong>thinking time</strong> for future sessions on <strong>{author.author}</strong>.
              </p>
              <div className="mb-14">
                <ConfidenceStrip visible={true} currentValue={confidence} onSelect={(val) => { 
                  posthog.capture('confidence_submit', { confidence: val, author: author.author });
                  setConfidence(val); 
                  onSaveConfidence?.({ author: author.author, exercise: "verify", confidence: val, timestamp: Date.now() }); 
                  setTimeout(onClose, 800); 
                }} embedded={true} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
