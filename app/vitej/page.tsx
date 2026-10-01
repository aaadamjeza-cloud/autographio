import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Header from "@/components/Header";
import OnboardingForm from "@/components/OnboardingForm";
import { createServerSupabase } from "@/lib/supabase/server";
import { getServerTranslation } from "@/lib/i18n/server";

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { userId } = await auth();
  const { next } = await searchParams;
  const destination = next ?? "/moje-sbirka";
  if (!userId) redirect(`/prihlaseni?next=/vitej${next ? `?next=${encodeURIComponent(next)}` : ""}`);

  const t = await getServerTranslation();
  const supabase = await createServerSupabase();
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
  if (profile) redirect(destination);

  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 480, margin: "0 auto", padding: "48px 24px 80px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 10 }}>
          {t.onboarding.displayNameTitle}
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 24, lineHeight: 1.5 }}>{t.onboarding.displayNameHint}</p>
        <OnboardingForm userId={userId} destination={destination} />
      </main>
    </>
  );
}
