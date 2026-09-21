import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "rgba(255,255,255,.85)",
        backdropFilter: "blur(16px) saturate(140%)",
        borderBottom: "1px solid var(--line-soft)",
        padding: "14px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link
          href="/"
          style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-0.03em", color: "var(--ink)", textDecoration: "none" }}
        >
          {SITE_NAME.toLowerCase()}
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/osobnosti" style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-2)", textDecoration: "none" }}>
            Osobnosti
          </Link>
          <Link href="/prihlaseni" className="btn" style={{ padding: "10px 20px", fontSize: 14 }}>
            Přihlásit se
          </Link>
        </nav>
      </div>
    </header>
  );
}
