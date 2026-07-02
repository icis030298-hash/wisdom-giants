const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({path:'.env.local'});

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const selectedSlugs = [
  "cleopatra-vii", "tutankhamun", "justinian-i", "mehmed-the-conqueror", "mustafa-kemal-ataturk",
  "behanzin", "menelik-ii", "moshoeshoe-i", "muhammad-ahmad", "imhotep",
  "khufu", "nefertiti", "dido", "t-e-lawrence", "attila-the-hun",
  "hammurabi", "darius-i", "xerxes-i", "harun-al-rashid", "kublai-khan",
  "timur-tamerlane", "ivan-iv-the-terrible", "pyotr-ilyich-tchaikovsky", "alexander-pushkin", "xuanzang",
  "averroes-ibn-rushd", "avicenna-ibn-sina", "zarathushtra", "mimar-sinan", "hurrem-sultan-roxelana"
];

const MASTER_PROMPT_TEMPLATE = `Modern digital illustration portrait of [HERO_NAME] for an MBTI-based personality platform.
Subject: Stylized portrait of [HERO_NAME], three-quarter view, looking at the viewer with a subtle smile. Historical garments simplified into clean blocks of color.
Art Style: Modern Vector Illustration, Flat Design with Depth, Isometric Isotype style. Outline-less (semi-flat design) with extremely clean edges. Smooth, matte textures, soft low-contrast gradients for depth.
Composition: Central composition. Below the character is a clean, stylized banner displaying the text "[MBTI_TYPE]" in bold, modern, sans-serif font. Floating stylized flat icons symbolise their work: [KEY_ICON_1], [KEY_ICON_2].
Color Scheme: Soft, vibrant but gentle pastel color scheme. Prioritize [COLOR_THEME] palette matching the MBTI type. Minimalist background with abstract geometric shapes in extremely soft focus. Soft studio lighting with gentle rim light.`;

// Map category to color theme
const categoryColors = {
  leadership: "warm pastel (e.g. soft corals, warm yellows, peach pinks)",
  science: "cool pastel (e.g. soft teals, mint greens, light blues)",
  philosophy: "thoughtful pastel (e.g. soft lavenders, muted sages, warm sands)",
  arts: "creative pastel (e.g. soft roses, peach pinks, light lilacs)",
  society: "gentle pastel (e.g. warm creams, soft oranges, sage greens)",
  business: "ambitious pastel (e.g. soft bronzes, warm golds, champagne)",
  exploration: "adventurous pastel (e.g. sky blues, soft seafoams, sand tones)"
};

async function getGiantDetails(slug) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `Given the historical figure with slug "${slug}", identify:
1. English Name (standard spelling, e.g. "Cleopatra VII")
2. Standard 16 MBTI type (e.g. "ENTJ", "INFJ", "INFP")
3. Two key icons symbolizing their achievements, life, or era (brief, noun phrase, e.g. "Egyptian pharaoh crown", "papyrus scroll")

Return only a JSON object matching this structure:
{
  "name": "...",
  "mbti": "...",
  "icons": ["icon 1 description", "icon 2 description"]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw e;
  }
}

async function main() {
  const tasks = [];
  const { giantsData } = require('../src/data/giants.ts');
  
  console.log(`Starting prompt preparation for ${selectedSlugs.length} giants...`);
  
  for (let i = 0; i < selectedSlugs.length; i++) {
    const slug = selectedSlugs[i];
    const giant = giantsData.find(g => g.slug === slug) || {};
    const cat = giant.category || 'wisdom';
    
    console.log(`[${i + 1}/${selectedSlugs.length}] Fetching metadata for: ${slug}`);
    
    let attempts = 0;
    let success = false;
    
    while (!success && attempts < 3) {
      try {
        const details = await getGiantDetails(slug);
        
        // Construct the prompt
        const colorTheme = categoryColors[cat] || "soft pastel";
        const promptText = MASTER_PROMPT_TEMPLATE
          .replace(/\[HERO_NAME\]/g, details.name)
          .replace(/\[MBTI_TYPE\]/g, details.mbti)
          .replace(/\[KEY_ICON_1\]/g, details.icons[0] || "icon 1")
          .replace(/\[KEY_ICON_2\]/g, details.icons[1] || "icon 2")
          .replace(/\[COLOR_THEME\]/g, colorTheme);
          
        tasks.push({
          slug,
          name: details.name,
          category: cat,
          mbti: details.mbti,
          prompt: promptText
        });
        
        success = true;
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        attempts++;
        console.error(`  ✗ Error preparing prompt for ${slug} (attempt ${attempts}):`, err.message);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  fs.writeFileSync(path.resolve('scratch/batch-1-tasks.json'), JSON.stringify(tasks, null, 2), 'utf-8');
  console.log(`\n🎉 Prompts preparation completed! Saved 30 tasks to scratch/batch-1-tasks.json`);
}

main().catch(console.error);
