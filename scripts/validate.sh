#!/bin/bash

# Consolidated Validation Script
# Usage: ./scripts/validate.sh [--all|--deploy|--imports|--files]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default to all if no argument provided
MODE="all"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --all)
            MODE="all"
            shift
            ;;
        --deploy)
            MODE="deploy"
            shift
            ;;
        --imports)
            MODE="imports"
            shift
            ;;
        --files)
            MODE="files"
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --all        Run comprehensive validation (default)"
            echo "  --deploy     Run deployment-specific validation"
            echo "  --imports    Validate import statements"
            echo "  --files      Check file structure"
            echo "  -h, --help   Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo -e "${BLUE}🔍 Running validation (mode: $MODE)...${NC}"

ERRORS=0

# Validation functions
validate_imports() {
    echo -e "${BLUE}Validating imports...${NC}"
    local local_errors=0
    
    # Check for subpath imports from @ui
    echo "Checking for @ui subpath imports..."
    if grep -r "from '@ui/" apps/web --include="*.ts" --include="*.tsx" 2>/dev/null; then
        echo -e "${RED}❌ Found subpath imports from @ui package${NC}"
        echo "These should be changed to: import { Component } from '@ui';"
        local_errors=$((local_errors + 1))
    else
        echo -e "${GREEN}✅ No @ui subpath imports found${NC}"
    fi
    
    # Check for subpath imports from @mad/db
    echo "Checking for @mad/db subpath imports..."
    if grep -r "from '@mad/db/" apps/web --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "from '@mad/db/types'"; then
        echo -e "${RED}❌ Found subpath imports from @mad/db package${NC}"
        echo "These should be changed to: import { function } from '@mad/db';"
        local_errors=$((local_errors + 1))
    else
        echo -e "${GREEN}✅ No @mad/db subpath imports found${NC}"
    fi
    
    # Check for dist folder imports
    echo "Checking for dist folder imports..."
    if grep -r "from '@[^']*\/dist\/" apps/web --include="*.ts" --include="*.tsx" 2>/dev/null; then
        echo -e "${RED}❌ Found imports from dist folders${NC}"
        echo "These should import from the package root instead"
        local_errors=$((local_errors + 1))
    else
        echo -e "${GREEN}✅ No dist folder imports found${NC}"
    fi
    
    # Check if all @ui exports are in index.ts
    echo "Checking @ui package exports..."
    if [ -f "packages/ui/src/index.ts" ]; then
        UI_COMPONENTS=$(find packages/ui/src -name "*.tsx" -not -name "index.ts" -not -name "*.stories.tsx" 2>/dev/null | sed 's/.*\///' | sed 's/\.tsx$//' || true)
        for component in $UI_COMPONENTS; do
            if ! grep -q "export.*from.*['\"]\./$component" packages/ui/src/index.ts 2>/dev/null; then
                echo -e "${YELLOW}⚠️  Component $component might not be exported from @ui index${NC}"
            fi
        done
    fi
    
    # Check transpilePackages in next.config.js
    echo "Checking Next.js transpilePackages..."
    if [ -f "apps/web/next.config.js" ]; then
        if ! grep -q "transpilePackages.*@ui" apps/web/next.config.js; then
            echo -e "${RED}❌ @ui not found in transpilePackages${NC}"
            local_errors=$((local_errors + 1))
        else
            echo -e "${GREEN}✅ @ui found in transpilePackages${NC}"
        fi
        
        if ! grep -q "transpilePackages.*@mad/db" apps/web/next.config.js; then
            echo -e "${RED}❌ @mad/db not found in transpilePackages${NC}"
            local_errors=$((local_errors + 1))
        else
            echo -e "${GREEN}✅ @mad/db found in transpilePackages${NC}"
        fi
    fi
    
    # Check tsconfig paths
    echo "Checking TypeScript path mappings..."
    if [ -f "apps/web/tsconfig.json" ]; then
        if ! grep -q '"@ui"' apps/web/tsconfig.json; then
            echo -e "${RED}❌ @ui path mapping not found in tsconfig.json${NC}"
            local_errors=$((local_errors + 1))
        else
            echo -e "${GREEN}✅ @ui path mapping found${NC}"
        fi
    fi
    
    if [ $local_errors -eq 0 ]; then
        echo -e "${GREEN}✅ Import validation passed${NC}"
    else
        echo -e "${RED}❌ Import validation failed with $local_errors issues${NC}"
    fi
    
    return $local_errors
}

validate_typescript() {
    echo -e "${BLUE}Running TypeScript checks...${NC}"
    if ! pnpm typecheck; then
        echo -e "${RED}❌ TypeScript validation failed${NC}"
        return 1
    else
        echo -e "${GREEN}✅ TypeScript validation passed${NC}"
        return 0
    fi
}

validate_linting() {
    echo -e "${BLUE}Running linting...${NC}"
    if ! pnpm lint; then
        echo -e "${RED}❌ Linting failed${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Linting passed${NC}"
        return 0
    fi
}

validate_builds() {
    echo -e "${BLUE}Testing package builds...${NC}"
    local local_errors=0
    
    # Build @mad/db package
    echo "Building @mad/db package..."
    cd packages/db
    if ! pnpm build; then
        echo -e "${RED}❌ @mad/db package build failed${NC}"
        local_errors=$((local_errors + 1))
    else
        echo -e "${GREEN}✅ @mad/db package build passed${NC}"
    fi
    cd ../..
    
    # Build web app
    echo "Building web app..."
    cd apps/web
    if ! pnpm build; then
        echo -e "${RED}❌ Web app build failed${NC}"
        local_errors=$((local_errors + 1))
    else
        echo -e "${GREEN}✅ Web app build successful${NC}"
    fi
    cd ../..
    
    return $local_errors
}

check_files() {
    echo -e "${BLUE}Checking file structure...${NC}"
    
    # Files that should exist
    FILES_TO_CHECK=(
        "apps/web/lib/supabase-server.ts"
        "apps/web/lib/supabase-browser.ts"
        "apps/web/lib/supabase-admin.ts"
        "apps/web/lib/user.ts"
        "apps/web/lib/_utils/validate.ts"
        "apps/web/lib/supabase-provider.tsx"
        "apps/web/actions/projects.ts"
        "apps/web/components/projects/ProjectsGrid.tsx"
        "apps/web/components/projects/ProjectCard.tsx"
        "apps/web/components/projects/index.ts"
        "apps/web/components/directory/DirectoryGrid.tsx"
        "apps/web/components/directory/MemberCard.tsx"
        "apps/web/components/tasks/TaskTable.tsx"
        "apps/web/components/sidebar/Sidebar.tsx"
        "apps/web/components/sidebar/context.tsx"
        "apps/web/components/header/Header.tsx"
        "packages/db/src/index.ts"
        "packages/db/types.ts"
        "packages/ui/src/index.ts"
    )
    
    echo "Checking required files..."
    local missing_count=0
    for file in "${FILES_TO_CHECK[@]}"; do
        if [ -f "$file" ]; then
            echo -e "${GREEN}✅ Found: $file${NC}"
        else
            echo -e "${RED}❌ Missing: $file${NC}"
            missing_count=$((missing_count + 1))
        fi
    done
    
    echo ""
    echo "Summary: $missing_count files missing"
    
    # Check if dist directory exists for @mad/db
    if [ -d "packages/db/dist" ]; then
        echo -e "${GREEN}✅ @mad/db package is built${NC}"
    else
        echo -e "${YELLOW}⚠️  @mad/db package needs to be built${NC}"
    fi
    
    return $missing_count
}

# Mode-specific execution
case $MODE in
    all)
        echo -e "${YELLOW}Running comprehensive validation...${NC}"
        
        validate_imports
        ERRORS=$((ERRORS + $?))
        
        validate_typescript
        ERRORS=$((ERRORS + $?))
        
        validate_linting
        ERRORS=$((ERRORS + $?))
        ;;
        
    deploy)
        echo -e "${YELLOW}Running deployment validation...${NC}"
        
        validate_imports
        ERRORS=$((ERRORS + $?))
        
        validate_builds
        ERRORS=$((ERRORS + $?))
        
        # TypeScript validation per app (more targeted)
        echo -e "${BLUE}Validating TypeScript in web app...${NC}"
        cd apps/web
        if ! npx tsc --noEmit; then
            echo -e "${RED}❌ Web app TypeScript validation failed${NC}"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${GREEN}✅ Web app TypeScript validation passed${NC}"
        fi
        cd ../..
        
        # Linting for web app
        echo -e "${BLUE}Running web app linting...${NC}"
        cd apps/web
        if ! pnpm lint; then
            echo -e "${RED}❌ Web app linting failed${NC}"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${GREEN}✅ Web app linting passed${NC}"
        fi
        cd ../..
        ;;
        
    imports)
        echo -e "${YELLOW}Running import validation...${NC}"
        validate_imports
        ERRORS=$((ERRORS + $?))
        ;;
        
    files)
        echo -e "${YELLOW}Running file structure check...${NC}"
        check_files
        ERRORS=$((ERRORS + $?))
        ;;
esac

# Summary
echo ""
echo -e "${BLUE}================== VALIDATION SUMMARY ==================${NC}"

if [ $ERRORS -eq 0 ]; then
    case $MODE in
        all)
            echo -e "${GREEN}🎉 All validations passed!${NC}"
            echo "✅ Import validation: PASSED"
            echo "✅ TypeScript validation: PASSED"
            echo "✅ Linting: PASSED"
            ;;
        deploy)
            echo -e "${GREEN}🎉 All deployment validations passed!${NC}"
            echo -e "${GREEN}✅ Ready for deployment${NC}"
            echo "✅ Import validation: PASSED"
            echo "✅ Package builds: PASSED"
            echo "✅ Web app TypeScript: PASSED"
            echo "✅ Web app linting: PASSED"
            ;;
        imports)
            echo -e "${GREEN}🎉 Import validation passed!${NC}"
            ;;
        files)
            echo -e "${GREEN}🎉 File structure check completed!${NC}"
            ;;
    esac
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS validation issues${NC}"
    echo ""
    case $MODE in
        deploy)
            echo "Issues found that need to be fixed before deployment:"
            ;;
        *)
            echo "Issues found that need to be addressed:"
            ;;
    esac
    echo "- Check the output above for specific errors"
    echo "- Run './scripts/fix-typescript.sh' if you have TypeScript issues"
    echo "- Run with '--help' to see available validation modes"
    exit 1
fi 