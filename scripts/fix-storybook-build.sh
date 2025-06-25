#!/bin/bash

# Ensure Storybook builds correctly in CI
set -e

echo "📚 Building Storybook documentation..."
# Build UI package first
pnpm build --filter=@ui
# Build docs app
pnpm build --filter=@mad/docs
