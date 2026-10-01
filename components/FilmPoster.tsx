"use client";

import { useReducer, useRef, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent } from "react";
import { Eagle_Lake } from "next/font/google";
import { resizeImageToWebp, blobToDataUrl } from "@/lib/resizeImage";
import { useTranslation } from "@/lib/i18n/I18nProvider";

// Curled swash caps, looped descenders — the storybook/fairy-tale look for
// the .film-poster-placeholder--pohadka title, in place of the French azure
// posters' block-capital Impact.
const eagleLake = Eagle_Lake({ weight: "400", subsets: ["latin-ext"], display: "swap" });

const STORAGE_PREFIX = "autographio:filmposter:";

// Flat period-appropriate azure, same for every film — styled after the
// original French poster logo look: bold white block capitals with a hard
// black drop shadow, nothing else on the card.
const POSTER_BG = "#8FD3E8";

// Czech fairy tales get a separate look (see .film-poster-placeholder--pohadka
// in globals.css): warm hand-painted Barrandov-poster gold instead of flat
// French azure, italic serif instead of block-capital Impact.
const POSTER_BG_POHADKA = "#dc9a2e";

// "Le Gendarme et les Extra-terrestres" → { lead: "LE GENDARME", rest: "ET
// LES EXTRA-TERRESTRES" } — echoes the stacked two-size title lettering of
// the real posters (the whole series shares the "Le Gendarme…" prefix).
function splitTitle(title: string): { lead: string; rest: string } {
  const words = title.split(" ");
  const lead = words.slice(0, 2).join(" ").toUpperCase();
  const rest = words.slice(2).join(" ").toUpperCase();
  return { lead, rest };
}

// Same split, but keeps natural case — Eagle Lake's swash caps and looped
// lowercase letters are the whole point, forcing upper case would hide them.
function splitTitlePohadka(title: string): { lead: string; rest: string } {
  const words = title.split(" ");
  const lead = words.slice(0, 2).join(" ");
  const rest = words.slice(2).join(" ");
  return { lead, rest };
}

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

export default function FilmPoster({
  slug,
  title,
  originalTitle,
  genre,
}: {
  slug: string;
  title: string;
  originalTitle: string;
  genre?: "pohadka";
}) {
  const t = useTranslation();
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
          <span
            className={`film-poster-placeholder${genre === "pohadka" ? " film-poster-placeholder--pohadka" : ""}`}
            style={{ background: genre === "pohadka" ? POSTER_BG_POHADKA : POSTER_BG }}
            aria-hidden="true"
          >
            <span className={`film-poster-placeholder-logo${genre === "pohadka" ? ` ${eagleLake.className}` : ""}`}>
              {genre === "pohadka" ? (
                <>
                  <span className="film-poster-placeholder-lead">{splitTitlePohadka(originalTitle).lead}</span>
                  {splitTitlePohadka(originalTitle).rest && (
                    <span className="film-poster-placeholder-rest">{splitTitlePohadka(originalTitle).rest}</span>
                  )}
                </>
              ) : (
                <>
                  <span className="film-poster-placeholder-lead">{splitTitle(originalTitle).lead}</span>
                  {splitTitle(originalTitle).rest && (
                    <span className="film-poster-placeholder-rest">{splitTitle(originalTitle).rest}</span>
                  )}
                </>
              )}
            </span>
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
