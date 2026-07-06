const fs = require('fs');
const path = require('path');

const ids = [
  '97527426-3261-46aa-8357-69a9a3c1d74c',
  '2c14720b-f8f5-49a1-a170-ecbd13dda9a7',
  '94267461-46c7-4dc1-8249-6a26c857f026',
  'ce112139-015f-4413-b099-b6be867c6ddd'
];

ids.forEach(id => {
  const p = `C:\\Users\\natey\\.gemini\\antigravity\\brain\\${id}\\.system_generated\\logs\\transcript.jsonl`;
  if (fs.existsSync(p)) {
    const lines = fs.readFileSync(p, 'utf8').trim().split('\n');
    console.log(`=== Agent ${id.slice(0, 8)} ===`);
    let lastResponse = '';
    for (let i = lines.length - 1; i >= 0; i--) {
      const data = JSON.parse(lines[i]);
      if (data.type === 'PLANNER_RESPONSE' && data.content) {
        lastResponse = data.content;
        break;
      }
    }
    console.log(lastResponse.slice(0, 300) + (lastResponse.length > 300 ? '...' : ''));
  } else {
    console.log(`Agent ${id.slice(0, 8)} log not found`);
  }
});
