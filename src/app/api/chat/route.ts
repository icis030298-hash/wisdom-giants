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
      console.error("[Gemini API Error] GEMINI_API_KEY is missing in environment variables");
      return NextResponse.json({ error: "서버 설정 오류: API 키가 없습니다." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 시스템 지시사항 구성
    const systemInstruction = `${persona}\n당신은 역사적 인물인 ${giantName}입니다. 당신의 지혜와 말투를 사용하여 답변해 주세요. 대화 내역을 참고하여 맥락에 맞는 답변을 하세요.`;

    // 대화 내역 변환 (Google Generative AI 형식으로)
    const history = (messages || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // 채팅 시작
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(`${systemInstruction}\n\n사용자: ${prompt}`);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Gemini 응답이 비어 있습니다.");
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
