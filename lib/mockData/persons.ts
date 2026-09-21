// Temporary mock catalog — stands in for the `persons` table until the
// Supabase project exists and migration 0001 is applied. Real entries will
// carry a Wikimedia Commons portrait with author/license/source per the
// project's portrait rule; these placeholders intentionally don't, since the
// attribution data hasn't been sourced yet.
export type PersonCategory = "herec" | "hudebnik" | "sportovec" | "spisovatel" | "jine";

export type FilmographyEntry = {
  year: number;
  title: string;
  note?: string;
};

export type PriceHistoryPoint = {
  year: number;
  price: number;
};

export type SaleListing = {
  title: string;
  url: string;
};

export type MockPerson = {
  slug: string;
  name: string;
  category: PersonCategory;
  birthYear: number;
  deathYear: number | null;
  nationality: string;
  bio?: string;
  funFact?: string;
  filmography?: FilmographyEntry[];
  marketPrice?: number;
  priceHistory?: PriceHistoryPoint[];
  saleListings?: SaleListing[];
};

export const CATEGORY_LABELS: Record<PersonCategory, string> = {
  herec: "Herec",
  hudebnik: "Hudebník",
  sportovec: "Sportovec",
  spisovatel: "Spisovatel",
  jine: "Jiné",
};

export const CATEGORY_COLORS: Record<PersonCategory, string> = {
  herec: "#7F77DD",
  hudebnik: "#D85A30",
  sportovec: "#1D9E75",
  spisovatel: "#B08D57",
  jine: "#71717A",
};

export const MOCK_PERSONS: MockPerson[] = [
  {
    slug: "louis-de-funes",
    name: "Louis de Funès",
    category: "herec",
    birthYear: 1914,
    deathYear: 1983,
    nationality: "Francie",
    bio: "Louis de Funès se přes dvacet let živil vedlejšími a nekreditovanými rolemi, než se ve svých padesáti letech stal filmovou hvězdou díky Četníkovi ze Saint-Tropez a Fantomasovi (oba 1964). V druhé polovině 60. a v 70. letech byl nejlépe placeným a nejpopulárnějším hercem ve Francii — jeho Velký flám (1966) byl přes tři dekády nejnavštěvovanějším francouzským filmem v historii kin. Naposledy se na plátně objevil ve filmu Četník a četnice, který měl premiéru rok před jeho smrtí.",
    funFact: "Než se proslavil jako herec, živil se mimo jiné jako jazzový pianista v pařížských barech. Na vrcholu slávy se pak stal vášnivým zahradníkem — na svém zámku Clermont v Anjou vypěstoval růžovou zahradu, která dodnes patří k nejkrásnějším ve Francii a je otevřená veřejnosti.",
    marketPrice: 35000,
    priceHistory: [
      { year: 2020, price: 10000 },
      { year: 2024, price: 32000 },
    ],
    saleListings: [
      {
        title: "Louis de Funès — francouzský herec, autogram/podpis",
        url: "https://aukro.cz/louis-de-funes-francouzsky-herec-autogram-podpis-7072320906",
      },
      {
        title: "Louis de Funès — podpis a věnování na fotografii s rukopisnou obálkou",
        url: "https://aukro.cz/louis-de-funes-podpis-a-venovani-na-fotografii-s-rukopisnou-obalkou-6966525273",
      },
    ],
    filmography: [
      { year: 1982, title: "Četník a četnice" },
      { year: 1981, title: "Zelňačka" },
      { year: 1980, title: "Lakomec" },
      { year: 1979, title: "Četník a mimozemšťané" },
      { year: 1978, title: "Jeden hot a druhý čehý" },
      { year: 1976, title: "Křidýlko nebo stehýnko" },
      { year: 1973, title: "Dobrodružství rabína Jákoba" },
      { year: 1971, title: "Jo" },
      { year: 1971, title: "Na stromě" },
      { year: 1971, title: "Pošetilost mocných" },
      { year: 1970, title: "Četník ve výslužbě" },
      { year: 1970, title: "Piti Piti Pa" },
      { year: 1969, title: "Hibernatus" },
      { year: 1968, title: "Četník se žení" },
      { year: 1968, title: "Tetovaný" },
      { year: 1967, title: "Fantomas kontra Scotland Yard" },
      { year: 1967, title: "Oskar" },
      { year: 1967, title: "Senzační prázdniny" },
      { year: 1967, title: "Tonoucí se stébla chytá" },
      { year: 1966, title: "Grand restaurant pana Septima" },
      { year: 1966, title: "Velký flám" },
      { year: 1965, title: "Četník v New Yorku" },
      { year: 1965, title: "Fantomas se zlobí" },
      { year: 1965, title: "Smolař" },
      { year: 1965, title: "Velký pán" },
      { year: 1964, title: "Četník ze Saint Tropez" },
      { year: 1964, title: "Fantomas" },
      { year: 1964, title: "Jak vykrást banku" },
      { year: 1964, title: "Nebožtíci" },
      { year: 1964, title: "Une souris chez les hommes" },
      { year: 1963, title: "Karamboly" },
      { year: 1963, title: "Les Veinards" },
      { year: 1963, title: "Pouic Pouic" },
      { year: 1962, title: "Ďábel a desatero" },
      { year: 1962, title: "Gentleman z Epsomu" },
      { year: 1962, title: "Le Crime ne paie pas" },
      { year: 1962, title: "Nous irons à Deauville" },
      { year: 1962, title: "Un clair de lune a Maubeuge" },
      { year: 1961, title: "Candide ou l'optimisme au XXe siècle" },
      { year: 1961, title: "Kapitán Fracasse" },
      { year: 1961, title: "La Vendetta" },
      { year: 1961, title: "Výhodná koupě" },
      { year: 1960, title: "Certains l'aiment... froide" },
      { year: 1960, title: "Dans l'eau... qui fait des bulles !" },
      { year: 1960, title: "Les Tortillards" },
      { year: 1959, title: "Filutové" },
      { year: 1959, title: "Mon pote le gitan" },
      { year: 1959, title: "Totò v Madridu" },
      { year: 1958, title: "La Vie à deux" },
      { year: 1958, title: "Nevídáno, neslýcháno" },
      { year: 1958, title: "Taxi, maringotka a korida" },
      { year: 1957, title: "Smolař" },
      { year: 1956, title: "Bébés à gogo" },
      { year: 1956, title: "Bonjour sourire !" },
      { year: 1956, title: "La Bande à Papa" },
      { year: 1956, title: "La Puce à l'oreille", note: "TV film" },
      { year: 1956, title: "Napříč Paříží" },
      { year: 1956, title: "O délku hlavy" },
      { year: 1956, title: "Otec, matka, moje žena a já" },
      { year: 1956, title: "Si Paris nous était conté" },
      { year: 1956, title: "Zákon ulic" },
      { year: 1955, title: "Frou-Frou" },
      { year: 1955, title: "Husaři" },
      { year: 1955, title: "Ingrid - Die Geschichte eines Fotomodells" },
      { year: 1955, title: "Les Pépées font la loi" },
      { year: 1955, title: "L'Impossible Monsieur Pipelet" },
      { year: 1955, title: "Mädchen ohne Grenzen" },
      { year: 1955, title: "Napoléon" },
      { year: 1954, title: "Beránek s pěti nohama" },
      { year: 1954, title: "Escalier de service" },
      { year: 1954, title: "Faites-moi confiance" },
      { year: 1954, title: "Fraternité", note: "TV film" },
      { year: 1954, title: "Huis clos" },
      { year: 1954, title: "La Reine Margot" },
      { year: 1954, title: "Le Chevalier de la nuit" },
      { year: 1954, title: "Les Corsaires du Bois de Boulogne" },
      { year: 1954, title: "Le Secret d'Hélène Marimon" },
      { year: 1954, title: "Les Hommes ne pensent qu'à ça" },
      { year: 1954, title: "Les Impures" },
      { year: 1954, title: "Les Intrigantes" },
      { year: 1954, title: "Mam'zelle Nitouche" },
      { year: 1954, title: "Osení" },
      { year: 1954, title: "Otec, matka, služka a já" },
      { year: 1954, title: "Poisson d'avril" },
      { year: 1954, title: "Poprask v kabaretu" },
      { year: 1954, title: "Scenes de ménage" },
      { year: 1954, title: "Tourments" },
      { year: 1953, title: "Au diable la vertu" },
      { year: 1953, title: "Capitaine Pantoufle" },
      { year: 1953, title: "La Vie d'un honnête homme" },
      { year: 1953, title: "Légère et court vêtue" },
      { year: 1953, title: "Le Rire" },
      { year: 1953, title: "Les Compagnes de la nuit" },
      { year: 1953, title: "Les Dents longues" },
      { year: 1953, title: "L'Etrange Désir de monsieur Bard" },
      { year: 1953, title: "Ložnice dospívajících dívek" },
      { year: 1953, title: "Mon Frangin du Senegal" },
      { year: 1953, title: "Nevinní v Paříži" },
      { year: 1952, title: "Agence matrimoniale" },
      { year: 1952, title: "Boží soud" },
      { year: 1952, title: "Elle et moi" },
      { year: 1952, title: "Ils étaient cinq" },
      { year: 1952, title: "Je l'ai été trois fois" },
      { year: 1952, title: "La Fugue de Monsieur Perle" },
      { year: 1952, title: "La Jungle en folie" },
      { year: 1952, title: "L'Amour n'est pas un péché" },
      { year: 1952, title: "Les Loups chassent la nuit" },
      { year: 1952, title: "Les Sept Péchés capitaux" },
      { year: 1952, title: "Moineaux de Paris" },
      { year: 1952, title: "Monsieur Leguignon Lampiste" },
      { year: 1952, title: "Pan Taxi" },
      { year: 1952, title: "Počestná děvka" },
      { year: 1951, title: "Adresát neznámý" },
      { year: 1951, title: "Bibi Fricotin" },
      { year: 1951, title: "Boniface Somnambule" },
      { year: 1951, title: "Folie douce" },
      { year: 1951, title: "Knock" },
      { year: 1951, title: "L'Amant de paille" },
      { year: 1951, title: "La Poison" },
      { year: 1951, title: "La Rose rouge" },
      { year: 1951, title: "La Vie est un jeu" },
      { year: 1951, title: "Le Dindon" },
      { year: 1951, title: "Le Roi du bla bla bla" },
      { year: 1951, title: "Le Voyage en Amérique" },
      { year: 1951, title: "Ma femme est formidable" },
      { year: 1951, title: "Žádná dovolená pro pana starostu" },
      { year: 1950, title: "Adémai au poteau-frontière" },
      { year: 1950, title: "È più facile che un cammello..." },
      { year: 1950, title: "La Rue sans loi" },
      { year: 1950, title: "L'Inconnue de Montréal" },
      { year: 1950, title: "Mon ami Sainfoin" },
      { year: 1950, title: "Na shledanou, pane Grocku" },
      { year: 1950, title: "Pas de week-end pour notre amour" },
      { year: 1950, title: "Un certain monsieur" },
      { year: 1949, title: "Du Guesclin" },
      { year: 1949, title: "Je n'aime que toi" },
      { year: 1949, title: "Millionnaires d'un jour" },
      { year: 1949, title: "Mission à Tanger" },
      { year: 1949, title: "Rendez-vous avec la chance" },
      { year: 1949, title: "Vient de paraître" },
      { year: 1948, title: "Croisière pour l'inconnu" },
      { year: 1947, title: "Antoine a Antoinetta" },
      { year: 1947, title: "Dernier refuge" },
      { year: 1947, title: "Six heures à perdre" },
      { year: 1946, title: "La Tentation de Barbizon" },
    ],
  },
];

export function findMockPerson(slug: string): MockPerson | undefined {
  return MOCK_PERSONS.find((p) => p.slug === slug);
}
