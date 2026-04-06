export function structureData(data) {
  const structured = {};

  Object.entries(data).forEach(([category, authors]) => {
    authors.forEach((a) => {
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