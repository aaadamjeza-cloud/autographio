"use client";

import { CATEGORY_COLORS, type PersonCategory } from "@/lib/mockData/persons";
import { formatKc, formatKcRange } from "@/lib/format";
import { useLocale } from "@/lib/i18n/I18nProvider";

// Single place that renders a price anywhere in the app. `size="sm"` (the
// catalog-card treatment) is a solid pill colored by the person's category
// (see CATEGORY_COLORS) — herec/sportovec/etc. read apart from each other
// at a glance, not just from the name below the price. `size="lg"` is plain
// accent text with no background, for numbers big enough to carry their own
// weight on their own (hero cards, stat tiles).
export default function Price({
  min,
  max,
  value,
  size = "sm",
  category,
  className,
}: {
  min?: number;
  max?: number;
  value?: number;
  size?: "sm" | "lg";
  category?: PersonCategory;
  className?: string;
}) {
  const locale = useLocale();
  const text = value != null ? formatKc(value, locale) : min != null && max != null ? formatKcRange(min, max, locale) : "—";
  const style = size === "sm" && category ? { background: CATEGORY_COLORS[category] } : undefined;
  return (
    <span className={`price price-${size}${className ? ` ${className}` : ""}`} style={style}>
      {text}
    </span>
  );
}
