import fs from 'fs';
import path from 'path';
import https from 'https';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error("Error: GEMINI_API_KEY not configured."); process.exit(1); }

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const chunkNum = process.argv[2];
if (!chunkNum) { console.error("Usage: npx tsx scripts/generate-batch4-epics.ts <chunkNum>"); process.exit(1); }

interface GroundingInfo {
  title: string; summary: string; sourceUrl: string;
  wikidataFacts: string; groundingTextLength: number;
}

function cleanEpicText(text: string): string {
  let cleaned = text.replace(/\([0-9,]+\s*자\)/g, '').trim();
  cleaned = cleaned.replace(/^[0-9]\.\s+/gm, '');
  const paragraphs = cleaned.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
  return paragraphs.join('\n\n');
}

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'WisdomGiantsBot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) resolve(data);
        else reject(new Error(`HTTP ${res.statusCode}`));
      });
    }).on('error', reject);
  });
}

async function fetchQID(title: string, lang: string = 'en'): Promise<string | null> {
  try {
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&titles=${encodeURIComponent(title)}&redirects=1&format=json`;
    const json = JSON.parse(await fetchUrl(url));
    const pages = json?.query?.pages;
    if (!pages) return null;
    return (Object.values(pages)[0] as any)?.pageprops?.wikibase_item || null;
  } catch { return null; }
}

function formatWikidataTime(t: string | undefined): string | undefined {
  if (!t) return undefined;
  const isBC = t.startsWith('-');
  const parts = t.replace(/^[+-]/, '').split('T')[0].split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  let fy = isBC ? `기원전 ${year}년` : `${year}년`;
  if (month > 0 && day > 0 && !(month === 1 && day === 1)) return `${fy} ${month}월 ${day}일`;
  return `약 ${fy}`;
}

async function fetchLabels(ids: string[]): Promise<Record<string, string>> {
  if (!ids.length) return {};
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids.join('|')}&props=labels&languages=ko|en&format=json`;
    const json = JSON.parse(await fetchUrl(url));
    const m: Record<string, string> = {};
    for (const id of ids) {
      const e = json.entities?.[id];
      m[id] = e?.labels?.ko?.value || e?.labels?.en?.value || id;
    }
    return m;
  } catch { return Object.fromEntries(ids.map(id => [id, id])); }
}

async function getWikidataFacts(qid: string): Promise<string> {
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=claims|labels&languages=ko|en&format=json`;
    const json = JSON.parse(await fetchUrl(url));
    const entity = json?.entities?.[qid];
    if (!entity) return '';
    const claims = entity.claims || {};
    const birthFormatted = formatWikidataTime(claims.P569?.[0]?.mainsnak?.datavalue?.value?.time);
    const deathFormatted = formatWikidataTime(claims.P570?.[0]?.mainsnak?.datavalue?.value?.time);
    const occIds: string[] = (claims.P106 || []).map((c: any) => c.mainsnak?.datavalue?.value?.id).filter(Boolean);
    const countryIds: string[] = (claims.P27 || []).map((c: any) => c.mainsnak?.datavalue?.value?.id).filter(Boolean);
    const labels = await fetchLabels([...new Set([...occIds, ...countryIds])]);
    let facts = `[Wikidata 정보 (QID: ${qid})]\n`;
    if (birthFormatted) facts += `- 출생: ${birthFormatted}\n`;
    if (deathFormatted) facts += `- 사망: ${deathFormatted}\n`;
    const countries = countryIds.map(id => labels[id]).filter(Boolean).join(', ');
    const occupations = occIds.map(id => labels[id]).filter(Boolean).join(', ');
    if (countries) facts += `- 국적/시민권: ${countries}\n`;
    if (occupations) facts += `- 주요 직업: ${occupations}\n`;
    return facts;
  } catch { return ''; }
}

async function getGroundingInfo(slug: string, wikiLinks: any): Promise<GroundingInfo> {
  const links = wikiLinks[slug] || {};
  let koUrl = links.ko, enUrl = links.en;
  let title = slug, summary = 'Wikipedia summary not found.', sourceUrl = koUrl || enUrl || '';
  let qid: string | null = null, isKoUsed = false;

  if (koUrl) {
    try {
      const koTitle = decodeURIComponent(koUrl.substring(koUrl.lastIndexOf('/') + 1));
      const json = JSON.parse(await fetchUrl(`https://ko.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(koTitle)}`));
      if (json.extract) { title = json.title; summary = json.extract; isKoUsed = true; qid = await fetchQID(koTitle, 'ko'); }
    } catch {}
  }
  if (!isKoUsed && enUrl) {
    try {
      const enTitle = decodeURIComponent(enUrl.substring(enUrl.lastIndexOf('/') + 1));
      const json = JSON.parse(await fetchUrl(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(enTitle)}`));
      if (json.extract) { title = json.title; summary = json.extract; qid = await fetchQID(enTitle, 'en'); }
    } catch {}
  }
  const wikidataFacts = qid ? await getWikidataFacts(qid) : '';
  return { title, summary, sourceUrl, wikidataFacts, groundingTextLength: summary.length + wikidataFacts.length };
}

async function generateNarrative(name: string, grounding: GroundingInfo, currentEpic: string, feedback: string = '') {
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
반드시 아래 JSON 형식으로 반환:
{
  "narrative": "4단락 전체 서사 (1800~2200자, (NNN자) 메모 절대 금지)",
  "fact_box": {
    "one_line_summary": "60자 내외 핵심 요약",
    "key_achievements": ["업적1 (20~30자)", "업적2 (20~30자)", "업적3 (20~30자)"],
    "legacy_statement": "50자 내외 현재까지의 영향"
  }
}

${feedback ? `[재작성 피드백]\n${feedback}\n` : ''}
--- 그라운딩 자료 ---
위키피디아 제목: ${grounding.title}
위키피디아 요약: ${grounding.summary}
${grounding.wikidataFacts}
기존 서사 (참고용): ${currentEpic}
--- 인물명 ---
${name}`;

  let success = false, attempts = 0, currentFeedback = feedback;
  let finalResult: any = { narrative: '', fact_box: null };
  let totalInput = 0, totalOutput = 0;
  const flags: string[] = [];

  while (!success && attempts < 5) {
    attempts++;
    console.log(`- 시도 ${attempts}/5...`);
    try {
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt + (currentFeedback && attempts > 1 ? '\n[피드백]\n' + currentFeedback : '') }] }],
        generationConfig: { temperature: 0.3, responseMimeType: "application/json" },
        systemInstruction
      });
      const text = response.response.text();
      const usage = response.response.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0 };
      totalInput += usage.promptTokenCount; totalOutput += usage.candidatesTokenCount;

      let parsed: any;
      try { parsed = JSON.parse(text); if (parsed.narrative) parsed.narrative = cleanEpicText(parsed.narrative); }
      catch { parsed = { narrative: '', fact_box: null }; }

      let cleanEpic = parsed.narrative || '';
      // 후처리 필터 - 괄호 메모 강제 제거
      if (/\([0-9,]+\s*자\)/.test(cleanEpic)) {
        cleanEpic = cleanEpic.replace(/\([0-9,]+\s*자\)/g, '').trim();
        parsed.narrative = cleanEpic;
      }

      const len = cleanEpic.length;
      const pCount = cleanEpic.split(/\n+/).filter((p: string) => p.trim().length > 0).length;
      console.log(`  * ${len}자, ${pCount}단락`);

      let upper = 2200, lower = 1800;
      if (attempts === 4 && pCount === 4 && len >= 1700) { upper = 2300; lower = 1700; flags.push(`상한선 자체 완화 (${len}자)`); }

      let issue = '';
      if (len < lower) issue += `${len}자 하한 미달. `;
      else if (len > upper) issue += `${len}자 상한 초과. `;
      if (pCount !== 4) issue += `단락 ${pCount}개(4개 필요). `;
      if (!parsed.fact_box?.one_line_summary) issue += `fact_box 누락. `;

      if (!issue) { success = true; finalResult = parsed; }
      else { currentFeedback = `[오류] ${issue.trim()} 반드시 ${lower}~${upper}자 4단락.`; console.warn(`  * 실패: ${issue}`); finalResult = parsed; }
    } catch (err) { console.error(`  * API 오류:`, (err as Error).message); }
  }
  return { parsed: finalResult, inputTokens: totalInput, outputTokens: totalOutput, flags };
}

async function main() {
  console.log(`=== Batch4 Worker ${chunkNum} 시작 ===`);
  const chunkPath = path.resolve(`scratch/batch4-chunk-${chunkNum}.json`);
  const narrativesPath = path.resolve('src/data/final-narratives.json');
  const wikiLinksPath = path.resolve('src/data/wikipedia-links.json');
  const outputPath = path.resolve(`scratch/batch4-part${chunkNum}.json`);

  if (!fs.existsSync(chunkPath)) { console.error(`청크 파일 없음: ${chunkPath}`); process.exit(1); }

  const slugs: string[] = JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
  const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
  const wikiLinks = JSON.parse(fs.readFileSync(wikiLinksPath, 'utf8'));

  const results = [];
  const startTime = Date.now();

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    console.log(`\n[${i + 1}/${slugs.length}] ${slug}`);
    const oldText = narratives[slug]?.epic_ko || '';
    const grounding = await getGroundingInfo(slug, wikiLinks);
    const generated = await generateNarrative(slug, grounding, oldText);
    results.push({
      slug, old_length: oldText.length,
      new_length: (generated.parsed.narrative || '').length,
      new_text: generated.parsed.narrative || '',
      fact_box: generated.parsed.fact_box || null,
      grounding_source_url: grounding.sourceUrl,
      fact_check_flags: generated.flags
    });
    await new Promise(r => setTimeout(r, 2000));
  }

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n=== Worker ${chunkNum} 완료 (${((Date.now() - startTime) / 1000).toFixed(1)}s) ===`);
}

main().catch(console.error);
