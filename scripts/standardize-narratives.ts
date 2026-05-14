import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const API_KEY = process.env.GEMINI_API_KEY || "";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${API_KEY}`;

const GIANTS_FILE = path.join(process.cwd(), "src/data/giants.ts");
const OUTPUT_FILE = path.join(process.cwd(), "src/data/final-narratives.json");

const getFileContent = (filePath: string) => fs.readFileSync(filePath, "utf-8");

async function standardize() {
  console.log("Starting premium standardization process (Life-Cycle Chronicle)...");

  const giantsContent = getFileContent(GIANTS_FILE);
  const giantEntries = giantsContent.split(/\{[\s\n]*id:/).slice(1);
  const giants: any[] = [];

  for (const entry of giantEntries) {
    const idMatch = entry.match(/^[\s\n]*'(\d+)'/) || entry.match(/^[\s\n]*"(\d+)"/);
    const nameMatch = entry.match(/name:[\s\n]*'(.*?)'/) || entry.match(/name:[\s\n]*"(.*?)"/);
    if (idMatch && nameMatch) {
      giants.push({
        id: idMatch[1],
        name: nameMatch[1]
      });
    }
  }

  console.log(`Found ${giants.length} giants. Samples:`, giants.slice(0, 10).map(g => g.name));

  const results: any = fs.existsSync(OUTPUT_FILE) ? JSON.parse(getFileContent(OUTPUT_FILE)) : {};
  
  // Define batches (Example: first 5 already done manually, start from others)
  // For automation, we will iterate all but skip if already has premium content (optional)
  const targetGiants = giants.slice(5, 7); // Process only next 2 giants for demo

  async function processGiant(giant: any, retryCount = 0): Promise<void> {
    const giantName = giant.name;
    console.log(`Processing [${giant.id}] ${giantName} (Premium Life-Cycle)...`);

    const prompt = `너는 세계 최고의 전기 작가이자 소설가야. 인물 '${giantName}'의 생애를 조망하는 '거인의 대서사시' 데이터를 아래 [표준 서사 예술 가이드라인]에 맞춰 작성해줘.

### 📜 [표준 서사 예술 가이드라인]

#### 1. 거인의 대서사시 (The Epic Narrative)
- **문체 (Atmospheric Prose):** "1955년, ..." 같은 딱딱한 역사책 서술은 절대 금지한다. 한 편의 대하소설이나 장엄한 다큐멘터리 나레이션 톤으로 작성하라.
- **구조 (The Hero's Journey):** 아래 흐름을 따르되 꼬리표는 붙이지 말고 자연스럽게 연결하라.
  - [기원]: 탄생의 공기, 유년기의 결핍이나 비범함, 그를 만든 시대의 냄새.
  - [발흥]: 천재성이 폭발하거나 운명을 바꾼 첫 번째 충돌과 선택.
  - [정점]: 세상을 뒤흔든 위대한 업적과 전성기의 화려한 드라마.
  - [불멸]: 마지막 순간의 초연함, 그가 남긴 영원한 유산과 철학.
- **금기 사항:** 문단 시작 부분에 **[1955년]** 처럼 연도를 굵게 표기하거나 나열하지 마라. 연도는 문장 속에 자연스럽게 녹여라.
- **분량:** 한글 기준 공백 포함 최소 1200자 ~ 최대 1500자 (풍성하고 아름답게).

#### 2. 지독한 시련 (The Ordeal)
- **내용:** 대서사시에서 짧게 스친 '가장 어두웠던 순간'의 현미경 관찰 (약 500자).
- **초점:** 시련의 팩트보다는 당시 인물이 느꼈던 '수치심, 고독, 공포' 등 인간적인 고통에 딥다이브하라.

#### 3. 위대한 극복 (The Overcoming)
- **내용:** 그 시련을 어떻게 정신적으로 이겨냈는지, '초심'이나 '철학'으로 부활하는 과정.

#### 4. 삶의 지혜 (Wisdom)
- **내용:** 인물이 남긴 핵심 명언 3가지와 그에 대한 현대적 해석.
- **주의:** JSON 데이터 안에 \n\n을 적절히 사용하여 줄바꿈을 표현하라.

#### 5. 활동 시대 (Era)
- **내용:** 인물이 주로 활동했던 시기를 '세기' 단위로 표현 (예: "20세기 ~ 21세기", "15세기").

### 📤 [출력 JSON 형식]
{
  "era_ko": "...",
  "era_en": "...",
  "epic_ko": "...",
  "epic_en": "...",
  "trials_ko": "...",
  "trials_en": "...",
  "overcoming_ko": "...",
  "overcoming_en": "...",
  "wisdom": [
    { "quote_ko": "...", "quote_en": "...", "meaning_ko": "...", "meaning_en": "..." },
    { "quote_ko": "...", "quote_en": "...", "meaning_ko": "...", "meaning_en": "..." },
    { "quote_ko": "...", "quote_en": "...", "meaning_ko": "...", "meaning_en": "..." }
  ]
}

응답은 마크다운 없이 순수 JSON만 출력해.`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data: any = await response.json();
      if (!response.ok) {
        if (data.error?.message?.includes("quota") && retryCount < 3) {
          console.log(`⚠️ Quota exceeded for ${giantName}. Waiting 75s (Retry ${retryCount + 1})...`);
          await new Promise(resolve => setTimeout(resolve, 75000));
          return processGiant(giant, retryCount + 1);
        }
        throw new Error(data.error?.message || "API Error");
      }

      const text = data.candidates[0].content.parts[0].text;
      const cleanedText = text.replace(/```json|```/g, "").trim();
      const jsonData = JSON.parse(cleanedText);
      
      results[giantName] = jsonData;
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), "utf-8");
      
      console.log(`✅ ${giantName} (Chronicle Standardized)`);
      await new Promise(resolve => setTimeout(resolve, 65000)); // Rate limit safety
    } catch (error: any) {
      console.error(`❌ ${giantName}:`, error.message);
    }
  }

  // Process in batches of 5 to manage load and quality
  for (let i = 0; i < targetGiants.length; i++) {
    await processGiant(targetGiants[i]);
  }
}

standardize();
