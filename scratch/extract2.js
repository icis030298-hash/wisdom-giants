const fs = require('fs');
const lines = fs.readFileSync('C:/Users/user/.gemini/antigravity/brain/bb3327d3-aebc-42a2-9b7f-ddba2f88a732/.system_generated/logs/transcript.jsonl', 'utf8')
  .split('\n')
  .filter(l => l.includes('"type":"USER_INPUT"') && (l.includes('본문 재번역') || l.includes('narrative 9명') || l.includes('불안 → 不安')));
fs.writeFileSync('scratch/user_inputs_2.jsonl', lines.join('\n'));
