import fs from "fs";
import path from "path";

const tsPath = path.resolve(process.cwd(), "src/data/giants.ts");
if (!fs.existsSync(tsPath)) {
  console.error("giants.ts not found");
  process.exit(1);
}

try {
  const content = fs.readFileSync(tsPath, "utf8");
  // Find da-vinci entry
  const regex = /\{[\s\S]*?slug:\s*['"]da-vinci['"][\s\S]*?\}/g;
  const match = content.match(regex);
  if (match) {
    console.log("Found da-vinci:");
    console.log(match[0]);
  } else {
    console.log("da-vinci not found in giants.ts");
  }
} catch (e) {
  console.error(e);
}
