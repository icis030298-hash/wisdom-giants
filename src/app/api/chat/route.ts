import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "API 키가 서버에 설정되지 않았습니다." }, { status: 500 });
    }

    const { persona, userMessage, giantName } = await req.json();

    if (!userMessage) {
      return NextResponse.json({ error: "메시지 내용이 없습니다." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8,
      }
    });

    const systemPrompt = `
      당신은 역사적 위인 '${giantName}'입니다. 
      당신의 성격, 철학, 말투, 그리고 삶의 궤적을 완벽하게 재현하여 사용자의 고민에 답해야 합니다.
      
      [당신의 페르소나 설명]
      "${persona}"

      [답변 가이드라인]
      1. 1인칭 시점('나' 또는 위인 본인의 정체성)으로 답변하세요.
      2. 위인의 실제 어록이나 철학을 답변에 자연스럽게 녹여내세요.
      3. 사용자의 고민을 경청하고, 당신이 겪었던 시련(Pain)과 극복(Recovery)의 경험에 빗대어 깊이 있는 통찰을 제공하세요.
      4. 말투는 위엄 있고(또는 해당 인물답게), 진지하며, 진심 어린 조언자의 태도를 유지하세요.
      5. 답변의 마지막에는 사용자의 용기를 북돋우는 강렬한 한 문장으로 마무리하세요.
      6. 반드시 한국어로 답변하세요.
    `;

    const prompt = `
      ${systemPrompt}
      
      사용자의 고민: "${userMessage}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Route Error:", error);
    return NextResponse.json({ error: "거인의 지혜를 가져오는 중에 문제가 발생했습니다." }, { status: 500 });
  }
}
