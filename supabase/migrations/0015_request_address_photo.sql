-- Mail-request evidence: full address, what was enclosed, and a photo of
-- what came back. Mirrors the item-photos private-bucket + signed-URL
-- pattern from 0003_storage.sql, updated for Clerk auth (see 0005) —
-- clerk_user_id() already exists from that migration.
--
-- Review before running; this is not applied automatically.

alter table autograph_requests
  add column address text,
  add column enclosed_note text,
  add column received_photo_path text;

-- Private bucket, one photo per request. Path convention:
-- {clerk_user_id}/{request_id}/{uuid}.webp — enforced below, same as
-- item-photos. PNG allowed from the start (item-photos only got this in
-- 0006, as a fallback for Safari's canvas.toBlob() behavior).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('request-photos', 'request-photos', false, 8388608, array['image/webp', 'image/png'])
on conflict (id) do nothing;

create policy "request-photos: owner select" on storage.objects
  for select using (
    bucket_id = 'request-photos'
    and (storage.foldername(name))[1] = clerk_user_id()
  );

create policy "request-photos: owner insert" on storage.objects
  for insert with check (
    bucket_id = 'request-photos'
    and (storage.foldername(name))[1] = clerk_user_id()
  );

create policy "request-photos: owner update" on storage.objects
  for update using (
    bucket_id = 'request-photos'
    and (storage.foldername(name))[1] = clerk_user_id()
  );

create policy "request-photos: owner delete" on storage.objects
  for delete using (
    bucket_id = 'request-photos'
    and (storage.foldername(name))[1] = clerk_user_id()
  );
