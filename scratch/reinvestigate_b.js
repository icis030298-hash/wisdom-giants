const fs = require('fs');

async function reinvestigateB() {
  const bList = [
    { slug: 'seneca', enTitle: 'Seneca the Younger', locales: ['ar', 'it', 'ja', 'ru', 'uk'] },
    { slug: 'theodora', enTitle: 'Theodora (wife of Justinian I)', locales: ['fa', 'ko', 'ru'] },
    { slug: 'mani', enTitle: 'Mani (prophet)', locales: ['ar', 'es', 'fa', 'id', 'pl'] },
    { slug: 'abraham-lincoln', enTitle: 'Abraham Lincoln', locales: ['ha'] },
    { slug: 'roald-amundsen', enTitle: 'Roald Amundsen', locales: ['ha'] }
  ];

  const results = [];

  for (const item of bList) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&lllimit=max&titles=${encodeURIComponent(item.enTitle)}&format=json&redirects=1`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'AntigravityBot/1.0' } });
      const data = await res.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const langlinks = pages[pageId].langlinks || [];

      for (const loc of item.locales) {
        const link = langlinks.find(l => l.lang === loc);
        results.push({
          slug: item.slug,
          locale: loc,
          enTitle: item.enTitle,
          correctWikiTitle: link ? link['*'] : 'NOT_FOUND'
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  fs.writeFileSync('scratch/b_reinvestigated.json', JSON.stringify(results, null, 2));
  console.log('B reinvestigation complete.');
}

reinvestigateB().catch(console.error);
