#!/bin/bash

# Consolidated TypeScript Fix Script
# Usage: ./scripts/fix-typescript.sh [--comprehensive|--resolution|--all-errors]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default to comprehensive if no argument provided
MODE="comprehensive"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --comprehensive)
            MODE="comprehensive"
            shift
            ;;
        --resolution)
            MODE="resolution"
            shift
            ;;
        --all-errors)
            MODE="all-errors"
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --comprehensive  Run comprehensive TypeScript fixes (default)"
            echo "  --resolution     Fix TypeScript resolution issues"
            echo "  --all-errors     Fix all remaining TypeScript errors"
            echo "  -h, --help       Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo -e "${BLUE}🔧 Running TypeScript fixes (mode: $MODE)...${NC}"

# Common functions
install_dependencies() {
    echo -e "${BLUE}Installing missing dependencies...${NC}"
    
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
    
    # Add Storybook types to packages/ui
    cd packages/ui
    pnpm add -D @storybook/react
    cd ../..
    
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

fix_db_exports() {
    echo -e "${BLUE}Fixing @mad/db package exports...${NC}"
    
    cat > packages/db/src/index.ts << 'EOF'
export * from './client';
export * from './project';
export { type Database } from '../types';
EOF
    
    echo -e "${GREEN}✅ Fixed @mad/db exports${NC}"
}

fix_imports() {
    echo -e "${BLUE}Fixing import statements...${NC}"
    
    # Fix Database type imports
    find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist | xargs sed -i '' 's/import { Database }/import type { Database }/g' 2>/dev/null || true
    
    # Fix @ui subpath imports
    find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist | xargs sed -i '' "s/from '@ui\/[^']*'/from '@ui'/g" 2>/dev/null || true
    
    # Fix @mad/db subpath imports (except types)
    find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist | xargs sed -i '' "s/from '@mad\/db\/client'/from '@mad/db'/g" 2>/dev/null || true
    find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist | xargs sed -i '' "s/from '@mad\/db\/project'/from '@mad/db'/g" 2>/dev/null || true
    
    echo -e "${GREEN}✅ Fixed import statements${NC}"
}

build_packages() {
    echo -e "${BLUE}Building packages...${NC}"
    
    # Build @mad/db package first
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
}

clear_cache() {
    echo -e "${BLUE}Clearing TypeScript cache...${NC}"
    
    find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true
    find . -name "tsconfig.tsbuildinfo" -type f -delete 2>/dev/null || true
    rm -rf .next 2>/dev/null || true
    find . -name "dist" -type d -path "*/packages/*" -exec rm -rf {} + 2>/dev/null || true
    
    echo -e "${GREEN}✅ Cleared TypeScript cache${NC}"
}

reinstall_deps() {
    echo -e "${BLUE}Reinstalling dependencies...${NC}"
    pnpm install --frozen-lockfile
    echo -e "${GREEN}✅ Reinstalled dependencies${NC}"
}

# Mode-specific functions
comprehensive_mode() {
    echo -e "${YELLOW}Running comprehensive TypeScript fixes...${NC}"
    
    install_dependencies
    fix_db_exports
    fix_imports
    build_packages
    clear_cache
    reinstall_deps
    
    # Fix component prop types
    echo -e "${BLUE}Fixing component prop types...${NC}"
    if [ -f "apps/web/components/projects/ProjectsGrid.tsx" ]; then
        sed -i '' 's/projects: Project\[\]/projects?: Project[]/g' apps/web/components/projects/ProjectsGrid.tsx 2>/dev/null || true
    fi
    echo -e "${GREEN}✅ Fixed component prop types${NC}"
}

resolution_mode() {
    echo -e "${YELLOW}Fixing TypeScript resolution issues...${NC}"
    
    # Update the root tsconfig.json
    echo -e "${BLUE}Updating root tsconfig.json...${NC}"
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
      "@mad/db": ["packages/db/src/index.ts"],
      "@mad/db/*": ["packages/db/src/*"]
    }
  },
  "include": ["apps", "packages", "config"],
  "exclude": ["node_modules", "dist", ".next", ".turbo"]
}
EOF
    
    # Update apps/web/tsconfig.json
    echo -e "${BLUE}Updating apps/web/tsconfig.json...${NC}"
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
      "@mad/db": ["../../packages/db/src/index.ts"],
      "@mad/db/*": ["../../packages/db/src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
    
    install_dependencies
    fix_db_exports
    fix_imports
    build_packages
    clear_cache
}

all_errors_mode() {
    echo -e "${YELLOW}Fixing all remaining TypeScript errors...${NC}"
    
    install_dependencies
    fix_db_exports
    
    # Ensure Database type is exported from types.ts
    echo -e "${BLUE}Ensuring Database type is exported...${NC}"
    if ! grep -q "export type { Database }" packages/db/types.ts && ! grep -q "export interface Database" packages/db/types.ts; then
        echo "" >> packages/db/types.ts
        echo "// Export Database type for use in other packages" >> packages/db/types.ts
        echo "export type { Database };" >> packages/db/types.ts
    fi
    
    build_packages
    fix_imports
    clear_cache
    reinstall_deps
    
    # Check for missing files
    echo -e "${BLUE}Checking for missing files...${NC}"
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
    
    for file in "${MISSING_FILES[@]}"; do
        if [ ! -f "$file" ]; then
            echo -e "${YELLOW}  ⚠️  Missing: $file${NC}"
        fi
    done
}

# Run the selected mode
case $MODE in
    comprehensive)
        comprehensive_mode
        ;;
    resolution)
        resolution_mode
        ;;
    all-errors)
        all_errors_mode
        ;;
esac

# Final validation
echo -e "${BLUE}Running final validation...${NC}"
if pnpm typecheck; then
    echo -e "${GREEN}🎉 All TypeScript fixes applied successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Restart your TypeScript server in VS Code (Cmd+Shift+P -> 'TypeScript: Restart TS Server')"
    echo "2. Run 'pnpm build' to ensure everything builds correctly"
    echo "3. Run 'pnpm test' to ensure tests pass"
else
    echo -e "${YELLOW}⚠️  Some TypeScript issues remain. Check the output above.${NC}"
    echo ""
    echo "If you still see errors:"
    echo "1. Restart your TypeScript server in VS Code"
    echo "2. Clear node_modules and reinstall: rm -rf node_modules && pnpm install"
    echo "3. Check for any remaining manual fixes needed"
    echo "4. Run the script with a different mode (--comprehensive, --resolution, --all-errors)"
fi

echo ""
echo -e "${GREEN}TypeScript fix script completed!${NC}" 