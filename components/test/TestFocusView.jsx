"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthorFocusShell from "../focus/AuthorFocusShell.jsx";
import ConfidenceStrip from "./ConfidenceStrip.jsx";
import { createTestSession, generateMixSession } from "../../utils/testEngine.js";

// ─── Adaptive Helpers ────────────────────────────────────────────────────────
function getAdaptiveTimer(confidence) {
  const map = {
    // New Rating logic
    "1": 15, // I'm struggling
    "2": 14, // Improving
    "3": 12, // Foundational
    "4": 11, // Confident
    "5": 9,  // Mastered
    // Legacy support
    "weak": 15,
    "moderate": 13,
    "good": 11,
    "excellent": 9
  };
  return map[confidence] || 12; // Default to 12s
}

// ─── Spring toggle ───────────────────────────────────────────────────────────
function ToggleSwitch({ enabled, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.92 }}
      className="relative flex h-7 w-[52px] shrink-0 items-center rounded-full border transition-colors duration-200"
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

          {!submitted && (
            <div className="shrink-0">
              <div className="h-12 w-12 rounded-full border-2 border-white/5 flex items-center justify-center relative overflow-hidden bg-transparent">
                <span className="text-[12px] font-black text-[var(--clr-ink)] z-10">{timer}</span>
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 ${timer < 5 ? "bg-[var(--clr-wrong)]" : "bg-[var(--clr-focus)]"} opacity-20`}
                  initial={{ height: "0%" }}
                  animate={{ height: `${((15 - timer) / 15) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {!revealed ? (
        <div className="flex flex-col items-center py-10 bg-[var(--clr-recall)] rounded-2xl border border-white/5">
          <p className="text-[13px] text-[var(--clr-ink)] opacity-40 italic">
            Retrieving... options reveal in {timer}s
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
            else if (dim) { bg = "bg-transparent"; border = "border-white/5"; text = "text-[var(--clr-ink)] opacity-30"; }
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

      {submitted && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
          <div className={`p-5 rounded-xl border ${
            success
              ? "bg-[var(--clr-correct)]/10 border-[var(--clr-correct)] text-[var(--clr-correct)]"
              : "bg-[var(--clr-wrong)]/10 border-[var(--clr-wrong)] text-[var(--clr-wrong)]"
          }`}>
            <p className="font-bold text-[10px] uppercase tracking-widest mb-2">
              {success ? "Cognitive Match" : "Interference Detected"}
            </p>
            <p className="text-[14px] leading-relaxed text-[var(--clr-ink)]">
              {question.explanation}
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex justify-end pt-4">
        {!submitted ? (
          <motion.button
            whileHover={revealed && selected ? { scale: 1.02 } : {}}
            whileTap={{ scale: 0.98 }}
            onClick={onSubmit}
            disabled={!revealed || !selected}
            className="rounded-full bg-[var(--clr-focus)] px-12 py-4 text-[13px] font-bold uppercase tracking-widest text-white shadow-xl disabled:opacity-20 transition-all"
          >
            Confirm
          </motion.button>
        ) : (
          <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.98 }}
             onClick={onNext}
             className="rounded-full bg-[var(--clr-surface)] border-2 border-white/10 px-12 py-4 text-[13px] font-bold uppercase tracking-widest text-[var(--clr-ink)] transition-all"
          >
            Next Question
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ─── Summary Screen ───────────────────────────────────────────────────────────
function SummaryScreen({ resultsLog, onNextAuthor, onToggleMix, showMixCTA }) {
  const correct = resultsLog.filter(r => r.isCorrect).length;
  const total = resultsLog.length;

  return (
    <div className="p-8 bg-[var(--clr-surface)] rounded-[28px] border border-white/5 space-y-8 shadow-2xl">
      <div className="text-center space-y-2 pt-2">
        <h2 className="text-5xl font-black text-white">
          {correct}
          <span className="text-2xl opacity-25 ml-2">/ {total}</span>
        </h2>
        <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-[var(--clr-pulse)]">
          Diagnostic Score
        </p>
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        {resultsLog.map((log, i) => (
          <div key={i} className="flex items-center justify-between gap-4 bg-[var(--clr-bg)] px-4 py-3 rounded-xl border border-white/5 text-[13px]">
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

      <div className="max-w-md mx-auto space-y-3 pt-2">
        {showMixCTA && (
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "rgba(127,119,221,0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggleMix}
            className="w-full rounded-full border-2 border-[var(--clr-pulse)]/30 py-4 text-[12px] font-bold uppercase tracking-widest text-[var(--clr-pulse)] transition-all"
          >
            ⚡ Try a Mix-Test
          </motion.button>
        )}
        <motion.button
          whileHover={{ opacity: 0.9 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNextAuthor}
          className="w-full rounded-full bg-[var(--clr-focus)] py-4 text-[12px] font-bold uppercase tracking-widest text-white shadow-lg"
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
  cloud,
  onNextAuthor,
}) {
  const hasPriorAttempt = !!storedConfidence;
  
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

  // Adaptive timer baseline
  const baseTimer = useMemo(() => getAdaptiveTimer(storedConfidence), [storedConfidence]);
  const [timer, setTimer] = useState(baseTimer);

  const activeQuestions = useMemo(() => {
    if (committedMixMode) return generateMixSession(author, allAuthors);
    return createTestSession(author, category, allAuthors).verifyQuestions;
  }, [author, category, allAuthors, committedMixMode]);

  const currentQuestion = activeQuestions[currentIndex] || null;

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

  function handleNextAuthor() {
    onNextAuthor?.();
  }

  const guideContent = (
    <div className="space-y-6 text-left">
      {!hasPriorAttempt ? (
        <>
          <p className="text-[15px] leading-relaxed opacity-70">
            Initial diagnostic session: Try to identify the correct answer from memory before the options are revealed.
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] font-bold opacity-30">
            12 questions · 5 Analytic dimensions
          </p>
        </>
      ) : (
        <div className="flex flex-col gap-6">
          <p className="text-[16px] font-bold">Ready to drill?</p>
          <div className="rounded-xl border border-[var(--clr-focus)]/25 bg-[var(--clr-recall)]/40 p-5">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="font-bold text-[15px] text-white">Mixed Interleaving</p>
                <p className="text-[12px] opacity-50 mt-1 leading-relaxed">
                  Based on the <span className="text-[var(--clr-pulse)]">interleaving principle</span>: 
                  switching authors mid-session builds significantly stronger retrieval strength than blocked study.
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
        guideCtaLabel={hasPriorAttempt ? "Start Drill" : "Begin Diagnostic"}
        onCloseGuide={() => { setCommittedMixMode(mixMode); setShowGuide(false); }}
        guideContent={guideContent}
        main={
          <div className="pb-10">
            {!sessionComplete && (
              <div className="mb-8 flex items-center justify-between px-5 py-4 bg-[var(--clr-surface)] rounded-2xl border border-white/5 shadow-lg">
                <div className="flex gap-1.5">
                  {[...Array(activeQuestions.length)].map((_, i) => (
                    <div key={i} className={`h-1.5 w-6 rounded-full transition-all ${
                      i === currentIndex ? "bg-[var(--clr-focus)]" : i < currentIndex ? "bg-[var(--clr-correct)]" : "bg-white/5"
                    }`} />
                  ))}
                </div>
                <div className="flex items-center gap-4">
                   {committedMixMode && <span className="text-[10px] font-bold text-[var(--clr-warn)] uppercase tracking-widest pl-4">Interleaved</span>}
                   <span className="text-[10px] font-bold opacity-30">{baseTimer}s Threshold</span>
                </div>
              </div>
            )}

            {sessionComplete ? (
              <SummaryScreen 
                resultsLog={resultsLog} 
                onNextAuthor={handleNextAuthor}
                showMixCTA={!mixMode && !hasPriorAttempt}
                onToggleMix={() => {
                   setMixMode(true);
                   setCommittedMixMode(true);
                   setSessionComplete(false);
                   setResultsLog([]);
                   setCurrentIndex(0);
                   resetQuestion();
                }}
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

      <AnimatePresence>
        {confidenceFlow && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[var(--clr-surface)] w-full max-w-lg p-12 text-center shadow-2xl rounded-[40px] border border-white/10">
              <h3 className="text-2xl font-black mb-4">Academic Calibration</h3>
              <p className="text-[15px] leading-relaxed text-[var(--clr-ink)] opacity-50 mb-12 px-6">
                Your rating dictates the <strong>recall threshold</strong> (timer) for future sessions on <strong>{author.author}</strong>.
              </p>
              <div className="mb-14">
                <ConfidenceStrip visible={true} currentValue={confidence} onSelect={(val) => { setConfidence(val); onSaveConfidence?.({ author: author.author, exercise: "verify", confidence: val, timestamp: Date.now() }); setTimeout(onClose, 800); }} embedded={true} />
              </div>
              <button onClick={onClose} className="text-[12px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 transition">Skip for now</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
