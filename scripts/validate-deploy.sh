#!/bin/bash

# Deployment Validation Script
# Ensures all requirements are met before deploying

set -e

echo "🚀 Validating deployment readiness..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if pnpm-lock.yaml exists
echo "📦 Checking lockfile..."
if [ ! -f "pnpm-lock.yaml" ]; then
    echo -e "${RED}❌ pnpm-lock.yaml is missing! Run 'pnpm install' first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ pnpm-lock.yaml exists${NC}"

# Check if lockfile is committed
if git status --porcelain | grep -q "pnpm-lock.yaml"; then
    echo -e "${YELLOW}⚠️  pnpm-lock.yaml has uncommitted changes${NC}"
    echo "Please commit the lockfile before deploying"
    exit 1
fi
echo -e "${GREEN}✅ pnpm-lock.yaml is committed${NC}"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Type checking
echo "🔍 Running TypeScript checks..."
pnpm typecheck

# Linting
echo "🔧 Running linting..."
pnpm lint

# Build all packages
echo "🏗️  Building all packages..."
pnpm build

# Check environment variables (for local .env files)
echo "🔐 Checking environment setup..."
if [ -f "apps/web/.env.local" ]; then
    echo -e "${GREEN}✅ Local environment file found${NC}"
else
    echo -e "${YELLOW}⚠️  No .env.local found - make sure Vercel env vars are set${NC}"
fi

# Run tests
echo "🧪 Running tests..."
CI_E2E=false pnpm test

echo -e "${GREEN}🎉 All validation checks passed! Ready to deploy.${NC}"
echo ""
echo "Next steps:"
echo "1. Ensure environment variables are set in Vercel dashboard"
echo "2. Push to main branch to trigger deployment"
echo "3. Monitor deployment in Vercel dashboard" 