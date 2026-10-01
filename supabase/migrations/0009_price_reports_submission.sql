-- Lets a signed-in collector submit their own price report instead of only
-- the admin (service role) client writing rows — see the "out of MVP scope"
-- note left on price_reports in 0001_init.sql; this is that import path.
--
-- `reported_by` is new: 0001's price_reports had no submitter column at all
-- (it assumed only the admin client would ever write here), so there was
-- nothing an owner-style RLS policy could check. Every other write table in
-- this project ties inserts to `auth.uid()` — this brings price_reports in
-- line and gives future moderation something to trace a bad report back to.
--
-- Rows always land as status = 'pending' (the insert check forces it,
-- regardless of what the client sends) — there's still no moderator role,
-- so an admin flips a report to 'approved' by hand in the SQL editor before
-- it appears on any public person page (RLS already only exposes
-- status = 'approved' rows — see 0001).
--
-- Review before running; this is not applied automatically.

alter table price_reports
  add column reported_by uuid references auth.users(id) on delete set null;

create index price_reports_reported_by_idx on price_reports(reported_by);

create policy "price_reports: authenticated insert own pending" on price_reports
  for insert
  with check (
    auth.uid() = reported_by
    and status = 'pending'
  );

create policy "price_reports: reporter select own" on price_reports
  for select using (auth.uid() = reported_by);
