const fs = require('fs');
const path = require('path');
const https = require('https');

require('dotenv').config({ path: '.env.local' });

let apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
if (!apiKey) {
  const envLocalPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const content = fs.readFileSync(envLocalPath, 'utf8');
    const match = content.match(/GEMINI_API_KEY\s*=\s*(.+)/);
    if (match) apiKey = match[1].trim();
  }
}

const PROGRESS_FILE = path.join(__dirname, '..', 'src', 'data', 'blog-posts-progress.json');
const FINAL_FILE = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');

// Target flawed slugs
const flawedSlugs = [
  'washington-sejong-nation-builders',
  'curie-breaking-glass-ceiling',
  'franklin-tactical-networking',
  'ford-automation-paradox',
  'genghis-khan-startup-leadership',
  'hemingway-vangogh-art-pain',
  'keller-gandhi-invisible-power',
  'da-vinci-time-management',
  'mark-twain-humor-wit'
];

const topics = [
  { slug: 'tesla-edison-current-war', category: 'creativity', giantSlug: 'thomas-edison', titleKo: '니콜라 테슬라 vs 토마스 에디슨: 전류 전쟁과 혁신의 충돌' },
  { slug: 'rockefeller-monopoly-guide', category: 'leadership', giantSlug: 'john-d-rockefeller', titleKo: '존 D. 록펠러의 독점 비법: 시장을 지배하는 비정하고 차가운 원칙들' },
  { slug: 'ford-automation-paradox', category: 'leadership', giantSlug: 'henry-ford', titleKo: '헨리 포드와 자동화의 역설: 인공지능(AI) 시대에 던지는 메시지' },
  { slug: 'carnegie-gospel-wealth', category: 'wisdom', giantSlug: 'andrew-carnegie', titleKo: '앤드루 카네기의 부의 복음: 가장 존경받는 모습으로 세상을 떠나는 방법' },
  { slug: 'disney-imagination-market', category: 'creativity', giantSlug: 'walt-disney', titleKo: '월트 디즈니: 순수한 상상력을 수십억 달러의 시장으로 바꾸는 연금술' },
  { slug: 'sun-tzu-alexander-conquest', category: 'leadership', giantSlug: 'sun-tzu', titleKo: '손무와 알렉산더 대왕: 세상을 정복하는 서로 다른 두 가지 길' },
  { slug: 'washington-sejong-nation-builders', category: 'leadership', giantSlug: 'king-sejong', titleKo: '조지 워싱턴과 세종대왕: 위대한 국가 건설자들의 리더십 청사진' },
  { slug: 'caesar-caocao-pragmatism', category: 'philosophy', giantSlug: 'julius-caesar', titleKo: '율리우스 카이사르와 조조: 극단적 실용주의 뒤에 숨겨진 냉철한 심리학' },
  { slug: 'elizabeth-wu-zetian-iron-queens', category: 'leadership', giantSlug: 'elizabeth-i', titleKo: '엘리자베스 1세와 측천무후: 남성들의 제국을 지배한 철의 여제들' },
  { slug: 'genghis-khan-startup-leadership', category: 'leadership', giantSlug: 'genghis-khan', titleKo: '칭기즈칸의 전격전: 현대 스타트업을 위한 분산형 리더십 교훈' },
  { slug: 'oppenheimer-genius-regret', category: 'wisdom', giantSlug: 'robert-oppenheimer', titleKo: '로버트 오펜하이머의 후회: 천재들이 짊어져야 할 무거운 심리적 멍에' },
  { slug: 'hemingway-vangogh-art-pain', category: 'creativity', giantSlug: 'ernest-hemingway', titleKo: '어니스트 헤밍웨이와 빈센트 반 고흐: 고통을 불멸의 예술로 승화시키는 무기화' },
  { slug: 'lincoln-leadership-depression', category: 'wisdom', giantSlug: 'abraham-lincoln', titleKo: '에이브러햄 링컨의 비밀 전쟁: 우울증과 싸우며 분열된 국가를 구하는 법' },
  { slug: 'curie-breaking-glass-ceiling', category: 'wisdom', giantSlug: 'marie-curie', titleKo: '마리 퀴리: 20세기 기초 과학의 유리천장을 깨뜨린 불굴의 집념' },
  { slug: 'keller-gandhi-invisible-power', category: 'philosophy', giantSlug: 'helen-keller', titleKo: '헬렌 켈러와 간디: 백만 군대를 움직인 눈에 보이지 않는 거대한 힘' },
  { slug: 'da-vinci-time-management', category: 'creativity', giantSlug: 'leonardo-da-vinci', titleKo: '레오나르도 다빈치의 다크 시간 관리론: 시간을 극대화하는 5가지 비밀' },
  { slug: 'franklin-tactical-networking', category: 'wisdom', giantSlug: 'benjamin-franklin', titleKo: '벤자민 프랭클린이 사교계를 공략한 방식: 전술적 인맥 형성의 예술' },
  { slug: 'mark-twain-humor-wit', category: 'creativity', giantSlug: 'mark-twain', titleKo: '마크 트웨인의 유머와 위트: 잔인한 세상에서 풍자와 풍자성을 무기화하는 법' },
  { slug: 'feynman-technique-learning', category: 'creativity', giantSlug: 'albert-einstein', titleKo: '파인만 공부법: 복잡하고 어려운 지식을 번개 같은 속도로 마스터하는 핵심 기법' },
  { slug: 'poe-obsession-psychology', category: 'philosophy', giantSlug: 'edgar-allan-poe', titleKo: '에드거 앨런 포와 인간 집착의 어두운 심리학' }
];

function cleanString(str) {
  if (!str) return '';
  let cleaned = str.replace(/\uFFFD/g, '');
  cleaned = cleaned.replace(/###\s*\*\*([^*]+)\*\*/g, '### $1');
  cleaned = cleaned.replace(/##\s*\*\*([^*]+)\*\*/g, '## $1');
  return cleaned;
}

function callGemini(prompt) {
  return new Promise((resolve, reject) => {
    const requestData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 8192
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      method: 'POST',
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            reject(new Error(`API Status ${res.statusCode}: ${data}`));
            return;
          }
          const json = JSON.parse(data);
          if (json.candidates && json.candidates[0]?.content?.parts[0]?.text) {
            const rawText = json.candidates[0].content.parts[0].text.trim();
            const parsedObj = JSON.parse(rawText);
            resolve(parsedObj);
          } else {
            reject(new Error(`Invalid API Response Structure: ${data}`));
          }
        } catch (err) {
          reject(new Error(`Failed to parse API response: ${err.message}. Raw: ${data.slice(0, 300)}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy(new Error('Request timed out after 120 seconds'));
    });
    req.on('error', reject);
    req.write(requestData);
    req.end();
  });
}

async function callWithRetry(prompt, retries = 5, delay = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await callGemini(prompt);
    } catch (err) {
      console.warn(`[Attempt ${attempt}/${retries}] failed: ${err.message}`);
      if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('Quota exceeded')) {
        console.warn(`Rate limit hit! Sleeping for 65 seconds...`);
        await new Promise(r => setTimeout(r, 65000));
        attempt--;
        continue;
      }
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, delay * attempt));
    }
  }
}

async function run() {
  console.log("Starting regeneration of flawed blog posts...");
  
  if (!fs.existsSync(PROGRESS_FILE)) {
    console.error("Progress file not found.");
    process.exit(1);
  }

  const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));

  // Delete target entries from progress to force regeneration
  flawedSlugs.forEach(slug => {
    if (progress[slug]) {
      delete progress[slug];
      console.log(`Cleared progress for: ${slug}`);
    }
  });

  const targets = topics.filter(t => flawedSlugs.includes(t.slug));

  for (let i = 0; i < targets.length; i++) {
    const topic = targets[i];
    console.log(`\n==========================================`);
    console.log(`[REGENERATE ${i + 1}/${targets.length}] Slug: ${topic.slug}`);
    console.log(`==========================================`);

    progress[topic.slug] = {
      slug: topic.slug,
      category: topic.category,
      giantSlug: topic.giantSlug,
      publishedAt: `2026-05-${String(topics.findIndex(t => t.slug === topic.slug) + 1).padStart(2, '0')}`,
      translations: {}
    };

    const post = progress[topic.slug];

    const prompt = `You are a premium historian, essayist, and SEO-copywriter. Write a deeply detailed, structured, and narrative-driven blog post on: "${topic.titleKo}" related to the historical figure "${topic.giantSlug}".
Generate this post in 3 languages: Korean (ko), English (en), and Japanese (ja).

STRICT COMPLIANCE RULES:
1. Strict Translation Isolation:
   - For English (en) and Japanese (ja) content, ABSOLUTELY DO NOT include any Korean characters. All Korean proper nouns (like "훈민정음" or "앙부일구") must be transliterated into English phonetics (e.g. "Hunminjeongeum" in English, "Hunminjeongeum" or "フンミンジョンウム" in Japanese) or standard translations.
2. Word / Char Limits:
   - ko: MUST BE AT LEAST 1,700 CHARACTERS including spaces.
   - ja: MUST BE AT LEAST 1,700 CHARACTERS including spaces.
   - en: MUST BE AT LEAST 950 WORDS.
3. Joan of Arc Structure:
   - Introduction (exactly 2 long paragraphs connecting historical context to modern career/business/depression/startup challenges).
   - At least 4 distinct H3 headings (using '###'). Ensure they do not contain bold asterisks '**'.
   - 4th H3 heading is a practical guide using numbered items:
     - ko: "첫째,", "둘째,", "셋째,", "넷째,"
     - en: "1. ", "2. ", "3. ", "4. "
     - ja: "第一に、", "第二に、", "第三に、", "第四に、"
   - Concluding CTA paragraph ending with the link:
     - ko: "[글로만 읽던 이 거인과 지금 바로 직접 대화하며 자네의 문제를 상담해 보게](/giant/${topic.giantSlug})"
     - en: "[If you wish to discuss your problems directly with this giant, start a 1:1 chat room here](/giant/${topic.giantSlug})"
     - ja: "[この偉人と直接対話して、あなたの悩みを相談してみてください。](/giant/${topic.giantSlug})"

Return ONLY a valid JSON object matching the schema below:
{
  "ko": {
    "title": "Inspiring and clickable SEO-optimized Korean title",
    "description": "SEO description in Korean (~150 chars).",
    "content": "Deep, long-form blog post matching the rules."
  },
  "en": {
    "title": "Inspiring and clickable SEO-optimized English title",
    "description": "SEO description in English (~150 chars).",
    "content": "Deep, long-form blog post matching the rules."
  },
  "ja": {
    "title": "Inspiring and clickable SEO-optimized Japanese title",
    "description": "SEO description in Japanese (~150 chars).",
    "content": "Deep, long-form blog post matching the rules."
  }
}`;

    try {
      const result = await callWithRetry(prompt);
      if (result.ko && result.en && result.ja) {
        post.translations.ko = {
          title: cleanString(result.ko.title),
          description: cleanString(result.ko.description),
          content: cleanString(result.ko.content)
        };
        post.translations.en = {
          title: cleanString(result.en.title),
          description: cleanString(result.en.description),
          content: cleanString(result.en.content)
        };
        post.translations.ja = {
          title: cleanString(result.ja.title),
          description: cleanString(result.ja.description),
          content: cleanString(result.ja.content)
        };

        const fallbackLanguages = ['de', 'es', 'fr', 'it', 'pt'];
        fallbackLanguages.forEach(lang => {
          post.translations[lang] = {
            title: post.translations.en.title,
            description: post.translations.en.description,
            content: post.translations.en.content
          };
        });

        console.log(`  ✓ Regenerated ko (${post.translations.ko.content.length} chars)`);
        console.log(`  ✓ Regenerated en (${post.translations.en.content.split(/\s+/).length} words)`);
        console.log(`  ✓ Regenerated ja (${post.translations.ja.content.length} chars)`);
        
        fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf8');
      } else {
        throw new Error("Missing ko, en, or ja translations.");
      }
    } catch (err) {
      console.error(`❌ Failed to regenerate translations for ${topic.slug}:`, err.message);
      process.exit(1);
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  // Compile final src/data/blog-posts.ts file
  console.log("\nCompiling final src/data/blog-posts.ts file...");
  const compiledPosts = Object.values(progress);

  const fileContent = `export interface BlogPost {
  slug: string;
  category: 'leadership' | 'philosophy' | 'creativity' | 'wisdom';
  giantSlug: string;
  publishedAt: string;
  translations: {
    [locale: string]: {
      title: string;
      description: string;
      content: string;
    };
  };
}

export const blogPosts: BlogPost[] = ${JSON.stringify(compiledPosts, null, 2)};
`;

  fs.writeFileSync(FINAL_FILE, fileContent, 'utf8');
  console.log(`💾 Final blog posts compiled and saved to ${FINAL_FILE}!`);
}

run().catch(err => {
  console.error("FATAL ERROR running flawed posts regenerator:", err);
});
