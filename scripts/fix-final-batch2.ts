import fs from 'fs';
import path from 'path';
import https from 'https';
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

async function generateForSlug(slug: string, currentText: string, customInstruction: string) {
  const systemInstruction = `당신은 역사 전기 작가 겸 SEO 콘텐츠 전문가입니다.
[서사 구조 및 분량]
- 총 글자수는 **1,800자 이상, 2,200자 이하**여야 합니다. (공백 포함)
- 정확히 **4개의 단락(Paragraph)**으로 구성.

[사실 근거 및 정밀도 가드레일]
- 위키피디아/위키데이터 자료 범위 내에서만 서술. 지어내지 말 것.
- **[출력 포맷 가드레일]**: 글자 수를 세기 위한 (NNN자) 형태의 메모를 본문에 절대 남기지 마세요.

[특별 지시사항]
${customInstruction}`;

  const prompt = `역사적 인물 [${slug}]에 대한 한국어 서사를 수정해 주세요. 
반드시 아래 JSON 형식으로 반환해야 합니다:
{
  "narrative": "수정된 4단락 서사",
  "fact_box": {
    "one_line_summary": "...",
    "key_achievements": ["...", "...", "..."],
    "legacy_statement": "..."
  }
}

기존 텍스트:
${currentText}`;

  let success = false;
  let attempts = 0;
  let feedback = '';
  let finalResult = null;
  
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
      
      if (len < 1800) issue += `글자수가 ${len}자로 하한선(1800자)에 미달했습니다. 더 보강하세요. `;
      else if (len > 2200) issue += `글자수가 ${len}자로 상한선(2200자)을 초과했습니다. 더 줄이세요. `;
      if (pCount !== 4) issue += `단락 수가 ${pCount}개입니다. 정확히 4단락이어야 합니다. `;
      
      if (issue === '') {
        success = true;
        console.log(`  * Success! Length and criteria met.`);
        finalResult = { len, cleanEpic, factBox: parsed.fact_box };
      } else {
        feedback = `[오류] ${issue}`;
        console.warn(`  * Validation failed: ${issue}`);
      }
    } catch (err) {
      console.error(`  * Error:`, (err as Error).message);
      feedback = '에러 발생';
    }
  }
  return finalResult;
}

async function main() {
  console.log("=== Final Fixing for Batch 2 ===");
  const draftPath = path.resolve('scratch/batch2-narratives-draft.json');
  const draftResults = JSON.parse(fs.readFileSync(draftPath, 'utf8'));

  // 1. johannes-gutenberg
  console.log("\n[1/3] Processing slug: johannes-gutenberg...");
  let gutenbergTarget = draftResults.find((r: any) => r.slug === 'johannes-gutenberg');
  if (gutenbergTarget) {
    const customInst = "이전 서사에서 각 단락 끝에 '(498자)'와 같은 글자수 표기가 포함되는 치명적인 버그가 있었습니다. 이번에는 내용을 완전히 재생성하되, 절대로 본문에 괄호나 글자수 표기를 넣지 마세요.";
    const res = await generateForSlug('johannes-gutenberg', gutenbergTarget.new_text, customInst);
    if (res) {
      gutenbergTarget.new_length = res.len;
      gutenbergTarget.new_text = res.cleanEpic;
      gutenbergTarget.fact_box = res.factBox;
    }
  }

  // 2. mustafa-kemal-ataturk
  console.log("\n[2/3] Processing slug: mustafa-kemal-ataturk...");
  let ataturkTarget = draftResults.find((r: any) => r.slug === 'mustafa-kemal-ataturk');
  if (ataturkTarget) {
    const customInst = `3단락의 "세브르 조약 -> 아나톨리아행" 인과관계를 올바르게 정정하세요. 
정확한 순서는 다음과 같아야 합니다: "1919년 5월, 무스타파 케말은 아나톨리아로 건너가 저항 운동을 조직했다. 이듬해 1920년 8월, 승전국들은 세브르 조약을 통해 제국의 영토를 분할하려 했으나, 이미 앙카라에 수립된 대국민의회는 이를 인정하지 않았다" 식으로 시간순으로 재배열하여 서술하세요. 나머지 구조와 분량은 유지하세요.`;
    const res = await generateForSlug('mustafa-kemal-ataturk', ataturkTarget.new_text, customInst);
    if (res) {
      ataturkTarget.new_length = res.len;
      ataturkTarget.new_text = res.cleanEpic;
      ataturkTarget.fact_box = res.factBox;
    }
  }

  // 3. augustus
  console.log("\n[3/3] Processing slug: augustus...");
  let augustusTarget = draftResults.find((r: any) => r.slug === 'augustus');
  if (augustusTarget) {
    augustusTarget.new_text = augustusTarget.new_text.replace("76세", "75세");
    console.log("  * Updated Augustus age from 76 to 75.");
  }

  fs.writeFileSync(draftPath, JSON.stringify(draftResults, null, 2), 'utf8');
  console.log(`\n=== Final Fixing Completed ===`);
}

main().catch(console.error);
