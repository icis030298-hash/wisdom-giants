import fs from 'fs';
import path from 'path';
import { blogPosts } from '../src/data/blog-posts';

const KOREAN_REGEX = /[\uAC00-\uD7A3]/;

const report: any = {
  blogLeaks: [],
  narrativeLeaks: [],
  messageLeaks: []
};

// 1. Audit blog posts
console.log('Auditing blog posts...');
blogPosts.forEach((post: any) => {
  const translations = post.translations || {};
  Object.keys(translations).forEach((locale) => {
    if (locale === 'ko') return; // Skip Korean locale
    
    const trans = translations[locale];
    if (trans) {
      if (KOREAN_REGEX.test(trans.title)) {
        report.blogLeaks.push({
          slug: post.slug,
          locale,
          field: 'title',
          sample: trans.title
        });
      }
      if (KOREAN_REGEX.test(trans.description)) {
        report.blogLeaks.push({
          slug: post.slug,
          locale,
          field: 'description',
          sample: trans.description
        });
      }
      if (KOREAN_REGEX.test(trans.content)) {
        // Find a small sample containing Korean
        const match = trans.content.match(/.{0,30}[\uAC00-\uD7A3]+.{0,30}/);
        report.blogLeaks.push({
          slug: post.slug,
          locale,
          field: 'content',
          sample: match ? match[0].trim() : 'Contains Hangul'
        });
      }
    }
  });
});

// 2. Audit final-narratives.json
console.log('Auditing final-narratives...');
const narrativesPath = path.resolve(process.cwd(), 'src/data/final-narratives.json');
if (fs.existsSync(narrativesPath)) {
  const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
  Object.keys(narratives).forEach((slug) => {
    const data = narratives[slug] || {};
    Object.keys(data).forEach((key) => {
      // Check if key is localized and not Korean
      const isLocalizedField = key.includes('_');
      const isKoreanField = key.endsWith('_ko');
      
      if (isLocalizedField && !isKoreanField) {
        const text = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
        if (KOREAN_REGEX.test(text)) {
          const match = text.match(/.{0,30}[\uAC00-\uD7A3]+.{0,30}/);
          report.narrativeLeaks.push({
            slug,
            field: key,
            sample: match ? match[0].trim() : 'Contains Hangul'
          });
        }
      } else if (key === 'wisdom' && Array.isArray(data.wisdom)) {
        data.wisdom.forEach((w: any, idx: number) => {
          Object.keys(w).forEach((wk) => {
            const isWkLocalized = wk.includes('_');
            const isWkKorean = wk.endsWith('_ko');
            if (isWkLocalized && !isWkKorean) {
              const text = w[wk] || '';
              if (KOREAN_REGEX.test(text)) {
                report.narrativeLeaks.push({
                  slug,
                  field: `wisdom[${idx}].${wk}`,
                  sample: text
                });
              }
            }
          });
        });
      }
    });
  });
}

// 3. Audit messages/*.json
console.log('Auditing messages i18n JSON files...');
const messagesDir = path.resolve(process.cwd(), 'messages');
if (fs.existsSync(messagesDir)) {
  const files = fs.readdirSync(messagesDir);
  files.forEach((file) => {
    if (file === 'ko.json') return; // Skip Korean
    if (!file.endsWith('.json')) return;
    
    const locale = file.replace('.json', '');
    const filePath = path.join(messagesDir, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      const checkObject = (obj: any, currentPath: string) => {
        if (typeof obj === 'string') {
          if (KOREAN_REGEX.test(obj)) {
            report.messageLeaks.push({
              locale,
              path: currentPath,
              val: obj
            });
          }
        } else if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            checkObject(item, `${currentPath}[${index}]`);
          });
        } else if (obj !== null && typeof obj === 'object') {
          Object.keys(obj).forEach((key) => {
            checkObject(obj[key], currentPath ? `${currentPath}.${key}` : key);
          });
        }
      };
      
      checkObject(data, '');
    } catch (err: any) {
      console.error(`Error parsing message file ${file}:`, err.message);
    }
  });
}

// Write report
const reportOutPath = path.resolve(process.cwd(), 'scripts/leak-report.json');
fs.writeFileSync(reportOutPath, JSON.stringify(report, null, 2), 'utf8');

console.log('=== AUDIT COMPLETE ===');
console.log(`Blog leaks: ${report.blogLeaks.length}`);
console.log(`Narrative leaks: ${report.narrativeLeaks.length}`);
console.log(`Message leaks: ${report.messageLeaks.length}`);
console.log(`Report written to ${reportOutPath}`);
