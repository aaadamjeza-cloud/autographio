// Mock film catalog — stands in for a future `films` table. Summaries are
// written from scratch in Czech (facts only, own wording), not translated
// or copied from the French Wikipedia articles they were researched from —
// those are long, French, and CC-BY-SA (attribution-only, not a licence to
// dump raw text into an unrelated app).
export type MockFilm = {
  slug: string;
  title: string;
  year: number;
  director: string;
  cast: string[];
  summary: string;
  funFact?: string;
  note?: string;
};

export const MOCK_FILMS: MockFilm[] = [
  {
    slug: "cetnik-ze-saint-tropez",
    title: "Četník ze Saint Tropez",
    year: 1964,
    director: "Jean Girault",
    cast: [
      "Louis de Funès",
      "Michel Galabru",
      "Geneviève Gradová",
      "Jean Lefebvre",
      "Christian Marin",
      "Guy Grosso",
      "Michel Modo",
      "France Rumilly",
      "Nicole Vervil",
      "Daniel Cauchy",
    ],
    summary:
      "První díl série. Horlivý četník Ludovic Cruchot je za odměnu přeložen z horské vesničky do Saint-Tropez, kde narazí na rozjívenou brigádu, honičky za nudisty na pláži a spletitou aféru kolem ukradeného obrazu, do níž se namočí i jeho dcera Nicole. Nečekaně se stal filmovým hitem roku a odstartoval sérii šesti filmů.",
  },
  {
    slug: "cetnik-v-new-yorku",
    title: "Četník v New Yorku",
    year: 1965,
    director: "Jean Girault",
    cast: [
      "Louis de Funès",
      "Michel Galabru",
      "Geneviève Gradová",
      "Jean Lefebvre",
      "Christian Marin",
      "Guy Grosso",
      "Michel Modo",
      "France Rumilly",
    ],
    summary:
      "Brigáda ze Saint-Tropez odjíždí lodí přes Atlantik na mezinárodní sjezd četnictva do New Yorku. Cruchotova dcera Nicole se ale na palubu nalodí jako černý pasažér a otec pak musí celý pobyt tajit její přítomnost před ostatními četníky i newyorskou policií.",
    funFact:
      "Natáčelo se na skutečném zaoceánském parníku France — cestující zprvu mysleli, že uniformovaní herci jsou opravdoví celníci, takže jim posádka přímo na lodi promítla první díl, aby situaci vysvětlila. Herec Jean Lefebvre se během natáčení pohádal s režisérem kvůli velikosti své role a natáčení opustil; scénář se musel narychlo přepsat, takže jeho postava stráví většinu filmu upoutaná na nemocniční lůžko. Je to jediný díl série bez scény s bláznivě řídící jeptiškou.",
  },
  {
    slug: "cetnik-se-zeni",
    title: "Četník se žení",
    year: 1968,
    director: "Jean Girault",
    cast: [
      "Louis de Funès",
      "Michel Galabru",
      "Geneviève Gradová",
      "Jean Lefebvre",
      "Christian Marin",
      "Guy Grosso",
      "Michel Modo",
      "France Rumilly",
      "Nicole Vervil",
    ],
    summary:
      "Cruchot se zamiluje do Josépy, vdovy po plukovníkovi četnictva, která v něm vidí budoucího vysokého důstojníka a tlačí ho ke zkoušce na vyšší hodnost — k nelibosti jeho nadřízeného, adjutanta Gerbera. Natáčení v květnu a červnu 1968 poznamenala celostátní stávka po událostech Května 68.",
    funFact:
      "Než se natáčení vůbec rozjelo, tvůrci zvažovali anketou, jestli se má Cruchot opravdu oženit — báli se, že ženatý hrdina odradí fanynky. Na premiéře pak došlo ke slavné roztržce: herec Jean Lefebvre po projekci vstal a před novináři si veřejně stěžoval, že se ve filmu kvůli sestříhaným scénám téměř neobjevil — jeho vztahy s Louisem de Funèsem se tím na dlouho pokazily. Ve filmu si také poprvé v sérii prohodili role herci Guy Grosso a Michel Modo (Tricart a Berlicot).",
  },
  {
    slug: "cetnik-a-mimozemstane",
    title: "Četník a mimozemšťané",
    year: 1979,
    director: "Jean Girault",
    cast: ["Louis de Funès", "Michel Galabru", "Guy Grosso", "Michel Modo", "France Rumilly"],
    summary:
      "Po devítileté pauze se brigáda ze Saint-Tropez vrací — tentokrát čelí mimozemšťanům, kteří přistáli poblíž města a umí se vydávat za obyčejné lidi. Cruchotovi nikdo nevěří, když se snaží upozornit na jejich přítomnost. Návrat série byl obrovským komerčním úspěchem, nejnavštěvovanějším francouzským filmem roku 1979.",
  },
  {
    slug: "cetnik-a-cetnice",
    title: "Četník a četnice",
    year: 1982,
    director: "Jean Girault",
    cast: ["Louis de Funès", "Michel Galabru", "Guy Grosso", "Michel Modo", "France Rumilly"],
    summary:
      "Brigáda ze Saint-Tropez dostane za úkol vycvičit první čtyři četnice, které se mají stát součástí sboru. Šestý a poslední díl série — natáčení zkomplikovalo zhoršující se zdraví režiséra Jeana Giraulta, který v jeho průběhu zemřel; o pár měsíců později zemřel i Louis de Funès, pro kterého to byl poslední film.",
    funFact:
      "Než tvůrci sáhli po nápadu se ženami ve sboru (souběžně s tím, jak francouzské četnictvo tou dobou skutečně otevíralo řady ženám), zvažovali úplně jiná pokračování — pomstu mimozemšťanů, let četníků do vesmíru nebo dokonce cestu v čase k bitvě u Waterloo. Čtyři nové „četnice“ si zahrály herečky Babeth Étienne, Catherine Serre, Nicaise Jean-Louis a Sophie Michaud; filmová sláva ale žádné z nich dlouho nevydržela a většina se brzy filmu i herectví vzdala.",
    note: "Poslední film Louise de Funèse i režiséra Jeana Giraulta.",
  },
];

export function findMockFilm(slug: string): MockFilm | undefined {
  return MOCK_FILMS.find((f) => f.slug === slug);
}

export function findMockFilmByTitle(title: string): MockFilm | undefined {
  return MOCK_FILMS.find((f) => f.title === title);
}
