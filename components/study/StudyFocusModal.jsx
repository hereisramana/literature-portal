"use client";

import { useMemo, useState } from "react";

function StudyPanel({ title, children }) {
  return (
    <div className="rounded-[28px] bg-[var(--color-bg-raised)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted-color)]">
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function StudyFocusModal({
  author,
  category,
  allAuthors,
  selectedWork,
  inferTheme,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState(selectedWork ? "works" : "overview");

  const relatedAuthors = useMemo(() => {
    return allAuthors
      .filter((entry) => entry.author !== author.author)
      .filter((entry) => {
        const samePeriod =
          entry.literary_period &&
          entry.literary_period === author.literary_period;
        const sameRegion = entry.region && entry.region === author.region;
        return samePeriod || sameRegion;
      })
      .slice(0, 4);
  }, [allAuthors, author]);

  const themeSet = useMemo(() => {
    return [
      ...new Set(
        (author.works || []).map((work) => inferTheme(work, author, category))
      ),
    ];
  }, [author, category, inferTheme]);

  const overviewItems = [
    { label: "Category", value: category?.label || "" },
    { label: "Region", value: author.region || "Unknown" },
    { label: "Period", value: author.literary_period || "Unknown" },
    { label: "Works", value: String(author.works?.length || 0) },
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "works", label: "Works" },
    { id: "themes", label: "Themes" },
    { id: "links", label: "Links" },
  ];

  const searchTitle = encodeURIComponent(selectedWork || author.author);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[rgba(24,32,47,0.18)] backdrop-blur-sm" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="card flex h-[min(88vh,860px)] w-full max-w-4xl flex-col overflow-hidden rounded-[32px]">
          <div className="flex flex-col gap-4 px-5 pb-5 pt-5 md:px-8 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted-color)]">
                Study Mode
              </p>
              <h2 className="mt-2 text-3xl leading-tight md:text-4xl">
                {author.author}
              </h2>
              <p className="mt-2 text-sm text-[var(--text-muted-color)]">
                {category.label} | {author.region || "Unknown region"} | {author.literary_period || "Reference"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid grid-cols-2 gap-2 rounded-full bg-[var(--color-bg-raised)] p-1 md:grid-cols-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
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
              <div className="rounded-[28px] bg-[var(--card-bg)] p-5 md:p-6">
                {activeTab === "overview" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {overviewItems.map((item) => (
                      <div key={item.label} className="rounded-2xl bg-[var(--color-bg-raised)] px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted-color)]">
                          {item.label}
                        </p>
                        <p className="mt-2 text-base font-semibold text-[var(--text-heading-color)]">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "works" && (
                  <ul className="space-y-3">
                    {(author.works || []).map((work) => (
                      <li
                        key={work}
                        className={`rounded-2xl px-4 py-4 text-sm leading-7 ${
                          selectedWork === work
                            ? "bg-[var(--color-bg-accent-soft)]"
                            : "bg-[var(--color-bg-raised)]"
                        }`}
                      >
                        {work}
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === "themes" && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {themeSet.map((theme) => (
                        <span
                          key={theme}
                          className="rounded-full bg-[var(--color-bg-raised)] px-3 py-2 text-sm font-semibold text-[var(--text-body-color)]"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                    <div className="rounded-2xl bg-[var(--color-bg-raised)] px-4 py-4">
                      <p className="text-sm leading-7 text-[var(--text-body-color)]">
                        Study these themes before moving into retrieval practice. The current app is using inferred themes from the existing dataset; richer academic theme data can plug into this same surface later.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "links" && (
                  <div className="grid gap-3 md:grid-cols-2">
                    <a
                      href={`https://en.wikipedia.org/wiki/Special:Search?search=${searchTitle}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl bg-[var(--color-bg-raised)] px-4 py-3 text-sm font-semibold text-[var(--button-secondary-text)] no-underline transition hover:bg-[var(--color-interaction-hover)]"
                    >
                      Wikipedia
                    </a>
                    <a
                      href={`https://www.britannica.com/search?query=${searchTitle}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl bg-[var(--color-bg-raised)] px-4 py-3 text-sm font-semibold text-[var(--button-secondary-text)] no-underline transition hover:bg-[var(--color-interaction-hover)]"
                    >
                      Britannica
                    </a>
                    <a
                      href={`https://www.poetryfoundation.org/search?query=${searchTitle}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl bg-[var(--color-bg-raised)] px-4 py-3 text-sm font-semibold text-[var(--button-secondary-text)] no-underline transition hover:bg-[var(--color-interaction-hover)]"
                    >
                      Poetry Foundation
                    </a>
                    <a
                      href={`https://www.google.com/search?q=${searchTitle}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl bg-[var(--color-bg-raised)] px-4 py-3 text-sm font-semibold text-[var(--button-secondary-text)] no-underline transition hover:bg-[var(--color-interaction-hover)]"
                    >
                      Google
                    </a>
                  </div>
                )}
              </div>

              <aside className="space-y-4">
                <StudyPanel title="Study Guide">
                  <p className="text-sm leading-7 text-[var(--text-body-color)]">
                    Move from overview to works, then themes. Once the material feels familiar, switch to test mode for retrieval-first practice and later MCQ verification.
                  </p>
                </StudyPanel>

                <StudyPanel title="Related Authors">
                  {relatedAuthors.length > 0 ? (
                    <ul className="space-y-2">
                      {relatedAuthors.map((entry) => (
                        <li key={entry.author} className="rounded-2xl bg-[var(--color-bg-surface)] px-3 py-3 text-sm text-[var(--text-body-color)]">
                          {entry.author}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm leading-7 text-[var(--text-body-color)]">
                      Related authors will appear here for interleaved study across adjacent periods or shared literary contexts.
                    </p>
                  )}
                </StudyPanel>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
