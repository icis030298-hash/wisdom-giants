import fs from 'fs';
import path from 'path';
import { giantsData } from '../src/data/giants';

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});

const resultsPath = path.join(__dirname, '../src/data/wikipedia-links.json');
const koJsonPath = path.join(__dirname, '../messages/ko.json');

async function getWikipediaUrl(name: string, lang: 'ko' | 'en'): Promise<string | null> {
  const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(name)}&limit=1&format=json`;
  const headers = {
    'User-Agent': 'GiantsWisdomBot/1.0 (contact@giantswisdom.com; http://giantswisdom.com)'
  };
  
  try {
    const response = await fetch(searchUrl, { headers });
    if (!response.ok) return null;
    const data = await response.json();
    
    // Opensearch format: [query, [titles], [descriptions], [urls]]
    if (data && data[3] && data[3][0]) {
      const url = data[3][0];
      // Verify the URL with a HEAD request to ensure it is fully active
      const headResponse = await fetch(url, { method: 'HEAD', headers });
      if (headResponse.ok) {
        return url;
      }
    }
  } catch (e) {
    // Ignore errors and return null
  }
  return null;
}

async function main() {
  console.log(`Starting Wikipedia link verification for ${giantsData.length} giants...`);
  
  const links: Record<string, { ko: string | null; en: string | null }> = {};
  
  // Load existing data to reuse English links if possible
  if (fs.existsSync(resultsPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      Object.assign(links, existing);
      console.log(`Loaded ${Object.keys(links).length} existing entries from ${resultsPath}`);
    } catch (e) {
      console.warn("Could not parse existing wikipedia-links.json, starting fresh.");
    }
  }

  // Load Korean translation mapping to get localized names
  let koTranslations: Record<string, any> = {};
  if (fs.existsSync(koJsonPath)) {
    try {
      const koData = JSON.parse(fs.readFileSync(koJsonPath, 'utf8'));
      koTranslations = koData.Giants || {};
      console.log("Loaded Korean translation mapping successfully.");
    } catch (e) {
      console.warn("Could not load messages/ko.json, falling back to default names.");
    }
  }

  for (let i = 0; i < giantsData.length; i++) {
    const giant = giantsData[i];
    
    const koName = koTranslations[giant.slug]?.name || giant.name;
    const enName = giant.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const hasEnLink = links[giant.slug] && links[giant.slug].en;
    
    console.log(`[${i + 1}/${giantsData.length}] Verifying: ${koName} (${giant.slug})`);
    
    // Since we now have accurate Korean names, we want to perform a fresh search for KO
    const koUrl = await getWikipediaUrl(koName, 'ko');
    
    // Re-use EN link if it exists, otherwise query Wikipedia
    const enUrl = hasEnLink ? links[giant.slug].en : await getWikipediaUrl(enName, 'en');

    links[giant.slug] = {
      ko: koUrl,
      en: enUrl
    };

    console.log(` -> KO: ${koUrl || 'FAILED'}`);
    console.log(` -> EN: ${enUrl || 'FAILED'}`);

    // Save progressively
    fs.writeFileSync(resultsPath, JSON.stringify(links, null, 2), 'utf8');

    // Small delay to prevent rate limits (only query what's needed)
    const queriesMade = !hasEnLink ? 2 : 1;
    await new Promise(r => setTimeout(r, queriesMade * 200));
  }

  console.log("Wikipedia link verification complete!");
}

main();
