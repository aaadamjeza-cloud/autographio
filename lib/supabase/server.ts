import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Supabase client for Server Components, Server Actions and Route Handlers —
// reads the signed-in user from request cookies, respects RLS. Server
// Components can't set cookies (Next.js throws) — that's fine, the
// middleware's own client already refreshes the session cookie on every
// request, so this write attempt here is a best-effort no-op in that case.
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — ignored, middleware refreshes the session.
          }
        },
      },
    }
  );
}
