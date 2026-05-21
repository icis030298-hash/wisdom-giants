const fs = require('fs');

const dataFile = './src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const translations = {
  "napoleon-bonaparte": {
    era_it: "Gigante del XVIII-XIX Secolo (1769~1821)",
    epic_it: "Nel 1769, sull'aspra isola mediterranea della Corsica, nacque un bambino in un mondo che presto avrebbe tremato al suo nome. Napoleone Bonaparte iniziò come un estraneo, figlio di una nobiltà minore che parlava francese con un forte accento, attirandosi il ridicolo dei compagni. Eppure, in questo ragazzo emarginato, stava mettendo radici un'ambizione monumentale. Riempì la sua giovinezza solitaria studiando Alessandro Magno e Cesare, affinando una mente che vedeva il mondo non per come era, ma come una mappa da ridisegnare. Era un gigante in attesa, forgiato nei fuochi dei torti personali e dell'ossessione intellettuale.\n\nMentre la Rivoluzione Francese lacerava il vecchio mondo, Napoleone colse il suo momento. Il suo genio tattico all'Assedio di Tolone lo proiettò dall'oscurità all'eroismo. Attraversò le Alpi, emulando le imprese di Annibale, e dichiarò: \"La parola impossibile non è nel mio vocabolario.\" A Marengo e ad Austerlitz, smantellò gli eserciti di re e imperatori, dimostrando che il merito e la strategia potevano sconfiggere gli antichi privilegi. Non fu semplicemente un conquistatore di terre; attraverso il Codice Napoleonico, codificò i principi della Rivoluzione, ponendo le basi legali e amministrative dell'Europa moderna.\n\nEppure, il sole della sua gloria incontrò infine l'inverno della sua ambizione. La catastrofica ritirata dalla Russia segnò l'inizio della dissoluzione del suo impero. Esiliato all'Elba dopo la sconfitta di Lipsia, compì un miracoloso ritorno, reclamando il suo trono in un ultimo e dirompente capitolo: i 'Cento Giorni'. Ma il sogno finì nel fango di Waterloo. Concluse la sua vita in esilio sulla remota isola di Sant'Elena, una fine solitaria per un uomo che un tempo aveva comandato il destino di milioni di persone. La sua vita fu una grande epopea di ascese e cadute, un testamento alle vette che la volontà umana può raggiungere e all'inevitabile gravità della superbia.\n\nOggi, Napoleone Bonaparte rimane l'archetipo supremo del leader che si fa da sé e del maestro su vasta scala. Egli comprese che 'un leader è un dispensatore di speranza', e costruì un impero ispirando soldati comuni a compiere gesta non comuni. La sua eredità è un complesso arazzo di distruzione e illuminazione; spezzò le catene feudali dell'Europa e gettò i semi del moderno nazionalismo e della meritocrazia. Continua a infestare la storia della leadership, un promemoria che la vera grandezza risiede nella capacità di rimodellare l'ordine del mondo attraverso la pura forza della propria visione e del proprio intelletto.",
    trials_it: "Il precoce isolamento sociale come forestiero corso nelle scuole militari francesi. La catastrofica fallibilità della Campagna di Russia, che vide la distruzione della Grande Armée, e i lunghi, solitari anni di esilio a Sant'Elena.",
    overcoming_it: "Superò le sue umili origini attraverso il puro merito e la maestria intellettuale, dimostrando che il destino non si eredita ma si afferra. Perfino nel suo ultimo esilio, curò meticolosamente la propria leggenda, assicurandosi che le sue idee avrebbero governato il mondo molto tempo dopo la sua morte.",
    era_pt: "Gigante do Século XVIII-XIX (1769~1821)",
    epic_pt: "Em 1769, na acidentada ilha mediterrânea da Córsega, nasceu um menino em um mundo que logo tremeria ao ouvir seu nome. Napoleão Bonaparte começou como um forasteiro, filho da pequena nobreza que falava francês com um sotaque carregado, o que lhe rendeu o ridículo de seus colegas de classe. No entanto, dentro desse menino marginalizado, uma ambição monumental estava criando raízes. Ele preencheu sua juventude solitária com o estudo de Alexandre, o Grande, e César, afiando uma mente que via o mundo não como ele era, mas como um mapa a ser redesenhado. Ele era um gigante em formação, forjado nos fogos do desprezo pessoal e da obsessão intelectual.\n\nEnquanto a Revolução Francesa despedaçava o velho mundo, Napoleão aproveitou o seu momento. Seu gênio tático no Cerco de Toulon o impulsionou da obscuridade ao heroísmo. Ele cruzou os Alpes, espelhando os feitos de Aníbal, e declarou: \"A palavra impossível não está no meu dicionário.\" Em Marengo e Austerlitz, ele desmantelou os exércitos de reis e imperadores, provando que o mérito e a estratégia poderiam derrotar privilégios antigos. Ele não foi apenas um conquistador de terras; por meio do Código Napoleônico, ele codificou os princípios da Revolução, estabelecendo as bases jurídicas e administrativas da Europa moderna.\n\nContudo, o sol de sua glória finalmente encontrou o inverno de sua ambição. A retirada catastrófica da Rússia iniciou a dissolução de seu império. Exilado em Elba após a derrota em Leipzig, ele encenou um retorno milagroso, reivindicando seu trono nos finais e desafiadores 'Cem Dias'. Mas o sonho terminou na lama de Waterloo. Ele terminou sua vida no exílio, na remota ilha de Santa Helena, um fim solitário para um homem que outrora comandou o destino de milhões. Sua vida foi um grande épico de ascensão e queda, um testamento das alturas que a vontade humana pode alcançar e da gravidade inevitável da arrogância.\n\nHoje, Napoleão Bonaparte permanece como o arquétipo definitivo do líder que se faz por si mesmo e o mestre das grandes proporções. Ele entendia que 'um líder é um vendedor de esperança', e construiu um império inspirando soldados comuns a realizarem atos incomuns. Seu legado é uma complexa tapeçaria de destruição e iluminação; ele quebrou as correntes feudais da Europa e lançou as sementes do nacionalismo moderno e da meritocracia. Ele continua a assombrar a história da liderança, um lembrete de que a verdadeira grandeza reside na capacidade de remodelar a ordem mundial através da pura força da própria visão e intelecto.",
    trials_pt: "O isolamento social precoce como um forasteiro da Córsega nas escolas militares francesas. O fracasso catastrófico da Campanha da Rússia, que viu a destruição da Grande Armée, e os longos e solitários anos de exílio em Santa Helena.",
    overcoming_pt: "Superou suas origens humildes por meio de puro mérito e domínio intelectual, provando que o destino não é herdado, mas conquistado. Mesmo em seu exílio final, ele elaborou meticulosamente sua própria lenda, garantindo que suas ideias governassem o mundo muito depois de sua morte.",
    wisdom: [
      {
        quote_it: "La parola impossibile non è nel mio vocabolario. La vittoria appartiene ai più perseveranti. Le decisioni più audaci sono spesso le più sicure.",
        meaning_it: "Sulla Sovranità della Volontà: Impossibile è una parola che si trova solo nel vocabolario degli stolti. Un gigante comprende che i limiti sono mere suggestioni; applicando una pressione implacabile e un genio tattico, puoi tracciare un sentiero dove gli altri vedono solo un muro.",
        quote_pt: "A palavra impossível não está no meu dicionário. A vitória pertence aos mais perseverantes. As decisões mais ousadas costumam ser as mais seguras.",
        meaning_pt: "Sobre a Soberania da Vontade: Impossível é uma palavra encontrada apenas no dicionário dos tolos. Um gigante percebe que os limites são meramente sugestões; aplicando uma pressão implacável e brilho tático, você pode esculpir um caminho onde outros veem apenas uma parede."
      },
      {
        quote_it: "Un leader è un dispensatore di speranza. Il tuo dovere principale è mantenere viva la visione quando la luce della certezza comincia a svanire.",
        meaning_it: "Sull'Architettura del Morale: Le persone non seguono la logica; seguono la speranza. La vera leadership è la capacità di trasformare la paura collettiva di una nazione o di una squadra in un'energia focalizzata e diretta verso un obiettivo monumentale.",
        quote_pt: "Um líder é um vendedor de esperança. Seu principal dever é manter a visão viva quando a luz da certeza começa a desaparecer.",
        meaning_pt: "Sobre a Arquitetura da Moral: As pessoas não seguem a lógica; elas seguem a esperança. A verdadeira liderança é a capacidade de transformar o medo coletivo de uma nação ou de uma equipe em uma energia concentrada e direcionada a um objetivo monumental."
      },
      {
        quote_it: "Il pericolo più grande si presenta al momento della vittoria. Quando hai raggiunto la vetta, è allora che devi essere più vigile contro la discesa.",
        meaning_it: "Sul Pericolo della Superbia: Il successo è un maestro più pericoloso del fallimento. Un gigante sa che ogni trionfo è temporaneo; usa lo slancio della tua vittoria per fortificare la tua posizione, non per abbandonarti al lusso della compiacenza.",
        quote_pt: "O maior perigo ocorre no momento da vitória. Quando você atinge o cume, é aí que você deve ser mais vigilante contra a descida.",
        meaning_pt: "Sobre o Perigo da Arrogância: O sucesso é um professor mais perigoso que o fracasso. Um gigante sabe que todo triunfo é temporário; use o impulso da sua vitória para fortalecer a sua posição, e não para se entregar ao luxo da complacência."
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
console.log('Done mapping Napoleon Bonaparte');
