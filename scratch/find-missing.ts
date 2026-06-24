import fs from 'fs';
import { giantsData } from '../src/data/giants';

const finalNarratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
const missing = giantsData.filter(g => !finalNarratives[g.slug] || !finalNarratives[g.slug].epic_ko || finalNarratives[g.slug].epic_ko.length < 50);

console.log(JSON.stringify(missing.slice(0, 10).map(g => ({ slug: g.slug, name: g.name, cat: g.category, era: g.era, quote: g.quote, headline: g.headline })), null, 2));
