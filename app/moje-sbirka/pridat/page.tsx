import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Header from "@/components/Header";
import AddItemForm from "@/components/AddItemForm";
import { createServerSupabase } from "@/lib/supabase/server";
import { getServerTranslation } from "@/lib/i18n/server";
import { DB_CATEGORY_TO_APP, type DbPersonCategory } from "@/lib/dbPerson";
import { MOCK_PERSONS } from "@/lib/mockData/persons";

// Market price (marketPriceMin/Max) only lives in the hand-authored catalog
// data — persons has no price columns at all (see 0001_init.sql) — so it's
// looked up by slug here rather than selected from the DB. Only the ~185
// seeded catalog people (0008_seed_persons.sql) have a slug that matches;
// a user-submitted person (0011) simply won't get a prefill.
const MARKET_PRICE_BY_SLUG = new Map(
  MOCK_PERSONS.filter((p) => p.marketPriceMin != null && p.marketPriceMax != null).map((p) => [
    p.slug,
    { min: p.marketPriceMin as number, max: p.marketPriceMax as number },
  ])
);

export default async function AddItemPage({ searchParams }: { searchParams: Promise<{ item?: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/prihlaseni?next=/moje-sbirka/pridat");

  const t = await getServerTranslation();
  const supabase = await createServerSupabase();

  const { data: profile } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
  if (!profile) redirect("/vitej?next=/moje-sbirka/pridat");

  const { item } = await searchParams;
  let existingItem: Awaited<ReturnType<typeof loadItem>> = null;
  if (item) existingItem = await loadItem(supabase, item, userId);

  // Real catalog rows (see supabase/migrations/0008_seed_persons.sql), not
  // lib/mockData — picking a name here sets portfolio_items.person_id so the
  // item is actually linked to that person, not just a text label. `slug`
  // lets the item detail form link to that person's own catalog page;
  // category/gender feed PersonPicker's photo-or-avatar dropdown rows.
  const { data: personRows } = await supabase.from("persons").select("id, name, slug, category, gender").order("name");
  const persons = (personRows ?? []).map((p) => {
    const marketPrice = MARKET_PRICE_BY_SLUG.get(p.slug);
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: DB_CATEGORY_TO_APP[p.category as DbPersonCategory] ?? "jine",
      gender: (p.gender as "m" | "f" | null) ?? "m",
      marketPriceMin: marketPrice?.min ?? null,
      marketPriceMax: marketPrice?.max ?? null,
    };
  });

  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 28 }}>
          {t.collection.addItem}
        </h1>
        <AddItemForm userId={userId} initialItem={existingItem} persons={persons} />
      </main>
    </>
  );
}

async function loadItem(supabase: Awaited<ReturnType<typeof createServerSupabase>>, itemId: string, userId: string) {
  const { data } = await supabase
    .from("portfolio_items")
    .select(
      "id, custom_person_name, item_type, authentication, purchase_price, purchase_date, estimated_value, note, acquisition_method, quantity, acquired_at, for_sale, for_trade, asking_price, trade_wanted, trade_status, trade_contact"
    )
    .eq("id", itemId)
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}
