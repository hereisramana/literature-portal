"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import AuthorFocusShell from "../focus/AuthorFocusShell.jsx";

function StudyPanel({ title, children }) {
  return (
    <div className="rounded-[28px] bg-[var(--color-bg-raised)] p-6 shadow-sm border border-white/20">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted-color)] opacity-60">
        {title}
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ExternalLinks({ title }) {
  const searchTitle = encodeURIComponent(title);
  return (
    <div className="mt-16 pt-10 border-t border-[var(--color-border-subtle)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted-color)] opacity-60 mb-6">
        External Resources
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Wikipedia", url: `https://en.wikipedia.org/wiki/Special:Search?search=${searchTitle}` },
          { label: "Britannica", url: `https://www.britannica.com/search?query=${searchTitle}` },
          { label: "Poetry Foundation", url: `https://www.poetryfoundation.org/search?query=${searchTitle}` },
          { label: "Google", url: `https://www.google.com/search?q=${searchTitle}` },
        ].map((link) => (
          <motion.a
            key={link.label}
            whileHover={{ y: -2, backgroundColor: "rgba(58, 64, 59, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-[var(--color-bg-raised)] px-5 py-4 text-[13px] font-bold text-[var(--color-text-primary)] no-underline transition shadow-sm border border-white/40 flex items-center justify-center gap-2"
          >
            {link.label}
            <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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
  const [activeTab, setActiveTab] = useState(selectedWork ? "works" : "notes");
  const [showGuide, setShowGuide] = useState(true);

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

  const tabs = [
    { id: "notes", label: "Notes" },
    { id: "works", label: "Works" },
    { id: "themes", label: "Themes" },
  ];

  return (
    <AuthorFocusShell
      title={author.author}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onClose={onClose}
      showGuide={showGuide}
      onCloseGuide={() => setShowGuide(false)}
      guideContent={
        <p>
          Dive deep into the literary profile. Move from <strong>Notes</strong> to <strong>Works</strong>, then explore <strong>Themes</strong>. When you're ready, reach the end of any section to find additional external references.
        </p>
      }
      main={
        <div className="pb-10">
          {activeTab === "works" && (
            <ul className="space-y-3">
              {(author.works || []).map((work) => (
                <li
                  key={work.title || work}
                  className={`rounded-2xl px-6 py-5 text-[15px] leading-relaxed shadow-sm border border-white/40 ${
                    selectedWork === (work.title || work) ? "bg-[var(--color-bg-accent-soft)]" : "bg-[var(--color-bg-raised)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold">{work.title || work}</span>
                    {(work.year || work.type) && (
                      <span className="text-xs font-bold text-[var(--text-muted-color)] opacity-60">
                        {[work.year, work.type].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {activeTab === "themes" && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {themeSet.map((theme) => (
                  <span
                    key={theme}
                    className="rounded-full bg-[var(--color-bg-raised)] border border-white/60 px-4 py-2.5 text-[14px] font-bold text-[var(--color-text-primary)] shadow-sm"
                  >
                    {theme}
                  </span>
                ))}
              </div>
              <div className="rounded-2xl bg-[var(--color-bg-raised)] px-6 py-6 border border-white/40">
                <p className="text-[15px] leading-relaxed text-[var(--text-body-color)] italic opacity-80">
                  Recurring concerns are the key to comparative success. Mastery of these themes allows for seamless interleaving between different periods.
                </p>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="grid gap-6">
              {["factual", "textual", "critical", "comparative"].map((layer) => (
                <div key={layer} className="rounded-2xl bg-[var(--color-bg-raised)] px-6 py-6 shadow-sm border border-white/40">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted-color)] opacity-60 mb-4">
                    {layer} context
                  </p>
                  {nodeGroups[layer].length > 0 ? (
                    <ul className="space-y-4">
                      {nodeGroups[layer].slice(0, 4).map((node) => (
                        <li key={node.id}>
                          <p className="text-[15px] font-bold text-[var(--text-heading-color)]">
                            {node.prompt}
                          </p>
                          <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-body-color)]">
                            {node.answer}
                          </p>
                          {node.explanation && (
                            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted-color)] opacity-70">
                              {node.explanation}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[14px] leading-relaxed text-[var(--text-body-color)] opacity-60">
                      Enriched academic nodes for this layer will appear as the category batches are completed.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <ExternalLinks title={selectedWork || author.author} />
        </div>
      }
      sidebar={
        <div className="space-y-6">
          <StudyPanel title="Navigation Tips">
            <p className="text-[14px] leading-relaxed text-[var(--text-body-color)]">
              Scroll to the end of any content section to reveal <strong>External Resources</strong>. Links are dynamically generated to provide direct access to scholarly databases and archives.
            </p>
          </StudyPanel>
        </div>
      }
    />
  );
}
