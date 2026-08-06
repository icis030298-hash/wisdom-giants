const fs = require('fs');
const path = require('path');

const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scratch', 'last_90_tasks.json'), 'utf8'));

const tasksDir = path.join(__dirname, '..', 'scratch', 'tasks_last');
if (!fs.existsSync(tasksDir)) {
  fs.mkdirSync(tasksDir, { recursive: true });
}

const plTasks = tasks.filter(t => t.locale === 'pl');
const otherTasks = tasks.filter(t => t.locale !== 'pl');

fs.writeFileSync(path.join(tasksDir, 'task_P_pl_31.json'), JSON.stringify(plTasks, null, 2), 'utf8');
fs.writeFileSync(path.join(tasksDir, 'task_Q_others_59.json'), JSON.stringify(otherTasks, null, 2), 'utf8');

console.log(`Created last task inputs:
Agent P (PL): ${plTasks.length} posts
Agent Q (Others): ${otherTasks.length} posts
Total: ${plTasks.length + otherTasks.length} posts`);
