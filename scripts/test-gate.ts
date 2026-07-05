import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const narratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
const slug = 'napoleon-bonaparte';
const sourceKo = narratives[slug].epic_ko;
const factBoxKo = narratives[slug].fact_box;

const systemInstruction = `당신은 역사 전기 전문 번역가이자 다국어 SEO 콘텐츠 조정자입니다.
제공된 한국어 인물 서사(원문)를 지정된 언어로 **격조 높고 정확하게** 번역해 주세요.

목표 언어: Spanish (언어코드: es)
대상 인물: napoleon-bonaparte
인물 고유명사 표준 기준 (해당 언어 위키피디아 제목): Napoleón Bonaparte

[번역 규칙]
1. 격조 높은 번역: 목표 언어의 역사 서술에 맞는 어조를 유지하되, 다음 톤 가이드라인을 엄수하십시오. -> [톤 가이드라인]: 역사적 사료가 매우 풍부한 인물이므로, 극적이고 문학적인 은유와 수사를 적극 사용하여 서사시적인 톤(Epic tone)을 살리십시오.
2. 구조 보존: 원문의 '정확히 4개 단락' 및 줄바꿈 구조를 완벽히 유지하십시오. 내용 추가나 생략 금지.
3. 사실 관계 보존: 원문에 기재된 날짜, 수치, 인과관계 순서를 절대 왜곡하거나 뒤집지 마십시오.
4. 고유명사 준수: 제공된 위키피디아 표준 표제어를 일관되게 적용하십시오.
5. 메타데이터 차단: 본문 전후에 글자 수 계산이나 번역 완료 표시를 남기지 마십시오.
6. 팩트박스(Fact Box) 절대 엄수: 팩트박스의 한 줄 요약, 핵심 업적 3개, 영향/유산은 반드시 한국어 원문의 항목 개수, 순서, 역사적 사실을 100% 1:1 직역해야 합니다. 재요약, 재선정, 추가, 삭제 절대 금지.`;

const prompt = `다음 한국어 인물 서사와 팩트 박스를 Spanish로 번역해 주세요.
반드시 아래 JSON 형식으로 반환:
{
  "narrative": "4단락으로 번역된 본문 (줄바꿈 \\n\\n)",
  "fact_box": {
    "one_line_summary": "번역된 한 줄 요약",
    "key_achievements": ["번역된 업적 1", "번역된 업적 2", "번역된 업적 3"],
    "legacy_statement": "번역된 영향/유산"
  }
}

--- 원문 (Source) ---
[서사 본문]
${sourceKo}
[Fact Box]
${JSON.stringify(factBoxKo, null, 2)}`;

model.generateContent({
  contents: [{ role: 'user', parts: [{ text: prompt }] }],
  generationConfig: { temperature: 0.1, responseMimeType: 'application/json' },
  systemInstruction
}).then(res => {
  const parsed = JSON.parse(res.response.text());
  console.log('Factbox key achievements:', parsed.fact_box.key_achievements);
  let cleanEpic = parsed.narrative.replace(/\([0-9,]+\s*(자|words|characters|chars)\)/gi, '').replace(/\[?TRANSLATED\]?/gi, '').trim();
  const pCount = cleanEpic.split(/\n+/).filter(p => p.trim().length > 0).length;
  console.log('Paragraphs:', pCount);
  console.log('Narrative length:', cleanEpic.length);
});
