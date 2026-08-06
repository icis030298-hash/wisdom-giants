const fs = require('fs');
const path = require('path');

const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scratch', 'remaining_184_tasks.json'), 'utf8'));

const tasksDir = path.join(__dirname, '..', 'scratch', 'tasks_rem');
if (!fs.existsSync(tasksDir)) {
  fs.mkdirSync(tasksDir, { recursive: true });
}

// Agent A: pl (44)
fs.writeFileSync(path.join(tasksDir, 'agentA_pl_44.json'), JSON.stringify(tasks['pl'], null, 2), 'utf8');

// Agent B & C: uk (78 split into 39 + 39)
fs.writeFileSync(path.join(tasksDir, 'agentB_uk_39.json'), JSON.stringify(tasks['uk'].slice(0, 39), null, 2), 'utf8');
fs.writeFileSync(path.join(tasksDir, 'agentC_uk_39.json'), JSON.stringify(tasks['uk'].slice(39), null, 2), 'utf8');

// Agent D: others (62)
const others = [
  ...tasks['id'],
  ...tasks['de'],
  ...tasks['ha'],
  ...tasks['sw'],
  ...tasks['ja'],
  ...tasks['he'],
  ...tasks['el']
];

fs.writeFileSync(path.join(tasksDir, 'agentD_others_62.json'), JSON.stringify(others, null, 2), 'utf8');

console.log(`Created input files:
Agent A (PL): ${tasks['pl'].length} posts
Agent B (UK Part 1): 39 posts
Agent C (UK Part 2): 39 posts
Agent D (Others): ${others.length} posts
Total: ${tasks['pl'].length + 78 + others.length} posts`);
