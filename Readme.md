# Literature Revision Portal

A cognitive-first, minimal UI study system for English Literature exams.

## Features
- Author-first browsing
- Structured test mode
- Author-first browsing
- Structured test mode
- Micro recall + matching + ordering
- IndexedDB progress
- Region-based categorization
- Fully frontend

## Data Sources
- Primary database: `data/data.json` (Unified Single Source of Truth)
- Logic and categorization: `utils/catalog.js`
- Study Mode & Enrichment logic: Integrated directly into `data/data.json`
- Search and Filtering: `app/page.js`

### Legacy / Background Scripts
- `scripts/importSpreadsheet.js` formerly merged CSV rows into `data/enriched_data.json` (Deprecated)
- `scripts/enrichDatasetWithGroq.js` used to generate curriculum notes (Deprecated)
- `scripts/extractAuthorInventory.js` outputs inventory to `data/author-inventory.json`
- `scripts/auditStudyCoverage.js` generates `data/study_coverage_audit.json` for study/test coverage gaps

## Run
npm install
npm run dev
