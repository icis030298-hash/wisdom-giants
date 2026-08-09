const fs = require('fs');
const https = require('https');

const locales = ['ar', 'de', 'el', 'en', 'es', 'fa', 'fr', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'sw', 'th', 'tr', 'uk', 'vi', 'zh'];
const priorityLocales = ['fr', 'ko', 'en', 'id', 'fa', 'es', 'ru', 'zh', 'ja'];

// Load the roster
const roster = JSON.parse(fs.readFileSync('scratch/existing_493_roster.json', 'utf8'));

// Load all messages
const messages = {};
for (const l of locales) {
  try {
    messages[l] = JSON.parse(fs.readFileSync(`messages/${l}.json`, 'utf8'));
  } catch (e) {
    messages[l] = {};
  }
}

// 1. Matrix analysis
let missingCount = 0;
let presentCount = 0;
for (const g of roster) {
  for (const l of locales) {
    const name = messages[l]?.Giants?.[g.slug]?.name;
    if (name) presentCount++;
    else missingCount++;
  }
}
console.log(`Matrix: ${presentCount} filled, ${missingCount} empty out of ${493*24}`);

// 2. Wikipedia Fetching
async function fetchWikiLanglinks(titleEn) {
  return new Promise((resolve) => {
    const url = 'https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&titles=' + encodeURIComponent(titleEn) + '&lllimit=500&format=json';
    const options = { headers: { 'User-Agent': 'AntigravityBot/1.0 (https://github.com/google/antigravity)' } };
    
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (!pages) return resolve(null);
          
          const pageId = Object.keys(pages)[0];
          if (pageId === '-1') return resolve(null);
          
          const langlinks = pages[pageId].langlinks || [];
          const links = {};
          for (const l of langlinks) {
            if (priorityLocales.includes(l.lang)) {
              links[l.lang] = l['*'];
            }
          }
          links['en'] = pages[pageId].title; // the resolved english title
          resolve(links);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const discrepancies = {};
  priorityLocales.forEach(l => discrepancies[l] = []);
  
  console.log('Fetching Wikipedia data for 493 giants...');
  for (let i = 0; i < roster.length; i++) {
    const g = roster[i];
    const enName = g.nameEn;
    const wikiData = await fetchWikiLanglinks(enName);
    
    if (wikiData) {
      for (const l of priorityLocales) {
        const localName = messages[l]?.Giants?.[g.slug]?.name;
        const wikiName = wikiData[l];
        
        if (localName && wikiName) {
          if (localName.trim() !== wikiName.trim()) {
            discrepancies[l].push({
              slug: g.slug,
              local: localName,
              wiki: wikiName
            });
          }
        }
      }
    }
    
    // Check for specific duplicate pairs
    if (g.slug === 'ibn-sina' || g.slug === 'avicenna-ibn-sina' || g.slug === 'ibn-rushd' || g.slug === 'averroes-ibn-rushd') {
      console.log(`Special Check [${g.slug}]: WikiData resolved to`, wikiData ? wikiData.en : 'Not found');
    }

    if (i % 50 === 0 && i > 0) console.log(`Processed ${i}/493`);
    await sleep(50);
  }
  
  fs.writeFileSync('scratch/name_discrepancies.json', JSON.stringify(discrepancies, null, 2), 'utf8');
  console.log('Finished. Summary of discrepancies:');
  for (const l of priorityLocales) {
    console.log(`${l}: ${discrepancies[l].length}`);
  }
}

main();
