export default function Sidebar({
  categories,
  active,
  setActive,
  onSelect,
  collapsed = false,
  onToggle,
}) {
  return (
    <aside className="flex h-full flex-col bg-[rgba(255,255,255,0.55)] backdrop-blur-sm">
      <div className={`flex items-start ${collapsed ? "justify-center px-3 py-6" : "justify-between border-b border-[var(--divider-color)] px-6 py-6"}`}>
        {collapsed ? (
          <button
            aria-label="Open categories panel"
            onClick={onToggle}
            className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl text-[var(--text-heading-color)] transition hover:bg-[var(--color-interaction-hover)]"
          >
            <svg
              aria-hidden="true"
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        ) : (
          <>
            <div className="max-w-[250px] pt-1">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-muted-color)]">
                Literature Portal
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted-color)]">
                Browse syllabus buckets, then switch into focused test mode when you are ready to practice recall.
              </p>
            </div>
            <button
              aria-label="Collapse categories panel"
              onClick={onToggle}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-text-strong)] text-white transition hover:scale-[0.98]"
            >
              <svg
                aria-hidden="true"
                className="h-7 w-7"
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

      <div className={`scrollbar-thin flex-1 overflow-y-auto ${collapsed ? "px-0 py-0" : "px-5 py-5"}`}>
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
                  w-full rounded-[24px] border px-5 py-4 text-left transition
                  ${
                    isActive
                      ? "border-[var(--color-border-strong)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-soft)]"
                      : "border-transparent bg-transparent hover:border-[var(--divider-color)] hover:bg-[rgba(255,255,255,0.58)]"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-extrabold text-[var(--text-heading-color)]">
                      {category.label}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-[var(--text-muted-color)]">
                      {category.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--color-bg-raised)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--text-muted-color)]">
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
