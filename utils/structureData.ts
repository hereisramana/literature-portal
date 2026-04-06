type Author = {
  author?: string;
  region?: string;
  literary_period?: string;
  works?: string[];
  [key: string]: unknown;
};

type LiteratureData = Record<string, Author[]>;

export function structureData(data: LiteratureData) {
  const structured: LiteratureData = {};

  Object.entries(data).forEach(([category, authors]: [string, Author[]]) => {
    authors.forEach((a: Author) => {
      const region = a.region || "Other";

      // British → split by genre
      if (region === "British") {
        const genre = category;

        const key =
          genre === "Poetry"
            ? "British Poetry"
            : genre === "Drama"
            ? "British Drama"
            : "British Prose & Fiction";

        if (!structured[key]) structured[key] = [];
        structured[key].push(a);
      } else {
        if (!structured[region]) structured[region] = [];
        structured[region].push(a);
      }
    });
  });

  return structured;
}
