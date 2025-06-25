# Scripts Directory

This directory contains automation scripts for the Mad Engineering monorepo, organized by functionality.

## 📁 Directory Structure

```
scripts/
├── ci/                     # CI/CD related scripts
│   ├── ci-build.sh        # CI build optimization
│   └── fix-storybook-build.sh  # Storybook build fixes
├── db/                     # Database related scripts
│   ├── seed-local.sh      # Local database seeding
│   ├── refresh-mv.sql     # Database view refresh
│   └── test-supabase.ts   # Supabase connection testing
├── setup/                  # Environment setup scripts
│   ├── setup.sh          # Initial project setup
│   └── chmod.sh          # File permissions setup
├── fix-typescript.sh      # Consolidated TypeScript fixes
├── validate.sh           # Consolidated validation
└── README.md             # This file
```

## 🔧 Main Scripts

### TypeScript Fixes

**`./scripts/fix-typescript.sh`** - Consolidated TypeScript fix script

```bash
# Run comprehensive fixes (default)
./scripts/fix-typescript.sh

# Fix TypeScript resolution issues
./scripts/fix-typescript.sh --resolution

# Fix all remaining TypeScript errors
./scripts/fix-typescript.sh --all-errors

# Show help
./scripts/fix-typescript.sh --help
```

**What it does:**
- Installs missing dependencies
- Fixes package exports and imports
- Updates TypeScript configuration
- Builds packages in correct order
- Clears TypeScript cache
- Reinstalls dependencies

### Validation

**`./scripts/validate.sh`** - Consolidated validation script

```bash
# Run comprehensive validation (default)
./scripts/validate.sh

# Run deployment-specific validation
./scripts/validate.sh --deploy

# Validate only import statements
./scripts/validate.sh --imports

# Check file structure
./scripts/validate.sh --files

# Show help
./scripts/validate.sh --help
```

**What it validates:**
- Import statement compliance
- TypeScript compilation
- Linting rules
- Package builds
- File structure integrity

## 🏗️ CI/CD Scripts

### `./scripts/ci/ci-build.sh`
Optimizes CI build process with caching and parallel execution.

### `./scripts/ci/fix-storybook-build.sh`
Fixes common Storybook build issues in CI environments.

## 🗄️ Database Scripts

### `./scripts/db/seed-local.sh`
Seeds local development database with test data.

```bash
./scripts/db/seed-local.sh
```

### `./scripts/db/refresh-mv.sql`
SQL script to refresh materialized views.

### `./scripts/db/test-supabase.ts`
Tests Supabase connection and basic operations.

```bash
npx tsx scripts/db/test-supabase.ts
```

## ⚙️ Setup Scripts

### `./scripts/setup/setup.sh`
Initial project setup for new developers.

```bash
./scripts/setup/setup.sh
```

**What it does:**
- Installs dependencies
- Sets up environment variables
- Configures git hooks
- Initializes database
- Runs initial validation

### `./scripts/setup/chmod.sh`
Sets correct file permissions for scripts.

```bash
./scripts/setup/chmod.sh
```

## 🚀 Quick Start Guide

For new developers:

```bash
# 1. Initial setup
./scripts/setup/setup.sh

# 2. Fix any TypeScript issues
./scripts/fix-typescript.sh

# 3. Validate everything is working
./scripts/validate.sh --all

# 4. Ready for development!
```

For deployment preparation:

```bash
# 1. Validate deployment readiness
./scripts/validate.sh --deploy

# 2. Fix any issues found
./scripts/fix-typescript.sh --comprehensive

# 3. Re-validate
./scripts/validate.sh --deploy
```

## 📝 Usage Tips

### Making Scripts Executable

If you get permission errors, make scripts executable:

```bash
chmod +x scripts/fix-typescript.sh
chmod +x scripts/validate.sh
# Or for all scripts:
find scripts -name "*.sh" -exec chmod +x {} \;
```

### Common Workflows

**Before committing:**
```bash
./scripts/validate.sh --imports
./scripts/validate.sh --all
```

**After pulling changes:**
```bash
./scripts/fix-typescript.sh --comprehensive
./scripts/validate.sh --all
```

**Before deployment:**
```bash
./scripts/validate.sh --deploy
```

**Debugging build issues:**
```bash
./scripts/validate.sh --files
./scripts/fix-typescript.sh --resolution
```

## 🔄 Migration from Old Scripts

The following old scripts have been consolidated:

### TypeScript Fixes (now `fix-typescript.sh`)
- ❌ `fix-all-typescript-errors.sh` → ✅ `fix-typescript.sh --all-errors`
- ❌ `fix-typescript-comprehensive.sh` → ✅ `fix-typescript.sh --comprehensive`
- ❌ `fix-typescript-resolution.sh` → ✅ `fix-typescript.sh --resolution`

### Validation (now `validate.sh`)
- ❌ `validate-all.sh` → ✅ `validate.sh --all`
- ❌ `validate-deploy.sh` → ✅ `validate.sh --deploy`
- ❌ `validate-imports.sh` → ✅ `validate.sh --imports`
- ❌ `check-files.sh` → ✅ `validate.sh --files`

## 🛠️ Contributing

When adding new scripts:

1. **Place in appropriate subdirectory** (`ci/`, `db/`, `setup/`)
2. **Make executable** with `chmod +x`
3. **Add documentation** to this README
4. **Follow naming convention** (kebab-case)
5. **Include help text** with `--help` flag
6. **Use consistent colors** for output

### Script Template

```bash
#!/bin/bash

# Script Description
# Usage: ./scripts/category/script-name.sh [OPTIONS]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Help function
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Description of what this script does"
    echo ""
    echo "Options:"
    echo "  -h, --help   Show this help message"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Script logic here
echo -e "${BLUE}Starting script...${NC}"
```

## 📞 Support

If you encounter issues with any scripts:

1. Check the [troubleshooting documentation](../docs/setup/environment.md)
2. Run with `--help` for usage information
3. Contact the development team
4. Open an issue in the repository

---

For more documentation, see the [docs directory](../docs/). 