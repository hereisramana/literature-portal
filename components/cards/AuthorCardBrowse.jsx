import { useState } from "react";

export default function AuthorCardBrowse({ author, onOpenModal }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="card min-h-[220px] p-5 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl leading-tight">
              {author.author}
            </h2>
            <button
              onClick={() => onOpenModal?.(author.author, "")}
              className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)] underline-offset-2 hover:underline"
            >
              Info
            </button>
          </div>
          {author.author_link && (
            <a
              href={author.author_link}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted-color)] underline-offset-2 hover:underline"
            >
              External source
            </a>
          )}
        </div>

        <span className="rounded-full bg-[var(--color-bg-primary)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
          {author.literary_period || "Reference"}
        </span>
      </div>

      {author.region && (
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
          {author.region}
        </p>
      )}

      <button
        onClick={() => setExpanded((current) => !current)}
        className="w-fit rounded-full border border-[var(--divider-color)] bg-[var(--button-secondary-bg)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--button-secondary-text)] transition hover:bg-[var(--color-interaction-hover)]"
      >
        {expanded ? "Hide Works" : "Show Works"}
      </button>

      {expanded && (
        <div className="text-sm">
          <ul className="space-y-2">
            {author.works?.map((w, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-3 leading-snug text-[var(--color-text-primary)]"
              >
                <span className="flex-1">
                  <span className="mr-2 text-[var(--color-accent)]">{i + 1}.</span>
                  {w}
                </span>
                <button
                  onClick={() => onOpenModal?.(w, author.author)}
                  className="shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)] underline-offset-2 hover:underline"
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
