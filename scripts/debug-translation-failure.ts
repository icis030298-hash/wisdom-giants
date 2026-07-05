import fs from 'fs';
import path from 'path';
import { VertexAI } from "@google-cloud/vertexai";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'giantswisdom-8dc26';
const location = 'us-central1';
const vertex_ai = new VertexAI({ project, location });
const model = vertex_ai.preview.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const data = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));

function cleanResponse(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/g, '').replace(/```$/g, '').trim();
  return cleaned;
}

async function debugTranslate(slug: string, locale: string) {
  const giant = data[slug];
  const fields = { era: true, trials: true, overcoming: true, wisdom: false };

  const isRTL = ['ar', 'he', 'fa'].includes(locale);
  const rtlRule = isRTL ? "\n- RTL 반전 방지: 문장 구조나 마침표 위치가 뒤집히지 않도록 올바른 RTL 방향성(Right-to-Left)을 엄격하게 유지하십시오." : "";

  const systemInstruction = "당신은 역사 전기 전문 번역가입니다.\n제공된 원문을 지정된 대상 언어(코드: " + locale + ")로 정확하게 번역해 주세요.\n\n[필수 가드레일 규칙]\n1. 영어 유출 방지 (English Leak): 원문을 섞어 쓰거나 그대로 남기지 말고 100% 목표 언어로 번역할 것.\n2. 마크다운 금지 (No Markdown): 번역 결과에 '**', '#', '*' 등 마크다운 태그를 절대 사용하지 말고 순수 평문(Plain Text)으로만 작성할 것.\n3. 디버그 태그 금지 (No Debug Tags): 응답 앞뒤에 '[번역 완료]', '[Debug]' 등의 시스템 메시지를 절대 붙이지 말 것. 오직 JSON 객체만 반환할 것." + rtlRule + "\n4. Era 필드 문맥: 'era' 필드는 화면 상단 타이틀에 쓰이므로 각 언어권에서 가장 자연스러운 수식어로 번역할 것 (예: 15세기 거인).";

  const sourceObj: any = {
    era: giant.era_ko || giant.era_en || '',
    trials: giant.trials_ko || giant.trials_en || '',
    overcoming: giant.overcoming_ko || giant.overcoming_en || ''
  };

  const schemaObj: any = {
    era: "...",
    trials: "...",
    overcoming: "..."
  };

  const prompt = "Translate the following fields into the language with locale code '" + locale + "'.\nGiant: " + slug + "\n\nSource:\n" + JSON.stringify(sourceObj, null, 2) + "\n\nRespond ONLY with a valid JSON object matching the exact structure below, without markdown blocks.\n" + JSON.stringify(schemaObj, null, 2);

  console.log(`Prompt for ${slug}:`, prompt);

  try {
    const res = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
      systemInstruction: { parts: [{ text: systemInstruction }] }
    });

    const responseText = cleanResponse(res.response.candidates[0].content.parts[0].text);
    console.log(`Model Response Text:`, responseText);

    const parsed = JSON.parse(responseText);
    console.log(`Parsed Response:`, parsed);

    let valid = true;
    if (fields.era && !parsed.era) {
      console.log("Validation failed: parsed.era is missing");
      valid = false;
    }
    if (fields.trials && !parsed.trials) {
      console.log("Validation failed: parsed.trials is missing");
      valid = false;
    }
    if (fields.overcoming && !parsed.overcoming) {
      console.log("Validation failed: parsed.overcoming is missing");
      valid = false;
    }

    console.log("Is response valid?", valid);
  } catch (err: any) {
    console.error("Error debugging translation:", err.message);
  }
}

async function main() {
  await debugTranslate('john-f-kennedy', 'ar');
  console.log("\n====================\n");
  await debugTranslate('shaka-zulu', 'ar');
}

main();
