"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import PersonAvatar from "@/components/PersonAvatar";
import { CATEGORY_LABELS, CATEGORY_COLORS, MOCK_PERSONS, type PersonCategory } from "@/lib/mockData/persons";

const TABS: Array<{ key: PersonCategory | "all"; label: string }> = [
  { key: "all", label: "Vše" },
  ...(Object.keys(CATEGORY_LABELS) as PersonCategory[]).map((key) => ({ key, label: CATEGORY_LABELS[key] })),
];

export default function PersonsPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<PersonCategory | "all">("all");

  const filtered = useMemo(() => {
    return MOCK_PERSONS.filter((p) => {
      if (tab !== "all" && p.category !== tab) return false;
      if (query.trim() && !p.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });
  }, [query, tab]);

  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 20 }}>
          Osobnosti
        </h1>

        <div className="persons-toolbar">
          <div className="persons-search-wrap">
            <input
              className="persons-search"
              type="text"
              placeholder="Hledat osobnost…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="persons-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`persons-tab${tab === t.key ? " active" : ""}`}
                onClick={() => setTab(t.key)}
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
              <PersonAvatar name={p.name} category={p.category} />
              <div>
                <p className="person-card-name">{p.name}</p>
                <p className="person-card-years">
                  {p.birthYear}
                  {p.deathYear ? `–${p.deathYear}` : ""}
                </p>
              </div>
              <span className="person-badge" style={{ background: CATEGORY_COLORS[p.category] }}>
                {CATEGORY_LABELS[p.category]}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
