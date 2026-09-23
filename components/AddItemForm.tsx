"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import PhotoPicker from "@/components/PhotoPicker";
import { createClient } from "@/lib/supabase/client";
import t from "@/lib/i18n";

export default function AddItemForm({
  userId,
  initialItemId,
  initialPersonName,
}: {
  userId: string;
  initialItemId?: string;
  initialPersonName?: string;
}) {
  const router = useRouter();
  const [personName, setPersonName] = useState("");
  const [itemId, setItemId] = useState<string | null>(initialItemId ?? null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateItem(e: FormEvent) {
    e.preventDefault();
    if (!personName.trim()) return;
    setCreating(true);
    setError(null);

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("portfolio_items")
      .insert({ user_id: userId, custom_person_name: personName.trim(), item_type: "photo" })
      .select("id")
      .single();

    setCreating(false);
    if (insertError || !data) {
      setError(t.collection.createItemError);
      return;
    }
    setItemId(data.id);
    // Puts the item id in the URL so a reload re-opens the same item instead
    // of starting a new one — this is what actually proves photos persist.
    router.replace(`/moje-sbirka/pridat?item=${data.id}`);
  }

  if (!itemId) {
    return (
      <form onSubmit={handleCreateItem} className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label className="field-label" htmlFor="person-name">
            {t.collection.personNameLabel}
          </label>
          <input
            id="person-name"
            className="field-input"
            style={{ marginTop: 6 }}
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
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
    <div className="card" style={{ padding: 24 }}>
      <p className="field-label" style={{ marginBottom: 12, display: "block" }}>
        {initialPersonName || personName}
      </p>
      <PhotoPicker itemId={itemId} userId={userId} />
    </div>
  );
}
