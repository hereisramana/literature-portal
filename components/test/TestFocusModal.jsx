"use client";

import { useEffect, useMemo, useState } from "react";

import ConfidenceStrip from "./ConfidenceStrip.jsx";
import { createExerciseSet } from "../../utils/testEngine.js";

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
            <li key={work} className="rounded-2xl bg-[var(--color-bg-primary)] px-4 py-3 text-sm">
              <span className="mr-2 text-[var(--color-accent)]">{index + 1}.</span>
              {work}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SelectExercise({ exercise, selected, onToggle, onSubmit, submitted }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-7 text-[var(--text-muted-color)]">
        {exercise.prompt}
      </p>
      <div className="grid gap-3">
        {exercise.data.options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                active
                  ? "border-[var(--button-primary-bg)] bg-[var(--color-interaction-active)]"
                  : "border-[var(--divider-color)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-interaction-hover)]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
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

function OrderingExercise({ exercise, placed, onPlace, onReset, onSubmit, submitted }) {
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
          {exercise.data.answer.map((_, index) => (
            <div key={index} className="rounded-2xl border border-dashed border-[var(--divider-color)] px-4 py-3 text-sm">
              {placed[index] || `Slot ${index + 1}`}
            </div>
          ))}
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

function ThemesExercise({ exercise, answers, onChange, onSubmit, submitted }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-7 text-[var(--text-muted-color)]">
        {exercise.prompt}
      </p>
      <div className="space-y-3">
        {exercise.data.pairs.map((pair) => (
          <div key={pair.prompt} className="rounded-2xl bg-[var(--color-bg-primary)] p-4">
            <p className="mb-3 text-sm font-semibold text-[var(--text-heading-color)]">
              {pair.prompt}
            </p>
            <select
              value={answers[pair.prompt] || ""}
              onChange={(event) => onChange(pair.prompt, event.target.value)}
              className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
            >
              <option value="">Select theme</option>
              {exercise.data.choices.map((choice) => (
                <option key={choice} value={choice}>
                  {choice}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
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

function TypeExercise({ exercise, selected, onSelect, onSubmit, submitted }) {
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
        {exercise.data.choices.map((choice) => (
          <button
            key={choice}
            onClick={() => onSelect(choice)}
            className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
              selected === choice
                ? "border-[var(--button-primary-bg)] bg-[var(--color-interaction-active)]"
                : "border-[var(--divider-color)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-interaction-hover)]"
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
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
  const [message, setMessage] = useState("");
  const [confidence, setConfidence] = useState(storedConfidence || "");

  useEffect(() => {
    setActiveMode(exercises[0]?.id || "recall");
    setRevealed(false);
    setSelectedWorks([]);
    setPlacedOrder([]);
    setThemeAnswers({});
    setTypeAnswer("");
    setCompleted({});
    setMessage("");
    setConfidence(storedConfidence || "");
  }, [author, exercises, storedConfidence]);

  const activeExercise = exercises.find((exercise) => exercise.id === activeMode);
  const activeComplete = Boolean(completed[activeMode]);

  const markComplete = (nextMessage) => {
    setCompleted((current) => ({ ...current, [activeMode]: true }));
    setMessage(nextMessage);
  };

  const handleSelectSubmit = () => {
    const expected = [...activeExercise.data.answers].sort().join("|");
    const actual = [...selectedWorks].sort().join("|");
    markComplete(
      expected === actual
        ? "Nice. You selected the correct set of works."
        : "Checked. Compare your choices with the works you know for this author."
    );
  };

  const handleOrderingSubmit = () => {
    const expected = activeExercise.data.answer.join("|");
    const actual = placedOrder.join("|");
    markComplete(
      expected === actual
        ? "Great. You rebuilt the listed syllabus order."
        : "Checked. The source order is now available for review."
    );
  };

  const handleThemesSubmit = () => {
    const matches = activeExercise.data.pairs.every(
      (pair) => themeAnswers[pair.prompt] === pair.answer
    );
    markComplete(
      matches
        ? "Strong match. Your theme links line up with the prompt cues."
        : "Checked. These theme cues are heuristic, so use them as revision prompts."
    );
  };

  const handleTypeSubmit = () => {
    markComplete(
      typeAnswer === activeExercise.data.answer
        ? "Good choice. That lens fits the current category best."
        : `Checked. The expected reading lens here is ${activeExercise.data.answer}.`
    );
  };

  const handleConfidence = async (value) => {
    setConfidence(value);
    await onSaveConfidence({
      author: author.author,
      exercise: activeMode,
      confidence: value,
      timestamp: Date.now(),
    });
  };

  if (!author) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[rgba(47,43,36,0.22)] backdrop-blur-sm" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="card scrollbar-thin flex max-h-[88vh] w-full max-w-4xl flex-col overflow-y-auto rounded-[32px] p-5 md:p-8">
          <div className="flex flex-col gap-4 border-b border-[var(--divider-color)] pb-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted-color)]">
                Focus Mode
              </p>
              <h2 className="mt-2 text-3xl leading-tight md:text-4xl">
                {author.author}
              </h2>
              <p className="mt-2 text-sm text-[var(--text-muted-color)]">
                {category.label} · {author.region || "Unknown region"} · {author.literary_period || "Reference"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid grid-cols-2 gap-2 rounded-full bg-[var(--button-secondary-bg)] p-1 md:grid-cols-5">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => setActiveMode(exercise.id)}
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
                onClick={onClose}
                className="rounded-full border border-[var(--divider-color)] bg-[var(--button-secondary-bg)] px-4 py-2 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[28px] bg-[var(--color-bg-primary)] p-5 md:p-6">
              {activeExercise?.id === "recall" && (
                <RecallExercise
                  exercise={activeExercise}
                  revealed={revealed}
                  onReveal={() => {
                    setRevealed(true);
                    markComplete("Reveal complete. Use this as a quick recall check.");
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
                />
              )}

              {activeExercise?.id === "type" && (
                <TypeExercise
                  exercise={activeExercise}
                  selected={typeAnswer}
                  onSelect={setTypeAnswer}
                  onSubmit={handleTypeSubmit}
                  submitted={activeComplete}
                />
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-[28px] bg-[var(--color-bg-primary)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted-color)]">
                  Session notes
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-body-color)]">
                  {message || "Pick an exercise from the slider and work through it here. Progress is saved locally after confidence is marked."}
                </p>
              </div>

              <div className="rounded-[28px] bg-[var(--color-bg-primary)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted-color)]">
                  Revision logic
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-muted-color)]">
                  <li>1. Use recall first, then verify with a structured task.</li>
                  <li>2. Save confidence after each completed exercise.</li>
                  <li>3. Low confidence entries can later drive spaced review scheduling.</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <ConfidenceStrip
        visible={activeComplete}
        currentValue={confidence}
        onSelect={handleConfidence}
        provider={cloud.provider}
        onConnect={cloud.connect}
        onDisconnect={cloud.disconnect}
      />
    </>
  );
}
