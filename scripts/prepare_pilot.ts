import { blogPosts } from '../src/data/blog-posts';
import * as fs from 'fs';
import * as path from 'path';

const locales = ['ar', 'th', 'hi', 'fa', 'nl', 'tr', 'vi', 'zh'];
const missingByLocale: Record<string, string[]> = JSON.parse(
  fs.readFileSync('scratch/missing_8_locales.json', 'utf8')
);

const pilotDir = 'scratch/pilot_inputs';
if (!fs.existsSync(pilotDir)) {
  fs.mkdirSync(pilotDir, { recursive: true });
}

locales.forEach(loc => {
  const slugs = missingByLocale[loc].slice(0, 3); // Pick first 3 slugs
  const items = slugs.map(slug => {
    const post = blogPosts.find(p => p.slug === slug);
    const en = post?.translations['en'];
    return {
      slug,
      targetLocale: loc,
      title: en?.title,
      description: en?.description,
      content: en?.content
    };
  });

  fs.writeFileSync(
    path.join(pilotDir, `pilot_in_${loc}.json`),
    JSON.stringify(items, null, 2),
    'utf8'
  );
  console.log(`Saved ${loc} pilot input with 3 items: ${slugs.join(', ')}`);
});
