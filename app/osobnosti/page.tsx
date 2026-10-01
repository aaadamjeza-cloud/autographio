"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import PersonPortrait from "@/components/PersonPortrait";
import Price from "@/components/Price";
import { createClient } from "@/lib/supabase/client";
import { CATEGORY_LABELS, MOCK_PERSONS, type MockPerson, type PersonCategory } from "@/lib/mockData/persons";
import { DB_PERSON_COLUMNS, dbPersonToPerson, type DbPerson } from "@/lib/dbPerson";
import { useTranslation } from "@/lib/i18n/I18nProvider";

const SUPABASE_BUCKET = "person-portraits";

const TABS: Array<{ key: PersonCategory | "all"; label: string }> = [
  { key: "all", label: "Vše" },
  ...(Object.keys(CATEGORY_LABELS) as PersonCategory[]).map((key) => ({ key, label: CATEGORY_LABELS[key] })),
];

function isPersonCategory(value: string | null): value is PersonCategory {
  return !!value && value in CATEGORY_LABELS;
}

const MOCK_SLUGS = new Set(MOCK_PERSONS.map((p) => p.slug));

function PersonsPageContent() {
  const t = useTranslation();
  // Reactive to the URL's own query (unlike reading window.location.search
  // once in a useState initializer), so a category tile linking here with
  // ?kategorie=... — a client-side <Link> transition, not a full reload —
  // actually lands pre-filtered instead of silently falling back to "Vše".
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("kategorie");
  const searchFromUrl = searchParams.get("hledat") ?? "";

  // Same derive-from-URL-until-overridden pattern as `tab` below — the
  // header's search box (see components/Header.tsx) does a client-side
  // <router.push> to `/osobnosti?hledat=...`, which re-renders this same
  // page instance rather than remounting it, so a plain useState seeded
  // once wouldn't pick up a second search typed from the header.
  const [queryOverride, setQueryOverride] = useState<string | null>(null);
  const query = queryOverride ?? searchFromUrl;
  // null = no manual pick yet, so the URL's ?kategorie= (if any) still
  // drives the active tab; clicking a tab sets an explicit override that
  // then wins even if the URL doesn't change again. Derived during render
  // rather than synced via an effect, so a client-side <Link> transition to
  // a new ?kategorie= is reflected immediately, not one render late.
  const [tabOverride, setTabOverride] = useState<PersonCategory | "all" | null>(null);
  const tab = tabOverride ?? (isPersonCategory(categoryFromUrl) ? categoryFromUrl : "all");
  const [portraitUrls, setPortraitUrls] = useState<Map<string, string>>(new Map());
  // Approved catalog rows that exist only in the database — i.e. entries
  // people suggested and a reviewer let through (0011_person_submissions).
  // Everything seeded from lib/mockData is skipped here, since the code
  // version of the same slug carries much more (bio, filmography, prices).
  const [dbPersons, setDbPersons] = useState<MockPerson[]>([]);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    (async () => {
      const { data } = await supabase.from("persons").select(DB_PERSON_COLUMNS).eq("status", "approved");
      if (cancelled || !data) return;
      setDbPersons((data as DbPerson[]).filter((row) => !MOCK_SLUGS.has(row.slug)).map(dbPersonToPerson));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // One query for every uploaded portrait, instead of each of the 200+
  // grid tiles firing its own — see PersonPortrait's skipOwnLookup, which
  // is what let per-tile queries pile up and made photos slow to appear.
  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    (async () => {
      const { data } = await supabase.from("person_portraits").select("slug, storage_path");
      if (cancelled || !data) return;
      const map = new Map<string, string>();
      for (const row of data) {
        const { data: pub } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(row.storage_path);
        map.set(row.slug, pub.publicUrl);
      }
      setPortraitUrls(map);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const matches = [...MOCK_PERSONS, ...dbPersons].filter((p) => {
      if (tab !== "all" && p.category !== tab) return false;
      if (query.trim() && !p.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });
    // Photo-less cards read as an empty, half-finished catalog when they're
    // scattered among the ones with a real portrait — grouping them below
    // keeps the top of the grid (and everything above the fold) visually full.
    const hasPhoto = (p: (typeof matches)[number]) => portraitUrls.has(p.slug) || !!p.portrait;
    // Within each of those groups, Czech names lead — most visitors are
    // browsing for someone from a Czech collection, so that's who should
    // greet them first instead of being mixed in further down.
    const isCzech = (p: (typeof matches)[number]) => p.nationality === "Česko";
    return [...matches].sort((a, b) => {
      const byPhoto = Number(hasPhoto(b)) - Number(hasPhoto(a));
      if (byPhoto !== 0) return byPhoto;
      return Number(isCzech(b)) - Number(isCzech(a));
    });
  }, [query, tab, portraitUrls, dbPersons]);

  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div className="persons-heading">
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)" }}>Osobnosti</h1>
          <Link href="/osobnosti/navrhnout" className="btn">
            + {t.suggestPerson.cta}
          </Link>
        </div>

        <div className="persons-toolbar">
          <div className="persons-search-wrap">
            <input
              className="persons-search"
              type="text"
              placeholder="Hledat osobnost…"
              value={query}
              onChange={(e) => setQueryOverride(e.target.value)}
            />
          </div>
          <div className="persons-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`persons-tab${tab === t.key ? " active" : ""}`}
                onClick={() => setTabOverride(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <p className="persons-count">{filtered.length} osobností</p>

        <div className="persons-grid">
          {filtered.length === 0 && <p className="persons-empty">Žádná osobnost neodpovídá hledání.</p>}
          {filtered.map((p) => (
            <Link key={p.slug} href={`/osobnosti/${p.slug}`} className="person-card">
              <PersonPortrait
                slug={p.slug}
                name={p.name}
                category={p.category}
                gender={p.gender}
                showRemove={false}
                fallbackPortrait={p.portrait}
                persist="supabase"
                skipOwnLookup
                preloadedUrl={portraitUrls.get(p.slug) ?? null}
              />
              <div className="person-card-info">
                <p className="person-card-name">{p.name}</p>
                <p className="person-card-years">{p.deathYear ? `${p.birthYear}–${p.deathYear}` : `nar. ${p.birthYear}`}</p>
              </div>
              <div className="person-card-price">
                <Price
                  value={p.marketPriceMin != null && p.marketPriceMax != null ? (p.marketPriceMin + p.marketPriceMax) / 2 : undefined}
                  category={p.category}
                />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export default function PersonsPage() {
  return (
    <Suspense fallback={null}>
      <PersonsPageContent />
    </Suspense>
  );
}
