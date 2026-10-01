import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Header from "@/components/Header";
import CollectionClient, { type CollectionItem } from "@/components/CollectionClient";
import { createServerSupabase } from "@/lib/supabase/server";
import { getServerTranslation, getServerLocale } from "@/lib/i18n/server";
import { findMockPerson } from "@/lib/mockData/persons";
import { formatKc } from "@/lib/format";

const ITEM_PHOTOS_BUCKET = "item-photos";
const PERSON_PORTRAITS_BUCKET = "person-portraits";
const SIGNED_URL_TTL_SECONDS = 3600;

export default async function CollectionPage() {
  const { userId } = await auth();
  if (!userId) redirect("/prihlaseni?next=/moje-sbirka");

  const t = await getServerTranslation();
  const locale = await getServerLocale();
  const supabase = await createServerSupabase();

  const { data: profile } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
  if (!profile) redirect("/vitej?next=/moje-sbirka");

  const { data: items } = await supabase
    .from("portfolio_items")
    .select(
      "id, person_id, custom_person_name, item_type, purchase_price, estimated_value, created_at, quantity, acquisition_method, acquired_at, for_sale, for_trade, asking_price"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const itemIds = (items ?? []).map((i) => i.id);
  const thumbnails = new Map<string, string>();
  if (itemIds.length > 0) {
    const { data: photos } = await supabase
      .from("item_photos")
      .select("item_id, storage_path, sort_order")
      .in("item_id", itemIds)
      .order("sort_order", { ascending: true });

    const firstPathByItem = new Map<string, string>();
    for (const photo of photos ?? []) {
      if (!firstPathByItem.has(photo.item_id)) firstPathByItem.set(photo.item_id, photo.storage_path);
    }
    await Promise.all(
      Array.from(firstPathByItem.entries()).map(async ([itemId, path]) => {
        const { data: signed } = await supabase.storage.from(ITEM_PHOTOS_BUCKET).createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
        if (signed?.signedUrl) thumbnails.set(itemId, signed.signedUrl);
      })
    );
  }

  // Fallback thumbnail when the collector hasn't photographed their own
  // item yet: the linked person's own portrait (an uploaded one first, then
  // the catalog's sourced Commons photo) — same precedence PersonPortrait
  // itself uses, just resolved server-side for a whole grid at once.
  const personIds = [...new Set((items ?? []).map((i) => i.person_id).filter((id): id is string => !!id))];
  const personPhotos = new Map<string, string>();
  if (personIds.length > 0) {
    const { data: personRows } = await supabase.from("persons").select("id, slug").in("id", personIds);
    const slugByPersonId = new Map((personRows ?? []).map((p) => [p.id, p.slug]));

    const slugs = [...slugByPersonId.values()];
    const { data: portraitRows } = await supabase.from("person_portraits").select("slug, storage_path").in("slug", slugs);
    const uploadedPathBySlug = new Map((portraitRows ?? []).map((p) => [p.slug, p.storage_path]));

    for (const [personId, slug] of slugByPersonId) {
      const uploadedPath = uploadedPathBySlug.get(slug);
      if (uploadedPath) {
        personPhotos.set(personId, supabase.storage.from(PERSON_PORTRAITS_BUCKET).getPublicUrl(uploadedPath).data.publicUrl);
      } else {
        const commonsUrl = findMockPerson(slug)?.portrait?.url;
        if (commonsUrl) personPhotos.set(personId, commonsUrl);
      }
    }
  }

  const collectionItems: CollectionItem[] = (items ?? []).map((i) => ({
    ...i,
    thumbnailUrl: thumbnails.get(i.id) ?? null,
    personPhotoUrl: (i.person_id && personPhotos.get(i.person_id)) ?? null,
  }));

  const totalInvested = collectionItems.reduce((sum, i) => sum + (i.purchase_price ?? 0), 0);
  const totalEstimated = collectionItems.reduce((sum, i) => sum + (i.estimated_value ?? 0) * i.quantity, 0);

  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)" }}>{t.collection.title}</h1>
          <a href="/moje-sbirka/pridat" className="btn btn-primary">
            {t.collection.addItem}
          </a>
        </div>

        {collectionItems.length > 0 && (
          <div className="stat-grid" style={{ marginBottom: 28 }}>
            <div className="stat-tile">
              <p className="stat-tile-label">{t.collection.totalItems}</p>
              <p className="stat-tile-value">{collectionItems.length}</p>
            </div>
            <div className="stat-tile">
              <p className="stat-tile-label">{t.collection.totalInvested}</p>
              <p className="stat-tile-value">{formatKc(totalInvested, locale)}</p>
            </div>
            <div className="stat-tile">
              <p className="stat-tile-label">{t.collection.totalEstimated}</p>
              <p className="stat-tile-value">{formatKc(totalEstimated, locale)}</p>
            </div>
            <div className="stat-tile">
              <p className="stat-tile-label">{t.collection.profitLoss}</p>
              <p className="stat-tile-value" style={{ color: totalEstimated - totalInvested >= 0 ? "var(--success)" : "var(--danger)" }}>
                {totalEstimated - totalInvested >= 0 ? "+" : ""}
                {formatKc(totalEstimated - totalInvested, locale)}
              </p>
            </div>
          </div>
        )}

        <CollectionClient items={collectionItems} />
      </main>
    </>
  );
}
