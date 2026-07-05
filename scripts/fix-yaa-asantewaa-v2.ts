import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY is not configured.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function cleanEpicText(text: string): string {
  let cleaned = text.replace(/^[0-9]\.\s+/gm, '');
  cleaned = cleaned.replace(/^[단락문단장]\s*[0-9일이삼사]\s*[:：\-]*\s*/gm, '');
  const paragraphs = cleaned.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
  return paragraphs.join('\n\n');
}

async function main() {
  console.log("=== Fixing yaa-asantewaa (v2) ===");
  const draftPath = path.resolve('scratch/batch2-part1-narratives-draft.json');
  const draftResults = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
  
  const target = draftResults.find((r: any) => r.slug === 'yaa-asantewaa');
  if (!target) {
    console.error("yaa-asantewaa not found in batch2-part1-narratives-draft.json");
    return;
  }

  const systemInstruction = `당신은 역사 전기 작가 겸 SEO 콘텐츠 전문가입니다.
아래 인물에 대해 사실에만 입각하여 깊이 있고 격조 높은 한국어 전기 서사와 핵심 팩트 요약(fact_box)을 작성하세요.

[서사 구조 및 분량]
- 총 글자수는 **1,800자 이상, 2,200자 이하**여야 합니다. (공백 포함)
- 정확히 **4개의 단락(Paragraph)**으로 구성.
- 1단락: 시대 배경 + 인물 탄생 (약 450~500자)
- 2단락: 핵심 갈등 또는 전환점 (약 480~520자)
- 3단락: 시련과 투쟁, 극복 과정 (약 500~550자)
- 4단락: 유산과 현재까지의 영향 (약 400~450자)

[SEO 최적화 규칙]
- 1단락 첫 문장에 반드시 "인물 전체 이름 + 출생연도(또는 활동시기) + 핵심 정체성(직업/역할)"을 명시하세요.
- 인물과 연관된 핵심 개념이나 업적명(예: '황금 의자 전쟁')이 있다면, 처음 등장할 때 그것이 무엇인지 명확히 정의하듯 서술하세요.

[내부 연결 유도]
- 4단락 말미에, 같은 시대나 유사한 주제를 가진 다른 인물과의 비교나 연결을 암시하는 문장을 포함하세요.

[사실 근거 및 정밀도 가드레일 - 극도로 중요]
- 야 아산테와의 오빠 '나나 아콰시 아프라네 오케세(Nana Akwasi Afrane Okese)'는 **1894년에 사망**했습니다. 절대로 1900년 전쟁이나 유배와 연관짓지 마세요.
- **1896년**에 프렘페 1세와 함께 유배된 인물은 야 아산테와의 **손자인 '코피 텡(Kofi Tene)'**입니다.
- **1900년** 황금 의자 전쟁 이후, 야 아산테와 본인이 체포되어 세이셸로 유배될 때 함께한 사람들은 **"15명의 측근 족장들"**입니다. (오빠나 손자와 혼동 금지)
- **[출력 포맷 가드레일]**: 글자 수를 세기 위한 (NNN자) 형태의 메모를 본문에 절대 남기지 마세요.`;

  const prompt = `역사적 인물 [Yaa Asantewaa (야 아산테와)]에 대한 한국어 서사와 팩트 박스를 작성해 주세요. 
반드시 아래 JSON 형식으로 반환해야 합니다:
{
  "narrative": "4단락으로 구성된 전체 서사 (1800자~2200자)",
  "fact_box": {
    "one_line_summary": "...",
    "key_achievements": ["...", "...", "..."],
    "legacy_statement": "..."
  }
}

기존 서사에서 발견된 사실관계 오류를 수정하는 작업입니다. 위 시스템 지침의 [사실 근거] 항목을 철저히 반영하여 가족 관계와 유배 상황을 완벽하게 바로잡아 주세요.`;

  let success = false;
  let attempts = 0;
  let feedback = '';
  
  while (!success && attempts < 5) {
    attempts++;
    console.log(`- Generation attempt ${attempts}/5...`);
    try {
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt + (feedback ? '\\n[피드백]\\n' + feedback : '') }] }],
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
        systemInstruction
      });
      const text = response.response.text();
      let parsed = JSON.parse(text);
      if (parsed.narrative) parsed.narrative = cleanEpicText(parsed.narrative);

      let cleanEpic = parsed.narrative || '';
      let issue = '';
      if (/\([0-9,]+자\)/.test(cleanEpic)) {
         cleanEpic = cleanEpic.replace(/\([0-9,]+자\)/g, '').trim();
         parsed.narrative = cleanEpic;
      }

      const len = cleanEpic.length;
      const paragraphs = cleanEpic.split(/\n+/).filter((p: string) => p.trim().length > 0);
      const pCount = paragraphs.length;

      console.log(`  * Length: ${len} characters, Paragraph count: ${pCount}`);
      
      if (len < 1800) issue += `글자수가 ${len}자로 하한선(1,800자)에 미달했습니다. 더 보강하세요. `;
      else if (len > 2300) issue += `글자수가 ${len}자로 상한선(2,200자)을 초과했습니다. 더 줄이세요. `;
      if (pCount !== 4) issue += `단락 수가 ${pCount}개입니다. 정확히 4단락이어야 합니다. `;
      
      if (issue === '') {
        success = true;
        console.log(`  * Success! Length and criteria met.`);
        target.new_length = len;
        target.new_text = cleanEpic;
        target.fact_box = parsed.fact_box;
      } else {
        feedback = issue;
        console.warn(`  * Validation failed: ${issue}`);
      }
    } catch (err) {
      console.error(`  * Error:`, (err as Error).message);
      feedback = '에러 발생';
    }
  }

  fs.writeFileSync(draftPath, JSON.stringify(draftResults, null, 2), 'utf8');
  console.log(`\n=== Fixing Completed ===`);
}

main().catch(console.error);
