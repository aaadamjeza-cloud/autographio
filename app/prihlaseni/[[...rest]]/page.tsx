"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import Header from "@/components/Header";
import GoogleIcon from "@/components/GoogleIcon";
import { useTranslation } from "@/lib/i18n/I18nProvider";

function LoginForm() {
  const t = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/moje-sbirka";
  const { signIn, errors, fetchStatus } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const busy = fetchStatus === "fetching";

  function goTo(decorateUrl: (path: string) => string, path: string) {
    const url = decorateUrl(path);
    // decorateUrl can hand back an absolute URL (Safari ITP workaround) —
    // that has to be a real navigation, router.push only handles app-relative paths.
    if (url.startsWith("http")) window.location.href = url;
    else router.push(url);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    await signIn.password({ identifier: email, password });

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: ({ decorateUrl }) => goTo(decorateUrl, next) });
      return;
    }
    // This app doesn't offer MFA/passkeys etc. — any other status is
    // unexpected here, so surface it as a plain error rather than building
    // out flows the product doesn't use.
    if (signIn.status !== undefined) setError(t.auth.genericError);
  }

  async function handleGoogle() {
    setError(null);
    await signIn.sso({
      strategy: "oauth_google",
      redirectUrl: next,
      redirectCallbackUrl: "/sso-callback",
    });
  }

  const fieldError = errors?.fields?.identifier?.message || errors?.fields?.password?.message;

  return (
    <form onSubmit={handleSubmit} className="card auth-card">
      <h1 className="auth-title">{t.auth.loginTitle}</h1>
      <p className="auth-subtitle">{t.auth.loginSubtitle}</p>

      <button type="button" className="btn auth-oauth-btn" onClick={handleGoogle} disabled={busy}>
        <GoogleIcon />
        {t.auth.continueWithGoogle}
      </button>

      <div className="auth-divider">
        <span>{t.auth.orDivider}</span>
      </div>

      <div className="form-field">
        <label className="field-label" htmlFor="login-email">
          {t.auth.email}
        </label>
        <input
          id="login-email"
          type="email"
          className="field-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div className="form-field">
        <label className="field-label" htmlFor="login-password">
          {t.auth.password}
        </label>
        <input
          id="login-password"
          type="password"
          className="field-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      {(error || fieldError) && <p className="auth-error">{error || fieldError || t.auth.loginError}</p>}

      <button type="submit" className="btn btn-primary" disabled={busy} style={{ width: "100%" }}>
        {busy ? t.common.loading : t.auth.continueButton}
      </button>

      <p className="auth-switch">
        {t.auth.noAccountYet} <Link href="/registrace">{t.auth.signUp}</Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="page-content" style={{ padding: "16px 24px 80px", display: "flex", justifyContent: "center" }}>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </main>
    </>
  );
}
