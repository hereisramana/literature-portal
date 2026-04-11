"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthorFocusShell from "../focus/AuthorFocusShell.jsx";

// ─────────────────────────────────────────────────────────────────────────────
// DATA CLEANING (called before rendering any author)
// ─────────────────────────────────────────────────────────────────────────────
export function sanitiseAuthor(raw) {
  const a = JSON.parse(JSON.stringify(raw));
  if (!a.legacy) a.legacy = {};
  if (!a.bio_context) a.bio_context = { location: null, movements: [], collaborators: [] };

  if (a.legacy.posthumous_notes === "null") a.legacy.posthumous_notes = null;
  if (a.legacy.awards === null) a.legacy.awards = [];
  if (a.legacy.translations === null) a.legacy.translations = [];

  if (a.bio_context.collaborators === null) {
    a.bio_context.collaborators = [];
  } else if (Array.isArray(a.bio_context.collaborators)) {
    a.bio_context.collaborators = a.bio_context.collaborators.filter(Boolean);
  }

  if (!a.works) a.works = [];
  if (!a.themes) a.themes = [];
  if (!a.style_innovations) a.style_innovations = [];
  if (!a.key_characters) a.key_characters = [];
  if (!a.genreTags) a.genreTags = [];
  if (!a.comparison_peers) a.comparison_peers = [];

  return a;
}

// ─────────────────────────────────────────────────────────────────────────────
// SMALL ATOMS
// ─────────────────────────────────────────────────────────────────────────────
function Pill({ label, color = "default" }) {
  const colors = {
    default:    "bg-white/10 text-[var(--clr-ink)] border border-white/10",
    accent:     "bg-[var(--clr-focus)]/20 text-[var(--clr-pulse)] border border-[var(--clr-focus)]/30",
    green:      "bg-[var(--clr-correct)]/15 text-[var(--clr-correct)] border border-[var(--clr-correct)]/30",
    sand:       "bg-[var(--clr-recall)]/60 text-[var(--clr-ink)] border border-white/10",
    warn:       "bg-[var(--clr-warn)]/15 text-[var(--clr-warn)] border border-[var(--clr-warn)]/30",
    blue:       "bg-[#7C92A6]/20 text-[#aec4d6] border border-[#7C92A6]/30",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${colors[color] || colors.default}`}>
      {label}
    </span>
  );
}

function Tag({ label, color = "theme" }) {
  const cls = {
    theme: "bg-[var(--clr-focus)]/15 text-[var(--clr-pulse)] border border-[var(--clr-focus)]/25",
    style: "bg-[var(--clr-correct)]/12 text-[var(--clr-correct)] border border-[var(--clr-correct)]/25",
    move:  "bg-[#7C92A6]/15 text-[#aec4d6] border border-[#7C92A6]/25",
    tag:   "bg-[var(--clr-recall)]/30 text-[var(--clr-ink)] border border-[var(--clr-recall)]/50",
  };
  return (
    <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-[12px] font-medium leading-none ${cls[color]}`}>
      {label}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--clr-ink)] opacity-35">
      {children}
    </p>
  );
}

function EmptyNote({ children }) {
  return (
    <p className="text-[12px] text-[var(--clr-ink)] opacity-30 italic">{children}</p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
function StudySidebar({ author, allAuthors, onNavigatePeer }) {
  return (
    <div className="space-y-8 py-2">
      {/* THEMES */}
      <div>
        <SectionLabel>Themes</SectionLabel>
        {author.themes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {author.themes.map((t, i) => <Tag key={i} label={t} color="theme" />)}
          </div>
        ) : (
          <EmptyNote>Researching themes for this author...</EmptyNote>
        )}
      </div>

      {/* STYLE INNOVATIONS */}
      {author.style_innovations.length > 0 && (
        <div>
          <SectionLabel>Signature Style</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {author.style_innovations.map((s, i) => <Tag key={i} label={s} color="style" />)}
          </div>
        </div>
      )}

      {/* MOVEMENTS */}
      {author.bio_context.movements?.length > 0 && (
        <div>
          <SectionLabel>Movements</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {author.bio_context.movements.map((m, i) => <Tag key={i} label={m} color="move" />)}
          </div>
        </div>
      )}

      {/* GENRE TAGS (aligned with Test Engine Hints) */}
      {author.genreTags?.length > 0 && (
        <div>
          <SectionLabel>Genre Tags</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {author.genreTags.map((t, i) => <Tag key={i} label={t} color="tag" />)}
          </div>
        </div>
      )}

      {/* COMPARISON PEERS */}
      {author.comparison_peers.length > 0 && (
        <div>
          <SectionLabel>Similar Authors</SectionLabel>
          <div className="space-y-3">
            {author.comparison_peers.map((peer, i) => {
              const peerAuthor = allAuthors?.find(a => a.author === peer.name);
              return (
                <motion.button
                  key={i}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => peerAuthor && onNavigatePeer?.(peerAuthor)}
                  className={`w-full text-left p-3 rounded-xl bg-white/5 border border-white/8 transition-all ${peerAuthor ? 'cursor-pointer hover:bg-white/10 hover:border-[var(--clr-focus)]/30' : 'cursor-default'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 h-8 w-8 rounded-full bg-[var(--clr-recall)] flex items-center justify-center text-[10px] font-bold text-[var(--clr-ink)] uppercase">
                      {peer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-white truncate">{peer.name}</p>
                      <p className="text-[11px] text-[var(--clr-ink)] opacity-45 truncate">{peer.shared_theme}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1 — WORKS
// ─────────────────────────────────────────────────────────────────────────────
function WorksTab({ author }) {
  const sorted = useMemo(() => {
    return [...author.works].sort((a, b) => {
      const ya = a.year ? parseInt(a.year) : Infinity;
      const yb = b.year ? parseInt(b.year) : Infinity;
      return ya - yb;
    });
  }, [author.works]);

  if (sorted.length === 0) {
    return <EmptyNote>No works recorded for this author.</EmptyNote>;
  }

  return (
    <div className="space-y-3">
      {sorted.map((work, i) => {
        const title = typeof work === "string" ? work : work.title;
        const year = typeof work === "object" ? work.year : null;
        const genre = typeof work === "object" ? work.genre || work.type : null;
        const isMagnum = author.magnum_opus && title === author.magnum_opus;

        return (
          <div
            key={i}
            className={`flex items-start justify-between gap-4 rounded-xl px-5 py-4 border transition-all ${
              isMagnum
                ? "bg-[var(--clr-focus)]/10 border-[var(--clr-focus)]/30"
                : "bg-white/5 border-white/8"
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[15px] font-semibold text-white leading-snug">{title}</p>
                {isMagnum && <Pill label="Defining Work" color="accent" />}
              </div>
              {genre && (
                <p className="mt-1 text-[12px] text-[var(--clr-ink)] opacity-45">{genre}</p>
              )}
            </div>
            <div className="shrink-0 flex flex-col items-end gap-2">
              {year && (
                <span className="rounded-full bg-white/8 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-[var(--clr-ink)] opacity-70">
                  {year}
                </span>
              )}
              {isMagnum && (
                <span className="rounded-full bg-[var(--clr-focus)]/25 border border-[var(--clr-focus)]/40 px-2.5 py-0.5 text-[10px] font-bold text-[var(--clr-pulse)] whitespace-nowrap">
                  magnum opus
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2 — CHARACTERS
// ─────────────────────────────────────────────────────────────────────────────
function CharactersTab({ author }) {
  if (author.key_characters.length === 0) {
    return (
      <div className="py-10 text-center max-w-sm mx-auto">
        <svg className="h-10 w-10 mx-auto mb-4 text-[var(--clr-ink)] opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
        </svg>
        <p className="text-[14px] text-[var(--clr-ink)] opacity-40 leading-relaxed">
          No named characters — this author's listed works are essays, criticism, or poetry without central characters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {author.key_characters.map((char, i) => (
        <div key={i} className="rounded-xl bg-white/5 border border-white/8 px-5 py-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0 h-10 w-10 rounded-full bg-[var(--clr-recall)] border border-[var(--clr-focus)]/20 flex items-center justify-center text-[11px] font-bold text-[var(--clr-ink)]">
              {char.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[16px] font-bold text-white">{char.name}</p>
              <p className="mt-0.5 text-[12px] text-[var(--clr-ink)] opacity-50">in <span className="italic">{char.work}</span></p>
              {char.archetype && (
                <span className="mt-2 inline-block rounded-lg bg-[var(--clr-focus)]/15 border border-[var(--clr-focus)]/25 px-3 py-1 text-[11px] font-semibold text-[var(--clr-pulse)]">
                  {char.archetype}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 3 — BIOGRAPHY
// ─────────────────────────────────────────────────────────────────────────────
function BiographyTab({ author }) {
  const location = author.bio_context?.location || author.region || null;
  const collaborators = author.bio_context?.collaborators || [];
  const movements = author.bio_context?.movements || [];

  return (
    <div className="space-y-6">
      {/* Location */}
      {location && (
        <div className="flex items-start gap-4 rounded-xl bg-white/5 border border-white/8 px-5 py-4">
          <svg className="shrink-0 h-4 w-4 mt-0.5 text-[var(--clr-pulse)] opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-1">Location</p>
            <p className="text-[15px] font-semibold text-white">{location}</p>
          </div>
        </div>
      )}

      {/* Active Years (period) */}
      {author.period && (
        <div className="flex items-start gap-4 rounded-xl bg-white/5 border border-white/8 px-5 py-4">
          <svg className="shrink-0 h-4 w-4 mt-0.5 text-[var(--clr-pulse)] opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-1">Active Years</p>
            <p className="text-[15px] font-semibold text-white">{author.period}</p>
          </div>
        </div>
      )}

      {/* Collaborators */}
      <div className="rounded-xl bg-white/5 border border-white/8 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-3">Collaborators</p>
        {collaborators.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {collaborators.map((c, i) => (
              <span key={i} className="rounded-full bg-[var(--clr-recall)] border border-[var(--clr-focus)]/20 px-3 py-1.5 text-[12px] font-medium text-[var(--clr-ink)]">
                {c}
              </span>
            ))}
          </div>
        ) : (
          <EmptyNote>no collaborators recorded</EmptyNote>
        )}
      </div>

      {/* Movements */}
      {movements.length > 0 && (
        <div className="rounded-xl bg-white/5 border border-white/8 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-3">Movements</p>
          <div className="flex flex-wrap gap-2">
            {movements.map((m, i) => <Tag key={i} label={m} color="move" />)}
          </div>
        </div>
      )}

      {/* Theory type (criticism authors) */}
      {author.theory_type && (
        <div className="rounded-xl bg-white/5 border border-white/8 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-1">Approach</p>
          <p className="text-[14px] text-[var(--clr-ink)] opacity-80">{author.theory_type}</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 4 — LEGACY
// ─────────────────────────────────────────────────────────────────────────────
function LegacyTab({ author }) {
  const legacy = author.legacy || {};
  const awards = (legacy.awards || []).filter(a => a && a !== "null");
  const translations = legacy.translations;
  const posthumous = legacy.posthumous_notes;

  const hasTranslations = translations && (
    (Array.isArray(translations) && translations.length > 0) ||
    (typeof translations === "string" && translations.trim().length > 0)
  );

  return (
    <div className="space-y-6">
      {/* Awards */}
      <div className="rounded-xl bg-white/5 border border-white/8 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-3">Awards & Recognition</p>
        {awards.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {awards.map((a, i) => (
              <span key={i} className="rounded-full bg-[var(--clr-warn)]/15 border border-[var(--clr-warn)]/30 px-3 py-1 text-[12px] font-semibold text-[var(--clr-warn)]">
                {a}
              </span>
            ))}
          </div>
        ) : (
          <EmptyNote>no awards recorded</EmptyNote>
        )}
      </div>

      {/* Translations */}
      {hasTranslations && (
        <div className="rounded-xl bg-white/5 border border-white/8 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-3">Translations</p>
          {Array.isArray(translations) ? (
            <div className="flex flex-wrap gap-2">
              {translations.map((t, i) => (
                <span key={i} className="rounded-full bg-[#7C92A6]/15 border border-[#7C92A6]/30 px-3 py-1 text-[12px] text-[#aec4d6]">{t}</span>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-[var(--clr-ink)] opacity-75">{translations}</p>
          )}
        </div>
      )}

      {/* Posthumous notes */}
      {posthumous && (
        <div className="rounded-xl bg-[var(--clr-recall)] border-l-4 border-[var(--clr-focus)] px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-pulse)] opacity-70 mb-2">After their time</p>
          <p className="text-[14px] leading-relaxed text-[var(--clr-ink)] opacity-85 italic">{posthumous}</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTHOR HEADER
// ─────────────────────────────────────────────────────────────────────────────
function AuthorHeader({ author, category }) {
  return (
    <div className="mb-6 space-y-3">
      {/* Name */}
      <h2 className="text-[28px] md:text-[34px] font-black text-white leading-tight tracking-tight">
        {author.author}
      </h2>

      {/* Period */}
      {author.period && (
        <p className="text-[14px] font-medium text-[var(--clr-ink)] opacity-50">{author.period}</p>
      )}

      {/* Pills row */}
      <div className="flex flex-wrap gap-2">
        {author.region && <Pill label={author.region} color="default" />}
        {author.literary_period && <Pill label={author.literary_period} color="accent" />}
        {category && <Pill label={category} color="sand" />}
      </div>

      {/* Author link */}
      {author.author_link && (
        <a
          href={author.author_link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--clr-focus)]/40 px-4 py-2 text-[12px] font-semibold text-[var(--clr-pulse)] hover:bg-[var(--clr-focus)]/10 transition-colors"
        >
          View on Britannica
          <svg className="h-3 w-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
        </a>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOTTOM ACTION BAR
// ─────────────────────────────────────────────────────────────────────────────
function BottomBar({ onTestMe, onNextAuthor, onClose }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-white/5 bg-[var(--clr-surface)] px-6 py-4 md:px-10">
      <button
        onClick={onClose}
        className="text-[12px] font-semibold text-[var(--clr-ink)] opacity-40 hover:opacity-70 transition-opacity"
      >
        Back to category
      </button>
      <div className="flex gap-3">
        {onNextAuthor && (
          <motion.button
            whileHover={{ opacity: 0.85 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNextAuthor}
            className="rounded-full bg-white/8 border border-white/12 px-5 py-2.5 text-[12px] font-semibold text-[var(--clr-ink)] transition-opacity"
          >
            Next author →
          </motion.button>
        )}
        <motion.button
          whileHover={{ opacity: 0.9 }}
          whileTap={{ scale: 0.97 }}
          onClick={onTestMe}
          className="rounded-full bg-[var(--clr-focus)] px-6 py-2.5 text-[12px] font-bold text-white shadow-lg shadow-[var(--clr-focus)]/30 transition-opacity"
        >
          Test me on this author
        </motion.button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT: StudyFocusView
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "works",      label: "Works"      },
  { id: "characters", label: "Characters" },
  { id: "biography",  label: "Life & Times"  },
  { id: "legacy",     label: "Legacy"     },
];

export default function StudyFocusView({
  author: rawAuthor,
  category,
  allAuthors,
  selectedWork,
  inferTheme,
  onClose,
  onStartTest,
  onNextAuthor,
}) {
  const author = useMemo(() => sanitiseAuthor(rawAuthor), [rawAuthor]);

  const [activeTab, setActiveTab] = useState(
    selectedWork ? "works" : "works"
  );

  const categoryLabel = typeof category === "string"
    ? category
    : category?.label || category?.id || null;

  // Peer navigation — find author in full dataset
  function handleNavigatePeer(peerAuthor) {
    // Re-open StudyFocusView for the peer by closing and re-triggering
    // The parent controls this; we call onClose then openStudy if peer found
    onClose?.();
  }

  const sidebarContent = (
    <StudySidebar
      author={author}
      allAuthors={allAuthors}
      onNavigatePeer={handleNavigatePeer}
    />
  );

  const mainContent = (
    <div className="pb-4">
      <AuthorHeader author={author} category={categoryLabel} />

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {activeTab === "works"      && <WorksTab      author={author} />}
          {activeTab === "characters" && <CharactersTab author={author} />}
          {activeTab === "biography"  && <BiographyTab  author={author} />}
          {activeTab === "legacy"     && <LegacyTab     author={author} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="relative flex h-[min(94vh,920px)] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-[var(--clr-surface)] border border-white/6 shadow-2xl pointer-events-auto"
        >
          {/* Header with tabs */}
          <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-0 md:px-10 shrink-0">
            <div
              className="flex gap-1 bg-white/5 rounded-full p-1 border border-white/8"
            >
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-2 text-[12px] font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-[var(--clr-focus)] text-white shadow-md"
                      : "text-[var(--clr-ink)] opacity-50 hover:opacity-80"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-[var(--clr-ink)] opacity-60 hover:opacity-100 transition"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable content area — two columns on lg */}
          <div className="scrollbar-thin flex-1 overflow-y-auto px-6 py-6 md:px-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
              {/* Main */}
              <div className="min-w-0">{mainContent}</div>
              {/* Sidebar */}
              <aside className="hidden lg:block">{sidebarContent}</aside>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="shrink-0">
            <BottomBar
              onTestMe={() => onStartTest?.(rawAuthor)}
              onNextAuthor={onNextAuthor}
              onClose={onClose}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
