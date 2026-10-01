import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Supabase client for Server Components, Server Actions and Route Handlers,
// authenticated as the current Clerk user (Clerk is a Third-Party Auth
// provider — see supabase/migrations/0005_clerk_auth.sql). Plain
// supabase-js `createClient`, not @supabase/ssr's `createServerClient`:
// that helper exists to sync *Supabase's own* auth session into cookies for
// SSR, which doesn't apply here — Clerk owns the session. Wiring it up
// anyway (it requires a `cookies` adapter) makes it internally subscribe to
// Supabase auth state changes to know when to rewrite those cookies, and
// that subscription throws once `accessToken` is configured, since there's
// no Supabase-managed session to watch. RLS still applies as normal — it's
// just auth.jwt() reading a Clerk-issued token instead of a Supabase one.
export async function createServerSupabase() {
  const { getToken } = await auth();

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    accessToken: async () => (await getToken()) ?? null,
  });
}
