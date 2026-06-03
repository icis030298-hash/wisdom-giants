const fs = require('fs');
const readline = require('readline');

const file = 'C:/Users/user/.gemini/antigravity/brain/1d63bcbe-3036-4a9b-99f0-ff3e2bb85ad4/.system_generated/logs/transcript.jsonl';
// Wait, is it the parent conversation log or the subagent's conversation log?
// The subagent ID is: 61ff717b-d8a2-4086-a860-0b71a56cf8b2.
// Let's list the parent directory brain/ first, or use the exact ID we found:
const subagentFile = 'C:/Users/user/.gemini/antigravity/brain/61ff717b-d8a2-4086-a860-0b71a56cf8b2/.system_generated/logs/transcript.jsonl';

if (!fs.existsSync(subagentFile)) {
  console.log('Subagent transcript file does not exist at ' + subagentFile);
  process.exit(0);
}

const lines = [];
const rl = readline.createInterface({
  input: fs.createReadStream(subagentFile),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  lines.push(line);
  if (lines.length > 50) lines.shift();
});

rl.on('close', () => {
  lines.forEach((l, idx) => {
    try {
      const obj = JSON.parse(l);
      console.log(`${idx}: [${obj.type}] Source: ${obj.source}`);
      if (obj.tool_calls) {
        console.log(`  Tools: ${JSON.stringify(obj.tool_calls.map(tc => tc.name))}`);
      }
      if (obj.content) {
        console.log(`  Content: ${obj.content.substring(0, 200)}...`);
      }
    } catch(e) {
      console.log(`${idx}: Raw JSON parsing error:`, e.message);
    }
  });
});
