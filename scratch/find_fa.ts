import { blogPosts } from '../src/data/blog-posts';

const fa = blogPosts.filter(p => p.translations && p.translations.fa && /[가-힣]/.test(p.translations.fa.content));
console.log(fa.map(p => p.slug));
