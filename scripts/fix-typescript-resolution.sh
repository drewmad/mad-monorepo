#!/bin/bash

# Fix TypeScript resolution issues

set -e

echo "🔧 Fixing TypeScript resolution..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Helper for portable in-place sed
sedi() {
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' "$@"
  else
    sed -i "$@"
  fi
}

# 1. Update the root tsconfig.json to include path mappings
echo -e "${BLUE}1. Updating root tsconfig.json...${NC}"
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "types": ["node"],
    "baseUrl": ".",
    "paths": {
      "@ui": ["packages/ui/src/index.ts"],
      "@ui/*": ["packages/ui/src/*"],
      "@db": ["packages/db/src/index.ts"],
      "@db/*": ["packages/db/src/*"]
    }
  },
  "include": ["apps", "packages", "config"],
  "exclude": ["node_modules", "dist", ".next", ".turbo"]
}
EOF

# 2. Update apps/web/tsconfig.json to extend properly
echo -e "${BLUE}2. Updating apps/web/tsconfig.json...${NC}"
cat > apps/web/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@ui": ["../../packages/ui/src/index.ts"],
      "@ui/*": ["../../packages/ui/src/*"],
      "@db": ["../../packages/db/src/index.ts"],
      "@db/*": ["../../packages/db/src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# 3. Install Storybook types in packages/ui
echo -e "${BLUE}3. Installing Storybook types...${NC}"
cd packages/ui
pnpm add -D @storybook/react
cd ../..

# 4. Fix the imports in API routes - they're looking for functions that don't exist
echo -e "${BLUE}4. Fixing API route imports...${NC}"

# Update apps/web/app/api/projects/route.ts
cat > apps/web/app/api/projects/route.ts << 'EOF'
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validate } from '@/lib/_utils/validate';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const createSchema = z.object({
    workspace_id: z.string().uuid(),
    name: z.string().min(1),
    status: z.string().optional(),
    progress: z.number().min(0).max(100).optional(),
    budget: z.number().min(0).optional()
});

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const supabase = supabaseAdmin();
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspace_id');

    if (!workspaceId) {
        return NextResponse.json(
            { message: 'workspace_id query param required' },
            { status: 400 }
        );
    }

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('workspace_id', workspaceId);

    if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    const supabase = supabaseAdmin();
    const body = await req.json();
    const res = validate(createSchema, body);

    if (!res.success) {
        return res.error;
    }

    const { data, error } = await supabase
        .from('projects')
        .insert(res.data)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}
EOF

# Update apps/web/app/api/tasks/route.ts
cat > apps/web/app/api/tasks/route.ts << 'EOF'
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validate } from '@/lib/_utils/validate';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const createSchema = z.object({
    project_id: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    status: z.enum(['Todo', 'In progress', 'Completed']).optional(),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    assignee: z.string().uuid().nullable().optional(),
    due_date: z.string().datetime().nullable().optional(),
    time_tracked: z.number().min(0).optional()
});

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const supabase = supabaseAdmin();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('project_id');

    if (!projectId) {
        return NextResponse.json(
            { message: 'project_id query param required' },
            { status: 400 }
        );
    }

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId);

    if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    const supabase = supabaseAdmin();
    const body = await req.json();
    const res = validate(createSchema, body);

    if (!res.success) {
        return res.error;
    }

    const { data, error } = await supabase
        .from('tasks')
        .insert(res.data)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}
EOF

# 5. Fix actions/projects.ts import
echo -e "${BLUE}5. Fixing actions/projects.ts...${NC}"
sedi "s/import { createClient } from '@\/lib\/supabase-server';/import { supabaseServer } from '@\/lib\/supabase-server';/" apps/web/actions/projects.ts

# 6. Clear TypeScript cache
echo -e "${BLUE}6. Clearing TypeScript cache...${NC}"
find . -name "*.tsbuildinfo" -delete
rm -rf apps/web/.next
rm -rf .turbo

# 7. Test from the web app directory
echo -e "${BLUE}7. Testing TypeScript from apps/web...${NC}"
cd apps/web
npx tsc --noEmit
cd ../..

echo -e "${GREEN}✅ TypeScript resolution fixed!${NC}"
