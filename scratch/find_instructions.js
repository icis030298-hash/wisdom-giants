const fs = require('fs');
const lines = fs.readFileSync('C:/Users/user/.gemini/antigravity/brain/bb3327d3-aebc-42a2-9b7f-ddba2f88a732/.system_generated/logs/transcript.jsonl', 'utf8')
  .split('\n')
  .filter(l => l.includes('"type":"USER_INPUT"') && l.includes('1건 불안'));
fs.writeFileSync('scratch/find_instructions.jsonl', lines.join('\n'));
