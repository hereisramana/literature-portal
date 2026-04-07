const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const enrichedDir = path.join(root, "data", "enriched");
const manifestPath = path.join(enrichedDir, "manifest.json");

// Simple CSV parser that handles quotes and commas
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

  const csvContent = fs.readFileSync(csvPath, "utf8");
  const dataRows = parseCSV(csvContent);
  const headers = dataRows.shift();
  
  const headerMap = {};
  headers.forEach((h, i) => (headerMap[h.toLowerCase()] = i));

  // Group by category_id
  const categories = {};

  dataRows.forEach((row) => {
    const cid = row[headerMap["category_id"]];
    if (!cid) return;
    if (!categories[cid]) categories[cid] = [];
    categories[cid].push(row);
  });

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  for (const [categoryId, rows] of Object.entries(categories)) {
    const targetFile = path.join(enrichedDir, `${categoryId}.json`);
    let categoryData;

    if (fs.existsSync(targetFile)) {
      categoryData = JSON.parse(fs.readFileSync(targetFile, "utf8"));
    } else {
      const manifestEntry = manifest.categories.find((c) => c.id === categoryId);
      categoryData = {
        categoryId: categoryId,
        label: manifestEntry ? manifestEntry.label : categoryId,
        authors: [],
      };
    }

    // Process rows for this category
    rows.forEach((row) => {
      const authorName = row[headerMap["author"]];
      const workTitle = row[headerMap["work_title"]];
      
      let author = categoryData.authors.find((a) => a.author === authorName);
      if (!author) {
        author = {
          author: authorName,
          region: row[headerMap["region"]] || "",
          literary_period: row[headerMap["literary_period"]] || "",
          movements: [],
          genreTags: [],
          works: [],
          nodes: [],
        };
        categoryData.authors.push(author);
      }

      // Update author fields if they aren't empty in CSV
      const moveStr = row[headerMap["movements"]];
      if (moveStr) {
        author.movements = [...new Set([...author.movements, ...moveStr.split(";").map((s) => s.trim()).filter(Boolean)])];
      }
      const genreStr = row[headerMap["genre_tags"]];
      if (genreStr) {
        author.genreTags = [...new Set([...author.genreTags, ...genreStr.split(";").map((s) => s.trim()).filter(Boolean)])];
      }

      // Update or add work
      let work = author.works.find((w) => w.title === workTitle);
      if (!work) {
        work = { title: workTitle, year: "", type: "" };
        author.works.push(work);
      }
      
      const year = row[headerMap["work_year"]];
      if (year) work.year = year;
      
      const type = row[headerMap["work_type"]];
      if (type) work.type = type;
      
      // Themes and characters could be stored in a temporary notes field or used for node generation later
      // For now, we focus on the core attributes.
    });

    fs.writeFileSync(targetFile, JSON.stringify(categoryData, null, 4), "utf8");
    console.log(`Updated ${targetFile}`);
  }
}

main();
