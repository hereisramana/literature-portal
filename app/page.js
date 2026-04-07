"use client";

import raw from "../data/data.json";
import { buildCatalog } from "../utils/catalog.js";
import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/layout/Sidebar.jsx";
import AuthorCard from "../components/cards/AuthorCard.jsx";
import ModeToggle from "../components/layout/ModeToggle.jsx";
import SearchBar from "../components/common/Searchbar.jsx";
import EmptyState from "../components/common/Emptystate.jsx";
import InfoModal from "../components/common/InfoModal.jsx";
import TestFocusModal from "../components/test/TestFocusModal.jsx";
import { inferTheme } from "../utils/testEngine.js";
import { useProgress } from "../hooks/useProgress.js";
import { useCloudSync } from "../hooks/useCloudSync.js";

export default function Page() {
  const categories = useMemo(() => buildCatalog(raw), []);
  const [category, setCategory] = useState(categories[0]?.id || "");
  const [mode, setMode] = useState("browse");
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedAuthor, setFocusedAuthor] = useState(null);
  const [confidenceMap, setConfidenceMap] = useState({});
  const { get, save, ready } = useProgress();
  const cloud = useCloudSync();

  const activeCategory =
    categories.find((entry) => entry.id === category) || categories[0];
  const allAuthors = useMemo(
    () => categories.flatMap((entry) => entry.authors || []),
    [categories]
  );

  const filteredAuthors = useMemo(() => {
    if (!activeCategory) {
      return [];
    }

    return activeCategory.authors.filter((author) => {
      const matchesQuery =
        !query ||
        author.author?.toLowerCase().includes(query.toLowerCase()) ||
        author.works?.some((work) =>
          work.toLowerCase().includes(query.toLowerCase())
        );

      return matchesQuery;
    });
  }, [activeCategory, query]);

  const groupedAuthors = useMemo(() => {
    const groups = filteredAuthors.reduce((acc, author) => {
      const key = author.literary_period || "Other";
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(author);
      return acc;
    }, {});

    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredAuthors]);

  function handleCategoryChange(nextCategory) {
    setCategory(nextCategory);
  }

  async function openModal(title, author = "", sourceAuthor = null) {
    const themeSource = sourceAuthor || activeCategory?.authors.find((entry) => entry.author === author);
    const themes = themeSource
      ? [...new Set(
          (themeSource.works || []).map((work) => inferTheme(work, themeSource, activeCategory))
        )]
      : [];

    setModal({ title, author, summary: "", themes });
    setLoading(true);

    try {
      const queryTitle = encodeURIComponent(title);
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${queryTitle}`
      );
      const payload = await response.json();

      setModal({
        title,
        author,
        summary: payload.extract || "No summary available.",
        themes,
      });
    } catch {
      setModal({
        title,
        author,
        summary: "No summary available.",
        themes,
      });
    }

    setLoading(false);
  }

  useEffect(() => {
    if (!focusedAuthor || !ready) {
      return;
    }

    let cancelled = false;

    get(`confidence:${focusedAuthor.author}`).then((value) => {
      if (!cancelled && value) {
        setConfidenceMap((current) => ({
          ...current,
          [focusedAuthor.author]: value.confidence || value,
        }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [focusedAuthor, get, ready]);

  useEffect(() => {
    if (!ready || filteredAuthors.length === 0) {
      return;
    }

    let cancelled = false;

    Promise.all(
      filteredAuthors.map(async (author) => {
        const value = await get(`confidence:${author.author}`);
        return [author.author, value?.confidence || value || ""];
      })
    ).then((entries) => {
      if (cancelled) {
        return;
      }

      setConfidenceMap((current) => {
        const next = { ...current };
        entries.forEach(([authorName, confidence]) => {
          if (confidence) {
            next[authorName] = confidence;
          }
        });
        return next;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [filteredAuthors, get, ready]);

  async function handleConfidenceSave(payload) {
    await save(`confidence:${payload.author}`, payload);
    setConfidenceMap((current) => ({
      ...current,
      [payload.author]: payload.confidence,
    }));
    await cloud.sync(payload);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-primary)]">
      <div
        className={`hidden h-full border-r border-[var(--divider-color)] bg-[rgba(255,255,255,0.42)] transition-[width] duration-300 lg:block ${
          desktopSidebarCollapsed ? "w-[72px]" : "w-[320px]"
        }`}
      >
        <Sidebar
          categories={categories}
          active={activeCategory?.id}
          setActive={handleCategoryChange}
          collapsed={desktopSidebarCollapsed}
          onToggle={() => setDesktopSidebarCollapsed((current) => !current)}
        />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[rgba(24,32,47,0.18)] backdrop-blur-sm lg:hidden">
          <div className="h-full w-[86%] max-w-[320px] border-r border-[var(--divider-color)] bg-[var(--color-bg-primary)] shadow-[var(--shadow-medium)]">
            <Sidebar
              categories={categories}
              active={activeCategory?.id}
              setActive={handleCategoryChange}
              onSelect={() => setMobileMenuOpen(false)}
            />
          </div>
          <button
            aria-label="Close categories"
            className="absolute right-4 top-4 rounded-2xl bg-[var(--color-text-strong)] p-3 text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="border-b border-[var(--divider-color)] bg-[rgba(255,255,255,0.34)] backdrop-blur-sm">
          <div className="shell-width px-4 pb-6 pt-5 md:px-8 md:pb-8 md:pt-6 lg:px-10">
          <div className="mb-8 flex items-start gap-4">
            <button
              aria-label="Open categories"
              className="rounded-2xl p-2 text-[var(--text-heading-color)] transition hover:bg-[rgba(255,255,255,0.52)] lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg
                aria-hidden="true"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
            <div className="w-full text-center md:text-left">
              <h1 className="text-[33px] leading-[1] md:text-[46px] lg:text-[52px]">
                English Literature Revision Guide
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex w-full items-center gap-3">
              <div className="w-full lg:max-w-[427px]">
                <SearchBar onSearch={setQuery} />
              </div>
            </div>
            <div className="hidden shrink-0 md:block">
              <ModeToggle mode={mode} setMode={setMode} />
            </div>
          </div>
        </div>
        </div>

        <section className="scrollbar-thin flex-1 overflow-y-auto">
          <div className="shell-width px-4 py-4 md:px-8 md:py-5 lg:px-10">
          {filteredAuthors.length > 0 ? (
            <div className="space-y-8">
              {groupedAuthors.map(([period, authors]) => (
                <section key={period}>
                  <h2 className="mb-4 text-[24px] leading-none text-[var(--text-heading-color)] md:text-[28px]">
                    {period}
                  </h2>
                  <div
                    className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${
                      desktopSidebarCollapsed ? "xl:grid-cols-3" : "2xl:grid-cols-3"
                    }`}
                  >
                    {authors.map((author, index) => (
                      <AuthorCard
                        key={`${period}-${author.author}-${index}`}
                        author={author}
                        mode={mode}
                        onOpenModal={(title, authorName = "") =>
                          openModal(title, authorName, author)
                        }
                        onStartTest={setFocusedAuthor}
                        confidence={confidenceMap[author.author]}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="pt-16">
              <EmptyState />
            </div>
          )}
          </div>
        </section>

        <div className="safe-bottom border-t border-[var(--divider-color)] bg-[rgba(255,255,255,0.82)] px-4 pt-3 backdrop-blur-md md:hidden">
          <ModeToggle mode={mode} setMode={setMode} />
        </div>
      </main>

      <InfoModal modal={modal} loading={loading} onClose={() => setModal(null)} />
      {mode === "test" && focusedAuthor && (
        <TestFocusModal
          author={focusedAuthor}
          category={activeCategory}
          allAuthors={allAuthors}
          storedConfidence={confidenceMap[focusedAuthor.author]}
          onSaveConfidence={handleConfidenceSave}
          cloud={cloud}
          onClose={() => setFocusedAuthor(null)}
        />
      )}
    </div>
  );
}
