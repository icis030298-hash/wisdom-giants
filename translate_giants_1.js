const fs = require('fs');
const data = require('./messages/it.json');
const t = {
  "steve-jobs": {
    "headline": "L'architetto visionario che ha unito la tecnologia all'anima umana.",
    "shortDescription": "Il viaggio epico di Steve Jobs e la sua saggezza senza tempo.",
    "quote": "Siate affamati, siate folli."
  },
  "king-sejong": {
    "headline": "Il saggio monarca che creò l'Hangul per donare una voce al suo popolo e illuminare una nazione.",
    "shortDescription": "La profonda vita e saggezza di Re Sejong il Grande.",
    "quote": "Se il popolo mi critica, è perché non l'ho amato abbastanza."
  },
  "elon-musk": {
    "headline": "Il pioniere indomabile che spinge i confini dell'umanità verso le stelle.",
    "shortDescription": "Il viaggio epico di Elon Musk e la sua visione orientata al futuro.",
    "quote": "Quando qualcosa è abbastanza importante, lo fai anche se le probabilità non sono a tuo favore."
  },
  "genghis-khan": {
    "headline": "Il conquistatore inarrestabile che ha forgiato il più grande impero della storia da umili origini.",
    "shortDescription": "La saga leggendaria di Gengis Khan e la sua volontà di ferro.",
    "quote": "Avere una sola mente e una sola fede, così potrai conquistare il mondo."
  },
  "alexander-the-great": {
    "headline": "Il giovane re che unì Oriente e Occidente con la sua insaziabile sete di grandezza.",
    "shortDescription": "La gloriosa campagna di Alessandro Magno e la sua eredità eterna.",
    "quote": "Non c'è nulla di impossibile per colui che oserà."
  },
  "walt-disney": {
    "headline": "L'immaginatore che trasformò i sogni in realtà e donò magia al mondo.",
    "shortDescription": "Il viaggio magico di Walt Disney e la sua anima creativa.",
    "quote": "Tutti i nostri sogni possono avverarsi, se abbiamo il coraggio di inseguirli."
  },
  "thomas-edison": {
    "headline": "L'inventore instancabile che illuminò il mondo con la sua persistenza.",
    "shortDescription": "La vita industriosa di Thomas Edison e le sue invenzioni.",
    "quote": "Il genio è l'uno percento di ispirazione e il novantanove percento di traspirazione."
  },
  "julius-caesar": {
    "headline": "Il geniale stratega e leader che ha gettato le basi per l'Impero Romano.",
    "shortDescription": "La saga politica e militare di Giulio Cesare.",
    "quote": "Veni, vidi, vici."
  },
  "henry-ford": {
    "headline": "L'industriale pioniere che mise il mondo su ruote.",
    "shortDescription": "La storia di Henry Ford e la nascita della produzione di massa.",
    "quote": "Sia che tu pensi di potercela fare o di non potercela fare, hai ragione."
  },
  "frida-kahlo": {
    "headline": "L'artista vibrante che dipinse il suo dolore trasformandolo in un capolavoro.",
    "shortDescription": "La vita intensa di Frida Kahlo e la sua anima artistica.",
    "quote": "Piedi, a cosa mi servite se ho ali per volare?"
  },
  "viktor-frankl": {
    "headline": "Lo psichiatra che trovò il significato della vita anche nelle tenebre più fitte.",
    "shortDescription": "Il viaggio spirituale di Viktor Frankl e la Logoterapia.",
    "quote": "Quando non siamo più in grado di cambiare una situazione, siamo sfidati a cambiare noi stessi."
  },
  "oprah-winfrey": {
    "headline": "La regina dei media che trasformò l'empatia e l'autenticità in un impero globale.",
    "shortDescription": "L'ispiratrice storia di successo di Oprah Winfrey.",
    "quote": "Il più grande segreto della vita è che non ci sono grandi segreti. Qualunque sia il tuo obiettivo, puoi arrivarci se sei disposto a lavorare."
  },
  "jk-rowling": {
    "headline": "L'autrice che ha portato la magia nel mondo attraverso il potere della perseveranza.",
    "shortDescription": "La magica vita di J.K. Rowling e del bambino sopravvissuto.",
    "quote": "Non abbiamo bisogno della magia per cambiare il mondo, abbiamo già dentro di noi tutto il potere di cui abbiamo bisogno."
  },
  "nelson-mandela": {
    "headline": "L'icona indomabile che demolì l'apartheid con il potere del perdono.",
    "shortDescription": "Il lungo cammino verso la libertà di Nelson Mandela.",
    "quote": "Sembra sempre impossibile finché non viene fatto."
  },
  "helen-keller": {
    "headline": "Il faro di speranza che superò un mondo di silenzio e oscurità.",
    "shortDescription": "L'incredibile trionfo di Helen Keller.",
    "quote": "Sebbene il mondo sia pieno di sofferenza, è anche pieno della vittoria su di essa."
  },
  "beethoven": {
    "headline": "Il colosso musicale che compose sinfonie di trionfo pur essendo sordo.",
    "shortDescription": "La lotta appassionata di Beethoven e la sua musica.",
    "quote": "La musica è una rivelazione più alta di ogni saggezza e filosofia."
  },
  "stephen-hawking": {
    "headline": "La mente brillante che esplorò l'universo da una sedia a rotelle.",
    "shortDescription": "Il viaggio celestiale di Stephen Hawking.",
    "quote": "Per quanto difficile possa sembrare la vita, c'è sempre qualcosa che puoi fare e in cui puoi avere successo."
  },
  "franklin-d-roosevelt": {
    "headline": "Il leader risoluto che guidò una nazione attraverso la depressione e la guerra globale.",
    "shortDescription": "La leadership resiliente di Franklin D. Roosevelt.",
    "quote": "L'unica cosa di cui dobbiamo avere paura è la paura stessa."
  },
  "marcus-aurelius": {
    "headline": "Il re filosofo che governò un impero guidato dai principi dello Stoicismo.",
    "shortDescription": "La saggezza stoica di Marco Aurelio.",
    "quote": "Hai potere sulla tua mente - non sugli eventi esterni. Comprendi questo, e troverai la forza."
  },
  "seneca": {
    "headline": "Il filosofo stoico che ha insegnato come trovare la pace in mezzo al caos.",
    "shortDescription": "Le lettere senza tempo di Seneca.",
    "quote": "Non è che abbiamo poco tempo da vivere, ma che ne sprechiamo molto."
  },
  "confucius": {
    "headline": "Il grande saggio i cui insegnamenti sull'armonia continuano a plasmare intere civiltà.",
    "shortDescription": "La saggezza senza tempo di Confucio.",
    "quote": "Non importa quanto vai piano, purché non ti fermi."
  },
  "socrates": {
    "headline": "Il filosofo fondatore che cercò la verità attraverso il dubbio e l'interrogazione costanti.",
    "shortDescription": "Il metodo socratico e la ricerca della verità.",
    "quote": "L'unica vera saggezza sta nel sapere di non sapere nulla."
  },
  "lao-tzu": {
    "headline": "Il misterioso saggio che ha rivelato il potere della semplicità e del seguire il flusso della natura.",
    "shortDescription": "Il Tao Te Ching e la saggezza del non agire.",
    "quote": "Un viaggio di mille miglia inizia con un solo passo."
  },
  "aristotle": {
    "headline": "Il polimata la cui mente logica ha gettato le basi della scienza e della filosofia occidentali.",
    "shortDescription": "La mente analitica di Aristotele.",
    "quote": "L'eccellenza non è un atto, ma un'abitudine."
  },
  "plato": {
    "headline": "L'idealista che ha immaginato una società perfetta governata da re filosofi.",
    "shortDescription": "La Repubblica e l'Allegoria della Caverna.",
    "quote": "La più grande ricchezza è vivere contenti del poco."
  },
  "mahatma-gandhi": {
    "headline": "L'anima grande che condusse una nazione all'indipendenza attraverso la non-violenza.",
    "shortDescription": "Il movimento del satyagraha di Gandhi.",
    "quote": "Sii il cambiamento che vuoi vedere nel mondo."
  },
  "mother-teresa": {
    "headline": "Il simbolo vivente della compassione che ha dedicato la sua vita ai più poveri tra i poveri.",
    "shortDescription": "L'umile servizio di Madre Teresa.",
    "quote": "Non tutti possiamo fare grandi cose. Ma possiamo fare piccole cose con grande amore."
  },
  "leonardo-da-vinci": {
    "headline": "L'uomo universale la cui infinita curiosità ha unito arte e scienza.",
    "shortDescription": "La curiosità sconfinata di Leonardo Da Vinci.",
    "quote": "Imparare non stanca mai la mente."
  },
  "salvador-dali": {
    "headline": "Il genio eccentrico che dipinse i paesaggi dell'inconscio.",
    "shortDescription": "Il mondo eccentrico di Salvador Dalí.",
    "quote": "L'unica differenza tra me e un pazzo è che io non sono pazzo."
  },
  "coco-chanel": {
    "headline": "La visionaria che ha rivoluzionato la moda liberando le donne dai corsetti.",
    "shortDescription": "Lo stile rivoluzionario di Coco Chanel.",
    "quote": "Per essere insostituibili bisogna essere sempre diversi."
  },
  "pablo-picasso": {
    "headline": "Il pioniere artistico che ha frantumato e ricostruito il modo in cui vediamo il mondo.",
    "shortDescription": "La visione trasformativa di Pablo Picasso.",
    "quote": "Ogni bambino è un artista. Il problema è come rimanere un artista una volta cresciuti."
  },
  "mozart": {
    "headline": "Il bambino prodigio che ha composto le melodie più celestiali del mondo classico.",
    "shortDescription": "La brillantezza tragica di Mozart.",
    "quote": "La musica non è nelle note, ma nel silenzio tra di esse."
  },
  "william-shakespeare": {
    "headline": "Il drammaturgo che ha compreso e catturato ogni sfumatura dell'esperienza umana.",
    "shortDescription": "Il palcoscenico eterno di William Shakespeare.",
    "quote": "Siamo fatti della stessa sostanza di cui sono fatti i sogni."
  },
  "marie-curie": {
    "headline": "La scienziata implacabile che ha sacrificato la sua vita per scoprire i segreti della radioattività.",
    "shortDescription": "Il radioso sacrificio di Marie Curie.",
    "quote": "Nella vita non c'è nulla da temere, solo da comprendere."
  },
  "nikola-tesla": {
    "headline": "L'inventore elettrizzante la cui mente ha illuminato il mondo intero.",
    "shortDescription": "Le correnti alternate della mente di Tesla.",
    "quote": "Il presente è loro; il futuro, per il quale ho davvero lavorato, è mio."
  }
};
Object.keys(t).forEach(k => {
  if (data.Giants[k]) {
    data.Giants[k].headline = t[k].headline;
    data.Giants[k].shortDescription = t[k].shortDescription;
    data.Giants[k].quote = t[k].quote;
  }
});
fs.writeFileSync('./messages/it.json', JSON.stringify(data, null, 2));
console.log('Translated 1-35');
