"use client";

import { useState, type FormEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/I18nProvider";

// content_reports (0001_init.sql) only supports the reporter reading their
// own rows back — there's no moderator role yet, so this is a one-way
// mailbox: an admin reviews new rows by hand in the Supabase SQL editor.
export default function ContentReportButton({ targetType, targetId }: { targetType: "person" | "item_photo" | "price_report"; targetId: string }) {
  const t = useTranslation();
  const { user, isLoaded } = useUser();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!open) {
    return (
      <button type="button" className="person-report-link" onClick={() => setOpen(true)}>
        {t.persons.reportButton}
      </button>
    );
  }

  if (isLoaded && !user) {
    return <p style={{ fontSize: 13, color: "var(--ink-3)" }}>{t.contentReport.signInRequired}</p>;
  }

  if (done) {
    return <p style={{ fontSize: 13, color: "var(--ink-2)" }}>{t.contentReport.success}</p>;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user || !reason.trim()) return;
    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from("content_reports").insert({
      reporter_id: user.id,
      target_type: targetType,
      target_id: targetId,
      reason: reason.trim(),
    });

    setSubmitting(false);
    if (insertError) {
      setError(t.contentReport.error);
      return;
    }
    setDone(true);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420 }}>
      <label className="field-label" htmlFor="content-report-reason">
        {t.contentReport.reasonLabel}
      </label>
      <textarea
        id="content-report-reason"
        className="field-input"
        style={{ minHeight: 72, resize: "vertical" }}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
      />
      {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
      <button type="submit" className="btn" disabled={submitting} style={{ alignSelf: "flex-start" }}>
        {submitting ? t.common.loading : t.contentReport.submit}
      </button>
    </form>
  );
}
