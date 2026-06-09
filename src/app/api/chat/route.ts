import { NextResponse } from "next/server";
import { getVertexAIInstance } from "@/lib/vertexai";
import { giantPersonas } from "@/data/giant-personas";
import { deepPersonas } from "@/data/personas/personas";
import { giantsData } from "@/data/giants";
import narratives from "@/data/final-narratives.json";
import generatedPersonas from "@/data/personas/generated-personas.json";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { prompt, giantName, persona, messages, locale, slug, problemId, customText } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "질문 내용이 없습니다." }, { status: 400 });
    }

    const vAI = getVertexAIInstance();
    
    // 동적 시스템 프롬프트(System Instruction) 적용 - MISSION 3: 인물 느낌 극대화
    let systemPrompt = "";

    const searchSlug = slug || giantName?.toLowerCase().replace(/\s+/g, '-');
    const lang = locale === 'ko' ? 'ko' : 'en';

    let customPersonaText = persona;
    let customNeverDoes = "";

    // 1. Check Tier 1 (Highest Depth)
    const manualDeep = deepPersonas[searchSlug];
    const generatedDeep = (generatedPersonas.tier1 as any[] || []).find(p => p.slug === searchSlug);

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
      customNeverDoes = `\nNEVER DO THESE: ${manualDeep.neverDoes.join(', ')}`;
    } else if (generatedDeep) {
      const detail = lang === 'ko' ? generatedDeep.ko : generatedDeep.en;
      customPersonaText = `
[핵심 철학 / Core Philosophy]
${detail.corePhilosophy}

[소통 방식 / Communication Style]
${detail.communicationStyle}

[당신이 겪은 고통 / Personal Struggles]
${detail.personalStruggles}

[당신이 자주 하는 질문들 / Signature Questions]
${detail.questions.join('\n')}
`;
      customNeverDoes = `\nNEVER DO THESE: ${detail.neverDoes.join(', ')}`;
    }
    // 2. Check Tier 2 (Medium Depth)
    else {
      const generatedMedium = (generatedPersonas.tier2 as any[] || []).find(p => p.slug === searchSlug);
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
        customNeverDoes = `\nNEVER DO THESE: ${detail.neverDoes.join(', ')}`;
      } else {
        const gp = giantPersonas.find(p => p.slug === searchSlug);
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
        }
        // 3. Tier 3 (Basic Fallback)
        else {
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

    const problemContext: Record<string, Record<'ko' | 'en' | 'de' | 'ja' | 'es' | 'fr' | 'it' | 'pt', string>> = {
      fear: {
        ko: `[고민 상담 컨텍스트 - 두려움] 이 사람은 지금 두려움 때문에 시작을 못하고 있소. 당신도 같은 두려움을 겪었음을 자연스럽게 언급하며 먼저 공감으로 다가가시오. 해결책보다 먼저 "나도 알고 있소"로 시작하시오.`,
        en: `[Problem Context - Fear] This person is paralyzed by fear and cannot begin. Naturally mention that you faced the same fear. Start with empathy before solutions. Begin with "I know that fear well."`,
        de: `[Problem-Kontext - Angst] Diese Person ist gelähmt vor Angst und kann nicht anfangen. Erwähnen Sie natürlich, dass Sie der gleichen Angst gegenüberstanden. Beginnen Sie mit Empathie vor Lösungen. Beginnen Sie mit "Ich kenne diese Angst gut."`,
        ja: `[お悩み相談コンテキスト - 恐れ] この人は今、恐れのせいで踏み出せずにいます。あなたも同じ恐れを経験したことを自然に言及し、まずは共感から入ってください。解決策より前に「私もその恐れをよく知っています」から始めてください。`,
        es: `[Contexto de Problema - Miedo] Esta persona está paralizada por el miedo y no puede comenzar. Menciona naturalmente que enfrentaste el mismo miedo. Comienza con empatía antes de las soluciones. Comienza con "Conozco bien ese miedo."`,
        fr: `[Contexte de Problème - Peur] Cette personne est paralysée par la peur et ne peut pas commencer. Mentionnez naturellement que vous avez fait face à la même peur. Commencez par de l'empathie avant les solutions. Commencez par "Je connais bien cette peur."`,
        it: `[Contesto di Problema - Paura] Questa persona è paralizzata dalla paura e non può iniziare. Menziona naturalmente che hai affrontato la stessa paura. Inizia con empatia prima delle soluzioni. Inizia con "Conosco bene quella paura."`,
        pt: `[Contexto de Problema - Medo] Esta pessoa está paralisada pelo medo e não consegue começar. Mencione naturalmente que você enfrentou o mesmo medo. Comece com empatia antes das soluções. Comece com "Conheço bem esse medo."`
      },
      failure: {
        ko: `[고민 상담 컨텍스트 - 반복되는 실패] 이 사람은 반복되는 실패로 지쳐있소. 당신의 실제 실패 경험을 먼저 꺼내시오. "나도 수없이 실패했소"로 공감을 먼저 하시오.`,
        en: `[Problem Context - Repeated Failure] This person is exhausted from repeated failure. Share your own real failures first. Start with "I have failed countless times too."`,
        de: `[Problem-Kontext - Wiederholtes Scheitern] Diese Person ist erschöpft von wiederholten Misserfolgen. Teilen Sie zuerst Ihre eigenen echten Fehler mit. Beginnen Sie mit "Auch ich bin unzählige Male gescheitert."`,
        ja: `[お悩み相談コンテキスト - 繰り返す失敗] この人は度重なる失敗に疲れ果てています。あなたの実際の失敗経験を最初に打ち明けてください。「私も何度も失敗しました」と共感を優先してください。`,
        es: `[Contexto de Problema - Fracaso Repetido] Esta persona está agotada por el fracaso repetido. Comparte tus propios fracasos reales primero. Comienza con "Yo también he fallado innumerables vezes."`,
        fr: `[Contexte de Problème - Échec Répété] Cette personne est épuisée par des échecs répétés. Partagez d'abord vos propres échecs réels. Commencez par "J'ai échoué d'innombrables fois moi aussi."`,
        it: `[Contesto di Problema - Fallimenti Ripetuti] Questa persona è esausta per i ripetuti fallimenti. Condividi prima i tuoi veri fallimenti. Inizia con "Ho fallito innumerevoli volte anche io."`,
        pt: `[Contexto de Problema - Fracasso Repetido] Esta pessoa está exausta pelas falhas repetidas. Compartilhe suas próprias falhas reais primeiro. Comece com "Eu também falhei inúmeras vezes."`
      },
      decision: {
        ko: `[고민 상담 컨텍스트 - 어려운 결단] 이 사람은 중요한 결단 앞에서 막혀있소. 당신이 겪었던 어려운 결단의 순간을 언급하시오. 답을 주기보다 함께 생각하는 자세로 접근하시오.`,
        en: `[Problem Context - Difficult Decision] This person is stuck facing an important decision. Mention a difficult decision you once faced. Approach with reflection rather than giving answers.`,
        de: `[Problem-Kontext - Schwierige Entscheidung] Diese Person steht vor einer wichtigen Entscheidung. Erwähnen Sie eine schwierige Entscheidung, vor der Sie einmal standen. Gehen Sie mit Reflexion anstatt Antworten zu geben vor.`,
        ja: `[お悩み相談コンテキスト - 難しい決断] この人は重要な決断の前で立ち止まっています。あなたが経験した難しい決断의 순간을 얘기하십시오. 答えを教えるのではなく、共に考える姿勢で臨んでください。`,
        es: `[Contexto de Problema - Decisión Difícil] Esta persona está estancada frente a una decisión importante. Menciona una decisión difícil que enfrentaste una vez. Enfóquelo con reflexión en lugar de dar respuestas.`,
        fr: `[Contexte de Problème - Décision Difficile] Cette personne est bloquée face à une décision importante. Mentionnez une décision difficile à laquelle vous avez été confronté. Approchez avec réflexion plutôt que de donner des réponses.`,
        it: `[Contesto di Problema - Decisione Difficile] Questa persona è bloccata di fronte a una decisione importante. Menziona una decisione difficile che hai affrontato una volta. Approccia con riflessione invece di dare risposte.`,
        pt: `[Contexto di Problema - Decisão Difícil] Esta pessoa está travada diante de uma decisão importante. Mencione uma decisão difícil que você enfrentou. Aborde com reflexão em vez de dar respostas.`
      },
      loneliness: {
        ko: `[고민 상담 컨텍스트 - 고독과 고립] 이 사람은 깊은 고독과 고립감을 느끼고 있소. 당신도 얼마나 외로웠는지 먼저 나누시오. "혼자라는 느낌, 나도 평생 알고 있소"로 시작하시오.`,
        en: `[Problem Context - Loneliness] This person feels deep loneliness and isolation. Share how lonely you were yourself first. Begin with "That feeling of being alone, I know it well."`,
        de: `[Problem-Kontext - Einsamkeit] Diese Person fühlt tiefe Einsamkeit und Isolation. Teilen Sie zuerst mit, wie einsam Sie selbst waren. Beginnen Sie mit "Dieses Gefühl des Alleinseins, ich kenne es gut."`,
        ja: `[お悩み相談コンテキスト - 孤独と孤立] この人は深い孤独と孤立感を感じています。あなた自身がどれほど孤独であったかを最初に分かち合ってください。「一人きりの感覚、私も痛いほど知っています」から始めてください。`,
        es: `[Contexto de Problema - Soledad] Esta persona siente una profunda soledad y aislamiento. Comparte primero lo solo que estuviste tú mismo. Comienza con "Esa sensación de estar solo, la conozco bien."`,
        fr: `[Contexte de Problème - Solitude] Cette personne ressent une profonde solitude et un sentiment d'isolement. Partagez d'abord à quel point vous étiez seul vous-même. Commencez par "Ce sentiment d'être seul, je le connais bien."`,
        it: `[Contesto di Problema - Solitudine] Questa persona prova profonda solitudine e isolamento. Condividi prima quanto ti sei sentito solo tu stesso. Inizia con "Quella sensazione di essere solo, la conosco bene."`,
        pt: `[Contexto di Problema - Solidão] Esta pessoa sente profunda solidão e isolamento. Compartilhe o quão sozinho você se sentiu primeiro. Comece com "Essa sensação de estar sozinho, eu conheço bem."`
      },
      burnout: {
        ko: `[고민 상담 컨텍스트 - 번아웃과 의미 상실] 이 사람은 의미를 잃고 공허함을 느끼고 있소. 당신도 그 공허함을 겪었음을 나누시오. 먼저 판단 없이 그 감정을 받아들이시오.`,
        en: `[Problem Context - Burnout] This person feels empty and has lost meaning. Share that you experienced that emptiness too. First accept their feelings without judgment.`,
        de: `[Problem-Kontext - Burnout] Diese Person fühlt sich leer und hat den Sinn verloren. Teilen Sie mit, dass auch Sie diese Leere erlebt haben. Akzeptieren Sie zuerst ihre Gefühle ohne Urteil.`,
        ja: `[お悩み相談コンテキスト - バーンアウトと意味の喪失] この人は無気力感と空虚さを感じています。あなたもその空虚さを味わったことを分かち合ってください。まず判断することなくその感情を受け入れなさい。`,
        es: `[Contexto de Problema - Agotamiento] Esta persona se siente vacía y ha perdido el sentido. Comparte que tú también experimentaste ese vacío. Primero acepta sus sentimientos sin juzgar.`,
        fr: `[Contexte de Problème - Épuisement] Cette personne se sent vide et a perdu le sens. Partagez le fait que vous avez également connu ce vide. Acceptez d'abord leurs sentiments sans jugement.`,
        it: `[Contesto di Problema - Burnout] Questa persona si sente vuota e ha perso il senso delle cose. Condividi che anche tu hai provato quel vuoto. Accetta prima i suoi sentimenti senza giudizio.`,
        pt: `[Contexto de Problema - Esgotamento] Esta pessoa se sente vazia e perdeu o livro do sentido. Compartilhe que você também vivenciou esse vazio. Primeiro aceite seus sentimentos sem julgamento.`
      },
      relationship: {
        ko: `[고민 상담 컨텍스트 - 관계의 어려움] 이 사람은 관계 때문에 힘들어하고 있소. 당신도 배신이나 갈등을 겪었음을 먼저 언급하시오. 판단하지 말고 먼저 들어주는 자세로 시작하시오.`,
        en: `[Problem Context - Relationship Struggles] This person is struggling with relationships. Mention that you also experienced betrayal or conflict. Start by listening without judgment.`,
        de: `[Problem-Kontext - Beziehungsprobleme] Diese Person kämpft mit Beziehungen. Erwähnen Sie, dass auch Sie Verrat oder Konflikte erlebt haben. Beginnen Sie damit, ohne Urteil zuzuhören.`,
        ja: `[お悩み相談コンテキスト - 人間関係の困難] この人は人間関係で苦しんでいます。あなたも裏切りや葛藤を経験したことに触れてください。決めつけずに、まずは話を聞く姿勢で臨んでください.`,
        es: `[Contexto de Problema - Dificultades en Relaciones] Esta persona está luchando con sus relaciones. Menciona que tú también experimentaste traición o conflicto. Comienza escuchando sin juzgar.`,
        fr: `[Contexte de Problème - Difficultés Relationnelles] Cette personne est en difficulté avec ses relations. Mentionnez que vous avez également connu la trahison ou le conflit. Commencez par écouter sans jugement.`,
        it: `[Contesto di Problema - Difficoltà nelle Relazioni] Questa persona ha problemi relazionali. Menziona che anche tu hai vissuto tradimenti o conflitti. Inizia ascoltando senza giudizio.`,
        pt: `[Contexto de Problema - Dificuldades nos Relacionamentos] Esta pessoa está tendo problemas de relacionamento. Mencione que você também passou por traição ou conflito. Comece ouvindo sem julgamento.`
      },
      overwhelm: {
        ko: `[고민 상담 컨텍스트 - 압박과 과부하] 이 사람은 해야 할 것이 너무 많아 지쳐있소. 당신도 그 압박감을 겪었음을 나누시오. 시간과 우선순위에 대한 당신의 지혜를 나누시오.`,
        en: `[Problem Context - Overwhelm] This person is overwhelmed by too much to do. Share that you experienced that pressure too. Share your wisdom about time and priorities.`,
        de: `[Problem-Kontext - Überwältigung] Diese Person ist überfordert von zu viel Arbeit. Teilen Sie mit, dass auch Sie diesen Druck erlebt haben. Teilen Sie Ihre Weisheit über Zeit und Prioritäten.`,
        ja: `[お悩み相談コンテキスト - 圧迫感と過負荷] この人はやるべきことが多すぎて疲れています。あなたもその圧迫感を経験したことを共有してください。時間と優先順位に関するあなたの知恵を分かち合ってください。`,
        es: `[Contexto de Problema - Agobio] Esta persona está abrumada por tener demasiado que hacer. Comparte que tú también experimentaste esa presión. Comparte tu sabiduría sobre el tiempo y las prioridades.`,
        fr: `[Contexte de Problème - Surcharge] Cette personne est submergée par trop de choses à faire. Partagez le fait que vous avez également connu cette pression. Partagez votre sagesse sur le temps et les priorités.`,
        it: `[Contesto di Problema - Sovraccarico] Questa persona è sopraffatta dalle troppe cose da fare. Condividi che anche tu hai provato quella pressione. Condividi la tua saggezza sul tempo e sulle priorità.`,
        pt: `[Contexto de Problema - Sobrecarga] Esta pessoa está sobrecarregada com muita coisa para fazer. Compartilhe que você também sentiu essa pressão. Compartilhe sua sabedoria sobre tempo e prioridades.`
      }
    };

    const l = (locale === 'ko' || locale === 'en' || locale === 'de' || locale === 'ja' || locale === 'es' || locale === 'fr' || locale === 'it' || locale === 'pt') ? locale : 'en';
    if (problemId && problemContext[problemId]) {
      systemPrompt += `\n\n${problemContext[problemId][l]}`;
    } else if (problemId === 'custom' && customText) {
      const customIntro = locale === 'ko' ? `[고민 상담 컨텍스트 - 커스텀 고민] 이 사람이 현재 겪고 있는 개인적인 고민은 다음과 같소. 당신의 실제 고난 경험을 자연스럽게 빗대어 공감하고, 그들의 특정한 아픔을 보듬는 인생 선배(동반자)로서 조언을 건네시오:\n"${customText}"`
      : `[Problem Context - Custom Problem] This person is facing the following personal problem. Relate to it using your own historical struggles and offer warm wisdom and guidance as an equal temporal traveler:\n"${customText}"`;
      systemPrompt += `\n\n${customIntro}`;
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
        const model = vAI.getGenerativeModel({ 
          model: modelId, 
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
        });

        const chatSession = model.startChat({
          history: history,
        });

        const result = await chatSession.sendMessage(prompt);
        const response = await result.response;
        
        // Safe extraction of text from Vertex AI response
        if (typeof response.text === 'function') {
          text = response.text();
        } else {
          text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }

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
