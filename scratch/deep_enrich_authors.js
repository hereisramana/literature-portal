const fs = require('fs');

const dataPath = './data/data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const updates = {
    "Qurratulain Hyder": {
        awards: ["Jnanpith Award (1989)", "Sahitya Akademi Award (1967)", "Padma Bhushan (2005)"],
        titles: ["Grand Dame of Urdu literature"],
        works: [
            { title: "River of Fire (Aag Ka Darya)", award: "Masterpiece" },
            { title: "Akhire Shab Ke Humsafar", award: "Jnanpith Award", award_year: "1989" },
            { title: "Patjhar Ki Awaz", award: "Sahitya Akademi Award", award_year: "1967", type: "Short Stories" }
        ],
        themes: ["Epic timeline", "Cultural memory", "Partition trauma"]
    },
    "Shashi Deshpande": {
        awards: ["Sahitya Akademi Award (1990)", "Padma Shri (2009)", "The Hindu Literary Prize (2014 - Shortlisted)"],
        titles: ["Major voice in contemporary Indian English fiction"],
        works: [
            { title: "That Long Silence", award: "Sahitya Akademi Award", award_year: "1990" },
            { title: "Shadow Play", award: "Shortlisted for The Hindu Literary Prize", award_year: "2014" }
        ],
        themes: ["Feminist literature", "Domestic claustrophobia", "Interior life"]
    },
    "Nissim Ezekiel": {
        awards: ["Sahitya Akademi Award (1983)", "Padma Shri (1988)"],
        titles: ["Father of Modern Indian English Poetry"],
        works: [
            { title: "Latter-Day Psalms", award: "Sahitya Akademi Award", award_year: "1983" },
            { title: "Night of the Scorpion", award: "Poetry Foundation Highlight" },
            "Goodbye Party for Miss Pushpa T. S"
        ],
        themes: ["Precision in verse", "Modernist transition", "Indian urban life"]
    },
    "Narendra Jadhav": {
        awards: ["Sahitya Akademi Award (2005)", "Maharashtra Sahitya Parishad Award (1993)", "Commander of the Order of Academic Palms (Government of France)"],
        titles: ["Prominent economist and writer"],
        works: [
            { title: "Amcha Baap Aan Amhi (Our Father and Us)", award: "Sahitya Akademi Award (Punjabi version)", award_year: "2005" },
            { title: "Dr. Ambedkar: Economic Thoughts & Philosophy", award: "Maharashtra Sahitya Parishad Award", award_year: "1993" },
            "Outcaste"
        ],
        themes: ["Dalit empowerment", "Economic philosophy", "Autobiographical bestseller"]
    }
};

function normalize(s) {
    return s.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

for (const cat in data) {
    data[cat].forEach(authorObj => {
        const name = authorObj.author;
        const normName = normalize(name);
        
        for (const updateName in updates) {
            if (normalize(updateName) === normName) {
                const u = updates[updateName];
                
                // 1. Legacy
                if (!authorObj.legacy) authorObj.legacy = {};
                authorObj.legacy.awards = u.awards;
                authorObj.legacy.titles = u.titles;

                // 2. Works - Merge/Replace
                const newWorks = [...u.works];
                // Keep existing works if not in u.works
                authorObj.works.forEach(exWork => {
                    const exTitle = (typeof exWork === 'string') ? exWork : (exWork.title || '');
                    const alreadyPresent = newWorks.some(nw => {
                        const nwTitle = (typeof nw === 'string') ? nw : (nw.title || '');
                        return normalize(exTitle) === normalize(nwTitle);
                    });
                    if (!alreadyPresent) newWorks.push(exWork);
                });
                authorObj.works = newWorks;

                // 3. Themes
                if (u.themes) {
                    authorObj.themes = [...new Set([...(authorObj.themes || []), ...u.themes])];
                }

                // 4. Bio context titles
                if (!authorObj.bio_context) authorObj.bio_context = {};
                authorObj.bio_context.honors = u.titles;

                console.log(`Updated author: ${name}`);
            }
        }
    });
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log("Deep enrichment complete.");
