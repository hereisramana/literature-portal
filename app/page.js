"use client";

import raw from "../data/data.json";
import { buildCatalog } from "../utils/catalog.js";
import { useMemo, useState } from "react";

import Sidebar from "../components/layout/Sidebar.jsx";
import AuthorCard from "../components/cards/AuthorCard.jsx";
import ModeToggle from "../components/layout/ModeToggle.jsx";
import SearchBar from "../components/common/Searchbar.jsx";
import EmptyState from "../components/common/Emptystate.jsx";

export default function Page() {
  const categories = useMemo(() => buildCatalog(raw), []);
  const [category, setCategory] = useState(categories[0]?.id || "");
  const [mode, setMode] = useState("browse");
  const [query, setQuery] = useState("");
  const [subCategory, setSubCategory] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeCategory =
    categories.find((entry) => entry.id === category) || categories[0];

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
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-primary)]">
      <div className="hidden h-full w-[300px] border-r border-[var(--color-border-strong)] lg:block">
        <Sidebar
          categories={categories}
          active={activeCategory?.id}
          setActive={handleCategoryChange}
        />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 lg:hidden">
          <div className="h-full w-[86%] max-w-[320px] border-r border-[var(--color-border-strong)] shadow-[var(--shadow-medium)]">
            <Sidebar
              categories={categories}
              active={activeCategory?.id}
              setActive={handleCategoryChange}
              onSelect={() => setMobileMenuOpen(false)}
            />
          </div>
          <button
            aria-label="Close categories"
            className="absolute right-4 top-4 rounded-xl bg-[var(--color-accent)] p-3 text-[var(--color-bg-primary)]"
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
        <div className="border-b border-[var(--color-border-subtle)] px-4 pb-4 pt-5 md:px-8 md:pb-6 md:pt-7">
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
            <h1 className="text-3xl leading-tight md:text-5xl">
              English Literature Revision Guide
            </h1>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="w-full max-w-xl">
              <SearchBar onSearch={setQuery} />
            </div>
            <div className="hidden md:block">
              <ModeToggle mode={mode} setMode={setMode} />
            </div>
          </div>

          {activeCategory?.subcategories?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => setSubCategory("all")}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] ${
                  subCategory === "all"
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-bg-primary)]"
                    : "border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]"
                }`}
              >
                All
              </button>
              {activeCategory.subcategories.map((entry) => (
                <button
                  key={entry.label}
                  onClick={() => setSubCategory(entry.label)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] ${
                    subCategory === entry.label
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-bg-primary)]"
                      : "border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]"
                  }`}
                >
                  {entry.label} ({entry.count})
                </button>
              ))}
            </div>
          )}
        </div>

        <section className="scrollbar-thin flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-6">
          {filteredAuthors.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {filteredAuthors.map((author, index) => (
                <AuthorCard key={`${author.author}-${index}`} author={author} mode={mode} />
              ))}
            </div>
          ) : (
            <div className="pt-16">
              <EmptyState />
            </div>
          )}
        </section>

        <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-sidebar)] p-3 md:hidden">
          <ModeToggle mode={mode} setMode={setMode} />
        </div>
      </main>
    </div>
  );
}
