-- Person portraits go live immediately for anyone signed in today — no
-- review at all. Per chat: only the admin (see lib/admin.ts's ADMIN_USER_IDS
-- allowlist) may write person_portraits directly; everyone else's photo
-- goes into a pending queue the admin reviews at /nevyrizene, mirroring how
-- persons.status='pending' already works for new-person suggestions.
--
-- Enforcement lives in application code (app/osobnosti/[slug]/portraitActions.ts,
-- via isAdmin() + the service-role client), not in an RLS predicate — by the
-- same deliberate design lib/admin.ts already uses for persons/nevyrizene:
-- there is no admin flag in the database for a signed-in user to read or
-- write. So the old "any authenticated user" policies are just dropped,
-- with no replacement insert/update/delete policy at all; only the
-- service-role client (which bypasses RLS) can write this table now.
--
-- Review before running; this is not applied automatically.

drop policy if exists "person_portraits: authenticated insert" on person_portraits;
drop policy if exists "person_portraits: authenticated update" on person_portraits;
drop policy if exists "person_portraits: authenticated delete" on person_portraits;

create table person_portrait_submissions (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  storage_path text not null,
  submitted_by text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table person_portrait_submissions enable row level security;

-- A submitter can see their own submissions (e.g. to show "awaiting
-- review" state later) but not anyone else's, and can only ever insert as
-- themselves. No update/delete policy for regular users — approving or
-- rejecting is an admin-only action, via the service-role client in
-- app/nevyrizene/actions.ts, same as persons.status='pending'.
create policy "person_portrait_submissions: owner select own" on person_portrait_submissions
  for select using (clerk_user_id() = submitted_by);
create policy "person_portrait_submissions: owner insert" on person_portrait_submissions
  for insert with check (clerk_user_id() is not null and clerk_user_id() = submitted_by);
