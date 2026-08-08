import { validateTranslationItem } from '../src/lib/injection-gate';
import * as fs from 'fs';

const locales = ['ar', 'th', 'hi', 'fa', 'nl', 'tr', 'vi', 'zh'];
const blogPostsPath = 'src/data/blog-posts.ts';

let content = fs.readFileSync(blogPostsPath, 'utf8');

console.log('=== SURGICAL PILOT INJECTION ===\n');

let totalInjected = 0;

locales.forEach(loc => {
  const filePath = `scratch/out_${loc}_pilot.json`;
  if (!fs.existsSync(filePath)) return;

  const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  items.forEach((item: any) => {
    // 1. Find the slug block
    const slugRegex = new RegExp(`(slug:\\s*["']${item.slug}["'][\\s\\S]*?translations:\\s*\\{)`, 'g');
    const match = slugRegex.exec(content);
    if (!match) {
      console.log(`[WARN] Could not find slug '${item.slug}' in blog-posts.ts`);
      return;
    }

    // Prepare translation object JS representation
    const localeKey = `${loc}: {`;
    const newTransBlock = `
        title: ${JSON.stringify(item.title)},
        description: ${JSON.stringify(item.description)},
        content: ${JSON.stringify(item.content)}
      },`;

    // Check if locale already exists in the post block
    const postBlockStart = match.index;
    const postBlockEnd = content.indexOf('publishedAt:', postBlockStart) > -1 
      ? content.indexOf('publishedAt:', postBlockStart) + 5000 
      : postBlockStart + 10000;

    const postSub = content.slice(postBlockStart, postBlockEnd);

    if (postSub.includes(`${loc}: {`)) {
      // Replace existing locale block
      const locRegex = new RegExp(`${loc}:\\s*\\{[\\s\\S]*?\\}\\s*,?`, 'g');
      content = content.slice(0, postBlockStart) + 
                postSub.replace(locRegex, `${loc}: {${newTransBlock.slice(0, -1)}}`) + 
                content.slice(postBlockEnd);
    } else {
      // Inject new locale block right after `translations: {`
      const insertPos = match.index + match[0].length;
      content = content.slice(0, insertPos) + `\n      ${loc}: {${newTransBlock.slice(0, -1)}},` + content.slice(insertPos);
    }

    totalInjected++;
  });
});

fs.writeFileSync(blogPostsPath, content, 'utf8');
console.log(`Successfully injected ${totalInjected} pilot translations into ${blogPostsPath}`);

// ==========================================
// VERIFY TURKISH DIACRITICS IN FILE AFTER INJECTION
// ==========================================
const updatedContent = fs.readFileSync(blogPostsPath, 'utf8');
const trItems = JSON.parse(fs.readFileSync('scratch/out_tr_pilot.json', 'utf8'));
const trCharsRegex = /[ıçğşöüİ]/g;

console.log('\n=== (c) TURKISH DIACRITICS IN BLOG-POSTS.TS AFTER INJECTION ===');
trItems.forEach((item: any, idx: number) => {
  const slugIdx = updatedContent.indexOf(`slug: "${item.slug}"`);
  if (slugIdx === -1) return;
  const block = updatedContent.slice(slugIdx, slugIdx + 15000);
  const trMatch = block.match(new RegExp(`tr:\\s*\\{[\\s\\S]*?\\}\\s*,`));
  if (trMatch) {
    const chars = trMatch[0].match(trCharsRegex) || [];
    console.log(`Item ${idx + 1} (${item.slug}) in blog-posts.ts: Found ${chars.length} diacritics`);
  }
});
