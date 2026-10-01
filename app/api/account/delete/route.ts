import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase/server";

const ITEM_PHOTOS_BUCKET = "item-photos";

// Deletes everything owned by the signed-in user, then the Clerk account
// itself. Runs as that user (RLS owner policies, not the service role) —
// every query below only ever touches their own rows, so there's no way
// this can reach into anyone else's data even if userId were spoofed.
//
// profiles/portfolio_items/autograph_requests no longer have a DB-level FK
// to the auth user (see 0005_clerk_auth.sql — Clerk owns identity now, not
// auth.users), so nothing cascades from deleting the Clerk user: this route
// has to clean up each table itself, in an order that respects
// item_photos -> portfolio_items's own ON DELETE CASCADE.
export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const supabase = await createServerSupabase();

  const { data: photos } = await supabase.from("item_photos").select("storage_path").eq("user_id", userId);
  if (photos && photos.length > 0) {
    await supabase.storage.from(ITEM_PHOTOS_BUCKET).remove(photos.map((p) => p.storage_path));
  }

  // Cascades to item_photos rows (ON DELETE CASCADE on item_id).
  await supabase.from("portfolio_items").delete().eq("user_id", userId);
  await supabase.from("autograph_requests").delete().eq("user_id", userId);
  await supabase.from("profiles").delete().eq("id", userId);

  const client = await clerkClient();
  await client.users.deleteUser(userId);

  return NextResponse.json({ ok: true });
}
