import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Header from "@/components/Header";
import ReviewQueueClient from "@/components/ReviewQueueClient";
import PortraitReviewQueueClient from "@/components/PortraitReviewQueueClient";
import PriceReportReviewQueueClient from "@/components/PriceReportReviewQueueClient";
import ContentReportQueueClient from "@/components/ContentReportQueueClient";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { DB_PERSON_COLUMNS, type DbPerson } from "@/lib/dbPerson";
import { getServerTranslation } from "@/lib/i18n/server";
import { formatKc } from "@/lib/format";

const PORTRAIT_BUCKET = "person-portraits";
const ITEM_PHOTOS_BUCKET = "item-photos";
const SIGNED_URL_TTL_SECONDS = 3600;

const sectionTitleStyle = { fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)" } as const;

type PendingPriceReportRow = {
  id: string;
  person_id: string;
  price: number;
  currency: string;
  sold_at: string | null;
  source_name: string;
  source_url: string;
  title: string | null;
  item_type: "autograph" | "photo" | "card" | "jersey" | "letter" | "other";
  authentication: "certificate" | "in_person" | "unverified";
  created_at: string;
};

type ContentReportRow = {
  id: string;
  reporter_id: string;
  target_type: "person" | "item_photo" | "price_report";
  target_id: string;
  reason: string;
  created_at: string;
};

export default async function ReviewQueuePage() {
  const { userId } = await auth();
  if (!userId) redirect("/prihlaseni?next=/nevyrizene");
  // 404 rather than a "you're not an admin" page — no reason to confirm the
  // route even exists to someone who isn't on the allowlist.
  if (!isAdmin(userId)) notFound();

  const t = await getServerTranslation();
  const admin = createAdminClient();

  // Service-role client: RLS only lets a submitter read back their *own*
  // pending row (0001_init.sql), so a reviewer needs the client that
  // bypasses it to see the whole queue.
  const [{ data: persons }, { data: portraitSubmissions }, { data: priceReportRows }, { data: contentReportRows }] =
    await Promise.all([
      admin.from("persons").select(DB_PERSON_COLUMNS).eq("status", "pending").order("created_at", { ascending: true }),
      admin
        .from("person_portrait_submissions")
        .select("id, slug, storage_path, created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
      admin
        .from("price_reports")
        .select("id, person_id, price, currency, sold_at, source_name, source_url, title, item_type, authentication, created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
      admin
        .from("content_reports")
        .select("id, reporter_id, target_type, target_id, reason, created_at")
        .order("created_at", { ascending: true }),
    ]);

  const pendingPortraits = (portraitSubmissions ?? []).map((submission) => ({
    ...submission,
    previewUrl: admin.storage.from(PORTRAIT_BUCKET).getPublicUrl(submission.storage_path).data.publicUrl,
  }));

  const priceReports = (priceReportRows as PendingPriceReportRow[] | null) ?? [];

  // Each report only carries person_id, not a name — batch-fetched once for
  // the whole queue rather than one query per row (same idea as the
  // uploader-name lookup on the person detail page).
  const reportPersonIds = [...new Set(priceReports.map((r) => r.person_id))];
  const personNames = new Map<string, { name: string; slug: string }>();
  if (reportPersonIds.length > 0) {
    const { data: rows } = await admin.from("persons").select("id, name, slug").in("id", reportPersonIds);
    for (const row of rows ?? []) personNames.set(row.id, { name: row.name, slug: row.slug });
  }
  const pendingPriceReports = priceReports.map((report) => ({
    ...report,
    personName: personNames.get(report.person_id)?.name ?? "?",
    personSlug: personNames.get(report.person_id)?.slug ?? "",
  }));

  // content_reports.target_id points into a different table depending on
  // target_type, so it's resolved per type below instead of with one join.
  const reports = (contentReportRows as ContentReportRow[] | null) ?? [];
  const personTargetIds = reports.filter((r) => r.target_type === "person").map((r) => r.target_id);
  const priceReportTargetIds = reports.filter((r) => r.target_type === "price_report").map((r) => r.target_id);
  const itemPhotoTargetIds = reports.filter((r) => r.target_type === "item_photo").map((r) => r.target_id);
  const reporterIds = [...new Set(reports.map((r) => r.reporter_id))];

  const [personTargets, priceReportTargets, itemPhotoTargets, reporterProfiles] = await Promise.all([
    personTargetIds.length > 0
      ? admin.from("persons").select("id, name, slug").in("id", personTargetIds)
      : Promise.resolve({ data: [] as { id: string; name: string; slug: string }[] }),
    priceReportTargetIds.length > 0
      ? admin.from("price_reports").select("id, person_id, price, source_name").in("id", priceReportTargetIds)
      : Promise.resolve({ data: [] as { id: string; person_id: string; price: number; source_name: string }[] }),
    itemPhotoTargetIds.length > 0
      ? admin.from("item_photos").select("id, storage_path").in("id", itemPhotoTargetIds)
      : Promise.resolve({ data: [] as { id: string; storage_path: string }[] }),
    reporterIds.length > 0
      ? admin.from("profiles").select("id, display_name").in("id", reporterIds)
      : Promise.resolve({ data: [] as { id: string; display_name: string }[] }),
  ]);

  const personTargetMap = new Map((personTargets.data ?? []).map((p) => [p.id, p]));
  const priceReportTargetMap = new Map((priceReportTargets.data ?? []).map((p) => [p.id, p]));
  const itemPhotoTargetMap = new Map((itemPhotoTargets.data ?? []).map((p) => [p.id, p]));
  const reporterNameMap = new Map((reporterProfiles.data ?? []).map((p) => [p.id, p.display_name]));

  // A reported price_report's row only carries person_id, not the name —
  // one more batch lookup, same reasoning as personNames above.
  const priceReportTargetPersonIds = [...new Set([...priceReportTargetMap.values()].map((p) => p.person_id))];
  const priceReportTargetPersonNames = new Map<string, string>();
  if (priceReportTargetPersonIds.length > 0) {
    const { data: rows } = await admin.from("persons").select("id, name").in("id", priceReportTargetPersonIds);
    for (const row of rows ?? []) priceReportTargetPersonNames.set(row.id, row.name);
  }

  const pendingContentReports = await Promise.all(
    reports.map(async (report) => {
      const reporterName = reporterNameMap.get(report.reporter_id) ?? t.signatures.anonymous;
      let targetSummary = `#${report.target_id.slice(0, 8)}`;
      let targetHref: string | null = null;
      let previewUrl: string | null = null;

      if (report.target_type === "person") {
        const person = personTargetMap.get(report.target_id);
        if (person) {
          targetSummary = person.name;
          targetHref = `/osobnosti/${person.slug}`;
        }
      } else if (report.target_type === "price_report") {
        const priceReport = priceReportTargetMap.get(report.target_id);
        if (priceReport) {
          const personName = priceReportTargetPersonNames.get(priceReport.person_id) ?? "?";
          // Always Kč, not locale-dependent — this is an internal moderation
          // tool, and the admin needs to compare the exact submitted figure
          // against the source listing, not a converted approximation.
          targetSummary = `${personName} — ${formatKc(priceReport.price, "cs")} (${priceReport.source_name})`;
        }
      } else if (report.target_type === "item_photo") {
        const photo = itemPhotoTargetMap.get(report.target_id);
        if (photo) {
          const { data: signed } = await admin.storage
            .from(ITEM_PHOTOS_BUCKET)
            .createSignedUrl(photo.storage_path, SIGNED_URL_TTL_SECONDS);
          previewUrl = signed?.signedUrl ?? null;
        }
      }

      return {
        id: report.id,
        target_type: report.target_type,
        reason: report.reason,
        created_at: report.created_at,
        reporterName,
        targetSummary,
        targetHref,
        previewUrl,
      };
    })
  );

  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 80px" }}>
        <h1 style={{ ...sectionTitleStyle, marginBottom: 28 }}>{t.review.title}</h1>
        <ReviewQueueClient pending={(persons as DbPerson[] | null) ?? []} />

        <h1 style={{ ...sectionTitleStyle, margin: "48px 0 28px" }}>{t.review.portraitsTitle}</h1>
        <PortraitReviewQueueClient pending={pendingPortraits} />

        <h1 style={{ ...sectionTitleStyle, margin: "48px 0 28px" }}>{t.review.priceReportsTitle}</h1>
        <PriceReportReviewQueueClient pending={pendingPriceReports} />

        <h1 style={{ ...sectionTitleStyle, margin: "48px 0 28px" }}>{t.review.contentReportsTitle}</h1>
        <ContentReportQueueClient pending={pendingContentReports} />
      </main>
    </>
  );
}
