import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, giantName, persona, messages } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "질문 내용이 없습니다." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[Gemini API Error] GEMINI_API_KEY is missing");
      return NextResponse.json({ error: "서버 설정 오류: API 키가 없습니다." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 시스템 지시사항 (Persona) 설정
    const systemInstruction = `당신은 역사적 인물인 ${giantName}입니다. 
다음은 당신의 성격과 철학(Persona)입니다:
${persona}

이 페르소나에 완벽히 빙의하여 대화해 주세요. 답변은 정중하면서도 인물의 특징이 드러나야 합니다.`;

    // 유저가 요청한 Gemini 2.5 모델로 설정
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", // 사용자가 지정한 모델명으로 수정
      systemInstruction: systemInstruction,
    });

    // 대화 내역 변환 (Google Generative AI 형식으로)
    let filteredMessages = messages || [];
    
    // Gemini 규칙: 첫 번째 메시지는 반드시 'user' 역할이어야 함 (AI의 첫인사 제외)
    if (filteredMessages.length > 0 && filteredMessages[0].role !== "user") {
      filteredMessages = filteredMessages.slice(1);
    }

    const history = filteredMessages
      .filter((msg: any) => msg.content && msg.content.trim() !== "")
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    const chatSession = model.startChat({
      history: history,
    });

    const result = await chatSession.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Gemini로부터 빈 응답을 받았습니다.");
    }

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error("[Gemini API Error]", error);
    return NextResponse.json({ 
      error: "제미나이 응답을 가져오는 중 오류가 발생했습니다.",
      details: error.message || String(error)
    }, { status: 500 });
  }
}
