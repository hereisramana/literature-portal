const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GROQ_API_KEY;
if (!API_KEY) {
    console.error("Error: GROQ_API_KEY environment variable is not set.");
    console.error("Please set it in your terminal before running this script.");
    process.exit(1);
}

const INPUT_FILE = path.join(__dirname, '../data/data.json'); 
const OUTPUT_FILE = path.join(__dirname, '../data/enriched_data.json'); 
const BATCH_SIZE = 10;
const DELAY_MS = 15000; // 15 seconds to avoid hitting the 6,000 Tokens-Per-Minute limit

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchFromGroq(authorData) {
    const url = `https://api.groq.com/openai/v1/chat/completions`;
    
    const promptText = `
Enrich the following author data. Return ONLY valid JSON, without any markdown formatting or explanations.

Current Data:
${JSON.stringify({
    author: authorData.author,
    works: authorData.works,
    region: authorData.region,
    literary_period: authorData.literary_period,
    theory_type: authorData.theory_type
})}

Ground all claims primarily in the specific listed works. 
If you are uncertain about a field, use null rather than guessing.
Provide exactly the following JSON structure:
{
  "period": "exact birth–death years e.g. 1795–1821",
  "theory_type": "Specific critical school or theoretical framework (e.g. New Historicism), or null",
  "themes": ["general theme 1", "general theme 2"],
  "style_innovations": ["innovation 1", "innovation 2"],
  "works": [
    {
      "title": "MUST match one from input list",
      "year": "YYYY",
      "themes": ["specific work theme 1", "specific work theme 2"],
      "quotes": ["short iconic quote 1", "short iconic quote 2"],
      "theory_depth": "1-2 sentences on critical significance"
    }
  ],
  "key_characters": [ { "name": "string", "work": "string", "archetype": "string" } ],
  "bio_context": { "location": "string", "movements": ["movement 1"], "collaborators": ["collab 1"] },
  "magnum_opus": "single most significant work from their works list, or null",
  "legacy": { "translations": "string", "awards": ["award 1"], "posthumous_notes": "string" },
  "comparison_peers": [ { "name": "string", "shared_theme": "string" } ]
}
Make sure 'key_characters' is an empty array [] for non-fiction authors.
`;

    const body = {
        model: "llama-3.1-8b-instant", // Downgrade to 8B model which has a much higher daily token limit
        messages: [
            {
                role: "system",
                content: "You are a literary historian and academic expert. You strictly output valid JSON objects only, formatted exactly as requested."
            },
            {
                role: "user",
                content: promptText
            }
        ],
        temperature: 0.2, 
        response_format: { type: "json_object" }
    };

    let retries = 3;
    while (retries > 0) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errText = await response.text();
            if (response.status === 429) {
                console.log(`    [Rate Limited] Waiting 5 seconds before retrying...`);
                await sleep(5000);
                retries--;
                continue;
            }
            throw new Error(`Groq API Error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        let text = data.choices?.[0]?.message?.content || '';
        
        // Fallback cleanup just in case
        text = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error(`Failed to parse JSON response: \n${text}`);
        }
    }
    throw new Error("Max retries exceeded due to rate limits.");
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
    
    for (const [category, authors] of Object.entries(enrichedDataset)) {
        for (const author of authors) {
            // Only skip if the author has the new rich data (theory_depth check)
            if (author.period !== undefined && author.works?.[0]?.theory_depth) {
                authorStore.set(author.author, author);
            }
        }
    }

    let enrichedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    let processedSinceLastSave = 0;

    for (const category of Object.keys(dataset)) {
        const categoryAuthors = dataset[category];
        if (!enrichedDataset[category]) enrichedDataset[category] = [];
        
        const newCategoryAuthors = [];

        for (const authorEntry of categoryAuthors) {
            const authorName = authorEntry.author;

            if (authorStore.has(authorName)) {
                // Already enriched 
                const enrichedSource = authorStore.get(authorName);
                const combined = { ...authorEntry, ...enrichedSource }; 
                newCategoryAuthors.push(combined);
                
                console.log(`[SKIP (Dupe processing/Cached)]: ${authorName} in ${category}`);
                skippedCount++;
                continue;
            }

            console.log(`[ENRICHING via Groq]: ${authorName} in ${category}...`);
            try {
                const enrichedData = await fetchFromGroq(authorEntry);
                const combined = { ...authorEntry, ...enrichedData };
                
                newCategoryAuthors.push(combined);
                authorStore.set(authorName, enrichedData);
                
                console.log(`  -> Success!`);
                enrichedCount++;
            } catch (err) {
                console.error(`  -> [ERROR] Failed to enrich ${authorName}: ${err.message}`);
                newCategoryAuthors.push(authorEntry);
                errorCount++;
            }

            processedSinceLastSave++;
            if (processedSinceLastSave >= BATCH_SIZE) {
                enrichedDataset[category] = newCategoryAuthors;
                fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enrichedDataset, null, 2), 'utf8');
                console.log(`--- Saved progress after ${BATCH_SIZE} entries to ${OUTPUT_FILE} ---`);
                processedSinceLastSave = 0;
            }

            // Rate limiting for Groq free tier
            await sleep(DELAY_MS);
        }
        
        enrichedDataset[category] = newCategoryAuthors;
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enrichedDataset, null, 2), 'utf8');
    }

    console.log('\n====================================');
    console.log('Enrichment Complete!');
    console.log('====================================');
    console.log(`Total Authors Enriched (Groq API Calls): ${enrichedCount}`);
    console.log(`Total Skipped / Duplicate: ${skippedCount}`);
    console.log(`Total Errors: ${errorCount}`);
    console.log(`Final data saved to: ${OUTPUT_FILE}`);
}

main().catch(err => {
    console.error('Fatal Error:', err);
});
