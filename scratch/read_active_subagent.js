const fs = require('fs');
const readline = require('readline');

const subagentFile = 'C:/Users/user/.gemini/antigravity/brain/49ef3f38-692f-4105-ba7d-1dcd010b2c95/.system_generated/logs/transcript.jsonl';

if (!fs.existsSync(subagentFile)) {
  console.log('Subagent transcript file does not exist.');
  process.exit(0);
}

const lines = [];
const rl = readline.createInterface({
  input: fs.createReadStream(subagentFile),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  lines.push(line);
  if (lines.length > 30) lines.shift();
});

rl.on('close', () => {
  lines.forEach((l, idx) => {
    try {
      const obj = JSON.parse(l);
      console.log(`${idx}: [${obj.type}] Source: ${obj.source} Status: ${obj.status || 'N/A'}`);
      if (obj.tool_calls) {
        console.log(`  Tools: ${JSON.stringify(obj.tool_calls.map(tc => tc.name))}`);
      }
      if (obj.content) {
        console.log(`  Content: ${obj.content.substring(0, 150)}...`);
      }
    } catch(e) {
      console.log(`${idx}: Parse error:`, e.message);
    }
  });
});
