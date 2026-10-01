import type { FilmographyEntry, MockPerson, PersonCategory } from "@/lib/mockData/persons";

// persons.category is an English enum in the database (see 0001_init.sql),
// while the app's own catalog type keys off the Czech values it renders
// labels and colors from — these two maps are the only place that seam is
// spelled out.
export type DbPersonCategory = "actor" | "musician" | "athlete" | "writer" | "other";

export const DB_CATEGORY_TO_APP: Record<DbPersonCategory, PersonCategory> = {
  actor: "herec",
  musician: "hudebnik",
  athlete: "sportovec",
  writer: "spisovatel",
  other: "jine",
};

export const APP_CATEGORY_TO_DB: Record<PersonCategory, DbPersonCategory> = {
  herec: "actor",
  hudebnik: "musician",
  sportovec: "athlete",
  spisovatel: "writer",
  jine: "other",
};

export type DbPerson = {
  id: string;
  slug: string;
  name: string;
  category: DbPersonCategory;
  gender: "m" | "f" | null;
  birth_year: number | null;
  death_year: number | null;
  nationality: string | null;
  bio: string | null;
  fun_fact: string | null;
  filmography: FilmographyEntry[] | null;
  market_price_min: number | null;
  market_price_max: number | null;
  status: "pending" | "approved";
  created_by: string | null;
  created_at: string;
};

export const DB_PERSON_COLUMNS =
  "id, slug, name, category, gender, birth_year, death_year, nationality, bio, fun_fact, filmography, market_price_min, market_price_max, status, created_by, created_at";

// Renders a database row through the same components as the code-defined
// entries in lib/mockData/persons.ts. A submitted person has no verified
// sales or sourced portrait yet — those sections simply don't render — but
// can carry the fun fact / filmography / price estimate a submitter typed
// in (see 0019_person_submission_extras.sql).
export function dbPersonToPerson(row: DbPerson): MockPerson {
  return {
    slug: row.slug,
    name: row.name,
    category: DB_CATEGORY_TO_APP[row.category] ?? "jine",
    gender: row.gender ?? "m",
    birthYear: row.birth_year ?? 0,
    deathYear: row.death_year,
    nationality: row.nationality ?? "",
    bio: row.bio ?? undefined,
    funFact: row.fun_fact ?? undefined,
    filmography: row.filmography ?? undefined,
    marketPriceMin: row.market_price_min ?? undefined,
    marketPriceMax: row.market_price_max ?? undefined,
  };
}

// Same shape as the catalog's existing slugs: diacritics stripped,
// lowercase, dash separated.
export function slugifyName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
