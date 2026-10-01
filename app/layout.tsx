import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { csCZ } from "@clerk/localizations";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { clerkAppearance } from "@/lib/clerkAppearance";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { getServerLocale } from "@/lib/i18n/server";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — katalog a sbírka autogramů`,
  description: "Soukromá evidence sbírky autogramů, katalog osobností a sledování žádostí o podpis.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getServerLocale();

  // csCZ is Clerk's own localization for its hosted UI (sign-in modal etc.)
  // — a separate concern from lib/i18n. Swap it alongside `locale` once a
  // second Clerk localization is actually needed.
  return (
    <ClerkProvider localization={csCZ} appearance={clerkAppearance}>
      <html lang={locale} className="h-full antialiased">
        <body className="min-h-full flex flex-col">
          <I18nProvider initialLocale={locale}>
            {children}
            <Footer />
          </I18nProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
