"use client";

import { useReducer, useRef, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent } from "react";
import PersonAvatar from "@/components/PersonAvatar";
import { resizeImageToWebp, blobToDataUrl } from "@/lib/resizeImage";
import type { PersonCategory } from "@/lib/mockData/persons";
import t from "@/lib/i18n";

const STORAGE_PREFIX = "autografio:portrait:";

// No cross-tab sync needed for this dev-only cache — writes trigger their
// own re-render (see `bump` below), so the subscription itself is a no-op.
// useSyncExternalStore (rather than useState+useEffect) is what lets the
// initial read stay hydration-safe: getServerSnapshot returns null to match
// the server render, and the client re-checks localStorage on every render.
function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return null;
}

// Click straight on a missing photo to add one — no separate upload screen.
// There's no persons table/Storage bucket yet, so this caches the resized
// image as a data: URL in localStorage (keyed by slug) purely so it survives
// a reload while the mock catalog is being put together; it's a stand-in for
// the real Wikimedia Commons portrait pipeline, not the public path.
export default function PersonPortrait({
  slug,
  name,
  category,
  size = 72,
  variant = "avatar",
}: {
  slug: string;
  name: string;
  category: PersonCategory;
  size?: number;
  variant?: "avatar" | "wide";
}) {
  const [busy, setBusy] = useState(false);
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const inputRef = useRef<HTMLInputElement>(null);

  const dataUrl = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(STORAGE_PREFIX + slug);
      } catch {
        return null;
      }
    },
    getServerSnapshot
  );

  async function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    try {
      const resized = await resizeImageToWebp(file);
      const url = await blobToDataUrl(resized.blob);
      try {
        window.localStorage.setItem(STORAGE_PREFIX + slug, url);
      } catch {
        // Storage full/disabled — resize succeeded but won't be shown/persisted this time.
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

  function removePortrait(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      window.localStorage.removeItem(STORAGE_PREFIX + slug);
    } catch {
      // Ignore — best effort.
    }
    bump();
  }

  const isWide = variant === "wide";
  const label = dataUrl ? t.photoPicker.changePhoto : t.photoPicker.addPhoto;

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") openPicker(e);
      }}
      className={`portrait-tile${isWide ? " portrait-tile-wide" : ""}`}
      style={isWide ? undefined : { width: size, height: size, borderRadius: "50%" }}
      aria-label={`${label} — ${name}`}
    >
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- locally cached data: URL, not a remote/optimizable asset
        <img src={dataUrl} alt={name} className="portrait-img" />
      ) : isWide ? (
        <span className="portrait-placeholder-wide" aria-hidden="true">
          <span>{t.photoPicker.addPhoto}</span>
        </span>
      ) : (
        <PersonAvatar name={name} category={category} size={size} />
      )}

      <span className="portrait-hover-hint" aria-hidden="true">
        {isWide ? label : "+"}
      </span>

      {busy && (
        <span className="portrait-busy" aria-hidden="true">
          {t.photoPicker.processing}
        </span>
      )}

      {dataUrl && !busy && (
        <span
          role="button"
          tabIndex={-1}
          className="portrait-remove"
          onClick={removePortrait}
          aria-label={`${t.photoPicker.remove} — ${name}`}
        >
          ×
        </span>
      )}

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
    </span>
  );
}
