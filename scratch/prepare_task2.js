const fs = require('fs');
const path = require('path');

const factLayersDir = path.join(__dirname, '..', 'src', 'data', 'fact-layers');

function extractContaminated(loc) {
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
            // We only need to translate timeline, keyAchievements, and faq!
            // We should provide the English source so the subagent can translate from English to the target language!
            contaminated[slug] = {
                timeline: giant.timeline,
                keyAchievements: giant.keyAchievements,
                faq: giant.faq
            };
        }
    }
    return contaminated;
}

const frInput = extractContaminated('fr');
fs.writeFileSync(path.join(__dirname, 'task2_fr_input.json'), JSON.stringify(frInput, null, 2));
console.log(`Extracted ${Object.keys(frInput).length} FR giants.`);

const ptInput = extractContaminated('pt');
fs.writeFileSync(path.join(__dirname, 'task2_pt_input.json'), JSON.stringify(ptInput, null, 2));
console.log(`Extracted ${Object.keys(ptInput).length} PT giants.`);

// We also need the English sources for these giants so the subagent knows what the CORRECT text is!
// If the text is pure Korean or refusal, English source is needed.
const enData = JSON.parse(fs.readFileSync(path.join(factLayersDir, `fact-layer-en.json`), 'utf8'));
const frEnSource = {};
for (const slug in frInput) {
    frEnSource[slug] = {
        timeline: enData[slug].timeline,
        keyAchievements: enData[slug].keyAchievements,
        faq: enData[slug].faq
    };
}
fs.writeFileSync(path.join(__dirname, 'task2_fr_en_source.json'), JSON.stringify(frEnSource, null, 2));

const ptEnSource = {};
for (const slug in ptInput) {
    ptEnSource[slug] = {
        timeline: enData[slug].timeline,
        keyAchievements: enData[slug].keyAchievements,
        faq: enData[slug].faq
    };
}
fs.writeFileSync(path.join(__dirname, 'task2_pt_en_source.json'), JSON.stringify(ptEnSource, null, 2));
