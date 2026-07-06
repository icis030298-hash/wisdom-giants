const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\natey\\.gemini\\antigravity\\brain\\ce112139-015f-4413-b099-b6be867c6ddd\\.system_generated\\logs\\transcript.jsonl';
if (!fs.existsSync(logPath)) {
  console.log('Log file does not exist');
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').trim().split('\n');
lines.forEach(line => {
  const data = JSON.parse(line);
  if (data.type === 'PLANNER_RESPONSE') {
    console.log('--- Planner Response ---');
    console.log(data.content);
  }
  if (data.tool_calls) {
    data.tool_calls.forEach(tc => {
      if (tc.name === 'run_command') {
        console.log('--- Run Command ---');
        console.log(tc.args.CommandLine);
      }
    });
  }
});
