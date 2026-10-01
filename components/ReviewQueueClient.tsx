"use client";

import { useState, useTransition } from "react";
import { approvePerson, rejectPerson } from "@/app/nevyrizene/actions";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { CATEGORY_LABELS } from "@/lib/mockData/persons";
import { DB_CATEGORY_TO_APP, type DbPerson } from "@/lib/dbPerson";
import { formatDate } from "@/lib/format";

export default function ReviewQueueClient({ pending }: { pending: DbPerson[] }) {
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
    return <p className="persons-empty">{t.review.empty}</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}

      {pending.map((person) => (
        <div key={person.id} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)" }}>{person.name}</p>
            <p style={{ fontSize: 13, color: "var(--ink-3)" }}>
              {CATEGORY_LABELS[DB_CATEGORY_TO_APP[person.category] ?? "jine"]}
              {person.nationality ? ` · ${person.nationality}` : ""}
              {person.birth_year ? ` · ${person.birth_year}` : ""}
              {person.death_year ? `–${person.death_year}` : ""}
            </p>
          </div>

          {person.bio && <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>{person.bio}</p>}

          <p style={{ fontSize: 12, color: "var(--ink-muted)" }}>
            {t.review.submitted}: {formatDate(person.created_at.slice(0, 10))} · /{person.slug}
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-primary"
              disabled={isPending && busyId === person.id}
              onClick={() => run(person.id, approvePerson)}
            >
              {t.review.approve}
            </button>
            <button
              type="button"
              className="btn"
              disabled={isPending && busyId === person.id}
              onClick={() => run(person.id, rejectPerson)}
            >
              {t.review.reject}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
