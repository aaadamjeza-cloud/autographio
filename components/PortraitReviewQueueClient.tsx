"use client";

import { useState, useTransition } from "react";
import { approvePortraitSubmission, rejectPortraitSubmission } from "@/app/nevyrizene/actions";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { formatDate } from "@/lib/format";

type PendingPortrait = {
  id: string;
  slug: string;
  storage_path: string;
  created_at: string;
  previewUrl: string;
};

export default function PortraitReviewQueueClient({ pending }: { pending: PendingPortrait[] }) {
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
    return <p className="persons-empty">{t.review.portraitsEmpty}</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}

      {pending.map((submission) => (
        <div
          key={submission.id}
          className="card"
          style={{ padding: 20, display: "flex", gap: 16, alignItems: "flex-start" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- hotlinked Supabase public Storage URL, not a locally optimizable asset */}
          <img
            src={submission.previewUrl}
            alt={submission.slug}
            style={{ width: 88, height: 88, borderRadius: "var(--radius)", objectFit: "cover", flexShrink: 0 }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            <div>
              <p style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)" }}>/{submission.slug}</p>
              <p style={{ fontSize: 12, color: "var(--ink-muted)" }}>
                {t.review.submitted}: {formatDate(submission.created_at.slice(0, 10))}
              </p>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn btn-primary"
                disabled={isPending && busyId === submission.id}
                onClick={() => run(submission.id, approvePortraitSubmission)}
              >
                {t.review.approve}
              </button>
              <button
                type="button"
                className="btn"
                disabled={isPending && busyId === submission.id}
                onClick={() => run(submission.id, rejectPortraitSubmission)}
              >
                {t.review.reject}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
