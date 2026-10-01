import type { Locale } from "./i18n/locale";

// Approximate CZK→EUR rate for display only, not a live feed — rounded to a
// whole number since nobody needs three significant figures on a rough
// "cca kolik to stojí" estimate. `locale` is required (not defaulted) so a
// new call site has to consciously pick one rather than silently landing on
// Czech.
const CZK_PER_EUR = 25;

// Only "cs" prices in Kč — every other locale on the site (en, sk, fr) maps
// to a country that's actually on the euro, so they all price in € rather
// than each getting its own currency.
const EUR_NUMBER_FORMAT: Record<Exclude<Locale, "cs">, string> = {
  en: "en-IE",
  sk: "sk-SK",
  fr: "fr-FR",
};

export function formatKc(value: number, locale: Locale): string {
  if (locale === "cs") {
    return `${new Intl.NumberFormat("cs-CZ").format(Math.round(value))} Kč`;
  }
  return `${new Intl.NumberFormat(EUR_NUMBER_FORMAT[locale]).format(Math.round(value / CZK_PER_EUR))} €`;
}

// A plain, non-breaking price range — replaceAll swaps the two regular
// spaces the range's own " – " join and formatKc's own thousands-separator
// space introduce for a non-breaking one, so "32 000 – 45 000 Kč" can never
// wrap mid-number or split off "Kč"/"€" onto its own line.
export function formatKcRange(min: number, max: number, locale: Locale): string {
  return `${formatKc(min, locale)} – ${formatKc(max, locale)}`.replaceAll(" ", " ");
}

export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} kB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
