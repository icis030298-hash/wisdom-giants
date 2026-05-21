const fs = require('fs');
const data = require('./messages/it.json');
const t = {
  "vincent-van-gogh": {
    "headline": "L'artista tormentato che dipinse la bellezza del cosmo attraverso il suo dolore.",
    "shortDescription": "Le notti stellate e le tempeste interiori di Van Gogh.",
    "quote": "Sogno il mio dipinto, e poi dipingo il mio sogno."
  },
  "george-washington": {
    "headline": "Il padre fondatore che rifiutò il potere assoluto per far nascere una democrazia.",
    "shortDescription": "Il servizio rivoluzionario di Washington.",
    "quote": "È meglio non dare scuse piuttosto che darne di cattive."
  },
  "yi-sun-shin": {
    "headline": "L'ammiraglio marziale che salvò una nazione con le navi tartaruga e l'assoluta lealtà.",
    "shortDescription": "La brillantezza navale e il sacrificio dell'Ammiraglio Yi.",
    "quote": "Coloro che cercano la morte vivranno; coloro che cercano la vita moriranno."
  },
  "elizabeth-i": {
    "headline": "La Regina Vergine che sposò la sua nazione e inaugurò un'età dell'oro.",
    "shortDescription": "La volontà sovrana della Regina Elisabetta I.",
    "quote": "Ho il cuore e lo stomaco di un re, e di un re d'Inghilterra."
  },
  "gwanggaeto-the-great": {
    "headline": "Il monarca espansionista che estese il regno ai suoi massimi confini.",
    "shortDescription": "L'espansione territoriale e l'eredità di Gwanggaeto.",
    "quote": "Un paese forte si protegge attaccando."
  },
  "qin-shi-huang": {
    "headline": "Il primo imperatore che unificò una nazione attraverso la forza spietata e la standardizzazione.",
    "shortDescription": "Il potere assoluto e l'ordine di Qin Shi Huang.",
    "quote": "Non mi interessa se un gatto è bianco o nero, purché catturi i topi. (Attribuita a Deng, in realtà per Qin: La legge deve essere severa e spietata per garantire l'ordine)."
  },
  "augustus": {
    "headline": "Il genio politico che trasformò Roma da una repubblica di mattoni in un impero di marmo.",
    "shortDescription": "Il genio politico di Augusto.",
    "quote": "Ho trovato Roma una città di mattoni e ve l'ho lasciata di marmo."
  },
  "otto-von-bismarck": {
    "headline": "Il Cancelliere di Ferro che unificò la Germania con sangue e ferro.",
    "shortDescription": "La realpolitik di Bismarck.",
    "quote": "Le grandi questioni del tempo non si decideranno con discorsi e risoluzioni... ma col sangue e col ferro."
  },
  "peter-the-great": {
    "headline": "Lo zar modernizzatore che trascinò con la forza una nazione feudale nel mondo moderno.",
    "shortDescription": "La trasformazione della Russia sotto Pietro il Grande.",
    "quote": "Non ho imparato a sottomettermi, ma a comandare."
  },
  "catherine-the-great": {
    "headline": "L'imperatrice illuminata che ha trasformato il suo regno in una potenza europea.",
    "shortDescription": "Il viaggio epico e la saggezza di Caterina la Grande.",
    "quote": "Elogia a voce alta, biasima a bassa voce."
  },
  "simon-bolivar": {
    "headline": "Il Liberatore che sognava un continente unito, libero dal dominio straniero.",
    "shortDescription": "Il viaggio epico di Simón Bolívar.",
    "quote": "L'arte della vittoria si impara nelle sconfitte."
  },
  "margaret-thatcher": {
    "headline": "La Lady di Ferro che ha rimodellato l'economia di una nazione con ferma determinazione.",
    "shortDescription": "Il viaggio epico di Margaret Thatcher.",
    "quote": "Non conosco nessuno che sia arrivato in cima senza duro lavoro."
  },
  "john-d-rockefeller": {
    "headline": "Il titano degli affari che ha costruito l'impero petrolifero globale.",
    "shortDescription": "Il viaggio epico di John D. Rockefeller.",
    "quote": "Non abbiate paura di rinunciare al buono per inseguire il grande."
  },
  "ataturk": {
    "headline": "Il leader visionario che ha forgiato una repubblica moderna dalle rovine di un impero.",
    "shortDescription": "Il viaggio epico di Mustafa Kemal Atatürk.",
    "quote": "La pace in patria, la pace nel mondo."
  },
  "theodore-roosevelt": {
    "headline": "Il conservazionista ed esploratore che ha portato l'energia nel governo.",
    "shortDescription": "Il viaggio epico di Theodore Roosevelt.",
    "quote": "Fai quello che puoi, con quello che hai, dove sei."
  },
  "anne-frank": {
    "headline": "La giovane scrittrice che ha documentato lo spirito umano nei tempi più bui.",
    "shortDescription": "Il viaggio epico di Anna Frank.",
    "quote": "Nonostante tutto, continuo a credere che le persone siano veramente buone in fondo al cuore."
  },
  "rosa-parks": {
    "headline": "La madre del movimento per i diritti civili il cui rifiuto ha scatenato una rivoluzione.",
    "shortDescription": "Il viaggio epico di Rosa Parks.",
    "quote": "Sapevo che qualcuno doveva fare il primo passo e decisi di non muovermi."
  },
  "frederick-douglass": {
    "headline": "L'abolizionista che ha trasformato la sua fuga dalla schiavitù in una potente voce per la libertà.",
    "shortDescription": "Il viaggio epico di Frederick Douglass.",
    "quote": "Senza lotta, non c'è progresso."
  },
  "harriet-tubman": {
    "headline": "L'eroina senza paura che ha condotto innumerevoli schiavi verso la libertà attraverso la Underground Railroad.",
    "shortDescription": "Il viaggio epico di Harriet Tubman.",
    "quote": "Ogni grande sogno inizia con un sognatore."
  },
  "oskar-schindler": {
    "headline": "L'industriale che ha rischiato tutto per salvare centinaia di vite durante l'Olocausto.",
    "shortDescription": "Il viaggio epico di Oskar Schindler.",
    "quote": "Chi salva una vita, salva il mondo intero."
  },
  "florence-nightingale": {
    "headline": "La pioniera dell'infermieristica moderna che ha portato luce e compassione nelle cure mediche.",
    "shortDescription": "Il viaggio epico di Florence Nightingale.",
    "quote": "Attibuisco il mio successo a questo: non ho mai dato né accettato scuse."
  },
  "yu-gwan-sun": {
    "headline": "La giovane martire la cui determinazione accese il movimento di indipendenza.",
    "shortDescription": "Il viaggio epico di Yu Gwan-sun.",
    "quote": "Anche se mi strappate le unghie e mi mozzate le orecchie, il dolore di perdere il mio paese è molto più grande."
  },
  "louis-braille": {
    "headline": "L'inventore che ha portato il dono della lettura ai ciechi attraverso il tatto.",
    "shortDescription": "Il viaggio epico di Louis Braille.",
    "quote": "L'accesso alla comunicazione in senso più ampio è l'accesso alla conoscenza."
  },
  "joan-of-arc": {
    "headline": "La guerriera divinamente ispirata che guidò l'esercito francese alla vittoria a diciassette anni.",
    "shortDescription": "Il viaggio epico di Giovanna d'Arco.",
    "quote": "Non ho paura... Sono nata per fare questo."
  },
  "desmond-tutu": {
    "headline": "L'arcivescovo della pace che ha combattuto l'apartheid con amore e riconciliazione.",
    "shortDescription": "Il viaggio epico di Desmond Tutu.",
    "quote": "Fai il tuo piccolo pezzo di bene dove ti trovi; sono quei piccoli pezzi di bene messi insieme che travolgono il mondo."
  },
  "elie-wiesel": {
    "headline": "Il sopravvissuto e autore che ha trasformato il suo dolore in un monito per l'umanità.",
    "shortDescription": "Il viaggio epico di Elie Wiesel.",
    "quote": "L'opposto dell'amore non è l'odio, è l'indifferenza."
  },
  "harriet-beecher-stowe": {
    "headline": "L'autrice le cui parole appassionate contribuirono ad accendere la lotta contro la schiavitù.",
    "shortDescription": "Il viaggio epico di Harriet Beecher Stowe.",
    "quote": "Mai arrendersi, perché quello è esattamente il luogo e il tempo in cui la marea cambierà."
  },
  "rigoberta-menchu": {
    "headline": "La difensora dei diritti indigeni che ha alzato la voce contro l'oppressione in Guatemala.",
    "shortDescription": "Il viaggio epico di Rigoberta Menchú.",
    "quote": "La pace non è solo assenza di guerra, è la presenza della giustizia."
  },
  "terry-fox": {
    "headline": "L'eroe canadese che ha unito una nazione con la sua Maratona della Speranza.",
    "shortDescription": "Il viaggio epico di Terry Fox.",
    "quote": "Voglio provare, per mostrare agli altri che si può fare."
  },
  "kim-gu": {
    "headline": "Il leader dell'indipendenza che dedicò la sua vita a una Corea libera.",
    "shortDescription": "Il viaggio epico di Kim Gu.",
    "quote": "Il mio primo desiderio è l'indipendenza della Corea. Il mio secondo desiderio è la piena indipendenza."
  },
  "buddha": {
    "headline": "Il saggio illuminato che insegnò la via di mezzo e la liberazione dalla sofferenza.",
    "shortDescription": "La saggezza senza tempo del Buddha.",
    "quote": "La pace viene da dentro. Non cercarla fuori."
  },
  "friedrich-nietzsche": {
    "headline": "Il filosofo iconoclasta che sfidò la moralità convenzionale ed esaltò la volontà di potenza.",
    "shortDescription": "Il viaggio epico di Friedrich Nietzsche.",
    "quote": "Quello che non mi uccide, mi rende più forte."
  },
  "immanuel-kant": {
    "headline": "Il pensatore sistematico che ha rivoluzionato la filosofia con la sua critica della ragione.",
    "shortDescription": "Il viaggio epico di Immanuel Kant.",
    "quote": "Il cielo stellato sopra di me, la legge morale dentro di me."
  },
  "rene-descartes": {
    "headline": "Il filosofo razionalista che ha fondato la filosofia moderna sul dubbio e sulla certezza.",
    "shortDescription": "Il viaggio epico di René Descartes.",
    "quote": "Penso, dunque sono."
  },
  "jean-jacques-rousseau": {
    "headline": "Il filosofo romantico che affermava che l'umanità è naturalmente buona ma corrotta dalla società.",
    "shortDescription": "Il viaggio epico di Jean-Jacques Rousseau.",
    "quote": "L'uomo è nato libero, e ovunque è in catene."
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
console.log('Translated 36-70');
