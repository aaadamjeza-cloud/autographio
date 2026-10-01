"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useTranslation, useLocale } from "@/lib/i18n/I18nProvider";
import { formatKc } from "@/lib/format";

const ITEM_PHOTOS_BUCKET = "item-photos";

type ItemType = "autograph" | "photo" | "card" | "jersey" | "letter" | "other";
type AcquisitionMethod = "mail" | "in_person" | "purchase" | "trade";

export type CollectionItem = {
  id: string;
  custom_person_name: string | null;
  item_type: ItemType;
  purchase_price: number | null;
  estimated_value: number | null;
  created_at: string;
  thumbnailUrl: string | null;
  // Fallback for a collector who hasn't photographed their own item yet —
  // the linked person's own portrait, resolved server-side (see
  // app/moje-sbirka/page.tsx). Never used when thumbnailUrl is set.
  personPhotoUrl: string | null;
  quantity: number;
  acquisition_method: AcquisitionMethod | null;
  acquired_at: string | null;
  for_sale: boolean;
  for_trade: boolean;
  asking_price: number | null;
};

type Filter = "all" | "for_sale" | "for_trade";

export default function CollectionClient({ items }: { items: CollectionItem[] }) {
  const t = useTranslation();
  const locale = useLocale();
  const supabase = createClient();
  const [list, setList] = useState(items);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "for_sale") return list.filter((i) => i.for_sale);
    if (filter === "for_trade") return list.filter((i) => i.for_trade);
    return list;
  }, [list, filter]);

  async function handleDelete(item: CollectionItem) {
    if (!window.confirm(t.collection.deleteConfirm)) return;
    setDeletingId(item.id);

    const { data: photos } = await supabase.from("item_photos").select("storage_path").eq("item_id", item.id);
    if (photos && photos.length > 0) {
      await supabase.storage.from(ITEM_PHOTOS_BUCKET).remove(photos.map((p) => p.storage_path));
    }
    // Deletes the item_photos rows too (ON DELETE CASCADE on item_id).
    const { error } = await supabase.from("portfolio_items").delete().eq("id", item.id);

    setDeletingId(null);
    if (error) {
      window.alert(t.collection.deleteError);
      return;
    }
    setList((prev) => prev.filter((i) => i.id !== item.id));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="hero-nav-locale" style={{ alignSelf: "flex-start" }} role="group">
        {(
          [
            ["all", t.collection.filterAll],
            ["for_sale", t.collection.filterForSale],
            ["for_trade", t.collection.filterForTrade],
          ] as [Filter, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`hero-nav-locale-btn${filter === value ? " hero-nav-locale-btn-active" : ""}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="persons-empty">{t.collection.empty}</p>
      ) : (
        <div className="persons-grid">
          {filtered.map((item) => (
            <div key={item.id} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <Link
                href={`/moje-sbirka/pridat?item=${item.id}`}
                style={{ display: "flex", flexDirection: "column", gap: 12, color: "inherit", textDecoration: "none" }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: 14,
                    overflow: "hidden",
                    background: "var(--panel-2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {item.thumbnailUrl || item.personPhotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- signed Storage URL / public catalog photo, not an optimizable remote asset
                    <img
                      src={item.thumbnailUrl ?? item.personPhotoUrl ?? undefined}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>{t.persons.photoPlaceholder}</span>
                  )}
                  {(item.for_sale || item.for_trade) && (
                    <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 6 }}>
                      {item.for_sale && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            padding: "3px 10px",
                            borderRadius: 999,
                            color: "#fff",
                            background: "var(--accent)",
                          }}
                        >
                          {t.collection.forSaleBadge}
                        </span>
                      )}
                      {item.for_trade && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            padding: "3px 10px",
                            borderRadius: 999,
                            color: "#fff",
                            background: "var(--ink)",
                          }}
                        >
                          {t.collection.forTradeBadge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)" }}>{item.custom_person_name}</p>
                  <p style={{ fontSize: 12, color: "var(--ink-3)", fontWeight: 600 }}>{t.itemType[item.item_type]}</p>
                </div>
                <div>
                  <p style={{ fontWeight: 900, fontSize: 22, letterSpacing: "-0.01em", color: "var(--ink)" }}>
                    {item.estimated_value != null ? formatKc(item.estimated_value * item.quantity, locale) : t.collection.noValue}
                  </p>
                  {item.quantity > 1 && item.estimated_value != null && (
                    <p style={{ fontSize: 12, color: "var(--ink-3)", fontWeight: 600 }}>
                      {item.quantity}× {formatKc(item.estimated_value, locale)}
                    </p>
                  )}
                  {item.purchase_price != null && (
                    <p style={{ fontSize: 12, color: "var(--ink-3)", fontWeight: 600, marginTop: 2 }}>
                      {t.collection.totalInvested}: {formatKc(item.purchase_price, locale)}
                    </p>
                  )}
                </div>
              </Link>
              <button
                type="button"
                className="btn"
                style={{ borderColor: "var(--danger)", color: "var(--danger)" }}
                disabled={deletingId === item.id}
                onClick={() => handleDelete(item)}
              >
                {t.common.delete}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
