// Mock film catalog — stands in for a future `films` table. Prose fields
// (summary, funFact, production) are written from scratch in Czech (facts
// only, own wording), not translated or copied from the French Wikipedia
// articles they were researched from — those are long, French, and
// CC-BY-SA (attribution-only, not a licence to dump raw text into an
// unrelated app). Cast lists are plain facts (name + role), not creative
// expression, so they're transcribed directly from the same source.
export type FilmCastMember = {
  name: string;
  role?: string;
};

export type MockFilm = {
  slug: string;
  title: string;
  originalTitle: string;
  year: number;
  director: string;
  writers: string;
  cast: FilmCastMember[];
  summary: string;
  production?: string;
  funFact?: string;
  note?: string;
  // Drives the poster placeholder's look (see FilmPoster) — Czech fairy
  // tales get a warm, hand-painted Barrandov-poster style instead of the
  // flat French azure logo look. Omitted for everything else.
  genre?: "pohadka";
};

export const MOCK_FILMS: MockFilm[] = [
  {
    slug: "cetnik-ze-saint-tropez",
    title: "Četník ze Saint Tropez",
    originalTitle: "Le Gendarme de Saint-Tropez",
    year: 1964,
    director: "Jean Girault",
    writers: "Richard Balducci, Jacques Vilfrid, Jean Girault",
    summary:
      "První díl série. Horlivý četník Ludovic Cruchot je za odměnu přeložen z horské vesničky do Saint-Tropez, kde narazí na rozjívenou brigádu, honičky za nudisty na pláži a spletitou aféru kolem ukradeného obrazu, do níž se namočí i jeho dcera Nicole. Nečekaně se stal filmovým hitem roku a odstartoval sérii šesti filmů.",
    production:
      "Náměty pro scénář dodal producent a bývalý tiskový mluvčí Richard Balducci, který si příběh vymyslel po vlastní návštěvě skutečné četnické stanice v Saint-Tropez. Natáčelo se s poměrně skromným rozpočtem, ale s barevnou technikou, což si u nízkorozpočtové francouzské komedie tehdy vynutilo přemlouvání producentů. Film ve Francii nakonec přilákal přes 7,8 milionu diváků a stal se nejnavštěvovanějším filmem roku 1964 — Louis de Funès za něj dostal i cenu Victoire du cinéma français pro nejlepšího herce.",
    cast: [
      { name: "Louis de Funès", role: "Ludovic Cruchot, strážmistr" },
      { name: "Michel Galabru", role: "Gerber, adjutant" },
      { name: "Jean Lefebvre", role: "Lucien Fougasse, četník" },
      { name: "Christian Marin", role: "Albert Merlot, četník" },
      { name: "Guy Grosso", role: "Gaston Tricart, četník" },
      { name: "Michel Modo", role: "Jules Berlicot, četník" },
      { name: "Geneviève Gradová", role: "Nicole Cruchotová, Ludovicova dcera" },
      { name: "France Rumilly", role: "sestra Clotilda" },
      { name: "Nicole Vervil", role: "Cécilia Gerberová, adjutantova žena" },
      { name: "Claude Piéplu", role: "André-Hugues Boiselier" },
      { name: "Madeleine Delavaivre", role: "paní Boiselierová" },
      { name: "Maria Pacôme", role: "Émilie Lareine-Leroyová" },
      { name: "Martine de Breteuil", role: "vévodkyně d'Armentières" },
      { name: "Pierre Barouh", role: "cikán" },
      { name: "Giuseppe Porelli", role: "pan Harpers, zločinec" },
      { name: "Gabriele Tinti", role: "Harpersův pohůnek" },
      { name: "Maurice Jacquin Jr.", role: "Harpersův pohůnek" },
      { name: "Jean Droze", role: "Lucas, námořník na jachtě" },
      { name: "Daniel Cauchy", role: "Richard" },
      { name: "Patrice Laffont", role: "Jean-Luc" },
      { name: "Franck Vilcourt", role: "Christophe Boiselier" },
      { name: "Jean-Pierre Bertrand", role: "Eddie" },
      { name: "Pierre Gare", role: "Daniel" },
      { name: "Sylvie Bréal", role: "Jessica" },
      { name: "Norma Dugo", role: "Aliette" },
      { name: "Yveline Céry", role: "Clotilde" },
      { name: "Michèle Wargnier", role: "Mylène" },
      { name: "Claudia Lebail" },
      { name: "Fernand Sardou", role: "sedlák s traktorem" },
      { name: "Jacques Famery", role: "orientální princ" },
      { name: "Paul Bisciglia", role: "princův poradce" },
      { name: "Jean Panisse", role: "hostinský na přístavu" },
      { name: "Henri Arius", role: "rybář na lodi" },
      { name: "Jean Girault", role: "prodavač oblečení na přístavu (režisér v cameu)" },
      { name: "Raoul Saint-Yves", role: "Bishop, opilý spisovatel" },
      { name: "Jean-François Taïs" },
      { name: "Jean-Michel Taïs" },
    ],
  },
  {
    slug: "cetnik-v-new-yorku",
    title: "Četník v New Yorku",
    originalTitle: "Le Gendarme à New York",
    year: 1965,
    director: "Jean Girault",
    writers: "Jean Girault, Jacques Vilfrid (na námět Richarda Balducciho)",
    summary:
      "Brigáda ze Saint-Tropez odjíždí lodí přes Atlantik na mezinárodní sjezd četnictva do New Yorku. Cruchotova dcera Nicole se ale na palubu nalodí jako černý pasažér a otec pak musí celý pobyt tajit její přítomnost před ostatními četníky i newyorskou policií.",
    production:
      "Po nečekaném úspěchu prvního dílu producenti René Pignères a Gérard Beytout okamžitě zadali pokračování — natáčelo se jen necelý rok po premiéře jedničky, s výrazně vyšším rozpočtem, který umožnil skutečnou cestu do USA. Vznikl tak jediný díl série, který se z Saint-Tropez na delší dobu vzdálí. Ve Francii film vidělo přes 5,4 milionu diváků, solidní výsledek na pokračování.",
    funFact:
      "Natáčelo se na skutečném zaoceánském parníku France — cestující zprvu mysleli, že uniformovaní herci jsou opravdoví celníci, takže jim posádka přímo na lodi promítla první díl, aby situaci vysvětlila. Herec Jean Lefebvre se během natáčení pohádal s režisérem kvůli velikosti své role a natáčení opustil; scénář se musel narychlo přepsat, takže jeho postava stráví většinu filmu upoutaná na nemocniční lůžko. Je to jediný díl série bez scény s bláznivě řídící jeptiškou.",
    cast: [
      { name: "Louis de Funès", role: "Ludovic Cruchot" },
      { name: "Michel Galabru", role: "Gerber" },
      { name: "Jean Lefebvre", role: "Lucien Fougasse" },
      { name: "Christian Marin", role: "Albert Merlot" },
      { name: "Guy Grosso", role: "Gaston Tricart" },
      { name: "Michel Modo", role: "Jules Berlicot" },
      { name: "Geneviève Gradová", role: "Nicole" },
      { name: "Alan Scott", role: "Franck Davis, novinář" },
      { name: "Mario Pisu", role: "italský adjutant Renzo" },
      { name: "Marino Masè", role: "italský četník zamilovaný do Nicole" },
      { name: "Vincent Baggetta", role: "italský četník" },
      { name: "Jean Droze", role: "italský četník" },
      { name: "Jean Mylonas", role: "italský četník" },
      { name: "Renzo Cerrato", role: "italský četník" },
      { name: "Dominique Zardi", role: "italský četník" },
      { name: "Jean-Pierre Bertrand", role: "Nicolin kamarád" },
      { name: "Billy Kearns", role: "policejní poručík" },
      { name: "Steve Eckhardt", role: "americký policista" },
      { name: "Colin Higgins", role: "americký policista" },
      { name: "Jean Minisini", role: "americký policista" },
      { name: "Percival Russel", role: "americký policista" },
      { name: "Alexander Scourby", role: "psychiatr" },
      { name: "Albert Augier", role: "moderátor televizní reklamy" },
      { name: "Leroy Haynes", role: "taxikář" },
      { name: "Pierre Tornade", role: "lodní lékař" },
      { name: "France Rumilly", role: "sestra Clotilda" },
      { name: "François Valorbe", role: "tlumočník v hotelu" },
      { name: "Tiberio Murgia", role: "Motta, italský obchodník" },
      { name: "Roger Lumont", role: "dvojjazyčný recepční hotelu" },
      { name: "Denise Mac Laglenová", role: "obří prodavačka v hotelu" },
      { name: "René Lefèvre-Bel" },
      { name: "John Prim" },
      { name: "Carl Studer" },
      { name: "Beatrice Ponsová", role: "recepční YWCA" },
      { name: "Viviane Méryová", role: "paní Gerberová" },
    ],
  },
  {
    slug: "cetnik-se-zeni",
    title: "Četník se žení",
    originalTitle: "Le Gendarme se marie",
    year: 1968,
    director: "Jean Girault",
    writers: "Jean Girault, Jacques Vilfrid (na námět Richarda Balducciho)",
    summary:
      "Cruchot se zamiluje do Josépy, vdovy po plukovníkovi četnictva, která v něm vidí budoucího vysokého důstojníka a tlačí ho ke zkoušce na vyšší hodnost — k nelibosti jeho nadřízeného, adjutanta Gerbera. Natáčení v květnu a červnu 1968 poznamenala celostátní stávka po událostech Května 68.",
    production:
      "Francouzsko-italská koprodukce SNC a Medusa Distribuzione vznikla se čtyřletým odstupem od předchozího dílu — Louis de Funès mezitím natočil řadu jiných hitů (Fantomas, Četník v New Yorku, Blázni, blbci a bláznivky) a stal se nejlépe placeným francouzským hercem. I přes stávkou zpožděné natáčení film ve Francii vidělo přes 6,8 milionu diváků.",
    funFact:
      "Než se natáčení vůbec rozjelo, tvůrci zvažovali anketou, jestli se má Cruchot opravdu oženit — báli se, že ženatý hrdina odradí fanynky. Na premiéře pak došlo ke slavné roztržce: herec Jean Lefebvre po projekci vstal a před novináři si veřejně stěžoval, že se ve filmu kvůli sestříhaným scénám téměř neobjevil — jeho vztahy s Louisem de Funèsem se tím na dlouho pokazily. Ve filmu si také poprvé v sérii prohodili role herci Guy Grosso a Michel Modo (Tricart a Berlicot).",
    cast: [
      { name: "Louis de Funès", role: "Ludovic Cruchot" },
      { name: "Michel Galabru", role: "Gerber" },
      { name: "Jean Lefebvre", role: "Lucien Fougasse" },
      { name: "Christian Marin", role: "Albert Merlot" },
      { name: "Guy Grosso", role: "Gaston Tricart" },
      { name: "Michel Modo", role: "Jules Berlicot" },
      { name: "Geneviève Gradová", role: "Nicole Cruchotová" },
      { name: "Claude Gensacová", role: "Josépha Le François, později Cruchotová" },
      { name: "Mario David", role: "Frédo le boucher, zločinec" },
      { name: "Nicole Vervil", role: "paní Gerberová" },
      { name: "Yves Vincent", role: "plukovník u zkoušky" },
      { name: "France Rumilly", role: "sestra Clotilda" },
      { name: "Yves Barsacq", role: "pokutovaný řidič" },
      { name: "Nicole Garciová", role: "pokutovaná dívka" },
      { name: "Maurizio Bonuglia", role: "Nicolin přítel" },
      { name: "Bernard Lavalette", role: "taneční učitel" },
      { name: "Dominique Davrayová", role: "taneční učitelka" },
      { name: "Jean-Pierre Bertrand", role: "Eddie" },
      { name: "Claude Bertrand", role: "četník zvaný „Poussin bleu“" },
      { name: "Jean Ozenne", role: "prefekt" },
      { name: "Robert Destain", role: "velitel eskadrony" },
      { name: "Jacky Blanchot", role: "pilot cvičného člunu" },
      { name: "Rudy Lenoir", role: "uchazeč o zkoušku" },
      { name: "Dominique Zardi", role: "uchazeč o zkoušku" },
      { name: "René Berthier", role: "kapitán, plukovníkův pobočník" },
      { name: "Tave Frisch" },
      { name: "Donatella Turriová" },
      { name: "Henri Guégan" },
      { name: "Jerry Calà" },
      { name: "Robert Leray" },
    ],
  },
  {
    slug: "cetnik-ve-vysluzbe",
    title: "Četník ve výslužbě",
    originalTitle: "Le Gendarme en balade",
    year: 1970,
    director: "Jean Girault",
    writers: "Jean Girault, Jacques Vilfrid (na námět Richarda Balducciho)",
    summary:
      "Čtvrtý díl série. Brigádu ze Saint-Tropez pošlou do předčasného důchodu a nahradí ji mladší, fyzicky zdatnější mužstvo. Cruchot se topí v nudě na zámku své ženy Josépy, dokud se nedozví, že bývalý kolega Fougasse po jednom hrdinském činu ztratil paměť. S Gerberem a Merlotem si proto znovu nelegálně obléknou uniformy a vydají se starého přítele probrat vzpomínkami na Saint-Tropez — a nakonec musí zastavit partu výrostků, kteří se pokoušejí odpálit vlastnoruční raketu s ukradenou jadernou hlavicí.",
    production:
      "Francouzsko-italská koprodukce SNC a Mega Films měla rozpočet 8,5 milionu franků, z pětiny financovaný italským partnerem. Honorář Louise de Funèse dosáhl 2,6 milionu franků — dvojnásobku celého rozpočtu prvního dílu z roku 1964 — a řadil ho mezi nejlépe placené herce v Evropě. Ve Francii film navštívilo přes 4,8 milionu diváků; slabší úvodní týdny v konkurenci filmů jako Cercle rouge napravila až vánoční sezóna, kdy se pět týdnů držel na vrcholu tuzemského žebříčku. Byl to poslední film s kompletní původní sestavou — Jean Lefebvre a Christian Marin se kvůli sporům s Louisem de Funèsem do série už nevrátili a v dalších dílech je nahradili Maurice Risch a Jean-Pierre Rambal. Jedinými herci, kteří si zahráli ve všech šesti dílech, tak zůstávají Louis de Funès, Michel Galabru, Guy Grosso, Michel Modo a France Rumilly. Za film dostal Louis de Funès v roce 1971 cenu Georges-Courteline.",
    funFact:
      "Scénu, ve které Cruchot s Gerberem na konci filmu zneškodňují jadernou hlavici, si od rekvizit po zpocenou čepici vymyslel sám Louis de Funès — stejně jako gag s bláznivě řídící jeptiškou, který se táhne celou sérií. Hudební znělku Pochod četníků, jejíž absenci v předchozím díle hlavní herec nesl velmi nelibě, na jeho naléhání znovu vrátili do filmu. A scéna, ve které podkoní vypráví Cruchotovi pohádku o Červené Karkulce, ve scénáři vůbec nebyla — herci si ji na place vymysleli za pochodu.",
    cast: [
      { name: "Louis de Funès", role: "Ludovic Cruchot, strážmistr" },
      { name: "Michel Galabru", role: "Gerber, adjutant" },
      { name: "Jean Lefebvre", role: "Lucien Fougasse, četník" },
      { name: "Christian Marin", role: "Albert Merlot, četník" },
      { name: "Guy Grosso", role: "Gaston Tricart, četník" },
      { name: "Michel Modo", role: "Jules Berlicot, četník" },
      { name: "Claude Gensacová", role: "Josépha Cruchotová" },
      { name: "France Rumilly", role: "sestra Clotilda, nově matka představená" },
      { name: "Nicole Vervil", role: "Cécilia Gerberová" },
      { name: "Dominique Davrayová", role: "nedůtklivá sestra" },
      { name: "Yves Vincent", role: "plukovník" },
      { name: "René Berthier", role: "velitel eskadrony, plukovníkův pobočník" },
      { name: "Sara Franchetti", role: "sestra Marie-Bénédicta" },
      { name: "Paul Préboist", role: "podkoní" },
      { name: "Paul Mercey", role: "farář" },
      { name: "Christor Georgiadis", role: "James, majordom" },
      { name: "Christine Reynolds", role: "pokojská" },
      { name: "Dominique Zardi", role: "pytlák" },
      { name: "Henri Attal" },
      { name: "Robert Le Béal", role: "ministr" },
      { name: "Yves Barsacq", role: "havarovaný řidič bílého MGB (neuvedený v titulcích)" },
      { name: "Jean Valmence", role: "havarovaný řidič červeného Alfa Romeo" },
      { name: "René Marchal", role: "hráč pétanque" },
      { name: "Henri Guégan", role: "hráč pétanque v Pinsonnière" },
      { name: "Ugo Fangareggi", role: "hipík" },
    ],
  },
  {
    slug: "cetnik-a-mimozemstane",
    title: "Četník a mimozemšťané",
    originalTitle: "Le Gendarme et les Extra-terrestres",
    year: 1979,
    director: "Jean Girault",
    writers: "Jacques Vilfrid, Jean Girault, Louis de Funès, Gérard Beytout",
    summary:
      "Po devítileté pauze se brigáda ze Saint-Tropez vrací — tentokrát čelí mimozemšťanům, kteří přistáli poblíž města a umí se vydávat za obyčejné lidi. Cruchotovi nikdo nevěří, když se snaží upozornit na jejich přítomnost. Návrat série byl obrovským komerčním úspěchem, nejnavštěvovanějším francouzským filmem roku 1979.",
    production:
      "Devítiletou pauzu v sérii zapříčinily zdravotní problémy Louise de Funèse (dva infarkty v roce 1975), po nichž se herec k natáčení postupně vracel jen zvolna. Návrat четníků s sci-fi motivem inspirovaným tehdejší módou (Blízká setkání třetího druhu, Star Wars) se ve francouzských kinech setkal s obrovským ohlasem — přes 6,2 milionu diváků, což z něj udělalo nejúspěšnější francouzský film roku 1979 a poslední film Louise de Funèse v čele žebříčku návštěvnosti.",
    cast: [
      { name: "Louis de Funès", role: "Ludovic Cruchot / mimozemský dvojník" },
      { name: "Michel Galabru", role: "adjutant Gerber / dvojník" },
      { name: "Guy Grosso", role: "Tricart / dvojník" },
      { name: "Michel Modo", role: "Berlicot / dvojník" },
      { name: "Maurice Risch", role: "Beaupied / dvojník" },
      { name: "Jean-Pierre Rambal", role: "Taupin / dvojník" },
      { name: "France Rumilly", role: "sestra Clotilda" },
      { name: "Jean-Roger Caussimon", role: "biskup" },
      { name: "Mario David", role: "zloděj kanystru s olejem" },
      { name: "Jacques François", role: "plukovník / dvojník" },
      { name: "Maria Mauban", role: "Josépha Cruchotová / dvojnice" },
      { name: "Pierre Repp", role: "koktající benzinkář" },
      { name: "Lambert Wilson", role: "mladý mimozemšťan (neuvedený v titulcích)" },
      { name: "Madeleine Delavaivre", role: "sestra s Gerberovou čepicí" },
      { name: "Micheline Bourdayová", role: "paní Gerberová" },
      { name: "Jacqueline Jeffordová", role: "statná sestra" },
      { name: "René Berthier", role: "velitel eskadrony / dvojník" },
      { name: "Fulbert Janin", role: "úředník Bonneval / dvojník" },
      { name: "Henri Génès", role: "majitel restaurace Le Cabanon" },
      { name: "Marco Perrin", role: "starosta Saint-Tropez" },
      { name: "Antoine Marin", role: "pokutovaný řidič" },
      { name: "Carlo Nell", role: "novinář" },
      { name: "Rika Hofmannová", role: "opilá americká turistka" },
      { name: "Percival Russel", role: "americký turista / dvojník" },
      { name: "Marie Pillet", role: "servírka v Le Cabanon" },
      { name: "Serge Brasseur", role: "sportovec na pláži (neuvedený)" },
      { name: "Jean-Paul Schneider", role: "mimozemšťan v Le Cabanon" },
      { name: "Jeffrey Kime", role: "mimozemšťan v Le Cabanon" },
    ],
  },
  {
    slug: "cetnik-a-cetnice",
    title: "Četník a četnice",
    originalTitle: "Le Gendarme et les Gendarmettes",
    year: 1982,
    director: "Jean Girault",
    writers: "Jacques Vilfrid, Jean Girault, Gérard Beytout",
    summary:
      "Brigáda ze Saint-Tropez dostane za úkol vycvičit první čtyři četnice, které se mají stát součástí sboru. Šestý a poslední díl série — natáčení zkomplikovalo zhoršující se zdraví režiséra Jeana Giraulta, který v jeho průběhu zemřel; o pár měsíců později zemřel i Louis de Funès, pro kterého to byl poslední film.",
    production:
      "Natáčení bylo od jara 1982 uzpůsobené zdravotnímu stavu Louise de Funèse — pracovalo se jen několik hodin denně, s pravidelnými přestávkami a kardiologem po ruce. V jeho průběhu vážně onemocněl i režisér Jean Girault, tvůrce celé série, a musel odjet na natáčení dohlížet z nemocnice; zemřel ještě před dokončením filmu. I tak šlo o komerční úspěch (přes 4,2 milionu diváků), byť nejnižší v celé sérii.",
    funFact:
      "Než tvůrci sáhli po nápadu se ženami ve sboru (souběžně s tím, jak francouzské četnictvo tou dobou skutečně otevíralo řady ženám), zvažovali úplně jiná pokračování — pomstu mimozemšťanů, let četníků do vesmíru nebo dokonce cestu v čase k bitvě u Waterloo. Čtyři nové „četnice“ si zahrály herečky Babeth Étienne, Catherine Serre, Nicaise Jean-Louis a Sophie Michaud; filmová sláva ale žádné z nich dlouho nevydržela a většina se brzy filmu i herectví vzdala.",
    note: "Poslední film Louise de Funèse i režiséra Jeana Giraulta.",
    cast: [
      { name: "Louis de Funès", role: "Ludovic Cruchot" },
      { name: "Michel Galabru", role: "adjutant Alphonse Gerber" },
      { name: "Guy Grosso", role: "Tricart" },
      { name: "Michel Modo", role: "Berlicot" },
      { name: "Maurice Risch", role: "Beaupied" },
      { name: "Patrick Préjean", role: "Perlin" },
      { name: "Babeth Étienne", role: "Marianne Bonnet, četnice" },
      { name: "Nicaise Jean-Louis", role: "Yo Macumba, četnice" },
      { name: "Catherine Serre", role: "Christine Rocourt, četnice" },
      { name: "Sophie Michaud", role: "Isabelle Leroy, četnice" },
      { name: "Claude Gensacová", role: "Josépha Cruchotová" },
      { name: "France Rumilly", role: "matka představená" },
      { name: "Micheline Bourdayová", role: "Germaine Gerberová" },
      { name: "Jacques François", role: "plukovník" },
      { name: "Pierre Repp", role: "koktající stěžovatel" },
      { name: "Jean-Louis Richard", role: "„Mozek“, zločinec" },
      { name: "Jean-Marie Balembois", role: "„Mozkův“ pomocník" },
      { name: "Stéphane Bouy", role: "Olsen, námořník z Albacory" },
      { name: "Max Montavon", role: "lékárník" },
      { name: "Franck-Olivier Bonnet", role: "statný námořník z Albacory" },
      { name: "Jean Turlier", role: "ministr" },
      { name: "Jean Panisse", role: "hostinský" },
      { name: "Xavier Letourneur", role: "kapitán vedle plukovníka" },
      { name: "René Berthier", role: "velitel eskadrony" },
      { name: "Philippe Ruggieri", role: "Georges, přestrojený za „četnici“" },
      { name: "Sandra Barryová", role: "Georgesova snoubenka" },
      { name: "Janine Souchonová", role: "sestra čtoucí Komunistický manifest" },
      { name: "Dominique Julienne", role: "mladý výtržník na motorce" },
      { name: "Christine Pignetová", role: "dívka na nádraží" },
    ],
  },
  {
    slug: "pouic-pouic",
    title: "Pouic-Pouic",
    originalTitle: "Pouic-Pouic",
    year: 1963,
    director: "Jean Girault",
    writers: "Jean Girault, Jacques Vilfrid",
    summary:
      "Byznysmen Léonard Monestier se snaží zbavit bezcenné naftové koncese v Orinoku, kterou mu od podvodníka koupila jeho bláznivá žena Cynthia — podstrčí ji za mastný peníz zamilovanému boháči Antoinu Brévinovi, který se dvoří jeho dceři Patricii. Do intriky zapojí náhodného doručovatele, kterého si Patricia najme, aby předstíral, že je jejím manželem, i vlastního syna. Když se nakonec ukáže, že koncese je díky nečekanému nálezu ropy skutečně k nezaplacení, Monestier už ji stihl prodat.",
    production:
      "Film vznikl podle divadelní hry Sans cérémonie, kterou Jean Girault a Jacques Vilfrid napsali v roce 1952 a v níž tehdy ještě málo známý Louis de Funès hrál jen drobnou roli sluhy. O jedenáct let později dostal ve filmové verzi hlavní roli byznysmena Monestiera — role, která znamenala zlom v jeho kariéře. Po jeho boku debutovala v první významné filmové roli mladičká Mireille Darc jako dcera Patricia a výstřední Jacqueline Maillan hrála Monestierovu ženu Cynthii. Přijetí kritikou bylo smíšené a film měl jen skromný úspěch, ale o rok později ho retroaktivně vynesla obrovská popularita Četníka ze Saint-Tropez od stejné dvojice tvůrců — nakonec tak dohromady přilákal přes dva miliony diváků.",
    funFact:
      "Titulní 'Pouic-Pouic' není postava, ale domácí slepice výstřední Cynthie Monestierové, kterou po celém filmu vodí na vodítku — jméno slepice dalo název celému filmu, přestože se ve scénáři objevuje jen coby vedlejší gag.",
    cast: [
      { name: "Louis de Funès", role: "Léonard Monestier" },
      { name: "Mireille Darc", role: "Patricia Monestierová" },
      { name: "Roger Dumas", role: "Paul Monestier" },
      { name: "Jacqueline Maillan", role: "Cynthia Monestierová" },
      { name: "Christian Marin", role: "Charles, komorník" },
      { name: "Philippe Nicaud", role: "Simon Guilbaud" },
      { name: "Guy Tréjan", role: "Antoine Brévin" },
      { name: "Daniel Ceccaldi", role: "Pedro Caselli" },
      { name: "Maria-Rosa Rodriguez", role: "Palma Diamantino" },
      { name: "Yves Barsacq", role: "James, řidič (neuvedený v titulcích)" },
    ],
  },
  {
    slug: "fantomas",
    title: "Fantomas",
    originalTitle: "Fantomas",
    year: 1964,
    director: "André Hunebelle",
    writers: "Jean Halain, Pierre Foucaud (podle postav Pierra Souvestra a Marcela Allaina)",
    summary:
      "Novinář Fandor pochybuje, že záhadný zločinec Fantômas, co drží v šachu celou Paříž, vůbec existuje — a na truc napíše výsmyšný rozhovor. Fantômas ho za trest unese a přinutí zveřejnit stažení článku, načež komisař Juve oba obviní ze spolčení. Při honičce po střechách, vlaky, vrtulníkem i ponorkou se Juve snaží dostihnout zločince, který mu navíc unesl snoubenku Hélène.",
    production:
      "Adaptace pulpových románů Pierra Souvestra a Marcela Allaina z počátku 20. století modernizuje postavu zločince v duchu tehdejší bondovské módy — s maskami, gadgety a rychlými přestřihy. Jean Marais ztvárnil dvojroli Fandora i Fantômase, ale skutečným překvapením se stal Louis de Funès coby komicky nedočkavý komisař Juve, jehož vedlejší role diváky pobavila natolik, že se z něj v pokračováních stala hlavní hvězda série. Film přilákal 4,5 milionu diváků ve Francii a ohromujících 45,5 milionu v tehdejším Sovětském svazu. Při natáčení kaskadérské scény na jeřábu se Louis de Funès zranil — dočasně si ochromil ramenní svaly a plně se zotavoval několik let.",
    funFact:
      "Ve scénách, kde se Fantômas vydává za komisaře Juva, hraje zločince ve skutečnosti sám Louis de Funès s jemnou maskou — nalíčení mu pokaždé trvalo dvě a půl hodiny. Aby fyzicky nepůsobil méně troufale než Jean Marais, trval de Funès na tom, že si sám skočí z mostu na projíždějící vlak.",
    cast: [
      { name: "Jean Marais", role: "novinář Jérôme Fandor / Fantômas" },
      { name: "Louis de Funès", role: "komisař Paul Juve" },
      { name: "Mylène Demongeot", role: "Hélène Gurnová" },
      { name: "Jacques Dynam", role: "inspektor Michel Bertrand" },
      { name: "Robert Dalban", role: "ředitel novin Le Point du jour" },
      { name: "Marie-Hélène Arnaud", role: "lady Maud Belthamová" },
      { name: "Christian Toma", role: "inspektor Pierre" },
      { name: "Michel Duplaix", role: "inspektor Léon" },
      { name: "Henri Attal", role: "Fantômasův pohůnek" },
      { name: "Dominique Zardi", role: "Fantômasův pohůnek" },
      { name: "Bernard Musson", role: "strážník" },
    ],
  },
  {
    slug: "smolar",
    title: "Smolař",
    originalTitle: "Le Corniaud",
    year: 1965,
    director: "Gérard Oury",
    writers: "Gérard Oury, Marcel Jullian, Georges Tabet, André Tabet",
    summary:
      "Naivní Pařížan Antoine Maréchal dostane od bohatého 'obchodníka' Léopolda Saroyana coby odškodné za nabouraný vůz zaplacenou dovolenou v Itálii s luxusním kabrioletem, který má na konci cesty odvézt do Bordeaux. Netuší, že auto je propašované plné drog, zlata a drahokamů a že ho jako dokonale nenápadnou 'mulu' sleduje na každém kroku sám Saroyan i konkurenční gang. Během bláznivé pouti od Neapole po Bordeaux se z zdánlivého hlupáka vyklube chytřejší muž, než si kdokoli myslel.",
    production:
      "Scénář vychází z reálné aféry moderátora Jacquese Angelvina, kterého v roce 1962 zatkli v USA s autem propašovaným plným heroinu — Angelvin se hájil tím, že o nákladu nevěděl. Podle režiséra Gérarda Ouryho měl být 'smolař' 'nejdřív Bourvil a nakonec Louis de Funès' — obsadil je do dosud nevyzkoušené dvojice v hlavních rolích. Šlo o první Ouryho komedii a zároveň nebývale nákladnou produkci na francouzské poměry, natáčenou v přírodních exteriérech od Neapole po Bordeaux. Triumf u diváků (11,7 milionu vstupenek, nejnavštěvovanější francouzský film roku 1965) zopakovalo stejné trio hned následující rok filmem Velký flám.",
    funFact:
      "Nápad na drogy schované v nárazníku vychází přímo ze skutečného případu Jacquese Angelvina — jediná část aféry, kterou si scénáristé ponechali beze změny. Zbytek příběhu, včetně nevinné 'muly', si vymysleli sami, přestože to bylo přesně tvrzení, kterým se Angelvin u soudu hájil.",
    cast: [
      { name: "Bourvil", role: "Antoine Maréchal" },
      { name: "Louis de Funès", role: "Léopold Saroyan" },
      { name: "Venantino Venantini", role: "Mickey zvaný „Koktavý“" },
      { name: "Beba Loncar", role: "Ursula, stopařka" },
      { name: "Alida Chelli", role: "Gina, manikérka" },
      { name: "Henri Génès", role: "Martial" },
      { name: "Guy Grosso", role: "celník" },
      { name: "Michel Modo", role: "celník" },
    ],
  },
  {
    slug: "fantomas-se-zlobi",
    title: "Fantomas se zlobí",
    originalTitle: "Fantomas se déchaîne",
    year: 1965,
    director: "André Hunebelle",
    writers: "Jean Halain, Pierre Foucaud",
    summary:
      "Rok po domnělé porážce je komisař Juve vyznamenán Čestnou legií — jenže Fantômas se vzápětí vrátí a unese vědce vyvíjejícího telepatický paprsek na ovládání lidské mysli. Fandor se za druhého profesora vydává na vědecký kongres do Říma, kam ho doprovázejí Juve, Hélène i její nezbedný bratr Michou. Fantômas je unese na maskovaném plese a zajatce chce dokonce oddělit od hlavy — nakonec ale uprchne v okřídleném autě, které se promění v letadlo.",
    production:
      "Rozpočet oproti prvnímu dílu vzrostl z 3,3 na 5,5 milionu franků — skoro čtvrtinu spolkly honoráře herců. V raných ohláškách pokračování na Louise de Funèse produkce skoro zapomněla, ale po úspěchu prvního dílu si tvůrci uvědomili, že právě jeho komická role diváky nejvíc baví, a dali mu ve scénáři výrazně větší prostor. Část natáčení probíhala v Římě.",
    funFact:
      "V roli Hélènina mladšího bratra Michoua debutoval na plátně Olivier de Funès, vlastní syn Louise de Funèse.",
    cast: [
      { name: "Jean Marais", role: "Fantômas / novinář Fandor / profesor Lefebvre / markýz de Rostelli" },
      { name: "Louis de Funès", role: "komisař Paul Juve" },
      { name: "Mylène Demongeot", role: "Hélène Gurnová" },
      { name: "Jacques Dynam", role: "inspektor Bertrand" },
      { name: "Christian Toma", role: "inspektor Pierre" },
      { name: "Olivier de Funès", role: "Michel „Michou“ Gurn" },
      { name: "Robert Dalban", role: "redaktor Le Point du jour" },
      { name: "Albert Dagnant", role: "profesor Marchand" },
      { name: "Robert Le Béal", role: "ministr" },
      { name: "Henri Attal", role: "Fantômasův pohůnek" },
      { name: "Dominique Zardi", role: "Fantômasův pohůnek" },
    ],
  },
  {
    slug: "grand-restaurant-pana-septima",
    title: "Grand restaurant pana Septima",
    originalTitle: "Le Grand Restaurant",
    year: 1966,
    director: "Jacques Besnard",
    writers: "Louis de Funès, Jean Halain, Jacques Besnard",
    summary:
      "Pan Septime, tyranský majitel proslulého pařížského grandrestaurantu, si potrpí na dokonalý servis a kvůli němu týrá celý personál — natolik, že je první podezřelý, když se mu přímo v podniku ztratí jihoamerický prezident na státní návštěvě. Než se ukáže, že šlo jen o prezidentovu vlastní únikovou hru před vyčerpávajícím programem, stihne Septime absolvovat výslech na policii, falešné pašování výkupného až do zasněžených Alp i honičku s teroristy.",
    production:
      "Nápad nosil Louis de Funès v hlavě už od konce 50. let, kdy sám dlouhé roky vydělával jako barový pianista a měl tak dokonalý přehled o zákulisí luxusních podniků. Byl to první film, na jehož scénáři se přímo podílel — spoluautorsky, přestože formální režii nakonec přenechal Jacquesi Besnardovi. Obsadil do něj řadu sobě blízkých herců (Bernard Blier, Paul Préboist, duo Grosso a Modo) a malou roli dal i vlastnímu synovi Olivierovi. Ve francouzských kinech film navštívilo přes 3,8 milionu diváků — úspěch o poznání menší než blížící se Velký flám, který měl premiéru téhož podzimu.",
    funFact:
      "Postava přísného pana Septima dostala jméno po římském císaři Septimiu Severovi, o kterém se Louis de Funès učil ve škole — inspiroval ho k tomu skutečný italský restaurant jménem Septime Sévère, kde jednou večeřel. Scénka, kde jeden z číšníků na všechno reaguje zděšeným 'Mon Dieu!', vznikla přímo z de Funèsovy záliby v pozorování pohoršených lidí.",
    cast: [
      { name: "Louis de Funès", role: "pan Septime, majitel restaurace" },
      { name: "Bernard Blier", role: "policejní komisař" },
      { name: "Folco Lulli", role: "prezident Novalès" },
      { name: "Venantino Venantini", role: "Enrique" },
      { name: "Maria-Rosa Rodriguez", role: "Sophia, prezidentova sekretářka" },
      { name: "Paul Préboist", role: "sommelier" },
      { name: "Noël Roquevert", role: "ministr" },
      { name: "Guy Grosso", role: "číšník" },
      { name: "Michel Modo", role: "Petit-Roger, podlézavý číšník" },
      { name: "Jacques Dynam", role: "číšník" },
      { name: "Maurice Risch", role: "Julien, číšník" },
      { name: "Jean Ozenne", role: "vrchní číšník opakující „Mon Dieu!“" },
      { name: "Pierre Tornade", role: "druhý vrchní číšník" },
      { name: "Olivier de Funès", role: "kmotřenec šéfkuchaře Marcela" },
      { name: "France Rumilly", role: "baronka, hostka se psem" },
    ],
  },
  {
    slug: "velky-flam",
    title: "Velký flám",
    originalTitle: "La Grande Vadrouille",
    year: 1966,
    director: "Gérard Oury",
    writers: "Gérard Oury, Danièle Thompson, Marcel Jullian",
    summary:
      "Za okupované Paříže roku 1942 sestřelí Němci britský bombardér — tři z posádky seskočí padákem a musí se s pomocí naprosto nesourodé dvojice Francouzů, malíře pokojů Augustina a nesnesitelně parádního dirigenta Opery Stanislase, dostat přes celou zemi do svobodné zóny. Cestou unikají v ukradených uniformách, přes lázně, operu, kanalizaci i kravský vagon, než se konečně na kluzácích dostanou z dosahu okupantů.",
    production:
      "Po nečekaném triumfu Smolaře natočil Gérard Oury s Bourvilem a Louisem de Funèsem hned druhou komedii — tentokrát rozpočet 14 milionů franků umožnil skutečnou velkofilmovou produkci s britskou koprodukcí. Do role neodolatelně komického Angličana 'Big Moustache' přemluvil producent Robert Dorfmann hvězdu Terryho-Thomase, kterého prý přilákala i vyhlídka natáčení v burgundském vinařském kraji. Film ve své první kinodistribuci (1966–1975) nasbíral přes 17 milionů diváků a přes třicet let držel rekord nejnavštěvovanějšího filmu v historii francouzských kin vůbec, než ho v roce 1998 překonal Titanic — dodnes je třetím nejnavštěvovanějším francouzským filmem na domácí půdě.",
    funFact:
      "Kdyby scénář zůstal u prvního nápadu, hrály by hlavní role dvě sestry-dvojčata, ne dva muži — Gérard Oury příběh vymyslel už koncem 50. let pro tanečnici a herečku Zizi Jeanmaire, teprve po letech ho s Bourvilem a de Funèsem v hlavních rolích přepsal na mužské postavy malíře a dirigenta.",
    cast: [
      { name: "Bourvil", role: "Augustin Bouvet, malíř pokojů" },
      { name: "Louis de Funès", role: "Stanislas Lefort, dirigent Pařížské opery" },
      { name: "Terry-Thomas", role: "sir Reginald Brook, „Big Moustache“" },
      { name: "Claudio Brook", role: "Peter Cunningham" },
      { name: "Mike Marshall", role: "Alan MacIntosh" },
      { name: "Marie Dubois", role: "Juliette" },
      { name: "Andréa Parisy", role: "sestra Marie-Odile" },
      { name: "Mary Marquet", role: "matka představená" },
      { name: "Paul Préboist", role: "rybář" },
      { name: "Henri Génès", role: "hlídač zoo ve Vincennes" },
      { name: "Colette Brosset", role: "paní Germaine" },
      { name: "Michel Modo", role: "přimhouřený voják" },
      { name: "Guy Grosso", role: "upovídaný fagotista" },
    ],
  },
  {
    slug: "fantomas-kontra-scotland-yard",
    title: "Fantomas kontra Scotland Yard",
    originalTitle: "Fantomas contre Scotland Yard",
    year: 1967,
    director: "André Hunebelle",
    writers: "Jean Halain, Pierre Foucaud",
    summary:
      "Fantômas začne od nejbohatších lidí světa vybírat 'daň za právo žít' — první na řadě je skotský lord Mac Rashley, který si na pomoc povolá komisaře Juva, inspektora Bertranda i Fandora s Hélène. Fantômas ale lorda zavraždí a převezme jeho podobu, načež zorganizuje honičku na lišku, při níž unese další oběti vydírání. Nakonec ho Hélène odhalí přímo při předávání výkupného, ale zločinec unikne komínem v raketě.",
    production:
      "Třetí a poslední díl trilogie dostal rozpočet 6,4 milionu franků. Skotské hradní prostředí přineslo víc tajemna a hororových prvků než předchozí bondovky. Mezi Jeanem Maraisem a Louisem de Funèsem se na place vyostřily neshody kvůli rozsahu jejich rolí a celkovému tónu filmu — de Funèsova popularita v té době Maraisovu už dávno předstihla. Kritika byla k scénáři i režii nemilosrdná, přesto se film stal mezinárodním komerčním trhákem s více než 3,5 milionu diváky ve Francii.",
    funFact:
      "Byla to poslední společná spolupráce Jeana Maraise a Louise de Funèse — po tomto filmu se jejich cesty rozešly.",
    cast: [
      { name: "Jean Marais", role: "Fantômas / novinář Fandor / Sir Walter Brown / Giuseppe Luigi" },
      { name: "Louis de Funès", role: "komisař Paul Juve" },
      { name: "Mylène Demongeot", role: "Hélène Gurnová" },
      { name: "Jean-Roger Caussimon", role: "lord Edward Mac Rashley / Fantômas v přestrojení" },
      { name: "Françoise Christophe", role: "lady Dorothée Mac Rashleyová" },
      { name: "Henri Serre", role: "André Berthier, lordův sekretář" },
      { name: "Jacques Dynam", role: "inspektor Bertrand" },
      { name: "Jean Ozenne", role: "Albert, komorník" },
      { name: "Robert Dalban", role: "ředitel Le Point du jour" },
      { name: "Dominique Zardi", role: "Fantômasův pohůnek" },
    ],
  },
  {
    slug: "oskar",
    title: "Oskar",
    originalTitle: "Oscar",
    year: 1967,
    director: "Édouard Molinaro",
    writers: "Jean Halain, Édouard Molinaro, Louis de Funès (podle divadelní hry Clauda Magniera)",
    summary:
      "Za jediný den se boháč Bertrand Barnier dozví, že mu účetní Christian Martin zpronevěřil miliony, že je zamilovaný do jeho dcery, a nakonec i to, že je vlastně milencem úplně jiné ženy — situaci dál komplikují záměny kufříků se šperky a penězi i falešné těhotenství, než na konci vyjde najevo ještě jedno šokující rodinné tajemství.",
    production:
      "Filmová adaptace divadelní hry Clauda Magniera, kterou Louis de Funès předtím na jevišti odehrál několik set repríz. Do role Barnierovy manželky Germaine tehdy poprvé obsadil Claude Gensacovou, kterou objevil při jejím divadelním vystoupení — na doporučení vlastní ženy Jeanne, jež chtěla, aby jeho filmové manželky byly distingované, ne jen komické tlusté bábovky. Po velkém úspěchu (přes 6,1 milionu diváků, druhý nejnavštěvovanější film roku 1967 ve Francii, hned za Senzačními prázdninami) se pak Gensacová stala jeho stálou herečkou po boku.",
    funFact:
      "Ve filmu se poprvé objevuje vtip s doktorem Poussinem, kterému manželka pana Barniera volá v panice — stejný gag, se stejným jménem doktora, se o čtyři roky později vrátil i ve filmu Jo, opět s Claude Gensacovou v roli volající manželky.",
    cast: [
      { name: "Louis de Funès", role: "Bertrand Barnier" },
      { name: "Claude Rich", role: "Christian Martin" },
      { name: "Claude Gensacová", role: "Germaine Barnierová" },
      { name: "Agathe Natanson", role: "Colette Barnierová" },
      { name: "Paul Préboist", role: "Charles, sluha" },
      { name: "Sylvia Saurel", role: "Jacqueline Bouillotte" },
      { name: "Mario David", role: "Philippe Dubois, masér" },
      { name: "Germaine Delbat", role: "Charlotte" },
      { name: "Roger Van Hool", role: "Oscar, řidič" },
    ],
  },
  {
    slug: "senzacni-prazdniny",
    title: "Senzační prázdniny",
    originalTitle: "Les Grandes Vacances",
    year: 1967,
    director: "Jean Girault",
    writers: "Jean Girault, Jacques Vilfrid",
    summary:
      "Ředitel internátní školy Charles Bosquier pošle svého syna Philippa, propadlého z angličtiny, na prázdniny do Skotska k rodině majitele palírny whisky — Philippe ale za sebe pošle spolužáka a sám vyrazí na plachetnici po Seině. Výměnou k Bosquierům dorazí bujará dcera Skotů Shirley, která s sebou strhne mladšího syna i půlku internátu, než celá zamotaná historka vyvrcholí honičkou napříč Francií a nakonec i svatbou v malé skotské vesnici, kde se lze vzít bez souhlasu rodičů.",
    production:
      "Podle svědectví Louise de Funèse to byl jeho oblíbený film z celé kariéry. Vznikl na vrcholu jeho slávy, krátce po triumfu Velkého flámu, a znovu dokázal jeho komerční sílu — ve francouzských kinech ho vidělo téměř 7 milionů diváků, což ho vyneslo na první místo tuzemského žebříčku roku 1967. Natáčení jedné z kaskadérských scén, kdy letadlo přistává na střeše autobusu, si vyžádalo život kaskadéra Jeana Falloux.",
    funFact:
      "Šlo o druhý film, ve kterém Claude Gensacová hrála manželku postavy Louise de Funèse — po jejich seznámení na place Oskara jí role sedla natolik, že ji de Funès pak do role své filmové ženy obsazoval ještě mnohokrát.",
    cast: [
      { name: "Louis de Funès", role: "Charles Bosquier, ředitel internátu" },
      { name: "Ferdy Mayne", role: "Mac Farrell, majitel palírny" },
      { name: "Martine Kelly", role: "Shirley Mac Farrellová" },
      { name: "François Leccia", role: "Philippe Bosquier" },
      { name: "Olivier de Funès", role: "Gérard Bosquier" },
      { name: "Claude Gensacová", role: "Isabelle Bosquierová" },
      { name: "Maurice Risch", role: "Stéphane Michonnet" },
      { name: "Jacques Dynam", role: "pan Croizac, dodavatel uhlí" },
      { name: "Dominique Davrayová", role: "Rose, majitelka kavárny" },
      { name: "Guy Grosso", role: "profesor Chastenet" },
    ],
  },
  {
    slug: "tonouci-se-stebla-chyta",
    title: "Tonoucí se stébla chytá",
    originalTitle: "Le Petit Baigneur",
    year: 1968,
    director: "Robert Dhéry",
    writers: "Robert Dhéry",
    summary:
      "Majitel loděnic Fourchaume vyhodí konstruktéra Castagniera hned poté, co jeho nová loď při křtu prorazí trup — netuší, že Castagnierova jiná konstrukce, malá plachetnice Petit Baigneur, právě vyhrála prestižní italské regaty. Musí ho tak za jediný den přemluvit zpátky, zatímco ho v tom předbíhá konkurenční italský podnikatel a konstruktérova vlastní sourozenecká domácnost věci ještě zamotá.",
    production:
      "Šlo o pátý celovečerní film Roberta Dhéryho, který si vzal na pomoc producenta Roberta Dorfmanna, stojícího předtím za Smolařem i Velkým flámem, aby kolem nové hvězdy Louise de Funèse postavil film plný jeho vlastní staré divadelní tlupy Branquignols. Kvůli daňovým důvodům se muselo natáčet ve spěchu na podzim a v zimě 1967 mezi Francií a Itálií. Mezi Dhérym a de Funèsem na place vznikly ostré neshody o tom, kolik prostoru scénář věnuje vedlejším postavám — de Funès si jako jediný důvod komerčního úspěchu filmu nárokoval hlavní roli pro sebe. Přesto ve Francii film nakonec vidělo přes 5,5 milionu diváků.",
    funFact:
      "Ve filmu hraje malou roli skutečný francouzský komik a moderátor Pierre Dac coby ministr — do scény křtu lodi si sám přidal improvizovanou hlášku, jakmile bouchlá láhev šampaňského poškodila trup.",
    cast: [
      { name: "Louis de Funès", role: "Louis-Philippe Fourchaume" },
      { name: "Robert Dhéry", role: "André Castagnier" },
      { name: "Andréa Parisy", role: "Marie-Béatrice Fourchaumová" },
      { name: "Franco Fabrizi", role: "Marcello Cacciapuoti" },
      { name: "Colette Brosset", role: "Charlotte Castagnierová" },
      { name: "Michel Galabru", role: "Scipion, švagr Andrého" },
      { name: "Jacques Legras", role: "Henri Castagnier, farář" },
      { name: "Pierre Tornade", role: "Jean-Baptiste Castagnier, majitel majáku" },
      { name: "Pierre Dac", role: "ministr" },
      { name: "Henri Génès", role: "Joseph, sedlák" },
      { name: "Nicole Vervil", role: "matka malého Francise" },
    ],
  },
  {
    slug: "hibernatus",
    title: "Hibernatus",
    originalTitle: "Hibernatus",
    year: 1969,
    director: "Édouard Molinaro",
    writers: "Jean Halain, Louis de Funès, Jacques Vilfrid, Jean Bernard-Luc (podle stejnojmenné divadelní hry)",
    summary:
      "Polární expedice najde v ledovci dokonale zamrzlého muže, který v ledu strávil 65 let a probudí se jako pětadvacetiletý mladík ze začátku století. Ukáže se, že je to dávno ztracený dědeček manželky průmyslníka Huberta de Tartas — a než ho rodina smí přijmout, celé okolí musí dům i způsob života přizpůsobit atmosféře roku 1905, aby si 'Hiberný' zachoval zdravý rozum. Hubert se navíc musí vydávat za jeho otce a nakonec i dvořit vlastní ženě.",
    production:
      "Gaumont zopakoval úspěšný recept Oskara — divadelní předlohu, režiséra Édouarda Molinara i dvojici Louis de Funès a Claude Gensacová v roli manželky. Natáčení provázelo další vypjaté napětí mezi de Funèsem a Molinarem, podobně jako u Oskara. Šlo o druhý film, u kterého měl de Funès smluvně zajištěný podíl na scénáři.",
    funFact:
      "V malé roli Hubertova syna Didiera hraje Olivier de Funès, vlastní syn hlavního herce — a jeho snoubenku si ve filmu zahrála Éliette Demay, nevlastní sestra Claude Gensacové.",
    cast: [
      { name: "Louis de Funès", role: "Hubert Barrère de Tartas" },
      { name: "Claude Gensacová", role: "Edmée de Tartas" },
      { name: "Bernard Alane", role: "Paul Fournier, „Hiberný“" },
      { name: "Olivier de Funès", role: "Didier de Tartas" },
      { name: "Michael Lonsdale", role: "profesor Loriebat" },
      { name: "Martine Kelly", role: "Sophie, služebná" },
      { name: "Paul Préboist", role: "Charles, majordom" },
      { name: "Yves Vincent", role: "Édouard Crépin-Jaujard" },
      { name: "Éliette Demay", role: "Évelyne Crépin-Jaujardová" },
      { name: "Jacques Legras", role: "advokát" },
      { name: "Claude Piéplu", role: "generální sekretář ministerstva vnitra" },
    ],
  },
  {
    slug: "jo",
    title: "Jo",
    originalTitle: "Jo",
    year: 1971,
    director: "Jean Girault",
    writers: "Claude Magnier, Jacques Vilfrid (podle divadelních her Jo a The Gazebo)",
    summary:
      "Úspěšný komediograf Antoine Brisebard čelí vyděrači jménem Jo, který hrozí odhalit temnou rodinnou minulost jeho manželky, slavné herečky. Pod záminkou psaní detektivky si od právníka-kamaráda vyzvídá, jak spáchat dokonalou vraždu — jenže sotva vyděrače zastřelí, zjistí, že mrtvý vůbec není Jo, a s tělem, které nejde nikam schovat, tráví zbytek filmu.",
    production:
      "Šlo o osmou spolupráci Louise de Funèse s režisérem Jeanem Giraultem a další film, kde ho v roli manželky doprovázela Claude Gensacová — hrála ji tehdy počtvrté. Bernard Blier zopakoval podobnou roli vyšetřujícího komisaře jako o pět let dřív v Grand restaurantu pana Septima, včetně stejné dynamiky nesvého de Funèse tísněného jeho přítomností. Předlohou byla divadelní hra Clauda Magniera, sama založená na britské komedii The Gazebo.",
    funFact:
      "Postavy dvou gangsterů, Duca a Grand-Louise, hrají Henri Attal a Dominique Zardi — dvojice hereckých kumpánů, kteří si v de Funèsových filmech pravidelně zahrávali podobné darebáky, mimo jiné i ve fantomasovské trilogii.",
    cast: [
      { name: "Louis de Funès", role: "Antoine Brisebard" },
      { name: "Claude Gensacová", role: "Sylvie Brisebardová" },
      { name: "Bernard Blier", role: "inspektor Ducros" },
      { name: "Michel Galabru", role: "Tonelotti, zedník" },
      { name: "Christiane Muller", role: "Mathilde, hospodyně" },
      { name: "Florence Blot", role: "paní Cramuselová" },
      { name: "Guy Tréjan", role: "Adrien Colas, advokát" },
      { name: "Ferdy Mayne", role: "pan Grunder" },
      { name: "Dominique Zardi", role: "„Duc“, gangster" },
      { name: "Henri Attal", role: "Grand-Louis, gangster" },
      { name: "Paul Préboist", role: "strážmistr, který vrátí kufr" },
    ],
  },
  {
    slug: "posetilost-mocnych",
    title: "Pošetilost mocných",
    originalTitle: "La Folie des grandeurs",
    year: 1971,
    director: "Gérard Oury",
    writers: "Gérard Oury, Danièle Thompson, Marcel Jullian (podle Ruy Blase Victora Huga)",
    summary:
      "Zkorumpovaný španělský ministr financí don Salluste je královnou zbaven úřadu — z pomsty zmanipuluje svého zamilovaného sluhu Blaze, aby se pod cizí identitou vetřel na dvůr a královnu svedl a zkompromitoval. Blaze se ale u dvora neplánovaně osvědčí jako poctivý ministr a Sallustova intrika se zvrtne v sled záměn, mluvícího kakadu a svůdný striptýz dvorní dámy, než oba muži skončí vyhnáni k Berberům.",
    production:
      "Nápad zkomedizovat Hugův Ruy Blas dostal Gérard Oury už v roce 1960, kdy si roli dona Sallusta zahrál na divadle v Comédii-Française. Uskutečnit ho mohl až po triumfu Smolaře a Velkého flámu — rozpočet 18 milionů franků umožnil natáčení i v granadské Alhambře. Roli sluhy Blaze měl původně hrát Bourvil, po jeho smrti na rakovinu v září 1970 ale na doporučení Simone Signoretové roli převzal Yves Montand. Film ve Francii přilákal přes 5 milionů diváků — solidní, ale ve srovnání se Smolařem a Velkým flámem zklamáním, jen čtvrté místo tuzemského žebříčku roku.",
    funFact:
      "Nejcitovanější scénou filmu zůstává neplánovaný striptýz dvorní dámy doni Juany (Alice Sapritchová), který spustí kakadu doručující zprávu na špatnou adresu — pták měl doručit vzkaz královně, ale zabloudil do jejích komnat.",
    cast: [
      { name: "Louis de Funès", role: "don Salluste, ministr financí" },
      { name: "Yves Montand", role: "Blaze, jeho sluha" },
      { name: "Alice Sapritchová", role: "doňa Juana, dvorní dáma" },
      { name: "Karin Schubert", role: "Marie-Anna Neuburská, španělská královna" },
      { name: "Alberto de Mendoza", role: "král Karel II." },
      { name: "Paul Préboist", role: "němý, Sallustův pohůnek" },
      { name: "Venantino Venantini", role: "markýz del Basto" },
      { name: "Gabriele Tinti", role: "don César" },
      { name: "Robert Le Béal", role: "komoří" },
    ],
  },
  {
    slug: "dobrodruzstvi-rabina-jakoba",
    title: "Dobrodružství rabína Jákoba",
    originalTitle: "Les Aventures de Rabbi Jacob",
    year: 1973,
    director: "Gérard Oury",
    writers: "Gérard Oury, Danièle Thompson, Josy Eisenberg",
    summary:
      "Bigotní a xenofobní průmyslník Victor Pivert se náhodou zaplete do revoluce v nejmenované arabské zemi — pronásledují ho jak tajná policie plukovníka Farèse, tak francouzští policisté, kteří ho podezřívají z vraždy. Aby unikl, přestrojí se za ctihodného amerického rabína a schová se v pařížské židovské čtvrti — kde ho ke svému úžasu čeká vřelé přijetí, a nakonec i cesta k vlastnímu polepšení.",
    production:
      "Poslední společná spolupráce Gérarda Ouryho a Louise de Funèse vznikla z Ouryho dávné fascinace pařížskou chasidskou komunitou v ulici Rosiers. Gaumont se kvůli vlastním finančním potížím z produkce stáhl a film se dlouho nedařilo sehnat financovat, protože téma přátelství mezi Židy a Araby v napjaté době blízkovýchodního konfliktu považovali producenti za příliš riskantní. Do kin nakonec vstoupil přesně v době vypuknutí jomkipurské války, což vyvolalo i pokus o únos letadla namířený proti jeho uvedení. Přesto se stal s 7,3 miliony diváků nejúspěšnějším francouzským filmem roku 1973 a jediným průlomem Louise de Funèse na americký trh — dostal i nominaci na Zlatý glóbus pro nejlepší cizojazyčný film.",
    funFact:
      "Ve vedlejší roli Pivertovy dcery Antoinette se objevuje mladičká Miou-Miou, tehdy na začátku kariéry, která se později stala jednou z nejvýraznějších francouzských hereček své generace.",
    cast: [
      { name: "Louis de Funès", role: "Victor Pivert" },
      { name: "Claude Giraud", role: "Mohamed Larbi Slimane" },
      { name: "Henri Guybet", role: "Salomon, řidič" },
      { name: "Renzo Montagnani", role: "plukovník Farès" },
      { name: "Suzy Delairová", role: "Germaine Pivertová" },
      { name: "Marcel Dalio", role: "skutečný rabín Jákob" },
      { name: "Claude Piéplu", role: "komisař Andréani" },
      { name: "Miou-Miou", role: "Antoinette Pivertová" },
      { name: "Janet Brandtová", role: "Tsippé Schmollová, „Mamé“" },
      { name: "Popeck", role: "Moïshe Schmoll" },
    ],
  },
  {
    slug: "kridylko-nebo-stehynko",
    title: "Křidýlko nebo stehýnko",
    originalTitle: "L'Aile ou la Cuisse",
    year: 1976,
    director: "Claude Zidi",
    writers: "Claude Zidi, Michel Fabre",
    summary:
      "Gastronomický kritik Charles Duchemin, vydavatel prestižního restauračního průvodce, vede křížovou výpravu proti průmyslové stravě magnáta Jacquesa Tricatela — zatímco jeho syn Gérard tajně sní o cirkusu místo o rodinném podniku. Otec se synem se nakonec spojí, vloupou se do Tricatelovy vysoce zabezpečené továrny a odhalí podvod s umělým jídlem přímo na živém televizním souboji.",
    production:
      "Vznikl z touhy mladého producenta Christiana Fechnera natočit svůj idol Louise de Funèse — a znamenal jeho návrat na plátno po třech letech pauzy kvůli vážným zdravotním potížím. Film postavil vedle sebe jako otce a syna zkušeného komika a tehdy razantně stoupající hvězdu Coluche. Natáčelo se v létě 1976 za velkého vedra a se zvýšenou zdravotní opatrností kolem stárnoucího hlavního herce. Ve Francii ho vidělo 5,8 milionu diváků, druhé místo žebříčku roku hned za Čelistmi — úspěch, který de Funèsovi nastartoval druhou vlnu kariéry a dlouholetou spolupráci s producentem Fechnerem.",
    funFact:
      "Padouch Jacques Tricatel a jeho průmyslové 'restorouty' jsou přímou parodií na skutečného podnikatele Jacquesa Borela, zatímco Duchemenův gastronomický průvodce si utahuje z michelinského průvodce — dobová narážka, kterou tehdejší diváci ihned rozpoznali.",
    cast: [
      { name: "Louis de Funès", role: "Charles Duchemin" },
      { name: "Coluche", role: "Gérard Duchemin" },
      { name: "Julien Guiomar", role: "Jacques Tricatel" },
      { name: "Claude Gensacová", role: "Marguerite, sekretářka" },
      { name: "Ann Zacharias", role: "Marguerite, náhradní sekretářka" },
      { name: "Raymond Bussières", role: "Henri, řidič" },
      { name: "Marcel Dalio", role: "krejčí" },
      { name: "Georges Chamarat", role: "stálý tajemník Francouzské akademie" },
    ],
  },
  {
    slug: "jeden-hot-a-druhy-cehy",
    title: "Jeden hot a druhý čehý",
    originalTitle: "La Zizanie",
    year: 1978,
    director: "Claude Zidi",
    writers: "Claude Zidi, Pascal Jardin, Michel Fabre",
    summary:
      "Starosta a továrník Guillaume zachrání svou továrnu na odlučovače znečištění obří zakázkou, jenže nemá kde vyrábět ani skladovat — postupně tak zabere celý dům, manželčinu zahradu i skleník. Zuřivá manželka Bernadette ho opustí a v komunálních volbách proti němu kandiduje jako zástupkyně ochránců přírody.",
    production:
      "Spojil poprvé a naposledy dva tehdy nejobsazovanější komiky francouzského filmu, Louise de Funèse a Annie Girardotovou. Skladatel Vladimir Cosma poprvé postavil celou hudbu na syntezátoru místo orchestru. Plánovanou titulní píseň Pierra Perreta tvůrci těsně před premiérou stáhli, protože ji de Funès s manželkou považovali za příliš vulgární pro dětské publikum.",
    funFact:
      "Píseň On sème la zizanie, kterou pro film napsal a nazpíval Pierre Perret, byla z filmu stažena jen tři týdny před premiérou — skladatel Vladimir Cosma musel narychlo připravit čistě instrumentální verzi znělky.",
    cast: [
      { name: "Louis de Funès", role: "Guillaume Daubray-Lacaze" },
      { name: "Annie Girardotová", role: "Bernadette Daubray-Lacazeová" },
      { name: "Maurice Risch", role: "„ten pitomec“" },
      { name: "Julien Guiomar", role: "doktor Landry" },
      { name: "Jacques François", role: "prefekt" },
      { name: "Mario David", role: "kamioňák" },
      { name: "Daniel Boulanger", role: "ředitel banky" },
      { name: "Nicole Chollet", role: "Léontine, služebná" },
    ],
  },
  {
    slug: "lakomec",
    title: "Lakomec",
    originalTitle: "L'Avare",
    year: 1980,
    director: "Jean Girault, Louis de Funès",
    writers: "Jean Girault, Louis de Funès, Jean Halain (podle Molièra)",
    summary:
      "Starý lakomec Harpagon zakope svůj poklad na zahradě, dětem chystá bezcitné sňatky z rozumu a sám si tajně plánuje bezplatnou svatbu s chudou Mariannou — do cesty mu ale stojí vlastní syn zamilovaný do téže dívky. Když mu kazetu se zlaťáky ukradnou, propukne v zoufalé nařčení celého okolí, než se na konci vše vyřeší dvojitou svatbou a nalezeným pokladem.",
    production:
      "Jediná režisérská práce v kariéře Louise de Funèse, kterou natočil společně se svým dlouholetým spolupracovníkem Jeanem Giraultem. Roli Harpagona si přál zahrát už od 50. let, na nabídky ale dlouho odmítal kývnout. Natáčelo se chronologicky podle děje — ve studiích v Billancourtu, ve středověkém Senlis a nakonec i v tuniské Sahaře. Film přispěl k tomu, že Louis de Funès dostal čestného Césara za celoživotní dílo. S 2,4 miliony diváků šlo na jeho poměry o mírný úspěch, přesto se stal jednou z nejčastěji promítaných filmových adaptací Molièra na francouzských školách.",
    funFact:
      "Závěrečný záběr filmu ukazuje Harpagona, jak táhne svou kazetu na řetězu pouští Sahara, stále pronásledovaného stejnou žebračkou v černém, která ho pronásledovala už v úvodní scéně u kostela — vizuální vtip, který uzavírá celý příběh.",
    cast: [
      { name: "Louis de Funès", role: "Harpagon" },
      { name: "Frank David", role: "Cléante, jeho syn" },
      { name: "Hervé Bellon", role: "Valère, správce domu" },
      { name: "Michel Galabru", role: "mistr Jakub, kuchař a kočí" },
      { name: "Claire Dupray", role: "Élise, Harpagonova dcera" },
      { name: "Claude Gensacová", role: "Frosina, dohazovačka" },
      { name: "Anne Caudry", role: "Marianne" },
      { name: "Bernard Ménez", role: "La Flèche, sluha" },
      { name: "Guy Grosso", role: "Brindavoine, sluha" },
      { name: "Michel Modo", role: "La Merluche, sluha" },
    ],
  },
  {
    slug: "zelnacka",
    title: "Zelňačka",
    originalTitle: "La Soupe aux choux",
    year: 1981,
    director: "Jean Girault",
    writers: "Jean Halain, Louis de Funès (podle románu Reného Falleta)",
    summary:
      "Dva staří kamarádi, švec Glaude a hrbatý studnař Bombé, dožívají v zapadlé vesničce, když je jedné noci navštíví mimozemšťan z planety Oxo, kterého nadchne Glaudeova zelňačka. Přátelství s vetřelcem přinese Glaudeovi zpátky jeho zesnulou ženu, vzkříšenou a mladou jako za mlada, a nakonec i nabídku opustit umírající Zemi pro dvě stě dalších let života mezi hvězdami.",
    production:
      "Adaptace tehdy čerstvě vydaného bestselleru Reného Falleta, do kterého se Louis de Funès okamžitě zamiloval a sám ho adaptoval s Jeanem Halainem. Šlo o jeho předposlední film. Uvedl do širšího povědomí diváků herce Jacquesa Villereta v roli mimozemšťana „Denrée“. Ve srovnání s de Funèsovými obvyklými čísly šlo jen o mírný úspěch a kritika ho tehdy vesměs odbyla jako brak, přesto se z filmu postupně stal televizní kultovní klasik.",
    funFact:
      "Režisér Yves Robert Louise de Funèse varoval, že scénu ze soutěže v prdění pod hvězdami, jak ji popisuje Falletova kniha, nelze natočit — tvůrci ji přesto ve filmu ponechali, blesky z nebe včetně.",
    cast: [
      { name: "Louis de Funès", role: "Claude Ratinier, „Glaude“" },
      { name: "Jean Carmet", role: "Francis Chérasse, „Bombé“" },
      { name: "Jacques Villeret", role: "mimozemšťan „Denrée“ z planety Oxo" },
      { name: "Christine Dejoux", role: "Francine, Glaudeova zesnulá a vzkříšená žena" },
      { name: "Claude Gensacová", role: "Amélie Poulangeardová, vesnická „bláznivka“" },
      { name: "Henri Génès", role: "strážmistr" },
      { name: "Marco Perrin", role: "starosta-developer" },
    ],
  },
  {
    slug: "blaznivi-bazanti",
    title: "Blázniví bažanti",
    originalTitle: "Les Bidasses en folie",
    year: 1971,
    director: "Claude Zidi",
    writers: "Claude Zidi, Michel Ardan",
    summary:
      "Gérard, Phil, Jean-Guy, Jean a Luis, pětice nerozlučných kamarádů, sní o založení popové kapely a právě vyhráli krajskou soutěž — jenže vzápětí je čeká odvod na vojnu. V kasárnách jim vládne přísný seržant Bellec, ale mírumilovní 'flower power' kamarádi na disciplínu kašlou a řetězí jednu trapasovou hlášku za druhou.",
    production:
      "Natáčelo se v Calvadosu — v Caen, Falaise a Cabourgu. Šlo o celovečerní režijní debut Clauda Zidiho a stal se obrovským hitem: přes 7,4 milionu diváků, první místo francouzského žebříčku roku 1971. Úspěch filmu umožnil producentovi Christianu Fechnerovi založit vlastní produkční společnost a odstartovat kariéru, která o pár let později stála i za pozdními filmy Louise de Funèse. O tři roky později vznikl volný pokračování Blázniví bažanti jdou do boje — jediný, kdo si roli nezopakoval, byl Luis Rego, který mezitím kapelu opustil.",
    funFact:
      "Producent Christian Fechner si ve filmu zahrál malou roli hosta restaurace, kterému Phil naservíruje namodralý, téměř syrový steak — scéna, která dala vzniknout jedné z nejcitovanějších hlášek celého filmu.",
    cast: [
      { name: "Gérard Rinaldi", role: "Gérard" },
      { name: "Gérard Filippelli", role: "Phil" },
      { name: "Jean Sarrus", role: "Jean" },
      { name: "Luis Rego", role: "Luis" },
      { name: "Jean-Guy Fechner", role: "Jean-Guy" },
      { name: "Marion Game", role: "Crème" },
      { name: "Jacques Seiler", role: "seržant Bellec" },
      { name: "Jacques Dufilho", role: "plukovník" },
      { name: "Aimable", role: "Philův otec" },
    ],
  },
  {
    slug: "blazni-ze-stadionu",
    title: "Blázni ze stadiónu",
    originalTitle: "Les Fous du stade",
    year: 1972,
    director: "Claude Zidi",
    writers: "Claude Zidi, Jacques Fansten",
    summary:
      "Charloti tráví prázdniny v provensálské vesničce, kde do všeho zapojí sousedy i dobytek — dokud se po zranění synka místního obchodníka nepustí na pomoc rodině. Gérard je zamilovaný do obchodníkovy dcery Délice, ta ale propadne kouzlu svalnatého sportovce, a tak se parta vydá za ní do města, rovnou na fiktivní olympiádu — kde nejdřív ukradnou kola francouzským cyklistům, omylem vyhrají závod, nechají se najmout do národního týmu a začnou sbírat zlaté medaile.",
    production:
      "Natáčelo se v Provenci — v Gravesonu a Avignonu. Ve Francii film vidělo přes 5,7 milionu diváků, ale skutečným fenoménem se stal v Indii, kde má podle vzpomínek Jeana-Guy Fechnera přes 50 milionů diváků a dodnes tam prý drží rekord nejnavštěvovanějšího filmu vůbec, před Titanikem. Produkoval Christian Fechner.",
    funFact:
      "Podle Jeana-Guy Fechnera je film v Indii dodnes nejnavštěvovanějším filmem v historii tamních kin — před Titanikem.",
    cast: [
      { name: "Gérard Rinaldi", role: "Gérard" },
      { name: "Gérard Filippelli", role: "Phil" },
      { name: "Jean Sarrus", role: "Jean" },
      { name: "Jean-Guy Fechner", role: "Jean-Guy" },
      { name: "Paul Préboist", role: "Jules Lafougasse, obchodník" },
      { name: "Martine Kelly", role: "Délice, obchodníkova dcera" },
      { name: "Gérard Croce", role: "Lucien Lafougasse" },
      { name: "Jacques Seiler", role: "trenér národního týmu" },
      { name: "Guy Lux", role: "sám sebe, sportovní komentátor" },
    ],
  },
  {
    slug: "velky-bazar",
    title: "Velký bazar",
    originalTitle: "Le Grand Bazar",
    year: 1973,
    director: "Claude Zidi",
    writers: "Claude Zidi, Georges Beller, Michel Fabre",
    summary:
      "Jean, Phil, Gérard a Jean-Guy, čtyři kamarádi z jednoho panelového sídliště, raději popíjejí v bistru starého Émila než chodí do práce v továrně na sekačky — a rychle o tu práci přijdou. Émile jim sežene drobné brigády, ale když jeho krámek ohrozí otevření velkého supermarketu Euromarché naproti, čtveřice udělá vše pro to, aby starého přítele zachránila.",
    production:
      "Po boku Charlotů si zahráli Michel Galabru a Michel Serrault. Natáčelo se v Meudon-la-Forêt a Clamartu (Émilův krámek) a v Athis-Mons (supermarket). Film je hořkosladkým komentářem k zániku malých obchodů před náporem supermarketů na přelomu 60. a 70. let. Ve Francii ho vidělo přes 3,9 milionu diváků, čtvrté místo žebříčku roku. Plánované pokračování z roku 2013, které mělo spojit všechny čtyři Charloty i Luise Rega a do role Émila se měl vrátit Michel Galabru, definitivně padlo po smrti Gérarda Rinaldiho.",
    funFact:
      "V jedné z drobných rolí návštěvníka bytu na prohlídce se mihne mladý Coluche — jedna z jeho úplně prvních filmových rolí.",
    cast: [
      { name: "Gérard Rinaldi", role: "Gérard" },
      { name: "Gérard Filippelli", role: "Phil" },
      { name: "Jean Sarrus", role: "Jean" },
      { name: "Jean-Guy Fechner", role: "Jean-Guy" },
      { name: "Michel Galabru", role: "Émile, majitel krámku" },
      { name: "Michel Serrault", role: "Félix Boucan, ředitel Euromarché" },
      { name: "Roger Carel", role: "dražitel" },
      { name: "Jacques Seiler", role: "Jacques, šéf ostrahy supermarketu" },
      { name: "Coluche", role: "muž na prohlídce bytu" },
      { name: "Florence Blot", role: "paní Bonizeová" },
    ],
  },
  {
    slug: "bazanti-kontra-dracula",
    title: "Bažanti kontra Dracula",
    originalTitle: "Les Charlots contre Dracula",
    year: 1980,
    director: "Jean-Pierre Desagnat, Jean-Pierre Vergne",
    writers: "Jean-Pierre Desagnat, Les Charlots, Olivier Mergault",
    summary:
      "Syn hraběte Draculy potřebuje k získání upírí moci vypít kouzelný lektvar, kterého se ale smí dotknout jen žena vzhledem totožná s jeho zesnulou matkou — každý jiný zkamení. O desítky let později najme detektiva, který mu najde dvojnici v Paříži: Ariane, snoubenku Phila. Detektiv ji unese do Rumunska a tři zbylí Charloti se vydají za hraběcím zámkem, aby ji zachránili.",
    production:
      "Ze čtyř původních Charlotů zbyli v obsazení jen tři — Rinaldi, Filippelli a Sarrus; Jean-Guy Fechner skupinu opustil už v roce 1976. Po boku Charlotů se objevil mladý Gérard Jugnot v roli neohrabaného detektiva, krátce předtím, než se sám stal jednou z největších hvězd francouzské komedie. Část se natáčela na viaduktu Fades v Puy-de-Dôme.",
    funFact:
      "V hraběcí kryptě jsou mezi rakvemi i dvě podepsané jmény Christophera Leeho a Bély Lugosiho — dvou nejslavnějších filmových představitelů Drákuly, jako mrknutí na fanoušky žánru.",
    cast: [
      { name: "Gérard Filippelli", role: "Phil" },
      { name: "Gérard Rinaldi", role: "Gérard" },
      { name: "Jean Sarrus", role: "Jean" },
      { name: "Andréas Voutsinás", role: "hrabě Dracula" },
      { name: "Gérard Jugnot", role: "detektiv Gaston Lepope" },
      { name: "Amélie Prévost", role: "Ariane" },
      { name: "Vincent Martin", role: "Igor" },
      { name: "Dora Doll", role: "komisařka Gluck" },
    ],
  },
  {
    slug: "la-grande-java",
    title: "La Grande Java",
    originalTitle: "La Grande Java",
    year: 1970,
    director: "Philippe Clair",
    writers: "Philippe Clair, Michel Ardan, Claude Reims (pseudonym Clauda Zidiho)",
    summary:
      "Pětice ragbistů hledá svého trenéra Augusta Kouglofa, který jim dluží dvacet milionů a zmizel — najdou ho na venkově pod novým jménem M. Colombani, jak se pomocí mafiánských praktik snaží dostat na starostenský post. Philippot, zamilovaný do Colombaniho dcery France, se rozhodne ho neudat policii, ale radši se spojit s jeho protikandidátem.",
    production:
      "Jde o úplně první film Charlotů, kterým se z hudební skupiny stali filmoví komici. Kritika byla vesměs záporná, přesto se film stal solidním hitem (přes 3,3 milionu diváků). Na place se Charloti spřátelili s kameramanem a spoluscenáristou, který se podepsal pod pseudonymem Claude Reims — ve skutečnosti šlo o Clauda Zidiho, se kterým si pak natočili hned svůj druhý film, Blázniví bažanti, místo nabízeného pokračování od režiséra Philippa Claira. Natáčelo se převážně kolem vesnice Velaux v Bouches-du-Rhône. Kvůli sporům o práva zůstal film dlouho nedostupný, na Blu-ray vyšel až v roce 2024.",
    funFact:
      "Padoušskou roli bývalého trenéra hrál slavný komik Francis Blanche; jeho menší roli konkurenta si zahrál Fransined, bratr herce Fernandela — ten mu roli pomohl sehnat díky vlastní spolupráci s režisérem Philippem Clairem.",
    cast: [
      { name: "Francis Blanche", role: "Auguste Kougloff / Augustin Colombani" },
      { name: "Gérard Rinaldi", role: "Philippot" },
      { name: "Gérard Filippelli", role: "Phil" },
      { name: "Jean Sarrus", role: "Jean" },
      { name: "Luis Rego", role: "Luis" },
      { name: "Jean-Guy Fechner", role: "Jean-Guy" },
      { name: "Corinne Le Poulain", role: "France, Colombaniho dcera" },
      { name: "Francis Contandin", role: "Fernand Devot" },
    ],
  },
  {
    slug: "bazanti-jedou-do-spanelska",
    title: "Bažanti jedou do Španělska",
    originalTitle: "Les Charlots font l'Espagne",
    year: 1972,
    director: "Jean Girault",
    writers: "Jacques Vilfrid",
    summary:
      "Gérard, Phil, Jean a Jean-Guy pracují v pařížském dopravním podniku RATP a chystají se na dovolenou do Španělska — jenže majitel cestovky zmizí i s penězi a žádné pokoje jim vlastně nerezervoval. Aby si na dovolenou vydělali, střídají jednu brigádu za druhou, ze všech je hned vyhodí, než se nakonec nechají najmout jako posádka na jachtě.",
    production:
      "Natáčelo se v roce 1972 v Marbelle a v Paříži. Jde o jeden z mála filmů Charlotů, ve kterém se neobjeví Jacques Seiler. Řada nefrankofonních herců musela být v postprodukci nadabovaná.",
    funFact:
      "Scéna s býčí zápasem byla natočená se skutečným býkem — jen v nejriskantnějších záběrech, včetně finálního bodnutí mečem, ho nahradila falešná hlava.",
    cast: [
      { name: "Gérard Rinaldi", role: "Gérard" },
      { name: "Gérard Filippelli", role: "Phil" },
      { name: "Jean Sarrus", role: "Jean" },
      { name: "Jean-Guy Fechner", role: "Jean-Guy" },
      { name: "Jacques Legras", role: "řidič autobusu" },
      { name: "Yves Barsacq", role: "Robert Leplat" },
      { name: "Gérard Croce", role: "Bouboule" },
      { name: "Gérard Tichy", role: "majitel jachty" },
      { name: "Katia Tchenko", role: "Colette Leplatová" },
    ],
  },
  {
    slug: "ctyri-sluhove-a-ctyri-musketyri",
    title: "Čtyři sluhové a čtyři mušketýři",
    originalTitle: "Les Quatre Charlots mousquetaires",
    year: 1974,
    director: "André Hunebelle",
    writers: "Jean Halain (podle románu Alexandra Dumase)",
    summary:
      "Bláznivě zparodovaní Tři mušketýři — Charloti hrají neohrabané sluhy mušketýrů, kteří se snaží zhatit intriky kardinála Richelieua, jeho pravé ruky otce Josefa a Milady de Winter, a získat zpátky královniny diamantové přívěsky, které nerozvážně věnovala vévodovi z Buckinghamu.",
    production:
      "Natáčelo se na zámcích Culan a Meillant. Ve Francii vidělo film přes 2,1 milionu diváků, ale skutečný fenomén z něj udělal Sovětský svaz — 56,6 milionu diváků, v té době nejúspěšnější zahraniční film v sovětské kinodistribuci vůbec. O měsíc později ho doplnilo přímé pokračování Čtyři sluhové a kardinál.",
    funFact:
      "Je to jeden z mála filmů Charlotů, kde nehrají postavy nesoucí jejich vlastní křestní jména — místo toho ztvárňují smyšlené sluhy mušketýrů, jejichž legračně vymyšlená celá jména (Planchet de la Rinaldière a podobně) diváci uslyší až v pokračování.",
    cast: [
      { name: "Gérard Rinaldi", role: "Planchet de la Rinaldière, sluha d'Artagnana / vypravěč" },
      { name: "Gérard Filippelli", role: "Mousqueton de la Moustiquière, sluha Porthose" },
      { name: "Jean Sarrus", role: "Bazin de la Bassinoire, sluha Aramise" },
      { name: "Jean-Guy Fechner", role: "Grimaud de la Fechnière, sluha Athose" },
      { name: "Josephine Chaplin", role: "Constance Bonacieux" },
      { name: "Daniel Ceccaldi", role: "král Ludvík XIII." },
      { name: "Paul Préboist", role: "otec Josef" },
      { name: "Karin Petersen", role: "Milady de Winter" },
      { name: "Catherine Jourdan", role: "královna Anna Rakouská" },
      { name: "Bernard Haller", role: "kardinál Richelieu / vévoda z Buckinghamu" },
      { name: "Jacques Seiler", role: "hrabě z Rochefortu" },
    ],
  },
  {
    slug: "ctyri-sluhove-a-kardinal",
    title: "Čtyři sluhové a kardinál",
    originalTitle: "À nous quatre, Cardinal !",
    year: 1974,
    director: "André Hunebelle",
    writers: "Jean Halain (podle románu Alexandra Dumase)",
    summary:
      "Přímé pokračování — královna tajně věnovala své diamantové přívěsky vévodovi z Buckinghamu a potřebuje je zpátky, než je bude muset předvést na veřejnosti. Pošle si pro ně mušketýry do Anglie, ale Richelieuova Milady de Winter je všechny čtyři cestou uspí — dokončit misi tak musí jejich sluhové, přestrojení za své pány.",
    production:
      "Natáčelo se jen měsíc po prvním díle, mimo jiné v Argentat-sur-Dordogne, které posloužilo jako Calais. Do kin vstoupil pouhý měsíc po Čtyřech sluhech a čtyřech mušketýrech.",
    funFact:
      "Právě v tomto díle, ve scéně v londýnském Toweru, anglický soudce nahlas přečte legračně vymyšlená celá jména sluhů z prvního filmu — Planchet de la Rinaldière a spol.",
    cast: [
      { name: "Gérard Rinaldi", role: "Planchet de la Rinaldière" },
      { name: "Gérard Filippelli", role: "Mousqueton de la Moustiquière" },
      { name: "Jean Sarrus", role: "Bazin de la Bassinoire" },
      { name: "Jean-Guy Fechner", role: "Grimaud de la Fechnière" },
      { name: "Daniel Ceccaldi", role: "král Ludvík XIII." },
      { name: "Josephine Chaplin", role: "Constance Bonacieux" },
      { name: "Paul Préboist", role: "otec Josef" },
      { name: "Bernard Haller", role: "kardinál Richelieu / vévoda z Buckinghamu" },
      { name: "Catherine Jourdan", role: "královna Anna Rakouská" },
      { name: "Karin Petersen", role: "Milady de Winter" },
      { name: "Jacques Seiler", role: "hrabě z Rochefortu" },
    ],
  },
  {
    slug: "bazanti-jdou-do-boje",
    title: "Bažanti jdou do boje",
    originalTitle: "Les bidasses s'en vont en guerre",
    year: 1974,
    director: "Claude Zidi",
    writers: "Claude Zidi, Jean Bouchaud, Jean-Paul Farré",
    summary:
      "Přímé pokračování Bláznivých bažantů — Gérard, Jean, Phil a Jean-Guy pořád slouží pod přísným seržantem Bellecem. Při pokusu ohřát plukovníkovi bazén omylem zaplaví jeho sklep topným olejem, uprchnou z kasáren a schovají se na statku, který chce armáda zabrat — a nakonec pomůžou jeho obyvatelům se ubránit.",
    production:
      "Natáčelo se v Côte-d'Or kolem Dijonu. Luis Rego, který skupinu opustil po prvním díle, se nevrátil. Jean Sarrus si krátce před natáčením zlomil při nehodě na motorce nohu, a tak ho ve scénách s pohybem zaskakoval dabl. Scéna, kde kamarádi hodí Jeana-Guy do kanálu, je přímou citací filmu Blázni (Les Valseuses), který měl premiéru jen devět měsíců předtím.",
    funFact:
      "Topný olej zaplavující plukovníkův sklep byl ve skutečnosti obarvená voda s instantní kávou a ricinovým olejem — z bezpečnostních důvodů se skutečný olej nepoužil.",
    cast: [
      { name: "Gérard Rinaldi", role: "Gérard" },
      { name: "Gérard Filippelli", role: "Phil" },
      { name: "Jean Sarrus", role: "Jean" },
      { name: "Jean-Guy Fechner", role: "Jean-Guy" },
      { name: "Jacques Seiler", role: "seržant Bellec" },
      { name: "Paolo Stoppa", role: "plukovník de Bouise" },
      { name: "Marisa Merlini", role: "Paulette Brugnonová, sedlačka" },
      { name: "Myriam Boyer", role: "Philippine Brugnonová" },
    ],
  },
  {
    slug: "polibky-z-hongkongu",
    title: "Polibky z Hongkongu",
    originalTitle: "Bons Baisers de Hong Kong",
    year: 1975,
    director: "Yvan Chiffre",
    writers: "Yvan Chiffre, Christian Fechner",
    summary:
      "Parodie na Jamese Bonda — excentrický americký milionář unese královnu Alžbětu II. a francouzská tajná služba na případ nasadí své čtyři nejnešikovnější agenty, Charloty. Zatímco doma královnu nahradí komorná coby dvojnice, pátrání je zavede až do Hongkongu.",
    production:
      "Ve vedlejších rolích si zahráli skuteční bondovští herci Bernard Lee (M) a Lois Maxwellová (slečna Moneypennyová) ve svých ikonických rolích, po jejich boku hollywoodský veterán Mickey Rooney jako padouch — návrat do mezinárodně významné produkce po delší pauze v jeho kariéře. Natáčelo se v Paříži, Londýně, Madridu a Hongkongu. Šlo o poslední film Jeana-Guy Fechnera po boku Charlotů — po natáčení se rozešel se svým bratrem a producentem Christianem Fechnerem.",
    funFact:
      "Čínské studio, které pro film postavilo kulisy, se mělo po natáčení smluvně zavázat je odkoupit zpět — nakonec od dohody odstoupilo, a tak producent Fechner nechal kaskadéry všechny kulisy rovnou zbourat.",
    cast: [
      { name: "Gérard Rinaldi", role: "Gérard, agent 023" },
      { name: "Gérard Filippelli", role: "Phil, agent 024" },
      { name: "Jean Sarrus", role: "Jean, agent 025" },
      { name: "Jean-Guy Fechner", role: "Jean-Guy, agent 022" },
      { name: "Mickey Rooney", role: "Marty" },
      { name: "David Tomlinson", role: "Sir John Mac Gregor" },
      { name: "Bernard Lee", role: "M, šéf MI6" },
      { name: "Lois Maxwell", role: "slečna Moneypennyová" },
      { name: "Huguette Funfrock", role: "paní Loubetová / královna Alžběta II." },
    ],
  },
  {
    slug: "bazanti-a-cizinecka-legie",
    title: "Bažanti a cizinecká legie",
    originalTitle: "Et vive la liberté !",
    year: 1978,
    director: "Serge Korber",
    writers: "Jacques Lanzmann, Albert Kantof, Serge Korber (na námět Gérarda Ouryho)",
    summary:
      "Tři hrdinové cizinecké legie, Phil, Jeannot a Gérard, jsou za odměnu vysláni na tajnou misi do Alžírska, padnou do zajetí a uprchnou. O tři roky později, už po demobilizaci, je najme starosta malého auvergneského města, aby ubránili pozemek, na který si dělá nárok legie — a obrátí se proti svým bývalým velitelům.",
    production:
      "Původní námět pochází od režiséra Gérarda Ouryho, který scénář napsal po setkání s Charloty v roce 1976 — nakonec se ale natáčelo podle jiného scénáře od Jacquesa Lanzmanna a Alberta Kantofa. Byl to první film Charlotů bez Jeana-Guy Fechnera, který skupinu opustil po Polibcích z Hongkongu. Natáčelo se v marockém poušti a v Auvergni. Ve Francii ho vidělo přes 1,27 milionu diváků.",
    funFact:
      "Původní scénář k filmu napsal Gérard Oury — režisér, kterého dnes nejvíc známe díky jeho velkým hitům s Louisem de Funèsem — jeho verze se ale nakonec nenatočila a nahradil ji scénář jiných autorů.",
    cast: [
      { name: "Gérard Rinaldi", role: "Gérard" },
      { name: "Gérard Filippelli", role: "Phil" },
      { name: "Jean Sarrus", role: "Jeannot" },
      { name: "Claude Piéplu", role: "velitel Émile Lardenois" },
      { name: "Georges Géret", role: "seržant" },
      { name: "Pierre Maguelon", role: "poručík" },
      { name: "Philippe Brizard", role: "Léon, zajatec Fellaghů" },
    ],
  },
  {
    slug: "les-charlots-en-delire",
    title: "Les Charlots en délire",
    originalTitle: "Les Charlots en délire",
    year: 1979,
    director: "Alain Basnier",
    writers: "Pierre Uytterhoeven, Alain Basnier",
    summary:
      "Gérard, ředitel zkrachovalé továrny, propustí i své kamarády Jeana a Phila. Trojice zkouší přežít na podivných brigádách — jako fakír, cimbálista a taxikář bez řidičáku — než jim štěstí přeje v kasinu. Radost je krátká: bývalý novinář a teď gangster je oloupí a navíc je vylíčí jako nebezpečné únosce, takže je pronásleduje policie i podsvětí zároveň.",
    production:
      "Nezvykle pro film Charlotů hudbu nesložila sama skupina, ale zpěvák Éric Charden. Ve více rolích se objevuje Henri Guybet.",
    funFact:
      "Celý čím dál absurdnější únosový zápletka se na konci filmu ukáže jako pouhý sen.",
    cast: [
      { name: "Gérard Rinaldi", role: "Gérard" },
      { name: "Gérard Filippelli", role: "Phil" },
      { name: "Jean Sarrus", role: "Jean" },
      { name: "Charles Gérard", role: "Charles Roger Chabot" },
      { name: "Henri Guybet", role: "zaměstnanec sběrny / farář / advokát" },
      { name: "Jacques Ciron", role: "Gérardův otec, generální ředitel" },
    ],
  },
  {
    slug: "navrat-bazantu",
    title: "Návrat bažantů",
    originalTitle: "Le Retour des bidasses en folie",
    year: 1983,
    director: "Michel Vocoret",
    writers: "Michel Vocoret",
    summary:
      "Křížení pokračování a prequelu — děti tří válečných veteránů poslouchají s otevřenou pusou vyprávění o žertech a dobrodružstvích svých otců za druhé světové války, včetně pověsti o pokladu ukrytém v německé Kommandantuře.",
    production:
      "Vrátili se Gérard, Phil a Jean, po jejich boku i Luis Rego v roli seržanta. Natáčelo se v Belloy-en-France, kde vyzdobení radnice nacistickými vlajkami pro potřeby filmu vyvolalo skutečný protest místních válečných veteránů — zablokovali natáčení, dokud je štáb a herci neuklidnili.",
    funFact:
      "Filmová hláška „Mais c'est Marcel!“, kterou pronese Jean Sarrus v německé uniformě, když mezi skutečnými německými vojáky pozná starého kamaráda, a kterou na místě vydává za bavorskou nadávku, se ve filmu stala running gagem, který si osvojí i sami „Němci“.",
    cast: [
      { name: "Gérard Rinaldi", role: "Alfred / Gérard" },
      { name: "Gérard Filippelli", role: "Marcel / Phil" },
      { name: "Jean Sarrus", role: "Emile / Jean" },
      { name: "Luis Rego", role: "seržant Lucien" },
      { name: "Roger Carel", role: "plukovník von Berg" },
      { name: "Jacques Jouanneau", role: "generál de Lastra" },
      { name: "Paulette Dubost", role: "matka představená" },
      { name: "Franck-Olivier Bonnet", role: "setník Cossade" },
    ],
  },
  {
    slug: "charlots-connection",
    title: "Nebezpečné známosti",
    originalTitle: "Charlots Connection",
    year: 1984,
    director: "Jean Couturier",
    writers: "René Havard, Richard Balducci",
    summary:
      "Tři nezaměstnaní kamarádi se proti své vůli stanou pomahači vyděrače a bez vlastního přičinění se namočí do gangsterské války.",
    production: "Šlo o poslední film, ve kterém si po boku Charlotů zahrál Gérard Rinaldi.",
    funFact: "V malé roli faráře se ve filmu mihne zpěvák Gérard Blanchard.",
    cast: [
      { name: "Gérard Rinaldi", role: "Gérard" },
      { name: "Gérard Filippelli", role: "Phil" },
      { name: "Jean Sarrus", role: "Jean" },
      { name: "Alexandra Stewart", role: "Liane" },
      { name: "Henri Garcin", role: "pan Marcaud" },
      { name: "Franck-Olivier Bonnet", role: "Dominique" },
    ],
  },
  {
    slug: "le-retour-des-charlots",
    title: "Le Retour des Charlots",
    originalTitle: "Le Retour des Charlots",
    year: 1992,
    director: "Jean Sarrus",
    writers: "Jean Sarrus",
    summary:
      "Antonio předstírá ztrátu paměti, aby unikl hněvu manželky Amalie, která ho přistihla s milenkou. Amalia požádá Charloty, aby udělali cokoliv, aby se mu paměť vrátila.",
    production:
      "Absence Gérarda Rinaldiho, charismatického lídra skupiny, byla citelná — přes svého právníka oznámil, že se na projektu nebude podílet. Jean Sarrus se pro tento film sám postavil za kameru jako režisér a později přiznal, že šlo o propadák jeho kariéry. Rozpočet byl nízký a sestava Charlotů neúplná, i přes návrat Luise Rega.",
    funFact:
      "Podle pozdějšího přiznání Jeana Sarruse byl na premiérové projekci filmu jediným divákem v sále Richard Bonnot — hráč, který v kapele nahradil Gérarda Rinaldiho.",
    cast: [
      { name: "Jean Sarrus", role: "Jean" },
      { name: "Gérard Filippelli", role: "Phil" },
      { name: "Richard Bonnot", role: "Richard" },
      { name: "Luis Rego", role: "Antonio Pereira" },
      { name: "Guy Montagné", role: "strážmistr Caussade" },
      { name: "Jezabelle Amato", role: "Amalia, Antoniova žena" },
    ],
  },
  {
    slug: "kopyto",
    title: "Kopyto",
    originalTitle: "La Chèvre",
    year: 1981,
    director: "Francis Veber",
    writers: "Francis Veber",
    summary:
      "Nešikovný a permanentně smolařský účetní François Perrin dostane bizarní úkol: pomoct najít dceru svého šéfa, unesenou v Mexiku. Zkušený, cynický detektiv Campana ho k pátrání přibere jen kvůli jeho pověstné smůle — počítá s tím, že se Perrinovi budou dít nehody přesně na místech, kudy prošla i stejně nešťastná hledaná dívka.",
    production:
      "Šlo teprve o druhý celovečerní film Francise Vebera jako režiséra po Hračce (1976) a o první ze tří filmů, ve kterých spojil Pierra Richarda s Gérardem Depardieu. Role měly původně připadnout Linu Venturovi a Jacquesi Villeretovi, spolupráce ale padla kvůli sporu o honorář a Venturově neochotě hrát po boku Villereta. Natáčelo se od června do září 1981, mimo jiné v Mexiku.",
    funFact:
      "Pierra Richarda během natáčení v mexické džungli bolestivě bodla vosa, a Depardieu měl s alkoholem na place takové problémy, že mu Veber musel dát ultimátum. Film se stal obrovským hitem i v Sovětském svazu, kde ho vidělo přes 35 milionů diváků.",
    cast: [
      { name: "Pierre Richard", role: "François Perrin" },
      { name: "Gérard Depardieu", role: "inspektor Campana" },
      { name: "Corynne Charby", role: "Marie Bens" },
      { name: "Michel Robin", role: "pan Bens" },
    ],
  },
  {
    slug: "otec-a-otec",
    title: "Otec & otec",
    originalTitle: "Les Compères",
    year: 1983,
    director: "Francis Veber",
    writers: "Francis Veber",
    summary:
      "Když Christine zjistí, že jí z domova utekl syn Tristan, namluví postupně dvěma bývalým milencům, novináři Jeanu Lucasovi a depresivnímu neurotikovi Françoisi Pignonovi, že by právě on mohl být chlapcův skutečný otec. Dvojice naprosto odlišných mužů se tak nezávisle na sobě pustí do pátrání a nakonec zjistí, že jejich cesty vedou ke stejnému cíli.",
    production:
      "Druhá spolupráce Francise Vebera s dvojicí Pierre Richard a Gérard Depardieu, natáčená od dubna do července 1983. Postavy Françoise Pignona a Jeana Lucase se o tři roky později vrátily ve filmu Uprchlíci.",
    funFact:
      "Za roli Jeana Lucase dostal Gérard Depardieu nominaci na Césara pro nejlepšího herce a Veber na Césara za nejlepší původní scénář. Televizní premiéra filmu ve Francii v dubnu 1992 nasbírala přes 13 milionů diváků.",
    cast: [
      { name: "Pierre Richard", role: "François Pignon" },
      { name: "Gérard Depardieu", role: "Jean Lucas" },
      { name: "Anny Duperey", role: "Christine" },
      { name: "Michel Aumont", role: "inspektor Rochas" },
      { name: "Stéphane Bierry", role: "Tristan" },
    ],
  },
  {
    slug: "uprchlici",
    title: "Uprchlíci",
    originalTitle: "Les Fugitifs",
    year: 1986,
    director: "Francis Veber",
    writers: "Francis Veber",
    summary:
      "Bývalý vězeň Jean Lucas si po pěti letech za mřížemi jen přeje žít v klidu, jenže hned první den na svobodě ho jako rukojmí unese nemotorný amatérský bankovní lupič François Pignon, zoufalý nezaměstnaný otec, který potřebuje peníze na léčbu své němé dcery. Dvojice na útěku před policií si i přes počáteční nedůvěru postupně vytvoří pouto a nakonec společně zamíří za novým životem do Itálie.",
    production:
      "Třetí a poslední film, ve kterém Francis Veber spojil Pierra Richarda s Gérardem Depardieu — tentokrát herci figurovali i mezi producenty. Natáčelo se v Bordeaux, Nîmes a v okolí Paříže. Pro Pierra Richarda šlo o sedmý a poslední případ, kdy si zahrál Veberovu opakující se postavu Françoise Pignona/Perrina.",
    funFact:
      "V malé roli veterináře v důchodu si zahrál Jean Carmet, ve vedlejší roli lékaře se neuvedený objevil i Michel Blanc.",
    cast: [
      { name: "Gérard Depardieu", role: "Jean Lucas" },
      { name: "Pierre Richard", role: "François Pignon" },
      { name: "Anaïs Bret", role: "Jeanne" },
      { name: "Jean Carmet", role: "doktor Martin, veterinář v důchodu" },
      { name: "Maurice Barrier", role: "komisař Duroc" },
    ],
  },
  {
    slug: "jachyme-hod-ho-do-stroje",
    title: "Jáchyme, hoď ho do stroje!",
    originalTitle: "Jáchyme, hoď ho do stroje!",
    year: 1974,
    director: "Oldřich Lipský",
    writers: "Ladislav Smoljak, Zdeněk Svěrák, Oldřich Lipský",
    summary:
      "Roztržitý mladý automechanik František Koudelka se před odjezdem za prací do Prahy nechá zlákat k sepsání takzvaného kondiciogramu — počítačové předpovědi dobrých a zlých dnů jeho života. V pražském autoservisu se pak touto tabulkou řídí tak důsledně, že z něj dělá terč posměchu i obdivu zároveň, zatímco kolem něj vládne atmosféra podniku, kde přijímání úplatků vede rovnou k psychiatrické léčebně.",
    production:
      "Šlo o první ze slavné řady komedií, kterou pro režiséra Oldřicha Lipského napsala dvojice Zdeněk Svěrák a Ladislav Smoljak — oba scenáristé si ve filmu zahráli i výrazné vedlejší role podnikového psychologa a vedoucího servisu.",
    funFact:
      "Titulní postava programátora Jáchyma se na plátně objeví jen na pár vteřin v úvodní scéně, kdy do počítače vhazuje děrný štítek s Koudelkovými údaji — přesto se jeho jméno stalo názvem celého filmu i okřídleným rčením.",
    cast: [
      { name: "Luděk Sobota", role: "František Koudelka" },
      { name: "Václav Lohniský", role: "docent Chocholoušek, psychiatr" },
      { name: "Ladislav Smoljak", role: "Karfík, vedoucí autoservisu" },
      { name: "Zdeněk Svěrák", role: "Klásek, podnikový psycholog" },
    ],
  },
  {
    slug: "marecku-podejte-mi-pero",
    title: "Marečku, podejte mi pero!",
    originalTitle: "Marečku, podejte mi pero!",
    year: 1976,
    director: "Oldřich Lipský",
    writers: "Ladislav Smoljak, Zdeněk Svěrák",
    summary:
      "Mistr v továrně na zemědělské stroje Jiří Kroupa musí kvůli plánované modernizaci závodu po letech znovu usednout do lavic večerní průmyslovky a doplnit si maturitu — ve stejné třídě, kde náhodou sedává i jeho vlastní syn. Kroupa se tak musí vyrovnat s tím, že je ve škole horší než jeho dítě, a obstát před podivínskými profesory i mezi svéráznými spolužáky, včetně úlisného kolegy Hujera, který mu dělá zálusk na místo.",
    production:
      "Druhá spolupráce Oldřicha Lipského se scenáristickou dvojicí Zdeněk Svěrák a Ladislav Smoljak, navazující na úspěch Jáchyme, hoď ho do stroje!. Přezdívka postavy Ladislava Smoljaka, Tuček zvaný Mareček, dala filmu jeho ikonický název.",
    funFact:
      "Hláška „Marečku, podejte mi pero!“, kterou profesor pronáší k postavě přezdívané Mareček, zlidověla natolik, že se dodnes používá jako okřídlené rčení nezávisle na filmu.",
    cast: [
      { name: "Jiří Sovák", role: "mistr Jiří Kroupa st." },
      { name: "Václav Lohniský", role: "Viktor Hujer, výstupní kontrolor" },
      { name: "Iva Janžurová", role: "Eva Týfová, spolužačka" },
      { name: "Josef Kemr", role: "skladník Plha" },
      { name: "Ladislav Smoljak", role: "Tuček, zvaný Mareček" },
      { name: "Zdeněk Svěrák", role: "Šlajs, zvaný Hustoles" },
      { name: "Josef Abrhám", role: "třídní profesor Čeněk Janda" },
    ],
  },
  {
    slug: "na-samote-u-lesa",
    title: "Na samotě u lesa",
    originalTitle: "Na samotě u lesa",
    year: 1976,
    director: "Jiří Menzel",
    writers: "Zdeněk Svěrák, Ladislav Smoljak",
    summary:
      "Pražská rodina Lavičkových touží po chalupě na venkově a dohodne se se svérázným starým panem Komárkem, že mu chaloupku koupí, jakmile se na jaře odstěhuje za synem na Slovensko. Jenže jaro střídá jaro a děda Komárek se k odchodu nemá — zatímco paní Lavičková na manžela naléhá, ať dohodu urguje, ten si s neodbytným, ale dobráckým dědou navzdory všemu postupně vytvoří opravdové přátelství.",
    production:
      "Jedna ze spoluprací scenáristické dvojice Svěrák–Smoljak s režisérem Jiřím Menzelem, natočená hned po celostátním úspěchu Marečku, podejte mi pero!. Natáčelo se v okolí Radešic a Svatého Jana na Příbramsku.",
    funFact:
      "Film sklidil úspěch i v zahraničí — na filmovém festivalu v Chicagu získal Stříbrné Hugo a na bulharském festivalu humoru v Gabrovu cenu za nejlepší režii.",
    cast: [
      { name: "Josef Kemr", role: "děda Komárek" },
      { name: "Zdeněk Svěrák", role: "Oldřich Lavička" },
      { name: "Daniela Kolářová", role: "Věra Lavičková" },
      { name: "Ladislav Smoljak", role: "ing. Radim Zvon" },
      { name: "Jan Tříska", role: "MUDr. Václav Houdek" },
    ],
  },
  {
    slug: "vrchni-prchni",
    title: "Vrchní, prchni!",
    originalTitle: "Vrchní, prchni!",
    year: 1980,
    director: "Ladislav Smoljak",
    writers: "Zdeněk Svěrák",
    summary:
      "Pražského knihkupce Dalibora Vránu si jednou v restauraci splete host s vrchním číšníkem — a Dalibor, tísněný splátkami alimentů na bývalé partnerky, se rozhodne příležitosti chopit. Čas od času si obleče smoking, v cizí hospodě zinkasuje pár útrat a zase zmizí, zatímco doma manželce nově nabyté peníze vysvětluje tím, že si přivydělává jako barový houslista.",
    production:
      "Zdeněk Svěrák napsal scénář přímo pro manžele Josefa Abrháma a Libuši Šafránkovou, kteří si ve filmu zahráli i manžele na plátně. Režie se poprvé samostatně ujal Ladislav Smoljak.",
    funFact:
      "Film je dodnes spojován s písní Severní vítr od Jaroslava Uhlíře a Zdeňka Svěráka a s hláškou „Vypadá jako Vrána, ale je to Králík!“ — a patří mezi vůbec nejoblíbenější české komedie.",
    cast: [
      { name: "Josef Abrhám", role: "Dalibor Vrána" },
      { name: "Libuše Šafránková", role: "Helena Vránová" },
      { name: "Zdeněk Svěrák", role: "soused Pařízek" },
      { name: "Eliška Balzerová", role: "prodavačka Věra" },
    ],
  },
  {
    slug: "po-strnisti-bos",
    title: "Po strništi bos",
    originalTitle: "Po strništi bos",
    year: 2017,
    director: "Jan Svěrák",
    writers: "Jan Svěrák (scénář), Zdeněk Svěrák (kniha a námět)",
    summary:
      "Malý Eda Souček prožívá s rodinou poslední měsíce protektorátu na venkově v Kopidlně, kam se uchýlili z Prahy — mezi dětskými hrami, výstředním strýcem přezdívaným Vlk a dospělým světem, který se kolem nich s koncem války rozpadá.",
    production:
      "Scénář napsal Jan Svěrák na motivy stejnojmenné autobiografické knihy svého otce Zdeňka Svěráka z roku 2013, líčící jeho dětství v Kopidlně za protektorátu. Šlo o desátý celovečerní film Jana Svěráka a sedmý, na kterém spolupracoval s otcem.",
    funFact:
      "Film dějově předchází Obecné škole z roku 1991: Ondřej Vetchý v něm hraje otce hlavního hrdiny, zatímco v Obecné škole tutéž postavu o pár desetiletí starší ztvárnil Zdeněk Svěrák — sám Vetchý si tam navíc odbyl malou roli tramvajáka.",
    cast: [
      { name: "Ondřej Vetchý", role: "František Souček, Edův otec" },
      { name: "Jan Tříska", role: "děda Souček" },
      { name: "Oldřich Kaiser", role: "strýc zvaný Vlk" },
      { name: "Zdeněk Svěrák", role: "ředitel školy v Kopidlně" },
    ],
  },
  {
    slug: "obecna-skola",
    title: "Obecná škola",
    originalTitle: "Obecná škola",
    year: 1991,
    director: "Jan Svěrák",
    writers: "Zdeněk Svěrák",
    summary:
      "V pražské klukovské obecné škole krátce po druhé světové válce nezvládá učitelka Maxová kázeň a odchází — na její místo nastoupí podivínský nový učitel Igor Hnízdo, který si třídu podmaní vojenskou disciplínou i poutavými, leč nevěrohodnými historkami z fronty. Malý Eda Souček ale postupně zjišťuje, že jeho skutečným hrdinou není okouzlující Hnízdo, nýbrž jeho vlastní nenápadný, puntičkářský otec.",
    production:
      "První celovečerní hraný film, ve kterém se jako scenárista a režisér spojili otec Zdeněk a syn Jan Svěrákovi — spolupráci pak zopakovali v několika dalších úspěšných filmech. Obecná škola byla nominována na Oscara za nejlepší cizojazyčný film.",
    funFact:
      "Malou epizodní roli tramvajáka si ve filmu odbyl Ondřej Vetchý — o šestadvacet let později, ve volně navazujícím filmu Po strništi bos, hraje přímo otce hlavního hrdiny, kterého v Obecné škole ztvárnil Zdeněk Svěrák.",
    cast: [
      { name: "Václav Jakoubek", role: "Eda Souček" },
      { name: "Jan Tříska", role: "učitel Igor Hnízdo" },
      { name: "Zdeněk Svěrák", role: "František Souček, Edův otec" },
      { name: "Libuše Šafránková", role: "maminka Součková" },
      { name: "Daniela Kolářová", role: "učitelka Maxová" },
    ],
  },
  {
    slug: "kolja",
    title: "Kolja",
    originalTitle: "Kolja",
    year: 1996,
    director: "Jan Svěrák",
    writers: "Zdeněk Svěrák",
    summary:
      "Starý mládenec, violoncellista Louka, se za peníze fingovaně ožení s Ruskou, aby jí pomohl získat československé občanství. Jenže žena po svatbě emigruje na Západ a Loukovi na krku zůstane její malý syn Kolja, který neumí ani slovo česky. Z počáteční vzájemné nedůvěry mezi mužem a chlapcem se postupně, navzdory potížím s komunistickými úřady, vyvine hluboké přátelství.",
    production:
      "Nejúspěšnější český film v historii domácích kin (přes 1,3 milionu diváků) a dosud jediný český film, který získal Oscara za nejlepší cizojazyčný film — k tomu i Zlatý glóbus a šest Českých lvů včetně ceny za nejlepší film.",
    funFact:
      "Roli malého Kolji ztvárnil neherecký ukrajinský chlapec Andrej Chalimon, kterého štáb našel při castingu v Moskvě — česky se ve filmu musel naučit foneticky, protože jazyku nerozuměl.",
    cast: [
      { name: "Zdeněk Svěrák", role: "František Louka" },
      { name: "Andrej Chalimon", role: "Kolja Biljukov" },
      { name: "Libuše Šafránková", role: "Klára, zpěvačka" },
      { name: "Ondřej Vetchý", role: "Josef Brož, hrobník" },
      { name: "Stella Zázvorková", role: "Loukova maminka" },
      { name: "Ladislav Smoljak", role: "Houdek" },
      { name: "Jiří Sovák", role: "Růžička, Loukův přítel" },
    ],
  },
  {
    slug: "tmavomodry-svet",
    title: "Tmavomodrý svět",
    originalTitle: "Tmavomodrý svět",
    year: 2001,
    director: "Jan Svěrák",
    writers: "Zdeněk Svěrák",
    summary:
      "Za druhé světové války uprchne mladý československý stíhací pilot František Sláma i se svým nadějným svěřencem Karlem Vojtíškem do Velké Británie, kde bojují po boku RAF. Jejich přátelství naruší vzájemný cit ke stejné ženě i tragédie ve vzduchu — a po válce navíc oba doma čeká místo vděku vězení, protože bojovali na „nesprávné“ západní frontě.",
    production:
      "Scénář vznikl na motivy skutečného příběhu válečného letce Františka Fajtla, Zdeněk Svěrák prý před natáčením napsal jedenáct verzí scénáře. Na Českých lvech 2001 film získal ceny za režii, kameru, hudbu i střih.",
    funFact:
      "Název i ústřední melodie filmu odkazují na stejnojmennou píseň Jaroslava Ježka z roku 1929, inspirovanou barvou uniforem letců RAF i Ježkovou vlastní téměř úplnou slepotou, kdy rozeznával jen tmavě modré odstíny.",
    cast: [
      { name: "Ondřej Vetchý", role: "František Sláma" },
      { name: "Kryštof Hádek", role: "Karel Vojtíšek" },
      { name: "Tara Fitzgerald", role: "Susan" },
      { name: "Oldřich Kaiser", role: "Jan Machatý" },
    ],
  },
  {
    slug: "vratne-lahve",
    title: "Vratné lahve",
    originalTitle: "Vratné lahve",
    year: 2007,
    director: "Jan Svěrák",
    writers: "Zdeněk Svěrák",
    summary:
      "Pětašedesátiletý učitel češtiny Josef Tkaloun ztratí po incidentu se studentem nervy a raději opustí školu — ale nečinně si užívat důchod nevydrží. Postupně si najde novou práci, nejprve jako posel na kole, po pádu na náledí pak jako výkupčí lahví v supermarketu, odkud má přehled o zákaznících a může sudičit ostatním, zatímco jeho vlastní manželku čeká k výročí svatby jedno velké překvapení.",
    production:
      "Zdeněk Svěrák si po letech od Vrchní, prchni! opět zahrál hlavní roli ve vlastním scénáři, tentokrát v režii syna Jana Svěráka. Film v Česku vydělal přes 124 milionů korun a získal tři České lvy.",
    funFact:
      "Malou roli syna postavy Pavla Landovského si ve filmu zahrál Ondřej Vetchý — další z řady drobných mezigeneračních propojení mezi herci opakovaně obsazovanými ve filmech Svěrákových.",
    cast: [
      { name: "Zdeněk Svěrák", role: "Josef Tkaloun" },
      { name: "Daniela Kolářová", role: "Eliška Tkalounová" },
      { name: "Tatiana Vilhelmová", role: "Helenka, Tkalounova dcera" },
      { name: "Pavel Landovský", role: "Řezáč, zvaný Mluvka" },
    ],
  },
  {
    slug: "pysna-princezna",
    title: "Pyšná princezna",
    originalTitle: "Pyšná princezna",
    genre: "pohadka",
    year: 1952,
    director: "Bořivoj Zeman",
    writers: "Bořivoj Zeman, Henryk Bloch, Oldřich Kautský",
    summary:
      "Krásná, ale rozmazlená princezna Krasomila si dělá z nápadníků legraci a odmítá si vzít souseda krále Miroslava, protože jí nepřipadá dost urozený a bohatý. Miroslav se jí za trest vydává za chudého pastuchu a snaží se pyšnou princeznu na vlastní pěst vychovat k pokoře. Teprve když pozná skutečnou chudobu a tvrdou práci, začne se v ní probouzet cit k muži, kterého zprvu odmítla.",
    production:
      "Film natočený podle pohádky Boženy Němcové Potrestaná pýcha se stal divácky nejúspěšnějším českým filmem vůbec — v tuzemských kinech ho vidělo přes 8,2 milionu diváků a další téměř 3,6 milionu ho zhlédlo v Polsku.",
    funFact:
      "Herci Alena Vránová a Vladimír Ráž, kteří si ve filmu zahráli budoucí manžele, se do sebe na place skutečně zamilovali a později se i v reálném životě vzali.",
    cast: [
      { name: "Alena Vránová", role: "princezna Krasomila" },
      { name: "Vladimír Ráž", role: "král Miroslav" },
      { name: "Miloš Kopecký", role: "kancléř" },
      { name: "Stanislav Neumann", role: "král půlnoční říše, Krasomilin otec" },
      { name: "Jaroslav Seník", role: "ministr Jakub" },
      { name: "Jana Werichová", role: "Madlenka" },
    ],
  },
  {
    slug: "byl-jednou-jeden-kral",
    title: "Byl jednou jeden král…",
    originalTitle: "Byl jednou jeden král…",
    genre: "pohadka",
    year: 1954,
    director: "Bořivoj Zeman",
    writers: "Jiří Brdečka, Jan Werich, Bořivoj Zeman",
    summary:
      "Stárnoucí král Já I. se rozhodne předat trůn té ze svých tří dcer, která ho má nejraději, a nechá je, aby svou lásku k němu vyjádřily slovy. Zatímco starší dcery lichotí zlatem a slávou, nejmladší Maruška přirovná svou lásku k soli, což krále urazí natolik, že ji i se solí vyžene z království. Teprve když si bez soli nedokáže dát do pořádku vlastní jídlo, pochopí, jak cennou věcí — a jak upřímnou dcerou — přišel.",
    production:
      "Šlo o první společné filmové setkání komiků Jana Wericha a Vlasty Buriana, přičemž pro Buriana to byl jeho třicátý sedmý film a zároveň jediný, který natočil barevně.",
    funFact:
      "Patnáctiletou Milenu Dvorskou objevil Jan Werich náhodou v divadelním foyer v Prostějově, kde si od něj chtěla vyžádat podpis — o pár týdnů později dostala roli princezny Marušky.",
    cast: [
      { name: "Jan Werich", role: "král Já I." },
      { name: "Vlasta Burian", role: "rádce Atakdále" },
      { name: "Milena Dvorská", role: "princezna Maruška" },
      { name: "Miloš Kopecký", role: "princ chytrý" },
      { name: "Miroslav Horníček", role: "princ krásný" },
      { name: "Marie Glázrová", role: "vdova Kubátová" },
    ],
  },
  {
    slug: "hratky-s-certem",
    title: "Hrátky s čertem",
    originalTitle: "Hrátky s čertem",
    genre: "pohadka",
    year: 1956,
    director: "Josef Mach",
    writers: "Jan Drda, Josef Mach",
    summary:
      "Vysloužilý voják Martin Kabát cestou domů usne v opuštěném mlýně, kde se náhodou zaplete do sporu mezi peklem a nebem. Princezna Dišperanda a její služka Káča totiž uzavřely s čerty smlouvu výměnou za vysněné nápadníky a Káča za to skončí v pekle. Martin se s pomocí andělíčka Teofila i vlastní vojenské mazanosti vydává Káču z pekla vysvobodit.",
    production:
      "Pohádkové kulisy a kostýmy pro film navrhl malíř Josef Lada, což mu dodalo typicky lidový, ilustrační ráz; do roku 1994 film v českých a slovenských kinech vidělo přes 4 miliony diváků.",
    funFact:
      "Film vznikl podle divadelní hry Jana Drdy, kterou napsal ještě za druhé světové války a která se poprvé hrála tajně, mimo dohled okupačních úřadů.",
    cast: [
      { name: "Josef Bek", role: "Martin Kabát" },
      { name: "Eva Klepáčová", role: "Káča" },
      { name: "Alena Vránová", role: "princezna Dišperanda" },
      { name: "František Smolík", role: "poustevník Školastykus" },
      { name: "Ladislav Pešek", role: "Belzebub, pán pekel" },
      { name: "František Filipovský", role: "čert Karborund" },
    ],
  },
  {
    slug: "obusku-z-pytle-ven",
    title: "Obušku, z pytle ven!",
    originalTitle: "Obušku, z pytle ven!",
    genre: "pohadka",
    year: 1955,
    director: "Jaromír Pleskot",
    writers: "Jiří Brdečka, Jaromír Pleskot",
    summary:
      "Chudý, ale poctivý muzikant dostane od tajemného stříbrného dědečka za svou dobrotu kouzelné dary — ubrousek prostírající jídlo a oslíka sypajícího zlaťáky. Hospodský, u kterého muzikant přenocuje, mu oba dary lstí ukradne, a tak se hrdina musí vrátit pro poslední dar — obušek, který jediný dokáže nespravedlnost napravit.",
    production:
      "Natáčení podle pohádky Karla Jaromíra Erbena Kouzelné dary začalo v únoru 1955 v ateliérech Barrandova a exteriéry vznikaly především na Vysočině poblíž Daňkovic; do konce roku 1987 film v českých kinech zhlédlo přes 2,8 milionu diváků.",
    funFact:
      "Od premiéry v září 1956 do konce roku 1987 se film v tuzemských kinech promítal na 16 792 představeních.",
    cast: [
      { name: "Ladislav Pešek", role: "muzikant" },
      { name: "Josef Beyvl", role: "hospodský" },
      { name: "František Smolík", role: "stříbrný stařeček" },
      { name: "Eman Fiala", role: "šumař" },
      { name: "Josef Hlinomaz", role: "ponocný" },
    ],
  },
  {
    slug: "princezna-se-zlatou-hvezdou",
    title: "Princezna se zlatou hvězdou",
    originalTitle: "Princezna se zlatou hvězdou",
    genre: "pohadka",
    year: 1959,
    director: "Martin Frič",
    writers: "K. M. Walló, Martin Frič",
    summary:
      "Do království krále Hostivíta, jehož dcera princezna Lada nosí na čele zlatou hvězdu, vtrhne s vojskem zlý sousední panovník Kazisvět a žádá Ladinu ruku. Princezna musí projít řadou zkoušek a nástrah, než se jí s pomocí věrného prince Radovana podaří zlého uchazeče přelstít. Celý film je pozoruhodný tím, že všechny dialogy postav jsou psané a mluvené ve verších.",
    production:
      "Roli princezny Lady měla původně hrát Miriam Hynková, ale těsně před natáčením vážně onemocněla, a tak režisér Martin Frič na poslední chvíli obsadil do role Marii Kyselkovou, která na konkurz přišla jen jako tanečnice do davové scény.",
    funFact:
      "Exteriéry se natáčely na zámku Průhonice a hradě Kokořín, které tak posloužily jako kulisy pohádkového království krále Hostivíta.",
    cast: [
      { name: "František Smolík", role: "král Hostivít" },
      { name: "Martin Růžek", role: "král Kazisvět VI." },
      { name: "Marie Kyselková", role: "princezna Lada" },
      { name: "Josef Zíma", role: "princ Radovan" },
      { name: "Jarmila Kurandová", role: "chůva princezny" },
      { name: "Josef Vinklář", role: "kuchtík Janek" },
    ],
  },
  {
    slug: "darbujan-a-pandrhola",
    title: "Dařbuján a Pandrhola",
    originalTitle: "Dařbuján a Pandrhola",
    genre: "pohadka",
    year: 1959,
    director: "Martin Frič",
    writers: "Jan Drda, Martin Frič",
    summary:
      "Chudému havíři Kubovi Dařbujánovi se s manželkou Markýtkou narodí dvanácté dítě a on mu jde hledat kmotra — odmítne Boha, protože je podle něj dobrý jen na bohaté, i čerta, a nakonec přijme nabídku Smrti, která je ke všem lidem stejně spravedlivá. Smrt z Dařbujána udělá léčitele s podmínkou, že smí uzdravit jen toho, u jehož lůžka stojí Smrt u nohou, nikdy ne u hlavy. Dařbuján se nakonec kvůli soucitu s boháčem Pandrholou tomuto pravidlu zpronevěří, a musí za to nést následky.",
    production:
      "Film natočený podle pohádky Jana Drdy se stal jedním z divácky nejúspěšnějších českých pohádkových filmů — od premiéry v červnu 1960 do konce roku 1987 ho v českých kinech na 14 168 představeních vidělo přes 2,35 milionu diváků.",
    funFact:
      "Podle pravidla, které Dařbujánovi coby léčiteli dala Smrt, mohl uzdravit pacienta jen tehdy, když Smrt viděl stát u nohou postele — pokud stála u hlavy, nemocný byl odsouzen k smrti.",
    cast: [
      { name: "Jiří Sovák", role: "Kuba Dařbuján" },
      { name: "Rudolf Hrušínský", role: "Pandrhola" },
      { name: "Václav Lohniský", role: "kmotr Smrťák" },
      { name: "Běla Jurdová", role: "Markýtka, Dařbujánova žena" },
      { name: "Bohuš Záhorský", role: "stařeček Pánbůh" },
      { name: "Otakar Brousek", role: "čert" },
    ],
  },
  {
    slug: "silene-smutna-princezna",
    title: "Šíleně smutná princezna",
    originalTitle: "Šíleně smutná princezna",
    genre: "pohadka",
    year: 1968,
    director: "Bořivoj Zeman",
    writers: "František Vlček, Bořivoj Zeman",
    summary:
      "Princ Václav se má oženit s princeznou Helenou ze sousedního království, ale nechce nechat o svém osudu rozhodnout jen otce a rádce, a tak se na cestu za nevěstou vydá tajně, aby si ji nejdřív v přestrojení prohlédl. U rybníka v zámecké zahradě se s Helenou setká, aniž by věděla, kdo je, a teprve když ji rozesměje podle jejího vlastního přání, prozradí svou identitu. Princezna se cítí podvedená a nechá ho pro výstrahu odsoudit k smrti, což rozpoutá spor mezi oběma královstvími. Mladý pár nakonec odhalí úklady dvou přisluhovačů a spor i vlastní svatbu zachrání sám.",
    production:
      "Exteriéry Dobromyslova království se natáčely na slovenském hradě Bojnice, zatímco zahradní a rybniční scény vznikaly na zámku Blatná; do filmu byly zapojeny i ukázky z Chaplinových grotesek a na jeho výtvarné podobě se podílel kreslíř Jiří Winter Neprakta.",
    funFact:
      "Dvojice úskočných rádců Iks a Ypsilon, které ztvárnili Josef Kemr a Darek Vostřel, si ve filmu zazpívala píseň „Kujme pikle“, jež v Česku dodnes slouží jako okřídlené synonymum pletichaření.",
    cast: [
      { name: "Helena Vondráčková", role: "princezna Helena" },
      { name: "Václav Neckář", role: "princ Václav" },
      { name: "Jaroslav Marvan", role: "král Jindřich" },
      { name: "Bohuš Záhorský", role: "král Dobromysl" },
      { name: "Josef Kemr", role: "rádce-generál Iks" },
      { name: "Darek Vostřel", role: "rádce-generál Ypsilon" },
      { name: "Stella Zázvorková", role: "chůva" },
    ],
  },
  {
    slug: "princ-bajaja",
    title: "Princ Bajaja",
    originalTitle: "Princ Bajaja",
    genre: "pohadka",
    year: 1971,
    director: "Antonín Kachlík",
    writers: "František Pavlíček, Eva Košlerová, Antonín Kachlík",
    summary:
      "Princ Bajaja se po smrti rodičů vydává do světa a připojí se k tlupě zlomyslného Černého prince. Od pastevce se dozví o princezně Slavěně, jejíž království kdysi ohrožoval třídhlavý drak a jejíž otec dračí příšeře kdysi slíbil svou novorozenou dceru výměnou za mír. Když se blíží Slavěniny osmnácté narozeniny a drak si přichází pro slíbenou nevěstu, Bajaja se na hradě vydává za němého zahradníka, aby byl princezně nablízku, a v brnění draka v boji porazí. Slávu si nejprve přivlastní Černý princ, pravda ale nakonec vyjde najevo na rytířském turnaji, kde Bajaja postupně přemůže všechny soupeře.",
    production:
      "Snímek podle pohádkové předlohy Boženy Němcové natočil režisér Antonín Kachlík se slovenskými herci v hlavních rolích — Ivana Palúcha v roli Bajaji do češtiny namluvil Petr Štěpánek a Fera Veleckého v roli Černého prince Petr Čepek.",
    funFact:
      "Roli princezny Slavěny si zahrála mladá Magda Vašáryová, která se později stala slovenskou diplomatkou, ministryní zahraničí a europoslankyní.",
    cast: [
      { name: "Magda Vašáryová", role: "princezna Slavěna" },
      { name: "Ivan Palúch", role: "princ Bajaja" },
      { name: "Fero Velecký", role: "Černý princ" },
      { name: "Gustav Opočenský", role: "král, otec princezny Slavěny" },
    ],
  },
  {
    slug: "tri-orisky-pro-popelku",
    title: "Tři oříšky pro Popelku",
    originalTitle: "Tři oříšky pro Popelku",
    genre: "pohadka",
    year: 1973,
    director: "Václav Vorlíček",
    writers: "František Pavlíček",
    summary:
      "Popelka přijde už v dětství o matku, otec se znovu ožení, ale brzy poté také zemře a dívka zůstává vydána napospas zlé maceše a její dceři Doře. Od starého podkoního dostane tři kouzelné oříšky, které jí postupně poskytnou lovecký oděv, plesové šaty i svatební šat. Na královském honu i na plese si jí všimne princ, který ji po celém království hledá poté, co při útěku ztratí střevíček. Nakonec ji najde díky střevíčku, jenž jí jako jediné ve všem kraji padne, a Popelka se stává princeznou.",
    production:
      "Natáčení plánované na léto muselo být kvůli dostupnosti východoněmeckého štábu přeloženo na zimní měsíce prosinec 1972 a leden 1973; umělý sníh se pro filmaře vyráběl z mleté rybí moučky z konzervárny, a scény tak podle vzpomínek štábu i nepříjemně páchly.",
    funFact:
      "Postavu princova vychovatele-preceptora do scénáře doplnil až režisér Václav Vorlíček, když se rozhodl přesunout děj do zimy — roli nezapomenutelně ztvárnil Jan Libíček.",
    cast: [
      { name: "Libuše Šafránková", role: "Popelka" },
      { name: "Pavel Trávníček", role: "princ" },
      { name: "Dana Hlaváčová", role: "Dora, macechina dcera" },
      { name: "Vladimír Menšík", role: "podkoní Vincek" },
      { name: "Jan Libíček", role: "preceptor, princův vychovatel" },
      { name: "Carola Braunböck", role: "macecha" },
      { name: "Rolf Hoppe", role: "král" },
    ],
  },
  {
    slug: "zlatovlaska",
    title: "Zlatovláska",
    originalTitle: "Zlatovláska",
    genre: "pohadka",
    year: 1973,
    director: "Vlasta Janečková",
    writers: "Vlasta Janečková",
    summary:
      "Mladý sluha Jiřík slouží u svého krále a jednou neposlechne zákaz a ochutná maso kouzelného hada, čímž nečekaně získá schopnost rozumět řeči zvířat. Když to král zjistí, pošle Jiříka pod hrozbou smrti, aby mu přivedl za nevěstu překrásnou Zlatovlásku z daleké říše. Díky vděčnosti mravenců, ptáků a ryby, jimž předtím pomohl, se Jiříkovi podaří splnit i zdánlivě nemožné úkoly, které mu klade Zlatovláskin otec. Sám se ale do princezny zamiluje, a když dojde na krutou zkoušku i zázračné vzkříšení pomocí živé vody, usedá na trůn po boku Zlatovlásky nakonec právě on.",
    production:
      "Televizní pohádku natočila režisérka Vlasta Janečková na zámcích Sychrov a Červená Lhota; zpěv v roli Zlatovlásky za herečku Jorgu Kotrbovou nazpívala zpěvačka Jitka Molavcová.",
    funFact:
      "Bílý kůň, na němž ve filmu jezdí Jiřík, byl podle dochované historky totéž zvíře jménem Ibrahim, které si o rok dříve zahrálo prince v pohádce Tři oříšky pro Popelku.",
    cast: [
      { name: "Jorga Kotrbová", role: "princezna Zlatovláska" },
      { name: "Petr Štěpánek", role: "Jiřík" },
      { name: "Ladislav Pešek", role: "král, otec Zlatovlásky" },
      { name: "Jiří Holý", role: "starý král" },
      { name: "Marie Rosůlková", role: "babička s hadem" },
      { name: "Luba Skořepová", role: "komorná" },
    ],
  },
  {
    slug: "mala-morska-vila",
    title: "Malá mořská víla",
    originalTitle: "Malá mořská víla",
    genre: "pohadka",
    year: 1976,
    director: "Karel Kachyňa",
    writers: "Ota Hofman, Karel Kachyňa",
    summary:
      "Nejmladší dcera mořského krále smí jako ostatní mořské panny jednou vyplout k hladině a poprvé tak spatří svět lidí — a hlavně mladého prince, kterého po ztroskotání lodi zachrání před utonutím. Zamiluje se do něj a výměnou za lidské nohy obětuje mořské čarodějnici svůj hlas, ačkoli každý krok ji má bolet jako bodnutí nožem. Na pevnině princ mořskou vílu obdivuje jako mlčenlivou společnici, ožení se ale s princeznou ze sousední říše, kterou mylně považuje za svou zachránkyni. Zdrcená mořská víla se raději obětuje a rozplyne se v mořskou pěnu, než aby ublížila muži, kterého miluje.",
    production:
      "Snímek natáčel režisér Karel Kachyňa mimo jiné na zámku Veltrusy a v Prachovských skalách; hlavní role mořské víly a princezny ze sousední říše ztvárnily vlastní sestry Miroslava a Libuše Šafránkovy, které si byly navzájem velmi podobné.",
    funFact:
      "Film v roce 1977 získal hlavní cenu na mezinárodním filmovém festivalu ve španělském Gijónu.",
    cast: [
      { name: "Miroslava Šafránková", role: "mořská víla" },
      { name: "Radovan Lukavský", role: "mořský král" },
      { name: "Petr Svojtka", role: "princ z jižní říše" },
      { name: "Libuše Šafránková", role: "princezna ze sousední říše" },
      { name: "Marie Rosůlková", role: "babička" },
      { name: "Milena Dvorská", role: "mořská čarodějnice" },
      { name: "Dagmar Patrasová", role: "sestra mořské víly" },
    ],
  },
  {
    slug: "honza-malem-kralem",
    title: "Honza málem králem",
    originalTitle: "Honza málem králem",
    genre: "pohadka",
    year: 1977,
    director: "Bořivoj Zeman",
    writers: "Oldřich Kautský, Bořivoj Zeman",
    summary:
      "Sedlácký synek Honza, kterému okolí přezdívá Hloupý, se vydává do světa zkusit štěstí a najde si službu u sedláka Matěje, kde se zamiluje do jeho dcery Mařenky. Po království se mezitím rozkřikne, že král slíbí půl království a ruku dcery tomu, kdo dokáže rozmluvit zakřiknutou němou princeznu. Honza se o to i přes posměch celého dvora pokusí a nakonec princeznu k řeči přiměje smělým, drzým žertem. Ačkoli mu zprvu nikdo nevěří, král nakonec dostojí svému slovu a Honza se s poctivě vydobytým jměním vrací domů o zkušenost moudřejší.",
    production:
      "Roli Honzy zvaného Hloupý ztvárnil zpěvák a herec Jiří Korn, jehož zpívané pasáže byly ve filmu nadabovány Michalem Pavlatou; o roli údajně uvažoval i herec Josef Dvořák.",
    funFact:
      "Roli princeznina otce, krále, ztvárnil František Filipovský, jinak nejproslulejší český dabér francouzského komika Louise de Funèse.",
    cast: [
      { name: "Jiří Korn", role: "Honza zvaný Hloupý" },
      { name: "Naďa Konvalinková", role: "Mařenka" },
      { name: "František Filipovský", role: "král" },
      { name: "Jorga Kotrbová", role: "princezna" },
      { name: "Petr Nárožný", role: "sedlák Matěj" },
      { name: "Helena Růžičková", role: "trhovkyně" },
      { name: "Josef Kemr", role: "královský bubeník" },
    ],
  },
  {
    slug: "jak-se-budi-princezny",
    title: "Jak se budí princezny",
    originalTitle: "Jak se budí princezny",
    genre: "pohadka",
    year: 1977,
    director: "Václav Vorlíček",
    writers: "Bohumila Zelenková",
    summary:
      "Král Dalimil a královna Eliška zapomenou na křtinách své dcery pozvat zlou tetu Melánii, která proto novorozené princezně Růžence uštědří kletbu: v sedmnácti letech se má píchnout o trn a upadnout i s celým královstvím do stoletého spánku. Věštba se navzdory všem opatřením naplní a ke spícímu zámku se musí vydat princ Jaroslav, který si Růženku zamiloval navzdory tomu, že byla zasnoubena jeho staršímu bratrovi Jiřímu. Aby ji probudil polibkem, musí překonat Melániiny nástrahy i vlastní nešikovnost.",
    production:
      "Vnější scény zámku vznikaly hned na několika hradech najednou — Pernštejn představoval princezninu rezidenci, detaily hradeb se natáčely na Křivoklátě a v Telči, interiéry na hradě Roštejn a jako Melániino sídlo posloužila zřícenina Orlík u Humpolce.",
    funFact:
      "Herci Janu Hrušínskému se během natáčení večer doma zlomila noha, takže závěrečnou jezdeckou scénu, v níž kůň s princem skáče do rybníka, musel dotáčet se sádrou, kterou pak bylo nutné z vody vyprošťovat těžkou technikou.",
    cast: [
      { name: "Jiří Sovák", role: "král Dalimil" },
      { name: "Marie Horáková", role: "princezna Růženka" },
      { name: "Jan Hrušínský", role: "princ Jaroslav" },
      { name: "Vladimír Menšík", role: "sluha Matěj" },
      { name: "Libuše Švormová", role: "Melánie" },
      { name: "František Filipovský", role: "baron" },
    ],
  },
  {
    slug: "at-ziji-duchove",
    title: "Ať žijí duchové!",
    originalTitle: "Ať žijí duchové!",
    genre: "pohadka",
    year: 1977,
    director: "Oldřich Lipský",
    writers: "Zdeněk Svěrák, Jiří Melíšek, Oldřich Lipský",
    summary:
      "Parta dětí z vesnice u zříceniny hradu Brtník chce v jeho troskách zřídit vlastní klubovnu, jenže o stejný pozemek usiluje i místní zemědělské družstvo, které tam plánuje pěstírnu žampionů. Na hradě přitom už staletí straší rytíř Brtník z Brtníku se svou dcerou Leontýnkou, kteří dětem při přesvědčování úřadů tajně pomáhají kouzly i strašením. Když se nakonec podaří hrad dětem získat a opravit, mohou být Leontýnka i její otec vysvobozeni z prokletí.",
    production:
      "Roli malé Leontýnky ztvárnila teprve devítiletá Dana Vávrová, která na place oslavila i své narozeniny — sláva ji ale nijak nezměnila a po skončení natáčení se vrátila do školních lavic jako každé jiné dítě.",
    funFact:
      "Trpaslíky z hradní pokladnice hráli dospělí kaskadéři, kteří stáli od ostatních herců o desítky metrů dál od kamery — jejich menší velikost tak vznikla čistě opticky, bez jakýchkoli trikových zmenšenin.",
    cast: [
      { name: "Dana Vávrová", role: "Leontýnka z Brtníku" },
      { name: "Jiří Sovák", role: "rytíř Brtník z Brtníku" },
      { name: "Lubomír Lipský", role: "Jouza, vedoucí samoobsluhy" },
      { name: "Vlastimil Brodský", role: "ředitel školy" },
      { name: "Věra Tichánková", role: "Pilátová, zvaná Černá kronika" },
      { name: "Josef Bek", role: "hajný" },
    ],
  },
  {
    slug: "panna-a-netvor",
    title: "Panna a netvor",
    originalTitle: "Panna a netvor",
    genre: "pohadka",
    year: 1978,
    director: "Juraj Herz",
    writers: "Ota Hofman",
    summary:
      "Zchudlý obchodník má tři dcery, z nichž nejmladší Julie se kvůli otcovu dluhu ocitá na zámku tajemného pána, jenž je od pohledu spíš dravým netvorem než člověkem a nesmí být spatřen. Julie na zámku žije v přepychu, postupně si však k zakletému pánovi navzdory strachu vytváří citové pouto. Teprve když jej dokáže milovat takového, jaký je, kletba se zlomí a netvor se promění zpět v člověka.",
    production:
      "Aby ušetřil náklady na rozlehlé zámecké kulisy postavené v ateliéru, natočil režisér Juraj Herz na stejných dekoracích souběžně i další hororovou pohádku Deváté srdce — obě díla tak vznikala prakticky zároveň během devadesáti natáčecích dnů.",
    funFact:
      "Netvora si režisér nechtěl nechat ztvárnit jako přítulné zvíře, a tak roli svěřil tanečníkovi Vlastimilu Harapesovi právě kvůli jeho baletní pohybové kultuře — výsledná bytost měla připomínat spíš nekomunikativního dravého ptáka než klasickou pohádkovou příšeru.",
    cast: [
      { name: "Zdena Studenková", role: "Julie" },
      { name: "Vlastimil Harapes", role: "netvor" },
      { name: "Václav Voska", role: "otec" },
      { name: "Jana Brejchová", role: "Gábinka" },
      { name: "Josef Laufer", role: "hrabátko, Gábinčin manžel" },
      { name: "Zuzana Kocúriková", role: "Málinka" },
    ],
  },
  {
    slug: "treti-princ",
    title: "Třetí princ",
    originalTitle: "Třetí princ",
    genre: "pohadka",
    year: 1982,
    director: "Antonín Moskalyk",
    writers: "Ota Hofman, Antonín Moskalyk",
    summary:
      "Královna Země lva po letech bezdětnosti počne díky kouzlu věštkyně dvojčata, prince Jaroslava a Jaromíra. Když se Jaromír zamiluje do tajemné princezny ze skal, jejíž portrét najde na zámku, vydá se za ní do říše Diamantové skály, kde ale neobstojí ve třech zkouškách a je proměněn v kámen. Jeho bratr Jaroslav se za ním vydá, vydává se za něj a zkoušky — včetně nebezpečného koňského závodu — úspěšně dokončí, čímž vysvobodí bratra i celé prokleté království.",
    production:
      "Natáčení v Adršpašsko-teplických skalách bylo pro Pavla Trávníčka, který hrál obě prince, mimořádně náročné — při šplhání po skalách bez jištění se musel spoléhat jen na úchyty, které mu do skály předem osadili horolezci.",
    funFact:
      "Do hlavní ženské role princezny ze skal byla původně uvažována herečka Zora Jandová, která se ve filmu nakonec skutečně objevila, ale jen ve vedlejší roli — titulní princeznu nakonec ztvárnila Libuše Šafránková v černé paruce.",
    cast: [
      { name: "Libuše Šafránková", role: "princezna Milena / princezna ze skal" },
      { name: "Pavel Trávníček", role: "princ Jaromír a princ Jaroslav" },
      { name: "Luděk Munzar", role: "král Země lva" },
      { name: "Jana Hlaváčová", role: "královna Země lva" },
      { name: "Jiří Bartoška", role: "princ Jindřich" },
    ],
  },
  {
    slug: "sul-nad-zlato",
    title: "Sůl nad zlato",
    originalTitle: "Sůl nad zlato",
    genre: "pohadka",
    year: 1982,
    director: "Martin Hollý",
    writers: "Martin Hollý, Peter Kováčik",
    summary:
      "Král Pravoslav se před svými třemi dcerami chlubí, jak moc ho mají rády, ale nejmladší Maruška odpoví, že ho miluje jako sůl — a uražený král ji za tuto odpověď vyžene z domova. Zavržená princezna najde útočiště u tajemného solného prince, zatímco pyšný král díky kletbě z podzemí brzy zjistí, že veškerá sůl v jeho zemi se proměnila ve zlato a k jídlu je nepoužitelná. Teprve když pozná, jak nepostradatelná sůl doopravdy je, dojde mu, co jeho dcera vlastně vyjádřila, a dojde ke smíření.",
    production:
      "Šlo o rozsáhlou mezinárodní koprodukci Československa, západního Německa, Rakouska a Itálie natáčenou na mnoha místech — od českých hradů Pernštejn a Křivoklát až po slovenské jeskyně Domica a Demänovská ľadová jaskyňa, jejíž ledové stalaktity posloužily jako kulisy podzemních zásob soli.",
    funFact:
      "Libuši Šafránkovou na Slovensku v dabingu namluvila herečka Jana Nagyová — přesně opačně, než jak to bylo v seriálu Arabela, kde naopak Šafránková v postsynchronu namluvila právě Nagyovou.",
    cast: [
      { name: "Libuše Šafránková", role: "princezna Maruška" },
      { name: "Gábor Nagy", role: "solný princ" },
      { name: "Karol Machata", role: "král Pravoslav" },
      { name: "Ladislav Chudík", role: "král podzemí" },
      { name: "Zuzana Kocúriková", role: "princezna Vanda" },
      { name: "Jozef Kroner", role: "šašek" },
    ],
  },
  {
    slug: "s-certy-nejsou-zerty",
    title: "S čerty nejsou žerty",
    originalTitle: "S čerty nejsou žerty",
    genre: "pohadka",
    year: 1984,
    director: "Hynek Bočan",
    writers: "Hynek Bočan, Jiří Just",
    summary:
      "Po smrti otce se mlynářský syn Petr Máchal stává terčem zlovůle macechy Doroty i zkorumpovaného zámeckého správce a je nespravedlivě odveden na vojnu. Do jeho osudu zasáhne čert Janek, kterého z pekla poslal sám Lucifer, aby si pro hříchy odnesl Dorotu — čert si to však po cestě splete a omylem unese Petrovu nevinnou babičku Annu. Petr se s Jankovou pomocí, i za cenu výpravy do pekla, musí babičku zachránit a domoci se spravedlnosti.",
    production:
      "Peklo se natáčelo v opuštěných pískovcových lomech na Českolipsku, které během natáčení sloužily sovětské armádě jako sklad brambor, zatímco scény u mlýna vznikaly u Střehomského mlýna poblíž Sobotky a zámecké interiéry v Průhonicích.",
    funFact:
      "Film byl v roce 2019 digitálně zrestaurován ve spolupráci s Národním filmovým archivem, takže dnes koluje v podstatně kvalitnější podobě, než v jaké ho diváci viděli při premiéře v osmdesátých letech.",
    cast: [
      { name: "Vladimír Dlouhý", role: "Petr Máchal" },
      { name: "Ondřej Vetchý", role: "čert Janek" },
      { name: "Josef Kemr", role: "kníže Josef Sličný" },
      { name: "Viktor Preiss", role: "správce" },
      { name: "Petr Nárožný", role: "kaprál" },
      { name: "Karel Heřmánek", role: "Lucifer XIV., kníže pekel" },
    ],
  },
  {
    slug: "o-princezne-jasnence-a-letajicim-sevci",
    title: "O princezně Jasněnce a létajícím ševci",
    originalTitle: "O princezně Jasněnce a létajícím ševci",
    genre: "pohadka",
    year: 1987,
    director: "Zdeněk Troška",
    writers: "Karel Steigerwald",
    summary:
      "Princeznu Jasněnku proklíná zlá čarodějnice z Černého lesa poté, co král rozhodne spor v jejich neprospěch, a určí, že se dívka provdá za obyčejného ševcovského tovaryše. Král se snaží kletbu zmařit tím, že dceru zavře do věže, jenže mladý Jíra si mezitím ušije z jemné kůže vlastní křídla a naučí se s nimi létat. S jejich pomocí princeznu z věže vysvobodí a nakonec zlomí i samotné zaklení.",
    production:
      "Film natočil režisér Zdeněk Troška podle knižní předlohy Jana Drdy, scénář napsal dramatik Karel Steigerwald a natáčelo se mimo jiné na hradě Bouzov, zámku Vítkov, hradě Frýdštejn a na zámku Průhonice.",
    funFact:
      "Ševcovský tovaryš Jíra si ve filmu vylétá za princeznou na křídlech ušitých z kůže vlastní rukou, což mu vyneslo i přízvisko z názvu celé pohádky — létající švec.",
    cast: [
      { name: "Michaela Kuklová", role: "princezna Jasněnka" },
      { name: "Jan Potměšil", role: "švec Jíra" },
      { name: "Lubor Tokoš", role: "král" },
      { name: "Helena Růžičková", role: "čarodějnice z Černého lesa" },
      { name: "Yvetta Blanarovičová", role: "čarodějnice Černava" },
      { name: "Zdeněk Podhůrský", role: "Černý princ" },
    ],
  },
  {
    slug: "nesmrtelna-teta",
    title: "Nesmrtelná teta",
    originalTitle: "Nesmrtelná teta",
    genre: "pohadka",
    year: 1993,
    director: "Zdeněk Zelenka",
    writers: "Zdeněk Zelenka",
    summary:
      "Vypravěč diváky seznamuje se sázkou mezi alegorickými bytostmi Rozumem a Štěstím o to, zda k životnímu úspěchu stačí jen chytrá hlava. Prostoduchý venkovan Matěj díky sázce náhle získá rozum krále, vydá se do sousedního království, zamiluje se do princezny a stane se královým rádcem. Musí přitom čelit intrikám záludné Závisti, která se vydává za králova příbuzného a snaží se rozvrátit království i chystanou svatbu.",
    production:
      "Snímek natočený na motivy pohádky Karla Jaromíra Erbena Rozum a Štěstí patřil svého času k nejnákladnějším projektům české kinematografie a Jiřina Bohdalová za roli Závisti získala Českého lva.",
    funFact:
      "Alegorické postavy Rozumu, Štěstí a Závisti ve filmu nevystupují jako obyčejní pohádkoví hrdinové, ale jako nadpřirozené bytosti, které se přímo vsadí o osud prostého poddaného Matěje.",
    cast: [
      { name: "Jiřina Bohdalová", role: "Závist" },
      { name: "Filip Blažek", role: "Matěj" },
      { name: "Jaromír Hanzlík", role: "král Ctirad" },
      { name: "Vlastimil Brodský", role: "vypravěč" },
      { name: "Jiří Lábus", role: "otec" },
      { name: "Libuše Šafránková", role: "Štěstí" },
    ],
  },
  {
    slug: "tri-zlate-vlasy-deda-vseveda",
    title: "Tři zlaté vlasy děda Vševěda",
    originalTitle: "Tři zlaté vlasy děda Vševěda",
    genre: "pohadka",
    year: 1963,
    director: "Jan Valášek",
    writers: "Milan Pavlík",
    summary:
      "Chudý nalezenec Plaváček je podle proroctví sudiček od narození předurčen k tomu, že se jednou ožení s královskou dcerou, což se žárlivý král marně snaží násilím zmařit. Když mladík přesto vyroste v udatného jinocha, pošle ho panovník s podvodným dopisem pryč a později mu uloží zdánlivě nesplnitelný úkol — přinést tři zlaté vlasy z hlavy vševědoucího děda Vševěda. Na cestě za ním se Plaváček stane i převozníkem na začarovaném plavidle a úkol nakonec splní i vlastní štěstí si vydobude.",
    production:
      "Film natočil v roce 1963 režisér Jan Valášek podle klasické pohádky Karla Jaromíra Erbena, hudbu k pohádce složil Zdeněk Liška a roli vypravěče namluvil Václav Voska.",
    funFact:
      "Chlapec z pohádky dostal jméno Plaváček podle toho, že jako nemluvně přežil vhození do řeky v ošatce a byl vyloven rybářem.",
    cast: [
      { name: "Alfred Strejček", role: "Plaváček" },
      { name: "Zdeněk Štěpánek", role: "děd Vševěd" },
      { name: "Radovan Lukavský", role: "král" },
      { name: "František Smolík", role: "slepý stařec" },
    ],
  },
  {
    slug: "princ-a-vecernice",
    title: "Princ a Večernice",
    originalTitle: "Princ a Večernice",
    genre: "pohadka",
    year: 1978,
    director: "Václav Vorlíček",
    writers: "Jiří Brdečka",
    summary:
      "Rozmazlený princ Velen musí v jedinou noc, kdy mu stárnoucí král svěří vládu nad říší, provdat své tři sestry za tajemné vládce Slunečníka, Měsíčníka a Větrníka. Sám se přitom zamiluje do krásné Večernice, kterou však unese zlý čaroděj Mrakomor. Aby milovanou dívku zachránil, vydává se Velen s pomocí svých nových švagrů na nebezpečnou výpravu, během níž z rozmazleného mladíka dozraje ve statečného muže.",
    production:
      "Scénář napsal Jiří Brdečka na motivy pohádky Boženy Němcové O Slunečníku, Měsíčníku a Větrníku, kostýmy pro film navrhl výtvarník Theodor Pištěk a natáčelo se mimo jiné na zámku Ploskovice a hradech Krakovec a Hrádek.",
    funFact:
      "Slovenského herce Juraje Ďurdiaka v roli prince Velena ve filmu namluvil jiný herec, Petr Svojtka, protože Ďurdiakova slovenština by do pohádky s českými dialogy nezapadala.",
    cast: [
      { name: "Libuše Šafránková", role: "Večernice" },
      { name: "Vladimír Menšík", role: "král" },
      { name: "Radoslav Brzobohatý", role: "Mrakomor" },
      { name: "František Filipovský", role: "Kacafírek" },
      { name: "Zlata Adamovská", role: "princezna Elenka" },
      { name: "Julie Jurištová", role: "princezna Helenka" },
    ],
  },
  {
    slug: "sedmero-krkavcu",
    title: "Sedmero krkavců",
    originalTitle: "Sedmero krkavců",
    genre: "pohadka",
    year: 1993,
    director: "Ludvík Ráža",
    writers: "Pavel Aujezdský",
    summary:
      "Matka v návalu hněvu proklíná svých sedm neposedných synů, kteří jí zkazili pečení chleba, a ti se v tu ránu promění v krkavce. O několik let později se jejich sestra Bohdanka z nalezených košilek dozví, co se s bratry stalo, a vydá se je vysvobodit. Aby kletbu zlomila, musí mlčky utkat plátno z kopřiv a ušít z něj bratrům košile, i když ji cestou potká láska šlechtice Vratislava i falešné obvinění z čarodějnictví.",
    production:
      "Televizní pohádku natočila Česká televize na motivy pohádky bratří Grimmů a do hlavní role Bohdanky, která po většinu filmu nesmí kvůli kletbě promluvit, obsadili tehdy teprve osmnáctiletou herečku Márii Podhradskou.",
    funFact:
      "Bohdanka nesmí kvůli kletbě po celý film promluvit ani slovo, takže scenárista postavil většinu jejího výkonu jen na gestech a mimice.",
    cast: [
      { name: "Mária Podhradská", role: "Bohdanka" },
      { name: "Michal Dlouhý", role: "Vratislav" },
      { name: "Ivana Chýlková", role: "Milada" },
      { name: "Jana Hlaváčová", role: "matka" },
      { name: "Radoslav Brzobohatý", role: "otec" },
      { name: "Boris Rösner", role: "Chrt" },
    ],
  },
  {
    slug: "devate-srdce",
    title: "Deváté srdce",
    originalTitle: "Deváté srdce",
    genre: "pohadka",
    year: 1978,
    director: "Juraj Herz",
    writers: "Juraj Herz, Josef Hanzlík",
    summary:
      "Potulný student Martin se na svém putování dozví o záhadné nemoci princezny Adriany, kterou postihl zlý kouzelník hrabě Aldobrandini. Aby ji vysvobodil, musí přelstít hraběte, který se marně snaží omládnout pomocí elixíru vařeného z devíti ukradených dětských srdcí. Cesta za záchranou princezny zavede Martina do světa kejklířů, pouťových atrakcí i temné magie.",
    production:
      "Režisér Juraj Herz natáčel film souběžně s pohádkou Panna a netvor — obě produkce si mezi sebou dělily kostýmy i kulisy — a sám režisér si v Devátém srdci zahrál malou roli astrologa.",
    funFact:
      "Zlý hrabě Aldobrandini ve filmu sbírá dětská srdce, aby si z nich připravil omlazující elixír — motiv natolik temný, že řadí Deváté srdce spíš k hororovým pohádkám než k té klasické veselé.",
    cast: [
      { name: "Ondřej Pavelka", role: "Martin" },
      { name: "Julie Jurištová", role: "princezna Adriana" },
      { name: "Josef Somr", role: "kapitán" },
      { name: "Josef Kemr", role: "impresário" },
      { name: "František Filipovský", role: "šašek" },
    ],
  },
];

export function findMockFilm(slug: string): MockFilm | undefined {
  return MOCK_FILMS.find((f) => f.slug === slug);
}

export function findMockFilmByTitle(title: string): MockFilm | undefined {
  return MOCK_FILMS.find((f) => f.title === title);
}
