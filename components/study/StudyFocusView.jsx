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
  if (a.legacy.titles === null || !a.legacy.titles) a.legacy.titles = [];
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
  if (!a.theory_type) a.theory_type = null;

  return a;
}

// ─────────────────────────────────────────────────────────────────────────────
// SMALL ATOMS
// ─────────────────────────────────────────────────────────────────────────────
function Pill({ label, color = "default" }) {
  const colors = {
    default:    "bg-[var(--color-interaction-hover)] text-[var(--text-body-color)] border border-[var(--color-border-subtle)]",
    accent:     "bg-[var(--clr-focus)]/20 text-[var(--clr-pulse)] border border-[var(--clr-focus)]/30",
    green:      "bg-[var(--clr-correct)]/15 text-[var(--clr-correct)] border border-[var(--clr-correct)]/30",
    sand:       "bg-[var(--clr-recall)]/60 text-[var(--text-body-color)] border border-[var(--color-border-subtle)]",
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
// TAB 1 — AUTHOR (Merged Profile, Styles, Legacy)
// ─────────────────────────────────────────────────────────────────────────────
function AuthorTab({ author, category }) {
  const location = author.bio_context?.location || author.region || null;
  const legacy = author.legacy || {};
  const awards = (legacy.awards || []).filter(a => a && a !== "null");
  const translations = legacy.translations;

  return (
    <div className="space-y-8 pb-8">
      {/* Quick Profile */}
      <div className="grid gap-4 sm:grid-cols-2">
        {location && (
          <div className="flex items-center gap-4 rounded-2xl bg-[var(--clr-ink)]/[0.04] border border-[var(--clr-ink)]/10 px-6 py-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--clr-pulse)]/10 text-[var(--clr-pulse)]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-0.5">Origin</p>
              <p className="text-[15px] font-semibold text-[var(--color-text-strong)] truncate">{location}</p>
            </div>
          </div>
        )}
        {author.period && (
          <div className="flex items-center gap-4 rounded-2xl bg-[var(--clr-ink)]/[0.04] border border-[var(--clr-ink)]/10 px-6 py-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--clr-pulse)]/10 text-[var(--clr-pulse)]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-0.5">Active Period</p>
              <p className="text-[15px] font-semibold text-[var(--color-text-strong)] truncate">{author.period}</p>
            </div>
          </div>
        )}
      </div>

      {/* Signature & Movements */}
      <div className="space-y-4">
        <SectionLabel>Signature Styles & Context</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {author.theory_type && <Tag label={author.theory_type} color="theme" />}
          {author.bio_context.movements?.map((m, i) => <Tag key={i} label={m} color="move" />)}
          {author.style_innovations.map((s, i) => <Tag key={i} label={s} color="style" />)}
          {author.literary_period && <Tag label={author.literary_period} color="theme" />}
        </div>
      </div>

      {/* Collaborators */}
      {author.bio_context.collaborators?.length > 0 && (
        <div className="space-y-4">
          <SectionLabel>Notable Contemporaries</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {author.bio_context.collaborators.map((c, i) => (
              <Pill key={i} label={c} color="blue" />
            ))}
          </div>
        </div>
      )}

      {/* Global Themes */}
      <div className="space-y-4">
        <SectionLabel>Core Intellectual Themes</SectionLabel>
        {author.themes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {author.themes.map((t, i) => <Tag key={i} label={t} color="theme" />)}
          </div>
        ) : (
          <EmptyNote>No central themes recorded yet.</EmptyNote>
        )}
      </div>

      {/* Recognition & Impact */}
      <div className="space-y-4">
        <SectionLabel>Legacy & Recognition</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
           {/* Honors & Titles Section */}
           {author.legacy.titles?.length > 0 && (
             <div className="rounded-2xl bg-[var(--clr-ink)]/[0.04] border border-[var(--clr-ink)]/10 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-3">Honors & Titles</p>
                <div className="flex flex-wrap gap-2">
                  {author.legacy.titles.map((t, i) => <Pill key={i} label={t} color="blue" />)}
                </div>
             </div>
           )}
           <div className="rounded-2xl bg-[var(--clr-ink)]/[0.04] border border-[var(--clr-ink)]/10 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-3">Awards</p>
              {awards.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {awards.map((a, i) => <Pill key={i} label={a} color="warn" />)}
                </div>
              ) : <EmptyNote>No awards listed</EmptyNote>}
           </div>
           <div className="rounded-2xl bg-[var(--clr-ink)]/[0.04] border border-[var(--clr-ink)]/10 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-3">Global Reach</p>
              <p className="text-[13px] text-[var(--clr-ink)] opacity-70 leading-relaxed">
                {translations || "Information on translations coming soon."}
              </p>
           </div>
        </div>
        {author.legacy?.posthumous_notes && (
          <div className="rounded-2xl bg-[var(--clr-recall)]/20 border border-[var(--clr-focus)]/20 p-5 mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-pulse)] opacity-50 mb-2">Historical Context</p>
            <p className="text-[14px] italic leading-relaxed text-[var(--clr-ink)] opacity-85">{author.legacy.posthumous_notes}</p>
          </div>
        )}
      </div>

      {author.author_link && (
        <div className="pt-4">
          <a
            href={author.author_link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--clr-focus)]/40 px-6 py-3 text-[12px] font-bold text-[var(--clr-pulse)] hover:bg-[var(--clr-focus)]/10 transition-colors"
          >
            Deep Dive on Britannica
            <svg className="h-3 w-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2 — WORKS (Expandable Pills)
// ─────────────────────────────────────────────────────────────────────────────
function WorkExpandablePill({ work, author, isOpen, onToggle }) {
  const title = typeof work === "string" ? work : work.title;
  const year = typeof work === "object" ? work.year : null;
  const genre = typeof work === "object" ? (work.genre || work.type) : null;
  const isMagnum = author.magnum_opus && title === author.magnum_opus;
  
  const characters = author.key_characters.filter(c => c.work === title);

  return (
    <div className={`overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen ? 'bg-[var(--clr-ink)]/[0.06] border-[var(--clr-ink)]/20' : 'bg-[var(--clr-ink)]/[0.03] border-[var(--clr-ink)]/10 hover:border-[var(--clr-ink)]/15'}`}>
      <button 
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={`h-2 w-2 rounded-full shrink-0 ${isOpen ? 'bg-[var(--clr-pulse)]' : 'bg-[var(--clr-ink)]/20'}`} />
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h3 className={`text-[16px] font-bold leading-none text-[var(--color-text-strong)] transition-colors ${isOpen ? 'text-[var(--clr-pulse)]' : ''}`}>
                {title}
              </h3>
              {isMagnum && <span className="text-[9px] font-black uppercase tracking-wider text-[var(--clr-pulse)] bg-[var(--clr-focus)]/20 px-2 py-0.5 rounded">Magnum Opus</span>}
            </div>
            <div className="mt-2 flex items-center gap-3 opacity-40">
              {year && <span className="text-[11px] font-bold">{year}</span>}
              {year && genre && <span className="h-1 w-1 rounded-full bg-[var(--clr-ink)]/40" />}
              {genre && <span className="text-[11px] font-medium">{genre}</span>}
            </div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="shrink-0 text-[var(--clr-ink)] opacity-30"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="px-6 pb-6 pt-2 space-y-7 border-t border-[var(--clr-ink)]/5">
              {/* Internal Work Themes */}
              <div>
                 <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--clr-pulse)] opacity-60">Thematic Focus</p>
                 { (work.themes?.length > 0 || author.themes?.length > 0) ? (
                   <div className="flex flex-wrap gap-2">
                      {(work.themes || author.themes).map((t, i) => (
                        <span key={i} className="text-[11px] border border-[var(--clr-ink)]/10 bg-[var(--clr-ink)]/[0.04] px-2.5 py-1 rounded-lg text-[var(--clr-ink)] opacity-70 italic">
                          {t}
                        </span>
                      ))}
                   </div>
                 ) : (
                   <EmptyNote>No specific themes recorded yet.</EmptyNote>
                 )}
              </div>

              {/* Characters */}
              {characters.length > 0 && (
                <div>
                   <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--clr-pulse)] opacity-60">Key Characters</p>
                   <div className="grid gap-3 sm:grid-cols-2">
                      {characters.map((char, i) => (
                        <div key={i} className="flex items-center gap-3 bg-[var(--clr-ink)]/[0.04] rounded-xl p-3 border border-[var(--clr-ink)]/8">
                          <div className="h-7 w-7 rounded-full bg-[var(--clr-focus)]/20 flex items-center justify-center text-[10px] font-bold text-[var(--clr-pulse)]">
                            {char.name[0]}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-[var(--color-text-strong)] leading-tight">{char.name}</p>
                            <p className="text-[11px] text-[var(--text-muted-color)]">{char.archetype}</p>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Quotes & Iconic Lines */}
              {(work.quotes?.length > 0 || work.iconic_lines?.length > 0) ? (
                <div>
                   <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--clr-pulse)] opacity-60">Memorable Lines</p>
                   <div className="space-y-3">
                      {(work.quotes || work.iconic_lines).map((q, i) => (
                        <div key={i} className="relative pl-6 py-1">
                          <div className="absolute left-0 top-0 h-full w-[3px] bg-[var(--clr-focus)]/30 rounded-full" />
                          <p className="text-[14px] leading-relaxed text-[var(--clr-ink)] opacity-80 italic">"{q}"</p>
                        </div>
                      ))}
                   </div>
                </div>
              ) : (
                <div className="opacity-80 border-t border-[var(--color-border-subtle)] pt-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-1">Coming Soon</p>
                  <p className="text-[11px] italic">Iconic quotes and textual excerpts are being curated for this work.</p>
                </div>
              )}

              {/* Theoretical Depth */}
              {work.theory_depth && (
                <div className="bg-[var(--clr-focus)]/5 rounded-2xl p-5 border border-[var(--clr-focus)]/10">
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--clr-pulse)]">Theoretical Context</p>
                  <p className="text-[13px] leading-relaxed text-[var(--clr-ink)] opacity-70">
                    {work.theory_depth}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WorksTab({ author }) {
  const [openId, setOpenId] = useState(null);
  
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
    <div className="space-y-4 pb-12">
      {sorted.map((work, i) => (
        <WorkExpandablePill 
          key={i} 
          work={work} 
          author={author} 
          isOpen={openId === i} 
          onToggle={() => setOpenId(openId === i ? null : i)}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SIDEBAR CONTENT (now just Peer Navi)
// ─────────────────────────────────────────────────────────────────────────────
function StudySidebar({ author, allAuthors, onNavigatePeer }) {
  const peers = author.comparison_peers || [];
  if (peers.length === 0) return null;

  return (
    <div className="space-y-6">
      <SectionLabel>Compare & Context</SectionLabel>
      <div className="space-y-3">
        {peers.map((peer, i) => {
          const peerAuthor = allAuthors?.find(a => a.author === peer.name);
          return (
            <motion.button
              key={i}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => peerAuthor && onNavigatePeer?.(peerAuthor)}
              className={`w-full text-left p-4 rounded-2xl bg-[var(--color-interaction-hover)] border border-[var(--color-border-subtle)] transition-all ${peerAuthor ? 'cursor-pointer hover:bg-[var(--color-interaction-active)] hover:border-[var(--color-border-strong)]' : 'cursor-default'}`}
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0 h-10 w-10 rounded-full bg-[var(--clr-recall)] flex items-center justify-center text-[11px] font-black text-[var(--clr-ink)] uppercase">
                  {peer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-[var(--color-text-strong)] truncate">{peer.name}</p>
                  <p className="text-[11px] text-[var(--text-muted-color)] truncate leading-tight mt-0.5">{peer.shared_theme}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT: StudyFocusView
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "author", label: "Author Profile" },
  { id: "works",  label: "Works & Canon"  },
];

export default function StudyFocusView({
  author: rawAuthor,
  category,
  allAuthors,
  selectedWork,
  onClose,
  onStartTest,
  onNextAuthor,
}) {
  const author = useMemo(() => sanitiseAuthor(rawAuthor), [rawAuthor]);
  const [activeTab, setActiveTab] = useState("author");

  const categoryLabel = typeof category === "string"
    ? category
    : category?.label || category?.id || null;

  return (
    <AuthorFocusShell
      title={author.author}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onClose={onClose}
      sidebar={
        <StudySidebar 
          author={author} 
          allAuthors={allAuthors} 
          onNavigatePeer={() => onClose()} // Parent handles peer nav
        />
      }
      main={
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "author" ? (
              <AuthorTab author={author} category={categoryLabel} />
            ) : (
              <WorksTab author={author} />
            )}
          </motion.div>
        </AnimatePresence>
      }
    />
  );
}
