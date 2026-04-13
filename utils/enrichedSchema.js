export const ENRICHED_LAYERS = [
  "factual",
  "textual",
  "critical",
  "comparative",
];

export const ENRICHED_DIFFICULTIES = [1, 2, 3];

export const WORK_TYPES = [
  "poem",
  "play",
  "novel",
  "essay",
  "prose",
  "criticism",
  "short story",
  "autobiography",
  "treatise",
  "anthology",
  "speech",
];

export const NODE_SUBTYPES = [
  "publication",
  "period",
  "movement",
  "genre",
  "plot",
  "character",
  "theme",
  "setting",
  "speaker",
  "symbolism",
  "style",
  "tone",
  "idea",
  "form",
  "same-author",
  "contemporary",
  "movement-comparison",
  "cross-genre",
];

export function createEmptyNode() {
  return {
    id: "",
    layer: "factual",
    subType: "",
    prompt: "",
    answer: "",
    mcqOptions: ["", "", "", ""],
    explanation: "",
    tags: [],
    difficulty: 1,
  };
}

export function createEmptyAuthorShell(author) {
  return {
    author: author.author,
    region: author.region || "",
    literary_period: author.literary_period || "",
    movements: [],
    genreTags: [],
    works: (author.works || []).map((title) => ({
      title,
      year: "",
      type: "",
      summary: "",
      critical_notes: [],
    })),
    bio_note: "",
    historical_context: "",
    core_arguments: [],
    exam_significance: [],
    critical_lens_notes: [],
    key_terms: [],
    nodes: [],
  };
}

export function validateNode(node) {
  return (
    typeof node?.id === "string" &&
    ENRICHED_LAYERS.includes(node.layer) &&
    typeof node.subType === "string" &&
    typeof node.prompt === "string" &&
    typeof node.answer === "string" &&
    Array.isArray(node.mcqOptions) &&
    node.mcqOptions.length === 4 &&
    typeof node.explanation === "string" &&
    Array.isArray(node.tags) &&
    ENRICHED_DIFFICULTIES.includes(node.difficulty)
  );
}

export function validateAuthorEntry(entry) {
  return (
    typeof entry?.author === "string" &&
    Array.isArray(entry.works) &&
    typeof (entry.bio_note || "") === "string" &&
    typeof (entry.historical_context || "") === "string" &&
    Array.isArray(entry.core_arguments || []) &&
    Array.isArray(entry.exam_significance || []) &&
    Array.isArray(entry.critical_lens_notes || []) &&
    Array.isArray(entry.key_terms || []) &&
    Array.isArray(entry.nodes) &&
    entry.nodes.every(validateNode)
  );
}
