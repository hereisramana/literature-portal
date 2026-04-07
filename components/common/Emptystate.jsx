export default function EmptyState() {
  return (
    <div className="card mx-auto max-w-lg px-10 py-16 text-center shadow-[var(--shadow-medium)]">
      <div className="mb-6 flex justify-center text-[var(--text-muted-color)] opacity-40">
        <svg
          className="h-16 w-16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
          <path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 0 5 0" />
        </svg>
      </div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted-color)]">
        No Matches
      </p>
      <h2 className="mt-4 text-[28px] leading-tight">Nothing surfaced.</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-muted-color)]">
        Try a broader search term or reset the category to see more literary works.
      </p>
    </div>
  );
}
