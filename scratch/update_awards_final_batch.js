const fs = require('fs');

const dataPath = './data/data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const entries = [
    { year: "1913", author: "Rabindranath Tagore", work: "Gitanjali", award: "Nobel Prize in Literature" },
    { year: "1937", author: "Gobind Behari Lal", work: "Science Reporting", award: "Pulitzer Prize (Reporting)" },
    { year: "1971", author: "V. S. Naipaul", work: "In a Free State", award: "Booker Prize" },
    { year: "1981", author: "Salman Rushdie", work: "Midnight's Children", award: "Booker Prize" },
    { year: "1997", author: "Arundhati Roy", work: "The God of Small Things", award: "Booker Prize" },
    { year: "2000", author: "Jhumpa Lahiri", work: "Interpreter of Maladies", award: "Pulitzer Prize (Fiction)" },
    { year: "2003", author: "Geeta Anand", work: "Corporate Corruption Reporting", award: "Pulitzer Prize (Reporting)" },
    { year: "2006", author: "Kiran Desai", work: "The Inheritance of Loss", award: "Booker Prize" },
    { year: "2008", author: "Aravind Adiga", work: "The White Tiger", award: "Booker Prize" },
    { year: "2011", author: "Siddhartha Mukherjee", work: "The Emperor of All Maladies", award: "Pulitzer Prize (General Nonfiction)" },
    { year: "2014", author: "Vijay Seshadri", work: "3 Sections", award: "Pulitzer Prize (Poetry)" },
    { year: "2022", author: "Geetanjali Shree", work: "Tomb of Sand (Ret Samadhi)", award: "International Booker Prize" },
    { year: "2025", author: "Banu Mushtaq", work: "Heart Lamp: Selected Stories", award: "International Booker Prize" },
    
    // Jnanpith
    { year: "1965", author: "G. Sankara Kurup", work: "Odakkuzhal", award: "Jnanpith Award" },
    { year: "1972", author: "Ramdhari Singh 'Dinkar'", work: "Urvashi", award: "Jnanpith Award" },
    { year: "1976", author: "Ashapoorna Devi", work: "Pratham Pratisruti", award: "Jnanpith Award" },
    { year: "1981", author: "Amrita Pritam", work: "Kagaz Te Canvas", award: "Jnanpith Award" },
    { year: "2018", author: "Amitav Ghosh", work: "Lifetime Achievement", award: "Jnanpith Award" },
    { year: "2023", author: "Gulzar", work: "Lifetime Achievement", award: "Jnanpith Award" },
    { year: "2023", author: "Jagadguru Rambhadracharya", work: "Lifetime Achievement", award: "Jnanpith Award" },
    { year: "2024", author: "Vinod Kumar Shukla", work: "Naukar Ki Kameez", award: "Jnanpith Award" },
    { year: "2025", author: "Vairamuthu", work: "Lifetime Achievement", award: "Jnanpith Award" },

    // Sahitya Akademi (English)
    { year: "1960", author: "R. K. Narayan", work: "The Guide", award: "Sahitya Akademi Award (English)" },
    { year: "1988", author: "Vikram Seth", work: "The Golden Gate", award: "Sahitya Akademi Award (English)" },
    { year: "1989", author: "Amitav Ghosh", work: "The Shadow Lines", award: "Sahitya Akademi Award (English)" },
    { year: "1992", author: "Ruskin Bond", work: "Our Trees Still Grow in Dehra", award: "Sahitya Akademi Award (English)" },
    { year: "2005", author: "Arundhati Roy", work: "The Algebra of Infinite Justice", award: "Sahitya Akademi Award (English)" },
    { year: "2011", author: "Ramachandra Guha", work: "India After Gandhi", award: "Sahitya Akademi Award (English)" },
    { year: "2019", author: "Shashi Tharoor", work: "An Era of Darkness", award: "Sahitya Akademi Award (English)" },
    { year: "2024", author: "Easterine Kire", work: "Spirit Nights", award: "Sahitya Akademi Award (English)" },
    { year: "2025", author: "Navtej Sarna", work: "Crimson Spring", award: "Sahitya Akademi Award (English)" },

    // Sahitya Akademi (Hindi)
    { year: "1955", author: "Makhanlal Chaturvedi", work: "Him Tarangini", award: "Sahitya Akademi Award (Hindi)" },
    { year: "1959", author: "Ramdhari Singh 'Dinkar'", work: "Sanskriti Ke Char Adhyay", award: "Sahitya Akademi Award (Hindi)" },
    { year: "1968", author: "Harivansh Rai Bachchan", work: "Do Chattanen", award: "Sahitya Akademi Award (Hindi)" },
    { year: "1975", author: "Bhisham Sahni", work: "Tamas", award: "Sahitya Akademi Award (Hindi)" },
    { year: "1980", author: "Krishna Sobti", work: "Zindaginama - Zinda Rukh", award: "Sahitya Akademi Award (Hindi)" },
    { year: "1982", author: "Harishankar Parsai", work: "Viklang Shraddha Ka Daur", award: "Sahitya Akademi Award (Hindi)" },
    { year: "1999", author: "Vinod Kumar Shukla", work: "Deewar Mein Ek Khirkee Rahati Thi", award: "Sahitya Akademi Award (Hindi)" },
    { year: "2024", author: "Gagan Gill", work: "Main Jab Tak Aai Bahar", award: "Sahitya Akademi Award (Hindi)" },
    { year: "2025", author: "Mamta Kalia", work: "Jeete Jee Allahabad", award: "Sahitya Akademi Award (Hindi)" },

    // Others
    { year: "2024", author: "A. R. Venkatachalapathy", work: "Tirunelveeli Ezucciyum Vaa. Vuu.Ci. Yum 1908", award: "Sahitya Akademi Award" },
    { year: "2025", author: "N. Prabhakaran", work: "Maayaamanushyar", award: "Sahitya Akademi Award" },
    { year: "2025", author: "Prasun Bandyopadhyay", work: "Shrestha Kabita", award: "Sahitya Akademi Award" },
    { year: "2025", author: "Sadhu Bhadreshdas", work: "Prasthanacatustaye Brahmaghosah", award: "Sahitya Akademi Award" }
];

function normalize(s) {
    if (!s) return "";
    return s.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

let authorsUpdated = 0;

entries.forEach(entry => {
    const normName = normalize(entry.author);
    let found = false;

    // Search in existing database
    for (const cat in data) {
        data[cat].forEach(authorObj => {
            if (normalize(authorObj.author) === normName) {
                found = true;
                
                // Add award to legacy
                if (!authorObj.legacy) authorObj.legacy = {};
                if (!authorObj.legacy.awards) authorObj.legacy.awards = [];
                const awardStr = `${entry.award} (${entry.year})`;
                if (!authorObj.legacy.awards.includes(awardStr)) {
                    authorObj.legacy.awards.push(awardStr);
                }

                // Add work
                if (!authorObj.works) authorObj.works = [];
                const workNorm = normalize(entry.work);
                const exWork = authorObj.works.find(w => normalize(typeof w === 'string' ? w : w.title) === workNorm);
                
                if (!exWork) {
                    authorObj.works.unshift({
                        title: entry.work,
                        award: entry.award,
                        award_year: entry.year
                    });
                } else if (typeof exWork === 'string') {
                    const idx = authorObj.works.indexOf(exWork);
                    authorObj.works[idx] = {
                        title: exWork,
                        award: entry.award,
                        award_year: entry.year
                    };
                } else {
                    exWork.award = entry.award;
                    exWork.award_year = entry.year;
                }
                authorsUpdated++;
            }
        });
    }

    // If not found, add to a relevant or placeholder category
    if (!found) {
        const newAuthor = {
            author: entry.author,
            works: [{
                title: entry.work,
                award: entry.award,
                award_year: entry.year
            }],
            region: "Indian",
            literary_period: "Contemporary",
            legacy: {
                awards: [`${entry.award} (${entry.year})`]
            }
        };
        // Add to Award Winning Indians in data.json (as a placeholder category or append to prose)
        if (!data["Award Winning Indians"]) data["Award Winning Indians"] = [];
        data["Award Winning Indians"].push(newAuthor);
        console.log(`Created new author: ${entry.author}`);
    }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Updated ${authorsUpdated} entries.`);
