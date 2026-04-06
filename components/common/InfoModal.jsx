"use client";

export default function InfoModal({ modal, loading, onClose }) {
  if (!modal) {
    return null;
  }

  const query = encodeURIComponent(modal.title);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(47,43,36,0.45)] p-4">
      <div className="card scrollbar-thin max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[28px] p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted-color)]">
              Reference
            </p>
            <h2 className="mt-2 text-2xl leading-tight md:text-3xl">
              {modal.title}
            </h2>
            {modal.author && (
              <p className="mt-2 text-sm text-[var(--text-muted-color)]">
                {modal.author}
              </p>
            )}
          </div>

          <button
            aria-label="Close info modal"
            className="rounded-full border border-[var(--divider-color)] bg-[var(--button-secondary-bg)] px-3 py-2 text-sm text-[var(--button-secondary-text)] transition hover:bg-[var(--color-interaction-hover)]"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-5 rounded-[22px] border border-[var(--divider-color)] bg-[var(--color-bg-primary)] p-5 shadow-[var(--shadow-inset)]">
          {loading ? (
            <p className="text-sm text-[var(--text-body-color)]">Loading...</p>
          ) : (
            <p className="text-sm leading-7 text-[var(--text-body-color)]">
              {modal.summary}
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <a
            href={`https://en.wikipedia.org/wiki/Special:Search?search=${query}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-[var(--divider-color)] bg-[var(--button-secondary-bg)] px-4 py-3 text-sm font-semibold text-[var(--button-secondary-text)] no-underline transition hover:bg-[var(--color-interaction-hover)]"
          >
            Wikipedia
          </a>
          <a
            href={`https://www.britannica.com/search?query=${query}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-[var(--divider-color)] bg-[var(--button-secondary-bg)] px-4 py-3 text-sm font-semibold text-[var(--button-secondary-text)] no-underline transition hover:bg-[var(--color-interaction-hover)]"
          >
            Britannica
          </a>
          <a
            href={`https://www.poetryfoundation.org/search?query=${query}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-[var(--divider-color)] bg-[var(--button-secondary-bg)] px-4 py-3 text-sm font-semibold text-[var(--button-secondary-text)] no-underline transition hover:bg-[var(--color-interaction-hover)]"
          >
            Poetry Foundation
          </a>
          <a
            href={`https://www.google.com/search?q=${query}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-[var(--divider-color)] bg-[var(--button-secondary-bg)] px-4 py-3 text-sm font-semibold text-[var(--button-secondary-text)] no-underline transition hover:bg-[var(--color-interaction-hover)]"
          >
            Google
          </a>
        </div>
      </div>
    </div>
  );
}
