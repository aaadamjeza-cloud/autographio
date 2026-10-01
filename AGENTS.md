<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules — Autographio

- Standalone project. Never read, write, or run state-changing commands in
  `/Users/aaadamjeza/monetio` (production app with paid ads running). Read-only
  reference only; copy and adapt code, never link/import from it.
- Code and identifiers in English; all user-facing UI text goes through i18n
  files (`cs`, `en`, `sk`, `fr` — see `lib/i18n/`) — no hardcoded UI strings.
- RLS is enabled on every table from the start. Users see/modify only their
  own rows. `persons` and `price_reports` are publicly readable only where
  `status = 'approved'`.
- Never expose a user's email or Google profile name publicly — public display
  name comes only from `profiles.display_name`.
- Database migrations live as plain SQL files in `supabase/migrations/`,
  applied manually in the Supabase SQL editor — never run destructive SQL
  without explicit confirmation.
- Photo uploads go to a private Storage bucket at `{user_id}/{item_id}/...`;
  never proxy or store hotlinked external images server-side.

