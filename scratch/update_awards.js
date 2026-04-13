const fs = require('fs');
const path = require('path');

const dataPath = 'c:/Users/herei/OneDrive/Desktop/literature-portal/data/data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const awardsData = [
  // International
  ["Rabindranath Tagore", "Nobel Prize in Literature (1913)"],
  ["Gobind Behari Lal", "Pulitzer Prize (Reporting) (1937)"],
  ["V.S. Naipaul", "Booker Prize (1971)"],
  ["Salman Rushdie", "Booker Prize (1981)"],
  ["Arundhati Roy", "Booker Prize (1997)"],
  ["Arundhati Roy", "Sahitya Akademi Award (English) (2005)"],
  ["Jhumpa Lahiri", "Pulitzer Prize (Fiction) (2000)"],
  ["Geeta Anand", "Pulitzer Prize (Reporting) (2003)"],
  ["Kiran Desai", "Booker Prize (2006)"],
  ["Aravind Adiga", "Booker Prize (2008)"],
  ["Siddhartha Mukherjee", "Pulitzer Prize (General Nonfiction) (2011)"],
  ["Vijay Seshadri", "Pulitzer Prize (Poetry) (2014)"],
  ["Geetanjali Shree", "International Booker Prize (2022)"],
  ["Banu Mushtaq", "International Booker Prize (2025)"],
  // National Jnanpith
  ["G. Sankara Kurup", "Jnanpith Award (1965)"],
  ["Ramdhari Singh 'Dinkar'", "Jnanpith Award (1972)"],
  ["Ramdhari Singh 'Dinkar'", "Sahitya Akademi Award (Hindi) (1959)"],
  ["Ashapoorna Devi", "Jnanpith Award (1976)"],
  ["Amrita Pritam", "Jnanpith Award (1981)"],
  ["Amitav Ghosh", "Jnanpith Award (2018)"],
  ["Amitav Ghosh", "Sahitya Akademi Award (English) (1989)"],
  ["Gulzar", "Jnanpith Award (2023)"],
  ["Jagadguru Rambhadracharya", "Jnanpith Award (2023)"],
  ["Vinod Kumar Shukla", "Jnanpith Award (2024)"],
  ["Vinod Kumar Shukla", "Sahitya Akademi Award (Hindi) (1999)"],
  ["Vairamuthu", "Jnanpith Award (2025)"],
  // Sahitya Akademi English
  ["R. K. Narayan", "Sahitya Akademi Award (English) (1960)"],
  ["Vikram Seth", "Sahitya Akademi Award (English) (1988)"],
  ["Ruskin Bond", "Sahitya Akademi Award (English) (1992)"],
  ["Ramachandra Guha", "Sahitya Akademi Award (English) (2011)"],
  ["Shashi Tharoor", "Sahitya Akademi Award (English) (2019)"],
  ["Easterine Kire", "Sahitya Akademi Award (English) (2024)"],
  ["Navtej Sarna", "Sahitya Akademi Award (English) (2025)"],
  // Sahitya Akademi Hindi
  ["Makhanlal Chaturvedi", "Sahitya Akademi Award (Hindi) (1955)"],
  ["Harivansh Rai Bachchan", "Sahitya Akademi Award (Hindi) (1968)"],
  ["Bhisham Sahni", "Sahitya Akademi Award (Hindi) (1975)"],
  ["Krishna Sobti", "Sahitya Akademi Award (Hindi) (1980)"],
  ["Harishankar Parsai", "Sahitya Akademi Award (Hindi) (1982)"],
  ["Gagan Gill", "Sahitya Akademi Award (Hindi) (2024)"],
  ["Mamta Kalia", "Sahitya Akademi Award (Hindi) (2025)"],
];

function updateAuthor(name, award) {
  let found = false;
  for (const category in data) {
    for (const authorObj of data[category]) {
      if (authorObj.author.trim().toLowerCase() === name.toLowerCase()) {
        if (!authorObj.legacy) authorObj.legacy = {};
        if (!authorObj.legacy.awards || authorObj.legacy.awards === null) {
          authorObj.legacy.awards = [];
        }
        if (!Array.isArray(authorObj.legacy.awards)) {
          authorObj.legacy.awards = [authorObj.legacy.awards];
        }

        if (!authorObj.legacy.awards.includes(award)) {
          authorObj.legacy.awards.push(award);
        }
        found = true;
      }
    }
  }
  return found;
}

const missingAuthors = new Set();
for (const [author, award] of awardsData) {
  if (!updateAuthor(author, award)) {
    missingAuthors.add(author);
  }
}

console.log("Missing authors:", Array.from(missingAuthors));

if (!data["Award Winners Placeholder"]) {
  data["Award Winners Placeholder"] = [];
}

for (const author of missingAuthors) {
  const newAuthor = {
    "author": author,
    "works": [],
    "region": "Indian",
    "literary_period": "Contemporary",
    "period": null,
    "themes": [],
    "style_innovations": [],
    "key_characters": [],
    "bio_context": {
      "location": "India",
      "movements": [],
      "collaborators": []
    },
    "magnum_opus": null,
    "legacy": {
      "translations": null,
      "awards": [],
      "posthumous_notes": null
    },
    "comparison_peers": []
  };

  for (const [aName, award] of awardsData) {
    if (aName === author) {
      newAuthor.legacy.awards.push(award);
    }
  }
  data["Award Winners Placeholder"].push(newAuthor);
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log("Update complete.");
