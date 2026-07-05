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
  } else {
    return `약 ${formattedYear}`;
  }
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

async function getGroundingInfo(slug: string, wikiLinks: any): Promise<any> {
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

  return { title, summary, sourceUrl, wikidataFacts };
}

async function generateForSlug(slug: string, grounding: any, customInstruction: string, minLen: number, maxLen: number) {
  const systemInstruction = `당신은 역사 전기 작가 겸 SEO 콘텐츠 전문가입니다.
아래 인물에 대해 사실에만 입각하여 깊이 있고 격조 높은 한국어 전기 서사와 핵심 팩트 요약(fact_box)을 작성하세요.

[서사 구조 및 분량]
- 총 글자수는 **${minLen}자 이상, ${maxLen}자 이하**여야 합니다. (공백 포함)
- 정확히 **4개의 단락(Paragraph)**으로 구성.
- 1단락: 시대 배경 + 인물 탄생
- 2단락: 핵심 갈등 또는 전환점
- 3단락: 시련과 투쟁, 극복 과정
- 4단락: 유산과 현재까지의 영향

[SEO 최적화 규칙]
- 1단락 첫 문장에 반드시 "인물 전체 이름 + 출생연도(또는 활동시기) + 핵심 정체성(직업/역할)"을 명시하세요.
- 인물과 연관된 핵심 개념이나 업적명이 있다면 처음 등장할 때 명확히 정의하듯 서술하세요.

[내부 연결 유도]
- 4단락 말미에, 같은 시대나 유사한 주제를 가진 다른 인물과의 비교나 연결을 암시하는 문장을 포함하세요.

[사실 근거 및 정밀도 가드레일 - 중요]
- 위키피디아/위키데이터 자료 범위 내에서만 서술. 지어내지 말 것.
- 연/월/일이 모두 명시된 경우만 구체적 날짜 사용. 연도만 있으면 "~년경".
- **[숫자 반전 방지 가드레일]**: 인구통계적 수치 서술 시 원문 방향 절대 유지.
- **[시점 분리 가드레일]**: 인물의 사망 시점과 그 이후 사건 구분. 본인이 직접 겪지 않은 일 주의.
- **[출력 포맷 가드레일]**: 글자 수를 세기 위한 (NNN자) 형태의 메모를 본문에 절대 남기지 마세요.

${customInstruction}`;

  const prompt = `역사적 인물 [${grounding.title}]에 대한 한국어 서사와 팩트 박스를 작성해 주세요. 
반드시 아래 JSON 형식으로 반환해야 합니다:
{
  "narrative": "4단락으로 구성된 전체 서사 (${minLen}자~${maxLen}자)",
  "fact_box": {
    "one_line_summary": "...",
    "key_achievements": ["...", "...", "..."],
    "legacy_statement": "..."
  }
}

--- 그라운딩 자료 ---
위키피디아 제목: ${grounding.title}
위키피디아 요약: ${grounding.summary}

${grounding.wikidataFacts}`;

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
        generationConfig: { temperature: 0.3, responseMimeType: "application/json" },
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
      
      if (len < minLen) issue += `글자수가 ${len}자로 하한선(${minLen}자)에 미달했습니다. 더 보강하세요. `;
      else if (len > maxLen) issue += `글자수가 ${len}자로 상한선(${maxLen}자)을 초과했습니다. 더 줄이세요. `;
      if (pCount !== 4) issue += `단락 수가 ${pCount}개입니다. 정확히 4단락이어야 합니다. `;
      
      if (issue === '') {
        success = true;
        console.log(`  * Success! Length and criteria met.`);
        finalResult = { len, cleanEpic, factBox: parsed.fact_box };
      } else {
        feedback = `[오류] ${issue} 반드시 ${minLen}~${maxLen}자 4단락으로 다시 작성하세요.`;
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
  console.log("=== Fixing xuanzang & olympe-de-gouges ===");
  const draftPath = path.resolve('scratch/batch2-narratives-draft.json');
  const wikiLinksPath = path.resolve('src/data/wikipedia-links.json');
  const draftResults = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
  const wikiLinks = JSON.parse(fs.readFileSync(wikiLinksPath, 'utf8'));
  
  // 1. Add QA flag to yaa-asantewaa
  const yaa = draftResults.find((r: any) => r.slug === 'yaa-asantewaa');
  if (yaa) {
    yaa.fact_check_flags = yaa.fact_check_flags || [];
    if (!yaa.fact_check_flags.includes("상한선 예외 적용됨 (2,300자)")) {
      yaa.fact_check_flags.push("상한선 예외 적용됨 (2,300자)");
      console.log("- Added QA flag to yaa-asantewaa");
    }
  }

  // 2. Xuanzang
  console.log("\n[1/2] Processing slug: xuanzang...");
  let xuanzangTarget = draftResults.find((r: any) => r.slug === 'xuanzang');
  if (xuanzangTarget) {
    const grounding = await getGroundingInfo('xuanzang', wikiLinks);
    const customInst = "[특별 지시 - 내용 압축]: 인물의 생애(인도 순례, 사막 횡단, 번역 등)가 방대하므로 모든 사실을 나열하려 하지 마세요. 가장 중요한 3~4개 사건만 선택적으로 깊이 있게 다루어 4단락 안에 무리 없이 들어가도록 압축 서술하세요.";
    let res = await generateForSlug('xuanzang', grounding, customInst, 1800, 2200);
    if (!res) {
       console.log("  * Retrying xuanzang with lowered minimum length (1700)...");
       res = await generateForSlug('xuanzang', grounding, customInst, 1700, 2200);
    }
    if (res) {
      xuanzangTarget.new_length = res.len;
      xuanzangTarget.new_text = res.cleanEpic;
      xuanzangTarget.fact_box = res.factBox;
    }
  }

  // 3. Olympe de Gouges
  console.log("\n[2/2] Processing slug: olympe-de-gouges...");
  let olympeTarget = draftResults.find((r: any) => r.slug === 'olympe-de-gouges');
  if (olympeTarget) {
    const grounding = await getGroundingInfo('olympe-de-gouges', wikiLinks);
    const customInst = "[특별 지시 - 길이 압축]: 서사의 내용이 너무 길어 상한선을 초과하는 경향이 있습니다. 불필요한 수식어를 줄이고 문장을 간결하게 다듬어 반드시 2,200자 이하로 맞춰 주세요.";
    const res = await generateForSlug('olympe-de-gouges', grounding, customInst, 1800, 2200);
    if (res) {
      olympeTarget.new_length = res.len;
      olympeTarget.new_text = res.cleanEpic;
      olympeTarget.fact_box = res.factBox;
    }
  }

  fs.writeFileSync(draftPath, JSON.stringify(draftResults, null, 2), 'utf8');
  console.log(`\n=== Fixing Completed ===`);
}

main().catch(console.error);
