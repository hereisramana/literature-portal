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
import { useProgress } from "../hooks/useProgress.js";
import { useCloudSync } from "../hooks/useCloudSync.js";

export default function Page() {
  const categories = useMemo(() => buildCatalog(raw), []);
  const [category, setCategory] = useState(categories[0]?.id || "");
  const [mode, setMode] = useState("browse");
  const [query, setQuery] = useState("");
  const [subCategory, setSubCategory] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
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

  const periodOptions = useMemo(() => {
    if (!activeCategory) {
      return [];
    }

    return [...new Set(
      activeCategory.authors
        .map((author) => author.literary_period)
        .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));
  }, [activeCategory]);

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

      const matchesSubCategory =
        subCategory === "all" ||
        author.literary_period === subCategory;

      return matchesQuery && matchesSubCategory;
    });
  }, [activeCategory, query, subCategory]);

  function handleCategoryChange(nextCategory) {
    setCategory(nextCategory);
    setSubCategory("all");
    setFilterOpen(false);
  }

  async function openModal(title, author = "") {
    setModal({ title, author, summary: "" });
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
      });
    } catch {
      setModal({
        title,
        author,
        summary: "No summary available.",
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
      <div className="hidden h-full w-[300px] border-r border-[var(--divider-color)] lg:block">
        <Sidebar
          categories={categories}
          active={activeCategory?.id}
          setActive={handleCategoryChange}
        />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 lg:hidden">
          <div className="h-full w-[86%] max-w-[320px] border-r border-[var(--divider-color)] shadow-[var(--shadow-medium)]">
            <Sidebar
              categories={categories}
              active={activeCategory?.id}
              setActive={handleCategoryChange}
              onSelect={() => setMobileMenuOpen(false)}
            />
          </div>
          <button
            aria-label="Close categories"
            className="absolute right-4 top-4 rounded-xl bg-[var(--button-primary-bg)] p-3 text-[var(--button-primary-text)]"
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
        <div className="border-b border-[var(--divider-color)] bg-[rgba(194,198,200,0.16)] px-4 pb-5 pt-5 md:px-8 md:pb-7 md:pt-7">
          <div className="mb-6 flex items-center gap-4">
            <button
              aria-label="Open categories"
              className="rounded-xl p-2 text-[var(--color-accent)] lg:hidden"
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
            <div className="w-full text-center lg:text-left">
              <h1 className="text-3xl leading-tight md:text-5xl">
                English Literature Revision Guide
              </h1>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted-color)] md:text-base">
                Minimal revision cards, focused testing, and locally stored confidence for calmer repeated study.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex w-full max-w-3xl items-center gap-3">
              <div className="w-full">
                <SearchBar onSearch={setQuery} />
              </div>
              <button
                aria-label="Open contextual filters"
                onClick={() => setFilterOpen((current) => !current)}
                className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
                  filterOpen
                    ? "border-[var(--button-primary-bg)] bg-[var(--color-interaction-active)]"
                    : "border-[var(--divider-color)] bg-[var(--button-secondary-bg)] hover:bg-[var(--color-interaction-hover)]"
                }`}
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-[var(--color-accent)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
              </button>

              {filterOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] z-20 w-[260px] rounded-[24px] border border-[var(--divider-color)] bg-[var(--color-bg-surface)] p-4 shadow-[var(--shadow-medium)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted-color)]">
                    Context filters
                  </p>
                  <div className="mt-3">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted-color)]">
                      Period
                    </label>
                    <select
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--text-body-color)] shadow-[var(--input-shadow),var(--highlight-soft)]"
                    >
                      <option value="all">All Periods</option>
                      {periodOptions.map((period) => (
                        <option key={period} value={period}>
                          {period}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <ModeToggle mode={mode} setMode={setMode} />
            </div>
          </div>
        </div>

        <section className="scrollbar-thin flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-6">
          {filteredAuthors.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {filteredAuthors.map((author, index) => (
                <AuthorCard
                  key={`${author.author}-${index}`}
                  author={author}
                  mode={mode}
                  onOpenModal={openModal}
                  onStartTest={setFocusedAuthor}
                  confidence={confidenceMap[author.author]}
                />
              ))}
            </div>
          ) : (
            <div className="pt-16">
              <EmptyState />
            </div>
          )}
        </section>

        <div className="border-t border-[var(--divider-color)] bg-[var(--color-bg-surface)] p-3 md:hidden">
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
