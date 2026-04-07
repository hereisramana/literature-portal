"use client";

export default function AuthorCardTest({
  author,
  onStartTest,
  confidence,
}) {
  return (
    <article className="card flex min-h-[208px] flex-col justify-between p-6 transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-medium)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted-color)]">
            Focus Study
          </p>
          <h2 className="mt-3 text-[30px] leading-[1.06]">
          {author.author}
          </h2>
        </div>

        <div className="rounded-full bg-[var(--color-bg-raised)] px-3 py-1 text-xs font-semibold text-[var(--button-secondary-text)]">
          {confidence || "New"}
        </div>
      </div>

      <button
        onClick={() => onStartTest?.(author)}
        className="mt-8 rounded-full bg-[var(--button-primary-bg)] px-4 py-3 text-sm font-semibold text-[var(--button-primary-text)] shadow-[0_10px_22px_rgba(255,154,87,0.25)]"
      >
        Start Test
      </button>
    </article>
  );
}
