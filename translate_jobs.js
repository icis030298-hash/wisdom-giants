const fs = require('fs');

const dataFile = './src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const translations = {
  "steve-jobs": {
    era_it: "Gigante del XX Secolo (1955~2011)",
    epic_it: "Nel 1955, alla fine dell'inverno di San Francisco, un bambino di nome Steve Jobs emise il suo primo respiro. La sua vita non iniziò con il calore di genitori biologici, ma con le precoci prove del rifiuto e dell'adozione. Nato da una giovane studentessa e da un immigrato siriano che non potevano tenerlo, fu adottato da Paul e Clara Jobs, una coppia della classe operaia che gli diede il nome e la loro totale devozione. In seguito Jobs rifletté: \"Sono stati i miei genitori al 1000%\", eppure la consapevolezza della sua adozione alimentò un monumentale impulso a dimostrare il proprio valore e a diventare qualcosa di straordinario.\n\nDa un modesto garage nella Silicon Valley, l'ascesa di Steve Jobs fu l'inizio di una rivoluzione cosmica. Insieme al geniale ingegnere Steve Wozniak, diede vita a un sogno che avrebbe stravolto il mondo. Nel 1976, a soli vent'anni, fondò la Apple, accendendo la scintilla della rivoluzione dei personal computer. Non era un semplice mercante di macchine; era un artista singolare che infuse nella tecnologia l'anima delle arti liberali. Il successo dell'Apple I e II lo rese un principe della Silicon Valley, un'icona dell'era digitale.\n\nEppure, l'apice della sua prima gloria fu seguito da un brutale tradimento. Nel 1985, dopo un'aspra lotta di potere con John Sculley — l'uomo che egli stesso aveva reclutato — Jobs fu cacciato dall'azienda che aveva fondato. Precipitando da eroe trionfante a fallimento pubblico a trent'anni, vagò in un'oscurità profonda. Ma questa disperazione divenne un crogiolo. Fondò NeXT, progettando il futuro dei sistemi operativi, e acquisì la Pixar, creando il nuovo genere dell'animazione digitale. Questo esilio di dodici anni fu un periodo di nobile affinamento, che trasformò un giovane brillante ma arrogante in un leader di monumentale saggezza.\n\nNel 1997, Jobs tornò in una Apple sull'orlo del fallimento. Immediatamente epurò le linee di prodotti e proclamò la filosofia 'Think Different'. Attraverso la nascita dell'iMac, dell'iPod e dell'iPhone — che alterò fondamentalmente la comunicazione umana — trascese la leggenda per diventare mito. Anche quando l'ombra del cancro al pancreas iniziò a consumare il suo corpo nel 2004, si rifiutò di fermarsi. Nel suo discorso di laurea a Stanford nel 2005, dichiarò celebremente: \"La morte è molto probabilmente la migliore invenzione della vita\", accendendo un fuoco nei cuori dei giovani con il suo motto: \"Siate affamati, siate folli.\"\n\nIl 5 ottobre 2011, Steve Jobs si spense serenamente, circondato dalla sua famiglia. Lasciò un'eredità che va oltre eleganti smartphone o sottili laptop; è un testamento monumentale al potere di un perfezionismo irremovibile e alla convinzione che, pensando diversamente, si possa cambiare il mondo. La sua vita fu una grande epopea di rinascita dalle ceneri del fallimento e oggi l'umanità continua a navigare sulle onde del futuro che egli sognò e scolpì.",
    trials_it: "Il precoce abbandono da parte dei genitori biologici e la pubblica umiliazione di essere licenziato dall'azienda che aveva fondato. La battaglia esistenziale contro una diagnosi di cancro terminale all'apice del suo secondo successo.",
    overcoming_it: "Trasformò il proprio senso di perdita in una furia creativa che generò l'azienda più preziosa al mondo. Usò la propria mortalità come ispirazione finale per insegnare al mondo che il tempo è limitato, perciò non si deve sprecarlo vivendo la vita di qualcun altro.",
    era_pt: "Gigante do Século XX (1955~2011)",
    epic_pt: "Em 1955, no final do inverno de São Francisco, uma criança chamada Steve Jobs deu seu primeiro suspiro. Sua vida não começou com o calor dos pais biológicos, mas com as provações precoces da rejeição e da adoção. Filho de uma jovem estudante universitária e de um imigrante sírio que não podiam criá-lo, foi adotado por Paul e Clara Jobs, um casal de classe trabalhadora que lhe deu o nome e sua total devoção. Jobs refletiu mais tarde: \"Eles foram meus pais 1.000%\", porém o conhecimento de sua adoção alimentou um impulso monumental para provar seu valor e se tornar algo extraordinário.\n\nDe uma modesta garagem no Vale do Silício, a ascensão de Steve Jobs foi o início de uma revolução cósmica. Junto com o brilhante engenheiro Steve Wozniak, ele deu à luz um sonho que viraria o mundo de cabeça para baixo. Em 1976, com apenas vinte anos, fundou a Apple, acendendo a faísca da revolução dos computadores pessoais. Você percebe que ele não era apenas um comerciante de máquinas; ele era um artista singular que infundiu a tecnologia com a alma das artes liberais. O sucesso do Apple I e II fez dele um príncipe do Vale do Silício, um ícone da era digital.\n\nNo entanto, o auge de sua glória inicial foi seguido por uma traição brutal. Em 1985, após uma amarga disputa de poder com John Sculley — o homem que ele mesmo havia recrutado — Jobs foi expulso da empresa que fundou. Caindo de um herói triunfante a um fracasso público aos trinta anos, ele vagou em uma profunda escuridão de perda. Mas esse desespero se tornou um crisol. Ele fundou a NeXT, projetando o futuro dos sistemas operacionais, e adquiriu a Pixar, criando o novo gênero de animação digital. Esse exílio de doze anos foi um período de nobre refinamento, transformando um jovem brilhante, porém arrogante, em um líder de percepção monumental.\n\nEm 1997, Jobs retornou a uma Apple que estava à beira da falência. Ele imediatamente expurgou as linhas de produtos e proclamou a filosofia 'Think Different'. Através do nascimento do iMac, iPod e do iPhone — que alterou fundamentalmente a comunicação humana — ele transcendeu a lenda para se tornar um mito. Mesmo quando a sombra do câncer de pâncreas começou a consumir seu corpo em 2004, ele se recusou a parar. Em seu discurso de formatura em Stanford, em 2005, declarou: \"A morte é muito provavelmente a melhor invenção da vida\", acendendo um fogo nos corações dos jovens com seu lema: \"Mantenha-se faminto, mantenha-se tolo.\"\n\nEm 5 de outubro de 2011, Steve Jobs faleceu pacificamente, cercado por sua família. Ele deixou um legado que é mais do que elegantes smartphones ou laptops finos; é um testamento monumental ao poder do perfeccionismo inabalável e à convicção de que, ao pensar diferente, você pode mudar o mundo. Sua vida foi um grande épico de renascimento das cinzas do fracasso e, hoje, a humanidade continua a navegar nas ondas do futuro que ele sonhou e esculpiu.",
    trials_pt: "O abandono precoce pelos pais biológicos e a humilhação pública de ser demitido da empresa que ele mesmo fundou. A batalha existencial contra um diagnóstico de câncer terminal no auge do seu segundo sucesso.",
    overcoming_pt: "Transformou seu senso pessoal de perda em uma fúria criativa que gerou a empresa mais valiosa do mundo. Usou sua mortalidade como uma inspiração final para ensinar ao mundo que o tempo é limitado, por isso você não deve desperdiçá-lo vivendo a vida de outra pessoa.",
    wisdom: [
      {
        quote_it: "Siate affamati, siate folli. Abbiate il coraggio di seguire il vostro cuore e la vostra intuizione; in qualche modo loro sanno già cosa volete veramente diventare.",
        meaning_it: "Sulla Sovranità dell'Intuizione: Non permettete al rumore delle opinioni altrui di soffocare la vostra voce interiore. Il sentiero di un gigante non è lastricato dal consenso, ma dall'incessante perseguimento di una visione che solo voi potete scorgere. Siate abbastanza audaci da essere incompresi.",
        quote_pt: "Mantenha-se faminto, mantenha-se tolo. Tenha a coragem de seguir seu coração e sua intuição; de alguma forma, eles já sabem o que você realmente deseja se tornar.",
        meaning_pt: "Sobre a Soberania da Intuição: Não deixe o barulho das opiniões dos outros abafar a sua própria voz interior. O caminho de um gigante não é pavimentado pelo consenso, mas pela busca implacável de uma visão que só você pode ver. Seja ousado o suficiente para ser incompreendido."
      },
      {
        quote_it: "L'innovazione distingue un leader da un seguace. Non cercate solo di essere migliori; sforzatevi di essere diversi. La prospettiva è il vantaggio supremo.",
        meaning_it: "Sulla Distinzione della Visione: La vera leadership è la capacità di vedere un futuro che non esiste ancora e la volontà di manifestarlo. I seguaci raffinano il passato; i leader inventano il futuro mettendo in discussione gli assiomi stessi del loro settore.",
        quote_pt: "A inovação distingue um líder de um seguidor. Não tente apenas ser melhor; esforce-se para ser diferente. A perspectiva é a vantagem definitiva.",
        meaning_pt: "Sobre a Distinção da Visão: A verdadeira liderança é a capacidade de ver um futuro que ainda não existe e a vontade de manifestá-lo. Os seguidores refinam o passado; os líderes inventam o futuro questionando os próprios axiomas de sua indústria."
      },
      {
        quote_it: "Siamo qui per lasciare un segno nell'universo. Altrimenti per quale motivo saremmo qui? Il vostro lavoro riempirà gran parte della vostra vita e l'unico modo per essere veramente soddisfatti è fare ciò che credete sia un grande lavoro.",
        meaning_it: "Sull'Architettura del Lascito: Il vostro tempo è limitato, quindi non sprecatelo costruendo il sogno di qualcun altro. La vita di un gigante è uno sforzo monumentale per lasciare il mondo migliore, più bello o più avanzato di come l'ha trovato. Puntate a nientemeno che un impatto universale.",
        quote_pt: "Estamos aqui para deixar uma marca no universo. Senão, por que mais estaríamos aqui? Seu trabalho vai preencher uma grande parte da sua vida, e a única maneira de estar verdadeiramente satisfeito é fazer o que você acredita ser um ótimo trabalho.",
        meaning_pt: "Sobre a Arquitetura do Legado: Seu tempo é limitado, então não o desperdice construindo o sonho de outra pessoa. A vida de um gigante é um esforço monumental para deixar o mundo melhor, mais belo ou mais avançado do que o encontrou. Não mire em nada menos que um impacto universal."
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
console.log('Done mapping Steve Jobs');
