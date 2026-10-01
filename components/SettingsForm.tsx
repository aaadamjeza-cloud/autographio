"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/I18nProvider";

const MAX_DISPLAY_NAME_CHANGES = 3;

export default function SettingsForm({
  userId,
  initialDisplayName,
  initialShowNameOnPhotos,
  displayNameChanges,
}: {
  userId: string;
  initialDisplayName: string;
  initialShowNameOnPhotos: boolean;
  displayNameChanges: number;
}) {
  const t = useTranslation();
  const router = useRouter();
  const { signOut } = useClerk();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [showNameOnPhotos, setShowNameOnPhotos] = useState(initialShowNameOnPhotos);
  const [changesUsed, setChangesUsed] = useState(displayNameChanges);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const changesLeft = MAX_DISPLAY_NAME_CHANGES - changesUsed;
  const nameChanged = displayName.trim() !== initialDisplayName;
  const nameLimitReached = nameChanged && changesLeft <= 0;

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) return;
    if (nameLimitReached) {
      setSaveError(t.settings.nameChangeLimitError);
      return;
    }
    setSaving(true);
    setSaveError(null);

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim(), show_name_on_photos: showNameOnPhotos })
      .eq("id", userId);

    setSaving(false);
    if (error) {
      // The uniqueness/limit checks live in a DB trigger (see
      // supabase/migrations/0017_display_name_uniqueness_and_limit.sql) —
      // its RAISE EXCEPTION message comes through here verbatim, so we
      // match on it to show the right one instead of a generic failure.
      if (error.message.includes("already taken")) {
        setSaveError(t.settings.nameTakenError);
      } else if (error.message.includes("change limit reached")) {
        setSaveError(t.settings.nameChangeLimitError);
      } else {
        setSaveError(t.settings.saveError);
      }
      return;
    }
    if (nameChanged) setChangesUsed((c) => c + 1);
  }

  async function handleLogout() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    const res = await fetch("/api/account/delete", { method: "POST" });
    if (!res.ok) {
      setDeleting(false);
      setDeleteError(t.settings.deleteAccountError);
      return;
    }
    await signOut();
    router.push("/");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <form onSubmit={handleSave} className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label className="field-label" htmlFor="display-name">
            {t.settings.displayName}
          </label>
          <input
            id="display-name"
            className="field-input"
            style={{ marginTop: 6 }}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={40}
            disabled={changesLeft <= 0}
            required
          />
          <p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 6 }}>
            {changesLeft > 0 ? t.settings.changesRemaining(changesLeft) : t.settings.nameChangeLimitError}
          </p>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: "var(--ink-2)" }}>
          <input type="checkbox" checked={showNameOnPhotos} onChange={(e) => setShowNameOnPhotos(e.target.checked)} />
          {t.settings.showNameOnPhotos}
        </label>
        {saveError && <p style={{ color: "var(--danger)", fontSize: 13 }}>{saveError}</p>}
        <button type="submit" className="btn btn-primary" disabled={saving || nameLimitReached} style={{ alignSelf: "flex-start" }}>
          {saving ? t.common.loading : t.common.save}
        </button>
      </form>

      <div className="card" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <p style={{ fontSize: 13, color: "var(--ink-3)" }}>{t.settings.logoutHint}</p>
        <button type="button" className="btn" onClick={handleLogout}>
          {t.auth.logout}
        </button>
      </div>

      <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12, borderColor: "var(--danger)" }}>
        <p style={{ fontSize: 13, color: "var(--ink-3)" }}>{t.settings.deleteAccountWarning}</p>
        {deleteError && <p style={{ color: "var(--danger)", fontSize: 13 }}>{deleteError}</p>}
        {confirmingDelete ? (
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              className="btn"
              style={{ borderColor: "var(--danger)", color: "var(--danger)" }}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? t.common.loading : t.settings.deleteAccountConfirm}
            </button>
            <button type="button" className="btn" onClick={() => setConfirmingDelete(false)} disabled={deleting}>
              {t.common.cancel}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn"
            style={{ alignSelf: "flex-start", borderColor: "var(--danger)", color: "var(--danger)" }}
            onClick={() => setConfirmingDelete(true)}
          >
            {t.settings.deleteAccount}
          </button>
        )}
      </div>
    </div>
  );
}
