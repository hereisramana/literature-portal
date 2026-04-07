"use client";

const TEST_MODES = ["Recall", "Select", "Order", "Themes", "Type"];

export default function AuthorCardTest({
  author,
  onStartTest,
  confidence,
}) {
  return (
    <article className="card flex min-h-[240px] flex-col justify-between p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted-color)]">
            Focus Study
          </p>
          <h2 className="mt-2 text-2xl leading-tight">
            {author.author}
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted-color)]">
            {author.region || "Unknown region"} · {author.literary_period || "Reference"}
          </p>
        </div>

        <div className="rounded-full bg-[var(--button-secondary-bg)] px-3 py-1 text-xs font-semibold text-[var(--button-secondary-text)]">
          {confidence || "New"}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap gap-2">
          {TEST_MODES.map((mode) => (
            <span
              key={mode}
              className="rounded-full border border-[var(--divider-color)] bg-[var(--color-bg-primary)] px-3 py-1 text-xs font-semibold text-[var(--text-muted-color)]"
            >
              {mode}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm leading-7 text-[var(--text-muted-color)]">
          Open this card in focus mode to run one exercise at a time, blur the background, and save confidence after each check.
        </p>
      </div>

      <button
        onClick={() => onStartTest?.(author)}
        className="mt-6 rounded-full bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-semibold text-[var(--button-primary-text)]"
      >
        Start Focus Test
      </button>
    </article>
  );
}
