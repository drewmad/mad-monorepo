# Mad Engineering Monorepo

A production‑ready Turbo‐repo powered stack:

- **Next.js 14 (App Router, RSC, TypeScript)**
- **Supabase (PostgreSQL, Auth, RLS)**
- **Typed API Route Handlers**
- **Storybook‑driven Docs**
- **Vitest + Playwright tests**
- **Turbo + PNPM + Vercel**

## Usage

1. **Clone & install**
   ```bash
   git clone https://github.com/your-org/mad-monorepo.git
   cd mad-monorepo
   pnpm install
   ```

2. **Supabase local dev**

   ```bash
   supabase start
   ./scripts/seed-local.sh          # runs migrations + seeds
   pnpm dev                         # Turbo: web, api, docs
   ```

3. **Refresh KPI materialized view**

   ```bash
   supabase db query < scripts/refresh-mv.sql
   ```

4. **Testing**

   ```bash
   pnpm test              # unit + e2e (if CI_E2E not false)
   CI_E2E=false pnpm test # skip e2e
   ```

5. **Deploy**

   ```bash
   vercel link
   vercel env pull .env
   vercel --prod
   ``` 