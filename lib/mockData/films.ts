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
];

export function findMockFilm(slug: string): MockFilm | undefined {
  return MOCK_FILMS.find((f) => f.slug === slug);
}

export function findMockFilmByTitle(title: string): MockFilm | undefined {
  return MOCK_FILMS.find((f) => f.title === title);
}
