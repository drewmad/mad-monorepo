#!/bin/bash

# Comprehensive validation script
# Runs imports, typecheck, and lint validation

set -e

echo "🔍 Running comprehensive validation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# 1. Import validation
echo "📦 Validating imports..."
if ! pnpm validate:imports; then
    echo -e "${RED}❌ Import validation failed${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Import validation passed${NC}"
fi

# 2. TypeScript checking
echo "🔍 Running TypeScript checks..."
if ! pnpm typecheck; then
    echo -e "${RED}❌ TypeScript validation failed${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ TypeScript validation passed${NC}"
fi

# 3. Linting
echo "🔧 Running linting..."
if ! pnpm lint; then
    echo -e "${RED}❌ Linting failed${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Linting passed${NC}"
fi

# Summary
echo ""
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 All validations passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS validation issues${NC}"
    echo "Please fix these issues before proceeding"
    exit 1
fi