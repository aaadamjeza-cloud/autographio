import type { PersonCategory } from "@/lib/mockData/persons";

// Stands in for a Wikimedia Commons portrait until one is sourced (with
// author/license/source) for this person — a simple silhouette (rather than
// initials) on a flat neutral-gray circle, distinguished only by gender
// (see MockPerson.gender) since that's the one thing we can say about
// someone's look without guessing at their actual appearance. Same head for
// both; the body shape is what reads as gendered (straight shoulders vs. a
// flared silhouette) — the same visual shorthand as standard restroom
// pictograms, chosen because it stays legible at avatar sizes where subtler
// cues (e.g. a hair silhouette) blur into noise.
// TODO(design): swap real, license-checked Wikimedia Commons portraits in
// for the persons still on this placeholder (see lib/mockData/persons.ts —
// `portrait` is unset for most entries) once they're sourced; this is a
// deliberately neutral stand-in, not a finished illustration style.
export default function PersonAvatar({
  gender,
  size = 72,
}: {
  name: string;
  category: PersonCategory;
  gender: "m" | "f";
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--panel-2)",
        flexShrink: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 24 24" fill="var(--ink-muted)" fillOpacity="0.9">
        <circle cx="12" cy="7.6" r="3.8" />
        {gender === "f" ? (
          <path d="M12 13.2c-1.3 0-2.5.5-3.3 1.4L4.8 21.6h14.4l-3.9-7C14.5 13.7 13.3 13.2 12 13.2Z" />
        ) : (
          <path d="M4.3 21.6c0-4.3 3.4-7.8 7.7-7.8s7.7 3.5 7.7 7.8" />
        )}
      </svg>
    </div>
  );
}
