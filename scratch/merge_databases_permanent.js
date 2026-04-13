const fs = require('fs');

const dataRaw = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));
const enrichedRaw = JSON.parse(fs.readFileSync('./data/enriched_data.json', 'utf8'));

const normalizeName = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "").trim();

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

// Flat map of all enriched authors for fast lookup
const enrichedMap = new Map();
Object.values(enrichedRaw).forEach(authors => {
    authors.forEach(a => {
        enrichedMap.set(normalizeName(a.author), a);
    });
});

const mergedData = {};

Object.keys(dataRaw).forEach(category => {
    mergedData[category] = dataRaw[category].map(author => {
        const enriched = enrichedMap.get(normalizeName(author.author));
        
        // Preparation
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

        const curriculumWorks = (enriched.works || []).map(normalizeWork);
        const finalWorksMap = new Map();
        baseWorks.forEach(w => finalWorksMap.set(normalizeName(w.title), { ...w }));
        curriculumWorks.forEach(cw => {
            const key = normalizeName(cw.title);
            if (finalWorksMap.has(key)) {
                const existing = finalWorksMap.get(key);
                finalWorksMap.set(key, { ...existing, ...cw, award: existing.award || cw.award || "", award_year: existing.award_year || cw.award_year || "" });
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
    });
});

fs.writeFileSync('./data/data.json', JSON.stringify(mergedData, null, 2), 'utf8');
console.log("Database merged successfully into data.json.");
