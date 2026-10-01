import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Header from "@/components/Header";
import PersonDetailClient, { type PriceReport, type RequestStats } from "@/components/PersonDetailClient";
import type { SignaturePhoto } from "@/components/SignatureGallery";
import { findMockPerson } from "@/lib/mockData/persons";
import { DB_PERSON_COLUMNS, dbPersonToPerson, type DbPerson } from "@/lib/dbPerson";
import { createServerSupabase } from "@/lib/supabase/server";

const SIGNATURE_BUCKET = "signature-photos";

export default async function PersonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // What these return is already scoped by RLS (0001_init.sql): anyone gets
  // an approved row, and a submitter additionally gets their own pending
  // one — so an unreviewed suggestion has a working page for its author and
  // a 404 for everyone else, with no status check needed here.
  const supabase = await createServerSupabase();
  const { data: dbPerson } = await supabase.from("persons").select("id, status").eq("slug", slug).maybeSingle();

  // Catalog entries still in lib/mockData carry far more (bio, funFact,
  // filmography, price history) than the database row does, so they win.
  // Only a person who exists *just* in the database — every user
  // suggestion — needs the full row, which is also why that second query
  // is deliberately kept off the common path: it names columns added in
  // 0011, so before that migration runs it simply finds nothing rather
  // than breaking every catalog page.
  let person = findMockPerson(slug) ?? null;
  if (!person && dbPerson) {
    const { data: fullRow } = await supabase.from("persons").select(DB_PERSON_COLUMNS).eq("slug", slug).maybeSingle();
    if (fullRow) person = dbPersonToPerson(fullRow as DbPerson);
  }
  if (!person) notFound();

  let requestStats: RequestStats | null = null;
  let priceReports: PriceReport[] = [];
  let signaturePhotos: SignaturePhoto[] = [];

  if (dbPerson) {
    const [statsResult, reportsResult, photosResult] = await Promise.all([
      supabase.rpc("get_person_request_stats", { p_person_id: dbPerson.id }),
      supabase
        .from("price_reports")
        .select("id, price, currency, sold_at, source_name, source_url, title")
        .eq("person_id", dbPerson.id)
        .eq("status", "approved")
        .order("sold_at", { ascending: false }),
      supabase
        .from("signature_photos")
        .select("id, storage_path, uploaded_by")
        .eq("person_id", dbPerson.id)
        .order("created_at", { ascending: true }),
    ]);
    requestStats = statsResult.data?.[0] ?? null;
    priceReports = (reportsResult.data as PriceReport[]) ?? [];

    const photoRows = (photosResult.data as { id: string; storage_path: string; uploaded_by: string | null }[]) ?? [];
    // Attribution comes from public_profiles (0013), which only carries
    // contributors who opted into showing their name — anyone missing here
    // is rendered anonymously rather than having a name dug out of profiles.
    const uploaderIds = [...new Set(photoRows.map((p) => p.uploaded_by).filter((id): id is string => !!id))];
    const names = new Map<string, string>();
    if (uploaderIds.length > 0) {
      const { data: profiles } = await supabase.from("public_profiles").select("id, display_name").in("id", uploaderIds);
      for (const profile of profiles ?? []) names.set(profile.id, profile.display_name);
    }

    signaturePhotos = photoRows.map((row) => ({
      ...row,
      uploaderName: row.uploaded_by ? (names.get(row.uploaded_by) ?? null) : null,
      url: supabase.storage.from(SIGNATURE_BUCKET).getPublicUrl(row.storage_path).data.publicUrl,
    }));
  }

  // The signed-in visitor's own public name, so a photo they upload is
  // attributed immediately without refetching — same opt-in rule applies.
  const { userId } = await auth();
  let currentUserName: string | null = null;
  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, show_name_on_photos")
      .eq("id", userId)
      .maybeSingle();
    currentUserName = profile?.show_name_on_photos ? profile.display_name : null;
  }

  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 1160, margin: "0 auto", padding: "16px 24px 80px" }}>
        <PersonDetailClient
          person={person}
          personId={dbPerson?.id ?? null}
          pendingReview={dbPerson?.status === "pending"}
          requestStats={requestStats}
          priceReports={priceReports}
          signaturePhotos={signaturePhotos}
          currentUserName={currentUserName}
        />
      </main>
    </>
  );
}
