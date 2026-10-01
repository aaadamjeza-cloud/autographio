"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { useUser } from "@clerk/nextjs";
import PersonAvatar from "@/components/PersonAvatar";
import { resizeImageToWebp, blobToDataUrl } from "@/lib/resizeImage";
import { createClient } from "@/lib/supabase/client";
import { submitPortrait, removePortrait as removePortraitAction } from "@/app/osobnosti/[slug]/portraitActions";
import type { PersonCategory, PersonPortraitSource } from "@/lib/mockData/persons";
import { useTranslation } from "@/lib/i18n/I18nProvider";

const STORAGE_PREFIX = "autographio:portrait:";
const SUPABASE_BUCKET = "person-portraits";

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

// Best-effort space-maker for `persist="local"` only: once that cache is
// full every new upload fails the same way forever until someone manually
// clears it. Drop every *other* cached portrait (never the one currently
// being written) so a save always has a real chance to succeed — acceptable
// there because that whole cache is an explicitly temporary, single-browser
// stand-in, never data anyone is meant to rely on staying put. This must
// never run for `persist="supabase"` — that path's whole point is that a
// new person's photo can't take out everyone else's.
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
// forwardRef exposes `open()` so a page can offer its own explicit "add
// photo" button next to the title, in addition to clicking the tile itself.
const PersonPortrait = forwardRef<
  PersonPortraitHandle,
  {
    slug: string;
    name: string;
    category: PersonCategory;
    gender: "m" | "f";
    size?: number;
    variant?: "avatar" | "wide";
    // Two independent photos can exist per person — the item/autograph photo
    // (keyed by slug) and their profilovka (keyed by `${slug}:profile`).
    // Defaults to `slug` so existing callers don't need to change. Only
    // meaningful for `persist="local"` — the "supabase" path is always
    // keyed by `slug` alone (see migration 0004).
    storageKey?: string;
    showRemove?: boolean;
    // A real, license-checked Commons portrait (see lib/mockData/persons.ts)
    // to show whenever nobody's picked a photo for this slot yet. Only ever
    // pass this for the `:profile` slot — the plain-`slug` slot is the
    // collector's own photo of their item, never the celebrity's portrait,
    // and mixing the two would misrepresent what's pictured.
    fallbackPortrait?: PersonPortraitSource;
    // "local" (default): caches the picked photo as a data: URL in
    // localStorage — a dev-only stand-in that's gone if this browser's
    // storage is cleared, and never seen by anyone else.
    // "supabase": persists it for real — uploads to the public
    // person-portraits Storage bucket and records it in the
    // person_portraits table (see
    // supabase/migrations/0004_person_portraits.sql), keyed by `slug` alone
    // so it survives reloads, other browsers, and shows for every visitor.
    // Requires that migration to have been applied and the viewer to be
    // signed in to upload (reading is always public).
    persist?: "local" | "supabase";
    // Skips this instance's own `person_portraits` lookup query entirely —
    // set by a page that batch-fetches portraits for a whole list up front
    // (one query for everyone) instead of letting each tile fire its own.
    // `preloadedUrl` is that batch result for this slug: a URL if one
    // exists, `null` if not (yet, or ever) — kept in sync via a plain
    // useEffect below rather than lifted into state ownership, so an
    // upload/removal made straight from this tile can still update the
    // photo shown without needing the parent's batch to re-run.
    skipOwnLookup?: boolean;
    preloadedUrl?: string | null;
  }
>(function PersonPortrait(
  {
    slug,
    name,
    category,
    gender,
    size = 72,
    variant = "avatar",
    storageKey,
    showRemove = true,
    fallbackPortrait,
    persist = "local",
    skipOwnLookup = false,
    preloadedUrl = null,
  },
  ref
) {
  const t = useTranslation();
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const inputRef = useRef<HTMLInputElement>(null);
  const key = storageKey ?? slug;
  const isSupabase = persist === "supabase";
  const supabase = createClient();
  const { user } = useUser();

  useImperativeHandle(ref, () => ({
    open: () => inputRef.current?.click(),
  }));

  const localDataUrl = useSyncExternalStore(
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

  const [remoteUrl, setRemoteUrl] = useState<string | null>(preloadedUrl);

  // A batch-fetching parent (see skipOwnLookup) re-renders with the real
  // answer once its own single query resolves — mirror that into state so
  // display updates, without this component ever hitting the database
  // itself.
  useEffect(() => {
    if (skipOwnLookup) setRemoteUrl(preloadedUrl);
  }, [skipOwnLookup, preloadedUrl]);

  // Look up whether this person already has a persisted portrait. Public
  // read (see migration 0004), so this runs regardless of sign-in state.
  // Skipped when a parent is batch-fetching for a whole list instead (see
  // skipOwnLookup) — firing one query per tile on a 200-person page is what
  // was making photos slow to appear.
  useEffect(() => {
    if (!isSupabase || skipOwnLookup) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("person_portraits")
        .select("storage_path")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled || !data?.storage_path) return;
      const { data: pub } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(data.storage_path);
      setRemoteUrl(pub.publicUrl);
    })();
    return () => {
      cancelled = true;
    };
  }, [isSupabase, skipOwnLookup, slug, supabase]);

  async function uploadLocal(file: File) {
    const resized = await resizeImageToWebp(file, { maxDimension: 480, targetBytes: 40 * 1024 });
    const url = await blobToDataUrl(resized.blob);
    const fullKey = STORAGE_PREFIX + key;
    try {
      window.localStorage.setItem(fullKey, url);
    } catch {
      // Full — evict every other cached portrait and retry once before
      // giving up, so a save basically always succeeds.
      try {
        evictOtherPortraits(fullKey);
        window.localStorage.setItem(fullKey, url);
      } catch {
        throw new Error("local-save-failed");
      }
    }
  }

  async function uploadSupabase(file: File) {
    if (!user) throw new Error("sign-in-required");

    const resized = await resizeImageToWebp(file, { maxDimension: 480, targetBytes: 40 * 1024 });
    // Always uploaded to a staging path first, never straight to `${slug}.webp`
    // — that path is what every visitor sees live, and only an admin upload
    // is allowed to land there (see app/osobnosti/[slug]/portraitActions.ts,
    // which moves it into place). Anyone else's upload stays parked here,
    // untouched by anyone, until an admin approves it from /nevyrizene.
    const stagingPath = `staging/${slug}-${user.id}-${Date.now()}.webp`;

    // Safari's canvas.toBlob() doesn't reliably encode real WebP — it
    // silently falls back to PNG while still reporting the (correct)
    // image/png type on the resulting blob. Uploading with a hardcoded
    // "image/webp" content type here mismatched the actual bytes and got
    // rejected by Storage's mime-type check; using the blob's own type
    // uploads whatever the browser actually produced (see also
    // supabase/migrations/0006_allow_png_fallback.sql, which is what lets
    // that real type through the bucket's allow-list).
    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(stagingPath, resized.blob, { contentType: resized.blob.type });
    if (uploadError) throw uploadError;

    const result = await submitPortrait(slug, stagingPath);
    if (!result.ok) throw new Error("upload-failed");

    if (result.status === "applied") {
      const { data: pub } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(`${slug}.webp`);
      // Cache-bust: the path never changes on a re-upload, only its content
      // — without this the browser would keep showing the previous image.
      setRemoteUrl(`${pub.publicUrl}?v=${Date.now()}`);
    } else {
      // Pending review — nothing visible changes yet, just let the person
      // know their photo was received.
      setPendingNotice(t.photoPicker.submittedForReview);
    }
  }

  async function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) {
      setSaveError(t.photoPicker.notAnImage);
      return;
    }
    setBusy(true);
    setSaveError(null);
    setPendingNotice(null);
    try {
      if (isSupabase) {
        await uploadSupabase(file);
      } else {
        await uploadLocal(file);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message === "sign-in-required") setSaveError(t.photoPicker.signInRequired);
      else if (message === "local-save-failed") setSaveError(t.photoPicker.saveError);
      else setSaveError(t.photoPicker.uploadError);
    } finally {
      setBusy(false);
    }
  }

  function openPicker(e: MouseEvent | KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    inputRef.current?.click();
  }

  async function removePortrait(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isSupabase) {
      setBusy(true);
      setSaveError(null);
      try {
        // Admin-only, enforced server-side — a non-admin gets { ok: false }
        // and the same generic error, not a distinct "not allowed" message,
        // since the button isn't meant to be usable by them in the first place.
        const result = await removePortraitAction(slug);
        if (!result.ok) throw new Error("remove-failed");
        setRemoteUrl(null);
      } catch {
        setSaveError(t.photoPicker.uploadError);
      } finally {
        setBusy(false);
      }
      return;
    }

    try {
      window.localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {
      // Ignore — best effort.
    }
    bump();
  }

  const effectiveUrl = isSupabase ? remoteUrl : localDataUrl;
  const isWide = variant === "wide";
  const label = effectiveUrl ? t.photoPicker.changePhoto : t.photoPicker.addPhoto;

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
        {effectiveUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- locally cached data: URL or hotlinked Supabase public Storage URL, not a locally optimizable asset
          <img src={effectiveUrl} alt={name} className="portrait-img" />
        ) : fallbackPortrait ? (
          // Checked before the wide placeholder, not after: a sourced
          // Commons portrait is a real photo, so the big hero tile should
          // show it rather than claiming there's nothing to see.
          // eslint-disable-next-line @next/next/no-img-element -- hotlinked Commons Special:FilePath, not a locally optimizable asset
          <img
            src={fallbackPortrait.url}
            alt={name}
            title={
              fallbackPortrait.source === "ai"
                ? t.persons.photoCreditAi
                : `${fallbackPortrait.author} — ${fallbackPortrait.license} (${t.persons.photoCreditCommonsLink})`
            }
            className="portrait-img"
          />
        ) : isWide ? (
          <span className="portrait-placeholder-wide" aria-hidden="true">
            <span>{t.photoPicker.addPhoto}</span>
          </span>
        ) : (
          <PersonAvatar name={name} category={category} gender={gender} size={size} />
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
            {saveError}
          </span>
        )}

        {pendingNotice && !busy && !saveError && (
          <span className="portrait-busy" role="status">
            {pendingNotice}
          </span>
        )}

        {showRemove && effectiveUrl && !busy && (
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
