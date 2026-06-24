import fs from "fs";
import path from "path";

const tsPath = path.resolve(process.cwd(), "src/data/giants.ts");
if (!fs.existsSync(tsPath)) {
  console.error("giants.ts not found");
  process.exit(1);
}

try {
  const content = fs.readFileSync(tsPath, "utf8");
  // Match all giants and extract name, slug, and dnaCode
  // A giant block looks like { ... }
  // We can extract them using a regex or simple parser
  const regex = /\{\s*id:\s*"[^"]+",\s*name:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?dnaCode:\s*"([^"]+)"/g;
  const matches = [...content.matchAll(regex)];
  
  const groups: Record<string, string[]> = {};
  for (const match of matches) {
    const name = match[1];
    const slug = match[2];
    const dna = match[3];
    if (!groups[dna]) groups[dna] = [];
    groups[dna].push(`${name} (${slug})`);
  }
  
  console.log("DNA Code groupings:");
  for (const dna of Object.keys(groups).sort()) {
    console.log(`- ${dna} (${groups[dna].length} giants): ${groups[dna].slice(0, 5).join(", ")}`);
  }
} catch (e) {
  console.error(e);
}
