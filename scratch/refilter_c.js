const fs = require('fs');

async function checkRedirect() {
  const allClassified = JSON.parse(fs.readFileSync('scratch/classified_all.json', 'utf8'));
  const trueDisc = JSON.parse(fs.readFileSync('scratch/true_discrepancies.json', 'utf8'));

  let cItems = allClassified.filter(d => d.category === 'C').map(a => {
    const t = trueDisc.find(x => x.slug === a.slug && x.locale === a.locale);
    return { ...a, localName: t.localName, correctName: t.correctName };
  });

  // Rule (a): Remove if correctName has parentheses
  const beforeParen = cItems.length;
  cItems = cItems.filter(item => !item.correctName.includes('(') && !item.correctName.includes(')'));
  console.log(`Filtered out ${beforeParen - cItems.length} items with parentheses.`);

  const validRedirects = [];
  const brokenNames = [];
  const rateLimitDelay = 40; // ms

  for (let i = 0; i < cItems.length; i++) {
    const item = cItems[i];
    const url = `https://${item.locale}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(item.localName)}&format=json&redirects=1`;
    
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'AntigravityBot/1.0 (https://giantswisdom.com; admin@giantswisdom.com)' } });
      const data = await res.json();
      
      const pages = data.query ? data.query.pages : {};
      const pageValues = Object.values(pages);
      
      if (pageValues.length > 0 && pageValues[0].missing === undefined) {
        // It exists! Either directly or via redirect.
        validRedirects.push(item);
      } else {
        // Missing completely. This is a true misspelling or bad translation.
        brokenNames.push(item);
      }
    } catch (err) {
      console.error(`Error fetching ${item.localName} on ${item.locale}:`, err.message);
      brokenNames.push(item); // fallback
    }

    if (i % 100 === 0 && i > 0) console.log(`Processed ${i}/${cItems.length}...`);
    await new Promise(r => setTimeout(r, rateLimitDelay));
  }

  console.log(`Total valid redirects (KEEP): ${validRedirects.length}`);
  console.log(`Total broken names (FIX): ${brokenNames.length}`);

  fs.writeFileSync('scratch/c_valid_redirects.json', JSON.stringify(validRedirects, null, 2));
  fs.writeFileSync('scratch/c_broken_names.json', JSON.stringify(brokenNames, null, 2));
}

checkRedirect().catch(console.error);
