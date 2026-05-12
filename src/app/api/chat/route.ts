import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, giantName, persona } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "질문 내용이 없습니다." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");
      return NextResponse.json({ error: "서버 설정 오류: API 키가 없습니다." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 시스템 프롬프트 구성
    const systemPrompt = `${persona}\n당신의 이름은 ${giantName}입니다. 당신의 성격과 지혜를 담아 답변해 주세요.`;
    const fullPrompt = `${systemPrompt}\n\n사용자: ${prompt}\n\n${giantName}:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Gemini 응답이 비어 있습니다.");
    }

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ 
      error: "제미나이 응답을 가져오는 중 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
