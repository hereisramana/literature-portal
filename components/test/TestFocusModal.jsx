"use client";

import { useEffect, useMemo, useState } from "react";

import ConfidenceStrip from "./ConfidenceStrip.jsx";
import { createExerciseSet } from "../../utils/testEngine.js";

function ResultNote({ children, success = false }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm leading-7 ${
        success
          ? "success-surface"
          : "border-[var(--divider-color)] bg-[var(--color-bg-primary)] text-[var(--text-body-color)]"
      }`}
    >
      {children}
    </div>
  );
}

function RecallExercise({ exercise, revealed, onReveal }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-7 text-[var(--text-muted-color)]">
        {exercise.prompt}
      </p>
      {!revealed ? (
        <button
          onClick={onReveal}
          className="rounded-full bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-semibold text-[var(--button-primary-text)]"
        >
          Reveal Works
        </button>
      ) : (
        <ul className="space-y-2">
          {exercise.data.works.map((work, index) => (
            <li key={work} className="success-surface rounded-2xl border px-4 py-3 text-sm">
              <span className="mr-2 font-semibold">{index + 1}.</span>
              {work}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SelectExercise({ exercise, selected, onToggle, onSubmit, submitted, result }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-7 text-[var(--text-muted-color)]">
        {exercise.prompt}
      </p>
      <div className="grid gap-3">
        {exercise.data.options.map((option) => {
          const active = selected.includes(option);
          const isCorrect = submitted && exercise.data.answers.includes(option);
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                isCorrect
                  ? "success-surface"
                  : active
                  ? "border-[var(--button-primary-bg)] bg-[var(--color-interaction-active)]"
                  : "border-[var(--divider-color)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-interaction-hover)]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {submitted && <ResultNote success={result?.success}>{result?.message}</ResultNote>}
      <button
        onClick={onSubmit}
        disabled={submitted}
        className="rounded-full bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-semibold text-[var(--button-primary-text)] disabled:cursor-not-allowed disabled:bg-[var(--color-disabled-bg)] disabled:text-[var(--color-disabled-text)]"
      >
        {submitted ? "Checked" : "Check Answer"}
      </button>
    </div>
  );
}

function OrderingExercise({ exercise, placed, onPlace, onReset, onSubmit, submitted, result }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-7 text-[var(--text-muted-color)]">
        {exercise.prompt}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted-color)]">
            Your order
          </p>
          {exercise.data.answer.map((_, index) => {
            const correctValue = submitted ? exercise.data.answer[index] : null;
            const value = placed[index] || `Slot ${index + 1}`;
            const isCorrect = submitted && value === correctValue;
            return (
              <div
                key={index}
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  isCorrect
                    ? "success-surface"
                    : "border-dashed border-[var(--divider-color)]"
                }`}
              >
                {submitted ? correctValue : value}
              </div>
            );
          })}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted-color)]">
            Tap to place
          </p>
          {exercise.data.shuffled.map((item) => (
            <button
              key={item}
              onClick={() => onPlace(item)}
              disabled={placed.includes(item)}
              className="w-full rounded-2xl border border-[var(--divider-color)] bg-[var(--color-bg-primary)] px-4 py-3 text-left text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {submitted && <ResultNote success={result?.success}>{result?.message}</ResultNote>}
      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          disabled={submitted}
          className="rounded-full bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-semibold text-[var(--button-primary-text)] disabled:cursor-not-allowed disabled:bg-[var(--color-disabled-bg)] disabled:text-[var(--color-disabled-text)]"
        >
          {submitted ? "Checked" : "Check Order"}
        </button>
        <button
          onClick={onReset}
          className="rounded-full border border-[var(--divider-color)] bg-[var(--button-secondary-bg)] px-4 py-2 text-sm font-semibold text-[var(--button-secondary-text)]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function ThemesExercise({ exercise, answers, onChange, onSubmit, submitted, result }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-7 text-[var(--text-muted-color)]">
        {exercise.prompt}
      </p>
      <div className="space-y-3">
        {exercise.data.pairs.map((pair) => {
          const correctAnswer = submitted ? pair.answer : null;
          const isCorrect = submitted && answers[pair.prompt] === pair.answer;
          return (
            <div key={pair.prompt} className="rounded-2xl bg-[var(--color-bg-primary)] p-4">
              <p className="mb-3 text-sm font-semibold text-[var(--text-heading-color)]">
                {pair.prompt}
              </p>
              <select
                value={answers[pair.prompt] || ""}
                onChange={(event) => onChange(pair.prompt, event.target.value)}
                className={`w-full rounded-xl border bg-[var(--input-bg)] px-3 py-2 text-sm ${
                  isCorrect ? "success-surface" : "border-[var(--input-border)]"
                }`}
              >
                <option value="">Select theme</option>
                {exercise.data.choices.map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
              {submitted && (
                <p className={`mt-2 text-xs font-semibold ${isCorrect ? "text-[var(--color-success-text)]" : "text-[var(--text-muted-color)]"}`}>
                  Correct theme: {correctAnswer}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {submitted && <ResultNote success={result?.success}>{result?.message}</ResultNote>}
      <button
        onClick={onSubmit}
        disabled={submitted}
        className="rounded-full bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-semibold text-[var(--button-primary-text)] disabled:cursor-not-allowed disabled:bg-[var(--color-disabled-bg)] disabled:text-[var(--color-disabled-text)]"
      >
        {submitted ? "Checked" : "Check Matches"}
      </button>
    </div>
  );
}

function TypeExercise({ exercise, selected, onSelect, onSubmit, submitted, result }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-7 text-[var(--text-muted-color)]">
        {exercise.prompt}
      </p>
      <div className="rounded-3xl bg-[var(--color-bg-primary)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted-color)]">
          Current category
        </p>
        <p className="mt-2 text-base font-semibold text-[var(--text-heading-color)]">
          {exercise.data.categoryLabel}
        </p>
        <ul className="mt-4 space-y-2 text-sm text-[var(--text-muted-color)]">
          {exercise.data.works.map((work) => (
            <li key={work}>{work}</li>
          ))}
        </ul>
      </div>
      <div className="grid gap-3">
        {exercise.data.choices.map((choice) => {
          const isCorrect = submitted && choice === exercise.data.answer;
          return (
            <button
              key={choice}
              onClick={() => onSelect(choice)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                isCorrect
                  ? "success-surface"
                  : selected === choice
                  ? "border-[var(--button-primary-bg)] bg-[var(--color-interaction-active)]"
                  : "border-[var(--divider-color)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-interaction-hover)]"
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>
      {submitted && <ResultNote success={result?.success}>{result?.message}</ResultNote>}
      <button
        onClick={onSubmit}
        disabled={submitted}
        className="rounded-full bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-semibold text-[var(--button-primary-text)] disabled:cursor-not-allowed disabled:bg-[var(--color-disabled-bg)] disabled:text-[var(--color-disabled-text)]"
      >
        {submitted ? "Checked" : "Check Lens"}
      </button>
    </div>
  );
}

const GUIDES = {
  recall: "Reveal mode shows the full works list after a memory attempt. Use it as a quick warm-up before structured questions.",
  select: "Select every work that truly belongs to this author. Correct titles turn green after checking.",
  ordering: "Rebuild the works in listed syllabus order. When checked, the correct sequence is surfaced in green.",
  themes: "Pair each work with the best theme cue. The options are mixed with distractor themes drawn from other texts in the dataset.",
  type: "Choose the most useful interpretive lens for this author within the active category. The expected answer is highlighted after checking.",
};

export default function TestFocusModal({
  author,
  category,
  allAuthors,
  onClose,
  storedConfidence,
  onSaveConfidence,
  cloud,
}) {
  const exercises = useMemo(
    () => createExerciseSet(author, category, allAuthors),
    [author, category, allAuthors]
  );

  const [activeMode, setActiveMode] = useState(exercises[0]?.id || "recall");
  const [revealed, setRevealed] = useState(false);
  const [selectedWorks, setSelectedWorks] = useState([]);
  const [placedOrder, setPlacedOrder] = useState([]);
  const [themeAnswers, setThemeAnswers] = useState({});
  const [typeAnswer, setTypeAnswer] = useState("");
  const [completed, setCompleted] = useState({});
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(storedConfidence || "");
  const [closingFlow, setClosingFlow] = useState(false);

  useEffect(() => {
    setActiveMode(exercises[0]?.id || "recall");
    setRevealed(false);
    setSelectedWorks([]);
    setPlacedOrder([]);
    setThemeAnswers({});
    setTypeAnswer("");
    setCompleted({});
    setResult(null);
    setConfidence(storedConfidence || "");
    setClosingFlow(false);
  }, [author, exercises, storedConfidence]);

  const activeExercise = exercises.find((exercise) => exercise.id === activeMode);
  const activeComplete = Boolean(completed[activeMode]);
  const anyCompleted = Object.keys(completed).length > 0;

  const markComplete = (nextResult) => {
    setCompleted((current) => ({ ...current, [activeMode]: true }));
    setResult(nextResult);
  };

  const handleSelectSubmit = () => {
    const expected = [...activeExercise.data.answers].sort().join("|");
    const actual = [...selectedWorks].sort().join("|");
    markComplete({
      success: expected === actual,
      message:
        expected === actual
          ? "Nice. You selected the correct set of works."
          : `Correct works: ${activeExercise.data.answers.join(", ")}`,
    });
  };

  const handleOrderingSubmit = () => {
    const expected = activeExercise.data.answer.join("|");
    const actual = placedOrder.join("|");
    markComplete({
      success: expected === actual,
      message:
        expected === actual
          ? "Great. You rebuilt the listed syllabus order."
          : `Correct order: ${activeExercise.data.answer.join(" -> ")}`,
    });
  };

  const handleThemesSubmit = () => {
    const matches = activeExercise.data.pairs.every(
      (pair) => themeAnswers[pair.prompt] === pair.answer
    );
    markComplete({
      success: matches,
      message: matches
        ? "Strong match. Your theme links line up with the prompt cues."
        : "Checked. The correct theme cues are now shown under each work.",
    });
  };

  const handleTypeSubmit = () => {
    markComplete({
      success: typeAnswer === activeExercise.data.answer,
      message:
        typeAnswer === activeExercise.data.answer
          ? "Good choice. That lens fits the current category best."
          : `Correct lens: ${activeExercise.data.answer}`,
    });
  };

  const handleCloseAttempt = () => {
    if (anyCompleted) {
      setClosingFlow(true);
      return;
    }
    onClose();
  };

  const handleConfidence = async (value) => {
    setConfidence(value);
    await onSaveConfidence({
      author: author.author,
      exercise: activeMode,
      confidence: value,
      timestamp: Date.now(),
    });
    onClose();
  };

  if (!author) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[rgba(47,43,36,0.22)] backdrop-blur-sm" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="card flex h-[min(88vh,860px)] w-full max-w-4xl flex-col overflow-hidden rounded-[32px]">
          <div className="flex flex-col gap-4 border-b border-[var(--divider-color)] px-5 pb-5 pt-5 md:px-8 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted-color)]">
                Focus Mode
              </p>
              <h2 className="mt-2 text-3xl leading-tight md:text-4xl">
                {author.author}
              </h2>
              <p className="mt-2 text-sm text-[var(--text-muted-color)]">
                {category.label} | {author.region || "Unknown region"} | {author.literary_period || "Reference"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid grid-cols-2 gap-2 rounded-full bg-[var(--button-secondary-bg)] p-1 md:grid-cols-5">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => {
                      setActiveMode(exercise.id);
                      setResult(null);
                    }}
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                      activeMode === exercise.id
                        ? "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]"
                        : "text-[var(--text-muted-color)]"
                    }`}
                  >
                    {exercise.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCloseAttempt}
                className="rounded-full border border-[var(--divider-color)] bg-[var(--button-secondary-bg)] px-4 py-2 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>

          <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-6 md:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
              <div className="rounded-[28px] bg-[var(--color-bg-primary)] p-5 md:p-6">
                {activeExercise?.id === "recall" && (
                  <RecallExercise
                    exercise={activeExercise}
                    revealed={revealed}
                    onReveal={() => {
                      setRevealed(true);
                      markComplete({
                        success: true,
                        message: "Reveal complete. Use this as a quick recall check.",
                      });
                    }}
                  />
                )}

                {activeExercise?.id === "select" && (
                  <SelectExercise
                    exercise={activeExercise}
                    selected={selectedWorks}
                    onToggle={(option) =>
                      setSelectedWorks((current) =>
                        current.includes(option)
                          ? current.filter((item) => item !== option)
                          : [...current, option]
                      )
                    }
                    onSubmit={handleSelectSubmit}
                    submitted={activeComplete}
                    result={result}
                  />
                )}

                {activeExercise?.id === "ordering" && (
                  <OrderingExercise
                    exercise={activeExercise}
                    placed={placedOrder}
                    onPlace={(item) =>
                      setPlacedOrder((current) =>
                        current.includes(item)
                          ? current
                          : [...current, item].slice(0, activeExercise.data.answer.length)
                      )
                    }
                    onReset={() => setPlacedOrder([])}
                    onSubmit={handleOrderingSubmit}
                    submitted={activeComplete}
                    result={result}
                  />
                )}

                {activeExercise?.id === "themes" && (
                  <ThemesExercise
                    exercise={activeExercise}
                    answers={themeAnswers}
                    onChange={(prompt, value) =>
                      setThemeAnswers((current) => ({ ...current, [prompt]: value }))
                    }
                    onSubmit={handleThemesSubmit}
                    submitted={activeComplete}
                    result={result}
                  />
                )}

                {activeExercise?.id === "type" && (
                  <TypeExercise
                    exercise={activeExercise}
                    selected={typeAnswer}
                    onSelect={setTypeAnswer}
                    onSubmit={handleTypeSubmit}
                    submitted={activeComplete}
                    result={result}
                  />
                )}
              </div>

              <aside className="space-y-4">
                <div className="rounded-[28px] bg-[var(--color-bg-primary)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted-color)]">
                    Exercise Guide
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-body-color)]">
                    {GUIDES[activeMode]}
                  </p>
                </div>

                <div className="rounded-[28px] bg-[var(--color-bg-primary)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted-color)]">
                    Session Notes
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-body-color)]">
                    {result?.message || "Work through one exercise at a time. When you close the session, you will be asked to save your confidence level for this author."}
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

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
