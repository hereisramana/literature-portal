const fs = require('fs');

const dataPath = './data/data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

for (const cat in data) {
    const authorObj = data[cat].find(a => a.author === 'Harishankar Parsai');
    if (authorObj) {
        // Add work
        if (!authorObj.works) authorObj.works = [];
        const workExists = authorObj.works.some(w => {
            const title = (typeof w === 'string') ? w : (w.title || '');
            return title.toLowerCase().includes("viklang shraddha ka daur");
        });

        if (!workExists) {
            authorObj.works.push({
                title: "Viklang Shraddha Ka Daur",
                award: "Sahitya Akademi Award (Hindi)",
                award_year: "1982",
                type: "Satire"
            });
        }

        // Add award if not present
        if (!authorObj.legacy) authorObj.legacy = {};
        if (!authorObj.legacy.awards) authorObj.legacy.awards = [];
        if (!authorObj.legacy.awards.includes("Sahitya Akademi Award (Hindi) (1982)")) {
            authorObj.legacy.awards.push("Sahitya Akademi Award (Hindi) (1982)");
        }
        
        console.log("Updated Harishankar Parsai");
        break;
    }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
