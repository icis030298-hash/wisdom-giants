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

const chunkNum = process.argv[2];
if (!chunkNum) {
  console.error("Usage: npx tsx scripts/generate-worker-epics.ts <chunkNum>");
  process.exit(1);
}

interface GroundingInfo {
  title: string;
  summary: string;
  sourceUrl: string;
  wikidataFacts: string;
  groundingTextLength: number;
}

function cleanEpicText(text: string): string {
  let cleaned = text.replace(/^[0-9]\.\s+/gm, '');
  cleaned = cleaned.replace(/^[단락문단장]\s*[0-9일이삼사]\s*[:：\-]*\s*/gm, '');
  const paragraphs = cleaned.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
  return paragraphs.join('\n\n');
}

async function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'WisdomGiantsBot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) resolve(data);
        else reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      });
    }).on('error', reject);
  });
}

async function fetchQID(title: string, lang: string = 'en'): Promise<string | null> {
  try {
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&titles=${encodeURIComponent(title)}&redirects=1&format=json`;
    const responseText = await fetchUrl(url);
    const json = JSON.parse(responseText);
    const pages = json?.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0] as any;
    return page?.pageprops?.wikibase_item || null;
  } catch (e) { return null; }
}

function formatWikidataTime(timeStr: string | undefined): string | undefined {
  if (!timeStr) return undefined;
  const isBC = timeStr.startsWith('-');
  const cleanTime = timeStr.replace(/^[+-]/, '');
  const parts = cleanTime.split('T')[0].split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  let formattedYear = isBC ? `기원전 ${year}년` : `${year}년`;
  if (month > 0 && day > 0) {
    if (month === 1 && day === 1) return `약 ${formattedYear}`;
    return `${formattedYear} ${month}월 ${day}일`;
  } else return `약 ${formattedYear}`;
}

async function fetchLabels(ids: string[]): Promise<Record<string, string>> {
  if (ids.length === 0) return {};
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids.join('|')}&props=labels&languages=ko|en&format=json`;
    const responseText = await fetchUrl(url);
    const json = JSON.parse(responseText);
    const entities = json.entities || {};
    const labelsMap: Record<string, string> = {};
    for (const id of ids) {
      const entity = entities[id];
      const labelKo = entity?.labels?.ko?.value;
      const labelEn = entity?.labels?.en?.value;
      labelsMap[id] = labelKo || labelEn || id;
    }
    return labelsMap;
  } catch (e) {
    const mockMap: Record<string, string> = {};
    ids.forEach(id => { mockMap[id] = id; });
    return mockMap;
  }
}

async function getWikidataFacts(qid: string): Promise<string> {
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=claims|labels&languages=ko|en&format=json`;
    const responseText = await fetchUrl(url);
    const json = JSON.parse(responseText);
    const entity = json?.entities?.[qid];
    if (!entity) return '';

    const claims = entity.claims || {};
    const birthTime = claims.P569?.[0]?.mainsnak?.datavalue?.value?.time;
    const birthFormatted = formatWikidataTime(birthTime);
    const deathTime = claims.P570?.[0]?.mainsnak?.datavalue?.value?.time;
    const deathFormatted = formatWikidataTime(deathTime);

    const occIds: string[] = (claims.P106 || []).map((c: any) => c.mainsnak?.datavalue?.value?.id).filter(Boolean);
    const countryIds: string[] = (claims.P27 || []).map((c: any) => c.mainsnak?.datavalue?.value?.id).filter(Boolean);

    const uniqueIds = Array.from(new Set([...occIds, ...countryIds]));
    const labels = await fetchLabels(uniqueIds);

    const occupations = occIds.map(id => labels[id]).filter(Boolean).join(', ');
    const countries = countryIds.map(id => labels[id]).filter(Boolean).join(', ');

    let facts = `[Wikidata 정보 (QID: ${qid})]\n`;
    if (birthFormatted) facts += `- 출생: ${birthFormatted}\n`;
    if (deathFormatted) facts += `- 사망: ${deathFormatted}\n`;
    if (countries) facts += `- 국적/시민권: ${countries}\n`;
    if (occupations) facts += `- 주요 직업: ${occupations}\n`;

    return facts;
  } catch (e) { return ''; }
}

async function getGroundingInfo(slug: string, wikiLinks: any): Promise<GroundingInfo> {
  const links = wikiLinks[slug] || {};
  let koUrl = links.ko;
  let enUrl = links.en;
  
  let title = slug;
  let summary = 'Wikipedia summary not found.';
  let sourceUrl = koUrl || enUrl || '';
  let qid: string | null = null;
  let isKoUsed = false;

  if (koUrl) {
    try {
      const koTitle = decodeURIComponent(koUrl.substring(koUrl.lastIndexOf('/') + 1));
      const apiUrl = `https://ko.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(koTitle)}`;
      const responseText = await fetchUrl(apiUrl);
      const json = JSON.parse(responseText);
      if (json.extract) {
        title = json.title;
        summary = json.extract;
        isKoUsed = true;
        qid = await fetchQID(koTitle, 'ko');
      }
    } catch (e) {}
  }

  if (!isKoUsed && enUrl) {
    try {
      const enTitle = decodeURIComponent(enUrl.substring(enUrl.lastIndexOf('/') + 1));
      const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(enTitle)}`;
      const responseText = await fetchUrl(apiUrl);
      const json = JSON.parse(responseText);
      if (json.extract) {
        title = json.title;
        summary = json.extract;
        qid = await fetchQID(enTitle, 'en');
      }
    } catch (e) {}
  }

  let wikidataFacts = '';
  if (qid) wikidataFacts = await getWikidataFacts(qid);

  return { title, summary, sourceUrl, wikidataFacts, groundingTextLength: summary.length + wikidataFacts.length };
}

async function generateNarrative(
  name: string,
  grounding: GroundingInfo,
  currentEpic: string,
  retryCount: number = 0,
  feedback: string = ''
): Promise<{ parsed: any; inputTokens: number; outputTokens: number; flags: string[] }> {
  
  const systemInstruction = `당신은 역사 전기 작가 겸 SEO 콘텐츠 전문가입니다.
아래 인물에 대해 사실에만 입각하여 깊이 있고 격조 높은 한국어 전기 서사와 핵심 팩트 요약(fact_box)을 작성하세요.

[서사 구조 및 분량]
- 총 글자수는 **1,800자 이상, 2,200자 이하**여야 합니다. (공백 포함)
- 정확히 **4개의 단락(Paragraph)**으로 구성. 절대로 하나의 단락으로 요약하지 말고, 인물의 삶을 풍성하게 서술하여 4개의 단락을 가득 채우세요.
- 1단락: 시대 배경 + 인물 탄생 (약 450~500자)
- 2단락: 핵심 갈등 또는 전환점 (약 480~520자)
- 3단락: 시련과 투쟁, 극복 과정 (약 500~550자)
- 4단락: 유산과 현재까지의 영향 (약 400~450자)

[SEO 최적화 규칙]
- 1단락 첫 문장에 반드시 "인물 전체 이름 + 출생연도(또는 활동시기) + 핵심 정체성(직업/역할)"을 명시하세요.
- 인물과 연관된 핵심 개념이나 업적명이 있다면, 처음 등장할 때 그것이 무엇인지 한 문장으로 명확히 정의하듯 서술하세요.

[내부 연결 유도]
- 4단락(유산) 말미에, 같은 시대나 유사한 주제를 가진 다른 인물과의 비교나 연결을 암시하는 문장을 자연스럽게 1개 포함하세요.

[사실 근거 및 정밀도 가드레일 - 극도로 중요]
- 위키피디아/위키데이터 자료 범위 내에서만 서술. 지어내지 말 것.
- 연/월/일이 모두 명시된 경우만 구체적 날짜 사용. 연도만 있으면 "~년경".
- **[숫자 반전 방지 가드레일]**: 인구통계적 수치 서술 시 원문 방향 절대 유지 (사망자/생존자 수 뒤바꿈 금지). 친족 관계 표현 원래대로 보존.
- **[인과관계 오류 방지 가드레일]**: 두 개 이상의 사건을 인과관계로 연결해 서술할 때("~때문에", "~에 맞서"), 반드시 그라운딩 자료에 명시된 실제 시간 순서를 따를 것. 자료에 순서가 불분명하면 인과관계를 만들어내지 말고 각각을 독립적으로 서술할 것.
- **[시점 분리 가드레일]**: 인물의 사망 시점과 그 이후에 발생한 사건(후계자 시대의 사건, 사후 평가, 유산 형성 과정)을 명확히 구분해서 서술할 것. '그의 죽음 이후', '사후' 같은 시점 표지어를 사용해 생전/사후 사건이 뒤섞이지 않도록 주의.
- **[출력 포맷 가드레일]**: 글자 수를 세기 위한 (NNN자) 형태의 메모나 괄호를 본문에 절대 남기지 마세요.`;

  const prompt = `역사적 인물 [${name}]에 대한 한국어 서사와 팩트 박스를 작성해 주세요. 
반드시 아래 JSON 형식으로 반환해야 합니다:
{
  "narrative": "4단락으로 구성된 전체 서사 (1800자~2200자). 글자 수 표기(예: (500자))를 절대 포함하지 마세요.",
  "fact_box": {
    "one_line_summary": "OOO는 [시대]의 [국적] [직업]으로, [핵심 업적]을 이루었다 (60자 내외)",
    "key_achievements": [
      "핵심 업적/사건 1 (20~30자 단문)",
      "핵심 업적/사건 2 (20~30자 단문)",
      "핵심 업적/사건 3 (20~30자 단문)"
    ],
    "legacy_statement": "현재까지의 영향을 한 문장으로 (50자 내외)"
  }
}

${feedback ? `\n[피드백 및 재작성 요청]\n${feedback}\n` : ''}

--- 그라운딩 자료 ---
위키피디아 제목: ${grounding.title}
위키피디아 요약: ${grounding.summary}

${grounding.wikidataFacts}

기존 서사 (참고용): 
${currentEpic}

--- 인물명 ---
${name}`;

  let success = false;
  let attempts = 0;
  let currentFeedback = feedback;
  let finalResult: any = { narrative: "", fact_box: null };
  let totalInput = 0;
  let totalOutput = 0;
  const flags: string[] = [];
  
  while (!success && attempts < 5) {
    attempts++;
    console.log(`- Generation attempt ${attempts}/5...`);
    try {
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt + (currentFeedback ? '\\n[피드백]\\n' + currentFeedback : '') }] }],
        generationConfig: { temperature: 0.3, responseMimeType: "application/json" },
        systemInstruction
      });
      const text = response.response.text();
      const usage = response.response.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0 };
      totalInput += usage.promptTokenCount;
      totalOutput += usage.candidatesTokenCount;

      let parsed;
      try {
        parsed = JSON.parse(text);
        if (parsed.narrative) parsed.narrative = cleanEpicText(parsed.narrative);
      } catch (e) {
        parsed = { narrative: "", fact_box: null };
      }

      let cleanEpic = parsed.narrative || '';
      let issue = '';
      
      // 강력한 후처리 정규식 필터 적용
      if (/\([0-9,]+\s*자\)/.test(cleanEpic)) {
         cleanEpic = cleanEpic.replace(/\([0-9,]+\s*자\)/g, '').trim();
         parsed.narrative = cleanEpic;
         issue += "메모 괄호 제거됨. ";
      }

      const len = cleanEpic.length;
      const paragraphs = cleanEpic.split(/\n+/).filter((p: string) => p.trim().length > 0);
      const pCount = paragraphs.length;

      console.log(`  * Length: ${len} characters, Paragraph count: ${pCount}`);
      
      let upperLimit = 2200;
      let lowerLimit = 1800;

      // 만약 4번째 재시도에도 분량 조절에 실패한다면 상/하한선을 자체 완화하여 데이터를 살림
      if (attempts === 4 && (len > 2200 || len < 1800) && pCount === 4) {
          console.log(`  * Automatically relaxing length bounds on attempt 4 to save valid data.`);
          upperLimit = 2300;
          lowerLimit = 1700;
          flags.push(`상/하한선 자체 완화 적용됨 (${len}자)`);
      }

      if (len < lowerLimit) issue += `글자수가 ${len}자로 하한선(${lowerLimit}자)에 미달했습니다. 내용을 더 상세히 보강하여 4단락을 가득 채우세요. `;
      else if (len > upperLimit) issue += `글자수가 ${len}자로 상한선(${upperLimit}자)을 초과했습니다. 문장을 간결하게 압축하세요. `;
      
      if (pCount !== 4) issue += `단락 수가 ${pCount}개입니다. 정확히 4개의 단락이어야 합니다. `;
      if (!parsed.fact_box || !parsed.fact_box.one_line_summary) issue += `fact_box 필드가 누락되었습니다. `;

      if (issue === '' || issue === '메모 괄호 제거됨. ') {
        success = true;
        console.log(`  * Success! Length and criteria met.`);
        finalResult = parsed;
      } else {
        currentFeedback = `[오류] ${issue.trim()} 반드시 ${lowerLimit}~${upperLimit}자 4단락이어야 합니다.`;
        console.warn(`  * Validation failed: ${issue}`);
        finalResult = parsed; // keep the last attempt just in case
      }
    } catch (err) {
      console.error(`  * Error:`, (err as Error).message);
      currentFeedback = 'API 호출 중 에러 발생';
    }
  }

  // Stat checking post-process
  const statPattern = /명 중|생존|사망|사상자|희생자|전사자|형제|자매|남매|태어난/g;
  if (statPattern.test(grounding.summary) && finalResult.narrative && statPattern.test(finalResult.narrative)) {
      flags.push('통계/생존 관련 키워드 발견됨. 수동 검수 요망');
  }

  return { parsed: finalResult, inputTokens: totalInput, outputTokens: totalOutput, flags };
}

async function main() {
  console.log(`=== Worker Started for Chunk ${chunkNum} ===`);
  const chunkPath = path.resolve(`scratch/batch3-chunk-${chunkNum}.json`);
  const narrativesPath = path.resolve('src/data/final-narratives.json');
  const wikiLinksPath = path.resolve('src/data/wikipedia-links.json');
  const outputPath = path.resolve(`scratch/batch3-part${chunkNum}.json`);

  if (!fs.existsSync(chunkPath)) {
    console.error(`Chunk file ${chunkPath} missing.`);
    process.exit(1);
  }

  const slugs: string[] = JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
  const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
  const wikiLinks = JSON.parse(fs.readFileSync(wikiLinksPath, 'utf8'));

  const results = [];
  const startTime = Date.now();

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    console.log(`\n[${i + 1}/${slugs.length}] Processing slug: ${slug}...`);
    
    const originalData = narratives[slug] || {};
    const oldText = originalData.epic_ko || '';
    
    const grounding = await getGroundingInfo(slug, wikiLinks);
    const generated = await generateNarrative(slug, grounding, oldText);

    results.push({
      slug,
      old_length: oldText.length,
      new_length: (generated.parsed.narrative || '').length,
      grounding_text_length: grounding.groundingTextLength,
      old_text: oldText,
      new_text: generated.parsed.narrative || '',
      fact_box: generated.parsed.fact_box || null,
      grounding_source_url: grounding.sourceUrl,
      fact_check_flags: generated.flags
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n=== Worker ${chunkNum} Completed ===`);
  console.log(`Total Duration: ${duration} seconds`);
}

main().catch(console.error);
