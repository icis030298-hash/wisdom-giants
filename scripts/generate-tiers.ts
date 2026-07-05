import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const narratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
const slugs = Object.keys(narratives);

async function generateTiers() {
  console.log(`Classifying ${slugs.length} giants into Tiers...`);
  
  const systemInstruction = `당신은 역사 전문가입니다. 
주어진 역사적 인물들의 역사적 자료 풍부도와 인지도(대중성)를 평가하여 3단계(Tier)로 분류해 주세요.
- Tier 1: 역사적 자료가 매우 풍부하며 전 세계적으로 유명한 거물 (예: 나폴레옹, 아인슈타인, 징기스칸). 
- Tier 2: 자료는 충분히 있으나 Tier 1만큼 압도적이지 않거나 특정 지역/분야에서 유명한 인물.
- Tier 3: 역사적 자료가 제한적이거나 상대적으로 인지도가 낮은 인물.

반드시 모든 인물에 대해 다음 JSON 형식으로 응답하세요:
{
  "인물slug1": 1,
  "인물slug2": 2,
  ...
}`;

  const prompt = `다음 ${slugs.length}명의 인물 slug 목록을 보고, 각 인물을 1, 2, 3 중 하나의 Tier로 분류하세요.
누락되는 인물 없이 반드시 ${slugs.length}명 전부에 대해 분류해야 합니다.

[인물 목록]
${slugs.join(', ')}`;

  try {
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
      systemInstruction
    });
    
    const result = JSON.parse(response.response.text());
    
    // 검증 로직
    const missing = slugs.filter(s => !result[s]);
    if (missing.length > 0) {
      console.log(`${missing.length}명이 누락되었습니다. 기본값(Tier 2)으로 할당합니다.`);
      missing.forEach(s => result[s] = 2);
    }
    
    fs.writeFileSync('scratch/translations/tier-mapping.json', JSON.stringify(result, null, 2), 'utf8');
    console.log(`성공적으로 tier-mapping.json 을 생성했습니다. (총 ${Object.keys(result).length}명)`);
    
  } catch (e) {
    console.error('Error:', e);
  }
}

generateTiers();
