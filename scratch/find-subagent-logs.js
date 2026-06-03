const fs = require('fs');
const path = require('path');

const brainDir = "C:\\Users\\user\\.gemini\\antigravity\\brain\\1d63bcbe-3036-4a9b-99f0-ff3e2bb85ad4";

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      if (f === 'logs' || f === '.system_generated' || f === '.agents') {
        scanDir(fullPath);
      } else {
        // Look for transcript.jsonl
        const transcriptPath = path.join(fullPath, 'transcript.jsonl');
        const transcriptPath2 = path.join(fullPath, '.system_generated', 'logs', 'transcript.jsonl');
        if (fs.existsSync(transcriptPath)) {
          checkTranscript(transcriptPath, fullPath);
        }
        if (fs.existsSync(transcriptPath2)) {
          checkTranscript(transcriptPath2, fullPath);
        }
        scanDir(fullPath);
      }
    }
  }
}

function checkTranscript(file, folder) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('generate_image') && (content.includes('429') || content.includes('Quota') || content.includes('quota') || content.includes('exhausted') || content.includes('limit'))) {
    console.log(`FOUND in: ${file}`);
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.includes('generate_image') && (line.includes('429') || line.includes('Quota') || line.includes('quota') || line.includes('exhausted') || line.includes('limit'))) {
        try {
          const obj = JSON.parse(line);
          console.log(`  Step ${obj.step_index} (${obj.created_at || 'no created_at'}):`);
          console.log(`  Snippet: ${line.slice(0, 500)}`);
        } catch (e) {}
      }
    }
  }
}

try {
  scanDir(brainDir);
} catch (e) {
  console.error(e);
}
