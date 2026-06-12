import { giantsData } from "../src/data/giants";

console.log("Total giants:", giantsData.length);
const categoriesCount: Record<string, number> = {};
const list = giantsData.map(g => {
  categoriesCount[g.category] = (categoriesCount[g.category] || 0) + 1;
  return { slug: g.slug, name: g.name, category: g.category };
});
console.log("Categories:", categoriesCount);
console.log(JSON.stringify(list, null, 2));
