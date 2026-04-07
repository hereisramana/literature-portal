export default function EmptyState() {
  return (
    <div className="card mx-auto max-w-xl px-8 py-14 text-center">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted-color)]">
        No Matches
      </p>
      <h2 className="mt-3 text-3xl">Nothing surfaced for this filter set.</h2>
      <p className="mt-4 text-base leading-7 text-[var(--text-muted-color)]">
        Try a broader search term or reset the contextual period filter to see more authors.
      </p>
    </div>
  );
}
