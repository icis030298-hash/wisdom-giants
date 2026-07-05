import fs from 'fs';
import path from 'path';
import { VertexAI } from "@google-cloud/vertexai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'giantswisdom-8dc26';
const location = 'us-central1';
const vertex_ai = new VertexAI({ project, location });
// User requested Flash-Lite!
const model = vertex_ai.preview.getGenerativeModel({
  model: 'gemini-2.5-flash-lite',
});

const locales = ['ar','de','el','es','fa','fr','ha','he','hi','id','it','ja','nl','pl','pt','ru','sw','th','tr','uk','vi','zh']; // removed ko, en
const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');

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

interface FieldsToTranslate {
  era: boolean;
  trials: boolean;
  overcoming: boolean;
  wisdom: boolean;
}

async function translateFields(slug: string, locale: string, giant: any, fields: FieldsToTranslate): Promise<boolean> {
  const isRTL = ['ar', 'he', 'fa'].includes(locale);
  const rtlRule = isRTL ? "\n- RTL 반전 방지: 문장 구조나 마침표 위치가 뒤집히지 않도록 올바른 RTL 방향성(Right-to-Left)을 엄격하게 유지하십시오." : "";

  const systemInstruction = "당신은 역사 전기 전문 번역가입니다.\n제공된 원문을 지정된 대상 언어(코드: " + locale + ")로 정확하게 번역해 주세요.\n\n[필수 가드레일 규칙]\n1. 영어 유출 방지 (English Leak): 원문을 섞어 쓰거나 그대로 남기지 말고 100% 목표 언어로 번역할 것.\n2. 마크다운 금지 (No Markdown): 번역 결과에 '**', '#', '*' 등 마크다운 태그를 절대 사용하지 말고 순수 평문(Plain Text)으로만 작성할 것.\n3. 디버그 태그 금지 (No Debug Tags): 응답 앞뒤에 '[번역 완료]', '[Debug]' 등의 시스템 메시지를 절대 붙이지 말 것. 오직 JSON 객체만 반환할 것." + rtlRule + "\n4. Era 필드 문맥: 'era' 필드는 화면 상단 타이틀에 쓰이므로 각 언어권에서 가장 자연스러운 수식어로 번역할 것 (예: 15세기 거인).";

  // Build dynamic prompt structure
  const sourceObj: any = {};
  const schemaObj: any = {};

  if (fields.era) {
    sourceObj.era = giant.era_ko || giant.era_en || '';
    schemaObj.era = "...";
  }
  if (fields.trials) {
    sourceObj.trials = giant.trials_ko || giant.trials_en || '';
    schemaObj.trials = "...";
  }
  if (fields.overcoming) {
    sourceObj.overcoming = giant.overcoming_ko || giant.overcoming_en || '';
    schemaObj.overcoming = "...";
  }
  if (fields.wisdom) {
    sourceObj.wisdom_lessons = (giant.wisdom || []).map((w: any) => ({
      quote: w.quote_ko || w.quote_en || '',
      meaning: w.meaning_ko || w.meaning_en || ''
    }));
    schemaObj.wisdom_lessons = [
      {
        quote: "...",
        meaning: "..."
      }
    ];
  }

  const prompt = "Translate the following fields into the language with locale code '" + locale + "'.\nGiant: " + slug + "\n\nSource:\n" + JSON.stringify(sourceObj, null, 2) + "\n\nRespond ONLY with a valid JSON object matching the exact structure below, without markdown blocks.\n" + JSON.stringify(schemaObj, null, 2);

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
      if (fields.era && !parsed.era) valid = false;
      if (fields.trials && !parsed.trials) valid = false;
      if (fields.overcoming && !parsed.overcoming) valid = false;
      if (fields.wisdom) {
        if (!Array.isArray(parsed.wisdom_lessons) || parsed.wisdom_lessons.length !== (giant.wisdom || []).length) {
          valid = false;
        }
      }
      
      if (valid) {
        if (fields.era) {
          giant["era_" + locale] = parsed.era.replace(/\*\*/g, '');
        }
        if (fields.trials) {
          giant["trials_" + locale] = parsed.trials.replace(/\*\*/g, '');
        }
        if (fields.overcoming) {
          giant["overcoming_" + locale] = parsed.overcoming.replace(/\*\*/g, '');
        }
        if (fields.wisdom) {
          for (let i = 0; i < parsed.wisdom_lessons.length; i++) {
            if (!giant.wisdom[i]) giant.wisdom[i] = {};
            giant.wisdom[i]["quote_" + locale] = (parsed.wisdom_lessons[i].quote || '').replace(/\*\*/g, '');
            giant.wisdom[i]["meaning_" + locale] = (parsed.wisdom_lessons[i].meaning || '').replace(/\*\*/g, '');
          }
        }
        return true;
      } else {
        console.warn("[" + locale + "] [" + slug + "] Validation failed on attempt " + attempts + ".");
      }
    } catch (e: any) {
      if (e.message && e.message.includes('429')) {
        console.log("[" + locale + "] Rate limit hit, sleeping 10s...");
        await sleep(10000);
      } else {
        console.error("[" + locale + "] [" + slug + "] Error on attempt " + attempts + ": " + e.message);
      }
    }
  }
  return false;
}

async function main() {
  console.log("=== Starting Selective Missing Fields Translation (Flash-Lite) ===");
  const data = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));
  const slugs = Object.keys(data);
  let updatedCount = 0;

  for (const loc of locales) {
    console.log('\n>>> Processing locale: [' + loc + ']');
    let localeUpdates = 0;
    const chunkSize = 20;

    for (let i = 0; i < slugs.length; i += chunkSize) {
      const chunk = slugs.slice(i, i + chunkSize);
      const promises = [];
      
      for (const slug of chunk) {
        const giant = data[slug];
        
        // 1. Determine if era needs translation / re-translation
        const eraLoc = giant['era_' + loc];
        const sourceEra = giant.era_ko || giant.era_en || '';
        const sourceHasYears = sourceEra.includes('~') || sourceEra.includes('-') || /\d/.test(sourceEra);
        const locHasYears = eraLoc && (eraLoc.includes('~') || eraLoc.includes('-') || /\d/.test(eraLoc));
        const needsEra = !eraLoc || (sourceHasYears && !locHasYears);

        // 2. Determine other missing fields
        const needsTrials = !giant['trials_' + loc];
        const needsOvercoming = !giant['overcoming_' + loc];
        
        const wisdom = giant.wisdom || [];
        const needsWisdom = wisdom.length === 0 || wisdom.some((w: any) => !w['quote_' + loc] || !w['meaning_' + loc]);

        if (needsEra || needsTrials || needsOvercoming || needsWisdom) {
          const fields: FieldsToTranslate = {
            era: needsEra,
            trials: needsTrials,
            overcoming: needsOvercoming,
            wisdom: needsWisdom
          };
          
          promises.push((async () => {
            console.log('  [' + loc + '] Translating missing fields for ' + slug + ':', JSON.stringify(fields));
            const success = await translateFields(slug, loc, giant, fields);
            if (success) {
              localeUpdates++;
              updatedCount++;
            } else {
              console.error('  [' + loc + '] Failed to translate ' + slug);
            }
          })());
        }
      }
      
      if (promises.length > 0) {
        await Promise.all(promises);
        // Save checkpoint after each chunk
        fs.writeFileSync(NARRATIVES_FILE, JSON.stringify(data, null, 2));
        console.log('  -- Checkpoint saved for ' + loc + ' (Chunk ' + Math.floor(i / chunkSize + 1) + ')');
        await sleep(1000); // Small sleep between chunks to avoid rate limits
      }
    }
    
    if (localeUpdates > 0) {
      console.log('<<< Finished locale: [' + loc + '], updated ' + localeUpdates + ' giants.');
    } else {
      console.log('<<< Locale [' + loc + '] is already fully translated.');
    }
  }

  console.log("\n=== All translations completed! Total updates: " + updatedCount + " ===");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
