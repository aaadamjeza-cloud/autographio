import { formatKc } from "@/lib/format";
import type { PriceHistoryPoint } from "@/lib/mockData/persons";

const WIDTH = 480;
const HEIGHT = 160;
const PAD_X = 16;
const PAD_Y = 20;

export default function PriceHistoryChart({ data }: { data: PriceHistoryPoint[] }) {
  if (!data || data.length < 2) return null;

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const points = data.map((d, i) => ({
    ...d,
    x: PAD_X + (i / (data.length - 1)) * (WIDTH - PAD_X * 2),
    y: PAD_Y + (1 - (d.price - minPrice) / priceRange) * (HEIGHT - PAD_Y * 2),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${HEIGHT - PAD_Y} L ${points[0].x} ${HEIGHT - PAD_Y} Z`;

  const first = data[0];
  const last = data[data.length - 1];
  const growthPct = Math.round(((last.price - first.price) / first.price) * 100);

  return (
    <div className="price-history">
      <div className="price-history-growth">
        <span>
          {first.year}–{last.year}
        </span>
        <b className={growthPct >= 0 ? "positive" : "negative"}>
          {growthPct > 0 ? "+" : ""}
          {growthPct}%
        </b>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="price-history-svg" role="img" aria-label="Vývoj ceny">
        <defs>
          <linearGradient id="price-history-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#price-history-fill)" stroke="none" />
        <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth={2.5} />
        {points.map((p) => (
          <circle key={p.year} cx={p.x} cy={p.y} r={5} fill="var(--accent)" stroke="var(--panel)" strokeWidth={2} />
        ))}
      </svg>

      <div className="price-history-labels">
        {points.map((p) => (
          <div key={p.year} className="price-history-label">
            <span className="price-history-label-year">{p.year}</span>
            <span className="price-history-label-price">{formatKc(p.price)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
