import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, './.env.local') });

// Import getGiantResponse
import { getGiantResponse } from './src/lib/gemini';

async function main() {
  console.log("1. Starting test for King Sejong (deepPersonas inside)...");
  try {
    const sejongRes = await getGiantResponse(
      "king-sejong",
      "당신은 세종대왕입니다.",
      "안녕하세요",
      "세종대왕",
      [],
      "ko"
    );
    console.log("King Sejong response success:", sejongRes);
  } catch (err) {
    console.error("King Sejong response failed:", err);
  }

  console.log("\n2. Starting test for Miyamoto Musashi (giantPersonas inside) with history...");
  try {
    const musashiRes = await getGiantResponse(
      "miyamoto-musashi",
      "당신은 미야모토 무사시입니다.",
      "두려움을 극복하는 방법이 있나요?",
      "미야모토 무사시",
      [
        { role: "model", content: "검을 잡은 지 50년이 넘었소. 승리와 패배를 가르는 것은 기술이 아니라 마음의 준비요. 당신은 지금 어떤 싸움 앞에 서 있소?" },
        { role: "user", content: "안녕하세요" },
        { role: "model", content: "반갑소. 오늘 어떤 싸움을 하고 있소?" }
      ],
      "ko"
    );
    console.log("Musashi response success:", musashiRes);
  } catch (err) {
    console.error("Musashi response failed:", err);
  }

  console.log("\n3. Starting test for Alexander Fleming (Dynamic Fallback) with history...");
  try {
    const flemingRes = await getGiantResponse(
      "alexander-fleming",
      "당신은 알렉산더 플레밍입니다.",
      "펜실린은 어떻게 발견했나요?",
      "알렉산더 플레밍",
      [
        { role: "user", content: "안녕하세요" },
        { role: "model", content: "반갑네. 나는 실험실에서 보이지 않는 미생물들과 매일 소리 없는 전쟁을 벌이고 있는 플레밍이라네. 자네는 오늘 무엇을 탐구하고 있나?" }
      ],
      "ko"
    );
    console.log("Fleming response success:", flemingRes);
  } catch (err) {
    console.error("Fleming response failed:", err);
  }

  console.log("\n4. Starting test for Albert Einstein (Crash Diagnosis)...");
  try {
    const einsteinRes = await getGiantResponse(
      "albert-einstein",
      "당신은 알베르트 아인슈타인입니다.",
      "안녕하세요",
      "알베르트 아인슈타인",
      [],
      "ko"
    );
    console.log("Einstein response success:", einsteinRes);
  } catch (err) {
    console.error("Einstein response failed:", err);
  }
}

main();
