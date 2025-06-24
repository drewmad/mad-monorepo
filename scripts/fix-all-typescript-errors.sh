#!/bin/bash

# Final TypeScript Fix Script
# Fixes all remaining TypeScript errors

set -e

echo "🔧 Fixing all TypeScript errors..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Fix missing React types in packages/ui
echo -e "${BLUE}1. Installing React types in packages/ui...${NC}"
cd packages/ui
pnpm add -D @types/react @types/react-dom
cd ../..

# 2. Fix missing Storybook types in packages/ui  
echo -e "${BLUE}2. Installing Storybook types...${NC}"
cd packages/ui
pnpm add -D @storybook/react
cd ../..

# 3. Fix missing storybook peer dependency in apps/docs
echo -e "${BLUE}3. Installing storybook in apps/docs...${NC}"
cd apps/docs
pnpm add -D storybook@^8.6.14
cd ../..

# 4. Fix the @db package exports properly
echo -e "${BLUE}4. Fixing @db package exports...${NC}"
cat > packages/db/src/index.ts << 'EOF'
// Export everything from modules
export * from './client';
export * from './project';

// Re-export Database type from types file
export type { Database } from '../types';
EOF

# 5. Ensure types.ts exports Database
echo -e "${BLUE}5. Ensuring Database type is exported...${NC}"
# Check if Database is already exported as a type
if ! grep -q "export type { Database }" packages/db/types.ts && ! grep -q "export interface Database" packages/db/types.ts; then
    # Add export at the end of the file
    echo "" >> packages/db/types.ts
    echo "// Export Database type for use in other packages" >> packages/db/types.ts
    echo "export type { Database };" >> packages/db/types.ts
fi

# 6. Build the db package
echo -e "${BLUE}6. Building @db package...${NC}"
cd packages/db
pnpm build
cd ../..

# 7. Fix all @db imports to use proper type imports
echo -e "${BLUE}7. Fixing Database imports...${NC}"
find apps/web/lib -name "*.ts" -o -name "*.tsx" | while read file; do
    # Change import { Database } to import type { Database }
    sed -i '' "s/import { Database }/import type { Database }/g" "$file" 2>/dev/null || true
    # Change import { type Database } to import type { Database }
    sed -i '' "s/import { type Database }/import type { Database }/g" "$file" 2>/dev/null || true
done

# 8. Clear all TypeScript caches
echo -e "${BLUE}8. Clearing TypeScript caches...${NC}"
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true
find . -name "tsconfig.tsbuildinfo" -type f -delete 2>/dev/null || true
rm -rf .next 2>/dev/null || true

# 9. Reinstall all dependencies
echo -e "${BLUE}9. Reinstalling dependencies...${NC}"
pnpm install

# 10. Run typecheck to see remaining issues
echo -e "${BLUE}10. Running typecheck...${NC}"
if pnpm typecheck; then
    echo -e "${GREEN}✅ All TypeScript errors fixed!${NC}"
else
    echo -e "${YELLOW}⚠️  Some errors remain. Checking for missing files...${NC}"
    
    # List of potentially missing files based on errors
    MISSING_FILES=(
        "apps/web/lib/supabase-server.ts"
        "apps/web/lib/supabase-browser.ts"
        "apps/web/lib/supabase-admin.ts"
        "apps/web/lib/user.ts"
        "apps/web/lib/_utils/validate.ts"
        "apps/web/lib/supabase-provider.tsx"
        "apps/web/actions/projects.ts"
        "apps/web/components/projects/ProjectsGrid.tsx"
        "apps/web/components/projects/ProjectCard.tsx"
        "apps/web/components/directory/DirectoryGrid.tsx"
        "apps/web/components/tasks/TaskTable.tsx"
        "apps/web/components/sidebar/Sidebar.tsx"
        "apps/web/components/sidebar/context.tsx"
        "apps/web/components/header/Header.tsx"
    )
    
    echo ""
    echo "Checking for missing files..."
    for file in "${MISSING_FILES[@]}"; do
        if [ ! -f "$file" ]; then
            echo -e "${YELLOW}  ⚠️  Missing: $file${NC}"
        fi
    done
fi

echo ""
echo -e "${GREEN}Script complete!${NC}"
echo ""
echo "If errors persist:"
echo "1. Check that all files exist in their expected locations"
echo "2. Restart your TypeScript language server (VS Code: Cmd+Shift+P > TypeScript: Restart TS Server)"
echo "3. Run 'pnpm build' to ensure all packages are built"
