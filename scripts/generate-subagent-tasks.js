const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts'), 'utf8');
const cleanCode = code.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scratch', '8_agent_allocation_manifest.json'), 'utf8'));

const tasksDir = path.join(__dirname, '..', 'scratch', 'tasks');
if (!fs.existsSync(tasksDir)) {
  fs.mkdirSync(tasksDir, { recursive: true });
}

function prepareTaskData(agentKey, localeDefault) {
  const items = manifest[agentKey];
  const fullPayload = items.map(item => {
    const post = blogPosts.find(p => p.slug === item.slug);
    const loc = item.locale || localeDefault;
    const enTr = post.translations['en'];
    return {
      locale: loc,
      slug: item.slug,
      giantSlug: post.giantSlug,
      category: post.category,
      enTitle: enTr.title,
      enDescription: enTr.description,
      enContent: enTr.content
    };
  });

  fs.writeFileSync(path.join(tasksDir, `${agentKey}_input.json`), JSON.stringify(fullPayload, null, 2), 'utf8');
  console.log(`Task input created for ${agentKey}: ${fullPayload.length} posts`);
}

prepareTaskData('agent1', 'pl');
prepareTaskData('agent2', 'pl');
prepareTaskData('agent3', 'pl');
prepareTaskData('agent4', 'uk');
prepareTaskData('agent5', 'uk');
prepareTaskData('agent6', 'uk');
prepareTaskData('agent7', 'latin');
prepareTaskData('agent8', 'nonlatin');
