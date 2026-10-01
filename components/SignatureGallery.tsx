"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { resizeImageToWebp } from "@/lib/resizeImage";

export type SignaturePhoto = {
  id: string;
  storage_path: string;
  uploaded_by: string | null;
  // Resolved through the public_profiles view (0013), so it is only ever
  // set for contributors who left "zobrazovat jméno u veřejných fotek" on.
  uploaderName: string | null;
  url: string;
};

const BUCKET = "signature-photos";
// Mirrors the trigger in 0013_signature_photos.sql — that one is the real
// rule, this just stops the UI offering an upload that would be rejected.
const MAX_PHOTOS = 6;

export default function SignatureGallery({
  personId,
  initialPhotos,
  currentUserName,
  uploadOpen,
  onUploadOpenChange,
}: {
  personId: string;
  initialPhotos: SignaturePhoto[];
  currentUserName: string | null;
  uploadOpen: boolean;
  onUploadOpenChange: (open: boolean) => void;
}) {
  const t = useTranslation();
  const { user } = useUser();
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState(initialPhotos);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const atLimit = photos.length >= MAX_PHOTOS;

  // Object URLs are only freed when the browser is told to — hanging on to
  // one after the dialog closes leaks the whole decoded image.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function closeDialog() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setRightsConfirmed(false);
    setError(null);
    onUploadOpenChange(false);
  }

  function pickFile(picked: File | undefined) {
    if (!picked) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(picked);
    setPreviewUrl(URL.createObjectURL(picked));
    setError(null);
  }

  async function handleUpload() {
    if (!user) {
      setError(t.signatures.signInRequired);
      return;
    }
    // Both also enforced by the database: uploaded_by must match the caller
    // and rights_confirmed is NOT NULL with a CHECK (0013), so an upload
    // that skipped either would be rejected there too.
    if (!file || !rightsConfirmed) return;

    setBusy(true);
    setError(null);

    try {
      const resized = await resizeImageToWebp(file);
      const path = `${user.id}/${personId}/${crypto.randomUUID()}.webp`;

      // Safari encodes PNG while reporting it honestly — upload the blob's
      // real type rather than assuming WebP (see 0006_allow_png_fallback).
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, resized.blob, { contentType: resized.blob.type });
      if (uploadError) throw uploadError;

      const { data: row, error: insertError } = await supabase
        .from("signature_photos")
        .insert({ person_id: personId, uploaded_by: user.id, storage_path: path, rights_confirmed: true })
        .select("id, storage_path, uploaded_by")
        .single();
      if (insertError || !row) throw insertError ?? new Error("insert failed");

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setPhotos((prev) => [
        ...prev,
        { id: row.id, storage_path: row.storage_path, uploaded_by: row.uploaded_by, uploaderName: currentUserName, url: pub.publicUrl },
      ]);
      setBusy(false);
      closeDialog();
    } catch {
      setBusy(false);
      setError(t.signatures.uploadError);
    }
  }

  async function removePhoto(photo: SignaturePhoto) {
    setBusy(true);
    setError(null);

    const { error: storageError } = await supabase.storage.from(BUCKET).remove([photo.storage_path]);
    const { error: dbError } = await supabase.from("signature_photos").delete().eq("id", photo.id);

    setBusy(false);
    if (storageError || dbError) {
      setError(t.signatures.removeError);
      return;
    }
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
  }

  return (
    <>
      <section id="podpisy" style={{ marginTop: 32, scrollMarginTop: 88 }}>
        <h2 className="person-section-title">
          {t.signatures.title} ({photos.length})
        </h2>

        {photos.length === 0 && <p className="person-section-text">{t.signatures.empty}</p>}

        {photos.length > 0 && (
          <div className="signature-gallery">
            {photos.map((photo) => (
              <figure key={photo.id} className="signature-tile">
                {/* eslint-disable-next-line @next/next/no-img-element -- public Storage URL, not an optimizable local asset */}
                <img src={photo.url} alt="" className="signature-tile-img" />
                <figcaption className="signature-tile-caption">
                  {t.signatures.addedBy}: {photo.uploaderName ?? t.signatures.anonymous}
                </figcaption>
                {user?.id && photo.uploaded_by === user.id && (
                  <button
                    type="button"
                    className="signature-tile-remove"
                    onClick={() => removePhoto(photo)}
                    disabled={busy}
                    aria-label={t.signatures.remove}
                  >
                    ×
                  </button>
                )}
              </figure>
            ))}
          </div>
        )}

        {!uploadOpen && error && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 10 }}>{error}</p>}

        <div style={{ marginTop: 14 }}>
          {atLimit ? (
            <p style={{ fontSize: 13, color: "var(--ink-3)" }}>{t.signatures.limitReached}</p>
          ) : (
            <button type="button" className="btn" onClick={() => onUploadOpenChange(true)}>
              + {t.signatures.add}
            </button>
          )}
        </div>
      </section>

      {uploadOpen && (
        <div
          className="signature-modal-backdrop"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget && !busy) closeDialog();
          }}
        >
          <div className="signature-modal" role="dialog" aria-modal="true" aria-label={t.signatures.add}>
            <h3 className="signature-modal-title">{t.signatures.add}</h3>

            <button type="button" className="signature-modal-picker" onClick={() => inputRef.current?.click()}>
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
                <img src={previewUrl} alt="" className="signature-modal-preview" />
              ) : (
                <span>{t.signatures.choosePhoto}</span>
              )}
            </button>

            <label className="signature-rights">
              <input type="checkbox" checked={rightsConfirmed} onChange={(e) => setRightsConfirmed(e.target.checked)} />
              <span>{t.signatures.rightsLabel}</span>
            </label>

            {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}

            <div className="signature-modal-actions">
              <button type="button" className="btn" onClick={closeDialog} disabled={busy}>
                {t.common.cancel}
              </button>
              <button type="button" className="btn btn-primary" onClick={handleUpload} disabled={busy || !file || !rightsConfirmed}>
                {busy ? t.photoPicker.uploading : t.signatures.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          pickFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </>
  );
}
