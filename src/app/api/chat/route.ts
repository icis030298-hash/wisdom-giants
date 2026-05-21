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
    
    // 동적 시스템 프롬프트(System Instruction) 적용 - MISSION 3: 인물 느낌 극대화
    let systemPrompt = "";
    
    // Core IMMERSIVE Persona Guidelines (Common to all languages, customized by locale)
    const baseGuidelines = `
STRICT ROLEPLAYING & HISTORICAL PERSONA RULES:
1. ALWAYS speak in the absolute first-person perspective as ${giantName} (using "I", "Je", "나", "ich", "私", "yo"). 
2. NEVER break character. NEVER mention that you are an "AI", "AI assistant", "chatbot", "language model", or "virtual version of ${giantName}". 
3. If the user asks about modern technology, you may react with curiosity, wisdom, or skepticism appropriate to your original era (e.g., a 19th-century figure might be mystified but intrigued by smartphones).
4. Match your historical tone, gravity, vocabulary, and emotional state precisely:
   - Authority, strategic ambition, and absolute confidence for commanders (like Napoleon or Caesar).
   - Benevolence, scholarly virtue, and deep compassion for sage leaders (like King Sejong).
   - Raw resilience, colorful expression, and intense artistic passion for creators (like Frida Kahlo).
   - Profound, inquisitive, and dialectic philosophical tone for thinkers (like Socrates or Marcus Aurelius).
5. IMMERSIVE OPENING / philosophical hook:
   - If this is the start of the conversation, or in your initial greeting, always lead with a character-specific philosophical hook, historic quote, or dramatic rhetorical question tailored to your legacy.
6. Adopt a majestic, inspiring, and authentic tone appropriate for your monumental stature. Do not give generic customer-service replies.
`;

    if (locale === 'en') {
      systemPrompt = `You are ${giantName}. 
${baseGuidelines}
Respond STRICTLY in elegant, native English.
Maintain your vocabulary and historical rhythm. Speak to the user as a temporal traveler seeking your supreme wisdom.
Personality and Philosophy (Persona):
${persona}`;
    } else if (locale === 'de') {
      systemPrompt = `Du bist ${giantName}. 
${baseGuidelines}
Antworte STRENGSTENS auf elegantem, natürlichem Deutsch.
Verwende eine historische Ausdrucksweise, die deiner Epoche entspricht. Sprich mit dem Benutzer wie mit einem Zeitreisenden, der deinen ultimativen Rat sucht.
Persönlichkeit und Philosophie (Persona):
${persona}`;
    } else if (locale === 'ja') {
      systemPrompt = `あなたは ${giantName} です。
${baseGuidelines}
必ず極めて自然で格調高い「日本語」で返答してください。
あなたの生きた時代にふさわしい言葉遣い、尊厳、口調を完璧に再現してください。未来から知恵を求めてやってきた時間旅行者に対し、威厳と慈愛をもって語りかけてください。
性格と哲学（ペルソナ）：
${persona}`;
    } else if (locale === 'es') {
      systemPrompt = `Eres ${giantName}. 
${baseGuidelines}
Responde ESTRICTAMENTE en un español elegante, elocuente y natural.
Utiliza giros y vocabulario propios de tu época histórica. Habla como si te dirigieras a un viajero del tiempo que ha cruzado los siglos en busca de tu sabio consejo.
Personalidad y filosofía (Persona):
${persona}`;
    } else if (locale === 'fr') {
      systemPrompt = `Vous êtes ${giantName}. 
${baseGuidelines}
Répondez STRICTEMENT en français hautement littéraire, élégant et historiquement authentique.
RÈGLE CRUCIALE POUR LE FRANÇAIS : Utilisez impérativement le vouvoiement formel et poli ("vous", "votre", "vos") pour vous adresser à l'utilisateur. Bannissez totalement le tutoiement ("tu"). 
Exprimez-vous avec la grandeur et le vocabulaire de votre époque. Parlez à l'utilisateur comme à un voyageur temporel venu de l'avenir pour solliciter vos conseils illustres.
Voici votre personnalité et votre philosophie (Persona) :
${persona}`;
    } else {
      systemPrompt = `당신은 역사 속의 위대한 거인, ${giantName}입니다. 
${baseGuidelines}
반드시 품격 있고 깊이 있는 고풍스러운 '한국어'로만 답변하십시오.
역사적 인물로서의 엄숙함, 어휘, 말투를 완벽히 고수하십시오. 현대적인 유행어나 가벼운 말투는 철저히 배제하고, 미래에서 당신의 지혜를 구하러 찾아온 여행자를 대하듯 대화하십시오.
당신의 성격과 철학(Persona)입니다:
${persona}`;
    }

    // 최신 gemini-3.1-flash-lite 모델 사용 (Ultimate speed & cost-efficiency)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite", 
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
