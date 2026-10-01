-- Portrait photos for catalog "persons", uploaded by signed-in users
-- through the app's photo picker (see components/PersonPortrait.tsx).
--
-- Slug-keyed rather than person_id-keyed: the real `persons` catalog table
-- (migration 0001) is still empty — the app runs on lib/mockData/persons.ts
-- for now — so there's nothing to foreign-key against yet. Once persons is
-- seeded for real, this can gain a person_id column and the slug column can
-- be dropped; nothing about the storage layout needs to change.
--
-- One portrait per slug: a re-upload overwrites the previous storage object
-- (upsert, same path) and the row (upsert on slug).
--
-- MVP note: any signed-in user can currently set/replace any person's
-- portrait — there's no admin/moderator role yet, and this project has a
-- single real user so far. Tighten write access to an admin role (the same
-- way persons/price_reports already expect admin-only writes) before this
-- opens up to public sign-ups.
create table person_portraits (
  slug text primary key,
  storage_path text not null,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table person_portraits enable row level security;

create policy "person_portraits: public select" on person_portraits
  for select using (true);
create policy "person_portraits: authenticated insert" on person_portraits
  for insert with check (auth.uid() is not null and auth.uid() = uploaded_by);
create policy "person_portraits: authenticated update" on person_portraits
  for update using (auth.uid() is not null) with check (auth.uid() = uploaded_by);
create policy "person_portraits: authenticated delete" on person_portraits
  for delete using (auth.uid() is not null);

-- Public bucket: these are photos of public figures shown on public catalog
-- pages, meant to be visible without auth or signed URLs — unlike the
-- private item-photos bucket (0003), which holds a collector's own photos
-- of their own items.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('person-portraits', 'person-portraits', true, 2097152, array['image/webp'])
on conflict (id) do nothing;

create policy "person-portraits: public read" on storage.objects
  for select using (bucket_id = 'person-portraits');
create policy "person-portraits: authenticated insert" on storage.objects
  for insert with check (bucket_id = 'person-portraits' and auth.uid() is not null);
create policy "person-portraits: authenticated update" on storage.objects
  for update using (bucket_id = 'person-portraits' and auth.uid() is not null);
create policy "person-portraits: authenticated delete" on storage.objects
  for delete using (bucket_id = 'person-portraits' and auth.uid() is not null);
