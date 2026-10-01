-- Photos of a person's actual autograph, uploaded by collectors and shown
-- publicly in a gallery on that person's page.
--
-- Distinct from both existing photo features:
--   person_portraits (0004) — one *portrait of the person's face* per slug,
--     public, overwritten on re-upload.
--   item_photos (0001/0003) — a collector's photos of their *own item*,
--     private, owner-only, never shown to anyone else.
-- This is the third case: many public photos per person, each attributed to
-- whoever contributed it.
--
-- Keyed on person_id (not slug like 0004) because `persons` is seeded for
-- real now (0008), so there is finally something to foreign-key against.
--
-- Review before running; this is not applied automatically.

create table signature_photos (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references persons(id) on delete cascade,
  -- Clerk id as text, matching every other owner column since 0005. Left
  -- nullable and not foreign-keyed: a contributor may delete their account
  -- (see app/api/account/delete) without taking the community's photos of
  -- a public figure with them — the photo just loses its attribution.
  uploaded_by text,
  storage_path text not null,
  -- The uploader's explicit "this photo is mine and I may publish it"
  -- tick, recorded per photo rather than assumed. `default false` plus the
  -- check means a row cannot exist without it: an insert that omits the
  -- field is rejected, so there is no path to a published photo nobody
  -- ever claimed. Kept alongside uploaded_by and created_at so a later
  -- takedown request can be answered with who confirmed what, and when.
  rights_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  constraint signature_photos_rights_confirmed check (rights_confirmed)
);

create index signature_photos_person_id_idx on signature_photos(person_id);
create index signature_photos_uploaded_by_idx on signature_photos(uploaded_by);

alter table signature_photos enable row level security;

create policy "signature_photos: public select" on signature_photos
  for select using (true);
create policy "signature_photos: authenticated insert own" on signature_photos
  for insert with check (clerk_user_id() is not null and clerk_user_id() = uploaded_by);
create policy "signature_photos: uploader delete own" on signature_photos
  for delete using (clerk_user_id() = uploaded_by);
-- No UPDATE policy: a photo is replaced by deleting and re-uploading, so
-- there's nothing to edit in place.

-- Cap per person enforced in the database, not just in the upload UI — the
-- client limit is a courtesy, this is the actual rule. search_path pinned
-- for the same reason as 0002's function.
create or replace function enforce_signature_photo_limit()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if (select count(*) from signature_photos where person_id = new.person_id) >= 6 then
    raise exception 'signature_photo_limit_reached'
      using hint = 'A person can have at most 6 signature photos.';
  end if;
  return new;
end;
$$;

create trigger signature_photos_limit
  before insert on signature_photos
  for each row execute function enforce_signature_photo_limit();

-- ── Storage ──────────────────────────────────────────────────────────────
-- Public bucket: these are photos of a public figure's signature on a
-- public catalog page, meant to load without auth — same reasoning as
-- person-portraits (0004), unlike the private item-photos bucket.
--
-- Path convention {uploader_clerk_id}/{person_id}/{uuid}.webp, enforced by
-- the policies below, so one contributor can never delete another's photo
-- from the bucket. (person-portraits took the looser "any signed-in user"
-- route; there's no reason to repeat that here.)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('signature-photos', 'signature-photos', true, 2097152, array['image/webp', 'image/png'])
on conflict (id) do nothing;

create policy "signature-photos: public read" on storage.objects
  for select using (bucket_id = 'signature-photos');
create policy "signature-photos: owner insert" on storage.objects
  for insert with check (
    bucket_id = 'signature-photos'
    and (storage.foldername(name))[1] = clerk_user_id()
  );
create policy "signature-photos: owner delete" on storage.objects
  for delete using (
    bucket_id = 'signature-photos'
    and (storage.foldername(name))[1] = clerk_user_id()
  );

-- ── Public display names ─────────────────────────────────────────────────
-- 0001 left profiles with no public SELECT policy and the note "add a
-- narrow view/policy for that when public photos ship" — this is that
-- moment: a gallery has to say who contributed each photo.
--
-- A view rather than an RLS policy because RLS can't restrict *columns*:
-- opening profiles for select would expose every column on the row. This
-- exposes exactly two, and only for users who left "zobrazovat jméno u
-- veřejných fotek" on. Everyone else simply has no row here, and the app
-- renders their photos unattributed.
--
-- security_invoker = false (the default, stated explicitly because it
-- matters): the view runs as its owner and so reads past profiles' RLS on
-- purpose. That is the whole point — it is the one narrow, reviewed hole,
-- and it can only ever return id + display_name of opted-in users.
--
-- Never exposes email or the Google profile name — per the project rule,
-- a public identity comes only from profiles.display_name.
create or replace view public_profiles
with (security_invoker = false) as
  select id, display_name
  from profiles
  where show_name_on_photos = true;

grant select on public_profiles to anon, authenticated;
