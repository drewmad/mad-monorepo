#!/bin/bash

# Check which files exist and which are missing

echo "🔍 Checking file structure..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Files that should exist based on the errors
FILES_TO_CHECK=(
    # Lib files
    "apps/web/lib/supabase-server.ts"
    "apps/web/lib/supabase-browser.ts"
    "apps/web/lib/supabase-admin.ts"
    "apps/web/lib/user.ts"
    "apps/web/lib/_utils/validate.ts"
    "apps/web/lib/supabase-provider.tsx"
    
    # Action files
    "apps/web/actions/projects.ts"
    
    # Component files
    "apps/web/components/projects/ProjectsGrid.tsx"
    "apps/web/components/projects/ProjectCard.tsx"
    "apps/web/components/projects/index.ts"
    "apps/web/components/directory/DirectoryGrid.tsx"
    "apps/web/components/directory/MemberCard.tsx"
    "apps/web/components/tasks/TaskTable.tsx"
    "apps/web/components/sidebar/Sidebar.tsx"
    "apps/web/components/sidebar/context.tsx"
    "apps/web/components/header/Header.tsx"
    
    # Package files
    "packages/db/src/index.ts"
    "packages/db/types.ts"
    "packages/ui/src/index.ts"
)

echo "Checking required files..."
echo ""

MISSING_COUNT=0
for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ Found: $file${NC}"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
        MISSING_COUNT=$((MISSING_COUNT + 1))
    fi
done

echo ""
echo "Summary: $MISSING_COUNT files missing"

# Check if dist directory exists for @mad/db
if [ -d "packages/db/dist" ]; then
    echo -e "${GREEN}✅ @mad/db package is built${NC}"
else
    echo -e "${YELLOW}⚠️  @mad/db package needs to be built${NC}"
fi

# Check current directory structure
echo ""
echo "Current structure of key directories:"
echo ""
echo "apps/web/lib:"
ls -la apps/web/lib/ 2>/dev/null || echo "  Directory not found"
echo ""
echo "apps/web/components:"
ls -la apps/web/components/ 2>/dev/null || echo "  Directory not found"
echo ""
echo "packages/db/src:"
ls -la packages/db/src/ 2>/dev/null || echo "  Directory not found"
