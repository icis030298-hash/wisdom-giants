const fs = require('fs');
const path = require('path');

const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scratch', 'remaining_90_raw.json'), 'utf8'));

const tasksDir = path.join(__dirname, '..', 'scratch', 'tasks_90');
if (!fs.existsSync(tasksDir)) {
  fs.mkdirSync(tasksDir, { recursive: true });
}

const plPosts = posts.filter(p => p.locale === 'pl');
const otherPosts = posts.filter(p => p.locale !== 'pl');

fs.writeFileSync(path.join(tasksDir, 'pl_31_input.json'), JSON.stringify(plPosts, null, 2), 'utf8');
fs.writeFileSync(path.join(tasksDir, 'others_59_input.json'), JSON.stringify(otherPosts, null, 2), 'utf8');

console.log(`Created input task files for remaining 90 posts:
PL Posts: ${plPosts.length}
Others Posts: ${otherPosts.length}`);
