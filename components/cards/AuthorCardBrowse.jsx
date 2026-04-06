export default function AuthorCardBrowse({ author }) {
  return (
    <article className="card min-h-[220px] p-5 flex flex-col gap-4">

      <div className="flex justify-between items-start">
        <h2 className="text-xl leading-tight">
          {author.author}
        </h2>

        <span className="rounded-full bg-[var(--color-bg-primary)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
          {author.literary_period || "Reference"}
        </span>
      </div>

      {author.region && (
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
          {author.region}
        </p>
      )}

      <div className="text-sm">
        <ul className="space-y-2">
          {author.works?.slice(0, 6).map((w, i) => (
            <li key={i} className="leading-snug text-[var(--color-text-primary)]">
              <span className="mr-2 text-[var(--color-accent)]">{i + 1}.</span>
              {w}
            </li>
          ))}
        </ul>

        {author.works?.length > 6 && (
          <p className="mt-3 text-xs font-medium text-[var(--color-text-secondary)]">
            +{author.works.length - 6} more
          </p>
        )}
      </div>
    </article>
  );
}
