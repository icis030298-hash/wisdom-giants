const fs = require('fs');
const path = require('path');

const projectRoot = __dirname.replace(/\\scripts$/, '');
const enPath = path.join(projectRoot, 'src', 'data', 'fact-layers', 'fact-layer-en.json');

function main() {
    let enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const chunkIds = ['1', '2', '3', '4'];
    let mergedCount = 0;

    for (const chunkId of chunkIds) {
        const chunkPath = path.join(projectRoot, 'scratch', `en_chunk_${chunkId}.json`);
        if (!fs.existsSync(chunkPath)) {
            console.error(`Chunk ${chunkId} missing: ${chunkPath}`);
            continue;
        }

        const chunkData = JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
        
        for (const [slug, trans] of Object.entries(chunkData)) {
            const origEn = enData[slug];
            if (!origEn) continue;

            if (trans.timeline && origEn.timeline) {
                for (let j = 0; j < trans.timeline.length; j++) {
                    if (origEn.timeline[j] && trans.timeline[j] && trans.timeline[j].event) {
                        origEn.timeline[j].event = trans.timeline[j].event;
                    }
                }
            }
            if (trans.keyAchievements && origEn.keyAchievements) {
                for (let j = 0; j < trans.keyAchievements.length; j++) {
                    if (origEn.keyAchievements[j] && trans.keyAchievements[j]) {
                        if (trans.keyAchievements[j].title) origEn.keyAchievements[j].title = trans.keyAchievements[j].title;
                        if (trans.keyAchievements[j].description) origEn.keyAchievements[j].description = trans.keyAchievements[j].description;
                    }
                }
            }
            if (trans.faq && origEn.faq) {
                for (let j = 0; j < trans.faq.length; j++) {
                    if (origEn.faq[j] && trans.faq[j]) {
                        if (trans.faq[j].question) origEn.faq[j].question = trans.faq[j].question;
                        if (trans.faq[j].answer) origEn.faq[j].answer = trans.faq[j].answer;
                    }
                }
            }
            enData[slug] = origEn;
            mergedCount++;
        }
    }

    fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), 'utf8');
    console.log(`Successfully merged ${mergedCount} translated entries into fact-layer-en.json, preserving 'year'.`);
}

main();
