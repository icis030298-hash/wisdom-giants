import { getVertexAIInstance } from "../src/lib/vertexai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { giantsData } from "../src/data/giants";

dotenv.config({ path: ".env.local" });

const modelId = "gemini-2.5-flash-lite";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGenerativeAPI(prompt: string, temperature: number = 0.3): Promise<string> {
  // 1. Try Vertex AI first (uses GCP Free Credit)
  try {
    const vAI = getVertexAIInstance();
    const model = vAI.getGenerativeModel({
      model: modelId,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: temperature,
      }
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = "";
    if (typeof response.text === "function") {
      text = response.text();
    } else {
      text = (response as any).candidates?.[0]?.content?.parts?.[0]?.text || "";
    }
    if (text && text.trim().length > 0) {
      return text;
    }
  } catch (vertexErr: any) {
    console.warn(`[Vertex AI Warning] Failed to generate with Vertex AI: ${vertexErr.message}. Falling back to Google AI Studio...`);
  }

  // 2. Fallback to Google Generative AI (AI Studio)
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No GEMINI_API_KEY found in environment for fallback");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: temperature,
    }
  });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

function cleanJSON(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

const enPath = path.resolve(process.cwd(), "messages/en.json");
const koPath = path.resolve(process.cwd(), "messages/ko.json");

const enData = JSON.parse(fs.readFileSync(enPath, "utf8"));
const koData = JSON.parse(fs.readFileSync(koPath, "utf8"));

if (!enData.Giants) enData.Giants = {};
if (!koData.Giants) koData.Giants = {};

const enGiants = enData.Giants;
const koGiants = koData.Giants;

// Find missing slugs in en.json
const missingSlugs = giantsData
  .map(g => g.slug)
  .filter(slug => !enGiants[slug]);

async function translateGiant(giant: any): Promise<any> {
  const prompt = `
You are a translation assistant.
Translate the following historical figure metadata from Korean to English.

Figure Slug: ${giant.slug}
Korean Name: ${giant.name}
Korean Headline: ${giant.headline}
Korean ShortDescription: ${giant.shortDescription}
Korean Quote: ${giant.quote}
Korean Era: ${giant.era || ""}

Rules:
1. Translate the name into the most common and standard English spelling for this historical figure (e.g. "베르길리우스" -> "Virgil", "헨리크 입센" -> "Henrik Ibsen").
2. Translate the headline, shortDescription, and quote naturally and eloquently.
3. Translate the Era into a format like "19th Century Giant" or "4th Century BC Giant". If empty, write "Historical Giant".

Return ONLY a JSON object matching this schema:
{
  "name": "English name",
  "headline": "English headline",
  "shortDescription": "English short description",
  "quote": "English translated quote",
  "era": "English translated era"
}

Do NOT wrap in markdown JSON code blocks. Do NOT add any preamble or conversational text.
`;

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const result = await callGenerativeAPI(prompt, 0.3);
      const cleaned = cleanJSON(result);
      return JSON.parse(cleaned);
    } catch (e: any) {
      console.error(`    [Translate Warning] Attempt ${attempts} failed for slug ${giant.slug}:`, e.message);
      await sleep(3000);
    }
  }
  return null;
}

async function main() {
  console.log(`Total missing giants to process: ${missingSlugs.length}`);
  if (missingSlugs.length === 0) {
    console.log("No missing giants found in en.json. Up to date!");
    return;
  }

  let successCount = 0;
  let activeIndex = 0;
  const concurrency = 10;

  const missingGiants = giantsData.filter(g => missingSlugs.includes(g.slug));

  async function worker(workerId: number) {
    while (true) {
      const i = activeIndex++;
      if (i >= missingGiants.length) break;

      const giant = missingGiants[i];
      console.log(`[Worker ${workerId}][${i + 1}/${missingGiants.length}] Processing missing giant: ${giant.slug}...`);

      const translated = await translateGiant(giant);
      if (translated) {
        // 1. Populate en.json entry
        enGiants[giant.slug] = {
          name: translated.name,
          headline: translated.headline,
          shortDescription: translated.shortDescription,
          quote: translated.quote,
          era: translated.era,
          chatGreeting: `Greetings, I am ${translated.name}. Do you seek the path of wisdom or have questions about my life's journey?`,
          suggestedQuestions: [
            `Tell me about your greatest achievement, ${translated.name}.`,
            `How did you overcome your most difficult challenges?`,
            `What is the most important piece of advice you can give me?`
          ]
        };

        // 2. Populate ko.json entry
        koGiants[giant.slug] = {
          name: giant.name,
          headline: giant.headline,
          shortDescription: giant.shortDescription,
          quote: giant.quote,
          era: `${giant.era || "역사 속"}의 거인`,
          chatGreeting: `안녕하십니까, 저는 ${giant.name}입니다. 어떤 지혜를 찾고 계시거나 제 삶에 대해 궁금한 점이 있으신가요?`,
          suggestedQuestions: [
            `${giant.name}님, 당신의 가장 위대한 업적에 대해 말씀해주세요.`,
            `가장 힘들었던 시련을 어떻게 극복하셨나요?`,
            `저에게 해줄 수 있는 가장 중요한 조언은 무엇인가요?`
          ]
        };

        successCount++;
        console.log(`  ✓ [Worker ${workerId}] Successfully processed and translated ${giant.slug}`);
      } else {
        console.error(`  ❌ [Worker ${workerId}] Failed to process ${giant.slug}`);
      }
      await sleep(200);
    }
  }

  const workers = Array.from({ length: concurrency }).map((_, wId) => worker(wId + 1));
  await Promise.all(workers);

  // Save changes
  fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), "utf8");
  fs.writeFileSync(koPath, JSON.stringify(koData, null, 2), "utf8");
  console.log(`\n=== MISSING GIANTS GENERATION COMPLETE ===`);
  console.log(`Successfully added ${successCount} giants to en.json and ko.json.`);
}

main().catch(console.error);
