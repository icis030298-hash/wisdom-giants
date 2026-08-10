const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('=== WEEKEND GIANTS & NARRATIVES DATA AUDIT ===');
console.log('================================================================\n');

// 1. Check giants.ts
const giantsPath = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
let giantsCount = 0;
let giants = [];
if (fs.existsSync(giantsPath)) {
  const code = fs.readFileSync(giantsPath, 'utf8');
  const cleanCode = code.replace(/import\s+.*?;\s*/g, '').replace('export const giants: Giant[] =', 'const giants =').replace('export const giants =', 'const giants =');
  try {
    giants = new Function(cleanCode + '; return giants;')();
    giantsCount = giants.length;
  } catch (e) {
    console.log('Error parsing giants.ts:', e.message);
  }
}
console.log(`1. Total giants registered in src/data/giants.ts: ${giantsCount}`);

// 2. Check src/data/narratives/ directory
const narrativesDir = path.join(__dirname, '..', 'src', 'data', 'narratives');
let narrativeFiles = [];
if (fs.existsSync(narrativesDir)) {
  narrativeFiles = fs.readdirSync(narrativesDir).filter(f => f.endsWith('.json'));
}
console.log(`2. Total narrative JSON files in src/data/narratives/: ${narrativeFiles.length}`);

// 3. Inspect fields in src/data/narratives/
let withKoSummary = 0;
let withKoBody = 0;
let withEnSummary = 0;
let withEnBody = 0;
let totalNarrativeItems = 0;

narrativeFiles.forEach(file => {
  const filePath = path.join(narrativesDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    totalNarrativeItems++;

    const hasKo = (data.summary && data.summary.ko) || (data.ko && (data.ko.summary || data.ko.overview || data.ko.narrative));
    const hasEn = (data.summary && data.summary.en) || (data.en && (data.en.summary || data.en.overview || data.en.narrative));

    if (data.summary_ko || data.ko || (data.summary && data.summary.ko)) withKoSummary++;
    if (data.summary_en || data.en || (data.summary && data.summary.en)) withEnSummary++;
  } catch (e) {}
});

console.log(`3. Narrative File Breakdown (${totalNarrativeItems} files):`);
console.log(`   - Korean content present: ${withKoSummary} files`);
console.log(`   - English content present: ${withEnSummary} files`);

// 4. Sample check on 5 recent narrative files to inspect exact schema
console.log('\n4. Schema Sample Check (First 3 files in src/data/narratives/):');
narrativeFiles.slice(0, 3).forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(narrativesDir, file), 'utf8'));
  console.log(`\n--- [${file}] ---`);
  console.log('Keys:', Object.keys(data));
  if (data.summary) console.log('summary keys:', Object.keys(data.summary));
  if (data.ko) console.log('ko keys:', Object.keys(data.ko));
  if (data.en) console.log('en keys:', Object.keys(data.en));
});

// 5. Check commit 253d770 files modified
console.log('\n5. Inspecting Injection Gate Rules and Duplicate Filtering:');
const gatePath = path.join(__dirname, '..', 'src', 'lib', 'injection-gate.ts');
if (fs.existsSync(gatePath)) {
  console.log('injection-gate.ts exists at src/lib/injection-gate.ts');
}
