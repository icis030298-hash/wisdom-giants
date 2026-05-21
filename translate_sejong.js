const fs = require('fs');

const dataFile = './src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const translations = {
  "king-sejong": {
    era_it: "Gigante del XV Secolo (1397~1450)",
    epic_it: "Nel 1397, nel palazzo reale di Hanyang, nacque Yi Do, il terzo principe della Dinastia Joseon. Sebbene lontano dalla linea diretta di successione, la sua giovinezza fu definita da una monumentale ossessione per l'apprendimento; leggeva così voracemente che suo padre, Re Taejong, una volta dovette nascondergli i libri per proteggere la sua vista in declino. Guardava oltre le mura del palazzo con una profonda empatia per la gente comune, che lottava sotto il peso delle tasse e dell'ignoranza. Riconoscendo la sua superiore saggezza e il suo carattere, il padre ruppe la tradizione e lo nominò erede. Nel 1418, ascese al trono come Sejong, un gigante che avrebbe riscritto il destino di una nazione.\n\nIl regno di Sejong fu una monumentale Età dell'Oro di intelletto e compassione. Non fu semplicemente un sovrano, ma uno scienziato, un musicista e un riformatore legale che si impegnò personalmente in ogni campo dell'attività umana. Distrusse le gerarchie sociali reclutando Jang Yeong-sil, un uomo nato in schiavitù, per inventare strumenti astronomici, pluviometri e orologi ad acqua. Riformò il sistema legale per garantire che i poveri fossero trattati con dignità ed equità. Al centro di ogni sua azione c'era l''Aemin' — un amore profondo e radicale per i suoi sudditi che lo spinse a lavorare finché la sua salute non iniziò a crollare.\n\nIl suo balzo più grande fu la creazione dello Hunminjeongeum — l'alfabeto coreano, l'Hangul. All'epoca, l'élite al potere si aggrappava ai difficili caratteri cinesi come strumento di potere, opponendosi ferocemente a una scrittura che i popolani potessero imparare. Sejong, soffrendo di cecità e malattie croniche provocate dal superlavoro, faticò in segreto per perfezionare un sistema fonetico che persino un bambino potesse padroneggiare in una mattinata. Nel 1446, regalò al mondo il sistema di scrittura più scientifico e originale della storia umana. Il suo trionfo fu la democratizzazione della conoscenza; sacrificò la propria vista affinché il suo popolo potesse finalmente vedere attraverso il mezzo della parola scritta.\n\nOggi, Re Sejong il Grande rimane l'anima eterna della Corea e uno standard globale per la leadership illuminata. Insegnò all'umanità che 'il popolo è la radice della nazione e il cibo è il paradiso del popolo'. Dimostrò che l'impatto di un gigante non si misura dal territorio che conquista, ma dalla dignità e dall'alfabetizzazione che concede ai più deboli. La sua vita fu una grande epopea di devozione, un promemoria che il vero potere è la capacità di servire. Seicento anni dopo, la sua voce rimane una guida salda, dimostrando che il più grande monumento di un leader è la fiorente cultura del suo popolo.",
    trials_it: "La graduale perdita della vista e il debilitante dolore cronico causato dalla sua implacabile dedizione alla ricerca. L'affrontare la feroce opposizione politica dei potenti funzionari-studiosi che consideravano una scrittura nazionale come una minaccia al loro monopolio intellettuale.",
    overcoming_it: "Trascese la propria sofferenza fisica per donare al suo popolo la luce dell'alfabetizzazione, assicurando che ogni cittadino avesse una voce. Stabilì un'eredità scientifica e culturale che divenne il fondamento di un'identità nazionale, dimostrando che la saggezza è l'arma più duratura contro l'oppressione.",
    era_pt: "Gigante do Século XV (1397~1450)",
    epic_pt: "Em 1397, no palácio real de Hanyang, nasceu Yi Do, o terceiro príncipe da Dinastia Joseon. Embora distante da linha direta de sucessão, sua juventude foi definida por uma obsessão monumental pelo aprendizado; ele lia com tanta voracidade que seu pai, o Rei Taejong, certa vez teve que esconder seus livros para proteger sua visão debilitada. Ele olhava além dos muros do palácio com uma profunda empatia pelas pessoas comuns, que lutavam sob o peso dos impostos e da ignorância. Reconhecendo sua sabedoria e caráter superiores, seu pai quebrou a tradição e o nomeou herdeiro. Em 1418, ascendeu ao trono como Sejong, um gigante que reescreveria o destino de uma nação.\n\nO reinado de Sejong foi uma monumental Era de Ouro de intelecto e compaixão. Ele não foi apenas um governante, mas um cientista, músico e reformador jurídico que se envolveu pessoalmente em todos os campos do esforço humano. Quebrou as hierarquias sociais ao recrutar Jang Yeong-sil, um homem nascido na escravidão, para inventar ferramentas astronômicas, pluviômetros e relógios de água. Ele reformou o sistema judicial para garantir que os pobres fossem tratados com dignidade e justiça. No centro de cada uma de suas ações estava o 'Aemin' — um amor profundo e radical por seus súditos que o levava a trabalhar até que sua saúde começasse a desmoronar.\n\nSeu maior salto foi a criação do Hunminjeongeum — o alfabeto coreano, o Hangul. Naquela época, a elite dominante se apegava aos difíceis caracteres chineses como instrumento de poder, opondo-se ferozmente a uma escrita que os plebeus pudessem aprender. Sejong, sofrendo de cegueira e doenças crônicas provocadas pelo excesso de trabalho, lutou em segredo para aperfeiçoar um sistema fonético que até uma criança poderia dominar em uma manhã. Em 1446, ele presenteou o mundo com o sistema de escrita mais científico e original da história humana. Seu triunfo foi a democratização do conhecimento; ele sacrificou a própria visão para que seu povo pudesse finalmente ver através do meio da palavra escrita.\n\nHoje, o Rei Sejong, o Grande, permanece como a alma eterna da Coreia e um padrão global de liderança iluminada. Ele ensinou à humanidade que 'o povo é a raiz da nação, e a comida é o paraíso do povo'. Ele provou que o impacto de um gigante é medido não pelo território que ele conquista, mas pela dignidade e alfabetização que ele concede aos mais fracos entre eles. Sua vida foi um grandioso épico de devoção, um lembrete de que o verdadeiro poder é a capacidade de servir. Seiscentos anos depois, sua voz permanece um guia constante, provando que o maior monumento de um líder é a cultura florescente de seu povo.",
    trials_pt: "A perda gradual da visão e a dor crônica debilitante causada por sua dedicação implacável à pesquisa. O enfrentamento à feroz oposição política dos poderosos acadêmicos-oficiais que viam uma escrita nacional como uma ameaça ao seu monopólio intelectual.",
    overcoming_pt: "Transcendeu seu sofrimento físico para presentear seu povo com a luz da alfabetização, garantindo que todo cidadão tivesse voz. Estabeleceu um legado científico e cultural que se tornou a base de uma identidade nacional, provando que a sabedoria é a arma mais duradoura contra a opressão.",
    wisdom: [
      {
        quote_it: "Il popolo è la radice della nazione. Quando il popolo ha fame, la nazione non può reggersi. Il cibo è il paradiso del popolo.",
        meaning_it: "Sul Fondamento dell'Autorità: Il potere esiste solo per servire i bisogni dei vulnerabili. Un gigante comprende che la vera salute di una società si misura dal benessere dei suoi meno fortunati; concentra la tua energia sui fondamenti della dignità e della sopravvivenza umane.",
        quote_pt: "O povo é a raiz da nação. Quando o povo tem fome, a nação não consegue se manter. A comida é o paraíso do povo.",
        meaning_pt: "Sobre a Fundação da Autoridade: O poder existe apenas para atender às necessidades dos vulneráveis. Um gigante entende que a verdadeira saúde de uma sociedade é medida pelo bem-estar dos menos favorecidos; concentre sua energia nos fundamentos da dignidade e sobrevivência humanas."
      },
      {
        quote_it: "Un uomo saggio non smette mai di imparare e scruta costantemente il proprio cuore. Anche se i miei occhi possono oscurarsi, gli occhi del mio spirito rimarranno sempre fissi sul mio popolo.",
        meaning_it: "Sulla Disciplina del Servizio: La crescita personale è uno strumento per il bene pubblico. Non lasciare che il successo porti alla compiacenza; mantieni acuta la tua curiosità e umile il tuo ego, poiché la visione di un gigante è più chiara quando si concentra su come migliorare la vita degli altri.",
        quote_pt: "Um homem sábio nunca para de aprender e vigia constantemente o próprio coração. Embora meus olhos possam escurecer, os olhos do meu espírito permanecerão sempre fixos no meu povo.",
        meaning_pt: "Sobre a Disciplina do Serviço: O crescimento pessoal é uma ferramenta para o bem público. Não deixe o sucesso levar à complacência; mantenha sua curiosidade aguçada e seu ego humilde, pois a visão de um gigante é mais clara quando se concentra em como melhorar a vida dos outros."
      },
      {
        quote_it: "Il mio popolo trova difficile esprimere i propri pensieri perché la nostra lingua differisce dalla scrittura straniera. Per amore nei loro confronti, ho creato queste nuove lettere. Che ogni persona possa trovare la propria voce.",
        meaning_it: "Sulla Democratizzazione della Conoscenza: La lingua è il ponte supremo verso la libertà. Il compito di un gigante è abbattere le barriere che impediscono il flusso della verità; dando agli altri gli strumenti per parlare e pensare autonomamente, dai potere a una civiltà di elevarsi.",
        quote_pt: "Meu povo acha difícil expressar seus pensamentos porque nossa língua difere da escrita estrangeira. Por amor a eles, criei estas novas letras. Que cada pessoa possa encontrar sua voz.",
        meaning_pt: "Sobre a Democratização do Conhecimento: A linguagem é a ponte definitiva para a liberdade. A tarefa de um gigante é desmantelar as barreiras que impedem o fluxo da verdade; ao dar aos outros as ferramentas para falarem e pensarem por si mesmos, você capacita uma civilização a se erguer."
      }
    ]
  }
};

for (const id in translations) {
  if (data[id]) {
    const t = translations[id];
    data[id].era_it = t.era_it;
    data[id].epic_it = t.epic_it;
    data[id].trials_it = t.trials_it;
    data[id].overcoming_it = t.overcoming_it;
    
    data[id].era_pt = t.era_pt;
    data[id].epic_pt = t.epic_pt;
    data[id].trials_pt = t.trials_pt;
    data[id].overcoming_pt = t.overcoming_pt;
    
    for (let i = 0; i < t.wisdom.length; i++) {
      if (data[id].wisdom[i]) {
        data[id].wisdom[i].quote_it = t.wisdom[i].quote_it;
        data[id].wisdom[i].meaning_it = t.wisdom[i].meaning_it;
        data[id].wisdom[i].quote_pt = t.wisdom[i].quote_pt;
        data[id].wisdom[i].meaning_pt = t.wisdom[i].meaning_pt;
      }
    }
  }
}

fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
console.log('Done mapping King Sejong');
