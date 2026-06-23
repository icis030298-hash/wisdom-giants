import { readFileSync, writeFileSync } from 'fs';

const files = [
  'src/data/blog-posts-progress.json',
  'src/data/blog-posts-progress-ex.json',
];

for (const file of files) {
  try {
    let content = readFileSync(file, 'utf8');
    // "글로만 읽던 이 거인..." 마크다운 링크 패턴 제거
    const before = (content.match(/글로만 읽던/g) || []).length;
    // 모든 [글로만 읽던...] 마크다운 링크 패턴 제거 (앞 \n 여부와 관계없이)
    content = content.replace(/(?:\\n)*\[글로만 읽던[^\]]*\]\([^)]*\)/g, '');
    const after = (content.match(/글로만 읽던/g) || []).length;
    writeFileSync(file, content, 'utf8');
    console.log(`${file}: ${before} → ${after} (removed ${before - after})`);
  } catch (e) {
    console.log(`Skip ${file}: ${e.message}`);
  }
}
console.log('Done!');
