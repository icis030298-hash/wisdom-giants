import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, giantName, persona, messages, locale } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "질문 내용이 없습니다." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[Gemini API Error] GEMINI_API_KEY is missing. Available env keys:", Object.keys(process.env).filter(k => k.includes('GEMINI')));
      return NextResponse.json({ error: "서버 설정 오류: API 키가 없습니다." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 동적 시스템 프롬프트(System Instruction) 적용
    let systemPrompt = "";
    if (locale === 'en') {
      systemPrompt = `You are ${giantName}. 
Respond STRICTLY in English. 
Maintain the historical persona, tone, and wisdom of ${giantName}. 
Speak as if you are talking to a traveler from the future seeking your advice.
Next is your personality and philosophy (Persona):
${persona}`;
    } else if (locale === 'de') {
      systemPrompt = `Du bist ${giantName}. 
Antworte STRENGSTENS auf Deutsch. 
Behalte die historische Persona, den Ton und die Weisheit von ${giantName} bei. 
Sprich so, als ob du mit einem Reisenden aus der Zukunft sprichst, der deinen Rat sucht.
Als nächstes kommt deine Persönlichkeit und Philosophie (Persona):
${persona}`;
    } else if (locale === 'ja') {
       systemPrompt = `あなたは ${giantName} です。
 必ず「日本語」で返答してください。
 ${giantName} の歴史的なペルソナ、口調、そして知恵を完璧に維持してください。
 未来からアドバイスを求めてやってきた旅行者に話しかけるように対話してください。
 以下はあなたの性格と哲学（ペルソナ）です：
 ${persona}`;
    } else if (locale === 'es') {
      systemPrompt = `Eres ${giantName}. 
Responde ESTRICTAMENTE en español. 
Mantén la personalidad histórica, el tono y la sabiduría de ${giantName}. 
Habla como si te dirigieras a un viajero del futuro que busca tu consejo.
A continuación se detalla tu personalidad y filosofía (Persona):
${persona}`;
    } else if (locale === 'fr') {
      systemPrompt = `Vous êtes ${giantName}. 
Répondez STRICTEMENT en français. 
Conservez la personnalité historique, le ton et la sagesse de ${giantName}. 
Parlez comme si vous vous adressiez à un voyageur du futur qui sollicite vos conseils.
Adoptez un style élégant et cultivé, fidèle à l'époque de votre personnage.
Voici votre personnalité et philosophie (Persona) :
${persona}`;
    } else {
      systemPrompt = `당신은 ${giantName}입니다. 
반드시 '한국어'로만 대답하십시오. 
${giantName}의 역사적 페르소나, 말투, 그리고 지혜를 완벽하게 유지하십시오. 
미래에서 조언을 구하러 온 여행자에게 말하듯 대화하십시오.
다음은 당신의 성격과 철학(Persona)입니다:
${persona}`;
    }


    // 최신 gemini-1.5-flash 모델 사용
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", 
      systemInstruction: systemPrompt,
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
    console.error("[Gemini API Error] Full Details:", error);
    return NextResponse.json({ 
      error: "제미나이 응답을 가져오는 중 오류가 발생했습니다.",
      details: error.message || String(error),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
