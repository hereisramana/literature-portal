import britishPoetry from "../data/enriched/british-poetry.json";
import britishDrama from "../data/enriched/british-drama.json";
import britishProseFiction from "../data/enriched/british-prose-fiction.json";
import american from "../data/enriched/american.json";
import indian from "../data/enriched/indian.json";
import african from "../data/enriched/african.json";
import otherRegions from "../data/enriched/other-regions.json";
import women from "../data/enriched/women.json";
import dalit from "../data/enriched/dalit.json";
import cultural from "../data/enriched/cultural.json";
import comparative from "../data/enriched/comparative.json";
import criticism from "../data/enriched/criticism.json";

const categoryMap = {
  "british-poetry": britishPoetry,
  "british-drama": britishDrama,
  "british-prose-fiction": britishProseFiction,
  american,
  indian,
  african,
  "other-regions": otherRegions,
  women,
  dalit,
  cultural,
  comparative,
  criticism,
};

function normalizeWork(work) {
  if (typeof work === "string") {
    return { title: work, year: "", type: "" };
  }

  return {
    title: work.title || "",
    year: work.year || "",
    type: work.type || "",
  };
}

export function getEnrichedCategory(categoryId) {
  return categoryMap[categoryId] || { authors: [] };
}

export function getEnrichedAuthor(categoryId, authorName) {
  const category = getEnrichedCategory(categoryId);
  return category.authors?.find((entry) => entry.author === authorName) || null;
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
