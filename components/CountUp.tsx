"use client";

import { useEffect, useRef, useState } from "react";
import { formatKc } from "@/lib/format";
import { useLocale } from "@/lib/i18n/I18nProvider";

// Animates a number from 0 up to `to` on mount — quick (default 900ms),
// eased out so it settles rather than stopping abruptly. Renders just the
// number itself; any surrounding text ("+", labels) stays in the
// server-rendered parent so only this digit is a client island.
// `format` is a string flag rather than a function prop — a Server
// Component caller can't hand a function across the RSC boundary, only
// serializable values.
export default function CountUp({ to, durationMs = 900, format }: { to: number; durationMs?: number; format?: "kc" }) {
  const locale = useLocale();
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let raf: number;
    function tick(now: number) {
      if (startRef.current == null) startRef.current = now;
      const progress = Math.min(1, (now - startRef.current) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(to * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, durationMs]);

  return <>{format === "kc" ? formatKc(value, locale) : value}</>;
}
