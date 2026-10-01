-- One-time backfill: existing autograph_requests rows were only ever saved
-- with custom_person_name (0007 made person_id nullable specifically
-- because `persons` was empty — see that migration's comment). Now that
-- 0008 has seeded `persons` for real, any of those older rows that happen
-- to name a catalog person still won't count toward
-- get_person_request_stats (0002) until they get a person_id too — new
-- requests set it themselves (see components/RequestsClient.tsx), but past
-- ones need this run once.
--
-- Case-insensitive exact match only, on purpose: no fuzzy matching that
-- could silently attach someone's request to the wrong person.
--
-- Run this AFTER 0008_seed_persons.sql.
-- Review before running; this is not applied automatically.

update autograph_requests ar
set person_id = p.id
from persons p
where ar.person_id is null
  and ar.custom_person_name is not null
  and lower(p.name) = lower(ar.custom_person_name);
