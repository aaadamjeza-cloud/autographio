"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

// Intermediate technical hop the OAuth provider redirects back to after
// Google sign-in/sign-up — never seen as a real page (it immediately
// forwards to wherever the flow was headed), so it's the one spot left
// using a Clerk-provided component instead of our own UI.
export default function SsoCallbackPage() {
  return <AuthenticateWithRedirectCallback />;
}
