import { giantsData } from "../src/data/giants";
import fs from "fs";
import path from "path";

// A mapper dictionary to categorize each slug
const mappingRules: Record<string, string> = {
  // leadership
  "napoleon-bonaparte": "leadership",
  "king-sejong": "leadership",
  "genghis-khan": "leadership",
  "alexander-the-great": "leadership",
  "julius-caesar": "leadership",
  "franklin-d-roosevelt": "leadership",
  "marcus-aurelius": "philosophy", // Stoic philosopher & emperor, philosophy is best fit
  "george-washington": "leadership",
  "yi-sun-shin": "leadership",
  "elizabeth-i": "leadership",
  "gwanggaeto-the-great": "leadership",
  "winston-churchill": "leadership",
  "qin-shi-huang": "leadership",
  "augustus": "leadership",
  "otto-von-bismarck": "leadership",
  "peter-the-great": "leadership",
  "catherine-the-great": "leadership",
  "simon-bolivar": "leadership",
  "ataturk": "leadership",
  "theodore-roosevelt": "leadership",
  "alexander-hamilton": "leadership",
  "john-f-kennedy": "leadership",
  "queen-victoria": "leadership",
  "thomas-jefferson": "leadership",
  "ahn-jung-geun": "leadership",
  "empress-wu-zetian": "leadership",
  "zhuge-liang": "leadership",
  "ashoka-the-great": "leadership",
  "king-jeongjo": "leadership",
  "oda-nobunaga": "leadership",
  "sun-yat-sen": "leadership",
  "tokugawa-ieyasu": "leadership",
  "toyotomi-hideyoshi": "leadership",
  "chulalongkorn": "leadership",
  "hannibal-barca": "leadership",
  "jayavarman-vii": "leadership",
  "mansa-musa": "leadership",
  "shaka-zulu": "leadership",
  "chandragupta-maurya": "leadership",
  "saladin": "leadership",
  "suleiman-the-magnificent": "leadership",

  // science
  "thomas-edison": "science",
  "albert-einstein": "science",
  "marie-curie": "science",
  "nikola-tesla": "science",
  "alexander-fleming": "science",
  "johannes-kepler": "science",
  "al-khwarizmi": "science",
  "robert-oppenheimer": "science",
  "srinivasa-ramanujan": "science",
  "archimedes": "science",
  "copernicus": "science",
  "louis-pasteur": "science",
  "alexander-graham-bell": "science",
  "galileo-galilei": "science",
  "charles-darwin": "science",

  // philosophy
  "seneca": "philosophy",
  "confucius": "philosophy",
  "socrates": "philosophy",
  "lao-tzu": "philosophy",
  "aristotle": "philosophy",
  "plato": "philosophy",
  "buddha": "philosophy",
  "friedrich-nietzsche": "philosophy",
  "immanuel-kant": "philosophy",
  "rene-descartes": "philosophy",
  "jean-jacques-rousseau": "philosophy",
  "sigmund-freud": "philosophy",
  "carl-jung": "philosophy",
  "baruch-spinoza": "philosophy",
  "sun-tzu": "philosophy", // Sun Tzu is military philosophy
  "david-hume": "philosophy",
  "john-locke": "philosophy",
  "soren-kierkegaard": "philosophy",
  "arthur-schopenhauer": "philosophy",
  "benjamin-franklin": "philosophy", // or leadership, but polymath/writer/philosophy fits well
  "francis-bacon": "philosophy",
  "jeong-yak-yong": "philosophy",
  "mencius": "philosophy",
  "zhuangzi": "philosophy",
  "miyamoto-musashi": "philosophy", // book of five rings / martial philosophy
  "swami-vivekananda": "philosophy",
  "adam-smith": "philosophy", // moral philosopher & economist
  "machiavelli": "philosophy",
  "voltaire": "philosophy",
  "henry-david-thoreau": "philosophy",
  "ralph-waldo-emerson": "philosophy",

  // arts
  "walt-disney": "arts", // or business, but arts/creativity is very strong
  "frida-kahlo": "arts",
  "beethoven": "arts",
  "leonardo-da-vinci": "arts", // polymath, but arts/creativity is iconic
  "mozart": "arts",
  "william-shakespeare": "arts",
  "vincent-van-gogh": "arts",
  "michelangelo": "arts",
  "claude-monet": "arts",
  "fyodor-dostoevsky": "arts",
  "victor-hugo": "arts",
  "anton-chekhov": "arts",
  "frederic-chopin": "arts",
  "katsushika-hokusai": "arts",
  "agatha-christie": "arts",
  "mark-twain": "arts",
  "goethe": "arts",
  "mary-shelley": "arts",
  "li-bai": "arts",
  "dante-alighieri": "arts",
  "edgar-allan-poe": "arts",
  "ernest-hemingway": "arts",
  "walt-whitman": "arts",

  // society
  "viktor-frankl": "society", // or philosophy/psychology
  "helen-keller": "society",
  "mahatma-gandhi": "society",
  "martin-luther-king": "society",
  "frederick-douglass": "society",
  "harriet-tubman": "society",
  "oskar-schindler": "society",
  "florence-nightingale": "society",
  "susan-b-anthony": "society",
  "b-r-ambedkar": "society",

  // business
  "henry-ford": "business",
  "john-d-rockefeller": "business",
  "andrew-carnegie": "business",
  "jp-morgan": "business",
  "ibn-battuta": "business", // explorer
  "amelia-earhart": "business", // explorer/aviator
};

// Check if any slug is missing from mappingRules
const unmapped: any[] = [];
for (const giant of giantsData) {
  if (!mappingRules[giant.slug]) {
    unmapped.push(giant);
  }
}

console.log("Unmapped count:", unmapped.length);
if (unmapped.length > 0) {
  console.log("Unmapped giants:");
  unmapped.forEach(g => {
    console.log(`- Slug: ${g.slug}, Name: ${g.name}, Category: ${g.category}, Era: ${g.era}`);
  });
}
