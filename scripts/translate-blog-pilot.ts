import fs from 'fs';
import path from 'path';
import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';

// Load environmental variables
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const BLOG_POSTS_FILE = path.resolve('src/data/blog-posts.ts');
const OUTPUT_BACKUP_FILE = path.resolve('scratch/translations/blog-pilot-translations.json');

// Pilot configurations
const TARGET_SLUGS = [
  'rockefeller-monopoly-guide',
  'carnegie-gospel-wealth',
  'disney-imagination-market'
];
const TARGET_LOCALES = ['es', 'ja', 'ar'];

// Initialize Vertex AI with the correct Firebase project ID
const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'giantswisdom-8dc26'; // Corrected Project ID
const location = 'us-central1';
const vertex_ai = new VertexAI({ project, location });
const model = vertex_ai.preview.getGenerativeModel({
  model: 'gemini-2.5-flash-lite', // Using Flash-Lite for cost optimization
});

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
  const prompt = `You are a professional blog translator.
Translate the following blog ${type} from English into ${targetLang}.
Maintain the original markdown formatting, tone, and formatting constraints. 
Ensure the translation flows naturally and feels engaging for the reader.

English Blog ${type}:
${sourceText}

Translation:`;

  const response = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 8192,
    }
  });

  const textResult = response.response?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResult) {
    throw new Error(`Failed to get translation response for ${type}`);
  }
  return textResult.trim();
}

async function main() {
  console.log("=== Starting Blog Translation Flash-Lite Pilot ===");
  console.log(`GCP Project: ${project}`);
  console.log(`Target Posts: ${TARGET_SLUGS.join(', ')}`);
  console.log(`Target Languages: ${TARGET_LOCALES.join(', ')}`);
  
  // We import dynamically to get the current structured data
  const { blogPosts } = require('../src/data/blog-posts');
  
  const pilotResults: PilotResult = {};
  
  for (const slug of TARGET_SLUGS) {
    const post = blogPosts.find((p: any) => p.slug === slug);
    if (!post) {
      console.warn(`[WARNING] Post not found for slug: ${slug}`);
      continue;
    }
    
    console.log(`\nProcessing post: ${slug}...`);
    pilotResults[slug] = {};
    
    const englishTrans = post.translations?.en;
    if (!englishTrans) {
      console.error(`[ERROR] English translation source not found for: ${slug}`);
      continue;
    }
    
    for (const locale of TARGET_LOCALES) {
      console.log(`  Translating into [${locale}] using Gemini 2.5 Flash Lite...`);
      try {
        // Translate title
        const titleTrans = await translateText(englishTrans.title, locale, 'title');
        await sleep(1500); // Guard delay
        
        // Translate description
        const descTrans = await translateText(englishTrans.description, locale, 'description');
        await sleep(1500); // Guard delay
        
        // Translate content (which is markdown text)
        const contentTrans = await translateText(englishTrans.content, locale, 'content');
        
        pilotResults[slug][locale] = {
          title: titleTrans,
          description: descTrans,
          content: contentTrans
        };
        
        console.log(`  ✓ Translation succeeded for [${locale}]`);
        await sleep(2000); // Interval delay
      } catch (err: any) {
        console.error(`  ❌ Failed translation for [${locale}]:`, err.message);
      }
    }
  }

  // Save translation chunks backup
  const dir = path.dirname(OUTPUT_BACKUP_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OUTPUT_BACKUP_FILE, JSON.stringify(pilotResults, null, 2), 'utf8');
  console.log(`\n✓ Backup saved to: ${OUTPUT_BACKUP_FILE}`);

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

  // Save changes back to src/data/blog-posts.ts using template replacement to preserve TS exports & imports structure
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
  console.log("\n🎉 Blog translation pilot inject completed successfully!");
}

main().catch(err => {
  console.error("Fatal pilot error:", err);
});
