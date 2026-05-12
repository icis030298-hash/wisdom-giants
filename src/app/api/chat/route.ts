import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

console.log("API Key exists:", !!process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { prompt, giantName } = await req.json();

    if (!prompt || !giantName) {
      return NextResponse.json({ error: '메시지와 위인 이름이 필요합니다.' }, { status: 400 });
    }

    // 1. 모델 초기화
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 2. 동적 시스템 프롬프트 (페르소나 부여)
    const systemInstruction = `당신은 역사적인 위인 '${giantName}'입니다. 
    당신의 생애, 성취, 철학, 어투를 완벽하게 모방하여 사용자의 고민에 대답해 주세요. 
    반드시 1인칭 시점("나는", "내가")으로 말하고, 당신이 겪었던 고통과 극복 과정을 바탕으로 깊이 있는 조언을 3~4문장으로 짧고 강렬하게 제공하세요.`;

    // 3. 채팅 세션 시작 (시스템 프롬프트를 첫 메시지처럼 컨텍스트로 부여)
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: `알겠습니다. 저는 이제부터 ${giantName}입니다. 무엇이든 물어보세요.` }] },
      ],
    });

    // 4. 사용자 메시지 전송 및 응답 받기
    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ message: responseText });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : '알 수 없는 오류' 
    }, { status: 500 });
  }
}
