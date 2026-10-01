"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/I18nProvider";

export default function OnboardingForm({ userId, destination }: { userId: string; destination: string }) {
  const t = useTranslation();
  const router = useRouter();
  const supabase = createClient();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) return;
    setSaving(true);
    setError(null);

    const { error: insertError } = await supabase.from("profiles").insert({ id: userId, display_name: displayName.trim() });

    if (insertError) {
      setSaving(false);
      // See supabase/migrations/0017_display_name_uniqueness_and_limit.sql
      // — the uniqueness check is a DB trigger, its RAISE EXCEPTION message
      // comes through verbatim here.
      setError(insertError.message.includes("already taken") ? t.onboarding.nameTakenError : t.onboarding.saveError);
      return;
    }
    router.push(destination);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <input
        className="field-input"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder={t.onboarding.displayNamePlaceholder}
        maxLength={40}
        autoFocus
        required
      />
      {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: "flex-start" }}>
        {saving ? t.common.loading : t.onboarding.continue}
      </button>
    </form>
  );
}
