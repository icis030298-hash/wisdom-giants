'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// API 키 확인 (서버 사이드에서 실행됨)
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is missing in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

/**
 * 사용자님께서 검증하신 2.5 버전 모델을 사용하는 서버 액션 함수입니다.
 */
export async function getGiantResponse(persona: string, message: string, giantName: string, history: any[] = [], locale: string = 'ko') {
  if (!apiKey) {
    throw new Error("서버 설정 오류: API 키가 없습니다.");
  }

  const sysPrompt = locale === 'en' 
    ? `You are ${giantName}. Respond STRICTLY in English. Maintain the historical persona, tone, and wisdom of ${giantName}. Speak as if you are talking to a traveler from the future seeking your advice.
Next is your personality and philosophy (Persona):
${persona}`
    : `당신은 ${giantName}입니다. 반드시 '한국어'로만 대답하십시오. ${giantName}의 역사적 페르소나, 말투, 그리고 지혜를 완벽하게 유지하십시오. 미래에서 조언을 구하러 온 여행자에게 말하듯 대화하십시오.
다음은 당신의 성격과 철학(Persona)입니다:
${persona}`;

  // Try Gemini 2.5 suite as per project configuration
  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];
  let lastError = null;

  for (const modelId of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelId,
        systemInstruction: sysPrompt 
      });

      // 대화 내역(history) 처리
      let filteredMessages = history || [];
      if (filteredMessages.length > 0 && filteredMessages[0].role !== "user") {
        filteredMessages = filteredMessages.slice(1);
      }

      const chatHistory = filteredMessages.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      const chatSession = model.startChat({
        history: chatHistory,
      });

      const result = await chatSession.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      lastError = error;
      console.warn(`[Gemini 2.5 Error]: Failed utilizing model [${modelId}]`, error.message);
      
      // If it's a fatal error (not 404/not found), we might want to stop, 
      // but here we strictly follow the 2.5 migration path.
      if (!error.message?.includes("404") && !error.message?.includes("not found")) {
        // Keep trying the next 2.5 model unless it's a completely different error
        continue;
      }
    }
  }

  console.error("[Gemini 2.5 Critical Error] All 2.5 models failed. Details:", {
    message: lastError?.message,
    giant: giantName
  });
  throw new Error(lastError?.message || "I encountered an error while retrieving my wisdom from the Gemini 2.5 engine.");
}
