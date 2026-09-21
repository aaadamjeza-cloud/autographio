"use client";

import { useState } from "react";
import PersonPortrait from "@/components/PersonPortrait";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import { CATEGORY_LABELS, type MockPerson } from "@/lib/mockData/persons";
import { formatKc } from "@/lib/format";
import t from "@/lib/i18n";

export default function PersonDetailClient({ person }: { person: MockPerson }) {
  const [salesOpen, setSalesOpen] = useState(false);
  const saleListings = person.saleListings ?? [];

  return (
    <>
      <div className="person-layout">
        <PersonPortrait slug={person.slug} name={person.name} category={person.category} variant="wide" />

        <div className="person-info-panel">
          <h1 className="person-title">
            {person.name} — {t.itemType.autograph}
          </h1>
          <p className="person-detail-meta">
            {CATEGORY_LABELS[person.category]} · {person.nationality} · {person.birthYear}
            {person.deathYear ? `–${person.deathYear}` : " – dosud"}
          </p>

          {person.marketPrice != null && <p className="person-detail-price">{formatKc(person.marketPrice)}</p>}

          {saleListings.length > 0 && (
            <button type="button" className="person-sales-btn" onClick={() => setSalesOpen(true)}>
              {t.persons.verifiedSales} ({saleListings.length})
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>

      <div className="person-content">
        {person.bio && (
          <section style={{ marginTop: 40 }}>
            <h2 className="person-section-title">{t.persons.bio}</h2>
            <p className="person-section-text">{person.bio}</p>
          </section>
        )}

        {person.funFact && (
          <section style={{ marginTop: 32 }}>
            <h2 className="person-section-title">{t.persons.funFact}</h2>
            <p className="person-section-text">{person.funFact}</p>
          </section>
        )}

        {person.priceHistory && person.priceHistory.length > 1 && (
          <section style={{ marginTop: 32 }}>
            <h2 className="person-section-title">{t.persons.priceHistory}</h2>
            <PriceHistoryChart data={person.priceHistory} />
          </section>
        )}

        {person.filmography && person.filmography.length > 0 && (
          <section style={{ marginTop: 32 }}>
            <h2 className="person-section-title">{t.persons.filmography}</h2>
            <ul className="person-filmography">
              {person.filmography.map((film, i) => (
                <li key={`${film.year}-${film.title}-${i}`}>
                  <span className="person-filmography-year">{film.year}</span>
                  <span>
                    {film.title}
                    {film.note ? ` (${film.note})` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {salesOpen && (
        <div className="person-drawer-overlay" onClick={() => setSalesOpen(false)}>
          <div className="person-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="person-drawer-header">
              <h3>{t.persons.verifiedSales}</h3>
              <button type="button" onClick={() => setSalesOpen(false)} aria-label={t.common.close}>
                ✕
              </button>
            </div>
            <div className="person-drawer-body">
              {saleListings.map((listing) => (
                <a
                  key={listing.url}
                  href={listing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="person-sale-link"
                >
                  {listing.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
