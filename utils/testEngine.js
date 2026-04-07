import { shuffle } from "./shuffle.js";

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

function inferTheme(work, author, category) {
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

export function createExerciseSet(author, category, allAuthors) {
  const works = author.works || [];
  const sampleWorks = works.slice(0, Math.min(works.length, 4));
  const allWorks = allAuthors.flatMap((entry) => entry.works || []);

  const distractors = pickDistinct(allWorks, 5, works);
  const selectCorrect = works.slice(0, Math.min(3, works.length));
  const selectOptions = shuffle([...selectCorrect, ...distractors.slice(0, 4)]);

  const themePairs = sampleWorks.map((work) => ({
    prompt: work,
    answer: inferTheme(work, author, category),
  }));
  const themeChoices = shuffle([...new Set(themePairs.map((item) => item.answer))]);

  const typeLens = inferTypeLens(category);
  const typeChoices = shuffle([
    typeLens,
    "Character constellation",
    "Symbolic pattern",
    "Historical frame",
  ]);

  return [
    {
      id: "recall",
      label: "Recall",
      prompt: "Recall as many works as you can before revealing the list.",
      data: {
        works,
      },
    },
    {
      id: "select",
      label: "Select",
      prompt: `Select every work that belongs to ${author.author}.`,
      data: {
        options: selectOptions,
        answers: selectCorrect,
      },
    },
    {
      id: "ordering",
      label: "Order",
      prompt: "Rebuild the syllabus order shown for this author.",
      data: {
        shuffled: shuffle(sampleWorks),
        answer: sampleWorks,
      },
    },
    {
      id: "themes",
      label: "Themes",
      prompt: "Match each work to a concise theme cue.",
      data: {
        pairs: themePairs,
        choices: themeChoices,
      },
    },
    {
      id: "type",
      label: "Type Lens",
      prompt: "Choose the most useful reading lens for this author's works in the current category.",
      data: {
        works: sampleWorks,
        answer: typeLens,
        choices: typeChoices,
        categoryLabel: titleCase(category.label),
      },
    },
  ];
}
