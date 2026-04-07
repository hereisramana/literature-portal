"use client";

import { useEffect, useMemo, useState } from "react";

import AuthorFocusShell from "../focus/AuthorFocusShell.jsx";
import ConfidenceStrip from "./ConfidenceStrip.jsx";
import { createTestSession } from "../../utils/testEngine.js";

function ResultNote({ children, success = false }) {
  return (
    <div
      className={`rounded-2xl px-4 py-3 text-sm leading-7 ${
        success
          ? "success-surface"
          : "bg-[var(--color-bg-raised)] text-[var(--text-body-color)]"
      }`}
    >
      {children}
    </div>
  );
}

function RetrievalPanel({ retrieval, revealed, onReveal }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-7 text-[var(--text-muted-color)]">{retrieval.prompt}</p>
      {retrieval.hints.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {retrieval.hints.map((hint) => (
            <span
              key={hint}
              className="rounded-full bg-[var(--color-bg-raised)] px-3 py-2 text-xs font-semibold text-[var(--text-muted-color)]"
            >
              {hint}
            </span>
          ))}
        </div>
      )}
      {!revealed ? (
        <button
          onClick={onReveal}
          className="rounded-full bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-semibold text-[var(--button-primary-text)]"
        >
          Reveal Support
        </button>
      ) : (
        <ul className="space-y-2">
          {retrieval.works.map((work, index) => (
            <li key={work} className="success-surface rounded-2xl px-4 py-3 text-sm">
              <span className="mr-2 font-semibold">{index + 1}.</span>
              {work}
            </li>
          ))}
        </ul>
      )}
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
}) {
  if (!question) {
    return <ResultNote success>No more questions in this section yet.</ResultNote>;
  }

  const success = submitted && selected === question.answer;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted-color)]">
          {question.layer} · {question.subType}
        </p>
        <p className="text-sm leading-7 text-[var(--text-body-color)]">{question.prompt}</p>
      </div>

      {!revealed ? (
        <button
          onClick={onReveal}
          className="rounded-full bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-semibold text-[var(--button-primary-text)]"
        >
          Reveal Options
        </button>
      ) : (
        <div className="grid gap-3">
          {question.mcqOptions.map((option) => {
            const active = selected === option;
            const correct = submitted && option === question.answer;

            return (
              <button
                key={option}
                onClick={() => onSelect(option)}
                disabled={submitted}
                className={`rounded-2xl px-4 py-3 text-left text-sm transition ${
                  correct
                    ? "success-surface"
                    : active
                    ? "bg-[var(--color-bg-accent-soft)]"
                    : "bg-[var(--color-bg-raised)] hover:bg-[var(--color-interaction-hover)]"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}

      {submitted && (
        <ResultNote success={success}>
          <span className="font-semibold">
            {success ? "Correct." : `Correct answer: ${question.answer}.`}
          </span>{" "}
          {question.explanation}
        </ResultNote>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onSubmit}
          disabled={!revealed || !selected || submitted}
          className="rounded-full bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-semibold text-[var(--button-primary-text)] disabled:cursor-not-allowed disabled:bg-[var(--color-disabled-bg)] disabled:text-[var(--color-disabled-text)]"
        >
          {submitted ? "Checked" : "Check Answer"}
        </button>

        {submitted && (
          <button
            onClick={onNext}
            className="rounded-full bg-[var(--button-secondary-bg)] px-4 py-2 text-sm font-semibold text-[var(--button-secondary-text)]"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}

function SidePanel({ title, children }) {
  return (
    <div className="rounded-[28px] bg-[var(--color-bg-raised)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted-color)]">
        {title}
      </p>
      <div className="mt-3 text-sm leading-7 text-[var(--text-body-color)]">{children}</div>
    </div>
  );
}

const GUIDES = {
  retrieve:
    "Start with pure retrieval before support appears. This is the memory-first pass for the author you chose.",
  verify:
    "Reveal the options only after recall. These questions use stronger distractors and explanations to sharpen discrimination.",
  interleave:
    "Mix adjacent or related authors so recognition does not become too context-bound. This is where comparison and transfer improve.",
};

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

  const tabs = [
    { id: "retrieve", label: "Retrieve" },
    { id: "verify", label: "Verify" },
    { id: "interleave", label: "Interleave" },
  ];

  const [activeTab, setActiveTab] = useState("retrieve");
  const [retrievalRevealed, setRetrievalRevealed] = useState(false);
  const [verifyIndex, setVerifyIndex] = useState(0);
  const [interleaveIndex, setInterleaveIndex] = useState(0);
  const [revealedByTab, setRevealedByTab] = useState({ verify: false, interleave: false });
  const [selectedByTab, setSelectedByTab] = useState({ verify: "", interleave: "" });
  const [submittedByTab, setSubmittedByTab] = useState({ verify: false, interleave: false });
  const [completed, setCompleted] = useState({});
  const [confidence, setConfidence] = useState(storedConfidence || "");
  const [closingFlow, setClosingFlow] = useState(false);

  useEffect(() => {
    setActiveTab("retrieve");
    setRetrievalRevealed(false);
    setVerifyIndex(0);
    setInterleaveIndex(0);
    setRevealedByTab({ verify: false, interleave: false });
    setSelectedByTab({ verify: "", interleave: "" });
    setSubmittedByTab({ verify: false, interleave: false });
    setCompleted({});
    setConfidence(storedConfidence || "");
    setClosingFlow(false);
  }, [author, storedConfidence]);

  const verifyQuestion = session.verifyQuestions[verifyIndex] || null;
  const interleaveQuestion = session.interleaveQuestions[interleaveIndex] || null;
  const anyCompleted = Object.keys(completed).length > 0;

  function markTabComplete(tab) {
    setCompleted((current) => ({ ...current, [tab]: true }));
  }

  function resetQuestionState(tab) {
    setRevealedByTab((current) => ({ ...current, [tab]: false }));
    setSelectedByTab((current) => ({ ...current, [tab]: "" }));
    setSubmittedByTab((current) => ({ ...current, [tab]: false }));
  }

  function handleMcqSubmit(tab) {
    setSubmittedByTab((current) => ({ ...current, [tab]: true }));
    markTabComplete(tab);
  }

  function handleNextQuestion(tab) {
    if (tab === "verify") {
      setVerifyIndex((current) =>
        Math.min(current + 1, Math.max(session.verifyQuestions.length - 1, 0))
      );
    } else {
      setInterleaveIndex((current) =>
        Math.min(current + 1, Math.max(session.interleaveQuestions.length - 1, 0))
      );
    }
    resetQuestionState(tab);
  }

  function handleCloseAttempt() {
    if (anyCompleted) {
      setClosingFlow(true);
      return;
    }
    onClose();
  }

  async function handleConfidence(value) {
    setConfidence(value);
    await onSaveConfidence({
      author: author.author,
      exercise: activeTab,
      confidence: value,
      timestamp: Date.now(),
    });
    onClose();
  }

  const notes = {
    retrieve: retrievalRevealed
      ? "The support list is visible now. Use it to compare against your own recall before moving into MCQ verification."
      : "Pause before revealing support. Try to reconstruct the works, movements, and themes mentally first.",
    verify: submittedByTab.verify && verifyQuestion
      ? `${selectedByTab.verify === verifyQuestion.answer ? "Correct." : "Checked."} ${verifyQuestion.explanation}`
      : "This section checks the chosen author directly using revealed-option questions with stronger distractors.",
    interleave: submittedByTab.interleave && interleaveQuestion
      ? `${selectedByTab.interleave === interleaveQuestion.answer ? "Correct." : "Checked."} ${interleaveQuestion.explanation}`
      : "This section mixes in related authors so the practice is less predictable and more exam-like.",
  };

  const relatedLabel =
    session.relatedAuthors.length > 0
      ? session.relatedAuthors.map((entry) => entry.author).slice(0, 3).join(", ")
      : "No related authors available yet for interleaving.";

  const meta = `${category.label} | ${author.region || "Unknown region"} | ${
    author.literary_period || "Reference"
  }`;

  return (
    <>
      <AuthorFocusShell
        modeLabel="Test Mode"
        title={author.author}
        meta={meta}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={handleCloseAttempt}
        main={
          <>
            {activeTab === "retrieve" && (
              <RetrievalPanel
                retrieval={session.retrieval}
                revealed={retrievalRevealed}
                onReveal={() => {
                  setRetrievalRevealed(true);
                  markTabComplete("retrieve");
                }}
              />
            )}

            {activeTab === "verify" && (
              <McqPanel
                question={verifyQuestion}
                revealed={revealedByTab.verify}
                selected={selectedByTab.verify}
                submitted={submittedByTab.verify}
                onReveal={() =>
                  setRevealedByTab((current) => ({ ...current, verify: true }))
                }
                onSelect={(value) =>
                  setSelectedByTab((current) => ({ ...current, verify: value }))
                }
                onSubmit={() => handleMcqSubmit("verify")}
                onNext={() => handleNextQuestion("verify")}
              />
            )}

            {activeTab === "interleave" && (
              <McqPanel
                question={interleaveQuestion}
                revealed={revealedByTab.interleave}
                selected={selectedByTab.interleave}
                submitted={submittedByTab.interleave}
                onReveal={() =>
                  setRevealedByTab((current) => ({ ...current, interleave: true }))
                }
                onSelect={(value) =>
                  setSelectedByTab((current) => ({ ...current, interleave: value }))
                }
                onSubmit={() => handleMcqSubmit("interleave")}
                onNext={() => handleNextQuestion("interleave")}
              />
            )}
          </>
        }
        sidebar={
          <>
            <SidePanel title="Exercise Guide">{GUIDES[activeTab]}</SidePanel>
            <SidePanel title="Session Notes">{notes[activeTab]}</SidePanel>
            <SidePanel title="Interleaving Pool">{relatedLabel}</SidePanel>
          </>
        }
      />

      <ConfidenceStrip
        visible={closingFlow}
        currentValue={confidence}
        onSelect={handleConfidence}
        provider={cloud.provider}
        onConnect={cloud.connect}
        onDisconnect={cloud.disconnect}
      />
    </>
  );
}
