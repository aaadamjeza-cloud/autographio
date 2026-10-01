"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { SITE_NAME } from "@/lib/site";
import { formatKc } from "@/lib/format";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LOCALES, LOCALE_FLAGS, LOCALE_LABELS } from "@/lib/i18n/locale";
import { MOCK_PERSONS } from "@/lib/mockData/persons";
import { MOCK_FILMS } from "@/lib/mockData/films";

export default function Header({ latestSale = null }: { latestSale?: { name: string; price: number } | null }) {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { t, locale, setLocale } = useI18n();
  const [accountOpen, setAccountOpen] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  // Separate from localeOpen/localeRef — the drawer's own trigger is a
  // different DOM node rendered at the same time (in a portal), not a
  // responsive re-layout of the same one, so it needs its own open state
  // and click-outside ref rather than sharing the header row's.
  const [drawerLocaleOpen, setDrawerLocaleOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const accountRef = useRef<HTMLDivElement>(null);
  const localeRef = useRef<HTMLDivElement>(null);
  const drawerLocaleRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // The drawer/backdrop portal into document.body — see below — only works
  // once the DOM exists, i.e. after client mount; this is the standard
  // client-only-render escape hatch, not state synced from an external system.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!accountOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountOpen]);

  useEffect(() => {
    if (!localeOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (localeRef.current && !localeRef.current.contains(e.target as Node)) setLocaleOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [localeOpen]);

  useEffect(() => {
    if (!drawerLocaleOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (drawerLocaleRef.current && !drawerLocaleRef.current.contains(e.target as Node)) setDrawerLocaleOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [drawerLocaleOpen]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // Lock background scroll while the drawer is open — otherwise the page
  // behind it keeps scrolling on touch devices, which fights the drawer's
  // own scroll and feels broken.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  // Move focus into the drawer when it opens (so keyboard/screen-reader
  // users land somewhere sensible instead of on now-hidden page content),
  // and back to the hamburger when it closes.
  useEffect(() => {
    if (menuOpen) {
      drawerRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    } else {
      hamburgerRef.current?.focus();
    }
  }, [menuOpen]);

  // Basic focus trap: Tab/Shift+Tab wrap within the drawer's focusable
  // elements instead of escaping into the (visually hidden, but still
  // present) page behind it.
  function handleDrawerKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Tab" || !drawerRef.current) return;
    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'button, a[href], input, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openAccountMenu() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setAccountOpen(true);
  }

  // Small delay so moving the mouse from the button down into the menu
  // (across the gap between them) doesn't close it before you get there.
  function scheduleCloseAccountMenu() {
    closeTimer.current = setTimeout(() => setAccountOpen(false), 150);
  }

  async function handleLogout() {
    setAccountOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  }

  function handleLocaleChange(next: (typeof LOCALES)[number]) {
    setLocaleOpen(false);
    setDrawerLocaleOpen(false);
    if (next === locale) return;
    setLocale(next);
    router.refresh();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    if (!q) {
      router.push("/osobnosti");
      setMenuOpen(false);
      return;
    }
    // The search box's own placeholder promises both osobnosti and filmy,
    // but they live on two separate catalog pages — this decides which one
    // to send the query to. Persons are the app's primary catalog (and
    // /osobnosti's own filter also covers community-submitted DB persons
    // this check can't see), so a query only routes to /filmy when nothing
    // on the person side matches but a film title does; everything else,
    // including no match at all, goes to /osobnosti and lets its own
    // (more complete) filter decide.
    const qLower = q.toLowerCase();
    const matchesPerson = MOCK_PERSONS.some((p) => p.name.toLowerCase().includes(qLower));
    const matchesFilm = MOCK_FILMS.some((f) => f.title.toLowerCase().includes(qLower));
    const destination = !matchesPerson && matchesFilm ? "/filmy" : "/osobnosti";
    router.push(`${destination}?hledat=${encodeURIComponent(q)}`);
    setMenuOpen(false);
  }

  const categoryLinks = [
    { label: t.header.navAll, href: "/osobnosti" },
    { label: t.header.navActors, href: "/osobnosti?kategorie=herec" },
    { label: t.header.navAthletes, href: "/osobnosti?kategorie=sportovec" },
    { label: t.header.navWriters, href: "/osobnosti?kategorie=spisovatel" },
    { label: t.header.navMusicians, href: "/osobnosti?kategorie=hudebnik" },
  ];
  // Not a person-category filter like the others — a visually distinct
  // link (see .site-header-row2-link-films) so it doesn't read as one more
  // tab in that group.
  const filmsLink = { label: t.films.title, href: "/filmy" };

  return (
    <header className="site-header">
      {/* ── Row 1: logo, search, account ── */}
      <div className="site-header-row1">
        <Link href="/" className="site-header-logo">
          {SITE_NAME.toLowerCase()}
        </Link>

        <form className="site-header-search" onSubmit={handleSearch} role="search">
          <svg className="site-header-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t.header.searchPlaceholder}
            aria-label={t.header.searchPlaceholder}
          />
        </form>

        <div className="site-header-row1-actions">
          <div className="hero-nav-locale" ref={localeRef}>
            <button
              type="button"
              className="hero-nav-locale-trigger"
              onClick={() => setLocaleOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={localeOpen}
              aria-label={`${LOCALE_LABELS[locale]} — ${t.common.menu}`}
            >
              {LOCALE_FLAGS[locale]}
            </button>
            {localeOpen && (
              <div className="hero-nav-locale-menu" role="menu">
                {LOCALES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    role="menuitemradio"
                    aria-checked={code === locale}
                    className={`hero-nav-locale-menu-item${code === locale ? " hero-nav-locale-menu-item-active" : ""}`}
                    onClick={() => handleLocaleChange(code)}
                  >
                    <span className="hero-nav-locale-menu-flag" aria-hidden="true">
                      {LOCALE_FLAGS[code]}
                    </span>
                    {LOCALE_LABELS[code]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isSignedIn ? (
            <div className="hero-nav-account" ref={accountRef} onMouseEnter={openAccountMenu} onMouseLeave={scheduleCloseAccountMenu}>
              <button
                type="button"
                className="site-header-account-trigger"
                onClick={() => setAccountOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={accountOpen}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="2" />
                  <path d="M4.8 20c0-4 3.2-6.8 7.2-6.8s7.2 2.8 7.2 6.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {t.common.myAccount}
              </button>
              {accountOpen && (
                <div className="hero-nav-account-menu">
                  <Link href="/moje-sbirka" className="hero-nav-account-item" onClick={() => setAccountOpen(false)}>
                    {t.collection.title}
                  </Link>
                  <Link href="/moje-zadosti" className="hero-nav-account-item" onClick={() => setAccountOpen(false)}>
                    {t.requests.title}
                  </Link>
                  <Link href="/nastaveni" className="hero-nav-account-item" onClick={() => setAccountOpen(false)}>
                    {t.settings.title}
                  </Link>
                  <button type="button" className="hero-nav-account-item hero-nav-account-item-danger" onClick={handleLogout}>
                    {t.auth.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/prihlaseni" className="hero-nav-link site-header-login-link">
                {t.auth.login}
              </Link>
              <Link href="/registrace" className="btn btn-primary hero-nav-cta">
                {t.auth.signUp}
              </Link>
            </>
          )}

          <button
            ref={hamburgerRef}
            type="button"
            className={`hero-nav-hamburger${menuOpen ? " hero-nav-hamburger-open" : ""}`}
            aria-label={t.common.menu}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* ── Row 2: category nav + live "latest sale" pill (centered) ── */}
      <nav className="site-header-row2" aria-label={t.header.navHomeAria}>
        <div className="site-header-row2-nav">
          <Link href="/" className="site-header-row2-home" aria-label={t.header.navHomeAria}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
              <path
                d="M4 11.5 12 4l8 7.5M6 10v9h5v-5h2v5h5v-9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          {categoryLinks.map((c) => (
            <Link key={c.href} href={c.href} className="site-header-row2-link">
              {c.label}
            </Link>
          ))}
          <Link href={filmsLink.href} className="site-header-row2-link site-header-row2-link-films">
            {filmsLink.label}
          </Link>
        </div>

        {latestSale && (
          <div className="site-header-latest-sale">
            <span className="site-header-latest-sale-prefix">{t.header.latestSalePrefix}</span>
            <span className="site-header-latest-sale-name">{latestSale.name}</span>
            <span className="site-header-latest-sale-price">{formatKc(latestSale.price, locale)}</span>
          </div>
        )}
      </nav>

      {mounted &&
        createPortal(
          <>
            <div
              className={`hero-nav-drawer-backdrop${menuOpen ? " hero-nav-drawer-backdrop-open" : ""}`}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <nav
              id="mobile-drawer"
              ref={drawerRef}
              className={`hero-nav-drawer${menuOpen ? " hero-nav-drawer-open" : ""}`}
              aria-label={t.common.menu}
              onKeyDown={handleDrawerKeyDown}
            >
              <div className="hero-nav-drawer-top">
                <span className="hero-nav-drawer-brand">{SITE_NAME.toLowerCase()}</span>
                <button
                  type="button"
                  className="hero-nav-drawer-close"
                  aria-label={t.common.close}
                  onClick={() => setMenuOpen(false)}
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </div>

              <form className="site-header-search site-header-search-mobile" onSubmit={handleSearch} role="search">
                <svg className="site-header-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t.header.searchPlaceholder}
                  aria-label={t.header.searchPlaceholder}
                />
              </form>

              <div className="hero-nav-drawer-links">
                {categoryLinks.map((c) => (
                  <Link key={c.href} href={c.href} className="hero-nav-drawer-link" onClick={() => setMenuOpen(false)}>
                    {c.label}
                  </Link>
                ))}
                <Link href={filmsLink.href} className="hero-nav-drawer-link" onClick={() => setMenuOpen(false)}>
                  {filmsLink.label}
                </Link>
                {isSignedIn && (
                  <>
                    <Link href="/moje-sbirka" className="hero-nav-drawer-link" onClick={() => setMenuOpen(false)}>
                      {t.collection.title}
                    </Link>
                    <Link href="/moje-zadosti" className="hero-nav-drawer-link" onClick={() => setMenuOpen(false)}>
                      {t.requests.title}
                    </Link>
                    <Link href="/nastaveni" className="hero-nav-drawer-link" onClick={() => setMenuOpen(false)}>
                      {t.settings.title}
                    </Link>
                  </>
                )}
              </div>

              <div className="hero-nav-drawer-bottom">
                {isSignedIn ? (
                  <button
                    type="button"
                    className="btn hero-nav-drawer-btn-outline"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    {t.auth.logout}
                  </button>
                ) : (
                  <>
                    <Link
                      href="/registrace"
                      className="btn btn-primary hero-nav-drawer-btn-primary"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t.auth.signUp}
                    </Link>
                    <Link href="/prihlaseni" className="btn hero-nav-drawer-btn-outline" onClick={() => setMenuOpen(false)}>
                      {t.auth.login}
                    </Link>
                  </>
                )}
                <div className="hero-nav-locale hero-nav-drawer-locale" ref={drawerLocaleRef}>
                  <button
                    type="button"
                    className="hero-nav-locale-trigger"
                    onClick={() => setDrawerLocaleOpen((v) => !v)}
                    aria-haspopup="true"
                    aria-expanded={drawerLocaleOpen}
                    aria-label={`${LOCALE_LABELS[locale]} — ${t.common.menu}`}
                  >
                    {LOCALE_FLAGS[locale]}
                  </button>
                  {drawerLocaleOpen && (
                    <div className="hero-nav-locale-menu hero-nav-locale-menu-up" role="menu">
                      {LOCALES.map((code) => (
                        <button
                          key={code}
                          type="button"
                          role="menuitemradio"
                          aria-checked={code === locale}
                          className={`hero-nav-locale-menu-item${code === locale ? " hero-nav-locale-menu-item-active" : ""}`}
                          onClick={() => {
                            handleLocaleChange(code);
                            setMenuOpen(false);
                          }}
                        >
                          <span className="hero-nav-locale-menu-flag" aria-hidden="true">
                            {LOCALE_FLAGS[code]}
                          </span>
                          {LOCALE_LABELS[code]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </>,
          document.body
        )}
    </header>
  );
}
