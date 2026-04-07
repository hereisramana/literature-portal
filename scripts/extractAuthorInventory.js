const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "data", "data.json");
const outputPath = path.join(root, "data", "inventory.csv");

function normalizeCategoryLabel(label) {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeCSV(val) {
  if (val === undefined || val === null) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function generateCSV(data) {
  const headers = [
    "category_id",
    "author",
    "region",
    "literary_period",
    "movements",
    "genre_tags",
    "work_title",
    "work_year",
    "work_type",
    "themes",
    "characters_or_key_points",
    "source_1",
    "source_2",
    "reviewed"
  ];

  const rows = [headers.join(",")];

  for (const [category, authors] of Object.entries(data)) {
    const categoryId = normalizeCategoryLabel(category);
    for (const author of authors) {
      const works = Array.isArray(author.works) ? author.works : [author.works || ""];
      for (const work of works) {
        const row = [
          categoryId,
          author.author || "",
          author.region || "",
          author.literary_period || "",
          "", // movements
          "", // genre_tags
          work,
          "", // work_year
          "", // work_type
          "", // themes
          "", // characters_or_key_points
          author.author_link || "", // source_1 (pre-fill if exists)
          "", // source_2
          "inventory" // initial status
        ];
        rows.push(row.map(escapeCSV).join(","));
      }
    }
  }

  return rows.join("\n");
}

function main() {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Error: Source file not found at ${sourcePath}`);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const csvContent = generateCSV(raw);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, csvContent, "utf8");
  console.log(`Wrote author inventory to ${outputPath}`);
}

main();
