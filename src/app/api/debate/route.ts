import { NextResponse } from "next/server";
import { getVertexAIInstance } from "@/lib/vertexai";
import { giantsData } from "@/data/giants";

export async function POST(req: Request) {
  try {
    const { giants, topic, history, currentSpeaker, locale, userMessage } = await req.json();

    if (!currentSpeaker || !topic) {
      return NextResponse.json({ error: "필수 파라미터가 누락되었습니다." }, { status: 400 });
    }

    // Find current speaker details
    const speakerGiant = giantsData.find(g => g.slug === currentSpeaker);
    if (!speakerGiant) {
      return NextResponse.json({ error: `위인을 찾을 수 없습니다: ${currentSpeaker}` }, { status: 404 });
    }

    const otherGiantsSlugs = (giants || []).filter((s: string) => s !== currentSpeaker);
    const otherGiantsNames = otherGiantsSlugs
      .map((slug: string) => {
        const g = giantsData.find(x => x.slug === slug);
        return g ? g.name : slug;
      })
      .join(", ");

    const giantName = speakerGiant.name;
    const persona = speakerGiant.persona || `당신은 ${giantName}입니다.`;

    // 1. Enforce strict character debate guidelines
    const baseGuidelines = `
STRICT ROLEPLAYING & HISTORICAL DEBATE RULES:
1. ALWAYS speak in the absolute first-person perspective as ${giantName} (using "I", "Je", "나", "ich", "私", "yo").
2. You are participating in a panel debate with the following other giants: [${otherGiantsNames}].
3. The debate topic is: "${topic}".
4. You must argue strictly based on your actual historical legacy, books, theories, and philosophical views.
5. React directly to what was said previously in the conversation. Counter or agree with the other giants' views with razor-sharp focus and character-accurate temperament.
6. Keep your answers brief, dense, and punchy (3 to 5 sentences maximum). Do not write extremely long paragraphs.
7. NEVER mention that you are an "AI", "chatbot", or "virtual version". NEVER break character.
8. If there is a user interjection (userMessage), address it or react to it from your historical perspective.
`;

    // 2. Multilingual system prompt configuration
    let systemPrompt = "";
    if (locale === 'en') {
      systemPrompt = `You are ${giantName}.
${baseGuidelines}
Respond STRICTLY in elegant, native English. Speak with your historical authority.
Personality and Philosophy:
${persona}`;
    } else if (locale === 'de') {
      systemPrompt = `Du bist ${giantName}.
${baseGuidelines}
Antworte STRENGSTENS auf elegantem, natürlichem Deutsch. Behalte deine historische Persona bei.
Persönlichkeit und Philosophie:
${persona}`;
    } else if (locale === 'ja') {
      systemPrompt = `あなたは ${giantName} です。
${baseGuidelines}
必ず極めて自然で格조높은「日本語」で返答してください。歴史的な口調や尊厳を完全に再現してください。
性格と哲学：
${persona}`;
    } else if (locale === 'es') {
      systemPrompt = `Eres ${giantName}.
${baseGuidelines}
Responde ESTRICTAMENTE en un español elegante y elocuente.
Personalidad y filosofía:
${persona}`;
    } else if (locale === 'fr') {
      systemPrompt = `Vous êtes ${giantName}.
${baseGuidelines}
Répondez STRICTEMENT en français littéraire et authentique. Utilisez impérativement le vouvoiement.
Voici votre personnalité et votre philosophie :
${persona}`;
    } else if (locale === 'it') {
      systemPrompt = `Sei ${giantName}.
${baseGuidelines}
Rispondi sempre in italiano elegante. Usa la forma di cortesia "Lei".
Personalità e filosofia:
${persona}`;
    } else if (locale === 'pt') {
      systemPrompt = `Você é ${giantName}.
${baseGuidelines}
Responda sempre em português brasileiro e natural. Use "você".
Personalidade e filosofia:
${persona}`;
    } else {
      systemPrompt = `당신은 ${giantName}입니다.
${baseGuidelines}
반드시 깊이 있고 품격 있는 '한국어'로 대답하십시오. 자신의 철학과 신념에 기반하여 상대방의 의견을 반박하거나 동조하십시오.
당신의 성격과 철학(Persona):
${persona}`;
    }

    const vAI = getVertexAIInstance();
    
    const formattedHistoryLog = (history || [])
      .map((msg: any) => {
        const senderName = msg.speakerName || msg.speaker;
        return `${senderName}: ${msg.content}`;
      })
      .join("\n\n");

    let debatePrompt = `
=== 이전 토론 기록 (DEBATE LOG) ===
${formattedHistoryLog || "(토론의 첫 발언입니다)"}

${userMessage ? `\n=== 관객(사용자)의 개입 ===\n사용자가 토론에 개입하여 다음과 같이 말했습니다: "${userMessage}"\n` : ""}

=== 발언 요청 ===
현재 당신(${giantName})의 발언 차례입니다. 
위의 토론 기록과 관객의 개입을 깊이 고려하여, ${giantName}의 페르소나로 날카롭고 매력적인 발언을 해주십시오. 
(기존 규칙 엄수: 3~5문장 내외로 대답하고, 다음 발언자로 지목할 다른 위인을 언급하거나 도발하며 마무리하면 좋습니다.)
`;

    // Vertex AI models fallback
    const modelsToTry = [
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash"
    ];
    let lastError = null;
    let textResult = "";

    for (const modelId of modelsToTry) {
      try {
        const model = vAI.getGenerativeModel({
          model: modelId,
          systemInstruction: { parts: [{ text: systemPrompt }] },
        });

        const result = await model.generateContent(debatePrompt);
        const response = await result.response;
        
        if (typeof response.text === 'function') {
          textResult = response.text();
        } else {
          textResult = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }

        if (textResult) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Debate API] Failed utilizing model [${modelId}]:`, err.message);
      }
    }

    if (!textResult) {
      throw new Error(lastError?.message || "Gemini API failed to return a response.");
    }

    return NextResponse.json({
      speaker: currentSpeaker,
      content: textResult.trim(),
    });

  } catch (error: any) {
    console.error("[Debate API Error]:", error);
    return NextResponse.json({
      error: "토론 답변을 생성하는 도중 오류가 발생했습니다.",
      details: error.message || String(error)
    }, { status: 500 });
  }
}

