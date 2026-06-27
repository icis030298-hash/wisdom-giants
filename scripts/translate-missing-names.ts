import fs from 'fs';
import path from 'path';
import https from 'https';

// Load API key from .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
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

const koJsonPath = path.resolve(process.cwd(), 'messages/ko.json');
const koJson = JSON.parse(fs.readFileSync(koJsonPath, 'utf8'));
const reportPath = path.resolve(process.cwd(), 'scripts/completeness-report.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

const missingNamesSlugs = report.missingNames; // 59 slugs

async function translateNames() {
  console.log(`Translating ${missingNamesSlugs.length} names to Korean...`);
  
  // Prepare items to translate
  const items = missingNamesSlugs.map((slug: string) => {
    const data = koJson.Giants[slug] || {};
    return {
      slug,
      englishName: data.name || slug
    };
  });

  const prompt = `You are an expert translator and historian. Translate the following list of historical figure names from English to standard, historically recognized Korean names.
Return the output strictly in JSON format as a map of slug to translated Korean name:
{
  "slug": "Korean Name"
}

Do not include markdown tags.

List:
${JSON.stringify(items, null, 2)}`;

  const requestData = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1
    }
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    method: 'POST',
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
          
          // Apply translations to koJson
          let count = 0;
          for (const slug in parsed) {
            if (koJson.Giants[slug]) {
              console.log(`Translating: ${koJson.Giants[slug].name} -> ${parsed[slug]}`);
              koJson.Giants[slug].name = parsed[slug];
              count++;
            }
          }
          
          fs.writeFileSync(koJsonPath, JSON.stringify(koJson, null, 2), 'utf8');
          console.log(`Successfully translated and saved ${count} names to messages/ko.json!`);
        } else {
          console.error('Empty response from Gemini API', body);
        }
      } catch (e) {
        console.error('Error parsing response:', e, body);
      }
    });
  });

  req.on('error', (e) => {
    console.error('Request error:', e);
  });

  req.write(requestData);
  req.end();
}

translateNames();
