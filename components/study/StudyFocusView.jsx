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

  // Data Enrichment: Extract titles from posthumous_notes (e.g. "Father of English literature")
  if (a.legacy.titles.length === 0 && a.legacy.posthumous_notes) {
    const titleMatch = a.legacy.posthumous_notes.match(/(?:established as the|known as|titled as) (.*)/i);
    if (titleMatch && titleMatch[1]) {
      a.legacy.titles = [titleMatch[1].replace(/\.$/, "")];
    } else if (a.legacy.posthumous_notes.toLowerCase().includes("father of")) {
       const parts = a.legacy.posthumous_notes.split(/[.,]/);
       const fatherPart = parts.find(p => p.toLowerCase().includes("father of"));
       if (fatherPart) a.legacy.titles = [fatherPart.trim()];
    }
  }

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
  if (!a.bio_note) a.bio_note = "";
  if (!a.historical_context) a.historical_context = "";
  if (!a.core_arguments) a.core_arguments = [];
  if (!a.exam_significance) a.exam_significance = [];
  if (!a.critical_lens_notes) a.critical_lens_notes = [];
  if (!a.key_terms) a.key_terms = [];

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
function AuthorTab({ author, category, allAuthors, onNavigateAuthor }) {
  const location = author.bio_context?.location || author.region || null;
  const legacy = author.legacy || {};
  const awards = (legacy.awards || []).filter(a => a && a !== "null");
  const translations = legacy.translations;

  return (
    <div className="space-y-8 pb-8">
      {/* Honors & Titles Section - MOVED UP FOR PROMINENCE */}
      {author.legacy.titles?.length > 0 && (
        <div className="rounded-2xl bg-[var(--clr-pulse)]/10 border border-[var(--clr-pulse)]/20 p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--clr-pulse)] mb-3">Key Honors & Epithets</p>
          <div className="flex flex-wrap gap-2">
            {author.legacy.titles.map((t, i) => (
              <span key={i} className="rounded-full bg-[var(--clr-pulse)] text-white px-3 py-1 text-[12px] font-bold shadow-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

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

      {(author.bio_note || author.historical_context || author.core_arguments.length > 0 || author.exam_significance.length > 0 || author.critical_lens_notes.length > 0 || author.key_terms.length > 0) && (
        <div className="space-y-4">
          <SectionLabel>Academic Notes</SectionLabel>
          {author.bio_note && (
            <div className="rounded-2xl bg-[var(--clr-ink)]/[0.04] border border-[var(--clr-ink)]/10 p-5">
              <p className="text-[13px] leading-relaxed text-[var(--clr-ink)] opacity-80">{author.bio_note}</p>
            </div>
          )}
          {author.historical_context && (
            <div className="rounded-2xl bg-[var(--clr-ink)]/[0.04] border border-[var(--clr-ink)]/10 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-2">Historical Context</p>
              <p className="text-[13px] leading-relaxed text-[var(--clr-ink)] opacity-80">{author.historical_context}</p>
            </div>
          )}
          {author.core_arguments.length > 0 && (
            <div className="rounded-2xl bg-[var(--clr-ink)]/[0.04] border border-[var(--clr-ink)]/10 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-2">Core Arguments</p>
              <ul className="list-disc pl-5 text-[13px] leading-relaxed text-[var(--clr-ink)] opacity-80 space-y-1">
                {author.core_arguments.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
          )}
          {author.exam_significance.length > 0 && (
            <div className="rounded-2xl bg-[var(--clr-ink)]/[0.04] border border-[var(--clr-ink)]/10 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-2">Exam Significance</p>
              <ul className="list-disc pl-5 text-[13px] leading-relaxed text-[var(--clr-ink)] opacity-80 space-y-1">
                {author.exam_significance.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
          )}
          {author.critical_lens_notes.length > 0 && (
            <div className="rounded-2xl bg-[var(--clr-ink)]/[0.04] border border-[var(--clr-ink)]/10 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-ink)] opacity-35 mb-2">Critical Lens</p>
              <ul className="list-disc pl-5 text-[13px] leading-relaxed text-[var(--clr-ink)] opacity-80 space-y-1">
                {author.critical_lens_notes.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
          )}
          {author.key_terms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {author.key_terms.map((item, idx) => <Tag key={idx} label={item} color="tag" />)}
            </div>
          )}
        </div>
      )}

      {/* Collaborators - NOW CLICKABLE */}
      {author.bio_context.collaborators?.length > 0 && (
        <div className="space-y-4">
          <SectionLabel>Notable Contemporaries</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {author.bio_context.collaborators.map((c, i) => {
              const matched = allAuthors?.find(a => a.author.toLowerCase() === c.toLowerCase());
              return (
                <button
                  key={i}
                  onClick={() => matched && onNavigateAuthor?.(matched)}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                    matched 
                      ? "bg-[var(--clr-pulse)]/10 text-[var(--clr-pulse)] border border-[var(--clr-pulse)]/30 hover:bg-[var(--clr-pulse)] hover:text-white" 
                      : "bg-[#7C92A6]/10 text-[#7C92A6] border border-[#7C92A6]/20 cursor-default"
                  }`}
                >
                  {c}
                  {matched && <svg className="ml-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                </button>
              );
            })}
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
        <SectionLabel>Legacy & Impact</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
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
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clr-pulse)] opacity-50 mb-2">Historical Evaluation</p>
            <p className="text-[14px] italic leading-relaxed text-[var(--clr-ink)] opacity-85">{author.legacy.posthumous_notes}</p>
          </div>
        )}
      </div>

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
            <div className="px-8 pb-8 pt-4 space-y-9 border-t border-[var(--clr-ink)]/5">
              {/* Internal Work Themes */}
              <div>
                 <p className="mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--clr-pulse)] opacity-60">Thematic Focus & Nature</p>
                 { (work.themes?.length > 0 || author.themes?.length > 0) ? (
                   <div className="flex flex-wrap gap-2.5">
                      {(work.themes || author.themes).map((t, i) => (
                        <span key={i} className="text-[12px] border border-[var(--clr-focus)]/15 bg-[var(--clr-focus)]/[0.03] px-3 py-1.5 rounded-xl text-[var(--clr-ink)] opacity-85 font-medium">
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
                   <p className="mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--clr-pulse)] opacity-60">Key Characters & Archetypes</p>
                   <div className="grid gap-4 sm:grid-cols-2">
                      {characters.map((char, i) => (
                        <div key={i} className="flex items-center gap-4 bg-[var(--clr-ink)]/[0.04] rounded-2xl p-4 border border-[var(--clr-ink)]/8">
                          <div className="h-9 w-9 rounded-full bg-[var(--clr-focus)]/20 flex items-center justify-center text-[11px] font-bold text-[var(--clr-pulse)] shadow-inner">
                            {char.name[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[14px] font-bold text-[var(--color-text-strong)] leading-tight truncate">{char.name}</p>
                            <p className="mt-1 text-[11px] font-medium text-[var(--text-muted-color)] opacity-80">{char.archetype}</p>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Quotes & Iconic Lines */}
              {(work.quotes?.length > 0 || work.iconic_lines?.length > 0) ? (
                <div>
                   <p className="mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--clr-pulse)] opacity-60">Iconic Lines</p>
                   <div className="space-y-4">
                      {(work.quotes || work.iconic_lines).map((q, i) => (
                        <div key={i} className="relative pl-7 py-2">
                          <div className="absolute left-0 top-0 h-full w-[4px] bg-[var(--clr-focus)]/20 rounded-full" />
                          <p className="text-[15px] leading-relaxed text-[var(--clr-ink)] opacity-85 italic font-serif">"{q}"</p>
                        </div>
                      ))}
                   </div>
                </div>
              ) : (
                <div className="opacity-80 border-t border-[var(--color-border-subtle)] pt-6">
                   <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-[var(--clr-pulse)]">Curating Excerpts</p>
                   <p className="text-[12px] italic opacity-60">Iconic quotes and textual analysis are being prepared for this work.</p>
                </div>
              )}

              {(work.summary || work.critical_notes?.length > 0) && (
                <div className="bg-[var(--clr-ink)]/[0.04] rounded-3xl p-6 border border-[var(--clr-ink)]/10">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--clr-pulse)]">Mastery Notes</p>
                  {work.summary && (
                    <p className="text-[14px] leading-relaxed text-[var(--clr-ink)] opacity-85 mb-3">{work.summary}</p>
                  )}
                  {work.critical_notes?.length > 0 && (
                    <ul className="list-disc pl-6 text-[14px] leading-relaxed text-[var(--clr-ink)] opacity-85 space-y-2">
                      {work.critical_notes.map((n, idx) => <li key={idx}>{n}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </div>

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
  { id: "author", label: "Profile" },
  { id: "works",  label: "Works"    },
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
      headerMeta={author.author_link ? (
        <a
          href={author.author_link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-[12px] font-semibold text-[var(--clr-pulse)] hover:opacity-85 transition-opacity"
        >
          Britannica
          <svg className="h-3 w-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
        </a>
      ) : null}
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
              <AuthorTab 
                author={author} 
                category={categoryLabel} 
                allAuthors={allAuthors} 
                onNavigateAuthor={(peer) => {
                  onClose();
                  // Parent handles navigation
                }}
              />
            ) : (
              <WorksTab author={author} />
            )}
          </motion.div>
        </AnimatePresence>
      }
    />
  );
}
