const fs = require('fs');
const { translate } = require('@vitalets/google-translate-api');

const data = require('./scratch/task3_pl_chunk_1.json');

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
  const output = {};
  const keys = Object.keys(data);
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    console.log(`Processing ${key} (${i + 1}/${keys.length})`);
    const item = data[key];
    const outItem = {
      timeline: [],
      keyAchievements: [],
      faq: []
    };

    // Translate timeline (skip year)
    if (item.timeline) {
      for (const t of item.timeline) {
        outItem.timeline.push({
          year: t.year,
          event: await doTranslate(t.event, 'pl')
        });
        await sleep(200);
      }
    }

    // Translate keyAchievements
    if (item.keyAchievements) {
      for (const a of item.keyAchievements) {
        outItem.keyAchievements.push({
          title: await doTranslate(a.title, 'pl'),
          description: await doTranslate(a.description, 'pl')
        });
        await sleep(200);
      }
    }

    // Translate faq
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

    fs.writeFileSync('./scratch/task3_pl_out_1.json', JSON.stringify(output, null, 2));
  }

  console.log('Done processing.');
}

processData().catch(console.error);
