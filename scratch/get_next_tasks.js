const fs = require('fs');
const path = require('path');

const limit = parseInt(process.argv[2]) || 3; // Default to 3 tasks at a time

const pendingTasksPath = path.join(__dirname, 'pending-generation-tasks.json');
const imagesDir = path.join(__dirname, '../public/images/giants');

if (!fs.existsSync(pendingTasksPath)) {
  console.log(JSON.stringify({ error: "pending-generation-tasks.json not found" }));
  process.exit(1);
}

const pendingTasks = JSON.parse(fs.readFileSync(pendingTasksPath, 'utf8'));

// Get list of existing image files
const existingFiles = new Set();
if (fs.existsSync(imagesDir)) {
  fs.readdirSync(imagesDir).forEach(file => {
    // We only care about the filename without path, e.g. "cicero.jpg"
    existingFiles.add(file.toLowerCase());
  });
}

const missingTasks = [];
for (const task of pendingTasks) {
  const targetFilename = `${task.slug}.jpg`.toLowerCase();
  if (!existingFiles.has(targetFilename)) {
    missingTasks.push(task);
  }
}

if (missingTasks.length === 0) {
  console.log(JSON.stringify({ status: "ALL_COMPLETED", count: 0, tasks: [] }, null, 2));
} else {
  const nextTasks = missingTasks.slice(0, limit);
  console.log(JSON.stringify({
    status: "PENDING",
    total_missing: missingTasks.length,
    next_batch_size: nextTasks.length,
    tasks: nextTasks
  }, null, 2));
}
