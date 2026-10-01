-- Switch authentication from Supabase Auth to Clerk (Supabase's
-- "Third-Party Auth" integration).
--
-- Clerk user ids look like "user_2NNRs2gLl2X..." — not UUIDs — while every
-- auth-owned column here was `uuid references auth.users(id)`. Supabase's
-- own auth.uid() helper casts the JWT's `sub` claim to ::uuid, which throws
-- on a Clerk id, so it can't be reused as-is. This migration:
--   1. drops the FK to auth.users on every such column (Clerk owns the user
--      record now, not auth.users) and widens the column to `text`,
--   2. adds a clerk_user_id() helper that reads the JWT's `sub` claim as
--      text via auth.jwt(), and
--   3. rewrites every RLS policy that used auth.uid() to use clerk_user_id().
--
-- Prerequisites (do these BEFORE running this file):
--   - Enable Clerk as a Third-Party Auth provider in the Supabase dashboard
--     (Authentication → Sign In / Providers → Clerk), pointing it at your
--     Clerk instance's Frontend API / issuer URL. Without this, auth.jwt()
--     won't recognize a Clerk-issued token and every policy below will just
--     deny access.
--   - Confirm there's no real user data worth keeping in profiles,
--     portfolio_items, item_photos, autograph_requests, content_reports or
--     person_portraits — this migration does NOT map old Supabase
--     auth.users ids to new Clerk ids, it just changes the column type.
--
-- Review before running; this is not applied automatically.

create or replace function clerk_user_id()
returns text
language sql
stable
as $$
  select nullif((auth.jwt() ->> 'sub'), '');
$$;

-- ── profiles ─────────────────────────────────────────────────────────────
drop policy "profiles: owner select" on profiles;
drop policy "profiles: owner insert" on profiles;
drop policy "profiles: owner update" on profiles;
drop policy "profiles: owner delete" on profiles;

alter table profiles drop constraint if exists profiles_id_fkey;
alter table profiles alter column id type text using id::text;

create policy "profiles: owner select" on profiles
  for select using (clerk_user_id() = id);
create policy "profiles: owner insert" on profiles
  for insert with check (clerk_user_id() = id);
create policy "profiles: owner update" on profiles
  for update using (clerk_user_id() = id) with check (clerk_user_id() = id);
create policy "profiles: owner delete" on profiles
  for delete using (clerk_user_id() = id);

-- ── persons.created_by ───────────────────────────────────────────────────
drop policy "persons: creator reads own pending" on persons;

alter table persons drop constraint if exists persons_created_by_fkey;
alter table persons alter column created_by type text using created_by::text;

create policy "persons: creator reads own pending" on persons
  for select using (clerk_user_id() = created_by);

-- ── portfolio_items ──────────────────────────────────────────────────────
drop policy "portfolio_items: owner select" on portfolio_items;
drop policy "portfolio_items: owner insert" on portfolio_items;
drop policy "portfolio_items: owner update" on portfolio_items;
drop policy "portfolio_items: owner delete" on portfolio_items;

alter table portfolio_items drop constraint if exists portfolio_items_user_id_fkey;
alter table portfolio_items alter column user_id type text using user_id::text;

create policy "portfolio_items: owner select" on portfolio_items
  for select using (clerk_user_id() = user_id);
create policy "portfolio_items: owner insert" on portfolio_items
  for insert with check (clerk_user_id() = user_id);
create policy "portfolio_items: owner update" on portfolio_items
  for update using (clerk_user_id() = user_id) with check (clerk_user_id() = user_id);
create policy "portfolio_items: owner delete" on portfolio_items
  for delete using (clerk_user_id() = user_id);

-- ── item_photos ──────────────────────────────────────────────────────────
drop policy "item_photos: owner select" on item_photos;
drop policy "item_photos: owner insert" on item_photos;
drop policy "item_photos: owner update" on item_photos;
drop policy "item_photos: owner delete" on item_photos;

alter table item_photos drop constraint if exists item_photos_user_id_fkey;
alter table item_photos alter column user_id type text using user_id::text;

create policy "item_photos: owner select" on item_photos
  for select using (clerk_user_id() = user_id);
create policy "item_photos: owner insert" on item_photos
  for insert with check (clerk_user_id() = user_id);
create policy "item_photos: owner update" on item_photos
  for update using (clerk_user_id() = user_id) with check (clerk_user_id() = user_id);
create policy "item_photos: owner delete" on item_photos
  for delete using (clerk_user_id() = user_id);

-- ── autograph_requests ───────────────────────────────────────────────────
drop policy "autograph_requests: owner select" on autograph_requests;
drop policy "autograph_requests: owner insert" on autograph_requests;
drop policy "autograph_requests: owner update" on autograph_requests;
drop policy "autograph_requests: owner delete" on autograph_requests;

alter table autograph_requests drop constraint if exists autograph_requests_user_id_fkey;
alter table autograph_requests alter column user_id type text using user_id::text;

create policy "autograph_requests: owner select" on autograph_requests
  for select using (clerk_user_id() = user_id);
create policy "autograph_requests: owner insert" on autograph_requests
  for insert with check (clerk_user_id() = user_id);
create policy "autograph_requests: owner update" on autograph_requests
  for update using (clerk_user_id() = user_id) with check (clerk_user_id() = user_id);
create policy "autograph_requests: owner delete" on autograph_requests
  for delete using (clerk_user_id() = user_id);

-- ── content_reports ──────────────────────────────────────────────────────
drop policy "content_reports: reporter select own" on content_reports;
drop policy "content_reports: reporter insert" on content_reports;

alter table content_reports drop constraint if exists content_reports_reporter_id_fkey;
alter table content_reports alter column reporter_id type text using reporter_id::text;

create policy "content_reports: reporter select own" on content_reports
  for select using (clerk_user_id() = reporter_id);
create policy "content_reports: reporter insert" on content_reports
  for insert with check (clerk_user_id() = reporter_id);

-- ── person_portraits ─────────────────────────────────────────────────────
drop policy "person_portraits: authenticated insert" on person_portraits;
drop policy "person_portraits: authenticated update" on person_portraits;
drop policy "person_portraits: authenticated delete" on person_portraits;

alter table person_portraits drop constraint if exists person_portraits_uploaded_by_fkey;
alter table person_portraits alter column uploaded_by type text using uploaded_by::text;

create policy "person_portraits: authenticated insert" on person_portraits
  for insert with check (clerk_user_id() is not null and clerk_user_id() = uploaded_by);
create policy "person_portraits: authenticated update" on person_portraits
  for update using (clerk_user_id() is not null) with check (clerk_user_id() = uploaded_by);
create policy "person_portraits: authenticated delete" on person_portraits
  for delete using (clerk_user_id() is not null);

-- ── storage: item-photos ─────────────────────────────────────────────────
-- Path convention {user_id}/{item_id}/{uuid}.webp is unchanged — the first
-- segment is now a Clerk id instead of a Supabase auth uuid.
drop policy "item-photos: owner select" on storage.objects;
drop policy "item-photos: owner insert" on storage.objects;
drop policy "item-photos: owner update" on storage.objects;
drop policy "item-photos: owner delete" on storage.objects;

create policy "item-photos: owner select" on storage.objects
  for select using (
    bucket_id = 'item-photos'
    and (storage.foldername(name))[1] = clerk_user_id()
  );
create policy "item-photos: owner insert" on storage.objects
  for insert with check (
    bucket_id = 'item-photos'
    and (storage.foldername(name))[1] = clerk_user_id()
  );
create policy "item-photos: owner update" on storage.objects
  for update using (
    bucket_id = 'item-photos'
    and (storage.foldername(name))[1] = clerk_user_id()
  );
create policy "item-photos: owner delete" on storage.objects
  for delete using (
    bucket_id = 'item-photos'
    and (storage.foldername(name))[1] = clerk_user_id()
  );

-- ── storage: person-portraits ────────────────────────────────────────────
drop policy "person-portraits: authenticated insert" on storage.objects;
drop policy "person-portraits: authenticated update" on storage.objects;
drop policy "person-portraits: authenticated delete" on storage.objects;

create policy "person-portraits: authenticated insert" on storage.objects
  for insert with check (bucket_id = 'person-portraits' and clerk_user_id() is not null);
create policy "person-portraits: authenticated update" on storage.objects
  for update using (bucket_id = 'person-portraits' and clerk_user_id() is not null);
create policy "person-portraits: authenticated delete" on storage.objects
  for delete using (bucket_id = 'person-portraits' and clerk_user_id() is not null);
