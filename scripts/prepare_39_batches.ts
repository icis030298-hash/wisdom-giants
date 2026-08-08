import { blogPosts } from '../src/data/blog-posts';
import * as fs from 'fs';
import * as path from 'path';

const missingLocales = ['ru', 'de', 'id'];
const missing: Record<string, any[]> = { ru: [], de: [], id: [] };

blogPosts.forEach(post => {
  const enTr = post.translations['en'];
  missingLocales.forEach(loc => {
    const tr = post.translations[loc];
    if (!tr || !tr.title || tr.title === enTr?.title) {
      missing[loc].push({
        slug: post.slug,
        locale: loc,
        enTitle: enTr?.title || '',
        enDescription: enTr?.description || '',
        enContent: enTr?.content || ''
      });
    }
  });
});

console.log('=== MISSING 39 ITEMS BREAKDOWN ===');
missingLocales.forEach(loc => {
  console.log(`${loc}: ${missing[loc].length} missing items`);
});

const dir = path.join(__dirname, '..', 'scratch', 'batches_39');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// ru: 9 items -> in_ru_b1.json
fs.writeFileSync(path.join(dir, 'in_ru_b1.json'), JSON.stringify(missing.ru, null, 2), 'utf8');

// de: 10 items -> in_de_b1.json
fs.writeFileSync(path.join(dir, 'in_de_b1.json'), JSON.stringify(missing.de, null, 2), 'utf8');

// id: 20 items -> in_id_b1.json (10 items), in_id_b2.json (10 items)
fs.writeFileSync(path.join(dir, 'in_id_b1.json'), JSON.stringify(missing.id.slice(0, 10), null, 2), 'utf8');
fs.writeFileSync(path.join(dir, 'in_id_b2.json'), JSON.stringify(missing.id.slice(10, 20), null, 2), 'utf8');

console.log('✅ Successfully created batch files in scratch/batches_39/!');
