"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import AuthorFocusShell from "../focus/AuthorFocusShell.jsx";

function ExternalLinks({ title }) {
  const searchTitle = encodeURIComponent(title);
  return (
    <div className="mt-8 pt-6 border-t border-[var(--color-border-subtle)]">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted-color)] opacity-40">
          Resources
        </span>
        {[
          { label: "Wikipedia", url: `https://en.wikipedia.org/wiki/Special:Search?search=${searchTitle}` },
          { label: "Britannica", url: `https://www.britannica.com/search?query=${searchTitle}` },
          { label: "Poetry Foundation", url: `https://www.poetryfoundation.org/search?query=${searchTitle}` },
          { label: "Google", url: `https://www.google.com/search?q=${searchTitle}` },
        ].map((link) => (
          <motion.a
            key={link.label}
            whileHover={{ opacity: 1, x: 2 }}
            whileTap={{ scale: 0.98 }}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-bold text-[var(--color-text-primary)] opacity-60 no-underline transition-all flex items-center gap-1.5"
          >
            {link.label}
            <svg className="h-2.5 w-2.5 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

export default function StudyFocusView({
  author,
  category,
  allAuthors,
  selectedWork,
  inferTheme,
  onClose,
}) {
  const tabs = [
    { id: "works", label: "Works" },
    { id: "themes", label: "Themes" },
    { id: "notes", label: "Notes" },
  ];

  const [activeTab, setActiveTab] = useState("works");
  const [expandedWork, setExpandedWork] = useState(selectedWork || null);
  const [expandedTheme, setExpandedTheme] = useState(null);

  const workTitles = useMemo(
    () => (author.works || []).map((work) => work.title || work),
    [author]
  );

  const themeSet = useMemo(() => {
    const fromNodes = (author.nodes || [])
      .filter((node) => node.subType === "theme")
      .map((node) => node.answer);
    const fallbackThemes = workTitles.map((work) => inferTheme(work, author, category));
    return [...new Set([...fromNodes, ...fallbackThemes].filter(Boolean))];
  }, [author, category, inferTheme, workTitles]);

  const nodeGroups = useMemo(() => {
    const groups = { factual: [], textual: [], critical: [], comparative: [] };
    (author.nodes || []).forEach((node) => {
      if (groups[node.layer]) groups[node.layer].push(node);
    });
    return groups;
  }, [author]);

  return (
    <AuthorFocusShell
      title={author.author}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onClose={onClose}
      hideTabsInHeader={true}
      main={
        <div className="pb-10">
          {activeTab === "works" && (
            <ul className="space-y-2">
              {(author.works || []).map((work) => {
                const title = work.title || work;
                const isExpanded = expandedWork === title;
                return (
                  <motion.li
                    key={title}
                    layout
                    onClick={() => setExpandedWork(isExpanded ? null : title)}
                    className={`cursor-pointer rounded-xl px-5 py-4 text-[14px] leading-relaxed transition-all ${
                      isExpanded
                      ? "bg-[var(--color-bg-accent-soft)] border-l-4 border-[var(--color-accent)] shadow-md"
                      : "bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-inset)] border border-[var(--color-border-subtle)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-bold text-[var(--text-heading-color)]">{title}</span>
                      <div className="flex items-center gap-3">
                        {(work.year || work.type) && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted-color)] opacity-40 text-depth">
                            {[work.year, work.type].filter(Boolean).join(" · ")}
                          </span>
                        )}
                        <svg className={`h-4 w-4 opacity-30 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 pt-4 border-t border-black/5"
                      >
                        <p className="text-[13px] leading-relaxed text-[var(--text-body-color)] opacity-80">
                          {work.notes || `Academic overview for "${title}" including structural analysis, contextual background, and critical reception.`}
                        </p>
                      </motion.div>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          )}

          {activeTab === "themes" && (
            <div className="space-y-6">
              <div className="grid gap-2">
                {themeSet.map((theme) => {
                  const isExpanded = expandedTheme === theme;
                  return (
                    <motion.div
                      key={theme}
                      layout
                      onClick={() => setExpandedTheme(isExpanded ? null : theme)}
                      className={`cursor-pointer rounded-xl px-5 py-4 transition-all border ${
                        isExpanded
                        ? "bg-[var(--color-bg-surface)] border-[var(--color-border-strong)] shadow-md"
                        : "bg-[var(--color-bg-surface)] border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-inset)]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-bold text-[var(--color-text-primary)]">{theme}</span>
                        <svg className={`h-4 w-4 opacity-30 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4 pt-4 border-t border-black/5 space-y-3"
                        >
                          <p className="text-[13px] leading-relaxed text-[var(--text-body-color)] opacity-70 text-depth">
                            Evidence of <strong>{theme}</strong> is primarily observed in:
                          </p>
                          <ul className="space-y-2">
                            {workTitles.slice(0, 2).map((title, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <div className="mt-1.5 h-1 w-1 rounded-full bg-[var(--color-accent)] shrink-0" />
                                <p className="text-[13px] leading-tight text-[var(--text-body-color)]">
                                  <span className="font-bold">{title}</span> — Observed through key character trajectories and pivotal narrative events.
                                </p>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              <div className="rounded-xl bg-[var(--color-bg-inset)] px-5 py-5 border border-[var(--color-border-subtle)]">
                <p className="text-[13px] leading-relaxed text-[var(--text-body-color)] italic opacity-50">
                  Recurring concerns are the key to comparative success. Mastery of these themes allows for seamless interleaving between different periods.
                </p>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="grid gap-4">
              {["factual", "textual", "critical", "comparative"].map((layer) => (
                <div key={layer} className="rounded-xl bg-[var(--color-bg-surface)] px-5 py-5 shadow-sm border border-[var(--color-border-subtle)]">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[var(--text-muted-color)] opacity-40 mb-4">
                    {layer} context
                  </p>
                  {nodeGroups[layer].length > 0 ? (
                    <ul className="space-y-5">
                      {nodeGroups[layer].slice(0, 4).map((node) => (
                        <li key={node.id} className="group">
                          <p className="text-[14px] font-bold text-[var(--text-heading-color)] mb-1">
                            {node.prompt}
                          </p>
                          <p className="text-[14px] leading-relaxed text-[var(--text-body-color)] opacity-90">
                            {node.answer}
                          </p>
                          {node.explanation && (
                            <p className="mt-2 text-[12px] leading-relaxed text-[var(--text-muted-color)] opacity-60 border-l-2 border-[var(--color-border-subtle)] pl-3">
                              {node.explanation}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[13px] leading-relaxed text-[var(--text-body-color)] opacity-40">
                      Enriched academic notes for this layer will appear as the category batches are completed.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <ExternalLinks title={selectedWork || author.author} />
        </div>
      }
    />
  );
}
