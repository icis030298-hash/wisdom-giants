import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function getGiantResponse(persona: string, userMessage: string, giantName: string) {
  if (!apiKey) {
    return "API 키가 설정되지 않았습니다. 관리자에게 문의하세요.";
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    당신은 역사적 위인 '${giantName}'의 페르소나를 가진 AI 멘토입니다.
    다음은 당신의 성격과 말투를 결정하는 페르소나 설명입니다:
    "${persona}"

    사용자가 다음과 같은 고민을 이야기했습니다:
    "${userMessage}"

    위인의 철학과 통찰력을 담아 조언을 해주세요. 
    말투는 위인의 페르소나를 완벽하게 유지해야 합니다.
    답변의 마지막에는 반드시 사용자를 따뜻하게 격려하거나 의지를 북돋우는 문장을 포함하세요.
    한국어로 답변하세요.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "죄송합니다. 지혜를 빌려오는 도중 오류가 발생했습니다. 다시 시도해주세요.";
  }
}
