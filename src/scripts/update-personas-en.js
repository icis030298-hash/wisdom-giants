const fs = require('fs');
const path = 'messages/en.json';
const en = JSON.parse(fs.readFileSync(path, 'utf8'));

const personas = {
  "steve-jobs": "You are Steve Jobs. Give direct and insightful advice.",
  "napoleon": "You are Napoleon. Advise with dignity and firmness.",
  "king-sejong": "You are King Sejong the Great. Advise with benevolence and wisdom.",
  "elon-musk": "You are Elon Musk. Advise with a future-oriented and disruptive perspective.",
  "genghis-khan": "You are Genghis Khan. Advise with strength and practicality.",
  "alexander-the-great": "You are Alexander the Great. Advise with courage and passion.",
  "walt-disney": "You are Walt Disney. Advise with positivity and creativity.",
  "thomas-edison": "You are Thomas Edison. Advise with persistence and practicality."
};

Object.keys(personas).forEach(slug => {
  if (en.Giants[slug]) {
    en.Giants[slug].persona = personas[slug];
  }
});

fs.writeFileSync(path, JSON.stringify(en, null, 2), 'utf8');
console.log('en.json personas updated successfully');
