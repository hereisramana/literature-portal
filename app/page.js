"use client";

import raw from "../data/data.json";
import { buildCatalog } from "../utils/catalog.js";
import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/layout/Sidebar.jsx";
import AuthorCard from "../components/cards/AuthorCard.jsx";
import ModeToggle from "../components/layout/ModeToggle.jsx";
import SearchBar from "../components/common/Searchbar.jsx";
import EmptyState from "../components/common/Emptystate.jsx";
import StudyFocusModal from "../components/study/StudyFocusModal.jsx";
import TestFocusModal from "../components/test/TestFocusModal.jsx";
import { inferTheme } from "../utils/testEngine.js";
import { useProgress } from "../hooks/useProgress.js";
import { useCloudSync } from "../hooks/useCloudSync.js";

export default function Page() {
  const categories = useMemo(() => buildCatalog(raw), []);
  const [category, setCategory] = useState(categories[0]?.id || "");
  const [mode, setMode] = useState("study");
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [focusedAuthor, setFocusedAuthor] = useState(null);
  const [studyContext, setStudyContext] = useState(null);
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

  function handleCategoryChange(nextCategory) {
    setCategory(nextCategory);
  }

  function openStudy(author, selectedWork = "") {
    setStudyContext({
      author,
      selectedWork,
    });
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
      <div className="fixed inset-y-0 left-0 z-20 hidden lg:block">
        <div className="h-full w-[72px] bg-[var(--color-bg-primary)]">
          <Sidebar
            categories={categories}
            active={activeCategory?.id}
            setActive={handleCategoryChange}
            collapsed={true}
            onToggle={() => setDesktopSidebarCollapsed(false)}
          />
        </div>
      </div>

      {!desktopSidebarCollapsed && (
        <div className="fixed inset-0 z-30 hidden lg:block">
          <div
            className="ease-figma absolute inset-0 bg-[rgba(24,32,47,0.12)] transition-opacity duration-300"
            onClick={() => setDesktopSidebarCollapsed(true)}
          />
          <div className="ease-figma absolute inset-y-0 left-0 w-[320px] bg-[var(--color-bg-primary)] shadow-[var(--shadow-medium)] transition-transform duration-300">
            <Sidebar
              categories={categories}
              active={activeCategory?.id}
              setActive={handleCategoryChange}
              collapsed={false}
              onToggle={() => setDesktopSidebarCollapsed(true)}
            />
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[rgba(24,32,47,0.18)] backdrop-blur-sm lg:hidden">
          <div className="ease-figma h-full w-[86%] max-w-[320px] bg-[var(--color-bg-primary)] shadow-[var(--shadow-medium)] transition-transform duration-300">
            <Sidebar
              categories={categories}
              active={activeCategory?.id}
              setActive={handleCategoryChange}
              onSelect={() => setMobileMenuOpen(false)}
              title="English Literature Revision Guide"
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

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden lg:pl-[72px]">
        <div className="bg-[var(--color-bg-primary)]">
          <div className="shell-width px-4 pb-3 pt-3 md:px-8 md:pb-4 md:pt-4 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <button
              aria-label="Open categories"
              className="rounded-2xl p-2 text-[var(--text-heading-color)] transition hover:bg-[var(--color-interaction-hover)] lg:hidden"
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
            <div className="w-full lg:max-w-[427px]">
              <SearchBar onSearch={setQuery} />
            </div>
            <div className="hidden shrink-0 md:block">
              <ModeToggle mode={mode} setMode={setMode} />
            </div>
          </div>
        </div>
        </div>

        <section className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
          <div className="shell-width px-4 py-3 pb-28 md:px-8 md:py-4 md:pb-8 lg:px-10">
          {filteredAuthors.length > 0 ? (
            <div
              className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {filteredAuthors.map((author, index) => (
                <AuthorCard
                  key={`${author.author}-${index}`}
                  author={author}
                  mode={mode}
                  onOpenStudy={openStudy}
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
          </div>
        </section>

        <div className="safe-bottom fixed inset-x-0 bottom-0 z-20 bg-[var(--color-bg-primary)] px-4 pt-3 md:hidden">
          <ModeToggle mode={mode} setMode={setMode} />
        </div>
      </main>

      {mode === "study" && studyContext && (
        <StudyFocusModal
          author={studyContext.author}
          category={activeCategory}
          allAuthors={allAuthors}
          selectedWork={studyContext.selectedWork}
          inferTheme={inferTheme}
          onClose={() => setStudyContext(null)}
        />
      )}
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
