import "server-only";
import { cookies } from "next/headers";
import { dictionaries } from "./dictionaries";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./locale";

// Server Component counterpart to useTranslation() — reads the same cookie
// the client's I18nProvider writes to, so both sides of a page agree on
// which dictionary to render.
export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  const raw = store.get(LOCALE_COOKIE)?.value;
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

export async function getServerTranslation() {
  return dictionaries[await getServerLocale()];
}
