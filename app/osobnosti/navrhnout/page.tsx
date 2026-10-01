import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Header from "@/components/Header";
import SuggestPersonForm from "@/components/SuggestPersonForm";
import { createServerSupabase } from "@/lib/supabase/server";
import { getServerTranslation } from "@/lib/i18n/server";

export default async function SuggestPersonPage() {
  const { userId } = await auth();
  if (!userId) redirect("/prihlaseni?next=/osobnosti/navrhnout");

  const t = await getServerTranslation();
  const supabase = await createServerSupabase();

  const { data: profile } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
  if (!profile) redirect("/vitej?next=/osobnosti/navrhnout");

  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 8 }}>
          {t.suggestPerson.title}
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 28 }}>{t.suggestPerson.intro}</p>
        <SuggestPersonForm userId={userId} />
      </main>
    </>
  );
}
