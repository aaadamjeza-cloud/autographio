import { redirect } from "next/navigation";
import Header from "@/components/Header";
import AddItemForm from "@/components/AddItemForm";
import { createServerSupabase } from "@/lib/supabase/server";
import t from "@/lib/i18n";

export default async function AddItemPage({ searchParams }: { searchParams: Promise<{ item?: string }> }) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/prihlaseni?next=/moje-sbirka/pridat");

  const { item } = await searchParams;
  let existingItem: { id: string; name: string } | null = null;
  if (item) {
    const { data } = await supabase
      .from("portfolio_items")
      .select("id, custom_person_name")
      .eq("id", item)
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) existingItem = { id: data.id, name: data.custom_person_name ?? "" };
  }

  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 28 }}>
          {t.collection.addItem}
        </h1>
        <AddItemForm userId={user.id} initialItemId={existingItem?.id} initialPersonName={existingItem?.name} />
      </main>
    </>
  );
}
