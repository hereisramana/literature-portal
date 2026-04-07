"use client";

export default function AuthorCardTest({
  author,
  onStartTest,
  confidence,
}) {
  return (
    <article className="card flex min-h-[210px] flex-col justify-between p-6">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-[32px] leading-[1.05]">
          {author.author}
        </h2>

        <div className="rounded-full bg-[var(--button-secondary-bg)] px-3 py-1 text-xs font-semibold text-[var(--button-secondary-text)]">
          {confidence || "New"}
        </div>
      </div>

      <button
        onClick={() => onStartTest?.(author)}
        className="mt-8 rounded-full bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-semibold text-[var(--button-primary-text)]"
      >
        Start Test
      </button>
    </article>
  );
}
