import fs from 'fs';
import path from 'path';

const giants = JSON.parse(fs.readFileSync('scratch/mbti-list.json', 'utf8'));

// The user mentioned 158 new giants. If there are 191 total, the last 158 are index 33 to 190.
const targetGiants = giants.slice(33);

console.log(`Targeting ${targetGiants.length} giants for regeneration.`);

// Create chunks of 10
const chunks = [];
for (let i = 0; i < targetGiants.length; i += 10) {
  chunks.push(targetGiants.slice(i, i + 10));
}

const prompts = chunks.map((chunk, i) => {
  let prompt = `Your task is to REGENERATE illustrations for the following giants using the \`generate_image\` tool and the Strict Flat Vector prompt.\n\n`;
  
  chunk.forEach(g => {
    prompt += `Giant: ${g.name}\nSlug: ${g.slug}\nMBTI/DNACode: ${g.mbti}\n\n`;
  });
  
  prompt += `For EACH giant above, follow these exact steps:
1. Call the \`generate_image\` tool with this prompt:
"Generate a clean, modern digital illustration of a historical figure for an MBTI personality platform. MANDATORY AESTHETIC GUIDELINES (Style Matching): Style: Strict Flat Vector Illustration, Corporate Art style, Isotype style. Reference Image: The style and color blocking MUST strictly match image_0a3c89.png. Clean, simple shapes with opaque colors. Line Work: Outline-less, extremely clean edges. NO painterly blending or soft brushstrokes. Color blocks must be solid and separate. Color Palette: High-contrast primary and secondary colors. Avoid soft pastels or complex color mixing. Lighting & Depth: Flat, even lighting with no complex shadows or dramatic highlights. NO volumetric rendering. Minimal simple, sharp highlights for very subtle depth, not volumetric volume. Character Specification: Subject: A stylized portrait of [GIANT_NAME]. Features: Must be recognizable features, simplified into a clean, geometric or organic shape. Simplified garments into clean blocks of solid color. Composition & MBTI Integration: Composition: Central three-quarter view. MBTI Placement: A clean, flat geometric banner below the character. Text: Display the text '[GIANT_MBTI]' in bold, ultra-modern sans-serif font, extremely large and centered, not integrated into a stylized design. Must look like bold text on a flat block. Icons: Simple, flat vector icons around the character that symbolize [GIANT_NAME]."

2. Replace [GIANT_NAME] with the Giant's name and [GIANT_MBTI] with their MBTI/DNACode in the prompt.
3. After generating the image, use the \`run_command\` tool to copy the artifact to \`c:\\Users\\natey\\Desktop\\wisdom-giants\\public\\images\\giants\\[slug].png\`. Use \`cmd /c copy /Y "source" "destination"\` to overwrite if it exists.

Process all giants in your list. When completely finished with all of them, send me a message confirming completion.`;
  return prompt;
});

fs.writeFileSync('scratch/subagent-prompts.json', JSON.stringify(prompts, null, 2));
console.log(`Generated ${prompts.length} subagent prompts.`);
