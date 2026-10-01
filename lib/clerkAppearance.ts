// Matches app/globals.css's design tokens (see :root there) so Clerk's
// hosted sign-in/sign-up widgets look like part of this app instead of a
// generic third-party embed — same ink/accent colors, pill buttons, 24px
// card radius, Inter-first font stack. Typed structurally against
// ClerkProvider's `appearance` prop rather than importing @clerk/types
// directly (not a direct dependency here, just re-exported transitively).
export const clerkAppearance = {
  variables: {
    colorPrimary: "#09090b", // --ink — matches .btn-primary's black pill
    colorBackground: "#ffffff", // --bg
    colorText: "#09090b", // --ink
    colorTextSecondary: "#71717a", // --ink-3
    colorInputBackground: "#f4f4f5", // --panel-2
    colorInputText: "#09090b", // --ink
    colorDanger: "#a32d2d", // --danger
    colorSuccess: "#16a34a", // --success
    colorNeutral: "#3f3f46", // --ink-2
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    borderRadius: "12px", // matches .field-input
  },
  elements: {
    rootBox: { width: "100%", maxWidth: 380 },
    card: {
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02)",
      border: "1px solid #e4e4e7", // --line
      borderRadius: "24px", // --radius
      padding: "32px",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 900,
      letterSpacing: "-0.02em",
      color: "#09090b",
    },
    headerSubtitle: {
      fontSize: 14,
      color: "#71717a",
    },
    formFieldLabel: {
      fontSize: 13,
      fontWeight: 700,
      color: "#3f3f46",
    },
    formFieldInput: {
      borderColor: "#d4d4d8", // --line-strong
      "&:focus": { borderColor: "#0e86a8" }, // --accent
    },
    formButtonPrimary: {
      fontSize: 15,
      fontWeight: 700,
      textTransform: "none",
      borderRadius: "999px", // --radius-pill
      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
      "&:hover": { backgroundColor: "#27272a" },
      "&:focus": { boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)" },
    },
    socialButtonsBlockButton: {
      borderRadius: "999px", // --radius-pill
      borderColor: "#d4d4d8", // --line-strong
      fontWeight: 700,
    },
    footerActionLink: {
      color: "#0e86a8", // --accent
      fontWeight: 700,
    },
    identityPreviewEditButton: {
      color: "#0e86a8", // --accent
    },
    dividerLine: { backgroundColor: "#e4e4e7" }, // --line
    dividerText: { color: "#71717a" }, // --ink-3
  },
};
