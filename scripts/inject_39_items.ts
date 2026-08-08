import { validateTranslationItem } from '../src/lib/injection-gate';
import { blogPosts } from '../src/data/blog-posts';
import * as fs from 'fs';
import * as path from 'path';

// 1. Merge Suleiman if needed
const dir39 = path.join(__dirname, '..', 'scratch', 'batches_39');
const suleimanPath = path.join(dir39, 'out_id_suleiman.json');
const idB2Path = path.join(dir39, 'out_id_b2.json');

if (fs.existsSync(suleimanPath)) {
  const suleiman = JSON.parse(fs.readFileSync(suleimanPath, 'utf8'));
  const b2 = JSON.parse(fs.readFileSync(idB2Path, 'utf8'));
  if (!b2.some((x: any) => x.slug === 'suleiman-the-magnificent-wisdom')) {
    b2.push(suleiman[0]);
    fs.writeFileSync(idB2Path, JSON.stringify(b2, null, 2), 'utf8');
    console.log('Merged suleiman into out_id_b2.json! Total count:', b2.length);
  }
}

// 2. Read all 39 output files
const outFiles = fs.readdirSync(dir39).filter(f => f.startsWith('out_') && f.endsWith('.json') && f !== 'out_id_suleiman.json');

let totalInput = 0;
let totalPassed = 0;
let totalBlocked = 0;
const blockedList: any[] = [];
const validItemsToInject: any[] = [];

outFiles.forEach(file => {
  const fullPath = path.join(dir39, file);
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
        blockedList.push({ slug: item.slug, locale: item.locale, file, reasons: gateRes.reasons });
      }
    });
  }
});

console.log(`=== 39-ITEM INJECTION GATE RESULTS ===`);
console.log(`${totalInput}건 투입 / ${totalPassed}건 게이트 통과 / ${totalBlocked}건 차단`);
if (blockedList.length > 0) {
  console.log('차단 목록:', JSON.stringify(blockedList, null, 2));
}

if (totalPassed === 0) {
  console.error('No items passed the gate! Aborting injection.');
  process.exit(1);
}

// 3. Inject into src/data/blog-posts.ts
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
