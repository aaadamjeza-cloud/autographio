import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="text-4xl font-black tracking-tight" style={{ color: "var(--ink)" }}>
        {SITE_NAME}
      </h1>
      <p className="max-w-md text-lg" style={{ color: "var(--ink-2)" }}>
        Katalog osobností a soukromá evidence sbírky autogramů — ve výstavbě.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/osobnosti" className="btn btn-primary">
          Katalog osobností
        </Link>
        <Link href="/prihlaseni" className="btn">
          Přihlásit se
        </Link>
      </div>
    </main>
  );
}
