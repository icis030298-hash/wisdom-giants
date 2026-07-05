import fs from 'fs';
import path from 'path';
import { VertexAI } from "@google-cloud/vertexai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'giantswisdom-8dc26';
const location = 'us-central1';
const vertex_ai = new VertexAI({ project, location });
const model = vertex_ai.preview.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

const locales = ['ar','de','el','es','fa','fr','ha','he','hi','id','it','ja','ko','nl','pl','pt','ru','sw','th','tr','uk','vi','zh'];
const MESSAGES_DIR = path.resolve('messages');
const enMessages = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, 'en.json'), 'utf8'));

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

function cleanResponse(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/g, '').replace(/```$/g, '').trim();
  cleaned = cleaned.replace(/\[?TRANSLATED\]?/gi, '').trim();
  cleaned = cleaned.replace(/\[?Debug\]?/gi, '').trim();
  return cleaned;
}

async function translateFields(slug: string, locale: string, targetGiant: any, enGiant: any): Promise<boolean> {
  const langName = locale; // We can just use the locale code, the model knows them

  const isRTL = ['ar', 'he', 'fa'].includes(locale);
  const rtlRule = isRTL ? "\n- RTL 반전 방지: 문장 구조나 마침표 위치가 뒤집히지 않도록 올바른 RTL 방향성(Right-to-Left)을 엄격하게 유지하십시오." : "";

  const systemInstruction = `당신은 역사 전기 전문 번역가입니다.
제공된 영어 원문을 지정된 대상 언어(코드: ${locale})로 정확하게 번역해 주세요.

[필수 가드레일 규칙]
1. 영어 유출 방지 (English Leak): 영어 원문을 섞어 쓰거나 그대로 남기지 말고 100% 목표 언어로 번역할 것. (고유명사는 해당 언어의 위키피디아 표기법 또는 보편적 표기법 사용)
2. 마크다운 금지 (No Markdown): 번역 결과에 \`**\`, \`#\`, \`*\` 등 마크다운 태그를 절대 사용하지 말고 순수 평문(Plain Text)으로만 작성할 것.
3. 디버그 태그 금지 (No Debug Tags): 응답 앞뒤에 '[번역 완료]', '[Debug]' 등의 시스템 메시지를 절대 붙이지 말 것. 오직 JSON 객체만 반환할 것.${rtlRule}
4. Era 필드 문맥: 'era' 필드는 화면 상단 타이틀에 쓰이므로 각 언어권에서 가장 자연스러운 수식어로 번역할 것 (예: 15세기 거인).
`;

  const prompt = `Translate the following 4 fields from English into the language with locale code '${locale}'.
Giant: ${slug}

Source (English):
{
  "era": ${JSON.stringify(enGiant.era)},
  "trials": ${JSON.stringify(enGiant.trials)},
  "overcoming": ${JSON.stringify(enGiant.overcoming)},
  "wisdom_lessons": ${JSON.stringify(enGiant.wisdom_lessons)}
}

Respond ONLY with a valid JSON object matching the exact structure below, without markdown blocks.
{
  "era": "...",
  "trials": "...",
  "overcoming": "...",
  "wisdom_lessons": [
    {
      "quote": "...",
      "explanation": "..."
    }
  ]
}`;

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const res = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
        systemInstruction: { parts: [{ text: systemInstruction }] }
      });
      
      const responseText = cleanResponse(res.response.candidates[0].content.parts[0].text);
      const parsed = JSON.parse(responseText);
      
      let valid = true;
      if (!parsed.era || !parsed.trials || !parsed.overcoming || !Array.isArray(parsed.wisdom_lessons)) valid = false;
      if (parsed.wisdom_lessons?.length !== enGiant.wisdom_lessons.length) valid = false;
      
      if (valid) {
        // Strip markdown if any sneaks through
        targetGiant.era = parsed.era.replace(/\*\*/g, '');
        targetGiant.trials = parsed.trials.replace(/\*\*/g, '');
        targetGiant.overcoming = parsed.overcoming.replace(/\*\*/g, '');
        targetGiant.wisdom_lessons = parsed.wisdom_lessons.map((wl: any) => ({
          quote: (wl.quote || '').replace(/\*\*/g, ''),
          explanation: (wl.explanation || '').replace(/\*\*/g, '')
        }));
        return true;
      } else {
        console.warn(`[${locale}] [${slug}] Validation failed on attempt ${attempts}.`);
      }
    } catch (e: any) {
      if (e.message && e.message.includes('429')) {
        console.log(`[${locale}] Rate limit hit, sleeping 10s...`);
        await sleep(10000);
      } else {
        console.error(`[${locale}] [${slug}] Error on attempt ${attempts}: ${e.message}`);
      }
    }
  }
  return false;
}

async function main() {
  console.log("=== Starting Missing Fields Translation (4 Fields) ===");

  for (const loc of locales) {
    console.log(`\n>>> Processing locale: [${loc}]`);
    const filePath = path.join(MESSAGES_DIR, `${loc}.json`);
    if (!fs.existsSync(filePath)) continue;
    
    let targetData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let updatedCount = 0;
    
    const giantKeys = Object.keys(targetData).filter(k => k !== 'ui' && k !== 'blog');
    
    for (const slug of giantKeys) {
      const targetGiant = targetData[slug];
      const enGiant = enMessages[slug];
      if (!enGiant) continue;
      
      const needsTranslation = (
        !targetGiant.trials || targetGiant.trials === enGiant.trials ||
        !targetGiant.overcoming || targetGiant.overcoming === enGiant.overcoming ||
        !targetGiant.era || targetGiant.era === enGiant.era ||
        !targetGiant.wisdom_lessons || JSON.stringify(targetGiant.wisdom_lessons) === JSON.stringify(enGiant.wisdom_lessons)
      );
      
      if (needsTranslation) {
        console.log(`  [${loc}] Translating missing fields for ${slug}...`);
        const success = await translateFields(slug, loc, targetGiant, enGiant);
        if (success) {
          updatedCount++;
          // Save incrementally to prevent losing work
          fs.writeFileSync(filePath, JSON.stringify(targetData, null, 2));
        } else {
          console.error(`  [${loc}] Failed to translate ${slug}`);
        }
        await sleep(1000); // rate limiting
      }
    }
    
    console.log(`<<< Finished locale: [${loc}], updated ${updatedCount} giants.`);
  }

  console.log("\n=== All translations completed! ===");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
