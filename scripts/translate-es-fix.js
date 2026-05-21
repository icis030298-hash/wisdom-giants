const fs = require('fs');
const path = require('path');
const https = require('https');

// Load API key from .env.local
const envLocalPath = path.join(__dirname, '..', '.env.local');
let apiKey = '';
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const match = content.match(/GEMINI_API_KEY\s*=\s*(.+)/);
  if (match) apiKey = match[1].trim();
}
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

const narrativesPath = path.join(__dirname, '..', 'src', 'data', 'final-narratives.json');
const narrativesData = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

function translateSingle(slug, data) {
  return new Promise((resolve, reject) => {
    const input = {
      era_en: data.era_en,
      epic_en: data.epic_en,
      trials_en: data.trials_en,
      overcoming_en: data.overcoming_en,
      wisdom: (data.wisdom || []).map(w => ({
        quote_en: w.quote_en,
        meaning_en: w.meaning_en
      }))
    };

    const prompt = `You are an expert translator and historian. Translate the following JSON object for the historical figure "${slug}" from English to elegant, natural, historically accurate, and epic Spanish.

Translate the English fields into their corresponding Spanish fields:
- era_en -> era_es
- epic_en -> epic_es
- trials_en -> trials_es
- overcoming_en -> overcoming_es
- inside the wisdom array: quote_en -> quote_es, meaning_en -> meaning_es

RULES:
1. Use an elegant, formal, and literary Spanish style (español literario, solemne y formal).
2. Keep the narrative tone monumental and inspiring for a historical figure.
3. Use historically recognized Spanish quotes or official Spanish translations where applicable.
4. Keep text dense and concise to avoid truncation.
5. Return ONLY valid JSON (no markdown fences), structured exactly like:
{
  "${slug}": {
    "era_es": "...",
    "epic_es": "...",
    "trials_es": "...",
    "overcoming_es": "...",
    "wisdom": [
      { "quote_es": "...", "meaning_es": "..." }
    ]
  }
}

Input:
${JSON.stringify({ [slug]: input }, null, 2)}`;

    const requestData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
        maxOutputTokens: 8192
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      method: 'POST',
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.candidates && json.candidates[0]?.content?.parts[0]) {
            const raw = json.candidates[0].content.parts[0].text.trim();
            const parsed = JSON.parse(raw);
            resolve(parsed);
          } else {
            const errMsg = json.error
              ? `API Error ${json.error.code}: ${json.error.message}`
              : `Empty response: ${body.slice(0, 300)}`;
            reject(new Error(errMsg));
          }
        } catch (e) {
          reject(new Error(`Parse failed: ${e.message}. Body: ${body.slice(0, 300)}`));
        }
      });
    });

    req.on('timeout', () => req.destroy(new Error('Timeout after 120s')));
    req.on('error', reject);
    req.write(requestData);
    req.end();
  });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function translateWithRetry(slug, data, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await translateSingle(slug, data);
    } catch (err) {
      console.warn(`  [Attempt ${attempt}/${retries}] Failed: ${err.message}`);
      if (err.message.includes('429') || err.message.toLowerCase().includes('quota')) {
        console.warn('  ⚠️  Rate limit hit! Sleeping 65s...');
        await sleep(65000);
        attempt--;
        continue;
      }
      if (attempt === retries) throw err;
      await sleep(3000 * attempt);
    }
  }
}

async function run() {
  const slugs = Object.keys(narrativesData);
  // Audit which giants are missing era_es or epic_es
  const todo = slugs.filter(s => !narrativesData[s].epic_es);

  console.log(`\n🇪🇸 Spanish Narrative Translation Fix`);
  console.log(`   Total: ${slugs.length} giants | Done: ${slugs.length - todo.length} giants | Todo: ${todo.length} giants\n`);

  if (todo.length === 0) {
    console.log('🎉 All giants already have Spanish narratives!');
    return;
  }

  for (let i = 0; i < todo.length; i++) {
    const slug = todo[i];
    console.log(`[${i + 1}/${todo.length}] Translating to Spanish: ${slug}`);

    try {
      const result = await translateWithRetry(slug, narrativesData[slug]);
      if (result[slug]) {
        const t = result[slug];
        narrativesData[slug].era_es = t.era_es;
        narrativesData[slug].epic_es = t.epic_es;
        narrativesData[slug].trials_es = t.trials_es;
        narrativesData[slug].overcoming_es = t.overcoming_es;

        if (t.wisdom && narrativesData[slug].wisdom) {
          for (let j = 0; j < narrativesData[slug].wisdom.length; j++) {
            if (t.wisdom[j]) {
              narrativesData[slug].wisdom[j].quote_es = t.wisdom[j].quote_es;
              narrativesData[slug].wisdom[j].meaning_es = t.wisdom[j].meaning_es;
            }
          }
        }
        fs.writeFileSync(narrativesPath, JSON.stringify(narrativesData, null, 2));
        console.log(`  ✓ Done & saved: ${slug}`);
      } else {
        console.warn(`  ⚠️  No result for: ${slug}`);
      }
    } catch (err) {
      console.error(`  ❌ Failed: ${slug} — ${err.message}`);
    }

    // 2s delay between calls to stay under rate limit
    await sleep(2000);
  }

  console.log('\n✅ Spanish translation complete! All saved to final-narratives.json');
}

run();
