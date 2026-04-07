"use client";

export default function AuthorCardTest({
  author,
  onStartTest,
  confidence,
}) {
  return (
    <article className="card flex aspect-[3/2] min-h-0 flex-col overflow-hidden px-6 py-5 transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-medium)]">
      <div>
        <h2 className="max-w-[18ch] text-[24px] leading-[1.15] md:text-[26px]">
          {author.author}
        </h2>
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div className="rounded-2xl bg-[var(--color-bg-raised)] px-4 py-3">
          <p className="text-sm text-[var(--text-muted-color)]">Confidence</p>
          <p className="mt-2 text-[15px] font-semibold text-[var(--text-body-color)]">
            {confidence || "New"}
          </p>
        </div>
        <button
          onClick={() => onStartTest?.(author)}
          className="mt-4 w-full rounded-full bg-[var(--button-primary-bg)] px-5 py-3 text-sm font-semibold text-[var(--button-primary-text)] shadow-[0_10px_22px_rgba(58,64,59,0.16)]"
        >
          Start Test
        </button>
      </div>
    </article>
  );
}
