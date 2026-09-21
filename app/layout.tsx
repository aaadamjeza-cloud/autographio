import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — katalog a sbírka autogramů`,
  description: "Soukromá evidence sbírky autogramů, katalog osobností a sledování žádostí o podpis.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
