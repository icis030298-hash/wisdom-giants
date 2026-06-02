/**
 * remove-giants.js
 * Removes post-1970 and living giants from all data files.
 */
const fs = require('fs');
const path = require('path');

const TARGETS = [
  'elon-musk',
  'steve-jobs',
  'nelson-mandela',
  'margaret-thatcher',
  'mother-teresa',
  'mao-zedong',
  'stephen-hawking',
  'pablo-picasso',
  'salvador-dali',
  'coco-chanel',
  'malala-yousafzai',
  'jk-rowling',
  'oprah-winfrey'
];

const LOCALES = ['en', 'ko', 'de', 'ja', 'es', 'fr', 'it', 'pt'];

// 1. Remove from JSON files
LOCALES.forEach(lang => {
  const file = path.join(__dirname, '..', 'messages', `${lang}.json`);
  if (!fs.existsSync(file)) return;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let count = 0;
  TARGETS.forEach(t => {
    if (data.Giants && data.Giants[t]) {
      delete data.Giants[t];
      count++;
    }
  });
  if (count > 0) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Removed ${count} from ${lang}.json`);
  }
});

// 2. Remove from final-narratives.json
const narrativeFile = path.join(__dirname, '..', 'src', 'data', 'final-narratives.json');
if (fs.existsSync(narrativeFile)) {
  const data = JSON.parse(fs.readFileSync(narrativeFile, 'utf8'));
  let count = 0;
  TARGETS.forEach(t => {
    if (data[t]) {
      delete data[t];
      count++;
    }
  });
  if (count > 0) {
    fs.writeFileSync(narrativeFile, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Removed ${count} from final-narratives.json`);
  }
}

// 3. Remove from giants.ts
const tsFile = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
if (fs.existsSync(tsFile)) {
  let content = fs.readFileSync(tsFile, 'utf8');
  let count = 0;
  
  TARGETS.forEach(t => {
    // A somewhat robust regex to remove the object matching the slug.
    // It looks for { ... slug: "t", ... } taking into account nested braces (like lessons array).
    // Because it's hard to do nested braces perfectly in regex, we'll find the index of slug: "t", 
    // search backward for "  {", and search forward for "  },"
    const slugRegex = new RegExp(`slug:\\s*["']${t}["']`);
    const match = content.match(slugRegex);
    if (match) {
      const matchIndex = match.index;
      // find previous "  {"
      const startIdx = content.lastIndexOf('  {', matchIndex);
      // find next "  }," or "  }"
      const endIdx = content.indexOf('  },', matchIndex);
      let realEndIdx = endIdx !== -1 ? endIdx + 4 : -1;
      
      if (endIdx === -1) {
        // maybe it's the last item without comma
        const altEndIdx = content.indexOf('  }', matchIndex);
        if (altEndIdx !== -1) realEndIdx = altEndIdx + 3;
      }
      
      if (startIdx !== -1 && realEndIdx !== -1) {
        content = content.slice(0, startIdx) + content.slice(realEndIdx);
        // remove extra blank lines left behind
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        count++;
        console.log(`Removed ${t} from giants.ts`);
      } else {
        console.log(`Could not cleanly extract bounds for ${t} in giants.ts`);
      }
    }
  });
  
  if (count > 0) {
    fs.writeFileSync(tsFile, content, 'utf8');
    console.log(`Removed total ${count} from giants.ts`);
  }
}
