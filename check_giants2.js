const fs = require('fs');
const path = require('path');

const errorGiants = ['ataturk', 'rosa-parks', 'simone-de-beauvoir', 'hannah-arendt', 'agatha-christie', 'queen-elizabeth-i', 'averroes-ibn-rushd', 'avicenna-ibn-sina', 'zarathushtra'];
const normalGiants = ['king-sejong', 'zenobia', 'katip-celebi'];
const allGiants = [...errorGiants, ...normalGiants];

const results = [];

for (const slug of allGiants) {
  const narrativePath = path.join(process.cwd(), 'src/data/narratives', `${slug}.json`);
  const factLayerPath = path.join(process.cwd(), 'src/data/fact-layers', `fact-layer-ko.json`);
  
  let narrative = null;
  let factLayerAll = null;
  
  if (fs.existsSync(narrativePath)) {
    narrative = JSON.parse(fs.readFileSync(narrativePath, 'utf8'));
  }
  
  if (fs.existsSync(factLayerPath)) {
    factLayerAll = JSON.parse(fs.readFileSync(factLayerPath, 'utf8'));
  }
  
  const factLayer = factLayerAll ? factLayerAll[slug] : null;
  
  results.push({
    slug,
    type: errorGiants.includes(slug) ? 'ERROR' : 'NORMAL',
    hasNarrative: !!narrative,
    hasFactLayer: !!factLayer,
    timeline: factLayer ? (Array.isArray(factLayer.timeline) ? 'array' : typeof factLayer.timeline) : 'N/A',
    faq: factLayer ? (Array.isArray(factLayer.faq) ? 'array' : typeof factLayer.faq) : 'N/A',
    wisdom: narrative ? (Array.isArray(narrative.wisdom) ? 'array' : typeof narrative.wisdom) : 'N/A',
    trials: narrative ? typeof narrative.trials : 'N/A',
    overcoming: narrative ? typeof narrative.overcoming : 'N/A',
    fact_box: narrative ? typeof narrative.fact_box : 'N/A',
    key_achievements: narrative && narrative.fact_box ? (Array.isArray(narrative.fact_box.key_achievements) ? 'array' : typeof narrative.fact_box.key_achievements) : 'N/A'
  });
}

console.table(results);
