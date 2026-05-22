import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { giantsData } from "@/data/giants";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const { topic, locale } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "토론 주제가 비어있습니다." }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: "서버 설정 오류: API 키가 없습니다." }, { status: 500 });
    }

    // 1. Get all available giant slugs and names to feed into the recommendation pool
    const pool = giantsData.map(g => ({
      slug: g.slug,
      name: g.name,
      category: g.category
    }));

    const langName = locale === 'ko' ? 'Korean (한국어)' 
                   : locale === 'ja' ? 'Japanese (日本語)'
                   : locale === 'de' ? 'German (Deutsch)'
                   : locale === 'es' ? 'Spanish (Español)'
                   : locale === 'fr' ? 'French (Français)'
                   : locale === 'it' ? 'Italian (Italiano)'
                   : locale === 'pt' ? 'Portuguese (Português)'
                   : 'English';

    // 2. Build the system instruction to force strict JSON matching
    const systemPrompt = `
You are a historical wisdom curation assistant for "Giants Wisdom".
Your task is to analyze the user's debate topic and select exactly 3 historical giants from the provided pool who would have the most engaging, contrasting, or deeply intellectual debate about this topic.

Available Giant Pool (ONLY SELECT SLUGS FROM THIS LIST):
${JSON.stringify(pool, null, 2)}

Topic to debate: "${topic}"

Instructions:
1. Select exactly 3 giants whose philosophy, works, or historical context create an exciting intellectual clash or beautiful synergy on this topic (e.g., Seneca (Stoic) vs. Nietzsche (Will to Power) vs. Aristotle (Virtue) on "Happiness").
2. Output a STRICT, raw JSON block. No markdown formatting, no "\`\`\`json" wrapper, no commentary.
3. The response must perfectly match this schema:
{
  "recommended": [
    {
      "slug": "steve-jobs",
      "reason": "Brief explanation of why this giant is fit for the topic in the requested language."
    },
    ... (exactly 3 items)
  ],
  "intro": "A majestic introductory message welcoming the user to this debate and summarizing why this trio is epic."
}
4. Crucial: All reasons and the intro MUST be written in the following language: ${langName}.
5. Validate that all selected slugs exist EXACTLY as written in the Available Giant Pool.
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = ["gemini-3.1-flash-lite", "gemini-2.5-flash"];
    let lastError = null;
    let textResult = "";

    for (const modelId of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelId,
          generationConfig: { responseMimeType: "application/json" } // Force json output
        });

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        textResult = response.text();
        if (textResult) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Recommend API] Failed utilizing model [${modelId}]:`, err.message);
      }
    }

    if (!textResult) {
      throw new Error(lastError?.message || "Gemini recommendation failed.");
    }

    // Safely parse and validate the recommendations
    let recommendationData;
    try {
      recommendationData = JSON.parse(textResult);
    } catch (parseErr) {
      // Fallback in case Gemini returns slightly malformed JSON despite mime type
      console.warn("[Recommend API] JSON parse failed, clean string:", textResult);
      const jsonMatch = textResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendationData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse JSON response from AI.");
      }
    }

    // Double-verify slugs exist in our pool
    if (recommendationData.recommended && Array.isArray(recommendationData.recommended)) {
      recommendationData.recommended = recommendationData.recommended.map((rec: any) => {
        const matchingGiant = giantsData.find(g => g.slug === rec.slug);
        if (!matchingGiant) {
          // If a slug is mismatched, fallback to a sensible one
          const fallback = giantsData[Math.floor(Math.random() * giantsData.length)];
          return {
            slug: fallback.slug,
            reason: rec.reason
          };
        }
        return rec;
      });
    }

    return NextResponse.json(recommendationData);

  } catch (error: any) {
    console.error("[Recommend API Error]:", error);
    return NextResponse.json({
      error: "추천 위인을 생성하는 도중 오류가 발생했습니다.",
      details: error.message || String(error)
    }, { status: 500 });
  }
}
