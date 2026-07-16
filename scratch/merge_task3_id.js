const fs = require('fs');
const path = require('path');

const factLayersDir = path.join(__dirname, '..', 'src', 'data', 'fact-layers');
const mainFile = path.join(factLayersDir, `fact-layer-id.json`);
const mainData = JSON.parse(fs.readFileSync(mainFile, 'utf8'));

let count = 0;

function applyTranslation(translatedData) {
    for (const slug in translatedData) {
        if (mainData[slug]) {
            if (translatedData[slug].timeline) mainData[slug].timeline = translatedData[slug].timeline;
            if (translatedData[slug].keyAchievements) mainData[slug].keyAchievements = translatedData[slug].keyAchievements;
            if (translatedData[slug].faq) mainData[slug].faq = translatedData[slug].faq;
            
            if (mainData[slug].missingDataNote) {
                delete mainData[slug].missingDataNote;
            }
            count++;
        }
    }
}

// Read original chunk 3, 4
try { applyTranslation(require('./task3_id_out_3.json')); } catch(e) {}
try { applyTranslation(require('./task3_id_out_4.json')); } catch(e) {}

// Read retry chunks 1 to 11
for (let i = 1; i <= 11; i++) {
    try { applyTranslation(require(`./task3_id_retry_out_${i}.json`)); } catch(e) {}
}

// Read retry2 chunks 0 to 4
for (let i = 0; i < 5; i++) {
    try { applyTranslation(require(`./task3_id_retry2_out_${i}.json`)); } catch(e) {}
}

fs.writeFileSync(mainFile, JSON.stringify(mainData, null, 2), 'utf8');
console.log(`Merged ${count} translations into fact-layer-id.json`);
