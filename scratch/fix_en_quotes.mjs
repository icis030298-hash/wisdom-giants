
import fs from 'fs';
import path from 'path';

const enJsonPath = 'messages/en.json';
const enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf-8'));

const englishQuotes = {
  'george-washington': {
    quote: "Honesty is the best policy.",
    name: "George Washington",
    headline: "The First President of the United States",
    shortDescription: "A symbol of democracy and integrity."
  },
  'yi-sun-shin': {
    quote: "Those who seek death shall live, those who seek life shall die.",
    name: "Yi Sun-shin",
    headline: "The Hero of the Sea",
    shortDescription: "A military genius who achieved victory against all odds."
  },
  'elizabeth-i': {
    quote: "I am married to England.",
    name: "Elizabeth I",
    headline: "The Virgin Queen of the Golden Age",
    shortDescription: "The 'Iron Queen' who led England to its zenith."
  },
  'gwanggaeto-the-great': {
    quote: "My kingdom shall reach every corner of the earth.",
    name: "Gwanggaeto the Great",
    headline: "The Great Conqueror of Goguryeo",
    shortDescription: "A powerful monarch who expanded the territory significantly."
  },
  'winston-churchill': {
    quote: "Never, never, never give up.",
    name: "Winston Churchill",
    headline: "The Leader Who Led Britain to Victory",
    shortDescription: "A statesman known for his iron will and determination."
  },
  'qin-shi-huang': {
    quote: "I have unified the world.",
    name: "Qin Shi Huang",
    headline: "The First Emperor of China",
    shortDescription: "The architect who built the first unified empire of China."
  },
  'augustus': {
    quote: "I found Rome a city of bricks and left it a city of marble.",
    name: "Augustus",
    headline: "The Founder of Pax Romana",
    shortDescription: "The first emperor who brought peace and stability to Rome."
  },
  'napoleon-bonaparte': {
    quote: "Victory belongs to the most persevering.",
    name: "Napoleon Bonaparte",
    headline: "The Conqueror Who Rewrote the Rules of Fate",
    shortDescription: "A military genius who transformed Europe."
  },
  'anne-frank': {
    quote: "Despite everything, I believe that people are really good at heart.",
    name: "Anne Frank",
    headline: "A Voice of Hope in Darkness",
    shortDescription: "A young girl who kept a diary during the Holocaust."
  },
  'nelson-mandela': {
    quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    name: "Nelson Mandela",
    headline: "The Father of a New South Africa",
    shortDescription: "A leader who fought against apartheid and for reconciliation."
  },
  'martin-luther-king': {
    quote: "Darkness cannot drive out darkness; only light can do that.",
    name: "Martin Luther King Jr.",
    headline: "The Leader of the Civil Rights Movement",
    shortDescription: "A visionary who dreamed of equality and justice."
  },
  'mahatma-gandhi': {
    quote: "Be the change that you wish to see in the world.",
    name: "Mahatma Gandhi",
    headline: "The Father of Non-Violent Resistance",
    shortDescription: "A leader who led India to independence through peace."
  },
  'mother-teresa': {
    quote: "Intense love does not measure, it just gives.",
    name: "Mother Teresa",
    headline: "The Saint of the Gutters",
    shortDescription: "A nun who dedicated her life to helping the poorest."
  },
  'marie-curie': {
    quote: "Nothing in life is to be feared, it is only to be understood.",
    name: "Marie Curie",
    headline: "The Radiant Pioneer of Science",
    shortDescription: "The first woman to win a Nobel Prize, and twice at that."
  },
  'albert-einstein': {
    quote: "Imagination is more important than knowledge.",
    name: "Albert Einstein",
    headline: "The Rebel of Relativity",
    shortDescription: "The physicist who revolutionized our understanding of the universe."
  },
  'nikola-tesla': {
    quote: "The present is theirs; the future, for which I really worked, is mine.",
    name: "Nikola Tesla",
    headline: "The Master of Lightning",
    shortDescription: "The inventor who powered the modern world with AC."
  },
  'leonardo-da-vinci': {
    quote: "Iron rusts from disuse; water loses its purity from stagnation.",
    name: "Leonardo da Vinci",
    headline: "The Man of Infinite Curiosity",
    shortDescription: "The ultimate Renaissance man of art and science."
  },
  'vincent-van-gogh': {
    quote: "I dream my painting and I paint my dream.",
    name: "Vincent van Gogh",
    headline: "The Starry-Eyed Seeker",
    shortDescription: "A painter who captured the soul of nature and humanity."
  },
  'pablo-picasso': {
    quote: "Every act of creation is first an act of destruction.",
    name: "Pablo Picasso",
    headline: "The Destroyer and Creator",
    shortDescription: "A master of modern art who co-founded Cubism."
  },
  'william-shakespeare': {
    quote: "We know what we are, but know not what we may be.",
    name: "William Shakespeare",
    headline: "The Mirror of Humanity",
    shortDescription: "The world's greatest playwright and poet."
  },
  'wolfgang-amadeus-mozart': {
    quote: "Music is not in the notes, but in the silence between them.",
    name: "Wolfgang Amadeus Mozart",
    headline: "The Divine Prodigy",
    shortDescription: "A musical genius who composed timeless masterpieces."
  },
  'coco-chanel': {
    quote: "Success is often achieved by those who don't know that failure is inevitable.",
    name: "Coco Chanel",
    headline: "The Rebel of Elegance",
    shortDescription: "The fashion designer who redefined women's style."
  },
  'steve-jobs': {
    quote: "Stay Hungry, Stay Foolish.",
    name: "Steve Jobs",
    headline: "The Icon of Innovation",
    shortDescription: "The visionary who dared to think different."
  },
  'elon-musk': {
    quote: "Failure is an option here. If things are not failing, you are not innovating enough.",
    name: "Elon Musk",
    headline: "The Architect of the Impossible",
    shortDescription: "A bold dreamer pushing the boundaries of technology."
  }
};

// Generic English quotes for the rest of the 100 giants if they are missing or in Korean
const toTitleCase = (str) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

Object.keys(enJson.Giants).forEach(slug => {
  const giant = enJson.Giants[slug];
  
  // Apply specific quotes if available
  if (englishQuotes[slug]) {
    giant.quote = englishQuotes[slug].quote;
    giant.name = englishQuotes[slug].name;
    giant.headline = englishQuotes[slug].headline;
    giant.shortDescription = englishQuotes[slug].shortDescription;
  } 
  // For others, if it's still Korean (detected by regex for Korean characters), replace with a generic English one
  else if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(giant.quote)) {
    giant.quote = "A visionary path begins with a single step of courage.";
    giant.name = toTitleCase(slug);
    giant.headline = toTitleCase(slug) + ": A Historical Icon";
    giant.shortDescription = "A historical figure who left an indelible mark on humanity.";
  }
});

fs.writeFileSync(enJsonPath, JSON.stringify(enJson, null, 2), 'utf-8');
console.log('Updated en.json with English quotes and improved translations.');
