const fs = require('fs');
const readline = require('readline');

const logFile = "C:\\Users\\user\\.gemini\\antigravity\\brain\\1d63bcbe-3036-4a9b-99f0-ff3e2bb85ad4\\.system_generated\\logs\\transcript.jsonl";

async function main() {
  if (!fs.existsSync(logFile)) {
    return;
  }
  
  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  for await (const line of rl) {
    if (line.includes('generate_image') && line.includes('error') && line.includes('429')) {
      try {
        const obj = JSON.parse(line);
        console.log(`Step ${obj.step_index} (${obj.created_at || 'no created_at'}):`);
        console.log(line.slice(0, 1000));
        console.log('---');
      } catch (e) {}
    }
  }
}

main().catch(console.error);
