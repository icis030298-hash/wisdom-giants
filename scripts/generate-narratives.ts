
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const giantsList = [
  // 🏆 성취 (15명)
  "조지 워싱턴", "이순신", "엘리자베스 1세", "광개토대왕", "윈스턴 처칠", 
  "진시황", "아우구스투스", "오토 폰 비스마르크", "표트르 대제", "캐서린 대제", 
  "시몬 볼리바르", "마가렛 대처", "존 D. 록펠러", "무스타파 케말 아타튀르크", "테오도르 루스벨트",
  
  // 🌪️ 역경 (15명)
  "안네 프랑크", "로자 파크스", "프레데릭 더글러스", "해리엇 터브먼", "오스카 쉰들러", 
  "플로렌스 나이팅게일", "유관순", "루이 브라이유", "잔 다르크", "데스몬드 투투", 
  "엘리 위젤", "해리엇 비처 스토", "리고베르타 멘추", "테리 폭스", "김구",
  
  // 🦉 지혜 (15명)
  "붓다", "프리드리히 니체", "이마누엘 칸트", "르네 데카르트", "장 자크 루소", 
  "지그문트 프로이트", "칼 융", "바뤼흐 스피노자", "손무", "데이비드 흄", 
  "존 로크", "시몬 드 보부아르", "한나 아렌트", "쇠렌 키에르케고르", "아르투어 쇼펜하우어",
  
  // 🎨 창의 (14명)
  "아이작 뉴턴", "갈릴레오 갈릴레이", "찰스 다윈", "미켈란젤로", "클로드 모네", 
  "표도르 도스토옙스키", "빅토르 위고", "안톤 체호프", "프레데리크 쇼팽", "카츠시카 호쿠사이", 
  "애가사 크리스티", "마크 트웨인", "요한 볼프강 폰 괴테", "메리 셸리"
];

const OUTPUT_FILE = path.join(process.cwd(), "src/data/narratives.json");

async function generateNarrative(name: string, retryCount = 0) {
  const prompt = `
    당신은 역사 전문가이자 위인전 작가입니다. 다음 인물에 대한 심층 서사(Narrative)를 작성해 주세요.
    인물: ${name}

    [작성 요구사항]
    1. 분량: 한국어 800~1000자, 영어 150~200단어 내외.
    2. 스타일: 전문적이면서도 감동적인 위인전 스타일. 단순히 업적을 나열하는 것이 아니라, 그가 겪은 내면의 갈등, 결정적인 사건, 그리고 그것을 극복한 과정과 후대에 남긴 지혜를 서사적으로 풀어내세요.
    3. 구조: 탄생과 배경 -> 시련과 갈등 -> 극복과 성취 -> 유산과 지혜 순으로 자연스럽게 연결하세요.
    4. 형식: 반드시 아래의 JSON 형식으로만 응답하세요. 다른 설명은 생략하세요.

    {
      "name": "${name}",
      "history_ko": "한국어 서사 내용...",
      "history_en": "English narrative content..."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error: any) {
    if (error.status === 429 && retryCount < 3) {
      const waitTime = (retryCount + 1) * 30000; // Wait 30s, 60s, 90s
      console.log(`Rate limit hit for ${name}. Waiting ${waitTime/1000}s before retry ${retryCount + 1}...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return generateNarrative(name, retryCount + 1);
    }
    console.error(`Error generating for ${name}:`, error.message || error);
    return null;
  }
}

async function main() {
  let narratives = {};
  
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      narratives = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"));
    } catch (e) {
      console.error("Error reading existing file, starting fresh.");
    }
  }

  console.log(`Starting generation for ${giantsList.length} giants...`);

  for (const name of giantsList) {
    if (narratives[name] && narratives[name].history_ko) {
      console.log(`Skipping ${name}, already exists.`);
      continue;
    }

    console.log(`Generating narrative for ${name}...`);
    const data = await generateNarrative(name);
    
    if (data) {
      narratives[name] = {
        history_ko: data.history_ko,
        history_en: data.history_en
      };
      
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(narratives, null, 2), "utf-8");
      console.log(`Successfully saved ${name}.`);
    } else {
      console.log(`Failed to generate for ${name}, moving to next.`);
    }
    
    // Increased delay for free tier safety
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log("All tasks completed!");
}

main();
