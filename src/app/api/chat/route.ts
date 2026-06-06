import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { giantPersonas } from "@/data/giant-personas";
import { deepPersonas } from "@/data/personas/personas";
import { giantsData } from "@/data/giants";
import narratives from "@/data/final-narratives.json";

export async function POST(req: Request) {
  try {
    const { prompt, giantName, persona, messages, locale, slug } = await req.json();

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

    const searchSlug = slug || giantName?.toLowerCase().replace(/\s+/g, '-');
    const gp = giantPersonas.find(p => p.slug === searchSlug);
    const deepPersona = deepPersonas[searchSlug];
    const lang = locale === 'ko' ? 'ko' : 'en';

    let customPersonaText = persona;
    let customNeverDoes = "";
    if (gp) {
      const detail = lang === 'ko' ? gp.ko : gp.en;
      customPersonaText = `
[핵심 철학 / Core Philosophy]
${detail.philosophy}

[소통 방식 / Communication Style]
${detail.style}

[당신이 겪은 고통 / Personal Struggles]
${detail.struggles}

[당신이 자주 하는 질문들 / Signature Questions]
${detail.questions.join('\n')}
`;
      customNeverDoes = `\nNEVER DO THESE: ${detail.neverDoes.join(', ')}`;
      if (searchSlug === 'miyamoto-musashi') {
        customNeverDoes += `
[미야모토 무사시 특별 지침]
당신은 오륜서(五輪書)의 저자 미야모토 무사시요.
- 승패는 기술이 아니라 마음의 준비에서 갈린다.
- 이론보다 실전이 중요하다.
- 하나를 통해 만 가지를 안다 (一理萬理).
- 불필요한 것을 모두 베어내라 - 검도 삶도 마찬가지.
- 절대 감정적인 동조나 장황한 설명을 하지 말고, 3문장 이내로 핵심만 단호하게 말하시오.
- "~하오", "~이오", "~겠소" 등의 무협식 어투를 반드시 고수하시오.
`;
      }
    } else if (deepPersona) {
      customPersonaText = `
[핵심 철학 / Core Philosophy]
${deepPersona.corePhilosophy[lang]}

[소통 방식 / Communication Style]
${deepPersona.communicationStyle[lang]}

[당신이 겪은 고통 / Personal Struggles]
${deepPersona.personalStruggles[lang]}

[당신이 자주 하는 질문들 / Signature Questions]
${deepPersona.signatureQuestions[lang].join('\n')}
`;
      customNeverDoes = `\nNEVER DO THESE: ${deepPersona.neverDoes.join(', ')}`;
    } else {
      // Dynamic fallback for API route to build rich persona
      const ourGiant = giantsData.find(g => g.slug === searchSlug);
      const narrative = (narratives as Record<string, any>)[searchSlug];
      const l = locale === 'ko' ? 'ko' : 
                locale === 'ja' ? 'ja' : 
                locale === 'de' ? 'de' : 
                locale === 'es' ? 'es' : 
                locale === 'fr' ? 'fr' : 
                locale === 'it' ? 'it' : 
                locale === 'pt' ? 'pt' : 'en';

      let trialsText = "";
      let overcomingText = "";
      let wisdomText = "";
      let epicExcerpt = "";

      if (narrative) {
        trialsText = narrative[`trials_${l}`] || narrative[`trials_en`] || "";
        overcomingText = narrative[`overcoming_${l}`] || narrative[`overcoming_en`] || "";
        
        if (!trialsText && ourGiant) {
          trialsText = ourGiant.pain || "";
        }
        if (!overcomingText && ourGiant) {
          overcomingText = ourGiant.recovery || "";
        }

        if (Array.isArray(narrative.wisdom) && narrative.wisdom.length > 0) {
          wisdomText = narrative.wisdom.map((w: any, idx: number) => {
            const q = w[`quote_${l}`] || w[`quote_en`] || "";
            const m = w[`meaning_${l}`] || w[`meaning_en`] || "";
            return `${idx + 1}. 명언: "${q}"\n   의미: ${m}`;
          }).join("\n");
        }

        const epic = narrative[`epic_${l}`] || narrative[`epic_en`] || "";
        if (epic) {
          epicExcerpt = epic.slice(0, 400) + "...";
        }
      } else if (ourGiant) {
        trialsText = ourGiant.pain || "";
        overcomingText = ourGiant.recovery || "";
        wisdomText = ourGiant.quote ? `명언: "${ourGiant.quote}"` : "";
      }

      customPersonaText = `
[시대적 배경 / Historical Era]
${ourGiant?.era || narrative?.[`era_${l}`] || ""}

[핵심 철학 및 지혜 / Core Philosophy & Wisdom]
${wisdomText || ourGiant?.quote || ""}

[생애의 시련 / Personal Struggles (Trials)]
${trialsText || ""}

[시련의 극복 / Overcoming Adversity]
${overcomingText || ""}

[생애 배경 요약 / Epic Background]
${epicExcerpt || ""}
`;

      if (searchSlug === 'miyamoto-musashi') {
        customNeverDoes = `
[미야모토 무사시 특별 지침]
당신은 오륜서(五輪書)의 저자 미야모토 무사시요.
- 승패는 기술이 아니라 마음의 준비에서 갈린다.
- 이론보다 실전이 중요하다.
- 하나를 통해 만 가지를 안다 (一理萬理).
- 불필요한 것을 모두 베어내라 - 검도 삶도 마찬가지.
- 절대 감정적인 동조나 장황한 설명을 하지 말고, 3문장 이내로 핵심만 단호하게 말하시오.
- "~하오", "~이오", "~겠소" 등의 무협식 어투를 반드시 고수하시오.
`;
      }
    }
    
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
${customPersonaText}${customNeverDoes}`;
    } else if (locale === 'de') {
      systemPrompt = `Du bist ${giantName}. 
${baseGuidelines}
Antworte STRENGSTENS auf elegantem, natürlichem Deutsch.
Verwende eine historische Ausdrucksweise, die deiner Epoche entspricht. Sprich mit dem Benutzer wie mit einem Zeitreisenden, der deinen ultimativen Rat sucht.
Persönlichkeit und Philosophie (Persona):
${customPersonaText}${customNeverDoes}`;
    } else if (locale === 'ja') {
      systemPrompt = `あなたは ${giantName} です。
${baseGuidelines}
必ず極めて自然で格調高い「日本語」で返答してください。
あなたの生きた時代にふさわしい言葉遣い、尊厳、口調を完璧に再現してください。未来から知恵を求めてやってきた時間旅行者に対し、威厳と慈愛をもって語りかけてください。
性格と哲学（ペルソナ）：
${customPersonaText}${customNeverDoes}`;
    } else if (locale === 'es') {
      systemPrompt = `Eres ${giantName}. 
${baseGuidelines}
Responde ESTRICTAMENTE en un español elegante, elocuente y natural.
Utiliza giros y vocabulario propios de tu época histórica. Habla como si te dirigieras a un viajero del tiempo que ha cruzado los siglos en busca de tu sabio consejo.
Personalidad y filosofía (Persona):
${customPersonaText}${customNeverDoes}`;
    } else if (locale === 'fr') {
      systemPrompt = `Vous êtes ${giantName}. 
${baseGuidelines}
Répondez STRICTEMENT en français hautement littéraire, élégant et historiquement authentique.
RÈGLE CRUCIALE POUR LE FRANÇAIS : Utilisez impérativement le vouvoiement formel et poli ("vous", "votre", "vos") pour vous adresser à l'utilisateur. Bannissez totalement le tutoiement ("tu"). 
Exprimez-vous avec la grandeur et le vocabulaire de votre époque. Parlez à l'utilisateur comme à un voyageur temporel venu de l'avenir pour solliciter vos conseils illustres.
Voici votre personnalité et votre philosophie (Persona) :
${customPersonaText}${customNeverDoes}`;
    } else if (locale === 'it') {
      systemPrompt = `Sei ${giantName}. 
${baseGuidelines}
Rispondi sempre in italiano.
Stai parlando con un utente italiano.
Usa un tono elegante e colto, fedele all'epoca del personaggio storico.
RÈGLE CRUCIALE POUR L'ITALIEN : Usa la forma di cortesia "Lei".
Personalità e filosofia (Persona):
${customPersonaText}${customNeverDoes}`;
    } else if (locale === 'pt') {
      systemPrompt = `Você é ${giantName}. 
${baseGuidelines}
Responda sempre em português brasileiro.
Você está conversando com um usuário brasileiro. Use um tom caloroso, natural e envolvente, fiel à época e personalidade do personagem histórico.
RÈGLE CRUCIALE PARA O PORTUGUÊS : Use o tratamento informal "você".
Personalidade e filosofia (Persona):
${customPersonaText}${customNeverDoes}`;
    } else {
      systemPrompt = `당신은 역사 속의 위대한 거인, ${giantName}입니다. 
${baseGuidelines}
반드시 품격 있고 깊이 있는 고풍스러운 '한국어'로만 답변하십시오.
역사적 인물로서의 엄숙함, 어휘, 말투를 완벽히 고수하십시오. 현대적인 유행어나 가벼운 말투는 철저히 배제하고, 미래에서 당신의 지혜를 구하러 찾아온 여행자를 대하듯 대화하십시오.
당신의 성격과 철학(Persona)입니다:
${customPersonaText}${customNeverDoes}`;
    }

    const modelsToTry = [
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-002"
    ];
    let text = "";
    let lastError = null;

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

    // [CRITICAL DEFENSE] 만약 마지막 메시지가 user 역할이라면, sendMessage가 user 역할을 덧붙이므로 중복 에러가 안 나게 지워줍니다.
    if (history.length > 0 && history[history.length - 1].role === "user") {
      history.pop();
    }

    for (const modelId of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelId, 
          systemInstruction: systemPrompt,
        });

        const chatSession = model.startChat({
          history: history,
        });

        const result = await chatSession.sendMessage(prompt);
        const response = await result.response;
        text = response.text();

        if (text) {
          break; // 성공 시 루프 탈출
        }
      } catch (error: any) {
        lastError = error;
        console.warn(`[Gemini API Warning] Failed with model ${modelId}:`, error.message);
      }
    }

    if (!text) {
      throw new Error(lastError?.message || "Gemini로부터 빈 응답을 받았습니다.");
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
