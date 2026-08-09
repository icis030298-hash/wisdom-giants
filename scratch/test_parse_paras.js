const fs = require('fs');

const file = 'src/data/narratives/agatha-christie.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const epicContent = data.epic_de;

const parseParagraphs = (content) => {
  if (!content) return [];
  if (Array.isArray(content)) return content;
  
  const rawParas = content.split(/\n\n|\\n\\n/).map(p => p.trim()).filter(Boolean);
  const merged = [];
  
  for (let i = 0; i < rawParas.length; i++) {
    let p = rawParas[i];
    const isTitle = (p.length < 80 && !/[.!?。！？]$/.test(p)) || /^(#+\s*|\d+\.\s+)/.test(p);
    
    if (isTitle && i < rawParas.length - 1) {
      p = p.replace(/^(#+\s*|\d+\.\s*)/, '').trim();
      if (p) {
        merged.push(p + ' — ' + rawParas[i+1]);
      } else {
        merged.push(rawParas[i+1]);
      }
      i++;
    } else {
      merged.push(p);
    }
  }
  
  return merged;
};

const paras = parseParagraphs(epicContent);
console.log('Total paragraphs parsed:', paras.length);
paras.forEach((p, i) => console.log(`Para ${i+1}:`, p.substring(0, 80)));
