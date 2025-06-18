#!/bin/bash

# Import Validation Script
# Checks for common import issues in the monorepo

set -e

echo "🔍 Validating imports..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Check for subpath imports from @ui
echo "Checking for @ui subpath imports..."
if grep -r "from '@ui/" apps/web --include="*.ts" --include="*.tsx" 2>/dev/null; then
    echo -e "${RED}❌ Found subpath imports from @ui package${NC}"
    echo "These should be changed to: import { Component } from '@ui';"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ No @ui subpath imports found${NC}"
fi

# Check for subpath imports from @db
echo "Checking for @db subpath imports..."
if grep -r "from '@db/" apps/web --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "from '@db/types'"; then
    echo -e "${RED}❌ Found subpath imports from @db package${NC}"
    echo "These should be changed to: import { function } from '@db';"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ No @db subpath imports found${NC}"
fi

# Check for dist folder imports
echo "Checking for dist folder imports..."
if grep -r "from '@[^']*\/dist\/" apps/web --include="*.ts" --include="*.tsx" 2>/dev/null; then
    echo -e "${RED}❌ Found imports from dist folders${NC}"
    echo "These should import from the package root instead"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ No dist folder imports found${NC}"
fi

# Check if all @ui exports are in index.ts
echo "Checking @ui package exports..."
UI_COMPONENTS=$(find packages/ui/src -name "*.tsx" -not -name "index.ts" -not -name "*.stories.tsx" | sed 's/.*\///' | sed 's/\.tsx$//')
for component in $UI_COMPONENTS; do
    if ! grep -q "export.*from.*['\"]\./$component" packages/ui/src/index.ts; then
        echo -e "${YELLOW}⚠️  Component $component might not be exported from @ui index${NC}"
    fi
done

# Check transpilePackages in next.config.js
echo "Checking Next.js transpilePackages..."
if ! grep -q "transpilePackages.*@ui" apps/web/next.config.js; then
    echo -e "${RED}❌ @ui not found in transpilePackages${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ @ui found in transpilePackages${NC}"
fi

if ! grep -q "transpilePackages.*@db" apps/web/next.config.js; then
    echo -e "${RED}❌ @db not found in transpilePackages${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ @db found in transpilePackages${NC}"
fi

# Check tsconfig paths
echo "Checking TypeScript path mappings..."
if ! grep -q '"@ui"' apps/web/tsconfig.json; then
    echo -e "${RED}❌ @ui path mapping not found in tsconfig.json${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ @ui path mapping found${NC}"
fi

# Summary
echo ""
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 All import validations passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS import issues${NC}"
    echo "Please fix these issues before deploying"
    exit 1
fi