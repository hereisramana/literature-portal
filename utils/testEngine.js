import { shuffle } from "./shuffle.js";
import { getWorkTitles } from "./enrichedData.js";

function titleCase(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function pickDistinct(items, count, skip = []) {
  const banned = new Set(skip);
  return shuffle(items.filter((item) => !banned.has(item))).slice(0, count);
}

export function inferTheme(work, author, category) {
  const text = `${work} ${author.literary_period || ""} ${category.label}`.toLowerCase();

  if (/(love|daughter|heart|bride|wife|morrow|valediction)/.test(text)) {
    return "Love and intimacy";
  }
  if (/(death|funeral|grave|war|punishment|dark|waste|barbarian)/.test(text)) {
    return "Mortality and conflict";
  }
  if (/(wind|bird|fox|jaguar|nature|autumn|nightingale|skylark|potato)/.test(text)) {
    return "Nature and imagination";
  }
  if (/(history|tradition|culture|language|mind|identity|tongue|colony)/.test(text)) {
    return "Identity and cultural memory";
  }
  if (/(hamlet|godot|faustus|playboy|duchess|tempest|party)/.test(text)) {
    return "Power, performance, and conflict";
  }

  const period = (author.literary_period || "").toLowerCase();
  if (period.includes("modern")) {
    return "Fragmentation and modern anxiety";
  }
  if (period.includes("romantic")) {
    return "Emotion and imagination";
  }
  if (period.includes("victorian")) {
    return "Society, morality, and change";
  }
  if (category.id.includes("criticism")) {
    return "Interpretation and literary method";
  }

  return `Key concerns in ${category.label}`;
}

function inferTypeLens(category) {
  if (category.id.includes("poetry")) {
    return "Lyrical voice";
  }
  if (category.id.includes("drama")) {
    return "Stage conflict";
  }
  if (category.id.includes("prose")) {
    return "Narrative perspective";
  }
  if (category.id.includes("criticism")) {
    return "Critical argument";
  }
  if (category.id.includes("comparative")) {
    return "Cross-text dialogue";
  }
  return "Contextual reading";
}

function buildThemePool(allAuthors, category) {
  return [...new Set(
    allAuthors
      .flatMap((entry) =>
        getWorkTitles(entry).map((work) => inferTheme(work, entry, category))
      )
      .filter(Boolean)
  )];
}

function getRelatedAuthors(author, allAuthors) {
  return allAuthors
    .filter((entry) => entry.author !== author.author)
    .filter((entry) => {
      const samePeriod =
        entry.literary_period &&
        entry.literary_period === author.literary_period;
      const sameRegion = entry.region && entry.region === author.region;
      return samePeriod || sameRegion;
    })
    .slice(0, 6);
}

function createFallbackNodes(author, category, allAuthors, relatedAuthors) {
  const works = getWorkTitles(author);
  const allWorks = allAuthors.flatMap((entry) => getWorkTitles(entry));
  const relatedWorks = relatedAuthors.flatMap((entry) => getWorkTitles(entry));
  const workSample = works.slice(0, Math.min(works.length, 4));
  const typeLens = inferTypeLens(category);
  const themePool = buildThemePool(allAuthors, category);

  const nodes = [];

  if (works[0]) {
    const options = shuffle([
      works[0],
      ...pickDistinct(relatedWorks.length ? relatedWorks : allWorks, 3, works),
    ]).slice(0, 4);

    nodes.push({
      id: `${author.author}-work-1`,
      layer: "factual",
      subType: "genre",
      prompt: `Which work belongs to ${author.author}?`,
      answer: works[0],
      mcqOptions: options,
      explanation: `${works[0]} is listed in the syllabus under ${author.author}.`,
      tags: [author.author, author.literary_period || "", category.label],
      difficulty: 1,
    });
  }

  if (author.literary_period) {
    const periodOptions = shuffle([
      author.literary_period,
      ...pickDistinct(
        relatedAuthors.map((entry) => entry.literary_period).filter(Boolean),
        3,
        [author.literary_period]
      ),
    ]).slice(0, 4);

    nodes.push({
      id: `${author.author}-period`,
      layer: "factual",
      subType: "period",
      prompt: `Which literary period is most closely associated with ${author.author}?`,
      answer: author.literary_period,
      mcqOptions: periodOptions,
      explanation: `${author.author} is grouped under ${author.literary_period}.`,
      tags: [author.author, author.literary_period, category.label],
      difficulty: 1,
    });
  }

  if (workSample[0]) {
    const answer = inferTheme(workSample[0], author, category);
    const options = shuffle([
      answer,
      ...pickDistinct(themePool, 3, [answer]),
    ]).slice(0, 4);

    nodes.push({
      id: `${author.author}-theme-1`,
      layer: "textual",
      subType: "theme",
      prompt: `Which theme best fits ${workSample[0]}?`,
      answer,
      mcqOptions: options,
      explanation: `${workSample[0]} is studied through the theme of ${answer.toLowerCase()}.`,
      tags: [author.author, author.literary_period || "", category.label],
      difficulty: 2,
    });
  }

  nodes.push({
    id: `${author.author}-lens`,
    layer: "critical",
    subType: "idea",
    prompt: `Which reading lens is strongest for studying ${author.author} in this category?`,
    answer: typeLens,
    mcqOptions: shuffle([
      typeLens,
      "Character constellation",
      "Symbolic pattern",
      "Historical frame",
    ]),
    explanation: `${typeLens} best matches the current category framing.`,
    tags: [author.author, author.literary_period || "", category.label],
    difficulty: 2,
  });

  if (relatedAuthors[0] && works[0]) {
    nodes.push({
      id: `${author.author}-compare-1`,
      layer: "comparative",
      subType: "contemporary",
      prompt: `Which author is the best adjacent interleaving match for ${author.author} here?`,
      answer: relatedAuthors[0].author,
      mcqOptions: shuffle([
        relatedAuthors[0].author,
        ...pickDistinct(
          allAuthors.map((entry) => entry.author),
          3,
          [author.author, relatedAuthors[0].author]
        ),
      ]).slice(0, 4),
      explanation: `${relatedAuthors[0].author} is related by period or region, making it a useful interleaving partner.`,
      tags: [author.author, author.literary_period || "", category.label],
      difficulty: 2,
    });
  }

  return nodes;
}

export function createTestSession(author, category, allAuthors) {
  const works = getWorkTitles(author);
  const relatedAuthors = getRelatedAuthors(author, allAuthors);
  const relatedNodes = relatedAuthors.flatMap((entry) =>
    (entry.nodes || createFallbackNodes(entry, category, allAuthors, [])).filter(
      (node) => node.layer !== "comparative"
    )
  );
  const baseNodes = (author.nodes && author.nodes.length > 0)
    ? author.nodes
    : createFallbackNodes(author, category, allAuthors, relatedAuthors);

  const retrieval = {
    prompt: `Recall the key works, themes, and contexts for ${author.author} before revealing support.`,
    works,
    hints: [
      author.literary_period || "Unknown period",
      ...(author.movements || []),
      ...(author.genreTags || []),
    ].filter(Boolean),
  };

  const verifyQuestions = baseNodes
    .filter((node) => node.layer !== "comparative")
    .slice(0, 8);

  const interleaveQuestions = shuffle([
    ...baseNodes.filter((node) => node.layer === "comparative"),
    ...relatedNodes.slice(0, 6),
  ]).slice(0, 8);

  return {
    retrieval,
    verifyQuestions,
    interleaveQuestions,
    relatedAuthors,
  };
}
