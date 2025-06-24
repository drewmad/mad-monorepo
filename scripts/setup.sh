#!/bin/bash

# Project Setup Script
# Initializes the development environment

set -e

echo "🛠️  Setting up development environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x scripts/*.sh

# Setup git hooks
echo "🪝 Setting up git hooks..."
pnpm prepare

# Build packages
echo "🏗️  Building packages..."
pnpm build

# Run initial validation
echo "✅ Running initial validation..."
pnpm lint
pnpm typecheck

echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "Available commands:"
echo "  pnpm dev              - Start development servers"
echo "  pnpm build            - Build all packages"
echo "  pnpm lint             - Run linting"
echo "  pnpm test             - Run tests"
echo "  pnpm validate:deploy  - Validate deployment readiness"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Copy .env.example to .env.local and fill in your values"
echo "2. Run 'pnpm dev' to start development"
echo "3. Visit http://localhost:3000" 
