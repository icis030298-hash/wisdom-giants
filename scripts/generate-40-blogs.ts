import { getVertexAIInstance } from "../src/lib/vertexai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

interface BlogTopic {
  slug: string;
  titleKo: string;
  titleEn: string;
  category: "leadership" | "science" | "philosophy" | "arts" | "society" | "business";
  giantSlugs: string[];
  problemId?: string;
}

const BLOG_TOPICS: BlogTopic[] = [
  { slug: "fear-giants", titleKo: "두려움을 이겨낸 역사의 거인들", titleEn: "Historical Giants Who Conquered Fear", category: "society", giantSlugs: ["socrates", "abraham-lincoln", "marie-curie"], problemId: "fear" },
  { slug: "failure-comeback", titleKo: "실패 끝에 세상을 바꾼 위인들", titleEn: "Historical Giants Who Conquered Repeated Failures", category: "science", giantSlugs: ["albert-einstein", "frida-kahlo", "abraham-lincoln"], problemId: "failure" },
  { slug: "loneliness-creation", titleKo: "세상을 바꾼 아웃사이더들의 고독", titleEn: "The Productive Solitude of Outsiders Who Changed the World", category: "arts", giantSlugs: ["isaac-newton", "friedrich-nietzsche", "frida-kahlo"], problemId: "loneliness" },
  { slug: "decision-making", titleKo: "역사의 갈림길: 위대한 결단의 순간들", titleEn: "Crucial Decisions That Changed the Course of History", category: "leadership", giantSlugs: ["king-sejong", "napoleon-bonaparte", "marcus-aurelius"], problemId: "decision" },
  { slug: "burnout-recovery", titleKo: "모든 것을 이뤘지만 공허했던 위인들의 의미 찾기", titleEn: "Finding Meaning in Void: Overcoming Historical Burnout", category: "philosophy", giantSlugs: ["seneca", "marcus-aurelius", "leo-tolstoy"], problemId: "burnout" },
  { slug: "betrayal-relationship", titleKo: "배신 and 고통을 이겨낸 역사의 리더들", titleEn: "How Great Leaders Overcame Betrayal and Relationship Pain", category: "leadership", giantSlugs: ["confucius", "julius-caesar", "abraham-lincoln"], problemId: "relationship" },
  { slug: "overwhelm-focus", titleKo: "압박 속에서 집중력을 유지한 위인들의 비결", titleEn: "Maintaining Extreme Focus Under Heavy Pressure", category: "philosophy", giantSlugs: ["miyamoto-musashi", "seneca", "jeong-yak-yong"], problemId: "overwhelm" },
  { slug: "late-bloomer", titleKo: "40세 이후에 꽃피운 늦깎이 위인들", titleEn: "Late Bloomers Who Reconfigured History After Forty", category: "arts", giantSlugs: ["confucius", "benjamin-franklin", "miguel-de-cervantes"], problemId: "decision" },
  { slug: "poverty-greatness", titleKo: "가난을 딛고 역사를 바꾼 위인들", titleEn: "Rising from Extreme Poverty to Shape Human Legacy", category: "society", giantSlugs: ["abraham-lincoln", "oscar-wilde", "benjamin-franklin"], problemId: "failure" },
  { slug: "anxiety-philosophy", titleKo: "불안을 철학으로 승화한 스토아 위인들", titleEn: "Converting Severe Anxiety into Stoic Philosophy", category: "philosophy", giantSlugs: ["marcus-aurelius", "seneca", "socrates"], problemId: "fear" },
  { slug: "socrates-vs-confucius", titleKo: "소크라테스 vs 공자: 동서양 철학자의 삶의 지혜 비교", titleEn: "Socrates vs Confucius: Comparing Eastern and Western Wisdom", category: "philosophy", giantSlugs: ["socrates", "confucius"] },
  { slug: "napoleon-vs-sejong", titleKo: "나폴레옹 vs 세종대왕: 동서양 최고 리더십의 차이", titleEn: "Napoleon vs King Sejong: Two Paths of Supreme Leadership", category: "leadership", giantSlugs: ["napoleon-bonaparte", "king-sejong"] },
  { slug: "davinci-vs-newton", titleKo: "다빈치 vs 뉴턴: 천재의 두 가지 방식", titleEn: "Leonardo da Vinci vs Isaac Newton: Two Archetypes of Genius", category: "science", giantSlugs: ["leonardo-da-vinci", "isaac-newton"] },
  { slug: "aurelius-vs-seneca", titleKo: "마르쿠스 아우렐리우스 vs 세네카: 스토아 철학의 두 얼굴", titleEn: "Marcus Aurelius vs Seneca: Double Dimensions of Stoicism", category: "philosophy", giantSlugs: ["marcus-aurelius", "seneca"] },
  { slug: "curie-vs-keller", titleKo: "마리 퀴리 vs 헬렌 켈러: 시대의 편견을 이긴 두 여성", titleEn: "Marie Curie vs Helen Keller: Conquering Social Prejudices", category: "society", giantSlugs: ["marie-curie", "helen-keller"] },
  { slug: "lincoln-vs-gandhi", titleKo: "링컨 vs 간디: 혁명적 변화의 두 가지 방법", titleEn: "Abraham Lincoln vs Mahatma Gandhi: Two Strategies for Liberty", category: "leadership", giantSlugs: ["abraham-lincoln", "mahatma-gandhi"] },
  { slug: "eastern-western-leadership", titleKo: "동서양 리더십의 근본적 차이", titleEn: "Eastern vs Western Leadership: Root Historical Differences", category: "leadership", giantSlugs: ["king-sejong", "napoleon-bonaparte", "confucius", "julius-caesar"] },
  { slug: "philosophers-death", titleKo: "죽음 앞에서 철학자들이 보여준 것들", titleEn: "Facing the Void: How Great Thinkers Conquered Death", category: "philosophy", giantSlugs: ["socrates", "seneca", "marcus-aurelius"] },
  { slug: "art-vs-science", titleKo: "예술과 과학의 경계에서", titleEn: "Merging Art and Science: The Synthesis of Human Genius", category: "arts", giantSlugs: ["leonardo-da-vinci", "albert-einstein"] },
  { slug: "revolution-methods", titleKo: "혁명의 두 얼굴: 폭력 vs 비폭력", titleEn: "The Two Faces of Revolution: Armed Resistance vs Non-Violent Protest", category: "society", giantSlugs: ["napoleon-bonaparte", "mahatma-gandhi"] },
  { slug: "greatest-women-scientists", titleKo: "역사를 바꾼 여성 과학자들", titleEn: "Pioneering Women in Science Who Shattered Glass Ceilings", category: "science", giantSlugs: ["marie-curie", "ada-lovelace", "hypatia"] },
  { slug: "prison-wisdom", titleKo: "감옥에서 탄생한 위대한 사상들", titleEn: "Wisdom Behind Bars: Masterpieces Born in Confinement", category: "philosophy", giantSlugs: ["socrates", "jeong-yak-yong", "marcus-aurelius"] },
  { slug: "last-words", titleKo: "역사 위인들의 마지막 말", titleEn: "Famous Last Words: The Final Wisdom of Historical Giants", category: "philosophy", giantSlugs: ["socrates", "julius-caesar", "beethoven"] },
  { slug: "books-changed-world", titleKo: "세상을 뒤흔든 책들", titleEn: "Books That Reconfigured the World: 4 Revolutionary Works", category: "philosophy", giantSlugs: ["confucius", "adam-smith", "charles-darwin", "machiavelli"] },
  { slug: "wealth-philosophy", titleKo: "역사상 가장 부유했던 인물들의 돈에 대한 철학", titleEn: "The Philosophy of Wealth: How History's Richest Men Viewed Money", category: "business", giantSlugs: ["mansa-musa", "andrew-carnegie", "benjamin-franklin"] },
  { slug: "self-made-giants", titleKo: "아무것도 없이 시작해 역사를 바꾼 자수성가 위인들", titleEn: "Self-Made Giants: Starting from Scratch to Rebuild Empires", category: "business", giantSlugs: ["abraham-lincoln", "napoleon-bonaparte", "oda-nobunaga"] },
  { slug: "forgotten-geniuses", titleKo: "역사가 잊은 천재들: 시대를 앞서간 위인들의 비극", titleEn: "Forgotten Geniuses: The Tragic Fate of Visionaries Ahead of Their Time", category: "science", giantSlugs: ["nikola-tesla", "ada-lovelace", "hypatia"] },
  { slug: "leaders-mental-health", titleKo: "위대한 리더들의 우울증과 성취", titleEn: "Depression and Triumph: The Mental Battles of Great Leaders", category: "leadership", giantSlugs: ["abraham-lincoln", "winston-churchill", "isaac-newton"] },
  { slug: "asian-wisdom-modern", titleKo: "현대인이 몰랐던 동양 철학의 실용 지혜", titleEn: "Practical Eastern Wisdom for Navigating the Modern World", category: "philosophy", giantSlugs: ["confucius", "lao-tzu", "miyamoto-musashi"] },
  { slug: "age-wisdom-connection", titleKo: "나이와 지혜의 관계: 인생 후반에 발견한 것들", titleEn: "Age and Wisdom: Defining Insights Discovered Later in Life", category: "philosophy", giantSlugs: ["seneca", "marcus-aurelius", "michelangelo"] },
  { slug: "musashi-business", titleKo: "미야모토 무사시의 오륜서: 현대 비즈니스에 적용하는 병법", titleEn: "Miyamoto Musashi's Book of Five Rings: Strategy for Modern Business", category: "business", giantSlugs: ["miyamoto-musashi"] },
  { slug: "seneca-time", titleKo: "세네카의 시간론: 1세기 철학자가 현대인에게 보내는 경고", titleEn: "Seneca on the Shortness of Life: A Warning to Modern Multi-Taskers", category: "philosophy", giantSlugs: ["seneca"] },
  { slug: "aurelius-diary", titleKo: "마르쿠스 아우렐리우스의 명상록: 황제의 매일 아침 성찰", titleEn: "Marcus Aurelius' Meditations: An Emperor's Morning Reflection Diary", category: "philosophy", giantSlugs: ["marcus-aurelius"] },
  { slug: "sun-tzu-modern", titleKo: "손자병법을 현대 경영에 적용하는 방법", titleEn: "Applying the Art of War to Modern Management Strategy", category: "business", giantSlugs: ["miyamoto-musashi"] },
  { slug: "davinci-notebooks", titleKo: "레오나르도 다빈치의 노트: 천재의 메모 습관", titleEn: "Leonardo da Vinci's Notebooks: The Meticulous Habits of a Genius", category: "arts", giantSlugs: ["leonardo-da-vinci"] },
  { slug: "gandhi-resistance", titleKo: "간디의 비폭력 저항: 현대 갈등 해결에 주는 교훈", titleEn: "Mahatma Gandhi's Satyagraha: Lessons for Modern Conflict Resolution", category: "society", giantSlugs: ["mahatma-gandhi"] },
  { slug: "lincoln-depression", titleKo: "링컨의 우울증 극복기: 정신 건강과 리더십", titleEn: "Abraham Lincoln's Melancholy: How Pain Shaped Great Leadership", category: "leadership", giantSlugs: ["abraham-lincoln"] },
  { slug: "confucius-relationships", titleKo: "공자의 인(仁) 사상: 현대 인간관계 적용법", titleEn: "Confucian Benevolence: Improving Modern Relationships via Ancient Wisdom", category: "philosophy", giantSlugs: ["confucius"] },
  { slug: "frida-pain", titleKo: "프리다 칼로의 고통과 창조: 역경을 예술로 승화하는 법", titleEn: "Frida Kahlo's Painting of Pain: Converting Adversity into Artistic Triumph", category: "arts", giantSlugs: ["frida-kahlo"] },
  { slug: "nietzsche-real", titleKo: "니체의 초인 사상: 현대인이 오해하는 철학의 진실", titleEn: "Nietzsche's Übermensch: The True Spirit of Self-Overcoming", category: "philosophy", giantSlugs: ["friedrich-nietzsche"] }
];

const LOCALES = ["ko", "en", "ja", "de", "es", "fr", "it", "pt", "ar", "hi", "ru", "zh"];
const modelId = "gemini-2.5-flash-lite";

async function callGenerativeAPI(prompt: string, temperature: number = 0.7): Promise<string> {
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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

function sanitizeString(str: string): string {
  return str.replace(/\ufffd/g, "");
}

async function generateBlogPost(topic: BlogTopic, locale: string, localeName: string): Promise<any> {
  const langInstruction: Record<string, string> = {
    ko: "한국어로 작성. 자연스럽고 깊이 있으며 감동적인 인문학 수필 톤. 존댓말 사용.",
    en: "Write in English. Deep, engaging, and professional humanities essay tone.",
    de: "Auf Deutsch schreiben. Sachlicher, literarischer und tiefgründiger Essay-Stil.",
    ja: "日本語で書く。格調高く、説得力のある人文科学エッセイ의 토ーン。丁寧語。",
    es: "Escribir en español. Tono ensayístico, profundo e inspirador.",
    fr: "Écrire en français. Style d'essai élégant, littéraire et profond. Utiliser le vouvoiement.",
    it: "Scrivere in italiano. Stile saggistico colto, elegante e formale.",
    pt: "Escrever em português brasileiro. Tom ensaístico, envolvente e natural.",
    ar: "اكتب باللغة العربية الفصحى. أسلوب أدبي راقٍ، ملهم وعميق.",
    hi: "हिंदी में लिखें। गंभीर, ज्ञानवर्धक और प्रेरक निबंध शैली।",
    ru: "Писать на русском. Глубокий, научно-популярный и вдохновляющий стиль.",
    zh: "用中文简体写作。深刻且富有启发性的人文散文风格。"
  };

  const prompt = `
You are an expert historian and professional writer.
Generate a high-quality blog post about the historical figures.

Topic: "${topic.titleEn}"
Language: ${localeName}
Style Instruction: ${langInstruction[locale] || langInstruction['en']}

Strict Content Requirements:
1. MUST contain at least 1500 characters of rich body text in the target language.
2. Rely strictly on verified, accurate historical facts and real biographies. No hallucination.
3. Structure with at least 4 clear sections using H2 and H3 markdown subtitles (e.g. ##, ###).
4. Include specific anecdotes and famous documented quotes of the related figures: ${topic.giantSlugs.join(", ")}.
5. Connect these historical lessons to modern life struggles (e.g. work pressure, career search, finding meaning) to provide practical wisdom for modern readers.
6. Completely avoid generic AI filler phrases or clichés.

Output Format:
Return ONLY a raw JSON object matching the following structure. No markdown wrapping.
{
  "title": "Title of the blog post",
  "description": "Compelling 1-2 sentence description for SEO",
  "content": "Detailed blog post body text in markdown format. Min 1500 characters."
}
`;

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const rawText = await callGenerativeAPI(prompt, 0.7);
      const cleaned = cleanJSON(rawText);
      const parsed = JSON.parse(cleaned);

      if (!parsed.title || !parsed.description || !parsed.content || parsed.content.length < 300) {
        throw new Error("Invalid structure or content is too short");
      }

      parsed.title = sanitizeString(parsed.title);
      parsed.description = sanitizeString(parsed.description);
      parsed.content = sanitizeString(parsed.content);
      return parsed;
    } catch (e: any) {
      console.error(`      [Post Warning] Attempt ${attempts} failed:`, e.message);
      await sleep(3000);
    }
  }
  throw new Error(`Failed to generate post for ${topic.slug} in ${locale}`);
}

async function main() {
  const outputPath = path.resolve(process.cwd(), "src/data/blog-posts-progress.json");
  let blogData: Record<string, any> = {};

  if (fs.existsSync(outputPath)) {
    try {
      blogData = JSON.parse(fs.readFileSync(outputPath, "utf8"));
      console.log(`Loaded ${Object.keys(blogData).length} blog posts from progress file.`);
    } catch (e) {
      console.error("Failed to parse progress file, starting fresh.");
    }
  }

  const localeNames: Record<string, string> = {
    ko: "Korean", en: "English", de: "German", ja: "Japanese", es: "Spanish",
    fr: "French", it: "Italian", pt: "Portuguese", ar: "Arabic", hi: "Hindi",
    ru: "Russian", zh: "Simplified Chinese"
  };

  let count = 0;
  for (const topic of BLOG_TOPICS) {
    if (!blogData[topic.slug]) {
      blogData[topic.slug] = {
        slug: topic.slug,
        category: topic.category,
        giantSlug: topic.giantSlugs[0], // backward compatibility
        giantSlugs: topic.giantSlugs,
        publishedAt: new Date().toISOString().split("T")[0],
        translations: {}
      };
    }

    const currentPost = blogData[topic.slug];
    const missingLocales = LOCALES.filter(l => !currentPost.translations[l]);

    if (missingLocales.length === 0) {
      console.log(`[Skip] Post: ${topic.slug} already generated for all locales.`);
      continue;
    }

    console.log(`\nGenerating post: ${topic.titleKo} (${topic.slug}) [${++count}/${BLOG_TOPICS.length}]...`);

    for (const locale of LOCALES) {
      if (currentPost.translations[locale]) {
        continue;
      }

      console.log(`  Translating into ${localeNames[locale]} (${locale})...`);
      try {
        const post = await generateBlogPost(topic, locale, localeNames[locale]);
        currentPost.translations[locale] = post;
        
        // Save progress incrementally after each locale
        fs.writeFileSync(outputPath, JSON.stringify(blogData, null, 2), "utf8");
        console.log(`    ✓ Done (${post.content.length} chars)`);
      } catch (err: any) {
        console.error(`    ❌ Failed for locale ${locale}:`, err.message);
        process.exit(1); // Abort on consecutive failure to protect token usage
      }

      // Respect rate limits
      await sleep(1500);
    }
  }

  console.log("\n=== ALL BLOG POSTS GENERATION COMPLETED SUCCESSFULLY ===");
}

main().catch(console.error);
