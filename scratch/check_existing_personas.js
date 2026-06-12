const fs = require('fs');

console.log('=== CHECKING EXISTING PERSONAS ===');

// Check deepPersonas from personas.ts
try {
  const pContent = fs.readFileSync('src/data/personas/personas.ts', 'utf8');
  // Extract keys of deepPersonas object
  const deepPersonasKeys = [];
  const lines = pContent.split('\n');
  let insideObject = false;
  for (let line of lines) {
    if (line.includes('export const deepPersonas')) {
      insideObject = true;
      continue;
    }
    if (insideObject) {
      const match = line.match(/^\s+['"]?([a-zA-Z0-9_-]+)['"]?:\s*\{/);
      if (match) {
        deepPersonasKeys.push(match[1]);
      }
    }
  }
  console.log('personas.ts (deepPersonas) 완료:', deepPersonasKeys.length, '명');
  console.log(deepPersonasKeys);
} catch (e) {
  console.error('personas.ts 읽기 실패:', e.message);
}

// Check giantPersonas from giant-personas.ts
try {
  const gpContent = fs.readFileSync('src/data/giant-personas.ts', 'utf8');
  const slugMatches = [...gpContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  console.log('giant-personas.ts (giantPersonas) 완료:', slugMatches.length, '명');
  console.log(slugMatches);
} catch (e) {
  console.error('giant-personas.ts 읽기 실패:', e.message);
}
