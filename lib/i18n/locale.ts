export const LOCALES = ["cs", "en", "sk", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "cs";
export const LOCALE_COOKIE = "locale";

// Each language's own name for itself (autonym), not translated per the
// active locale — "Français" is "Français" no matter what language you're
// currently reading, same as every other language switcher does it.
export const LOCALE_LABELS: Record<Locale, string> = {
  cs: "Čeština",
  en: "English",
  sk: "Slovenčina",
  fr: "Français",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  cs: "🇨🇿",
  en: "🇬🇧",
  sk: "🇸🇰",
  fr: "🇫🇷",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
