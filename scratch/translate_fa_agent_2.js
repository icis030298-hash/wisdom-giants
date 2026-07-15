const fs = require('fs');
const path = require('path');
const https = require('https');

const envLocalPath = path.join(__dirname, '..', '.env.local');
let apiKey = '';
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const match = content.match(/NEXT_PUBLIC_GEMINI_API_KEY\s*=\s*(.+)/);
  if (match) {
    apiKey = match[1].trim();
  }
}

if (!apiKey) {
    console.error("API key not found!");
    process.exit(1);
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function translateChunk(jsonChunk) {
    const prompt = `You are a professional Persian translator. Translate the following JSON object into Persian (fa). 
CRITICAL RULES:
1. Keep all JSON keys in English exactly as they are (e.g. 'timeline', 'year', 'event', 'title', 'keyAchievements', 'question', etc.).
2. The 'slug' value MUST remain in English.
3. The 'sourceVerified' boolean MUST remain a boolean.
4. ALL OTHER STRING VALUES must be translated into Persian.
5. The 'year' field MUST be translated into Persian literally from Korean.
6. Ensure absolutely NO Korean characters AND NO Latin/English alphabet characters remain in the translated string values. Everything must be in Persian/Arabic script. 
7. Use Persian numerals (۱, ۲, ۳, ۴, ۵, ۶, ۷, ۸, ۹, ۰) instead of Arabic or Western numerals for all numbers.

Input JSON:
${JSON.stringify(jsonChunk, null, 2)}

Return ONLY the valid translated JSON block. Do NOT wrap in markdown \`\`\`json blocks.`;

    const requestData = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestData)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const responseObj = JSON.parse(data);
                        let text = responseObj.candidates[0].content.parts[0].text;
                        text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
                        resolve(JSON.parse(text));
                    } catch (e) {
                        console.log("Error parsing response:", data);
                        reject(e);
                    }
                } else {
                    reject(new Error(`Status Code: ${res.statusCode}, Body: ${data}`));
                }
            });
        });
        req.on('error', reject);
        req.write(requestData);
        req.end();
    });
}

async function main() {
    const inFile = path.join(__dirname, 'fa_agent_2.json');
    const outFile = path.join(__dirname, 'fa_agent_2_out.json');

    const data = JSON.parse(fs.readFileSync(inFile, 'utf8'));
    let outData = {};
    if (fs.existsSync(outFile)) {
        try { outData = JSON.parse(fs.readFileSync(outFile, 'utf8')); } catch (e) {}
    }

    const keys = Object.keys(data);
    for (const key of keys) {
        if (outData[key]) {
            console.log(`Skipping ${key}, already translated.`);
            continue;
        }
        console.log(`Translating ${key}...`);
        
        let success = false;
        let retries = 3;
        while (!success && retries > 0) {
            try {
                const translated = await translateChunk(data[key]);
                outData[key] = translated;
                fs.writeFileSync(outFile, JSON.stringify(outData, null, 2), 'utf8');
                success = true;
                console.log(`Success for ${key}`);
            } catch (err) {
                console.error(`Error translating ${key}:`, err.message);
                retries--;
                await sleep(2000);
            }
        }
        if (!success) {
            console.error(`Failed to translate ${key} after 3 retries.`);
        }
    }
    console.log('FA BATCH 2 COMPLETED');
}

main();
