const fs = require('fs');

const tier1 = ['es', 'fr', 'de', 'it', 'pt', 'pl', 'nl', 'id', 'vi'];
const fn = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
const factLayerEn = JSON.parse(fs.readFileSync('src/data/fact-layers/fact-layer-en.json', 'utf8'));

// We need to translate ALL English text that is MISSING or FALLBACK in Tier 1.
// We can just rely on the fact that if a key is missing or matches English, it needs translation.

const tasks = [];

const giantsList = Object.keys(fn);

for (const loc of tier1) {
  let factLayerLoc = {};
  try {
    factLayerLoc = JSON.parse(fs.readFileSync(`src/data/fact-layers/fact-layer-${loc}.json`, 'utf8'));
  } catch (e) { }

  for (const slug of giantsList) {
    const data = fn[slug];
    const enKeys = ['epic', 'trials', 'overcoming'];
    
    enKeys.forEach(k => {
      const enKey = k === 'wisdom' ? 'wisdom' : `${k}_en`;
      const locKey = k === 'wisdom' ? 'wisdom' : `${k}_${loc}`;
      
      const enText = data[enKey];
      const locText = data[locKey];
      
      if (enText) {
        let isSame = false;
        if (typeof locText === 'object') {
          isSame = JSON.stringify(locText) === JSON.stringify(enText);
        } else {
          isSame = locText === enText;
        }
        
        if (!locText || isSame || JSON.stringify(locText).includes('compiled') || JSON.stringify(locText).includes('coming soon') || JSON.stringify(locText).includes('being documented')) {
          tasks.push({ slug, loc, type: 'narrative', key: locKey, originalEn: enText });
        }
      }
    });
    
    const flEn = factLayerEn[slug];
    const flLoc = factLayerLoc[slug];
    
    if (flEn && flEn.timeline) {
      if (!flLoc || !flLoc.timeline || JSON.stringify(flLoc.timeline) === JSON.stringify(flEn.timeline)) {
        tasks.push({ slug, loc, type: 'fact-layer', originalEn: flEn.timeline });
      } else {
        // If it's literally "Achievements and legacy being documented.", that's a dummy.
        const firstEvent = flLoc.timeline[0] ? flLoc.timeline[0].event : '';
        if (firstEvent.includes('being documented') || firstEvent.includes('compiled') || firstEvent.includes('coming soon')) {
           tasks.push({ slug, loc, type: 'fact-layer', originalEn: flEn.timeline });
        }
      }
    }
  }
}

console.log(`Extracted ${tasks.length} tasks for Tier 1.`);

// Split into 9 chunks (1 per subagent)
const numAgents = 10; // Use 10 agents
const chunkSize = Math.ceil(tasks.length / numAgents);
for (let i = 0; i < numAgents; i++) {
  fs.writeFileSync(`scratch/t2-p2-chunk-${i+1}.json`, JSON.stringify(tasks.slice(i * chunkSize, (i+1) * chunkSize), null, 2));
}

console.log('Chunked into scratch/t2-p2-chunk-[1-10].json');
