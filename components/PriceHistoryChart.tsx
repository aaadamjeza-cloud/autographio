"use client";

import { formatKc } from "@/lib/format";
import { useLocale } from "@/lib/i18n/I18nProvider";
import type { PriceHistoryPoint } from "@/lib/mockData/persons";

const WIDTH = 560;
const HEIGHT = 200;
// Left/right padding is wide enough for a 4-5 digit "12 345 Kč" label
// centered on the first/last dot without clipping past the viewBox edge.
const PAD_LEFT = 36;
const PAD_RIGHT = 36;
const PAD_TOP = 42;
const PAD_BOTTOM = 28;

// Fixed axis, same for every person — 2018–2026 is the window this catalog's
// sale evidence actually falls in, and keeping it fixed (rather than each
// chart zooming to its own data) makes charts comparable at a glance and
// keeps a lone sale from stretching edge-to-edge.
const YEAR_MIN = 2018;
const YEAR_MAX = 2026;

// Scatter, not a trend line, on purpose — a handful of verified sales years
// apart don't imply a continuous price between them, so connecting them
// with a line would claim more than the data supports. Each dot is one
// doložený prodej (verified sale), positioned by its real year on the axis
// and labeled with its price.
export default function PriceHistoryChart({ data, priceLabelSize = 12 }: { data: PriceHistoryPoint[]; priceLabelSize?: number }) {
  const locale = useLocale();
  if (!data || data.length === 0) return null;

  const yearMin = YEAR_MIN;
  const yearMax = YEAR_MAX;
  const yearSpan = yearMax - yearMin;

  const priceMax = Math.max(...data.map((d) => d.price));

  const xForYear = (year: number) => PAD_LEFT + ((year - yearMin) / yearSpan) * (WIDTH - PAD_LEFT - PAD_RIGHT);
  const yForPrice = (price: number) => {
    const usable = HEIGHT - PAD_TOP - PAD_BOTTOM;
    return PAD_TOP + usable - (price / (priceMax * 1.15)) * usable;
  };

  // Two verified sales in the same year would otherwise land on the exact
  // same x, stacking both stems AND price labels on top of each other. Fan
  // the dots out a little around the year's tick, and — since even a small
  // x gap isn't enough room for two "12 345 Kč" labels side by side — point
  // each label away from its neighbor (anchored outward, alternating
  // height) instead of centering both on a collision course.
  const SAME_YEAR_SPACING = 16;
  const countByYear = new Map<number, number>();
  for (const d of data) countByYear.set(d.year, (countByYear.get(d.year) ?? 0) + 1);
  const seenByYear = new Map<number, number>();

  const points = data.map((d) => {
    const total = countByYear.get(d.year) ?? 1;
    const index = seenByYear.get(d.year) ?? 0;
    seenByYear.set(d.year, index + 1);
    const grouped = total > 1;
    const offset = grouped ? (index - (total - 1) / 2) * SAME_YEAR_SPACING : 0;
    return { ...d, x: xForYear(d.year) + offset, y: yForPrice(d.price), grouped, groupIndex: index };
  });
  const axisY = HEIGHT - PAD_BOTTOM;

  const tickYears: number[] = [];
  for (let y = yearMin; y <= yearMax; y++) tickYears.push(y);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="price-history-svg" role="img" aria-label="Ceny doložených prodejů v čase">
      <line x1={PAD_LEFT} y1={axisY} x2={WIDTH - PAD_RIGHT} y2={axisY} className="price-history-axis" />

      {tickYears.map((year) => (
        <text key={year} x={xForYear(year)} y={HEIGHT - 8} textAnchor="middle" className="price-history-tick">
          {year}
        </text>
      ))}

      {points.map((p, i) => {
        const pointsLeft = p.groupIndex % 2 === 0;
        const labelAnchor = p.grouped ? (pointsLeft ? "end" : "start") : "middle";
        const labelX = p.grouped ? p.x + (pointsLeft ? -8 : 8) : p.x;
        const labelY = p.y - 12 - (p.grouped && p.groupIndex % 2 === 1 ? 14 : 0);
        return (
          <g key={i}>
            <line x1={p.x} y1={p.y} x2={p.x} y2={axisY} className="price-history-stem" />
            <circle cx={p.x} cy={p.y} r={5} className="price-history-dot" />
            <text x={labelX} y={labelY} textAnchor={labelAnchor} className="price-history-price" style={{ fontSize: priceLabelSize }}>
              {formatKc(p.price, locale)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
