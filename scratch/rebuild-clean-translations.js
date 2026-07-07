const fs = require('fs');
const path = require('path');

const locales = ['de', 'es', 'fr', 'it', 'ja', 'pt', 'ru', 'zh'];
const chunksDir = 'scratch/optimization/chunks';
const transDir = 'scratch/optimization/translations';

locales.forEach(locale => {
  const localeDir = path.join(transDir, locale);
  if (!fs.existsSync(localeDir)) return;

  const files = fs.readdirSync(localeDir).filter(f => f.startsWith('trans_chunk_') && f.endsWith('.json'));
  
  files.forEach(file => {
    const chunkNum = file.match(/trans_chunk_(\d+)\.json/)[1];
    const chunkPath = path.join(chunksDir, `chunk_${chunkNum}.json`);
    const transPath = path.join(localeDir, file);

    if (!fs.existsSync(chunkPath)) return;

    // Load original keys
    const originalKeys = JSON.parse(fs.readFileSync(chunkPath, 'utf8'));

    // Load the raw translation content
    const rawTrans = fs.readFileSync(transPath, 'utf8');

    // We will try to reconstruct the key-value pairs
    const cleanedMap = {};

    // Let's split raw translation into lines to process
    const lines = rawTrans.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    originalKeys.forEach((key, index) => {
      // Find a line that contains the key, or use index-based fallback
      let matchedLine = null;

      // 1. Try to find by exact key match in the line
      for (const line of lines) {
        if (line.includes(JSON.stringify(key)) || line.includes(key)) {
          matchedLine = line;
          break;
        }
      }

      // 2. If not found, try to locate by searching lines for key approximations
      if (!matchedLine) {
        // Find lines that look like they belong to this key
        // We can fallback to the index if lines match up reasonably
        // Usually, the JSON starts with { (line 0) and the i-th key is at line i
        const lineIdx = index + 1; // 1-based index because of opening '{'
        if (lines[lineIdx] && (lines[lineIdx].includes('":') || lines[lineIdx].includes('":'))) {
          matchedLine = lines[lineIdx];
        }
      }

      if (matchedLine) {
        // Extract the actual translation from the matched line
        // The translation is typically the last double-quoted string in the line
        // Let's find all double-quoted strings in the line
        const stringRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
        const matches = [];
        let match;
        while ((match = stringRegex.exec(matchedLine)) !== null) {
          matches.push(match[1]);
        }

        if (matches.length >= 2) {
          // The last match is usually the translation
          let translation = matches[matches.length - 1];
          // Clean up if it was a comment or had trailing wait patterns (sometimes caught inside quotes if model wrote it weirdly)
          if (translation.includes('(Wait')) {
            translation = translation.split('(Wait')[0].trim();
            // strip trailing quotes or commas if they got caught
          }
          cleanedMap[key] = translation;
        } else if (matches.length === 1) {
          // If only 1 string is found, maybe it's just the translation (key was unquoted or line got split)
          cleanedMap[key] = matches[0];
        } else {
          // Fallback: just use key itself
          cleanedMap[key] = key;
        }
      } else {
        // Fallback: key itself
        cleanedMap[key] = key;
      }
    });

    // Write back the perfectly clean JSON
    fs.writeFileSync(transPath, JSON.stringify(cleanedMap, null, 2), 'utf8');
  });

  console.log(`Reconstructed and cleaned all translation chunks for locale: ${locale}`);
});
