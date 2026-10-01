"use client";

import { useState, useTransition } from "react";
import { dismissContentReport } from "@/app/nevyrizene/actions";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { formatDate } from "@/lib/format";

type TargetType = "person" | "item_photo" | "price_report";

type PendingContentReport = {
  id: string;
  target_type: TargetType;
  reason: string;
  created_at: string;
  reporterName: string;
  // Resolved server-side (see app/nevyrizene/page.tsx) so this component
  // never has to know how to look up a person/price report/photo itself.
  targetSummary: string;
  targetHref: string | null;
  previewUrl: string | null;
};

export default function ContentReportQueueClient({ pending }: { pending: PendingContentReport[] }) {
  const t = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run(id: string) {
    setBusyId(id);
    setError(null);
    startTransition(async () => {
      const result = await dismissContentReport(id);
      setBusyId(null);
      if (!result.ok) setError(t.review.actionError);
    });
  }

  if (pending.length === 0) {
    return <p className="persons-empty">{t.review.contentReportsEmpty}</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}

      {pending.map((report) => (
        <div key={report.id} className="card" style={{ padding: 20, display: "flex", gap: 16, alignItems: "flex-start" }}>
          {report.previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- short-lived signed Storage URL, not a locally optimizable asset
            <img
              src={report.previewUrl}
              alt=""
              style={{ width: 88, height: 88, borderRadius: "var(--radius)", objectFit: "cover", flexShrink: 0 }}
            />
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            <div>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--accent)" }}>{t.review.targetType[report.target_type]}</p>
              {report.targetHref ? (
                <a href={report.targetHref} target="_blank" rel="noreferrer noopener" style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)" }}>
                  {report.targetSummary}
                </a>
              ) : (
                <p style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)" }}>{report.targetSummary}</p>
              )}
            </div>

            <p style={{ fontSize: 13, color: "var(--ink-2)" }}>
              <strong>{t.review.reportReason}:</strong> {report.reason}
            </p>

            <p style={{ fontSize: 12, color: "var(--ink-muted)" }}>
              {t.review.reportedBy}: {report.reporterName} · {formatDate(report.created_at.slice(0, 10))}
            </p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn"
                disabled={isPending && busyId === report.id}
                onClick={() => run(report.id)}
              >
                {t.review.dismiss}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
