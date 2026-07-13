const fs = require("fs");

async function translateText(text, loc) {
  let retries = 3;
  while(retries > 0) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${loc}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      let translated = "";
      for (const p of data[0]) {
        translated += p[0];
      }
      return translated;
    } catch(e) {
      retries--;
      if (retries === 0) {
        console.error("Translate error:", e);
        return text;
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

async function processAll() {
  const file = "c:/Users/natey/Desktop/wisdom-giants/scratch/t2-p2-chunk-4.json";
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const out = [];

  let active = 0;
  let done = 0;
  const limit = 5;
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
        const d = data[index];
        (async () => {
          let translated = null;
          if (d.type === "fact-layer" && Array.isArray(d.originalEn)) {
            translated = [];
            for (const item of d.originalEn) {
              if (item.year && item.event) {
                const tYear = await translateText(item.year, d.loc);
                const tEvent = await translateText(item.event, d.loc);
                translated.push({ year: tYear, event: tEvent });
              } else {
                translated.push(item);
              }
            }
          } else if (d.type === "narrative" && typeof d.originalEn === "string") {
            translated = await translateText(d.originalEn, d.loc);
          }
          const res = { ...d };
          if (translated !== null) {
            res.translated = translated;
          }
          return res;
        })().then(res => {
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

  const outFile = "c:/Users/natey/Desktop/wisdom-giants/scratch/t2-p2-out-4.json";
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2));
  console.log("Done. Saved to", outFile);
}
processAll();
