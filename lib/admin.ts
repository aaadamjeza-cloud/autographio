import "server-only";

// Who may review pending catalog submissions. There is deliberately no
// admin flag in the database: 0001_init.sql routes every catalog write
// through the service-role client, so the allowlist belongs in the server's
// own environment rather than in a table a signed-in user could read or
// (worse) write. Clerk user ids, comma separated, in ADMIN_USER_IDS.
export function isAdmin(userId: string | null | undefined): boolean {
  if (!userId) return false;
  return (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .includes(userId);
}
