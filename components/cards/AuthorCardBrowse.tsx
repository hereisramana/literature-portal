export default function AuthorCardBrowse({ author }) {
  return (
    <div className="card p-5 flex flex-col gap-3">

      {/* Header */}
      <div className="flex justify-between items-start">
        <h2 className="text-lg leading-tight">
          {author.author}
        </h2>

        {author.literary_period && (
          <span className="text-xs text-[var(--color-accent)]">
            {author.literary_period}
          </span>
        )}
      </div>

      {/* Region */}
      {author.region && (
        <p className="text-xs text-[var(--color-text-secondary)]">
          {author.region}
        </p>
      )}

      {/* Works (dense but readable) */}
      <div className="text-sm">
        <ul className="space-y-1">
          {author.works?.slice(0, 6).map((w, i) => (
            <li key={i} className="leading-snug">
              {i + 1}. {w}
            </li>
          ))}
        </ul>

        {author.works?.length > 6 && (
          <p className="text-xs mt-1 text-[var(--color-text-secondary)]">
            +{author.works.length - 6} more
          </p>
        )}
      </div>

    </div>
  );
}