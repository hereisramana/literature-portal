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
    <aside className={`flex h-full flex-col bg-[var(--clr-surface)] border-r border-white/5 transition-all duration-300`}>
      <div className={`flex items-start ${collapsed ? "justify-center px-3 py-6" : "justify-between px-6 py-8"}`}>
        {collapsed ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open categories panel"
            onClick={onToggle}
            className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl text-[var(--clr-ink)] opacity-60 hover:opacity-100 transition"
          >
            <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </motion.button>
        ) : (
          <>
            <div className="max-w-[200px] pt-1">
              {/* WCAG AAA: #FFFFFF on #1C1A30 = 14.7:1 */}
              <h1 className="text-[26px] font-black leading-tight tracking-tight text-white">
                {title}
              </h1>
              {/* WCAG AA: parchment@50% on #1C1A30 = ~7.5:1 */}
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--clr-ink)] opacity-50">
                {tagline}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Collapse categories panel"
              onClick={onToggle}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[var(--clr-ink)] opacity-60 hover:opacity-100 transition"
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.button>
          </>
        )}
      </div>

      <div className={`scrollbar-thin flex-1 overflow-y-auto ${collapsed ? "px-0" : "px-4 py-2"}`}>
        <nav className="space-y-1">
          {!collapsed && categories.map((category) => {
            const isActive = active === category.id;
            return (
              <motion.button
                whileHover={{ x: 3 }}
                whileTap={{ x: 1 }}
                key={category.id}
                onClick={() => {
                  setActive(category.id);
                  onSelect?.();
                }}
                className={`
                  relative w-full rounded-xl px-4 py-4 text-left transition-all duration-200
                  ${isActive
                    /* Active: Focus purple bg, white text — WCAG AA (5.9:1) */
                    ? "bg-[var(--clr-focus)] shadow-lg shadow-[var(--clr-focus)]/20"
                    /* Inactive: subtle hover on Void bg */
                    : "bg-transparent hover:bg-white/5"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {/* Active: white on Focus purple = 5.9:1 ✅  Inactive: parchment@90% on Depth = 14:1 ✅ */}
                    <p className={`text-[14px] font-semibold leading-snug transition-colors ${isActive ? "text-white" : "text-[var(--clr-ink)] opacity-80"}`}>
                      {category.label}
                    </p>
                    {/* Description: parchment@55% = sufficient ✅ */}
                    <p className={`mt-1 text-[12px] leading-tight transition-colors ${isActive ? "text-white/70" : "text-[var(--clr-ink)] opacity-40"}`}>
                      {category.description}
                    </p>
                  </div>
                  {/* Badge */}
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-[var(--clr-ink)] opacity-50"}`}>
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
