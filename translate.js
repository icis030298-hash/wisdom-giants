const fs = require('fs');
const { translate } = require('@vitalets/google-translate-api');

const data = require('./scratch/t2-p2-chunk-2.json');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function doTranslate(text, to) {
  if (!text) return text;
  let retries = 5;
  while (retries > 0) {
    try {
      const res = await translate(text, { to });
      return res.text;
    } catch (e) {
      if (e.name === 'TooManyRequestsError' || (e.response && e.response.status === 429)) {
        console.log('Rate limited, sleeping...');
        await sleep(5000 + Math.random() * 5000);
        retries--;
      } else {
        console.error('Translation error:', e.message);
        return text;
      }
    }
  }
  return text;
}

async function processData() {
  const output = [];
  let translatedCount = 0;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const loc = item.loc; // e.g. 'es', 'fr'
    const outItem = { ...item };

    if (item.type === 'fact-layer') {
      const parts = [];
      for (const obj of item.originalEn) {
        parts.push(obj.year);
        parts.push(obj.event);
      }
      
      const combined = parts.join(' ||| ');
      const translatedCombined = await doTranslate(combined, loc);
      const translatedParts = translatedCombined.split(/\s*\|\|\|\s*/);
      
      const translatedArr = [];
      for (let j = 0; j < item.originalEn.length; j++) {
        translatedArr.push({
          year: translatedParts[j * 2] || item.originalEn[j].year,
          event: translatedParts[j * 2 + 1] || item.originalEn[j].event
        });
      }
      outItem.translated = translatedArr;
      translatedCount++;
    } else if (item.type === 'narrative') {
      if (typeof item.originalEn === 'string') {
        outItem.translated = await doTranslate(item.originalEn, loc);
        translatedCount++;
      } else if (Array.isArray(item.originalEn)) {
        const translatedArr = [];
        for (const obj of item.originalEn) {
           translatedArr.push({
             quote: obj['quote_' + loc] || obj.quote_en,
             meaning: obj['meaning_' + loc] || obj.meaning_en
           });
        }
        outItem.translated = translatedArr;
      }
    } else {
      outItem.translated = item.originalEn; // fallback
    }

    output.push(outItem);

    if ((i + 1) % 50 === 0) {
      console.log(`Processed ${i + 1}/${data.length}`);
      fs.writeFileSync('./scratch/t2-p2-out-2.json', JSON.stringify(output, null, 2));
    }
    
    // Add small delay to prevent rate limits
    await sleep(200);
  }

  fs.writeFileSync('./scratch/t2-p2-out-2.json', JSON.stringify(output, null, 2));
  console.log(`Done. Translated ${translatedCount} items with API.`);
}

processData().catch(console.error);
