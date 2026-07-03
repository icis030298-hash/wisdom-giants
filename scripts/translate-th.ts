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

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const WIKI_LINKS_FILE = path.resolve('src/data/wikipedia-links.json');
const TIER_MAPPING_FILE = path.resolve('scratch/translations/tier-mapping.json');
const TIER_OVERRIDES_FILE = path.resolve('scratch/translations/tier-overrides.json');
const CHECKPOINTS_DIR = path.resolve('scratch/translations/checkpoints');
const REPORTS_DIR = path.resolve('scratch/reports');
const FAILED_ITEMS_FILE = path.join(REPORTS_DIR, 'failed-items.jsonl');

const langCode = 'th';
const langName = 'Thai';

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

function cleanResponse(text: string): string {
  let cleaned = text.replace(/\([0-9,]+\s*(자|words|characters|chars)\)/gi, '').trim();
  cleaned = cleaned.replace(/\[?TRANSLATED\]?/gi, '').trim();
  return cleaned;
}

const narratives = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));
const wikiLinks = JSON.parse(fs.readFileSync(WIKI_LINKS_FILE, 'utf8'));
const slugs = Object.keys(narratives);

let tierMap = JSON.parse(fs.readFileSync(TIER_MAPPING_FILE, 'utf8'));
if (fs.existsSync(TIER_OVERRIDES_FILE)) {
  const overrides = JSON.parse(fs.readFileSync(TIER_OVERRIDES_FILE, 'utf8'));
  tierMap = { ...tierMap, ...overrides };
}

async function translateNarrative(slug: string): Promise<any> {
  const sourceKo = narratives[slug]?.epic_ko;
  const factBoxKo = narratives[slug]?.fact_box;
  if (!sourceKo || !factBoxKo) return { success: false, reason: 'Source missing' };

  let localizedName = '';
  const wikiUrl = wikiLinks[slug]?.[langCode];
  if (wikiUrl) {
    try { localizedName = decodeURIComponent(wikiUrl.substring(wikiUrl.lastIndexOf('/') + 1)).replace(/_/g, ' '); } catch (e) { }
  }

  const tier = tierMap[slug] || 2;
  let toneGuide = "자료가 적당한 인물이므로 절제된 문학적 톤을 사용하고, 화려한 은유나 과장은 단락당 1~2회로 제한하십시오.";
  if (tier === 1) toneGuide = "역사적 사료가 매우 풍부한 인물이므로, 극적이고 문학적인 은유와 수사를 적극 사용하여 서사시적인 톤(Epic tone)을 살리십시오.";
  if (tier === 3) toneGuide = "자료가 제한적인 인물이므로 철저히 사실(Fact) 중심의 건조하고 담백한 서술을 유지하십시오. 과장된 수사나 확인되지 않은 심리 묘사는 절대 금지합니다.";

  const systemInstruction = `당신은 역사 전기 전문 번역가이자 다국어 SEO 콘텐츠 조정자입니다.
제공된 한국어 인물 서사(원문)를 지정된 언어로 **격조 높고 정확하게** 번역해 주세요.

목표 언어: ${langName} (언어코드: ${langCode})
대상 인물: ${slug}
인물 고유명사 표준 기준 (해당 언어 위키피디아 제목): ${localizedName || '해당 언어의 보편적인 표기법 사용'}

[번역 규칙]
1. 격조 높은 번역: 목표 언어의 역사 서술에 맞는 어조를 유지하되, 다음 톤 가이드라인을 엄수하십시오. -> [톤 가이드라인]: ${toneGuide}
2. 구조 보존: 원문의 '정확히 4개 단락' 및 줄바꿈 구조를 완벽히 유지하십시오. 내용 추가나 생략 금지.
3. 사실 관계 보존: 원문에 기재된 날짜, 수치, 인과관계 순서를 절대 왜곡하거나 뒤집지 마십시오.
4. 고유명사 준수: 제공된 위키피디아 표준 표제어를 일관되게 적용하십시오.
5. 메타데이터 차단: 본문 전후에 글자 수 계산이나 번역 완료 표시를 남기지 마십시오.
6. 팩트박스(Fact Box) 절대 엄수: 팩트박스의 한 줄 요약, 핵심 업적 3개, 영향/유산은 반드시 한국어 원문의 항목 개수, 순서, 역사적 사실을 100% 1:1 직역해야 합니다. 재요약, 재선정, 추가, 삭제 절대 금지.`;

  const prompt = `다음 한국어 인물 서사와 팩트 박스를 ${langName}로 번역해 주세요.
반드시 아래 JSON 형식으로 반환:
{
  "narrative": "4단락으로 번역된 본문 (줄바꿈 \\n\\n)",
  "fact_box": {
    "one_line_summary": "번역된 한 줄 요약",
    "key_achievements": ["번역된 업적 1", "번역된 업적 2", "... 원문과 동일한 개수의 배열"],
    "legacy_statement": "번역된 영향/유산"
  }
}

--- 원문 (Source) ---
[서사 본문]
${sourceKo}
[Fact Box]
${JSON.stringify(factBoxKo, null, 2)}`;

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const res = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
        systemInstruction: { parts: [{ text: systemInstruction }] }
      });
      const responseText = res.response.candidates[0].content.parts[0].text;
      const parsed = JSON.parse(responseText);
      let cleanEpic = cleanResponse(parsed.narrative || '');
      const pCount = cleanEpic.split(/\n+/).filter(p => p.trim().length > 0).length;
      
      let issue = '';
      if (pCount !== 4) issue += '단락 4개 아님. ';
      if (!parsed.fact_box || !Array.isArray(parsed.fact_box.key_achievements) || parsed.fact_box.key_achievements.length !== factBoxKo.key_achievements.length) {
        issue += `팩트박스 항목 개수 다름 (원본 ${factBoxKo.key_achievements.length}개, 번역본 ${parsed.fact_box?.key_achievements?.length}개). `;
      }
      if (!parsed.fact_box.one_line_summary || !parsed.fact_box.legacy_statement) issue += '팩트박스 필드 누락. ';
      
      if (!issue) {
        parsed.narrative = cleanEpic;
        return { success: true, parsed };
      } else {
        console.warn(`[${slug}] Validate fail: ${issue}`);
      }
    } catch (e: any) {
      if (e.message && e.message.includes('429')) {
        await sleep(10000); // Backoff for 429
      } else {
        console.error(`Attempt ${attempts} error for ${slug}: ${e.message}`);
      }
    }
  }
  return { success: false, reason: 'Retries exhausted' };
}

async function main() {
  console.log("=== Starting Thai Translation Worker ===");
  const cpFile = path.join(CHECKPOINTS_DIR, `${langCode}.json`);
  let cp: Record<string, any> = {};
  if (fs.existsSync(cpFile)) cp = JSON.parse(fs.readFileSync(cpFile, 'utf8'));

  let localTotal = 0;
  let localFails = 0;

  for (const slug of slugs) {
    if (cp[slug] && cp[slug].success) continue;

    localTotal++;
    console.log(`[Thai] Translating ${slug} (${localTotal}/${slugs.length})...`);
    const res = await translateNarrative(slug);
    
    if (res.success) {
      cp[slug] = res;
    } else {
      localFails++;
      fs.appendFileSync(FAILED_ITEMS_FILE, JSON.stringify({ slug, langCode, reason: res.reason }) + '\n');
      cp[slug] = { success: false };
      console.error(`[Thai] Failed to translate ${slug}: ${res.reason}`);
    }
    fs.writeFileSync(cpFile, JSON.stringify(cp, null, 2));
    await sleep(2000); // Respect Rate Limits (60RPM -> 1 request every 2s per language)
  }

  // Combine all to language JSON
  const finalData: Record<string, any> = {};
  for (const slug of slugs) {
    if (cp[slug] && cp[slug].success) finalData[slug] = cp[slug].parsed;
  }
  fs.writeFileSync(path.resolve(`scratch/translations/final-${langCode}.json`), JSON.stringify(finalData, null, 2));
  console.log("=== Thai Translation Finished and Saved! ===");
}

main().catch(err => {
  console.error("Fatal error in Thai translation:", err);
  process.exit(1);
});
