import { giantsData } from "../src/data/giants";

const extraCandidates = [
  'zheng-he', 'ibn-khaldun', 'leif-erikson', 'roald-amundsen',
  'gregor-mendel', 'antoine-lavoisier', 'mary-wollstonecraft',
  'sor-juana-ines-de-la-cruz', 'li-qingzhao', 'matsuo-basho',
  'li-shizhen', 'maimonides', 'lucretia-mott', 'guglielmo-marconi', 'robert-koch'
];

const found = extraCandidates.filter(slug => giantsData.some(g => g.slug === slug));
console.log("Already in giants.ts:", found);
console.log("Not in giants.ts:", extraCandidates.filter(slug => !giantsData.some(g => g.slug === slug)));
