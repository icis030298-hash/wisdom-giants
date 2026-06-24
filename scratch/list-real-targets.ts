import fs from 'fs';
import { giantsData as giants } from '../src/data/giants';

const finalNarratives = JSON.parse(fs.readFileSync('../src/data/final-narratives.json','utf8'));

const targets = giants.filter(p => {
  const data = finalNarratives[p.slug];
  if (!data) return true;
  if (!data.epic_ko) return true;
  if (data.epic_ko.includes("데이터 준비 중")) return true;
  if (data.epic_ko.trim() === "") return true;
  return false;
});

console.log(`Total real targets: ${targets.length}`);
console.log(targets.map(g => g.slug).join(', '));
