"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import t from "@/lib/i18n";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (signInError) {
      setError(t.auth.loginError);
      return;
    }
    router.push(searchParams.get("next") ?? "/moje-sbirka/pridat");
    router.refresh();
  }

  return (
    <div className="card" style={{ maxWidth: 380, margin: "64px auto", padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 4 }}>
        {t.auth.loginTitle}
      </h1>
      <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 24 }}>{t.auth.loginSubtitle}</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label className="field-label" htmlFor="email">
            {t.auth.email}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="field-input"
            style={{ marginTop: 6 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="password">
            {t.auth.password}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="field-input"
            style={{ marginTop: 6 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? t.common.loading : t.auth.login}
        </button>
      </form>
    </div>
  );
}
