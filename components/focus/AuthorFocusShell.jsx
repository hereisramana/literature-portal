"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthorFocusShell({
  title,
  tabs,
  activeTab,
  onTabChange,
  onClose,
  main,
  sidebar = null,
  showGuide = false,
  guideContent = null,
  onCloseGuide = null,
  hideTabsInHeader = false,
  guideCtaLabel = "Okay",
  showGuideSkip = true,
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="card relative flex h-[min(92vh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] shadow-2xl">
          {/* Header */}
          <div className="flex flex-col gap-4 px-6 pb-4 pt-6 md:flex-row md:items-start md:justify-between md:px-10">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-[var(--text-heading-color)] md:text-4xl">
                {title}
              </h2>

              {hideTabsInHeader && (
                <div className="mt-4 flex justify-start">
                  <div
                    className="grid gap-1 rounded-full bg-[var(--color-bg-inset)] p-1 shadow-inner"
                    style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
                  >
                    {tabs.map((tab) => (
                      <motion.button
                        key={tab.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onTabChange(tab.id)}
                        className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                          activeTab === tab.id
                            ? "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] shadow-md"
                            : "text-[var(--text-muted-color)] hover:text-[var(--text-heading-color)]"
                        }`}
                      >
                        {tab.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!hideTabsInHeader && (
                <div
                  className="grid gap-1 rounded-full bg-[var(--color-bg-inset)] p-1 shadow-inner"
                  style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
                >
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onTabChange(tab.id)}
                      className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] shadow-md"
                          : "text-[var(--text-muted-color)] hover:text-[var(--text-heading-color)]"
                      }`}
                    >
                      {tab.label}
                    </motion.button>
                  ))}
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-text-strong)]/10 text-[var(--color-text-strong)] transition hover:bg-[var(--color-text-strong)]/20"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Content Area */}
          <div className="scrollbar-thin flex-1 overflow-y-auto px-6 py-4 md:px-10">
            <div className={`grid gap-8 ${sidebar ? "lg:grid-cols-[1fr_320px]" : "grid-cols-1"}`}>
              <div className="min-w-0">{main}</div>
              {sidebar && (
                <aside className="hidden space-y-6 lg:block">{sidebar}</aside>
              )}
            </div>
          </div>

          {/* Instructional Overlay */}
          <AnimatePresence>
            {showGuide && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-md p-6"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="card w-full max-w-md p-8 text-center shadow-2xl"
                >
                  <div className="mb-6 flex justify-center text-[var(--color-accent)]">
                    <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Guide</h3>
                  <div className="text-[15px] leading-relaxed text-[var(--text-body-color)] mb-8">
                    {guideContent}
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={onCloseGuide}
                      className="flex-1 rounded-full bg-[var(--button-primary-bg)] py-3 text-sm font-bold uppercase tracking-wider text-[var(--button-primary-text)] shadow-lg"
                    >
                      {guideCtaLabel}
                    </motion.button>
                    {showGuideSkip && (
                      <button
                        onClick={onCloseGuide}
                        className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-muted-color)] hover:text-[var(--text-heading-color)]"
                      >
                        Skip
                      </button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
