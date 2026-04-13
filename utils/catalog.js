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

// Extracts birth year from period strings like:
//   "1688–1744"  → 1688
//   "c. 1343–1400" → 1343
//   "1907–2000"  → 1907
//   "1959–"      → 1959
//   null / missing → Infinity (sorts to end)
function getBirthYear(author) {
  const period = author.period || "";
  // Strip non-numeric prefix (e.g. "c.", "c ", "fl.")
  const cleaned = period.replace(/^[^0-9]*/g, "");
  const match = cleaned.match(/\d{3,4}/);
  return match ? parseInt(match[0], 10) : Infinity;
}

function sortChronologically(authors) {
  return [...authors].sort((a, b) => getBirthYear(a) - getBirthYear(b));
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

  const isBritish = (a) => normalize(a.region || "").includes("british");
  const britishAuthors = dedupeAuthors([
    ...poetry.filter(isBritish),
    ...drama.filter(isBritish),
    ...prose.filter(isBritish),
    ...newLiterature.filter(isBritish)
  ]);

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
  
  const allAuthors = dedupeAuthors(Object.values(data).flat());

  return [
    {
      id: "british-literature",
      label: "British Literature",
      shortLabel: "British",
      description: "Comprehensive survey of British poets, playwrights, and novelists",
      authors: sortChronologically(britishAuthors),
    },
    {
      id: "american",
      label: "American",
      shortLabel: "American",
      description: "American literature selections",
      authors: sortChronologically(american),
    },
    {
      id: "indian",
      label: "Indian",
      shortLabel: "Indian",
      description: "Indian writing in English",
      authors: sortChronologically(indian),
    },
    {
      id: "african",
      label: "African",
      shortLabel: "African",
      description: "African and Afro literature",
      authors: sortChronologically(african),
    },
    {
      id: "other-regions",
      label: "Other Regions",
      shortLabel: "Other",
      description: "Global literature beyond the core regional buckets",
      authors: sortChronologically(otherRegions),
    },
    {
      id: "women",
      label: "Women",
      shortLabel: "Women",
      description: "Women's writing",
      authors: sortChronologically(women),
    },
    {
      id: "dalit",
      label: "Dalit",
      shortLabel: "Dalit",
      description: "Dalit literature and criticism",
      authors: sortChronologically(dalit),
    },
    {
      id: "cultural",
      label: "Cultural",
      shortLabel: "Cultural",
      description: "Cultural studies and theory",
      authors: sortChronologically(cultural),
    },
    {
      id: "comparative",
      label: "Comparative",
      shortLabel: "Comparative",
      description: "Comparative literature",
      authors: sortChronologically(comparative),
    },
    {
      id: "criticism",
      label: "Criticism",
      shortLabel: "Criticism",
      description: "Literary criticism and aesthetics",
      authors: sortChronologically(criticism),
    },
    {
      id: "award-winning-indians",
      label: "Award Winning Indians",
      shortLabel: "Awards",
      description: "Celebrating Nobel, Pulitzer, Booker, Jnanpith, and Sahitya Akademi laureates of Indian origin",
      authors: sortChronologically(
        allAuthors.filter((a) => {
          const awards = a.legacy?.awards || [];
          const awardStr = Array.isArray(awards) ? awards.join(" ").toLowerCase() : String(awards).toLowerCase();
          const isIndian = normalize(a.region || "").includes("indian");
          
          const hasBigAward = 
            awardStr.includes("nobel") || 
            awardStr.includes("booker") || 
            awardStr.includes("pulitzer") || 
            awardStr.includes("jnanpith") || 
            awardStr.includes("sahitya akademi");
            
          return isIndian && hasBigAward;
        })
      ),
    },
  ];
}
