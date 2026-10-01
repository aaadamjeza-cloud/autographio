"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { formatBytes } from "@/lib/format";
import { resizeImageToWebp } from "@/lib/resizeImage";
import { createClient } from "@/lib/supabase/client";

const MAX_PHOTOS = 5;
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const BUCKET = "item-photos";
const SIGNED_URL_TTL_SECONDS = 3600;

type Photo = {
  id: string;
  storagePath?: string;
  status: "processing" | "uploading" | "done" | "removing" | "error";
  previewUrl?: string;
  originalSize: number;
  compressedSize?: number;
  errorMessage?: string;
};

// Photos persist for real now: resize client-side (see lib/resizeImage.ts),
// upload the WebP to the private "item-photos" Storage bucket at
// {userId}/{itemId}/{uuid}.webp, then record it in item_photos. Both the
// bucket and the table are RLS-owner-only (see supabase/migrations/0001 and
// 0003), so nobody but the uploader can read, sign a URL for, or delete a
// given photo — enforced at the database, not just by hiding the button.
export default function PhotoPicker({ itemId, userId }: { itemId: string; userId: string }) {
  const t = useTranslation();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const atLimit = photos.length >= MAX_PHOTOS;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("item_photos")
        .select("id, storage_path")
        .eq("item_id", itemId)
        .order("sort_order", { ascending: true });
      if (error || !data || cancelled) return;

      const withUrls = await Promise.all(
        data.map(async (row): Promise<Photo> => {
          const { data: signed } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(row.storage_path, SIGNED_URL_TTL_SECONDS);
          return {
            id: row.id,
            storagePath: row.storage_path,
            status: "done",
            previewUrl: signed?.signedUrl,
            originalSize: 0,
          };
        })
      );
      if (!cancelled) setPhotos(withUrls);
    })();

    return () => {
      cancelled = true;
    };
  }, [itemId, supabase]);

  async function uploadFile(file: File) {
    const id = crypto.randomUUID();

    if (!file.type.startsWith("image/")) {
      setPhotos((prev) => [...prev, { id, status: "error", originalSize: file.size, errorMessage: t.photoPicker.notAnImage }]);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setPhotos((prev) => [...prev, { id, status: "error", originalSize: file.size, errorMessage: t.photoPicker.tooLarge }]);
      return;
    }

    setPhotos((prev) => [...prev, { id, status: "processing", originalSize: file.size }]);

    try {
      const resized = await resizeImageToWebp(file);
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "uploading", previewUrl: resized.previewUrl, compressedSize: resized.compressedSize } : p
        )
      );

      const storagePath = `${userId}/${itemId}/${crypto.randomUUID()}.webp`;
      // Safari's canvas.toBlob() silently falls back to PNG when asked for
      // WebP — use the blob's own (correct) type rather than assuming WebP,
      // see supabase/migrations/0006_allow_png_fallback.sql.
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, resized.blob, {
        contentType: resized.blob.type,
      });
      if (uploadError) throw uploadError;

      const { data: row, error: insertError } = await supabase
        .from("item_photos")
        .insert({ item_id: itemId, user_id: userId, storage_path: storagePath })
        .select("id")
        .single();
      if (insertError || !row) throw insertError ?? new Error("insert failed");

      setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, id: row.id, storagePath, status: "done" } : p)));
    } catch {
      setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, status: "error", errorMessage: t.photoPicker.uploadError } : p)));
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const slots = MAX_PHOTOS - photos.length;
    const picked = Array.from(files).slice(0, slots);
    for (const file of picked) {
      await uploadFile(file);
    }
  }

  async function removePhoto(photo: Photo) {
    if (photo.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(photo.previewUrl);

    if (photo.status !== "done" || !photo.storagePath) {
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      return;
    }

    setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, status: "removing" } : p)));
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([photo.storagePath]);
    const { error: dbError } = await supabase.from("item_photos").delete().eq("id", photo.id);

    if (storageError || dbError) {
      setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, status: "done" } : p)));
      return;
    }
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
  }

  const statusLabel: Record<Photo["status"], string | undefined> = {
    processing: t.photoPicker.processing,
    uploading: t.photoPicker.uploading,
    removing: t.photoPicker.removing,
    done: undefined,
    error: undefined,
  };

  return (
    <div className="photo-picker">
      <div className="photo-picker-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-tile">
            {statusLabel[photo.status] && <div className="photo-tile-status">{statusLabel[photo.status]}</div>}
            {photo.status === "error" && <div className="photo-tile-status photo-tile-status-error">{photo.errorMessage}</div>}
            {(photo.status === "done" || photo.status === "removing") && photo.previewUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- signed Storage URL / local blob preview, not an optimizable remote asset */}
                <img src={photo.previewUrl} alt="" className="photo-tile-img" style={{ opacity: photo.status === "removing" ? 0.5 : 1 }} />
                {photo.compressedSize != null && (
                  <div className="photo-tile-meta">
                    {formatBytes(photo.originalSize)} → {formatBytes(photo.compressedSize)}
                  </div>
                )}
              </>
            )}
            <button
              type="button"
              className="photo-tile-remove"
              onClick={() => removePhoto(photo)}
              disabled={photo.status === "removing"}
              aria-label={t.photoPicker.remove}
            >
              ×
            </button>
          </div>
        ))}

        {!atLimit && (
          <button type="button" className="photo-picker-add" onClick={() => inputRef.current?.click()}>
            + {t.photoPicker.addPhoto}
          </button>
        )}
      </div>

      <p className="photo-picker-hint">{atLimit ? t.photoPicker.limitReached : t.photoPicker.limitHint}</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
