const fs = require('fs');
const path = require('path');

const factLayersDir = path.join(__dirname, '..', 'src', 'data', 'fact-layers');

function mergeOutput(loc) {
    const mainFile = path.join(factLayersDir, `fact-layer-${loc}.json`);
    const mainData = JSON.parse(fs.readFileSync(mainFile, 'utf8'));

    const outputFile = path.join(__dirname, `task2_${loc}_output.json`);
    if (!fs.existsSync(outputFile)) {
        console.error(`Missing output file for ${loc}`);
        return;
    }
    
    const translatedData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    let count = 0;

    for (const slug in translatedData) {
        if (mainData[slug]) {
            // Overwrite only the translated fields
            if (translatedData[slug].timeline) mainData[slug].timeline = translatedData[slug].timeline;
            if (translatedData[slug].keyAchievements) mainData[slug].keyAchievements = translatedData[slug].keyAchievements;
            if (translatedData[slug].faq) mainData[slug].faq = translatedData[slug].faq;
            
            // Clear any missingDataNote since we translated it
            if (mainData[slug].missingDataNote) {
                delete mainData[slug].missingDataNote;
            }
            
            count++;
        }
    }

    fs.writeFileSync(mainFile, JSON.stringify(mainData, null, 2), 'utf8');
    console.log(`Merged ${count} translations into fact-layer-${loc}.json`);
}

mergeOutput('fr');
mergeOutput('pt');
