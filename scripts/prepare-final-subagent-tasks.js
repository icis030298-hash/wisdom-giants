const fs = require('fs');
const path = require('path');

const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scratch', 'final_129_tasks.json'), 'utf8'));

const tasksDir = path.join(__dirname, '..', 'scratch', 'tasks_final');
if (!fs.existsSync(tasksDir)) {
  fs.mkdirSync(tasksDir, { recursive: true });
}

// Subagent X: pl (31)
fs.writeFileSync(path.join(tasksDir, 'task_X_pl_31.json'), JSON.stringify(tasks['pl'], null, 2), 'utf8');

// Subagent Y: uk (39)
fs.writeFileSync(path.join(tasksDir, 'task_Y_uk_39.json'), JSON.stringify(tasks['uk'], null, 2), 'utf8');

// Subagent Z: others (59)
const others = [
  ...tasks['id'],
  ...tasks['de'],
  ...tasks['ha'],
  ...tasks['sw'],
  ...tasks['ja'],
  ...tasks['el']
];

fs.writeFileSync(path.join(tasksDir, 'task_Z_others_59.json'), JSON.stringify(others, null, 2), 'utf8');

console.log(`Created final task inputs:
Agent X (PL): ${tasks['pl'].length} posts
Agent Y (UK): ${tasks['uk'].length} posts
Agent Z (Others): ${others.length} posts
Total: ${tasks['pl'].length + tasks['uk'].length + others.length} posts`);
