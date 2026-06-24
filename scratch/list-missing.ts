import fs from 'fs';
import { giantsData as giants } from '../src/data/giants';
const finalNarratives = JSON.parse(fs.readFileSync('../src/data/final-narratives.json','utf8'));
const missing = giants.filter(g => {
    const data = finalNarratives[g.slug];
    return !data || !data.epic_ko || data.epic_ko.length < 900;
});
console.log(JSON.stringify(missing.map(g => g.slug)));
