import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { getServerTranslation } from "@/lib/i18n/server";

export default async function Footer() {
  const t = await getServerTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link href="/" className="site-footer-name">
            {SITE_NAME.toLowerCase()}
          </Link>
          <svg className="site-footer-signature" viewBox="0 0 240 70" fill="none" aria-hidden="true">
            <path
              d="M8 54 C 12 30, 18 10, 30 8 C 40 6, 46 20, 42 34 C 40 41, 33 38, 35 30 C 37 23, 45 22, 49 34 C 52 43, 54 50, 58 54 C 66 47, 72 35, 82 38 C 92 41, 87 56, 97 58 C 107 60, 111 44, 123 36 C 133 29, 143 32, 147 44 C 149 51, 141 58, 149 60 C 161 63, 182 56, 202 46 C 211 41, 219 42, 225 48 C 229 52, 225 57, 219 55"
              stroke="var(--accent)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="site-footer-copy">
          © {year} {SITE_NAME}
        </p>
        {/* TODO: real contact e-mail and social links go here once we have them —
            intentionally not filled with placeholders (see AGENTS.md / no fake content). */}
        <nav className="site-footer-links">
          <Link href="/osobnosti" className="site-footer-link">
            {t.persons.title}
          </Link>
          <Link href="/filmy" className="site-footer-link">
            {t.films.title}
          </Link>
          <Link href="/soukromi" className="site-footer-link">
            {t.footer.privacy}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
