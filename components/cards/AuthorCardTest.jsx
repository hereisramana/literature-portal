"use client";

export default function AuthorCardTest({
  author,
  onStartTest,
  confidence,
}) {
  return (
    <article className="card flex min-h-[251px] flex-col overflow-hidden px-8 py-7 text-center transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-medium)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[var(--color-bg-accent-soft)] text-[24px] font-extrabold text-[var(--color-accent-strong)] shadow-[0_10px_24px_rgba(255,154,87,0.14)]">
        T
      </div>

      <div className="mt-6">
        <h2 className="mx-auto max-w-[18ch] text-[28px] leading-[1.15]">
          {author.author}
        </h2>
      </div>

      <div className="mt-auto pt-6">
        <p className="text-sm text-[var(--text-muted-color)]">
          {confidence || "New"}
        </p>
        <button
          onClick={() => onStartTest?.(author)}
          className="mt-5 rounded-full bg-[var(--button-primary-bg)] px-5 py-3 text-sm font-semibold text-[var(--button-primary-text)] shadow-[0_10px_22px_rgba(255,154,87,0.25)]"
        >
          Start Test
        </button>
      </div>
    </article>
  );
}
