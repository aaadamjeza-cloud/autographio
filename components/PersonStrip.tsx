"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PersonPortrait from "@/components/PersonPortrait";
import Price from "@/components/Price";
import { createClient } from "@/lib/supabase/client";
import type { MockPerson } from "@/lib/mockData/persons";

const SUPABASE_BUCKET = "person-portraits";

// Client Component so it can batch-fetch every uploaded portrait in one
// query (see PersonPortrait's skipOwnLookup) — the rest of the homepage
// stays a Server Component; only this strip needs the browser-side fetch.
export default function PersonStrip({ persons }: { persons: MockPerson[] }) {
  const [portraitUrls, setPortraitUrls] = useState<Map<string, string>>(new Map());

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

  return (
    <>
      {persons.map((p) => (
        <Link key={p.slug} href={`/osobnosti/${p.slug}`} className="person-card strip-card">
          <PersonPortrait
            slug={p.slug}
            name={p.name}
            category={p.category}
            gender={p.gender}
            size={72}
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
    </>
  );
}
