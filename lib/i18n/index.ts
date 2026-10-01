// Entry point for the locale system. Client Components read strings via
// useTranslation()/useI18n() from "./I18nProvider"; Server Components via
// getServerTranslation() from "./server" (kept out of this barrel because it
// imports "server-only", which throws if pulled into a client bundle).
export { LOCALES, DEFAULT_LOCALE, isLocale } from "./locale";
export type { Locale } from "./locale";
export { dictionaries } from "./dictionaries";
export type { Dictionary } from "./types";
