const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GROQ_API_KEY;
if (!API_KEY) {
  console.error("Error: GROQ_API_KEY environment variable is not set.");
  process.exit(1);
}

const INPUT_FILE = path.join(__dirname, "../data/data.json");
const OUTPUT_FILE = path.join(__dirname, "../data/enriched_data.json");
const BATCH_SIZE = Number(process.env.GROQ_BATCH_SIZE || 10);
const DELAY_MS = Number(process.env.GROQ_DELAY_MS || 15000);

function parseArgs(argv) {
  const opts = {
    fillMissingOnly: false,
    categories: [],
    authors: new Set(),
    authorsFile: "",
  };

  for (const arg of argv) {
    if (arg === "--fill-missing-only") {
      opts.fillMissingOnly = true;
      continue;
    }
    if (arg.startsWith("--categories=")) {
      opts.categories = arg
        .split("=")[1]
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      continue;
    }
    if (arg.startsWith("--authors-file=")) {
      opts.authorsFile = arg.split("=")[1].trim();
      continue;
    }
  }

  if (opts.authorsFile) {
    const filePath = path.resolve(opts.authorsFile);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Authors file not found: ${filePath}`);
    }
    const lines = fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    lines.forEach((name) => opts.authors.add(name));
  }

  return opts;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function nonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

function hasAcademicCoverage(author) {
  if (!author) return false;
  return (
    Array.isArray(author.works) &&
    author.works.length >= 2 &&
    Array.isArray(author.themes) &&
    author.themes.length >= 2 &&
    nonEmptyString(author.period) &&
    nonEmptyArray(author.bio_context?.movements) &&
    nonEmptyArray(author.comparison_peers) &&
    nonEmptyString(author.author_link) &&
    nonEmptyString(author.bio_note) &&
    nonEmptyArray(author.exam_significance) &&
    nonEmptyArray(author.critical_lens_notes)
  );
}

function isMissing(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

function mergeMissingOnly(existing, incoming) {
  if (Array.isArray(existing) && Array.isArray(incoming)) {
    return existing.length > 0 ? existing : incoming;
  }
  if (
    existing &&
    typeof existing === "object" &&
    incoming &&
    typeof incoming === "object" &&
    !Array.isArray(existing) &&
    !Array.isArray(incoming)
  ) {
    const merged = { ...existing };
    for (const key of Object.keys(incoming)) {
      if (!(key in merged)) {
        merged[key] = incoming[key];
      } else {
        merged[key] = mergeMissingOnly(merged[key], incoming[key]);
      }
    }
    return merged;
  }
  return isMissing(existing) ? incoming : existing;
}

async function fetchFromGroq(authorData) {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const promptText = `
Enrich this literature author profile for exam-grade study notes.
Return ONLY valid JSON, with no markdown.

Current Data:
${JSON.stringify(
  {
    author: authorData.author,
    works: authorData.works,
    region: authorData.region,
    literary_period: authorData.literary_period,
    theory_type: authorData.theory_type,
    period: authorData.period,
    themes: authorData.themes,
    style_innovations: authorData.style_innovations,
    key_characters: authorData.key_characters,
    bio_context: authorData.bio_context,
    legacy: authorData.legacy,
    comparison_peers: authorData.comparison_peers,
    author_link: authorData.author_link,
    bio_note: authorData.bio_note,
    historical_context: authorData.historical_context,
    core_arguments: authorData.core_arguments,
    exam_significance: authorData.exam_significance,
    critical_lens_notes: authorData.critical_lens_notes,
    key_terms: authorData.key_terms,
  },
  null,
  2
)}

Rules:
1. Keep all existing correct data; fill only missing or weak fields.
2. If uncertain, use null or [] instead of guessing.
3. Use academically standard terminology suitable for literature exams.
4. Preserve work titles from input exactly.

Output schema:
{
  "period": "string|null",
  "theory_type": "string|null",
  "themes": ["..."],
  "style_innovations": ["..."],
  "bio_note": "2-4 line factual academic summary",
  "historical_context": "intellectual/political context in 1-3 lines",
  "core_arguments": ["..."],
  "exam_significance": ["..."],
  "critical_lens_notes": ["..."],
  "key_terms": ["..."],
  "author_link": "Britannica URL if available else null",
  "works": [
    {
      "title": "must match existing title",
      "year": "YYYY|''",
      "type": "poem|play|novel|essay|...",
      "themes": ["..."],
      "quotes": ["short quote"],
      "iconic_lines": ["short line"],
      "theory_depth": "1-2 lines",
      "summary": "2-3 line study note",
      "critical_notes": ["..."]
    }
  ],
  "key_characters": [{ "name": "string", "work": "string", "archetype": "string" }],
  "bio_context": { "location": "string|null", "movements": ["..."], "collaborators": ["..."] },
  "magnum_opus": "string|null",
  "legacy": { "translations": "string|''", "awards": ["..."], "posthumous_notes": "string|null", "titles": ["..."] },
  "comparison_peers": [{ "name": "string", "shared_theme": "string" }]
}
`;

  const body = {
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are a literary historian and academic editor. Output strict JSON only.",
      },
      { role: "user", content: promptText },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  };

  let retries = 3;
  while (retries > 0) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 429) {
        console.log("    [Rate Limited] Waiting 10 seconds before retrying...");
        await sleep(10000);
        retries--;
        continue;
      }
      throw new Error(`Groq API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const text = (data.choices?.[0]?.message?.content || "").trim();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Failed to parse JSON response:\n${text}`);
    }
  }
  throw new Error("Max retries exceeded.");
}

function shouldProcessAuthor({ options, categoryId, authorName, existing }) {
  if (options.categories.length > 0 && !options.categories.includes(categoryId)) {
    return false;
  }
  if (options.authors.size > 0 && !options.authors.has(authorName)) {
    return false;
  }
  if (options.fillMissingOnly && hasAcademicCoverage(existing)) {
    return false;
  }
  return true;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(INPUT_FILE)) {
    throw new Error(`Input file missing: ${INPUT_FILE}`);
  }

  const baseDataset = JSON.parse(fs.readFileSync(INPUT_FILE, "utf8"));
  const enrichedDataset = fs.existsSync(OUTPUT_FILE)
    ? JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"))
    : {};

  for (const category of Object.keys(baseDataset)) {
    if (!Array.isArray(enrichedDataset[category])) {
      enrichedDataset[category] = [];
    }
  }

  let enrichedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  let processedSinceSave = 0;

  for (const category of Object.keys(baseDataset)) {
    const baseAuthors = baseDataset[category];
    const outAuthors = enrichedDataset[category];

    for (const baseAuthor of baseAuthors) {
      const idx = outAuthors.findIndex((x) => x.author === baseAuthor.author);
      const existing = idx >= 0 ? outAuthors[idx] : null;
      const mergedInput = existing ? { ...baseAuthor, ...existing } : { ...baseAuthor };

      const allowed = shouldProcessAuthor({
        options,
        categoryId: category,
        authorName: baseAuthor.author,
        existing,
      });

      if (!allowed) {
        skippedCount++;
        continue;
      }

      console.log(`[ENRICHING via Groq]: ${baseAuthor.author} in ${category}...`);
      try {
        const incoming = await fetchFromGroq(mergedInput);
        const finalRecord = options.fillMissingOnly
          ? mergeMissingOnly(mergedInput, incoming)
          : { ...mergedInput, ...incoming };

        if (idx >= 0) {
          outAuthors[idx] = finalRecord;
        } else {
          outAuthors.push(finalRecord);
        }

        enrichedCount++;
        processedSinceSave++;
        console.log("  -> Success");
      } catch (err) {
        errorCount++;
        console.error(`  -> [ERROR] ${err.message}`);
        if (idx < 0) {
          outAuthors.push(mergedInput);
        }
      }

      if (processedSinceSave >= BATCH_SIZE) {
        fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(enrichedDataset, null, 2)}\n`, "utf8");
        console.log(`--- Saved progress after ${BATCH_SIZE} enrichments ---`);
        processedSinceSave = 0;
      }

      await sleep(DELAY_MS);
    }

    fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(enrichedDataset, null, 2)}\n`, "utf8");
  }

  console.log("\n====================================");
  console.log("Groq enrichment complete.");
  console.log("====================================");
  console.log(`Enriched: ${enrichedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Output: ${OUTPUT_FILE}`);
  console.log(`Throttle delay used: ${DELAY_MS}ms`);
}

main().catch((err) => {
  console.error("Fatal Error:", err.message);
  process.exit(1);
});
