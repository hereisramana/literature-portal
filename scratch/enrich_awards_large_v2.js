const fs = require('fs');

const rawData = fs.readFileSync('scratch/enrich_awards_large.js', 'utf8').split('const rawData = `')[1].split('`;')[0];

const dataPath = './data/data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const awardMap = {
    '[1]': 'Pulitzer Prize',
    '[2]': 'Sahitya Akademi Award',
    '[3]': 'Booker Prize',
    '[4]': 'International Booker Prize',
    '[5]': 'Jnanpith Award'
};

const lines = rawData.split('\n');
const entries = [];
for (let i = 0; i < lines.length; i += 4) {
    if (lines[i] && lines[i+1] && lines[i+2] && lines[i+3]) {
        entries.push({
            author: lines[i].trim(),
            work: lines[i+1].trim(),
            year: lines[i+2].trim(),
            source: lines[i+3].trim()
        });
    }
}

function getCompareKey(s) {
    return s.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

let updateCount = 0;
let matchCount = 0;

for (const entry of entries) {
    const authorName = entry.author;
    const workTitle = entry.work;
    const awardName = awardMap[entry.source] || 'Literary Award';
    const year = entry.year;

    const key = getCompareKey(authorName);

    for (const cat in data) {
        for (const authorObj of data[cat]) {
            if (getCompareKey(authorObj.author) === key) {
                matchCount++;
                
                // 1. Add award to legacy
                if (!authorObj.legacy) authorObj.legacy = {};
                if (!authorObj.legacy.awards) authorObj.legacy.awards = [];
                if (!Array.isArray(authorObj.legacy.awards)) authorObj.legacy.awards = [authorObj.legacy.awards];
                
                const awardStr = `${awardName} (${year})`;
                if (!authorObj.legacy.awards.includes(awardStr)) {
                    authorObj.legacy.awards.push(awardStr);
                }

                // 2. Add/Update work
                if (!authorObj.works) authorObj.works = [];
                let existingWork = authorObj.works.find(w => {
                    const title = (typeof w === 'string') ? w : (w.title || '');
                    return getCompareKey(title) === getCompareKey(workTitle);
                });

                if (existingWork) {
                    if (typeof existingWork === 'string') {
                        const index = authorObj.works.indexOf(existingWork);
                        authorObj.works[index] = {
                            title: existingWork,
                            award: awardName,
                            award_year: year
                        };
                    } else {
                        existingWork.award = awardName;
                        existingWork.award_year = year;
                    }
                } else {
                    authorObj.works.push({
                        title: workTitle,
                        award: awardName,
                        award_year: year
                    });
                }
                updateCount++;
            }
        }
    }
}

console.log(`Matched ${matchCount} author entries. Updated ${updateCount} total records.`);
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
