"use client";

import { useState, useTransition } from "react";
import { approvePriceReport, rejectPriceReport } from "@/app/nevyrizene/actions";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { formatDate, formatKc } from "@/lib/format";

type ItemType = "autograph" | "photo" | "card" | "jersey" | "letter" | "other";
type AuthenticationType = "certificate" | "in_person" | "unverified";

type PendingPriceReport = {
  id: string;
  price: number;
  currency: string;
  sold_at: string | null;
  source_name: string;
  source_url: string;
  title: string | null;
  item_type: ItemType;
  authentication: AuthenticationType;
  created_at: string;
  personName: string;
  personSlug: string;
};

export default function PriceReportReviewQueueClient({ pending }: { pending: PendingPriceReport[] }) {
  const t = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run(id: string, action: (id: string) => Promise<{ ok: boolean }>) {
    setBusyId(id);
    setError(null);
    startTransition(async () => {
      const result = await action(id);
      setBusyId(null);
      if (!result.ok) setError(t.review.actionError);
    });
  }

  if (pending.length === 0) {
    return <p className="persons-empty">{t.review.priceReportsEmpty}</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}

      {pending.map((report) => (
        <div key={report.id} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            {/* Always Kč, not locale-dependent — internal moderation tool,
                and the admin needs the exact submitted figure to compare
                against the source listing, not a converted approximation. */}
            <p style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)" }}>
              {report.personName} — {formatKc(report.price, "cs")}
            </p>
            <p style={{ fontSize: 13, color: "var(--ink-3)" }}>
              {t.itemType[report.item_type]} · {t.authentication[report.authentication === "in_person" ? "inPerson" : report.authentication]}
              {report.sold_at ? ` · ${formatDate(report.sold_at)}` : ""}
            </p>
          </div>

          {report.title && <p style={{ fontSize: 13, color: "var(--ink-2)" }}>{report.title}</p>}

          <p style={{ fontSize: 13, color: "var(--ink-2)" }}>
            {report.source_name} —{" "}
            <a href={report.source_url} target="_blank" rel="noreferrer noopener" style={{ color: "var(--accent)" }}>
              {report.source_url}
            </a>
          </p>

          <p style={{ fontSize: 12, color: "var(--ink-muted)" }}>
            {t.review.submitted}: {formatDate(report.created_at.slice(0, 10))} · /{report.personSlug}
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-primary"
              disabled={isPending && busyId === report.id}
              onClick={() => run(report.id, approvePriceReport)}
            >
              {t.review.approve}
            </button>
            <button
              type="button"
              className="btn"
              disabled={isPending && busyId === report.id}
              onClick={() => run(report.id, rejectPriceReport)}
            >
              {t.review.reject}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
