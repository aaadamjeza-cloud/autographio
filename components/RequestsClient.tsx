"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { formatDate } from "@/lib/format";
import { resizeImageToWebp } from "@/lib/resizeImage";
import PersonPicker, { type PersonPickerPerson } from "@/components/PersonPicker";
import CountryPicker from "@/components/CountryPicker";
import DateField from "@/components/DateField";

type ItemType = "autograph" | "photo" | "card" | "jersey" | "letter" | "other";
type RequestStatus = "waiting" | "received" | "returned" | "no_response";
type PostageType = "cash" | "stamp" | "irc" | "other" | "none";

const REQUEST_PHOTOS_BUCKET = "request-photos";
const SIGNED_URL_TTL_SECONDS = 3600;

export type AutographRequest = {
  id: string;
  custom_person_name: string | null;
  item_type: ItemType;
  sent_at: string;
  status: RequestStatus;
  received_at: string | null;
  return_postage_type: PostageType | null;
  country: string | null;
  note: string | null;
  address: string | null;
  enclosed_note: string | null;
  received_photo_path: string | null;
  receivedPhotoUrl?: string | null;
};

const ITEM_TYPES: ItemType[] = ["autograph", "photo", "card", "jersey", "letter", "other"];
const POSTAGE_TYPES: PostageType[] = ["cash", "stamp", "irc", "other", "none"];

const STATUS_COLOR: Record<RequestStatus, string> = {
  waiting: "var(--accent)",
  received: "var(--success)",
  returned: "var(--ink-muted)",
  no_response: "var(--danger)",
};

function daysBetween(from: string, to: Date): number {
  const start = new Date(`${from}T00:00:00`);
  return Math.max(0, Math.floor((to.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function RequestsClient({
  userId,
  initialRequests,
  persons,
}: {
  userId: string;
  initialRequests: AutographRequest[];
  persons: PersonPickerPerson[];
}) {
  const t = useTranslation();
  const supabase = createClient();
  const [requests, setRequests] = useState(initialRequests);
  const [formOpen, setFormOpen] = useState(false);

  const [personName, setPersonName] = useState("");
  const [itemType, setItemType] = useState<ItemType>("autograph");
  const [sentAt, setSentAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [postage, setPostage] = useState<PostageType | "">("");
  const [enclosedNote, setEnclosedNote] = useState("");
  const [note, setNote] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [photoBusyId, setPhotoBusyId] = useState<string | null>(null);
  const fileInputs = useRef(new Map<string, HTMLInputElement>());

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!personName.trim()) return;
    setCreating(true);
    setCreateError(null);

    // Set person_id whenever the typed name matches a real catalog row
    // (passed down from the server component — see app/moje-zadosti/page.tsx),
    // so the request counts toward that person's public wait-time stats
    // (get_person_request_stats, 0002). custom_person_name is still sent
    // either way, since it's what the list below renders.
    const trimmedName = personName.trim();
    const personId = persons.find((p) => p.name === trimmedName)?.id ?? null;

    const { data, error } = await supabase
      .from("autograph_requests")
      .insert({
        user_id: userId,
        person_id: personId,
        custom_person_name: trimmedName,
        item_type: itemType,
        sent_at: sentAt,
        country: country.trim() || null,
        address: address.trim() || null,
        return_postage_type: postage || null,
        enclosed_note: enclosedNote.trim() || null,
        note: note.trim() || null,
      })
      .select(
        "id, custom_person_name, item_type, sent_at, status, received_at, return_postage_type, country, note, address, enclosed_note, received_photo_path"
      )
      .single();

    setCreating(false);
    if (error || !data) {
      // Temporary — surface the real Supabase error while we track down
      // why this fails (see the acquired_at / signature-photo incidents).
      console.error("autograph_requests insert failed:", error);
      setCreateError(`${t.requests.createError} (${error?.code ?? "?"}: ${error?.message ?? "no data returned"})`);
      return;
    }
    setRequests((prev) => [data as AutographRequest, ...prev]);
    setPersonName("");
    setCountry("");
    setAddress("");
    setPostage("");
    setEnclosedNote("");
    setNote("");
    setFormOpen(false);
  }

  async function updateStatus(id: string, status: RequestStatus) {
    setUpdatingId(id);
    const patch: Partial<AutographRequest> = { status };
    if (status === "received") patch.received_at = new Date().toISOString().slice(0, 10);

    const { error } = await supabase.from("autograph_requests").update(patch).eq("id", id);
    setUpdatingId(null);
    if (error) return;
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function handlePhotoPick(requestId: string, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;

    setPhotoBusyId(requestId);
    try {
      const resized = await resizeImageToWebp(file);
      const path = `${userId}/${requestId}/${crypto.randomUUID()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from(REQUEST_PHOTOS_BUCKET)
        .upload(path, resized.blob, { contentType: resized.blob.type });
      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase.from("autograph_requests").update({ received_photo_path: path }).eq("id", requestId);
      if (updateError) throw updateError;

      const { data: signed } = await supabase.storage.from(REQUEST_PHOTOS_BUCKET).createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, received_photo_path: path, receivedPhotoUrl: signed?.signedUrl ?? null } : r))
      );
    } catch {
      // Best-effort — the request row itself is unaffected either way.
    } finally {
      setPhotoBusyId(null);
    }
  }

  async function removePhoto(request: AutographRequest) {
    if (!request.received_photo_path) return;
    setPhotoBusyId(request.id);

    await supabase.storage.from(REQUEST_PHOTOS_BUCKET).remove([request.received_photo_path]);
    const { error } = await supabase.from("autograph_requests").update({ received_photo_path: null }).eq("id", request.id);

    setPhotoBusyId(null);
    if (error) return;
    setRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, received_photo_path: null, receivedPhotoUrl: null } : r)));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <button type="button" className="btn btn-primary" onClick={() => setFormOpen((v) => !v)}>
          {t.requests.newRequest}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleCreate} className="card form-grid" style={{ padding: 24 }}>
          <div className="form-field">
            <label className="field-label" htmlFor="request-person">
              {t.collection.personNameLabel}
            </label>
            <PersonPicker
              id="request-person"
              persons={persons}
              value={personName}
              onChange={setPersonName}
              placeholder={t.collection.personNamePlaceholder}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="field-label" htmlFor="request-item-type">
                {t.requests.itemTypeLabel}
              </label>
              <select
                id="request-item-type"
                className="field-input"
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
            <div className="form-field">
              <label className="field-label" htmlFor="request-sent-at">
                {t.requests.sentAtLabel}
              </label>
              <DateField id="request-sent-at" value={sentAt} onChange={setSentAt} required />
            </div>
          </div>

          <p className="form-section-title">{t.requests.deliveryDetailsTitle}</p>

          <div className="form-row">
            <div className="form-field">
              <label className="field-label" htmlFor="request-country">
                {t.requests.countryLabel}
              </label>
              <CountryPicker id="request-country" value={country} onChange={setCountry} placeholder={t.requests.countryPlaceholder} />
            </div>
            <div className="form-field">
              <label className="field-label" htmlFor="request-postage">
                {t.requests.postageLabel}
              </label>
              <select
                id="request-postage"
                className="field-input"
                value={postage}
                onChange={(e) => setPostage(e.target.value as PostageType | "")}
              >
                <option value="" />
                {POSTAGE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t.requests.postage[type]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label className="field-label" htmlFor="request-address">
              {t.requests.addressLabel} <span style={{ fontWeight: 400, color: "var(--ink-muted)" }}>({t.requests.optionalHint})</span>
            </label>
            <textarea
              id="request-address"
              className="field-input"
              style={{ minHeight: 56, resize: "vertical" }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t.requests.addressPlaceholder}
            />
          </div>

          <div className="form-field">
            <label className="field-label" htmlFor="request-enclosed">
              {t.requests.enclosedLabel} <span style={{ fontWeight: 400, color: "var(--ink-muted)" }}>({t.requests.optionalHint})</span>
            </label>
            <textarea
              id="request-enclosed"
              className="field-input"
              style={{ minHeight: 56, resize: "vertical" }}
              value={enclosedNote}
              onChange={(e) => setEnclosedNote(e.target.value)}
              placeholder={t.requests.enclosedPlaceholder}
            />
          </div>

          <div className="form-field">
            <label className="field-label" htmlFor="request-note">
              {t.requests.noteLabel}
            </label>
            <textarea
              id="request-note"
              className="field-input"
              style={{ minHeight: 72, resize: "vertical" }}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {createError && <p style={{ color: "var(--danger)", fontSize: 13 }}>{createError}</p>}
          <button type="submit" className="btn btn-primary" disabled={creating} style={{ alignSelf: "flex-start" }}>
            {creating ? t.common.loading : t.requests.submit}
          </button>
        </form>
      )}

      {requests.length === 0 && <p className="persons-empty">{t.requests.empty}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {requests.map((r) => (
          <div key={r.id} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)" }}>{r.custom_person_name}</p>
                <p style={{ fontSize: 13, color: "var(--ink-3)" }}>
                  {t.itemType[r.item_type]} · {formatDate(r.sent_at)}
                  {r.country ? ` · ${r.country}` : ""}
                </p>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  padding: "4px 12px",
                  borderRadius: 999,
                  color: "#fff",
                  background: STATUS_COLOR[r.status],
                  whiteSpace: "nowrap",
                }}
              >
                {t.requests.status[r.status]}
                {r.status === "waiting" ? ` · ${daysBetween(r.sent_at, new Date())} ${t.requests.daysWaiting}` : ""}
                {r.status === "received" && r.received_at ? ` · ${daysBetween(r.sent_at, new Date(r.received_at))} ${t.requests.daysToReceive}` : ""}
              </span>
            </div>
            {r.address && (
              <p style={{ fontSize: 13, color: "var(--ink-2)" }}>
                {t.requests.addressLabel}: {r.address}
              </p>
            )}
            {r.enclosed_note && (
              <p style={{ fontSize: 13, color: "var(--ink-2)" }}>
                {t.requests.enclosedLabel}: {r.enclosed_note}
              </p>
            )}
            {r.note && <p style={{ fontSize: 13, color: "var(--ink-2)" }}>{r.note}</p>}
            {r.status === "waiting" && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" className="btn" disabled={updatingId === r.id} onClick={() => updateStatus(r.id, "received")}>
                  {t.requests.markReceived}
                </button>
                <button type="button" className="btn" disabled={updatingId === r.id} onClick={() => updateStatus(r.id, "returned")}>
                  {t.requests.markReturned}
                </button>
                <button type="button" className="btn" disabled={updatingId === r.id} onClick={() => updateStatus(r.id, "no_response")}>
                  {t.requests.markNoResponse}
                </button>
              </div>
            )}
            {r.status === "received" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <p className="field-label">{t.requests.receivedPhotoLabel}</p>
                {r.receivedPhotoUrl ? (
                  <div style={{ position: "relative", width: 120, height: 120 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- signed Storage URL, not an optimizable local asset */}
                    <img
                      src={r.receivedPhotoUrl}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(r)}
                      disabled={photoBusyId === r.id}
                      aria-label={t.photoPicker.remove}
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        border: "none",
                        background: "var(--ink)",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      className="btn"
                      disabled={photoBusyId === r.id}
                      onClick={() => fileInputs.current.get(r.id)?.click()}
                    >
                      {photoBusyId === r.id ? t.photoPicker.uploading : t.photoPicker.addPhoto}
                    </button>
                    <input
                      ref={(el) => {
                        if (el) fileInputs.current.set(r.id, el);
                      }}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handlePhotoPick(r.id, e)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
