const fs = require('fs');
const path = require('path');

const projectRoot = __dirname.replace(/\\scripts$/, '');

function mergeData(targetPath, sourcePaths) {
    if (!fs.existsSync(targetPath)) return 0;
    const targetData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    let mergedCount = 0;

    for (const sourcePath of sourcePaths) {
        if (!fs.existsSync(sourcePath)) {
            console.error(`Warning: Missing chunk ${sourcePath}`);
            continue;
        }

        const chunkData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
        
        for (const [slug, trans] of Object.entries(chunkData)) {
            const orig = targetData[slug];
            if (!orig) continue;

            if (trans.timeline && orig.timeline) {
                for (let j = 0; j < trans.timeline.length; j++) {
                    if (orig.timeline[j] && trans.timeline[j] && trans.timeline[j].event) {
                        orig.timeline[j].event = trans.timeline[j].event;
                    }
                }
            }
            if (trans.keyAchievements && orig.keyAchievements) {
                for (let j = 0; j < trans.keyAchievements.length; j++) {
                    if (orig.keyAchievements[j] && trans.keyAchievements[j]) {
                        if (trans.keyAchievements[j].title) orig.keyAchievements[j].title = trans.keyAchievements[j].title;
                        if (trans.keyAchievements[j].description) orig.keyAchievements[j].description = trans.keyAchievements[j].description;
                    }
                }
            }
            if (trans.faq && orig.faq) {
                for (let j = 0; j < trans.faq.length; j++) {
                    if (orig.faq[j] && trans.faq[j]) {
                        if (trans.faq[j].question) orig.faq[j].question = trans.faq[j].question;
                        if (trans.faq[j].answer) orig.faq[j].answer = trans.faq[j].answer;
                    }
                }
            }
            targetData[slug] = orig;
            mergedCount++;
        }
    }

    fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2), 'utf8');
    return mergedCount;
}

// 1. Merge EN
const enPaths = [];
for (let i = 0; i < 30; i++) {
    enPaths.push(path.join(projectRoot, 'scratch', `en_output_batch_${i}.json`));
}
const enMerged = mergeData(path.join(projectRoot, 'src', 'data', 'fact-layers', 'fact-layer-en.json'), enPaths);
console.log(`Merged ${enMerged} entries into EN.`);

// 2. Merge EU
const euLocales = ['fr', 'es', 'de', 'it'];
for (const loc of euLocales) {
    const p = [path.join(projectRoot, 'scratch', `eu_output_batch_${loc}.json`)];
    const c = mergeData(path.join(projectRoot, 'src', 'data', 'fact-layers', `fact-layer-${loc}.json`), p);
    console.log(`Merged ${c} entries into ${loc.toUpperCase()}.`);
}
