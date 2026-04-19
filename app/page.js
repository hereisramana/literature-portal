"use client";

import raw from "../data/data.json";
import { buildCatalog } from "../utils/catalog.js";
import { useEffect, useMemo, useState } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import { useDebounce } from "../hooks/useDebounce.js";

import Sidebar from "../components/layout/Sidebar.jsx";
import AuthorCard from "../components/cards/AuthorCard.jsx";
import ThemeToggle, { useTheme } from "../components/layout/ThemeToggle.jsx";
import SearchBar from "../components/common/Searchbar.jsx";
import EmptyState from "../components/common/Emptystate.jsx";
import StudyFocusView from "../components/study/StudyFocusView.jsx";
import TestFocusView from "../components/test/TestFocusView.jsx";
import FeedbackModal from "../components/common/FeedbackModal.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { mergeAuthorWithEnriched } from "../utils/enrichedData.js";
import { inferTheme } from "../utils/testEngine.js";
import { useProgress } from "../hooks/useProgress.js";


export default function Page() {
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [focusedAuthor, setFocusedAuthor] = useState(null);
  const [studyContext, setStudyContext] = useState(null);
  const [confidenceMap, setConfidenceMap] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { get, save, batchGet, ready } = useProgress();

  const { theme, toggle, mounted } = useTheme();

  const categories = useMemo(() => buildCatalog(raw), []);
  
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].id);
    }
  }, [categories, category]);

  // Master list of all unique authors from the unified database
  const allAuthors = useMemo(() => {
    const uniqueMap = new Map();
    categories.forEach(c => {
      c.authors.forEach(a => {
        if (!uniqueMap.has(a.author)) {
          uniqueMap.set(a.author, a);
        }
      });
    });
    return Array.from(uniqueMap.values());
  }, [categories]);

  const activeCategory = useMemo(() => {
    return categories.find((entry) => entry.id === category) || categories[0];
  }, [categories, category]);

  const filteredAuthors = useMemo(() => {
    if (!activeCategory) return [];

    return activeCategory.authors.filter((author) => {
      const matchesQuery =
        !debouncedQuery ||
        author.author?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        author.works?.some((work) =>
          (typeof work === 'string' ? work : work.title).toLowerCase().includes(debouncedQuery.toLowerCase())
        );

      return matchesQuery;
    });
  }, [activeCategory, debouncedQuery]);

  const searchSuggestions = useMemo(() => {
    if (!debouncedQuery || filteredAuthors.length > 0) return [];

    return categories
      .map((cat) => {
        const matches = cat.authors.filter((author) => {
          return (
            author.author?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            (author.works || []).some((work) =>
              (typeof work === 'string' ? work : work.title).toLowerCase().includes(debouncedQuery.toLowerCase())
            )
          );
        });
        return matches.length > 0
          ? { id: cat.id, label: cat.label, count: matches.length }
          : null;
      })
      .filter(Boolean);
  }, [categories, debouncedQuery, filteredAuthors]);

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
    if (!ready || filteredAuthors.length === 0) return;

    let cancelled = false;
    const keys = filteredAuthors.map(a => `confidence:${a.author}`);
    
    batchGet(keys).then((results) => {
      if (cancelled) return;

      const next = {};
      filteredAuthors.forEach(author => {
        const key = `confidence:${author.author}`;
        const val = results[key];
        if (val) {
          next[author.author] = val.confidence || val;
        }
      });

      if (Object.keys(next).length > 0) {
        setConfidenceMap(current => ({ ...current, ...next }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [filteredAuthors, batchGet, ready]);

  async function handleConfidenceSave(payload) {
    await save(`confidence:${payload.author}`, payload);
    setConfidenceMap((current) => ({
      ...current,
      [payload.author]: payload.confidence,
    }));
  }

  // Trigger feedback after overlay closed
  const handleOverlayClose = () => {
    const closedFocused = focusedAuthor;
    const closedStudy = studyContext;
    
    setFocusedAuthor(null);
    setStudyContext(null);

    if (closedFocused || closedStudy) {
      const alreadyShown = localStorage.getItem("feedback_shown");
      if (!alreadyShown) {
        setShowFeedback(true);
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--clr-bg)]">
      {/* Desktop Sidebar: Static and Flex-based */}
      <div
        className={`hidden lg:block h-full transition-[width] duration-300 ease-in-out overflow-hidden flex-shrink-0 ${
          desktopSidebarCollapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        <Sidebar
          categories={categories}
          active={activeCategory?.id}
          setActive={handleCategoryChange}
          collapsed={desktopSidebarCollapsed}
          onToggle={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
          theme={theme}
          mounted={mounted}
        />
      </div>

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
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative h-full w-[85%] max-w-[320px] shadow-2xl"
            >
              <Sidebar
                categories={categories}
                active={activeCategory?.id}
                setActive={handleCategoryChange}
                onSelect={() => setMobileMenuOpen(false)}
                collapsed={false}
                onToggle={() => setMobileMenuOpen(false)}
                theme={theme}
                mounted={mounted}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="sticky top-0 z-10 bg-[var(--clr-bg)]/92 backdrop-blur-xl">
          <div className="shell-width px-4 py-4 md:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.92 }}
                aria-label="Open categories"
                className="rounded-xl p-2 text-[var(--text-heading-color)] transition hover:bg-[var(--color-bg-inset)] lg:hidden"
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
              </motion.button>

              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-[560px] transform transition-all duration-300">
                  <SearchBar onSearch={setQuery} />
                </div>
              </div>

              {/* Theme toggle — top right */}
              <ThemeToggle theme={theme} toggle={toggle} mounted={mounted} />
            </div>
          </div>
        </div>

        <section className="min-h-0 flex-1 flex flex-col overflow-hidden">
  
  {/* 2. This div should be full width to let the scrollbar reach the edge */}
  <div className="h-full w-full"> 
    <AnimatePresence mode="wait">
      {filteredAuthors.length > 0 ? (
        <motion.div className="h-full">
          <VirtuosoGrid
            /* 3. Apply the scrollbar class directly to Virtuoso */
            className="scrollbar-thin"
            style={{ height: '100%' }}
            totalCount={filteredAuthors.length}
            
            /* 4. Move 'shell-width' and padding here to keep cards centered */
            listClassName="shell-width mx-auto px-4 py-3 md:px-8 md:py-4 lg:px-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 pb-28 pt-2"
            
            itemClassName="content-lazy"
            itemContent={(index) => {
              const author = filteredAuthors[index]
                    return (
                      <AuthorCard
                        author={author}
                        onOpenStudy={openStudy}
                        onStartTest={setFocusedAuthor}
                        confidence={confidenceMap[author.author]}
                        showAwardInsteadOfPeriod={activeCategory?.id === "award-winning-indians"}
                      />
                    );
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="pt-4 md:pt-16"
              >
                <EmptyState
                  suggestions={searchSuggestions}
                  onSelectSuggestion={handleCategoryChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </section>

      </main>

      <AnimatePresence>
        {studyContext && (
          <StudyFocusView
            author={studyContext.author}
            category={activeCategory}
            allAuthors={allAuthors}
            selectedWork={studyContext.selectedWork}
            inferTheme={inferTheme}
            onClose={handleOverlayClose}
            onStartTest={(author) => {
              setStudyContext(null);
              setFocusedAuthor(author);
            }}
            onNextAuthor={() => {
              const currentIdx = filteredAuthors.findIndex(a => a.author === studyContext.author.author);
              const nextAuthor = filteredAuthors[currentIdx + 1];
              if (nextAuthor) setStudyContext({ author: nextAuthor, selectedWork: "" });
            }}
            onNavigateAuthor={(author) => setStudyContext({ author, selectedWork: "" })}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {focusedAuthor && (
          <TestFocusView
            author={focusedAuthor}
            category={activeCategory}
            allAuthors={allAuthors}
            storedConfidence={confidenceMap[focusedAuthor.author]}
            onSaveConfidence={handleConfidenceSave}

            onClose={handleOverlayClose}
            onNextAuthor={() => {
              const idx = filteredAuthors.findIndex(a => a.author === focusedAuthor.author);
              const next = filteredAuthors[idx + 1];
              setFocusedAuthor(next || null);
            }}
          />
        )}
      </AnimatePresence>

      <FeedbackModal 
        isOpen={showFeedback} 
        onClose={() => setShowFeedback(false)} 
      />
    </div>
  );
}
