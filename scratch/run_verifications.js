const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== (a) 감사 스크립트 Stage 3 실행 ===');
try {
  const auditOut = execSync('node --max-old-space-size=8192 scripts/site-audit.js', { env: { ...process.env, STAGES: '3' }, encoding: 'utf8' });
  console.log(auditOut.split('\n').filter(l => l.includes('narrativeIssues') || l.includes('gateFailures') || l.includes('[3/4]') || l.includes('findings')).join('\n'));
} catch (e) {
  console.error('Audit stage 3 error:', e.stdout || e.message);
}

console.log('\n=== (b) de/ja/vi/tr × agatha-christie, ataturk 본문 라틴/비라틴 비율 검증 ===');
const testLocales = ['de', 'ja', 'vi', 'tr'];
const testSlugs = ['agatha-christie', 'ataturk'];

testLocales.forEach(loc => {
  testSlugs.forEach(slug => {
    const file = path.join('src/data/narratives', `${slug}.json`);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const text = (data[`epic_${loc}`] || '') + (data[`trials_${loc}`] || '') + (data[`overcoming_${loc}`] || '');
    
    const latinCount = (text.match(/[a-zA-Z]/g) || []).length;
    const nonLatinCount = (text.match(/[^a-zA-Z\s]/g) || []).length;
    console.log(`${loc}/giant/${slug} -> 라틴문자: ${latinCount}개, 비라틴문자: ${nonLatinCount}개 (텍스트 총 길이: ${text.length})`);
  });
});

console.log('\n=== (c) & (d) 블로그 수량 및 sitemap 구성 요소 검증 ===');
function loadBlogPosts() {
  const file = 'src/data/blog-posts.ts';
  let src = fs.readFileSync(file, 'utf8');
  src = src.replace(/^\s*import[^;]*;\s*$/gm, '');
  src = src.replace(/^export interface[\s\S]*?(?=export const blogPosts)/m, '');
  src = src.replace(/export\s+const\s+blogPosts\s*:\s*[A-Za-z0-9_[\]]+\s*=/, 'const blogPosts =');
  return new Function(`${src}\nreturn blogPosts;`)();
}

const posts = loadBlogPosts();
console.log(`총 블로그 포스트 개수: ${posts.length}개`);
const locales24 = [
  'ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt', 'ru', 'zh',
  'ar', 'th', 'hi', 'fa', 'nl', 'tr', 'vi', 'uk', 'id', 'he',
  'ha', 'sw', 'pl', 'el'
];

let all24Present = true;
locales24.forEach(loc => {
  const count = posts.filter(p => p.translations && p.translations[loc] && p.translations[loc].title).length;
  if (count !== 195) all24Present = false;
  console.log(`[${loc}] 포스트 개수: ${count} / 195`);
});
console.log(`24개 언어 각 195편 완비 여부: ${all24Present ? 'YES (완벽)' : 'NO'}`);
