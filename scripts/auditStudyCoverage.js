const fs = require("fs");
const path = require("path");

const INPUT_FILE = path.join(__dirname, "../data/enriched_data.json");
const OUTPUT_JSON = path.join(__dirname, "../data/study_coverage_audit.json");

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function count(arr) {
  return Array.isArray(arr) ? arr.length : 0;
}

function collectAuthorRow(category, author) {
  return {
    category,
    author: author.author,
    works: count(author.works),
    themes: count(author.themes),
    style_innovations: count(author.style_innovations),
    key_characters: count(author.key_characters),
    movements: count(author.bio_context?.movements),
    collaborators: count(author.bio_context?.collaborators),
    comparison_peers: count(author.comparison_peers),
    awards: count(author.legacy?.awards),
    has_period: hasText(author.period),
    has_author_link: hasText(author.author_link),
    has_bio_note: hasText(author.bio_note),
    has_historical_context: hasText(author.historical_context),
    core_arguments: count(author.core_arguments),
    exam_significance: count(author.exam_significance),
    critical_lens_notes: count(author.critical_lens_notes),
    key_terms: count(author.key_terms),
  };
}

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    throw new Error(`Missing input file: ${INPUT_FILE}`);
  }

  const data = JSON.parse(fs.readFileSync(INPUT_FILE, "utf8"));
  const rows = [];

  for (const [category, authors] of Object.entries(data)) {
    for (const author of authors) {
      rows.push(collectAuthorRow(category, author));
    }
  }

  const summary = {
    total_authors: rows.length,
    works_lt_2: rows.filter((r) => r.works < 2).length,
    themes_lt_2: rows.filter((r) => r.themes < 2).length,
    missing_period: rows.filter((r) => !r.has_period).length,
    missing_movements: rows.filter((r) => r.movements < 1).length,
    missing_peers: rows.filter((r) => r.comparison_peers < 1).length,
    missing_britannica_link: rows.filter((r) => !r.has_author_link).length,
    missing_bio_note: rows.filter((r) => !r.has_bio_note).length,
    missing_historical_context: rows.filter((r) => !r.has_historical_context).length,
    missing_core_arguments: rows.filter((r) => r.core_arguments < 1).length,
    missing_exam_significance: rows.filter((r) => r.exam_significance < 1).length,
    missing_critical_lens_notes: rows.filter((r) => r.critical_lens_notes < 1).length,
    missing_key_terms: rows.filter((r) => r.key_terms < 1).length,
  };

  const report = {
    generated_at: new Date().toISOString(),
    summary,
    at_risk_authors: rows.filter(
      (r) =>
        r.works < 2 ||
        r.themes < 2 ||
        !r.has_period ||
        r.movements < 1 ||
        r.comparison_peers < 1 ||
        !r.has_author_link ||
        !r.has_bio_note ||
        !r.has_historical_context ||
        r.core_arguments < 1 ||
        r.exam_significance < 1 ||
        r.critical_lens_notes < 1 ||
        r.key_terms < 1
    ),
  };

  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log("Study coverage audit complete.");
  console.log(`Output: ${OUTPUT_JSON}`);
  console.log(summary);
}

main();
