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
          ? "success-surface"
          : "error-surface"
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
  if (!question) return null;

  const success = submitted && selected === question.answer;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-6">
           <div className="flex-1">
             <span className="inline-block mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--clr-pulse)]">{question.slot}</span>
             <p className="text-[18px] font-semibold leading-relaxed text-[var(--clr-ink)]">{question.prompt}</p>
           </div>
           {!submitted && (
             <div className="flex flex-col items-center shrink-0">
               <div className="h-12 w-12 rounded-full border-2 border-[var(--clr-dim)] flex items-center justify-center relative overflow-hidden bg-transparent">
                 <span className="text-[12px] font-black text-[var(--clr-ink)] z-10">{timer}</span>
                 <motion.div
                   className={`absolute bottom-0 left-0 right-0 ${timer < 5 ? 'bg-[var(--clr-warn)]' : 'bg-[var(--clr-focus)]'} opacity-20`}
                   initial={{ height: "0%" }}
                   animate={{ height: `${(15 - timer) / 15 * 100}%` }}
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

      {!revealed ? (
        <div className="flex flex-col items-center gap-6 py-8 bg-[var(--clr-recall)] rounded-2xl border border-white/5">
           <p className="text-[13px] text-[var(--clr-ink)] opacity-60 italic">Hold the answer in mind — options appear in {timer}s</p>
           <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "var(--clr-pulse)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { onIRecallIt(); onReveal(); }}
            className="rounded-full bg-[var(--clr-focus)] px-10 py-4 text-[13px] font-bold uppercase tracking-[0.1em] text-white shadow-lg transition-colors"
          >
            I recall it
          </motion.button>
        </div>
      ) : (
        <div className="grid gap-3 mt-4">
          {question.mcqOptions.map((option) => {
            const isCorrect = option === question.answer;
            const isSelected = selected === option;
            const showCorrect = submitted && isCorrect;
            const showWrong = submitted && isSelected && !isCorrect;
            const dim = submitted && !isCorrect && !isSelected;

            let bgColor = "bg-[var(--clr-surface)]";
            let borderColor = "border-white/10";
            let textColor = "text-[var(--clr-ink)]";

            if (showCorrect) {
              bgColor = "bg-[var(--clr-correct)]";
              borderColor = "border-[var(--clr-correct)]";
              textColor = "text-white";
            } else if (showWrong) {
              bgColor = "bg-[var(--clr-wrong)]";
              borderColor = "border-[var(--clr-wrong)]";
              textColor = "text-white";
            } else if (dim) {
              bgColor = "bg-transparent";
              borderColor = "border-[var(--clr-dim)]";
              textColor = "text-[var(--clr-dim)]";
            } else if (isSelected && !submitted) {
              borderColor = "border-[var(--clr-pulse)]";
              bgColor = "bg-[var(--clr-recall)]";
            }

            return (
              <motion.button
                key={option}
                whileHover={!submitted ? { scale: 1.01, borderColor: "var(--clr-pulse)" } : {}}
                whileTap={{ scale: 0.995 }}
                onClick={() => onSelect(option)}
                disabled={submitted}
                className={`rounded-xl px-6 py-4 text-left text-[15px] transition-all border-2 ${bgColor} ${borderColor} ${textColor}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      )}

      {submitted && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
           <div className={`p-5 rounded-xl border ${success ? 'bg-[var(--clr-correct)]/10 border-[var(--clr-correct)] text-[var(--clr-correct)]' : 'bg-[var(--clr-wrong)]/10 border-[var(--clr-wrong)] text-[var(--clr-wrong)]'}`}>
              <p className="font-bold text-xs uppercase tracking-widest mb-2">{success ? `Correct +${selected ? '2' : '0'} pts` : 'Incorrect'}</p>
              <p className="text-[14px] leading-relaxed text-[var(--clr-ink)]">{question.explanation}</p>
           </div>
        </motion.div>
      )}

      <div className="flex justify-end pt-4">
        {!submitted ? (
          <motion.button
            whileHover={!(!revealed || !selected || submitted) ? { scale: 1.02, backgroundColor: "var(--clr-pulse)" } : {}}
            whileTap={{ scale: 0.98 }}
            onClick={onSubmit}
            disabled={!revealed || !selected || submitted}
            className="rounded-full bg-[var(--clr-focus)] px-12 py-4 text-[13px] font-bold uppercase tracking-widest text-white shadow-xl disabled:opacity-20 transition-all"
          >
            Confirm
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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

function SummaryScreen({ score, maxScore, resultsLog, onRetry, onDashboard }) {
  let label = "Keep reading";
  if (score === 36) label = "Perfect recall";
  else if (score >= 27) label = "Strong command";
  else if (score >= 18) label = "Good grasp";

  return (
    <div className="p-10 bg-[var(--clr-surface)] rounded-[32px] border border-white/5 space-y-8 animate-in fade-in slide-in-from-bottom-4 shadow-2xl">
      <div className="text-center space-y-2">
         <h2 className="text-5xl font-black text-white">{score} <span className="text-2xl opacity-30">/ {maxScore}</span></h2>
         <p className="text-[14px] font-bold uppercase tracking-[0.3em] text-[var(--clr-pulse)]">{label}</p>
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        {resultsLog.map((log, i) => (
          <div key={i} className="flex justify-between items-center text-[13px] bg-[var(--clr-bg)] p-4 rounded-xl border border-white/5">
             <span className="font-medium text-[var(--clr-ink)] opacity-70 truncate pr-4">{i + 1}. {log.dimension}</span>
             <div className="flex gap-4 items-center shrink-0">
               <span className={`text-lg ${log.isCorrect ? 'text-[var(--clr-correct)]' : 'text-[var(--clr-wrong)]'}`}>{log.isCorrect ? '●' : '○'}</span>
               <span className="text-[12px] font-bold text-white w-8 text-right">+{log.points}</span>
             </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 max-w-md mx-auto pt-8">
         <button onClick={onRetry} className="rounded-full bg-[var(--clr-focus)] py-4 text-[13px] font-bold uppercase tracking-widest text-white hover:bg-[var(--clr-pulse)] transition-colors shadow-lg">Try same author</button>
         <button onClick={onDashboard} className="rounded-full bg-transparent border-2 border-[var(--clr-dim)] py-4 text-[13px] font-bold uppercase tracking-widest text-[var(--clr-ink)] hover:bg-white/5 transition-colors">Back to Dashboard</button>
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
        guideCtaLabel="Enter Challenge"
        showGuideSkip={false}
        onCloseGuide={() => {
          setShowGuide(false);
          setHasSeenGuide(true);
          localStorage.setItem(`seenTestGuide_${author.author}`, "true");
        }}
        guideContent={
          <div className="space-y-4">
             <p className="text-lg font-medium">Dimension Testing Sequence</p>
             <ul className="space-y-2 opacity-70 text-sm">
                <li>• 12 Questions across 5 specific analytic dimensions</li>
                <li>• <span className="text-[var(--clr-pulse)] font-bold">RECALL Phase:</span> Recall early for 3 points</li>
                <li>• <span className="text-[var(--clr-pulse)] font-bold">RECOGNISE Phase:</span> Identify from options for 2 points</li>
             </ul>
          </div>
        }
        main={
          <div className="pb-10">
            {!sessionComplete && (
               <div className="mb-8 flex items-center justify-between p-6 bg-[var(--clr-surface)] rounded-2xl border border-white/5 shadow-xl">
                 <div className="flex gap-2">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className={`h-1.5 w-6 rounded-full ${i === currentIndex ? 'bg-[var(--clr-focus)]' : i < currentIndex ? 'bg-[var(--clr-correct)]' : 'bg-[var(--clr-dim)]'}`} />
                    ))}
                 </div>
                 <div className="text-[13px] font-black tracking-[0.2em] uppercase text-white/40">
                   {sessionScore} <span className="opacity-40">pts</span>
                 </div>
               </div>
            )}

            {sessionComplete ? (
               <SummaryScreen score={sessionScore} maxScore={36} resultsLog={resultsLog} onRetry={restartTest} onDashboard={handleCloseAttempt} />
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
                <ConfidenceStrip visible={true} currentValue={confidence} onSelect={handleConfidence} provider={cloud?.provider} onConnect={cloud?.connect} onDisconnect={cloud?.disconnect} embedded={true} />
              </div>

              <button onClick={onClose} className="w-full rounded-full bg-white/5 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-white/10 transition">Skip for Now</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
