import { validateTranslationItem } from '../src/lib/injection-gate';
import { blogPosts, BlogPost } from '../src/data/blog-posts';
import * as fs from 'fs';
import * as path from 'path';

const scratchDir = path.join(__dirname, '..', 'scratch');
const batchesDir = path.join(scratchDir, 'batches');

const allBatchFiles = fs.readdirSync(batchesDir).filter(f => f.startsWith('out_') && f.endsWith('.json')).map(f => path.join(batchesDir, f));
const pilotFiles = fs.readdirSync(scratchDir).filter(f => f.startsWith('out_') && f.endsWith('_pilot.json')).map(f => path.join(scratchDir, f));

const allFiles = [...allBatchFiles, ...pilotFiles];

let totalInput = 0;
let totalPassed = 0;
let totalBlocked = 0;
const blockedList: any[] = [];
const validItemsToInject: any[] = [];

console.log(`Found ${allFiles.length} output files (${allBatchFiles.length} batch files, ${pilotFiles.length} pilot files)`);

allFiles.forEach(fullPath => {
  try {
    const items = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    if (Array.isArray(items)) {
      items.forEach((item: any) => {
        if (!item || !item.slug || !item.locale) return;
        totalInput++;
        const enPost = blogPosts.find(p => p.slug === item.slug);
        const enTitle = enPost?.translations['en']?.title || '';
        const gateRes = validateTranslationItem({ ...item, enTitle }, new Map());
        if (gateRes.valid) {
          totalPassed++;
          validItemsToInject.push(item);
        } else {
          totalBlocked++;
          blockedList.push({ slug: item.slug, locale: item.locale, file: path.basename(fullPath), reasons: gateRes.reasons });
        }
      });
    }
  } catch (e) {
    console.error(`Error processing file ${fullPath}:`, e);
  }
});

console.log(`=== COMPLETE 629 INJECTION GATE RESULTS ===`);
console.log(`${totalInput}건 투입 / ${totalPassed}건 게이트 통과 / ${totalBlocked}건 차단`);
if (blockedList.length > 0) {
  console.log('차단 목록:', JSON.stringify(blockedList, null, 2));
}

if (totalPassed === 0) {
  console.error('No items passed the gate! Aborting injection.');
  process.exit(1);
}

// 2. Surgical Injection into src/data/blog-posts.ts
const blogPostsFilePath = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');

let injectedCount = 0;
blogPosts.forEach(post => {
  const itemsForPost = validItemsToInject.filter(it => it.slug === post.slug);
  itemsForPost.forEach(item => {
    post.translations[item.locale] = {
      title: item.title,
      description: item.description,
      content: item.content
    };
    injectedCount++;
  });
});

console.log(`Injected ${injectedCount} translations into memory. Serializing to blog-posts.ts...`);

// Format properly as TypeScript export
const newFileContent = `export interface BlogTranslation {
  title: string;
  description: string;
  content: string;
}

export interface BlogPost {
  slug: string;
  category: 'philosophy' | 'science' | 'leadership' | 'culture';
  giantSlug: string;
  publishedAt: string;
  updatedAt: string;
  translations: Record<string, BlogTranslation>;
}

export const blogPosts: BlogPost[] = ${JSON.stringify(blogPosts, null, 2)};
`;

fs.writeFileSync(blogPostsFilePath, newFileContent, 'utf8');
console.log('✅ Successfully wrote updated blog-posts.ts file!');
