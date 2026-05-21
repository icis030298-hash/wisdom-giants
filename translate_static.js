const fs = require('fs');
const data = require('./messages/it.json');
const translated = {
  Navigation: {
    hallOfGems: 'Sala delle Grandi Menti',
    wisdomArchive: 'Home',
    chatList: 'Le Mie Conversazioni',
    about: 'Chi Siamo',
    startExploring: 'Esplora la Sala',
    title: 'Giants Wisdom',
    subtitle: 'La Sala delle Grandi Menti',
    login: 'Accedi',
    logout: 'Esci',
    myProfile: 'Il Mio Profilo',
    signInRequired: 'Accesso richiesto per visualizzare la cronologia.'
  },
  Auth: {
    loginModalTitle: 'Benvenuto nella Sala delle Grandi Menti',
    loginModalDescription: 'Conserva i tuoi dialoghi con le grandi figure storiche e gestisci l\'eredità di saggezza incisa nella tua anima.',
    continueWithGoogle: 'Continua con Google',
    loginSuccess: 'Benvenuto nella Sala delle Grandi Menti.',
    logout: 'Esci',
    chatList: 'Le Mie Conversazioni',
    signInRequired: 'Accesso Richiesto'
  },
  Test: {
    title: 'Trova la Grande Eredità che Scorre nella Tua Anima',
    subtitle: 'Test di Analisi del Temperamento Storico',
    start: 'Inizia il Test',
    back: 'Indietro',
    banner: {
      new: 'NUOVO CONTENUTO',
      title: 'Quale grande figura storica\nti somiglia di più?',
      desc: 'Scopri il tuo gemello storico in 15 domande.',
      button: 'Inizia il Test'
    },
    stages: {
      stage1: 'Fase 1: Il Risveglio',
      stage2: 'Fase 2: La Prova',
      stage3: 'Fase 3: Il Destino',
      cleared: 'Fase {stage} Superata!',
      ready: 'Pronto per passare alla prossima fase?',
      next: 'Continua alla Prossima Fase'
    },
    analysis: {
      loading: 'Analizzando gli echi della tua anima...',
      sub: 'Cercando i tuoi pilastri nel grande flusso della storia.'
    },
    result: {
      matchFound: 'Hai incontrato il tuo destino storico',
      archetype: 'Il Tuo Profilo di Eredità',
      matchedGiant: 'La figura storica più simile a te',
      readEpic: 'Leggi la Biografia',
      chatNow: 'Chatta Ora'
    }
  },
  Chats: {
    title: 'Le Mie Conversazioni',
    subtitle: 'Dialoghi con Grandi Menti',
    description: 'Rivisita profonde intuizioni e consigli dalle più grandi figure della storia. Puoi riprendere qualsiasi conversazione in ogni momento.',
    emptyTitle: 'Nessuna conversazione ancora',
    emptyDescription: 'Le grandi menti sono pronte ad ascoltare le tue preoccupazioni. Inizia la tua prima conversazione ora!',
    startFirstChat: 'Inizia la tua prima conversazione',
    messages: 'messaggi',
    lastChat: 'Ultima chat'
  },
  Hero: {
    badge: 'La Sala delle Grandi Menti',
    quote: 'Se ho visto più lontano, è perché stavo sulle spalle di giganti.',
    quoteAuthor: 'Isaac Newton',
    startJourney: 'Inizia il Viaggio',
    startTest: '🧬 Trova il Tuo Gemello Storico',
    exploreHall: '🏛️ Esplora la Sala',
    stats: {
      minds: 'Grandi Menti',
      questions: 'Domande',
      free: 'Completamente Gratuito',
      freeValue: 'Gratuito'
    },
    guide: {
      title: 'Guida alla Sala della Saggezza',
      selectGiant: 'Seleziona una Figura',
      selectGiantDesc: 'Trova figure ispiratrici tra oltre 95 leggende storiche.',
      epic: 'Racconti Epici',
      epicDesc: 'Leggi storie di vita come se fossero le stesse grandi figure a raccontarle.',
      chat: 'Chat in Tempo Reale',
      chatDesc: 'Condividi le tue preoccupazioni con figure storiche rinate attraverso l\'IA più recente.',
      startNow: 'Inizia Ora'
    }
  },
  Featured: {
    title: 'La Sala delle Grandi Menti',
    description: 'Esplora la saggezza delle figure che hanno cambiato la storia. Seleziona un personaggio per iniziare una conversazione che trascende il tempo e lo spazio.',
    viewAll: 'Tutte le Figure',
    bestPick: 'Scelta Migliore',
    todaysPick: 'Scelta di Oggi',
    chatNow: 'Chatta Ora'
  },
  GiantsGrid: {
    title: 'Grandi Menti della Storia',
    description: 'Esplora la saggezza delle figure che hanno cambiato il corso dell\'umanità. Seleziona una figura storica per iniziare una conversazione che trascende il tempo e lo spazio.',
    searchPlaceholder: 'Cerca per nome o campo...',
    allGiants: 'Tutti',
    categories: {
      achievement: 'Conquiste',
      adversity: 'Avversità',
      wisdom: 'Saggezza',
      creativity: 'Creatività'
    },
    resultsCount: 'Trovate {filtered} figure storiche su {total}',
    readEpic: 'Leggi la Biografia ✨',
    noResults: 'Nessun risultato trovato',
    era: 'Figura Storica',
    pagination: {
      first: 'Primo',
      prev: 'Prec',
      next: 'Succ',
      last: 'Ultimo'
    }
  },
  GiantDetail: {
    returnToSquare: 'Torna alla Sala',
    chatWith: 'Chatta con {name}',
    theLifeStory: 'Storia di Vita',
    thePain: 'La Sofferenza',
    theRecovery: 'La Rinascita',
    wisdomLessons: 'Lezioni di Saggezza',
    famousQuote: 'Citazione Celebre',
    era: 'Epoca',
    field: 'Categoria',
    askForAdvice: 'Chiedi un Consiglio',
    notFound: 'Figura non trovata.',
    goHome: 'Home'
  },
  Chat: {
    famousQuote: 'Citazione Celebre',
    description: 'Descrizione',
    suggestedQuestions: 'Domande Suggerite',
    inputPlaceholder: 'Chiedi qualsiasi cosa a {name}...',
    contemplating: '{name} sta riflettendo...',
    wisdomActive: 'Saggezza Attiva',
    historyEra: 'Storia ed Epoca',
    fieldOfWisdom: 'Campo di Saggezza',
    error: 'Mi scuso, ho riscontrato un errore nel recuperare la mia saggezza. Potresti riprovare tra un momento?',
    retry: 'Recupera la Saggezza di Nuovo'
  },
  Stats: {
    title: 'Perché Giants Wisdom',
    description: 'Vivi un viaggio innovativo attraverso migliaia di anni per incontrare la saggezza umana.',
    features: [
      {
        title: 'Chat in Tempo Reale con le Grandi Menti',
        description: 'Impegnati in conversazioni profonde che trascendono il tempo e lo spazio con figure storiche attraverso un\'IA avanzata.'
      },
      {
        title: '2.500 Anni di Saggezza Umana',
        description: 'Incontra 2.500 anni di storia, conquiste e intuizioni costruite dall\'umanità, tutto in un unico luogo.'
      },
      {
        title: 'Conoscenza Direttamente dai Maestri',
        description: 'Offriamo il valore di un apprendimento vivido, come se si ascoltassero direttamente i maestri di filosofia, scienza e arte.'
      },
      {
        title: "Intuizioni Personalizzate per Te",
        description: "Fai domande, esplora idee e ottieni una guida personalizzata necessaria per la tua vita."
      }
    ],
    stats: {
      minds: 'Grandi Menti',
      history: 'Anni di Saggezza',
      fields: 'Campi di Studio',
      inspiration: 'Ispirazioni'
    }
  },
  QuoteSection: {
    label: 'Saggezza Quotidiana'
  },
  Privacy: {
    title: 'Informativa sulla Privacy',
    lastUpdated: 'Ultimo Aggiornamento: 16 Maggio 2026',
    summaryTitle: '1. Riepilogo Principale',
    summaryDesc: 'Su Giants Wisdom non vendiamo né condividiamo in modo inappropriato i tuoi dati personali. Questa informativa delinea come proteggiamo e trattiamo i dati raccolti durante i test di personalità e le conversazioni.',
    collectionTitle: '2. Quali Dati Raccogliamo e Come Li Raccogliamo',
    collectionDesc: 'Il nostro sito può essere esplorato completamente in modo anonimo. Tuttavia, potrebbero essere trattati: Dati Forniti Volontariamente (risposte al Test, testi nelle chat) e Dati Registrati Automaticamente (dispositivo, browser, IP).',
    purposeTitle: '3. Come Utilizziamo le Informazioni',
    purposeDesc: 'I dati raccolti vengono utilizzati per compilare i risultati del test in 15 domande, fornire risposte dinamiche storiche via IA (Gemini 2.5 Flash), analisi statistiche e mostrare annunci sicuri tramite Google AdSense.',
    adsenseTitle: '4. Google AdSense e Cookie di Terze Parti',
    adsenseDesc: 'Questo sito web mostra annunci tramite Google AdSense. Google e fornitori terzi utilizzano cookie per mostrare annunci mirati. Puoi disattivare il tracciamento su Google Ads Settings.',
    retentionTitle: '5. Conservazione e Distruzione dei Dati',
    retentionDesc: 'I risultati anonimi dei test e le chat vengono cancellati alla chiusura della sessione o resi anonimi per studi aggregati.',
    rightsTitle: '6. I Tuoi Diritti e Informazioni di Contatto',
    rightsDesc: 'Ti riservi l\'autorità completa per visualizzare, modificare o eliminare permanentemente qualsiasi dato legato alla tua identità. Per reclami, contatta il nostro canale di supporto ufficiale.'
  },
  Footer: {
    brand: {
      subtitle: 'La Sala delle Grandi Menti',
      description: 'Unisciti al viaggio delle grandi menti che hanno cambiato la storia. Vivi una saggezza oltre il tempo e lo spazio.'
    },
    sections: {
      explore: 'ESPLORA',
      info: 'INFORMAZIONI'
    },
    links: {
      allGiants: 'Tutte le Figure',
      wisdomArchive: 'Home',
      about: 'Chi Siamo',
      privacy: 'Informativa sulla Privacy',
      terms: 'Termini di Servizio',
      contact: 'Contatto',
      dnaTest: 'Test DNA Storico'
    }
  },
  About: {
    intro: 'A coloro che si sentono persi nel\nflusso infinito di informazioni.',
    subIntro: 'Uno spazio per allontanarsi dal rumore e incontrare la vera saggezza.',
    visionTitle: 'Sulle Spalle dei Giganti',
    visionDesc: '“Se ho visto più lontano, è perché stavo sulle spalle di giganti.” - Isaac Newton. Abbiamo iniziato con la convinzione che le risposte ai nostri complessi problemi moderni potrebbero già essere intessute nelle vite delle più grandi figure della storia.',
    epicTitle: 'Le Grandi Epopee di 95 Figure Storiche',
    epicDesc: 'Vai oltre i meri fatti storici. Vivi la grande saga di figure che hanno superato le avversità per rimodellare la storia umana.',
    chatTitle: 'Dialogo Attraverso le Epoche',
    chatDesc: 'Impegnati in conversazioni in tempo reale con firme restaurate di figure storiche, alimentate da IA avanzata (Gemini 2.5 Flash), per cercare intuizioni affilate per i tuoi dilemmi moderni.',
    testTitle: 'Trova il Tuo Gemello Storico',
    testDesc: 'Scopri il DNA della figura storica che scorre in profondità nella tua anima attraverso un coinvolgente questionario situazionale in 3 fasi, ambientato in momenti storici cruciali.',
    outroTitle: 'Benvenuto nella Sala delle Grandi Menti',
    outroDesc: 'Sulle loro spalle, finalmente vedrai più lontano. Inizia il tuo viaggio oggi.'
  },
  Terms: {
    title: 'Termini di Servizio',
    lastUpdated: 'Ultimo Aggiornamento: 16 Maggio 2026',
    intro: 'Benvenuto su Giants Wisdom. Questi Termini di Servizio regolano l\'accordo legale tra te e la nostra piattaforma riguardo all\'uso delle nostre metriche di personalità e simulazioni conversazionali.',
    eligibilityTitle: 'Articolo 1 (Idoneità e Tutela dei Minori)',
    eligibilityDesc: 'Questo servizio è destinato rigorosamente agli utenti di età pari o superiore a 13 anni.',
    aiTitle: 'Articolo 2 (Infrastruttura IA e Disclaimer Completo)',
    aiDesc: '1. Tutti i dialoghi con le figure storiche sono simulazioni interattive generate in modo pulito da modelli IA avanzati (suite Gemini 2.5). 2. Gli output forniti sono strutturati esclusivamente per valore educativo e di intrattenimento. 3. Giants Wisdom non si assume alcuna responsabilità per le allucinazioni dell\'IA.',
    intellectualTitle: 'Articolo 3 (Proprietà Intellettuale e Protezione Anti-Scraping)',
    intellectualDesc: '1. Tutte le architetture di layout, i marchi, le metriche del test e le illustrazioni vettoriali premium rimangono di proprietà esclusiva di Giants Wisdom. 2. È severamente vietato agli utenti eseguire copie non autorizzate o scraping di dati.',
    userDutyTitle: 'Articolo 4 (Standard per gli Utenti e Consenso alla Presentazione di Monetizzazione)',
    userDutyDesc: 'Gli utenti acconsentono esplicitamente affinché Google AdSense e altri broker pubblicitari presentino banner automatizzati sulla piattaforma.',
    disputeTitle: 'Articolo 5 (Legge Applicabile e Foro Competente)',
    disputeDesc: 'Questi Termini saranno governati e interpretati in conformità con le leggi della Repubblica di Corea.'
  },
  Cookie: {
    title: 'Impostazioni Cookie',
    description: 'Utilizziamo i cookie per personalizzare gli annunci e analizzare il traffico. Accettando, acconsenti al nostro uso dei cookie.',
    acceptAll: 'Accetta Tutto',
    rejectAll: 'Rifiuta Tutto',
    customize: 'Personalizza',
    savePreferences: 'Salva Preferenze',
    necessary: 'Cookie Necessari',
    necessaryDesc: 'Richiesti affinché il sito web funzioni correttamente. (Sempre Attivi)',
    analytics: 'Cookie di Analisi',
    analyticsDesc: 'Utilizzati per analizzare i visitatori e i pattern di utilizzo per migliorare il nostro servizio.',
    advertising: 'Cookie Pubblicitari',
    advertisingDesc: 'Utilizzati per mostrare annunci personalizzati tramite Google AdSense.'
  },
  Contact: {
    title: 'Contattaci',
    name: 'Nome',
    email: 'Email',
    subject: 'Oggetto (facoltativo)',
    message: 'Messaggio',
    send: 'Invia Messaggio',
    sending: 'Invio in corso...',
    success: 'Messaggio inviato con successo! Grazie.',
    error: 'Invio fallito. Per favore riprova.',
    namePlaceholder: 'Inserisci il tuo nome',
    emailPlaceholder: 'Inserisci la tua email',
    subjectPlaceholder: 'Inserisci l\'oggetto',
    messagePlaceholder: 'Inserisci il tuo messaggio'
  }
};
Object.assign(data, translated);
fs.writeFileSync('./messages/it.json', JSON.stringify(data, null, 2));
console.log('Updated non-Giant sections');
