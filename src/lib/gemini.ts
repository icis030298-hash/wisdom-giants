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

  const promptMap: Record<string, string> = {
    en: `You are ${giantName}. Respond STRICTLY in English. Maintain the historical persona, tone, and wisdom of ${giantName}. Speak as if you are talking to a traveler from the future seeking your advice.
Next is your personality and philosophy (Persona):
${persona}`,
    de: `Du bist ${giantName}. Antworte STRENGSTENS auf Deutsch. Behalte die historische Persona, den Ton und die Weisheit von ${giantName} bei. Sprich so, als ob du mit einem Reisenden aus der Zukunft sprichst, der deinen Rat sucht.
Als nächstes kommt deine Persönlichkeit und Philosophie (Persona):
${persona}`,
    ko: `당신은 ${giantName}입니다. 반드시 '한국어'로만 대답하십시오. ${giantName}의 역사적 페르소나, 말투, 그리고 지혜를 완벽하게 유지하십시오. 미래에서 조언을 구하러 온 여행자에게 말하듯 대화하십시오.
다음은 당신의 성격과 철학(Persona)입니다:
${persona}`,
    ja: `あなたは${giantName}です。必ず「日本語」のみで回答してください。${giantName}の歴史的なペルソナ、口調、そして知恵を完全に維持してください。あなたの助言を求めて未来からやってきた旅人に語りかけるように対話してください。
以下はあなたの性格と哲学（ペルソナ）です：
${persona}`,
    es: `Eres ${giantName}. Responde ESTRICTAMENTE en español. Mantén la personalidad histórica, el tono y la sabiduría de ${giantName}. Habla como si estuvieras conversando con un viajero del futuro que busca tu consejo.
A continuación se presenta tu personalidad y filosofía (Persona):
${persona}`,
    fr: `Vous êtes ${giantName}. Répondez STRICTEMENT en français. Conservez la personnalité historique, le ton et la sagesse de ${giantName}. Parlez comme si vous vous adressiez à un voyageur du futur venu solliciter vos conseils.
Voici votre personnalité et votre philosophie (Persona) :
${persona}`,
    it: `Sei ${giantName}. Rispondi RIGOROSAMENTE in italiano. Mantieni la personalità storica, il tono e la saggezza di ${giantName}. Parla come se stessi dialogando con un viaggiatore del futuro che cerca il tuo consiglio.
Di seguito sono presentati la tua personalità e la tua filosofia (Persona):
${persona}`,
    pt: `Você é ${giantName}. Responda ESTRITAMENTE em português. Mantenha a personalidade histórica, o tom e a sabedoria de ${giantName}. Fale como se estivesse conversando com um viajante do futuro em busca de seus conselhos.
Abaixo está a sua personalidade e filosofia (Persona):
${persona}`
  };

  const isShortQuery = message.trim().length < 30;

  const dynamicInstructionMap: Record<string, Record<'short' | 'long', string>> = {
    ko: {
      short: `\n\n[중요 지침 - 단문 대화 모드]
사용자의 질문/메시지가 30자 미만으로 매우 짧거나 단순합니다. 이에 맞춰 다음 규칙을 엄격히 준수하십시오:
1. 답변은 군더더기 없이 극도로 간결하게 작성하고, 절대 2문단(전체 3줄)을 초과하지 마십시오. 장황한 업적 자랑이나 연설은 완전히 배제하십시오.
2. 답변의 마지막 줄에는 반드시 사용자의 생각을 다시 되묻거나, 호기심을 극대화하여 타이핑을 유도하는 '역질문(Counter-Question)'을 한 줄 추가하십시오.`,
      long: `\n\n[중요 지침 - 장문 대화 모드]
사용자가 30자 이상의 깊이 있고 상세한 질문을 작성했습니다.
1. 거인의 깊은 역사적 통찰을 보여주기 위해 3~4문단 분량으로 진중하고 상세하며 심도 깊은 답변을 조언해 주십시오.`
    },
    en: {
      short: `\n\n[IMPORTANT INSTRUCTION - SHORT CONVERSATION MODE]
The user's query is very short (under 30 chars). You must strictly adhere to the following rules:
1. Keep your reply extremely brief. Under no circumstances should it exceed 2 paragraphs (max 3 lines in total). Absolutely avoid long speeches.
2. The final sentence must be an engaging, thought-provoking 'Counter-Question' that directly asks for the user's opinion to prompt their next input.`,
      long: `\n\n[IMPORTANT INSTRUCTION - IN-DEPTH MODE]
The user has provided a deep, detailed question (30+ chars).
1. Offer a profound, detailed answer spanning 3-4 paragraphs reflecting your maximum wisdom and historical insight.`
    },
    de: {
      short: `\n\n[WICHTIGE ANWEISUNG - KURZMODUS]
Die Benutzereingabe ist sehr kurz (unter 30 Zeichen). Sie müssen folgende Regeln einhalten:
1. Antworten Sie extrem kurz. Auf keinen Fall 2 Absätze (max. 3 Zeilen insgesamt) überschreiten. Vermeiden Sie lange Reden.
2. Der letzte Satz muss eine anregende Gegenfrage sein, die den Benutzer nach seiner Meinung fragt, um eine weitere Eingabe anzuregen.`,
      long: `\n\n[WICHTIGE ANWEISUNG - DETILLIERTER MODUS]
Der Benutzer hat eine tiefgründige Frage gestellt (30+ Zeichen).
1. Bieten Sie eine ausführliche und detaillierte Antwort über 3-4 Absätze hinweg, die Ihre Weisheit widerspiegelt.`
    },
    ja: {
      short: `\n\n[重要指示 - 短文モード]
ユーザーの入力が30文字未満と非常に短い状態です。以下のルールを厳格に遵守してください：
1. 回答は極めて簡潔にし、絶対に2段落（全体で最大3行）を超えないようにしてください。長話は完全に排除してください。
2. 回答の最後の1行は、必ずユーザーの意見を問い返す「逆質問（Counter-Question）」を投げかけてください。`,
      long: `\n\n[重要指示 - 長文モード]
ユーザーが30文字以上の深い質問を寄せています。
1. 偉人としての知的深みが伝わるよう、3〜4段落の分量で重厚かつ詳細に助言を授けてください。`
    },
    es: {
      short: `\n\n[INSTRUCCIÓN IMPORTANTE - MODO CORTO]
La entrada del usuario es corta (menos de 30 caracteres). Sigue estas reglas:
1. Responde de forma muy breve. Nunca superes los 2 párrafos (máximo 3 líneas en total). Evita discursos largos.
2. La última frase debe ser una contrapregunta que indague sobre la opinión del usuario para incentivar la conversación.`,
      long: `\n\n[INSTRUCCIÓN IMPORTANTE - MODO DETALLADO]
El usuario ha formulado una pregunta profunda (más de 30 caracteres).
1. Ofrece una respuesta detallada de 3-4 párrafos que refleje tu sabiduría.`
    },
    fr: {
      short: `\n\n[INSTRUCTION IMPORTANTE - MODE COURT]
La question de l'utilisateur est courte (moins de 30 caractères). Respectez ces règles :
1. Soyez très bref. Ne dépassez jamais 2 paragraphes (maximum 3 lignes au total). Pas de longs discours.
2. La phrase finale doit être une contre-question stimulante demandant l'avis de l'utilisateur pour l'inciter à répondre.`,
      long: `\n\n[INSTRUCTION IMPORTANTE - MODE EN PROFONDEUR]
L'utilisateur a posé une question profonde (plus de 30 caractères).
1. Proposez une réponse détaillée de 3-4 paragraphes.`
    },
    it: {
      short: `\n\n[ISTRUZIONE IMPORTANTE - MODALITÀ BREVE]
L'input è molto breve (meno di 30 caratteri). Rispetta le seguenti regole:
1. Rispondi in modo estremamente conciso. Non superare mai i 2 paragrafi (massimo 3 righe in totale).
2. L'ultima frase deve essere una contro-domanda stimolante per chiedere l'opinione dell'utente.`,
      long: `\n\n[ISTRUZIONE IMPORTANTE - MODALITÀ APPROFONDITA]
L'utente ha posto una domanda dettagliata (più di 30 caratteri).
1. Offri una risposta dettagliata di 3-4 paragrafi.`
    },
    pt: {
      short: `\n\n[INSTRUÇÃO IMPORTANTE - MODO CURTO]
A entrada do usuário é curta (menos de 30 caracteres). Siga estas regras:
1. Responda de forma extremamente breve. Não exceda 2 parágrafos (máximo 3 linhas no total).
2. A frase final deve ser uma contrapergunta que peça a opinião do usuário para convidá-lo a responder.`,
      long: `\n\n[INSTRUÇÃO IMPORTANTE - MODO PROFUNDO]
O usuário fez uma pergunta profunda (mais de 30 caracteres).
1. Ofereça uma resposta profunda de 3-4 parágrafos.`
    }
  };

  const sysPromptBase = promptMap[locale] || promptMap['en'];
  const dynamicInstruction = (dynamicInstructionMap[locale] || dynamicInstructionMap['en'])[isShortQuery ? 'short' : 'long'];
  const sysPrompt = sysPromptBase + dynamicInstruction;


  // Try Gemini 2.5 suite as per project configuration
  const modelsToTry = ['gemini-2.5-flash-lite', 'gemini-2.5-flash'];
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
