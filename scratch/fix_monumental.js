const fs = require('fs');
const path = require('path');
const https = require('https');

// Load API Key
const envLocalPath = path.join(__dirname, '..', '.env.local');
let apiKey = '';
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const match = content.match(/GEMINI_API_KEY\s*=\s*(.+)/);
  if (match) {
    apiKey = match[1].trim();
  }
}

if (!apiKey) {
  console.error("API Key not found in .env.local!");
  process.exit(1);
}

const dbPath = path.join(__dirname, '../src/data/final-narratives.json');
if (!fs.existsSync(dbPath)) {
  console.error("final-narratives.json not found!");
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Helper to call Gemini API for rewriting
function rewriteNarrative(epicText) {
  const prompt = `You are a professional copywriter. Below is a biographical epic narrative in English. The word "monumental" is heavily overused.
Rewrite the narrative by replacing occurrences of the word "monumental" (case-insensitive) with context-appropriate synonyms (e.g., extraordinary, profound, remarkable, sweeping, immense, significant, historic, transformative, enduring, colossal, etc.) to improve vocabulary variety and readability. 
Do NOT replace other words unless necessary. Do NOT change the meaning or the overall structure of the narrative.

Original narrative:
${epicText}

Output ONLY the rewritten narrative text. Do not wrap it in markdown block or write any comments.`;

  const requestData = JSON.stringify({
    contents: [{
      parts: [{ text: prompt }]
    }]
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
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
        if (res.statusCode !== 200) {
          reject(new Error(`API Error: ${res.statusCode} - ${data}`));
          return;
        }
        try {
          const parsed = JSON.parse(data);
          let text = parsed.candidates[0].content.parts[0].text;
          // Strip markdown code block wrappers if any
          if (text.startsWith('```')) {
            text = text.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
          }
          resolve(text.trim());
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (err) => { reject(err); });
    req.write(requestData);
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const giantsToFix = [];
  
  Object.entries(db).forEach(([slug, data]) => {
    const epic = data.epic_en || data.epic?.en || '';
    const matches = (epic.match(/monumental/gi) || []).length;
    if (matches >= 3) {
      giantsToFix.push({ slug, epic, matches });
    }
  });

  console.log(`Found ${giantsToFix.length} giants with 3+ occurrences of 'monumental'.`);

  for (let i = 0; i < giantsToFix.length; i++) {
    const item = giantsToFix[i];
    console.log(`[${i + 1}/${giantsToFix.length}] Rewriting for: ${item.slug} (${item.matches} occurrences)`);
    
    let success = false;
    let retries = 0;
    
    while (!success && retries < 3) {
      try {
        const rewritten = await rewriteNarrative(item.epic);
        
        // Update database
        if (db[item.slug].epic_en) {
          db[item.slug].epic_en = rewritten;
        } else if (db[item.slug].epic && db[item.slug].epic.en) {
          db[item.slug].epic.en = rewritten;
        }
        
        // Save database periodically
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
        
        console.log(`  Success!`);
        success = true;
      } catch (err) {
        retries++;
        console.error(`  Error (Attempt ${retries}/3):`, err.message);
        await sleep(5000);
      }
    }
    
    // Sleep a bit to avoid hitting rate limits
    await sleep(2000);
  }

  console.log("All monumental overuses successfully corrected!");
}

run().catch(err => {
  console.error("Critical error in rewrite loop:", err);
  process.exit(1);
});
