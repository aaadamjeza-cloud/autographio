-- Fixes 0009_price_reports_submission.sql, which was written as if the
-- project still used Supabase Auth: it added `reported_by uuid references
-- auth.users(id)` and policies keyed on auth.uid().
--
-- Since 0005_clerk_auth.sql, Clerk owns the user record and every owner
-- column on every other table is `text` holding a Clerk id ("user_2NNRs…").
-- auth.uid() casts the JWT's `sub` claim to ::uuid, which throws on one, so
-- as shipped 0009 could never match a real submitter — and the app sends
-- that same text id into the uuid column, which fails outright. Reporting a
-- price was therefore broken end to end.
--
-- This brings price_reports in line with the rest of the schema. Safe to run
-- on a table that has no rows yet (nothing could have been inserted through
-- the broken policy); the `using (false)` cast below would only drop data if
-- some row had somehow been written directly with a service-role client.
--
-- Review before running; this is not applied automatically.

drop policy if exists "price_reports: authenticated insert own pending" on price_reports;
drop policy if exists "price_reports: reporter select own" on price_reports;

alter table price_reports drop constraint if exists price_reports_reported_by_fkey;
alter table price_reports alter column reported_by type text using reported_by::text;

create policy "price_reports: authenticated insert own pending" on price_reports
  for insert
  with check (
    clerk_user_id() is not null
    and clerk_user_id() = reported_by
    and status = 'pending'
  );

create policy "price_reports: reporter select own" on price_reports
  for select using (clerk_user_id() = reported_by);
