import fs from "fs";
import path from "path";

const tsPath = path.resolve(process.cwd(), "src/data/giants.ts");
const imagesDir = path.resolve(process.cwd(), "public/images/giants");

if (!fs.existsSync(tsPath)) {
  console.error("src/data/giants.ts not found");
  process.exit(1);
}

try {
  const tsContent = fs.readFileSync(tsPath, "utf8");
  // We want to parse giantsData array
  // A simple way is to match all imageUrls and their corresponding slugs
  const regex = /slug:\s*['"]([^'"]+)['"][\s\S]*?imageUrl:\s*['"]([^'"]+)['"]/g;
  const matches = [...tsContent.matchAll(regex)];
  console.log("Total giants matched in giants.ts:", matches.length);
  
  const existingImages = fs.readdirSync(imagesDir);
  
  const missingFiles: { slug: string; imageUrl: string }[] = [];
  for (const match of matches) {
    const slug = match[1];
    const imageUrl = match[2];
    const filename = path.basename(imageUrl);
    
    if (!existingImages.includes(filename)) {
      missingFiles.push({ slug, imageUrl });
    }
  }
  
  console.log("Giants with missing imageUrl files:", missingFiles.length);
  if (missingFiles.length > 0) {
    console.log("Missing files detail:", missingFiles);
  }
} catch (e) {
  console.error(e);
}
