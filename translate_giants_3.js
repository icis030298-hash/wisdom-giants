const fs = require('fs');
const data = require('./messages/it.json');
const t = {
  "sigmund-freud": {
    "headline": "Il padre della psicoanalisi che ha svelato i segreti dell'inconscio.",
    "shortDescription": "Il viaggio epico di Sigmund Freud.",
    "quote": "Dall'errore all'errore si scopre l'intera verità."
  },
  "carl-jung": {
    "headline": "Lo psichiatra pioniere che ha esplorato l'inconscio collettivo e gli archetipi.",
    "shortDescription": "Il viaggio epico di Carl Jung.",
    "quote": "La tua visione diventerà chiara solo quando potrai guardare nel tuo cuore."
  },
  "baruch-spinoza": {
    "headline": "Il filosofo razionalista che ha trovato Dio nella natura e nell'ordine dell'universo.",
    "shortDescription": "Il viaggio epico di Baruch Spinoza.",
    "quote": "Non piangere, non indignarti, ma comprendi."
  },
  "sun-tzu": {
    "headline": "L'antico stratega militare le cui saggezze guidano ancor oggi leader e generali.",
    "shortDescription": "Il viaggio epico di Sun Tzu.",
    "quote": "La più grande vittoria è quella che non richiede alcuna battaglia."
  },
  "david-hume": {
    "headline": "L'empirista scozzese che ha messo in dubbio le fondamenta stesse della conoscenza umana.",
    "shortDescription": "Il viaggio epico di David Hume.",
    "quote": "La ragione è, e deve solo essere, schiava delle passioni."
  },
  "john-locke": {
    "headline": "Il padre del liberalismo la cui filosofia ha ispirato le rivoluzioni democratiche.",
    "shortDescription": "Il viaggio epico di John Locke.",
    "quote": "Tutta l'umanità... essendo tutti uguali e indipendenti, nessuno dovrebbe nuocere all'altro."
  },
  "simone-de-beauvoir": {
    "headline": "La filosofa esistenzialista che ha tracciato il percorso per il femminismo moderno.",
    "shortDescription": "Il viaggio epico di Simone de Beauvoir.",
    "quote": "Donne non si nasce, lo si diventa."
  },
  "hannah-arendt": {
    "headline": "La teorica politica che ha svelato la natura del potere e della banalità del male.",
    "shortDescription": "Il viaggio epico di Hannah Arendt.",
    "quote": "Non ci sono pensieri pericolosi; pensare è di per sé pericoloso."
  },
  "soren-kierkegaard": {
    "headline": "Il padre dell'esistenzialismo che ha esplorato il significato della fede e dell'individualità.",
    "shortDescription": "Il viaggio epico di Søren Kierkegaard.",
    "quote": "La vita può essere compresa solo all'indietro; ma deve essere vissuta in avanti."
  },
  "arthur-schopenhauer": {
    "headline": "Il filosofo pessimista che ha visto la volontà come la forza trainante dell'esistenza.",
    "shortDescription": "Il viaggio epico di Arthur Schopenhauer.",
    "quote": "La compassione è la base della moralità."
  },
  "isaac-newton": {
    "headline": "Il gigante della scienza che ha decifrato le leggi universali del movimento e della gravità.",
    "shortDescription": "Il viaggio epico di Isaac Newton.",
    "quote": "Ciò che sappiamo è una goccia, ciò che ignoriamo è un oceano."
  },
  "galileo-galilei": {
    "headline": "L'astronomo coraggioso che difese la verità scientifica contro il dogma.",
    "shortDescription": "Il viaggio epico di Galileo Galilei.",
    "quote": "Non puoi insegnare nulla a un uomo; puoi solo aiutarlo a scoprirlo dentro di sé."
  },
  "charles-darwin": {
    "headline": "Il naturalista visionario che svelò il meccanismo dell'evoluzione.",
    "shortDescription": "Il viaggio epico di Charles Darwin.",
    "quote": "Non è la più forte delle specie che sopravvive, né la più intelligente, ma quella più reattiva ai cambiamenti."
  },
  "michelangelo": {
    "headline": "Il genio universale del Rinascimento che diede forma al divino attraverso il marmo.",
    "shortDescription": "Il viaggio epico di Michelangelo.",
    "quote": "Il pericolo più grande per la maggior parte di noi non è che il nostro obiettivo sia troppo alto e lo manchiamo, ma che sia troppo basso e lo raggiungiamo."
  },
  "claude-monet": {
    "headline": "Il fondatore dell'Impressionismo che ha catturato la luce sfuggente della natura.",
    "shortDescription": "Il viaggio epico di Claude Monet.",
    "quote": "Tutti discutono la mia arte e fingono di capire, come se fosse necessario capire, quando è semplicemente necessario amare."
  },
  "fyodor-dostoevsky": {
    "headline": "Il gigante letterario che ha scandagliato le profondità abissali dell'anima umana.",
    "shortDescription": "Il viaggio epico di Fëdor Dostoevskij.",
    "quote": "Il segreto dell'esistenza umana non sta nel solo restare vivi, ma nel trovare qualcosa per cui vivere."
  },
  "victor-hugo": {
    "headline": "Il romanziere romantico che ha dato voce agli emarginati della società.",
    "shortDescription": "Il viaggio epico di Victor Hugo.",
    "quote": "Niente è più potente di un'idea il cui tempo è giunto."
  },
  "anton-chekhov": {
    "headline": "Il maestro del racconto breve che ha catturato la tragica bellezza della vita ordinaria.",
    "shortDescription": "Il viaggio epico di Anton Čechov.",
    "quote": "La conoscenza non ha alcun valore a meno che non la metti in pratica."
  },
  "frederic-chopin": {
    "headline": "Il poeta del pianoforte che ha tradotto l'emozione umana in pura melodia.",
    "shortDescription": "Il viaggio epico di Fryderyk Chopin.",
    "quote": "La semplicità è l'ultima conquista."
  },
  "katsushika-hokusai": {
    "headline": "L'artista ukiyo-e che ha immortalato il mondo fluttuante con i suoi capolavori.",
    "shortDescription": "Il viaggio epico di Katsushika Hokusai.",
    "quote": "Dall'età di sei anni ho avuto la mania di copiare la forma delle cose."
  },
  "agatha-christie": {
    "headline": "La Regina del Crimine che ha tessuto misteri intramontabili.",
    "shortDescription": "Il viaggio epico di Agatha Christie.",
    "quote": "Il segreto per andare avanti è iniziare."
  },
  "mark-twain": {
    "headline": "L'umorista americano che ha svelato le verità della società attraverso la satira pungente.",
    "shortDescription": "Il viaggio epico di Mark Twain.",
    "quote": "Il segreto per andare avanti è iniziare."
  },
  "goethe": {
    "headline": "Il gigante letterario tedesco che ha esplorato le vette e le profondità dell'esperienza umana.",
    "shortDescription": "Il viaggio epico di Johann Wolfgang von Goethe.",
    "quote": "Siamo plasmati e modellati da ciò che amiamo."
  },
  "mary-shelley": {
    "headline": "La pioniera letteraria che ha dato vita alla fantascienza e al romanzo gotico moderno.",
    "shortDescription": "Il viaggio epico di Mary Shelley.",
    "quote": "Non c'è niente che calmi tanto la mente quanto uno scopo stabile."
  },
  "napoleon-bonaparte": {
    "headline": "Il generale ambizioso che ha rimodellato l'Europa e fondato un impero.",
    "shortDescription": "L'epica saga di Napoleone e la sua grande ambizione.",
    "quote": "La parola 'impossibile' si trova solo nel dizionario degli stolti."
  },
  "malala-yousafzai": {
    "headline": "L'attivista senza paura che ha sfidato i talebani per il diritto all'istruzione delle ragazze.",
    "shortDescription": "Il viaggio epico di Malala Yousafzai.",
    "quote": "Un bambino, un insegnante, un libro e una penna possono cambiare il mondo."
  },
  "martin-luther-king": {
    "headline": "Il leader visionario che ha combattuto per l'uguaglianza con il potere della non violenza e dei sogni.",
    "shortDescription": "La crociata per i diritti civili di Martin Luther King Jr.",
    "quote": "L'oscurità non può scacciare l'oscurità; solo la luce può farlo. L'odio non può scacciare l'odio; solo l'amore può farlo."
  },
  "albert-einstein": {
    "headline": "Il fisico geniale che ha reimmaginato il cosmo attraverso la relatività.",
    "shortDescription": "La relatività del genio e Albert Einstein.",
    "quote": "L'immaginazione è più importante della conoscenza."
  },
  "abraham-lincoln": {
    "headline": "Il presidente emancipatore che ha tenuto unita una nazione divisa.",
    "shortDescription": "Le radici umili e la leadership di Lincoln.",
    "quote": "Alla fine, non sono gli anni della tua vita che contano. È la vita nei tuoi anni."
  },
  "winston-churchill": {
    "headline": "Il leader risoluto la cui voce portò una nazione attraverso la sua ora più buia.",
    "shortDescription": "La leadership in tempo di guerra di Churchill.",
    "quote": "Il successo non è definitivo, il fallimento non è fatale: è il coraggio di continuare che conta."
  },
  "jane-austen": {
    "headline": "L'osservatrice acuta che ha catturato il cuore umano in narrazioni ironiche ed eleganti.",
    "shortDescription": "Il genio letterario di Jane Austen.",
    "quote": "Non c'è fascino pari alla tenerezza del cuore."
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
console.log('Translated 71-101');
