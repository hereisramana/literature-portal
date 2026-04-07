"use client";

import { useMemo, useState } from "react";

import AuthorFocusShell from "../focus/AuthorFocusShell.jsx";

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

export default function StudyFocusView({
  author,
  category,
  allAuthors,
  selectedWork,
  inferTheme,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState(selectedWork ? "works" : "overview");

  const workTitles = useMemo(
    () => (author.works || []).map((work) => work.title || work),
    [author]
  );

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
    const fromNodes = (author.nodes || [])
      .filter((node) => node.subType === "theme")
      .map((node) => node.answer);
    const fallbackThemes = workTitles.map((work) => inferTheme(work, author, category));
    return [...new Set([...fromNodes, ...fallbackThemes].filter(Boolean))];
  }, [author, category, inferTheme, workTitles]);

  const nodeGroups = useMemo(() => {
    const groups = {
      factual: [],
      textual: [],
      critical: [],
      comparative: [],
    };

    (author.nodes || []).forEach((node) => {
      if (groups[node.layer]) {
        groups[node.layer].push(node);
      }
    });

    return groups;
  }, [author]);

  const overviewItems = [
    { label: "Category", value: category?.label || "" },
    { label: "Region", value: author.region || "Unknown" },
    { label: "Period", value: author.literary_period || "Unknown" },
    { label: "Works", value: String(workTitles.length || 0) },
  ];

  if ((author.movements || []).length > 0) {
    overviewItems.push({
      label: "Movements",
      value: author.movements.join(", "),
    });
  }

  if ((author.genreTags || []).length > 0) {
    overviewItems.push({
      label: "Genres",
      value: author.genreTags.join(", "),
    });
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "works", label: "Works" },
    { id: "themes", label: "Themes" },
    { id: "notes", label: "Notes" },
    { id: "links", label: "Links" },
  ];

  const searchTitle = encodeURIComponent(selectedWork || author.author);
  const meta = `${category.label} | ${author.region || "Unknown region"} | ${
    author.literary_period || "Reference"
  }`;

  return (
    <AuthorFocusShell
      modeLabel="Study Mode"
      title={author.author}
      meta={meta}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onClose={onClose}
      main={
        <>
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
                  key={work.title || work}
                  className={`rounded-2xl px-4 py-4 text-sm leading-7 ${
                    selectedWork === (work.title || work)
                      ? "bg-[var(--color-bg-accent-soft)]"
                      : "bg-[var(--color-bg-raised)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span>{work.title || work}</span>
                    {(work.year || work.type) && (
                      <span className="text-xs text-[var(--text-muted-color)]">
                        {[work.year, work.type].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </div>
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
                  Study the recurring concerns first, then move into retrieval. As enriched category batches expand, these themes will come from academic study nodes rather than only fallback inference.
                </p>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="grid gap-4">
              {["factual", "textual", "critical", "comparative"].map((layer) => (
                <div key={layer} className="rounded-2xl bg-[var(--color-bg-raised)] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted-color)]">
                    {layer}
                  </p>
                  {nodeGroups[layer].length > 0 ? (
                    <ul className="mt-3 space-y-3">
                      {nodeGroups[layer].slice(0, 4).map((node) => (
                        <li key={node.id}>
                          <p className="text-sm font-semibold text-[var(--text-heading-color)]">
                            {node.prompt}
                          </p>
                          <p className="mt-1 text-sm leading-7 text-[var(--text-body-color)]">
                            {node.answer}
                          </p>
                          {node.explanation && (
                            <p className="mt-1 text-xs leading-6 text-[var(--text-muted-color)]">
                              {node.explanation}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm leading-7 text-[var(--text-body-color)]">
                      Enriched academic notes for this layer will appear here as the category batches are completed.
                    </p>
                  )}
                </div>
              ))}
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
        </>
      }
      sidebar={
        <>
          <StudyPanel title="Study Guide">
            <p className="text-sm leading-7 text-[var(--text-body-color)]">
              Move from overview to works, then themes. Once the material feels familiar, switch to test mode for retrieval-first practice and later MCQ verification.
            </p>
          </StudyPanel>

          <StudyPanel title="Related Authors">
            {relatedAuthors.length > 0 ? (
              <ul className="space-y-2">
                {relatedAuthors.map((entry) => (
                  <li
                    key={entry.author}
                    className="rounded-2xl bg-[var(--color-bg-surface)] px-3 py-3 text-sm text-[var(--text-body-color)]"
                  >
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
        </>
      }
    />
  );
}
