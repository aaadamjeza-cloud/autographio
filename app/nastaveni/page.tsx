import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import Header from "@/components/Header";
import SettingsForm from "@/components/SettingsForm";
import { createServerSupabase } from "@/lib/supabase/server";
import { getServerTranslation } from "@/lib/i18n/server";
import { formatDate } from "@/lib/format";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/prihlaseni?next=/nastaveni");

  const t = await getServerTranslation();
  const supabase = await createServerSupabase();
  const [{ data: profile }, user] = await Promise.all([
    supabase.from("profiles").select("display_name, show_name_on_photos, display_name_changes").eq("id", userId).maybeSingle(),
    currentUser(),
  ]);
  if (!profile) redirect("/vitej?next=/nastaveni");

  const email = user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ?? user?.emailAddresses[0]?.emailAddress;

  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 480, margin: "0 auto", padding: "32px 24px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 28 }}>
          {t.settings.title}
        </h1>

        {/* Only the account owner ever sees this page — showing their own
            email/join date here isn't public exposure (see AGENTS.md's rule
            against exposing email/Google name *publicly*; profiles.display_name
            stays the only public-facing name, unaffected by this). */}
        <div className="card" style={{ padding: 24, marginBottom: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          <p className="field-label" style={{ marginBottom: 2 }}>
            {t.settings.accountInfoTitle}
          </p>
          {email && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span style={{ color: "var(--ink-3)" }}>{t.settings.emailLabel}</span>
              <span style={{ color: "var(--ink)", fontWeight: 600 }}>{email}</span>
            </div>
          )}
          {user?.createdAt && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span style={{ color: "var(--ink-3)" }}>{t.settings.memberSinceLabel}</span>
              <span style={{ color: "var(--ink)", fontWeight: 600 }}>{formatDate(new Date(user.createdAt).toISOString())}</span>
            </div>
          )}
        </div>

        <SettingsForm
          userId={userId}
          initialDisplayName={profile.display_name}
          initialShowNameOnPhotos={profile.show_name_on_photos}
          displayNameChanges={profile.display_name_changes}
        />
      </main>
    </>
  );
}
