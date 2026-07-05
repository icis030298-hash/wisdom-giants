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

const zeroByteGiants = [
  'antonio-gramsci', 'piye', 'alexander-pushkin', 'bumin-qaghan',
  'samuel-ajayi-crowther', 'rabindranath-tagore', 'franz-schubert', 'prempeh-i',
  'hammurabi', 'murasaki-shikibu'
];

interface GroundingInfo {
  title: string;
  summary: string;
  sourceUrl: string;
  wikidataFacts: string;
  groundingTextLength: number;
}

function cleanText(text: string): string {
  let cleaned = text.replace(/#+\s+.+/g, '');
  cleaned = cleaned.replace(/\*\*|__/g, '');
  cleaned = cleaned.replace(/\*|_/g, '');
  const paragraphs = cleaned.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
  return paragraphs.join('\n\n');
}

async function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'WisdomGiantsBot/1.0 (contact@wisdomgiants.com) Node.js/https'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
      });
    }).on('error', reject);
  });
}

// Fetch QID from Wikipedia title
async function fetchQID(title: string, lang: string = 'en'): Promise<string | null> {
  try {
    const normalizedTitle = title.replace(/_/g, ' ');
    const encodedTitle = encodeURIComponent(normalizedTitle);
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&titles=${encodedTitle}&redirects=1&format=json`;
    const responseText = await fetchUrl(url);
    const json = JSON.parse(responseText);
    const pages = json?.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0] as any;
    return page?.pageprops?.wikibase_item || null;
  } catch (e) {
    console.error(`Failed to fetch QID for ${title} (${lang}):`, (e as Error).message);
    return null;
  }
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
    if (month === 1 && day === 1) {
      return `약 ${formattedYear}`;
    }
    return `${formattedYear} ${month}월 ${day}일`;
  } else {
    return `약 ${formattedYear}`;
  }
}
// Fetch Wikidata labels for list of IDs
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
    console.error(`Failed to fetch labels for ${ids.join(',')}:`, (e as Error).message);
    const mockMap: Record<string, string> = {};
    ids.forEach(id => { mockMap[id] = id; });
    return mockMap;
  }
}

// Fetch Wikidata claims
async function getWikidataFacts(qid: string): Promise<string> {
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=claims|labels&languages=ko|en&format=json`;
    const responseText = await fetchUrl(url);
    const json = JSON.parse(responseText);
    const entity = json?.entities?.[qid];
    if (!entity) return '';

    const claims = entity.claims || {};
    
    // 1. Birth Date (P569)
    const birthTime = claims.P569?.[0]?.mainsnak?.datavalue?.value?.time;
    const birthFormatted = formatWikidataTime(birthTime);

    // 2. Death Date (P570)
    const deathTime = claims.P570?.[0]?.mainsnak?.datavalue?.value?.time;
    const deathFormatted = formatWikidataTime(deathTime);

    // 3. Occupations (P106)
    const occIds: string[] = (claims.P106 || [])
      .map((c: any) => c.mainsnak?.datavalue?.value?.id)
      .filter((id: string | undefined) => !!id);

    // 4. Country of Citizenship (P27)
    const countryIds: string[] = (claims.P27 || [])
      .map((c: any) => c.mainsnak?.datavalue?.value?.id)
      .filter((id: string | undefined) => !!id);

    // Fetch labels for occupations and countries
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
  } catch (e) {
    console.error(`Failed to fetch Wikidata facts for QID ${qid}:`, (e as Error).message);
    return '';
  }
}

// Fetch grounding data (Wikipedia summary + Wikidata facts)
async function getGroundingInfo(slug: string, wikiLinks: any): Promise<GroundingInfo> {
  const links = wikiLinks[slug] || {};
  let koUrl = links.ko;
  let enUrl = links.en;
  
  let title = slug;
  let summary = 'Wikipedia summary not found. Grounding will rely on model pre-trained knowledge.';
  let sourceUrl = koUrl || enUrl || '';
  let qid: string | null = null;
  let isKoUsed = false;

  // 1. Fetch from Korean Wikipedia if available
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
    } catch (e) {
      console.warn(`Failed to fetch Korean wiki summary for ${slug}:`, (e as Error).message);
    }
  }

  // 2. Fetch from English Wikipedia if Korean fails or is not available
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
    } catch (e) {
      console.warn(`Failed to fetch English wiki summary for ${slug}:`, (e as Error).message);
    }
  }

  // 3. Get Wikidata claims
  let wikidataFacts = '';
  if (qid) {
    wikidataFacts = await getWikidataFacts(qid);
  }

  const groundingTextLength = summary.length + wikidataFacts.length;

  return {
    title,
    summary,
    sourceUrl,
    wikidataFacts,
    groundingTextLength
  };
}

async function generateNarrative(
  name: string,
  grounding: GroundingInfo,
  currentEpic: string,
  retryCount: number = 0,
  feedback: string = ''
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  
  const systemInstruction = `당신은 역사 전기 작가입니다. 역사적 인물에 대해 사실에만 입각하여 깊이 있고 격조 높은 한국어 전기 서사를 작성합니다.
역사적 사실(연도, 업적, 행적 등)은 그라운딩 자료의 범위 내에서만 서술해야 하며, 절대로 허구의 사건이나 명확하지 않은 연도를 지어내서는 안 됩니다. 
특히 외증조부(great-grandfather)를 외조부(grandfather)로 임의로 단순화하거나 변경하는 등의 가족 관계 및 친족 표현 오류를 철저히 방지하세요. 반드시 그라운딩 자료에 나타난 정확한 친족 관계 표현을 그대로 보존해야 합니다.
미사여구를 과도하게 늘어놓아 분량을 채우지 말고, 인물의 시대상, 업적의 세부 맥락, 투쟁의 고난과 극복 과정, 그리고 그가 남긴 역사적 유산을 구체적인 사실 서술을 통해 풍성하게 묘사하세요.`;

  const prompt = `역사적 인물 [${name}]에 대한 한국어 서사를 작성해 주세요. 
반드시 아래 규칙을 철저하게 준수해야 합니다.

[작성 규칙]
1. 총 글자수는 **1,800자 이상, 2,200자 이하**여야 합니다. (공백 포함 한국어 글자수 기준)
2. 전체 글은 정확히 **4개의 단락(Paragraph)**으로 구성되어야 합니다. 각 단락은 빈 줄(두 번의 줄바꿈)로 구분해야 합니다.
3. 각 단락의 구성 요건:
   - 1단락: 시대적 배경, 인물의 출생과 유년기, 그리고 초기 성장에 대한 구체적 서술 (약 450~500자)
   - 2단락: 인생의 핵심적인 전환점이 되는 사건이나 주요 업적의 배경, 핵심적인 갈등 요소 서술 (약 480~520자)
   - 3단락: 일생에 걸친 시련과 고난, 신념을 지키기 위한 투쟁 과정과 극복 양상 서술 (약 500~550자)
   - 4단락: 인물이 역사와 인류 문명에 남긴 독자적인 유산 및 현대적 의의 서술 (약 400~450자)
4. 문체는 격식 있는 문어체('~했다', '~였다')를 일관되게 사용하고, 제목(#)이나 불필요한 마크다운 기호 없이 오직 4개의 문단만 반환하세요.
5. **[중요 - 날짜 및 역사적 사실 정밀도 가드레일]**:
   - 그라운딩 자료에 연/월/일이 모두 명시적으로 나타난 경우만 구체적 날짜를 사용하세요. 
   - 연도만 명시되어 있거나 불확실한 경우(예: '1809년경', '출생년도 미상')에는 절대로 구체적인 월/일(예: 1월 1일)을 지어내거나 추정하여 기재해서는 안 되며, 반드시 '~년경', '~무렵' 등의 모호성 표현을 써서 서술의 안전성을 확보해야 합니다.
   - 인물의 입궁 시기 등 그라운딩에 명시되지 않은 역사적 시점을 단정적으로 서술하지 마세요. (예: 무라사키 시키부의 입궁 시기 등)

${feedback ? `\n[피드백 및 재작성 요청]\n${feedback}\n` : ''}

--- 그라운딩 자료 ---
위키피디아 제목: ${grounding.title}
위키피디아 요약: ${grounding.summary}

${grounding.wikidataFacts}

기존 서사 (참고용): 
${currentEpic}

--- 인물명 ---
${name}`;
  const response = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3
    },
    systemInstruction: systemInstruction
  });
  const text = response.response.text();
  const usage = response.response.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0 };

  return {
    text: cleanText(text),
    inputTokens: usage.promptTokenCount,
    outputTokens: usage.candidatesTokenCount
  };
}

async function main() {
  console.log("=== Vertex AI 기반 서사 확장 파일럿 프로그램 (Wikidata 그라운딩 추가) ===");
  const narrativesPath = path.resolve('src/data/final-narratives.json');
  const wikiLinksPath = path.resolve('src/data/wikipedia-links.json');

  if (!fs.existsSync(narrativesPath) || !fs.existsSync(wikiLinksPath)) {
    console.error("Required data files are missing.");
    process.exit(1);
  }

  const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
  const wikiLinks = JSON.parse(fs.readFileSync(wikiLinksPath, 'utf8'));
  
  const draftResults: any[] = [];
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  const startTime = Date.now();

  for (let i = 0; i < zeroByteGiants.length; i++) {
    const slug = zeroByteGiants[i];
    console.log(`\n[${i + 1}/${zeroByteGiants.length}] Processing slug: ${slug}...`);
    
    const originalData = narratives[slug] || {};
    const oldText = originalData.epic_ko || '';
    const oldLength = oldText.length;
    
    // 1. Wikipedia summary + Wikidata claims grounding
    const grounding = await getGroundingInfo(slug, wikiLinks);
    console.log(`- Grounding Title: ${grounding.title}`);
    console.log(`- Grounding Text Length: ${grounding.groundingTextLength} chars`);
    if (grounding.wikidataFacts) {
      console.log(`- Wikidata Claims:\n${grounding.wikidataFacts.trim()}`);
    }

    // 2. Generate with feedback-loop validation
    let generated = { text: '', inputTokens: 0, outputTokens: 0 };
    let success = false;
    let attempts = 0;
    let feedback = '';

    while (!success && attempts < 3) {
      attempts++;
      console.log(`- Generation attempt ${attempts}/3...`);
      try {
        generated = await generateNarrative(slug, grounding, oldText, attempts, feedback);
        totalInputTokens += generated.inputTokens;
        totalOutputTokens += generated.outputTokens;


        let cleanEpic = cleanEpicText(generated.text);
        if (slug === 'alexander-pushkin') {
          cleanEpic = cleanEpic.replace(/외조부/g, '외증조부');
        }

        const len = cleanEpic.length;
        const paragraphs = cleanEpic.split('\n\n');
        const pCount = paragraphs.length;

        console.log(`  * Length: ${len} characters, Paragraph count: ${pCount}`);

        if (len >= 1800 && len <= 2200 && pCount === 4) {
          success = true;
          generated.text = cleanEpic;
          console.log(`  * Success! Length and paragraph criteria met.`);
        } else {
          let issue = '';
          if (len < 1800) {
            if (len >= 1700) {
              issue += `글자수가 ${len}자로 하한선인 1,800자에 아주 살짝 미달했습니다. 각 단락별로 역사적 맥락이나 문장 1~2개씩을 추가하여 1,900~2,100자 사이가 되도록 보충해 주세요. `;
            } else {
              issue += `글자수가 ${len}자로 하한선인 1,800자에 크게 미달했습니다. 인물의 시대적 배경, 업적의 맥락, 구체적 투쟁 과정에 대한 서술을 더 늘려서 보강해 주세요. `;
            }
          } else if (len > 2200) {
            if (len <= 2350) {
              issue += `글자수가 ${len}자로 상한선인 2,200자를 아주 살짝 초과했습니다. 문맥을 해치지 않는 선에서 불필요한 미사여구 등을 아주 살짝만 덜어내어 1,900~2,100자 사이로 조정해 주세요. `;
            } else {
              issue += `글자수가 ${len}자로 상한선인 2,200자를 크게 초과했습니다. 중복되는 표현이나 과도하게 긴 묘사를 덜어내어 분량을 요약해 주세요. `;
            }
          }
          if (pCount !== 4) issue += `단락 수가 ${pCount}개입니다. 규칙대로 정확히 4개의 단락으로만 구성해야 합니다. `;
          
          feedback = `이전 응답에 다음과 같은 오류가 있었습니다: [${issue.trim()}]. 이 피드백을 반영하여 다시 작성해 주세요. 반드시 1,800자~2,200자 사이, 빈 줄로 나뉜 4단락이어야 합니다.`;
          console.warn(`  * Validation failed. Retrying...`);
        }
      } catch (err) {
        console.error(`  * Error during generation:`, (err as Error).message);
        feedback = `이전 생성 시 에러가 발생했습니다. 다시 시도해 주세요.`;
      }
    }
    draftResults.push({
      slug,
      old_length: oldLength,
      new_length: generated.text.length,
      grounding_text_length: grounding.groundingTextLength,
      old_text: oldText,
      new_text: generated.text,
      grounding_source_url: grounding.sourceUrl,
      fact_check_flags: []
    });

    // Pause briefly to avoid API rate limit
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Write draft to scratch
  const draftOutputPath = path.resolve('scratch/pilot-narratives-draft.json');
  fs.writeFileSync(draftOutputPath, JSON.stringify(draftResults, null, 2), 'utf8');

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n=== Pilot Program Completed ===`);
  console.log(`Draft saved at: ${draftOutputPath}`);
  console.log(`Total Input Tokens: ${totalInputTokens}`);
  console.log(`Total OutputTokens: ${totalOutputTokens}`);
  console.log(`Estimated Cost: $${((totalInputTokens * 0.000075 / 1000) + (totalOutputTokens * 0.0003 / 1000)).toFixed(4)} (using Gemini 2.5 Flash pricing)`);
  console.log(`Total Duration: ${duration} seconds`);
}

function cleanEpicText(text: string): string {
  let cleaned = text.replace(/^[0-9]\.\s+/gm, '');
  cleaned = cleaned.replace(/^[단락문단장]\s*[0-9일이삼사]\s*[:：\-]*\s*/gm, '');
  const paragraphs = cleaned.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
  return paragraphs.join('\n\n');
}

main().catch(console.error);
