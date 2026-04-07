"use client";

export default function InfoModal({ modal, loading, onClose }) {
  if (!modal) {
    return null;
  }

  const query = encodeURIComponent(modal.title);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(24,32,47,0.22)] p-4 backdrop-blur-sm">
      <div className="card scrollbar-thin max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[32px] p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted-color)]">
              Reference
            </p>
            <h2 className="mt-2 text-3xl leading-tight md:text-4xl">
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
            className="rounded-full border border-[var(--divider-color)] bg-[var(--button-secondary-bg)] px-4 py-2 text-sm font-extrabold text-[var(--button-secondary-text)] transition hover:bg-[var(--color-interaction-hover)]"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-6 rounded-[24px] border border-[var(--divider-color)] bg-[var(--color-bg-raised)] p-5">
          {loading ? (
            <p className="text-sm text-[var(--text-body-color)]">Loading...</p>
          ) : (
            <p className="text-sm leading-7 text-[var(--text-body-color)]">
              {modal.summary}
            </p>
          )}
        </div>

        {modal.themes?.length > 0 && (
          <div className="mt-6 rounded-[24px] border border-[var(--divider-color)] bg-[var(--color-bg-surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted-color)]">
              Themes
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {modal.themes.map((theme) => (
                <span
                  key={theme}
                  className="rounded-full bg-[var(--color-bg-raised)] px-3 py-2 text-sm font-semibold text-[var(--text-body-color)]"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-3 md:grid-cols-2">
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
