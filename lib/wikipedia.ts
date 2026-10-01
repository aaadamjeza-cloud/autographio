// Direct-guess link to the Czech Wikipedia article for a name — no
// wikidata_id round-trip needed (persons.wikidata_id is unpopulated for
// every seeded row today, see 0008_seed_persons.sql). Wikipedia redirects
// handle most title variants, and a missing article just shows Wikipedia's
// own "page doesn't exist" screen rather than a dead link.
export function wikipediaUrl(name: string): string {
  return `https://cs.wikipedia.org/wiki/${encodeURIComponent(name.trim().replace(/\s+/g, "_"))}`;
}
