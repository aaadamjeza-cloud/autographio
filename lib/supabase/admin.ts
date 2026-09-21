import { createClient } from "@supabase/supabase-js";

// Server-only admin client — the service_role key bypasses RLS, so this may
// only be used in API routes/route handlers, never in browser-reachable code.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
