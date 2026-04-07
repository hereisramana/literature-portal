const fs = require("fs");
const path = require("path");

function validateFile(filePath) {
  console.log(`Validating ${filePath}...`);
  const content = fs.readFileSync(filePath, "utf8");
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    console.error(`  [ERROR] Invalid JSON: ${e.message}`);
    return false;
  }

  let errors = [];

  if (!data.categoryId) errors.push("Missing 'categoryId'");
  if (!Array.isArray(data.authors)) errors.push("'authors' must be an array");

  (data.authors || []).forEach((author, i) => {
    const name = author.author || `Author at index ${i}`;
    if (!author.author) errors.push(`Author at index ${i} is missing 'author' name`);
    
    if (!Array.isArray(author.movements)) errors.push(`${name}: 'movements' must be an array`);
    if (!Array.isArray(author.genreTags)) errors.push(`${name}: 'genreTags' must be an array`);
    
    if (!Array.isArray(author.works)) {
      errors.push(`${name}: 'works' must be an array`);
    } else {
      author.works.forEach((work, j) => {
        if (!work.title) errors.push(`${name} > Work ${j}: Missing 'title'`);
        // year and type can be empty but should exist as strings
        if (typeof work.year !== "string") errors.push(`${name} > ${work.title}: 'year' must be a string`);
        if (typeof work.type !== "string") errors.push(`${name} > ${work.title}: 'type' must be a string`);
      });
    }

    if (!Array.isArray(author.nodes)) {
      errors.push(`${name}: 'nodes' must be an array`);
    } else {
      author.nodes.forEach((node, k) => {
        const nodeId = node.id || `node at index ${k}`;
        if (!node.id) errors.push(`${name} > Node ${k}: Missing 'id'`);
        if (!["factual", "textual", "critical", "comparative"].includes(node.layer)) {
          errors.push(`${name} > ${nodeId}: Invalid or missing 'layer' (${node.layer})`);
        }
        if (!node.prompt) errors.push(`${name} > ${nodeId}: Missing 'prompt'`);
        if (!node.answer) errors.push(`${name} > ${nodeId}: Missing 'answer'`);
        if (!Array.isArray(node.mcqOptions) || node.mcqOptions.length !== 4) {
          errors.push(`${name} > ${nodeId}: 'mcqOptions' must be an array of exactly 4 strings`);
        } else if (!node.mcqOptions.includes(node.answer)) {
          errors.push(`${name} > ${nodeId}: 'answer' must be one of the 'mcqOptions'`);
        }
        if (!node.explanation) errors.push(`${name} > ${nodeId}: Missing 'explanation'`);
        if (!Array.isArray(node.tags)) errors.push(`${name} > ${nodeId}: 'tags' must be an array`);
        if (typeof node.difficulty !== "number") errors.push(`${name} > ${nodeId}: 'difficulty' must be a number`);
      });
    }
  });

  if (errors.length > 0) {
    console.error(`  [FAILED] Found ${errors.length} errors:`);
    errors.forEach(err => console.error(`    - ${err}`));
    return false;
  }

  console.log("  [PASSED] Schema is valid.");
  return true;
}

function main() {
  const target = process.argv[2];
  if (!target) {
    console.log("Usage: node scripts/validateEnriched.js <file-or-dir>");
    process.exit(1);
  }

  const fullPath = path.resolve(target);
  if (!fs.existsSync(fullPath)) {
    console.error(`Path not found: ${fullPath}`);
    process.exit(1);
  }

  const stats = fs.statSync(fullPath);
  let success = true;

  if (stats.isDirectory()) {
    const files = fs.readdirSync(fullPath).filter(f => f.endsWith(".json") && f !== "manifest.json" && f !== "author-inventory.json");
    files.forEach(f => {
      if (!validateFile(path.join(fullPath, f))) success = false;
    });
  } else {
    success = validateFile(fullPath);
  }

  process.exit(success ? 0 : 1);
}

main();
