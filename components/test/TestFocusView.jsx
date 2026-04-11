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
      className={`rounded-xl px-5 py-4 text-[14px] leading-relaxed shadow-sm border ${
        success
          ? "success-surface border-[var(--color-success-border)]"
          : "bg-[var(--color-bg-surface)] text-[var(--text-body-color)] border-[var(--color-border-subtle)]"
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
  onIRecallIt,
  onReveal,
  onSelect,
  onSubmit,
  onNext,
  timer,
}) {
  if (!question) {
    return <div className="p-8 text-center bg-[var(--color-bg-inset)] rounded-2xl border border-[var(--color-border-subtle)] shadow-inner">
      <p className="text-[14px] font-bold text-[var(--text-muted-color)] opacity-60">No more questions available for this session.</p>
    </div>;
  }

  const success = submitted && selected === question.answer;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-6">
           <div className="flex-1">
             <span className="inline-block mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-strong)]">{question.slot}</span>
             <p className="text-[16px] font-bold leading-relaxed text-[var(--text-body-color)]">{question.prompt}</p>
           </div>
           {!submitted && (
             <div className="flex flex-col items-center shrink-0">
               <div className="h-10 w-10 rounded-full border border-[var(--color-border-strong)] flex items-center justify-center relative overflow-hidden bg-[var(--color-bg-surface)]">
                 <span className="text-[11px] font-black text-[var(--color-text-primary)] z-10">{timer}</span>
                 <motion.div
                   className="absolute bottom-0 left-0 right-0 bg-[var(--color-text-strong)] opacity-10"
                   initial={{ height: "0%" }}
                   animate={{ height: `${(15 - timer) / 15 * 100}%` }}
                 />
               </div>
             </div>
           )}
        </div>
      </div>

      {!revealed ? (
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { onIRecallIt(); onReveal(); }}
            className="rounded-full bg-[var(--color-accent-strong)] px-8 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-white shadow-sm"
          >
            I recall it
          </motion.button>
        </div>
      ) : (
        <div className="grid gap-2 mt-4">
          {question.mcqOptions.map((option) => {
            const active = selected === option;
            const correct = submitted && option === question.answer;
            const wrongSelection = submitted && active && !correct;

            let btnClass = "bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-inset)] border-[var(--color-border-subtle)] shadow-sm";
            if (correct) {
              btnClass = "success-surface border-[var(--color-success-border)] shadow-sm z-10 scale-[1.02]";
            } else if (wrongSelection) {
              btnClass = "error-surface border-[var(--color-error-border)] shadow-sm";
            } else if (active && !submitted) {
              btnClass = "bg-[var(--color-bg-accent-soft)] border-[var(--color-border-strong)] shadow-inner";
            } else if (submitted) {
              btnClass = "bg-[var(--color-bg-surface)] opacity-60 border-[var(--color-border-subtle)]";
            }

            return (
              <motion.button
                key={option}
                whileHover={!submitted ? { x: 4, backgroundColor: "rgba(0,0,0,0.02)" } : {}}
                whileTap={{ scale: 0.995 }}
                onClick={() => onSelect(option)}
                disabled={submitted}
                className={`rounded-xl px-5 py-3.5 text-left text-[14px] transition-all border ${btnClass}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      )}

      {submitted && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
          <ResultNote checked={submitted} success={success}>
            <p className="font-bold mb-1 uppercase tracking-tight text-xs">
              {success ? "You're correct!" : "You missed it."}
            </p>
            <p className="text-[14px]">
               {question.explanation}
            </p>
          </ResultNote>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-3 pt-4">
        {!submitted ? (
          <motion.button
            whileHover={!(!revealed || !selected || submitted) ? { scale: 1.02 } : {}}
            whileTap={{ scale: 0.98 }}
            onClick={onSubmit}
            disabled={!revealed || !selected || submitted}
            className="rounded-full bg-[var(--color-text-strong)] px-10 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] text-white shadow-md disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            Check Answer
          </motion.button>
        ) : (
          <motion.button
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02, backgroundColor: "var(--color-bg-surface)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="rounded-full bg-[var(--color-bg-inset)] border border-[var(--color-border-subtle)] px-10 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] text-[var(--text-heading-color)] shadow-sm transition-all"
          >
            Next
          </motion.button>
        )}
      </div>
    </div>
  );
}

function SummaryScreen({ score, maxScore, resultsLog, onRetry, onDashboard }) {
  let label = "Keep reading";
  if (score === 36) label = "Perfect recall";
  else if (score >= 27) label = "Strong command";
  else if (score >= 18) label = "Good grasp";

  return (
    <div className="p-8 pb-12 bg-[var(--color-bg-inset)] rounded-[32px] border border-[var(--color-border-subtle)] space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center space-y-2">
         <h2 className="text-3xl font-black text-[var(--text-heading-color)]">{score} / {maxScore}</h2>
         <p className="text-[14px] font-bold uppercase tracking-widest text-[var(--color-accent-strong)]">{label}</p>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted-color)] mb-4 border-b border-[var(--color-border-subtle)] pb-2">Breakdown</h4>
        {resultsLog.map((log, i) => (
          <div key={i} className="flex justify-between items-center text-[13px] bg-[var(--color-bg-surface)] p-3 rounded-lg border border-[var(--color-border-subtle)]">
             <span className="font-medium text-[var(--text-body-color)] truncate pr-4">{i + 1}. {log.dimension}</span>
             <div className="flex gap-3 items-center shrink-0">
               <span className={`font-black ${log.isCorrect ? 'text-green-600' : 'text-red-500'}`}>{log.isCorrect ? '✓' : '✗'}</span>
               <span className="text-[11px] font-bold text-[var(--text-muted-color)] w-8 text-right">+{log.points}</span>
             </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 max-w-sm mx-auto pt-6">
         <button onClick={onRetry} className="rounded-full bg-[var(--color-text-strong)] px-8 py-3.5 text-[12px] font-black uppercase tracking-widest text-white hover:scale-[1.02] transition-transform">Try same author</button>
         <button onClick={onDashboard} className="rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border-strong)] px-8 py-3.5 text-[12px] font-black uppercase tracking-widest text-[var(--text-body-color)] hover:bg-[var(--color-bg-inset)] transition-colors">Back to Dashboard</button>
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

  const [hasSeenGuide, setHasSeenGuide] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(`seenTestGuide_${author.author}`) === "true";
  });
  const [showGuide, setShowGuide] = useState(!hasSeenGuide);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [resultsLog, setResultsLog] = useState([]);
  const [recalledFlags, setRecalledFlags] = useState({});

  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [confidenceFlow, setConfidenceFlow] = useState(false);
  const [confidence, setConfidence] = useState(storedConfidence || "");

  const [timer, setTimer] = useState(15);

  const activeQuestions = session.verifyQuestions;
  const currentQuestion = activeQuestions[currentIndex] || null;

  useEffect(() => {
    if (showGuide || submitted || revealed || !currentQuestion || sessionComplete) return;

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
  }, [currentIndex, showGuide, submitted, revealed, currentQuestion, sessionComplete]);

  function resetQuestion() {
    setRevealed(false);
    setSelected("");
    setSubmitted(false);
    setTimer(15);
  }

  function handleNext() {
    if (sessionComplete) return;
    
    // Auto-advance checks result if not already done, but the user must click 'Check Answer' first so it's always submitted
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
    const isRecalled = recalledFlags[currentIndex];
    
    let pts = 0;
    if (isCorrect && isRecalled) pts = 3;
    else if (isCorrect) pts = 2;

    setResultsLog(prev => [...prev, {
      dimension: currentQuestion.slot || "Fallback",
      isCorrect,
      points: pts
    }]);

    setSessionScore(prev => prev + pts);

    setTimeout(() => {
      handleNext();
    }, 2000); // 2 second automatic move to next
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

  function restartTest() {
     setSessionComplete(false);
     setSessionScore(0);
     setResultsLog([]);
     setRecalledFlags({});
     setCurrentIndex(0);
     resetQuestion();
     setQuestionsAttempted(0);
  }

  return (
    <>
      <AuthorFocusShell
        title={author.author}
        tabs={[{ id: "verify", label: "Recall and Recognise" }]}
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
            You will see 12 questions across 5 dimensions. Try to <strong>Recall</strong> it before the timer ends for 3 pts. If you wait, you can <strong>Recognise</strong> from options for 2 pts. Good luck!
          </p>
        }
        main={
          <div className="pb-10">
            {!sessionComplete && (
               <div className="mb-10 flex items-center justify-between p-6 bg-[var(--color-bg-inset)] rounded-[28px] shadow-inner border border-white/20">
                 <div>
                   <h4 className="text-sm font-bold text-[var(--text-heading-color)] mt-1">
                     Question {currentIndex + 1} of 12
                   </h4>
                 </div>
                 <div className="text-[12px] font-black tracking-widest uppercase text-[var(--color-accent-strong)]">
                   Score: {sessionScore}
                 </div>
               </div>
            )}

            {sessionComplete ? (
               <SummaryScreen 
                 score={sessionScore} 
                 maxScore={36} 
                 resultsLog={resultsLog} 
                 onRetry={restartTest} 
                 onDashboard={handleCloseAttempt} 
               />
            ) : (
              <McqPanel
                question={currentQuestion}
                revealed={revealed}
                selected={selected}
                submitted={submitted}
                timer={timer}
                onIRecallIt={() => setRecalledFlags(prev => ({...prev, [currentIndex]: true}))}
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
                    provider={cloud?.provider}
                    onConnect={cloud?.connect}
                    onDisconnect={cloud?.disconnect}
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
