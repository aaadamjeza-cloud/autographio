-- Lets a person suggestion (app/osobnosti/navrhnout) also carry the extra
-- catalog detail that was previously seed-only, written straight into
-- lib/mockData/persons.ts by hand: a fun fact, a filmography, and a
-- market-price estimate for when the submitter has no doložený prodej
-- (verified sale) to point at instead. Same reasoning 0011 already used to
-- add gender/bio here — without these, an approved submission would still
-- render as a mostly-empty page compared to a seeded entry.
--
-- filmography is jsonb, not a separate table — it's free-form display data
-- typed by the submitter, not something moderated row-by-row the way
-- price_reports is; the whole person submission is reviewed as one unit at
-- /nevyrizene, filmography included.
--
-- No new RLS policy needed — these are just columns added to the existing
-- `persons` table, and 0011's "authenticated insert own pending" policy
-- doesn't restrict which columns an insert can set.
--
-- Review before running; this is not applied automatically.

alter table persons
  add column fun_fact text,
  add column filmography jsonb,
  add column market_price_min numeric(12, 2),
  add column market_price_max numeric(12, 2);
