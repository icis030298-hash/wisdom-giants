import fs from "fs";
import path from "path";

const tsPath = path.resolve(process.cwd(), "src/data/giants.ts");
const jsonPath = path.resolve(process.cwd(), "src/data/final-narratives.json");

if (!fs.existsSync(tsPath)) {
  console.error("src/data/giants.ts not found");
  process.exit(1);
}
if (!fs.existsSync(jsonPath)) {
  console.error("src/data/final-narratives.json not found");
  process.exit(1);
}

try {
  const tsContent = fs.readFileSync(tsPath, "utf8");
  const tsSlugs = Array.from(tsContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g)).map(m => m[1]);
  console.log("Total slugs in src/data/giants.ts:", tsSlugs.length);
  
  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const jsonSlugs = Object.keys(jsonContent);
  console.log("Total slugs in src/data/final-narratives.json:", jsonSlugs.length);
  
  // Find difference
  const inTsNotJson = tsSlugs.filter(s => !jsonSlugs.includes(s));
  const inJsonNotTs = jsonSlugs.filter(s => !tsSlugs.includes(s));
  
  console.log("In TS but not in JSON:", inTsNotJson.length, inTsNotJson);
  console.log("In JSON but not in TS:", inJsonNotTs.length, inJsonNotTs);
} catch (e) {
  console.error(e);
}
