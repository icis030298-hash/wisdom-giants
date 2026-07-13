const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scratch/audit-report-raw.json', 'utf8'));

// Extract Task 1: Missing epic and fact-layer
const missingEpic = raw.missing.filter(m => m.includes('(ko): epic')).map(m => m.split(' ')[0]);
const missingFactLayer = raw.missing.filter(m => m.includes('(ko): fact-layer')).map(m => m.split(' ')[0]);

console.log(`Found ${missingEpic.length} missing epics and ${missingFactLayer.length} missing fact-layers.`);

fs.writeFileSync('scratch/task1-missing.json', JSON.stringify({
  epic: missingEpic,
  factLayer: missingFactLayer
}, null, 2));

// Extract Task 2: KO fallbacks
// We need to re-scan `messages/ko.json`, `final-narratives.json`, and `fact-layer-ko.json` to extract the EXACT texts
const koMessages = JSON.parse(fs.readFileSync('messages/ko.json', 'utf8')).Giants || {};
const enMessages = JSON.parse(fs.readFileSync('messages/en.json', 'utf8')).Giants || {};
const finalNarratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
const factLayerKo = JSON.parse(fs.readFileSync('src/data/fact-layers/fact-layer-ko.json', 'utf8'));

function getLatinRatio(text) {
  if (!text) return 0;
  const latinMatches = text.match(/[a-zA-Z]/g);
  const latinCount = latinMatches ? latinMatches.length : 0;
  return lettersCount === 0 ? 0 : latinCount / text.length;
}

const fallbacks = [];

// Get all slugs
const giantsFile = fs.readFileSync('src/data/giants.ts', 'utf8');
const slugs = [...giantsFile.matchAll(/slug:\s*["']([^"']+)["']/g)].map(m => m[1]);

for (const slug of slugs) {
  // messages
  const msg = koMessages[slug];
  const enMsg = enMessages[slug];
  if (msg && enMsg && msg.headline === enMsg.headline) {
    fallbacks.push({ slug, type: 'headline', originalEn: enMsg.headline, currentKo: msg.headline });
  }

  // narratives
  const fn = finalNarratives[slug] || {};
  if (fn.epic_ko && fn.epic_en && fn.epic_ko === fn.epic_en) {
    fallbacks.push({ slug, type: 'epic', originalEn: fn.epic_en, currentKo: fn.epic_ko });
  }
  if (fn.trials_ko && fn.trials_en && fn.trials_ko === fn.trials_en) {
    fallbacks.push({ slug, type: 'trials', originalEn: fn.trials_en, currentKo: fn.trials_ko });
  }
  
  // fact-layer
  const fl = factLayerKo[slug];
  if (fl && fl.timeline && fl.timeline.length > 0) {
    const event0 = fl.timeline[0].event;
    const match = event0.match(/[a-zA-Z]/g);
    const rat = match ? match.length / event0.length : 0;
    if (rat > 0.3) {
      fallbacks.push({ slug, type: 'fact-layer', currentKo: fl.timeline });
    }
  }
}

console.log(`Extracted ${fallbacks.length} KO fallbacks.`);
fs.writeFileSync('scratch/task2-ko-fallbacks.json', JSON.stringify(fallbacks, null, 2));

