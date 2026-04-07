import { useState } from "react";

export default function AuthorCardBrowse({ author, onOpenModal }) {
  const [expanded, setExpanded] = useState(false);
  const workCount = author.works?.length || 0;
  const accentLabel = author.region || author.literary_period || "Reference";

  return (
    <article className="card flex min-h-[251px] flex-col overflow-hidden px-8 py-7 text-center transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-medium)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[var(--color-bg-accent-soft)] text-[24px] font-extrabold text-[var(--color-accent-strong)] shadow-[0_10px_24px_rgba(255,154,87,0.14)]">
        {author.author?.charAt(0)}
      </div>

      <div className="mt-6">
        <h2 className="mx-auto max-w-[18ch] text-[28px] leading-[1.15]">
          {author.author}
        </h2>
        <p className="mt-4 text-sm leading-6 text-[var(--text-muted-color)]">
          {workCount} works in this revision set
        </p>
      </div>

      <div className="mt-auto pt-6">
        <p className="text-sm text-[var(--text-muted-color)]">
          {accentLabel}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setExpanded((current) => !current)}
            className="rounded-full border border-[var(--divider-color)] bg-[var(--button-secondary-bg)] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--button-secondary-text)] transition hover:bg-[var(--color-interaction-hover)]"
          >
            {expanded ? "Hide Works" : "View Works"}
          </button>
          <button
            onClick={() => onOpenModal?.(author.author, "")}
            className="rounded-full border border-[var(--divider-color)] bg-[var(--button-secondary-bg)] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--button-secondary-text)] transition hover:bg-[var(--color-interaction-hover)]"
          >
            Info
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-6 border-t border-[var(--divider-color)] pt-5 text-left">
          <ul className="space-y-3">
            {author.works?.map((w, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--divider-color)] bg-[var(--color-bg-raised)] px-4 py-3 leading-snug text-[var(--color-text-primary)]"
              >
                <span className="flex-1">
                  <span className="mr-2 font-extrabold text-[var(--color-accent-strong)]">{i + 1}.</span>
                  {w}
                </span>
                <button
                  onClick={() => onOpenModal?.(w, author.author)}
                  className="shrink-0 rounded-full border border-[var(--divider-color)] bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-heading-color)] transition hover:bg-[var(--color-interaction-hover)]"
                >
                  Info
                </button>
              </li>
            ))}
          </ul>
          {author.author_link && (
            <a
              href={author.author_link}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted-color)] underline-offset-2 hover:text-[var(--text-heading-color)] hover:underline"
            >
              External source
            </a>
          )}
        </div>
      )}
    </article>
  );
}
