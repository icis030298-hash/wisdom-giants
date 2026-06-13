const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\1d63bcbe-3036-4a9b-99f0-ff3e2bb85ad4\\.system_generated\\logs\\transcript.jsonl';

async function main() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    try {
      const obj = JSON.parse(line);
      // We look for user messages
      if (obj.source === 'USER_EXPLICIT' || obj.type === 'USER_INPUT') {
        console.log(`[Line ${lineNum}] User: ${obj.content || JSON.stringify(obj)}`);
      }
      // Or system summary/response containing 50
      if (obj.type === 'PLANNER_RESPONSE' && (line.includes('50명') || line.includes('누락'))) {
        console.log(`[Line ${lineNum}] Plan/Response summary: ${obj.content ? obj.content.substring(0, 300) : ''}...`);
      }
    } catch (e) {
      // Ignore parse error
    }
  }
}

main();
