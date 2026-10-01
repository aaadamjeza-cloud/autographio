-- Safari's canvas.toBlob() doesn't reliably encode real WebP — it silently
-- falls back to PNG while still honestly reporting image/png on the
-- resulting blob. Both photo buckets only allowed image/webp, so a Safari
-- upload got rejected outright with a 415 "invalid_mime_type" error before
-- it ever reached the item_photos/person_portraits tables.
--
-- The app now uploads with the browser's actual detected content type
-- (see components/PersonPortrait.tsx and components/PhotoPicker.tsx)
-- instead of assuming WebP — this just widens the allow-list so that real
-- type is accepted. Non-destructive: only relaxes a bucket setting, no
-- rows or policies touched.
update storage.buckets
set allowed_mime_types = array['image/webp', 'image/png']
where id in ('item-photos', 'person-portraits');
