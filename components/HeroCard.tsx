"use client";

import { useState } from "react";
import Link from "next/link";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import { formatKc, formatKcRange } from "@/lib/format";
import { useTranslation, useLocale } from "@/lib/i18n/I18nProvider";
import type { PriceHistoryPoint } from "@/lib/mockData/persons";

const CHART_YEAR_MIN = 2018;
const CHART_YEAR_MAX = 2026;

export type HeroCardData = {
  name: string;
  categoryLabel: string;
  birthYear: number;
  photoUrl: string | null;
  photoAlt: string;
  href: string;
  priceMin: number;
  priceMax: number;
  lastSale: { price: number; year: number; source: string | null } | null;
  priceHistory: PriceHistoryPoint[];
};

// Small trend line for the card view (last up to 3 verified sales) — the
// full year-by-year chart lives one tab over, in the "Vývoj ceny" view.
function sparklinePoints(history: PriceHistoryPoint[]) {
  if (history.length === 0) return null;
  const prices = history.map((p) => p.price);
  const maxPrice = Math.max(...prices, 1);
  const minPrice = Math.min(...prices, 0);
  const span = Math.max(maxPrice - minPrice, 1);
  return history
    .map((p, i) => {
      const x = history.length === 1 ? 50 : (i / (history.length - 1)) * 100;
      const y = 32 - ((p.price - minPrice) / span) * 28;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function HeroCard({ data }: { data: HeroCardData }) {
  const t = useTranslation();
  const locale = useLocale();
  const [tab, setTab] = useState<"card" | "chart">("card");
  const recentSales = data.priceHistory.slice(-3);
  const sparkline = sparklinePoints(recentSales);

  return (
    <div className="hero-card-wrap">
      <span className="hero-card-try">{t.hero.tryBadge}</span>

      <div className="hero-card-stage">
        {tab === "card" ? (
          <div className="hero-card">
            <div className="hero-card-head">
              <p className="hero-card-name">{data.name}</p>
              <p className="hero-card-sub">
                {data.categoryLabel} · *{data.birthYear}
              </p>
            </div>
            <div className="hero-card-body">
              <div className="hero-card-photo">
                {data.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- hotlinked Commons/Supabase URL, not a locally optimizable asset
                  <img src={data.photoUrl} alt={data.photoAlt} />
                ) : (
                  <span className="portrait-placeholder-wide" aria-hidden="true" />
                )}
              </div>
              <div className="hero-card-info">
                <span className="hero-card-info-label">{t.hero.lastSale}</span>
                {sparkline ? (
                  <svg className="hero-card-sparkline" viewBox="0 0 100 32" fill="none" aria-hidden="true">
                    <polyline
                      points={sparkline}
                      stroke="var(--success)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <p className="hero-card-info-empty">{t.hero.noSaleYet}</p>
                )}
              </div>
            </div>
            <div className="hero-card-divider" />
            <div className="hero-card-row">
              <span className="hero-card-row-label">{t.hero.estimatedPrice}</span>
              <span className="hero-card-row-value">{formatKcRange(data.priceMin, data.priceMax, locale)}</span>
            </div>
            <div className="hero-card-row">
              <span className="hero-card-row-label">{t.hero.lastSale}</span>
              <span className="hero-card-row-value hero-card-row-value-sale">
                {data.lastSale
                  ? `${formatKc(data.lastSale.price, locale)}${data.lastSale.source ? ` · ${data.lastSale.source}` : ""} · ${data.lastSale.year}`
                  : t.hero.noSaleYet}
              </span>
            </div>
            <Link href={data.href} className="hero-card-link">
              {data.name} →
            </Link>
          </div>
        ) : (
          <div className="hero-card hero-card-chart-view">
            <div className="hero-card-head">
              <p className="hero-card-name">{data.name}</p>
              <p className="hero-card-sub">{t.hero.priceTrendTitle(CHART_YEAR_MIN, CHART_YEAR_MAX)}</p>
            </div>
            <PriceHistoryChart data={data.priceHistory} priceLabelSize={22} />
          </div>
        )}
      </div>

      <div className="hero-card-tabs">
        <button type="button" className={`hero-card-tab${tab === "card" ? " active" : ""}`} onClick={() => setTab("card")}>
          {t.hero.cardTabPerson}
        </button>
        <button type="button" className={`hero-card-tab${tab === "chart" ? " active" : ""}`} onClick={() => setTab("chart")}>
          {t.hero.cardTabPriceTrend}
        </button>
      </div>
    </div>
  );
}
