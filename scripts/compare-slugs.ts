import fs from 'fs';
import path from 'path';
import { giantsData } from '../src/data/giants';

const GIANTS_TO_ADD = [
  'charles-darwin', 'nikola-tesla', 'max-planck', 'hypatia',
  'ibn-al-haytham', 'blaise-pascal', 'dmitri-mendeleev', 'ada-lovelace',
  'alan-turing', 'galileo-galilei', 'charles-babbage', 'ibn-sina',
  'thomas-aquinas', 'baruch-spinoza', 'david-hume', 'john-locke', 'rumi',
  'ibn-rushd', 'william-james', 'friedrich-schiller',
  'george-washington-carver', 'al-ghazali', 'dante-alighieri',
  'miguel-de-cervantes', 'fyodor-dostoevsky', 'leo-tolstoy',
  'murasaki-shikibu', 'frederic-chopin', 'claude-monet', 'edgar-degas',
  'oscar-wilde', 'rabindranath-tagore', 'frederick-douglass',
  'harriet-tubman', 'susan-b-anthony', 'william-willberforce',
  'simon-bolivar', 'toussaint-louverture', 'sojourner-truth',
  'emmeline-pankhurst', 'jose-rizal', 'kemal-ataturk', 'marco-polo',
  'vasco-da-gama', 'ferdinand-magellan', 'james-watt', 'george-stephenson',
  'cornelius-vanderbilt', 'adam-smith', 'zhang-qian'
];

const narrativesPath = path.resolve(process.cwd(), 'src/data/final-narratives.json');
const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

console.log("Checking in giants.ts:");
const inGiants = GIANTS_TO_ADD.filter(slug => giantsData.some(g => g.slug === slug));
console.log("Already in giants.ts:", inGiants);
console.log("Not in giants.ts:", GIANTS_TO_ADD.filter(slug => !giantsData.some(g => g.slug === slug)));

console.log("\nChecking in final-narratives.json:");
const inNarratives = GIANTS_TO_ADD.filter(slug => narratives[slug] !== undefined);
console.log("Already in final-narratives.json:", inNarratives);
console.log("Not in final-narratives.json:", GIANTS_TO_ADD.filter(slug => narratives[slug] === undefined));
