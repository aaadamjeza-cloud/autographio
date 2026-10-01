import Link from "next/link";
import type { ReactNode } from "react";

// Wraps a horizontally-scrolling row of cards (strip or showcase-style) with
// a heading and an optional "Zobrazit vše" link — used by every homepage
// carousel so the section-head layout lives in one place. Navigation is the
// row's own scroll-snap swipe/scroll only (no arrow buttons) — keeps the
// header simple and doesn't cap how far someone can browse in one row.
export default function CarouselSection({
  title,
  meta,
  viewAllHref,
  viewAllLabel = "Zobrazit vše",
  children,
}: {
  title: string;
  meta?: ReactNode;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="section-head">
        <div>
          <h2 className="collection-title">{title}</h2>
          {meta && <p className="section-meta">{meta}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="section-viewall">
            {viewAllLabel}
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
      <div className="strip-row">{children}</div>
    </>
  );
}
