import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import the live app logic
import { generateQuestions, cleanAuthorData } from '../utils/testEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, '../data/enriched_data.json');

async function runVerification() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Data file not found at ${DATA_PATH}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const allAuthors = Object.values(data).flat();
  let totalTests = 0;
  let totalGaps = 0;
  let authorsWithGaps = 0;

  console.log(`\n🔍 Starting Study-Test Alignment Audit (${allAuthors.length} authors)...`);

  allAuthors.forEach((rawAuthor) => {
    const author = cleanAuthorData(rawAuthor);
    const questions = generateQuestions(author, allAuthors);
    let authorHasGap = false;

    // Build the "Study Knowledge Base" - strings that are visible in Study Mode
    const knowledgeBase = new Set();
    
    const add = (val) => {
      if (!val) return;
      if (Array.isArray(val)) {
        val.forEach(v => add(v));
      } else if (typeof val === 'object') {
        Object.values(val).forEach(v => add(v));
      } else {
        knowledgeBase.add(val.toString().toLowerCase().trim());
      }
    };

    // Explicitly add all study-visible fields
    add(author.author);
    add(author.period);
    add(author.region);
    add(author.literary_period);
    add(author.magnum_opus);
    add(author.theory_type);
    add(author.works); // titles, years, types
    add(author.themes);
    add(author.style_innovations);
    add(author.genreTags);
    add(author.key_characters); // name, archetype, work
    add(author.bio_context.location);
    add(author.bio_context.movements);
    add(author.bio_context.collaborators);
    add(author.legacy.awards);
    add(author.legacy.translations);
    add(author.legacy.posthumous_notes);
    
    if (author.comparison_peers) {
      author.comparison_peers.forEach(p => {
        add(p.name);
        add(p.shared_theme);
      });
    }

    questions.forEach((q) => {
      totalTests++;
      const ansLower = q.answer.toLowerCase().trim();
      
      let found = knowledgeBase.has(ansLower);
      
      // Deep search for partials/substrings if exact not found
      if (!found) {
        for (const item of knowledgeBase) {
          if (item === ansLower || item.includes(ansLower) || ansLower.includes(item)) {
            found = true;
            break;
          }
        }
      }

      if (!found) {
        if (!authorHasGap) {
          console.log(`\n❌ [${author.author}]`);
          authorHasGap = true;
          authorsWithGaps++;
        }
        console.log(`   - Question ${q.id} ("${q.dimension}"): Answer "${q.answer}" not found in study material.`);
        totalGaps++;
      }
    });
  });

  console.log(`\n─────────────────────────────────────────────────────────────────`);
  console.log(`Audit Summary:`);
  console.log(`- Total Questions Checked: ${totalTests}`);
  console.log(`- Data Gaps Found:        ${totalGaps}`);
  console.log(`- Authors Affected:      ${authorsWithGaps} / ${allAuthors.length}`);
  console.log(`─────────────────────────────────────────────────────────────────\n`);

  if (totalGaps === 0) {
    console.log(`✅ Success: All test answers are verifiable through study material.\n`);
  } else {
    console.log(`⚠️ Warning: Study material is incomplete for ${authorsWithGaps} authors.\n`);
  }
}

runVerification();
