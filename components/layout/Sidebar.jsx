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
    <aside className={`flex h-full flex-col transition-all duration-500 ${collapsed ? "bg-transparent" : "bg-[#2d332e]/10 backdrop-blur-xl border-r border-white/10 shadow-2xl"}`}>
      <div className={`flex items-start ${collapsed ? "justify-center px-3 py-6" : "justify-between px-6 py-6 md:px-8 md:py-8"}`}>
        {collapsed ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
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
          </motion.button>
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
            <motion.button
              whileTap={{ scale: 0.92 }}
              aria-label="Collapse categories panel"
              onClick={onToggle}
              className="ease-figma flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-text-strong)]/10 text-[var(--color-text-strong)] transition duration-300 hover:bg-[var(--color-text-strong)]/20"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.button>
          </>
        )}
      </div>

      <div className={`scrollbar-thin flex-1 overflow-y-auto ${collapsed ? "px-0 py-0" : "px-5 py-2 md:px-7 md:py-4"}`}>
        <nav className={`${collapsed ? "space-y-0" : "space-y-1.5"}`}>
          {!collapsed && categories.map((category) => {
            const isActive = active === category.id;

            return (
              <motion.button
                whileTap={{ x: 2 }}
                key={category.id}
                onClick={() => {
                  setActive(category.id);
                  onSelect?.();
                }}
                className={`
                  ease-figma relative w-full rounded-[24px] px-5 py-4 text-left transition duration-300
                  ${
                    isActive
                    ? "bg-white/40 shadow-sm ring-1 ring-white/50"
                    : "bg-transparent hover:bg-white/20"
                  }
                `}
              >
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-[15px] transition-colors ${isActive ? "font-bold text-[var(--text-heading-color)]" : "font-semibold text-[var(--text-body-color)] opacity-80"}`}>
                      {category.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--text-muted-color)] opacity-70">
                      {category.description}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors ${isActive ? "bg-white/60 text-[var(--text-heading-color)]" : "bg-[rgba(58,64,59,0.05)] text-[var(--text-muted-color)] opacity-70"}`}>
                    {category.authors.length}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
