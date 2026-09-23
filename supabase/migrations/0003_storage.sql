-- Private Storage bucket for collection-item photos.
-- Path convention: {user_id}/{item_id}/{uuid}.webp — enforced by the RLS
-- policies below (first path segment must equal auth.uid()).
--
-- Bucket stays PRIVATE even for photos with item_photos.is_public = true —
-- there is no public SELECT policy here on purpose. Serving a "public"
-- photo to someone who isn't its owner goes through a server route that
-- checks item_photos.is_public with the admin client, then mints a
-- short-lived signed URL — that keeps the one "is this actually public"
-- decision in application code instead of duplicated into a Storage policy
-- that would have to reach into item_photos itself.
--
-- Account/item deletion must also remove the matching Storage objects
-- (storage.objects rows don't cascade from portfolio_items/auth.users) —
-- that's done in application code with the admin client, not here.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('item-photos', 'item-photos', false, 8388608, array['image/webp'])
on conflict (id) do nothing;

create policy "item-photos: owner select" on storage.objects
  for select using (
    bucket_id = 'item-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "item-photos: owner insert" on storage.objects
  for insert with check (
    bucket_id = 'item-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "item-photos: owner update" on storage.objects
  for update using (
    bucket_id = 'item-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "item-photos: owner delete" on storage.objects
  for delete using (
    bucket_id = 'item-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
