import fs from 'fs';
import path from 'path';
import { giantsData } from '../src/data/giants';

const narrativesPath = path.resolve(process.cwd(), 'src/data/final-narratives.json');
const factLayerPath = path.resolve(process.cwd(), 'src/data/fact-layer-all.json');
const koJsonPath = path.resolve(process.cwd(), 'messages/ko.json');
const wikiLinksPath = path.resolve(process.cwd(), 'src/data/wikipedia-links.json');

const finalNarratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
const factLayerAll = JSON.parse(fs.readFileSync(factLayerPath, 'utf8'));
const koJson = JSON.parse(fs.readFileSync(koJsonPath, 'utf8'));
const wikiLinks = JSON.parse(fs.readFileSync(wikiLinksPath, 'utf8'));

const koGiants = koJson.Giants || {};

const missingNames: string[] = [];
const missingWisdom: string[] = [];
const missingTimeline: string[] = [];
const missingAchievements: string[] = [];
const missingFaq: string[] = [];
const missingWikiLink: string[] = [];

for (const giant of giantsData) {
  const slug = giant.slug;

  // 1. Check name translation in ko.json
  const msgData = koGiants[slug];
  if (!msgData || !msgData.name || msgData.name === slug || /^[A-Za-z\s-]+$/.test(msgData.name)) {
    if (/^[A-Za-z\s.-]+$/.test(giant.name) && (!msgData || !msgData.name || /^[A-Za-z\s.-]+$/.test(msgData.name))) {
      missingNames.push(slug);
    }
  }

  // 2. Check wisdom quotes in final-narratives.json
  const narrative = finalNarratives[slug];
  if (!narrative || !narrative.wisdom || !Array.isArray(narrative.wisdom) || narrative.wisdom.length === 0) {
    missingWisdom.push(slug);
  }

  // 3. Check Fact Layer in fact-layer-all.json
  const fact = factLayerAll[slug];
  if (!fact) {
    missingTimeline.push(slug);
    missingAchievements.push(slug);
    missingFaq.push(slug);
  } else {
    if (!fact.timeline || !Array.isArray(fact.timeline) || fact.timeline.length === 0) {
      missingTimeline.push(slug);
    }
    if (!fact.keyAchievements || !Array.isArray(fact.keyAchievements) || fact.keyAchievements.length === 0) {
      missingAchievements.push(slug);
    }
    if (!fact.faq || !Array.isArray(fact.faq) || fact.faq.length === 0) {
      missingFaq.push(slug);
    }
  }

  // 4. Check wiki links
  const wiki = wikiLinks[slug];
  if (!wiki || !wiki.ko || !wiki.en) {
    missingWikiLink.push(slug);
  }
}

console.log('=== SCAN RESULT ===');
console.log(`Total Giants scanned: ${giantsData.length}`);
console.log(`Missing Korean Name translations: ${missingNames.length}`);
console.log(`Missing Wisdom (Quotes): ${missingWisdom.length}`);
console.log(`Missing Timeline: ${missingTimeline.length}`);
console.log(`Missing Key Achievements: ${missingAchievements.length}`);
console.log(`Missing FAQ: ${missingFaq.length}`);
console.log(`Missing Wiki Links: ${missingWikiLink.length}`);

console.log('\n--- Details ---');
if (missingNames.length > 0) {
  console.log(`Missing Names (${missingNames.length}):`, missingNames.slice(0, 10), missingNames.length > 10 ? '...' : '');
}
if (missingWisdom.length > 0) {
  console.log(`Missing Wisdom (${missingWisdom.length}):`, missingWisdom.slice(0, 10), missingWisdom.length > 10 ? '...' : '');
}
if (missingTimeline.length > 0) {
  console.log(`Missing Timeline (${missingTimeline.length}):`, missingTimeline.slice(0, 10), missingTimeline.length > 10 ? '...' : '');
}
if (missingAchievements.length > 0) {
  console.log(`Missing Achievements (${missingAchievements.length}):`, missingAchievements.slice(0, 10), missingAchievements.length > 10 ? '...' : '');
}
if (missingFaq.length > 0) {
  console.log(`Missing FAQ (${missingFaq.length}):`, missingFaq.slice(0, 10), missingFaq.length > 10 ? '...' : '');
}
if (missingWikiLink.length > 0) {
  console.log(`Missing Wiki Links (${missingWikiLink.length}):`, missingWikiLink.slice(0, 10), missingWikiLink.length > 10 ? '...' : '');
}

// Write report to JSON
fs.writeFileSync(
  path.resolve(process.cwd(), 'scripts/completeness-report.json'),
  JSON.stringify({
    missingNames,
    missingWisdom,
    missingTimeline,
    missingAchievements,
    missingFaq,
    missingWikiLink
  }, null, 2)
);
console.log('\nReport saved to scripts/completeness-report.json');
