const fs = require('fs');
const path = 'messages/en.json';
const en = JSON.parse(fs.readFileSync(path, 'utf8'));

const quotes = {
  "coco-chanel": "The most courageous act is still to think for yourself. Aloud.",
  "picasso": "Every child is an artist. The problem is how to remain an artist once we grow up.",
  "mozart": "The music is not in the notes, but in the silence between them.",
  "shakespeare": "All the world's a stage, and all the men and women merely players.",
  "einstein": "I have no special talent. I am only passionately curious.",
  "marie-curie": "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.",
  "tesla": "The present is theirs; the future, for which I really worked, is mine.",
  "van-gogh": "I dream my painting and I paint my dream.",
  "abraham-lincoln": "Government of the people, by the people, for the people, shall not perish from the earth."
};

Object.keys(quotes).forEach(slug => {
  if (en.Giants[slug]) {
    en.Giants[slug].quote = quotes[slug];
  }
});

// Clean up duplicate da-vinci keys
if (en.Giants['leonardo-da-vinci'] && en.Giants['da-vinci']) {
  delete en.Giants['leonardo-da-vinci'];
}

fs.writeFileSync(path, JSON.stringify(en, null, 2), 'utf8');
console.log('en.json quotes updated and duplicates cleaned');
