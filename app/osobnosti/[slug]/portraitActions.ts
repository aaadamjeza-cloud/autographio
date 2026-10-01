"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "person-portraits";

// Both actions re-check the allowlist themselves — a Server Action is a
// public endpoint, the client-side admin check (if any) only shapes the UI,
// it is not what stops a non-admin from POSTing here (see
// app/nevyrizene/actions.ts, same pattern).

// The browser already uploaded the (resized) file to `stagingPath` before
// calling this — this decides what happens to it: an admin's upload goes
// live immediately (moved to the canonical `${slug}.webp` path so existing
// lookups/removal keep working); anyone else's becomes a pending
// submission for /nevyrizene instead, left sitting at its staging path
// until an admin approves it.
export async function submitPortrait(slug: string, stagingPath: string): Promise<{ ok: boolean; status?: "applied" | "pending" }> {
  const { userId } = await auth();
  if (!userId) return { ok: false };

  const admin = createAdminClient();

  if (isAdmin(userId)) {
    const canonicalPath = `${slug}.webp`;
    const { error: moveError } = await admin.storage.from(BUCKET).move(stagingPath, canonicalPath);
    if (moveError) return { ok: false };

    const { error } = await admin.from("person_portraits").upsert({ slug, storage_path: canonicalPath, uploaded_by: userId });
    if (error) return { ok: false };

    revalidatePath(`/osobnosti/${slug}`);
    revalidatePath("/osobnosti");
    return { ok: true, status: "applied" };
  }

  const { error } = await admin.from("person_portrait_submissions").insert({ slug, storage_path: stagingPath, submitted_by: userId });
  if (error) return { ok: false };

  revalidatePath("/nevyrizene");
  return { ok: true, status: "pending" };
}

// Removing a live portrait outright (not "submit a removal for review") —
// admin only, full stop.
export async function removePortrait(slug: string): Promise<{ ok: boolean }> {
  const { userId } = await auth();
  if (!isAdmin(userId)) return { ok: false };

  const admin = createAdminClient();
  await admin.storage.from(BUCKET).remove([`${slug}.webp`]);
  const { error } = await admin.from("person_portraits").delete().eq("slug", slug);
  if (error) return { ok: false };

  revalidatePath(`/osobnosti/${slug}`);
  revalidatePath("/osobnosti");
  return { ok: true };
}
