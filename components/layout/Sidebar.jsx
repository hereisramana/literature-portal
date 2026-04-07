export default function Sidebar({
  categories,
  active,
  setActive,
  onSelect,
  collapsed = false,
  onToggle,
}) {
  return (
    <aside className="flex h-full flex-col bg-[var(--color-bg-surface)]">
      <div className={`flex items-start ${collapsed ? "justify-center px-3 py-6" : "justify-between border-b border-[var(--divider-color)] px-4 py-4 md:py-5"}`}>
        {collapsed ? (
          <button
            aria-label="Open categories panel"
            onClick={onToggle}
            className="mt-1 flex h-14 w-14 items-center justify-center rounded-none text-[var(--color-accent)]"
          >
            <svg
              aria-hidden="true"
              className="h-10 w-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        ) : (
          <>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted-color)]">
                Syllabus
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted-color)]">
                Focused revision buckets
              </p>
            </div>
            <button
              aria-label="Collapse categories panel"
              onClick={onToggle}
              className="flex h-20 w-20 items-center justify-center bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]"
            >
              <svg
                aria-hidden="true"
                className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 5 8 12l7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className={`scrollbar-thin flex-1 overflow-y-auto ${collapsed ? "px-0 py-0" : "px-3 py-3"}`}>
        <nav className={`${collapsed ? "space-y-0" : "space-y-2"}`}>
          {!collapsed && categories.map((category) => {
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
