function normalize(value = "") {
  return value
    .toLowerCase()
    .replace(/[â€™']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getSource(data, matcher) {
  const key = Object.keys(data).find((entry) => matcher(normalize(entry)));
  return key ? data[key] : [];
}

function includesRegion(author, needle) {
  return normalize(author.region || "").includes(normalize(needle));
}

function dedupeAuthors(authors) {
  const seen = new Set();

  return authors.filter((author) => {
    const works = (author.works || []).join("|");
    const key = `${author.author}|${works}|${author.region}|${author.literary_period}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function buildBritishSubcategories(authors) {
  const counts = authors.reduce((acc, author) => {
    const key = author.literary_period || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([label, count]) => ({ label, count }));
}

export function buildCatalog(data) {
  const poetry = getSource(data, (key) => key === "poetry");
  const drama = getSource(data, (key) => key === "drama");
  const prose = getSource(data, (key) => key.includes("prose"));
  const american = getSource(data, (key) => key.includes("american"));
  const indian = getSource(data, (key) => key.includes("indian"));
  const african = getSource(data, (key) => key.includes("afro"));
  const women = getSource(data, (key) => key.includes("women"));
  const cultural = getSource(data, (key) => key.includes("cultural"));
  const dalit = getSource(data, (key) => key.includes("dalit"));
  const comparative = getSource(data, (key) => key.includes("comparative"));
  const criticism = getSource(data, (key) => key.includes("criticism"));
  const newLiterature = getSource(data, (key) => key.includes("new"));

  const britishPoetry = poetry.filter((author) => includesRegion(author, "british"));
  const britishDrama = drama.filter((author) => includesRegion(author, "british"));
  const britishProse = prose.filter((author) => includesRegion(author, "british"));

  const otherRegions = dedupeAuthors(
    [...poetry, ...drama, ...prose, ...newLiterature].filter((author) => {
      const region = normalize(author.region || "");

      return (
        !region.includes("british") &&
        !region.includes("american") &&
        !region.includes("indian") &&
        !region.includes("african")
      );
    })
  );

  return [
    {
      id: "british-poetry",
      label: "British Poetry",
      shortLabel: "Poetry",
      description: "Core British poets and movements",
      authors: britishPoetry,
    },
    {
      id: "british-drama",
      label: "British Drama",
      shortLabel: "Drama",
      description: "Stage texts from Renaissance to modern drama",
      authors: britishDrama,
    },
    {
      id: "british-prose-fiction",
      label: "British Prose & Fiction",
      shortLabel: "Prose/Fiction",
      description: "Novels, essays, and prose with period filters",
      authors: britishProse,
      subcategories: buildBritishSubcategories(britishProse),
    },
    {
      id: "american",
      label: "American",
      shortLabel: "American",
      description: "American literature selections",
      authors: american,
    },
    {
      id: "indian",
      label: "Indian",
      shortLabel: "Indian",
      description: "Indian writing in English",
      authors: indian,
    },
    {
      id: "african",
      label: "African",
      shortLabel: "African",
      description: "African and Afro literature",
      authors: african,
    },
    {
      id: "other-regions",
      label: "Other Regions",
      shortLabel: "Other",
      description: "Global literature beyond the core regional buckets",
      authors: otherRegions,
    },
    {
      id: "women",
      label: "Women",
      shortLabel: "Women",
      description: "Women’s writing",
      authors: women,
    },
    {
      id: "dalit",
      label: "Dalit",
      shortLabel: "Dalit",
      description: "Dalit literature and criticism",
      authors: dalit,
    },
    {
      id: "cultural",
      label: "Cultural",
      shortLabel: "Cultural",
      description: "Cultural studies and theory",
      authors: cultural,
    },
    {
      id: "comparative",
      label: "Comparative",
      shortLabel: "Comparative",
      description: "Comparative literature",
      authors: comparative,
    },
    {
      id: "criticism",
      label: "Criticism",
      shortLabel: "Criticism",
      description: "Literary criticism and aesthetics",
      authors: criticism,
    },
  ];
}
