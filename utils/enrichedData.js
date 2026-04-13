import enrichedMaster from "../data/enriched_data.json";

// The master file matches categories to arrays of authors
const categoryMap = enrichedMaster;

function normalizeWork(work) {
  if (typeof work === "string") {
    return { 
      title: work, 
      year: "", 
      type: "", 
      themes: [], 
      quotes: [], 
      iconic_lines: [], 
      theory_depth: null,
      summary: "",
      critical_notes: []
    };
  }

  return {
    title: work.title || "",
    year: work.year || "",
    type: work.type || "",
    themes: work.themes || [],
    quotes: work.quotes || [],
    iconic_lines: work.iconic_lines || [],
    theory_depth: work.theory_depth || null,
    award: work.award || "",
    award_year: work.award_year || "",
    summary: work.summary || "",
    critical_notes: work.critical_notes || [],
  };
}

export function getEnrichedAuthor(categoryId, authorName) {
  // Search across all categories in the master file to handle mapping mismatches
  for (const cat in categoryMap) {
    const author = categoryMap[cat].find((entry) => entry.author === authorName);
    if (author) return author;
  }
  return null;
}

const normalizeName = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "").trim();

export function mergeAuthorWithEnriched(author, categoryId) {
  const enriched = getEnrichedAuthor(categoryId, author.author);

  // 1. Prepare Base Works from Primary DB (contains awards)
  const baseWorks = (author.works || []).map(normalizeWork);
  
  if (!enriched) {
    return {
      ...author,
      works: baseWorks,
      movements: [],
      genreTags: [],
      nodes: [],
      bio_note: "",
      historical_context: "",
      core_arguments: [],
      exam_significance: [],
      critical_lens_notes: [],
      key_terms: [],
    };
  }

  // 2. Prepare Enriched Works from Curriculum DB (contains study notes)
  const curriculumWorks = (enriched.works || []).map(normalizeWork);

  // 3. Smart Merge Works by Title
  const finalWorksMap = new Map();

  // Load base works first (Source of Truth for Awards)
  baseWorks.forEach(w => finalWorksMap.set(normalizeName(w.title), { ...w }));

  // Overlay curriculum data (Source of Truth for Themes/Quotes)
  curriculumWorks.forEach(cw => {
    const key = normalizeName(cw.title);
    if (finalWorksMap.has(key)) {
      const existing = finalWorksMap.get(key);
      finalWorksMap.set(key, {
        ...existing,
        ...cw,
        // CRITICAL: Preserve awards from primary DB if curriculum misses them
        award: existing.award || cw.award || "",
        award_year: existing.award_year || cw.award_year || "",
      });
    } else {
      finalWorksMap.set(key, cw);
    }
  });

  return {
    ...author,
    ...enriched,
    legacy: {
      ...(author.legacy || {}),
      ...(enriched.legacy || {}),
      awards: (enriched.legacy?.awards?.length > 0) ? enriched.legacy.awards : (author.legacy?.awards || []),
      titles: (enriched.legacy?.titles?.length > 0) ? enriched.legacy.titles : (author.legacy?.titles || []),
    },
    works: Array.from(finalWorksMap.values()),
    movements: enriched.movements || [],
    genreTags: enriched.genreTags || [],
    nodes: enriched.nodes || [],
    bio_note: enriched.bio_note || "",
    historical_context: enriched.historical_context || "",
    core_arguments: enriched.core_arguments || [],
    exam_significance: enriched.exam_significance || [],
    critical_lens_notes: enriched.critical_lens_notes || [],
    key_terms: enriched.key_terms || [],
  };
}

export function getWorkTitles(author) {
  return (author.works || []).map((work) =>
    typeof work === "string" ? work : work.title
  );
}
