const fs = require('fs');
const { translate } = require('@vitalets/google-translate-api');

const chunkId = process.argv[2];
if (chunkId === undefined) {
  console.error('Please provide a chunk ID.');
  process.exit(1);
}

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
        console.log(`[Worker ${chunkId}] Rate limited, sleeping...`);
        await sleep(5000 + Math.random() * 5000);
        retries--;
      } else {
        console.error(`[Worker ${chunkId}] Translation error:`, e.message);
        return text;
      }
    }
  }
  return text;
}

async function processChunk() {
  console.log(`\n=== [Worker ${chunkId}] Starting retry chunk ${chunkId} ===`);
  const inFile = `./scratch/task3_pl_retry_chunk_${chunkId}.json`;
  const outFile = `./scratch/task3_pl_retry_out_${chunkId}.json`;
  
  if (fs.existsSync(outFile)) {
    console.log(`[Worker ${chunkId}] Output ${outFile} already exists, skipping...`);
    return;
  }
  
  if (!fs.existsSync(inFile)) {
    console.log(`[Worker ${chunkId}] Input ${inFile} does not exist, skipping...`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(inFile, 'utf8'));
  const output = {};
  const keys = Object.keys(data);
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    console.log(`[Worker ${chunkId}] Processing ${key} (${i + 1}/${keys.length})`);
    const item = data[key];
    const outItem = {
      timeline: [],
      keyAchievements: [],
      faq: []
    };

    if (item.timeline) {
      for (const t of item.timeline) {
        outItem.timeline.push({
          year: t.year,
          event: await doTranslate(t.event, 'pl')
        });
        await sleep(200);
      }
    }

    if (item.keyAchievements) {
      for (const a of item.keyAchievements) {
        outItem.keyAchievements.push({
          title: await doTranslate(a.title, 'pl'),
          description: await doTranslate(a.description, 'pl')
        });
        await sleep(200);
      }
    }

    if (item.faq) {
      for (const f of item.faq) {
        outItem.faq.push({
          question: await doTranslate(f.question, 'pl'),
          answer: await doTranslate(f.answer, 'pl')
        });
        await sleep(200);
      }
    }

    output[key] = outItem;
    fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
  }
  console.log(`[Worker ${chunkId}] Completed!`);
}

processChunk().catch(console.error);
