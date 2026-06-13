const fs = require('fs');

const logPath = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\1d63bcbe-3036-4a9b-99f0-ff3e2bb85ad4\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const candidates = [')) {
    // print the next 60 lines
    for (let j = i; j < Math.min(i + 80, lines.length); j++) {
      try {
        const obj = JSON.parse(lines[j]);
        if (obj.content) {
          console.log(obj.content);
        } else {
          console.log(JSON.stringify(obj).substring(0, 200));
        }
      } catch (e) {
        console.log(lines[j].substring(0, 200));
      }
    }
    break;
  }
}
