import { blogPosts } from '../src/data/blog-posts';

const fa = blogPosts.filter(p => p.translations && p.translations.fa && /[가-힣]/.test(p.translations.fa.content));
fa.forEach(p => {
  const koreanCount = (p.translations.fa.content.match(/[가-힣]/g) || []).length;
  console.log(`${p.slug}: ${koreanCount} Korean chars`);
});
