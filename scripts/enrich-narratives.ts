import { GoogleGenerativeAI } from "@google/generative-ai";
import { giantsData as giants } from "../src/data/giants";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY in .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey);
const FINAL_NARRATIVES_PATH = path.resolve(process.cwd(), "src/data/final-narratives.json");

async function main() {
  console.log("Starting narrative enrichment pipeline...");
  let totalUpdated = 0;
  
  // Use gemini-2.0-flash as requested by user
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json"
    }
  });

  while (true) {
    const finalNarratives = JSON.parse(fs.readFileSync(FINAL_NARRATIVES_PATH, "utf8"));
    
    // Find all giants that are missing from finalNarratives or missing epic_ko
    const missingGiants = giants.filter(g => {
      const data = finalNarratives[g.slug];
      // If epic_ko doesn't exist or is too short (e.g., placeholder), mark as missing
      return !data || !data.epic_ko || data.epic_ko.length < 50;
    });

    if (missingGiants.length === 0) {
      console.log("All giants are successfully enriched!");
      break;
    }

    const CHUNK_SIZE = 5;
    const targetGiants = missingGiants.slice(0, CHUNK_SIZE);
    console.log(`\nRemaining to enrich: ${missingGiants.length}. Processing next ${targetGiants.length} giants...`);
    const namesList = targetGiants.map(g => g.name).join(", ");
    console.log(`Targets: ${namesList}`);

    const prompt = `
당신은 최고의 역사학자이자 문학 작가, 그리고 인생의 지혜를 전하는 위대한 멘토입니다.
다음 인물들에 대해 '세종대왕' 레퍼런스와 같은 압도적인 퀄리티의 대서사시와 삶의 지혜(멘토링 톤)를 JSON 포맷으로 작성해 주세요.

## 1. 대서사시 (epic_ko, epic_en)
- 톤앤매너: 단순 연대기 나열이 아닌 대하소설/고품격 다큐멘터리 나레이션 톤. 웅장하고 깊이 있는 어휘 사용.
- 분량: 최소 3~4개의 대형 문단.
- trials_ko, trials_en: 이들이 겪은 지독한 시련.
- overcoming_ko, overcoming_en: 그 시련을 위대하게 극복한 과정.

## 2. 삶의 지혜 (wisdom)
- 3가지 지혜를 작성.
- quote_ko, quote_en: 명언.
- meaning_ko, meaning_en: 건조한 해설조가 아닌, 위인이 직접 현대 유저의 삶과 마인드셋에 교훈을 전수하는 '권위 있고 인자한 대화체(멘토링 톤)'로 작성할 것. (예: "성취에 안주하지 말고 끊임없이 자신을 갈고닦으십시오. 당신의 성장은 타인을 돕기 위한 준비 과정이어야 합니다.")

대상 위인 목록:
${targetGiants.map(g => `- 이름: ${g.name} (slug: ${g.slug}, category: ${g.category}, era: ${g.era})\n  요약: ${g.headline}\n  기존명언: ${g.quote}`).join('\n\n')}

출력 형식은 다음 JSON 스키마를 엄격히 따르십시오:
{
  "results": {
    "위인의 slug (예: virgil)": {
      "era_ko": "시대", "era_en": "Era",
      "category": "카테고리",
      "epic_ko": "웅장한 대서사시 (최소 3문단)", "epic_en": "Epic in English",
      "trials_ko": "시련", "trials_en": "Trials in English",
      "overcoming_ko": "극복", "overcoming_en": "Overcoming in English",
      "wisdom": [
        {
          "quote_ko": "명언", "quote_en": "Quote in English",
          "meaning_ko": "멘토링톤 해설", "meaning_en": "Mentoring tone explanation"
        }
      ]
    }
  }
}
`;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      let jsonStr = responseText.trim();
      if (jsonStr.startsWith('\`\`\`json')) {
        jsonStr = jsonStr.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
      } else if (jsonStr.startsWith('\`\`\`')) {
        jsonStr = jsonStr.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
      }
      
      const parsed = JSON.parse(jsonStr);
      
      if (parsed && parsed.results) {
        let updatedCount = 0;
        for (const [slug, data] of Object.entries(parsed.results)) {
          if (!finalNarratives[slug]) {
            finalNarratives[slug] = {};
          }
          Object.assign(finalNarratives[slug], data);
          updatedCount++;
        }
        
        fs.writeFileSync(FINAL_NARRATIVES_PATH, JSON.stringify(finalNarratives, null, 2), "utf8");
        console.log(`✅ Successfully updated ${updatedCount} giants to final-narratives.json.`);
        totalUpdated += updatedCount;
      } else {
        console.error("Invalid JSON format received. Skipping chunk.");
      }

      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 4000));

    } catch (err: any) {
      console.error("\n❌ Error during generation. Stopping execution.");
      if (err.message && (err.message.includes("429") || err.message.includes("Quota"))) {
        console.error("Quota exceeded (429 Too Many Requests). Gracefully shutting down.");
      } else {
        console.error(err);
      }
      break;
    }
  }
  
  console.log(`\n🎉 Pipeline finished. Total updated in this session: ${totalUpdated}`);
}

main();
