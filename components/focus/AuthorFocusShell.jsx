"use client";

export default function AuthorFocusShell({
  modeLabel,
  title,
  meta,
  tabs,
  activeTab,
  onTabChange,
  onClose,
  main,
  sidebar,
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-[rgba(24,32,47,0.18)] backdrop-blur-sm" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="card flex h-[min(88vh,860px)] w-full max-w-4xl flex-col overflow-hidden rounded-[32px]">
          <div className="flex flex-col gap-4 px-5 pb-5 pt-5 md:flex-row md:items-start md:justify-between md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted-color)]">
                {modeLabel}
              </p>
              <h2 className="mt-2 text-3xl leading-tight md:text-4xl">{title}</h2>
              <p className="mt-2 text-sm text-[var(--text-muted-color)]">{meta}</p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="grid gap-2 rounded-full bg-[var(--color-bg-raised)] p-1"
                style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`ease-figma rounded-full px-3 py-2 text-xs font-semibold transition duration-300 ${
                      activeTab === tab.id
                        ? "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]"
                        : "text-[var(--text-muted-color)] hover:text-[var(--text-heading-color)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                onClick={onClose}
                className="rounded-full bg-[var(--button-secondary-bg)] px-4 py-2 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>

          <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-6 md:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
              <div className="rounded-[28px] bg-[var(--card-bg)] p-5 md:p-6">{main}</div>
              <aside className="space-y-4">{sidebar}</aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
