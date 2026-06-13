import { NextRequest, NextResponse } from "next/server";
import { getVertexAIInstance } from "@/lib/vertexai";
import { giantPersonas } from "@/data/giant-personas";
import { deepPersonas } from "@/data/personas/personas";

export async function POST(req: NextRequest) {
  try {
    const { giantSlug, customText, locale = 'en' } = await req.json();
    if (!giantSlug || !customText) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const vAI = getVertexAIInstance();

    // Retrieve giant detail information
    const gp = giantPersonas.find(p => p.slug === giantSlug);
    const deepPersona = deepPersonas[giantSlug];
    const lang = locale === 'ko' ? 'ko' : 'en';

    let customPersonaText = "";
    let signatureRules = "";
    let giantName = giantSlug;

    if (gp) {
      giantName = gp.name;
      const detail = lang === 'ko' ? gp.ko : gp.en;
      customPersonaText = `
[Core Philosophy]
${detail.philosophy}
[Personal Struggles]
${detail.struggles}
[Communication Style]
${detail.style}
`;
      signatureRules = `
- Style: ${detail.style}
- Things to avoid: ${detail.neverDoes.join(', ')}
`;
      if (giantSlug === 'miyamoto-musashi') {
        signatureRules += `
- You are Miyamoto Musashi, author of Go Rin No Sho (The Book of Five Rings).
- Use traditional martial arts archaic tone (e.g. "~하오", "~이오", "~겠소" in Korean).
- Be extremely blunt, minimal, and sharp. Never express excessive emotional sympathy.
`;
      }
    } else if (deepPersona) {
      giantName = deepPersona.name?.[lang] || giantSlug;
      customPersonaText = `
[Core Philosophy]
${deepPersona.corePhilosophy[lang]}
[Personal Struggles]
${deepPersona.personalStruggles[lang]}
[Communication Style]
${deepPersona.communicationStyle[lang]}
`;
      signatureRules = `
- Style: ${deepPersona.communicationStyle[lang]}
- Things to avoid: ${deepPersona.neverDoes.join(', ')}
`;
    }

    const systemPrompt = `당신은 역사적 인물인 ${giantName}입니다.
사용자가 당신에게 다음과 같은 커스텀 개인 고민을 직접 작성하여 털어놓았습니다:
"${customText}"

당신의 인생 역경, 철학, 소통 스타일을 바탕으로, 이 사용자의 고민을 읽자마자 건넬 첫 공감의 대화 시작 인사말(initialGreeting)을 1문장으로 작성해 주십시오.

당신의 페르소나 데이터:
${customPersonaText}
${signatureRules}

[인사말 작성 준수 규칙 — 필수]
1. 답변은 반드시 **[한국어 또는 사용자의 언어]**로 작성해 주십시오. (지정된 언어: "${locale}")
2. **[무조건 단 1문장(공백 포함 80자 이내)]**으로만 대답하십시오. 배경 설명, 업적 자랑, 장황한 도입부는 일절 생략하십시오.
3. 당신은 교사가 아닙니다. 가르치려 하거나 훈계하지 말고, 고통을 먼저 겪어본 동반자로서 공감해 주십시오.
4. 문장의 끝부분에는 사용자의 구체적인 고민 상황을 자극하여 자발적 답변을 유도하는 **[날카롭고 심플한 질문 한 줄]**을 담아내십시오.
   - 예시(링컨): "나 역시 숱한 패배를 겪어 좌절의 마음을 아네. 자네는 왜 이번 일에 그토록 큰 상실을 느끼고 있나?"
   - 예시(무사시): "잡념이 검을 무디게 만드는 법이오. 자네 마음을 흔드는 가장 큰 잡념이 무엇이오?"

오직 위인의 목소리로 된 **첫 문장 하나**만 텍스트로 출력해 주십시오. 마크다운 장식이나 설명 없이 출력하십시오.`;

    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    let greetingText = "";
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const model = vAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        
        if (typeof response.text === 'function') {
          greetingText = response.text();
        } else {
          greetingText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
        
        if (greetingText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`[Greeting Model failed] ${modelName}:`, err.message);
      }
    }

    if (!greetingText && lastError) {
      throw lastError;
    }

    // Clean up potential quotes in greeting
    greetingText = greetingText.trim().replace(/^["']|["']$/g, '');

    return NextResponse.json({ greeting: greetingText }, { status: 200 });
  } catch (error: any) {
    console.error("Greeting API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate greeting" }, { status: 500 });
  }
}
