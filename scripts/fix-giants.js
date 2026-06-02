const fs = require('fs');
const path = require('path');

const tsFile = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
let content = fs.readFileSync(tsFile, 'utf8');

// The corrupted blocks start with something like `      {\n        title: ` (part of lessons)
// and end with `  },\n`.
// Alternatively, let's just use a regex to match the broken remnants.
// The broken remnants always contain `persona: "당신은 스티브 잡스입니다."` etc., up to `  },`
// We know exactly who was removed:
const targets = [
  '스티브 잡스',
  '넬슨 만델라',
  '마가렛 대처',
  '마더 테레사',
  '스티븐 호킹',
  '파블로 피카소',
  '살바도르 달리',
  '코코 샤넬'
];

targets.forEach(name => {
  // Find the persona line for this name
  const personaStr = `persona: "당신은 ${name}입니다."`;
  const pIdx = content.indexOf(personaStr);
  if (pIdx !== -1) {
    // We need to find where the broken object started.
    // It's usually a previous `  },` or `export const giantsData: Giant[] = [`
    // Let's find the previous `  },`
    let startIdx = content.lastIndexOf('  },', pIdx);
    if (startIdx === -1) {
      // It might be the very first element in the array
      startIdx = content.indexOf('export const giantsData: Giant[] = [') + 'export const giantsData: Giant[] = ['.length;
    } else {
      startIdx += 4; // length of '  },'
    }
    
    // Find the end of this broken object
    const endIdx = content.indexOf('  },', pIdx);
    let realEndIdx = endIdx !== -1 ? endIdx + 4 : -1;
    
    if (realEndIdx !== -1) {
      content = content.slice(0, startIdx) + content.slice(realEndIdx);
      console.log(`Cleaned up remnant for ${name}`);
    }
  }
});

fs.writeFileSync(tsFile, content, 'utf8');
console.log('Done cleaning giants.ts');
