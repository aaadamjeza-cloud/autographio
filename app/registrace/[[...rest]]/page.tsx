"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import Header from "@/components/Header";
import GoogleIcon from "@/components/GoogleIcon";
import { useTranslation } from "@/lib/i18n/I18nProvider";

function SignUpForm() {
  const t = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/vitej";
  const { signUp, errors, fetchStatus } = useSignUp();

  const [step, setStep] = useState<"form" | "verify">("form");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const busy = fetchStatus === "fetching";

  function goTo(decorateUrl: (path: string) => string, path: string) {
    const url = decorateUrl(path);
    if (url.startsWith("http")) window.location.href = url;
    else router.push(url);
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const { error: createError } = await signUp.password({ emailAddress: email, password, username });
    if (createError) return;

    if (signUp.status === "complete") {
      await signUp.finalize({ navigate: ({ decorateUrl }) => goTo(decorateUrl, next) });
      return;
    }

    // Bot-protection (Cloudflare Turnstile) mounts into #clerk-captcha,
    // rendered below — required for sign-up per Clerk's default config.
    const { error: codeError } = await signUp.verifications.sendEmailCode();
    if (codeError) {
      setError(t.auth.signUpError);
      return;
    }
    setStep("verify");
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setError(null);

    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize({ navigate: ({ decorateUrl }) => goTo(decorateUrl, next) });
      return;
    }
    if (signUp.status !== undefined) setError(t.auth.genericError);
  }

  async function handleResend() {
    setError(null);
    setResent(false);
    const { error: resendError } = await signUp.verifications.sendEmailCode();
    if (resendError) {
      setError(t.auth.genericError);
      return;
    }
    setResent(true);
  }

  async function handleGoogle() {
    setError(null);
    await signUp.sso({
      strategy: "oauth_google",
      redirectUrl: next,
      redirectCallbackUrl: "/sso-callback",
    });
  }

  if (step === "verify") {
    const codeError = errors?.fields?.code?.message;
    return (
      <form onSubmit={handleVerify} className="card auth-card">
        <h1 className="auth-title">{t.auth.verifyEmailTitle}</h1>
        <p className="auth-subtitle">{t.auth.verifyEmailSubtitle(email)}</p>

        <div className="form-field">
          <label className="field-label" htmlFor="verify-code">
            {t.auth.codeLabel}
          </label>
          <input
            id="verify-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            className="field-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        {(error || codeError) && <p className="auth-error">{error || codeError}</p>}
        {resent && !error && <p className="auth-hint">{t.auth.codeResent}</p>}

        <button type="submit" className="btn btn-primary" disabled={busy} style={{ width: "100%" }}>
          {busy ? t.common.loading : t.auth.verifyButton}
        </button>
        <button type="button" className="auth-link-btn" onClick={handleResend} disabled={busy}>
          {t.auth.resendCode}
        </button>
      </form>
    );
  }

  const fieldError =
    errors?.fields?.emailAddress?.message || errors?.fields?.password?.message || errors?.fields?.username?.message;

  return (
    <form onSubmit={handleCreate} className="card auth-card">
      <h1 className="auth-title">{t.auth.signUpTitle}</h1>
      <p className="auth-subtitle">{t.auth.signUpSubtitle}</p>

      <button type="button" className="btn auth-oauth-btn" onClick={handleGoogle} disabled={busy}>
        <GoogleIcon />
        {t.auth.continueWithGoogle}
      </button>

      <div className="auth-divider">
        <span>{t.auth.orDivider}</span>
      </div>

      <div className="form-field">
        <label className="field-label" htmlFor="signup-username">
          {t.auth.username}
        </label>
        <input
          id="signup-username"
          type="text"
          className="field-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </div>
      <div className="form-field">
        <label className="field-label" htmlFor="signup-email">
          {t.auth.email}
        </label>
        <input
          id="signup-email"
          type="email"
          className="field-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div className="form-field">
        <label className="field-label" htmlFor="signup-password">
          {t.auth.password}
        </label>
        <input
          id="signup-password"
          type="password"
          className="field-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      {(error || fieldError) && <p className="auth-error">{error || fieldError}</p>}

      {/* Clerk's bot-protection (Cloudflare Turnstile) mounts here — required
          for sign-up flows, on by default and not something we can skip. */}
      <div id="clerk-captcha" />

      <button type="submit" className="btn btn-primary" disabled={busy} style={{ width: "100%" }}>
        {busy ? t.common.loading : t.auth.continueButton}
      </button>

      <p className="auth-switch">
        {t.auth.alreadyHaveAccount} <Link href="/prihlaseni">{t.auth.login}</Link>
      </p>
    </form>
  );
}

export default function SignUpPage() {
  return (
    <>
      <Header />
      <main className="page-content" style={{ padding: "16px 24px 80px", display: "flex", justifyContent: "center" }}>
        <Suspense fallback={null}>
          <SignUpForm />
        </Suspense>
      </main>
    </>
  );
}
