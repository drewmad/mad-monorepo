#!/bin/bash

# CI build helper script
set -e

PACKAGE=$1
if [ -z "$PACKAGE" ]; then
  echo "Usage: ci-build.sh <package>"
  exit 1
fi

echo "🔨 Building $PACKAGE..."
pnpm build --filter="$PACKAGE" --cache-dir=.turbo
