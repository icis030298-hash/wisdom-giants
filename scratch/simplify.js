const fs = require('fs');

const data = JSON.parse(fs.readFileSync('extracted_texts.json', 'utf-8'));
const targets = JSON.parse(fs.readFileSync('retranslation-targets.json', 'utf-8'));

for (let i = 0; i < data.length; i++) {
  const item = data[i];
  const t = targets[i];
  
  if (item.enText.startsWith('[')) {
    // It's a stringified wisdom array
    const wisdom = JSON.parse(item.enText);
    let matchedEnText = "NO MATCH";
    
    // Find the quote that matches the preview
    // We can just check which one's target locale translation matches the preview, or just return the english for all quotes to be safe?
    // The preview is in the TARGET locale or source? The preview is "穿越痛苦，走向欢乐！" (zh)
    // We can look for a quote where quote_[locale] or meaning_[locale] starts with the preview!
    for (const w of wisdom) {
      const q_loc = w['quote_' + item.locale];
      const m_loc = w['meaning_' + item.locale];
      if (q_loc && q_loc.substring(0, 30).includes(t.preview.substring(0, 10))) {
        matchedEnText = w['quote_en'];
        break;
      }
      if (m_loc && m_loc.substring(0, 30).includes(t.preview.substring(0, 10))) {
        matchedEnText = w['meaning_en'];
        break;
      }
      // fallback: just check substring
      if (q_loc && q_loc.includes(t.preview.substring(0, 15))) {
        matchedEnText = w['quote_en'];
        break;
      }
    }
    
    if (matchedEnText === "NO MATCH") {
      // Just take the first one if we can't match? Or log it
      matchedEnText = wisdom[0]['quote_en'];
    }
    item.enText = matchedEnText;
  }
}

fs.writeFileSync('extracted_simplified.json', JSON.stringify(data, null, 2));
console.log('simplified');
