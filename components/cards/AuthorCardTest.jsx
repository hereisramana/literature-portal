"use client";

export default function AuthorCardTest({
  author,
  onStartTest,
  confidence,
}) {
  return (
    <article className="card flex h-[304px] flex-col overflow-hidden px-7 py-6 transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-medium)]">
      <div>
        <h2 className="max-w-[18ch] text-[28px] leading-[1.15]">
          {author.author}
        </h2>
      </div>

      <div className="mt-5 flex flex-1 flex-col justify-between">
        <div className="rounded-2xl bg-[var(--color-bg-raised)] px-4 py-4">
          <p className="text-sm text-[var(--text-muted-color)]">Confidence</p>
          <p className="mt-2 text-[15px] font-semibold text-[var(--text-body-color)]">
            {confidence || "New"}
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted-color)]">
            Open a focused study session for this author.
          </p>
        </div>
        <button
          onClick={() => onStartTest?.(author)}
          className="mt-5 w-full rounded-full bg-[var(--button-primary-bg)] px-5 py-3 text-sm font-semibold text-[var(--button-primary-text)] shadow-[0_10px_22px_rgba(58,64,59,0.16)]"
        >
          Start Test
        </button>
      </div>
    </article>
  );
}
