import fs from 'fs';
import path from 'path';
import { giantsData } from '../src/data/giants';

const imagesDir = path.resolve('public/images/giants');

const missingGiants = giantsData.filter(g => {
  const pngPath = path.join(imagesDir, `${g.slug}.png`);
  const jpgPath = path.join(imagesDir, `${g.slug}.jpg`);
  
  if (!fs.existsSync(pngPath) && !fs.existsSync(jpgPath)) return true;
  
  if (fs.existsSync(pngPath) && fs.statSync(pngPath).size === 309920) return true;
  if (fs.existsSync(jpgPath) && fs.statSync(jpgPath).size === 309920) return true;
  
  return false;
});

console.log(`Found ${missingGiants.length} missing images.`);

// Create chunks of 30
const chunks = [];
for (let i = 0; i < missingGiants.length; i += 30) {
  chunks.push(missingGiants.slice(i, i + 30));
}

const prompts = chunks.map((chunk, i) => {
  let prompt = `Your task is to generate illustrations for the following giants using the \`generate_image\` tool.\n\n`;
  
  chunk.forEach(g => {
    prompt += `Giant: ${g.name}\nSlug: ${g.slug}\n\n`;
  });
  
  prompt += `For EACH giant above, follow these exact steps:
1. Call the \`generate_image\` tool with this EXACT prompt:
"Generate a clean, modern digital illustration of a historical figure. MANDATORY AESTHETIC GUIDELINES (Style Matching): Style: Strict Flat Vector Illustration, Corporate Art style. Reference Image: The style, composition, and color blocking MUST strictly match the provided reference images of other historical figures. Clean, simple shapes with opaque colors. Line Work: Outline-less, extremely clean edges. NO painterly blending or soft brushstrokes. Color blocks must be solid and separate. Color Palette: High-contrast primary and secondary colors. Avoid soft pastels or complex color mixing. Lighting & Depth: Flat, even lighting with no complex shadows or dramatic highlights. Minimal simple, sharp highlights for very subtle depth. Character Specification: Subject: A stylized portrait of [GIANT_NAME]. Features: Must be recognizable features, simplified into a clean, geometric or organic shape. Simplified garments into clean blocks of solid color. Composition: Central three-quarter view. Do NOT include any text, letters, or words in the image."

CRITICAL: You MUST replace [GIANT_NAME] with the Giant's name in the prompt.
CRITICAL: You MUST provide the following two paths in the \`ImagePaths\` parameter of the \`generate_image\` tool call to ensure the style matches exactly:
- "c:\\Users\\natey\\Desktop\\wisdom-giants\\public\\images\\giants\\king-sejong.jpg"
- "c:\\Users\\natey\\Desktop\\wisdom-giants\\public\\images\\giants\\napoleon.jpg"
Also, specify a distinct \`ImageName\` for each. You can invoke multiple generate_image tool calls concurrently in a single response to speed things up!

2. After generating the images, use the \`run_command\` tool to copy the generated artifacts to \`c:\\Users\\natey\\Desktop\\wisdom-giants\\public\\images\\giants\\[slug].jpg\`. Use \`cmd /c copy "source" "destination"\`. Wait for the copy commands to succeed.

Process all giants in your list. You can batch your tool calls. When completely finished with all of them, send me a message confirming completion.`;
  return prompt;
});

fs.writeFileSync('scratch/subagent-prompts.json', JSON.stringify(prompts, null, 2));
console.log(`Generated ${prompts.length} subagent prompts.`);
