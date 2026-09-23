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
    note: "Poslední film Louise de Funèse i režiséra Jeana Giraulta.",
  },
];

export function findMockFilm(slug: string): MockFilm | undefined {
  return MOCK_FILMS.find((f) => f.slug === slug);
}

export function findMockFilmByTitle(title: string): MockFilm | undefined {
  return MOCK_FILMS.find((f) => f.title === title);
}
