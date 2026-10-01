"use client";

import { useState, type FormEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/I18nProvider";

type ItemType = "autograph" | "photo" | "card" | "jersey" | "letter" | "other";
type AuthenticationType = "certificate" | "in_person" | "unverified";

const ITEM_TYPES: ItemType[] = ["autograph", "photo", "card", "jersey", "letter", "other"];
const AUTHENTICATION_TYPES: AuthenticationType[] = ["certificate", "in_person", "unverified"];

// Writes straight to price_reports as status = 'pending' (the RLS insert
// check on that table forces it either way — see
// supabase/migrations/0009_price_reports_submission.sql) — there's no
// moderator role yet, so a submitted report only reaches other visitors
// once someone flips it to 'approved' by hand in the Supabase SQL editor.
export default function PriceReportForm({ personId, onSubmitted }: { personId: string; onSubmitted?: () => void }) {
  const t = useTranslation();
  const { user, isLoaded } = useUser();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [itemType, setItemType] = useState<ItemType>("autograph");
  const [authentication, setAuthentication] = useState<AuthenticationType>("unverified");
  const [soldAt, setSoldAt] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!open) {
    return (
      <button type="button" className="btn" onClick={() => setOpen(true)}>
        {t.persons.reportPriceButton}
      </button>
    );
  }

  if (isLoaded && !user) {
    return <p style={{ fontSize: 13, color: "var(--ink-3)" }}>{t.priceReportForm.signInRequired}</p>;
  }

  if (done) {
    return <p style={{ fontSize: 13, color: "var(--ink-2)" }}>{t.priceReportForm.pendingNotice}</p>;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const priceValue = Number(price.replace(",", "."));
    if (!user || !priceValue || !sourceName.trim() || !sourceUrl.trim()) return;

    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from("price_reports").insert({
      person_id: personId,
      reported_by: user.id,
      item_type: itemType,
      authentication,
      price: priceValue,
      currency: "CZK",
      sold_at: soldAt || null,
      source_name: sourceName.trim(),
      source_url: sourceUrl.trim(),
      title: title.trim() || null,
      status: "pending",
    });

    setSubmitting(false);
    if (insertError) {
      setError(t.priceReportForm.createError);
      return;
    }
    setDone(true);
    onSubmitted?.();
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 140px" }}>
          <label className="field-label" htmlFor="price-report-price">
            {t.priceReportForm.priceLabel}
          </label>
          <input
            id="price-report-price"
            className="field-input"
            style={{ marginTop: 6 }}
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <label className="field-label" htmlFor="price-report-sold-at">
            {t.priceReportForm.soldAtLabel}
          </label>
          <input
            id="price-report-sold-at"
            type="date"
            className="field-input"
            style={{ marginTop: 6 }}
            value={soldAt}
            onChange={(e) => setSoldAt(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 140px" }}>
          <label className="field-label" htmlFor="price-report-item-type">
            {t.priceReportForm.itemTypeLabel}
          </label>
          <select
            id="price-report-item-type"
            className="field-input"
            style={{ marginTop: 6 }}
            value={itemType}
            onChange={(e) => setItemType(e.target.value as ItemType)}
          >
            {ITEM_TYPES.map((type) => (
              <option key={type} value={type}>
                {t.itemType[type]}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <label className="field-label" htmlFor="price-report-authentication">
            {t.priceReportForm.authenticationLabel}
          </label>
          <select
            id="price-report-authentication"
            className="field-input"
            style={{ marginTop: 6 }}
            value={authentication}
            onChange={(e) => setAuthentication(e.target.value as AuthenticationType)}
          >
            {AUTHENTICATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {t.authentication[type === "in_person" ? "inPerson" : type]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="price-report-source-name">
          {t.priceReportForm.sourceNameLabel}
        </label>
        <input
          id="price-report-source-name"
          className="field-input"
          style={{ marginTop: 6 }}
          value={sourceName}
          onChange={(e) => setSourceName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="field-label" htmlFor="price-report-source-url">
          {t.priceReportForm.sourceUrlLabel}
        </label>
        <input
          id="price-report-source-url"
          type="url"
          className="field-input"
          style={{ marginTop: 6 }}
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="field-label" htmlFor="price-report-title">
          {t.priceReportForm.titleLabel}
        </label>
        <input
          id="price-report-title"
          className="field-input"
          style={{ marginTop: 6 }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={submitting} style={{ alignSelf: "flex-start" }}>
        {submitting ? t.common.loading : t.priceReportForm.submit}
      </button>
    </form>
  );
}
