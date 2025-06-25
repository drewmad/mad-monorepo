# AI Agent Guidelines - Mad Engineering Monorepo

## 🎯 Core Directive

You are working on a **pnpm workspace monorepo** using **Next.js 14**, **Supabase**, and **TypeScript**. Prioritize code quality, type safety, and monorepo best practices.

## 🏗️ Architecture Overview

```
mad-monorepo/
├── apps/
│   ├── web/          # Next.js 14 app (main application)
│   └── docs/         # Storybook documentation
├── packages/
│   ├── ui/           # React components (transpiled by Next.js)
│   └── db/           # Database types & client (built package)
└── scripts/          # Automation scripts
```

## 📋 Critical Rules

### 1. **Import Discipline** (MOST IMPORTANT)

```typescript
// ✅ CORRECT - Always import from package root
import { Button, Card, Input } from '@ui';
import { createClient, Project } from '@mad/db';

// ❌ WRONG - Never use subpath imports
import { Button } from '@ui/Button';
import { createClient } from '@mad/db/client';
```

### 2. **Package Resolution**

- `@ui` → `packages/ui/src/index.ts` (transpiled by Next.js)
- `@mad/db` → `packages/db/src/index.ts` (requires build)
- Always export new components from package index files

### 3. **Type Safety**

```typescript
// Always use type imports for types
import type { Database } from '@mad/db';
import type { FC, ReactNode } from 'react';

// Never import runtime values as types
import { Database } from '@mad/db'; // ❌ Wrong if Database is a type
```

## 🛠️ Development Workflow

### Before Making Changes

1. **Validate current state**: `pnpm validate:all`
2. **Check for existing components**: Look in `packages/ui/src/`
3. **Understand the data model**: Check `packages/db/types.ts`

### When Adding Features

#### New UI Component

```bash
1. Create: packages/ui/src/NewComponent.tsx
2. Export: Add to packages/ui/src/index.ts
3. Import: import { NewComponent } from '@ui';
4. No build needed (transpilePackages handles it)
```

#### New Database Function

```bash
1. Create: packages/db/src/newFeature.ts
2. Export: Add to packages/db/src/index.ts
3. Build: cd packages/db && pnpm build
4. Import: import { newFeature } from '@mad/db';
```

#### New Page/Route

```bash
1. Create: apps/web/app/(protected)/new-page/page.tsx
2. Auth check: const session = await getSession();
3. Use server components by default
4. Client components: 'use client' directive
```

### Error Recovery

#### "Module not found: Can't resolve '@ui'"

```bash
# Check transpilePackages in next.config.js
# Verify component is exported from packages/ui/src/index.ts
# Restart dev server
```

#### "Cannot find module '@mad/db'"

```bash
cd packages/db && pnpm build
# Check if types.ts exports Database type
# Verify paths in tsconfig.json
```

#### TypeScript errors

```bash
pnpm typecheck                    # See all errors
rm -rf .next *.tsbuildinfo       # Clear cache
pnpm install && pnpm build       # Rebuild
```

## 🎨 UI/UX Patterns

### Component Structure

```typescript
// packages/ui/src/Component.tsx
import clsx from 'clsx';
import { forwardRef } from 'react';

export const Component = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'primary' | 'secondary';
  }
>(({ className, variant = 'primary', ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      'base-styles',
      {
        'primary': 'primary-styles',
        'secondary': 'secondary-styles'
      }[variant],
      className
    )}
    {...props}
  />
));
Component.displayName = 'Component';
```

### Server Components (Default)

```typescript
// app/(protected)/page.tsx
import { getSession } from '@/lib/user';
import { listProjects } from '@/actions/projects';

export default async function Page() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const data = await listProjects();
  return <ClientComponent data={data} />;
}
```

### Client Components

```typescript
'use client';
import { useState } from 'react';
import { Button } from '@ui';

export function ClientComponent({ data }) {
  const [state, setState] = useState(data);
  return <Button onClick={() => setState(...)}>Click</Button>;
}
```

## 🗄️ Database Patterns

### Supabase Client Usage

```typescript
// Server-side (recommended)
import { createClient } from '@/lib/supabase-server';
const supabase = createClient();

// Client-side (when necessary)
import { supabaseBrowser } from '@/lib/supabase-browser';
const supabase = supabaseBrowser();

// Admin (API routes only)
import { supabaseAdmin } from '@/lib/supabase-admin';
```

### Type-Safe Queries

```typescript
import type { Database } from '@mad/db';

type Project = Database['public']['Tables']['projects']['Row'];

const { data, error } = await supabase
  .from('projects')
  .select('*, tasks(*)')
  .eq('workspace_id', workspaceId);
```

## 🚀 Deployment Checklist

Before deploying:

```bash
pnpm validate:deploy              # Run all checks
git status                        # No uncommitted changes
cat apps/web/.env.local          # Verify env vars
```

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🐛 Common Patterns & Solutions

### Adding Gemini UI Features

1. **Check if component exists** in `@ui`
2. **Create if missing** with proper exports
3. **Use consistent styling** (Tailwind + clsx)
4. **Follow existing patterns** in codebase

### State Management

- **Server state**: Server components + actions
- **Client state**: useState, useContext
- **Global state**: Context providers in app/providers.tsx
- **URL state**: searchParams, useRouter

### Authentication Flow

```typescript
// 1. Check session
const session = await getSession();

// 2. Protect routes
if (!session) redirect('/sign-in');

// 3. Get user data
const user = session.user.user_metadata;
```

## 📝 Quick Commands

```bash
# Development
pnpm dev                          # Start all services
pnpm build                        # Build all packages
pnpm test                         # Run all tests

# Validation
pnpm validate:all                 # Complete validation
pnpm typecheck                    # TypeScript check
pnpm lint                         # ESLint check

# Fixes
pnpm fix:imports                  # Fix import paths
./scripts/fix-typescript.sh       # Fix TS errors

# Database
supabase start                    # Start local DB
./scripts/seed-local.sh          # Seed database
```

## ⚡ Performance Considerations

1. **Use Server Components by default**
2. **Lazy load Client Components** when possible
3. **Optimize images** with next/image
4. **Minimize client-side state**
5. **Use streaming and Suspense** for better UX

## 🔒 Security Best Practices

1. **Always validate input** (use Zod)
2. **Use Server Actions** for mutations
3. **Implement RLS** in Supabase
4. **Sanitize user content**
5. **Keep secrets server-side**

## 🎯 When in Doubt

1. **Check existing code** for patterns
2. **Validate before committing**: `pnpm validate:all`
3. **Test locally**: `pnpm dev`
4. **Follow TypeScript** - it guides correct usage
5. **Keep imports simple** - always from package root

---

**Remember**: This is a production-grade monorepo. Prioritize maintainability, type safety, and following established patterns over qui
