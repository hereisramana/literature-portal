const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const enrichedPath = path.join(root, "data", "enriched_data.json");

function parseCSV(csv) {
  const rows = [];
  let currentRow = [];
  let currentVal = "";
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentVal.trim());
      currentVal = "";
    } else if ((char === "\r" || char === "\n") && !insideQuotes) {
      if (currentVal || currentRow.length > 0) {
        currentRow.push(currentVal.trim());
        rows.push(currentRow);
        currentVal = "";
        currentRow = [];
      }
      if (char === "\r" && nextChar === "\n") i++;
    } else {
      currentVal += char;
    }
  }

  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    rows.push(currentRow);
  }

  return rows;
}

function parseSemicolonList(value = "") {
  return value
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniq(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function getHeaderIndex(headers, key) {
  return headers.findIndex((h) => h.toLowerCase() === key.toLowerCase());
}

function readCell(row, index) {
  if (index < 0) return "";
  return (row[index] || "").trim();
}

function main() {
  const csvFile = process.argv[2];
  if (!csvFile) {
    console.log("Usage: node scripts/importSpreadsheet.js <path-to-csv>");
    process.exit(1);
  }

  const csvPath = path.resolve(csvFile);
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(enrichedPath)) {
    console.error(`Missing enrichment source file: ${enrichedPath}`);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, "utf8");
  const rows = parseCSV(csvContent);
  const headers = rows.shift() || [];
  const data = JSON.parse(fs.readFileSync(enrichedPath, "utf8"));

  const index = {
    category_id: getHeaderIndex(headers, "category_id"),
    author: getHeaderIndex(headers, "author"),
    region: getHeaderIndex(headers, "region"),
    literary_period: getHeaderIndex(headers, "literary_period"),
    movements: getHeaderIndex(headers, "movements"),
    genre_tags: getHeaderIndex(headers, "genre_tags"),
    work_title: getHeaderIndex(headers, "work_title"),
    work_year: getHeaderIndex(headers, "work_year"),
    work_type: getHeaderIndex(headers, "work_type"),
    themes: getHeaderIndex(headers, "themes"),
  };

  for (const row of rows) {
    const categoryId = readCell(row, index.category_id);
    const authorName = readCell(row, index.author);
    if (!categoryId || !authorName) {
      continue;
    }

    if (!Array.isArray(data[categoryId])) {
      data[categoryId] = [];
    }

    let author = data[categoryId].find((entry) => entry.author === authorName);
    if (!author) {
      author = {
        author: authorName,
        region: "",
        literary_period: "",
        movements: [],
        genreTags: [],
        works: [],
        themes: [],
        nodes: [],
      };
      data[categoryId].push(author);
    }

    const region = readCell(row, index.region);
    const literaryPeriod = readCell(row, index.literary_period);
    const movements = parseSemicolonList(readCell(row, index.movements));
    const genreTags = parseSemicolonList(readCell(row, index.genre_tags));
    const themes = parseSemicolonList(readCell(row, index.themes));

    if (region) author.region = region;
    if (literaryPeriod) author.literary_period = literaryPeriod;
    author.movements = uniq([...(author.movements || []), ...movements]);
    author.genreTags = uniq([...(author.genreTags || []), ...genreTags]);
    author.themes = uniq([...(author.themes || []), ...themes]);

    const workTitle = readCell(row, index.work_title);
    if (workTitle) {
      let work = (author.works || []).find((entry) => entry.title === workTitle);
      if (!work) {
        work = { title: workTitle, year: "", type: "", themes: [] };
        author.works = [...(author.works || []), work];
      }

      const workYear = readCell(row, index.work_year);
      const workType = readCell(row, index.work_type);
      if (workYear) work.year = workYear;
      if (workType) work.type = workType;

      work.themes = uniq([...(work.themes || []), ...themes]);
    }
  }

  fs.writeFileSync(enrichedPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Updated ${enrichedPath}`);
}

main();
