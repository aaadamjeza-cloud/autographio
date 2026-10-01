-- Return postage was hardcoded to two specific countries (fr_stamp/cz_stamp)
-- from when the app only tracked French/Czech requests. Now that "Země" is
-- a free country picker, postage needs to be country-agnostic: cash, a
-- stamp (from whichever country was picked), IRC, or other. Renaming an
-- enum value and adding a new one both work directly on Postgres 12+
-- (Supabase), no need to recreate the type or touch existing rows.
--
-- cz_stamp is left in place, just unused by the UI from here on — enums
-- can carry values nothing writes anymore without any downside, and
-- Postgres has no supported way to drop one.
--
-- Review before running; this is not applied automatically.

alter type return_postage_type rename value 'fr_stamp' to 'stamp';
alter type return_postage_type add value 'cash';
