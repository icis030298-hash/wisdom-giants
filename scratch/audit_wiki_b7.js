const fs = require('fs');

const languages = ['ar', 'de', 'el', 'en', 'es', 'fa', 'fr', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'sw', 'th', 'tr', 'uk', 'vi', 'zh'];

async function main() {
  const data = JSON.parse(fs.readFileSync('scratch/name_audit_final_batch_7.json', 'utf8'));
  const mismatches = [];

  for (const giant of data) {
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(giant.nameEn)}&language=en&format=json`;
    const searchRes = await fetch(searchUrl, { headers: { 'User-Agent': 'AntigravityBot/1.0 (test@example.com)' } }).then(r => r.json());
    
    if (!searchRes || !searchRes.search || searchRes.search.length === 0) {
      console.log('Not found:', giant.nameEn);
      continue;
    }
    const qid = searchRes.search[0].id;

    const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=sitelinks&format=json`;
    const entityRes = await fetch(entityUrl, { headers: { 'User-Agent': 'AntigravityBot/1.0 (test@example.com)' } }).then(r => r.json());
    if (!entityRes || !entityRes.entities || !entityRes.entities[qid]) continue;

    const sitelinks = entityRes.entities[qid].sitelinks;
    if (!sitelinks) {
        console.log('No sitelinks for:', giant.nameEn);
        continue;
    }

    for (const lang of languages) {
      const wikiKey = `${lang}wiki`;
      let wikiTitle = null;
      if (sitelinks && sitelinks[wikiKey]) {
        wikiTitle = sitelinks[wikiKey].title;
      }

      const localName = giant.names[lang];
      if (wikiTitle && localName) {
        const normWiki = wikiTitle.toLowerCase().replace(/ \(.+\)$/, '').trim();
        const normLocal = localName.toLowerCase().trim();
        if (normWiki !== normLocal) {
          console.log(`Mismatch: [${lang}] ${localName} != ${wikiTitle}`);
          mismatches.push({
            slug: giant.slug,
            locale: lang,
            localName,
            correctName: wikiTitle
          });
        }
      }
    }
  }

  fs.writeFileSync('scratch/all_mismatches_b7.json', JSON.stringify(mismatches, null, 2));
  console.log('Done, generated scratch/all_mismatches_b7.json with length', mismatches.length);
}

main();
