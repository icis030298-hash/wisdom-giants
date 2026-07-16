const fs = require('fs');
const path = require('path');

const projectRoot = __dirname.replace(/\\scripts$/, '');
const koPath = path.join(projectRoot, 'src', 'data', 'fact-layers', 'fact-layer-ko.json');
const slugsPath = path.join(projectRoot, 'scratch', 'en_contaminated_slugs.json');

const koData = JSON.parse(fs.readFileSync(koPath, 'utf8'));
const toTranslate = JSON.parse(fs.readFileSync(slugsPath, 'utf8'));

const batchSize = 10;
let batchIndex = 0;

for (let i = 0; i < toTranslate.length; i += batchSize) {
    const batchSlugs = toTranslate.slice(i, i + batchSize);
    const batchPayload = {};
    
    for (const slug of batchSlugs) {
        const koEntry = koData[slug];
        const payloadEntry = { timeline: [], keyAchievements: [], faq: [] };
        
        if (koEntry.timeline) {
            payloadEntry.timeline = koEntry.timeline.map(t => ({ event: t.event }));
        }
        if (koEntry.keyAchievements) {
            payloadEntry.keyAchievements = koEntry.keyAchievements.map(a => ({ title: a.title, description: a.description }));
        }
        if (koEntry.faq) {
            payloadEntry.faq = koEntry.faq.map(f => ({ question: f.question, answer: f.answer }));
        }
        batchPayload[slug] = payloadEntry;
    }

    const outPath = path.join(projectRoot, 'scratch', `en_input_batch_${batchIndex}.json`);
    fs.writeFileSync(outPath, JSON.stringify(batchPayload, null, 2), 'utf8');
    batchIndex++;
}

console.log(`Generated ${batchIndex} batches for EN translation.`);

// Also prepare EU batches
const euLocales = ['fr', 'es', 'de', 'it'];
const koreanRegex = /[가-힣]/;

for (const locale of euLocales) {
    const localePath = path.join(projectRoot, 'src', 'data', 'fact-layers', `fact-layer-${locale}.json`);
    const localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
    
    const euSlugs = [];
    for (const [slug, entry] of Object.entries(localeData)) {
        let hasKorean = false;
        if (entry.timeline) {
            for (const t of entry.timeline) if (t.event && koreanRegex.test(t.event)) hasKorean = true;
        }
        if (entry.keyAchievements) {
            for (const a of entry.keyAchievements) {
                if ((a.title && koreanRegex.test(a.title)) || (a.description && koreanRegex.test(a.description))) hasKorean = true;
            }
        }
        if (entry.faq) {
            for (const f of entry.faq) {
                if ((f.question && koreanRegex.test(f.question)) || (f.answer && koreanRegex.test(f.answer))) hasKorean = true;
            }
        }
        if (hasKorean) euSlugs.push(slug);
    }
    
    if (euSlugs.length > 0) {
        const euPayload = {};
        for (const slug of euSlugs) {
            const koEntry = koData[slug];
            const payloadEntry = { timeline: [], keyAchievements: [], faq: [] };
            if (koEntry.timeline) payloadEntry.timeline = koEntry.timeline.map(t => ({ event: t.event }));
            if (koEntry.keyAchievements) payloadEntry.keyAchievements = koEntry.keyAchievements.map(a => ({ title: a.title, description: a.description }));
            if (koEntry.faq) payloadEntry.faq = koEntry.faq.map(f => ({ question: f.question, answer: f.answer }));
            euPayload[slug] = payloadEntry;
        }
        const outPath = path.join(projectRoot, 'scratch', `eu_input_batch_${locale}.json`);
        fs.writeFileSync(outPath, JSON.stringify(euPayload, null, 2), 'utf8');
        console.log(`Generated EU batch for ${locale} (${euSlugs.length} entries).`);
    }
}
