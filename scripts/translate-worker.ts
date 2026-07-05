import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error("Error: GEMINI_API_KEY not configured."); process.exit(1); }

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Fast and cheap for large batch

const langCode = process.argv[2];
const chunkNum = process.argv[3];
if (!langCode || !chunkNum) { 
  console.error("Usage: npx tsx scripts/translate-worker.ts <langCode> <chunkNum>"); 
  process.exit(1); 
}

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const WIKI_LINKS_FILE = path.resolve('src/data/wikipedia-links.json');
const CHUNK_FILE = path.resolve(`scratch/translations/${langCode}-chunk-${chunkNum}.json`);
const OUTPUT_FILE = path.resolve(`scratch/translations/${langCode}-batch-${chunkNum}-result.json`);
const DASHBOARD_FILE = path.resolve('scratch/translations/translation-progress-dashboard.json');

if (!fs.existsSync(CHUNK_FILE)) {
  console.error(`청크 파일 없음: ${CHUNK_FILE}`);
  process.exit(1);
}

const slugsToProcess = JSON.parse(fs.readFileSync(CHUNK_FILE, 'utf8'));
const narratives = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));
const wikiLinks = JSON.parse(fs.readFileSync(WIKI_LINKS_FILE, 'utf8'));

let tierMap: Record<string, number> = {};
try {
  tierMap = JSON.parse(fs.readFileSync(path.resolve('scratch/translations/tier-mapping.json'), 'utf8'));
} catch (e) {
  console.log('Tier mapping not found, defaulting to Tier 2.');
}

// Language name mapping for the prompt
const langNameMap: Record<string, string> = {
  'en': 'English', 'ja': 'Japanese', 'zh': 'Chinese (Simplified)', 'fr': 'French',
  'de': 'German', 'es': 'Spanish', 'it': 'Italian', 'pt': 'Portuguese',
  'ru': 'Russian', 'ar': 'Arabic', 'hi': 'Hindi', 'bn': 'Bengali',
  'tr': 'Turkish', 'fa': 'Persian', 'pl': 'Polish', 'nl': 'Dutch',
  'sv': 'Swedish', 'vi': 'Vietnamese', 'uk': 'Ukrainian', 'id': 'Indonesian',
  'cs': 'Czech', 'ro': 'Romanian', 'hu': 'Hungarian'
};

const targetLangName = langNameMap[langCode] || langCode;

function updateDashboard(lang: string, success: boolean, flags: string[]) {
  let dashboard: any = {};
  if (fs.existsSync(DASHBOARD_FILE)) {
    try { dashboard = JSON.parse(fs.readFileSync(DASHBOARD_FILE, 'utf8')); } catch (e) {}
  }
  if (!dashboard[lang]) {
    dashboard[lang] = { totalProcessed: 0, successes: 0, failures: 0, flags: [] };
  }
  dashboard[lang].totalProcessed++;
  if (success) dashboard[lang].successes++;
  else dashboard[lang].failures++;
  if (flags.length > 0) dashboard[lang].flags.push(...flags);
  fs.writeFileSync(DASHBOARD_FILE, JSON.stringify(dashboard, null, 2), 'utf8');
}

function cleanResponse(text: string): string {
  // 메타 텍스트 노출 필터링
  let cleaned = text.replace(/\([0-9,]+\s*(자|words|characters|chars)\)/gi, '').trim();
  cleaned = cleaned.replace(/\[?TRANSLATED\]?/gi, '').trim();
  return cleaned;
}

async function translateNarrative(slug: string, sourceKo: string, factBoxKo: any, localizedName: string) {
  const tier = tierMap[slug] || 2;
  let toneGuide = "";
  if (tier === 1) {
    toneGuide = "역사적 사료가 매우 풍부한 인물이므로, 극적이고 문학적인 은유와 수사를 적극 사용하여 서사시적인 톤(Epic tone)을 살리십시오.";
  } else if (tier === 2) {
    toneGuide = "자료가 적당한 인물이므로 절제된 문학적 톤을 사용하고, 화려한 은유나 과장은 단락당 1~2회로 제한하십시오.";
  } else {
    toneGuide = "자료가 제한적인 인물이므로 철저히 사실(Fact) 중심의 건조하고 담백한 서술을 유지하십시오. 과장된 수사나 확인되지 않은 심리 묘사(예: '그의 영혼을 갉아먹었다')는 절대 금지합니다.";
  }

  const systemInstruction = `당신은 역사 전기 전문 번역가이자 다국어 SEO 콘텐츠 조정자입니다.
제공된 한국어 인물 서사(원문)를 지정된 언어로 **격조 높고 정확하게** 번역해 주세요.

목표 언어: ${targetLangName} (언어코드: ${langCode})
대상 인물: ${slug}
인물 고유명사 표준 기준 (해당 언어 위키피디아 제목): ${localizedName || '해당 언어의 보편적인 표기법 사용'}

[번역 규칙]
1. 격조 높은 번역: 목표 언어의 역사 서술에 맞는 어조를 유지하되, 다음 톤 가이드라인을 엄수하십시오.
   -> [톤 가이드라인]: ${toneGuide}
2. 구조 보존: 원문의 '정확히 4개 단락' 및 줄바꿈 구조를 완벽히 유지하십시오. 내용 추가나 생략 금지.
3. 사실 관계 보존: 원문에 기재된 날짜, 수치, 인과관계 순서를 절대 왜곡하거나 뒤집지 마십시오.
4. 고유명사 준수: 제공된 위키피디아 표준 표제어를 인물 이름 및 주요 개념어에 일관되게 적용하십시오.
5. 메타데이터 차단: 본문 전후에 글자 수 계산 괄호(예: (500자))나 번역 완료 표시([TRANSLATED])를 절대로 남기지 마십시오.
6. 팩트박스(Fact Box) 절대 엄수: 팩트박스의 한 줄 요약, 핵심 업적 3개, 영향/유산은 반드시 원문을 100% 1:1 직역해야 합니다. 다른 역사적 사실로 교체하거나 요약본을 새로 작성하는 행위는 엄격히 금지됩니다. 원문의 항목 개수, 내용, 순서와 완전히 일치해야 합니다.`;

  const prompt = `다음 한국어 인물 서사와 팩트 박스를 ${targetLangName}로 번역해 주세요.
반드시 아래 JSON 형식으로 반환:
{
  "narrative": "4단락으로 번역된 전체 서사 본문 (줄바꿈 기호 \\n\\n 포함)",
  "fact_box": {
    "one_line_summary": "번역된 60자 내외 한 줄 요약",
    "key_achievements": [
      "번역된 업적 1 (20~30자 내외)",
      "번역된 업적 2 (20~30자 내외)",
      "번역된 업적 3 (20~30자 내외)"
    ],
    "legacy_statement": "번역된 50자 내외 현재까지의 영향/유산"
  }
}

--- 원문 (Source) ---
[서사 본문]
${sourceKo}

[Fact Box]
${JSON.stringify(factBoxKo, null, 2)}`;

  let success = false;
  let attempts = 0;
  let finalResult: any = { narrative: '', fact_box: null };
  const flags: string[] = [];
  let currentFeedback = '';

  while (!success && attempts < 4) {
    attempts++;
    console.log(`  - 시도 ${attempts}/4...`);
    try {
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt + (currentFeedback && attempts > 1 ? '\n[피드백]\n' + currentFeedback : '') }] }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
        systemInstruction
      });
      
      const text = response.response.text();
      let parsed = JSON.parse(text);
      
      let cleanEpic = cleanResponse(parsed.narrative || '');
      const pCount = cleanEpic.split(/\n+/).filter((p: string) => p.trim().length > 0).length;
      parsed.narrative = cleanEpic;

      let issue = '';
      if (pCount !== 4) issue += `단락 ${pCount}개(4개 단락 구조 필수). `;
      if (!parsed.fact_box || !parsed.fact_box.one_line_summary || !Array.isArray(parsed.fact_box.key_achievements) || parsed.fact_box.key_achievements.length !== 3) {
        issue += `fact_box 필드 누락 또는 형식 오류. `;
      }

      if (!issue) {
        success = true;
        finalResult = parsed;
      } else {
        currentFeedback = `[오류] ${issue.trim()} 원문의 형식을 100% 보존하여 다시 번역하세요.`;
        console.warn(`    * 실패: ${issue}`);
        finalResult = parsed;
      }
    } catch (err: any) {
      console.error(`    * API 오류:`, err.message);
      currentFeedback = `[오류] JSON 파싱 오류. 올바른 JSON 포맷으로 응답하세요.`;
    }
  }

  if (!success) flags.push(`[${slug}] ${attempts}회 시도 실패: 구조 불안정`);
  
  return { parsed: finalResult, flags, success };
}

async function main() {
  console.log(`=== Translate Worker [${langCode}] Chunk [${chunkNum}] 시작 ===`);
  
  const results: any[] = [];
  const startTime = Date.now();

  for (let i = 0; i < slugsToProcess.length; i++) {
    const slug = slugsToProcess[i];
    console.log(`\n[${i + 1}/${slugsToProcess.length}] ${slug} 번역 중... (${targetLangName})`);
    
    const sourceKo = narratives[slug]?.epic_ko;
    const factBoxKo = narratives[slug]?.fact_box;
    
    if (!sourceKo) {
      console.log(`  - 건너뜀: epic_ko 원문 없음`);
      continue;
    }

    let localizedName = '';
    const wikiUrl = wikiLinks[slug]?.[langCode];
    if (wikiUrl) {
      try {
        localizedName = decodeURIComponent(wikiUrl.substring(wikiUrl.lastIndexOf('/') + 1)).replace(/_/g, ' ');
      } catch (e) { }
    }

    const generated = await translateNarrative(slug, sourceKo, factBoxKo, localizedName);
    
    results.push({
      slug,
      narrative: generated.parsed.narrative,
      fact_box: generated.parsed.fact_box,
      flags: generated.flags,
      success: generated.success
    });
    
    updateDashboard(langCode, generated.success, generated.flags);
    
    // Rate limiting (Tiers like 15 RPM for free tier could be an issue, adding slight delay)
    await new Promise(r => setTimeout(r, 2000));
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n=== Worker [${langCode}] Chunk [${chunkNum}] 완료 (${((Date.now() - startTime) / 1000).toFixed(1)}s) ===`);
  console.log(`결과물 저장: ${OUTPUT_FILE}`);
}

main().catch(console.error);
