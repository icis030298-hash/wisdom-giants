const fs = require('fs');
const lines = fs.readFileSync('C:/Users/user/.gemini/antigravity/brain/bb3327d3-aebc-42a2-9b7f-ddba2f88a732/.system_generated/logs/transcript.jsonl', 'utf8')
  .split('\n')
  .filter(l => l.includes('"type":"USER_INPUT"'))
  .map(l => {
     try {
       const obj = JSON.parse(l);
       return `[${obj.created_at}] ` + obj.content;
     } catch(e) { return ''; }
  });
fs.writeFileSync('scratch/all_user_inputs.txt', lines.join('\n\n====================\n\n'));
