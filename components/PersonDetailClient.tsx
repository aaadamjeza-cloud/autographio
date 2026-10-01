"use client";

import { useState } from "react";
import Link from "next/link";
import PersonPortrait from "@/components/PersonPortrait";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import PriceReportForm from "@/components/PriceReportForm";
import ContentReportButton from "@/components/ContentReportButton";
import SignatureGallery, { type SignaturePhoto } from "@/components/SignatureGallery";
import { CATEGORY_LABELS, type MockPerson } from "@/lib/mockData/persons";
import { findMockFilmByTitle } from "@/lib/mockData/films";
import { formatKc, formatDate } from "@/lib/format";
import { useTranslation, useLocale } from "@/lib/i18n/I18nProvider";

export type RequestStats = {
  total_count: number;
  success_rate: number | null;
  median_wait_days: number | null;
  min_wait_days: number | null;
  max_wait_days: number | null;
};

export type PriceReport = {
  id: string;
  price: number;
  currency: string;
  sold_at: string | null;
  source_name: string;
  source_url: string;
  title: string | null;
};

// Short marketplace label instead of the full link text as the primary
// thing a visitor scans — "Aukro" reads faster than repeating the person's
// name in every card.
function saleSourceLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("aukro")) return "Aukro";
    if (host.includes("ebay")) return "eBay";
    return host;
  } catch {
    return "";
  }
}

export default function PersonDetailClient({
  person,
  personId,
  pendingReview = false,
  requestStats,
  priceReports,
  signaturePhotos,
  currentUserName,
}: {
  person: MockPerson;
  personId: string | null;
  pendingReview?: boolean;
  requestStats: RequestStats | null;
  priceReports: PriceReport[];
  signaturePhotos: SignaturePhoto[];
  currentUserName: string | null;
}) {
  const t = useTranslation();
  const locale = useLocale();
  const saleListings = person.saleListings ?? [];
  // Lives here rather than inside SignatureGallery because both the button
  // on the portrait and the one down in the gallery open the same dialog.
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      {pendingReview && <p className="person-pending-notice">{t.review.pendingNotice}</p>}

      <div className="person-layout">
        <div className="person-portrait-wrap">
          {/* This hero tile is the signature-photo slot, not the celebrity's
              portrait — showing their face here (even the sourced Commons
              fallback) misrepresents what the CTA below is asking for. The
              actual portrait still shows further down in the bio section. */}
          <div className="portrait-tile-wide">
            {signaturePhotos.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element -- public Storage URL, not an optimizable local asset
              <img src={signaturePhotos[0].url} alt="" className="portrait-img" />
            ) : (
              <span className="portrait-placeholder-wide" aria-hidden="true" />
            )}
          </div>
          {personId && signaturePhotos.length === 0 && (
            <button type="button" className="signature-hero-cta" onClick={() => setUploadOpen(true)}>
              {t.signatures.cta}
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>

        <div className="person-info-panel">
          <h1 className="person-title">
            {person.name} — {t.itemType.autograph}
          </h1>
          <p className="person-detail-meta">
            {CATEGORY_LABELS[person.category]} · {person.nationality} · {person.birthYear}
            {person.deathYear ? `–${person.deathYear}` : " – dosud"}
          </p>

          {person.marketPriceMin != null && person.marketPriceMax != null && (
            <p className={`person-detail-price${saleListings.length === 0 ? " person-detail-price--estimate" : ""}`}>
              {formatKc(person.marketPriceMin, locale)} – {formatKc(person.marketPriceMax, locale)}
              {person.rare && <span className="person-rare-badge">Vzácný</span>}
              {saleListings.length === 0 && <span className="person-estimate-badge">Odhad</span>}
            </p>
          )}

          {saleListings.length > 0 && (
            <a href="#prodeje" className="person-sales-btn">
              {t.persons.verifiedSales} ({saleListings.length})
              <span aria-hidden="true">→</span>
            </a>
          )}

        </div>
      </div>

      <div className="person-content">
        {person.bio && (
          <section style={{ marginTop: 40 }}>
            <div className="person-profile-pick">
              <PersonPortrait
                slug={person.slug}
                name={person.name}
                category={person.category}
                gender={person.gender}
                size={112}
                showRemove={false}
                fallbackPortrait={person.portrait}
                persist="supabase"
              />
            </div>
            {person.portrait && person.portrait.source === "ai" ? (
              <p className="person-portrait-credit">{t.persons.photoCreditAi}</p>
            ) : person.portrait ? (
              <p className="person-portrait-credit">
                {t.persons.photoCreditPrefix} {person.portrait.author} — {person.portrait.license},{" "}
                <a href={person.portrait.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {t.persons.photoCreditCommonsLink}
                </a>
              </p>
            ) : null}
            <h2 className="person-section-title">{person.gender === "f" ? t.persons.bioFemale : t.persons.bio}</h2>
            <p className="person-section-text">{person.bio}</p>
          </section>
        )}

        {person.funFact && (
          <section style={{ marginTop: 32 }}>
            <h2 className="person-section-title">{t.persons.funFact}</h2>
            <p className="person-section-text">{person.funFact}</p>
            {person.funFactSourceUrl && (
              <a href={person.funFactSourceUrl} target="_blank" rel="noopener noreferrer" className="person-source-link">
                {t.persons.source}
              </a>
            )}
          </section>
        )}

        {saleListings.length > 0 && (
          <section id="prodeje" style={{ marginTop: 32, scrollMarginTop: 88 }}>
            <h2 className="person-section-title">{t.persons.verifiedSales}</h2>
            {person.priceHistory && person.priceHistory.length > 0 && <PriceHistoryChart data={person.priceHistory} />}
            <div className="person-sales-list">
              {saleListings.map((listing) => (
                <a key={listing.url} href={listing.url} target="_blank" rel="noopener noreferrer" className="person-sale-link">
                  <span className="person-sale-source">{saleSourceLabel(listing.url)}</span>
                  <span className="person-sale-title">{listing.title}</span>
                  <span className="person-sale-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {requestStats && (
          <section style={{ marginTop: 32 }}>
            <h2 className="person-section-title">
              {t.persons.requestStats} ({requestStats.total_count})
            </h2>
            <ul className="person-filmography">
              {requestStats.success_rate != null && (
                <li>
                  <span>
                    {t.persons.successRate}: {requestStats.success_rate}%
                  </span>
                </li>
              )}
              {requestStats.median_wait_days != null && (
                <li>
                  <span>
                    {t.persons.medianWait}: {requestStats.median_wait_days} {t.persons.days}
                  </span>
                </li>
              )}
              {requestStats.min_wait_days != null && requestStats.max_wait_days != null && (
                <li>
                  <span>
                    {t.persons.waitRange}: {requestStats.min_wait_days}–{requestStats.max_wait_days} {t.persons.days}
                  </span>
                </li>
              )}
            </ul>
          </section>
        )}

        {personId && (
          <section style={{ marginTop: 32 }}>
            <h2 className="person-section-title">{t.persons.communityPrices}</h2>
            {priceReports.length > 0 && (
              <div className="person-sales-list" style={{ marginBottom: 12 }}>
                {priceReports.map((report) => (
                  <a key={report.id} href={report.source_url} target="_blank" rel="noopener noreferrer" className="person-sale-link">
                    {formatKc(report.price, locale)} — {report.title ?? report.source_name}
                    {report.sold_at ? ` (${formatDate(report.sold_at)})` : ""}
                  </a>
                ))}
              </div>
            )}
            <PriceReportForm personId={personId} />
          </section>
        )}

        {person.filmography && person.filmography.length > 0 && (
          <section style={{ marginTop: 32 }}>
            <h2 className="person-section-title">{t.persons.filmography}</h2>
            <ul className="person-filmography">
              {person.filmography.map((film, i) => {
                const matchedFilm = findMockFilmByTitle(film.title);
                return (
                  <li key={`${film.year}-${film.title}-${i}`}>
                    <span className="person-filmography-year">{film.year}</span>
                    <span>
                      {matchedFilm ? (
                        <Link href={`/filmy/${matchedFilm.slug}`} className="film-cast-link">
                          {film.title}
                        </Link>
                      ) : (
                        film.title
                      )}
                      {film.note ? ` (${film.note})` : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {personId && (
          <SignatureGallery
            personId={personId}
            initialPhotos={signaturePhotos}
            currentUserName={currentUserName}
            uploadOpen={uploadOpen}
            onUploadOpenChange={setUploadOpen}
          />
        )}

        {personId && (
          <section style={{ marginTop: 40 }}>
            <ContentReportButton targetType="person" targetId={personId} />
          </section>
        )}
      </div>
    </>
  );
}
