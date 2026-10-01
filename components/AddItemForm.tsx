"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import PhotoPicker from "@/components/PhotoPicker";
import PersonPicker, { type PersonPickerPerson } from "@/components/PersonPicker";
import DateField from "@/components/DateField";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { wikipediaUrl } from "@/lib/wikipedia";

type ItemType = "autograph" | "photo" | "card" | "jersey" | "letter" | "other";
type AcquisitionMethod = "mail" | "in_person" | "purchase" | "trade";
type TradeStatus = "offered" | "negotiating" | "completed";

// Every item in this collection is inherently signed, so "autograph" as one
// choice among others here is redundant — and "jersey" doesn't fit what
// this form asks (what the signature is ON). Kept out of the type itself
// (autograph_requests reuses the same DB enum and "jersey"/"autograph" are
// meaningful there — what you mailed in to get signed), just not offered
// as an item-type choice on this form.
const ITEM_TYPES: ItemType[] = ["photo", "card", "letter", "other"];
const ACQUISITION_METHODS: AcquisitionMethod[] = ["mail", "in_person", "purchase", "trade"];
const TRADE_STATUSES: TradeStatus[] = ["offered", "negotiating", "completed"];

export type ExistingItem = {
  id: string;
  custom_person_name: string | null;
  item_type: ItemType;
  authentication: string;
  purchase_price: number | null;
  purchase_date: string | null;
  estimated_value: number | null;
  note: string | null;
  acquisition_method: AcquisitionMethod | null;
  quantity: number;
  acquired_at: string | null;
  for_sale: boolean;
  for_trade: boolean;
  asking_price: number | null;
  trade_wanted: string | null;
  trade_status: TradeStatus | null;
  trade_contact: string | null;
};

type PersonWithMarketPrice = PersonPickerPerson & { marketPriceMin: number | null; marketPriceMax: number | null };

export default function AddItemForm({
  userId,
  initialItem,
  persons,
}: {
  userId: string;
  initialItem: ExistingItem | null;
  persons: PersonWithMarketPrice[];
}) {
  const t = useTranslation();
  const router = useRouter();
  const supabase = createClient();
  const [personName, setPersonName] = useState("");
  const [itemId, setItemId] = useState<string | null>(initialItem?.id ?? null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [itemType, setItemType] = useState<ItemType>(initialItem?.item_type ?? "photo");
  const [acquisitionMethod, setAcquisitionMethod] = useState<AcquisitionMethod | "">(initialItem?.acquisition_method ?? "");
  const [quantity, setQuantity] = useState(String(initialItem?.quantity ?? 1));
  const [acquiredAt, setAcquiredAt] = useState(initialItem?.acquired_at ?? "");
  const [purchasePrice, setPurchasePrice] = useState(initialItem?.purchase_price?.toString() ?? "");
  const [estimatedValue, setEstimatedValue] = useState(() => {
    if (initialItem?.estimated_value != null) return String(initialItem.estimated_value);
    // A reload straight into step 2 (existingItem set, never saved a value
    // yet) still deserves the market-price prefill — the same one a fresh
    // create gets in handleCreateItem below.
    const matched = initialItem?.custom_person_name ? persons.find((p) => p.name === initialItem.custom_person_name) : undefined;
    if (matched?.marketPriceMin != null && matched?.marketPriceMax != null) {
      return String(Math.round((matched.marketPriceMin + matched.marketPriceMax) / 2));
    }
    return "";
  });
  const [note, setNote] = useState(initialItem?.note ?? "");
  const [forSale, setForSale] = useState(initialItem?.for_sale ?? false);
  const [forTrade, setForTrade] = useState(initialItem?.for_trade ?? false);
  const [askingPrice, setAskingPrice] = useState(initialItem?.asking_price?.toString() ?? "");
  const [tradeWanted, setTradeWanted] = useState(initialItem?.trade_wanted ?? "");
  const [tradeStatus, setTradeStatus] = useState<TradeStatus | "">(initialItem?.trade_status ?? "");
  const [tradeContact, setTradeContact] = useState(initialItem?.trade_contact ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleCreateItem(e: FormEvent) {
    e.preventDefault();
    const trimmedName = personName.trim();
    if (!trimmedName) return;
    setCreating(true);
    setError(null);

    // Matched against the real `persons` rows passed down from the server
    // component (see app/moje-sbirka/pridat/page.tsx) — sets person_id so
    // the item is actually linked to the catalog row, not just a free-text
    // label. Falls back to custom_person_name alone for a name that isn't
    // in the catalog yet.
    const matched = persons.find((p) => p.name === trimmedName);

    const { data, error: insertError } = await supabase
      .from("portfolio_items")
      .insert({ user_id: userId, person_id: matched?.id ?? null, custom_person_name: trimmedName, item_type: "photo" })
      .select("id")
      .single();

    setCreating(false);
    if (insertError || !data) {
      setError(t.collection.createItemError);
      return;
    }
    setItemId(data.id);
    // A market price for this person (see app/moje-sbirka/pridat/page.tsx) is
    // a reasonable starting guess for what the item is worth — prefilled but
    // still just a normal editable field from here on.
    if (matched?.marketPriceMin != null && matched?.marketPriceMax != null) {
      setEstimatedValue(String(Math.round((matched.marketPriceMin + matched.marketPriceMax) / 2)));
    }
    // Puts the item id in the URL so a reload re-opens the same item instead
    // of starting a new one — this is what actually proves photos persist.
    router.replace(`/moje-sbirka/pridat?item=${data.id}`);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!itemId) return;
    setSaving(true);
    setSaveError(null);
    setSaved(false);

    const { error: updateError } = await supabase
      .from("portfolio_items")
      .update({
        item_type: itemType,
        acquisition_method: acquisitionMethod || null,
        quantity: Number(quantity) || 1,
        acquired_at: acquiredAt || null,
        purchase_price: purchasePrice ? Number(purchasePrice) : null,
        estimated_value: estimatedValue ? Number(estimatedValue) : null,
        note: note.trim() || null,
        for_sale: forSale,
        for_trade: forTrade,
        asking_price: askingPrice ? Number(askingPrice) : null,
        trade_wanted: forTrade ? tradeWanted.trim() || null : null,
        trade_status: forTrade ? tradeStatus || null : null,
        trade_contact: forTrade ? tradeContact.trim() || null : null,
      })
      .eq("id", itemId);

    setSaving(false);
    if (updateError) {
      setSaveError(t.collection.updateItemError);
      return;
    }
    setSaved(true);
    // Saving is the end of this flow, not a step within it — back to the
    // collection list, where the new value/photo actually shows up.
    router.push("/moje-sbirka");
  }

  const name = initialItem?.custom_person_name ?? personName;
  const matchedPerson = persons.find((p) => p.name === name);

  if (!itemId) {
    return (
      <form onSubmit={handleCreateItem} className="card form-grid" style={{ padding: 24 }}>
        <div className="form-field">
          <label className="field-label" htmlFor="person-name">
            {t.collection.personNameLabel}
          </label>
          <PersonPicker
            id="person-name"
            persons={persons}
            value={personName}
            onChange={setPersonName}
            placeholder={t.collection.personNamePlaceholder}
            required
          />
        </div>
        {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={creating} style={{ alignSelf: "flex-start" }}>
          {creating ? t.common.loading : t.common.add}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSave} className="card form-grid" style={{ padding: 24 }}>
      <div>
        <p className="field-label" style={{ marginBottom: 6, display: "block" }}>
          {name}
        </p>
        <div style={{ display: "flex", gap: 14, fontSize: 13 }}>
          {matchedPerson && (
            <a href={`/osobnosti/${matchedPerson.slug}`} target="_blank" rel="noopener noreferrer">
              {t.collection.personPageLink}
            </a>
          )}
          <a href={wikipediaUrl(name)} target="_blank" rel="noopener noreferrer">
            {t.collection.wikipediaLink}
          </a>
        </div>
      </div>

      <p className="form-section-title">{t.collection.acquisitionSectionTitle}</p>

      <div className="form-row">
        <div className="form-field">
          <label className="field-label" htmlFor="item-type">
            {t.collection.itemTypeLabel}
          </label>
          <select id="item-type" className="field-input" value={itemType} onChange={(e) => setItemType(e.target.value as ItemType)}>
            {ITEM_TYPES.map((type) => (
              <option key={type} value={type}>
                {t.itemType[type]}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="field-label" htmlFor="acquisition-method">
            {t.collection.acquisitionMethodLabel}
          </label>
          <select
            id="acquisition-method"
            className="field-input"
            value={acquisitionMethod}
            onChange={(e) => {
              const next = e.target.value as AcquisitionMethod | "";
              setAcquisitionMethod(next);
              // Kupní cena only makes sense for a purchase — drop a stale
              // value so switching away doesn't silently keep saving it.
              if (next !== "purchase") setPurchasePrice("");
            }}
          >
            <option value="" />
            {ACQUISITION_METHODS.map((method) => (
              <option key={method} value={method}>
                {t.collection.acquisitionMethod[method]}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="field-label" htmlFor="quantity">
            {t.collection.quantityLabel}
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            step={1}
            className="field-input"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="field-label" htmlFor="acquired-at">
            {t.collection.acquiredAtLabel}
          </label>
          <DateField id="acquired-at" value={acquiredAt} onChange={setAcquiredAt} />
        </div>
      </div>

      <p className="form-section-title">{t.collection.valueSectionTitle}</p>

      <div className="form-row">
        {acquisitionMethod === "purchase" && (
          <div className="form-field">
            <label className="field-label" htmlFor="purchase-price">
              {t.collection.purchasePriceLabel}
            </label>
            <input
              id="purchase-price"
              type="number"
              min={0}
              step="0.01"
              className="field-input"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
          </div>
        )}
        <div className="form-field">
          <label className="field-label" htmlFor="estimated-value">
            {t.collection.estimatedValueLabel}
          </label>
          <input
            id="estimated-value"
            type="number"
            min={0}
            step="0.01"
            className="field-input"
            value={estimatedValue}
            onChange={(e) => setEstimatedValue(e.target.value)}
          />
        </div>
      </div>

      <div className="form-field">
        <label className="field-label" htmlFor="item-note">
          {t.collection.noteLabel}
        </label>
        <textarea
          id="item-note"
          className="field-input"
          style={{ minHeight: 72, resize: "vertical" }}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: 16, borderRadius: 12, background: "var(--panel-2)" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>
          <input type="checkbox" checked={forSale} onChange={(e) => setForSale(e.target.checked)} />
          {t.collection.forSaleLabel}
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>
          <input type="checkbox" checked={forTrade} onChange={(e) => setForTrade(e.target.checked)} />
          {t.collection.forTradeLabel}
        </label>

        {(forSale || forTrade) && (
          <div className="form-field">
            <label className="field-label" htmlFor="asking-price">
              {t.collection.askingPriceLabel}
            </label>
            <input
              id="asking-price"
              type="number"
              min={0}
              step="0.01"
              className="field-input"
              value={askingPrice}
              onChange={(e) => setAskingPrice(e.target.value)}
            />
          </div>
        )}

        {forTrade && (
          <>
            <div className="form-field">
              <label className="field-label" htmlFor="trade-wanted">
                {t.collection.tradeWantedLabel}
              </label>
              <textarea
                id="trade-wanted"
                className="field-input"
                style={{ minHeight: 56, resize: "vertical" }}
                value={tradeWanted}
                onChange={(e) => setTradeWanted(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="field-label" htmlFor="trade-status">
                  {t.collection.tradeStatusLabel}
                </label>
                <select
                  id="trade-status"
                  className="field-input"
                  value={tradeStatus}
                  onChange={(e) => setTradeStatus(e.target.value as TradeStatus | "")}
                >
                  <option value="" />
                  {TRADE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {t.collection.tradeStatus[status]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="field-label" htmlFor="trade-contact">
                  {t.collection.tradeContactLabel}
                </label>
                <input id="trade-contact" className="field-input" value={tradeContact} onChange={(e) => setTradeContact(e.target.value)} />
              </div>
            </div>
          </>
        )}
      </div>

      {saveError && <p style={{ color: "var(--danger)", fontSize: 13 }}>{saveError}</p>}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: "flex-start" }}>
          {saving ? t.common.loading : t.collection.saveChanges}
        </button>
        {saved && !saving && <span style={{ fontSize: 13, color: "var(--success)", fontWeight: 700 }}>{t.common.save} ✓</span>}
      </div>

      <PhotoPicker itemId={itemId} userId={userId} />
    </form>
  );
}
