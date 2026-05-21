
const fs = require('fs');
const path = require('path');

const itPath = path.join(__dirname, 'messages', 'it.json');
const ptPath = path.join(__dirname, 'messages', 'pt.json');

let it = JSON.parse(fs.readFileSync(itPath, 'utf8'));
let pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

// ─────────────────────────────────────────────────────────────
// IT.JSON FIXES
// ─────────────────────────────────────────────────────────────

// 1. Era corrections (all mixed/wrong centuries → proper Italian Roman numeral format)
const eraFixesIT = {
  'steve-jobs':            'XX-XXI Secolo (1955~2011)',
  'king-sejong':           'XV Secolo (1397~1450)',
  'elon-musk':             'XX-XXI Secolo',
  'genghis-khan':          'XII-XIII Secolo (1162~1227)',
  'alexander-the-great':   'IV Secolo a.C. (356~323 a.C.)',
  'walt-disney':           'XX Secolo (1901~1966)',
  'thomas-edison':         'XIX Secolo (1847~1931)',
  'julius-caesar':         'I Secolo a.C. (100~44 a.C.)',
  'henry-ford':            'XIX-XX Secolo (1863~1947)',
  'frida-kahlo':           'XX Secolo (1907~1954)',
  'viktor-frankl':         'XX Secolo (1905~1997)',
  'oprah-winfrey':         'Età Moderna',
  'jk-rowling':            'Età Moderna',
  'nelson-mandela':        'XX Secolo (1918~2013)',
  'helen-keller':          'XIX-XX Secolo (1880~1968)',
  'beethoven':             'XVIII-XIX Secolo (1770~1827)',
  'stephen-hawking':       'XX-XXI Secolo (1942~2018)',
  'franklin-d-roosevelt':  'XX Secolo (1882~1945)',
  'marcus-aurelius':       'II Secolo (121~180)',
  'seneca':                'I Secolo (4 a.C.~65)',
  'confucius':             'VI-V Secolo a.C. (551~479 a.C.)',
  'socrates':              'V Secolo a.C. (470~399 a.C.)',
  'lao-tzu':               'VI Secolo a.C.',
  'aristotle':             'IV Secolo a.C. (384~322 a.C.)',
  'plato':                 'IV Secolo a.C. (428~348 a.C.)',
  'mahatma-gandhi':        'XIX-XX Secolo (1869~1948)',
  'mother-teresa':         'XX Secolo (1910~1997)',
  'leonardo-da-vinci':     'Rinascimento (1452~1519)',
  'salvador-dali':         'XX Secolo (1904~1989)',
  'coco-chanel':           'XIX-XX Secolo (1883~1971)',
  'pablo-picasso':         'XIX-XX Secolo (1881~1973)',
  'mozart':                'XVIII Secolo (1756~1791)',
  'william-shakespeare':   'XVI-XVII Secolo (1564~1616)',
  'marie-curie':           'XIX-XX Secolo (1867~1934)',
  'nikola-tesla':          'XIX-XX Secolo (1856~1943)',
  'vincent-van-gogh':      'XIX Secolo (1853~1890)',
  'george-washington':     'XVIII Secolo (1732~1799)',
  'yi-sun-shin':           'XVI Secolo (1545~1598)',
  'elizabeth-i':           'XVI Secolo (1533~1603)',
  'gwanggaeto-the-great':  'IV-V Secolo (374~413)',
  'qin-shi-huang':         'III Secolo a.C. (259~210 a.C.)',
  'augustus':              'I Secolo a.C. - I Secolo (63 a.C.~14)',
  'otto-von-bismarck':     'XIX Secolo (1815~1898)',
  'peter-the-great':       'XVII-XVIII Secolo (1672~1725)',
  'catherine-the-great':   'XVIII Secolo (1729~1796)',
  'simon-bolivar':         'XVIII-XIX Secolo (1783~1830)',
  'margaret-thatcher':     'XX Secolo (1925~2013)',
  'john-d-rockefeller':    'XIX-XX Secolo (1839~1937)',
  'ataturk':               'XIX-XX Secolo (1881~1938)',
  'theodore-roosevelt':    'XIX-XX Secolo (1858~1919)',
  'anne-frank':            'XX Secolo (1929~1945)',
  'rosa-parks':            'XX Secolo (1913~2005)',
  'frederick-douglass':    'XIX Secolo (1818~1895)',
  'harriet-tubman':        'XIX Secolo (1822~1913)',
  'oskar-schindler':       'XX Secolo (1908~1974)',
  'florence-nightingale':  'XIX Secolo (1820~1910)',
  'yu-gwan-sun':           'XX Secolo (1902~1920)',
  'louis-braille':         'XIX Secolo (1809~1852)',
  'joan-of-arc':           'XV Secolo (1412~1431)',
  'desmond-tutu':          'XX-XXI Secolo (1931~2021)',
  'elie-wiesel':           'XX-XXI Secolo (1928~2016)',
  'harriet-beecher-stowe': 'XIX Secolo (1811~1896)',
  'rigoberta-menchu':      'XX-XXI Secolo (1959~Presente)',
  'terry-fox':             'XX Secolo (1958~1981)',
  'kim-gu':                'XIX-XX Secolo (1876~1949)',
  'buddha':                'VI Secolo a.C. (563~483 a.C.)',
  'friedrich-nietzsche':   'XIX Secolo (1844~1900)',
  'immanuel-kant':         'XVIII Secolo (1724~1804)',
  'rene-descartes':        'XVII Secolo (1596~1650)',
  'jean-jacques-rousseau': 'XVIII Secolo (1712~1778)',
  'sigmund-freud':         'XIX-XX Secolo (1856~1939)',
  'carl-jung':             'XIX-XX Secolo (1875~1961)',
  'baruch-spinoza':        'XVII Secolo (1632~1677)',
  'sun-tzu':               'VI Secolo a.C. (Periodo Primavere e Autunni)',
  'david-hume':            'XVIII Secolo (1711~1776)',
  'john-locke':            'XVII Secolo (1632~1704)',
  'simone-de-beauvoir':    'XX Secolo (1908~1986)',
  'hannah-arendt':         'XX Secolo (1906~1975)',
  'soren-kierkegaard':     'XIX Secolo (1813~1855)',
  'arthur-schopenhauer':   'XVIII-XIX Secolo (1788~1860)',
  'isaac-newton':          'XVII-XVIII Secolo (1643~1727)',
  'galileo-galilei':       'XVI-XVII Secolo (1564~1642)',
  'charles-darwin':        'XIX Secolo (1809~1882)',
  'michelangelo':          'Rinascimento (1475~1564)',
  'claude-monet':          'XIX-XX Secolo (1840~1926)',
  'fyodor-dostoevsky':     'XIX Secolo (1821~1881)',
  'victor-hugo':           'XIX Secolo (1802~1885)',
  'napoleon-bonaparte':    'XVIII-XIX Secolo (1769~1821)',
  'martin-luther-king':    'XX Secolo (1929~1968)',
  'albert-einstein':       'XX Secolo (1879~1955)',
  'abraham-lincoln':       'XIX Secolo (1809~1865)',
  'winston-churchill':     'XIX-XX Secolo (1874~1965)',
  'jane-austen':           'XVIII-XIX Secolo (1775~1817)',
};

for (const [slug, era] of Object.entries(eraFixesIT)) {
  if (it.Giants && it.Giants[slug]) {
    it.Giants[slug].era = era;
  }
}

// 2. Florence Nightingale quote typo fix
if (it.Giants && it.Giants['florence-nightingale']) {
  it.Giants['florence-nightingale'].quote =
    it.Giants['florence-nightingale'].quote.replace('Attibuisco', 'Attribuisco');
}

// 3. Catherine The Great → Caterina la Grande
if (it.Giants && it.Giants['catherine-the-great']) {
  const c = it.Giants['catherine-the-great'];
  c.name = 'Caterina la Grande';
  c.chatGreeting = 'Saluti, sono Caterina la Grande. Cerchi la via della saggezza o hai domande sul viaggio della mia vita?';
  if (c.suggestedQuestions && c.suggestedQuestions.length > 0) {
    c.suggestedQuestions[0] = 'Parlami della tua più grande conquista, Caterina la Grande.';
  }
}

// 4. Joan Of Arc → Giovanna d'Arco in chatGreeting and suggestedQuestions
if (it.Giants && it.Giants['joan-of-arc']) {
  const j = it.Giants['joan-of-arc'];
  j.chatGreeting = "Saluti, sono Giovanna d'Arco. Cerchi la via della saggezza o hai domande sul viaggio della mia vita?";
  if (j.suggestedQuestions && j.suggestedQuestions.length > 0) {
    j.suggestedQuestions[0] = "Parlami della tua più grande conquista, Giovanna d'Arco.";
  }
}

// 5. Pain/recovery 3rd-person naming inconsistency — remove proper name from start
//    Standard pattern: start with verb (3rd person singular), no leading name
const painFixesIT = {
  'elie-wiesel': {
    pain:     "Sopportò gli inimmaginabili orrori dell'Olocausto, perdendo la propria famiglia e sopravvivendo alle brutali condizioni di Auschwitz e Buchenwald.",
    recovery: "Trasformò il suo profondo trauma in un'opera di scrittura e difesa dei diritti, dedicando la vita intera a farsi testimone e a combattere il silenzio e l'indifferenza.",
  },
  'harriet-beecher-stowe': {
    pain:     "Provò un dolore immenso per la morte del figlio e assistette in prima persona alle spietate crudeltà dell'istituzione della schiavitù.",
    recovery: "Canalizzò il proprio dolore e la propria indignazione morale nella stesura de 'La capanna dello zio Tom', un'opera che scosse le coscienze e galvanizzò il movimento abolizionista.",
  },
  'rigoberta-menchu': {
    pain:     "Visse la tragica perdita di gran parte della sua famiglia a causa della brutale violenza perpetrata durante la guerra civile in Guatemala.",
    recovery: "Emerse da questa immensa tragedia diventando una fervente e incrollabile sostenitrice dei diritti degli indigeni, guadagnandosi il rispetto internazionale e il Premio Nobel per la Pace.",
  },
  'kim-gu': {
    pain:     "Trascorse decenni in esilio e prigionia, lottando instancabilmente e subendo immense privazioni sotto il duro dominio coloniale giapponese in Corea.",
    recovery: "Perseverò con incrollabile determinazione, unificando le fazioni della resistenza e guidando il governo provvisorio per mantenere viva la speranza dell'indipendenza coreana.",
  },
  'friedrich-nietzsche': {
    pain:     "Soffrì per tutta la vita di gravi problemi di salute, isolamento intellettuale e un profondo senso di incomprensione da parte dei suoi contemporanei.",
    recovery: "Trascese il suo dolore fisico ed emotivo forgiando una filosofia radicale di affermazione della vita, sfidando i valori tradizionali e celebrando il potenziale umano.",
  },
  'sigmund-freud': {
    pain:     "Dovette affrontare un intenso ostracismo professionale e un forte dolore fisico a causa di un grave cancro alla mascella negli ultimi decenni della sua vita.",
    recovery: "Nonostante le opposizioni e la sofferenza, continuò a sviluppare pionieristicamente la psicoanalisi, rivoluzionando per sempre la nostra comprensione della mente umana.",
  },
  'immanuel-kant': {
    pain:     "Affrontò la limitatezza dei sistemi filosofici del suo tempo e lottò per conciliare il rigore della scienza con la necessità della moralità umana.",
    recovery: "Rivoluzionò il pensiero occidentale sviluppando il suo sistema critico, stabilendo i confini della ragione e fondando l'etica sul dovere e sull'imperativo categorico.",
  },
  'carl-jung': {
    pain:     "Attraversò un periodo di profonda crisi psicologica e disorientamento in seguito alla dolorosa rottura con il suo mentore, Sigmund Freud.",
    recovery: "Intraprese una coraggiosa esplorazione del proprio inconscio, da cui emerse la fondazione della psicologia analitica e concetti fondamentali come l'inconscio collettivo.",
  },
  'baruch-spinoza': {
    pain:     "Patì la dolorosa scomunica e l'allontanamento dalla sua comunità religiosa, trovandosi isolato e perseguitato per le sue idee radicali.",
    recovery: "Trovò serenità nel perseguimento intellettuale della verità, forgiando un'etica razionale che identificava Dio con la natura, senza mai cedere ai compromessi.",
  },
  'terry-fox': {
    pain:     "Gli fu diagnosticato un osteosarcoma in giovane età, che portò alla devastante amputazione della gamba destra.",
    recovery: "Affrontò questa immensa avversità intraprendendo la 'Maratona della Speranza', correndo attraverso il Canada con una gamba artificiale per raccogliere fondi e consapevolezza per la ricerca sul cancro.",
  },
};

for (const [slug, fixes] of Object.entries(painFixesIT)) {
  if (it.Giants && it.Giants[slug]) {
    if (fixes.pain)     it.Giants[slug].pain     = fixes.pain;
    if (fixes.recovery) it.Giants[slug].recovery = fixes.recovery;
  }
}

// ─────────────────────────────────────────────────────────────
// PT.JSON FIXES
// ─────────────────────────────────────────────────────────────

// 1. Marcus Aurelius → Marco Aurélio
if (pt.Giants && pt.Giants['marcus-aurelius']) {
  const m = pt.Giants['marcus-aurelius'];
  m.name = 'Marco Aurélio';
  m.chatGreeting = 'Saudações, eu sou Marco Aurélio. Você busca o caminho da sabedoria ou tem perguntas sobre a jornada da minha vida?';
  if (m.suggestedQuestions && m.suggestedQuestions.length > 0) {
    m.suggestedQuestions[0] = 'Conte-me sobre sua maior conquista, Marco Aurélio.';
  }
}

// 2. Peter the Great → Pedro, o Grande
if (pt.Giants && pt.Giants['peter-the-great']) {
  const p = pt.Giants['peter-the-great'];
  p.name = 'Pedro, o Grande';
  p.chatGreeting = 'Saudações, eu sou Pedro, o Grande. Você busca o caminho da sabedoria ou tem perguntas sobre a jornada da minha vida?';
  if (p.suggestedQuestions && p.suggestedQuestions.length > 0) {
    p.suggestedQuestions[0] = 'Conte-me sobre sua maior conquista, Pedro, o Grande.';
  }
}

// 3. Gwanggaeto the Great → Gwanggaeto, o Grande
if (pt.Giants && pt.Giants['gwanggaeto-the-great']) {
  const g = pt.Giants['gwanggaeto-the-great'];
  g.name = 'Gwanggaeto, o Grande';
  g.chatGreeting = 'Saudações, eu sou Gwanggaeto, o Grande. Você busca o caminho da sabedoria ou tem perguntas sobre a jornada da minha vida?';
  if (g.suggestedQuestions && g.suggestedQuestions.length > 0) {
    g.suggestedQuestions[0] = 'Conte-me sobre sua maior conquista, Gwanggaeto, o Grande.';
  }
}

// 4. Catherine The Great → Catarina, a Grande
if (pt.Giants && pt.Giants['catherine-the-great']) {
  const c = pt.Giants['catherine-the-great'];
  c.name = 'Catarina, a Grande';
  c.chatGreeting = 'Saudações, eu sou Catarina, a Grande. Você busca o caminho da sabedoria ou tem perguntas sobre a jornada da minha vida?';
  if (c.suggestedQuestions && c.suggestedQuestions.length > 0) {
    c.suggestedQuestions[0] = 'Conte-me sobre sua maior conquista, Catarina, a Grande.';
  }
  // Fix headline contamination
  c.headline = 'A soberana iluminada que transformou a Rússia num império europeu de primeira grandeza.';
}

// 5. Elizabeth I → Isabel I
if (pt.Giants && pt.Giants['elizabeth-i']) {
  const e = pt.Giants['elizabeth-i'];
  e.name = 'Isabel I';
  e.chatGreeting = 'Saudações, eu sou Isabel I. Você busca o caminho da sabedoria ou tem perguntas sobre a jornada da minha vida?';
  if (e.suggestedQuestions && e.suggestedQuestions.length > 0) {
    e.suggestedQuestions[0] = 'Conte-me sobre sua maior conquista, Isabel I.';
  }
  if (e.shortDescription) {
    e.shortDescription = e.shortDescription.replace('Elizabeth I', 'Isabel I');
  }
}

// 6. Terry Fox era fix in PT (1853~1890 → correct dates)
if (pt.Giants && pt.Giants['terry-fox']) {
  pt.Giants['terry-fox'].era = 'Gigante do Século XX (1958~1981)';
}

// 7. Headline field contamination fixes in PT
//    These entries got full biographical narrative text instead of taglines
const headlineFixesPT = {
  'simon-bolivar':         'O Libertador que sonhou com um continente livre e unido, forjado com sangue e paixão.',
  'margaret-thatcher':     'A Dama de Ferro que remodelou a economia britânica com determinação inflexível.',
  'john-d-rockefeller':    'O titã dos negócios que construiu o maior império petrolífero do mundo e reinventou a filantropia.',
  'ataturk':               'O líder visionário que forjou uma república moderna das cinzas de um império.',
  'theodore-roosevelt':    'O presidente-explorador que protegeu a natureza americana e trouxe energia feroz ao governo.',
  'anne-frank':            'A jovem escritora que documentou o espírito humano nos tempos mais sombrios da história.',
  'rosa-parks':            'A mãe do movimento pelos direitos civis cujo recuo em ceder seu assento acendeu uma revolução.',
  'frederick-douglass':    'O abolicionista que transformou sua fuga da escravidão em uma voz poderosa pela liberdade.',
  'harriet-tubman':        'A heroína destemida que conduziu incontáveis escravos à liberdade pela Underground Railroad.',
  'oskar-schindler':       'O industrial que arriscou tudo para salvar centenas de vidas durante o Holocausto.',
  'florence-nightingale':  'A pioneira da enfermagem moderna que trouxe luz e compaixão ao cuidado médico.',
  'yu-gwan-sun':           'A jovem mártir cuja determinação acendeu o movimento de independência coreana.',
  'louis-braille':         'O inventor que deu o presente da leitura aos cegos através do toque.',
  'joan-of-arc':           'A guerreira divinamente inspirada que liderou o exército francês à vitória com apenas dezessete anos.',
  'desmond-tutu':          'O arcebispo da paz que combateu o apartheid com amor e reconciliação.',
  'elie-wiesel':           'O sobrevivente e autor que transformou sua dor em um alerta eterno para a humanidade.',
  'harriet-beecher-stowe': 'A autora cujas palavras apaixonadas ajudaram a acender a luta contra a escravidão.',
  'rigoberta-menchu':      'A defensora dos direitos indígenas que ergueu sua voz contra a opressão na Guatemala.',
  'terry-fox':             'O herói canadense que uniu uma nação com sua Maratona da Esperança.',
  'kim-gu':                'O líder da independência que dedicou sua vida a uma Coreia livre.',
  'buddha':                'O sábio iluminado que ensinou o caminho do meio e a libertação do sofrimento.',
  'friedrich-nietzsche':   'O filósofo iconoclasta que desafiou a moral convencional e exaltou a vontade de potência.',
  'immanuel-kant':         'O pensador sistemático que revolucionou a filosofia com sua crítica da razão pura.',
  'rene-descartes':        'O filósofo racionalista que fundou a filosofia moderna sobre a dúvida e a certeza.',
  'jean-jacques-rousseau': 'O filósofo romântico que afirmou que a humanidade é naturalmente boa mas corrompida pela sociedade.',
  'sigmund-freud':         'O pai da psicanálise que desvendou os segredos do inconsciente humano.',
  'carl-jung':             'O psiquiatra pioneiro que explorou o inconsciente coletivo e os arquétipos da alma.',
  'baruch-spinoza':        'O filósofo racionalista que encontrou Deus na natureza e na ordem do universo.',
  'sun-tzu':               'O antigo estrategista militar cujas sabedorias guiam líderes e generais até hoje.',
  'david-hume':            'O empirista escocês que colocou em dúvida os próprios fundamentos do conhecimento humano.',
  'john-locke':            'O pai do liberalismo cuja filosofia inspirou as revoluções democráticas modernas.',
  'simone-de-beauvoir':    'A filósofa existencialista que traçou o caminho para o feminismo moderno.',
  'hannah-arendt':         'A teórica política que desvendou a natureza do poder e a banalidade do mal.',
  'soren-kierkegaard':     'O pai do existencialismo que explorou o significado da fé e da individualidade.',
  'arthur-schopenhauer':   'O filósofo pessimista que viu a Vontade como a força motriz da existência.',
  'isaac-newton':          'O gigante da ciência que decifrou as leis universais do movimento e da gravitação.',
  'galileo-galilei':       'O astrônomo corajoso que defendeu a verdade científica contra o dogma.',
  'charles-darwin':        'O naturalista visionário que desvendou o mecanismo da evolução das espécies.',
  'michelangelo':          'O gênio universal da Renascença que deu forma ao divino através do mármore.',
  'claude-monet':          'O fundador do Impressionismo que capturou a luz fugaz da natureza.',
  'fyodor-dostoevsky':     'O gigante literário que sondou as profundezas abissais da alma humana.',
  'victor-hugo':           'O romancista visionário que se tornou a voz imortal da justiça social e da liberdade.',
  'anton-chekhov':         'O mestre do conto que capturou as sutilezas da condição humana com graça e ironia.',
  'frederic-chopin':       'O poeta do piano que transformou a saudade e o exílio em melodias imortais.',
  'katsushika-hokusai':    'O artista incansável que redefiniu a arte visual japonesa ao longo de noves décadas.',
  'agatha-christie':       'A rainha do crime que criou os mistérios mais vendidos da história da literatura.',
  'mark-twain':            'O escritor que capturou a alma da América com humor afiado e observação perspicaz.',
  'goethe':                'O gênio universal que moldou a literatura, a ciência e a filosofia da Europa moderna.',
  'mary-shelley':          'A visionária que criou o primeiro romance de ficção científica e revolucionou a literatura.',
};

for (const [slug, headline] of Object.entries(headlineFixesPT)) {
  if (pt.Giants && pt.Giants[slug]) {
    pt.Giants[slug].headline = headline;
  }
}

// 8. wisdomArchive Footer.links inconsistency in PT
//    Navigation: "Início" — Footer.links: "Arquivo de Sabedoria" → unify to "Início"
if (pt.Footer && pt.Footer.links) {
  pt.Footer.links.wisdomArchive = 'Início';
}

// 9. Pain/recovery 3rd-person inconsistency in PT
//    Most giants use 2nd person (você). Fix the handful using 3rd person.
const painFixesPT = {
  'harriet-beecher-stowe': {
    pain:     'Você sofreu um luto imenso pela morte de seu filho e testemunhou em primeira mão as crueldades implacáveis da instituição da escravidão.',
    recovery: "Você canalizou sua dor e indignação moral ao escrever 'A Cabana do Pai Tomás', uma obra que despertou consciências e impulsionou o movimento abolicionista.",
  },
  'rigoberta-menchu': {
    pain:     'Você vivenciou a trágica perda de grande parte de sua família devido à violência brutal durante a guerra civil na Guatemala.',
    recovery: 'Você emergiu dessa imensa tragédia para se tornar uma defensora apaixonada e inabalável dos direitos indígenas, conquistando reconhecimento internacional e o Prêmio Nobel da Paz.',
  },
  'elie-wiesel': {
    pain:     'Você suportou os horrores inimagináveis do Holocausto, perdendo sua família e sobrevivendo às condições brutais de Auschwitz e Buchenwald.',
    recovery: 'Você transformou seu profundo trauma em escrita e ativismo, dedicando sua vida a dar testemunho e a lutar contra o silêncio e a indiferença.',
  },
  'terry-fox': {
    pain:     'Você foi diagnosticado com osteossarcoma ainda jovem, o que levou à devastadora amputação de sua perna direita.',
    recovery: "Você superou essa imensa adversidade ao iniciar a 'Maratona da Esperança', correndo por todo o Canadá com uma perna artificial para arrecadar fundos e conscientização para a pesquisa do câncer.",
  },
  'kim-gu': {
    pain:     'Você passou décadas no exílio e na prisão, lutando incansavelmente e sofrendo imensas privações sob o duro domínio colonial japonês na Coreia.',
    recovery: 'Você perseverou com determinação inabalável, unificando facções de resistência e liderando o governo provisório para manter viva a esperança da independência coreana.',
  },
  'friedrich-nietzsche': {
    pain:     'Você sofreu ao longo de sua vida com graves problemas de saúde, isolamento intelectual e um profundo sentimento de incompreensão por parte de seus contemporâneos.',
    recovery: 'Você transcendeu sua dor física e emocional ao forjar uma filosofia radical de afirmação da vida, desafiando valores tradicionais e celebrando o potencial humano.',
  },
  'immanuel-kant': {
    pain:     'Você enfrentou as limitações dos sistemas filosóficos de sua época e lutou para conciliar o rigor da ciência com a necessidade da moralidade humana.',
    recovery: 'Você revolucionou o pensamento ocidental ao desenvolver seu sistema crítico, estabelecendo os limites da razão e fundamentando a ética no dever e no imperativo categórico.',
  },
  'sigmund-freud': {
    pain:     'Você enfrentou intenso ostracismo profissional e dor física severa devido a um câncer de mandíbula nas últimas décadas de sua vida.',
    recovery: 'Apesar da oposição e do sofrimento, você persistiu no desenvolvimento pioneiro da psicanálise, revolucionando para sempre a nossa compreensão da mente humana.',
  },
  'carl-jung': {
    pain:     'Você passou por um período de profunda crise psicológica e desorientação após seu doloroso rompimento com seu mentor, Sigmund Freud.',
    recovery: 'Você embarcou em uma corajosa exploração de seu próprio inconsciente, da qual emergiu a fundação da psicologia analítica e conceitos fundamentais como o inconsciente coletivo.',
  },
  'baruch-spinoza': {
    pain:     'Você sofreu a dolorosa excomunhão e o banimento de sua comunidade religiosa, encontrando-se isolado e perseguido por suas ideias radicais.',
    recovery: 'Você encontrou paz na busca intelectual pela verdade, criando uma ética racional que identificava Deus com a natureza, sem jamais abrir mão de suas convicções.',
  },
};

for (const [slug, fixes] of Object.entries(painFixesPT)) {
  if (pt.Giants && pt.Giants[slug]) {
    if (fixes.pain)     pt.Giants[slug].pain     = fixes.pain;
    if (fixes.recovery) pt.Giants[slug].recovery = fixes.recovery;
  }
}

// 10. theRecovery label upgrade (Low priority)
if (pt.GiantDetail) {
  pt.GiantDetail.theRecovery = 'A Superação';
}

// ─────────────────────────────────────────────────────────────
// SAVE
// ─────────────────────────────────────────────────────────────
fs.writeFileSync(itPath, JSON.stringify(it, null, 2), 'utf8');
fs.writeFileSync(ptPath, JSON.stringify(pt, null, 2), 'utf8');

console.log('✅ All QA fixes applied successfully!');
console.log('  it.json: era normalization, typo fix, Catherine/Joan localization, pain/recovery consistency');
console.log('  pt.json: Marco Aurélio, Pedro o Grande, Gwanggaeto o Grande, Catarina a Grande, Isabel I');
console.log('  pt.json: headline contamination fixed for 40+ giants');
console.log('  pt.json: wisdomArchive footer link unified, pain/recovery person unified, theRecovery label upgraded');
