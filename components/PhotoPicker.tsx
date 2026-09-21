"use client";

import { useRef, useState } from "react";
import t from "@/lib/i18n";
import { formatBytes } from "@/lib/format";
import { resizeImageToWebp } from "@/lib/resizeImage";

const MAX_PHOTOS = 5;
const MAX_FILE_BYTES = 20 * 1024 * 1024;

type Photo = {
  id: string;
  status: "processing" | "done" | "error";
  previewUrl?: string;
  width?: number;
  height?: number;
  originalSize: number;
  compressedSize?: number;
  errorMessage?: string;
};

// Fully client-side: resizing/compression happens in the browser (see
// lib/resizeImage.ts). Nothing is uploaded anywhere yet — there's no
// Supabase Storage bucket until a project exists — this only proves out the
// exact UX/compression the real "Add item" screen will use.
export default function PhotoPicker() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const atLimit = photos.length >= MAX_PHOTOS;

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const slots = MAX_PHOTOS - photos.length;
    const picked = Array.from(files).slice(0, slots);

    for (const file of picked) {
      const id = crypto.randomUUID();

      if (!file.type.startsWith("image/")) {
        setPhotos((prev) => [
          ...prev,
          { id, status: "error", originalSize: file.size, errorMessage: t.photoPicker.notAnImage },
        ]);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setPhotos((prev) => [
          ...prev,
          { id, status: "error", originalSize: file.size, errorMessage: t.photoPicker.tooLarge },
        ]);
        continue;
      }

      setPhotos((prev) => [...prev, { id, status: "processing", originalSize: file.size }]);
      try {
        const resized = await resizeImageToWebp(file);
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: "done",
                  previewUrl: resized.previewUrl,
                  width: resized.width,
                  height: resized.height,
                  compressedSize: resized.compressedSize,
                }
              : p
          )
        );
      } catch (err) {
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, status: "error", errorMessage: err instanceof Error ? err.message : String(err) } : p
          )
        );
      }
    }
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  return (
    <div className="photo-picker">
      <div className="photo-picker-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-tile">
            {photo.status === "processing" && <div className="photo-tile-status">{t.photoPicker.processing}</div>}
            {photo.status === "error" && <div className="photo-tile-status photo-tile-status-error">{photo.errorMessage}</div>}
            {photo.status === "done" && photo.previewUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob: preview, not an optimizable remote asset */}
                <img src={photo.previewUrl} alt="" className="photo-tile-img" />
                <div className="photo-tile-meta">
                  {formatBytes(photo.originalSize)} → {formatBytes(photo.compressedSize ?? 0)}
                </div>
              </>
            )}
            <button
              type="button"
              className="photo-tile-remove"
              onClick={() => removePhoto(photo.id)}
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
