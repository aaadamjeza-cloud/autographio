-- Lets a signed-in collector propose a new person for the catalog, instead
-- of entries only ever arriving through a seed migration — see the "no
-- public INSERT/UPDATE/DELETE policy … the MVP has no 'submit a person'
-- screen yet" note left on persons in 0001_init.sql; this is that screen's
-- backing policy.
--
-- Submissions always land as status = 'pending' (the insert check forces
-- it, whatever the client sends), so nothing a visitor types shows up on a
-- public catalog page before a human has looked at it. 0001 already has the
-- matching read policies: the public only ever sees status = 'approved',
-- while the submitter can still read back their own pending row.
--
-- Approving/rejecting runs through the service-role client instead of a
-- policy (see lib/supabase/admin.ts) — same as 0001 anticipated — so no
-- UPDATE/DELETE policy is added here on purpose: a signed-in user must not
-- be able to flip their own submission to 'approved'.
--
-- New columns:
--   gender — drives which silhouette PersonAvatar shows until a photo is
--            uploaded; the app has always needed it (see MockPerson) and
--            0001's table simply never carried it.
--   bio    — without it an approved submission renders as an empty page.
--
-- Review before running; this is not applied automatically.

alter table persons
  add column gender text check (gender is null or gender in ('m', 'f')),
  add column bio text;

create index persons_created_by_idx on persons(created_by);

-- clerk_user_id(), not auth.uid(): since 0005_clerk_auth.sql the owner
-- columns hold Clerk ids as text, and auth.uid() casts the JWT's `sub` to
-- ::uuid, which throws on one.
create policy "persons: authenticated insert own pending" on persons
  for insert
  with check (
    clerk_user_id() is not null
    and clerk_user_id() = created_by
    and status = 'pending'
  );
