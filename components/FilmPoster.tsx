"use client";

import { useReducer, useRef, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent } from "react";
import { resizeImageToWebp, blobToDataUrl } from "@/lib/resizeImage";
import t from "@/lib/i18n";

const STORAGE_PREFIX = "autografio:filmposter:";

// Same click-to-add pattern as PersonPortrait (see that file for the
// reasoning), just without a person-category placeholder — an empty poster
// is a plain dashed tile. Cached in localStorage as a stand-in for real
// poster art until there's a backend to store it in.
function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return null;
}

function evictOtherPosters(exceptFullKey: string) {
  const toRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(STORAGE_PREFIX) && k !== exceptFullKey) toRemove.push(k);
  }
  toRemove.forEach((k) => window.localStorage.removeItem(k));
}

export default function FilmPoster({ slug, title }: { slug: string; title: string }) {
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const inputRef = useRef<HTMLInputElement>(null);
  const key = STORAGE_PREFIX + slug;

  const dataUrl = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    getServerSnapshot
  );

  async function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    setSaveError(false);
    try {
      const resized = await resizeImageToWebp(file, { maxDimension: 480, targetBytes: 40 * 1024 });
      const url = await blobToDataUrl(resized.blob);
      try {
        window.localStorage.setItem(key, url);
      } catch {
        try {
          evictOtherPosters(key);
          window.localStorage.setItem(key, url);
        } catch {
          setSaveError(true);
        }
      }
    } finally {
      setBusy(false);
    }
  }

  function openPicker(e: MouseEvent | KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    inputRef.current?.click();
  }

  function removePoster(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore — best effort.
    }
    bump();
  }

  const label = dataUrl ? t.photoPicker.changePhoto : t.photoPicker.addPhoto;

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openPicker(e);
        }}
        className="film-poster-tile"
        aria-label={`${label} — ${title}`}
      >
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- locally cached data: URL, not a remote/optimizable asset
          <img src={dataUrl} alt={title} className="portrait-img" />
        ) : (
          <span className="film-poster-placeholder" aria-hidden="true">
            <span>{t.photoPicker.addPhoto}</span>
          </span>
        )}

        <span className="portrait-hover-hint" aria-hidden="true">
          {label}
        </span>

        {busy && (
          <span className="portrait-busy" aria-hidden="true">
            {t.photoPicker.processing}
          </span>
        )}

        {saveError && !busy && (
          <span className="portrait-busy portrait-error" role="alert">
            {t.photoPicker.saveError}
          </span>
        )}

        {dataUrl && !busy && (
          <span role="button" tabIndex={-1} className="portrait-remove" onClick={removePoster} aria-label={`${t.photoPicker.remove} — ${title}`}>
            ×
          </span>
        )}
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </>
  );
}
