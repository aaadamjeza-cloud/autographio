import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server's live-reload (HMR) work when opened from a phone
  // on the same Wi-Fi via this Mac's LAN IP — otherwise Next silently
  // blocks the cross-origin HMR request and the phone never re-fetches
  // after a change (it looks "stuck" on the first-loaded version).
  allowedDevOrigins: ["172.20.10.3"],
};

export default nextConfig;
