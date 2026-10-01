import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Built on Next's own ImageResponse (no extra dependency, no design asset
// to source) — same signature-stroke motif as the hero, at share-card scale.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          background: "#ffffff",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 900, letterSpacing: "-0.03em", color: "#09090b" }}>
          {SITE_NAME.toLowerCase()}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "#09090b",
            marginTop: 28,
            maxWidth: 920,
          }}
        >
          Autogramy, které máš. Na které čekáš.
        </div>
        <svg width="230" height="68" viewBox="0 0 240 70" fill="none" style={{ marginTop: 20 }}>
          <path
            d="M8 54 C 12 30, 18 10, 30 8 C 40 6, 46 20, 42 34 C 40 41, 33 38, 35 30 C 37 23, 45 22, 49 34 C 52 43, 54 50, 58 54 C 66 47, 72 35, 82 38 C 92 41, 87 56, 97 58 C 107 60, 111 44, 123 36 C 133 29, 143 32, 147 44 C 149 51, 141 58, 149 60 C 161 63, 182 56, 202 46 C 211 41, 219 42, 225 48 C 229 52, 225 57, 219 55"
            stroke="#0e86a8"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ display: "flex", fontSize: 32, fontWeight: 500, color: "#3f3f46", marginTop: 24 }}>
          Sbírka, žádosti o podpis a ceny na jednom místě. Zdarma.
        </div>
      </div>
    ),
    { ...size }
  );
}
