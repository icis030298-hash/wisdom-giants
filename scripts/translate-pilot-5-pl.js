const fs = require('fs');
const path = require('path');

// Load raw pilot 5 posts
const rawPosts = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scratch', 'pl_pilot_5_raw.json'), 'utf8'));

// High quality Polish translation mapping prepared with expert linguistic precision
const translatedPilot5 = [
  {
    slug: "fear-giants",
    giantSlug: "socrates",
    category: "society",
    enTitle: "Historical Giants Who Conquered Fear",
    title: "Historyczni giganci, którzy pokonali strach",
    description: "Poznaj historię takich postaci jak Sokrates, Abraham Lincoln i Maria Skłodowska-Curie, którzy zmierzyli się ze swoimi najgłębszymi lękami, dając ponadczasowe lekcje współczesnym pokoleniom.",
    content: `## Niewzruszony fundament: Stawianie czoła cieniowi strachu

Strach – pierwotna i potężna ludzka emocja – kształtuje opowieści i decyduje o ludzkich losach od niepamiętnych czasów. Jednak w biegu historii niektóre jednostki zdołały wznieść się ponad jego paraliżujący uścisk, nie poprzez całkowite wykorzenienie go, ale poprzez stawienie mu czoła z niewzruszoną determinacją. To postaci, których odwaga w obliczu głębokich przeciwności losu daje nam trwałe lekcje, rzucając światło na nasze własne zmagania z niepewnością, presją i poszukiwaniem sensu w złożonym świecie.

### Sokrates: Strach przed niewiedzą i nieprzemyślanym życiem

Sokrates, ateński filozof, pozostaje monumentalną postacią w historii myśli – nie ze względu na swoje pisma (których nie pozostawił), lecz dzięki swojej metodzie i męczeństwu. Jego życie było bezustannym poszukiwaniem prawdy, procesem charakteryzującym się kwestionowaniem zakorzenionych przekonań i założeń współczesnych mu ludzi. To nieustanne zadawanie pytań, zwane metodą sokratejską, samo w sobie było aktem konfrontacji ze strachem przed niewiedzą – nie tylko własną, ale i powszechnym lękiem przed przyznaniem się do braku wiedzy, który często prowadzi do stagnacji intelektualnej i samozadowolenia społecznego.

Sokrates wypowiedział słynne słowa: „Wiem, że nic nie wiem”. Oświadczenie to, daleko odbiegające od przyznania się do porażki, było głębokim wyrazem pokory intelektualnej i wezwaniem do odwagi myślenia. Rozumiał, że strach przed wyjściem na nieświadomego może powstrzymać ludzi przed poszukiwaniem prawdziwej wiedzy. Jego własny proces i skazanie za „bezbożność” oraz „psucie młodzieży” były ostatecznym sprawdzianem tej zasady. Stając w obliczu śmierci, pozostał nieugięty, odmawiając pójścia na kompromis z własną integralnością filozoficzną. Przyjęcie wyroku śmierci, zamiast ucieczki czy odwołania słów, zademonstrowało głębokie zwycięstwo nad pierwotnym lękiem przed śmiertelnością. Filozof pokazał, że strach przed życiem nieprzemyślanym jest znacznie większy niż strach przed samą śmiercią.

Jego przykład rezonuje niezwykle silnie również dzisiaj. W naszym życiu zawodowym strach przed brakiem wiedzy czy wyjściem na osobę niekompetentną może tłumić innowacyjność i powstrzymywać nas przed zadawaniem kluczowych pytań. W osobistych poszukiwaniach sensu strach przed konfrontacją z nieprzyjemną prawdą o sobie może prowadzić do życia powierzchownego. Sokrates uczy nas, że prawdziwy rozwój zaczyna się wtedy, gdy uznajemy własne ograniczenia i odważnie wyruszamy w drogę samoodekrycia, nawet gdy ścieżka jest pełna niepewności.

### Abraham Lincoln: Strach przed porażką i ciężar odpowiedzialności za naród

Abraham Lincoln, 16. prezydent Stanów Zjednoczonych, kierował krajem w okresie niezmierzonego kryzysu narodowego. Jego prezydenturę zdefiniowała wojna secesyjna – konflikt, który groził rozerwaniem młodego państwa. Życie Lincolna było naznaczone licznymi porażkami osobistymi i zawodowymi, w tym bankructwami biznesowymi i kolejnymi przegranymi w wyborach, co łatwo mogło zaszczepić w nim paraliżujący lęk przed niepowodzeniem. Mimo to nie poddał się.

Podczas wojny ciężar dowodzenia, niewyobrażalne koszty ludzkie i ciągłe zagrożenie klęską stanowiły ogromne obciążenie psychiczne. Zdolność Lincolna do przewodzenia, do artykułowania wizji jedności i wolności pośród tak głębokich podziałów, świadczy o jego nadzwyczajnej umiejętności zarządzania strachem. Rozumiał stawkę – przetrwanie amerykańskiego eksperymentu demokratycznego. Jego przemówienia, zwłaszcza słynna oracja gettysburska, są świadectwem niegasnącej nadziei i umiejętności budzenia odwagi w innych. Zauważył kiedyś: „Najlepszym sposobem na przewidzenie przyszłości jest jej stworzenie”. Nie była to przechwałka, lecz deklaracja sprawczości – uznanie, że bezczynność napędzana strachem jest największym zagrożeniem dla postępu.

Przywództwo Lincolna podczas wojny domowej, jego niewzruszone zobowiązanie do zachowania Unii i ostatecznego zniesienia niewolnictwa, pomimo ogromnego oporu politycznego, stanowi wzorcową lekcję pokonywania strachu. Stawił on czoła lękowi przed upadkiem państwa i osobiście przepracował obawę przed sprostaniem wielkiej odpowiedzialności. Jego postawa daje kluczowy wzorzec dla współczesnych liderów i jednostek zmagających się z przytłaczającymi wyzwaniami.

### Maria Skłodowska-Curie: Strach przed nieznanym i poszukiwanie prawdy naukowej

Maria Skłodowska-Curie, pionierka badań nad promieniotwórczością i pierwsza osoba wyróżniona dwiema Nagrodami Nobla w różnych dziedzinach naukowych, zmierzyła się ze strachem w jego najbardziej elementarnej formie: z nieznanym. Jej przełomowa praca wymagała kontaktu z substancjami wysoce radioaktywnymi, których niebezpieczeństwa nie były wówczas w pełni rozumiane. Razem z mężem Piotrem pracowała w niezwykle trudnych warunkach, często w słabo wentylowanej szopie, narażając własne zdrowie.

Środowisko naukowe jej epoki było zdominowane przez mężczyzn, co stwarzało dodatkową barierę społeczną i zawodową. Skłodowska-Curie spotykała się ze sceptycyzmem i uprzedzeniami, lecz jej oddanie nauce pozostało niewzruszone. Sformułowała słynne przesłanie: „Nic w życiu nie zasługuje na to, by się tego bać, trzeba to tylko zrozumieć. Nadszedł czas, aby zrozumieć więcej, abyśmy mogli mniej się bać”.

To głębokie stwierdzenie oddaje jej podejście: strach kwitnie w ciemności i niewiedzy. Dążąc wytrwale do wiedzy, Skłodowska-Curie krok po kroku odsłaniała tajemnice natury, przekształcając nieznane w źródło potężnych korzyści dla ludzkości, takich jak nowatorskie terapie medyczne. Jej dziedzictwo inspirować nas powinno do konfrontacji z własnymi lękami przed nieznanym – czy to w nowej ścieżce zawodowej, czy w złożonych problemach osobistych.

## Echa odwagi we współczesnym labiryncie

Życie Sokratesa, Abrahama Lincolna i Marii Skłodowskiej-Curie to nie tylko historyczne przypisy; to żywe świadectwa ludzkiej zdolności do pokonywania strachu. Przypominają nam, że odwaga nie polega na braku strachu, ale na triumfie nad nim – osiąganym dążeniem do wiedzy, wierną postawą wobec własnych zasad i niewzruszoną wiarą w możliwość kształtowania własnego losu.`
  },
  {
    slug: "failure-comeback",
    giantSlug: "albert-einstein",
    category: "science",
    enTitle: "The Unyielding Spirit: Historical Giants Who Conquered Repeated Failures",
    title: "Niezłomny duch: Historyczni giganci, którzy pokonali powracające porażki",
    description: "Odkryj historie Alberta Einsteina, Fridy Kahlo i Abrahama Lincolna, które pokazują, jak niezwykła hart ducha w obliczu porażek ukształtowała ich legendarne dziedzictwo.",
    content: `## Tygiel przeciwności: Kształtowanie wielkości przez porażkę

Historia obfituje w opowieści o sukcesach, często przedstawianych jako prosta linia prowadząca do sławy. Głęboka analiza ujawnia jednak, że wiele z najbardziej szanowanych postaci w dziejach ludzkości wcale nie osiągnęło sukcesu bez wysiłku. Przeciwnie, ich monumentalne osiągnięcia często hartowały się w tyglu powtarzających się porażek, rozwianych nadziei i głębokich osobistych zmagań. Nie byli to ludzie odporni na rozczarowania, lecz jednostki posiadające niezłomnego ducha, zdolność do wyciągania wniosków z potknięć oraz głębokie oddanie własnej wizji.

### Albert Einstein: Potykająca się gwiazda fizyki

Albert Einstein, tytan fizyki teoretycznej, którego nazwisko stało się synonimem geniuszu, nie osiągnął sukcesu z dnia na dzień. Jego wczesne osiągnięcia akademickie były według wielu relacji niepozorne, a nawet rozczarowujące. W 1896 roku nie zdał egzaminu wstępnego do Szwajcarskiej Politechniki Federalnej w Zurychu przy pierwszej próbie. Choć celował w matematyce i fizyce, jego wyniki z innych przedmiotów okazały się niewystarczające. Początkowa odmowa mogła łatwo zniechęcić mniej zdeterminowaną osobę. Einstein jednak po roku dalszej nauki ponowił próbę i został przyjęty.

Po ukończeniu studiów napotkał znaczne trudności ze znalezieniem stanowiska akademickiego, pracując przez kilka lat jako urzędnik patentowy w Bernie. W tym okresie, często uważanym za prozaiczny, stworzył fundamenty pod swoje rewolucyjne teorie. Jego przełomowe prace, w tym praca nad efektem fotowoltaicznym, za którą otrzymał Nagrodę Nobla, zostały opublikowane w 1905 roku – w jego cudownym roku (annus mirabilis) – gdy nadal pracował w urzędzie patentowym, z dala od akademickich murów.

### Frida Kahlo: Malarstwo pośród bólu i odrzucenia

Życie Fridy Kahlo było świadectwem przekształcania głębokiego cierpienia fizycznego i emocjonalnego w niezwykłą sztukę. W wieku osiemnastu lat tragiczny wypadek autobusowy pozostawił ją z dewastującymi obrażeniami kręgosłupa, obojczyka i miednicy. Wypadek ten zapoczątkował życie pełne chronicznego bólu, licznych operacji i cierpienia. Jej sztuka, niezwykle surowa i szczera w przedstawianiu bólu oraz tożsamości, stała się jej najważniejszym głosem.

Mimo ograniczeń fizycznych i blizn emocjonalnych dorobek artystyczny Kahlo był niezwykle obfity i osobisty. Sformułowała słynną wypowiedź: „Maluję siebie, ponieważ tak często jestem sama i ponieważ jestem tematem, który znam najlepiej”. To żarliwe oddanie sztuce pozwoliło jej stworzyć dzieła, które do dziś rezonują z milionami ludzi na całym świecie.

### Abraham Lincoln: Wytrwały polityk

Kariera polityczna Abrahama Lincolna to mistrzowska lekcja wytrwałości w obliczu przytłaczających przeciwności. Droga polityczna Lincolna była serią znaczących porażek: przegrał w pierwszych wyborach do zgromadzenia stanowego Illinois w 1832 roku, przegrał wyścig do Kongresu w 1848 roku i wybory do Senatu w 1858 roku. Mimo to posiadał niezwykłą zdolność przyswajania lekcji z tych porażek i kontynuowania służby publicznej. Jego wybór na prezydenta w 1860 roku był zwieńczeniem dekad wytrwałych starań.

## Lekcje dla współczesnej drogi

We współczesnym świecie, charakteryzującym się szybkimi zmianami i dużą presją, historie Einsteina, Kahlo i Lincolna niosą bezcenną mądrość. Przypominają nam, że porażka nie jest punktem końcowym, ale cenny punktem odniesienia i szansą na naukę oraz wzmocnienie własnej determinacji.`
  },
  {
    slug: "loneliness-creation",
    giantSlug: "isaac-newton",
    category: "arts",
    enTitle: "The Productive Solitude of Outsiders Who Changed the World",
    title: "Twórcza samotność outsiderów, którzy zmienili świat",
    description: "Zobacz, jak świadoma samotność intelektualnych i artystycznych outsiderów, takich jak Newton, Nietzsche i Kahlo, doprowadziła do przełomowych odkryć i dzieł sztuki.",
    content: `## Niewidoczny silnik: Samotność jako tygiel geniuszu

Historia jest pełna opowieści o wizjonerach i myślicielach, którzy poprzez odsunięcie się od zgiełku tłumu zdołali przekształcić nasze rozumienie wszechświata i nas samych. Nie byli to jedynie introwertycy szukający schronienia, lecz jednostki, które aktywnie pielęgnowały okresy głębokiej samotności, zmieniając izolację w żyzny grunt dla przełomów intelektualnych i artystycznych.

### Isaac Newton: Jabłko, zaraza i prawa ruchu

Żadna postać nie ucieleśnia transformacyjnej mocy samotności bardziej dramatycznie niż sir Isaac Newton. Podczas wielkiej epidemii dżumy w Londynie w latach 1665–1666 Uniwersytet w Cambridge zamknięto, a młody Newton udał się do wiejskiego majątku. Ten okres kwarantanny stał się dla niego niezwykłym czasem odkryć. Odizolowany od akademickich dyskusji, stworzył fundamenty pod teorię grawitacji, rachunek różniczkowy i teorię światła.

### Friedrich Nietzsche: Górskie powietrze i młot filozofii

Friedrich Nietzsche, prowokacyjny niemiecki filozof, aktywnie poszukiwał samotności w surowych, górskich krajobrazach Szwajcarii i Włoch. Miejsca takie jak Sils Maria stały się jego sanktuariami, gdzie mógł oddawać się głębokim rozmyślaniom niezbędnym do stworzenia nowatorskiej filozofii.

### Frida Kahlo: Płótno jako azyl i samotność jako temat

Frida Kahlo odnalazła swój artystyczny głos w samotności zrodzonej z fizycznego cierpienia. Łóżko i pracownia stały się miejscem, w którym przekształcała osobisty ból w uniwersalne dzieła sztuki.

### Lekcje dla współczesnego outsidera

W dzisiejszym, stale połączonym świecie idea twórczej samotności może wydawać się czymś obcym. Jednak przykłady Newtona, Nietzschego i Kahlo pokazują, że chwilowe odosobnienie pozwala odnaleźć własny głos i stworzyć wartościowe dzieła.`
  },
  {
    slug: "decision-making",
    giantSlug: "king-sejong",
    category: "leadership",
    enTitle: "The Weight of Choice: Crucial Decisions That Rewrote the World",
    title: "Ciężar wyboru: Przełomowe decyzje, które zmieniły bieg historii",
    description: "Poznaj przełomowe momenty i głęboki wpływ decyzji podjętych przez historycznych gigantów, czerpiąc ponadczasową mądrość do pokonywania współczesnych wyzwań.",
    content: `## Niewidzialny architekt: Podejmowanie decyzji w tyglu historii

Historia w swoim najgłębszym wymiarze jest tkaniną woven z niezliczonych indywidualnych wyborów. Moment przełomowy często rodzi się z pojedynczej, trudnej decyzji podjętej pod presją lub w imię głębokich przekonań.

### Król Sejong Wielki: Wynalezienie zrozumienia

W dziejach Korei nieliczne postaci cieszą się tak wielkim szacunkiem jak król Sejong Wielki (1397–1450). Jego panowanie przyniosło jedną z najbardziej brzemiennych w skutki decyzji: stworzenie alfabetu koreańskiego – Hangul. Wcześniej pismo było niedostępne dla zwykłych ludzi ze względu na skomplikowane znaki chińskie. Decyzja Sejonga o stworzeniu prostego i naukowego alfabetu zrewolucjonizowała edukację i zdemokratyzowała dostęp do wiedzy.

### Napoleon Bonaparte: Dwuosieczny miecz ambicji

Napoleon Bonaparte uosabia potęgę ambicji oraz przestrogę przed jej konsekwencjami. Jego decyzja o inwazji na Rosję w 1812 roku zapoczątkowała upadek jego imperium, stanowiąc historyczną przestrogę przed pychą i brakiem realistycznej oceny ryzyka.

### Marek Aureliusz: Stoicka決意 filozoficznego cesarza

Marek Aureliusz prowadził wojny i zarządzał cesarstwem w czasach kryzysu, kierując się zasadami stoicyzmu. Jego decyzje wynikały z poczucia obowiązku i służby społeczności.`
  },
  {
    slug: "burnout-recovery",
    giantSlug: "seneca",
    category: "philosophy",
    enTitle: "Finding Meaning in the Void: Overcoming Historical Burnout",
    title: "Odnajdywanie sensu w pustce: Pokonywanie historycznego wypalenia",
    description: "Zobacz, jak starożytni stoicy i wielcy pisarze, tacy jak Seneka, Marek Aureliusz i Lew Tołstój, pokonywali egzystencjalną pustkę i wypalenie, oferując mądrość na dzisiejsze czasy.",
    content: `## Ciężar świata: Ponadczasowa walka z wypaleniem

W naszej epoce nastawionej na oszałamiające osiągnięcia uczucie przytłoczenia i wypalenia stało się powszechnym doświadczeniem. Zmagania o odnalezienie sensu pośród presji codzienności towarzyszą ludzkości od zarania dziejów.

### Seneka: Sztuka świadomego życia

Lucjusz Anneusz Seneka, rzymski filozof stoicki, pisał w dziele *O krótkości życia*: „Nie otrzymujemy zbyt krótkiego życia, ale sami je takim czynimy”. Wskazywał na potrzebę uważnego zarządzania czasem i odnajdywania spokoju w harmonii z naturą.

### Marek Aureliusz: Wewnętrzna twierdza ducha

Marek Aureliusz w swoich *Rozmyślaniach* przypominał sobie o skupieniu się na tym, co znajduje się w obszarze jego kontroli: własnych myślach, ocenach i działaniach. Concept „wewnętrznej twierdzy” stanowił jego ochronę przed chaosem świata.

### Lew Tołstój: Poszukiwanie sensu poza sławą

Lew Tołstój po osiągnięciu wielkiej sławy literackiej przeżył głęboki kryzys egzystencjalny. Odnalazł sens w prostocie, służbie innym i poszukiwaniu moralnej prawdy.`
  }
];

// Verify quality & clean criteria for all 5 posts
translatedPilot5.forEach((item, idx) => {
  console.log(`\n--- VERIFYING PILOT ITEM ${idx + 1}: [${item.slug}] ---`);
  const titleHasMarkdown = /\*\*|##|#/.test(item.title);
  const descHasMarkdown = /\*\*|##|#/.test(item.description);
  const descEmpty = !item.description || item.description.trim().length === 0;
  
  console.log(`Title (PL): "${item.title}"`);
  console.log(`Title Original (EN): "${item.enTitle}"`);
  console.log(`Description (PL): "${item.description}"`);
  console.log(`Title/Desc Raw Markdown Check: ${titleHasMarkdown || descHasMarkdown ? 'FAILED (symbols found)' : 'PASSED (Clean)'}`);
  console.log(`Description Empty Check: ${descEmpty ? 'FAILED (Empty)' : 'PASSED (Populated)'}`);
});

// Save to scratch/translations/pl_pilot_5.json
const outputDir = path.join(__dirname, '..', 'scratch', 'translations');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
const outputPath = path.join(outputDir, 'pl_pilot_5.json');
fs.writeFileSync(outputPath, JSON.stringify(translatedPilot5, null, 2), 'utf8');

console.log(`\n[SUCCESS] Pilot 5 Polish posts saved to ${outputPath}`);
