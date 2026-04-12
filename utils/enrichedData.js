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
      theory_depth: null 
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

export function mergeAuthorWithEnriched(author, categoryId) {
  const enriched = getEnrichedAuthor(categoryId, author.author);

  if (!enriched) {
    return {
      ...author,
      works: (author.works || []).map(normalizeWork),
      movements: [],
      genreTags: [],
      nodes: [],
    };
  }

  return {
    ...author,
    ...enriched,
    works: (enriched.works || author.works || []).map(normalizeWork),
    movements: enriched.movements || [],
    genreTags: enriched.genreTags || [],
    nodes: enriched.nodes || [],
  };
}

export function getWorkTitles(author) {
  return (author.works || []).map((work) =>
    typeof work === "string" ? work : work.title
  );
}
