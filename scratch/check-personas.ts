import { giantsData } from "../src/data/giants";
import { giantPersonas } from "../src/data/giant-personas";
import { deepPersonas } from "../src/data/personas/personas";

console.log("Total length of giantsData array:", giantsData.length);

// 1. Check array holes
const holeIndices: number[] = [];
for (let i = 0; i < giantsData.length; i++) {
  if (!(i in giantsData)) {
    holeIndices.push(i);
  }
}
console.log("Hole indices (empty slots in array):", holeIndices);

// 2. Check null/undefined items
const undefinedCount = giantsData.filter(g => g === undefined || g === null).length;
console.log("Null/Undefined items count:", undefinedCount);

// 3. Check giant.persona coverage
const gpSlugs = giantPersonas.map(p => p.slug);
const dpSlugs = Object.keys(deepPersonas);

let missingBothCount = 0;
const missingBothSlugs: string[] = [];

for (const giant of giantsData) {
  if (!giant) continue;
  const hasGP = gpSlugs.includes(giant.slug);
  const hasDP = dpSlugs.includes(giant.slug);
  if (!hasGP && !hasDP) {
    missingBothCount++;
    missingBothSlugs.push(giant.slug);
  }
}

console.log(`Giants missing BOTH giantPersonas and deepPersonas: ${missingBothCount}`);
console.log("First 10 missing slugs:", missingBothSlugs.slice(0, 10));
