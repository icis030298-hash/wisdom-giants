const fs = require("fs");
const path = require("path");

const API_KEY = "AIzaSyCP2vSd3RenFFbccY5hTxZ_WUGmIAxR91c";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

async function translateText(text, loc, isFact) {
  const prompt = isFact 
    ? `Translate the following event into ${loc} locale. Output ONLY the translated text without quotes or markdown.\n\n${text}`
    : `Translate the following narrative into ${loc} locale. Output ONLY the translated text without quotes or markdown.\n\n${text}`;
    
  let retries = 3;
  while(retries > 0) {
    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1 }
        })
      });
      if (!res.ok) {
        if(res.status === 429) {
          await new Promise(r => setTimeout(r, 2000));
          retries--;
          continue;
        }
        throw new Error("HTTP " + res.status);
      }
      const data = await res.json();
      return data.candidates[0].content.parts[0].text.trim();
    } catch(e) {
      retries--;
      if (retries === 0) {
        console.error("Translation error", e);
        return text;
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

async function processItem(d) {
  let translated = null;

  if (d.type === "fact-layer" && Array.isArray(d.originalEn)) {
    translated = [];
    for (const item of d.originalEn) {
      if (item.year && item.event) {
        const [tYear, tEvent] = await Promise.all([
          translateText(item.year, d.loc, true),
          translateText(item.event, d.loc, true)
        ]);
        translated.push({ year: tYear, event: tEvent });
      } else {
        translated.push(item);
      }
    }
  } else if (d.type === "narrative" && typeof d.originalEn === "string") {
    translated = await translateText(d.originalEn, d.loc, false);
  }

  const res = { ...d };
  if (translated !== null) {
    res.translated = translated;
  }
  return res;
}

async function processAll() {
  const file = "c:/Users/natey/Desktop/wisdom-giants/scratch/t2-p2-chunk-4.json";
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const out = [];

  let active = 0;
  let done = 0;
  const limit = 15;
  let i = 0;
  
  await new Promise((resolve) => {
    function next() {
      if (i >= data.length && active === 0) {
        resolve();
        return;
      }
      while(active < limit && i < data.length) {
        const index = i++;
        active++;
        processItem(data[index]).then(res => {
          out[index] = res;
          active--;
          done++;
          if (done % 50 === 0) console.log(`Processed ${done}/${data.length}`);
          next();
        });
      }
    }
    next();
  });

  fs.writeFileSync("c:/Users/natey/Desktop/wisdom-giants/scratch/t2-p2-out-4-temp.json", JSON.stringify(out, null, 2));
  console.log("Done. Saved to temp file.");
}
processAll();
