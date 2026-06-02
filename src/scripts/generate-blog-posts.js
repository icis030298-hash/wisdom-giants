const fs = require('fs');
const path = require('path');
const https = require('https');

let apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
  const envLocalPath = path.join(__dirname, '..', '..', '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const content = fs.readFileSync(envLocalPath, 'utf8');
    let match = content.match(/GEMINI_API_KEY\s*=\s*(.+)/);
    if (match) {
      apiKey = match[1].trim();
    } else {
      match = content.match(/NEXT_PUBLIC_GEMINI_API_KEY\s*=\s*(.+)/);
      if (match) {
        apiKey = match[1].trim();
      }
    }
  }
}

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY not found.");
  process.exit(1);
}

const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'blog-posts-progress.json');
const FINAL_FILE = path.join(__dirname, '..', 'data', 'blog-posts.ts');

const topics = [
  { slug: 'napoleon-leadership-lessons', category: 'leadership', giantSlug: 'napoleon-bonaparte', titleKo: '나폴레옹이 현대 CEO에게 주는 7가지 교훈' },
  { slug: 'aristotle-happiness-philosophy', category: 'philosophy', giantSlug: 'aristotle', titleKo: '아리스토텔레스가 말하는 진정한 행복이란' },
  { slug: 'leonardo-creativity-secrets', category: 'creativity', giantSlug: 'leonardo-da-vinci', titleKo: '레오나르도 다빈치의 창의성 비밀 5가지' },
  { slug: 'stoic-wisdom-marcus-aurelius', category: 'philosophy', giantSlug: 'marcus-aurelius', titleKo: '마르쿠스 아우렐리우스의 스토아 철학으로 현대의 스트레스 이겨내기' },
  { slug: 'socrates-critical-thinking', category: 'philosophy', giantSlug: 'socrates', titleKo: '소크라테스의 산파술로 배우는 비판적 사고법' },
  { slug: 'cleopatra-political-genius', category: 'wisdom', giantSlug: 'cleopatra', titleKo: '클레오파트라가 보여준 탁월한 정치적 지혜' },
  { slug: 'einstein-creative-thinking', category: 'creativity', giantSlug: 'albert-einstein', titleKo: '아인슈타인처럼 생각하는 법: 상상력이 지식보다 중요한 이유' },
  { slug: 'nietzsche-overcome-yourself', category: 'philosophy', giantSlug: 'friedrich-nietzsche', titleKo: '니체의 \'자기극복\' 철학이 현대인에게 주는 메시지' },
  { slug: 'sun-tzu-strategy-modern-life', category: 'leadership', giantSlug: 'sun-tzu', titleKo: '손자병법을 현대 비즈니스에 적용하는 법' },
  { slug: 'confucius-wisdom-relationships', category: 'wisdom', giantSlug: 'confucius', titleKo: '공자의 인(仁) 사상으로 배우는 인간관계의 지혜' },
  { slug: 'plato-ideal-society', category: 'philosophy', giantSlug: 'plato', titleKo: '플라톤의 이상 국가론이 현대 사회에 던지는 질문' },
  { slug: 'galileo-courage-truth', category: 'wisdom', giantSlug: 'galileo-galilei', titleKo: '갈릴레오의 용기: 진실을 위해 세상과 맞서는 법' },
  { slug: 'queen-elizabeth-leadership', category: 'leadership', giantSlug: 'elizabeth-i', titleKo: '엘리자베스 1세가 보여준 여성 리더십의 본질' },
  { slug: 'tesla-visionary-thinking', category: 'creativity', giantSlug: 'nikola-tesla', titleKo: '니콜라 테슬라: 100년을 앞선 천재의 사고방식' },
  { slug: 'gandhi-nonviolent-resistance', category: 'philosophy', giantSlug: 'mahatma-gandhi', titleKo: '간디의 비폭력 저항이 현대에 주는 교훈' },
  { slug: 'marie-curie-perseverance', category: 'wisdom', giantSlug: 'marie-curie', titleKo: '마리 퀴리가 보여준 역경 속 불굴의 의지' },
  { slug: 'alexander-great-ambition', category: 'leadership', giantSlug: 'alexander-the-great', titleKo: '알렉산더 대왕의 야망: 꿈의 크기가 성취를 결정한다' },
  { slug: 'seneca-time-management', category: 'philosophy', giantSlug: 'seneca', titleKo: '세네카가 말하는 시간 관리: 우리는 왜 항상 바쁜가' },
  { slug: 'king-sejong-innovation', category: 'leadership', giantSlug: 'king-sejong', titleKo: '세종대왕의 혁신 리더십: 훈민정음이 탄생한 이유' },
  { slug: 'joan-of-arc-conviction', category: 'wisdom', giantSlug: 'joan-of-arc', titleKo: '잔 다르크의 신념: 불가능을 가능으로 만드는 힘' }
];

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
      path: `/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
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

function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    } catch (e) {
      console.warn("Failed to load progress file, starting fresh:", e.message);
    }
  }
  return {};
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function getPublishDate(slugIndex) {
  // Generates unique dates starting from 2026-05-01 backwards or forwards to make them unique
  const day = 1 + slugIndex;
  const dayStr = day < 10 ? `0${day}` : `${day}`;
  return `2026-05-${dayStr}`;
}

async function run() {
  console.log("Starting multilingual blog posts generation...");
  const progress = loadProgress();

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    console.log(`\n==========================================`);
    console.log(`[POST ${i + 1}/20] Slug: ${topic.slug}`);
    console.log(`==========================================`);

    if (!progress[topic.slug]) {
      progress[topic.slug] = {
        slug: topic.slug,
        category: topic.category,
        giantSlug: topic.giantSlug,
        publishedAt: getPublishDate(i),
        translations: {}
      };
    }

    const post = progress[topic.slug];

    // GROUP 1: ko, ja (Asian languages, 1500+ chars each)
    if (!post.translations.ko || !post.translations.ja) {
      console.log("Generating Group 1: ko, ja...");
      const prompt = `You are an expert human historian, essayist and premium copywriter. Write a deeply engaging, professional, and natural-sounding blog post on the topic: "${topic.titleKo}" related to the historical figure "${topic.giantSlug}".
Generate this post in 2 languages: Korean (ko) and Japanese (ja).
For each language, return the exact JSON structure:
{
  "ko": {
    "title": "Engaging Korean title suitable for this post",
    "description": "SEO description in Korean, ~150 characters, summarizing the main theme.",
    "content": "Deep, monumental, and long-form blog post. MUST BE AT LEAST 1,600 CHARACTERS including spaces. Structure: 2-3 paragraphs of Introduction, 3-4 distinct H2 headings with comprehensive historical analysis and modern relevance, a dedicated '현대적 삶을 위한 실천적 교훈' section, and a Conclusion concluding with the exact CTA sentence: '이 위인과 직접 대화해보세요'"
  },
  "ja": {
    "title": "Engaging Japanese title suitable for this post",
    "description": "SEO description in Japanese, ~150 characters, summarizing the main theme.",
    "content": "Deep, monumental, and long-form blog post. MUST BE AT LEAST 1,600 CHARACTERS including spaces. Structure: 2-3 paragraphs of Introduction, 3-4 distinct H2 headings with comprehensive historical analysis and modern relevance, a dedicated '現代の生活のための実践的な教訓' section, and a Conclusion concluding with the exact CTA sentence: 'この偉人と直接対話してみてください。'"
  }
}

CRITICAL RULES:
1. Write in a premium, elegant, and highly engaging human-like expert tone.
2. Absolutely DO NOT use any AI clichés or boilerplate phrases such as 'It is worth noting', 'Furthermore', 'Moreover', 'In summary', 'Lastly', 'Testament to', 'In conclusion', 'Delve into', 'Worth mentioning'.
3. The content must be detailed, long-form, and highly substantive. Ensure ko and ja contents are EACH at least 1,600 characters long including spaces.
Return ONLY the raw JSON object matching the requested structure.`;

      try {
        const result = await callWithRetry(prompt);
        if (result.ko && result.ja) {
          post.translations.ko = result.ko;
          post.translations.ja = result.ja;
          console.log(`  ✓ Generated ko (${result.ko.content.length} chars)`);
          console.log(`  ✓ Generated ja (${result.ja.content.length} chars)`);
          saveProgress(progress);
        } else {
          throw new Error("Missing ko or ja in model response.");
        }
      } catch (err) {
        console.error(`❌ Failed to generate Group 1 for ${topic.slug}:`, err.message);
        process.exit(1);
      }
      await new Promise(r => setTimeout(r, 2000));
    } else {
      console.log("  ✓ Group 1 (ko, ja) already exists.");
    }

    // GROUP 2: en, de (en: 800+ words, de: 1200+ words)
    if (!post.translations.en || !post.translations.de) {
      console.log("Generating Group 2: en, de...");
      const prompt = `You are an expert human historian, essayist and premium copywriter. Write a deeply engaging, professional, and natural-sounding blog post on the topic: "${topic.titleKo}" related to the historical figure "${topic.giantSlug}".
Generate this post in 2 languages: English (en) and German (de).
For each language, return the exact JSON structure:
{
  "en": {
    "title": "Engaging English title suitable for this post",
    "description": "SEO description in English, ~150 characters, summarizing the main theme.",
    "content": "Deep, monumental, and long-form blog post. MUST BE AT LEAST 850 WORDS. Structure: 2-3 paragraphs of Introduction, 3-4 distinct H2 headings with comprehensive historical analysis and modern relevance, a dedicated 'Practical Lessons for Modern Life' section, and a Conclusion concluding with the exact CTA sentence: 'Try talking directly with this giant.'"
  },
  "de": {
    "title": "Engaging German title suitable for this post",
    "description": "SEO description in German, ~150 characters, summarizing the main theme.",
    "content": "Deep, monumental, and long-form blog post in high literary German. MUST BE AT LEAST 1,250 WORDS. Structure: 2-3 paragraphs of Introduction, 3-4 distinct H2 headings in past tense narrative (Präteritum) with comprehensive historical analysis and modern relevance, a dedicated 'Praktische Lektionen für das moderne Leben' section, and a Conclusion concluding with the exact CTA sentence: 'Sprechen Sie direkt mit diesem Giganten.'"
  }
}

CRITICAL RULES:
1. Write in a premium, elegant, and highly engaging human-like expert tone.
2. Absolutely DO NOT use any AI clichés or boilerplate phrases such as 'It is worth noting', 'Furthermore', 'Moreover', 'In summary', 'Lastly', 'Testament to', 'In conclusion', 'Delve into', 'Worth mentioning'.
3. The content must be detailed, long-form, and highly substantive. Ensure en is at least 850 words and de is at least 1,250 words.
Return ONLY the raw JSON object matching the requested structure.`;

      try {
        const result = await callWithRetry(prompt);
        if (result.en && result.de) {
          post.translations.en = result.en;
          post.translations.de = result.de;
          console.log(`  ✓ Generated en (${result.en.content.split(/\s+/).length} words)`);
          console.log(`  ✓ Generated de (${result.de.content.split(/\s+/).length} words)`);
          saveProgress(progress);
        } else {
          throw new Error("Missing en or de in model response.");
        }
      } catch (err) {
        console.error(`❌ Failed to generate Group 2 for ${topic.slug}:`, err.message);
        process.exit(1);
      }
      await new Promise(r => setTimeout(r, 2000));
    } else {
      console.log("  ✓ Group 2 (en, de) already exists.");
    }

    // GROUP 3: es, fr (800+ words each)
    if (!post.translations.es || !post.translations.fr) {
      console.log("Generating Group 3: es, fr...");
      const prompt = `You are an expert human historian, essayist and premium copywriter. Write a deeply engaging, professional, and natural-sounding blog post on the topic: "${topic.titleKo}" related to the historical figure "${topic.giantSlug}".
Generate this post in 2 languages: Spanish (es) and French (fr).
For each language, return the exact JSON structure:
{
  "es": {
    "title": "Engaging Spanish title suitable for this post",
    "description": "SEO description in Spanish, ~150 characters, summarizing the main theme.",
    "content": "Deep, monumental, and long-form blog post in elegant Spanish. MUST BE AT LEAST 850 WORDS. Structure: 2-3 paragraphs of Introduction, 3-4 distinct H2 headings with comprehensive historical analysis and modern relevance, a dedicated 'Lecciones prácticas para la vida moderna' section, and a Conclusion concluding with the exact CTA sentence: 'Prueba a hablar directamente con este gigante.'"
  },
  "fr": {
    "title": "Engaging French title suitable for this post",
    "description": "SEO description in French, ~150 characters, summarizing the main theme.",
    "content": "Deep, monumental, and long-form blog post in elegant literary French. MUST BE AT LEAST 850 WORDS. Structure: 2-3 paragraphs of Introduction, 3-4 distinct H2 headings with comprehensive historical analysis and modern relevance, a dedicated 'Leçons pratiques pour la vie moderne' section, and a Conclusion concluding with the exact CTA sentence: 'Essayez de parler directement avec ce géant.'"
  }
}

CRITICAL RULES:
1. Write in a premium, elegant, and highly engaging human-like expert tone.
2. Absolutely DO NOT use any AI clichés or boilerplate phrases such as 'It is worth noting', 'Furthermore', 'Moreover', 'In summary', 'Lastly', 'Testament to', 'In conclusion', 'Delve into', 'Worth mentioning'.
3. The content must be detailed, long-form, and highly substantive. Ensure es and fr contents are EACH at least 850 words.
Return ONLY the raw JSON object matching the requested structure.`;

      try {
        const result = await callWithRetry(prompt);
        if (result.es && result.fr) {
          post.translations.es = result.es;
          post.translations.fr = result.fr;
          console.log(`  ✓ Generated es (${result.es.content.split(/\s+/).length} words)`);
          console.log(`  ✓ Generated fr (${result.fr.content.split(/\s+/).length} words)`);
          saveProgress(progress);
        } else {
          throw new Error("Missing es or fr in model response.");
        }
      } catch (err) {
        console.error(`❌ Failed to generate Group 3 for ${topic.slug}:`, err.message);
        process.exit(1);
      }
      await new Promise(r => setTimeout(r, 2000));
    } else {
      console.log("  ✓ Group 3 (es, fr) already exists.");
    }

    // GROUP 4: it, pt (800+ words each)
    if (!post.translations.it || !post.translations.pt) {
      console.log("Generating Group 4: it, pt...");
      const prompt = `You are an expert human historian, essayist and premium copywriter. Write a deeply engaging, professional, and natural-sounding blog post on the topic: "${topic.titleKo}" related to the historical figure "${topic.giantSlug}".
Generate this post in 2 languages: Italian (it) and Portuguese (pt).
For each language, return the exact JSON structure:
{
  "it": {
    "title": "Engaging Italian title suitable for this post",
    "description": "SEO description in Italian, ~150 characters, summarizing the main theme.",
    "content": "Deep, monumental, and long-form blog post in elegant Italian. MUST BE AT LEAST 850 WORDS. Structure: 2-3 paragraphs of Introduction, 3-4 distinct H2 headings with comprehensive historical analysis and modern relevance, a dedicated 'Lezioni pratiche per la vita moderna' section, and a Conclusion concluding with the exact CTA sentence: 'Prova a parlare direttamente con questo gigante.'"
  },
  "pt": {
    "title": "Engaging Portuguese title suitable for this post",
    "description": "SEO description in Portuguese, ~150 characters, summarizing the main theme.",
    "content": "Deep, monumental, and long-form blog post in elegant Portuguese. MUST BE AT LEAST 850 WORDS. Structure: 2-3 paragraphs of Introduction, 3-4 distinct H2 headings with comprehensive historical analysis and modern relevance, a dedicated 'Lições práticas para a vida moderna' section, and a Conclusion concluding with the exact CTA sentence: 'Experimente falar diretamente com este gigante.'"
  }
}

CRITICAL RULES:
1. Write in a premium, elegant, and highly engaging human-like expert tone.
2. Absolutely DO NOT use any AI clichés or boilerplate phrases such as 'It is worth noting', 'Furthermore', 'Moreover', 'In summary', 'Lastly', 'Testament to', 'In conclusion', 'Delve into', 'Worth mentioning'.
3. The content must be detailed, long-form, and highly substantive. Ensure it and pt contents are EACH at least 850 words.
Return ONLY the raw JSON object matching the requested structure.`;

      try {
        const result = await callWithRetry(prompt);
        if (result.it && result.pt) {
          post.translations.it = result.it;
          post.translations.pt = result.pt;
          console.log(`  ✓ Generated it (${result.it.content.split(/\s+/).length} words)`);
          console.log(`  ✓ Generated pt (${result.pt.content.split(/\s+/).length} words)`);
          saveProgress(progress);
        } else {
          throw new Error("Missing it or pt in model response.");
        }
      } catch (err) {
        console.error(`❌ Failed to generate Group 4 for ${topic.slug}:`, err.message);
        process.exit(1);
      }
      await new Promise(r => setTimeout(r, 2000));
    } else {
      console.log("  ✓ Group 4 (it, pt) already exists.");
    }
  }

  // ALL 20 posts fully generated! Now compile and write them as a TypeScript file.
  console.log("\nAll blog posts successfully generated! Compiling final src/data/blog-posts.ts file...");
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
  console.error("FATAL ERROR running generator:", err);
});
