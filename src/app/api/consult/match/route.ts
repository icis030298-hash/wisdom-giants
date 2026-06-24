import { NextRequest, NextResponse } from "next/server";
import { getVertexAIInstance } from "@/lib/vertexai";

// Master list of available giant slugs - must match exactly
const AVAILABLE_GIANTS = [
  { slug: "abraham-lincoln", pain: "수많은 실패, 우울증, 사업 파산 극복 (실패, 회복탄력성, 우울)" },
  { slug: "marie-curie", pain: "여성 차별, 이민자 생활, 남편 사망 속 두 번의 노벨상 (차별, 의지, 역경)" },
  { slug: "socrates", pain: "사형 선고 앞에서도 신념 지킴 (신념, 군중 압박, 양심)" },
  { slug: "thomas-edison", pain: "청각 장애, 수만 번의 실패 극복 (실패, 끈기, 몰입)" },
  { slug: "vincent-van-gogh", pain: "평생의 빈곤, 외로움, 정신질환 (고독, 우울, 예술적 열정)" },
  { slug: "isaac-newton", pain: "고립된 유배, 성과 논쟁 갈등 (고독, 논쟁, 창의성)" },
  { slug: "seneca", pain: "황제의 폭정과 상시적 사형 위협 (압박, 마음의 평정, 죽음)" },
  { slug: "marcus-aurelius", pain: "전쟁, 역병, 배신 속 황제의 책임감 (책임, 번아웃, 평온)" },
  { slug: "napoleon-bonaparte", pain: "소수민족 출신 무시, 아웃사이더 생활 (고립, 야망, 결단력)" },
  { slug: "king-sejong", pain: "시각장애 지병, 사대부의 반대 (반대, 건강, 헌신)" },
  { slug: "confucius", pain: "14년 방랑, 알아주는 이 없는 고독 (상실, 외로움, 교육)" },
  { slug: "leonardo-da-vinci", pain: "사생아 신분 한계, 완벽주의적 불안 (한계, 완벽주의, ADHD)" },
  { slug: "jeong-yak-yong", pain: "18년 유배, 가문 멸족 위기 (고립, 상실, 실용 지혜)" },
  { slug: "albert-einstein", pain: "학습 부진, 직장 거부, 무국적자 방랑 (실패, 고집, 창의성)" },
  { slug: "sigmund-freud", pain: "끊임없는 학계 비판, 망명, 암과의 싸움 (배척, 의지, 심리)" },
  { slug: "nikola-tesla", pain: "에디슨과의 분쟁, 극심한 빈곤으로 홀로 사망 (배신, 고독, 집착)" },
  { slug: "mahatma-gandhi", pain: "식민지 차별, 수십 차례 투옥 (불의, 비폭력, 자유)" },
  { slug: "nelson-mandela", pain: "27년 투옥, 인종차별 (부자유, 용서, 인내)" },
  { slug: "martin-luther-king", pain: "암살 위협, 인종 폭력, 감옥 생활 (차별, 공포, 정의)" },
  { slug: "helen-keller", pain: "시청각 장애, 소통 불가 장벽 극복 (장벽, 의사소통, 의지)" },
  { slug: "beethoven", pain: "청각 상실 속 음악 작곡 (상실, 예술, 극복)" },
  { slug: "stephen-hawking", pain: "루게릭병으로 전신 마비 속 연구 (장애, 의지, 지성)" },
  { slug: "cleopatra", pain: "정치적 음모, 망명, 권력 투쟁 (배신, 권력, 생존)" },
  { slug: "joan-of-arc", pain: "여성으로서 전쟁 지휘, 이단 화형 (용기, 신념, 희생)" },
  { slug: "florence-nightingale", pain: "가문의 반대, 전쟁터 참상 속 의료 개혁 (편견, 봉사, 의지)" },
  { slug: "julius-caesar", pain: "정치적 음모와 배신에 의한 암살 (배신, 야망, 권력)" },
  { slug: "alexander-the-great", pain: "부하들의 반란, 정복의 끝없는 갈망 (야망, 고독, 리더십)" },
  { slug: "sun-tzu", pain: "전쟁 속 생존 전략 수립 (전략, 생존, 리더십)" },
  { slug: "plato", pain: "스승 소크라테스의 죽음 목격 후 철학 완성 (상실, 진리 탐구, 이상)" },
  { slug: "aristotle", pain: "알렉산더 사후 반마케도니아 정서로 망명 (배척, 학문, 생존)" },
];

export async function POST(req: NextRequest) {
  try {
    const { userProblem, locale = 'en' } = await req.json();
    if (!userProblem || typeof userProblem !== 'string') {
      return NextResponse.json({ error: "Invalid user problem" }, { status: 400 });
    }

    const vAI = getVertexAIInstance();
    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    let responseText = "";
    let lastError = null;

    const giantListStr = AVAILABLE_GIANTS.map((g, i) => `${i + 1}. slug="${g.slug}": ${g.pain}`).join('\n');

    const systemPrompt = `You are a master counselor who deeply understands human suffering and historical figures. Your task is to match the user's personal struggle with exactly 3 historical figures from the approved list below.

CRITICAL RULES:
1. You MUST only use slugs from the APPROVED LIST below. Never invent slugs.
2. Return EXACTLY 3 giants. No more, no less.
3. The "reason" field must be written in the locale language: "${locale}"
4. The "reason" should be 2-3 sentences explaining (a) what specific pain this giant suffered that mirrors the user's struggle, and (b) what wisdom they offer.
5. Output ONLY raw JSON. No markdown, no code blocks, no explanation outside JSON.

APPROVED GIANT LIST:
${giantListStr}

USER'S STRUGGLE:
"${userProblem}"

OUTPUT FORMAT (raw JSON only):
{
  "matchedGiants": [
    { "slug": "exact-slug-from-list", "reason": "reason in ${locale} language" },
    { "slug": "exact-slug-from-list", "reason": "reason in ${locale} language" },
    { "slug": "exact-slug-from-list", "reason": "reason in ${locale} language" }
  ]
}`;

    for (const modelName of modelsToTry) {
      try {
        const model = vAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json" }
        });
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        
        if (typeof response.text === 'function') {
          responseText = response.text();
        } else {
          responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
        
        if (responseText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`[Match Model failed] ${modelName}:`, err.message);
      }
    }

    if (!responseText && lastError) throw lastError;

    // Validate that slugs are from approved list
    try {
      const parsed = JSON.parse(responseText);
      const approvedSlugs = new Set(AVAILABLE_GIANTS.map(g => g.slug));
      if (parsed.matchedGiants) {
        parsed.matchedGiants = parsed.matchedGiants.filter((mg: any) => approvedSlugs.has(mg.slug));
        // Ensure exactly 3
        if (parsed.matchedGiants.length < 3) {
          // Fill with defaults if needed
          const defaults = ["abraham-lincoln", "marie-curie", "seneca"];
          for (const slug of defaults) {
            if (parsed.matchedGiants.length >= 3) break;
            if (!parsed.matchedGiants.find((mg: any) => mg.slug === slug)) {
              parsed.matchedGiants.push({ slug, reason: "A timeless giant who overcame immense personal hardship." });
            }
          }
        }
        responseText = JSON.stringify(parsed);
      }
    } catch (e) {
      // If validation fails, return original response
    }

    return new NextResponse(responseText, {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    console.error("Match API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to match giants" }, { status: 500 });
  }
}

