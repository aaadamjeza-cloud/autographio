"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import FilmPoster from "@/components/FilmPoster";
import { MOCK_FILMS } from "@/lib/mockData/films";
import t from "@/lib/i18n";

export default function FilmsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return MOCK_FILMS.filter((f) => !query.trim() || f.title.toLowerCase().includes(query.trim().toLowerCase()));
  }, [query]);

  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 20 }}>
          {t.films.title}
        </h1>

        <div className="persons-toolbar">
          <div className="persons-search-wrap">
            <input
              className="persons-search"
              type="text"
              placeholder={t.films.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="films-grid">
          {filtered.length === 0 && <p className="persons-empty">Žádný film neodpovídá hledání.</p>}
          {filtered.map((f) => (
            <Link key={f.slug} href={`/filmy/${f.slug}`} className="film-card">
              <FilmPoster slug={f.slug} title={f.title} />
              <p className="film-card-year">{f.year}</p>
              <p className="film-card-title">{f.title}</p>
              <p className="film-card-director">
                {t.films.director}: {f.director}
              </p>
              <p className="film-card-director">
                {t.films.cast}: {f.cast.length}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
