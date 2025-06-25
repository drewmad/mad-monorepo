# Mad Engineering Monorepo

A production‑ready Turbo‐repo powered stack:

- **Next.js 14 (App Router, RSC, TypeScript)**
- **Supabase (PostgreSQL, Auth, RLS)**
- **Typed API Route Handlers**
- **Storybook‑driven Docs**
- **Vitest + Playwright tests**
- **Turbo + PNPM + Vercel**

## Quick Start

1. **Clone & setup**
   ```bash
   git clone https://github.com/your-org/mad-monorepo.git
   cd mad-monorepo
   ./scripts/setup/setup.sh        # automated setup
   ```

2. **Development**
   ```bash
   supabase start
   ./scripts/db/seed-local.sh       # database setup
   pnpm dev                         # start development
   ```

3. **Validation & Deployment**
   ```bash
   ./scripts/validate.sh --deploy   # pre-deployment checks
   vercel --prod                    # deploy to production
   ```

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[Setup Guide](./docs/setup/environment.md)** - Environment configuration
- **[AI Agents](./docs/development/ai-agents.md)** - Working with AI assistants
- **[Deployment](./docs/deployment/checklist.md)** - Deployment procedures
- **[Supabase Integration](./docs/integrations/supabase.md)** - Database setup
- **[Scripts](./scripts/README.md)** - Automation scripts

## 🛠️ Scripts

The [`scripts/`](./scripts/) directory contains organized automation tools:

```bash
# TypeScript fixes
./scripts/fix-typescript.sh --comprehensive

# Validation
./scripts/validate.sh --all
./scripts/validate.sh --deploy

# Database operations
./scripts/db/seed-local.sh
./scripts/db/test-supabase.ts

# Setup
./scripts/setup/setup.sh
```

## 🧪 Testing

```bash
pnpm test              # unit + e2e tests
CI_E2E=false pnpm test # skip e2e tests
pnpm typecheck         # TypeScript validation
pnpm lint              # code linting
``` 