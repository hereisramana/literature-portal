import { motion } from "framer-motion";

export default function Sidebar({
  categories,
  active,
  setActive,
  onSelect,
  collapsed = false,
  onToggle,
  title = "EnLit",
  tagline = "exam revision portal",
}) {
  return (
    <aside className="flex h-full flex-col bg-[var(--color-bg-primary)]">
      <div className={`flex items-start ${collapsed ? "justify-center px-3 py-6" : "justify-between px-6 py-6 md:px-8 md:py-8"}`}>
        {collapsed ? (
            <button
              aria-label="Open categories panel"
              onClick={onToggle}
            className="ease-figma mt-1 flex h-12 w-12 items-center justify-center rounded-2xl text-[var(--text-heading-color)] transition duration-300 hover:bg-[var(--color-interaction-hover)]"
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
            <div className="max-w-[240px] pt-1">
              <h1 className="text-[32px] font-bold leading-[1.05] text-[var(--text-body-color)]">
                {title}
              </h1>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[var(--text-muted-color)] opacity-60">
                {tagline}
              </p>
            </div>
            <button
              aria-label="Collapse categories panel"
              onClick={onToggle}
              className="ease-figma flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-text-strong)] text-white transition duration-300 hover:scale-[0.98]"
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

      <div className={`scrollbar-thin flex-1 overflow-y-auto ${collapsed ? "px-0 py-0" : "px-5 py-2 md:px-7 md:py-4"}`}>
        <nav className={`${collapsed ? "space-y-0" : "space-y-2.5"}`}>
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
                  ease-figma relative w-full rounded-[24px] px-5 py-4 text-left transition duration-300
                  ${
                    isActive
                    ? "shadow-[var(--shadow-medium)] ring-1 ring-[var(--color-border-strong)]"
                    : "bg-transparent hover:bg-[rgba(58,64,59,0.08)]"
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 z-0 rounded-[24px] bg-[var(--color-bg-inset)]"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                <div className="relative z-10 flex items-start justify-between gap-3">
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
