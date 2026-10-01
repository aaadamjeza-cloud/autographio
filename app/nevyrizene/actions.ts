"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

// Both actions re-check the allowlist themselves. A Server Action is a
// public endpoint — the page-level guard only hides the UI, it is not what
// stops a non-admin from POSTing here.
//
// Both also scope the write to `status = 'pending'`, so neither can touch a
// person who is already live in the catalog: approving is idempotent and
// rejecting can only ever discard something still sitting in the queue.

export async function approvePerson(id: string): Promise<{ ok: boolean }> {
  const { userId } = await auth();
  if (!isAdmin(userId)) return { ok: false };

  const { error } = await createAdminClient()
    .from("persons")
    .update({ status: "approved" })
    .eq("id", id)
    .eq("status", "pending");
  if (error) return { ok: false };

  revalidatePath("/nevyrizene");
  revalidatePath("/osobnosti");
  return { ok: true };
}

export async function rejectPerson(id: string): Promise<{ ok: boolean }> {
  const { userId } = await auth();
  if (!isAdmin(userId)) return { ok: false };

  const { error } = await createAdminClient().from("persons").delete().eq("id", id).eq("status", "pending");
  if (error) return { ok: false };

  revalidatePath("/nevyrizene");
  return { ok: true };
}

// Same idea as approvePerson/rejectPerson above, for a pending
// person_portrait_submissions row (see
// supabase/migrations/0018_person_portrait_submissions.sql) instead of a
// pending person.

export async function approvePortraitSubmission(id: string): Promise<{ ok: boolean }> {
  const { userId } = await auth();
  if (!isAdmin(userId)) return { ok: false };

  const admin = createAdminClient();
  const { data: submission, error: fetchError } = await admin
    .from("person_portrait_submissions")
    .select("slug, storage_path")
    .eq("id", id)
    .eq("status", "pending")
    .maybeSingle();
  if (fetchError || !submission) return { ok: false };

  const canonicalPath = `${submission.slug}.webp`;
  const { error: moveError } = await admin.storage.from("person-portraits").move(submission.storage_path, canonicalPath);
  if (moveError) return { ok: false };

  const { error: upsertError } = await admin
    .from("person_portraits")
    .upsert({ slug: submission.slug, storage_path: canonicalPath, uploaded_by: userId });
  if (upsertError) return { ok: false };

  const { error: statusError } = await admin
    .from("person_portrait_submissions")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (statusError) return { ok: false };

  revalidatePath("/nevyrizene");
  revalidatePath(`/osobnosti/${submission.slug}`);
  revalidatePath("/osobnosti");
  return { ok: true };
}

// Same pattern again, for a pending price_reports row (0009/0012). No new
// migration was needed for this one: the admin (service-role) client
// already bypasses RLS, so it can update/delete a 'pending' row even though
// there is no policy granting that to anyone else.
export async function approvePriceReport(id: string): Promise<{ ok: boolean }> {
  const { userId } = await auth();
  if (!isAdmin(userId)) return { ok: false };

  const admin = createAdminClient();
  const { data: report, error: fetchError } = await admin
    .from("price_reports")
    .select("person_id")
    .eq("id", id)
    .eq("status", "pending")
    .maybeSingle();
  if (fetchError || !report) return { ok: false };

  const { error } = await admin.from("price_reports").update({ status: "approved" }).eq("id", id).eq("status", "pending");
  if (error) return { ok: false };

  const { data: person } = await admin.from("persons").select("slug").eq("id", report.person_id).maybeSingle();

  revalidatePath("/nevyrizene");
  if (person?.slug) revalidatePath(`/osobnosti/${person.slug}`);
  return { ok: true };
}

export async function rejectPriceReport(id: string): Promise<{ ok: boolean }> {
  const { userId } = await auth();
  if (!isAdmin(userId)) return { ok: false };

  const { error } = await createAdminClient().from("price_reports").delete().eq("id", id).eq("status", "pending");
  if (error) return { ok: false };

  revalidatePath("/nevyrizene");
  return { ok: true };
}

// content_reports has no status column at all (0001) — it's an immutable
// log, not something with a pending/approved lifecycle. "Dismissing" one
// here just means the admin has seen it and it can leave the queue, so this
// deletes the row outright rather than flipping a flag.
export async function dismissContentReport(id: string): Promise<{ ok: boolean }> {
  const { userId } = await auth();
  if (!isAdmin(userId)) return { ok: false };

  const { error } = await createAdminClient().from("content_reports").delete().eq("id", id);
  if (error) return { ok: false };

  revalidatePath("/nevyrizene");
  return { ok: true };
}

export async function rejectPortraitSubmission(id: string): Promise<{ ok: boolean }> {
  const { userId } = await auth();
  if (!isAdmin(userId)) return { ok: false };

  const admin = createAdminClient();
  const { data: submission, error: fetchError } = await admin
    .from("person_portrait_submissions")
    .select("storage_path")
    .eq("id", id)
    .eq("status", "pending")
    .maybeSingle();
  if (fetchError || !submission) return { ok: false };

  // Clean up the staged file too — a rejected submission shouldn't leave
  // an orphaned upload sitting in Storage forever.
  await admin.storage.from("person-portraits").remove([submission.storage_path]);

  const { error } = await admin
    .from("person_portrait_submissions")
    .update({ status: "rejected", reviewed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending");
  if (error) return { ok: false };

  revalidatePath("/nevyrizene");
  return { ok: true };
}
