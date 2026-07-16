const fs = require('fs');
const path = require('path');

const targetLocales = ['id', 'pl', 'sw', 'ha', 'nl'];
const factLayersDir = path.join(__dirname, '..', 'src', 'data', 'fact-layers');

// We also need the English sources for these giants so the subagent knows what the CORRECT text is!
const enData = JSON.parse(fs.readFileSync(path.join(factLayersDir, `fact-layer-en.json`), 'utf8'));

for (const loc of targetLocales) {
    const file = path.join(factLayersDir, `fact-layer-${loc}.json`);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    const contaminated = {};
    for (const slug in data) {
        const giant = data[slug];
        let isContaminated = false;

        const checkField = (text) => {
            if (typeof text === 'string' && /[가-힣]/.test(text)) {
                isContaminated = true;
            }
        };

        if (giant.timeline) giant.timeline.forEach(t => checkField(t.event));
        if (giant.keyAchievements) giant.keyAchievements.forEach(a => { checkField(a.title); checkField(a.description); });
        if (giant.faq) giant.faq.forEach(f => { checkField(f.question); checkField(f.answer); });

        if (isContaminated) {
            contaminated[slug] = {
                timeline: enData[slug].timeline,
                keyAchievements: enData[slug].keyAchievements,
                faq: enData[slug].faq
            };
        }
    }
    
    // Write the English source of the contaminated giants for this locale
    const outPath = path.join(__dirname, `task3_${loc}_en_source.json`);
    fs.writeFileSync(outPath, JSON.stringify(contaminated, null, 2));
    console.log(`Extracted ${Object.keys(contaminated).length} EN source giants for ${loc.toUpperCase()}. Saved to ${outPath}`);
}
