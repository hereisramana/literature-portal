const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error("Error: GEMINI_API_KEY environment variable is not set.");
    console.error("Please set it in your terminal before running this script.");
    process.exit(1);
}

const INPUT_FILE = path.join(__dirname, '../data.json'); // Adjust path to the data.json file if needed
const OUTPUT_FILE = path.join(__dirname, '../enriched_data.json'); // Adjust path where the output should be saved
const BATCH_SIZE = 10;
const DELAY_MS = 1000;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchFromGemini(authorData) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;
    
    const promptText = `
You are a literary historian and academic expert.
Enrich the following author data. Return ONLY valid JSON, without any markdown formatting, code block fences (\`\`\`json), or conversational text.

Current Data:
${JSON.stringify({
    author: authorData.author,
    works: authorData.works,
    region: authorData.region,
    literary_period: authorData.literary_period,
    theory_type: authorData.theory_type
})}

Instructions:
Ground all claims primarily in the specific listed works rather than general knowledge about the author unless absolutely necessary.
If you are uncertain about a field, use null rather than guessing.
Provide exactly the following fields:
- "period": exact birth–death years e.g. "1795–1821"
- "themes": list of 4–6 core thematic concerns specific to their listed works
- "style_innovations": list of 2–3 specific formal/technical contributions
- "key_characters": list of objects { "name": string, "work": string, "archetype": string } — empty array for non-fiction authors
- "bio_context": object with { "location": string, "movements": array of strings, "collaborators": array of strings }
- "magnum_opus": single most significant work from their works list, or null
- "legacy": object with { "translations": string, "awards": array of strings, "posthumous_notes": string }
- "comparison_peers": array of 2 objects { "name": string, "shared_theme": string } (authors from similar period/theme)
`;

    const body = {
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
            temperature: 0.2, // Low temperature for more factual, stable responses
            responseMimeType: "application/json"
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean up any potential markdown fences just in case Gemini ignored the instruction
    text = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
        return JSON.parse(text);
    } catch (e) {
        throw new Error(`Failed to parse JSON response: \n${text}`);
    }
}

async function main() {
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`Error: Could not find input file at ${INPUT_FILE}`);
        return;
    }

    // Load original data
    const dataset = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    
    // Attempt to load existing progress if any
    let enrichedDataset = {};
    if (fs.existsSync(OUTPUT_FILE)) {
        enrichedDataset = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    } else {
        // Copy the structure but empty the arrays to be filled
        for (const cat in dataset) {
            enrichedDataset[cat] = [];
        }
    }

    // Map to store already enriched authors to handle duplicates
    const authorStore = new Map();
    
    // First, map any existing enriched data in OUTPUT_FILE into our authorStore so we don't repeat work on resumes
    for (const [category, authors] of Object.entries(enrichedDataset)) {
        for (const author of authors) {
            if (author.period !== undefined) {
                authorStore.set(author.author, author);
            }
        }
    }

    let enrichedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    let processedSinceLastSave = 0;

    // We modify or rather rebuild 'enrichedDataset' dynamically in-place
    for (const category of Object.keys(dataset)) {
        const categoryAuthors = dataset[category];
        if (!enrichedDataset[category]) enrichedDataset[category] = [];
        
        // We will build a new array for this category
        const newCategoryAuthors = [];

        for (const authorEntry of categoryAuthors) {
            const authorName = authorEntry.author;

            if (authorStore.has(authorName)) {
                // Already enriched (from a different category or loaded from disk)
                const enrichedSource = authorStore.get(authorName);
                const combined = { ...authorEntry, ...enrichedSource }; // Keep original category-specific fields, merge enriched
                newCategoryAuthors.push(combined);
                
                // If it's a true cross-category duplicate we skipped API call
                console.log(`[SKIP (Dupe processing/Cached)]: ${authorName} in ${category}`);
                skippedCount++;
                continue;
            }

            // Needs enrichment
            console.log(`[ENRICHING]: ${authorName} in ${category}...`);
            try {
                const enrichedData = await fetchFromGemini(authorEntry);
                const combined = { ...authorEntry, ...enrichedData };
                
                newCategoryAuthors.push(combined);
                authorStore.set(authorName, enrichedData); // cache for duplicates
                
                console.log(`  -> Success!`);
                enrichedCount++;
            } catch (err) {
                console.error(`  -> [ERROR] Failed to enrich ${authorName}: ${err.message}`);
                // In case of error, just push the original entry so we don't lose it
                newCategoryAuthors.push(authorEntry);
                errorCount++;
            }

            processedSinceLastSave++;
            if (processedSinceLastSave >= BATCH_SIZE) {
                enrichedDataset[category] = newCategoryAuthors; // update current category in main obj
                fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enrichedDataset, null, 2), 'utf8');
                console.log(`--- Saved progress after ${BATCH_SIZE} entries to ${OUTPUT_FILE} ---`);
                processedSinceLastSave = 0;
            }

            // Rate limiting
            await sleep(DELAY_MS);
        }
        
        // Finalize this category
        enrichedDataset[category] = newCategoryAuthors;
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enrichedDataset, null, 2), 'utf8');
    }

    // Final summary
    console.log('\n====================================');
    console.log('Enrichment Complete!');
    console.log('====================================');
    console.log(`Total Authors Enriched (API Calls): ${enrichedCount}`);
    console.log(`Total Skipped / Duplicate: ${skippedCount}`);
    console.log(`Total Errors: ${errorCount}`);
    console.log(`Final data saved to: ${OUTPUT_FILE}`);
}

main().catch(err => {
    console.error('Fatal Error:', err);
});
