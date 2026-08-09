const fs = require('fs');

const existing493 = JSON.parse(fs.readFileSync('scratch/existing_493_roster.json', 'utf8'));
const candidates500 = JSON.parse(fs.readFileSync('scratch/candidates_500_roster.json', 'utf8'));

const existingNames = new Set(existing493.map(g => (g.enName || "").toLowerCase().trim()).filter(n => n.length > 0));
const existingKoNames = new Set(existing493.map(g => (g.koName || "").trim()).filter(n => n.length > 0));
const existingSlugs = new Set(existing493.map(g => (g.slug || "").toLowerCase().trim()).filter(n => n.length > 0));

const validCandidates = [];
let dupCount = 0;
let dateFilterCount = 0;
let placeholderCount = 0;

for (const c of candidates500) {
  const cSlugRaw = c.slug || "";
  const cEnNameRaw = c.nameEn || c.enName || ""; // support both property names
  const cKoNameRaw = c.nameKo || c.koName || "";
  
  if (cSlugRaw.includes('historical-figure-candidate') || cEnNameRaw.includes('Historical Figure Candidate')) {
    placeholderCount++;
    continue;
  }

  let deathYear = -1;
  const era = c.era || "";
  const match = era.match(/~(\d{4})\)?$/) || era.match(/-(\d{4})\)?$/);
  if (match) {
    deathYear = parseInt(match[1]);
  } else {
    const match2 = era.match(/(\d{4})\)?$/);
    if(match2) deathYear = parseInt(match2[1]);
  }
  
  if (deathYear >= 1970 && deathYear !== -1) {
    dateFilterCount++;
    continue;
  }
  
  if (cSlugRaw.includes('dorothy-hodgkin') || cSlugRaw.includes('barbara-mcclintock') || cSlugRaw.includes('chien-shiung-wu') || cSlugRaw.includes('inge-lehmann')) {
     dateFilterCount++;
     continue;
  }

  const cName = cEnNameRaw.toLowerCase().trim();
  const cKoName = cKoNameRaw.trim();
  const cSlug = cSlugRaw.toLowerCase().trim().replace(/-giant$/, ''); 

  if (
      (cName.length > 0 && existingNames.has(cName)) || 
      (cKoName.length > 0 && existingKoNames.has(cKoName)) || 
      (cSlug.length > 0 && existingSlugs.has(cSlug)) ||
      cSlug === 'jang-yeong-sil' ||
      cSlug === 'yun-dong-ju' ||
      cSlug === 'lise-meitner' ||
      cSlug === 'emmy-noether'
     ) {
    dupCount++;
    continue;
  }

  validCandidates.push({
    slug: cSlugRaw,
    nameEn: cEnNameRaw,
    nameKo: cKoNameRaw,
    era: era,
    region: c.region || "",
    category: c.category || "",
    gender: c.gender || "",
    reason: c.reason || ""
  });
}

console.log(`Total Candidates Processed: ${candidates500.length}`);
console.log(`Placeholders Rejected: ${placeholderCount}`);
console.log(`Duplicates Rejected: ${dupCount}`);
console.log(`Date Filter Rejected: ${dateFilterCount}`);
console.log(`Valid Candidates Salvaged: ${validCandidates.length}`);

fs.writeFileSync('scratch/salvaged_valid_candidates.json', JSON.stringify(validCandidates, null, 2), 'utf8');
