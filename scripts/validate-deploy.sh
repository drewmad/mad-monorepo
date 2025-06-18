#!/bin/bash

# Deployment Validation Script
# Runs validation checks that are relevant for deployment

set -e

echo "🚀 Running deployment validation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0

# 1. Import validation
echo -e "${BLUE}1. Validating imports...${NC}"
if ! pnpm validate:imports; then
    echo -e "${RED}❌ Import validation failed${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Import validation passed${NC}"
fi

# 2. Build validation - focus on web app and packages
echo -e "${BLUE}2. Testing package builds...${NC}"

# Build @db package
cd packages/db
if ! pnpm build; then
    echo -e "${RED}❌ @db package build failed${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ @db package build passed${NC}"
fi
cd ../..

# Build web app (most important for deployment)
echo -e "${BLUE}3. Testing web app build...${NC}"
cd apps/web
if ! pnpm build; then
    echo -e "${RED}❌ Web app build failed${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Web app build successful${NC}"
fi
cd ../..

# 4. TypeScript validation per app (more targeted)
echo -e "${BLUE}4. Validating TypeScript in web app...${NC}"
cd apps/web
if ! npx tsc --noEmit; then
    echo -e "${RED}❌ Web app TypeScript validation failed${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Web app TypeScript validation passed${NC}"
fi
cd ../..

# 5. Linting
echo -e "${BLUE}5. Running linting...${NC}"
cd apps/web
if ! pnpm lint; then
    echo -e "${RED}❌ Web app linting failed${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Web app linting passed${NC}"
fi
cd ../..

# Summary
echo ""
echo -e "${BLUE}================== DEPLOYMENT VALIDATION SUMMARY ==================${NC}"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 All deployment validations passed!${NC}"
    echo -e "${GREEN}✅ Ready for deployment${NC}"
    echo ""
    echo "✅ Import validation: PASSED"
    echo "✅ @db package build: PASSED" 
    echo "✅ Web app build: PASSED"
    echo "✅ Web app TypeScript: PASSED"
    echo "✅ Web app linting: PASSED"
    echo ""
    echo "Note: Docs/Storybook build skipped (not required for main deployment)"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS deployment issues${NC}"
    echo ""
    echo "Issues found that need to be fixed before deployment:"
    echo "- Check the output above for specific errors"
    echo "- Focus on web app build errors and linting issues"
    exit 1
fi