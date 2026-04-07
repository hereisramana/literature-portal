"use client";

import raw from "../data/data.json";
import { buildCatalog } from "../utils/catalog.js";
import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/layout/Sidebar.jsx";
import AuthorCard from "../components/cards/AuthorCard.jsx";
import ModeToggle from "../components/layout/ModeToggle.jsx";
import SearchBar from "../components/common/Searchbar.jsx";
import EmptyState from "../components/common/Emptystate.jsx";
import StudyFocusView from "../components/study/StudyFocusView.jsx";
import TestFocusView from "../components/test/TestFocusView.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { mergeAuthorWithEnriched } from "../utils/enrichedData.js";
import { inferTheme } from "../utils/testEngine.js";
import { useProgress } from "../hooks/useProgress.js";
import { useCloudSync } from "../hooks/useCloudSync.js";

export default function Page() {
  const categories = useMemo(() => buildCatalog(raw), []);
  const [category, setCategory] = useState(categories[0]?.id || "");
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
    () =>
      categories.flatMap((entry) =>
        (entry.authors || []).map((author) =>
          mergeAuthorWithEnriched(author, entry.id)
        )
      ),
    [categories]
  );

  const filteredAuthors = useMemo(() => {
    if (!activeCategory) {
      return [];
    }

    return activeCategory.authors
      .map((author) => mergeAuthorWithEnriched(author, activeCategory.id))
      .filter((author) => {
      const matchesQuery =
        !query ||
        author.author?.toLowerCase().includes(query.toLowerCase()) ||
        author.works?.some((work) =>
          (work.title || work).toLowerCase().includes(query.toLowerCase())
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

      <AnimatePresence>
        {!desktopSidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 hidden lg:block"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[rgba(24,32,47,0.12)]"
              onClick={() => setDesktopSidebarCollapsed(true)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-y-0 left-0 w-[320px] bg-[var(--color-bg-primary)] shadow-[var(--shadow-medium)]"
            >
              <Sidebar
                categories={categories}
                active={activeCategory?.id}
                setActive={handleCategoryChange}
                collapsed={false}
                onToggle={() => setDesktopSidebarCollapsed(true)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[rgba(24,32,47,0.18)] backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-full w-[86%] max-w-[320px] bg-[var(--color-bg-primary)] shadow-[var(--shadow-medium)]"
            >
              <Sidebar
                categories={categories}
                active={activeCategory?.id}
                setActive={handleCategoryChange}
                onSelect={() => setMobileMenuOpen(false)}
                collapsed={false}
                onToggle={() => setMobileMenuOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden lg:pl-[72px]">
        <div className="sticky top-0 z-10 bg-[var(--color-bg-primary)]/80 backdrop-blur-md">
          <div className="shell-width px-4 py-4 md:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <button
                aria-label="Open categories"
                className="rounded-2xl p-2 text-[var(--text-heading-color)] transition hover:bg-[var(--color-interaction-hover)] lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <svg
                  aria-hidden="true"
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </button>

              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-[560px] transform transition-all duration-300">
                  <SearchBar onSearch={setQuery} />
                </div>
              </div>

              {/* Spacer for desktop to keep search centered when lg:pl-[72px] is active */}
              <div className="hidden w-11 lg:block" aria-hidden="true" />
            </div>
          </div>
        </div>

        <section className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
          <div className="shell-width px-4 py-3 pb-28 md:px-8 md:py-4 md:pb-8 lg:px-10">
          <AnimatePresence mode="wait">
            {filteredAuthors.length > 0 ? (
              <motion.div
                key={activeCategory?.id || "all"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
              >
                {filteredAuthors.map((author, index) => (
                  <motion.div
                    key={`${author.author}-${index}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.03,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <AuthorCard
                      author={author}
                      onOpenStudy={openStudy}
                      onStartTest={setFocusedAuthor}
                      confidence={confidenceMap[author.author]}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="pt-16"
              >
                <EmptyState />
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </section>

      </main>

      {studyContext && (
        <StudyFocusView
          author={studyContext.author}
          category={activeCategory}
          allAuthors={allAuthors}
          selectedWork={studyContext.selectedWork}
          inferTheme={inferTheme}
          onClose={() => setStudyContext(null)}
        />
      )}
      {focusedAuthor && (
        <TestFocusView
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
