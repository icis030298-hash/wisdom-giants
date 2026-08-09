const fs = require('fs');
const path = require('path');

// --- (a) Narrative Path ---
console.log('=== (a) Narrative Data File Path ===');
console.log('src/data/narratives/[slug].json (각 파일 내 epic_<locale> 필드)');
console.log('');

// --- (b) 134쌍의 (슬러그 × 로케일) 전체 목록 검증 ---
console.log('=== (b) 134쌍의 (슬러그 × 로케일) 전체 목록 ===');
const giants9 = [
  'agatha-christie', 'ataturk', 'averroes-ibn-rushd', 'avicenna-ibn-sina',
  'hannah-arendt', 'queen-elizabeth-i', 'rosa-parks', 'simone-de-beauvoir',
  'zarathushtra'
];
const locales14 = ['de', 'es', 'fr', 'ha', 'he', 'id', 'it', 'ja', 'nl', 'pl', 'pt', 'sw', 'tr', 'vi'];

const pairs = [];
for (const slug of giants9) {
  for (const loc of locales14) {
    pairs.push(`${slug} × ${loc}`);
  }
}

const ghazaliLocales = ['de', 'ha', 'id', 'it', 'nl', 'pl', 'sw', 'vi'];
for (const loc of ghazaliLocales) {
  pairs.push(`al-ghazali × ${loc}`);
}

console.log(`총 ${pairs.length}쌍:`);
console.log(pairs.join('\n'));
console.log('');

// Verify against src/data/narratives/*.json
const narrativeDir = path.join(process.cwd(), 'src/data/narratives');
let verifiedMissingCount = 0;
pairs.forEach(pair => {
  const [slug, loc] = pair.split(' × ');
  const filePath = path.join(narrativeDir, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const val = data[`epic_${loc}`];
    if (!val || !String(val).trim()) {
      verifiedMissingCount++;
    }
  }
});
console.log(`실제 파일에서 epic_<locale> 누락/빈값 수치 확인: ${verifiedMissingCount} / ${pairs.length}`);
console.log('');

// --- (c) fa 2건 현재 title과 본문 앞 200자 ---
function loadBlogPosts() {
  const file = path.join(process.cwd(), 'src/data/blog-posts.ts');
  let src = fs.readFileSync(file, 'utf8');
  src = src.replace(/^\s*import[^;]*;\s*$/gm, '');
  src = src.replace(/^export interface[\s\S]*?(?=export const blogPosts)/m, '');
  src = src.replace(/export\s+const\s+blogPosts\s*:\s*[A-Za-z0-9_[\]]+\s*=/, 'const blogPosts =');
  return new Function(`${src}\nreturn blogPosts;`)();
}

console.log('=== (c) fa 2건 현재 title 및 본문 앞 200자 ===');
const blogPosts = loadBlogPosts();

const targetFaSlugs = ['rockefeller-monopoly-guide', 'carnegie-gospel-wealth'];
targetFaSlugs.forEach(slug => {
  const p = blogPosts.find(item => item.slug === slug);
  if (p && p.translations && p.translations.fa) {
    const t = p.translations.fa;
    console.log(`--- Slug: ${slug} [fa] ---`);
    console.log(`Title: ${t.title}`);
    console.log(`Content (First 200 chars):`);
    console.log(t.content.substring(0, 200));
    console.log('');
  }
});

// --- (d) ja maimonides-wisdom 수정 결과 확인 ---
console.log('=== (d) ja maimonides-wisdom 수정 결과 확인 ("불안" -> "不安" 치환 후 원문) ===');
blogPosts.forEach(p => {
  if (p.translations.ja && p.translations.ja.content && p.translations.ja.content.includes('不安')) {
    const c = p.translations.ja.content;
    const idx = c.indexOf('不安');
    console.log(`Slug: ${p.slug}`);
    console.log(`해당 문장 원문:`);
    console.log(c.substring(Math.max(0, idx - 60), idx + 60));
  }
});
