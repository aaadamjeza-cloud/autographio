-- Let autograph_requests reference a person by free-text name, same as
-- portfolio_items already does (see 0001_init.sql). The `persons` catalog
-- table is still empty — the app runs on lib/mockData/persons.ts (see
-- 0004's comment) — so `person_id not null references persons(id)` made it
-- impossible to log a request against any real row. Mirrors
-- portfolio_items_person_or_custom_name exactly.
--
-- Review before running; this is not applied automatically.

alter table autograph_requests
  alter column person_id drop not null,
  add column custom_person_name text,
  add constraint autograph_requests_person_or_custom_name check (
    person_id is not null or custom_person_name is not null
  );
