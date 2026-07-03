/**
 * Retry a single slug for a specific language
 * Usage: npx tsx scripts/retry-single.ts <lang> <slug>
 */
import fs from 'fs';
import path from 'path';
import { VertexAI } from "@google-cloud/vertexai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const [,, langCode, slugArg] = process.argv;
if (!langCode || !slugArg) {
  console.error("Usage: npx tsx scripts/retry-single.ts <langCode> <slug>");
  process.exit(1);
}

const langNameMap: Record<string, string> = {
  'he': 'Hebrew', 'el': 'Greek', 'ha': 'Hausa', 'th': 'Thai', 'tr': 'Turkish',
  'ar': 'Arabic', 'de': 'German', 'en': 'English', 'es': 'Spanish', 'fa': 'Persian',
  'fr': 'French', 'hi': 'Hindi', 'id': 'Indonesian', 'it': 'Italian', 'ja': 'Japanese',
  'nl': 'Dutch', 'pl': 'Polish', 'pt': 'Portuguese', 'ru': 'Russian', 'sw': 'Swahili',
  'uk': 'Ukrainian', 'vi': 'Vietnamese', 'zh': 'Chinese (Simplified)'
};

const langName = langNameMap[langCode] || langCode;
const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'giantswisdom-8dc26';
const vertex_ai = new VertexAI({ project, location: 'us-central1' });
const model = vertex_ai.preview.getGenerativeModel({ model: 'gemini-2.5-flash' });

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const WIKI_LINKS_FILE = path.resolve('src/data/wikipedia-links.json');
const CHECKPOINTS_DIR = path.resolve('scratch/translations/checkpoints');
const FINAL_FILE = path.resolve(`scratch/translations/final-${langCode}.json`);

const narratives = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));
const wikiLinks = JSON.parse(fs.readFileSync(WIKI_LINKS_FILE, 'utf8'));

let tierMap: Record<string, number> = {};
try { tierMap = JSON.parse(fs.readFileSync(path.resolve('scratch/translations/tier-mapping.json'), 'utf8')); } catch {}

async function translateSingle(slug: string) {
  const giantData = narratives[slug];
  if (!giantData) { console.error('Giant not found:', slug); process.exit(1); }

  const sourceKo = giantData.epic_ko;
  const factBoxKo = giantData.fact_box;
  if (!sourceKo || !factBoxKo) { console.error('Source data missing for:', slug); process.exit(1); }

  let localizedName = '';
  const wikiUrl = wikiLinks[slug]?.[langCode];
  if (wikiUrl) {
    try { localizedName = decodeURIComponent(wikiUrl.substring(wikiUrl.lastIndexOf('/') + 1)).replace(/_/g, ' '); } catch {}
  }

  const tier = tierMap[slug] || 2;
  let toneGuide = "자료가 적당한 인물이므로 절제된 문학적 톤을 사용하십시오.";
  if (tier === 1) toneGuide = "역사적 사료가 매우 풍부한 인물이므로 서사시적인 톤(Epic tone)을 살리십시오.";
  if (tier === 3) toneGuide = "자료가 제한적인 인물이므로 사실(Fact) 중심의 서술을 유지하십시오.";

  const systemInstruction = `당신은 역사 전기 전문 번역가입니다.
목표 언어: ${langName} (${langCode})
대상 인물: ${slug}
위키피디아 표준 표기: ${localizedName || '보편적인 표기법 사용'}
톤 가이드: ${toneGuide}`;

  const prompt = `다음 한국어 인물 서사와 팩트 박스를 ${langName}로 번역해 주세요.
반드시 아래 JSON 형식으로 반환:
{
  "narrative": "4단락으로 번역된 본문 (줄바꿈 \\n\\n)",
  "fact_box": {
    "one_line_summary": "번역된 한 줄 요약",
    "key_achievements": ["번역된 업적 1", "번역된 업적 2", "...원문과 동일한 개수"],
    "legacy_statement": "번역된 영향/유산"
  }
}

--- 원문 ---
[서사 본문]
${sourceKo}
[Fact Box]
${JSON.stringify(factBoxKo, null, 2)}`;

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
        systemInstruction: { parts: [{ text: systemInstruction }] }
      });
      const text = res.response.candidates![0].content.parts[0].text!;
      const parsed = JSON.parse(text);
      
      if (!parsed.narrative || !parsed.fact_box?.one_line_summary) {
        console.warn(`Attempt ${attempt}: Incomplete response`);
        continue;
      }
      
      // Save to checkpoint
      const cpFile = path.join(CHECKPOINTS_DIR, `${langCode}.json`);
      let cp: Record<string, any> = {};
      if (fs.existsSync(cpFile)) cp = JSON.parse(fs.readFileSync(cpFile, 'utf8'));
      cp[slug] = { success: true, parsed };
      fs.writeFileSync(cpFile, JSON.stringify(cp, null, 2));
      
      // Rebuild final file from checkpoint
      const finalData: Record<string, any> = {};
      const allSlugs = Object.keys(narratives);
      for (const s of allSlugs) {
        if (cp[s]?.success) finalData[s] = cp[s].parsed;
      }
      fs.writeFileSync(FINAL_FILE, JSON.stringify(finalData, null, 2));
      
      console.log(`✅ Successfully translated ${slug} in ${langName}`);
      console.log(`Checkpoint: ${Object.values(cp).filter((v:any) => v.success).length}/485`);
      console.log(`Final file: ${Object.keys(finalData).length} entries`);
      return;
    } catch (e: any) {
      console.error(`Attempt ${attempt} failed:`, e.message?.substring(0, 100));
      if (e.message?.includes('429')) await new Promise(r => setTimeout(r, 15000));
      else await new Promise(r => setTimeout(r, 3000));
    }
  }
  console.error(`❌ All attempts failed for ${slug}`);
}

translateSingle(slugArg);
