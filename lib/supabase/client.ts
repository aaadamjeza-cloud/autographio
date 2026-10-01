"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Clerk attaches this global once it's loaded — reading the session
// imperatively here (rather than via the useSession() hook) is what lets
// this client stay a true module-level singleton (see below).
declare global {
  interface Window {
    Clerk?: {
      session?: { getToken: () => Promise<string | null> } | null;
    };
  }
}

// Module-level singleton — components each call createClient() independently
// (Header, forms, PhotoPicker, PersonPortrait); without caching that spins
// up a separate client per call. That's not just wasteful: a listing page
// renders one PersonPortrait per person (200+ on /osobnosti), and each one
// used to call the useSupabaseClient() hook and get its OWN client instance
// — 200+ simultaneous clients each doing their own auth/connection setup is
// exactly what was producing floods of "network connection lost" errors and
// starving other requests (e.g. an upload) of bandwidth. One shared client
// avoids that entirely.
//
// `accessToken` is called fresh per request by supabase-js, so reading
// Clerk's *current* session here (rather than capturing a specific session
// object at creation time, which is what the React-hook version had to do)
// keeps this one instance correct across sign-in/sign-out without ever
// needing to be recreated.
let browserClient: SupabaseClient | undefined;

export function createClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      // Client Components still render once on the server for the initial
      // HTML, where `window` doesn't exist at all — guard against that
      // pass; the real browser call (post-hydration) is what actually
      // needs a token.
      accessToken: async () => {
        if (typeof window === "undefined") return null;
        return (await window.Clerk?.session?.getToken()) ?? null;
      },
    });
  }
  return browserClient;
}
