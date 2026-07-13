const fs = require('fs');
const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');

const localKeyPath = path.resolve('..', 'google-service-account.json');
if (!fs.existsSync(localKeyPath)) {
  console.error("google-service-account.json not found");
  process.exit(1);
}
process.env.GOOGLE_APPLICATION_CREDENTIALS = localKeyPath;

const vAI = new VertexAI({
  project: 'giantswisdom-8dc26',
  location: 'us-central1'
});

const model = vAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: 'application/json' }
});

const data = JSON.parse(fs.readFileSync('t2-p2-chunk-8.json', 'utf8'));

async function translateBatch(items, loc, type) {
  let prompt = `You are a professional translator. Translate the following JSON array of contents into the target locale "${loc}".
If the item is a string, translate the string.
If the item is an array of { year, event } objects, translate BOTH year and event. Keep the exact same structure.
Return ONLY a JSON array of the translated results, with the exact same length as the input array.
Do not include original English text, only the translated text/objects.

INPUT:
${JSON.stringify(items, null, 2)}`;

  let attempts = 0;
  while(attempts < 3) {
    try {
      const result = await model.generateContent(prompt);
      let text = '';
      if (result.response && result.response.candidates && result.response.candidates.length > 0) {
          text = result.response.candidates[0].content.parts.map(p => p.text).join('');
      } else {
          throw new Error("Empty response");
      }
      
      let parsed = JSON.parse(text);
      if (!Array.isArray(parsed) || parsed.length !== items.length) {
        throw new Error("Length mismatch or not an array");
      }
      return parsed;
    } catch(e) {
      console.error(`Attempt ${attempts+1} failed:`, e.message);
      attempts++;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error("Failed after 3 attempts");
}

async function main() {
  console.log('Total items:', data.length);
  const outData = [];
  
  let batches = [];
  let currentBatch = [];
  let currentLoc = null;
  let currentType = null;
  
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    
    if (d.type === 'narrative' && Array.isArray(d.originalEn)) {
      const translated = d.originalEn.map(o => {
        let q = o['quote_' + d.loc];
        let m = o['meaning_' + d.loc];
        if (!q) q = o['quote_en'];
        if (!m) m = o['meaning_en'];
        return { quote: q, meaning: m };
      });
      outData[i] = { ...d, translated };
    } else {
      if (currentLoc === d.loc && currentType === d.type && currentBatch.length < 20) {
        currentBatch.push({ index: i, item: d.originalEn });
      } else {
        if (currentBatch.length > 0) {
          batches.push({ loc: currentLoc, type: currentType, items: currentBatch });
        }
        currentLoc = d.loc;
        currentType = d.type;
        currentBatch = [{ index: i, item: d.originalEn }];
      }
    }
  }
  if (currentBatch.length > 0) {
    batches.push({ loc: currentLoc, type: currentType, items: currentBatch });
  }
  
  console.log('Prepared ' + batches.length + ' batches for API translation.');
  
  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    console.log('Processing batch ' + (b+1) + '/' + batches.length + ' (loc: ' + batch.loc + ', type: ' + batch.type + ', items: ' + batch.items.length + ')...');
    
    const itemsToTranslate = batch.items.map(b => b.item);
    const translatedItems = await translateBatch(itemsToTranslate, batch.loc, batch.type);
    
    for (let j = 0; j < batch.items.length; j++) {
      const idx = batch.items[j].index;
      outData[idx] = { ...data[idx], translated: translatedItems[j] };
    }
    
    await new Promise(r => setTimeout(r, 500)); 
  }
  
  fs.writeFileSync('t2-p2-out-8.json', JSON.stringify(outData, null, 2), 'utf8');
  console.log('Saved to t2-p2-out-8.json');
}

main().catch(console.error);
