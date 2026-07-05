import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environmental variables
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (fs.existsSync(path.resolve('.env'))) {
  dotenv.config({ path: path.resolve('.env') });
}

const BLOG_POSTS_FILE = path.resolve('src/data/blog-posts.ts');
const OUTPUT_BACKUP_FILE = path.resolve('scratch/translations/blog-full-checkpoint.json');

// All languages minus ko, en
const TARGET_LOCALES = ['ar', 'zh', 'nl', 'fr', 'de', 'el', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'fa', 'pl', 'pt', 'ru', 'es', 'sw', 'th', 'tr', 'uk', 'vi'];

// Initialize GoogleGenAI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const modelName = 'gemini-2.5-flash';

// Sleep helper
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

interface TranslationData {
  title: string;
  description: string;
  content: string;
}

interface PilotResult {
  [slug: string]: {
    [locale: string]: TranslationData;
  };
}

async function translateText(sourceText: string, targetLang: string, type: 'title' | 'description' | 'content'): Promise<string> {
  let extraConstraints = "";
  if (type === 'title') {
    extraConstraints = "Do NOT use markdown bold formatting (`**`) in the title. Just output plain text for the title.";
  }

  const prompt = `You are a professional blog translator.
Translate the following blog ${type} from English into ${targetLang}.
Maintain the original markdown formatting (for body content), tone, and constraints.
CRITICAL RULES:
- Do NOT output any English words or mixed language.
- Translate all adjectives, adverbs, and common nouns into the target language. Proper nouns (like names) can be transliterated.
- Ensure the translation flows naturally and feels engaging for the reader in ${targetLang}.
${extraConstraints}

English Blog ${type}:
${sourceText}

Translation:`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      temperature: 0.2,
      maxOutputTokens: 8192,
    }
  });

  const textResult = response.text;
  if (!textResult) {
    throw new Error(`Failed to get translation response for ${type}`);
  }
  return textResult.trim();
}

function detectEnglishLeak(text: string, type: string, locale: string) {
  // Simple heuristic: 3 or more consecutive English letters
  const leakRegex = /[a-zA-Z]{3,}/g;
  const matches = text.match(leakRegex);
  if (matches) {
    // Some names like "Rockefeller", "Carnegie" are fine, but flag as warning
    console.warn(`    [QA Warning] Possible English leak in [${locale}] ${type}: ${matches.join(', ')}`);
  }
}

async function main() {
  console.log(`=== Starting Full Blog Translation (${modelName}) ===`);
  console.log(`Target Languages: ${TARGET_LOCALES.length} locales`);
  
  // Dynamic import
  const { blogPosts } = require('../src/data/blog-posts');
  console.log(`Total Blog Posts: ${blogPosts.length}`);
  
  let pilotResults: PilotResult = {};
  
  const dir = path.dirname(OUTPUT_BACKUP_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(OUTPUT_BACKUP_FILE)) {
    console.log("Loading existing checkpoint...");
    pilotResults = JSON.parse(fs.readFileSync(OUTPUT_BACKUP_FILE, 'utf8'));
  }
  
  for (const locale of TARGET_LOCALES) {
    console.log(`\n>>> Starting translation for locale: [${locale}]`);
    let localeCount = 0;
    
    for (const post of blogPosts) {
      const slug = post.slug;
      if (!pilotResults[slug]) pilotResults[slug] = {};
      
      // Check if already translated
      if (pilotResults[slug][locale] && pilotResults[slug][locale].content && pilotResults[slug][locale].content.length > 50) {
        continue; 
      }
      if (post.translations?.[locale] && post.translations[locale].content && post.translations[locale].content.length > 50) {
        // Skip if exists in memory with substantial content
        continue;
      }
      
      const englishTrans = post.translations?.en;
      if (!englishTrans) {
        console.error(`[ERROR] English translation source not found for: ${slug}`);
        continue;
      }
      
      console.log(`  [${locale}] Translating ${slug}...`);
      try {
        // Translate title
        const titleTrans = await translateText(englishTrans.title, locale, 'title');
        detectEnglishLeak(titleTrans, 'title', locale);
        await sleep(1000);
        
        // Translate description
        const descTrans = await translateText(englishTrans.description, locale, 'description');
        detectEnglishLeak(descTrans, 'description', locale);
        await sleep(1000);
        
        // Translate content
        const contentTrans = await translateText(englishTrans.content, locale, 'content');
        detectEnglishLeak(contentTrans, 'content', locale);
        
        pilotResults[slug][locale] = {
          title: titleTrans.replace(/\*\*/g, ''), // Strip markdown bold from title just in case
          description: descTrans,
          content: contentTrans
        };
        
        // Save checkpoint every success
        fs.writeFileSync(OUTPUT_BACKUP_FILE, JSON.stringify(pilotResults, null, 2), 'utf8');
        localeCount++;
        
        await sleep(1500); // Guard delay
      } catch (err: any) {
        console.error(`  ❌ Failed translation for [${locale}] - ${slug}:`, err.message);
        await sleep(5000); // Backoff on error
      }
    }
    
    console.log(`<<< Finished locale: [${locale}], translated ${localeCount} new posts.`);
  }

  // Inject translations back into memory object
  console.log("\nInjecting translations back into memory objects...");
  for (const slug of Object.keys(pilotResults)) {
    const post = blogPosts.find((p: any) => p.slug === slug);
    if (post) {
      if (!post.translations) post.translations = {};
      for (const locale of Object.keys(pilotResults[slug])) {
        post.translations[locale] = pilotResults[slug][locale];
      }
    }
  }

  console.log("Writing changes back to blog-posts.ts...");
  const fileHeader = `export interface BlogPost {
  slug: string;
  category: 'leadership' | 'philosophy' | 'creativity' | 'wisdom' | 'science' | 'arts' | 'society' | 'business';
  giantSlug?: string;
  giantSlugs?: string[];
  relatedGiants?: string[];
  relatedBlogPosts?: string[];
  publishedAt: string;
  translations: {
    [locale: string]: {
      title: string;
      description: string;
      content: string;
    };
  };
}

export const blogPosts: BlogPost[] = `;

  fs.writeFileSync(BLOG_POSTS_FILE, fileHeader + JSON.stringify(blogPosts, null, 2) + ';\n', 'utf8');
  console.log("\n🎉 Full blog translation completed successfully!");
}

main().catch(err => {
  console.error("Fatal error:", err);
});
