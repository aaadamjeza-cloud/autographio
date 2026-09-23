"use client";

import {
  forwardRef,
  useImperativeHandle,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
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

// Best-effort space-maker: this cache has no eviction policy of its own, so
// once it's full every new upload fails the same way forever until someone
// manually clears it. Drop every *other* cached portrait (never the one
// currently being written) so a save always has a real chance to succeed —
// acceptable since this whole cache is an explicitly temporary stand-in, not
// data anyone is meant to rely on staying put.
function evictOtherPortraits(exceptFullKey: string) {
  const toRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(STORAGE_PREFIX) && k !== exceptFullKey) toRemove.push(k);
  }
  toRemove.forEach((k) => window.localStorage.removeItem(k));
}

export type PersonPortraitHandle = {
  open: () => void;
};

// Click straight on a missing photo to add one — no separate upload screen.
// There's no persons table/Storage bucket yet, so this caches the resized
// image as a data: URL in localStorage (keyed by slug) purely so it survives
// a reload while the mock catalog is being put together; it's a stand-in for
// the real Wikimedia Commons portrait pipeline, not the public path.
// forwardRef exposes `open()` so a page can offer its own explicit "add
// photo" button next to the title, in addition to clicking the tile itself.
const PersonPortrait = forwardRef<
  PersonPortraitHandle,
  {
    slug: string;
    name: string;
    category: PersonCategory;
    size?: number;
    variant?: "avatar" | "wide";
    // Two independent photos can exist per person — the item/autograph photo
    // (keyed by slug) and their profilovka (keyed by `${slug}:profile`).
    // Defaults to `slug` so existing callers don't need to change.
    storageKey?: string;
    showRemove?: boolean;
  }
>(function PersonPortrait({ slug, name, category, size = 72, variant = "avatar", storageKey, showRemove = true }, ref) {
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const inputRef = useRef<HTMLInputElement>(null);
  const key = storageKey ?? slug;

  useImperativeHandle(ref, () => ({
    open: () => inputRef.current?.click(),
  }));

  const dataUrl = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(STORAGE_PREFIX + key);
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
      // Small target — this ends up base64-encoded in localStorage (~33%
      // larger again), which fills up fast at the item-photo defaults.
      const resized = await resizeImageToWebp(file, { maxDimension: 480, targetBytes: 40 * 1024 });
      const url = await blobToDataUrl(resized.blob);
      const fullKey = STORAGE_PREFIX + key;
      try {
        window.localStorage.setItem(fullKey, url);
      } catch {
        // Full — evict every other cached portrait and retry once before
        // giving up. This used to fail silently (or just keep failing on
        // every retry) — now a save basically always succeeds.
        try {
          evictOtherPortraits(fullKey);
          window.localStorage.setItem(fullKey, url);
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

  function removePortrait(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      window.localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {
      // Ignore — best effort.
    }
    bump();
  }

  const isWide = variant === "wide";
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

        {saveError && !busy && (
          <span className="portrait-busy portrait-error" role="alert">
            {t.photoPicker.saveError}
          </span>
        )}

        {showRemove && dataUrl && !busy && (
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
      </span>

      {/* Deliberately a sibling, not nested inside the clickable span above:
          input.click() dispatches a real bubbling click event, and if the
          input were inside the span, that event would bubble straight back
          into the span's own onClick handler, which calls preventDefault()
          on it — cancelling the file dialog's default action before it can
          open. Keeping the input outside breaks that feedback loop. */}
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
});

export default PersonPortrait;
