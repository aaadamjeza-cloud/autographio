import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Header from "@/components/Header";
import RequestsClient, { type AutographRequest } from "@/components/RequestsClient";
import { createServerSupabase } from "@/lib/supabase/server";
import { getServerTranslation } from "@/lib/i18n/server";
import { DB_CATEGORY_TO_APP, type DbPersonCategory } from "@/lib/dbPerson";

export default async function RequestsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/prihlaseni?next=/moje-zadosti");

  const t = await getServerTranslation();
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("autograph_requests")
    .select(
      "id, custom_person_name, item_type, sent_at, status, received_at, return_postage_type, country, note, address, enclosed_note, received_photo_path"
    )
    .order("sent_at", { ascending: false });

  const requests = (data as AutographRequest[]) ?? [];

  // Photo of what arrived — private bucket (see 0015_request_address_photo.sql),
  // so every request with one needs its own short-lived signed URL, same
  // approach as the item thumbnails on app/moje-sbirka/page.tsx.
  const photoUrls = new Map<string, string>();
  const withPhoto = requests.filter((r) => r.received_photo_path);
  await Promise.all(
    withPhoto.map(async (r) => {
      const { data: signed } = await supabase.storage.from(REQUEST_PHOTOS_BUCKET).createSignedUrl(r.received_photo_path!, SIGNED_URL_TTL_SECONDS);
      if (signed?.signedUrl) photoUrls.set(r.id, signed.signedUrl);
    })
  );
  const requestsWithPhotoUrl = requests.map((r) => ({ ...r, receivedPhotoUrl: photoUrls.get(r.id) ?? null }));

  // Real catalog rows (see supabase/migrations/0008_seed_persons.sql) —
  // picking a name here sets autograph_requests.person_id so the request
  // actually counts toward that person's public wait-time stats (0002).
  // category/gender feed PersonPicker's photo-or-avatar dropdown rows.
  const { data: personRows } = await supabase.from("persons").select("id, name, slug, category, gender").order("name");
  const persons = (personRows ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: DB_CATEGORY_TO_APP[p.category as DbPersonCategory] ?? "jine",
    gender: (p.gender as "m" | "f" | null) ?? "m",
  }));

  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 28 }}>
          {t.requests.title}
        </h1>
        <RequestsClient userId={userId} initialRequests={requestsWithPhotoUrl} persons={persons} />
      </main>
    </>
  );
}

const REQUEST_PHOTOS_BUCKET = "request-photos";
const SIGNED_URL_TTL_SECONDS = 3600;
