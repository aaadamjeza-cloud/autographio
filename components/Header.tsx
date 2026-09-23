"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE_NAME } from "@/lib/site";
import { createClient } from "@/lib/supabase/client";
import t from "@/lib/i18n";

export default function Header() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setLoggedIn(!!session?.user));
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="hero-nav">
      <div className="hero-nav-bar">
        <Link href="/" className="hero-nav-name">
          {SITE_NAME.toLowerCase()}
        </Link>
        <nav className="hero-nav-links">
          <Link href="/osobnosti" className="hero-nav-link">
            {t.persons.title}
          </Link>
          <Link href="/filmy" className="hero-nav-link">
            {t.films.title}
          </Link>
          {loggedIn && (
            <Link href="/moje-sbirka/pridat" className="hero-nav-link">
              {t.collection.addItem}
            </Link>
          )}
          {loggedIn ? (
            <button type="button" className="btn" onClick={handleLogout}>
              {t.auth.logout}
            </button>
          ) : (
            <Link href="/prihlaseni" className="btn">
              {t.auth.login}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
