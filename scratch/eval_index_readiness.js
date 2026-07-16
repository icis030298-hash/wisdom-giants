const fs = require('fs');
const path = require('path');

const targetLocales = ['fr', 'it', 'nl', 'id', 'pt', 'sw', 'ha', 'pl'];
const dataDir = path.join(__dirname, '..', 'src', 'data');
const factLayersDir = path.join(dataDir, 'fact-layers');
const narrativesDir = path.join(dataDir, 'narratives');

const results = {};

for (const loc of targetLocales) {
    results[loc] = {
        factLayerKorean: 0,
        narrativeMissing: 0,
        narrativeKorean: 0,
        eraLocalized: true, // Will set to false if we find Korean in 'era' or 'era' is just english/korean
        eraSamples: []
    };

    // 1. Check Fact-Layer
    const factFile = path.join(factLayersDir, `fact-layer-${loc}.json`);
    let factData = {};
    if (fs.existsSync(factFile)) {
        factData = JSON.parse(fs.readFileSync(factFile, 'utf8'));
        const factStr = JSON.stringify(factData);
        // Count rough occurrences of Korean in the whole fact-layer
        const koMatches = factStr.match(/[가-힣]+/g);
        results[loc].factLayerKorean = koMatches ? koMatches.length : 0;
        
        // Also check era field specifically
        let eraHasKorean = false;
        let eraUnlocalizedCount = 0;
        const erasFound = new Set();
        
        for (const slug in factData) {
            const giant = factData[slug];
            if (giant.era) {
                erasFound.add(giant.era);
                if (/[가-힣]/.test(giant.era)) {
                    eraHasKorean = true;
                }
            }
        }
        
        results[loc].eraSamples = Array.from(erasFound).slice(0, 3);
        if (eraHasKorean) {
            results[loc].eraLocalized = false;
        }
    } else {
        results[loc].factLayerKorean = -1; // File missing
    }
}

// 2. Check Narratives
const files = fs.readdirSync(narrativesDir).filter(f => f.endsWith('.json'));
const totalGiants = files.length;

for (const file of files) {
    const filePath = path.join(narrativesDir, file);
    const narrativeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    for (const loc of targetLocales) {
        const epicKey = `epic_${loc}`;
        const descKey = `description_${loc}`;
        
        const epicText = narrativeData[epicKey] || '';
        const descText = narrativeData[descKey] || '';
        
        const fullText = epicText + ' ' + descText;
        
        if (!epicText.trim() && !descText.trim()) {
            results[loc].narrativeMissing++;
        } else if (/[가-힣]/.test(fullText)) {
            // Count how many giants have Korean in their narrative for this locale
            results[loc].narrativeKorean++;
        }
    }
}

console.log("=== Index Readiness Evaluation ===");
console.log(`Total Narrative Files Checked: ${totalGiants}\n`);

for (const loc of targetLocales) {
    console.log(`Locale: [${loc.toUpperCase()}]`);
    console.log(` - Fact-Layer Korean Occurrences: ${results[loc].factLayerKorean === 0 ? '0 (Perfect)' : results[loc].factLayerKorean}`);
    console.log(` - Narrative Missing: ${results[loc].narrativeMissing} / ${totalGiants}`);
    console.log(` - Narrative Korean Contamination (Giants affected): ${results[loc].narrativeKorean === 0 ? '0 (Perfect)' : results[loc].narrativeKorean}`);
    console.log(` - Era Field Localized?: ${results[loc].eraLocalized ? 'Yes' : 'No (Contains Korean)'}`);
    console.log(` - Era Samples: ${results[loc].eraSamples.join(', ')}`);
    console.log('--------------------------------------------------');
}
