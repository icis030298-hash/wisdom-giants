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
const enPath = path.join(projectRoot, 'src', 'data', 'fact-layers', 'fact-layer-en.json');
const slugsPath = path.join(projectRoot, 'scratch', 'en_contaminated_slugs.json');

async function main() {
    const koData = JSON.parse(fs.readFileSync(koPath, 'utf8'));
    let enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const toTranslate = JSON.parse(fs.readFileSync(slugsPath, 'utf8'));

    console.log(`Starting translation for ${toTranslate.length} contaminated EN entries.`);
    console.log(`Strictly preserving 'year' field. Translating only event, title, description, question, answer.`);

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
You are an expert English translator. Translate the following JSON object containing historical giant facts from Korean to English.
CRITICAL: Do NOT translate the keys (like "event", "title", "question", etc), ONLY the values.
Keep the exact same JSON structure. Return ONLY valid JSON.

JSON to translate:
${JSON.stringify(batchPayload, null, 2)}
`;

        try {
            console.log(`Processing batch ${i / batchSize + 1} / ${Math.ceil(toTranslate.length / batchSize)}...`);
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            const translatedBatch = JSON.parse(responseText);
            
            for (const slug of batchSlugs) {
                if (translatedBatch[slug]) {
                    const trans = translatedBatch[slug];
                    const origEn = enData[slug];
                    
                    if (!origEn) {
                        console.error(`ERROR: ${slug} is completely missing from EN data. Cannot preserve year.`);
                        continue;
                    }

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
                } else {
                    console.error(`Warning: Model missed slug ${slug} in output.`);
                }
            }
            completed += batchSlugs.length;
            
            fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), 'utf8');
            console.log(`Progress: ${completed} / ${toTranslate.length} translated.`);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
            console.error(`Error processing batch starting at index ${i}:`, e);
            if (e.message && e.message.includes('429')) {
                console.error("HIT 429 QUOTA LIMIT. EXITING.");
                process.exit(1);
            }
        }
    }
    
    console.log("Translation complete!");
}

main();
