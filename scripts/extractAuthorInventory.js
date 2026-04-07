const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "data", "data.json");
const outputPath = path.join(root, "data", "enriched", "author-inventory.json");

function normalizeCategoryLabel(label) {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildInventory(data) {
  return Object.entries(data).map(([category, authors]) => ({
    id: normalizeCategoryLabel(category),
    label: category,
    authors: (authors || []).map((author) => ({
      author: author.author,
      region: author.region || "",
      literary_period: author.literary_period || "",
      works: author.works || [],
      theory_type: author.theory_type || "",
    })),
  }));
}

function main() {
  const raw = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const inventory = {
    version: 1,
    generatedFrom: "data/data.json",
    categories: buildInventory(raw),
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(inventory, null, 2)}\n`);
  console.log(`Wrote author inventory to ${outputPath}`);
}

main();
