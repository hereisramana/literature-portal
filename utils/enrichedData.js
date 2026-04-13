// Merging is now handled at the database level in data.json
// This utility is retained for reverse compatibility but simply returns the author

export function mergeAuthorWithEnriched(author) {
  return author;
}

export function getWorkTitles(author) {
  return (author.works || []).map((work) =>
    typeof work === "string" ? work : work.title
  );
}
