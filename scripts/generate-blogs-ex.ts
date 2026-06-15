import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

interface BlogTopic {
  slug: string;
  titleKo: string;
  titleEn: string;
  category: 'leadership' | 'philosophy' | 'creativity' | 'wisdom' | 'science' | 'arts' | 'society' | 'business';
  giantSlugs: string[];
}

const BLOG_TOPICS: BlogTopic[] = [
  // Category A: Giant Quote Focused (20 Posts)
  { slug: "marcus-aurelius-quotes", titleKo: "마르쿠스 아우렐리우스 명언 20선: 황제 철학자가 전하는 삶의 지혜", titleEn: "20 Marcus Aurelius Quotes: Wisdom from the Philosopher Emperor", category: "philosophy", giantSlugs: ["marcus-aurelius"] },
  { slug: "socrates-questions", titleKo: "소크라테스의 성찰 가이드: 자신을 발견하는 질문들", titleEn: "Socrates' Guide to Self-Reflection: Questions to Discover Yourself", category: "philosophy", giantSlugs: ["socrates"] },
  { slug: "lincoln-failure-lessons", titleKo: "링컨의 실패에서 배우는 교훈: 끈기의 승리", titleEn: "Lincoln's Lessons from Failure: The Triumph of Persistence", category: "leadership", giantSlugs: ["abraham-lincoln"] },
  { slug: "confucius-wisdom", titleKo: "공자의 평생 배움의 길: 삶의 지혜와 성장", titleEn: "Confucian Path of Lifelong Learning: Life Wisdom and Growth", category: "philosophy", giantSlugs: ["confucius"] },
  { slug: "cleopatra-leadership", titleKo: "클레오파트라의 전략적 카리스마: 역사상 가장 매혹적인 리더십", titleEn: "Cleopatra's Secrets of Strategic Charisma: History's Most Fascinating Leadership", category: "leadership", giantSlugs: ["cleopatra"] },
  { slug: "gandhi-nonviolence", titleKo: "간디의 비폭력이라는 힘: 영혼의 무기 사티아그라하", titleEn: "Gandhi's Strength of Non-Violence: Satyagraha as a Spiritual Weapon", category: "leadership", giantSlugs: ["mahatma-gandhi"] },
  { slug: "einstein-creativity", titleKo: "아인슈타인의 상상력과 창의성: 지식보다 위대한 힘", titleEn: "Einstein on Imagination and Creativity: Power Greater Than Knowledge", category: "science", giantSlugs: ["albert-einstein"] },
  { slug: "curie-perseverance", titleKo: "마리 퀴리의 헌신: 시대를 초월한 과학의 빛", titleEn: "Marie Curie's Devotion to Science: Timeless Light of Discovery", category: "science", giantSlugs: ["marie-curie"] },
  { slug: "king-sejong-innovation", titleKo: "세종대왕의 혁신 정신과 훈민정음: 백성을 사랑한 리더십", titleEn: "King Sejong's Scientific Legacy: Leadership of Loving the People", category: "science", giantSlugs: ["king-sejong"] },
  { slug: "yun-dongju-poetry", titleKo: "윤동주의 성찰의 시: 부끄러움과 별을 노래한 영혼", titleEn: "Yun Dong-ju's Poetry of Reflection: The Soul that Sang of Shame and Stars", category: "arts", giantSlugs: ["yun-dong-ju"] },
  { slug: "jang-yeong-sil-genius", titleKo: "장영실의 장벽을 뛰어넘는 혁신: 신분을 극복한 천재성", titleEn: "Jang Yeong-sil's Triumph Over Barriers: Genius That Overcame Status", category: "science", giantSlugs: ["jang-yeong-sil"] },
  { slug: "aristotle-virtue", titleKo: "아리스토텔레스의 행복의 윤리학: 최고의 선을 찾아서", titleEn: "Aristotle's Ethics of Happiness: In Search of the Highest Good", category: "philosophy", giantSlugs: ["aristotle"] },
  { slug: "buddha-peace", titleKo: "부처의 내면의 평화에 대한 가르침: 고통을 이겨내는 마음", titleEn: "Buddha's Teachings on Inner Peace: Mind that Conquers Suffering", category: "philosophy", giantSlugs: ["buddha"] },
  { slug: "nietzsche-willpower", titleKo: "니체의 자기 초극 가이드: 삶을 긍정하는 의지", titleEn: "Nietzsche's Guide to Self-Overcoming: The Will to Affirm Life", category: "philosophy", giantSlugs: ["friedrich-nietzsche"] },
  { slug: "dostoevsky-suffering", titleKo: "도스토옙스키의 고통 속에서 찾는 빛: 영혼의 위로와 고뇌", titleEn: "Dostoevsky on Finding Light in Suffering: Soul's Comfort and Agony", category: "philosophy", giantSlugs: ["fyodor-dostoevsky"] },
  { slug: "mozart-genius", titleKo: "모차르트의 음악적 정신과 창조적 광기", titleEn: "Mozart's Mind and Creative Madness: The Spirit of Music", category: "arts", giantSlugs: ["mozart"] },
  { slug: "da-vinci-curiosity", titleKo: "레오나르도 다빈치의 무한한 호기심: 관찰과 기록의 지혜", titleEn: "Leonardo da Vinci's Infinite Curiosity: Wisdom of Observation", category: "arts", giantSlugs: ["leonardo-da-vinci"] },
  { slug: "tesla-innovation", titleKo: "니콜라 테슬라의 미래 비전: 세상을 바꾼 천재 발명가", titleEn: "Nikola Tesla's Vision of the Future: The Genius Inventor", category: "science", giantSlugs: ["nikola-tesla"] },
  { slug: "florence-nightingale", titleKo: "나이팅게일의 개혁적 헌신: 등불을 든 천사의 유산", titleEn: "Nightingale's Reformative Compassion: Legacy of the Lady with the Lamp", category: "society", giantSlugs: ["florence-nightingale"] },
  { slug: "ada-lovelace-pioneer", titleKo: "에이다 러브레이스의 시적인 과학: 최초의 프로그래머", titleEn: "Ada Lovelace's Poetic Science: The First Computer Programmer", category: "science", giantSlugs: ["ada-lovelace"] },

  // Category B: Thematic Concern-based (20 Posts)
  { slug: "quotes-burnout-recovery", titleKo: "번아웃 극복을 위한 10가지 명언: 지친 마음을 위로하는 지혜", titleEn: "10 Quotes for Overcoming Burnout: Wisdom to Comfort a Weary Mind", category: "philosophy", giantSlugs: ["seneca", "marcus-aurelius", "buddha"] },
  { slug: "quotes-failure-resilience", titleKo: "좌절을 딛고 다시 일어서기: 실패를 성장의 발판으로", titleEn: "Rising Strong After Setbacks: Turning Failure into Growth", category: "wisdom", giantSlugs: ["abraham-lincoln", "frida-kahlo", "thomas-edison"] },
  { slug: "quotes-relationship-advice", titleKo: "철학자들의 인간관계 조언: 상처받지 않고 깊어지는 법", titleEn: "Stoic and Philosophical Guide to Relationships: Connection Without Pain", category: "philosophy", giantSlugs: ["confucius", "socrates", "seneca"] },
  { slug: "quotes-anxiety-calm", titleKo: "극심한 불안을 달래는 고대 명상록: 마음의 평화를 얻는 법", titleEn: "Ancient Meditations for Severe Anxiety: Ways to Gain Peace of Mind", category: "philosophy", giantSlugs: ["marcus-aurelius", "seneca", "buddha"] },
  { slug: "quotes-job-seeking", titleKo: "취업과 미래의 불확실성을 이기는 조언: 길을 헤맬 때의 나침반", titleEn: "Guidance for Career Search & Uncertainty: Compass When You Are Lost", category: "wisdom", giantSlugs: ["benjamin-franklin", "abraham-lincoln", "leonardo-da-vinci"] },
  { slug: "quotes-self-confidence", titleKo: "진정한 자존감을 찾는 철학자들의 성찰: 내면의 힘을 기르기", titleEn: "Finding Genuine Self-Esteem: Philosophical Reflections on Inner Strength", category: "philosophy", giantSlugs: ["friedrich-nietzsche", "frida-kahlo"] },
  { slug: "quotes-loneliness", titleKo: "창조적인 고독을 포용하는 법: 외로움을 에너지로 승화하기", titleEn: "Embracing Creative Solitude: Transforming Loneliness into Energy", category: "arts", giantSlugs: ["nikola-tesla", "friedrich-nietzsche", "vincent-van-gogh"] },
  { slug: "quotes-morning-motivation", titleKo: "아침의 영감을 주는 하루 1분 명언: 긍정으로 여는 하루", titleEn: "Daily Wisdom for Morning Inspiration: Starting the Day with Positivity", category: "philosophy", giantSlugs: ["marcus-aurelius", "benjamin-franklin", "seneca"] },
  { slug: "quotes-leadership-modern", titleKo: "고대 리더십을 현대 팀 경영에 적용하기: 최고의 성과를 이끄는 지혜", titleEn: "Applying Ancient Leadership to Modern Teams: Wisdom for High Performance", category: "leadership", giantSlugs: ["sun-tzu", "king-sejong", "julius-caesar"] },
  { slug: "quotes-stoic-happiness", titleKo: "스토아학파가 말하는 진짜 행복의 정의: 흔들리지 않는 내면", titleEn: "Stoicism's Real Definition of Joy: The Unshakable Inner Self", category: "philosophy", giantSlugs: ["seneca", "marcus-aurelius", "cicero"] },
  { slug: "quotes-creative-block", titleKo: "창의성 슬럼프를 탈출하는 법: 예술가들의 영감 회복 프로세스", titleEn: "Overcoming Artistic Slumps: How Great Artists Recovered Inspiration", category: "arts", giantSlugs: ["leonardo-da-vinci", "vincent-van-gogh", "mozart"] },
  { slug: "quotes-time-management", titleKo: "시간을 낭비하지 않는 법에 대한 고대 지혜: 세네카의 가르침", titleEn: "Ancient Wisdom on Not Wasting Time: Seneca's Principles", category: "wisdom", giantSlugs: ["seneca", "benjamin-franklin", "leonardo-da-vinci"] },
  { slug: "quotes-perfectionism", titleKo: "완벽주의에서 벗어나는 법: 결함조차 포용하는 지혜", titleEn: "Letting Go of Flawlessness: Wisdom to Embrace Imperfections", category: "philosophy", giantSlugs: ["winston-churchill", "frida-kahlo", "socrates"] },
  { slug: "quotes-grief-loss", titleKo: "상실과 슬픔을 헤쳐 나가는 철학적 위로: 스토아와 불교의 지혜", titleEn: "Navigating Loss with Philosophical Comfort: Stoic and Buddhist Wisdom", category: "philosophy", giantSlugs: ["seneca", "marcus-aurelius", "buddha"] },
  { slug: "quotes-success-definition", titleKo: "물질적 부를 넘어선 성공의 진짜 정의: 고대 현인들의 관점", titleEn: "Redefining Success Beyond Wealth: Perspectives of Ancient Sages", category: "philosophy", giantSlugs: ["socrates", "seneca", "lao-tzu"] },
  { slug: "quotes-courage-fear", titleKo: "현대적 두려움을 극복하는 역사적 용기: 전장의 리더들에게 배우다", titleEn: "Facing Modern Fears with Historical Courage: Lessons from Battle Leaders", category: "society", giantSlugs: ["joan-of-arc", "socrates", "abraham-lincoln"] },
  { slug: "quotes-study-learning", titleKo: "거인들의 평생 공부 비법: 진정한 앎에 도달하는 공부법", titleEn: "Lifelong Learning Secrets of the Masters: Reaching True Understanding", category: "wisdom", giantSlugs: ["confucius", "socrates", "benjamin-franklin"] },
  { slug: "quotes-money-wealth", titleKo: "돈과 풍요를 바라보는 두 가지 시선: 물질과 정신의 조화", titleEn: "The Dual Nature of Material Abundance: Wealth and Spiritual Harmony", category: "business", giantSlugs: ["john-d-rockefeller", "andrew-carnegie", "seneca"] },
  { slug: "quotes-health-body", titleKo: "몸과 마음의 조화로운 건강: 역사적 인물들의 건강 철학", titleEn: "Balance of Mind and Body in History: Health Philosophy of Giants", category: "philosophy", giantSlugs: ["buddha", "socrates", "marcus-aurelius"] },
  { slug: "quotes-change-growth", titleKo: "변화와 성장을 받아들이는 법: 노자와 마르쿠스의 지혜", titleEn: "Embracing Life's Constant Transitions: Wisdom of Lao-Tzu and Marcus", category: "philosophy", giantSlugs: ["lao-tzu", "marcus-aurelius", "seneca"] },

  // Category C: Comparison (10 Posts)
  { slug: "seneca-vs-aurelius-adversity", titleKo: "세네카 vs 마르쿠스 아우렐리우스: 역경을 마주한 스토아의 두 거인", titleEn: "Seneca vs Marcus Aurelius on Adversity: Two Giants of Stoicism", category: "philosophy", giantSlugs: ["seneca", "marcus-aurelius"] },
  { slug: "socrates-vs-confucius-wisdom", titleKo: "소크라테스 vs 공자: 대화와 덕성의 동서양 철학 대결", titleEn: "Socrates vs Confucius: Comparing Eastern and Western Wisdom of Virtue", category: "philosophy", giantSlugs: ["socrates", "confucius"] },
  { slug: "lincoln-vs-churchill-crisis", titleKo: "링컨 vs 처칠: 위기 상황에서의 리더십과 소통", titleEn: "Lincoln vs Churchill: Leading Under Crisis and Communicating Hope", category: "leadership", giantSlugs: ["abraham-lincoln", "winston-churchill"] },
  { slug: "newton-vs-einstein-failure", titleKo: "뉴턴 vs 아인슈타인: 과학적 고뇌와 극복의 발자취", titleEn: "Newton vs Einstein: Scientific Struggles and Conquest of Failures", category: "science", giantSlugs: ["isaac-newton", "albert-einstein"] },
  { slug: "curie-vs-nightingale-barriers", titleKo: "마리 퀴리 vs 나이팅게일: 사회적 편견과 제약을 깬 영웅들", titleEn: "Marie Curie vs Nightingale: Breaking Barriers and Changing Society", category: "society", giantSlugs: ["marie-curie", "florence-nightingale"] },
  { slug: "plato-vs-aristotle-truth", titleKo: "플라톤 vs 아리스토텔레스: 이상적 관념과 현실적 관찰", titleEn: "Plato vs Aristotle: Ideas vs Reality in Search of Truth", category: "philosophy", giantSlugs: ["plato", "aristotle"] },
  { slug: "gandhi-vs-mandela-freedom", titleKo: "간디 vs 만델라: 불의에 대항한 위대한 비폭력과 끈기", titleEn: "Gandhi vs Nelson Mandela: Conquering Injustice and Leading Freedom", category: "society", giantSlugs: ["mahatma-gandhi", "abraham-lincoln"] },
  { slug: "napoleon-vs-caesar-empire", titleKo: "나폴레옹 vs 카이사르: 정복자들의 야망과 권력의 한계", titleEn: "Napoleon vs Julius Caesar: Ambition, Strategy, and Limits of Power", category: "leadership", giantSlugs: ["napoleon-bonaparte", "julius-caesar"] },
  { slug: "buddha-vs-stoics-suffering", titleKo: "붓다 vs 스토아학파: 고통을 치유하는 동서양의 마음공부", titleEn: "Buddhism vs Stoicism on Suffering: Eastern and Western Path to Healing", category: "philosophy", giantSlugs: ["buddha", "marcus-aurelius", "seneca"] },
  { slug: "tesla-vs-edison-innovation", titleKo: "니콜라 테슬라 vs 토마스 에디슨: 교류와 직류, 천재들의 전쟁", titleEn: "Nikola Tesla vs Thomas Edison: War of Visions and Electrifying Innovation", category: "science", giantSlugs: ["nikola-tesla", "thomas-edison"] },

  // Category D: Roundups (10 Posts)
  { slug: "stoic-philosophers-guide", titleKo: "스토아 철학자 3인의 종합 가이드: 인생의 흔들림을 없애라", titleEn: "The Ultimate Stoic Guide: Life Wisdom from Seneca, Aurelius, Epictetus", category: "philosophy", giantSlugs: ["seneca", "marcus-aurelius"] },
  { slug: "joseon-leaders-wisdom", titleKo: "조선시대 리더들의 리더십 비밀: 애민과 실사구시의 정신", titleEn: "Leadership Secrets of Joseon Dynasty: Practical Philosophy of Masters", category: "leadership", giantSlugs: ["king-sejong", "jeong-yak-yong", "king-jeongjo"] },
  { slug: "women-giants-history", titleKo: "역사를 바꾼 여성 위인들의 불굴의 서사: 세상을 바꾼 선택", titleEn: "Women Who Reconfigured the World: Inspiring Narratives of Challenge", category: "society", giantSlugs: ["marie-curie", "ada-lovelace", "florence-nightingale"] },
  { slug: "scientists-failure-success", titleKo: "과학자들의 실패와 성공: 인류 역사상 가장 위대한 발견들", titleEn: "How Failures Led to Human Inventions: Scientific Persistence", category: "science", giantSlugs: ["thomas-edison", "nikola-tesla", "alexander-fleming"] },
  { slug: "philosophers-on-happiness", titleKo: "행복하게 사는 법에 관한 철학자 5인의 조언", titleEn: "5 Philosophers on Living a Happy Life: Practical Sages on Joy", category: "philosophy", giantSlugs: ["socrates", "aristotle", "seneca", "buddha", "lao-tzu"] },
  { slug: "asian-giants-wisdom", titleKo: "동양 위인들이 전하는 삶의 실용적 지혜", titleEn: "Practical Wisdom of Asian Giants: Harmony and Lifelong Insights", category: "wisdom", giantSlugs: ["confucius", "lao-tzu", "buddha", "king-sejong"] },
  { slug: "artists-creative-process", titleKo: "천재 예술가들의 창작 과정 엿보기: 영감과 몰입의 시간", titleEn: "Inside the Minds of History's Great Artists: Inspiration and Immersion", category: "arts", giantSlugs: ["leonardo-da-vinci", "vincent-van-gogh", "michelangelo"] },
  { slug: "world-leaders-crisis", titleKo: "위기를 기회로 만든 세계 지도자들의 리더십 전략", titleEn: "World Leaders Who Conquered Extreme Crises: Strategy Under Threat", category: "leadership", giantSlugs: ["abraham-lincoln", "winston-churchill", "franklin-d-roosevelt"] },
  { slug: "modern-lessons-ancient-wisdom", titleKo: "고대 지혜의 현대적 활용법: 21세기 삶의 나침반", titleEn: "Applying Ancient Philosophies to 21st Century Life and Struggles", category: "wisdom", giantSlugs: ["marcus-aurelius", "seneca", "buddha"] },
  { slug: "giants-quotes-monday-morning", titleKo: "활기찬 월요일 아침을 여는 거인들의 한마디", titleEn: "10 Quotes to Start Your Week: Monday Morning Inspiration", category: "wisdom", giantSlugs: ["marcus-aurelius", "seneca", "confucius"] }
];

const LOCALES = ["ko", "en", "de", "ja", "es", "fr", "it", "pt", "ar", "hi", "ru", "zh"];
const modelId = "gemini-2.5-flash-lite";

const localeNames: Record<string, string> = {
  ko: "Korean", en: "English", de: "German", ja: "Japanese", es: "Spanish",
  fr: "French", it: "Italian", pt: "Portuguese", ar: "Arabic", hi: "Hindi",
  ru: "Russian", zh: "Simplified Chinese"
};

const langInstruction: Record<string, string> = {
  ko: "한국어로 작성. 자연스럽고 깊이 있으며 감동적인 인문학 수필 톤. 존댓말 사용.",
  en: "Write in English. Deep, engaging, and professional humanities essay tone.",
  de: "Auf Deutsch schreiben. Sachlicher, literarischer und tiefgründiger Essay-Stil.",
  ja: "日本語で書く。格調高く、説得力のある人文科学エッセイのトーン。丁寧語。",
  es: "Escribir en español. Tono ensayístico, profundo e inspirador.",
  fr: "Écrire en français. Style d'essai élégant, littéraire et profond. Utiliser le vouvoiement.",
  it: "Scrivere in italiano. Stile saggistico colto, elegante e formale.",
  pt: "Escrever em português brasileiro. Tom ensaístico, envolvente e natural.",
  ar: "اكتب باللغة العربية الفصحى. أسلوب أدبي راقٍ، ملهم وعميق.",
  hi: "हिंदी में लिखें। गंभीर, ज्ञानवर्धक और प्रेरक निबंध शैली।",
  ru: "Писать на русском. Глубокий, научно-популярный и вдохновляющий стиль.",
  zh: "用中文简体写作。深刻且富有启发性的人文散文风格。"
};

async function callGenerativeAPI(prompt: string, temperature: number = 0.7): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No GEMINI_API_KEY found in environment");
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
   IMPORTANT: For each quote included, format it cleanly as a markdown quote block starting with ">". For example:
   > "Life is not short, but we make it so by wasting it." - Seneca
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
  const outputPath = path.resolve(process.cwd(), "src/data/blog-posts-progress-ex.json");
  let blogData: Record<string, any> = {};

  if (fs.existsSync(outputPath)) {
    try {
      blogData = JSON.parse(fs.readFileSync(outputPath, "utf8"));
      console.log(`Loaded ${Object.keys(blogData).length} blog posts from progress file.`);
    } catch (e) {
      console.error("Failed to parse progress file, starting fresh.");
    }
  }

  let count = 0;
  const CONCURRENCY_LIMIT = 3;

  for (const topic of BLOG_TOPICS) {
    if (!blogData[topic.slug]) {
      blogData[topic.slug] = {
        slug: topic.slug,
        category: topic.category,
        giantSlug: topic.giantSlugs[0],
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

    const pendingLocales = [...missingLocales];
    while (pendingLocales.length > 0) {
      const batch = pendingLocales.splice(0, CONCURRENCY_LIMIT);
      console.log(`  Translating batch: ${batch.join(", ")}...`);
      
      const batchPromises = batch.map(async (locale) => {
        try {
          const post = await generateBlogPost(topic, locale, localeNames[locale]);
          currentPost.translations[locale] = post;
          console.log(`    ✓ ${locale} Done (${post.content.length} chars)`);
        } catch (err: any) {
          console.error(`    ❌ Failed for locale ${locale}:`, err.message);
          throw err;
        }
      });
      
      try {
        await Promise.all(batchPromises);
        // Save progress incrementally after each batch
        fs.writeFileSync(outputPath, JSON.stringify(blogData, null, 2), "utf8");
      } catch (err) {
        console.error("  ❌ Batch execution aborted due to failures.");
        process.exit(1); // Abort on failure
      }
      
      if (pendingLocales.length > 0) {
        await sleep(1500); // Sleep between batches to stay safe
      }
    }
  }

  console.log("\n=== ALL BLOG POSTS GENERATION COMPLETED SUCCESSFULLY ===");
}

main().catch(console.error);
