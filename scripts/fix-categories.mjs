import fs from 'fs';
import path from 'path';

async function main() {
  const tsPath = path.resolve(process.cwd(), "src/data/giants.ts");

  if (!fs.existsSync(tsPath)) {
    console.error("Target file src/data/giants.ts not found!");
    process.exit(1);
  }

  let content = fs.readFileSync(tsPath, "utf8");

  // Murasaki Shikibu category fix (science -> arts)
  const targetPattern = /slug:\s*["']murasaki-shikibu["'][\s\S]{0,200}?category:\s*["']science["']/g;
  if (content.match(targetPattern)) {
    content = content.replace(/(slug:\s*["']murasaki-shikibu["'][\s\S]{0,200}?category:\s*["'])science(["'])/g, '$1arts$2');
    fs.writeFileSync(tsPath, content, "utf8");
    console.log("✓ Fixed Murasaki Shikibu category to 'arts' in giants.ts");
  } else {
    console.log("Murasaki Shikibu category is already 'arts' or correct.");
  }

  console.log("=== Category fixes completed ===");
}

main().catch(console.error);
