const fs = require('fs');

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const cData = JSON.parse(fs.readFileSync('scratch/c_filtered_strict.json', 'utf8'));
  console.log(`Total C items to check: ${cData.length}`);

  const redirectExists = [];   // current name exists as page or redirect → DON'T fix
  const noRedirect = [];       // current name doesn't exist at all → FIX candidate
  const errors = [];

  for (let i = 0; i < cData.length; i++) {
    const item = cData[i];
    const encodedTitle = encodeURIComponent(item.localName);
    const url = `https://${item.locale}.wikipedia.org/w/api.php?action=query&titles=${encodedTitle}&format=json&redirects=1`;

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'WisdomGiantsBot/1.0 (https://giantswisdom.com; contact@giantswisdom.com)' }
      });
      
      if (res.status === 429) {
        console.log(`Rate limited at ${i}, waiting 2s...`);
        await sleep(2000);
        i--; // retry
        continue;
      }
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log(`JSON parse error at ${i} (${item.slug}/${item.locale}), waiting 3s...`);
        await sleep(3000);
        i--; // retry
        continue;
      }

      const pages = data.query ? data.query.pages : {};
      const pageIds = Object.keys(pages);

      if (pageIds.length > 0 && !pages[pageIds[0]].missing) {
        // Page exists (either directly or via redirect)
        const wasRedirected = data.query.redirects && data.query.redirects.length > 0;
        redirectExists.push({ ...item, wasRedirect: wasRedirected });
      } else {
        noRedirect.push(item);
      }
    } catch (err) {
      console.error(`Error at ${i} (${item.slug}/${item.locale}): ${err.message}`);
      errors.push(item);
    }

    if (i % 50 === 0 && i > 0) {
      console.log(`Processed ${i}/${cData.length}... (exists: ${redirectExists.length}, missing: ${noRedirect.length}, errors: ${errors.length})`);
    }
    await sleep(150);
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Exists (redirect or direct): ${redirectExists.length} → DO NOT FIX`);
  console.log(`Missing (no page at all):    ${noRedirect.length} → FIX candidates`);
  console.log(`Errors:                      ${errors.length}`);

  fs.writeFileSync('scratch/c_redirect_exists.json', JSON.stringify(redirectExists, null, 2));
  fs.writeFileSync('scratch/c_no_redirect.json', JSON.stringify(noRedirect, null, 2));
  if (errors.length > 0) fs.writeFileSync('scratch/c_redirect_errors.json', JSON.stringify(errors, null, 2));
}

main().catch(console.error);
