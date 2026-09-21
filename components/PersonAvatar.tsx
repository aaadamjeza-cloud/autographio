import { CATEGORY_COLORS, type PersonCategory } from "@/lib/mockData/persons";

// Stands in for a Wikimedia Commons portrait until one is sourced (with
// author/license/source) for this person — initials on a category-tinted
// circle, same idea as Monetio's material-based coin avatar.
export default function PersonAvatar({
  name,
  category,
  size = 72,
}: {
  name: string;
  category: PersonCategory;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.36,
        fontWeight: 800,
        color: "#fff",
        background: CATEGORY_COLORS[category],
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
