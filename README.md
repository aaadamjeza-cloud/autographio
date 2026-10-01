# Autographio

Nekomerční koníčkový web pro českou komunitu sběratelů autogramů (s výhledem na zahraničí). Soukromá evidence sbírky, katalog osobností a sledování žádostí o podpis s veřejnou agregovanou statistikou.

Samostatný projekt — nesdílí kód, databázi ani klíče s Monetiem (katalog mincí). Je z něj jen převzatý vzor stacku a designu.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Supabase (Postgres, Auth, Storage) — vlastní projekt, viz `supabase/migrations`
- Hosting: Vercel (nebo Cloudflare Pages)

## Vývoj

```bash
npm run dev
```

Otevři [http://localhost:3000](http://localhost:3000).

## Supabase nastavení

1. Založ nový Supabase projekt (samostatný, nesdílený s Monetiem).
2. Zkopíruj `.env.local.example` do `.env.local` a doplň URL a klíče projektu.
3. Spusť SQL migrace z `supabase/migrations` (v pořadí podle názvu) v SQL editoru Supabase.
4. **Veřejné registrace zatím vypni** v Supabase dashboardu: Authentication → Providers/Settings → "Allow new users to sign up" (nebo ekvivalentní přepínač) → vypnout. Účet pro sebe si založíš ručně (Authentication → Users → Add user), dokud web není otevřený veřejnosti.
5. Zapni Google OAuth provider (Authentication → Providers → Google) a doplň client ID/secret.
6. Vytvoř privátní Storage bucket pro fotky (viz migrace) a ověř, že není veřejný.

## Poznámka k Monetiu

Autographio z Monetia pouze čerpá inspiraci (stack, vzhled, vzory kódu — vždy zkopírované a upravené, nikdy linkované). Monetio zůstává nedotčené, běží ve vlastní složce se svým produkčním provozem.
