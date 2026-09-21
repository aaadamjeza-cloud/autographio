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
      <Link href="/prihlaseni" className="btn btn-primary">
        Přihlásit se
      </Link>
    </main>
  );
}
