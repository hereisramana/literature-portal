const fs = require('fs');

const dataPath = './data/data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function getCompareKey(s) {
    return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

const masters = {};

for (const cat in data) {
    const list = data[cat];
    const newList = [];
    for (const authorObj of list) {
        const key = getCompareKey(authorObj.author);
        if (!masters[key]) {
            masters[key] = authorObj;
            newList.push(authorObj);
        } else {
            // MERGE
            const master = masters[key];
            // Merge works
            if (authorObj.works) {
                authorObj.works.forEach(work => {
                    const title = (typeof work === 'string') ? work : (work.title || '');
                    const existing = master.works.find(w => {
                        const mTitle = (typeof w === 'string') ? w : (w.title || '');
                        return getCompareKey(mTitle) === getCompareKey(title);
                    });
                    if (!existing) {
                        master.works.push(work);
                    } else if (typeof work === 'object' && typeof existing === 'object') {
                        Object.assign(existing, work);
                    }
                });
            }
            // Merge awards
            if (authorObj.legacy?.awards) {
                if (!master.legacy) master.legacy = {};
                if (!master.legacy.awards) master.legacy.awards = [];
                authorObj.legacy.awards.forEach(award => {
                    if (!master.legacy.awards.includes(award)) {
                        master.legacy.awards.push(award);
                    }
                });
            }
            // If placeholder, discard. Keep the one with more data.
            console.log(`Merged duplicate: ${authorObj.author} into ${master.author}`);
        }
    }
    data[cat] = newList;
}

// Special case: Suppression of Joint Comparison Authors in data.json if needed
// Actually, I'll just remove the ones that have Nobel but aren't the primary winner?
// No, I'll just fix the category filter to exclude joint names.

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log("Deduplication complete.");
