import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const narratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
const giant = narratives['napoleon-bonaparte']; // 나폴레옹 샘플

const targetLangs = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'ja', name: 'Japanese' }
];

async function generateSample() {
  let output = '# 서사 번역 품질 사전 검수 (샘플)\n\n현재 영어(en) 청크 1번이 완료되기 전, 타 언어들의 번역 톤앤매너와 4단락/팩트박스 구조 유지 여부를 점검하기 위해 **나폴레옹(Napoleon)**의 데이터를 3개 국어로 샘플 번역한 결과입니다.\n\n';

  for (const lang of targetLangs) {
    console.log(`Translating sample to ${lang.name}...`);
    const systemInstruction = `당신은 역사 전기 전문 번역가입니다.
목표 언어: ${lang.name}
규칙: 
1. 격조 높은 번역
2. 정확히 4개 단락 유지
3. 사실 관계 보존
4. 메타데이터 차단`;

    const prompt = `다음 한국어 인물 서사와 팩트 박스를 ${lang.name}로 번역해 주세요.
반드시 아래 JSON 형식으로 반환:
{
  "narrative": "4단락으로 번역된 본문 (줄바꿈 \\n\\n)",
  "fact_box": {
    "one_line_summary": "번역된 한 줄 요약",
    "key_achievements": ["업적1", "업적2", "업적3"],
    "legacy_statement": "영향/유산"
  }
}

[서사 본문]
${giant.epic_ko}

[Fact Box]
${JSON.stringify(giant.fact_box, null, 2)}`;

    try {
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
        systemInstruction
      });
      const result = JSON.parse(response.response.text());
      
      output += `## ${lang.name} (${lang.code})\n\n`;
      output += `### 본문 (Narrative)\n\n${result.narrative.replace(/\\n/g, '\n')}\n\n`;
      output += `### 팩트 박스 (Fact Box)\n\n`;
      output += `- **한 줄 요약**: ${result.fact_box.one_line_summary}\n`;
      output += `- **핵심 업적**:\n  1. ${result.fact_box.key_achievements[0]}\n  2. ${result.fact_box.key_achievements[1]}\n  3. ${result.fact_box.key_achievements[2]}\n`;
      output += `- **영향/유산**: ${result.fact_box.legacy_statement}\n\n---\n\n`;
    } catch(e) {
      console.error(e);
    }
  }
  
  fs.writeFileSync('C:/Users/user/.gemini/antigravity/brain/1d63bcbe-3036-4a9b-99f0-ff3e2bb85ad4/narrative_translation_preview.md', output, 'utf8');
  console.log('Sample artifact created.');
}

generateSample();
