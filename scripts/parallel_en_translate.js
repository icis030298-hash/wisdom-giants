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
const slugsPath = path.join(projectRoot, 'scratch', 'en_contaminated_slugs.json');

const args = process.argv.slice(2);
if (args.length < 3) {
    console.error("Usage: node parallel_en_translate.js <startIndex> <endIndex> <chunkId>");
    process.exit(1);
}

const startIndex = parseInt(args[0], 10);
const endIndex = parseInt(args[1], 10);
const chunkId = args[2];
const outPath = path.join(projectRoot, 'scratch', `en_chunk_${chunkId}.json`);

async function main() {
    const koData = JSON.parse(fs.readFileSync(koPath, 'utf8'));
    const allSlugs = JSON.parse(fs.readFileSync(slugsPath, 'utf8'));
    const toTranslate = allSlugs.slice(startIndex, endIndex);

    console.log(`[Chunk ${chunkId}] Starting translation for ${toTranslate.length} entries (index ${startIndex} to ${endIndex}).`);

    const chunkData = {};
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
            console.log(`[Chunk ${chunkId}] Processing batch ${i / batchSize + 1} / ${Math.ceil(toTranslate.length / batchSize)}...`);
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            const translatedBatch = JSON.parse(responseText);
            
            for (const slug of batchSlugs) {
                if (translatedBatch[slug]) {
                    chunkData[slug] = translatedBatch[slug];
                } else {
                    console.error(`[Chunk ${chunkId}] Warning: Model missed slug ${slug} in output.`);
                }
            }
            completed += batchSlugs.length;
            
            fs.writeFileSync(outPath, JSON.stringify(chunkData, null, 2), 'utf8');
            console.log(`[Chunk ${chunkId}] Progress: ${completed} / ${toTranslate.length} translated.`);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
            console.error(`[Chunk ${chunkId}] Error processing batch starting at index ${i}:`, e);
            if (e.message && e.message.includes('429')) {
                console.error(`[Chunk ${chunkId}] HIT 429 QUOTA LIMIT. Waiting 10s before retry...`);
                await new Promise(resolve => setTimeout(resolve, 10000));
                i -= batchSize; // retry batch
            }
        }
    }
    
    console.log(`[Chunk ${chunkId}] Translation complete!`);
}

main();
