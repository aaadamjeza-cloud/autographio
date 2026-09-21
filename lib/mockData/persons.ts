// Temporary mock catalog — stands in for the `persons` table until the
// Supabase project exists and migration 0001 is applied. Real entries will
// carry a Wikimedia Commons portrait with author/license/source per the
// project's portrait rule; these placeholders intentionally don't, since the
// attribution data hasn't been sourced yet.
export type PersonCategory = "herec" | "hudebnik" | "sportovec" | "spisovatel" | "jine";

export type MockPerson = {
  slug: string;
  name: string;
  category: PersonCategory;
  birthYear: number;
  deathYear: number | null;
  nationality: string;
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
  { slug: "zdenek-sverak", name: "Zdeněk Svěrák", category: "herec", birthYear: 1936, deathYear: null, nationality: "Česko" },
  { slug: "louis-de-funes", name: "Louis de Funès", category: "herec", birthYear: 1914, deathYear: 1983, nationality: "Francie" },
  { slug: "karel-gott", name: "Karel Gott", category: "hudebnik", birthYear: 1939, deathYear: 2019, nationality: "Česko" },
  { slug: "jiri-suchy", name: "Jiří Suchý", category: "spisovatel", birthYear: 1931, deathYear: null, nationality: "Česko" },
  { slug: "emil-zatopek", name: "Emil Zátopek", category: "sportovec", birthYear: 1922, deathYear: 2000, nationality: "Česko" },
  { slug: "sean-connery", name: "Sean Connery", category: "herec", birthYear: 1930, deathYear: 2020, nationality: "Skotsko" },
  { slug: "helena-vondrackova", name: "Helena Vondráčková", category: "hudebnik", birthYear: 1947, deathYear: null, nationality: "Česko" },
  { slug: "jaromir-jagr", name: "Jaromír Jágr", category: "sportovec", birthYear: 1972, deathYear: null, nationality: "Česko" },
];

export function findMockPerson(slug: string): MockPerson | undefined {
  return MOCK_PERSONS.find((p) => p.slug === slug);
}
