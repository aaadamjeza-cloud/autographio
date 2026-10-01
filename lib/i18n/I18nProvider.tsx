"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { dictionaries } from "./dictionaries";
import { LOCALE_COOKIE, type Locale } from "./locale";
import type { Dictionary } from "./types";

type I18nContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

// Wraps the app once, in the root layout, seeded with the locale the server
// already resolved from the cookie (see lib/i18n/server.ts) — so the first
// client render matches the server render instead of flashing one locale
// and switching to another.
export function I18nProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  return <I18nContext.Provider value={{ locale, t: dictionaries[locale], setLocale }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

// The common case: components that only need strings, not the locale or
// the switcher. `const t = useTranslation();` drops straight into existing
// `t.foo.bar` call sites.
export function useTranslation() {
  return useI18n().t;
}

// For components that need the locale itself without the full dictionary —
// e.g. to pass into formatKc, which prices in € for "en" and Kč otherwise.
export function useLocale() {
  return useI18n().locale;
}
