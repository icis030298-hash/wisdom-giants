const fs = require('fs');

try {
  const content = fs.readFileSync('src/data/blog-posts.ts', 'utf-8');
  const match = content.match(/export const blogPosts: BlogPost\[\] = (\[[\s\S]*\]);/);
  let arrayString = match[1]
    .replace(/Category\.PHILOSOPHY/g, "'philosophy'")
    .replace(/Category\.SCIENCE/g, "'science'")
    .replace(/Category\.LEADERSHIP/g, "'leadership'")
    .replace(/Category\.LITERATURE/g, "'literature'")
    .replace(/Category\.ARTS/g, "'arts'");
    
  const posts = eval(arrayString);
  const totalPosts = posts.length;
  
  const langFallbackCount = {};
  
  for (const post of posts) {
    if (!post.translations) continue;
    const enTrans = post.translations['en'];
    
    for (const [lang, trans] of Object.entries(post.translations)) {
      if (lang === 'en') continue;
      
      if (!langFallbackCount[lang]) langFallbackCount[lang] = 0;
      if (enTrans && trans.title === enTrans.title) {
        langFallbackCount[lang]++;
      }
    }
  }
  
  console.log(`Total Posts: ${totalPosts}`);
  for (const [lang, count] of Object.entries(langFallbackCount)) {
    if (count > 0) {
      console.log(`${lang}: ${count} untranslated (${totalPosts - count} translated)`);
    } else {
      console.log(`${lang}: fully translated`);
    }
  }
  
} catch (e) {
  console.error(e);
}
