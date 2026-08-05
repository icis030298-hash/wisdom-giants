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
    narrative_exists: !!narrative,
    factLayer_exists: !!factLayer,
    narrative_fields: narrative ? Object.keys(narrative) : [],
    factLayer_fields: factLayer ? Object.keys(factLayer) : [],
    wikiSlug_type: narrative ? typeof narrative.wikiSlug : 'N/A',
    era_exists: narrative ? 'era' in narrative : false,
    timeline_is_array: factLayer ? Array.isArray(factLayer.timeline) : false,
    faq_is_array: factLayer ? Array.isArray(factLayer.faq) : false,
    wisdom_is_array: narrative ? Array.isArray(narrative.wisdom) : false,
    trials_exists: narrative ? 'trials_en' in narrative || 'trials' in narrative : false,
    overcoming_exists: narrative ? 'overcoming_en' in narrative || 'overcoming' in narrative : false,
    fact_box_exists: narrative ? !!narrative.fact_box : false,
    fact_box_key_achievements_isArray: narrative && narrative.fact_box ? Array.isArray(narrative.fact_box.key_achievements) : false,
  });
}

console.log(JSON.stringify(results, null, 2));
