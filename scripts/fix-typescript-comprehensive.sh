#!/bin/bash

# Comprehensive TypeScript Fix Script
# Fixes all common TypeScript issues in the monorepo

set -e

echo "🔧 Running comprehensive TypeScript fixes..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper for portable in-place sed
sedi() {
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' "$@"
  else
    sed -i "$@"
  fi
}

# 1. Fix @db package exports and types
echo -e "${BLUE}1. Fixing @db package exports...${NC}"

# Update @db index.ts to properly export types
cat > packages/db/src/index.ts << 'EOF'
export * from './client';
export * from './project';
export { type Database } from '../types';
EOF

echo -e "${GREEN}✅ Fixed @db exports${NC}"

# 2. Install missing type dependencies
echo -e "${BLUE}2. Installing missing type dependencies...${NC}"

# Add React types to @ui package
cd packages/ui
pnpm add -D @types/react @types/react-dom
cd ../..

# Add Storybook types if needed
if [ -d "apps/docs/stories" ]; then
    cd apps/docs
    pnpm add -D @storybook/react @storybook/addon-essentials
    cd ../..
fi

echo -e "${GREEN}✅ Installed missing type dependencies${NC}"

# 3. Fix SSR cookie API in supabase-server.ts
echo -e "${BLUE}3. Fixing SSR cookie API...${NC}"

if [ -f "apps/web/lib/supabase-server.ts" ]; then
    # Update to use modern cookie API
    cat > apps/web/lib/supabase-server.ts << 'EOF'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@db'

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
EOF
    echo -e "${GREEN}✅ Fixed SSR cookie API${NC}"
else
    echo -e "${YELLOW}⚠️  supabase-server.ts not found, skipping${NC}"
fi

# 4. Fix import statements
echo -e "${BLUE}4. Fixing import statements...${NC}"

# Fix Database type imports
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist | while read -r file; do
    sedi 's/import { Database }/import type { Database }/g' "$file"
done

# Fix @ui subpath imports
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist | while read -r file; do
    sedi "s/from '@ui\/[^']*'/from '@ui'/g" "$file"
done

# Fix @db subpath imports (except types)
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist | while read -r file; do
    sedi "s/from '@db\/client'/from '@db'/g" "$file"
done
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist | while read -r file; do
    sedi "s/from '@db\/project'/from '@db'/g" "$file"
done

echo -e "${GREEN}✅ Fixed import statements${NC}"

# 5. Fix component prop types
echo -e "${BLUE}5. Fixing component prop types...${NC}"

# Fix ProjectsGrid props if it exists
if [ -f "apps/web/components/projects/ProjectsGrid.tsx" ]; then
    # Make sure props are properly typed with optional values
    sedi 's/projects: Project\[\]/projects?: Project[]/g' apps/web/components/projects/ProjectsGrid.tsx
fi

echo -e "${GREEN}✅ Fixed component prop types${NC}"

# 6. Build packages in correct order
echo -e "${BLUE}6. Building packages...${NC}"

# Build @db package first (it's needed by others)
cd packages/db
pnpm build
cd ../..

# Build @ui package if it has a build script
cd packages/ui
if grep -q '"build"' package.json; then
    pnpm build
fi
cd ../..

echo -e "${GREEN}✅ Built packages${NC}"

# 7. Clear TypeScript cache
echo -e "${BLUE}7. Clearing TypeScript cache...${NC}"

find . -name "*.tsbuildinfo" -delete
find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "dist" -type d -path "*/packages/*" -exec rm -rf {} + 2>/dev/null || true

echo -e "${GREEN}✅ Cleared TypeScript cache${NC}"

# 8. Reinstall dependencies to ensure everything is in sync
echo -e "${BLUE}8. Reinstalling dependencies...${NC}"

pnpm install --frozen-lockfile

echo -e "${GREEN}✅ Reinstalled dependencies${NC}"

# 9. Run validation
echo -e "${BLUE}9. Running validation...${NC}"

if pnpm validate:all; then
    echo -e "${GREEN}🎉 All TypeScript fixes applied successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Restart your TypeScript server in VS Code (Cmd+Shift+P -> 'TypeScript: Restart TS Server')"
    echo "2. Run 'pnpm build' to ensure everything builds correctly"
    echo "3. Run 'pnpm test' to ensure tests pass"
else
    echo -e "${YELLOW}⚠️  Some validation issues remain. Check the output above.${NC}"
    echo ""
    echo "If you still see errors:"
    echo "1. Restart your TypeScript server in VS Code"
    echo "2. Clear node_modules and reinstall: rm -rf node_modules && pnpm install"
    echo "3. Check for any remaining manual fixes needed"
fi

echo ""
echo -e "${GREEN}TypeScript fix script completed!${NC}" 
