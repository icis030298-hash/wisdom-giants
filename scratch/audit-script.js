const fs = require('fs');
const path = require('path');

const locales = ['ko','en','es','fr','de','ja','it','pt','ar','hi','ru','zh','id','tr','sw','ha','fa','he','vi','th','pl','el','nl','uk'];
const nonLatin = ['ko','ja','zh','ar','hi','ru','fa','he','th','el','uk'];

// Read giant list
const giantsFile = fs.readFileSync('src/data/giants.ts', 'utf8');
const slugs = [...giantsFile.matchAll(/slug:\s*["']([^"']+)["']/g)].map(m => m[1]);

// Read english base for exact match comparison
const enMessages = JSON.parse(fs.readFileSync('messages/en.json', 'utf8')).Giants || {};
const finalNarratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));

// Helper for latin ratio
function getLatinRatio(text) {
  if (!text) return 0;
  const latinMatches = text.match(/[a-zA-Z]/g);
  const latinCount = latinMatches ? latinMatches.length : 0;
  const lettersCount = text.length; // rough
  return lettersCount === 0 ? 0 : latinCount / lettersCount;
}

let report = {
  completion: {}, // { locale: { complete: 0, pending: 0 } }
  fallback: {},   // { locale: count }
  missing: [],    // array of slugs/fields
};

locales.forEach(loc => report.completion[loc] = { complete: 0, pending: 0 });
locales.forEach(loc => report.fallback[loc] = 0);

for (const loc of locales) {
  const msgPath = `messages/${loc}.json`;
  let msgData = {};
  if (fs.existsSync(msgPath)) {
    msgData = JSON.parse(fs.readFileSync(msgPath, 'utf8')).Giants || {};
  }
  
  let factLayer = {};
  const flPath = `src/data/fact-layers/fact-layer-${loc}.json`;
  if (fs.existsSync(flPath)) {
    factLayer = JSON.parse(fs.readFileSync(flPath, 'utf8'));
  }

  for (const slug of slugs) {
    let isComplete = true;
    let fallbackCount = 0;
    
    // Check messages
    const msg = msgData[slug];
    const enMsg = enMessages[slug];
    if (!msg || !msg.name) {
      isComplete = false;
      report.missing.push(`${slug} (${loc}): msg.name`);
    } else {
      if (loc !== 'en' && enMsg && msg.name === enMsg.name && !msg.name.match(/^[A-Z\s]+$/)) {
        // Some names are same in English
      }
      if (loc !== 'en' && enMsg && msg.headline === enMsg.headline) fallbackCount++;
      if (nonLatin.includes(loc) && getLatinRatio(msg.headline) > 0.4) fallbackCount++;
    }

    // Check final narratives
    const fn = finalNarratives[slug] || {};
    const epic = fn[`epic_${loc}`];
    const trials = fn[`trials_${loc}`];
    const overcoming = fn[`overcoming_${loc}`];
    
    if (!epic || epic.trim() === '') {
      isComplete = false;
      report.missing.push(`${slug} (${loc}): epic`);
    } else {
      if (loc !== 'en' && fn.epic_en && epic === fn.epic_en) fallbackCount++;
      if (nonLatin.includes(loc) && getLatinRatio(epic) > 0.3) fallbackCount++;
    }

    if (!trials || trials.trim() === '') {
      isComplete = false;
    } else {
      if (loc !== 'en' && fn.trials_en && trials === fn.trials_en) fallbackCount++;
    }

    // Check fact layer
    const fl = factLayer[slug];
    if (!fl || !fl.timeline || fl.timeline.length === 0) {
      isComplete = false;
      report.missing.push(`${slug} (${loc}): fact-layer`);
    } else {
      const event0 = fl.timeline[0].event;
      if (nonLatin.includes(loc) && getLatinRatio(event0) > 0.3) fallbackCount++;
    }

    if (isComplete) {
      report.completion[loc].complete++;
    } else {
      report.completion[loc].pending++;
    }
    
    report.fallback[loc] += fallbackCount;
  }
}

fs.writeFileSync('scratch/audit-report-raw.json', JSON.stringify(report, null, 2));
console.log('Audit complete.');
