export default function Sidebar({ categories, active, setActive, onSelect }) {
  return (
    <aside className="flex h-full flex-col bg-[var(--color-bg-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--divider-color)] px-4 py-4 md:py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted-color)]">
            Syllabus
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted-color)]">
            Focused revision buckets
          </p>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-3 py-3">
        <nav className="space-y-2">
          {categories.map((category) => {
            const isActive = active === category.id;

            return (
              <button
                key={category.id}
                onClick={() => {
                  setActive(category.id);
                  onSelect?.();
                }}
                className={`
                  w-full rounded-2xl border px-4 py-3 text-left transition
                  ${
                    isActive
                      ? "border-[var(--color-accent)] bg-[var(--color-bg-primary)] shadow-[var(--shadow-soft)]"
                      : "border-transparent bg-transparent hover:border-[var(--divider-color)] hover:bg-[var(--color-interaction-hover)]"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-heading-color)]">
                      {category.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--text-muted-color)]">
                      {category.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--button-secondary-bg)] px-2 py-1 text-xs font-semibold text-[var(--color-accent)]">
                    {category.authors.length}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
