const fs = require('fs');
const data = require('./messages/it.json');
const giants = data.Giants;

// Name mappings
const nameMap = {
  "Alexander the Great": "Alessandro Magno",
  "Julius Caesar": "Giulio Cesare",
  "Joan of Arc": "Giovanna d'Arco",
  "King Sejong the Great": "Re Sejong il Grande",
  "Genghis Khan": "Gengis Khan",
  "Confucius": "Confucio",
  "Aristotle": "Aristotele",
  "Plato": "Platone",
  "Socrates": "Socrate",
  "Napoleon Bonaparte": "Napoleone Bonaparte",
  "Leonardo da Vinci": "Leonardo da Vinci",
  "Buddha": "Buddha",
  "Lao Tzu": "Lao Tzu",
  "Cleopatra": "Cleopatra",
  "Michelangelo": "Michelangelo",
  "Galileo Galilei": "Galileo Galilei",
  "Gwanggaeto the Great": "Gwanggaeto il Grande",
  "Catherine the Great": "Caterina la Grande",
  "Peter the Great": "Pietro il Grande",
  "Marcus Aurelius": "Marco Aurelio",
  "Elizabeth I": "Elisabetta I",
  "William Shakespeare": "William Shakespeare",
  "Martin Luther King Jr.": "Martin Luther King Jr."
};

function translateEra(era) {
  let e = era;
  e = e.replace(/(\d+)th Century/, "XIX Secolo"); // just roughly, we will fix with a function
  // Actually let's do a better replace for centuries
  e = e.replace(/21st Century/g, "XXI Secolo");
  e = e.replace(/20th Century/g, "XX Secolo");
  e = e.replace(/19th Century/g, "XIX Secolo");
  e = e.replace(/18th Century/g, "XVIII Secolo");
  e = e.replace(/17th Century/g, "XVII Secolo");
  e = e.replace(/16th Century/g, "XVI Secolo");
  e = e.replace(/15th Century/g, "XV Secolo");
  e = e.replace(/14th Century/g, "XIV Secolo");
  e = e.replace(/13th Century/g, "XIII Secolo");
  e = e.replace(/1st Century/g, "I Secolo");
  e = e.replace(/2nd Century/g, "II Secolo");
  e = e.replace(/3rd Century/g, "III Secolo");
  e = e.replace(/4th Century/g, "IV Secolo");
  e = e.replace(/5th Century/g, "V Secolo");
  e = e.replace(/6th Century/g, "VI Secolo");
  e = e.replace(/ BC/g, " a.C.");
  e = e.replace(/ Giant/g, ""); // "Figura del "
  e = e.replace(/Modern/g, "Età Moderna");
  e = e.replace(/Renaissance/g, "Rinascimento");
  return e.trim();
}

for (const key in giants) {
  const g = giants[key];
  
  // Name
  if (nameMap[g.name]) {
    g.name = nameMap[g.name];
  }

  // Era
  g.era = translateEra(g.era);

  // Chat Greeting
  g.chatGreeting = `Saluti, sono ${g.name}. Cerchi la via della saggezza o hai domande sul viaggio della mia vita?`;

  // Suggested Questions
  g.suggestedQuestions = [
    `Parlami della tua più grande conquista, ${g.name}.`,
    "Come hai superato le tue sfide più difficili?",
    "Qual è il consiglio più importante che puoi darmi?"
  ];

  // Short Description templates
  let sd = g.shortDescription;
  sd = sd.replace(/The epic journey of (.*?) and his timeless wisdom\./, "Il viaggio epico di $1 e la sua saggezza senza tempo.");
  sd = sd.replace(/The epic journey of (.*?) and her timeless wisdom\./, "Il viaggio epico di $1 e la sua saggezza senza tempo.");
  sd = sd.replace(/The profound life and wisdom of (.*?)\./, "La profonda vita e saggezza di $1.");
  sd = sd.replace(/The epic journey of (.*?) and his futuristic wisdom\./, "Il viaggio epico di $1 e la sua saggezza orientata al futuro.");
  sd = sd.replace(/The legendary saga of (.*?) and his iron will\./, "La saga leggendaria di $1 e la sua volontà di ferro.");
  sd = sd.replace(/The glorious campaign of (.*?) and his eternal legacy\./, "La gloriosa campagna di $1 e la sua eredità eterna.");
  g.shortDescription = sd;
}

fs.writeFileSync('./messages/it.json', JSON.stringify(data, null, 2));
console.log('Programmatic replacement done.');
