# Literature Revision Portal

A cognitive-first, minimal UI study system for English Literature exams.

## Features
- Author-first browsing
- Structured test mode
- Micro recall + matching + ordering
- IndexedDB progress
- Region-based categorization
- Fully frontend

## Data Sources
- Runtime enrichment source: `data/enriched_data.json`
- Backup syllabus source: `data/data.json`
- Legacy per-category enrichment directory `data/enriched/` has been removed

## Enrichment Scripts
- `scripts/importSpreadsheet.js` merges CSV rows directly into `data/enriched_data.json`
- `scripts/extractAuthorInventory.js` outputs inventory to `data/author-inventory.json`

## Run
npm install
npm run dev
