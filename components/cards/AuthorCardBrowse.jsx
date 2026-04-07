import { useState } from "react";

export default function AuthorCardBrowse({ author, onOpenModal }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="card flex min-h-[260px] flex-col gap-5 p-6 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[30px] leading-[1.04]">
              {author.author}
            </h2>
            <button
              onClick={() => onOpenModal?.(author.author, "")}
              className="rounded-full bg-[var(--button-secondary-bg)] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--color-accent)] transition hover:bg-[var(--color-interaction-hover)]"
            >
              Info
            </button>
          </div>
          {author.author_link && (
            <a
              href={author.author_link}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted-color)] underline-offset-2 hover:underline"
            >
              External source
            </a>
          )}
        </div>

        <span className="rounded-full bg-[var(--color-bg-primary)] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--color-accent)]">
          {author.literary_period || "Reference"}
        </span>
      </div>

      {author.region && (
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
          {author.region}
        </p>
      )}

      <button
        onClick={() => setExpanded((current) => !current)}
        className="w-fit rounded-full border border-[var(--divider-color)] bg-[var(--button-secondary-bg)] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--button-secondary-text)] transition hover:bg-[var(--color-interaction-hover)]"
      >
        {expanded ? "Hide Works" : "Show Works"}
      </button>

      {expanded && (
        <div className="text-sm">
          <ul className="space-y-3">
            {author.works?.map((w, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-3 rounded-2xl bg-[var(--color-bg-primary)] px-4 py-3 leading-snug text-[var(--color-text-primary)]"
              >
                <span className="flex-1">
                  <span className="mr-2 font-extrabold text-[var(--color-accent)]">{i + 1}.</span>
                  {w}
                </span>
                <button
                  onClick={() => onOpenModal?.(w, author.author)}
                  className="shrink-0 rounded-full bg-[var(--button-secondary-bg)] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--color-accent)] transition hover:bg-[var(--color-interaction-hover)]"
                >
                  Info
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
