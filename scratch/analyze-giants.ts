import fs from "fs";
import path from "path";

const narrativesPath = path.resolve(process.cwd(), "src/data/final-narratives.json");
const imagesDir = path.resolve(process.cwd(), "public/images/giants");

if (!fs.existsSync(narrativesPath)) {
  console.error("final-narratives.json not found");
  process.exit(1);
}

try {
  const narratives = JSON.parse(fs.readFileSync(narrativesPath, "utf8"));
  const keys = Object.keys(narratives);
  console.log("Total giants in final-narratives.json:", keys.length);
  
  const existingImages = fs.readdirSync(imagesDir);
  console.log("Total files in public/images/giants:", existingImages.length);
  
  // Let's sample a few entries to see what fields exist
  const firstKey = keys[0];
  console.log("Fields in one entry of final-narratives.json:", Object.keys(narratives[firstKey]));
  
  // Let's check a few entries' values
  console.log("Sample entry keys/values for key:", firstKey);
  const sample = narratives[firstKey];
  console.log("Name KO:", sample.name_ko || sample.name);
  console.log("Name EN:", sample.name_en || sample.nameEn);
  console.log("Category:", sample.category);
  console.log("DNA Code / MBTI:", sample.dnaCode || sample.mbti);
  
  // Let's list giants that are missing illustrations in public/images/giants
  const missingIllustrations: string[] = [];
  for (const slug of keys) {
    // Check for slug.png or slug.jpg or illust_slug.png or similar
    const hasPng = existingImages.includes(`${slug}.png`);
    const hasJpg = existingImages.includes(`${slug}.jpg`);
    const hasIllustPng = existingImages.includes(`illust_${slug}.png`);
    
    if (!hasPng && !hasJpg && !hasIllustPng) {
      missingIllustrations.push(slug);
    }
  }
  
  console.log("Number of giants missing illustrations:", missingIllustrations.length);
  console.log("First 10 missing giants:", missingIllustrations.slice(0, 10));
} catch (e) {
  console.error("Error analyzing:", e);
}
