import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function Header() {
  return (
    <header className="hero-nav">
      <div className="hero-nav-bar">
        <Link href="/" className="hero-nav-name">
          {SITE_NAME.toLowerCase()}
        </Link>
        <nav className="hero-nav-links">
          <Link href="/osobnosti" className="hero-nav-link">
            Osobnosti
          </Link>
          <Link href="/prihlaseni" className="btn">
            Přihlásit se
          </Link>
        </nav>
      </div>
    </header>
  );
}
