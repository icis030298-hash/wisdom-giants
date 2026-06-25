const fs = require('fs');
const path = require('path');

const candidatesPath = 'scripts/candidates-approval.json';
const candidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));

// 1. Reclassify W. E. B. Du Bois and Frantz Fanon to americas
let reclassifiedCount = 0;
candidates.forEach(c => {
  if (c.slug === 'w-e-b-du-bois' || c.slug === 'frantz-fanon') {
    c.region = 'americas';
    reclassifiedCount++;
    console.log(`Reclassified ${c.nameEn} (${c.slug}) to americas.`);
  }
});

// 2. Identify held candidates
const heldSlugs = [
  'samuel-maharero',
  'patrice-lumumba',
  'gamal-abdel-nasser',
  'mohammad-mosaddegh',
  'muhammad-ibn-abd-al-wahhab',
  'bahaullah',
  'the-bab',
  'ibn-saud'
];

const heldCandidates = candidates.filter(c => heldSlugs.includes(c.slug));
const approvedCandidates = candidates.filter(c => !heldSlugs.includes(c.slug));

console.log(`Held candidates: ${heldCandidates.length}`);
console.log(`Approved candidates: ${approvedCandidates.length}`);

// Sort both lists by region, then nameKo
const sortByRegionAndName = (list) => {
  list.sort((a, b) => {
    const regionCompare = a.region.localeCompare(b.region);
    if (regionCompare !== 0) return regionCompare;
    return a.nameKo.localeCompare(b.nameKo);
  });
};
sortByRegionAndName(approvedCandidates);
sortByRegionAndName(heldCandidates);

// Save approved candidates back to candidates-approval.json
fs.writeFileSync(candidatesPath, JSON.stringify(approvedCandidates, null, 2), 'utf8');
console.log(`Saved approved candidates to ${candidatesPath}`);

// Save held candidates to scripts/candidates-held.json
const heldPath = 'scripts/candidates-held.json';
fs.writeFileSync(heldPath, JSON.stringify(heldCandidates, null, 2), 'utf8');
console.log(`Saved held candidates to ${heldPath}`);

// 3. Generate the Markdown table file
let md = `# Final Candidate Curation List (Approved: ${approvedCandidates.length}, Held: ${heldCandidates.length})

Please review the final curated candidates. 

- **Du Bois & Fanon**: Reclassified to \`americas\` based on birthplace (Massachusetts and Martinique).
- **Held List**: 8 sensitive or borderline figures are listed at the bottom for individual review.

---

## Part 1: Approved Candidates (${approvedCandidates.length} figures)

| # | Name (KO) | Name (EN) | Slug | Region | Died | Colonial | Religion | 20th Cent. | Achievement / Selection Reason |
|---|---|---|---|---|---|:---:|:---:|:---:|---|
`;

approvedCandidates.forEach((c, idx) => {
  const colFlag = c.colonialRelated ? '⚠️ **Yes**' : 'No';
  const relFlag = c.religiousLeader ? '⛪ **Yes**' : 'No';
  const modFlag = c.modern20th ? '🕒 **Yes**' : 'No';
  md += `| ${idx + 1} | ${c.nameKo} | ${c.nameEn} | \`${c.slug}\` | \`${c.region}\` | ${c.deathYear} | ${colFlag} | ${relFlag} | ${modFlag} | ${c.briefBio} |\n`;
});

md += `
---

## Part 2: Held Candidates for Individual Review (${heldCandidates.length} figures)

These figures have been put on hold due to sensitive historical, political, or religious contexts.

| # | Name (KO) | Name (EN) | Slug | Region | Died | Colonial | Religion | 20th Cent. | Concern / Reason for Hold |
|---|---|---|---|---|---|:---:|:---:|:---:|---|
`;

heldCandidates.forEach((c, idx) => {
  const colFlag = c.colonialRelated ? '⚠️ **Yes**' : 'No';
  const relFlag = c.religiousLeader ? '⛪ **Yes**' : 'No';
  const modFlag = c.modern20th ? '🕒 **Yes**' : 'No';
  md += `| ${idx + 1} | ${c.nameKo} | ${c.nameEn} | \`${c.slug}\` | \`${c.region}\` | ${c.deathYear} | ${colFlag} | ${relFlag} | ${modFlag} | ${c.briefBio} |\n`;
});

const mdPath = 'scripts/candidates-for-approval.md';
fs.writeFileSync(mdPath, md, 'utf-8');
console.log(`Saved Markdown candidate list to ${mdPath}`);

// Copy to brain folder as artifact
const conversationId = '1d63bcbe-3036-4a9b-99f0-ff3e2bb85ad4';
const brainDir = `C:\\Users\\user\\.gemini\\antigravity\\brain\\${conversationId}`;
if (fs.existsSync(brainDir)) {
  const artifactPath = path.join(brainDir, 'candidates_for_approval.md');
  fs.writeFileSync(artifactPath, md, 'utf-8');
  console.log(`Saved brain artifact to ${artifactPath}`);
}
