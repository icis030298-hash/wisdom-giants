require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('GEMINI_API_KEY not found in .env.local');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });

const projectRoot = __dirname.replace(/\\scripts$/, '');
const koPath = path.join(projectRoot, 'src', 'data', 'fact-layers', 'fact-layer-ko.json');
const koData = JSON.parse(fs.readFileSync(koPath, 'utf8'));

const targetLocales = ['fr', 'es', 'de', 'it'];
const localeNames = {
    'fr': 'French',
    'es': 'Spanish',
    'de': 'German',
    'it': 'Italian'
};
const koreanRegex = /[가-힣]/;

async function processLocale(locale) {
    const localePath = path.join(projectRoot, 'src', 'data', 'fact-layers', `fact-layer-${locale}.json`);
    let localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
    
    // 1. Identify contaminated slugs
    const toTranslate = [];
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
        if (hasKorean) {
            toTranslate.push(slug);
        }
    }

    if (toTranslate.length === 0) {
        console.log(`[${locale.toUpperCase()}] No contaminated entries found.`);
        return;
    }

    console.log(`\n[${locale.toUpperCase()}] Starting translation for ${toTranslate.length} contaminated entries into ${localeNames[locale]}.`);

    const batchSize = 10;
    let completed = 0;

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

        const prompt = `
You are an expert ${localeNames[locale]} translator. Translate the following JSON object containing historical giant facts from Korean to ${localeNames[locale]}.
CRITICAL: Do NOT translate the keys (like "event", "title", "question", etc), ONLY the values.
Keep the exact same JSON structure. Return ONLY valid JSON.

JSON to translate:
${JSON.stringify(batchPayload, null, 2)}
`;

        try {
            console.log(`[${locale.toUpperCase()}] Processing batch ${i / batchSize + 1} / ${Math.ceil(toTranslate.length / batchSize)}...`);
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            const translatedBatch = JSON.parse(responseText);
            
            for (const slug of batchSlugs) {
                if (translatedBatch[slug]) {
                    const trans = translatedBatch[slug];
                    const origLocal = localeData[slug];
                    
                    if (!origLocal) continue;

                    if (trans.timeline && origLocal.timeline) {
                        for (let j = 0; j < trans.timeline.length; j++) {
                            if (origLocal.timeline[j] && trans.timeline[j] && trans.timeline[j].event) {
                                origLocal.timeline[j].event = trans.timeline[j].event;
                            }
                        }
                    }
                    if (trans.keyAchievements && origLocal.keyAchievements) {
                        for (let j = 0; j < trans.keyAchievements.length; j++) {
                            if (origLocal.keyAchievements[j] && trans.keyAchievements[j]) {
                                if (trans.keyAchievements[j].title) origLocal.keyAchievements[j].title = trans.keyAchievements[j].title;
                                if (trans.keyAchievements[j].description) origLocal.keyAchievements[j].description = trans.keyAchievements[j].description;
                            }
                        }
                    }
                    if (trans.faq && origLocal.faq) {
                        for (let j = 0; j < trans.faq.length; j++) {
                            if (origLocal.faq[j] && trans.faq[j]) {
                                if (trans.faq[j].question) origLocal.faq[j].question = trans.faq[j].question;
                                if (trans.faq[j].answer) origLocal.faq[j].answer = trans.faq[j].answer;
                            }
                        }
                    }
                    localeData[slug] = origLocal;
                } else {
                    console.error(`Warning: Model missed slug ${slug} in output.`);
                }
            }
            completed += batchSlugs.length;
            
            fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2), 'utf8');
            console.log(`[${locale.toUpperCase()}] Progress: ${completed} / ${toTranslate.length} translated.`);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
            console.error(`[${locale.toUpperCase()}] Error processing batch starting at index ${i}:`, e);
            if (e.message && e.message.includes('429')) {
                console.error("HIT 429 QUOTA LIMIT. EXITING.");
                process.exit(1);
            }
        }
    }
    console.log(`[${locale.toUpperCase()}] Translation complete!`);
}

async function runAll() {
    for (const loc of targetLocales) {
        await processLocale(loc);
    }
    console.log('\nAll EU targeted translations complete!');
}

runAll();
