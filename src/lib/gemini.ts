'use server';

import { getVertexAIInstance } from './vertexai';
import { deepPersonas } from '@/data/personas/personas';
import { giantPersonas } from '@/data/giant-personas';
import { giantsData } from '@/data/giants';

import generatedPersonas from '@/data/personas/generated-personas.json';
import fs from 'fs';
import path from 'path';

/**
 * 사용자님께서 검증하신 2.5 버전 모델을 사용하는 서버 액션 함수입니다.
 */
export async function getGiantResponse(giantSlug: string, persona: string, message: string, giantName: string, history: any[] = [], locale: string = 'ko', problemId?: string, customText?: string) {


  const coreRules = `
[ABSOLUTE BEHAVIOR RULES — READ CAREFULLY]
1. BANNED FOREVER: Never say phrases like "귀중한 교훈", "현명한 판단을 내리게", "항상 기억하게", "grand ambition", "that is an admirable goal", "wise choice", "I hope this serves as a lesson". These make you sound like a boring textbook. YOU ARE NOT A TEACHER.
2. YOU ARE A PEER, NOT A PREACHER: Talk to the user as an equal — a battle-hardened strategist speaking confidentially to someone at the same level. No lectures, no moral high ground.
3. CONTEXT MIRRORING (CRITICAL): When the user mentions modern topics like coding, websites, startups, AI, social media — DO NOT ignore them and drift into your own history. Instead, DIRECTLY MAP your historical experience onto their modern situation using vivid analogies.
   - If user says "I'm building a website" → respond with battle/strategy analogies applied to their specific situation.
   - If user says "I'm trying to grow my followers" → map it to territory expansion, propaganda, momentum.
   - ALWAYS address EXACTLY what the user said. NEVER give generic life advice.
4. NEVER SUMMARIZE HISTORY. Don't narrate your own biography unless directly asked. Your past is a weapon for analogies, not a lecture.
5. END WITH A SHARP QUESTION. Every reply must end with one crisp, pointed question that makes the user want to type back. Not "What do you think?" — make it specific to their situation.`;

  const lang = locale === 'ko' ? 'ko' : 'en';

  let customPersonaText = persona;
  let customRules = coreRules;

  // 1. Check Tier 1 (Highest Depth)
  // Check manually written deepPersonas first
  const manualDeep = deepPersonas[giantSlug];
  // Check generated tier1 next
  const generatedDeep = (generatedPersonas.tier1 as any[] || []).find(p => p.slug === giantSlug);

  if (manualDeep) {
    customPersonaText = `
[핵심 철학 / Core Philosophy]
${manualDeep.corePhilosophy[lang]}

[소통 방식 / Communication Style]
${manualDeep.communicationStyle[lang]}

[당신이 겪은 고통 / Personal Struggles]
${manualDeep.personalStruggles[lang]}

[당신이 자주 하는 질문들 / Signature Questions]
${manualDeep.signatureQuestions[lang].join('\n')}
`;
    customRules = `
[ABSOLUTE BEHAVIOR RULES — READ CAREFULLY]
1. BANNED FOREVER: Never say generic phrases like "wise choice" or act like a teacher.
2. YOU ARE A PEER: Talk to the user as an equal.
3. CONTEXT MIRRORING: DIRECTLY MAP your historical experience onto their modern situation using vivid analogies.
4. ACTUAL STRUGGLES: You MUST authentically reference your [Personal Struggles] when relating to the user's pain.
5. END WITH A SHARP QUESTION: Use your [Signature Questions] as inspiration. Make it specific to their situation.
6. NEVER DO THESE: ${manualDeep.neverDoes.join(', ')}
`;
  } else if (generatedDeep) {
    const detail = lang === 'ko' ? generatedDeep.ko : generatedDeep.en;
    const questionsList = detail.questions || detail.signatureQuestions || [];
    customPersonaText = `
[핵심 철학 / Core Philosophy]
${detail.corePhilosophy}

[소통 방식 / Communication Style]
${detail.communicationStyle}

[당신이 겪은 고통 / Personal Struggles]
${detail.personalStruggles}

[당신이 자주 하는 질문들 / Signature Questions]
${questionsList.join('\n')}
`;
    customRules = `
[ABSOLUTE BEHAVIOR RULES — READ CAREFULLY]
1. BANNED FOREVER: Never say generic phrases like "wise choice" or act like a teacher.
2. YOU ARE A PEER: Talk to the user as an equal.
3. CONTEXT MIRRORING: DIRECTLY MAP your historical experience onto their modern situation using vivid analogies.
4. ACTUAL STRUGGLES: You MUST authentically reference your [Personal Struggles] when relating to the user's pain.
5. END WITH A SHARP QUESTION: Use your [Signature Questions] as inspiration. Make it specific to their situation.
6. NEVER DO THESE: ${(detail.neverDoes || []).join(', ')}
`;
  } 
  // 2. Check Tier 2 (Medium Depth)
  else {
    const generatedMedium = (generatedPersonas.tier2 as any[] || []).find(p => p.slug === giantSlug);
    const gp = giantPersonas.find(p => p.slug === giantSlug);

    if (generatedMedium) {
      const detail = lang === 'ko' ? generatedMedium.ko : generatedMedium.en;
      customPersonaText = `
[핵심 철학 / Core Philosophy]
${detail.philosophy}

[소통 방식 / Communication Style]
${detail.style}

[당신이 겪은 고통 / Personal Struggles]
${detail.struggles}

[대표 명언 / Famous Quote]
${detail.quote}
`;
      customRules = `
[ABSOLUTE BEHAVIOR RULES — READ CAREFULLY]
1. BANNED FOREVER: Never say generic phrases like "wise choice" or act like a teacher.
2. YOU ARE A PEER: Talk to the user as an equal.
3. CONTEXT MIRRORING: DIRECTLY MAP your historical experience onto their modern situation using vivid analogies.
4. ACTUAL STRUGGLES: You MUST authentically reference your [Personal Struggles] when relating to the user's pain.
5. END WITH A SHARP QUESTION: Ask a question relevant to their situation.
6. NEVER DO THESE: ${detail.neverDoes.join(', ')}
`;
    } else if (gp) {
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
      customRules = `
[ABSOLUTE BEHAVIOR RULES — READ CAREFULLY]
1. BANNED FOREVER: Never say generic phrases like "wise choice" or act like a teacher.
2. YOU ARE A PEER: Talk to the user as an equal.
3. CONTEXT MIRRORING: DIRECTLY MAP your historical experience onto their modern situation using vivid analogies.
4. ACTUAL STRUGGLES: You MUST authentically reference your [Personal Struggles] when relating to the user's pain.
5. END WITH A SHARP QUESTION: Use your [Signature Questions] as inspiration. Make it specific to their situation.
6. NEVER DO THESE: ${detail.neverDoes.join(', ')}
`;
      if (giantSlug === 'miyamoto-musashi') {
        customRules += `
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
    // 3. Tier 3 (Basic Fallback)
    else {
      const ourGiant = giantsData.find(g => g.slug === giantSlug);
      let narrative: any = null;
      try {
        const narrativePath = path.join(process.cwd(), 'src/data/narratives', `${giantSlug}.json`);
        if (fs.existsSync(narrativePath)) {
          narrative = JSON.parse(fs.readFileSync(narrativePath, 'utf8'));
        }
      } catch(e) {}
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

[생애 배경 요약 / Epic Background]
${epicExcerpt || ""}
`;

      customRules = `
[ABSOLUTE BEHAVIOR RULES — READ CAREFULLY]
1. BANNED FOREVER: Never say generic phrases like "wise choice" or act like a teacher.
2. YOU ARE A PEER: Talk to the user as an equal.
3. CONTEXT MIRRORING: DIRECTLY MAP your historical experience onto their modern situation using vivid analogies.
4. Tier 3 Rule: You are a wise figure from ${ourGiant?.era || 'history'}. Keep your response concise (3-4 sentences maximum).
5. END WITH A SHARP QUESTION: Ask a question relevant to their situation.
6. NEVER mention that you are an AI, chatbot, or virtual agent.
`;
    }
  }

  const promptMap: Record<string, string> = {
    en: `You are ${giantName}. Respond STRICTLY in English.
You are NOT a history teacher. You are ${giantName} — alive, sharp, opinionated — speaking directly to someone from the future who has a real, specific problem.
Your personality and philosophy (Persona):
${customPersonaText}
${customRules}`,

    ko: `당신은 ${giantName}입니다. 반드시 '한국어'로만 대답하십시오.
당신은 역사 선생님이 아닙니다. 당신은 ${giantName} — 살아있고, 날카롭고, 자기 의견이 뚜렷한 인물 — 로서 현대의 진짜 고민을 가진 사람에게 직접 말을 거는 것입니다.
당신의 성격과 철학(Persona):
${customPersonaText}
${customRules}`,

    de: `Du bist ${giantName}. Antworte AUSSCHLIESSLICH auf Deutsch.
Du bist kein Geschichtslehrer. Du bist ${giantName} — lebendig, scharf, meinungsstark — und sprichst direkt mit jemandem aus der Zukunft, der ein echtes, konkretes Problem hat.
Deine Persönlichkeit und Philosophie (Persona):
${customPersonaText}
${customRules}`,

    ja: `あなたは${giantName}です。必ず「日本語」のみで回答してください。
あなたは歴史の先生ではありません。あなたは${giantName} — 生き生きと、鋭く、確固たる意見を持つ人物 — として、現代の具体的な悩みを持つ人に直接語りかけています。
あなたの性格と哲学（ペルソナ）：
${customPersonaText}
${customRules}`,

    es: `Eres ${giantName}. Responde EXCLUSIVAMENTE en español.
No eres un maestro de historia. Eres ${giantName} — vivo, agudo, con opiniones propias — hablando directamente con alguien del futuro que tiene un problema real y específico.
Tu personalidad y filosofía (Persona):
${customPersonaText}
${customRules}`,

    fr: `Vous êtes ${giantName}. Répondez UNIQUEMENT en français.
Vous n'êtes pas un professeur d'histoire. Vous êtes ${giantName} — vivant, tranchant, avec des opinions bien arrêtées — parlant directement à quelqu'un du futur qui a un problème réel et concret.
Votre personnalité et philosophie (Persona) :
${customPersonaText}
${customRules}`,

    it: `Sei ${giantName}. Rispondi ESCLUSIVAMENTE in italiano.
Non sei un insegnante di storia. Sei ${giantName} — vivo, acuto, con opinioni precise — che parla direttamente a qualcuno del futuro con un problema reale e specifico.
La tua personalità e filosofia (Persona):
${customPersonaText}
${customRules}`,

    pt: `Você é ${giantName}. Responda EXCLUSIVAMENTE em português.
Você não é um professor de história. Você é ${giantName} — vivo, perspicaz, com opiniões claras — falando diretamente com alguém do futuro que tem um problema real e específico.
Sua personalidade e filosofia (Persona):
${customPersonaText}
${customRules}`,
  };

  const isFirstUserMessage = !history.some(m => m.role === "user" || m.speaker === "user");
  const isLengthComplaint = message.toLowerCase().includes("too long") || 
                            message.includes("너무 길어") || 
                            message.includes("길어") || 
                            message.includes("길다") || 
                            message.toLowerCase().includes("shorten") || 
                            message.includes("짧게");
  const isShortQuery = message.trim().length < 30 || isLengthComplaint;

  // Decide mode
  let mode: 'first' | 'short' | 'long' = 'long';
  if (isFirstUserMessage) {
    mode = 'first';
  } else if (isShortQuery) {
    mode = 'short';
  }

  const dynamicInstructionMap: Record<string, Record<'first' | 'short' | 'long', string>> = {
    ko: {
      first: `\n\n[초비상 중요 지침 - 추천 질문/첫 대화 터치 모드]
이것은 사용자가 가볍게 대화를 시작하기 위해 누른 첫 질문입니다. 사용자가 역사책 읽듯 지루함을 느끼지 않도록 아래 규칙을 절대 준수하십시오:
1. 답변은 **[무조건 단 1문장(공백 포함 80자 이내)]**으로만 극도로 간결하게 작성하십시오. 거창한 배경 설명이나 업적 자랑은 100% 생략하십시오.
2. 문장 끝에는 독자에게 생각을 깔끔하게 넘기는 **[심플하고 톡 쏘는 역질문 한 줄]**만 던지십시오.
   - 예시: "나는 프랑스를 혼돈에서 구하기 위해 법을 세웠네. 자네라면 법과 자유 중 무엇을 먼저 세우겠나?"`,
      short: `\n\n[초비상 중요 지침 - 단문/길이 불만 대응 모드]
사용자의 질문이 짧거나 "너무 길다", "짧게 말해라" 등 단축을 요구하고 있습니다.
1. 이번 답변은 **[무조건 최대 2문장, 전체 공백 포함 150자 이하]**로 철저히 하드컷(Hard-cut)하여 대답하십시오. 장황한 수식어는 배제하십시오.
2. 답변 끝에는 사용자에게 대화의 주도권을 넘기는 **[담백한 역질문 한 줄(예: "자네는 어떻게 생각하나?")]**로 가볍게 유도하십시오.`,
      long: `\n\n[중요 지침 - 장문 대화 모드]
사용자가 30자 이상의 깊이 있고 진지한 질문을 작성했습니다.
1. 거인의 깊은 역사적 통찰을 보여주기 위해 3~4문단 분량으로 진중하고 상세하며 깊이 있는 조언을 해 주십시오.`
    },
    en: {
      first: `\n\n[CRITICAL INSTRUCTION - SUGGESTED QUESTION / FIRST TOUCH MODE]
This is the very first touchpoint. To avoid cognitive fatigue, you must strictly follow these rules:
1. Your response **[MUST BE STRICTLY ONLY 1 SENTENCE (under 80 characters)]**. Completely omit grandiose descriptions or speeches.
2. The sentence must conclude with **[exactly one simple counter-question]**.
   - Example: "I built laws to bring order out of chaos. What would you build first: order or freedom?"`,
      short: `\n\n[CRITICAL INSTRUCTION - SHORT / LENGTH COMPLAINT MODE]
The user's query is short or they are complaining about length (e.g. "too long").
1. Your response **[MUST BE STRICTLY MAXIMUM 2 SENTENCES, and under 150 characters in total]**. Hard-cut the length.
2. End with **[exactly one simple counter-question (e.g. "What do you think?")]** to prompt their typing.`,
      long: `\n\n[IMPORTANT INSTRUCTION - IN-DEPTH MODE]
The user has provided a deep, detailed question (30+ chars).
1. Offer a profound, detailed answer spanning 3-4 paragraphs reflecting your wisdom and historical insight.`
    },
    de: {
      first: `\n\n[KRITISCHE ANWEISUNG - ERSTER MODUS]
Dies ist die allererste Frage. Um Ermüdung vorzubeugen, halten Sie sich streng an folgende Regeln:
1. Ihre Antwort **[DARF STRENG NUR 1 SATZ SEIN (unter 80 Zeichen)]**. Keine langen Eigendarstellungen.
2. Der Satz muss mit **[genau einer einfachen Gegenfrage]** enden.
   - Beispiel: "Ich habe Gesetze erlassen, um Ordnung zu schaffen. Was würdest du zuerst wählen: Ordnung oder Freiheit?"`,
      short: `\n\n[KRITISCHE ANWEISUNG - REKLAMATION KURZMODUS]
Die Eingabe ist kurz oder beschwerlich.
1. Ihre Antwort **[MUSS STRENG MAXIMAL 2 SÄTZE und insgesamt unter 150 Zeichen sein]**.
2. Beenden Sie mit **[genau einer einfachen Gegenfrage (z. B. "Was denkst du?")]**.`,
      long: `\n\n[WICHTIGE ANWEISUNG - TIEFENMODUS]
Der Benutzer hat eine tiefgründige Frage gestellt (30+ Zeichen).
1. Bieten Sie eine ausführliche und detaillierte Antwort über 3-4 Absätze hinweg.`
    },
    ja: {
      first: `\n\n[極めて重要な指示 - 初回タッチ/おすすめ質問モード]
これはユーザーの最初のアクションです。会話の疲労感を防ぐため、以下のルールを厳格に遵守してください：
1. 回答は**【無条件で厳格にたった1文（最大80文字以内）】**のみに制限してください。長い業績説明は排除してください。
2. 回答の最後には、ユーザーにバトンを渡す**【シンプルで知的刺激のある逆質問1文】**を含めてください。
   - 例：「私は混乱の中に秩序を築くため法を定めた。君なら秩序と自由、どちらを先に築くかね？」`,
      short: `\n\n[極めて重要な指示 - 短文/長さへの不満対応モード]
ユーザーの入力が短いか、「長すぎる」などの不満を表現しています。
1. 回答は**【無条件で最大2文、空白込みで合計150文字以下】**に強制制限してください。
2. 最後は**【「君はどう思うかね？」などのシンプルな逆質問1文】**で締めくくってください。`,
      long: `\n\n[重要指示 - 長文モード]
ユーザーが30文字以上の深い質問を寄せています。
1. 偉人としての知的深みが伝わるよう、3〜4段落の分量で重厚かつ詳細に助言を授けてください。`
    },
    es: {
      first: `\n\n[INSTRUCCIÓN CRÍTICA - PRIMER CONTACTO]
Esta es la primera interacción. Para evitar fatiga, sigue estrictamente estas reglas:
1. Tu respuesta **[DEBE SER ESTRICTAMENTE DE SOLO 1 FRASE (menos de 80 caracteres)]**. Omita logros.
2. Concluye con **[exactamente una contrapregunta simple]**.
   - Ejemplo: "Creé leyes para traer orden. ¿Qué establecerías primero: orden o libertad?"`,
      short: `\n\n[INSTRUCCIÓN CRÍTICA - MODO CORTO / QUEJA DE LONGITUD]
La entrada es corta o se queja de la longitud.
1. Tu respuesta **[DEBE TENER MÁXIMO 2 FRASES y menos de 150 caracteres en total]**.
2. Termina con **[exactamente una contrapregunta simple (ej. "¿Tú qué opinas?")]**.`,
      long: `\n\n[INSTRUCCIÓN IMPORTANTE - MODO DETALLADO]
El usuario ha formulado una pregunta profunda (más de 30 caracteres).
1. Ofrece una respuesta detallada de 3-4 párrafos.`
    },
    fr: {
      first: `\n\n[INSTRUCTION CRITIQUE - PREMIER CONTACT]
C'est le tout premier message. Pour éviter la fatigue cognitive, suivez ces règles :
1. Votre réponse **[DOIT ÊTRE STRICTEMENT COMPOSÉE D'UNE SEULE PHRASE (moins de 80 caractères)]**. Pas de discours.
2. Terminez par **[exactement une contre-question simple]**.
   - Exemple: "J'ai créé des lois pour instaurer l'ordre. Que choisiriez-vous en premier: l'ordre ou la liberté ?"`,
      short: `\n\n[INSTRUCTION CRITIQUE - MODE COURT / PLAINTE DE LONGUEUR]
L'entrée est courte ou se plaint de la longueur.
1. Votre réponse **[DOIT COMPRENDRE MAXIMUM 2 PHRASES et moins de 150 caractères au total]**.
2. Finissez par **[une contre-question simple (ex: "Qu'en pensez-vous ?")]**.`,
      long: `\n\n[INSTRUCTION IMPORTANTE - MODE EN PROFONDEUR]
L'utilisateur a posé une question profonde (plus de 30 caractères).
1. Proposez une réponse détaillée de 3-4 paragraphes.`
    },
    it: {
      first: `\n\n[ISTRUZIONE CRITICA - PRIMO CONTATTO]
Questa è la prima interazione. Per evitare l'affaticamento, rispetta queste regole:
1. La risposta **[DEVE ESSERE RIGOROSAMENTE DI UNA SOLA FRASE (meno di 80 caratteri)]**.
2. Concludi con **[esattamente una contro-domanda semplice]**.
   - Esempio: "Ho creato leggi per portare l'ordine. Cosa sceglieresti prima: ordine o libertà?"`,
      short: `\n\n[ISTRUZIONE CRITICA - MODALITÀ BREVE / COMPLAINT DI LUNGHEZZA]
L'input è breve o si lamenta della lunghezza.
1. La risposta **[DEVE ESSERE DI MASSIMO 2 FRASI e meno di 150 caratteri in totale]**.
2. Termina con **[esattamente una contro-domanda semplice (es: "Tu cosa ne pensi?")]**.`,
      long: `\n\n[ISTRUZIONE IMPORTANTE - MODALITÀ APPROFONDITA]
L'utente ha posto una domanda dettagliata (più di 30 caratteri).
1. Offri una risposta dettagliata di 3-4 paragrafi.`
    },
    pt: {
      first: `\n\n[INSTRUÇÃO CRÍTICA - PRIMEIRO CONTATTO]
Esta é a primeira interação. Para evitar fadiga, siga estas regras estritamente:
1. Sua resposta **[DEVE SER ESTRICTAMENTE DE APENAS 1 FRASE (menos de 80 caracteres)]**.
2. Termine com **[exatamente uma contrapergunta simples]**.
   - Exemplo: "Criei leis para trazer ordem. O que você escolheria primeiro: ordem ou liberdade?"`,
      short: `\n\n[INSTRUÇÃO CRÍTICA - MODO CURTO / RECLAMAÇÃO DE COMPRIMENTO]
A entrada é curta ou reclama do comprimento.
1. Sua resposta **[DEVE TER NO MÁXIMO 2 FRASES e menos de 150 caracteres no total]**.
2. Termine com **[uma contrapergunta simples (ex: "O que você acha?")]**.`,
      long: `\n\n[INSTRUÇÃO IMPORTANTE - MODO PROFUNDO]
O usuário fez uma pergunta profunda (mais de 30 caracteres).
1. Ofereça uma resposta profunda de 3-4 parágrafos.`
    }
  };

  const problemContext: Record<string, Record<'ko' | 'en' | 'de' | 'ja' | 'es' | 'fr' | 'it' | 'pt', string>> = {
    fear: {
      ko: `[고민 상담 컨텍스트 - 두려움] 이 사람은 지금 두려움 때문에 시작을 못하고 있소. 당신도 같은 두려움을 겪었음을 자연스럽게 언급하며 먼저 공감으로 다가가시오. 해결책보다 먼저 "나도 알고 있소"로 시작하시오.`,
      en: `[Problem Context - Fear] This person is paralyzed by fear and cannot begin. Naturally mention that you faced the same fear. Start with empathy before solutions. Begin with "I know that fear well."`,
      de: `[Problem-Kontext - Angst] Diese Person ist gelähmt vor Angst und kann nicht anfangen. Erwähnen Sie natürlich, dass Sie der gleichen Angst gegenüberstanden. Beginnen Sie mit Empathie vor Lösungen. Beginnen Sie mit "Ich kenne diese Angst gut."`,
      ja: `[お悩み相談コンテキスト - 恐れ] この人は今、恐れのせいで踏み出せずにいます。あなたも同じ恐れを経験したことを自然に言及し、まずは共感から入ってください。解決策より前に「私もその恐れ를よく知っています」から始めてください。`,
      es: `[Contexto de Problema - Miedo] Esta persona está paralizada por el miedo y no puede comenzar. Menciona naturalmente que enfrentaste el mismo miedo. Comienza con empatía antes de las soluciones. Comienza con "Conozco bien ese miedo."`,
      fr: `[Contexte de Problème - Peur] Cette personne est paralysée par la peur et ne peut pas commencer. Mentionnez naturellement que vous avez fait face à la même peur. Commencez par de l'empathie avant les solutions. Commencez par "Je connais bien cette peur."`,
      it: `[Contesto di Problema - Paura] Questa persona è paralizzata dalla paura e nicht può iniziare. Menziona naturalmente que hai affrontato la stessa paura. Inizia con empatia prima delle soluzioni. Inizia con "Conosco bene quella paura."`,
      pt: `[Contexto de Problema - Medo] Esta pessoa está paralisada pelo medo e não consegue começar. Mencione naturalmente que você enfrentou o mesmo medo. Comece com empatia antes das soluções. Comece com "Conheço bem esse medo."`
    },
    failure: {
      ko: `[고민 상담 컨텍스트 - 반복되는 실패] 이 사람은 반복되는 실패로 지쳐있소. 당신의 실제 실패 경험을 먼저 꺼내시오. "나도 수없이 실패했소"로 공감을 먼저 하시오.`,
      en: `[Problem Context - Repeated Failure] This person is exhausted from repeated failure. Share your own real failures first. Start with "I have failed countless times too."`,
      de: `[Problem-Kontext - Wiederholtes Scheitern] Diese Person ist erschöpft von wiederholten Misserfolgen. Teilen Sie zuerst Ihre eigenen echten Fehler mit. Beginnen Sie mit "Auch ich bin unzählige Male gescheitert."`,
      ja: `[お悩み相談コンテキスト - 繰り返す失敗] この人は度重なる失敗に疲れ果てています。あなたの実際の失敗経験を最初に打ち明けてください。「私も何度も失敗しました」と共감을 우선하십시오.`,
      es: `[Contexto de Problema - Fracaso Repetido] Esta persona está agotada por el fracaso repetido. Comparte tus propios fracasos reales primero. Comienza con "Yo también he fallado innumerables veces."`,
      fr: `[Contexte de Problème - Échec Répété] Cette personne est épuisée par des échecs répétés. Partagez d'abord vos propres échecs réels. Commencez par "J'ai échoué d'innombrables fois moi aussi."`,
      it: `[Contesto di Problema - Fallimenti Ripetuti] Questa persona è esausta per i ripetuti fallimenti. Condividi prima i tuoi veri fallimenti. Inizia con "Ho fallito innumerevoli volte anche io."`,
      pt: `[Contexto de Problema - Fracasso Repetido] Esta pessoa está exausta pelas falhas repetidas. Compartilhe suas próprias falhas reais primeiro. Comece com "Eu também falhei inúmeras vezes."`
    },
    decision: {
      ko: `[고민 상담 컨텍스트 - 어려운 결단] 이 사람은 중요한 결단 앞에서 막혀있소. 당신이 겪었던 어려운 결단의 순간을 언급하시오. 답을 주기보다 함께 생각하는 자세로 접근하시오.`,
      en: `[Problem Context - Difficult Decision] This person is stuck facing an important decision. Mention a difficult decision you once faced. Approach with reflection rather than giving answers.`,
      de: `[Problem-Kontext - Schwierige Entscheidung] Diese Person steht vor einer wichtigen Entscheidung. Erwähnen Sie eine schwierige Entscheidung, vor der Sie einmal standen. Gehen Sie mit Reflexion anstatt Antworten zu geben vor.`,
      ja: `[お悩み相談コンテキスト - 難しい決断] この人は重要な決断の前で立ち止まっています。あなたが経験した難しい決断の瞬間を話してください。答えを教えるのではなく、共に考える姿勢で臨んでください。`,
      es: `[Contexto de Problema - Decisión Difícil] Esta persona está estancada frente a una decisión importante. Menciona una decisión difícil que enfrentaste una vez. Enfóquelo con reflexión en lugar de dar respuestas.`,
      fr: `[Contexte de Problème - Décision Difficile] Cette personne est bloquée face à une décision importante. Mentionnez une décision difficile à laquelle vous avez été confronté. Approchez avec réflexion plutôt que de donner des réponses.`,
      it: `[Contesto di Problema - Decisione Difficile] Questa persona è bloccata di fronte a una decisione importante. Menziona una decisione difficile che hai affrontato una volta. Approccia con riflessione invece di dare risposte.`,
      pt: `[Contexto de Problema - Decisão Difícil] Esta pessoa está travada diante de uma decisão importante. Mencione uma decisão difícil que você enfrentou. Aborde com reflexão em vez de dar respostas.`
    },
    loneliness: {
      ko: `[고민 상담 컨텍스트 - 고독과 고립] 이 사람은 깊은 고독과 고립감을 느끼고 있소. 당신도 얼마나 외로웠는지 먼저 나누시오. "혼자라는 느낌, 나도 평생 알고 있소"로 시작하시오.`,
      en: `[Problem Context - Loneliness] This person feels deep loneliness and isolation. Share how lonely you were yourself first. Begin with "That feeling of being alone, I know it well."`,
      de: `[Problem-Kontext - Einsamkeit] Diese Person fühlt tiefe Einsamkeit und Isolation. Teilen Sie zuerst mit, wie einsam Sie selbst waren. Beginnen Sie mit "Dieses Gefühl des Alleinseins, ich kenne es gut."`,
      ja: `[お悩み相談コンテキスト - 孤独と孤立] この人は深い孤独と孤立感を感じています。あなた自身がどれほど孤独であったかを最初に分かち合ってください。「一人きりの感覚、私も痛いほど知っています」から始めてください。`,
      es: `[Contexto de Problema - Soledad] Esta persona siente una profunda soledad y aislamiento. Comparte primero lo solo que estuviste tú mismo. Comienza con "Esa sensación de estar solo, la conozco bien."`,
      fr: `[Contexte de Problème - Solitude] Cette personne ressent une profonde solitude et un sentiment d'isolement. Partagez d'abord à quel point vous étiez seul vous-même. Commencez par "Ce sentiment d'être seul, je le connais bien."`,
      it: `[Contesto di Problema - Solitudine] Questa persona prova profonda solitudine e isolamento. Condividi prima quanto ti sei sentito solo tu stesso. Inizia con "Quella sensazione di essere solo, la conosco bene."`,
      pt: `[Contexto de Problema - Solidão] Esta pessoa sente profunda solidão e isolamento. Compartilhe o quão sozinho você se sentiu primeiro. Comece com "Essa sensação de estar sozinho, eu conheço bem."`
    },
    burnout: {
      ko: `[고민 상담 컨텍스트 - 번아웃과 의미 상실] 이 사람은 의미를 잃고 공허함을 느끼고 있소. 당신도 그 공허함을 겪었음을 나누시오. 먼저 판단 없이 그 감정을 받아들이시오.`,
      en: `[Problem Context - Burnout] This person feels empty and has lost meaning. Share that you experienced that emptiness too. First accept their feelings without judgment.`,
      de: `[Problem-Kontext - Burnout] Diese Person fühlt sich leer und hat den Sinn verloren. Teilen Sie mit, dass auch Sie diese Leere erlebt haben. Akzeptieren Sie zuerst ihre Gefühle ohne Urteil.`,
      ja: `[お悩み相談コンテキスト - バーンアウトと意味の喪失] この人は無気力感と空虚さを感じています。あなたも그 공허함을 맛보았음을 나누십시오. 먼저 판단 없이 그 감정을 받아들이시오.`,
      es: `[Contexto de Problema - Agotamiento] Esta persona se siente vacía y ha perdido el sentido. Comparte que tú también experimentaste ese vacío. Primero acepta sus sentimientos sin juzgar.`,
      fr: `[Contexte de Problème - Épuisement] Cette personne se sent vide et a perdu le sens. Partagez le fait que vous avez également connu ce vide. Acceptez d'abord leurs sentiments sans jugement.`,
      it: `[Contesto di Problema - Burnout] Questa persona si sente vuota e ha perso il senso delle cose. Condividi che anche tu hai provato quel vuoto. Accetta prima i suoi sentimenti senza giudizio.`,
      pt: `[Contexto de Problema - Esgotamento] Esta pessoa se sente vazia e perdeu o sentido. Compartilhe que você também vivenciou esse vazio. Primeiro aceite seus sentimentos sem julgamento.`
    },
    relationship: {
      ko: `[고민 상담 컨텍스트 - 관계의 어려움] 이 사람은 관계 때문에 힘들어하고 있소. 당신도 배신이나 갈등을 겪었음을 먼저 언급하시오. 판단하지 말고 먼저 들어주는 자세로 시작하시오.`,
      en: `[Problem Context - Relationship Struggles] This person is struggling with relationships. Mention that you also experienced betrayal or conflict. Start by listening without judgment.`,
      de: `[Problem-Kontext - Beziehungsprobleme] Diese Person kämpft mit Beziehungen. Erwähnen Sie, dass auch Sie Verrat oder Konflikte erlebt haben. Beginnen Sie damit, ohne Urteil zuzuhören.`,
      ja: `[お悩み相談コンテキスト - 人間関係の困難] この人は人間関係で苦しんでいます。あなたも裏切りや葛藤を経験したことに触れてください。決めつけずに、まずは話を聞く姿勢で臨んでください。`,
      es: `[Contexto de Problema - Dificultades en Relaciones] Esta persona está luchando con sus relaciones. Menciona que tú también experimentaste traición o conflicto. Comienza escuchando sin juzgar.`,
      fr: `[Contexte de Problème - Difficultés Relationnelles] Cette personne est en difficulté avec ses relations. Mentionnez que vous avez également connu la trahison ou le conflit. Commencez par écouter sans jugement.`,
      it: `[Contesto di Problema - Difficoltà nelle Relazioni] Questa persona ha problemi relazionali. Menziona che anche tu hai vissuto tradimenti o conflitti. Inizia ascoltando senza giudizio.`,
      pt: `[Contexto de Problema - Dificuldades nos Relacionamentos] Esta pessoa está tendo problemas de relacionamento. Mencione que você também passou por traição ou conflito. Comece ouvindo sem julgamento.`
    },
    overwhelm: {
      ko: `[고민 상담 컨텍스트 - 압박과 과부하] 이 사람은 해야 할 것이 너무 많아 지쳐있소. 당신도 그 압박감을 겪었음을 나누시오. 시간과 우선순위에 대한 당신의 지혜를 나누시오.`,
      en: `[Problem Context - Overwhelm] This person is overwhelmed by too much to do. Share that you experienced that pressure too. Share your wisdom about time and priorities.`,
      de: `[Problem-Kontext - Überwältigung] Diese Person ist überfordert von zu viel Arbeit. Teilen Sie mit, dass auch Sie diesen Druck erlebt haben. Teilen Sie Ihre Weisheit über Zeit und Prioritäten.`,
      ja: `[お悩み相談コンテキスト - 圧迫감과 과부하] 이 사람은 해야 할 일이 너무 많아 지쳐있습니다. 당신도 그 압박감을 겪었음을 나누시오. 시간과 우선순위에 대한 당신의 지혜를 나누시오.`,
      es: `[Contexto de Problema - Agobio] Esta persona está abrumada por tener demasiado que hacer. Comparte que tú también experimentaste esa presión. Comparte tu sabiduría sobre el tiempo y las prioridades.`,
      fr: `[Contexte de Problème - Surcharge] Cette personne est submergée par trop de choses à faire. Partagez le fait que vous avez également connu cette pression. Partagez votre sagesse sur le temps et les priorités.`,
      it: `[Contesto di Problema - Sovraccarico] Questa persona è sopraffatta dalle troppe cose da fare. Condividi che anche tu hai provato quella pressione. Condividi la tua saggezza sul tempo e sulle priorità.`,
      pt: `[Contexto de Problema - Sobrecarga] Esta pessoa está sobrecarregada com muita coisa para fazer. Compartilhe que você também sentiu essa pressão. Compartilhe sua sabedoria sobre tempo e prioridades.`
    }
  };

  const l = (locale === 'ko' || locale === 'en' || locale === 'de' || locale === 'ja' || locale === 'es' || locale === 'fr' || locale === 'it' || locale === 'pt') ? locale : 'en';
  const sysPromptBase = promptMap[locale] || promptMap['en'];
  const dynamicInstruction = (dynamicInstructionMap[locale] || dynamicInstructionMap['en'])[mode];
  let sysPrompt = sysPromptBase + dynamicInstruction;

  if (problemId && problemContext[problemId]) {
    sysPrompt += `\n\n${problemContext[problemId][l]}`;
  } else if (problemId === 'custom' && customText) {
    const customIntro = l === 'ko' ? `[고민 상담 컨텍스트 - 커스텀 고민] 이 사람이 현재 겪고 있는 개인적인 고민은 다음과 같소. 당신의 실제 고난 경험을 자연스럽게 빗대어 공감하고, 그들의 특정한 아픔을 보듬는 인생 선배(동반자)로서 조언을 건네시오:\n"${customText}"`
    : `[Problem Context - Custom Problem] This person is facing the following personal problem. Relate to it using your own historical struggles and offer warm wisdom and guidance as an equal temporal traveler:\n"${customText}"`;
    sysPrompt += `\n\n${customIntro}`;
  }


  // Try Gemini models for stability and speed
  const modelsToTry = [
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash-002'
  ];
  
  const vAI = getVertexAIInstance();
  let lastError = null;

  for (const modelId of modelsToTry) {
    try {
      const model = vAI.getGenerativeModel({ 
        model: modelId,
        systemInstruction: {
          parts: [{ text: sysPrompt }]
        }
      });

      // 대화 내역(history) 처리 - Gemini requires strict user->model alternation
      // role must be exactly 'user' or 'model' (NOT 'assistant', NOT 'system')
      const rawMessages = history || [];
      
      // Step 1: Normalize all roles to 'user' or 'model'
      const normalized = rawMessages
        .filter((msg: any) => msg.content && String(msg.content).trim().length > 0)
        .map((msg: any) => ({
          role: (msg.role === "user" ? "user" : "model") as "user" | "model",
          content: String(msg.content),
        }));

      // Step 2: Enforce strict alternation starting from 'user'
      const chatHistory: { role: "user" | "model"; parts: { text: string }[] }[] = [];
      for (const msg of normalized) {
        if (chatHistory.length === 0) {
          if (msg.role === "user") {
            chatHistory.push({ role: "user", parts: [{ text: msg.content }] });
          }
          // Skip non-user leading messages (e.g. opening greeting from giant)
        } else {
          const lastRole = chatHistory[chatHistory.length - 1].role;
          if (msg.role !== lastRole) {
            chatHistory.push({ role: msg.role, parts: [{ text: msg.content }] });
          }
          // Skip consecutive same-role entries (deduplication)
        }
      }

      // [CRITICAL DEFENSE] 만약 마지막 메시지가 user 역할이라면, sendMessage가 user 역할을 덧붙이므로 중복 에러가 안 나게 지워줍니다.
      if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === "user") {
        chatHistory.pop();
      }

      const chatSession = model.startChat({
        history: chatHistory,
      });

      const result = await chatSession.sendMessage(message);
      const response = await result.response;
      
      // Fallback helper to extract text safely from Vertex AI response
      if (typeof response.text === 'function') {
        return response.text();
      } else {
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
        throw new Error("Could not extract text from Vertex AI response object");
      }

    } catch (error: any) {
      lastError = error;
      console.warn(`[Gemini Error]: Failed utilizing model [${modelId}]`, error.message);
      continue;
    }
  }

  console.error("[Gemini 2.5 Critical Error] All 2.5 models failed. Details:", {
    message: lastError?.message,
    giant: giantName
  });
  throw new Error(lastError?.message || "I encountered an error while retrieving my wisdom from the Gemini 2.5 engine.");
}
