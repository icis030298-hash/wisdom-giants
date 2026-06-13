const fs = require('fs');
const readline = require('readline');

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
    if (line.includes('현재 위인 수') || line.includes('현재 위인수') || line.includes('194') || line.includes('237') || line.includes('241')) {
      // Print context around the line
      try {
        const obj = JSON.parse(line);
        if (obj.content && obj.content.includes('현재 위인')) {
          console.log(`[Line ${lineNum}] Found in content: ${obj.content.substring(0, 300)}...`);
        }
      } catch (e) {}
    }
  }
}

main();
