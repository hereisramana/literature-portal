import json
import os

data_path = 'c:/Users/herei/OneDrive/Desktop/literature-portal/data/data.json'

with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

awards_data = [
    # International
    ("Rabindranath Tagore", "Nobel Prize in Literature (1913)"),
    ("Gobind Behari Lal", "Pulitzer Prize (Reporting) (1937)"),
    ("V.S. Naipaul", "Booker Prize (1971)"),
    ("Salman Rushdie", "Booker Prize (1981)"),
    ("Arundhati Roy", "Booker Prize (1997)"),
    ("Arundhati Roy", "Sahitya Akademi Award (English) (2005)"),
    ("Jhumpa Lahiri", "Pulitzer Prize (Fiction) (2000)"),
    ("Geeta Anand", "Pulitzer Prize (Reporting) (2003)"),
    ("Kiran Desai", "Booker Prize (2006)"),
    ("Aravind Adiga", "Booker Prize (2008)"),
    ("Siddhartha Mukherjee", "Pulitzer Prize (General Nonfiction) (2011)"),
    ("Vijay Seshadri", "Pulitzer Prize (Poetry) (2014)"),
    ("Geetanjali Shree", "International Booker Prize (2022)"),
    ("Banu Mushtaq", "International Booker Prize (2025)"),
    # National Jnanpith
    ("G. Sankara Kurup", "Jnanpith Award (1965)"),
    ("Ramdhari Singh 'Dinkar'", "Jnanpith Award (1972)"),
    ("Ramdhari Singh 'Dinkar'", "Sahitya Akademi Award (Hindi) (1959)"),
    ("Ashapoorna Devi", "Jnanpith Award (1976)"),
    ("Amrita Pritam", "Jnanpith Award (1981)"),
    ("Amitav Ghosh", "Jnanpith Award (2018)"),
    ("Amitav Ghosh", "Sahitya Akademi Award (English) (1989)"),
    ("Gulzar", "Jnanpith Award (2023)"),
    ("Jagadguru Rambhadracharya", "Jnanpith Award (2023)"),
    ("Vinod Kumar Shukla", "Jnanpith Award (2024)"),
    ("Vinod Kumar Shukla", "Sahitya Akademi Award (Hindi) (1999)"),
    ("Vairamuthu", "Jnanpith Award (2025)"),
    # Sahitya Akademi English
    ("R. K. Narayan", "Sahitya Akademi Award (English) (1960)"),
    ("Vikram Seth", "Sahitya Akademi Award (English) (1988)"),
    ("Ruskin Bond", "Sahitya Akademi Award (English) (1992)"),
    ("Ramachandra Guha", "Sahitya Akademi Award (English) (2011)"),
    ("Shashi Tharoor", "Sahitya Akademi Award (English) (2019)"),
    ("Easterine Kire", "Sahitya Akademi Award (English) (2024)"),
    ("Navtej Sarna", "Sahitya Akademi Award (English) (2025)"),
    # Sahitya Akademi Hindi
    ("Makhanlal Chaturvedi", "Sahitya Akademi Award (Hindi) (1955)"),
    ("Harivansh Rai Bachchan", "Sahitya Akademi Award (Hindi) (1968)"),
    ("Bhisham Sahni", "Sahitya Akademi Award (Hindi) (1975)"),
    ("Krishna Sobti", "Sahitya Akademi Award (Hindi) (1980)"),
    ("Harishankar Parsai", "Sahitya Akademi Award (Hindi) (1982)"),
    ("Gagan Gill", "Sahitya Akademi Award (Hindi) (2024)"),
    ("Mamta Kalia", "Sahitya Akademi Award (Hindi) (2025)"),
]

def update_author(name, award):
    found = False
    for category in data:
        for author_obj in data[category]:
            if author_obj['author'].strip().lower() == name.lower():
                if 'legacy' not in author_obj:
                    author_obj['legacy'] = {}
                if 'awards' not in author_obj['legacy'] or author_obj['legacy']['awards'] is None:
                    author_obj['legacy']['awards'] = []
                if not isinstance(author_obj['legacy']['awards'], list):
                    author_obj['legacy']['awards'] = [author_obj['legacy']['awards']]
                
                if award not in author_obj['legacy']['awards']:
                    author_obj['legacy']['awards'].append(award)
                found = True
    return found

missing_authors = set()
for author, award in awards_data:
    if not update_author(author, award):
        missing_authors.add(author)

print(f"Missing authors: {missing_authors}")

# Add missing authors to a new temporary category
data["Award Winners Placeholder"] = []
for author in missing_authors:
    new_author = {
        "author": author,
        "works": [],
        "region": "Indian",
        "literary_period": "Contemporary",
        "period": None,
        "themes": [],
        "style_innovations": [],
        "key_characters": [],
        "bio_context": {
            "location": "India",
            "movements": [],
            "collaborators": []
        },
        "magnum_opus": None,
        "legacy": {
            "translations": None,
            "awards": [],
            "posthumous_notes": None
        },
        "comparison_peers": []
    }
    # Re-apply awards to new authors
    for a_name, award in awards_data:
        if a_name == author:
            new_author["legacy"]["awards"].append(award)
    
    data["Award Winners Placeholder"].append(new_author)

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Update complete.")
